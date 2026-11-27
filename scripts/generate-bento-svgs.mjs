#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderHeroBanner, renderCtaPill, renderFooter } from "./lib/hero-and-footer.mjs";
import {
  renderEnterpriseBento,
  renderArchitectureBento,
  renderMarquee,
} from "./lib/architecture-and-enterprise.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT_DIR, "assets");
const CTA_DIR = path.join(ASSETS_DIR, "cta");

fs.mkdirSync(CTA_DIR, { recursive: true });

const CTA_SPECS = [
  {
    slug: "portfolio",
    width: 218,
    label: "Portfolio",
    sublabel: "· Live Site ↗",
    primary: true,
    iconPath: `<circle cx="8" cy="8" r="6.5"/><path d="M1.8 8h12.4M8 1.5c2 2 3 4.2 3 6.5s-1 4.5-3 6.5c-2-2-3-4.2-3-6.5s1-4.5 3-6.5z"/>`,
  },
  {
    slug: "linkedin",
    width: 196,
    label: "LinkedIn",
    sublabel: "· Connect ↗",
    primary: false,
    iconPath: `<rect x="1.5" y="1.5" width="13" height="13" rx="2.5"/><path d="M5 7v4.5M5 4.8v.1M8.2 11.5V8.7c0-1.1.8-1.8 1.8-1.8s1.7.7 1.7 1.8v2.8M8.2 7v4.5"/>`,
  },
  {
    slug: "npm",
    width: 198,
    label: "npm",
    sublabel: "· foldface ↗",
    primary: false,
    iconPath: `<path d="M8 1.5 14 4.8v6.4L8 14.5 2 11.2V4.8L8 1.5z"/><path d="M8 8v6.5M2 4.8 8 8l6-3.2"/>`,
  },
  {
    slug: "email",
    width: 186,
    label: "Email",
    sublabel: "· Contact ↗",
    primary: false,
    iconPath: `<rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="m2 4 6 4.2L14 4"/>`,
  },
];

for (const theme of ["dark", "light"]) {
  const heroPath =
    theme === "dark"
      ? path.join(ROOT_DIR, "banner.svg")
      : path.join(ASSETS_DIR, "banner-light.svg");
  const footerPath =
    theme === "dark"
      ? path.join(ROOT_DIR, "footer.svg")
      : path.join(ASSETS_DIR, "footer-light.svg");

  fs.writeFileSync(heroPath, renderHeroBanner(theme), "utf8");
  fs.writeFileSync(footerPath, renderFooter(theme), "utf8");
  fs.writeFileSync(
    path.join(ASSETS_DIR, `enterprise-${theme}.svg`),
    renderEnterpriseBento(theme),
    "utf8"
  );
  fs.writeFileSync(
    path.join(ASSETS_DIR, `architecture-${theme}.svg`),
    renderArchitectureBento(theme),
    "utf8"
  );
  fs.writeFileSync(
    path.join(ASSETS_DIR, `marquee-${theme}.svg`),
    renderMarquee(theme),
    "utf8"
  );

  for (const spec of CTA_SPECS) {
    fs.writeFileSync(
      path.join(CTA_DIR, `${spec.slug}-${theme}.svg`),
      renderCtaPill(theme, spec),
      "utf8"
    );
  }
}

console.log("Generated all Bento SVG assets (Hero, Footer, Enterprise, Architecture, Marquee, CTAs).");
