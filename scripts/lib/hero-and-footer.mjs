import { FONTS, THEMES, escapeXml, renderBentoDefs } from "./tokens.mjs";

export function renderHeroBanner(themeKey) {
  const t = THEMES[themeKey];
  const titleGrad =
    themeKey === "dark"
      ? `<stop offset="0%" stop-color="#FFFFFF" /><stop offset="55%" stop-color="#F1F5F9" /><stop offset="100%" stop-color="#61DAFB" />`
      : `<stop offset="0%" stop-color="#0F172A" /><stop offset="60%" stop-color="#1E293B" /><stop offset="100%" stop-color="#087EA4" />`;

  const kpis = [
    { metric: "8+ Yrs", label: "MOBILE ARCHITECTURE", accent: t.accent },
    { metric: "15+ Apps", label: "APP STORE & PLAY", accent: t.emerald },
    { metric: "60/120 Hz", label: "JSI & WORKLET UI", accent: t.accentSecondary },
    { metric: "865+ Tests", label: "99%+ QA COVERAGE", accent: t.violet },
    { metric: "EN · AR", label: "ZERO-SHIFT RTL", accent: t.amber },
  ];

  const kpiMarkup = kpis
    .map((k, i) => {
      const x = 28 + i * 170;
      return `
    <g transform="translate(${x}, 224)">
      <rect width="160" height="68" rx="12" fill="${t.surfaceElevated}" stroke="${t.border}" stroke-width="1" />
      <line x1="18" y1="0.8" x2="142" y2="0.8" stroke="${k.accent}" stroke-width="1.4" stroke-opacity="0.65" />
      <text x="16" y="31" font-family="${FONTS.display}" font-size="20" font-weight="800" letter-spacing="-0.5" fill="${t.inkPrimary}">${escapeXml(k.metric)}</text>
      <text x="16" y="51" font-family="${FONTS.mono}" font-size="8.8" font-weight="600" letter-spacing="0.6" fill="${t.inkMuted}">${escapeXml(k.label)}</text>
    </g>`;
    })
    .join("");

  const layers = [
    { y: 102, dot: t.accent, left: "UI Thread", right: "Reanimated 4 · Skia" },
    { y: 134, dot: t.violet, left: "Domain & Sync", right: "Clean Arch · MMKV" },
    { y: 166, dot: t.emerald, left: "Native Runtime", right: "Swift 6 · Kotlin 2.2" },
  ];

  const layersMarkup = layers
    .map(
      (l) => `
    <g transform="translate(606, ${l.y})">
      <rect width="246" height="25" rx="7" fill="${t.surfacePill}" stroke="${t.borderSubtle}" stroke-width="1" />
      <circle cx="13" cy="12.5" r="3.2" fill="${l.dot}" />
      <text x="23" y="16.2" font-family="${FONTS.sans}" font-size="10.8" font-weight="600" fill="${t.inkPrimary}">${escapeXml(l.left)}</text>
      <text x="236" y="16.2" text-anchor="end" font-family="${FONTS.mono}" font-size="9.8" font-weight="600" fill="${t.inkSecondary}">${escapeXml(l.right)}</text>
    </g>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="896" height="316" viewBox="0 0 896 316" role="img" aria-label="Mohamed Elnady — Senior React Native &amp; Mobile Product Architect">
  <defs>
    ${renderBentoDefs("hero", t)}
    <linearGradient id="hero-title-${t.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      ${titleGrad}
    </linearGradient>
    <clipPath id="hero-clip-${t.id}">
      <rect x="1" y="1" width="894" height="314" rx="20" />
    </clipPath>
    <style>
      @keyframes statusPulse-${t.id} {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.85; transform: scale(1.9); }
      }
      @keyframes scanBar-${t.id} {
        0%, 100% { opacity: 0.55; }
        50% { opacity: 1; }
      }
      .pulse-ring-${t.id} {
        transform-box: fill-box;
        transform-origin: center;
        animation: statusPulse-${t.id} 2.6s ease-in-out infinite;
      }
      .hud-live-${t.id} {
        animation: scanBar-${t.id} 3s ease-in-out infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .pulse-ring-${t.id}, .hud-live-${t.id} { animation: none !important; }
      }
    </style>
  </defs>

  <g clip-path="url(#hero-clip-${t.id})">
    <rect x="1" y="1" width="894" height="314" fill="url(#hero-bg-${t.id})" />
    <rect x="1" y="1" width="894" height="314" fill="url(#hero-glow-a-${t.id})" />
    <rect x="1" y="1" width="894" height="314" fill="url(#hero-glow-b-${t.id})" />
    <rect x="1" y="1" width="894" height="314" fill="url(#hero-grid-${t.id})" />
  </g>

  <rect x="1" y="1" width="894" height="314" rx="20" fill="none" stroke="${t.border}" stroke-width="1.3" />
  <line x1="48" y1="1.5" x2="848" y2="1.5" stroke="url(#hero-topline-${t.id})" stroke-width="1.8" opacity="${t.topLineOpacity}" />

  <!-- Top Status Row -->
  <g transform="translate(28, 22)">
    <rect width="348" height="26" rx="13" fill="${t.emeraldBg}" stroke="${t.emeraldBorder}" stroke-width="1" />
    <circle class="pulse-ring-${t.id}" cx="16" cy="13" r="4" fill="${t.emerald}" />
    <circle cx="16" cy="13" r="3.5" fill="${t.emerald}" />
    <text x="28" y="16.5" font-family="${FONTS.mono}" font-size="9.6" font-weight="700" letter-spacing="0.7" fill="${t.emerald}">OPEN TO SENIOR / STAFF ARCHITECT ROLES</text>
  </g>

  <g transform="translate(662, 22)">
    <rect width="206" height="26" rx="13" fill="${t.tagBg}" stroke="${t.tagBorder}" stroke-width="1" />
    <circle cx="15" cy="13" r="3" fill="${t.accent}" />
    <text x="26" y="16.5" font-family="${FONTS.mono}" font-size="9.5" font-weight="600" letter-spacing="0.5" fill="${t.inkSecondary}">CAIRO · REMOTE WORLDWIDE</text>
  </g>

  <!-- Left Editorial Identity -->
  <text x="30" y="106" font-family="${FONTS.display}" font-size="44" font-weight="800" letter-spacing="-1.2" fill="url(#hero-title-${t.id})">Mohamed Elnady</text>
  <text x="30" y="135" font-family="${FONTS.sans}" font-size="16" font-weight="700" fill="${t.accent}">Senior React Native &amp; Mobile Product Architect</text>
  <text x="30" y="164" font-family="${FONTS.sans}" font-size="13" font-weight="500" fill="${t.inkSecondary}">8+ years turning complex product domains into resilient cross-platform &amp; native apps.</text>
  <text x="30" y="186" font-family="${FONTS.mono}" font-size="11.2" font-weight="600" fill="${t.inkPrimary}">Expo SDK 58 <tspan fill="${t.accent}">·</tspan> New Arch (JSI/Fabric) <tspan fill="${t.accent}">·</tspan> Swift 6 <tspan fill="${t.accent}">·</tspan> Kotlin 2.2 <tspan fill="${t.accent}">·</tspan> True RTL</text>

  <!-- Right Runtime Architecture Mini-Bento -->
  <g>
    <rect x="592" y="62" width="276" height="142" rx="14" fill="${t.surface}" stroke="${t.border}" stroke-width="1.1" />
    <text x="608" y="83" font-family="${FONTS.mono}" font-size="9.5" font-weight="700" letter-spacing="0.8" fill="${t.inkMuted}">ARCHITECTURE STACK</text>
    <rect x="780" y="70" width="74" height="18" rx="9" fill="${t.emeraldBg}" stroke="${t.emeraldBorder}" stroke-width="0.9" />
    <text class="hud-live-${t.id}" x="817" y="82.2" text-anchor="middle" font-family="${FONTS.mono}" font-size="8.8" font-weight="700" fill="${t.emerald}">8.3ms · 120Hz</text>
    <line x1="606" y1="94" x2="854" y2="94" stroke="${t.borderSubtle}" stroke-width="1" />
    ${layersMarkup}
  </g>

  <!-- 5-Tile Executive KPI Dock -->
  ${kpiMarkup}
</svg>
`;
}

export function renderCtaPill(themeKey, { width, label, sublabel, iconPath, primary = false }) {
  const t = THEMES[themeKey];
  const bg = primary ? t.cyanBg : t.surfaceElevated;
  const stroke = primary ? t.accent : t.border;
  const iconColor = primary ? t.accent : t.accentSecondary;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="38" viewBox="0 0 ${width} 38" role="img" aria-label="${escapeXml(label)} ${escapeXml(sublabel)}">
  <rect x="0.75" y="0.75" width="${width - 1.5}" height="36.5" rx="18.25" fill="${bg}" stroke="${stroke}" stroke-width="${primary ? "1.3" : "1.1"}" />
  <g transform="translate(15, 11)" fill="none" stroke="${iconColor}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    ${iconPath}
  </g>
  <text x="38" y="23" font-family="${FONTS.sans}" font-size="12" font-weight="700" fill="${t.inkPrimary}">${escapeXml(label)} <tspan font-family="${FONTS.mono}" font-size="11" font-weight="500" fill="${primary ? t.accent : t.inkSecondary}">${escapeXml(sublabel)}</tspan></text>
</svg>
`;
}

export function renderFooter(themeKey) {
  const t = THEMES[themeKey];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="896" height="128" viewBox="0 0 896 128" role="img" aria-label="Mohamed Elnady — Ship Fast. Feel Native. Scale Clean.">
  <defs>
    ${renderBentoDefs("footer", t)}
    <clipPath id="footer-clip-${t.id}">
      <rect x="1" y="1" width="894" height="126" rx="18" />
    </clipPath>
  </defs>

  <g clip-path="url(#footer-clip-${t.id})">
    <rect x="1" y="1" width="894" height="126" fill="url(#footer-bg-${t.id})" />
    <rect x="1" y="1" width="894" height="126" fill="url(#footer-glow-a-${t.id})" />
    <rect x="1" y="1" width="894" height="126" fill="url(#footer-glow-b-${t.id})" />
  </g>

  <rect x="1" y="1" width="894" height="126" rx="18" fill="none" stroke="${t.border}" stroke-width="1.2" />
  <line x1="80" y1="1.5" x2="816" y2="1.5" stroke="url(#footer-topline-${t.id})" stroke-width="1.6" opacity="${t.topLineOpacity}" />

  <text x="448" y="46" text-anchor="middle" font-family="${FONTS.display}" font-size="17" font-weight="800" letter-spacing="2.2" fill="${t.inkPrimary}">
    SHIP FAST <tspan fill="${t.accent}">·</tspan> FEEL NATIVE <tspan fill="${t.accent}">·</tspan> SCALE CLEAN
  </text>

  <text x="448" y="74" text-anchor="middle" font-family="${FONTS.sans}" font-size="12.5" font-weight="500" fill="${t.inkSecondary}">
    Greenfield Mobile Flagships <tspan fill="${t.emerald}">•</tspan> 60/120 FPS Architecture Modernization <tspan fill="${t.emerald}">•</tspan> Zero-Touch Release Pipelines
  </text>

  <line x1="210" y1="91" x2="686" y2="91" stroke="${t.borderSubtle}" stroke-width="1" />

  <text x="448" y="110" text-anchor="middle" font-family="${FONTS.mono}" font-size="10" font-weight="600" letter-spacing="0.9" fill="${t.inkMuted}">
    MOHAMED ELNADY <tspan fill="${t.accent}">·</tspan> CAIRO, EGYPT <tspan fill="${t.accent}">·</tspan> AVAILABLE FOR SENIOR &amp; STAFF ROLES WORLDWIDE
  </text>
</svg>
`;
}
