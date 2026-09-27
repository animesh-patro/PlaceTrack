/* ==========================================================================
   PlaceTrack — applications.js
   Renders "My Applications" table and handles the Add Application form.
   ========================================================================== */

const PT_STATUS_OPTIONS = ["Saved", "Applied", "Assessment", "Technical Interview", "HR Interview", "Selected", "Rejected"];
const PT_STATUS_ORDER = ["Saved", "Applied", "Assessment", "Technical Interview", "HR Interview", "Selected"];

function ptRenderApplicationsTable() {
  const tbody = document.getElementById("applications-tbody");
  if (!tbody) return;

  const search = (document.getElementById("app-search")?.value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("app-status-filter")?.value || "";

  let applications = PT.getApplications();
  applications = applications.filter((a) => {
    const matchesSearch = !search || a.company.toLowerCase().includes(search) || a.role.toLowerCase().includes(search);
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const emptyState = document.getElementById("applications-empty");
  const tableWrap = document.getElementById("applications-table-wrap");

  if (applications.length === 0) {
    if (tableWrap) tableWrap.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (tableWrap) tableWrap.style.display = "block";
  if (emptyState) emptyState.style.display = "none";

  tbody.innerHTML = applications
    .map(
      (a) => `
    <tr data-id="${a.id}">
      <td><b>${a.company}</b></td>
      <td>${a.role}</td>
      <td>${a.type}</td>
      <td>${PT.formatDate(a.appliedDate)}</td>
      <td><span class="badge ${PT.badgeClass(a.status)}">${a.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" title="View" data-view="${a.id}">👁</button>
          <button class="icon-btn" title="Edit" data-edit="${a.id}">✎</button>
          <button class="icon-btn danger" title="Delete" data-delete="${a.id}">🗑</button>
        </div>
      </td>
    </tr>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- My Applications page ---------------- */
  const tbody = document.getElementById("applications-tbody");
  if (tbody) {
    ptRenderApplicationsTable();

    ["app-search", "app-status-filter"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", ptRenderApplicationsTable);
    });

    tbody.addEventListener("click", (e) => {
      const viewBtn = e.target.closest("[data-view]");
      const editBtn = e.target.closest("[data-edit]");
      const deleteBtn = e.target.closest("[data-delete]");

      if (viewBtn) {
        const id = viewBtn.getAttribute("data-view");
        const app = PT.getApplications().find((a) => a.id === id);
        const modal = document.getElementById("app-modal");
        if (modal && app) {
          document.getElementById("app-modal-title").textContent = `${app.role} — ${app.company}`;
          const currentStatusIndex = PT_STATUS_ORDER.indexOf(app.status);
          const timeline = PT_STATUS_ORDER.map((status, index) => `<span class="badge ${index <= currentStatusIndex ? "badge-selected" : "badge-applied"}">${status}</span>`).join(" → ");
          document.getElementById("app-modal-body").innerHTML = `
            <div class="info-grid">
              <div class="info-item"><div class="lbl">Status</div><div class="val"><span class="badge ${PT.badgeClass(app.status)}">${app.status}</span></div></div>
              <div class="info-item"><div class="lbl">Job Type</div><div class="val">${app.type}</div></div>
              <div class="info-item"><div class="lbl">Applied Date</div><div class="val">${PT.formatDate(app.appliedDate)}</div></div>
              <div class="info-item"><div class="lbl">Deadline</div><div class="val">${PT.formatDate(app.deadline)}</div></div>
              <div class="info-item"><div class="lbl">Salary / Stipend</div><div class="val">${app.stipend || "—"}</div></div>
              <div class="info-item"><div class="lbl">Job URL</div><div class="val">${app.url || "—"}</div></div>
            </div>
            <div style="margin-top:16px;"><div class="lbl" style="font-size:.78rem;color:var(--muted);margin-bottom:8px;">Application progress</div><div class="event-tags">${timeline}</div></div>
            <div style="margin-top:16px;"><div class="lbl" style="font-size:.78rem;color:var(--muted);margin-bottom:6px;">Notes</div>
            <p class="mt-0">${app.notes || "No notes added."}</p></div>
          `;
          modal.classList.add("open");
        }
      }

      if (editBtn) {
        window.location.href = `add-application.html?edit=${editBtn.getAttribute("data-edit")}`;
      }

      if (deleteBtn) {
        const id = deleteBtn.getAttribute("data-delete");
        if (confirm("Delete this application? This cannot be undone.")) {
          const remaining = PT.getApplications().filter((a) => a.id !== id);
          PT.saveApplications(remaining);
          ptToast("Application deleted.", "success");
          ptRenderApplicationsTable();
        }
      }
    });
  }

  /* ---------------- Add / Edit Application page ---------------- */
  const addForm = document.getElementById("add-application-form");
  if (addForm) {
    const statusSelect = document.getElementById("aa-status");
    PT_STATUS_OPTIONS.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      statusSelect.appendChild(opt);
    });

    // Pre-fill when editing
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");
    let editingApp = null;
    if (editId) {
      editingApp = PT.getApplications().find((a) => a.id === editId);
      if (editingApp) {
        document.getElementById("form-title").textContent = "Edit Application";
        document.getElementById("aa-company").value = editingApp.company;
        document.getElementById("aa-role").value = editingApp.role;
        document.getElementById("aa-type").value = editingApp.type;
        document.getElementById("aa-location").value = editingApp.location || "";
        document.getElementById("aa-applied-date").value = editingApp.appliedDate;
        document.getElementById("aa-deadline").value = editingApp.deadline;
        document.getElementById("aa-url").value = editingApp.url || "";
        document.getElementById("aa-status").value = editingApp.status;
        document.getElementById("aa-stipend").value = editingApp.stipend || "";
        document.getElementById("aa-notes").value = editingApp.notes || "";
      }
    }

    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      const company = document.getElementById("aa-company");
      const role = document.getElementById("aa-role");
      const appliedDate = document.getElementById("aa-applied-date");

      [company, role, appliedDate].forEach(ptClearError);

      if (company.value.trim() === "") {
        ptShowError(company, "Company name is required.");
        valid = false;
      }
      if (role.value.trim() === "") {
        ptShowError(role, "Job role is required.");
        valid = false;
      }
      if (appliedDate.value === "") {
        ptShowError(appliedDate, "Application date is required.");
        valid = false;
      }
      if (!valid) return;

      const applications = PT.getApplications();
      const record = {
        id: editingApp ? editingApp.id : PT.uid("ap"),
        company: company.value.trim(),
        role: role.value.trim(),
        type: document.getElementById("aa-type").value,
        location: document.getElementById("aa-location").value.trim(),
        appliedDate: appliedDate.value,
        deadline: document.getElementById("aa-deadline").value,
        url: document.getElementById("aa-url").value.trim(),
        status: document.getElementById("aa-status").value,
        stipend: document.getElementById("aa-stipend").value.trim(),
        notes: document.getElementById("aa-notes").value.trim(),
      };

      if (editingApp) {
        const idx = applications.findIndex((a) => a.id === editingApp.id);
        applications[idx] = record;
      } else {
        applications.unshift(record);
      }
      PT.saveApplications(applications);
      ptToast("Application saved.", "success");
      setTimeout(() => (window.location.href = "applications.html"), 700);
    });
  }
});
