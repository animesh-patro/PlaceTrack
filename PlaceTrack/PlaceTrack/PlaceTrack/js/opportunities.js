/* ==========================================================================
   PlaceTrack — opportunities.js
   Renders opportunity cards with search + filters, Save / Apply actions.
   ========================================================================== */

function ptRenderOpportunityCard(opp, savedIds) {
  const isSaved = savedIds.includes(opp.id);
  const profile = PT.getProfile();
  const matchScore = ptOpportunityMatchScore(opp, profile);
  return `
    <div class="opp-card" data-id="${opp.id}">
      <div class="opp-card-head">
        <div class="flex items-center gap-12">
          <div class="opp-co-logo">${opp.logo}</div>
          <div>
            <div class="opp-title">${opp.company}</div>
            <div class="opp-role">${opp.role}</div>
          </div>
        </div>
        <span class="badge badge-applied">${matchScore ? `${matchScore}% match` : opp.type}</span>
      </div>
      <div class="opp-meta">
        <span>📍 ${opp.location}</span>
        <span>💰 ${opp.ctc}</span>
        <span>🎓 Min CGPA ${opp.minCgpa}</span>
      </div>
      <div class="opp-details-list">
        <div><b>Eligible branches:</b> ${opp.branches.join(", ")}</div>
        <div><b>Skills:</b> ${opp.skills.join(", ")}</div>
        <div><b>Drive date:</b> ${PT.formatDate(opp.driveDate)}</div>
      </div>
      <div class="opp-deadline">Apply before ${PT.formatDate(opp.deadline)}</div>
      <div class="opp-actions">
        <button class="btn btn-outline btn-sm" data-view="${opp.id}">View Details</button>
        <button class="btn btn-ghost btn-sm" data-save="${opp.id}">${isSaved ? "★ Saved" : "☆ Save"}</button>
        <button class="btn btn-accent btn-sm" data-apply="${opp.id}">Apply</button>
      </div>
    </div>`;
}

function ptGetOpportunityFilters() {
  return {
    search: (document.getElementById("opp-search")?.value || "").toLowerCase().trim(),
    type: document.getElementById("filter-type")?.value || "",
    location: document.getElementById("filter-location")?.value || "",
    branch: document.getElementById("filter-branch")?.value || "",
  };
}

function ptFilterOpportunities() {
  const f = ptGetOpportunityFilters();
  return PT.getOpportunities().filter((opp) => {
    const matchesSearch =
      !f.search ||
      opp.company.toLowerCase().includes(f.search) ||
      opp.role.toLowerCase().includes(f.search) ||
      opp.skills.join(" ").toLowerCase().includes(f.search);
    const matchesType = !f.type || opp.type === f.type;
    const matchesLocation = !f.location || opp.location === f.location;
    const matchesBranch = !f.branch || opp.branches.includes(f.branch);
    return matchesSearch && matchesType && matchesLocation && matchesBranch;
  });
}

function ptRenderOpportunities() {
  const grid = document.getElementById("opportunities-grid");
  if (!grid) return;
  const savedIds = PT.getSavedOpportunityIds();
  const results = ptFilterOpportunities().sort((a, b) => ptOpportunityMatchScore(b, PT.getProfile()) - ptOpportunityMatchScore(a, PT.getProfile()));

  const countEl = document.getElementById("opp-result-count");
  if (countEl) countEl.textContent = `${results.length} opportunit${results.length === 1 ? "y" : "ies"} found`;

  if (results.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <div class="ic">🔍</div>
      <p>No opportunities match your filters. Try widening your search.</p>
    </div>`;
    return;
  }
  grid.innerHTML = results.map((opp) => ptRenderOpportunityCard(opp, savedIds)).join("");
}

function ptAddOrUpdateApplication(opp, status) {
  const applications = PT.getApplications();
  const existing = applications.find((a) => a.company === opp.company && a.role === opp.role);
  if (existing) {
    existing.status = status;
  } else {
    applications.unshift({
      id: PT.uid("ap"),
      company: opp.company,
      role: opp.role,
      type: opp.type,
      appliedDate: new Date().toISOString().slice(0, 10),
      deadline: opp.deadline,
      status: status,
      url: "",
      stipend: opp.ctc,
      notes: "",
    });
  }
  PT.saveApplications(applications);
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("opportunities-grid");
  if (!grid) return;

  ptRenderOpportunities();

  ["opp-search", "filter-type", "filter-location", "filter-branch"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", ptRenderOpportunities);
  });

  const clearBtn = document.getElementById("clear-filters");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      document.getElementById("opp-search").value = "";
      document.getElementById("filter-type").value = "";
      document.getElementById("filter-location").value = "";
      document.getElementById("filter-branch").value = "";
      ptRenderOpportunities();
    });
  }

  grid.addEventListener("click", (e) => {
    const saveBtn = e.target.closest("[data-save]");
    const applyBtn = e.target.closest("[data-apply]");
    const viewBtn = e.target.closest("[data-view]");

    if (saveBtn) {
      const id = saveBtn.getAttribute("data-save");
      const opp = PT.getOpportunities().find((o) => o.id === id);
      let savedIds = PT.getSavedOpportunityIds();
      if (savedIds.includes(id)) {
        savedIds = savedIds.filter((x) => x !== id);
        ptToast(`Removed ${opp.company} from saved.`);
      } else {
        savedIds.push(id);
        ptAddOrUpdateApplication(opp, "Saved");
        ptToast(`${opp.company} saved to your list.`, "success");
      }
      PT.saveSavedOpportunityIds(savedIds);
      ptRenderOpportunities();
    }

    if (applyBtn) {
      const id = applyBtn.getAttribute("data-apply");
      const opp = PT.getOpportunities().find((o) => o.id === id);
      ptAddOrUpdateApplication(opp, "Applied");
      ptToast(`Applied to ${opp.company} — ${opp.role}.`, "success");
    }

    if (viewBtn) {
      const id = viewBtn.getAttribute("data-view");
      const opp = PT.getOpportunities().find((o) => o.id === id);
      const modal = document.getElementById("opp-modal");
      if (modal && opp) {
        document.getElementById("opp-modal-title").textContent = `${opp.role} — ${opp.company}`;
        document.getElementById("opp-modal-body").innerHTML = `
          <p class="text-muted">${opp.description}</p>
          <div class="info-grid" style="margin-top:16px;">
            <div class="info-item"><div class="lbl">Location</div><div class="val">${opp.location}</div></div>
            <div class="info-item"><div class="lbl">CTC / Stipend</div><div class="val">${opp.ctc}</div></div>
            <div class="info-item"><div class="lbl">Minimum CGPA</div><div class="val">${opp.minCgpa}</div></div>
            <div class="info-item"><div class="lbl">Job Type</div><div class="val">${opp.type}</div></div>
            <div class="info-item"><div class="lbl">Deadline</div><div class="val">${PT.formatDate(opp.deadline)}</div></div>
            <div class="info-item"><div class="lbl">Drive Date</div><div class="val">${PT.formatDate(opp.driveDate)}</div></div>
          </div>
          <div style="margin-top:16px;"><div class="lbl" style="font-size:.78rem;color:var(--muted);margin-bottom:6px;">Eligible branches</div>
          <div class="skill-tags">${opp.branches.map((b) => `<span class="skill-tag">${b}</span>`).join("")}</div></div>
          <div style="margin-top:14px;"><div class="lbl" style="font-size:.78rem;color:var(--muted);margin-bottom:6px;">Required skills</div>
          <div class="skill-tags">${opp.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("")}</div></div>
        `;
        modal.classList.add("open");
      }
    }
  });
});
