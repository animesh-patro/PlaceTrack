const PT_LEARNING_RESOURCES=[
{name:"Java",cat:"Programming",icon:"☕",links:[["W3Schools","https://www.w3schools.com/java/"],["GeeksforGeeks","https://www.geeksforgeeks.org/java/"],["Oracle Java Tutorials","https://docs.oracle.com/javase/tutorial/"]]},
{name:"Python",cat:"Programming",icon:"🐍",links:[["W3Schools","https://www.w3schools.com/python/"],["GeeksforGeeks","https://www.geeksforgeeks.org/python-programming-language/"],["Python Docs","https://docs.python.org/3/tutorial/"]]},
{name:"C / C++",cat:"Programming",icon:"⚙️",links:[["W3Schools C","https://www.w3schools.com/c/"],["GeeksforGeeks C++","https://www.geeksforgeeks.org/c-plus-plus/"],["Programiz","https://www.programiz.com/cpp-programming"]]},
{name:"JavaScript",cat:"Web Development",icon:"🟨",links:[["MDN","https://developer.mozilla.org/en-US/docs/Web/JavaScript"],["W3Schools","https://www.w3schools.com/js/"],["freeCodeCamp","https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/"]]},
{name:"HTML & CSS",cat:"Web Development",icon:"🌐",links:[["MDN HTML","https://developer.mozilla.org/en-US/docs/Web/HTML"],["W3Schools","https://www.w3schools.com/html/"],["freeCodeCamp","https://www.freecodecamp.org/learn/2022/responsive-web-design/"]]},
{name:"SQL",cat:"Database",icon:"🗄️",links:[["W3Schools","https://www.w3schools.com/sql/"],["GeeksforGeeks","https://www.geeksforgeeks.org/sql-tutorial/"],["HackerRank SQL","https://www.hackerrank.com/domains/sql"]]},
{name:"DSA",cat:"CS Fundamentals",icon:"🧠",links:[["GeeksforGeeks","https://www.geeksforgeeks.org/dsa-tutorial/"],["LeetCode","https://leetcode.com/problemset/"],["HackerRank","https://www.hackerrank.com/domains/algorithms"]]},
{name:"DBMS",cat:"CS Fundamentals",icon:"🗃️",links:[["GeeksforGeeks","https://www.geeksforgeeks.org/dbms/"],["W3Schools SQL","https://www.w3schools.com/sql/"],["TutorialsPoint","https://www.tutorialspoint.com/dbms/index.htm"]]},
{name:"Operating Systems",cat:"CS Fundamentals",icon:"💻",links:[["GeeksforGeeks","https://www.geeksforgeeks.org/operating-systems/"],["TutorialsPoint","https://www.tutorialspoint.com/operating_system/index.htm"],["Neso Academy","https://www.youtube.com/@nesoacademy"]]},
{name:"Computer Networks",cat:"CS Fundamentals",icon:"🌐",links:[["GeeksforGeeks","https://www.geeksforgeeks.org/computer-network-tutorials/"],["Cloudflare Learning","https://www.cloudflare.com/learning/network-layer/what-is-a-computer-network/"],["Cisco Skills for All","https://skillsforall.com/"]]},
{name:"AWS / Cloud",cat:"Cloud",icon:"☁️",links:[["AWS Skill Builder","https://skillbuilder.aws/"],["AWS Docs","https://docs.aws.amazon.com/"],["freeCodeCamp Cloud","https://www.freecodecamp.org/news/tag/aws/"]]},
{name:"Aptitude",cat:"Placement",icon:"🎯",links:[["IndiaBix","https://www.indiabix.com/"],["GeeksforGeeks Aptitude","https://www.geeksforgeeks.org/aptitude/"],["HackerRank","https://www.hackerrank.com/skills-verification"]]},
{name:"Interview Preparation",cat:"Placement",icon:"🎤",links:[["GeeksforGeeks Interview","https://www.geeksforgeeks.org/interview-preparation-for-software-developer/"],["LeetCode","https://leetcode.com/"],["HackerRank Interview Prep","https://www.hackerrank.com/interview/interview-preparation-kit"]]}
];
function ptRenderLearning(filter="all"){
 const wrap=document.getElementById("learning-grid"); if(!wrap)return;
 const list=PT_LEARNING_RESOURCES.filter(r=>filter==="all"||r.cat===filter);
 wrap.innerHTML=list.map(r=>`<article class="learning-card"><div class="learning-icon">${r.icon}</div><div class="learning-main"><span class="learning-cat">${r.cat}</span><h3>${r.name}</h3><div class="resource-links">${r.links.map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${n} ↗</a>`).join("")}</div><button class="btn btn-outline btn-sm study-reminder" data-subject="${r.name}">📅 Add study reminder</button></div></article>`).join("");
 wrap.querySelectorAll(".study-reminder").forEach(b=>b.addEventListener("click",()=>{localStorage.setItem("pt_prefill_calendar",JSON.stringify({title:`Study: ${b.dataset.subject}`,category:"Learning"}));window.location.href="calendar.html";}));
}
document.addEventListener("DOMContentLoaded",()=>{ptRenderLearning();document.getElementById("study-filter")?.addEventListener("change",e=>ptRenderLearning(e.target.value));});
