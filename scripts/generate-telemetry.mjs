#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT_DIR, "assets");

const USERNAME = process.env.GITHUB_USERNAME || "muhammedelnady";

function resolveToken() {
  const envToken = process.env.STATS_TOKEN || process.env.GITHUB_TOKEN;
  if (envToken && envToken.trim()) {
    return envToken.trim();
  }
  try {
    const cliToken = execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    if (cliToken) return cliToken;
  } catch {
    // gh CLI unavailable or unauthenticated
  }
  return null;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatNumber(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function formatCompact(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

const QUERY = `
query($login: String!) {
  user(login: $login) {
    login
    followers {
      totalCount
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      totalCount
      nodes {
        name
        stargazerCount
        forkCount
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
    pullRequests(first: 1) {
      totalCount
    }
    issues(first: 1) {
      totalCount
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
      }
    }
  }
}
`;

async function fetchTelemetry(token) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "muhammedelnady-profile-telemetry",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { login: USERNAME },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`GitHub GraphQL HTTP ${response.status}: ${body.slice(0, 300)}`);
  }

  const payload = await response.json();
  if (payload.errors && payload.errors.length > 0) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(payload.errors)}`);
  }
  if (!payload.data?.user) {
    throw new Error(`GitHub user '${USERNAME}' not found in GraphQL response`);
  }
  return payload.data.user;
}

function aggregateMetrics(user) {
  const totalContributions =
    user.contributionsCollection?.contributionCalendar?.totalContributions ?? 0;
  const totalPRs = user.pullRequests?.totalCount ?? 0;
  const commitsThisYear = user.contributionsCollection?.totalCommitContributions ?? 0;
  const publicRepos = user.repositories?.totalCount ?? 0;
  const repoNodes = user.repositories?.nodes ?? [];
  const totalStars = repoNodes.reduce((sum, repo) => sum + (repo.stargazerCount ?? 0), 0);

  const langMap = new Map();
  for (const repo of repoNodes) {
    const edges = repo.languages?.edges ?? [];
    for (const edge of edges) {
      const name = edge?.node?.name;
      const size = edge?.size ?? 0;
      const color = edge?.node?.color || "#64748B";
      if (!name || size <= 0) continue;
      const prev = langMap.get(name) || { name, color, size: 0 };
      prev.size += size;
      langMap.set(name, prev);
    }
  }

  const allLangs = Array.from(langMap.values()).sort((a, b) => b.size - a.size);
  const totalBytes = allLangs.reduce((sum, l) => sum + l.size, 0) || 1;
  const topLangs = allLangs.slice(0, 6).map((lang) => ({
    name: lang.name,
    color: lang.color,
    size: lang.size,
    percent: (lang.size / totalBytes) * 100,
  }));

  return {
    login: user.login || USERNAME,
    totalContributions,
    totalPRs,
    commitsThisYear,
    totalStars,
    publicRepos,
    topLangs,
  };
}

const THEMES = {
  dark: {
    id: "dark",
    bgStart: "#0B1220",
    bgEnd: "#0D1117",
    surface: "#131D31",
    border: "#24344D",
    accent: "#61DAFB",
    accentSecondary: "#38BDF8",
    emerald: "#10B981",
    violet: "#A855F7",
    amber: "#F59E0B",
    inkPrimary: "#F1F5F9",
    inkSecondary: "#94A3B8",
    inkMuted: "#64748B",
    track: "#1E293B",
    tagBg: "#111C30",
    tagBorder: "#23354E",
    barSeparator: "#0D1117",
    ringGlowOpacity: "0.22",
    topLineOpacity: "0.75",
  },
  light: {
    id: "light",
    bgStart: "#F8FAFC",
    bgEnd: "#FFFFFF",
    surface: "#FFFFFF",
    border: "#CBD5E1",
    accent: "#087EA4",
    accentSecondary: "#0A66C2",
    emerald: "#059669",
    violet: "#7C3AED",
    amber: "#D97706",
    inkPrimary: "#0F172A",
    inkSecondary: "#475569",
    inkMuted: "#64748B",
    track: "#E2E8F0",
    tagBg: "#EFF6FF",
    tagBorder: "#BFDBFE",
    barSeparator: "#FFFFFF",
    ringGlowOpacity: "0.14",
    topLineOpacity: "0.65",
  },
};

function renderStatsSvg(metrics, theme) {
  const t = THEMES[theme];
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.3274
  const fillRatio = Math.min(0.92, Math.max(0.28, metrics.totalContributions / 2500));
  const dashOffset = Number((circumference * (1 - fillRatio)).toFixed(2));
  const circFixed = circumference.toFixed(2);

  const rows = [
    {
      label: "Contributions (12m)",
      value: formatNumber(metrics.totalContributions),
      color: t.accent,
      // Zap / pulse bolt vector
      icon: `<path d="M13 2L4.5 13.5H11.5L10.5 22L19.5 10.5H12.5L13 2Z" fill="none" stroke="${t.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      label: "Pull Requests",
      value: formatNumber(metrics.totalPRs),
      color: t.accentSecondary,
      // Git pull request vector
      icon: `<circle cx="18" cy="18" r="2.5" fill="none" stroke="${t.accentSecondary}" stroke-width="1.8"/><circle cx="6" cy="6" r="2.5" fill="none" stroke="${t.accentSecondary}" stroke-width="1.8"/><path d="M13 6H16.5C17.3 6 18 6.7 18 7.5V15.5M6 8.5V21" fill="none" stroke="${t.accentSecondary}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      label: "Public Commits (12m)",
      value: formatNumber(metrics.commitsThisYear),
      color: t.emerald,
      // Git commit vector
      icon: `<circle cx="12" cy="12" r="3" fill="none" stroke="${t.emerald}" stroke-width="1.8"/><line x1="3" y1="12" x2="9" y2="12" stroke="${t.emerald}" stroke-width="1.8" stroke-linecap="round"/><line x1="15" y1="12" x2="21" y2="12" stroke="${t.emerald}" stroke-width="1.8" stroke-linecap="round"/>`,
    },
    {
      label: "Stars Earned",
      value: formatNumber(metrics.totalStars),
      color: t.amber,
      // Star vector
      icon: `<polygon points="12 2.5 14.9 8.4 21.4 9.3 16.7 13.9 17.8 20.4 12 17.3 6.2 20.4 7.3 13.9 2.6 9.3 9.1 8.4 12 2.5" fill="none" stroke="${t.amber}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      label: "Public Repositories",
      value: formatNumber(metrics.publicRepos),
      color: t.violet,
      // Folder/repo vector
      icon: `<path d="M4 19.5V5.5C4 4.4 4.9 3.5 6 3.5H19V20.5H6C4.9 20.5 4 19.6 4 19.5Z" fill="none" stroke="${t.violet}" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 17.5C4 16.4 4.9 15.5 6 15.5H19" fill="none" stroke="${t.violet}" stroke-width="1.8" stroke-linecap="round"/>`,
    },
  ];

  const rowsMarkup = rows
    .map((row, idx) => {
      const y = 58 + idx * 25;
      return `
  <g transform="translate(22, ${y})">
    <g transform="scale(0.62)">${row.icon}</g>
    <text x="23" y="11" font-family="'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="500" fill="${t.inkSecondary}">${escapeXml(row.label)}</text>
    <text x="298" y="11" text-anchor="end" font-family="'SF Mono', 'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, monospace" font-size="12.5" font-weight="700" fill="${t.inkPrimary}">${escapeXml(row.value)}</text>
  </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" role="img" aria-label="GitHub Telemetry for ${escapeXml(metrics.login)}">
  <defs>
    <linearGradient id="stats-bg-${t.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bgStart}" />
      <stop offset="100%" stop-color="${t.bgEnd}" />
    </linearGradient>
    <linearGradient id="stats-top-${t.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="0" />
      <stop offset="30%" stop-color="${t.accent}" stop-opacity="0.85" />
      <stop offset="70%" stop-color="${t.accentSecondary}" stop-opacity="0.85" />
      <stop offset="100%" stop-color="${t.accentSecondary}" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="ring-grad-${t.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.accent}" />
      <stop offset="100%" stop-color="${t.emerald}" />
    </linearGradient>
    <style>
      @keyframes ringSweep-${t.id} {
        from { stroke-dashoffset: ${circFixed}; }
        to { stroke-dashoffset: ${dashOffset}; }
      }
      .ring-progress-${t.id} {
        stroke-dasharray: ${circFixed};
        stroke-dashoffset: ${dashOffset};
        animation: ringSweep-${t.id} 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .ring-progress-${t.id} { animation: none; stroke-dashoffset: ${dashOffset}; }
      }
    </style>
  </defs>

  <rect x="0.75" y="0.75" width="493.5" height="193.5" rx="14" fill="url(#stats-bg-${t.id})" stroke="${t.border}" stroke-width="1.2" />
  <line x1="28" y1="1.2" x2="467" y2="1.2" stroke="url(#stats-top-${t.id})" stroke-width="1.5" opacity="${t.topLineOpacity}" />

  <!-- Header -->
  <g transform="translate(22, 22)">
    <g transform="scale(0.76)">
      <polyline points="2 12 6 12 9 4 15 20 18 12 22 12" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="25" y="13.5" font-family="'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14.5" font-weight="700" fill="${t.inkPrimary}">GitHub Telemetry</text>
  </g>
  <rect x="358" y="17" width="115" height="22" rx="11" fill="${t.tagBg}" stroke="${t.tagBorder}" stroke-width="1" />
  <text x="415.5" y="31.5" text-anchor="middle" font-family="'SF Mono', 'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, monospace" font-size="10" font-weight="600" fill="${t.accent}">@${escapeXml(metrics.login)}</text>

  <line x1="22" y1="47" x2="473" y2="47" stroke="${t.border}" stroke-width="1" opacity="0.65" />

  <!-- Metrics Column -->
  ${rowsMarkup}

  <!-- Vertical Divider -->
  <line x1="340" y1="58" x2="340" y2="177" stroke="${t.border}" stroke-width="1" opacity="0.55" />

  <!-- Activity Index Ring -->
  <g transform="translate(414, 118)">
    <circle cx="0" cy="0" r="${radius + 5}" fill="${t.accent}" opacity="${t.ringGlowOpacity}" />
    <circle cx="0" cy="0" r="${radius}" fill="none" stroke="${t.track}" stroke-width="7.5" />
    <circle class="ring-progress-${t.id}" cx="0" cy="0" r="${radius}" fill="none" stroke="url(#ring-grad-${t.id})" stroke-width="7.5" stroke-linecap="round" transform="rotate(-90)" />
    <text x="0" y="2" text-anchor="middle" font-family="'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="19" font-weight="800" fill="${t.inkPrimary}">${escapeXml(formatCompact(metrics.totalContributions))}</text>
    <text x="0" y="16" text-anchor="middle" font-family="'SF Mono', 'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, monospace" font-size="8" font-weight="600" letter-spacing="0.8" fill="${t.inkMuted}">12M TOTAL</text>
  </g>
</svg>
`;
}

function renderLanguagesSvg(metrics, theme) {
  const t = THEMES[theme];
  const barX = 22;
  const barY = 64;
  const barWidth = 451;
  const barHeight = 11;

  // Normalize top languages so segments fill barWidth exactly
  const langs = metrics.topLangs.length > 0
    ? metrics.topLangs
    : [{ name: "TypeScript", color: "#3178c6", size: 1, percent: 100 }];

  const topTotalPct = langs.reduce((sum, l) => sum + l.percent, 0) || 100;
  let cursor = barX;
  const segmentsMarkup = langs
    .map((lang, idx) => {
      const isLast = idx === langs.length - 1;
      const rawWidth = (lang.percent / topTotalPct) * barWidth;
      const segWidth = isLast ? Math.max(2, barX + barWidth - cursor) : Math.max(3, rawWidth);
      const x = cursor;
      cursor += segWidth;
      const sep = idx > 0
        ? `<line x1="${x.toFixed(2)}" y1="${barY}" x2="${x.toFixed(2)}" y2="${barY + barHeight}" stroke="${t.barSeparator}" stroke-width="1.5" />`
        : "";
      return `<rect x="${x.toFixed(2)}" y="${barY}" width="${segWidth.toFixed(2)}" height="${barHeight}" fill="${escapeXml(lang.color)}" />${sep}`;
    })
    .join("");

  // 2 columns x 3 rows legend
  const legendMarkup = langs
    .map((lang, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 22 + col * 232;
      const y = 98 + row * 28;
      const pctLabel = `${lang.percent.toFixed(1)}%`;
      const dotStroke = theme === "light" ? `stroke="${t.border}" stroke-width="0.6"` : "";
      return `
  <g transform="translate(${x}, ${y})">
    <circle cx="5" cy="5" r="4.5" fill="${escapeXml(lang.color)}" ${dotStroke} />
    <text x="17" y="9" font-family="'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12.5" font-weight="600" fill="${t.inkPrimary}">${escapeXml(lang.name)}</text>
    <text x="214" y="9" text-anchor="end" font-family="'SF Mono', 'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, monospace" font-size="11.5" font-weight="600" fill="${t.inkSecondary}">${escapeXml(pctLabel)}</text>
  </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" role="img" aria-label="Top Languages for ${escapeXml(metrics.login)}">
  <defs>
    <linearGradient id="lang-bg-${t.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bgStart}" />
      <stop offset="100%" stop-color="${t.bgEnd}" />
    </linearGradient>
    <linearGradient id="lang-top-${t.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${t.accentSecondary}" stop-opacity="0" />
      <stop offset="30%" stop-color="${t.accent}" stop-opacity="0.85" />
      <stop offset="70%" stop-color="${t.violet}" stop-opacity="0.75" />
      <stop offset="100%" stop-color="${t.violet}" stop-opacity="0" />
    </linearGradient>
    <clipPath id="lang-bar-clip-${t.id}">
      <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="5.5" />
    </clipPath>
  </defs>

  <rect x="0.75" y="0.75" width="493.5" height="193.5" rx="14" fill="url(#lang-bg-${t.id})" stroke="${t.border}" stroke-width="1.2" />
  <line x1="28" y1="1.2" x2="467" y2="1.2" stroke="url(#lang-top-${t.id})" stroke-width="1.5" opacity="${t.topLineOpacity}" />

  <!-- Header -->
  <g transform="translate(22, 22)">
    <g transform="scale(0.76)">
      <polyline points="16 18 22 12 16 6" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <polyline points="8 6 2 12 8 18" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="25" y="13.5" font-family="'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14.5" font-weight="700" fill="${t.inkPrimary}">Top Languages</text>
  </g>
  <rect x="352" y="17" width="121" height="22" rx="11" fill="${t.tagBg}" stroke="${t.tagBorder}" stroke-width="1" />
  <text x="412.5" y="31.5" text-anchor="middle" font-family="'SF Mono', 'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, monospace" font-size="9.5" font-weight="600" letter-spacing="0.4" fill="${t.accent}">PUBLIC CODEBASE</text>

  <line x1="22" y1="47" x2="473" y2="47" stroke="${t.border}" stroke-width="1" opacity="0.65" />

  <!-- Segmented Language Bar -->
  <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="5.5" fill="${t.track}" />
  <g clip-path="url(#lang-bar-clip-${t.id})">
    ${segmentsMarkup}
  </g>

  <!-- 2x3 Legend Grid -->
  ${legendMarkup}
</svg>
`;
}

async function main() {
  const token = resolveToken();
  if (!token) {
    console.error("Error: No GitHub token found in STATS_TOKEN, GITHUB_TOKEN, or gh auth token.");
    process.exit(1);
  }

  const user = await fetchTelemetry(token);
  const metrics = aggregateMetrics(user);

  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const outputs = [
    ["stats-dark.svg", renderStatsSvg(metrics, "dark")],
    ["stats-light.svg", renderStatsSvg(metrics, "light")],
    ["languages-dark.svg", renderLanguagesSvg(metrics, "dark")],
    ["languages-light.svg", renderLanguagesSvg(metrics, "light")],
  ];

  for (const [filename, content] of outputs) {
    fs.writeFileSync(path.join(ASSETS_DIR, filename), content, "utf8");
  }

  console.log("Telemetry generated successfully for @" + metrics.login);
  console.log({
    totalContributions: metrics.totalContributions,
    totalPRs: metrics.totalPRs,
    commitsThisYear: metrics.commitsThisYear,
    totalStars: metrics.totalStars,
    publicRepos: metrics.publicRepos,
    topLanguages: metrics.topLangs.map((l) => `${l.name} (${l.percent.toFixed(1)}%)`),
  });
}

main().catch((err) => {
  console.error("Failed to generate telemetry:", err);
  process.exit(1);
});
