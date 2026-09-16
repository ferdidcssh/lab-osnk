/* ============================================================
   UJI MODUL 07 — REKURSI BERCABANG (TIGA)
   ------------------------------------------------------------
   Berkas ini menjaga angka SATU DIGIT yang tidak bisa dijaga
   lapis 2 (tests/audit.mjs). Sudah dibuktikan: jawaban soal 26
   (angka 7) dirusak jadi 9, auditor tetap hijau — digit 7 masih
   ada di jendela yang sama dari kalimat lain.

   Di sini angkanya dicocokkan TEPAT: seluruh kalimatnya ikut
   dicocokkan, digit di belakangnya ditolak dengan (?!\d), dan
   SETIAP kemunculan pola itu wajib benar.

   Pembandingnya ditulis ULANG dari kode C++ naskah OSN-K 2025
   nomor 26-28, sengaja TANPA memakai math.js. Dua cara dipakai
   supaya saling mengadu: telusuran rekursif apa adanya seperti
   di naskah, dan pengisian tabel dari bawah ke atas.

   Jalankan:  node tests/07-tiga.test.mjs
   ============================================================ */

import { siapkanDom, buatPencatat, bangunModul } from './alat.mjs';

/* ============================================================
   1. NASKAH SOAL — disalin dari kode C++ OSN-K 2025 nomor 26-28

     int TIGA(int N) {
         if (N <= 1)          return 1;
         else if (N % 3 == 0) return TIGA(N-1) + TIGA(N-3);
         else if (N % 3 == 1) return TIGA(N-2);
         else                 return TIGA(N-3);
     }
   ============================================================ */

/* Cara 1: ditelusuri apa adanya, persis seperti tertulis. */
const memo = new Map();
function tigaRekursif(N) {
  if (N <= 1) return 1;
  if (memo.has(N)) return memo.get(N);
  const r = N % 3 === 0 ? tigaRekursif(N - 1) + tigaRekursif(N - 3)
    : N % 3 === 1 ? tigaRekursif(N - 2)
      : tigaRekursif(N - 3);
  memo.set(N, r);
  return r;
}

/* Cara 2: tabel diisi dari bawah ke atas. Tidak menyentuh cara 1. */
function tabelTiga(batas) {
  const t = [];
  const amb = (k) => (k <= 1 ? 1 : t[k]);        /* N <= 1 selalu 1, termasuk N negatif */
  for (let N = 0; N <= batas; N++) {
    t[N] = N <= 1 ? 1
      : N % 3 === 0 ? amb(N - 1) + amb(N - 3)
        : N % 3 === 1 ? amb(N - 2)
          : amb(N - 3);
  }
  return t;
}

/* Banyaknya pemanggilan kalau ditelusuri TANPA ingatan — inilah
   angka yang dipakai modul untuk menunjukkan betapa beratnya. */
function cacahPanggilan(N) {
  let n = 0;
  (function jalan(k) {
    n++;
    if (k <= 1) return;
    if (k % 3 === 0) { jalan(k - 1); jalan(k - 3); }
    else if (k % 3 === 1) jalan(k - 2);
    else jalan(k - 3);
  })(N);
  return n;
}

/* ============================================================
   2. JAWABAN PEMBANDING
   ============================================================ */
const PILIHAN26 = [2, 6, 14, 18, 25];
const N27 = 2025, N28 = 100;
const T = tabelTiga(N27);

const menang26 = PILIHAN26.reduce((a, b) => (T[b] > T[a] ? b : a));
const J = {
  arg26: menang26,
  nilai26: T[menang26],
  n27: [...Array(N27)].reduce((t, _, i) => t + (T[i + 1] === 1 ? 1 : 0), 0),
  n28: [...Array(N28)].reduce((t, _, i) => t + T[i + 1], 0),
  kelipatan27: Math.floor(N27 / 3),
  kelipatan28: Math.floor(N28 / 3),
  bukanKelipatan28: N28 - Math.floor(N28 / 3),
  panggil18: cacahPanggilan(18),
};
J.jumlahKelipatan28 = [...Array(J.kelipatan28)].reduce((t, _, i) => t + T[(i + 1) * 3], 0);

/* ============================================================
   3. ALAT PENCOCOKAN TEPAT
   ============================================================ */
const glob = (p) => new RegExp(p.source, p.flags.replace(/[dg]/g, '') + 'dg');
const angkaId = (v) => Number(v).toLocaleString('id-ID');

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
    const ganti = /^[\d.]+$/.test(x[i]) ? String(Number(x[i].replace(/\./g, '')) + 1) : x[i] + 'X';
    rusak = rusak.slice(0, a) + ganti + rusak.slice(b);
  }
  const lagi = [...rusak.matchAll(glob(pola))];
  t.cek(`${apa} — uji palsu: angka dirusak, pola jadi merah`,
    lagi.length === 0 || lagi.some((y) => !benar(y)),
    'pola terlalu longgar — angka salah tetap lolos');
}

/* ============================================================
   4. JALANKAN
   ============================================================ */
siapkanDom();
const t = buatPencatat('07-tiga');

t.bagian('Pembanding dari naskah (tanpa math.js)');
let beda = 0;
for (let N = 0; N <= 400; N++) if (tigaRekursif(N) !== T[N]) beda++;
t.cek('telusuran rekursif == pengisian tabel (N = 0..400)', beda === 0, `${beda} beda`);
t.cek('soal 26 — kembalian terbesar', J.arg26 === 18 && J.nilai26 === 7,
  `TIGA(${J.arg26}) = ${J.nilai26}`);
t.cek('soal 27 — banyaknya yang bernilai 1', J.n27 === 1350, String(J.n27));
t.cek('soal 28 — TIGA(1) sampai TIGA(100)', J.n28 === 661, String(J.n28));
t.cek('TIGA(k) = 1 tepat ketika k bukan kelipatan 3',
  [...Array(300)].every((_, i) => (T[i + 1] === 1) === ((i + 1) % 3 !== 0)));
t.cek('untuk kelipatan 3, TIGA(k) = k ÷ 3 + 1',
  [...Array(100)].every((_, i) => T[(i + 1) * 3] === (i + 1) + 1));
t.info('pemanggilan TIGA(18) tanpa ingatan', String(J.panggil18));

const ctx = await bangunModul('07-tiga');
t.cek('modul dibangun tanpa galat', ctx.galat.length === 0,
  ctx.galat.map((e) => e.message).join(' | '));

ctx.klik('solve');
const s1 = ctx.teks('s1'), s2 = ctx.teks('s2'), s3 = ctx.teks('s3');
const badan = ctx.badan.textContent;

t.bagian('Bedah soal 26 — angka satu digit, pencocokan tepat');
t.cek('kotak jawaban soal 26 terisi', s1.length > 40, s1.slice(0, 40));
cocok(t, s1, 'baris yang dicoret bukan kelipatan 3',
  /TIGA\( ?(\d+)\) → bukan kelipatan 3 → (\d+) {2}coret/,
  (x) => Number(x[1]) % 3 !== 0 && Number(x[2]) === T[Number(x[1])],
  'nilainya 1 dan N-nya memang bukan kelipatan 3');
cocok(t, badan, 'baris kelipatan 3 memakai rumus N ÷ 3 + 1',
  /TIGA\( ?(\d+)\) (?:→ kelipatan 3 ✓ {2})?= (\d+)÷3 \+ 1 = (\d+)(?!\d)/,
  (x) => x[1] === x[2] && Number(x[3]) === Number(x[1]) / 3 + 1
    && Number(x[3]) === T[Number(x[1])],
  'N ÷ 3 + 1 dan cocok dengan naskah');
cocok(t, badan, 'jawaban soal 26',
  /Jawabannya TIGA\((\d+)\) = (\d+)(?!\d)/,
  samaDengan(J.arg26, J.nilai26), `${J.arg26}, ${J.nilai26}`);
t.cek('kelima pilihan soal 26 ditampilkan',
  PILIHAN26.every((v) => new RegExp(`TIGA\\( ?${v}\\)`).test(s1)), s1.replace(/\s+/g, ' '));

t.bagian('Bedah soal 27 — pencocokan tepat');
cocok(t, s2, 'banyaknya kelipatan 3 sampai 2025',
  /kelipatan 3 di 1\.\.([\d.]+) = ([\d.]+) ÷ 3 = ([\d.]+)(?!\d)/,
  samaDengan(angkaId(N27), angkaId(N27), angkaId(J.kelipatan27)),
  `${angkaId(N27)}, ${angkaId(J.kelipatan27)}`);
cocok(t, s2, 'sisanya dikurangkan',
  /sisanya\s+= ([\d.]+) − ([\d.]+)(?!\d)/,
  samaDengan(angkaId(N27), angkaId(J.kelipatan27)),
  `${angkaId(N27)} − ${angkaId(J.kelipatan27)}`);
cocok(t, s2, 'jawaban soal 27',
  /Jawabannya ([\d.]+)(?!\d)/, samaDengan(angkaId(J.n27)), angkaId(J.n27));
cocok(t, s2, 'catatan pembagiannya pas',
  /Perhatikan ([\d.]+) habis dibagi 3/, samaDengan(angkaId(N27)), angkaId(N27));

t.bagian('Bedah soal 28 — pencocokan tepat');
cocok(t, s3, 'banyaknya yang bukan kelipatan 3',
  /ada (\d+) − (\d+) = (\d+) bilangan/,
  samaDengan(N28, J.kelipatan28, J.bukanKelipatan28),
  `${N28} − ${J.kelipatan28} = ${J.bukanKelipatan28}`);
cocok(t, s3, 'nilai terbesar di deret kelipatan 3',
  /nilainya 2, 3, 4, …, (\d+)(?!\d)/, samaDengan(T[N28 - (N28 % 3)]),
  String(T[N28 - (N28 % 3)]));
cocok(t, s3, 'jumlah deret kelipatan 3',
  /jumlahnya = \(2 \+ (\d+)\) × (\d+) ÷ 2\s+→\s+(\d+)(?!\d)/,
  samaDengan(T[N28 - (N28 % 3)], J.kelipatan28, J.jumlahKelipatan28),
  String(J.jumlahKelipatan28));
cocok(t, s3, 'total soal 28',
  /total = (\d+) \+ (\d+) = (\d+)(?!\d)/,
  samaDengan(J.bukanKelipatan28, J.jumlahKelipatan28, J.n28),
  `${J.bukanKelipatan28} + ${J.jumlahKelipatan28} = ${J.n28}`);
cocok(t, s3, 'jalan pintas lewat rumus',
  /K = (\d+), jadi (\d+) \+ (\d+)×(\d+)÷2 = (\d+) \+ (\d+) = (\d+)(?!\d)/,
  (x) => Number(x[1]) === J.kelipatan28 && Number(x[2]) === N28
    && Number(x[3]) * Number(x[4]) / 2 === Number(x[6])
    && Number(x[5]) + Number(x[6]) === J.n28 && Number(x[7]) === J.n28,
  String(J.n28));

t.bagian('Angka mati di prosa — pencocokan tepat');
cocok(t, badan, 'berat telusuran TIGA(18) di kertas',
  /telusuri TIGA\((\d+)\) di kertas, kamu butuh (\d+) pemanggilan/,
  (x) => Number(x[2]) === cacahPanggilan(Number(x[1])),
  `TIGA(18) = ${J.panggil18} pemanggilan`);
/* Ini PERTIDAKSAMAAN, bukan kesamaan: menaikkan angkanya satu tidak akan
   pernah mematahkannya, jadi uji palsu otomatis tidak berlaku di sini.
   Yang diperiksa: batasnya benar, DAN tidak dibuat longgar asal aman. */
const bt = badan.match(/Untuk TIGA\((\d+)\)\? Lebih dari (\d+)(?!\d)/);
t.cek('klaim "lebih dari" untuk TIGA(99) ada di modul', !!bt, 'pola tidak ketemu');
if (bt) {
  const sebenarnya = cacahPanggilan(Number(bt[1]));
  t.cek(`batasnya benar (TIGA(${bt[1]}) butuh ${sebenarnya} pemanggilan)`,
    sebenarnya > Number(bt[2]), `${sebenarnya} vs ${bt[2]}`);
  t.cek('batasnya tidak dibuat longgar asal aman (minimal separuh nilai asli)',
    Number(bt[2]) * 2 >= sebenarnya, `${bt[2]} vs ${sebenarnya}`);
}

const hasil = t.ringkas();
process.exit(hasil.gagal ? 1 : 0);
