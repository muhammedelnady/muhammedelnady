import { FONTS, THEMES, escapeXml, renderBentoDefs } from "./tokens.mjs";

function formatNumber(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function formatCompact(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function renderStatsSvg(metrics, themeKey) {
  const t = THEMES[themeKey];
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const fillRatio = Math.min(0.92, Math.max(0.28, metrics.totalContributions / 2500));
  const dashOffset = Number((circumference * (1 - fillRatio)).toFixed(2));
  const circFixed = circumference.toFixed(2);

  const rows = [
    {
      label: "Contributions (12m)",
      value: formatNumber(metrics.totalContributions),
      icon: `<path d="M13 2L4.5 13.5H11.5L10.5 22L19.5 10.5H12.5L13 2Z" fill="none" stroke="${t.accent}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      label: "Pull Requests Merged",
      value: formatNumber(metrics.totalPRs),
      icon: `<circle cx="18" cy="18" r="2.5" fill="none" stroke="${t.accentSecondary}" stroke-width="1.9"/><circle cx="6" cy="6" r="2.5" fill="none" stroke="${t.accentSecondary}" stroke-width="1.9"/><path d="M13 6H16.5C17.3 6 18 6.7 18 7.5V15.5M6 8.5V21" fill="none" stroke="${t.accentSecondary}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      label: "Public Commits (12m)",
      value: formatNumber(metrics.commitsThisYear),
      icon: `<circle cx="12" cy="12" r="3" fill="none" stroke="${t.emerald}" stroke-width="1.9"/><line x1="3" y1="12" x2="9" y2="12" stroke="${t.emerald}" stroke-width="1.9" stroke-linecap="round"/><line x1="15" y1="12" x2="21" y2="12" stroke="${t.emerald}" stroke-width="1.9" stroke-linecap="round"/>`,
    },
    {
      label: "Stars Earned",
      value: formatNumber(metrics.totalStars),
      icon: `<polygon points="12 2.5 14.9 8.4 21.4 9.3 16.7 13.9 17.8 20.4 12 17.3 6.2 20.4 7.3 13.9 2.6 9.3 9.1 8.4 12 2.5" fill="none" stroke="${t.amber}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      label: "Flagship Public Repos",
      value: formatNumber(metrics.publicRepos),
      icon: `<path d="M4 19.5V5.5C4 4.4 4.9 3.5 6 3.5H19V20.5H6C4.9 20.5 4 19.6 4 19.5Z" fill="none" stroke="${t.violet}" stroke-width="1.9" stroke-linejoin="round"/><path d="M4 17.5C4 16.4 4.9 15.5 6 15.5H19" fill="none" stroke="${t.violet}" stroke-width="1.9" stroke-linecap="round"/>`,
    },
  ];

  const rowsMarkup = rows
    .map((row, idx) => {
      const y = 58 + idx * 25;
      return `
  <g transform="translate(20, ${y})">
    <g transform="scale(0.62)">${row.icon}</g>
    <text x="22" y="11" font-family="${FONTS.sans}" font-size="11.8" font-weight="500" fill="${t.inkSecondary}">${escapeXml(row.label)}</text>
    <text x="270" y="11" text-anchor="end" font-family="${FONTS.mono}" font-size="12.2" font-weight="700" fill="${t.inkPrimary}">${escapeXml(row.value)}</text>
  </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="442" height="196" viewBox="0 0 442 196" role="img" aria-label="GitHub Telemetry for ${escapeXml(metrics.login)}">
  <defs>
    ${renderBentoDefs("stats", t)}
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

  <rect x="0.75" y="0.75" width="440.5" height="194.5" rx="16" fill="url(#stats-bg-${t.id})" stroke="${t.border}" stroke-width="1.2" />
  <line x1="28" y1="1.3" x2="414" y2="1.3" stroke="url(#stats-topline-${t.id})" stroke-width="1.5" opacity="${t.topLineOpacity}" />

  <g transform="translate(20, 20)">
    <g transform="scale(0.74)">
      <polyline points="2 12 6 12 9 4 15 20 18 12 22 12" fill="none" stroke="${t.accent}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="24" y="13.5" font-family="${FONTS.display}" font-size="14" font-weight="700" fill="${t.inkPrimary}">GitHub Telemetry</text>
  </g>
  <rect x="306" y="16" width="116" height="22" rx="11" fill="${t.tagBg}" stroke="${t.tagBorder}" stroke-width="1" />
  <text x="364" y="30.5" text-anchor="middle" font-family="${FONTS.mono}" font-size="9.5" font-weight="600" fill="${t.accent}">@${escapeXml(metrics.login)}</text>

  <line x1="20" y1="46" x2="422" y2="46" stroke="${t.borderSubtle}" stroke-width="1" />
  ${rowsMarkup}
  <line x1="308" y1="58" x2="308" y2="178" stroke="${t.borderSubtle}" stroke-width="1" />

  <g transform="translate(375, 119)">
    <circle cx="0" cy="0" r="${radius + 5}" fill="${t.accent}" opacity="${t.glowCyanOpacity}" />
    <circle cx="0" cy="0" r="${radius}" fill="none" stroke="${t.track}" stroke-width="7" />
    <circle class="ring-progress-${t.id}" cx="0" cy="0" r="${radius}" fill="none" stroke="url(#ring-grad-${t.id})" stroke-width="7" stroke-linecap="round" transform="rotate(-90)" />
    <text x="0" y="2" text-anchor="middle" font-family="${FONTS.display}" font-size="18" font-weight="800" fill="${t.inkPrimary}">${escapeXml(formatCompact(metrics.totalContributions))}</text>
    <text x="0" y="16" text-anchor="middle" font-family="${FONTS.mono}" font-size="7.8" font-weight="700" letter-spacing="0.6" fill="${t.inkMuted}">12M OUTPUT</text>
  </g>
</svg>
`;
}

export function renderLanguagesSvg(metrics, themeKey) {
  const t = THEMES[themeKey];
  const barX = 20;
  const barY = 63;
  const barWidth = 402;
  const barHeight = 11;

  const langs =
    metrics.topLangs.length > 0
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
      const sep =
        idx > 0
          ? `<line x1="${x.toFixed(2)}" y1="${barY}" x2="${x.toFixed(2)}" y2="${barY + barHeight}" stroke="${t.barSeparator}" stroke-width="1.5" />`
          : "";
      return `<rect x="${x.toFixed(2)}" y="${barY}" width="${segWidth.toFixed(2)}" height="${barHeight}" fill="${escapeXml(lang.color)}" />${sep}`;
    })
    .join("");

  const legendMarkup = langs
    .map((lang, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 20 + col * 206;
      const y = 97 + row * 28;
      const pctLabel = `${lang.percent.toFixed(1)}%`;
      const dotStroke = themeKey === "light" ? `stroke="${t.border}" stroke-width="0.6"` : "";
      return `
  <g transform="translate(${x}, ${y})">
    <circle cx="5" cy="5" r="4.5" fill="${escapeXml(lang.color)}" ${dotStroke} />
    <text x="16" y="9" font-family="${FONTS.sans}" font-size="12" font-weight="600" fill="${t.inkPrimary}">${escapeXml(lang.name)}</text>
    <text x="194" y="9" text-anchor="end" font-family="${FONTS.mono}" font-size="11.2" font-weight="600" fill="${t.inkSecondary}">${escapeXml(pctLabel)}</text>
  </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="442" height="196" viewBox="0 0 442 196" role="img" aria-label="Top Languages for ${escapeXml(metrics.login)}">
  <defs>
    ${renderBentoDefs("lang", t)}
    <clipPath id="lang-bar-clip-${t.id}">
      <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="5.5" />
    </clipPath>
  </defs>

  <rect x="0.75" y="0.75" width="440.5" height="194.5" rx="16" fill="url(#lang-bg-${t.id})" stroke="${t.border}" stroke-width="1.2" />
  <line x1="28" y1="1.3" x2="414" y2="1.3" stroke="url(#lang-topline-${t.id})" stroke-width="1.5" opacity="${t.topLineOpacity}" />

  <g transform="translate(20, 20)">
    <g transform="scale(0.74)">
      <polyline points="16 18 22 12 16 6" fill="none" stroke="${t.accent}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />
      <polyline points="8 6 2 12 8 18" fill="none" stroke="${t.accent}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="24" y="13.5" font-family="${FONTS.display}" font-size="14" font-weight="700" fill="${t.inkPrimary}">Language Distribution</text>
  </g>
  <rect x="304" y="16" width="118" height="22" rx="11" fill="${t.tagBg}" stroke="${t.tagBorder}" stroke-width="1" />
  <text x="363" y="30.5" text-anchor="middle" font-family="${FONTS.mono}" font-size="9" font-weight="700" letter-spacing="0.4" fill="${t.accent}">PUBLIC REPOS</text>

  <line x1="20" y1="46" x2="422" y2="46" stroke="${t.borderSubtle}" stroke-width="1" />

  <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="5.5" fill="${t.track}" />
  <g clip-path="url(#lang-bar-clip-${t.id})">
    ${segmentsMarkup}
  </g>
  ${legendMarkup}
</svg>
`;
}

export function renderStreakSvg(metrics, themeKey) {
  const t = THEMES[themeKey];
  const weeks = metrics.weeklyTotals.slice(-52);
  while (weeks.length < 52) weeks.unshift(0);
  const maxWeek = Math.max(10, ...weeks);

  const chartX = 434;
  const chartBottom = 123;
  const maxBarH = 54;
  const step = 8.4;

  const barsMarkup = weeks
    .map((count, i) => {
      const ratio = count / maxWeek;
      const h = count === 0 ? 4 : Math.max(8, Math.round(ratio * maxBarH));
      const y = chartBottom - h;
      const x = (chartX + i * step).toFixed(1);
      let fill = t.track;
      if (count > 0 && ratio < 0.28) fill = t.cyanBorder;
      else if (ratio >= 0.28 && ratio < 0.58) fill = t.accentSecondary;
      else if (ratio >= 0.58 && ratio < 0.82) fill = t.accent;
      else if (ratio >= 0.82) fill = t.emerald;
      return `<rect x="${x}" y="${y}" width="5.8" height="${h}" rx="2.6" fill="${fill}" />`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="896" height="148" viewBox="0 0 896 148" role="img" aria-label="Contribution Velocity and Streak for ${escapeXml(metrics.login)}">
  <defs>
    ${renderBentoDefs("vel", t)}
  </defs>

  <rect x="1" y="1" width="894" height="146" rx="16" fill="url(#vel-bg-${t.id})" stroke="${t.border}" stroke-width="1.2" />
  <line x1="48" y1="1.4" x2="848" y2="1.4" stroke="url(#vel-topline-${t.id})" stroke-width="1.5" opacity="${t.topLineOpacity}" />

  <circle cx="28" cy="26" r="3.8" fill="${t.emerald}" />
  <text x="40" y="30" font-family="${FONTS.display}" font-size="13.5" font-weight="700" fill="${t.inkPrimary}">52-Week Engineering Velocity &amp; Consistency</text>
  <text x="872" y="30" text-anchor="end" font-family="${FONTS.mono}" font-size="9.5" font-weight="600" fill="${t.inkMuted}">AUTO-SYNCED DAILY VIA GITHUB GRAPHQL</text>
  <line x1="22" y1="43" x2="874" y2="43" stroke="${t.borderSubtle}" stroke-width="1" />

  <!-- Stat Tile 1 -->
  <g transform="translate(24, 58)">
    <text x="0" y="24" font-family="${FONTS.display}" font-size="24" font-weight="800" fill="${t.inkPrimary}">${escapeXml(formatNumber(metrics.activeDays))} <tspan font-size="12" font-weight="600" fill="${t.emerald}">days</tspan></text>
    <text x="0" y="44" font-family="${FONTS.mono}" font-size="9.2" font-weight="700" letter-spacing="0.5" fill="${t.inkMuted}">ACTIVE SHIPPING DAYS (12M)</text>
    <text x="0" y="61" font-family="${FONTS.sans}" font-size="11" font-weight="500" fill="${t.inkSecondary}">Current streak: <tspan font-weight="700" fill="${t.inkPrimary}">${metrics.currentStreak}d</tspan></text>
  </g>

  <line x1="222" y1="56" x2="222" y2="128" stroke="${t.borderSubtle}" stroke-width="1" />

  <!-- Stat Tile 2 -->
  <g transform="translate(242, 58)">
    <text x="0" y="24" font-family="${FONTS.display}" font-size="24" font-weight="800" fill="${t.inkPrimary}">${escapeXml(formatNumber(metrics.longestStreak))} <tspan font-size="12" font-weight="600" fill="${t.accent}">days</tspan></text>
    <text x="0" y="44" font-family="${FONTS.mono}" font-size="9.2" font-weight="700" letter-spacing="0.5" fill="${t.inkMuted}">LONGEST STREAK (12M)</text>
    <text x="0" y="61" font-family="${FONTS.sans}" font-size="11" font-weight="500" fill="${t.inkSecondary}">Peak week: <tspan font-weight="700" fill="${t.inkPrimary}">${metrics.peakWeek} commits/PRs</tspan></text>
  </g>

  <line x1="414" y1="56" x2="414" y2="128" stroke="${t.borderSubtle}" stroke-width="1" />

  <!-- 52-Week Velocity Sparkline -->
  <text x="434" y="60" font-family="${FONTS.mono}" font-size="8.8" font-weight="700" letter-spacing="0.5" fill="${t.inkMuted}">WEEKLY CONTRIBUTION CADENCE (LAST 52 WEEKS)</text>
  ${barsMarkup}
</svg>
`;
}
