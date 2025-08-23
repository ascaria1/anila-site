// assets/js/content-loader.js
(function () {
  const JSON_URL = "assets/content.json";

  const deepGet = (obj, path) =>
    path.split(".").reduce((acc, k) => (acc && k in acc ? acc[k] : undefined), obj);

  const tpl = (id) => {
    const t = document.getElementById(id);
    return t ? t.content.firstElementChild : null;
  };

  function setDataKeys(content) {
    document.querySelectorAll("[data-key]").forEach((el) => {
      const val = deepGet(content, el.dataset.key);
      if (val == null) return;
      el.textContent = val; // safe (no HTML injection)
    });
  }

  function renderAboutBoxes(content) {
    const root = document.getElementById("about-boxes");
    if (!root) return;

    const boxes = deepGet(content, "about.boxes") || [];
    root.innerHTML = "";

    boxes.forEach((b, idx) => {
      const box = document.createElement("div");
      box.className = "about__box";

      // pick icon class per index (you can switch to JSON later if needed)
      const iconClass = idx === 0 ? "bxs-award" : idx === 1 ? "bxs-briefcase-alt" : "bxs-graduation";

      box.innerHTML = `
        <i class='bx ${iconClass} about__icon'></i>
        <h3 class="about__title"></h3>
        <span class="about__subtitle"></span>
      `;
      box.querySelector(".about__title").textContent = b.title || "";
      box.querySelector(".about__subtitle").textContent = b.subtitle || "";
      root.appendChild(box);
    });
  }

  function renderTimelines(content) {
    const companies = deepGet(content, "work.companies") || [];
    const companyMap = new Map(companies.map((c) => [c.id, c.entries || []]));

    ["shell", "capgemini"].forEach((id) => {
      const timelineEl = document.getElementById(id);
      if (!timelineEl) return;

      const entries = companyMap.get(id) || [];
      timelineEl.innerHTML = "";

      entries.forEach((e) => {
        const entryTpl = tpl("timeline-entry-tpl");
        const entry = entryTpl.cloneNode(true);

        entry.querySelector(".timeline__date").textContent = e.date || "";
        entry.querySelector(".timeline__position").textContent = e.position || "";

        const ul = entry.querySelector(".timeline__ul");
        (e.points || []).forEach((p) => {
          const liTpl = tpl("timeline-li-tpl");
          const li = liTpl.cloneNode(true);
          li.querySelector(".timeline__text").textContent = p;
          ul.appendChild(li);
        });

        timelineEl.appendChild(entry);
      });
    });
  }

  function renderSkills(content) {
    const root = document.getElementById("skills-root");
    if (!root) return;
    root.innerHTML = "";

    const cards = deepGet(content, "skills.cards") || [];
    cards.forEach((card) => {
      const node = tpl("skills-card-tpl").cloneNode(true);
      node.querySelector(".skills__title").textContent = card.title || "";

      const g1 = node.querySelector(".skills__group--1");
      const g2 = node.querySelector(".skills__group--2");

      const addItem = (grpRoot, item) => {
        const it = tpl("skills-item-tpl").cloneNode(true);
        it.querySelector(".skills__name").textContent = item.name || "";
        it.querySelector(".skills__level").textContent = item.level || "";
        grpRoot.appendChild(it);
      };

      const groups = card.groups || [];
      (groups[0] || []).forEach((i) => addItem(g1, i));
      (groups[1] || []).forEach((i) => addItem(g2, i));

      root.appendChild(node);
    });
  }

  function renderProjects(content) {
    const root = document.getElementById("projects-root");
    if (!root) return;
    root.innerHTML = "";

    const cards = deepGet(content, "projects.cards") || [];
    cards.forEach((proj) => {
      const node = tpl("project-card-tpl").cloneNode(true);
      node.classList.add(proj.categoryClass || "ds"); // keep MixItUp category
      const t = node.querySelector(".work__title");
      t.textContent = proj.title || "";
      t.title = proj.title || "";


      const img = node.querySelector(".work__img");
      if (img && proj.img) {
        img.src = proj.img;
        img.alt = proj.title ? `${proj.title} preview` : "project preview";
      }

      const descEl = node.querySelector(".work__desc");
      if (descEl && proj.desc) descEl.textContent = proj.desc;

      const a = node.querySelector(".work__button");
      if (a) a.href = proj.url || "#";

      root.appendChild(node);
    });
  }

  async function init() {
    try {
      const res = await fetch(JSON_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = await res.json();

      // Fill single texts
      setDataKeys(content);

      // Render dynamic lists
      renderAboutBoxes(content);
      renderTimelines(content);
      renderSkills(content);
      renderProjects(content);

      // Let your main.js / plugins re-init if needed
      document.dispatchEvent(new CustomEvent("content:ready"));
    } catch (err) {
      console.error("Failed to load JSON content:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
