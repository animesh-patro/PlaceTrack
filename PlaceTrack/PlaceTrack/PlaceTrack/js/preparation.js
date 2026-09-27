/* ==========================================================================
   PlaceTrack — preparation.js
   Renders subject progress bars and an interactive, persisted checklist.
   ========================================================================== */

function ptRenderPrepProgress() {
  const wrap = document.getElementById("prep-progress-list");
  if (!wrap) return;
  wrap.innerHTML = PT_PREP_SUBJECTS.map(
    (s) => `
    <div class="progress-item">
      <div class="progress-top"><span class="subj">${s.name}</span><span>${s.progress}%</span></div>
      <div class="progress-track"><div class="progress-fill ${s.progress >= 75 ? "teal" : ""}" style="width:${s.progress}%"></div></div>
    </div>`
  ).join("");
}

function ptRenderPrepChecklist() {
  const wrap = document.getElementById("prep-checklist");
  if (!wrap) return;
  const state = PT.getChecklistState();

  wrap.innerHTML = PT_PREP_CHECKLIST.map((item) => {
    const checked = !!state[item.id];
    return `
      <li class="check-item ${checked ? "done" : ""}" data-id="${item.id}">
        <input type="checkbox" id="chk-${item.id}" ${checked ? "checked" : ""}>
        <span>${item.label}</span>
      </li>`;
  }).join("");

  const doneCount = PT_PREP_CHECKLIST.filter((i) => state[i.id]).length;
  const counter = document.getElementById("checklist-count");
  if (counter) counter.textContent = `${doneCount} / ${PT_PREP_CHECKLIST.length} completed`;

  wrap.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.addEventListener("change", () => {
      const li = box.closest(".check-item");
      const id = li.getAttribute("data-id");
      const current = PT.getChecklistState();
      current[id] = box.checked;
      PT.saveChecklistState(current);
      li.classList.toggle("done", box.checked);
      ptRenderPrepChecklist();
    });
  });
}

const PT_CODING_PLATFORMS = [
  { name: "CodeChef", host: "codechef.com", color: "amber" },
  { name: "LeetCode", host: "leetcode.com", color: "teal" },
  { name: "HackerRank", host: "hackerrank.com", color: "navy" },
];

function ptDetectCodingPlatform(value) {
  try {
    const url = new URL(value);
    const platform = PT_CODING_PLATFORMS.find((item) => url.hostname === item.host || url.hostname.endsWith(`.${item.host}`));
    if (!platform) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    const handle = ["u", "profile", "users"].includes(parts[0]) ? parts[1] : parts[0];
    return handle ? { ...platform, handle, url: url.href } : null;
  } catch (error) {
    return null;
  }
}

function ptLocalCodingAnalysis(profile, liveData) {
  const stats = liveData || {};
  const metricCount = Object.keys(stats).length;
  const readiness = Math.min(95, 35 + metricCount * 15);
  const focus = profile.name === "LeetCode"
    ? "Prioritize medium-level arrays, trees and dynamic programming problems."
    : profile.name === "CodeChef"
      ? "Build contest consistency and review solutions after every rated contest."
      : "Strengthen timed problem solving and track your core algorithm badges.";
  return { ...profile, ...stats, readiness, focus, analyzedAt: new Date().toISOString() };
}

async function ptFetchCodingStats(profile) {
  const endpoints = {
    CodeChef: `https://codechef-api.vercel.app/handle/${encodeURIComponent(profile.handle)}`,
    LeetCode: `https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(profile.handle)}`,
  };
  if (!endpoints[profile.name]) return null;
  try {
    const response = await fetch(endpoints[profile.name]);
    if (!response.ok) return null;
    const data = await response.json();
    if (profile.name === "CodeChef") {
      return { rating: data.currentRating || data.rating, contests: data.contestCount, solved: data.totalProblemsSolved };
    }
    return { solved: data.totalSolved, easy: data.easySolved, medium: data.mediumSolved, hard: data.hardSolved, ranking: data.ranking };
  } catch (error) {
    return null;
  }
}

function ptRenderCodingProfile(profile) {
  const result = document.getElementById("coding-profile-result");
  if (!result) return;
  const profiles = Array.isArray(profile) ? profile : profile ? [profile] : [];
  if (!profiles.length) {
    result.innerHTML = `<div class="coding-empty">Your analyzed profile will appear here.</div>`;
    return;
  }
  result.innerHTML = profiles.map((item, index) => {
    const metrics = [
      ["Problems solved", item.solved],
      ["Contest rating", item.rating],
      ["Contests", item.contests],
      ["Global ranking", item.ranking],
    ].filter((metric) => metric[1] !== undefined && metric[1] !== null && metric[1] !== "");
    return `
      <article class="coding-profile-card">
        <div class="coding-result-head">
          <div><span class="coding-platform ${item.color}">${item.name}</span><h3>${item.handle}</h3><a href="${item.url}" target="_blank" rel="noopener">Open public profile ↗</a></div>
          <div class="coding-result-actions"><div class="coding-readiness"><strong>${item.readiness}%</strong><span>readiness</span></div><button type="button" class="icon-btn danger" data-remove-coding-profile="${index}" aria-label="Remove ${item.name} profile" title="Remove profile">×</button></div>
        </div>
        <div class="coding-metrics">${metrics.length ? metrics.map(([label, value]) => `<div class="coding-metric"><strong>${value}</strong><span>${label}</span></div>`).join("") : `<div class="coding-note">The profile was detected, but live stats are unavailable for this platform in the browser.</div>`}</div>
        <div class="coding-focus"><strong>Suggested focus</strong><span>${item.focus}</span></div>
      </article>`;
  }).join("");
  result.querySelectorAll("[data-remove-coding-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      const profiles = PT.getCodingProfiles();
      profiles.splice(Number(button.dataset.removeCodingProfile), 1);
      PT.saveCodingProfiles(profiles);
      ptRenderCodingProfile(profiles);
    });
  });
}

async function ptAnalyzeCodingProfile(event) {
  event.preventDefault();
  const input = document.getElementById("coding-profile-url");
  ptClearError(input);
  const detected = ptDetectCodingPlatform(input.value.trim());
  if (!detected) {
    ptShowError(input, "Enter a valid CodeChef, LeetCode or HackerRank profile URL.");
    return;
  }
  const button = event.target.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Analyzing...";
  const profile = ptLocalCodingAnalysis(detected, await ptFetchCodingStats(detected));
  const profiles = PT.getCodingProfiles().filter((item) => item.url !== profile.url);
  profiles.push(profile);
  PT.saveCodingProfiles(profiles);
  ptRenderCodingProfile(profiles);
  input.value = "";
  button.disabled = false;
  button.textContent = "Add & Analyze";
  ptToast("Coding profile analyzed and saved.", "success");
}

document.addEventListener("DOMContentLoaded", () => {
  ptRenderPrepProgress();
  ptRenderPrepChecklist();
  const savedProfiles = PT.getCodingProfiles();
  ptRenderCodingProfile(savedProfiles);
  const form = document.getElementById("coding-profile-form");
  if (form) form.addEventListener("submit", ptAnalyzeCodingProfile);
});
