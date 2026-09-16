/* ============================================================
   KERANGKA APLIKASI
   ------------------------------------------------------------
   Tugasnya cuma tiga:
     1. menyusun navigasi dari daftar modul
     2. memuat modul saat PERTAMA KALI dibuka (bukan di awal)
     3. mengurus progres dan bilah kemajuan

   Catatan penting soal pemuatan malas:
   dulu semua modul dibangun sekaligus saat halaman dimuat,
   padahal panelnya masih tersembunyi. Akibatnya lebar elemen
   terbaca 0 dan visual Josephus tergambar menumpuk di pojok.
   Dengan membangun modul hanya saat dibuka, seluruh kelas bug
   itu hilang dengan sendirinya.
   ============================================================ */

import { MODUL, KELOMPOK, muatModul } from './core/registry.js';
import { buatIds } from './core/ids.js';
import * as simpan from './core/storage.js';
import { pasangTab } from './core/ui.js';

const nav = document.getElementById('nav');
const utama = document.getElementById('main');
const sudahDibangun = new Set();

/* ---------- navigasi ---------- */
function susunNav() {
  let kelompokTerakhir = '';
  MODUL.forEach((m) => {
    if (m.kelompok !== kelompokTerakhir) {
      const g = document.createElement('div');
      g.className = 'grp';
      g.textContent = m.kelompok;
      nav.appendChild(g);
      kelompokTerakhir = m.kelompok;
    }
    const a = document.createElement('a');
    a.href = '#' + m.id;
    a.dataset.id = m.id;
    a.innerHTML = `<span class="n">${m.n}</span><span data-judul>…</span><span class="dot"></span>`;
    a.onclick = (e) => { e.preventDefault(); buka(m.id); };
    nav.appendChild(a);
  });
}

/* ---------- panel kosong untuk tiap modul ---------- */
function susunPanel() {
  MODUL.forEach((m) => {
    const p = document.createElement('section');
    p.className = 'pane';
    p.id = 'p-' + m.id;
    p.innerHTML = `<div class="memuat" style="padding:40px 0;text-align:center;color:var(--tinta-3);
      font-family:var(--mono);font-size:13px">memuat modul…</div>`;
    utama.appendChild(p);
  });
}

/* ---------- membangun isi modul (sekali saja) ---------- */
async function bangun(id) {
  if (sudahDibangun.has(id)) return;
  const panel = document.getElementById('p-' + id);
  let mod;
  try {
    mod = await muatModul(id);
  } catch (err) {
    panel.innerHTML = `<div class="note warn"><b>Modul gagal dimuat.</b><br>
      ${String(err.message || err)}<br><br>
      Kalau kamu membuka berkas ini langsung dari komputer (alamatnya diawali
      <code>file://</code>), browser memang memblokirnya. Jalankan lewat server lokal,
      misalnya dengan perintah <code>python -m http.server</code> di dalam foldernya,
      lalu buka <code>http://localhost:8000</code>.</div>`;
    return;
  }

  const ids = buatIds(id, panel);
  panel.innerHTML = `
    <div class="eyebrow">Modul ${mod.n} · ${mod.kelompok}</div>
    <h2 class="title">${mod.judul}</h2>
    <p class="lede">${mod.lede}</p>
    <div class="meta">${(mod.lencana || []).join('')}</div>
    <div class="badan"></div>
    <hr class="r">
    <label class="chk" style="border:1.5px solid var(--garis-tebal);background:var(--putih);border-radius:8px">
      <input type="checkbox" id="${ids.i('selesai')}">
      <span><b>Tandai modul ini selesai</b> — setelah kamu bisa menjelaskan polanya tanpa melihat catatan.</span>
    </label>`;

  const badan = panel.querySelector('.badan');
  try {
    mod.bangun(badan, { ids, pasangTab: (nama) => pasangTab(panel, ids, nama), panel });
  } catch (err) {
    badan.innerHTML = `<div class="note warn"><b>Terjadi kesalahan saat membangun modul.</b><br>
      <code>${String(err.message || err)}</code></div>`;
    console.error('[modul ' + id + ']', err);
  }

  const cb = ids.q('selesai');
  cb.checked = simpan.modulSelesai(id);
  cb.closest('.chk').classList.toggle('done', cb.checked);
  cb.onchange = () => {
    simpan.tandaiModul(id, cb.checked);
    cb.closest('.chk').classList.toggle('done', cb.checked);
  };

  sudahDibangun.add(id);
}

/* ---------- berpindah modul ---------- */
async function buka(id) {
  if (!MODUL.some((m) => m.id === id)) id = MODUL[0].id;
  document.querySelectorAll('.pane').forEach((p) => p.classList.toggle('on', p.id === 'p-' + id));
  document.querySelectorAll('nav a').forEach((a) => a.classList.toggle('on', a.dataset.id === id));
  tutupMenu();
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  await bangun(id);
}

/* ---------- bilah kemajuan ---------- */
function perbaruiKemajuan() {
  const selesai = MODUL.filter((m) => simpan.modulSelesai(m.id)).length;
  document.getElementById('ptxt').textContent = selesai + '/' + MODUL.length;
  document.getElementById('pb').style.width = (selesai / MODUL.length * 100) + '%';
  document.querySelectorAll('nav a[data-id]').forEach((a) =>
    a.classList.toggle('done', simpan.modulSelesai(a.dataset.id)));
}

/* ---------- judul di navigasi (diambil tanpa mengunduh modul) ---------- */
import { JUDUL } from './core/judul.js';
function isiJudulNav() {
  document.querySelectorAll('nav a[data-id]').forEach((a) => {
    const t = a.querySelector('[data-judul]');
    if (t) t.textContent = JUDUL[a.dataset.id] || a.dataset.id;
  });
}


/* ---------- laci navigasi di layar kecil ----------
   Ditambahkan bersama perbaikan tampilan: tirai gelap supaya jelas
   bahwa ini laci, plus tombol Escape untuk menutupnya. */
function siapkanMenu() {
  const tombol = document.getElementById('mb');
  const tirai = document.getElementById('tirai');

  const setel = (buka) => {
    nav.classList.toggle('open', buka);
    tirai.classList.toggle('on', buka);
    tirai.hidden = !buka;
    tombol.setAttribute('aria-expanded', String(buka));
    // kunci gulir halaman di belakang laci
    document.body.style.overflow = buka ? 'hidden' : '';
  };

  tombol.onclick = () => setel(!nav.classList.contains('open'));
  tirai.onclick = () => setel(false);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) setel(false);
  });
  // dipanggil juga dari buka() saat modul dipilih
  tutupMenu = () => setel(false);
}
let tutupMenu = () => {};

/* ---------- mulai ---------- */
async function mulai() {
  susunNav();
  susunPanel();
  isiJudulNav();
  siapkanMenu();
  await simpan.muat();
  simpan.saatBerubah(perbaruiKemajuan);
  perbaruiKemajuan();
  window.addEventListener('hashchange', () => buka(location.hash.slice(1)));
  await buka((location.hash || '#' + MODUL[0].id).slice(1));
}

mulai();
