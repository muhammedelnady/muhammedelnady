export const FONTS = {
  display: "'Space Grotesk', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  sans: "'Plus Jakarta Sans', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', ui-monospace, Menlo, Consolas, monospace",
};

export const THEMES = {
  dark: {
    id: "dark",
    bgStart: "#070C18",
    bgMid: "#0A1122",
    bgEnd: "#0D1426",
    surface: "#101A30",
    surfaceElevated: "#14213D",
    surfacePill: "#0D172B",
    border: "#1E2E4A",
    borderSubtle: "#18263E",
    borderStrong: "#2A4166",
    accent: "#61DAFB",
    accentSecondary: "#38BDF8",
    emerald: "#10B981",
    emeraldBg: "#082821",
    emeraldBorder: "#115E46",
    violet: "#A78BFA",
    violetBg: "#1B1638",
    violetBorder: "#4C358E",
    amber: "#F59E0B",
    amberBg: "#291D09",
    amberBorder: "#784911",
    cyanBg: "#0B2236",
    cyanBorder: "#164E73",
    inkPrimary: "#F8FAFC",
    inkSecondary: "#94A3B8",
    inkMuted: "#64748B",
    track: "#1A2740",
    tagBg: "#101C33",
    tagBorder: "#213656",
    barSeparator: "#0A1122",
    glowCyanOpacity: "0.16",
    glowEmeraldOpacity: "0.12",
    topLineOpacity: "0.82",
    gridOpacity: "0.045",
    shadowOpacity: "0.42",
  },
  light: {
    id: "light",
    bgStart: "#FFFFFF",
    bgMid: "#F8FAFC",
    bgEnd: "#F1F5F9",
    surface: "#F8FAFC",
    surfaceElevated: "#FFFFFF",
    surfacePill: "#F1F5F9",
    border: "#CBD5E1",
    borderSubtle: "#E2E8F0",
    borderStrong: "#94A3B8",
    accent: "#087EA4",
    accentSecondary: "#0284C7",
    emerald: "#059669",
    emeraldBg: "#ECFDF5",
    emeraldBorder: "#A7F3D0",
    violet: "#6D28D9",
    violetBg: "#F5F3FF",
    violetBorder: "#DDD6FE",
    amber: "#B45309",
    amberBg: "#FFFBEB",
    amberBorder: "#FDE68A",
    cyanBg: "#EFF6FF",
    cyanBorder: "#BAE6FD",
    inkPrimary: "#0F172A",
    inkSecondary: "#334155",
    inkMuted: "#64748B",
    track: "#E2E8F0",
    tagBg: "#F0F9FF",
    tagBorder: "#BAE6FD",
    barSeparator: "#FFFFFF",
    glowCyanOpacity: "0.08",
    glowEmeraldOpacity: "0.06",
    topLineOpacity: "0.72",
    gridOpacity: "0.04",
    shadowOpacity: "0.06",
  },
};

export function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderBentoDefs(prefix, t) {
  return `
    <linearGradient id="${prefix}-bg-${t.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bgStart}" />
      <stop offset="55%" stop-color="${t.bgMid}" />
      <stop offset="100%" stop-color="${t.bgEnd}" />
    </linearGradient>
    <linearGradient id="${prefix}-topline-${t.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="0" />
      <stop offset="28%" stop-color="${t.accent}" stop-opacity="0.85" />
      <stop offset="55%" stop-color="${t.accentSecondary}" stop-opacity="0.9" />
      <stop offset="78%" stop-color="${t.emerald}" stop-opacity="0.7" />
      <stop offset="100%" stop-color="${t.emerald}" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="${prefix}-glow-a-${t.id}" cx="14%" cy="18%" r="52%">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="${t.glowCyanOpacity}" />
      <stop offset="100%" stop-color="${t.bgStart}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="${prefix}-glow-b-${t.id}" cx="88%" cy="22%" r="46%">
      <stop offset="0%" stop-color="${t.emerald}" stop-opacity="${t.glowEmeraldOpacity}" />
      <stop offset="100%" stop-color="${t.bgEnd}" stop-opacity="0" />
    </radialGradient>
    <pattern id="${prefix}-grid-${t.id}" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="${t.accent}" stroke-width="0.6" stroke-opacity="${t.gridOpacity}" />
    </pattern>`;
}
