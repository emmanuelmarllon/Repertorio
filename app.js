const MAX_VISIBLE_BUTTONS = 10;

const searchInput = document.getElementById("searchInput");
const tabsContainer = document.querySelector(".tabs");
const contentsContainer = document.getElementById("contents");
const noResults = document.getElementById("noResults");

let tabButtons = [];
let tabContents = [];

function clearActiveTabs() {
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  tabContents.forEach((content) => {
    content.classList.remove("active");
    content.style.opacity = 0;
  });
}

function activateTab(id) {
  clearActiveTabs();
  const btn = tabButtons.find((b) => b.dataset.tab === id);
  const content = tabContents.find((c) => c.id === id);
  if (btn && content) {
    btn.classList.add("active");
    content.classList.add("active");
    setTimeout(() => (content.style.opacity = 1), 10);
  }
}

function createTabs(data) {
  tabsContainer.innerHTML = "";
  contentsContainer.innerHTML = "";
  tabButtons = [];
  tabContents = [];

  data.forEach((musica, index) => {
    // botão
    const btn = document.createElement("button");
    btn.className = "tab-button";
    btn.textContent = musica.titulo;
    btn.dataset.tab = musica.id;
    if (index === 0) btn.classList.add("active");
    tabsContainer.appendChild(btn);
    tabButtons.push(btn);

    // conteúdo
    const content = document.createElement("div");
    content.className = "tab-content";
    content.id = musica.id;
    if (index === 0) content.classList.add("active");
    content.style.opacity = index === 0 ? 1 : 0;
    content.innerHTML = `
      <strong>${musica.titulo}</strong><br>
      <em>${musica.artista}</em><br><br>
      <code style="white-space: pre-wrap;">${musica.cifras.replace(
        /\n/g,
        "<br>"
      )}</code>
    `;
    contentsContainer.appendChild(content);
    tabContents.push(content);

    btn.addEventListener("click", () => {
      activateTab(musica.id);
    });
  });
}

function handleSearch() {
  const filter = searchInput.value.toLowerCase();

  let visibleCount = 0;
  let firstVisibleBtn = null;

  tabButtons.forEach((btn) => {
    const matched = btn.textContent.toLowerCase().includes(filter);
    const allowed = visibleCount < MAX_VISIBLE_BUTTONS;
    if (matched && allowed) {
      btn.style.display = "inline-block";
      if (!firstVisibleBtn) firstVisibleBtn = btn;
      visibleCount++;
    } else {
      btn.style.display = "none";
    }
  });

  noResults.style.display = visibleCount === 0 ? "block" : "none";

  if (firstVisibleBtn) {
    firstVisibleBtn.click();
  } else {
    clearActiveTabs();
  }
}

searchInput.addEventListener("input", handleSearch);

fetch("musicas.json")
  .then((res) => res.json())
  .then((data) => {
    createTabs(data);
  })
  .catch((err) => {
    console.error("Erro ao carregar JSON:", err);
    noResults.textContent = "Erro ao carregar os dados.";
    noResults.style.display = "block";
  });
