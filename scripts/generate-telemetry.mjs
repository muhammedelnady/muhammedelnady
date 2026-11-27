#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderStatsSvg,
  renderLanguagesSvg,
  renderStreakSvg,
} from "./lib/telemetry-renderers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT_DIR, "assets");
const USERNAME = process.env.GITHUB_USERNAME || "muhammedelnady";

function resolveToken() {
  const envToken = process.env.STATS_TOKEN || process.env.GITHUB_TOKEN;
  if (envToken && envToken.trim()) return envToken.trim();
  try {
    const cliToken = execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    if (cliToken) return cliToken;
  } catch {
    // gh CLI unavailable
  }
  return null;
}

const QUERY = `
query($login: String!) {
  user(login: $login) {
    login
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
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
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
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`GitHub GraphQL HTTP ${response.status}: ${body.slice(0, 300)}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(payload.errors)}`);
  }
  if (!payload.data?.user) {
    throw new Error(`GitHub user '${USERNAME}' not found`);
  }
  return payload.data.user;
}

function aggregateMetrics(user) {
  const calendar = user.contributionsCollection?.contributionCalendar;
  const totalContributions = calendar?.totalContributions ?? 0;
  const totalPRs = user.pullRequests?.totalCount ?? 0;
  const commitsThisYear = user.contributionsCollection?.totalCommitContributions ?? 0;
  const publicRepos = user.repositories?.totalCount ?? 0;
  const repoNodes = user.repositories?.nodes ?? [];
  const totalStars = repoNodes.reduce((sum, r) => sum + (r.stargazerCount ?? 0), 0);

  const weeks = calendar?.weeks ?? [];
  const weeklyTotals = weeks.map((w) =>
    (w.contributionDays ?? []).reduce((s, d) => s + (d.contributionCount ?? 0), 0)
  );
  const peakWeek = weeklyTotals.length > 0 ? Math.max(...weeklyTotals) : 0;

  const days = weeks
    .flatMap((w) => w.contributionDays ?? [])
    .sort((a, b) => a.date.localeCompare(b.date));

  let activeDays = 0;
  let longestStreak = 0;
  let running = 0;
  for (const d of days) {
    if ((d.contributionCount ?? 0) > 0) {
      activeDays += 1;
      running += 1;
      if (running > longestStreak) longestStreak = running;
    } else {
      running = 0;
    }
  }

  // Current streak (allow today to be 0 if day is still in progress)
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    const c = days[i].contributionCount ?? 0;
    if (c > 0) {
      currentStreak += 1;
    } else if (i === days.length - 1) {
      continue;
    } else {
      break;
    }
  }

  const langMap = new Map();
  for (const repo of repoNodes) {
    for (const edge of repo.languages?.edges ?? []) {
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
    activeDays,
    longestStreak,
    currentStreak,
    peakWeek,
    weeklyTotals,
    topLangs,
  };
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
    ["stats-velocity-dark.svg", renderStreakSvg(metrics, "dark")],
    ["stats-velocity-light.svg", renderStreakSvg(metrics, "light")],
  ];

  for (const [filename, content] of outputs) {
    fs.writeFileSync(path.join(ASSETS_DIR, filename), content, "utf8");
  }

  console.log("Telemetry generated for @" + metrics.login, {
    totalContributions: metrics.totalContributions,
    activeDays: metrics.activeDays,
    longestStreak: metrics.longestStreak,
    currentStreak: metrics.currentStreak,
    peakWeek: metrics.peakWeek,
  });
}

main().catch((err) => {
  console.error("Failed to generate telemetry:", err);
  process.exit(1);
});
