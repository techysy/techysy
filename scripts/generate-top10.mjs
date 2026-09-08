#!/usr/bin/env node
// Generate Star / Commit Top 10 charts (light + dark SVG) for the profile README.
// Data: GitHub API, last 42 days, day buckets in Asia/Shanghai.
// Usage: node scripts/generate-top10.mjs   (token from GITHUB_TOKEN / GH_TOKEN / `gh auth token`)

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OWNER = 'techysy';
const DAYS = 42; // window span
const TOP_N = 10;
const TZ_OFFSET_MS = 8 * 3600 * 1000; // Asia/Shanghai

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function getToken() {
  // GITHUB_TOKEN (Actions 集成令牌) 无法访问 stargazers 端点,需要 PAT
  if (process.env.GH_PAT) return process.env.GH_PAT;
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  try {
    return execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    throw new Error('No token: set GITHUB_TOKEN or authenticate `gh`');
  }
}
const TOKEN = getToken();

async function api(path, { accept = 'application/vnd.github+json' } = {}) {
  const out = [];
  let url = `https://api.github.com${path}${path.includes('?') ? '&' : '?'}per_page=100`;
  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: accept, 'X-GitHub-Api-Version': '2022-11-28' },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}: ${await res.text()}`);
    const page = await res.json();
    out.push(...page);
    const link = res.headers.get('link') || '';
    const next = link.match(/<([^>]+)>;\s*rel="next"/);
    url = next ? next[1] : null;
  }
  return out;
}

// ---- time helpers (Asia/Shanghai day buckets) ----
const DAY_MS = 86400000;
function cstDayStart(date) {
  const shifted = new Date(date.getTime() + TZ_OFFSET_MS);
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()).valueOf() - TZ_OFFSET_MS);
}
function fmt(d, style) {
  const s = new Date(d.getTime() + TZ_OFFSET_MS);
  const y = s.getUTCFullYear(), m = s.getUTCMonth() + 1, dd = s.getUTCDate();
  if (style === 'iso') return `${y}-${String(m).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  return `${m}.${dd}`;
}
function fmtLong(d) {
  const s = new Date(d.getTime() + TZ_OFFSET_MS);
  return `${s.getUTCFullYear()}.${s.getUTCMonth() + 1}.${s.getUTCDate()}`;
}

const todayStart = cstDayStart(new Date()); // CST 00:00 today
const startDay = new Date(todayStart.getTime() - DAYS * DAY_MS);
const points = Array.from({ length: DAYS + 1 }, (_, i) => new Date(startDay.getTime() + i * DAY_MS));
const tomorrowStart = new Date(todayStart.getTime() + DAY_MS);

function cumulativeSeries(timestamps) {
  const inWindow = timestamps.map((t) => new Date(t).getTime()).filter((t) => t >= startDay.getTime() && t < tomorrowStart.getTime());
  return points.map((p) => inWindow.filter((t) => t < p.getTime() + DAY_MS).length);
}

// ---- data collection ----
async function collect() {
  const repos = (await api(`/users/${OWNER}/repos?type=owner&sort=pushed`)).filter((r) => !r.private);
  console.log(`${repos.length} public repos`);

  const starRows = [];
  const commitRows = [];
  for (const repo of repos) {
    let stars = [];
    if (repo.stargazers_count > 0) {
      stars = await api(`/repos/${OWNER}/${repo.name}/stargazers`, { accept: 'application/vnd.github.star+json' });
    }
    const starSeries = cumulativeSeries(stars.map((s) => s.starred_at));
    starRows.push({ name: repo.name, series: starSeries, total: starSeries[DAYS], tiebreak: repo.stargazers_count });

    const commits = await api(
      `/repos/${OWNER}/${repo.name}/commits?author=${OWNER}&since=${startDay.toISOString()}&until=${tomorrowStart.toISOString()}`
    );
    const commitSeries = cumulativeSeries(commits.map((c) => c.commit.author?.date || c.commit.committer?.date));
    commitRows.push({ name: repo.name, series: commitSeries, total: commitSeries[DAYS], tiebreak: 0 });
    console.log(`  ${repo.name}: +${starSeries[DAYS]} stars, +${commitSeries[DAYS]} commits`);
  }

  const pick = (rows) =>
    rows
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total || b.tiebreak - a.tiebreak || a.name.localeCompare(b.name))
      .slice(0, TOP_N);
  return { stars: pick(starRows), commits: pick(commitRows) };
}

// ---- SVG rendering ----
const THEMES = {
  light: {
    bg: '#ffffff', border: '#d0d7de', title: '#1f2328', text: '#1f2328', secondary: '#656d76',
    grid: '#e2e8ee', axis: '#afb8c1', divider: '#eaeef2', accent: '#bf8700', commitIcon: '#8250df',
    palette: ['#cf222e', '#0969da', '#1a7f37', '#bf8700', '#8250df', '#0891b2', '#bf3989', '#bc4c00', '#0a7ea4', '#57606a'],
  },
  dark: {
    bg: '#0d1117', border: '#30363d', title: '#e6edf3', text: '#e6edf3', secondary: '#8b949e',
    grid: '#21262d', axis: '#484f58', divider: '#21262d', accent: '#d29922', commitIcon: '#a371f7',
    palette: ['#f85149', '#58a6ff', '#3fb950', '#d29922', '#a371f7', '#39c5cf', '#db61a2', '#ffa657', '#d4a373', '#8b949e'],
  },
};
const FONT = '-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Noto Sans CJK SC&quot;,&quot;PingFang SC&quot;,&quot;Microsoft YaHei&quot;,Helvetica,Arial,sans-serif';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function niceMax(v) {
  const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000];
  const target = Math.max(4, (v * 1.15) / 4);
  const step = steps.find((s) => s >= target) || Math.ceil(target / 1000) * 1000;
  return step * 4;
}

// Catmull-Rom -> cubic bezier smooth path
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

function starIcon(x, y, r, fill) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${(x + rr * Math.cos(ang)).toFixed(1)},${(y + rr * Math.sin(ang)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}

function commitIcon(x, y, color) {
  return `<g stroke="${color}" stroke-width="4" fill="none"><line x1="${x - 16}" y1="${y}" x2="${x + 16}" y2="${y}"/><circle cx="${x - 16}" cy="${y}" r="7.5"/><circle cx="${x + 16}" cy="${y}" r="7.5"/></g>`;
}

function render(rows, themeName, opts) {
  const t = THEMES[themeName];
  const W = 1600, H = 900;
  const plot = { l: 100, r: 1016, t: 196, b: 776 };
  const maxV = niceMax(Math.max(1, ...rows.map((r) => r.total)));
  const step = maxV / 4;
  const x = (i) => plot.l + (i / DAYS) * (plot.r - plot.l);
  const y = (v) => plot.b - (v / maxV) * (plot.b - plot.t);

  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${esc(opts.ariaLabel)}">`);
  parts.push(`<rect width="${W}" height="${H}" rx="16" fill="${t.bg}"/>`);
  parts.push(`<rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="16" fill="none" stroke="${t.border}" stroke-width="1.5"/>`);

  // header
  if (opts.kind === 'stars') parts.push(starIcon(84, 76, 19, t.accent));
  else parts.push(commitIcon(84, 76, t.commitIcon));
  parts.push(`<text x="118" y="90" font-family="${FONT}" font-size="38" font-weight="700" fill="${t.title}">${esc(opts.title)}</text>`);
  parts.push(`<text x="118" y="128" font-family="${FONT}" font-size="21" fill="${t.secondary}">${fmtLong(startDay)} – ${fmtLong(todayStart)} · @${OWNER} · 最近 ${DAYS} 天</text>`);
  parts.push(`<text x="1536" y="90" font-family="${FONT}" font-size="18" fill="${t.secondary}" text-anchor="end">生成于 ${fmt(todayStart, 'iso')}</text>`);
  parts.push(`<line x1="64" y1="152" x2="1536" y2="152" stroke="${t.divider}" stroke-width="1.5"/>`);

  // grid + y labels
  for (let i = 0; i <= 4; i++) {
    const v = step * i, gy = y(v);
    parts.push(`<line x1="${plot.l}" y1="${gy}" x2="${plot.r}" y2="${gy}" stroke="${t.grid}" stroke-width="1.2"${i ? ' stroke-dasharray="5 5"' : ''}/>`);
    parts.push(`<text x="84" y="${gy + 6}" font-family="${FONT}" font-size="19" fill="${t.secondary}" text-anchor="end">${v}</text>`);
  }
  parts.push(`<text x="${plot.l}" y="180" font-family="${FONT}" font-size="18" fill="${t.secondary}">${esc(opts.unit)}</text>`);

  // x ticks
  for (let i = 0; i <= 6; i++) {
    const idx = Math.round((i * DAYS) / 6), tx = x(idx);
    parts.push(`<line x1="${tx}" y1="${plot.b}" x2="${tx}" y2="${plot.b + 7}" stroke="${t.axis}" stroke-width="1.4"/>`);
    parts.push(`<text x="${tx}" y="${plot.b + 32}" font-family="${FONT}" font-size="19" fill="${t.secondary}" text-anchor="middle">${fmt(points[idx])}</text>`);
  }

  // series
  rows.forEach((row, ri) => {
    const color = t.palette[ri % t.palette.length];
    const pts = row.series.map((v, i) => ({ x: x(i), y: y(v) }));
    parts.push(`<path d="${smoothPath(pts)}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`);
    parts.push(`<circle cx="${x(DAYS)}" cy="${y(row.total)}" r="5" fill="${color}"/>`);
  });

  // ranking panel
  parts.push(`<text x="1088" y="180" font-family="${FONT}" font-size="20" font-weight="600" fill="${t.secondary}">排名</text>`);
  const rowH = 56, top0 = 200;
  rows.forEach((row, ri) => {
    const color = t.palette[ri % t.palette.length];
    const cy = top0 + ri * rowH;
    if (ri > 0) parts.push(`<line x1="1088" y1="${cy - 8}" x2="1528" y2="${cy - 8}" stroke="${t.divider}" stroke-width="1"/>`);
    parts.push(`<text x="1112" y="${cy + 28}" font-family="${FONT}" font-size="20" fill="${t.secondary}" text-anchor="end">${ri + 1}</text>`);
    parts.push(`<circle cx="1144" cy="${cy + 22}" r="7" fill="${color}"/>`);
    const name = row.name.length > 22 ? row.name.slice(0, 21) + '…' : row.name;
    parts.push(`<text x="1166" y="${cy + 29}" font-family="${FONT}" font-size="21" fill="${t.text}">${esc(name)}</text>`);
    parts.push(`<text x="1520" y="${cy + 30}" font-family="${FONT}" font-size="23" font-weight="700" fill="${color}" text-anchor="end">${row.total}</text>`);
  });

  parts.push(`<text x="800" y="866" font-family="${FONT}" font-size="16" fill="${t.secondary}" text-anchor="middle">数据来自 GitHub API · 仅统计公开仓库 · 每日自动更新</text>`);
  parts.push('</svg>');
  return parts.join('\n');
}

// ---- main ----
const data = await collect();
const meta = {
  stars: { kind: 'stars', title: 'Star Top 10', unit: 'Stars', ariaLabel: `Star Top 10, last ${DAYS} days` },
  commits: { kind: 'commits', title: 'Commit Top 10', unit: 'Commits', ariaLabel: `Commit Top 10, last ${DAYS} days` },
};
for (const kind of ['stars', 'commits']) {
  for (const theme of ['light', 'dark']) {
    const suffix = theme === 'dark' ? '-dark' : '';
    const file = join(root, 'assets', `${kind}-top10${suffix}.svg`);
    writeFileSync(file, render(data[kind], theme, meta[kind]));
    console.log(`wrote ${file}`);
  }
}
