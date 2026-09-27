/* ==========================================================================
   PlaceTrack — dashboard.js
   Powers the student dashboard, the interviews/events page, and the
   admin dashboard statistics — all from sample + localStorage data.
   ========================================================================== */

function ptComputeStudentStats() {
  const applications = PT.getApplications();
  return {
    total: applications.length,
    tests: PT_SAMPLE_EVENTS.filter((e) => e.type === "Online Assessment").length,
    interviews: PT_SAMPLE_EVENTS.filter((e) => e.type.includes("Interview")).length,
    selected: applications.filter((a) => a.status === "Selected").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };
}

function ptReadinessScore() {
  const profile = PT.getProfile();
  const applications = PT.getApplications();
  const checklist = PT.getChecklistState();
  let score = 0;
  if (profile) {
    score += profile.fullName && profile.email && profile.college ? 20 : 10;
    score += profile.phone ? 10 : 0;
    score += profile.skills && profile.skills.length ? 15 : 0;
  }
  score += applications.length ? 20 : 0;
  score += applications.some((app) => app.status.includes("Interview")) ? 15 : 0;
  const completedTasks = Object.values(checklist).filter(Boolean).length;
  score += Math.min(20, completedTasks * 2);
  return Math.min(100, score);
}

function ptRenderReadiness() {
  const wrap = document.getElementById("dash-readiness");
  if (!wrap) return;
  const score = ptReadinessScore();
  const label = document.getElementById("dash-readiness-label");
  if (label) label.textContent = score >= 75 ? "Ready" : score >= 45 ? "On track" : "Getting started";
  wrap.innerHTML = `<div class="stat-num">${score}%</div><p class="text-muted">Complete your profile, add skills, apply to suitable roles, and finish preparation tasks to improve your score.</p>`;
}

function ptRenderDeadlines() {
  const wrap = document.getElementById("dash-deadlines");
  if (!wrap) return;
  const upcoming = PT.getApplications()
    .filter((app) => app.deadline && !["Selected", "Rejected"].includes(app.status))
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3);
  wrap.innerHTML = upcoming.length
    ? upcoming.map((app) => `<div class="event-card"><div class="event-date-box"><div class="d">${Math.ceil((new Date(app.deadline) - new Date()) / 86400000)}</div><div class="m">days</div></div><div class="event-info"><h4>${app.company} — ${app.role}</h4><div class="sub">${app.status} · Apply by ${PT.formatDate(app.deadline)}</div></div></div>`).join("")
    : `<div class="empty-state"><p>No upcoming deadlines.</p></div>`;
}

function ptRenderStudentDashboard() {
  const statsWrap = document.getElementById("dash-stats");
  if (!statsWrap) return;
  const stats = ptComputeStudentStats();
  ptRenderReadiness();
  ptRenderDeadlines();

  statsWrap.innerHTML = `
    <div class="stat-card"><div class="stat-num">${stats.total}</div><div class="stat-label">Total Applications</div></div>
    <div class="stat-card accent-amber"><div class="stat-num">${stats.tests}</div><div class="stat-label">Upcoming Tests</div></div>
    <div class="stat-card accent-teal"><div class="stat-num">${stats.interviews}</div><div class="stat-label">Upcoming Interviews</div></div>
    <div class="stat-card accent-teal"><div class="stat-num">${stats.selected}</div><div class="stat-label">Selected</div></div>
    <div class="stat-card accent-coral"><div class="stat-num">${stats.rejected}</div><div class="stat-label">Rejected</div></div>
  `;

  const oppList = document.getElementById("dash-opportunities");
  if (oppList) {
    const profile = PT.getProfile();
    oppList.innerHTML = PT.getOpportunities().sort((a, b) => ptOpportunityMatchScore(b, profile) - ptOpportunityMatchScore(a, profile)).slice(0, 3)
      .map(
        (o) => `
      <div class="event-card">
        <div class="opp-co-logo">${o.logo}</div>
        <div class="event-info">
          <h4>${o.company} — ${o.role}</h4>
          <div class="sub">${o.location} · ${o.ctc} · Apply by ${PT.formatDate(o.deadline)}</div>
        </div>
        <span class="badge badge-applied">${o.type}</span>
      </div>`
      )
      .join("");
  }

  const recentApps = document.getElementById("dash-recent-applications");
  if (recentApps) {
    const applications = PT.getApplications().slice(0, 4);
    recentApps.innerHTML = applications
      .map(
        (a) => `
      <tr>
        <td><b>${a.company}</b></td>
        <td>${a.role}</td>
        <td><span class="badge ${PT.badgeClass(a.status)}">${a.status}</span></td>
      </tr>`
      )
      .join("");
  }

  const eventsList = document.getElementById("dash-events");
  if (eventsList) {
    eventsList.innerHTML = PT_SAMPLE_EVENTS.slice(0, 3).map(ptRenderEventCard).join("");
  }
}

function ptRenderEventCard(ev) {
  const d = new Date(ev.date + "T00:00:00");
  const day = isNaN(d) ? "--" : d.getDate();
  const month = isNaN(d) ? "" : d.toLocaleDateString("en-IN", { month: "short" });
  return `
    <div class="event-card">
      <div class="event-date-box"><div class="d">${day}</div><div class="m">${month}</div></div>
      <div class="event-info">
        <h4>${ev.company} — ${ev.type}</h4>
        <div class="sub">${ev.time} · ${ev.notes}</div>
        <div class="event-tags">
          <span class="badge badge-applied">${ev.type}</span>
          <span class="badge badge-technical">${ev.status}</span>
        </div>
      </div>
    </div>`;
}

function ptRenderInterviewsPage() {
  const testsList = document.getElementById("interviews-tests");
  const interviewsList = document.getElementById("interviews-list");
  if (!testsList && !interviewsList) return;

  const events = PT.read("pt_events", PT_SAMPLE_EVENTS);

  if (testsList) {
    const tests = events.filter((e) => e.type === "Online Assessment");
    testsList.innerHTML = tests.length
      ? tests.map(ptRenderEventCard).join("")
      : `<div class="empty-state"><div class="ic">📝</div><p>No tests scheduled yet.</p></div>`;
  }
  if (interviewsList) {
    const interviews = events.filter((e) => e.type.includes("Interview"));
    interviewsList.innerHTML = interviews.length
      ? interviews.map(ptRenderEventCard).join("")
      : `<div class="empty-state"><div class="ic">🎤</div><p>No interviews scheduled yet.</p></div>`;
  }
}

/* ---------------- Admin dashboard ---------------- */

const PT_ADMIN_STATS = { students: 482, companies: 36, activeOpportunities: PT_SAMPLE_OPPORTUNITIES.length, applications: 1248 };

function ptRenderAdminDashboard() {
  const statsWrap = document.getElementById("admin-stats");
  if (!statsWrap) return;

  const opportunities = PT.getOpportunities();
  const applications = PT.getApplications();
  const statusOptions = ["Saved", "Applied", "Assessment", "Technical Interview", "HR Interview", "Selected", "Rejected"];
  const search = (document.getElementById("admin-opp-search")?.value || "").toLowerCase().trim();
  const type = document.getElementById("admin-opp-type")?.value || "";
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch = !search || opportunity.company.toLowerCase().includes(search) || opportunity.role.toLowerCase().includes(search);
    return matchesSearch && (!type || opportunity.type === type);
  });

  statsWrap.innerHTML = `
    <div class="stat-card"><div class="stat-num">${PT_ADMIN_STATS.students}</div><div class="stat-label">Total Students</div></div>
    <div class="stat-card accent-amber"><div class="stat-num">${PT_ADMIN_STATS.companies}</div><div class="stat-label">Total Companies</div></div>
    <div class="stat-card accent-teal"><div class="stat-num">${opportunities.length}</div><div class="stat-label">Active Opportunities</div></div>
    <div class="stat-card"><div class="stat-num">${applications.length}</div><div class="stat-label">Total Applications</div></div>
  `;

  const oppTable = document.getElementById("admin-opp-tbody");
  if (oppTable) {
    oppTable.innerHTML = filteredOpportunities.map(
      (o) => `
      <tr>
        <td><b>${o.company}</b></td>
        <td>${o.role}</td>
        <td>${o.type}</td>
        <td>${o.location}</td>
        <td>${PT.formatDate(o.deadline)}</td>
        <td><span class="badge badge-selected">Active</span></td>
        <td><button class="icon-btn danger" title="Remove opportunity" data-admin-delete="${o.id}">🗑</button></td>
      </tr>`
    ).join("");
  }

  const overview = document.getElementById("admin-application-overview");
  if (overview) {
    const counts = statusOptions.reduce((result, status) => {
      result[status] = applications.filter((application) => application.status === status).length;
      return result;
    }, {});
    overview.innerHTML = `<div class="event-tags">${statusOptions.map((status) => `<span class="badge ${PT.badgeClass(status)}">${status}: ${counts[status]}</span>`).join(" ")}</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ptRenderStudentDashboard();
  ptRenderInterviewsPage();
  ptRenderAdminDashboard();

  // Add Event (interviews page) — simple prototype form inside a modal
  const addEventForm = document.getElementById("add-event-form");
  if (addEventForm) {
    addEventForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const events = PT.read("pt_events", PT_SAMPLE_EVENTS);
      events.unshift({
        id: PT.uid("ev"),
        company: document.getElementById("ev-company").value.trim(),
        type: document.getElementById("ev-type").value,
        date: document.getElementById("ev-date").value,
        time: document.getElementById("ev-time").value,
        notes: document.getElementById("ev-notes").value.trim(),
        status: "Upcoming",
      });
      PT.write("pt_events", events);
      ptToast("Event added.", "success");
      addEventForm.reset();
      document.getElementById("event-modal").classList.remove("open");
      ptRenderInterviewsPage();
    });
  }

  // Add Opportunity (admin dashboard) — prototype form, appends to visible table only
  const addOppForm = document.getElementById("add-opportunity-form");
  if (addOppForm) {
    addOppForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const company = document.getElementById("ao-company").value.trim();
      const role = document.getElementById("ao-role").value.trim();
      if (!company || !role) {
        ptToast("Company and role are required.", "error");
        return;
      }
      const opportunities = PT.getOpportunities();
      opportunities.unshift({
        id: PT.uid("op"),
        company,
        logo: company.slice(0, 2).toUpperCase(),
        role,
        type: document.getElementById("ao-type").value,
        location: document.getElementById("ao-location").value.trim() || "Not specified",
        ctc: document.getElementById("ao-ctc").value.trim() || "Not specified",
        minCgpa: Number(document.getElementById("ao-cgpa").value) || 0,
        branches: document.getElementById("ao-branches").value.split(",").map((value) => value.trim()).filter(Boolean),
        skills: document.getElementById("ao-skills").value.split(",").map((value) => value.trim()).filter(Boolean),
        deadline: document.getElementById("ao-deadline").value,
        driveDate: document.getElementById("ao-drive").value,
        description: document.getElementById("ao-desc").value.trim(),
        url: document.getElementById("ao-url").value.trim(),
      });
      PT.write("pt_opportunities", opportunities);
      ptRenderAdminDashboard();
      ptToast("Opportunity published.", "success");
      addOppForm.reset();
      document.getElementById("add-opp-modal").classList.remove("open");
    });
  }

  const adminSearch = document.getElementById("admin-opp-search");
  const adminType = document.getElementById("admin-opp-type");
  if (adminSearch && adminType) {
    adminSearch.addEventListener("input", ptRenderAdminDashboard);
    adminType.addEventListener("change", ptRenderAdminDashboard);
  }

  const adminOppTable = document.getElementById("admin-opp-tbody");
  if (adminOppTable) {
    adminOppTable.addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-admin-delete]");
      if (!deleteButton || !confirm("Remove this opportunity?")) return;
      const id = deleteButton.dataset.adminDelete;
      PT.write("pt_opportunities", PT.getOpportunities().filter((opportunity) => opportunity.id !== id));
      ptRenderAdminDashboard();
      ptToast("Opportunity removed.", "success");
    });
  }

  const exportButton = document.getElementById("export-applications");
  if (exportButton) {
    exportButton.addEventListener("click", () => {
      const rows = [["Company", "Role", "Type", "Applied Date", "Status", "Deadline"], ...PT.getApplications().map((app) => [app.company, app.role, app.type, app.appliedDate, app.status, app.deadline])];
      const table = `<table><thead><tr>${rows[0].map((heading) => `<th>${heading}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map((row) => `<tr>${row.map((value) => `<td>${String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      const excelDocument = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>table{border-collapse:collapse}th,td{border:1px solid #999;padding:6px}th{font-weight:bold;background:#e9eef5}</style></head><body>${table}</body></html>`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([excelDocument], { type: "application/vnd.ms-excel" }));
      link.download = "placetrack-applications.xls";
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }
});
