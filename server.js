const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// ---------- YOUR CV DATA ----------
const data = {
  work: [
    {
      icon: "fa-solid fa-robot",
      company: "AIRLABS (Artificial Intelligence & Robotics Laboratory)",
      role: "Data & AI Robotics Intern",
      date: "2026 – Present",
      desc: "Collaborated on robotics system integration, computer vision algorithms, and embedded AI development. Designed, trained, and evaluated data pipelines for real-time sensing, autonomous systems, and control tasks.",
      tags: ["Lagos", "Internship", "Remote"],
    },
    {
      icon: "fa-solid fa-laptop-code",
      company: "Independent Data Scientist & Digital Content Creator",
      role: "Senior Data Scientist / Creator",
      date: "Jan 2023 – Present",
      desc: "Architected automated data engineering pipelines, predictive machine learning models, and short-form educational technical media packages.",
      tags: ["Lagos / Remote", "Full Time"],
    },
    {
      icon: "fa-solid fa-microchip",
      company: "Student Industrial Work Experience Scheme (SIWES)",
      role: "Data & Systems Engineering Intern",
      date: "2026 – 2026",
      desc: "Engineered cloud notebook scripts, automated data processing pipelines, and embedded system prototypes while conducting multithreaded systems execution.",
      tags: ["Lagos", "Full Time"],
    },
  ],
  education: [
    {
      icon: "fa-solid fa-graduation-cap",
      company: "University of Lagos",
      role: "B.Sc. Computer Science",
      date: "2022 – 2027",
      desc: "Focused on data structures, operating systems, multithreaded system synchronization, and data science applications. Completed capstone research on transaction security and computerized systems under the supervision of Dr. Alamu.",
      tags: [],
    },
    {
      icon: "fa-solid fa-award",
      company: "WorldQuant University",
      role: "Applied Data Science Lab Certificate",
      date: "2026",
      desc: "Completed intensive hands-on coursework in statistical analysis, machine learning workflows, and data visualizations using Python toolchains.",
      tags: [],
    },
  ],
  skills: {
    "Data & AI": [
      "Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Deep Learning",
      "Computer Vision", "Data Visualization (Seaborn)", "Automated Data Pipelines", "Method Chaining",
    ],
    "Robotics & Systems": [
      "Robotics System Integration", "Embedded AI", "Multithreaded Systems", "Cloud Notebook Scripting",
    ],
    "Tools & Technologies": [
      "VS Code", "Git/GitHub", "Microsoft SQL Server", "Google Colab",
      "Ollama / Local LLMs", "Node.js", "HTML5/CSS3",
    ],
  },
  tools: [
    { name: "Node.js",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "VS Code",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
    { name: "Git",          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "GitHub",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
    { name: "SQL Server",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" },
    { name: "Google Colab", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecolab/googlecolab-original.svg" },
    { name: "Ollama",       icon: "https://cdn.simpleicons.org/ollama" },
    { name: "HTML5",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
    { name: "CSS3",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  ],
};

// ---------- ROUTES ----------
app.get("/api/data", (req, res) => res.json(data));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contact.html"));
});

// Downloads whichever .pdf is inside public/files/
app.get("/download-cv", (req, res) => {
  const dir = path.join(__dirname, "public", "files");
  let pdf;
  try {
    pdf = fs.readdirSync(dir).find((f) => f.toLowerCase().endsWith(".pdf"));
  } catch (e) {}

  if (!pdf) {
    return res.status(404).send("CV not found. Put your PDF inside public/files/");
  }
  res.download(path.join(dir, pdf), "Lawal-Olayinka-Toheeb-CV.pdf");
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Please add your name, a valid email and a message." });
  }

  console.log("\n--- New contact message ---");
  console.log({ name, email, phone, subject, message });

  res.json({ ok: true });
});

// ---------- START SERVER (tries the next port if one is busy) ----------
function start(port) {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      start(port + 1);
    } else {
      throw err;
    }
  });
}

start(Number(PORT));