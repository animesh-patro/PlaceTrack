/* ==========================================================================
   PlaceTrack — main.js
   Shared utilities, sample data, and UI wiring used across every page.
   ========================================================================== */

/* ---------------- Sample / seed data (Phase 1 — no backend) ---------------- */

const PT_SAMPLE_OPPORTUNITIES = [
  { id: "op1", company: "Microsoft", logo: "MS", role: "Software Intern", type: "Internship", location: "Hyderabad", ctc: "₹80,000/month", minCgpa: 7.5, branches: ["CSE", "IT", "ECE"], skills: ["DSA", "C++", "React"], deadline: "2026-10-05", driveDate: "2026-10-15", description: "Work with the Azure team on cloud-native tooling used by enterprise customers." },
  { id: "op2", company: "TCS", logo: "TCS", role: "Graduate Engineer Trainee", type: "Full-time", location: "Pune", ctc: "₹7.5 LPA", minCgpa: 6.0, branches: ["CSE", "IT", "ECE", "MECH", "EEE"], skills: ["Java", "SQL", "Communication"], deadline: "2026-09-28", driveDate: "2026-10-08", description: "Entry-level engineering role with a 3-month training program across TCS delivery units." },
  { id: "op3", company: "Infosys", logo: "IN", role: "System Engineer", type: "Full-time", location: "Bengaluru", ctc: "₹6.5 LPA", minCgpa: 6.5, branches: ["CSE", "IT", "ECE", "MECH"], skills: ["Java", "DBMS", "Problem Solving"], deadline: "2026-10-01", driveDate: "2026-10-12", description: "Join the Infosys engineering pool with rotations across product and services teams." },
  { id: "op4", company: "Amazon", logo: "AZ", role: "SDE Intern", type: "Internship", location: "Remote", ctc: "₹1,00,000/month", minCgpa: 8.0, branches: ["CSE", "IT"], skills: ["DSA", "System Design", "Python"], deadline: "2026-10-10", driveDate: "2026-10-20", description: "Build customer-facing features on the Amazon retail platform for a 6-month internship." },
  { id: "op5", company: "Wipro", logo: "WI", role: "Project Engineer", type: "Full-time", location: "Chennai", ctc: "₹5.8 LPA", minCgpa: 6.0, branches: ["CSE", "IT", "ECE", "EEE"], skills: ["SQL", "Java", "Testing"], deadline: "2026-10-18", driveDate: "2026-10-28", description: "Rotational program across application development and QA engineering tracks." },
  { id: "op6", company: "Deloitte", logo: "DL", role: "Analyst — Tech Consulting", type: "Full-time", location: "Hyderabad", ctc: "₹8.2 LPA", minCgpa: 7.0, branches: ["CSE", "IT", "MECH", "EEE"], skills: ["SQL", "Excel", "Communication"], deadline: "2026-10-22", driveDate: "2026-11-02", description: "Advise enterprise clients on technology transformation and process automation." },
];

const PT_SAMPLE_EVENTS = [
  { id: "ev1", company: "Microsoft", type: "Online Assessment", date: "2026-09-22", time: "10:00 AM", notes: "Covers DSA and aptitude. Duration 90 minutes.", status: "Upcoming" },
  { id: "ev2", company: "TCS", type: "Technical Interview", date: "2026-09-25", time: "2:30 PM", notes: "Focus on core Java and DBMS fundamentals.", status: "Upcoming" },
  { id: "ev3", company: "Infosys", type: "HR Interview", date: "2026-09-30", time: "11:00 AM", notes: "Bring updated resume and ID proof.", status: "Upcoming" },
  { id: "ev4", company: "Amazon", type: "Online Assessment", date: "2026-10-03", time: "6:00 PM", notes: "Two coding questions + work simulation.", status: "Upcoming" },
];

const PT_SAMPLE_APPLICATIONS = [
  { id: "ap1", company: "Microsoft", role: "Software Intern", type: "Internship", appliedDate: "2026-09-10", deadline: "2026-10-05", status: "Technical Interview", url: "", stipend: "₹80,000/month", notes: "First round cleared, waiting on technical round." },
  { id: "ap2", company: "TCS", role: "Graduate Engineer Trainee", type: "Full-time", appliedDate: "2026-09-08", deadline: "2026-09-28", status: "Applied", url: "", stipend: "₹7.5 LPA", notes: "" },
  { id: "ap3", company: "Infosys", role: "System Engineer", type: "Full-time", appliedDate: "2026-09-05", deadline: "2026-10-01", status: "Assessment", url: "", stipend: "₹6.5 LPA", notes: "Online test scheduled." },
  { id: "ap4", company: "Amazon", role: "SDE Intern", type: "Internship", appliedDate: "2026-09-12", deadline: "2026-10-10", status: "Selected", url: "", stipend: "₹1,00,000/month", notes: "Offer letter received!" },
  { id: "ap5", company: "Wipro", role: "Project Engineer", type: "Full-time", appliedDate: "2026-09-01", deadline: "2026-10-18", status: "Rejected", url: "", stipend: "₹5.8 LPA", notes: "" },
  { id: "ap6", company: "Deloitte", role: "Analyst — Tech Consulting", type: "Full-time", appliedDate: "2026-09-14", deadline: "2026-10-22", status: "HR Interview", url: "", stipend: "₹8.2 LPA", notes: "" },
];

const PT_PREP_SUBJECTS = [
  { id: "dsa", name: "Data Structures & Algorithms", progress: 65 },
  { id: "dbms", name: "DBMS", progress: 80 },
  { id: "os", name: "Operating Systems", progress: 55 },
  { id: "cn", name: "Computer Networks", progress: 45 },
  { id: "oop", name: "Object-Oriented Programming", progress: 90 },
  { id: "sql", name: "SQL", progress: 75 },
];

const PT_PREP_CHECKLIST = [
  { id: "c1", label: "Arrays & Strings — patterns and two pointers" },
  { id: "c2", label: "Linked Lists — reversal and cycle detection" },
  { id: "c3", label: "Trees & Graphs — traversals, BFS/DFS" },
  { id: "c4", label: "Dynamic Programming — top 30 problems" },
  { id: "c5", label: "SQL joins, subqueries and window functions" },
  { id: "c6", label: "OS — process scheduling and deadlocks" },
  { id: "c7", label: "CN — OSI model and TCP/IP handshake" },
  { id: "c8", label: "System design basics for interns" },
  { id: "c9", label: "Mock interview — 1 full round completed" },
  { id: "c10", label: "Resume reviewed and updated" },
];

/* ---------------- Storage helpers (no passwords ever stored) ---------------- */

const PT = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable — fail silently for this prototype */
    }
  },
  getApplications() {
    return this.read("pt_applications", PT_SAMPLE_APPLICATIONS);
  },
  saveApplications(list) {
    this.write("pt_applications", list);
  },
  getOpportunities() {
    return this.read("pt_opportunities", PT_SAMPLE_OPPORTUNITIES);
  },
  getSavedOpportunityIds() {
    return this.read("pt_saved_opportunities", []);
  },
  saveSavedOpportunityIds(list) {
    this.write("pt_saved_opportunities", list);
  },
  getChecklistState() {
    return this.read("pt_prep_checklist", {});
  },
  saveChecklistState(state) {
    this.write("pt_prep_checklist", state);
  },
  getProfile() {
    return this.read("pt_profile", null);
  },
  getCodingProfiles() {
    const saved = this.read("pt_coding_profile", []);
    return Array.isArray(saved) ? saved : saved ? [saved] : [];
  },
  saveCodingProfiles(profiles) {
    this.write("pt_coding_profile", profiles);
  },
  uid(prefix) {
    return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  },
  formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  },
  badgeClass(status) {
    const map = {
      Saved: "badge-saved",
      Applied: "badge-applied",
      Assessment: "badge-assessment",
      "Technical Interview": "badge-technical",
      "HR Interview": "badge-hr",
      Selected: "badge-selected",
      Rejected: "badge-rejected",
    };
    return map[status] || "badge-applied";
  },
};

/* ---------------- Shared form-validation helpers ---------------- */

function ptShowError(fieldEl, message) {
  const wrap = fieldEl.closest(".field");
  wrap.classList.add("has-error");
  const errorEl = wrap.querySelector(".error-text");
  if (errorEl) errorEl.textContent = message;
}

function ptClearError(fieldEl) {
  const wrap = fieldEl.closest(".field");
  wrap.classList.remove("has-error");
}

function ptIsEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function ptOpportunityMatchScore(opportunity, profile) {
  if (!profile) return 0;
  let score = 0;
  if (opportunity.branches.includes(profile.branch)) score += 40;
  if (Number(profile.cgpa) >= opportunity.minCgpa) score += 35;
  const skills = (profile.skills || []).map((skill) => skill.toLowerCase());
  score += Math.min(25, opportunity.skills.filter((skill) => skills.includes(skill.toLowerCase())).length * 10);
  return score;
}

/* ---------------- Toast ---------------- */

function ptToast(message, type) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "toast show" + (type ? " " + type : "");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* ---------------- Nav / sidebar wiring ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  // Public navbar mobile toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  // Sidebar mobile toggle
  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.querySelector(".sidebar");
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== menuBtn) {
        sidebar.classList.remove("open");
      }
    });
  }

  // Highlight active sidebar / nav link based on current file
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".side-link, .nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === page) link.classList.add("active");
  });

  // Logout buttons — clear session flags and go home
  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sessionStorage.removeItem("pt_user_name");
      sessionStorage.removeItem("pt_admin");
      window.location.href = "index.html";
    });
  });

  // Greet logged-in student where a placeholder exists
  const nameEl = document.querySelector("[data-user-name]");
  const storedName = sessionStorage.getItem("pt_user_name");
  if (nameEl && storedName) nameEl.textContent = storedName;

  const profile = PT.getProfile() || { fullName:"Student Name", email:"", college:"", branch:"CSE", cgpa:"", graduationYear:"", phone:"", location:"", tenth:"", twelfth:"", backlogs:0, github:"", linkedin:"", preferredRole:"", preferredLocation:"", workType:"Full-time", expectedSalary:"", skills:[], projects:[], certifications:[], resumeName:"" };
  const branchLabels = {CSE:"Computer Science & Engineering",IT:"Information Technology",ECE:"Electronics & Communication",EEE:"Electrical & Electronics",MECH:"Mechanical Engineering",CIVIL:"Civil Engineering"};
  document.querySelectorAll("[data-profile]").forEach((el)=>{ const key=el.dataset.profile; el.textContent = profile[key] !== undefined && profile[key] !== "" ? profile[key] : "—"; });
  const branchLabel=document.querySelector('[data-profile="branchLabel"]'); if(branchLabel) branchLabel.textContent=branchLabels[profile.branch]||profile.branch||"—";
  const avatar=document.querySelector("[data-profile-avatar]"); if(avatar) avatar.textContent=(profile.fullName||"Student").split(/\s+/).filter(Boolean).map(p=>p[0]).join("").slice(0,2).toUpperCase();
  const linkMap={github:profile.github,linkedin:profile.linkedin}; Object.entries(linkMap).forEach(([key,url])=>{const el=document.querySelector(`[data-profile-link="${key}"]`); if(el){if(url){el.href=url;el.style.display="inline";}else{el.style.display="none";}}});
  const skillsEl=document.querySelector("[data-profile-skills]"); if(skillsEl){skillsEl.replaceChildren(); (profile.skills||[]).forEach(s=>{const t=document.createElement("span");t.className="skill-tag";t.textContent=s;skillsEl.appendChild(t)}); if(!(profile.skills||[]).length) skillsEl.textContent="No skills added yet.";}
  const projectsEl=document.querySelector("[data-profile-projects]"); if(projectsEl){projectsEl.replaceChildren(); (profile.projects||[]).forEach(p=>{const x=document.createElement("div");x.className="profile-list-item";x.innerHTML=`<strong>${PT.escapeHtml ? PT.escapeHtml(p.name||p) : (p.name||p)}</strong><span>${p.tech||""}${p.description?" · "+p.description:""}</span>`;projectsEl.appendChild(x)}); if(!(profile.projects||[]).length) projectsEl.textContent="No projects added yet.";}
  const certEl=document.querySelector("[data-profile-certifications]"); if(certEl){certEl.replaceChildren(); (profile.certifications||[]).forEach(c=>{const x=document.createElement("div");x.className="profile-list-item";x.innerHTML=`<strong>${c.name||c}</strong><span>${c.issuer||""}${c.year?" · "+c.year:""}</span>`;certEl.appendChild(x)}); if(!(profile.certifications||[]).length) certEl.textContent="No certifications added yet.";}
  const completionKeys=["fullName","email","phone","college","branch","cgpa","graduationYear","tenth","twelfth","location","github","linkedin","preferredRole","preferredLocation","skills","projects","certifications","resumeName"]; const done=completionKeys.filter(k=>{const v=profile[k];return Array.isArray(v)?v.length>0:!!v}).length; const pct=Math.round(done/completionKeys.length*100); const pc=document.querySelector("[data-profile-completion]"); const pp=document.querySelector("[data-profile-progress]"); if(pc)pc.textContent=pct+"%";if(pp)pp.style.width=pct+"%";
  document.querySelectorAll("[data-profile-edit]").forEach(input=>{const key=input.dataset.profileEdit; let value=profile[key]??""; if(key==="skills")value=(profile.skills||[]).join(", "); if(key==="projects")value=(profile.projects||[]).map(p=>typeof p==="string"?p:[p.name,p.tech,p.description].filter(Boolean).join(" | ")).join("\n"); if(key==="certifications")value=(profile.certifications||[]).map(c=>typeof c==="string"?c:[c.name,c.issuer,c.year].filter(Boolean).join(" | ")).join("\n"); input.value=value;});
  const resumeInput=document.getElementById("resume-upload"); if(resumeInput) resumeInput.addEventListener("change",()=>{if(resumeInput.files[0]){const p={...PT.getProfile(),resumeName:resumeInput.files[0].name};PT.write("pt_profile",p);ptToast("Resume added to profile.","success");setTimeout(()=>location.reload(),400);}});
  const saveProfileButton=document.querySelector("[data-profile-save]"); if(saveProfileButton){saveProfileButton.addEventListener("click",()=>{const get=k=>document.querySelector(`[data-profile-edit="${k}"]`);const fullName=get("fullName").value.trim();const cgpa=get("cgpa").value.trim();if(fullName.length<2){ptToast("Enter your full name.","error");return;}if(cgpa && (Number(cgpa)<0||Number(cgpa)>10)){ptToast("CGPA must be between 0 and 10.","error");return;}const parseLines=(text,kind)=>text.split("\n").map(x=>x.trim()).filter(Boolean).map(line=>{const a=line.split("|").map(v=>v.trim());return kind==="project"?{name:a[0],tech:a[1]||"",description:a[2]||""}:{name:a[0],issuer:a[1]||"",year:a[2]||""};});const updated={...profile,fullName,email:get("email").value.trim(),phone:get("phone").value.trim(),location:get("location").value.trim(),college:get("college").value.trim(),branch:get("branch").value,cgpa,graduationYear:get("graduationYear").value.trim(),tenth:get("tenth").value.trim(),twelfth:get("twelfth").value.trim(),backlogs:get("backlogs").value.trim(),github:get("github").value.trim(),linkedin:get("linkedin").value.trim(),preferredRole:get("preferredRole").value.trim(),preferredLocation:get("preferredLocation").value.trim(),workType:get("workType").value,expectedSalary:get("expectedSalary").value.trim(),skills:get("skills").value.split(",").map(x=>x.trim()).filter(Boolean),projects:parseLines(get("projects").value,"project"),certifications:parseLines(get("certifications").value,"cert")};PT.write("pt_profile",updated);sessionStorage.setItem("pt_user_name",fullName.split(" ")[0]);ptToast("Profile updated successfully.","success");setTimeout(()=>location.reload(),500);});}

  // Generic modal wiring: [data-modal-open="id"] and [data-modal-close]
  document.querySelectorAll("[data-modal-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById(btn.getAttribute("data-modal-open"));
      if (modal) modal.classList.add("open");
    });
  });
  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".modal-overlay").classList.remove("open");
    });
  });
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });
});
