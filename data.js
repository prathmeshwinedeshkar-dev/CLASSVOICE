/*
 CLASSVOICE — VIT Pune · FY ET-D timetable transcription
 Source: user-provided LazyVITians screenshots, week of 23–28 Nov 2026.
 Important: screenshot-derived data is not independently verified by VIT.
 Reconfirm current semester, faculty allocation, rooms and lab batches before launch.
 Never put student names, emails, roll numbers or identity mappings in this file.
*/
window.CLASSVOICE_DATA = {
  institution: "Vishwakarma Institute of Technology, Pune",
  className: "First Year · Electronics & Telecommunication · ET-D",
  timetableReference: "https://prathmeshwinedeshkar-dev.github.io/Lazyvitians/#dv=ET-D&v=today&b=1&c=kon&d=all&w=0",
  timetableWeek: "23–28 November 2026",
  timetableSource: "Transcribed from screenshots supplied by the project owner",
  facultyVerified: false,
  faculty: [
    { id:"apv", name:"Apurva V. Varde", subject:"Logic & Quantitative Aptitude 1", code:"ES26103", room:"E214", day:"Monday", time:"12:00–14:00", type:"Theory" },
    { id:"sas", name:"Dr. Sheetal A. Sahare", subject:"Design Thinking & Ideation", code:"ES26207", room:"E304", day:"Monday", time:"15:00–16:00", type:"Theory" },
    { id:"afd", name:"Ashish F. Deokar", subject:"Programming for Engineers", code:"ES26104", room:"E103", day:"Monday", time:"16:00–18:00", type:"Lab · B1" },
    { id:"rsb", name:"Ramkrishna S. Bharsakade", subject:"Engineering Robotics", code:"ES26205", room:"E302", day:"Wednesday", time:"12:00–14:00", type:"Lab · B1" },
    { id:"rsb-theory", name:"Ramkrishna S. Bharsakade", subject:"Engineering Robotics", code:"ES26205", room:"E310", day:"Wednesday", time:"14:00–15:00", type:"Theory" },
    { id:"ai", name:"Amol Inamdar (visiting)", subject:"Language: English", code:"ES26108A", room:"E310", day:"Wednesday", time:"15:00–16:00", type:"Theory" },
    { id:"srb", name:"Shivling R. Borate", subject:"Calculus", code:"ES26201", room:"E310", day:"Wednesday", time:"16:00–17:00", type:"Theory" },
    { id:"raj", name:"Rahul A. Joshi", subject:"Environment Studies", code:"ES26206", room:"E310", day:"Wednesday", time:"17:00–18:00", type:"Theory" },
    { id:"srb-fri", name:"Shivling R. Borate", subject:"Calculus", code:"ES26201", room:"E215", day:"Friday", time:"12:00–13:00", type:"Theory" },
    { id:"scm", name:"Supriya C. Mahatme", subject:"Programming for Engineers", code:"ES26104", room:"E216", day:"Friday", time:"14:00–15:00", type:"Theory" },
    { id:"raj-fri", name:"Rahul A. Joshi", subject:"Environment Studies", code:"ES26206", room:"E216", day:"Friday", time:"15:00–16:00", type:"Theory" },
    { id:"srb-tut", name:"Shivling R. Borate", subject:"Calculus", code:"ES26201", room:"D115", day:"Friday", time:"16:00–17:00", type:"Tutorial · B1" },
    { id:"scm-sat", name:"Supriya C. Mahatme", subject:"Programming for Engineers", code:"ES26104", room:"E216", day:"Saturday", time:"08:00–09:00", type:"Theory" },
    { id:"srb-sat", name:"Shivling R. Borate", subject:"Calculus", code:"ES26201", room:"E216", day:"Saturday", time:"09:00–10:00", type:"Theory" },
    { id:"raj-sat", name:"Rahul A. Joshi", subject:"Environment Studies", code:"ES26206", room:"E216", day:"Saturday", time:"10:00–11:00", type:"Theory" }
  ],
  dayNotes: [
    {day:"Tuesday", date:"24 Nov 2026", note:"Holiday: Gurunanak Jayanti — classes are off."},
    {day:"Thursday", date:"26 Nov 2026", note:"No classes shown for this day."}
  ],
  // Synthetic weekly aggregates only to demonstrate the trend UI.
  // Replace with server-derived weekly aggregates before real student use.
  demoTrendHistory: [
    { week:"Oct 26", concerns:5, support:18, categories:{"Teaching & explanation":2,"Classroom experience":2,"Pace & workload":1} },
    { week:"Nov 02", concerns:7, support:25, categories:{"Teaching & explanation":3,"Classroom experience":2,"Pace & workload":2} },
    { week:"Nov 09", concerns:6, support:22, categories:{"Teaching & explanation":2,"Classroom experience":1,"Pace & workload":3} },
    { week:"Nov 16", concerns:9, support:34, categories:{"Teaching & explanation":4,"Classroom experience":3,"Pace & workload":2} },
    { week:"Nov 23", concerns:8, support:29, categories:{"Teaching & explanation":3,"Classroom experience":2,"Pace & workload":3} }
  ],
  demoConcerns: [
    { id:"demo-1", facultyId:"apv", faculty:"Apurva V. Varde", subject:"Logic & Quantitative Aptitude 1", category:"Teaching & explanation", title:"Could we slow down for difficult concepts?", body:"Illustrative sample only: a short recap after difficult concepts may help more students follow the lesson.", support:14, status:"Under review · demo", createdAt:"2026-11-20T10:00:00Z" },
    { id:"demo-2", facultyId:"sas", faculty:"Dr. Sheetal A. Sahare", subject:"Design Thinking & Ideation", category:"Classroom experience", title:"More time for questions during activities", body:"Illustrative sample only: a little more time for questions during activities may help students participate.", support:10, status:"Action planned · demo", createdAt:"2026-11-22T10:00:00Z" },
    { id:"demo-3", facultyId:"rsb", faculty:"Ramkrishna S. Bharsakade", subject:"Engineering Robotics", category:"Pace & workload", title:"Share lab expectations before the session", body:"Illustrative sample only: sharing the lab task and expected preparation in advance may help students use lab time well.", support:8, status:"Received · demo", createdAt:"2026-11-24T10:00:00Z" }
  ]
};
