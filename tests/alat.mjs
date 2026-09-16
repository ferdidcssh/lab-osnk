/* ============================================================
   PENGUJI MODUL
   ------------------------------------------------------------
   jsdom tidak mendukung <script type="module">, jadi kita tidak
   bisa memuat index.html apa adanya. Sebagai gantinya modul
   diimpor LANGSUNG oleh Node (yang memang mendukung ESM), lalu
   diberi DOM tiruan dari jsdom.

   Cara pakai:  node tests/jalankan.mjs [nama-modul]
   Contoh:      node tests/jalankan.mjs josephus
   ============================================================ */

import { JSDOM } from 'jsdom';
import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const DIR = dirname(fileURLToPath(import.meta.url));
const AKAR = join(DIR, '..');

/* ---------- siapkan DOM global ---------- */
export function siapkanDom() {
  const dom = new JSDOM('<!DOCTYPE html><body><div id="akar"></div></body>', {
    pretendToBeVisual: true,
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.Event = dom.window.Event;
  global.localStorage = {
    _d: {},
    getItem(k) { return k in this._d ? this._d[k] : null; },
    setItem(k, v) { this._d[k] = String(v); },
    removeItem(k) { delete this._d[k]; },
  };
  return dom;
}

/* ---------- pencatat hasil ---------- */
export function buatPencatat(nama) {
  let lolos = 0, gagal = 0;
  const daftarGagal = [];
  return {
    bagian(t) { console.log('\n=== ' + t + ' ==='); },
    cek(judul, syarat, konteks = '') {
      if (syarat) { console.log('  \u2713 ' + judul); lolos++; }
      else { console.log('  \u2717 ' + judul + (konteks ? '  \u2014 ' + konteks : '')); gagal++; daftarGagal.push(judul); }
    },
    info(judul, catatan = '') {
      console.log('  \u00b7 ' + judul + (catatan ? '  \u2014 ' + catatan : ''));
    },
    ringkas() {
      console.log('\n' + '='.repeat(48));
      console.log(`${nama}:  ${lolos} LOLOS, ${gagal} GAGAL`);
      console.log('='.repeat(48));
      return { lolos, gagal, daftarGagal };
    },
  };
}

/* ---------- bangun sebuah modul ke dalam DOM tiruan ---------- */
export async function bangunModul(berkas) {
  const { buatIds } = await import(join(AKAR, 'js/core/ids.js'));
  const { pasangTab } = await import(join(AKAR, 'js/core/ui.js'));
  const mod = (await import(join(AKAR, 'js/modules/', berkas + '.js'))).default;

  const panel = document.getElementById('akar');
  panel.innerHTML = '<div class="badan"></div>';
  const badan = panel.querySelector('.badan');
  const ids = buatIds(mod.id, panel);
  const galat = [];

  /* Galat yang meledak DI DALAM penangan tombol tidak ikut tertangkap
     try/catch — jsdom mengubahnya jadi event 'error' di window. Dulu ini
     bikin modul rusak tetap dinyatakan LOLOS. Sekarang ikut dicatat. */
  const dengar = (e) => galat.push(e.error || new Error(e.message));
  window.addEventListener('error', dengar);
  try {
    mod.bangun(badan, { ids, pasangTab: (n) => pasangTab(panel, ids, n), panel });
  } catch (e) { galat.push(e); }
  window.removeEventListener('error', dengar);

  return {
    mod, berkas, panel, badan, ids, galat,
    teks: (nama) => { const el = ids.q(nama); return el ? el.textContent : '(TIDAK ADA)'; },
    isi: (nama, v) => { const el = ids.q(nama); if (el) el.value = String(v); return el; },
    klik: (nama) => { const el = ids.q(nama); if (el) el.click(); return el; },
    el: (nama) => ids.q(nama),
  };
}

/* ---------- pemeriksaan yang berlaku untuk SEMUA modul ---------- */
export function periksaKontrak(t, ctx) {
  const { mod, badan, galat, panel } = ctx;
  t.bagian('Kontrak modul (berlaku untuk semua modul)');
  t.cek('tidak ada galat saat dibangun', galat.length === 0, galat.map((e) => e.message).join(' | '));
  t.cek('punya id', typeof mod.id === 'string' && mod.id.length > 0);
  t.cek('punya nomor', typeof mod.n === 'string');
  t.cek('punya kelompok', typeof mod.kelompok === 'string');
  t.cek('punya judul', typeof mod.judul === 'string' && mod.judul.length > 3);
  t.cek('punya lede yang bermakna', typeof mod.lede === 'string' && mod.lede.length > 40);
  t.cek('menghasilkan isi', badan.innerHTML.length > 500, badan.innerHTML.length + ' karakter');

  // semua id di dalam modul WAJIB berawalan nama modul
  const idBermasalah = [...panel.querySelectorAll('[id]')]
    .map((e) => e.id)
    .filter((id) => !id.startsWith(mod.id + '-'));
  t.cek('semua id berawalan nama modul', idBermasalah.length === 0, idBermasalah.join(', '));

  // tidak boleh ada id ganda
  const semua = [...panel.querySelectorAll('[id]')].map((e) => e.id);
  const ganda = [...new Set(semua.filter((v, i) => semua.indexOf(v) !== i))];
  t.cek('tidak ada id ganda', ganda.length === 0, ganda.join(', '));

  // kartu drill & kamus, kalau ada, harus berbentuk benar
  if (mod.kartu) {
    const sah = mod.kartu.every((k) => k.q && k.a && k.why);
    t.cek(`kartu drill berbentuk benar (${mod.kartu.length} kartu)`, sah);
  }
  if (mod.kamus) {
    const sah = mod.kamus.every((k) => Array.isArray(k) && k.length >= 2);
    t.cek(`entri kamus berbentuk benar (${mod.kamus.length} entri)`, sah);
  }
}


/* ---------- pemeriksaan khusus modul LATIHAN (drill) ----------
   Kartunya harus utuh: pertanyaan ada, jawaban ada dan sah, alasan ada,
   tidak ada pertanyaan kembar, dan tiap kartu punya alasan yang berarti. */
export const KATEGORI_KARTU = ['josephus', 'gcd', 'digitsum', 'doubling',
  'graf', 'kombi', 'prefix', 'dp', 'lain'];

export function periksaDrill(t, ctx) {
  const { badan, mod } = ctx;
  t.bagian('Modul latihan (drill)');
  const bank = mod.bank || [];
  t.cek('punya bank kartu', bank.length > 0, `${bank.length} kartu`);
  t.info('banyaknya kartu', String(bank.length));

  const rusak = bank.filter((k) => !k.q || !k.a || !k.why);
  t.cek('tiap kartu punya pertanyaan, jawaban, dan alasan', rusak.length === 0,
    rusak.slice(0, 3).map((k) => JSON.stringify(k).slice(0, 60)).join(' | '));

  const asing = [...new Set(bank.map((k) => k.a))]
    .filter((a) => !KATEGORI_KARTU.includes(a));
  t.cek('semua jawaban memakai kategori yang dikenali', asing.length === 0,
    asing.join(', '));

  const q = bank.map((k) => k.q.replace(/\s+/g, ' ').trim());
  const kembar = q.filter((x, i) => q.indexOf(x) !== i);
  t.cek('tidak ada pertanyaan kembar', kembar.length === 0,
    [...new Set(kembar)].slice(0, 3).join(' | '));

  const pendek = bank.filter((k) => k.why.split(/\s+/).length < 4);
  t.cek('alasannya tidak asal-asalan (minimal 4 kata)', pendek.length === 0,
    pendek.slice(0, 3).map((k) => k.q.slice(0, 40)).join(' | '));

  t.cek('ada kartu jebakan', bank.some((k) => /JEBAKAN/i.test(k.why)),
    String(bank.filter((k) => /JEBAKAN/i.test(k.why)).length));
  t.cek('semua kategori terwakili',
    KATEGORI_KARTU.every((a) => bank.some((k) => k.a === a)),
    KATEGORI_KARTU.filter((a) => !bank.some((k) => k.a === a)).join(', '));
  t.cek('ada tombol untuk memulai', badan.querySelectorAll('button').length >= 2);
  t.cek('ada catatan cara pakai', badan.querySelectorAll('.note').length >= 1);
}

/* ---------- pemeriksaan khusus modul KAMUS (referensi) ---------- */
export function periksaKamus(t, ctx) {
  const { badan, mod } = ctx;
  t.bagian('Modul kamus (referensi)');
  const e = mod.entri || [];
  t.cek('punya daftar entri', e.length > 0, `${e.length} entri`);
  t.info('banyaknya entri', String(e.length));

  const rusak = e.filter((x) => !x.kata || !x.topik);
  t.cek('tiap entri punya kata kunci dan topiknya', rusak.length === 0,
    rusak.slice(0, 3).map((x) => JSON.stringify(x).slice(0, 50)).join(' | '));

  const kata = e.map((x) => x.kata.replace(/\s+/g, ' ').trim());
  const kembar = kata.filter((x, i) => kata.indexOf(x) !== i);
  t.cek('tidak ada kata kunci kembar', kembar.length === 0,
    [...new Set(kembar)].slice(0, 3).join(' | '));

  const bernomor = e.filter((x) => x.n);
  t.cek('sebagian besar entri menunjuk ke modul',
    bernomor.length >= e.length * 0.7,
    `${bernomor.length} dari ${e.length}`);

  t.cek('ada entri jebakan', e.some((x) => x.jebakan),
    String(e.filter((x) => x.jebakan).length));
  t.cek('ada entri yang menyebut sering tertukar dengan apa',
    e.filter((x) => x.tertukar).length >= 8,
    String(e.filter((x) => x.tertukar).length));
  t.cek('ada kotak pencarian', badan.querySelectorAll('input').length >= 1);
  t.cek('ada catatan cara pakai', badan.querySelectorAll('.note').length >= 1);
}

/* ---------- semua fungsi M.* yang dipakai modul harus ADA di math.js ----------
   Ini menutup kesalahan yang pernah terjadi: modul memakai fungsi baru,
   tapi math.js yang dikirim ke pengguna masih versi lama. Labnya mati
   diam-diam. Sekarang ketahuan sebelum sampai ke siswa.                */
export async function periksaMesin(t, ctx) {
  const { M } = await import(join(AKAR, 'js/core/math.js'));
  const src = readFileSync(join(AKAR, 'js/modules/', ctx.berkas + '.js'), 'utf8');
  const dipakai = [...new Set([...src.matchAll(/\bM\.([A-Za-z0-9_]+)/g)].map((m) => m[1]))];
  const hilang = dipakai.filter((k) => typeof M[k] !== 'function');
  t.bagian('Mesin hitung');
  t.cek(`semua fungsi M.* ada di math.js (${dipakai.length} dipakai)`,
    hilang.length === 0, 'HILANG: ' + hilang.join(', '));
}

/* ---------- daftar kata yang tidak boleh dipakai ke siswa ----------
   Semuanya terjemahan kaku atau istilah kuliah. Kalau salah satu
   muncul di teks yang dibaca siswa, penguji akan menolak modulnya.
   Tambahkan di sini kalau menemukan istilah janggal yang lain.       */
export const KATA_TERLARANG = [
  'berhingga', 'tak-negatif', 'keterbentukan', 'koefisien',
  'rumus tertutup', 'persamaan Diophantine', 'paritas', 'iteratif',
  'kongruen', 'akar primitif', 'simpul', 'sisi berarah',
  'traversal', 'in-degree', 'basis rekursi', 'multiplisitas',
  'himpunan bagian', 'komplemen dari', 'sekuens',
];

/* ---------- pemeriksaan bahasa, berlaku untuk SEMUA modul ----------
   Aturan ini dulu cuma ada di ingatan, jadi gampang lupa. Sekarang
   diperiksa mesin: modul yang melanggar akan gagal diuji.            */
export function periksaBahasa(t, ctx, { minKamu = 8, rataMaks = 16, kalimatMaks = 32 } = {}) {
  const { badan, mod } = ctx;
  t.bagian('Bahasa (diperiksa otomatis)');

  const teks = badan.textContent;

  const kamu = (teks.match(/\bkamu\b/g) || []).length;
  t.cek(`menyapa pembaca dengan "kamu" (minimal ${minKamu}×)`, kamu >= minKamu, kamu + '×');

  KATA_TERLARANG.forEach((k) => {
    /* Pakai batas kata, jangan includes(). Kalau tidak, "disimpulkan"
       akan tertangkap sebagai "simpul" dan "konsekuensi" sebagai
       "sekuens" — dua-duanya kata yang sah. */
    const pola = new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    t.cek(`tidak memakai "${k}"`, !pola.test(teks));
  });

  /* Aturan "pakai FPB, bukan gcd" dulu cuma ada di panduan. Blok kode
     Blok <pre> dan <code> dikecualikan: di situ "gcd" muncul sebagai
     potongan kode asli soal, bukan sebagai cara kita berbicara. */
  const tanpaKode = badan.cloneNode(true);
  tanpaKode.querySelectorAll('pre, code').forEach((x) => x.remove());
  const bocorGcd = (tanpaKode.textContent.match(/\bgcd\b/gi) || []).length;
  t.cek('memakai FPB, bukan "gcd", di luar blok kode', bocorGcd === 0, bocorGcd + '×');

  /* Metadata `kartu` dan `kamus` tidak ikut dirender ke panel, jadi selama
     ini lolos dari semua pemeriksaan bahasa. Modul 04 sempat menulis
     "CEK GCD DULU" di kamusnya dan tidak ada yang protes. */
  const meta = [
    ...(mod.kartu || []).flatMap((k) => [k.q, k.why]),
    ...(mod.kamus || []).flat(),
  ].filter(Boolean).join(' \n ');
  const metaGcd = (meta.match(/\bgcd\b/gi) || []).length;
  t.cek('metadata kartu & kamus juga memakai FPB', metaGcd === 0, metaGcd + '×');
  const metaLarang = KATA_TERLARANG.filter((w) =>
    new RegExp('\\b' + w + '\\b', 'i').test(meta));
  t.cek('metadata kartu & kamus tidak memakai kata terlarang',
    metaLarang.length === 0, metaLarang.join(', '));

  /* Ukur HANYA kalimat prosa. Tabel, kode, rumus, dan kotak keluaran
     dikeluarkan karena isinya bukan kalimat — kalau ikut terukur,
     hasilnya salah besar. <br> diganti titik supaya baris terpisah
     tidak terbaca sebagai satu kalimat panjang. */
  const prosa = [...badan.querySelectorAll('p, .note')]
    .map((e) => {
      const k = e.cloneNode(true);
      k.querySelectorAll('table, pre, .rumus, .out').forEach((x) => x.remove());
      k.querySelectorAll('br').forEach((x) =>
        x.replaceWith(k.ownerDocument.createTextNode('. ')));
      return k.textContent.replace(/\s+/g, ' ').trim();
    })
    .join(' | ');

  const panjang = prosa.replace(/\|/g, '.').split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter((x) => x.split(/\s+/).length > 4 && !/[=×⌊→⟺÷]/.test(x))
    .map((x) => x.split(/\s+/).length);

  if (!panjang.length) { t.cek('ada kalimat prosa untuk diukur', false); return; }
  const rata = panjang.reduce((a, b) => a + b, 0) / panjang.length;
  t.cek(`rata-rata kalimat prosa di bawah ${rataMaks} kata`, rata < rataMaks, rata.toFixed(1) + ' kata');
  t.cek(`tidak ada kalimat prosa di atas ${kalimatMaks} kata`,
    Math.max(...panjang) <= kalimatMaks, 'terpanjang ' + Math.max(...panjang));
}

/* ---------- pemeriksaan susunan modul ----------
   Memastikan bagian-bagian wajib menurut PANDUAN-MODUL.md benar-benar ada. */
export function periksaSusunan(t, ctx) {
  const { badan, mod } = ctx;

  /* Modul berkelompok 'Latihan' bukan modul ajar. Ia tidak punya
     "Apa itu", rumus terkunci, atau "Bedah soal" — dan memang tidak
     seharusnya punya. Yang diperiksa untuknya lain lagi. */
  if (mod.kelompok === 'Latihan') {
    return mod.entri ? periksaKamus(t, ctx) : periksaDrill(t, ctx);
  }

  t.bagian('Susunan modul (menurut PANDUAN-MODUL.md)');
  const teks = badan.textContent;

  t.cek('ada bagian "Apa itu"', /Apa itu/.test(teks));
  t.cek('ada minimal satu kartu Lab', badan.querySelectorAll('.lab').length >= 1,
    badan.querySelectorAll('.lab').length + ' lab');
  t.cek('ada kotak rumus', badan.querySelectorAll('.rumus').length >= 1);
  t.cek('ada rumus terkunci yang harus dibuka siswa',
    badan.querySelectorAll('.lockwrap').length >= 1);

  /* Kuncinya harus SUNGGUHAN. Pernah terjadi: modul menjalankan sendiri
     tombol labnya saat dibangun, jadi rumusnya sudah terbuka begitu
     halaman dibuka. Lencananya ada, gemboknya tidak berfungsi. */
  const terkunci = [...badan.querySelectorAll('.lockwrap .rumus')];
  t.cek('rumus terkunci masih tertutup saat modul baru dibuka',
    terkunci.length > 0 && terkunci.every((e) => e.classList.contains('locked')),
    terkunci.filter((e) => !e.classList.contains('locked')).map((e) => e.id).join(', '));
  /* Lab yang membuka rumus sengaja TIDAK dijalankan otomatis, jadi
     kotaknya menunggu sampai siswa menekan tombol. Kotak yang menunggu
     harus mengajak, bukan cuma menampilkan tanda hubung.
     Berlaku HANYA di dalam .lab — kotak jawaban di "Bedah soal" dan
     tab penyamaran memang seharusnya diam sampai ditekan. */
  const diamDiLab = [...badan.querySelectorAll('.lab .out')]
    .filter((e) => { const v = e.textContent.trim(); return v === '—' || v === ''; });
  t.cek('kotak lab yang menunggu memberi petunjuk, bukan "—"', diamDiLab.length === 0,
    diamDiLab.map((e) => e.id).join(', '));

  t.cek('tiap rumus terkunci punya lencana ✅ di dalamnya',
    terkunci.length > 0 && terkunci.every((e) => /✅/.test(e.textContent)),
    terkunci.filter((e) => !/✅/.test(e.textContent)).map((e) => e.id).join(', '));
  t.cek('ada bagian "Kumpulan cara cepat"', /Kumpulan cara cepat/.test(teks));
  t.cek('ada bagian "Penyamaran"', /Penyamaran/.test(teks));
  t.cek('ada bagian "Bedah soal"', /Bedah soal/.test(teks));
  t.cek('ada catatan penutup verifikasi 30 detik', /30 detik/.test(teks));
  t.cek('ada lencana verifikasi pada rumus', /✅/.test(teks));

  /* Lab trik pintas sifatnya SANGAT dianjurkan tapi tidak wajib —
     ada materi yang memang tidak punya jalan pintas. Jadi ini dicatat,
     bukan digagalkan. */
  const adaTrik = /yang paling terasa curang/.test(teks);
  if (adaTrik) t.cek('ada Lab trik "yang paling terasa curang"', true);
  else t.info('BELUM ada Lab trik "yang paling terasa curang"',
    'sangat dianjurkan — cari jalan pintas untuk materi ini kalau ada');

  if (mod.kartu) {
    const sah = ['josephus', 'gcd', 'digitsum', 'doubling', 'graf', 'kombi', 'prefix', 'dp', 'lain'];
    const buruk = mod.kartu.filter((k) => !sah.includes(k.a)).map((k) => k.a);
    t.cek('kategori kartu drill dikenali', buruk.length === 0, buruk.join(', '));
  }
}

/* ---------- daftar modul yang tersedia ---------- */
export function daftarBerkasModul() {
  return readdirSync(join(AKAR, 'js/modules'))
    .filter((f) => f.endsWith('.js'))
    .sort();
}
