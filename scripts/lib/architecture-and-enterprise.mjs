import { FONTS, THEMES, escapeXml, renderBentoDefs } from "./tokens.mjs";

export function renderEnterpriseBento(themeKey) {
  const t = THEMES[themeKey];
  const modules = [
    {
      title: "Tjaara Multi-Stores",
      badge: "WHITE-LABEL E-COMMERCE",
      badgeBg: t.cyanBg,
      badgeBorder: t.cyanBorder,
      badgeInk: t.accent,
      line1: "Multi-tenant storefront with runtime",
      line2: "theming, fast checkout & Arabic RTL.",
      tags: ["Multi-Tenant", "Themes", "RTL UX"],
    },
    {
      title: "Tjaara Merchant HQ",
      badge: "REAL-TIME OPERATIONS",
      badgeBg: t.emeraldBg,
      badgeBorder: t.emeraldBorder,
      badgeInk: t.emerald,
      line1: "Merchant command center for instant",
      line2: "order orchestration & live inventory.",
      tags: ["Live Sync", "Analytics", "FCM Push"],
    },
    {
      title: "Tjaara Partners Hub",
      badge: "B2B ECOSYSTEM",
      badgeBg: t.violetBg,
      badgeBorder: t.violetBorder,
      badgeInk: t.violet,
      line1: "Vendor platform connecting 3PL",
      line2: "logistics, payment SDKs & webhooks.",
      tags: ["B2B Portal", "Payments", "Webhooks"],
    },
  ];

  const cardsMarkup = modules
    .map((m, idx) => {
      const x = 22 + idx * 288;
      let tagX = 16;
      const tagsSvg = m.tags
        .map((tag) => {
          const w = Math.round(tag.length * 5.9 + 16);
          const curX = tagX;
          tagX += w + 6;
          return `
        <g transform="translate(${curX}, 100)">
          <rect width="${w}" height="20" rx="6" fill="${t.surfacePill}" stroke="${t.borderSubtle}" stroke-width="1" />
          <text x="${w / 2}" y="13.5" text-anchor="middle" font-family="${FONTS.mono}" font-size="8.8" font-weight="600" fill="${t.inkSecondary}">${escapeXml(tag)}</text>
        </g>`;
        })
        .join("");

      const bw = Math.round(m.badge.length * 5.9 + 18);
      return `
    <g transform="translate(${x}, 58)">
      <rect width="276" height="132" rx="13" fill="${t.surfaceElevated}" stroke="${t.border}" stroke-width="1" />
      <rect x="16" y="14" width="${bw}" height="19" rx="9.5" fill="${m.badgeBg}" stroke="${m.badgeBorder}" stroke-width="0.9" />
      <text x="${16 + bw / 2}" y="26.5" text-anchor="middle" font-family="${FONTS.mono}" font-size="8.4" font-weight="700" letter-spacing="0.4" fill="${m.badgeInk}">${escapeXml(m.badge)}</text>
      <text x="16" y="53" font-family="${FONTS.display}" font-size="15.2" font-weight="700" fill="${t.inkPrimary}">${escapeXml(m.title)}</text>
      <text x="16" y="73" font-family="${FONTS.sans}" font-size="11.2" font-weight="500" fill="${t.inkSecondary}">${escapeXml(m.line1)}</text>
      <text x="16" y="89" font-family="${FONTS.sans}" font-size="11.2" font-weight="500" fill="${t.inkSecondary}">${escapeXml(m.line2)}</text>
      ${tagsSvg}
    </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="896" height="208" viewBox="0 0 896 208" role="img" aria-label="Commercial Enterprise Production Suite — Tjaara Ecosystem">
  <defs>
    ${renderBentoDefs("ent", t)}
    <clipPath id="ent-clip-${t.id}">
      <rect x="1" y="1" width="894" height="206" rx="18" />
    </clipPath>
  </defs>

  <g clip-path="url(#ent-clip-${t.id})">
    <rect x="1" y="1" width="894" height="206" fill="url(#ent-bg-${t.id})" />
    <rect x="1" y="1" width="894" height="206" fill="url(#ent-glow-a-${t.id})" />
  </g>
  <rect x="1" y="1" width="894" height="206" rx="18" fill="none" stroke="${t.border}" stroke-width="1.2" />
  <line x1="48" y1="1.5" x2="848" y2="1.5" stroke="url(#ent-topline-${t.id})" stroke-width="1.6" opacity="${t.topLineOpacity}" />

  <circle cx="30" cy="30" r="4" fill="${t.emerald}" />
  <text x="42" y="34" font-family="${FONTS.display}" font-size="14.2" font-weight="700" fill="${t.inkPrimary}">Commercial Enterprise Ecosystem <tspan font-family="${FONTS.sans}" font-size="11.8" font-weight="500" fill="${t.inkMuted}">· Storefront, Merchant &amp; B2B Suite</tspan></text>

  <rect x="704" y="18" width="170" height="23" rx="11.5" fill="${t.tagBg}" stroke="${t.tagBorder}" stroke-width="1" />
  <text x="789" y="33" text-anchor="middle" font-family="${FONTS.mono}" font-size="9" font-weight="700" letter-spacing="0.4" fill="${t.accent}">APP STORE &amp; GOOGLE PLAY</text>

  <line x1="22" y1="48" x2="874" y2="48" stroke="${t.borderSubtle}" stroke-width="1" />
  ${cardsMarkup}
</svg>
`;
}

export function renderArchitectureBento(themeKey) {
  const t = THEMES[themeKey];
  const pillars = [
    {
      col: 0,
      row: 0,
      code: "01",
      accent: t.accent,
      title: "Cross-Platform & 120Hz UI Thread",
      line1: "New Architecture (JSI, Fabric, TurboModules) with",
      line2: "GPU-rasterized Reanimated 4 worklets & Skia graphics.",
      chips: ["RN 0.88", "Expo SDK 58", "TypeScript 6", "Reanimated 4", "Skia"],
    },
    {
      col: 1,
      row: 0,
      code: "02",
      accent: t.violet,
      title: "Deep Native iOS & Android",
      line1: "Strict actor concurrency, custom native bridges,",
      line2: "Home Screen widgets, Cast & on-device AI intents.",
      chips: ["Swift 6", "SwiftUI", "WidgetKit", "Kotlin 2.2", "Compose M3"],
    },
    {
      col: 0,
      row: 1,
      code: "03",
      accent: t.emerald,
      title: "Offline-First Data & Cryptography",
      line1: "Clean Architecture domain isolation, AES-256 local",
      line2: "vaults & deterministic FIFO synchronization queues.",
      chips: ["Clean Arch", "MMKV AES-256", "Room / SQLite", "TanStack", "Zustand"],
    },
    {
      col: 1,
      row: 1,
      code: "04",
      accent: t.amber,
      title: "Zero-Touch CI/CD & Global RTL",
      line1: "Automated store pipelines, 99%+ unit/E2E quality",
      line2: "gates & zero-layout-shift Arabic/English parity.",
      chips: ["GH Actions", "Azure DevOps", "Fastlane", "Jest & E2E", "True RTL"],
    },
  ];

  const tilesMarkup = pillars
    .map((p) => {
      const x = 22 + p.col * 432;
      const y = 58 + p.row * 128;
      let cx = 16;
      const chipsSvg = p.chips
        .map((c) => {
          const w = Math.round(c.length * 5.7 + 14);
          const cur = cx;
          cx += w + 5;
          return `
        <g transform="translate(${cur}, 84)">
          <rect width="${w}" height="20" rx="6" fill="${t.surfacePill}" stroke="${t.borderSubtle}" stroke-width="1" />
          <text x="${w / 2}" y="13.5" text-anchor="middle" font-family="${FONTS.mono}" font-size="8.6" font-weight="600" fill="${t.inkPrimary}">${escapeXml(c)}</text>
        </g>`;
        })
        .join("");

      return `
    <g transform="translate(${x}, ${y})">
      <rect width="420" height="116" rx="13" fill="${t.surfaceElevated}" stroke="${t.border}" stroke-width="1" />
      <line x1="18" y1="0.8" x2="120" y2="0.8" stroke="${p.accent}" stroke-width="1.6" stroke-opacity="0.8" />
      <text x="16" y="26" font-family="${FONTS.mono}" font-size="10.5" font-weight="700" fill="${p.accent}">${p.code}</text>
      <text x="38" y="26" font-family="${FONTS.display}" font-size="14.2" font-weight="700" fill="${t.inkPrimary}">${escapeXml(p.title)}</text>
      <text x="16" y="47" font-family="${FONTS.sans}" font-size="11.2" font-weight="500" fill="${t.inkSecondary}">${escapeXml(p.line1)}</text>
      <text x="16" y="63" font-family="${FONTS.sans}" font-size="11.2" font-weight="500" fill="${t.inkSecondary}">${escapeXml(p.line2)}</text>
      ${chipsSvg}
    </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="896" height="314" viewBox="0 0 896 314" role="img" aria-label="Engineering Architecture &amp; Production Capabilities">
  <defs>
    ${renderBentoDefs("arch", t)}
    <clipPath id="arch-clip-${t.id}">
      <rect x="1" y="1" width="894" height="312" rx="18" />
    </clipPath>
  </defs>

  <g clip-path="url(#arch-clip-${t.id})">
    <rect x="1" y="1" width="894" height="312" fill="url(#arch-bg-${t.id})" />
    <rect x="1" y="1" width="894" height="312" fill="url(#arch-glow-b-${t.id})" />
  </g>
  <rect x="1" y="1" width="894" height="312" rx="18" fill="none" stroke="${t.border}" stroke-width="1.2" />
  <line x1="48" y1="1.5" x2="848" y2="1.5" stroke="url(#arch-topline-${t.id})" stroke-width="1.6" opacity="${t.topLineOpacity}" />

  <circle cx="30" cy="30" r="4" fill="${t.accent}" />
  <text x="42" y="34" font-family="${FONTS.display}" font-size="14.2" font-weight="700" fill="${t.inkPrimary}">Architecture Blueprint &amp; Production Capabilities</text>
  <rect x="694" y="18" width="180" height="23" rx="11.5" fill="${t.tagBg}" stroke="${t.tagBorder}" stroke-width="1" />
  <text x="784" y="33" text-anchor="middle" font-family="${FONTS.mono}" font-size="9" font-weight="700" letter-spacing="0.4" fill="${t.accent}">MODULAR · TESTED · NATIVE</text>

  <line x1="22" y1="48" x2="874" y2="48" stroke="${t.borderSubtle}" stroke-width="1" />
  ${tilesMarkup}
</svg>
`;
}

export function renderMarquee(themeKey) {
  const t = THEMES[themeKey];
  const items = [
    ["React Native 0.88", t.accent],
    ["Expo SDK 58", t.emerald],
    ["Strict TypeScript 6", t.accentSecondary],
    ["Swift 6 & SwiftUI", t.violet],
    ["Kotlin 2.2 & Compose", t.emerald],
    ["Reanimated 4 Worklets", t.accent],
    ["Skia 120Hz", t.amber],
    ["MMKV AES-256", t.emerald],
    ["Clean Architecture", t.violet],
    ["WidgetKit & App Intents", t.accentSecondary],
    ["Media3 & Google Cast", t.amber],
    ["Fastlane & GitHub Actions", t.accent],
    ["True EN / AR RTL", t.emerald],
    ["Jest & Maestro E2E", t.violet],
  ];

  let cursor = 0;
  const buildTrack = () => {
    let x = 0;
    const nodes = items.map(([label, dotColor]) => {
      const w = Math.round(label.length * 7.1 + 36);
      const node = `<g transform="translate(${x}, 7)"><rect width="${w}" height="32" rx="16" fill="${t.surfaceElevated}" stroke="${t.border}" stroke-width="1"/><circle cx="15" cy="16" r="3.2" fill="${dotColor}"/><text x="26" y="20" font-family="${FONTS.mono}" font-size="11.5" font-weight="600" fill="${t.inkPrimary}">${escapeXml(label)}</text></g>`;
      x += w + 10;
      return node;
    });
    cursor = x;
    return nodes.join("");
  };

  const trackMarkup = buildTrack();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="896" height="46" viewBox="0 0 896 46" role="img" aria-label="Core mobile engineering stack">
  <defs>
    <linearGradient id="fade-grad-${t.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#000000" />
      <stop offset="8%" stop-color="#FFFFFF" />
      <stop offset="92%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <mask id="fade-mask-${t.id}">
      <rect width="896" height="46" fill="url(#fade-grad-${t.id})" />
    </mask>
    <style>
      @keyframes ticker-${t.id} {
        from { transform: translateX(0); }
        to { transform: translateX(-${cursor}px); }
      }
      .marquee-track-${t.id} {
        animation: ticker-${t.id} 36s linear infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .marquee-track-${t.id} { animation: none !important; }
      }
    </style>
  </defs>
  <g mask="url(#fade-mask-${t.id})">
    <g class="marquee-track-${t.id}">
      <g>${trackMarkup}</g>
      <g transform="translate(${cursor}, 0)">${trackMarkup}</g>
    </g>
  </g>
</svg>
`;
}
