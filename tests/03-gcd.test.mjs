/* ============================================================
   UJI MODUL 03 — FPB & EULER'S TOTIENT
   ------------------------------------------------------------
   Berkas ini menjaga angka SATU DIGIT yang tidak bisa dijaga oleh
   lapis 2 (tests/audit.mjs). Lapis 2 mencari angka sebagai
   POTONGAN TEKS di dalam jendela sekitar `dekat`. Untuk angka satu
   digit jendela itu hampir selalu memuat digit yang sama dari
   tempat lain — "2025", "φ(4)", daftar bilangan koprima — jadi
   klaimnya tetap hijau walaupun modulnya sudah salah.

   Di sini angkanya dicocokkan TEPAT: seluruh kalimatnya ikut
   dicocokkan, digit di belakangnya ditolak dengan (?!\d), dan
   SETIAP kemunculan pola itu wajib benar.

   Pembandingnya ditulis ULANG dari naskah OSN-K 2025 nomor 38-40,
   sengaja TANPA memakai math.js. MERAH/PUTIH/NUSANTARA disalin
   apa adanya dari kode C++ di naskah, lalu diadu lagi dengan cara
   paling bodoh tapi pasti benar: FPB dicari dengan mencoba semua
   pembagi, dan φ dihitung dengan mencacah bilangan koprima satu
   per satu.

   Jalankan:  node tests/03-gcd.test.mjs
   ============================================================ */

import { siapkanDom, buatPencatat, bangunModul } from './alat.mjs';

/* ============================================================
   1. NASKAH SOAL — disalin dari kode C++ OSN-K 2025 nomor 38-40
   ============================================================ */
const MERAH = (A, B) => (B === 0 ? A : MERAH(B, A % B));
const PUTIH = (A, B, C) => (C === 0 ? 0
  : MERAH(A, C) === B ? 1 + PUTIH(A, B, C - 1)
    : PUTIH(A, B, C - 1));
const NUSANTARA = (A, B) => PUTIH(A, B, A);

const PILIHAN38 = [4, 9, 17, 18, 34];   /* pilihan A-E soal 38, MERAH(24, x) */

/* ============================================================
   2. PEMBANDING KEDUA — tidak memakai Euclid sama sekali
   ============================================================ */
const fpbKasar = (a, b) => {
  let g = 1;
  for (let d = 1; d <= Math.min(a, b); d++) if (a % d === 0 && b % d === 0) g = d;
  return g;
};
const koprima = (n) => [...Array(n)].map((_, i) => i + 1).filter((k) => fpbKasar(n, k) === 1);
const phiKasar = (n) => koprima(n).length;

/* ============================================================
   3. JAWABAN PEMBANDING
   ============================================================ */
const opsi38 = PILIHAN38.map((x) => [x, MERAH(24, x)]);
const menang38 = opsi38.reduce((a, b) => (b[1] > a[1] ? b : a));
const J = {
  fpb4818: fpbKasar(48, 18),
  arg38: menang38[0],
  nilai38: menang38[1],
  n39: NUSANTARA(12, 3),
  daftar39: [...Array(12)].map((_, i) => i + 1).filter((c) => MERAH(12, c) === 3),
  n40: NUSANTARA(2025, 135),
  bagi39: 12 / 3,
  bagi40: 2025 / 135,
  phi15: phiKasar(15),
  phi4: phiKasar(4),
  phi3: phiKasar(3),
  phi5: phiKasar(5),
  koprima15: koprima(15),
};

const angkaId = (v) => Number(v).toLocaleString('id-ID');

const EJAAN = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima',
  'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];

/* ============================================================
   4. ALAT PENCOCOKAN TEPAT
   ============================================================ */
const glob = (p) => new RegExp(p.source, p.flags.replace(/[dg]/g, '') + 'dg');

/* SETIAP kemunculan pola wajib benar. Bukan "ada satu yang benar
   di suatu tempat" — itu yang bikin lapis 2 bisa dikelabui. */
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

/* ============================================================
   5. JALANKAN
   ============================================================ */
siapkanDom();
const t = buatPencatat('03-gcd');

t.bagian('Pembanding dari naskah (tanpa math.js)');
let beda = 0;
for (let a = 1; a <= 80; a++) for (let b = 1; b <= 80; b++) if (MERAH(a, b) !== fpbKasar(a, b)) beda++;
t.cek('MERAH dari naskah == cari pembagi satu per satu (A,B = 1..80)', beda === 0, `${beda} beda`);
t.cek('soal 38 — MERAH terbesar di antara lima pilihan',
  J.arg38 === 18 && J.nilai38 === 6, `MERAH(24, ${J.arg38}) = ${J.nilai38}`);
t.cek('soal 39 — NUSANTARA(12, 3)', J.n39 === 2, String(J.n39));
t.cek('soal 39 — daftar C yang memenuhi', J.daftar39.join(',') === '3,9', J.daftar39.join(','));
t.cek('soal 40 — NUSANTARA(2025, 135)', J.n40 === 8, String(J.n40));
t.cek('jalan pintas φ(A ÷ B) cocok dengan pencacahan langsung',
  phiKasar(J.bagi40) === J.n40 && phiKasar(J.bagi39) === J.n39,
  `φ(${J.bagi40}) = ${phiKasar(J.bagi40)} vs ${J.n40}`);
t.info('bilangan koprima dengan 15', J.koprima15.join(', '));

const ctx = await bangunModul('03-gcd');
t.cek('modul dibangun tanpa galat', ctx.galat.length === 0,
  ctx.galat.map((e) => e.message).join(' | '));

/* ---- bedah soal: kotaknya baru terisi setelah tombolnya ditekan ---- */
ctx.klik('gcSolve');
const s1 = ctx.teks('gcS1');
const s2 = ctx.teks('gcS2');
const s3 = ctx.teks('gcS3');

t.bagian('Bedah soal 38 — angka satu digit, pencocokan tepat');
t.cek('kotak jawaban soal 38 terisi', s1.length > 40, s1.slice(0, 40));
cocok(t, s1, 'tiap baris FPB(24, x)', /FPB\(24, +(\d+)\) = (\d+)(?!\d)/,
  (x) => Number(x[2]) === MERAH(24, Number(x[1])), 'semuanya = MERAH(24, x)');
t.cek('kelima pilihan soal 38 semuanya ditampilkan',
  PILIHAN38.every((v) => new RegExp(`FPB\\(24, +${v}\\) = `).test(s1)), s1.replace(/\s+/g, ' '));
cocok(t, s1, 'pilihan terbesar', /terbesar: MERAH\(24, (\d+)\) = (\d+)(?!\d)/,
  samaDengan(J.arg38, J.nilai38), `${J.arg38}, ${J.nilai38}`);
cocok(t, s1, 'pemeriksaan faktor 2×3', /keduanya berbagi 2×3 = (\d+)(?!\d)/,
  samaDengan(J.nilai38), String(J.nilai38));

t.bagian('Bedah soal 39 — angka satu digit, pencocokan tepat');
t.cek('kotak jawaban soal 39 terisi', s2.length > 40, s2.slice(0, 40));
cocok(t, s2, 'pembagian 12 ÷ 3', /12 ÷ 3 = (\d+)(?!\d)/, samaDengan(J.bagi39), String(J.bagi39));
cocok(t, s2, 'hasil φ(4)', /φ\(4\) = 4 × \(1 − 1\/2\) = (\d+)(?!\d)/,
  samaDengan(J.n39), String(J.n39));
cocok(t, s2, 'daftar C hasil cek manual', /Cek manual: C = (\d+) dan (\d+)(?!\d)/,
  samaDengan(...J.daftar39), J.daftar39.join(', '));
cocok(t, s2, 'banyaknya C hasil cek manual', /\((\d+) bilangan\)/,
  samaDengan(J.n39), String(J.n39));

t.bagian('Bedah soal 40 — angka satu digit, pencocokan tepat');
t.cek('kotak jawaban soal 40 terisi', s3.length > 40, s3.slice(0, 40));
cocok(t, s3, 'pembagian 2025 ÷ 135', /2025 ÷ 135 = (\d+)(?!\d)/, samaDengan(J.bagi40), String(J.bagi40));
cocok(t, s3, 'faktor prima 15', /(\d+) = (\d+) × (\d+)(?!\d)/,
  (x) => Number(x[2]) * Number(x[3]) === Number(x[1]) && Number(x[1]) === J.bagi40,
  `${J.bagi40} = 3 × 5`);
cocok(t, s3, 'hasil akhir φ(15)', /bagi 5 kali 4 → (\d+)(?!\d)/, samaDengan(J.n40), String(J.n40));
cocok(t, s3, 'baris "Jawaban:"', /Jawaban: (\d+)(?!\d)/, samaDengan(J.n40), String(J.n40));

/* ---- angka mati di prosa: di sinilah lapis 2 paling tidak berdaya ---- */
const badan = ctx.badan.textContent;

t.bagian('Angka mati di prosa — pencocokan tepat');
cocok(t, badan, 'contoh FPB(48, 18) di "Apa itu"',
  /FPB\(48, 18\) = (\d+), karena (\d+) membagi habis keduanya(?!\d)/,
  samaDengan(J.fpb4818, J.fpb4818), String(J.fpb4818));
cocok(t, badan, 'contoh φ(15) di "Apa itu"',
  /Contoh φ\(15\) = (\d+), karena dari 1 sampai 15 ada (\w+) bilangan(?!\d)/,
  (x) => x[1] === String(J.phi15) && x[2] === EJAAN[J.phi15],
  `${J.phi15} / "${EJAAN[J.phi15]}"`);
cocok(t, badan, 'daftar bilangan koprima dengan 15',
  /yaitu ([\d, ]+dan \d+)\./,
  (x) => x[1].split(/,\s*|\s*dan\s*/).filter(Boolean).join(',') === J.koprima15.join(','),
  J.koprima15.join(', '));
cocok(t, badan, 'sifat perkalian φ(3) × φ(5)',
  /φ\(15\) = φ\(3\) × φ\(5\) = (\d+) × (\d+) = (\d+)(?!\d)/,
  samaDengan(J.phi3, J.phi5, J.phi15), `${J.phi3}, ${J.phi5}, ${J.phi15}`);
cocok(t, badan, 'penyamaran definisi φ(15)',
  /Ini definisi φ\(15\) yang ditulis ulang\. Jawabannya (\d+)(?!\d)/,
  samaDengan(J.phi15), String(J.phi15));
cocok(t, badan, 'verifikasi 30 detik',
  /NUSANTARA\(12, 3\) seharusnya φ\(4\) = (\d+), dan memang hanya C = (\d+) dan C = (\d+)(?!\d)/,
  samaDengan(J.n39, ...J.daftar39), `${J.n39}, ${J.daftar39.join(', ')}`);

/* ---- angka yang ditulis BERULANG KALI: jendela `dekat` tidak sanggup ----
   Lapis 2 memeriksa jendela di sekitar jangkar. Kalau modul menulis angka
   yang sama beberapa kali dalam satu kotak, salinan yang dirusak tetap
   tertutup salinan tetangganya — sudah dibuktikan. Di sini tiap salinan
   dicocokkan satu per satu. */
const A40 = 2025, B40 = 135;                 /* dari naskah soal 40 */
const rbA = angkaId(A40);
const phiA = angkaId(phiKasar(A40));

t.bagian('Angka 2.025 dan φ(2025) — tiap salinan dicocokkan');
cocok(t, badan, 'prosa "Kenapa dua topik digabung"',
  /menghitung ([\d.]+) kali dengan tangan/,
  samaDengan(rbA), rbA);
cocok(t, badan, 'petunjuk Lab 5',
  /([\d.]+) hitungan jadi dua langkah/, samaDengan(rbA), rbA);
cocok(t, badan, 'bunyi soal 40 di Lab 5',
  /dari 1 sampai ([\d.]+) yang FPB\((\d+), C\)-nya tepat (\d+)\?/,
  samaDengan(rbA, A40, B40), `${rbA}, ${A40}, ${B40}`);
cocok(t, badan, 'cara polos di Lab 5',
  /hitung FPB sebanyak ([\d.]+) kali\. Di kertas itu mustahil/, samaDengan(rbA), rbA);
cocok(t, s3, 'catatan tanpa jalan pintas di bedah soal',
  /menghitung FPB sebanyak ([\d.]+) kali/, samaDengan(rbA), rbA);
cocok(t, ctx.teks('gcKout'), 'lab faktorisasi φ(n), n bawaan 2025',
  /φ\(([\d.]+)\) = ([\d.]+)(?!\d)/, samaDengan(rbA, phiA), `${rbA}, ${phiA}`);

/* Kedua lab jalan pintas dijalankan pada angka soal 40 yang sebenarnya,
   bukan pada nilai bawaan yang bisa berubah kapan saja. */
t.bagian('Lab jalan pintas dijalankan pada angka soal 40');
ctx.isi('gcXa', A40); ctx.isi('gcXb', B40); ctx.klik('gcXgo');
const lx = ctx.teks('gcXout');
cocok(t, lx, 'cara polos butuh A kali hitung FPB',
  /([\d.]+) kali hitung FPB/, samaDengan(rbA), rbA);
cocok(t, lx, 'cara polos dan jalan pintas sama-sama 8',
  /hasil = (\d+)(?!\d)/, samaDengan(J.n40), String(J.n40));
cocok(t, lx, 'jalan pintas φ(A ÷ B)',
  /φ\((\d+) ÷ (\d+)\) = φ\((\d+)\) = (\d+)(?!\d)/,
  samaDengan(A40, B40, J.bagi40, J.n40), `${A40}, ${B40}, ${J.bagi40}, ${J.n40}`);
t.cek('lab menyatakan dua cara sama', /✓ DUA CARA SAMA/.test(lx), lx.slice(0, 60));

ctx.isi('gcNa', A40); ctx.isi('gcNb', B40); ctx.klik('gcNgo');
const ln = ctx.teks('gcNout');
cocok(t, ln, 'cara 1 memeriksa C sampai A',
  /periksa C = 1, 2, …, ([\d.]+) satu per satu/, samaDengan(rbA), rbA);
cocok(t, ln, 'cara 1 dan cara 2 sama-sama 8',
  /hasil = (\d+)(?!\d)/, samaDengan(J.n40), String(J.n40));
cocok(t, ln, 'pembagian A ÷ B di cara 2',
  /([\d.]+) ÷ (\d+) = (\d+)(?!\d)/, samaDengan(rbA, B40, J.bagi40),
  `${rbA}, ${B40}, ${J.bagi40}`);
t.cek('lab kedua menyatakan dua cara sama', /✓ DUA CARA SAMA/.test(ln), ln.slice(0, 60));

const hasil = t.ringkas();
process.exit(hasil.gagal ? 1 : 0);