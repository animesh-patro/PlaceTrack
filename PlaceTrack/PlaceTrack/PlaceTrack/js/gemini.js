/* PlaceTrack Gemini integration - direct browser demo (no backend). */
const PT_GEMINI_MODEL = "gemini-3.8-flash";
const PT_GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${PT_GEMINI_MODEL}:generateContent`;
const PT_GEMINI_KEY_STORAGE = "pt_gemini_api_key";

function ptGeminiKey(){ return localStorage.getItem(PT_GEMINI_KEY_STORAGE) || ""; }
function ptEscape(text){ const d=document.createElement("div"); d.textContent=text; return d.innerHTML.replace(/\n/g,"<br>"); }
function ptProfileContext(){
  const p = PT.getProfile() || {};
  const skills = Array.isArray(p.skills) ? p.skills.join(", ") : (p.skills || "Not provided");
  return `Student name: ${p.fullName || "Not provided"}\nCollege: ${p.college || "Not provided"}\nBranch: ${p.branch || "Not provided"}\nCGPA: ${p.cgpa || "Not provided"}\nSkills: ${skills}\nPreferred role: ${p.preferredRole || "Not provided"}\nPreferred location: ${p.preferredLocation || "Not provided"}`;
}
function ptAddChat(role, text){
  const wrap=document.getElementById("chat-messages"); if(!wrap) return;
  const row=document.createElement("div"); row.className=`chat-message ${role}`;
  row.innerHTML=`<div class="chat-avatar">${role === "user" ? "You" : "AI"}</div><div class="chat-bubble">${ptEscape(text)}</div>`;
  wrap.appendChild(row); wrap.scrollTop=wrap.scrollHeight;
}
function ptSetStatus(connected, label){ const el=document.getElementById("ai-status"); if(el){el.textContent=label || (connected?"Connected":"Not connected"); el.className=`badge ${connected?"badge-selected":"badge-rejected"}`;} }
async function ptCallGemini(prompt){
  const key=ptGeminiKey();
  if(!key) throw new Error("Connect your Gemini API key first.");
  const system=`You are PlaceTrack AI, a helpful placement and learning assistant for B.Tech students. Give practical, simple and accurate guidance about career preparation, interviews, programming, SQL, DSA, resumes and study plans. Use the student's profile context when useful. Do not claim to access live job openings unless the user provides the data. Keep answers structured with headings or numbered steps when helpful.\n\nStudent profile context:\n${ptProfileContext()}`;
  const response=await fetch(PT_GEMINI_URL,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":key},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{temperature:0.7,maxOutputTokens:1200}})});
  const data=await response.json();
  if(!response.ok) throw new Error(data?.error?.message || `Gemini request failed (${response.status})`);
  return data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("").trim() || "I couldn't generate a response. Please try again.";
}
async function ptTestGemini(){ return ptCallGemini("Reply with exactly: Gemini connection successful."); }
function ptOpenApiModal(){ const m=document.getElementById("api-modal"); if(m){m.classList.add("open");document.getElementById("gemini-key").value=ptGeminiKey();} }
function ptCloseApiModal(){ const m=document.getElementById("api-modal"); if(m)m.classList.remove("open"); }
function ptRenderProfileSummary(){
  const el=document.getElementById("ai-profile-summary"); if(!el)return;
  const p=PT.getProfile()||{}; const skills=Array.isArray(p.skills)?p.skills.join(", "):p.skills;
  el.textContent=`${p.fullName||"Student"} · ${p.branch||"Branch not set"} · CGPA ${p.cgpa||"—"} · Skills: ${skills||"Not added"}`;
}
document.addEventListener("DOMContentLoaded",()=>{
  ptRenderProfileSummary(); ptSetStatus(!!ptGeminiKey());
  document.getElementById("api-settings-btn")?.addEventListener("click",ptOpenApiModal);
  document.getElementById("api-close")?.addEventListener("click",ptCloseApiModal);
  document.getElementById("clear-gemini")?.addEventListener("click",()=>{localStorage.removeItem(PT_GEMINI_KEY_STORAGE);ptSetStatus(false);document.getElementById("gemini-key").value="";ptToast("Gemini key cleared.");});
  document.getElementById("save-gemini")?.addEventListener("click",async()=>{
    const key=document.getElementById("gemini-key").value.trim(); if(!key){ptToast("Enter your Gemini API key.","error");return;}
    const btn=document.getElementById("save-gemini"); btn.disabled=true; btn.textContent="Testing...";
    localStorage.setItem(PT_GEMINI_KEY_STORAGE,key);
    try{await ptTestGemini();ptSetStatus(true,"Connected");ptCloseApiModal();ptToast("Gemini connected successfully.","success");}
    catch(e){localStorage.removeItem(PT_GEMINI_KEY_STORAGE);ptSetStatus(false,"Connection failed");ptToast(e.message,"error");}
    finally{btn.disabled=false;btn.textContent="Save & Test";}
  });
  document.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>{document.getElementById("ai-input").value=b.dataset.prompt;document.getElementById("ai-input").focus();}));
  document.getElementById("ai-form")?.addEventListener("submit",async e=>{
    e.preventDefault(); const input=document.getElementById("ai-input"), button=document.getElementById("ai-send"); const prompt=input.value.trim(); if(!prompt)return;
    ptAddChat("user",prompt); input.value=""; button.disabled=true; button.textContent="Thinking...";
    try{ const answer=await ptCallGemini(prompt); ptAddChat("bot",answer); }
    catch(err){ ptAddChat("bot",`⚠ ${err.message}`); if(!ptGeminiKey())ptOpenApiModal(); }
    finally{button.disabled=false;button.textContent="Send";}
  });
});
