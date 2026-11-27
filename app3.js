(() => {
  "use strict";
  const data = window.CLASSVOICE_DATA;
  const $ = (selector) => document.querySelector(selector);
  const savedVotes = JSON.parse(localStorage.getItem("classvoice-demo-votes") || "[]");
  const state = { concerns: data.demoConcerns.map(x => ({...x})), supported: new Set(savedVotes), currentView: "home" };
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const niceCount = n => String(n).padStart(2, "0");

  function notify(message) {
    const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function navigate(view) {
    state.currentView = view;
    document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === `view-${view}`));
    document.querySelectorAll(".nav-link").forEach(el => el.classList.toggle("active", el.dataset.view === view));
    const labels = {home:"Overview", concerns:"Student pulse", submit:"Raise a concern", reports:"Class insights", timetable:"Faculty & subjects", privacy:"Privacy centre"};
    $("#crumb").textContent = labels[view] || "Overview";
    if (view === "concerns") renderConcerns();
    if (view === "reports") renderReports();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  document.querySelectorAll("[data-view]").forEach(el => el.addEventListener("click", () => navigate(el.dataset.view)));
  document.querySelectorAll("[data-jump]").forEach(el => el.addEventListener("click", () => navigate(el.dataset.jump)));

  function populateFaculty() {
    const selects = [$("#facultySelect"), $("#filterFaculty")];
    const uniqueFaculty = [...new Map(data.faculty.map(f => [f.name, f])).values()];
    uniqueFaculty.forEach(f => {
      const option = document.createElement("option"); option.value = f.id; option.textContent = f.name;
      selects[0].append(option.cloneNode(true));
      const filter = document.createElement("option"); filter.value = f.name; filter.textContent = f.name; selects[1].append(filter);
    });
    $("#facultyTable").innerHTML = data.faculty.map(f => `<tr><td>${escapeHTML(f.day)} · ${escapeHTML(f.time)}</td><td>${escapeHTML(f.name)}</td><td>${escapeHTML(f.subject)} · ${escapeHTML(f.code)}</td><td>${escapeHTML(f.room)} · ${escapeHTML(f.type)}</td></tr>`).join("");
    $("#subjectSelect").innerHTML = '<option value="">Select subject</option>' + [...new Set(data.faculty.map(s => s.subject))].map(s => `<option>${escapeHTML(s)}</option>`).join("");
    const notes = $("#dayNotes");
    if (notes) notes.innerHTML = data.dayNotes.map(n => `<div class="day-note"><strong>${escapeHTML(n.day)} · ${escapeHTML(n.date)}</strong><span>${escapeHTML(n.note)}</span></div>`).join("");
  }
  function updateStats() {
    $("#statConcerns").textContent = niceCount(state.concerns.length);
    $("#statVotes").textContent = niceCount(state.concerns.reduce((sum,x)=>sum+x.support,0));
    $("#statFaculty").textContent = niceCount(new Set(state.concerns.map(x=>x.faculty)).size);
  }
  function categoryTotals() {
    const map = new Map();
    state.concerns.forEach(x => map.set(x.category,(map.get(x.category)||0)+x.support));
    return [...map.entries()].sort((a,b)=>b[1]-a[1]);
  }
  function renderCategoryBars(target, entries) {
    const max = Math.max(1,...entries.map(x=>x[1]));
    target.innerHTML = entries.length ? entries.map(([name,value]) => `<div class="category-row"><b>${escapeHTML(name)}</b><span>${value} support</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(value/max*100)}%"></div></div></div>`).join("") : '<p class="muted">No data yet.</p>';
  }
  function renderHome() {
    updateStats(); renderCategoryBars($("#homeCategories"),categoryTotals().slice(0,4));
  }
  function renderConcerns() {
    const search = $("#searchConcerns").value.trim().toLowerCase();
    const faculty = $("#filterFaculty").value;
    const sort = $("#sortConcerns").value;
    const period = $("#periodConcerns").value;
    const today = new Date().toLocaleDateString();
    let list = state.concerns.filter(x => (!faculty || x.faculty===faculty) && (!search || [x.title,x.body,x.subject,x.category,x.faculty].join(" ").toLowerCase().includes(search)) && (period !== "today" || new Date(x.createdAt).toLocaleDateString() === today));
    list.sort((a,b)=>sort==="support" ? b.support-a.support : sort==="least" ? a.support-b.support : new Date(b.createdAt)-new Date(a.createdAt));
    $("#concernFeed").innerHTML = list.length ? list.map(x => {
      const done = state.supported.has(x.id);
      return `<article class="concern-card"><div class="card-meta"><span class="faculty-chip">${escapeHTML(x.faculty)}</span><span class="status-chip">${escapeHTML(x.status)}</span></div><div class="card-subject">${escapeHTML(x.subject)} · ${escapeHTML(x.category)}</div><h3>${escapeHTML(x.title)}</h3><p>${escapeHTML(x.body)}</p><div class="card-bottom"><button class="support-button" data-support="${escapeHTML(x.id)}" ${done?"disabled":""}><span>♡</span>${done?"You relate":"I relate"} · ${x.support}</button><span class="support-count">No comments</span></div></article>`;
    }).join("") : '<div class="panel">No concerns match those filters.</div>';
  }
  $("#concernFeed").addEventListener("click", e => {
    const button = e.target.closest("[data-support]"); if (!button) return;
    const id = button.dataset.support; if (state.supported.has(id)) return;
    const item = state.concerns.find(x=>x.id===id); if (!item) return;
    state.supported.add(id); localStorage.setItem("classvoice-demo-votes", JSON.stringify([...state.supported])); item.support += 1; renderConcerns(); renderHome(); notify("Demo reaction saved in this browser only.");
  });
  ["#searchConcerns","#filterFaculty","#sortConcerns","#periodConcerns"].forEach(s => $(s).addEventListener(s==="#searchConcerns"?"input":"change",renderConcerns));

  $("#concernText").addEventListener("input", e => $("#charCount").textContent = `${e.target.value.length} / 900`);
  $("#facultySelect").addEventListener("change", e => {
    const f = data.faculty.find(x=>x.id===e.target.value);
    if (f) { $("#subjectSelect").value = f.subject; $("#subjectSelect").disabled = true; } else { $("#subjectSelect").disabled = false; }
  });
  $("#concernForm").addEventListener("submit", e => {
    e.preventDefault();
    const faculty = data.faculty.find(x=>x.id===$("#facultySelect").value);
    const subject = faculty ? faculty.subject : $("#subjectSelect").value;
    const category = $("#categorySelect").value;
    const body = $("#concernText").value.trim();
    if (!faculty || !subject || !category || body.length<20 || !$("#confirmRespect").checked) {
      $("#formFeedback").textContent = "Please complete each field and confirm the respectful-feedback guidelines."; return;
    }
    const id = `local-${Date.now()}`;
    state.concerns.unshift({id,facultyId:faculty.id,faculty:faculty.name,subject,category,title:body.length>75?body.slice(0,72)+"…":body,body,support:0,status:"Local demo entry",createdAt:new Date().toISOString()});
    e.target.reset(); $("#subjectSelect").disabled=false; $("#charCount").textContent="0 / 900";
    $("#formFeedback").textContent = "Added to this browser's temporary demo feed. Nothing was sent to a server.";
    renderHome(); navigate("concerns"); notify("Local demo entry added.");
  });


  function renderTrends() {
    const categorySelect = $("#trendCategory");
    const categories = [...new Set(data.demoTrendHistory.flatMap(w => Object.keys(w.categories || {})))];
    const previous = categorySelect.value || "all";
    categorySelect.innerHTML = '<option value="all">All concerns</option>' + categories.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
    categorySelect.value = categories.includes(previous) ? previous : "all";
    const metric = $("#trendMetric").value;
    const selected = categorySelect.value;
    const points = data.demoTrendHistory.map(week => ({
      label: week.week,
      value: metric === "support"
        ? (selected === "all" ? week.support : (week.categories?.[selected] || 0) * 3)
        : (selected === "all" ? week.concerns : (week.categories?.[selected] || 0))
    }));
    const values = points.map(p => p.value);
    const first = values[0] || 0, last = values[values.length-1] || 0;
    const delta = last-first;
    const direction = delta > 0 ? "increasing" : delta < 0 ? "decreasing" : "steady";
    const icon = delta > 0 ? "↗" : delta < 0 ? "↘" : "→";
    const unit = metric === "support" ? "support reactions" : "concerns";
    $("#trendSummary").innerHTML = `<div class="trend-stat"><strong>${icon} ${direction}</strong><span>${Math.abs(delta)} ${unit} vs first week</span></div><div class="trend-stat"><strong>${last}</strong><span>${unit} in latest week</span></div><div class="trend-stat"><strong>${points.length}</strong><span>weeks shown</span></div>`;
    const width=640, height=220, pad=30, max=Math.max(1,...values), min=0;
    const coords=points.map((pt,i)=>({x:pad+(points.length===1?0:i*(width-2*pad)/(points.length-1)),y:height-pad-(pt.value-min)/(max-min||1)*(height-2*pad)}));
    const poly=coords.map(c=>`${c.x},${c.y}`).join(" ");
    const grid=[0.25,0.5,0.75,1].map(r=>`<line x1="${pad}" y1="${height-pad-r*(height-2*pad)}" x2="${width-pad}" y2="${height-pad-r*(height-2*pad)}" class="trend-gridline"/>`).join("");
    const circles=coords.map((c,i)=>`<circle cx="${c.x}" cy="${c.y}" r="5" class="trend-point"><title>${escapeHTML(points[i].label)}: ${points[i].value}</title></circle><text x="${c.x}" y="${height-5}" text-anchor="middle" class="trend-axis">${escapeHTML(points[i].label)}</text><text x="${c.x}" y="${c.y-13}" text-anchor="middle" class="trend-value">${points[i].value}</text>`).join("");
    $("#trendChart").innerHTML=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHTML(unit)} by week">${grid}<polyline points="${poly}" class="trend-line"/>${circles}</svg>`;
    $("#trendFootnote").textContent = "Illustrative sample trend only — not actual student submissions. In production, weekly counts will be calculated from real dated records, with privacy thresholds and no voter identities.";
  }
  $("#trendCategory").addEventListener("change", renderTrends);
  $("#trendMetric").addEventListener("change", renderTrends);

  function renderReports() {
    const byFaculty = new Map(), byCategory = new Map();
    state.concerns.forEach(x => { byFaculty.set(x.faculty,(byFaculty.get(x.faculty)||0)+x.support); byCategory.set(x.category,(byCategory.get(x.category)||0)+x.support); });
    const facultyEntries=[...byFaculty.entries()].sort((a,b)=>b[1]-a[1]);
    const categoryEntries=[...byCategory.entries()].sort((a,b)=>b[1]-a[1]);
    const makeLines = entries => {
      const max=Math.max(1,...entries.map(x=>x[1]));
      return entries.map(([name,value])=>`<div class="report-line"><b>${escapeHTML(name)}</b><span>${value} support</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(value/max*100)}%"></div></div></div>`).join("") || "<p>No data.</p>";
    };
    $("#facultyReport").innerHTML=makeLines(facultyEntries); $("#categoryReport").innerHTML=makeLines(categoryEntries);
    renderTrends();
    const tracker = $("#actionTracker");
    if (tracker) tracker.innerHTML = [...state.concerns].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(x => `<div class="tracker-row"><div><b>${escapeHTML(x.title)}</b><small>${escapeHTML(x.faculty)} · ${escapeHTML(x.subject)}</small></div><span class="status-chip">${escapeHTML(x.status)}</span></div>`).join("");
  }
  $("#exportReport").addEventListener("click", () => {
    const rows=[["Faculty","Subject","Category","Concern title","Support count","Status"]];
    state.concerns.forEach(x=>rows.push([x.faculty,x.subject,x.category,x.title,String(x.support),x.status]));
    const csv=rows.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="classvoice-demo-aggregate.csv";a.click();URL.revokeObjectURL(url);notify("Demo CSV exported. Not an official report.");
  });

  let deferredInstallPrompt = null;
  const installButton = $("#installApp");
  const installHelp = $("#installHelp");
  function showInstallHelp(message) {
    $("#installHelpText").textContent = message || "On Android, open the browser menu and choose Install app. On iPhone, open Safari's Share menu and choose Add to Home Screen.";
    installHelp.hidden = false;
  }
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.textContent = "↓ Install app";
  });
  installButton.addEventListener("click", async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
    } else {
      showInstallHelp();
    }
  });
  $("#closeInstallHelp").addEventListener("click", () => installHelp.hidden = true);
  window.addEventListener("appinstalled", () => notify("CLASSVOICE installed successfully."));

  $("#themeToggle").addEventListener("click",()=>document.body.classList.toggle("dark"));
  populateFaculty(); renderHome(); renderConcerns(); renderReports();
})();
