/* ============================================================
   PUSTAKA KOMPONEN
   ------------------------------------------------------------
   Semua fungsi di sini MENGEMBALIKAN STRING HTML.
   Modul menyusunnya jadi satu, memasangnya ke root, lalu
   memasang penangan tombol lewat helper ids.

   Tujuannya: modul cukup MENDESKRIPSIKAN isinya, tidak perlu
   menuliskan markup yang sama berulang-ulang.
   ============================================================ */

const lolos = (t) => String(t).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- KARTU biasa ---------- */
export function Kartu({ judul, sub, isi }) {
  return `<div class="card">
    ${judul ? `<h3>${judul}</h3>` : ''}
    ${sub ? `<p class="sub">${sub}</p>` : ''}
    ${isi || ''}
  </div>`;
}

/* ---------- LAB: kartu bergaya kertas berpetak ---------- */
export function Lab({ judul, petunjuk, isi }) {
  return `<div class="lab">
    <div class="lab-head"><b>${judul}</b>${petunjuk ? `<span class="hint">${petunjuk}</span>` : ''}</div>
    <div class="lab-body">${isi || ''}</div>
  </div>`;
}

/* ---------- BARIS KONTROL: input + tombol ---------- */
/*  kolom : [{id, label, nilai, min, maks, jenis:'angka'|'teks', lebar:true}]
    tombol: [{id, teks, gaya:'utama'|'alt'|'merah'}]                        */
export function Kontrol({ ids, kolom = [], tombol = [] }) {
  const f = kolom.map((k) => {
    const jenis = k.jenis === 'teks' ? 'text' : 'number';
    const batas = jenis === 'number'
      ? `${k.min !== undefined ? ` min="${k.min}"` : ''}${k.maks !== undefined ? ` max="${k.maks}"` : ''}`
      : '';
    return `<div class="f${k.lebar ? ' wide' : ''}">
      <label for="${ids.i(k.id)}">${k.label}</label>
      <input id="${ids.i(k.id)}" type="${jenis}" value="${lolos(k.nilai ?? '')}"${batas}>
    </div>`;
  }).join('');
  const b = tombol.map((t) =>
    `<button class="btn${t.gaya === 'alt' ? ' alt' : t.gaya === 'merah' ? ' red' : ''}" id="${ids.i(t.id)}">${t.teks}</button>`
  ).join('');
  return `<div class="ctl">${f}${b}</div>`;
}

/* ---------- AREA TEKS besar ---------- */
export function AreaTeks({ ids, id, label, nilai = '', baris = 7 }) {
  return `<div class="f wide" style="margin-bottom:12px">
    <label for="${ids.i(id)}">${label}</label>
    <textarea id="${ids.i(id)}" rows="${baris}" style="font-family:var(--mono);font-size:13px;
      padding:9px;border:1.5px solid var(--garis-tebal);border-radius:6px;width:100%">${lolos(nilai)}</textarea>
  </div>`;
}

/* ---------- KOTAK KELUARAN ---------- */
export function Keluaran({ ids, id, isi = '—', gaya = '' }) {
  return `<div class="out" id="${ids.i(id)}"${gaya ? ` style="${gaya}"` : ''}>${isi}</div>`;
}

/* ---------- WADAH untuk visual (SVG/grid) ---------- */
export function Wadah({ ids, id, gaya = '' }) {
  return `<div id="${ids.i(id)}"${gaya ? ` style="${gaya}"` : ''}></div>`;
}

/* ---------- KOTAK RUMUS ---------- */
/*  Lencana verifikasi WAJIB diisi bila rumusnya hasil pembuktian.
    Lihat data/klaim-terverifikasi.json.                          */
export function Rumus({ label, isi, verifikasi, terkunci = false, id, ids }) {
  const idAttr = id && ids ? ` id="${ids.i(id)}"` : '';
  return `<div class="rumus${terkunci ? ' locked' : ''}"${idAttr}>
    ${label ? `<span class="lbl">${label}</span>` : ''}
    ${isi}
    ${verifikasi ? `<span class="tiny" style="display:block;margin-top:8px;color:var(--tinta-2)">✅ ${verifikasi}</span>` : ''}
  </div>`;
}

/* ---------- RUMUS TERKUNCI: terbuka setelah siswa menemukan sendiri ---------- */
export function RumusTerkunci({ ids, id, label, isi, verifikasi, pesan }) {
  return `<div class="lockwrap">
    ${Rumus({ ids, id, label, isi, verifikasi, terkunci: true })}
    <div class="lockmsg" id="${ids.i(id + '-pesan')}">${pesan || 'Kerjakan labnya dulu — rumusnya lebih membekas kalau kamu sendiri yang menemukannya.'}</div>
  </div>`;
}

/** Membuka kotak rumus yang terkunci, dengan animasi sapuan stabilo. */
export function bukaRumus(ids, id) {
  const r = ids.q(id), p = ids.q(id + '-pesan');
  if (r) { r.classList.remove('locked'); r.classList.add('reveal'); }
  if (p) p.style.display = 'none';
}

/* ---------- KOTAK CATATAN ---------- */
/*  jenis: 'biasa' | 'baik' | 'awas'  */
export function Catatan({ jenis = 'biasa', isi }) {
  const kelas = jenis === 'baik' ? ' good' : jenis === 'awas' ? ' warn' : '';
  return `<div class="note${kelas}">${isi}</div>`;
}

/* ---------- TAB ---------- */
/*  daftar: [{kunci, judul, isi}]  */
export function Tab({ ids, id, daftar }) {
  const tombol = daftar.map((d, i) =>
    `<button class="tab${i === 0 ? ' on' : ''}" data-t="${d.kunci}">${d.judul}</button>`).join('');
  const panel = daftar.map((d, i) =>
    `<div class="tp${i === 0 ? ' on' : ''}" data-t="${d.kunci}">${d.isi}</div>`).join('');
  return `<div class="tabs" id="${ids.i(id)}">${tombol}</div>${panel}`;
}

/** Menghidupkan tab. Panggil setelah HTML terpasang. */
export function pasangTab(root, ids, id) {
  const bar = ids.q(id);
  if (!bar) return;
  bar.querySelectorAll('.tab').forEach((b) => {
    b.onclick = () => {
      bar.querySelectorAll('.tab').forEach((x) => x.classList.toggle('on', x === b));
      // hanya panel yang bersaudara langsung dengan bar ini
      let n = bar.nextElementSibling;
      while (n && n.classList.contains('tp')) {
        n.classList.toggle('on', n.dataset.t === b.dataset.t);
        n = n.nextElementSibling;
      }
    };
  });
}

/* ---------- KISI DUA KOLOM ---------- */
export function Kisi(isiArray) {
  return `<div class="grid2">${isiArray.join('')}</div>`;
}

/* ---------- BLOK KODE C++ ---------- */
export function Kode(teks, gaya = '') {
  return `<pre class="code"${gaya ? ` style="${gaya}"` : ''}>${teks}</pre>`;
}

/* ---------- TABEL sederhana ---------- */
/*  kepala: ['a','b'] ; baris: [['1','2'], ...]  */
export function Tabel({ kepala, baris, kiri = false, gaya = '' }) {
  const th = kepala.map((h) => `<th${kiri ? ' style="text-align:left"' : ''}>${h}</th>`).join('');
  const tr = baris.map((r) =>
    `<tr>${r.map((c) => `<td${kiri ? ' style="text-align:left"' : ''}>${c}</td>`).join('')}</tr>`).join('');
  return `<div class="scroll"><table class="t"${gaya ? ` style="${gaya}"` : ''}>
    <tr>${th}</tr>${tr}</table></div>`;
}

/* ---------- KARTU SOAL untuk bagian "Bedah soal asli" ---------- */
export function KartuSoal({ ids, nomor, pertanyaan, idKeluaran }) {
  return `<div><div class="chip r">${nomor}</div>
    <p style="margin:8px 0 0">${pertanyaan}</p>
    ${Keluaran({ ids, id: idKeluaran, gaya: 'margin-top:8px' })}</div>`;
}

/* ---------- PENANDA WARNA dalam keluaran ---------- */
export const hijau = (t) => `<span class="g">${t}</span>`;
export const merah = (t) => `<span class="k">${t}</span>`;
export const redup = (t) => `<span class="d">${t}</span>`;
export const stabilo = (t) => `<mark>${t}</mark>`;

/* ---------- Format angka gaya Indonesia ---------- */
export const angka = (n) => Number(n).toLocaleString('id-ID');

export default {
  Kartu, Lab, Kontrol, AreaTeks, Keluaran, Wadah, Rumus, RumusTerkunci,
  bukaRumus, Catatan, Tab, pasangTab, Kisi, Kode, Tabel, KartuSoal,
  hijau, merah, redup, stabilo, angka,
};
