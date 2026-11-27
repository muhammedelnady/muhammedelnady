#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const SHOWCASE_DIR = path.join(ROOT_DIR, "assets", "showcase");
const CARDS_DIR = path.join(ROOT_DIR, "assets", "cards");
const CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

fs.mkdirSync(CARDS_DIR, { recursive: true });

const PROJECTS = [
  {
    slug: "vaultfold",
    eyebrow: "FINTECH · FOLDABLE UI",
    accent: "#10B981",
    accentLight: "#059669",
    title: "VaultFold",
    summary:
      "Offline-first crypto ledger & dual-screen market explorer with AES-256 MMKV vault, Decimal math & Skia 120Hz charts.",
    chips: ["Expo SDK 58", "TypeScript 6", "MMKV AES-256", "Skia 120Hz"],
    mode: "foldable",
    image: path.join(SHOWCASE_DIR, "vaultfold.png"),
  },
  {
    slug: "foldface",
    eyebrow: "NPM PACKAGE · 120 FPS",
    accent: "#61DAFB",
    accentLight: "#087EA4",
    title: "react-native-foldface",
    summary:
      "Published open-source library for 60/120 FPS 3D card fold & flip reveals on the UI thread via Reanimated 4 worklets.",
    chips: ["npm Library", "Reanimated 4", "UI Worklets", "Strict TS"],
    mode: "iphone-light-screen",
    image: path.join(SHOWCASE_DIR, "foldface.png"),
  },
  {
    slug: "qadaa",
    eyebrow: "ARABIC RTL · 865 TESTS",
    accent: "#10B981",
    accentLight: "#059669",
    title: "qadaa · قضاء",
    summary:
      "100% on-device Arabic-first prayer recovery companion with 28-day heatmaps, WidgetKit extensions & 99%+ QA coverage.",
    chips: ["Expo SDK 57", "True RTL", "Zustand 5", "WidgetKit"],
    mode: "iphone",
    image: path.join(SHOWCASE_DIR, "qadaa.png"),
  },
  {
    slug: "chat-roulette",
    eyebrow: "REAL-TIME · FIFO OUTBOX",
    accent: "#A78BFA",
    accentLight: "#6D28D9",
    title: "chat-roulette",
    summary:
      "Instant topic-matched radar & live rooms powered by an offline MMKV FIFO outbox, voice waveforms & EN/AR RTL parity.",
    chips: ["Expo SDK 58", "React 19", "Clean Arch", "MMKV"],
    mode: "iphone",
    image: path.join(SHOWCASE_DIR, "chat-roulette.png"),
  },
  {
    slug: "moviesapp-ios",
    eyebrow: "NATIVE IOS · SWIFT 6",
    accent: "#38BDF8",
    accentLight: "#0284C7",
    title: "MoviesApp iOS",
    summary:
      "Spatial Cinema showcase built with strict Swift 6 concurrency, holographic SwiftUI cards, Cast & Siri App Intents.",
    chips: ["Swift 6.0", "SwiftUI", "SwiftData", "App Intents"],
    mode: "iphone",
    image: path.join(SHOWCASE_DIR, "moviesapp-ios.png"),
  },
  {
    slug: "moviesapp-android",
    eyebrow: "NATIVE ANDROID · KOTLIN 2.2",
    accent: "#F59E0B",
    accentLight: "#B45309",
    title: "MoviesApp Android",
    summary:
      "Spatial Cinema showcase engineered with Jetpack Compose Material 3, Room SQLite, Media3 Cast & AppFunctions AI.",
    chips: ["Kotlin 2.2", "Compose M3", "Media3 Cast", "AppFunctions"],
    mode: "android",
    image: path.join(SHOWCASE_DIR, "moviesapp-android.png"),
  },
];

function buildCardHtml(project, theme) {
  const isDark = theme === "dark";
  const accent = isDark ? project.accent : project.accentLight;
  const imgUrl = pathToFileURL(project.image).href;

  const deviceMarkup =
    project.mode === "foldable"
      ? `<div class="foldable-stage">
           <img class="foldable-img" src="${imgUrl}" alt="${project.title}" />
         </div>`
      : `<div class="phone-frame">
           <div class="phone-screen">
             <img class="screen-img" src="${imgUrl}" alt="${project.title}" />
           </div>
         </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 440px;
    height: 252px;
    overflow: hidden;
    background: transparent;
    -webkit-font-smoothing: antialiased;
  }
  .card {
    position: relative;
    width: 440px;
    height: 252px;
    border-radius: 18px;
    padding: 20px 18px 18px 20px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    overflow: hidden;
    background: ${isDark ? "linear-gradient(145deg, #080E1C 0%, #0C1528 60%, #0F1B33 100%)" : "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 65%, #F1F5F9 100%)"};
    border: 1.25px solid ${isDark ? "#1E2E4A" : "#CBD5E1"};
  }
  .card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 28px;
    right: 120px;
    height: 1.6px;
    background: linear-gradient(90deg, transparent, ${accent}, transparent);
    opacity: ${isDark ? "0.85" : "0.7"};
  }
  .glow {
    position: absolute;
    right: -24px;
    top: 18px;
    width: 210px;
    height: 210px;
    border-radius: 50%;
    background: radial-gradient(circle, ${accent}${isDark ? "2E" : "1F"} 0%, transparent 70%);
    pointer-events: none;
  }
  .copy {
    position: relative;
    z-index: 2;
    width: 244px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    align-self: flex-start;
    padding: 3.5px 9px;
    border-radius: 999px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.8px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: ${accent};
    background: ${isDark ? "rgba(15, 27, 51, 0.9)" : "rgba(241, 245, 249, 0.95)"};
    border: 1px solid ${isDark ? "rgba(97, 218, 251, 0.22)" : "#CBD5E1"};
  }
  .dot {
    width: 5.5px;
    height: 5.5px;
    border-radius: 50%;
    background: ${accent};
  }
  .title {
    margin-top: 9px;
    font-family: 'Space Grotesk', -apple-system, sans-serif;
    font-size: 19.5px;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.15;
    color: ${isDark ? "#F8FAFC" : "#0F172A"};
  }
  .summary {
    margin-top: 7px;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    font-size: 11.2px;
    font-weight: 500;
    line-height: 1.46;
    color: ${isDark ? "#94A3B8" : "#475569"};
  }
  .footer {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4.5px;
  }
  .chip {
    padding: 3px 7px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.6px;
    font-weight: 600;
    color: ${isDark ? "#E2E8F0" : "#1E293B"};
    background: ${isDark ? "#111D35" : "#EEF2F6"};
    border: 1px solid ${isDark ? "#1F3252" : "#CBD5E1"};
  }
  .cta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    color: ${accent};
    letter-spacing: 0.02em;
  }
  .stage {
    position: relative;
    z-index: 2;
    width: 152px;
    height: 214px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .phone-frame {
    width: 112px;
    height: 222px;
    margin-top: 12px;
    padding: 5px;
    border-radius: 21px;
    background: ${isDark ? "linear-gradient(160deg, #334155 0%, #0F172A 55%, #1E293B 100%)" : "linear-gradient(160deg, #475569 0%, #1E293B 60%, #334155 100%)"};
    box-shadow: 0 14px 28px ${isDark ? "rgba(0,0,0,0.62)" : "rgba(15,23,42,0.22)"}, inset 0 0 0 1px rgba(255,255,255,0.18);
    transform: rotate(-2.2deg);
  }
  .phone-screen {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 16.5px;
    overflow: hidden;
    background: #050811;
  }
  .screen-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
  }
  .android-topbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 13px;
    padding: 0 8px;
    background: linear-gradient(180deg, rgba(6,10,18,0.95) 0%, rgba(6,10,18,0.75) 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 6.5px;
    font-weight: 700;
    color: #F8FAFC;
    z-index: 3;
  }
  .cam-dot {
    width: 4.5px;
    height: 4.5px;
    border-radius: 50%;
    background: #000;
    border: 0.7px solid #334155;
  }
  .foldable-stage {
    width: 156px;
    height: 196px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(-2deg) scale(1.04);
    filter: drop-shadow(0 14px 22px ${isDark ? "rgba(0,0,0,0.65)" : "rgba(15,23,42,0.22)"});
  }
  .foldable-img {
    width: 156px;
    height: auto;
    border-radius: 10px;
    display: block;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="glow"></div>
    <div class="copy">
      <div>
        <div class="eyebrow"><span class="dot"></span>${project.eyebrow}</div>
        <h2 class="title">${project.title}</h2>
        <p class="summary">${project.summary}</p>
      </div>
      <div class="footer">
        <div class="chips">${project.chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
        <div class="cta">Explore Architecture &amp; Repo ↗</div>
      </div>
    </div>
    <div class="stage">${deviceMarkup}</div>
  </div>
</body>
</html>`;
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "elnady-cards-"));
try {
  for (const project of PROJECTS) {
    for (const theme of ["dark", "light"]) {
      const htmlPath = path.join(tmpDir, `${project.slug}-${theme}.html`);
      const outPath = path.join(CARDS_DIR, `${project.slug}-${theme}.png`);
      fs.writeFileSync(htmlPath, buildCardHtml(project, theme), "utf8");

      execFileSync(
        CHROME_BIN,
        [
          "--headless=new",
          "--disable-gpu",
          "--hide-scrollbars",
          "--default-background-color=00000000",
          "--force-device-scale-factor=2",
          "--window-size=440,252",
          `--screenshot=${outPath}`,
          pathToFileURL(htmlPath).href,
        ],
        { stdio: ["ignore", "pipe", "pipe"] }
      );
      console.log(`Rendered ${path.basename(outPath)}`);
    }
  }
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
