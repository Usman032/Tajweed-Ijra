const content = document.getElementById("content");

let quranData = [];

// Load Quran JSON once
async function loadQuranData() {
  if (quranData.length === 0) {
    const res = await fetch("data/quran-tajweed.json");
    quranData = await res.json();
  }
}

// =======================
// 📘 LOAD BOOK
// =======================
async function loadBook() {
  const res = await fetch("data/book.json");
  const data = await res.json();

  content.innerHTML = "";

  data.forEach(section => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h2>${section.title}</h2>
      <p>${section.description}</p>
      ${section.examples.map(e => `<div class="ayah">${parseTajweed(e)}</div>`).join("")}
      <hr/>
    `;

    content.appendChild(div);
  });
}

// =======================
// 📖 LOAD QURAN
// =======================
async function loadSurah(surahNum) {
  await loadQuranData();

  content.innerHTML = `<h2>Surah ${surahNum}</h2>`;

  const verses = quranData.filter(v => v.surah == surahNum);

  verses.forEach(v => {
    const div = document.createElement("div");
    div.className = "ayah";
    div.innerHTML = parseTajweed(v.text);
    content.appendChild(div);
  });
}

// =======================
// 🎨 PARSE TAJWEED
// =======================
function parseTajweed(text) {
  return text
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

// =======================
// 📄 PDF EXPORT
// =======================
function downloadPDF() {
  const element = document.getElementById("content");

  html2pdf()
    .set({
      margin: 10,
      filename: "tajweed-book.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(element)
    .save();
}

// =======================
// 🔗 SHARE
// =======================
function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: "Tajweed Book",
      text: "Learn Tajweed بسهولة",
      url: window.location.href
    });
  } else {
    alert("Sharing not supported on this device");
  }
}

// Load book by default
loadBook();