/* ============================================================
   UJI MODUL 08 — LEVEL & TOPOLOGICAL SORT
   ------------------------------------------------------------
   Berkas ini memeriksa angka SATU DIGIT yang tidak bisa dijaga
   oleh lapis 2 (tests/audit.mjs). Alasannya: lapis 2 mencari
   angka sebagai POTONGAN TEKS di dalam jendela sekitar `dekat`.
   Untuk angka satu digit jendela itu hampir selalu memuat digit
   yang sama dari tempat lain — "2024", "soal 9", nomor daftar —
   jadi klaimnya lolos walaupun modulnya sudah salah.

   Di sini angkanya dicocokkan TEPAT: seluruh kalimatnya ikut
   dicocokkan, digit di belakangnya ditolak dengan (?!\d), dan
   SETIAP kemunculan pola itu wajib benar — bukan cuma satu.

   Pembandingnya ditulis ULANG dari naskah soal (diagram OSN-K
   2024 nomor 2 dan tabel OSN-K 2025 nomor 9), sengaja TANPA
   memakai math.js, supaya jawabannya diadu dengan sumber lain
   dan bukan dengan dirinya sendiri. Caranya pun sengaja dipilih
   yang paling bodoh tapi pasti benar: semua urutan yang sah
   dicoba satu per satu, dan penjadwalannya disimulasikan hari
   demi hari.

   Jalankan:  node tests/08-toposort.test.mjs
   ============================================================ */

import { siapkanDom, buatPencatat, bangunModul } from './alat.mjs';

/* ============================================================
   1. NASKAH SOAL — disalin dari gambar dan tabelnya, bukan dari modul
   ============================================================ */

/* OSN-K 2024 nomor 2. Panah pada diagram dibaca sebagai
   "kegiatan : daftar kegiatan yang harus selesai lebih dulu". */
const PRA24 = {
  'Memotong sayuran': [],
  'Memasak air': [],
  'Menyiapkan alat mandi': [],
  'Membuat sup': ['Memotong sayuran', 'Memasak air'],
  'Membuat teh': ['Memasak air'],
  'Mandi air hangat': ['Memasak air', 'Menyiapkan alat mandi'],
  'Makan sup': ['Membuat sup'],
  'Minum teh': ['Makan sup', 'Membuat teh'],
  'Tidur': ['Makan sup', 'Mandi air hangat', 'Minum teh'],
};

/* OSN-K 2025 nomor 9, tabel "Kode / Durasi (Hari) / Prasyarat". */
const DUR25 = { AA: 3, BF: 6, CPP: 7, DNC: 1, DP: 4, DS: 5, GRE: 2 };
const PRA25 = {
  AA: ['CPP'], BF: ['AA', 'DS'], CPP: [], DNC: ['DS'],
  DP: ['DNC'], DS: ['CPP'], GRE: ['BF', 'DP'],
};

/* ============================================================
   2. PEMBANDING JUJUR — tanpa math.js, tanpa rumus modulnya
   ============================================================ */

/* Coba SEMUA urutan yang sah, lalu ambil posisi paling kecil yang
   pernah ditempati kegiatan itu. Tidak memakai trik "leluhur + 1"
   sama sekali — justru trik itulah yang sedang diuji. */
function posisiPalingAwal(pre, target) {
  const daftar = Object.keys(pre);
  let terbaik = Infinity;
  const sudah = new Set();
  (function maju(pos) {
    if (pos >= terbaik) return;
    for (const x of daftar) {
      if (sudah.has(x)) continue;
      if (!pre[x].every((p) => sudah.has(p))) continue;
      if (x === target) { terbaik = Math.min(terbaik, pos); continue; }
      sudah.add(x); maju(pos + 1); sudah.delete(x);
    }
  })(1);
  return terbaik;
}

/* Telusuri mundur semua panah sampai mentok. */
function leluhur(pre, x, lihat = new Set()) {
  for (const p of pre[x]) if (!lihat.has(p)) { lihat.add(p); leluhur(pre, p, lihat); }
  return lihat;
}

/* Level = banyaknya kegiatan pada rantai terpanjang yang berakhir di x.
   Dihitung dengan mendaftar semua jalur, bukan dengan rumus. */
function level(pre, x) {
  return pre[x].length === 0 ? 1 : 1 + Math.max(...pre[x].map((p) => level(pre, p)));
}

/* Banyaknya lapis kalau kegiatan dikupas berlapis-lapis. */
function banyakLapis(pre) {
  const sisa = new Set(Object.keys(pre));
  let n = 0;
  while (sisa.size) {
    const bisa = [...sisa].filter((x) => pre[x].every((p) => !sisa.has(p)));
    if (!bisa.length) return NaN;           /* ada lingkaran */
    bisa.forEach((x) => sisa.delete(x));
    n++;
  }
  return n;
}

/* Simulasi hari demi hari, apa adanya menurut bunyi soal 2025 nomor 9:
   boleh lebih dari satu pelatihan sehari, pelatihan tidak boleh
   dipotong, mulai secepat mungkin. */
function waktuMinimum(dur, pre) {
  const selesai = {};
  const belum = new Set(Object.keys(dur));
  for (let hari = 0; hari <= 10000 && belum.size; hari++) {
    for (const x of [...belum]) {
      if (pre[x].every((p) => p in selesai && selesai[p] <= hari)) {
        selesai[x] = hari + dur[x];
        belum.delete(x);
      }
    }
  }
  return belum.size ? NaN : Math.max(...Object.values(selesai));
}

/* ============================================================
   3. JAWABAN PEMBANDING
   ============================================================ */
const J = {
  posisi24: posisiPalingAwal(PRA24, 'Minum teh'),      /* jawaban soal 2024 nomor 2 */
  leluhur24: leluhur(PRA24, 'Minum teh').size,
  level24: level(PRA24, 'Minum teh'),
  lapis24: banyakLapis(PRA24),
  hari25: waktuMinimum(DUR25, PRA25),                  /* jawaban soal 2025 nomor 9 */
  totalDurasi: Object.values(DUR25).reduce((a, b) => a + b, 0),
  levelTertinggi25: Math.max(...Object.keys(PRA25).map((x) => level(PRA25, x))),
  jalurKritis: ['CPP', 'DS', 'BF', 'GRE'],
};

/* ============================================================
   4. ALAT PENCOCOKAN TEPAT
   ============================================================ */

const glob = (p) => new RegExp(p.source, p.flags.replace(/[dg]/g, '') + 'dg');

/* SETIAP kemunculan pola wajib benar. Bukan "ada satu yang benar di
   suatu tempat" — itu yang bikin lapis 2 bisa dikelabui. */
function cocok(t, teks, apa, pola, benar, harapan = '') {
  const m = [...teks.matchAll(glob(pola))];
  const salah = m.filter((x) => !benar(x));
  t.cek(`${apa} — polanya ada di modul`, m.length >= 1, `0 kemunculan · pola ${pola}`);
  t.cek(`${apa} — semua ${m.length} kemunculan benar${harapan ? ` (${harapan})` : ''}`,
    m.length >= 1 && salah.length === 0,
    salah.map((x) => x[0].replace(/\s+/g, ' ')).join(' | '));
  ujiPalsu(t, teks, apa, pola, benar, m);
}

const samaDengan = (...harus) => (x) => harus.every((h, i) => x[i + 1] === String(h));

/* Uji auditnya sendiri: angkanya dirusak DI TEMPAT ITU JUGA, lalu
   dipastikan polanya jadi merah. Kalau tetap hijau, polanya longgar
   dan uji ini tidak ada gunanya. */
function ujiPalsu(t, teks, apa, pola, benar, m) {
  if (!m.length) return;
  const x = m[0];
  let rusak = teks;
  /* Yang dirusak HANYA grup terakhir. Merusak semua grup sekaligus kadang
     menghasilkan kombinasi yang kebetulan tetap sah — mis. "0(0)" jadi
     "1(1)", yang juga benar, sehingga uji palsunya salah menuduh. */
  for (let i = x.length - 1; i >= x.length - 1; i--) {
    if (x[i] === undefined || !x.indices[i]) continue;
    const [a, b] = x.indices[i];
    const ganti = /^[\d.]+$/.test(x[i])
      ? String(Number(x[i].replace(/\./g, '')) + 1) : x[i] + 'X';
    rusak = rusak.slice(0, a) + ganti + rusak.slice(b);
  }
  const lagi = [...rusak.matchAll(glob(pola))];
  t.cek(`${apa} — uji palsu: angka dirusak, pola jadi merah`,
    lagi.length === 0 || lagi.some((y) => !benar(y)),
    'pola terlalu longgar — angka salah tetap lolos');
}

/* Ambil sel terakhir dari baris tabel yang sel pertamanya cocok. */
function selTabel(badan, polaBaris) {
  for (const tr of badan.querySelectorAll('tr')) {
    const sel = [...tr.querySelectorAll('td')];
    if (sel.length >= 2 && polaBaris.test(sel[0].textContent)) {
      return sel[sel.length - 1].textContent.replace(/[^\d]/g, '');
    }
  }
  return '(baris tidak ketemu)';
}

/* ============================================================
   5. JALANKAN
   ============================================================ */
siapkanDom();
const t = buatPencatat('08-toposort');
const ctx = await bangunModul('08-toposort');

t.bagian('Pembanding dari naskah (tanpa math.js)');
t.cek('semua urutan sah dicoba — posisi paling awal "Minum teh"', J.posisi24 === 6, String(J.posisi24));
t.cek('trik "leluhur + 1" cocok dengan pencacahan langsung',
  J.leluhur24 + 1 === J.posisi24, `${J.leluhur24} + 1 vs ${J.posisi24}`);
t.cek('simulasi hari demi hari — waktu minimum 2025 nomor 9', J.hari25 === 20, String(J.hari25));
t.info('level "Minum teh"', String(J.level24));
t.info('banyaknya lapis', String(J.lapis24));
t.info('total semua durasi', String(J.totalDurasi));

t.cek('modul dibangun tanpa galat', ctx.galat.length === 0,
  ctx.galat.map((e) => e.message).join(' | '));

/* ---- bedah soal: kotaknya baru terisi setelah tombolnya ditekan ---- */
ctx.klik('solve');
const s1 = ctx.teks('s1');
const s2 = ctx.teks('s2');

t.bagian('Bedah soal 2024 nomor 2 — angka satu digit, pencocokan tepat');
t.cek('kotak jawaban soal 2024 terisi', s1.length > 40, s1.slice(0, 40));
cocok(t, s1, 'ada N kegiatan', /ada (\d+) kegiatan(?!\d)/,
  samaDengan(J.leluhur24), [J.leluhur24].join(', '));
cocok(t, s1, 'posisi paling awal', /posisi paling awal = (\d+) \+ 1 = (\d+)(?!\d)/,
  samaDengan(J.leluhur24, J.posisi24), [J.leluhur24, J.posisi24].join(', '));
cocok(t, s1, 'level pembanding', /level "Minum teh" cuma (\d+)(?!\d)/,
  samaDengan(J.level24), [J.level24].join(', '));
cocok(t, s1, 'banyaknya lapis', /banyaknya lapis (\d+)(?!\d)/,
  samaDengan(J.lapis24), [J.lapis24].join(', '));
cocok(t, s1, 'kesimpulan soal 2024', /Yang benar untuk soal ini: (\d+)(?!\d)/,
  samaDengan(J.posisi24), [J.posisi24].join(', '));

t.bagian('Bedah soal 2025 nomor 9 — angka satu digit, pencocokan tepat');
t.cek('kotak jawaban soal 2025 terisi', s2.length > 40, s2.slice(0, 40));
cocok(t, s2, 'durasi CPP', /CPP \((\d+)\)(?!\d)/,
  samaDengan(DUR25.CPP), [DUR25.CPP].join(', '));
cocok(t, s2, 'durasi DS', /DS {2}\((\d+)\)(?!\d)/,
  samaDengan(DUR25.DS), [DUR25.DS].join(', '));
cocok(t, s2, 'durasi BF', /BF {2}\((\d+)\)(?!\d)/,
  samaDengan(DUR25.BF), [DUR25.BF].join(', '));
cocok(t, s2, 'durasi GRE', /GRE \((\d+)\)(?!\d)/,
  samaDengan(DUR25.GRE), [DUR25.GRE].join(', '));
cocok(t, s2, 'penjumlahan jalur kritis',
  /= (\d+)\+(\d+)\+(\d+)\+(\d+) = (\d+)(?!\d)/,
  samaDengan(...J.jalurKritis.map((v) => DUR25[v]), J.hari25),
  [...J.jalurKritis.map((v) => DUR25[v]), J.hari25].join(', '));
cocok(t, s2, 'level tertinggi 2025', /level tertinggi cuma (\d+)(?!\d)/,
  samaDengan(J.levelTertinggi25), [J.levelTertinggi25].join(', '));

/* ---- angka mati di badan modul: di sinilah lapis 2 paling tidak berdaya ---- */
const badan = ctx.badan.textContent;

t.bagian('Angka mati di prosa — pencocokan tepat');
cocok(t, badan, 'contoh leluhur di tab "Hitung leluhur"',
  /Memotong sayuran, Memasak air {2}→ (\d+)(?!\d)/,
  samaDengan(J.leluhur24), [J.leluhur24].join(', '));
cocok(t, badan, 'rumus contoh di tab "Hitung leluhur"',
  /posisi paling awal = (\d+) \+ 1 = (\d+)(?!\d)/,
  samaDengan(J.leluhur24, J.posisi24), [J.leluhur24, J.posisi24].join(', '));
cocok(t, badan, 'contoh level di bagian "Apa itu"',
  /kegiatan "Minum teh" ada di level (\d+)(?!\d)/,
  samaDengan(J.level24), [J.level24].join(', '));
cocok(t, badan, 'contoh urutan di bagian "Apa itu"',
  /posisi paling awal untuk Minum teh adalah urutan ke-(\d+)(?!\d)/,
  samaDengan(J.posisi24), [J.posisi24].join(', '));
cocok(t, badan, 'catatan jebakan level vs urutan',
  /level Minum teh adalah (\d+) tapi jawaban yang benar (\d+)(?!\d)/,
  samaDengan(J.level24, J.posisi24), [J.level24, J.posisi24].join(', '));

t.bagian('Tabel ringkasan — dibaca per sel, bukan per potongan teks');
t.cek('baris "minimal berapa tahap" = banyaknya lapis',
  selTabel(ctx.badan, /minimal berapa tahap/) === String(J.lapis24),
  selTabel(ctx.badan, /minimal berapa tahap/));
t.cek('baris level "Minum teh" = level pembanding',
  selTabel(ctx.badan, /^level "Minum teh"/) === String(J.level24),
  selTabel(ctx.badan, /^level "Minum teh"/));
t.cek('baris urutan "Minum teh" = posisi pembanding',
  selTabel(ctx.badan, /urutan ke berapa "Minum teh"/) === String(J.posisi24),
  selTabel(ctx.badan, /urutan ke berapa "Minum teh"/));

const hasil = t.ringkas();
process.exit(hasil.gagal ? 1 : 0);
