const iconHtml = (i) =>
  i.icon ? `<i class="${i.icon}"></i>` : `<img src="${i.logo}" alt="">`;

const card = (i) => `
  <article class="card">
    <div class="icon">${iconHtml(i)}</div>
    <div>
      <h3>${i.company}</h3>
      <p class="role">${i.role}</p>
      <p class="date">${i.date}</p>
      <p class="desc">${i.desc}</p>
      ${i.tags.length ? `<div class="chips">${i.tags.map(t => `<span>${t}</span>`).join("")}</div>` : ""}
    </div>
  </article>`;

async function load() {
  try {
    const res = await fetch("/api/data");
    const d = await res.json();

    document.getElementById("work").innerHTML = d.work.map(card).join("");
    document.getElementById("education").innerHTML = d.education.map(card).join("");

    document.getElementById("skills").innerHTML = Object.entries(d.skills).map(([g, items]) => `
      <div class="skill-group">
        <h4>${g}</h4>
        <div class="chips">${items.map(s => `<span>${s}</span>`).join("")}</div>
      </div>`).join("");

    document.getElementById("tools").innerHTML = d.tools.map(t => `
      <div class="tool" title="${t.name}">
        <span class="logo-card">
          <img src="${t.icon}" alt="${t.name}" loading="lazy"
               onerror="this.parentNode.textContent=this.alt.slice(0,2)">
        </span>
        <span class="tool-name">${t.name}</span>
      </div>`).join("");
  } catch (err) {
    console.error("Could not load data:", err);
  }
  initReveal();
}

function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
  }, { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

// Highlight the nav link for the section you're viewing (only on-page # links)
const links = [...document.querySelectorAll(".pill-nav a")].filter(a => a.getAttribute("href").startsWith("#"));
const sections = links.map(a => document.querySelector(a.getAttribute("href")));
window.addEventListener("scroll", () => {
  const y = window.scrollY + 160;
  sections.forEach((sec, i) => {
    if (sec && sec.offsetTop <= y) {
      links.forEach(l => l.classList.remove("active"));
      links[i].classList.add("active");
    }
  });
});

load();