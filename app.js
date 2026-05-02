const content = document.getElementById("content");
const surahSelect = document.getElementById("surahSelect");

let quranData = [];
let currentMode = "book";

// ================= INIT =================
async function init() {
  const res = await fetch("data/quran-tajweed.json");
  quranData = await res.json();

  for (let i = 1; i <= 114; i++) {
    let opt = document.createElement("option");
    opt.value = i;
    opt.textContent = "سورۃ " + i;
    surahSelect.appendChild(opt);
  }

  surahSelect.style.display = "none";
  showBook();
}

// ================= BOOK =================
async function showBook() {
  currentMode = "book";
  surahSelect.style.display = "none";

  const res = await fetch("data/book.json");
  const data = await res.json();

  content.innerHTML = "";

  data.forEach(sec => {
    let div = document.createElement("div");
    div.className = "page";

    div.innerHTML = `
      <h2>${sec.title}</h2>
      <p>${sec.description}</p>
      ${sec.examples.map(e => `<div class="ayah">${parse(e)}</div>`).join("")}
    `;

    content.appendChild(div);
  });
}

// ================= QURAN =================
function showQuran() {
  currentMode = "quran";
  surahSelect.style.display = "inline";
  loadSurah(1);
}

surahSelect.addEventListener("change", () => {
  loadSurah(surahSelect.value);
});

function loadSurah(num) {
  content.innerHTML = `<h2>سورۃ ${num}</h2>`;

  let verses = quranData.filter(v => v.surah == num);

  verses.forEach((v, i) => {
    let div = document.createElement("div");
    div.className = "ayah";
    div.innerHTML = `${i+1}. ${parse(v.text)}`;
    content.appendChild(div);
  });
}

// ================= SEARCH =================
function searchAyah() {
  let term = document.getElementById("searchInput").value;

  content.innerHTML = "<h2>Search Results</h2>";

  let results = quranData.filter(v => v.text.includes(term));

  results.slice(0, 50).forEach(v => {
    let div = document.createElement("div");
    div.className = "ayah";
    div.innerHTML = parse(v.text);
    content.appendChild(div);
  });
}

// ================= TAJWEED =================
function parse(t) {
  return t
    .replace(/\[ghn\]/g, '<span class="ghn">')
    .replace(/\[\/ghn\]/g, '</span>')
    .replace(/\[idg\]/g, '<span class="idg">')
    .replace(/\[\/idg\]/g, '</span>')
    .replace(/\[ikh\]/g, '<span class="ikh">')
    .replace(/\[\/ikh\]/g, '</span>')
    .replace(/\[qlq\]/g, '<span class="qlq">')
    .replace(/\[\/qlq\]/g, '</span>')
    .replace(/\[mdd\]/g, '<span class="mdd">')
    .replace(/\[\/mdd\]/g, '</span>');
}

// ================= PDF =================
function downloadPDF() {
  html2pdf().from(content).save("tajweed-book.pdf");
}

// ================= SHARE =================
function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: "Tajweed Book",
      url: window.location.href
    });
  } else {
    alert("Share supported نہیں ہے");
  }
}

init();