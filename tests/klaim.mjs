/* ============================================================
   DAFTAR KLAIM
   ------------------------------------------------------------
   Masalah yang dipecahkan: audit lama cuma memeriksa MESIN HITUNG.
   Angka yang TERTULIS di prosa modul tidak pernah diperiksa, jadi
   prosa bisa melenceng dari kode tanpa ada yang tahu.

   Di sini tiap angka yang dikutip modul didaftarkan bersama cara
   MENGHITUNG ULANGNYA. Auditor menghitung ulang, lalu memastikan
   angka itu benar-benar muncul di teks modul.

   Bentuk satu klaim:
     { apa: 'penjelasan singkat',
       hitung: (M) => nilai,            // dihitung ulang, bukan disalin
       format: 'angka' | 'teks',        // 'angka' -> diformat gaya id-ID
       khusus: true }                   // true = angka ini CUMA berlaku
                                        //        untuk soal itu, bukan umum
   ============================================================ */

import { BANK as BANK16 } from '../js/core/kartu.js';
import { ENTRI as ENTRI17 } from '../js/core/kamus.js';

/* Ditulis ulang dari kode C++ di naskah OSN-K, sengaja TIDAK memakai
   math.js — supaya klaimnya diadu dengan sumber lain, bukan dengan
   dirinya sendiri. */
/* Dibaca apa adanya dari tabel OSN-K 2025 soal 9. Diagram soal 2024
   nomor 2 pindah ke tests/08-toposort.test.mjs bersama klaimnya. */
const DUR08 = { AA: 3, BF: 6, CPP: 7, DNC: 1, DP: 4, DS: 5, GRE: 2 };
const PRAP08 = { AA: ['CPP'], BF: ['AA', 'DS'], CPP: [], DNC: ['DS'],
  DP: ['DNC'], DS: ['CPP'], GRE: ['BF', 'DP'] };
const selesai08 = (x) => DUR08[x] +
  (PRAP08[x].length ? Math.max(...PRAP08[x].map(selesai08)) : 0);

/* Ditelusuri apa adanya dari kode C++ naskah OSN-K 2025 nomor 26-28. */
const memo07 = new Map();
const tiga07 = (N) => {
  if (N <= 1) return 1;
  if (memo07.has(N)) return memo07.get(N);
  const r = N % 3 === 0 ? tiga07(N - 1) + tiga07(N - 3)
    : N % 3 === 1 ? tiga07(N - 2) : tiga07(N - 3);
  memo07.set(N, r);
  return r;
};

/* Ditulis ulang dari kode C++ naskah OSN-K 2026 nomor 38-40, tanpa math.js.
   Untuk y kecil rekursinya ditelusuri sungguhan; untuk y raksasa dipakai
   sifat 2^66 = 1 (mod 67) yang sudah diuji terhadap telusuran itu. */
const maiSim06 = (x, y, z) => y === 0 ? (x + z) % 67
  : maiSim06(maiSim06(x, y - 1, z), y - 1, z);
const pow2m67 = (y) => { let v = 1; for (let i = 0; i < ((y % 66) + 66) % 66; i++) v = v * 2 % 67; return v; };
const mai06 = (x, y, z) => (x + pow2m67(y) * z) % 67;
const hitungDasar06 = (x, y, z, cari) => { let n = 0;
  const jalan = (a, b) => { if (b === 0) { if (a === cari) n++; return (a + z) % 67; }
    return jalan(jalan(a, b - 1), b - 1); };
  jalan(x, y); return n; };

/* Ditulis ulang dari kode C++ naskah OSN-K 2026 nomor 32-34, tanpa math.js. */
const mondar05 = (P) => [...P].map((c) => c === '0' ? '1' : '0').join('');
const mandir05 = (n) => { let t = '0';
  for (let i = 0; i < n; i++) t = t + mondar05(t);
  return t; };

/* Ditulis ulang dari bunyi soal OSN-K 2025 nomor 23-25, tanpa math.js. */
const bisaTakar04 = (n, a, b) => {
  for (let x = 0; a * x <= n; x++) if ((n - a * x) % b === 0) return true;
  return false;
};
const cacahGagal04 = (N, a, b) => {
  let t = 0;
  for (let n = 1; n <= N; n++) if (!bisaTakar04(n, a, b)) t++;
  return t;
};

/* Ditulis ulang dari kode C++ naskah OSN-K 2026 nomor 35-37 dan
   2024 nomor 38-40, sengaja tanpa math.js. */
const lipat01 = (n) => n === 1 ? 1 : 2 * lipat01(Math.floor(n / 2));
const kode01 = (n) => 2 * (n - lipat01(n)) + 1;
const tunggal01 = (n) => { let t = 0; for (let i = 1; i <= n; i++) t += kode01(i); return t; };
const ganda01 = (n) => { let t = 0;
  for (let i = 1; i <= n; i++) { let x = i, putar = 0;
    while (putar++ < 200) { const y = kode01(x); if (y === x) break; x = y; }
    t += x; }
  return t; };
const pndk01 = (N, K) => { let r = 1;
  for (let i = 2; i <= N; i++) r = (r + K - 1) % i + 1;
  return r; };

/* Ditulis ulang dari kode C++ naskah OSN-K 2025, sengaja tanpa math.js. */
const merah03 = (A, B) => B === 0 ? A : merah03(B, A % B);
const nusantara03 = (A, B) => {
  let n = 0;
  for (let C = 1; C <= A; C++) if (merah03(A, C) === B) n++;
  return n;
};

const panas02 = (x) => { let s = 0; while (x > 0) { s += x % 10; x = Math.floor(x / 10); } return s; };
const dingin02 = (X, Y) => { let air = 0;
  while (panas02(air) !== X) { air += Y; if (air > 2e6) return null; }
  return air; };
const campur02 = (C, x) => { while (x > 0) { C[x % 10]++; x = Math.floor(x / 10); } };
const aduk02 = (x, y) => { const C = new Array(10).fill(0);
  for (let i = x; i <= y; i++) campur02(C, i); return C; };
const kecil02 = (target) => { for (let x = 1; x < 1e6; x++) {
    const C = new Array(10).fill(0); campur02(C, x);
    if (C.every((v, i) => v === target[i])) return x; } return null; };

const kal = (d) => d.reduce((a, b) => a * b, 1);

/* pohon soal OSN-K 2026 nomor 7 */
const ANAK09 = { A:['B','C','D'], B:['E','F'], C:['G','H','M'], D:['I'],
  E:['J','T'], F:['K'], G:['L'], H:['N'], I:['O','P'], J:['Q'],
  L:['R','U'], N:['S','Z'], O:['V'], Q:['W'], S:['Y'], U:['X'] };
const INDUK09 = {};
for (const a of Object.keys(ANAK09)) for (const b of ANAK09[a]) INDUK09[b] = a;
const HURUF = [...Array(26)].map((_, i) => String.fromCharCode(65 + i));
const SOAL09 = [['F','T'],['N','O'],['R','U'],['I','V'],['X','H']];

/* denah soal OSN-K 2024 nomor 5 */
const RUAS10 = [['0','1'],['0','5'],['0','4'],['1','6'],['1','2'],['5','6'],
                ['5','7'],['4','7'],['4','3'],['2','6'],['2','3'],['3','7']];

/* kotak penyimpanan OSN-K 2025 nomor 17-19 */
const S19K = [[2,5],[3,12],[5,19],[8,4],[13,15],[21,7],[34,8]]
  .flatMap(([u, n]) => Array(n).fill(u));

/* jadwal pembinaan OSN-K 2026 nomor 14-16 */
const NAMA13 = ['T', 'O', 'K'];
const P1415 = [[2,2,2,2,2,2,2,2,2,2],[3,3,3,3,3,3,3,3,3,3],[5,5,5,5,5,5,5,5,5,5]];
const P16 = [[2,2,2,1,7,8,4,5,3,4],[3,3,3,1,5,6,9,7,5,6],[5,5,5,1,4,3,5,6,8,9]];

/* pertemanan ayam OSN-K 2024 nomor 14-16 */
const AYAM = [...Array(15)].map((_, i) => String.fromCharCode(65 + i));
const TEMAN = [['A','B'],['C','M'],['E','G'],['A','M'],['D','J'],['O','N'],
               ['B','O'],['K','L'],['D','I'],['B','N'],['L','D'],['H','F']];

export const KLAIM = {

  '01-josephus': [
    /* Enam jawaban soal aslinya. Fungsi pembandingnya ditulis ulang dari
       kode C++ naskah OSN-K, sengaja TANPA math.js — supaya klaimnya
       diadu dengan sumber lain, bukan dengan dirinya sendiri. */
    { apa: 'OSN-K 2026 soal 35 — KODE(41)',
      hitung: () => kode01(41), khusus: true, dekat: 'Cek biner', semua: true },
    { apa: 'OSN-K 2026 soal 36 — TUNGGAL(63)',
      hitung: () => tunggal01(63), khusus: true, dekat: 'Tanpa rumus' },
    { apa: 'OSN-K 2026 soal 37 — GANDA(63, 64656667)',
      hitung: () => ganda01(63), khusus: true, dekat: 'Cek: KODE diterapkan' },
    { apa: 'OSN-K 2024 soal 38 — pndk(7, 7)',
      hitung: () => pndk01(7, 7), khusus: true, dekat: 'pndk\\(7, 7\\) =', semua: true },
    { apa: 'OSN-K 2024 soal 39 — kembalian terbesar di antara lima pilihan',
      hitung: () => Math.max(...[30, 40, 50, 60, 70].map((n) => pndk01(n, 3))),
      khusus: true, dekat: 'terbesar: pndk' },
    { apa: 'OSN-K 2024 soal 40 — N terkecil yang kembaliannya terbesar',
      hitung: () => { let bN = 1, bV = 0;
        for (let N = 1; N <= 5000; N++) { const v = pndk01(N, 2);
          if (v > bV) { bV = v; bN = N; } }
        return bN; },
      khusus: true, dekat: 'yaitu tepat sebelum p melompat' },
    { apa: 'yang selamat untuk n = 41, K = 3 (soal klasik)',
      hitung: (M) => M.josRec(41, 3), khusus: true },
    { apa: 'yang selamat untuk n = 100, K = 2',
      hitung: (M) => M.jos2(100), khusus: true },
  ],

  '02-digit-sum': [
    /* Akar digit 123456789 (angka 9) dan jawaban soal 37 (angka 3) TIDAK
       didaftarkan di sini. Dua-duanya satu digit: sudah dibuktikan dengan
       merusak modulnya bahwa auditor tetap hijau. Sekarang dijaga dengan
       pencocokan TEPAT di tests/02-digit-sum.test.mjs. */
    { apa: 'jumlah digit 4587',
      hitung: (M) => M.digitSum(4587), khusus: true },

    /* Enam jawaban soal aslinya. Semuanya DIHITUNG ULANG dari kode C++
       di naskahnya, bukan disalin dari modul. */
    { apa: 'OSN-K 2024 soal 35 — dingin(10, 7)',
      hitung: () => dingin02(10, 7), khusus: true, dekat: 'yang perlu dicek →', semua: true },
    { apa: 'OSN-K 2024 soal 36 — dingin(2, 35)',
      hitung: () => dingin02(2, 35), khusus: true, dekat: 'digit sum 2' },
    { apa: 'OSN-K 2026 soal 29 — x terkecil',
      hitung: () => kecil02([1, 0, 2, 0, 0, 0, 1, 0, 0, 1]), khusus: true,
      dekat: 'sisanya urut menaik' },
    { apa: 'OSN-K 2026 soal 30 — C[0] setelah ADUK(997, 1018)',
      hitung: () => aduk02(997, 1018)[0], khusus: true, dekat: 'Jawaban: C\\[0\\]', semua: true },
    { apa: 'OSN-K 2026 soal 31 — C[9] setelah RATA(997, 1018)',
      hitung: (M) => M.rataBobot(997, 1018)[9], khusus: true, dekat: 'C\\[9\\] =', semua: true },
  ],

  '03-gcd': [
    /* FPB(48, 18) = 6 dan ketiga jawaban soal 38-40 (6, 2, 8) TIDAK
       didaftarkan di sini. Semuanya angka satu digit: digitnya selalu
       muncul juga di jendela yang sama — "2025", "φ(4)", daftar bilangan
       koprima — jadi klaimnya tetap hijau walaupun modulnya sudah salah.
       Sudah dibuktikan dengan merusak modulnya. Sekarang dijaga dengan
       pencocokan TEPAT di tests/03-gcd.test.mjs. */
    { apa: 'φ(2025) — dipakai bedah soal', hitung: (M) => M.totient(2025), khusus: true,
      dekat: 'φ\\(2\\.025\\) =', semua: true },
    { apa: 'berapa kali FPB dihitung kalau tanpa jalan pintas',
      hitung: () => 2025, khusus: true, dekat: 'kali hitung FPB', semua: true },
  ],

  '04-frobenius': [
    /* Tiga jawaban soal aslinya. Pembandingnya ditulis ulang dari bunyi
       soal — bisa/tidaknya sebuah volume ditakar dicoba satu per satu,
       sengaja tanpa memakai rumus Frobenius di math.js. */
    { apa: 'OSN-K 2025 soal 23 — N=20, gayung 3 dan 5',
      hitung: () => cacahGagal04(20, 3, 5), khusus: true,
      dekat: 'sudah jauh di atas', semua: true },   /* hanya ada di kotak soal 23 */
    { apa: 'OSN-K 2025 soal 24 — N=1000, gayung 9 dan 21',
      hitung: () => cacahGagal04(1000, 9, 21), khusus: true,
      dekat: 'jadi yang BISA' },
    { apa: 'OSN-K 2025 soal 25 — banyaknya yang gagal untuk gayung 3 dan 100',
      hitung: () => cacahGagal04(400, 3, 100), khusus: true,
      dekat: 'hasilnya tetap' },
    { apa: 'bilangan terbesar yang tidak bisa ditakar gayung 3 dan 100',
      hitung: () => { let t = 0;
        for (let n = 1; n <= 400; n++) if (!bisaTakar04(n, 3, 100)) t = n;
        return t; },
      khusus: true, dekat: 'semua bebek bisa dimandikan' },
    { apa: 'bilangan terbesar yang tidak bisa dibentuk dari 3 dan 5',
      hitung: (M) => M.frobenius(3, 5).largest, khusus: false },
    { apa: 'banyaknya yang tidak bisa dibentuk dari 3 dan 5',
      hitung: (M) => M.frobenius(3, 5).count, khusus: false },
    { apa: 'cacah gagal sampai 1000 untuk 9 dan 21',
      hitung: (M) => M.frobeniusCacah(1000, 9, 21), khusus: true },
  ],

  '05-doubling': [
    /* Tiga jawaban soal aslinya. Pembandingnya membangun string MANDIR
       apa adanya dari kode C++ naskahnya, tanpa memakai math.js. */
    { apa: 'OSN-K 2026 soal 32 — banyak "1" di MANDIR(12)',
      hitung: () => [...mandir05(12)].filter((x) => x === '1').length,
      khusus: true, dekat: '÷ 2 =', semua: true },
    { apa: 'OSN-K 2026 soal 34 — banyak "00" di MANDIR(12)',
      hitung: () => { const t = mandir05(12); let n = 0;
        for (let i = 0; i < t.length - 1; i++) if (t[i] === '0' && t[i + 1] === '0') n++;
        return n; },
      khusus: true, dekat: '÷ 3 ⌋ =', semua: true },
    { apa: 'panjang MANDIR(12)',
      hitung: () => mandir05(12).length, khusus: true, dekat: 'panjang MANDIR' },
    { apa: 'n terkecil yang panjangnya cukup untuk karakter ke-2027',
      hitung: () => { let m = 0; while (Math.pow(2, m) < 2027) m++; return Math.pow(2, m); },
      khusus: true, dekat: 'cukup, karena 2027' },
    { apa: 'banyaknya "00" di MANDIR(12) — pernah salah ditulis 1023',
      hitung: (M) => M.mandirC00(12), khusus: true },
    { apa: 'panjang MANDIR(12)',
      hitung: () => 4096, khusus: true },
  ],

  '06-mai': [
    /* Tiga jawaban soal aslinya. Pembandingnya MENELUSURI rekursinya
       apa adanya dari kode C++ naskahnya untuk y kecil, dan memakai
       sifat berulangnya untuk y besar — sengaja tanpa math.js. */
    { apa: 'OSN-K 2026 soal 38 — MAI(13, 666666, 37)',
      hitung: () => mai06(13, 666666, 37), khusus: true,
      dekat: 'mod 67 = 50 mod 67', semua: true },
    { apa: 'OSN-K 2026 soal 39 — banyaknya tripel yang hasilnya 0',
      hitung: () => 201 * 201 * 3, khusus: true, dekat: 'jawabannya =', semua: true },
    { apa: 'OSN-K 2026 soal 40 — berapa kali MAI(0,0,2) dipanggil',
      hitung: () => hitungDasar06(0, 10, 2, 0), khusus: true,
      dekat: 'jadi ada 15 \\+ 1 =' },
    { apa: 'total pemanggilan dasar saat MAI(0, 10, 2) dijalankan',
      hitung: () => Math.pow(2, 10), khusus: true, dekat: 'pemanggilan dasar' },
    { apa: 'banyaknya pasangan (y, z) di soal 39',
      hitung: () => 201 * 201, khusus: true, dekat: 'banyaknya pasangan' },
    { apa: 'periode 2 pangkat sekian modulo 67',
      hitung: (M) => M.ord2mod67(), khusus: false },
  ],

  '07-tiga': [
    /* Jawaban soal 26 (angka 7) TIDAK didaftarkan di sini — satu digit,
       sudah dibuktikan tidak bisa gagal. Dijaga dengan pencocokan TEPAT
       di tests/07-tiga.test.mjs.

       Sisanya tiga digit ke atas. Pembandingnya MENELUSURI rekursinya
       apa adanya dari kode C++ naskahnya, tanpa memakai math.js. */
    { apa: 'OSN-K 2025 soal 27 — berapa banyak yang bernilai 1',
      hitung: () => { let n = 0; for (let k = 1; k <= 2025; k++) if (tiga07(k) === 1) n++; return n; },
      khusus: true, dekat: 'habis dibagi 3, jadi pembagiannya', semua: true },
    { apa: 'OSN-K 2025 soal 28 — TIGA(1) sampai TIGA(100) dijumlahkan',
      hitung: () => { let t = 0; for (let k = 1; k <= 100; k++) t += tiga07(k); return t; },
      khusus: true, dekat: 'total =', semua: true },
    { apa: 'banyaknya kelipatan 3 sampai 2025',
      hitung: () => Math.floor(2025 / 3), khusus: true, dekat: '÷ 3 =' },
    { apa: 'TIGA(2025)', hitung: (M) => M.tiga(2025), khusus: true },
    { apa: 'jumlah TIGA(1) sampai TIGA(100) — soal 28',
      hitung: (M) => M.tigaJumlah(100), khusus: true },
    { apa: 'banyaknya k di 1..100 dengan TIGA(k) = 1',
      hitung: (M) => M.tigaCacah1(100), khusus: true },
  ],

  '08-toposort': [
    /* Jawaban soal 2024 nomor 2 (5, 6), level (4), dan posisi paling awal (6)
       TIDAK didaftarkan di sini. Semuanya angka satu digit: lapis 2 mencari
       angka sebagai potongan teks, dan digit itu selalu ada juga di "2024",
       "soal 9", atau nomor daftar — jadi klaimnya tetap hijau walaupun
       modulnya sudah salah. Sudah dibuktikan dengan merusak modulnya.
       Sekarang dijaga dengan pencocokan TEPAT di tests/08-toposort.test.mjs.

       Sisanya di bawah ini dua digit ke atas, jadi aman di lapis 2.
       Pembandingnya menelusuri tabel naskahnya, tanpa math.js. */
    { apa: 'OSN-K 2025 soal 9 — waktu minimum seluruh pelatihan',
      hitung: () => Math.max(...Object.keys(DUR08).map(selesai08)), khusus: true,
      dekat: 'Yang benar:', semua: true },
    { apa: 'total semua durasi pelatihan — angka jebakan soal 9',
      hitung: () => Object.values(DUR08).reduce((a, b) => a + b, 0), khusus: true,
      dekat: 'total semua durasi' },
    { apa: 'panjang jalur kritis soal 9',
      hitung: () => DUR08.CPP + DUR08.DS + DUR08.BF + DUR08.GRE, khusus: true,
      dekat: 'Jalur kritis: CPP' },
  ],

  '09-lca': [
    { apa: 'jawaban soal 2026 nomor 7',
      hitung: (M) => SOAL09.map(([a, b]) => M.lca(INDUK09, a, b)).join(''),
      format: 'teks', khusus: true },
    { apa: 'banyaknya pasangan batu di pohon itu',
      hitung: () => 26 * 25 / 2, khusus: true },
    { apa: 'langkah cara panjang untuk 5 pertanyaan',
      hitung: (M) => SOAL09.reduce((t, [a, b]) => t + M.lcaLangkahPanjang(INDUK09, a, b), 0),
      khusus: true, dekat: 'lawan .{0,3} langkah cara panjang' },
    { apa: 'langkah cara trik untuk 5 pertanyaan',
      hitung: (M) => SOAL09.reduce((t, [a, b]) => t + M.lcaTrik(INDUK09, a, b).langkah, 0),
      khusus: true, dekat: 'lima pertanyaan soal 2026', semua: true },
    { apa: 'pasangan yang LCA-nya salah satu hurufnya sendiri',
      hitung: (M) => HURUF.flatMap((a, i) => HURUF.slice(i + 1).map((b) => [a, b]))
        .filter(([a, b]) => [a, b].includes(M.lca(INDUK09, a, b))).length, khusus: true },
    { apa: 'langkah trik terburuk di pohon itu',
      hitung: (M) => Math.max(...HURUF.flatMap((a, i) =>
        HURUF.slice(i + 1).map((b) => M.lcaTrik(INDUK09, a, b).langkah))), khusus: true },
  ],

  '10-euler': [
    { apa: 'jawaban soal 2024 nomor 5 (minimal hari)',
      hitung: (M) => M.eulerMinLintasan(RUAS10), khusus: true, dekat: 'minimum hari', semua: true },
    { apa: 'banyaknya ruas jalan di denah 2024',
      hitung: () => RUAS10.length, khusus: true },
    { apa: 'derajat tiap persimpangan di denah 2024',
      hitung: (M) => M.eulerTeratur(RUAS10).derajat, khusus: true },
    { apa: 'tahun Euler menyelesaikan Konigsberg',
      hitung: () => 1736, format: 'teks', khusus: false, dekat: 'Solutio problematis' },
    { apa: 'tahun bukti lengkap Hierholzer',
      hitung: () => 1873, format: 'teks', khusus: false, dekat: 'Carl Hierholzer', semua: true },
    { apa: 'jarak tahun antara keduanya',
      hitung: () => 1873 - 1736, khusus: false, dekat: 'tahun kemudian' },
    { apa: 'Konigsberg asli butuh berapa lintasan',
      hitung: (M) => M.eulerMinLintasan(
        [['A','B'],['A','B'],['A','C'],['A','C'],['A','D'],['B','D'],['C','D']]),
      khusus: false, opsional: true },
  ],

  '11-kombinatorika': [
    { apa: 'nomor 14 — banyaknya lingkaran pertemanan',
      hitung: (M) => M.kKelompok(AYAM, TEMAN).length, khusus: true },
    { apa: 'nomor 15 — tiap lingkaran wajib kirim',
      hitung: (M) => M.kTepatSatuTiap(M.kKelompok(AYAM, TEMAN).map((k) => k.length)),
      khusus: true },
    { apa: 'nomor 16 — tidak wajib, minimal satu',
      hitung: (M) => M.kSetidaknyaSatu(M.kKelompok(AYAM, TEMAN).map((k) => k.length)),
      khusus: true, dekat: 'buang 1 kemungkinan kosong' },
    { apa: 'banyaknya suku cara panjang untuk 4 kelompok',
      hitung: (M) => M.kRinciPanjang([6, 5, 2, 2]).suku.length, khusus: false },
    { apa: 'banyaknya suku cara panjang untuk 10 kelompok',
      hitung: () => Math.pow(2, 10) - 1, khusus: false },
    { apa: 'sandi 4 angka yang memuat setidaknya satu angka 7',
      hitung: (M) => M.kKomplemen(4, 10).jawab, khusus: false },
    { apa: 'kata berbeda dari huruf MEGAGIGA',
      hitung: (M) => M.kPermutasiBerulang([3, 2, 1, 1, 1]), khusus: false },
    { apa: 'trik polos untuk kelompok 3, 3, 2',
      hitung: (M) => M.kSetidaknyaSatu([3, 3, 2]), khusus: false, dekat: 'Trik polos menjawab', semua: true },
    { apa: 'jawaban benar setelah satu larangan',
      hitung: (M) => M.kBerlarangan([3, 3, 2], [[[0, 0], [1, 0]]]), khusus: false, dekat: 'Jawaban yang benar', semua: true },
  ],

  '12-prefix': [
    { apa: 'jumlah larik contoh posisi 3..6',
      hitung: (M) => M.psJumlah(M.psTabel([3,1,4,1,5,9,2,6]), 3, 6),
      khusus: true, dekat: '1 pengurangan' },
    { apa: 'langkah cara apa adanya untuk 500 penyiram x 1.000 petak',
      hitung: (M) => M.psTerapkanKasar(1000,
        [...Array(500)].map(() => ({ l: 1, r: 1000, v: 1 }))).langkah,
      khusus: false, dekat: 'tambah satu per satu', semua: true },
    { apa: 'langkah trik dua tanda untuk soal yang sama',
      hitung: (M) => M.psTerapkan(1000,
        [...Array(500)].map(() => ({ l: 1, r: 1000, v: 1 }))).langkah,
      khusus: false, dekat: 'dua tanda lalu sapu', semua: true },
    { apa: 'kotak kanan bawah 2x2 pada papan 3x3 berisi 1',
      hitung: (M) => M.psKotak(M.psTabel2D([[1,1,1],[1,1,1],[1,1,1]]), 2, 2, 3, 3),
      khusus: false },
    { apa: 'kotak acak yang salah kalau koreksinya dilupakan',
      hitung: () => 7411, khusus: false, dekat: 'koreksinya dilupakan' },
  ],

  '13-dp': [
    { apa: 'jawaban soal 2026 nomor 14',
      hitung: (M) => M.dpJadwal(P1415, [1, 1, 1], NAMA13).best,
      khusus: true, dekat: 'A=1 B=1 C=1' },
    { apa: 'jawaban soal 2026 nomor 15',
      hitung: (M) => M.dpJadwal(P1415, [1, 2, 3], NAMA13).best,
      khusus: true, dekat: 'A=1 B=2 C=3' },
    { apa: 'jawaban soal 2026 nomor 16',
      hitung: (M) => M.dpJadwal(P16, [1, 1, 1], NAMA13).best, khusus: true },
    { apa: 'banyaknya jadwal kalau dicoba semua (4^10)',
      hitung: () => Math.pow(4, 10), khusus: true },
    { apa: 'langkah trik dua terbesar untuk 10 hari',
      hitung: (M) => M.dpDuaTerbesar(P16).langkah, khusus: true, dekat: 'trik dua terbesar' },
    /* CATATAN: jangkar `dekat` TIDAK boleh memuat angka yang diperiksa.
       Kalau angkanya dirusak, jangkarnya ikut hilang dan jendelanya
       lenyap — auditor jadi tidak menemukan apa pun untuk digagalkan. */
    { apa: 'hasil salah kalau trik dipaksakan ke soal 15',
      hitung: (M) => M.dpDuaTerbesar(P1415).best,
      khusus: false, dekat: 'dipaksakan', semua: true },
    /* Jangkar harus SPESIFIK. "padahal jawabannya" ternyata dipakai dua
       klaim berbeda di modul ini (32 dan 24), jadi tidak bisa dipakai. */
    { apa: 'jawaban benar soal 15, di tiap tempat trik itu dibahas',
      hitung: (M) => M.dpJadwal(P1415, [1, 2, 3], NAMA13).best,
      khusus: true, dekat: '(trik jeda-1 pada soal 15|tabel soal 15)', semua: true },
    { apa: 'menjumlah per jenis memberi angka yang salah',
      hitung: () => 30, khusus: false, dekat: 'menjumlah per jenis memberi' },
    { apa: 'jawaban benar untuk contoh menjumlah per jenis',
      hitung: () => 24, khusus: false, dekat: 'per jenis memberi 30 padahal' },
    { apa: 'banyaknya soal di keluarga lengkap modul 13',
      hitung: () => 13824, khusus: false, dekat: 'yang didaftar', semua: true },
    { apa: 'banyaknya soal yang membuat serakah salah',
      hitung: () => 1716, khusus: false, dekat: 'serakah salah pada' },
    { apa: 'jawaban cara serakah pada soal 15',
      hitung: (M) => M.dpSerakah(P1415, [1, 2, 3], NAMA13).best, khusus: true },
  ],

  '14-pigeonhole': [
    { apa: 'jawaban soal 2024 nomor 17',
      hitung: (M) => M.phDijamin([5,5,5,5,5,5,5], 1), khusus: true,
      dekat: 'total 35 − terkecil 5', semua: true },
    { apa: 'jawaban soal 2024 nomor 18',
      hitung: (M) => M.phDijamin([...Array(100)].map((_, i) => 10 * (i + 1)), 5),
      khusus: true, dekat: '− 10 \\+ 5 =', semua: true },
    { apa: 'total butir soal nomor 18',
      hitung: () => 50500, khusus: true, dekat: 'total = 10 ×' },
    { apa: 'jawaban soal 2024 nomor 19',
      hitung: (M) => M.phSusunan(25, 20, 3, 1).length, khusus: true,
      dekat: 'selisihnya' },
    { apa: 'nilai terkecil yang dicari nomor 19',
      hitung: () => 6, khusus: true, dekat: 'terkecil =' },
    { apa: 'tarikan mesin capit OSN-K 2023 nomor 19',
      hitung: (M) => M.phCapit({ boneka: 16, bola: 4, mobil: 7, puzzle: 2 }, 5, 2).tarikan,
      khusus: true, dekat: 'tarikan ×' },
    { apa: 'keadaan paling sial mesin capit',
      hitung: (M) => M.phCapit({ boneka: 16, bola: 4, mobil: 7, puzzle: 2 }, 5, 2).terburuk,
      khusus: true, dekat: 'belum satu pun kombinasi' },
    { apa: 'jawaban "supaya mungkin" untuk nomor 17',
      hitung: (M) => M.phMungkin([5,5,5,5,5,5,5], 1), khusus: true,
      dekat: 'mungkin' },
    { apa: 'banyaknya digit ruang keadaan soal nomor 18',
      hitung: (M) => String(M.phRuang([...Array(100)].map((_, i) => 10 * (i + 1)))).length,
      khusus: true, dekat: 'banyaknya keadaan punya' },
  ],

  '15-kotak-bersarang': [
    { apa: 'jawaban soal 2025 nomor 17',
      hitung: (M) => M.dwMin([1,1,2,2,2,3,3,4,6,8]), khusus: true,
      dekat: 'sisi 2 tidak bisa saling masuk' },
    { apa: 'jawaban soal 2025 nomor 19',
      hitung: (M) => M.dwMin(S19K), khusus: true, dekat: 'jawabannya tetap', semua: true },
    { apa: 'total kotak soal nomor 19',
      hitung: () => S19K.length, khusus: true, dekat: 'Kamu juga tidak perlu menjumlahkan sampai' },
    { apa: 'tahun terbitnya teorema Dilworth',
      hitung: () => 1950, format: 'teks', khusus: false, dekat: 'Dilworth menerbitkannya pada', semua: true },
    { apa: 'rumus kubus meleset berapa kali dari 400 susunan balok',
      hitung: () => 365, khusus: true, dekat: 'meleset pada' },
    /* Jangan daftarkan klaim berangka SATU DIGIT kalau jangkarnya sendiri
       memuat digit itu — pencocokannya substring, jadi selalu lolos.
       Contoh yang pernah gagal: nilai 2 dengan jangkar "boleh 2 kotak". */
    { apa: 'jawaban nomor 19 kalau tiap kotak boleh muat 2',
      hitung: (M) => M.dwLebar(S19K, 2), khusus: true,
      dekat: 'jawabannya jadi', semua: true },
  ],

  '17-kamus': [
    { apa: 'banyaknya entri kamus', hitung: () => ENTRI17.length, khusus: false,
      dekat: 'entri, ' },
    { apa: 'banyaknya entri jebakan', hitung: () => ENTRI17.filter((e) => e.jebakan).length,
      khusus: false, dekat: 'di antaranya jebakan' },
  ],

  '16-drill': [
    /* Angkanya dihitung dari banknya sendiri, bukan diketik. Kalau kartu
       ditambah, klaim ini ikut menyesuaikan — yang diperiksa adalah
       apakah MODULNYA sudah menyebut angka yang benar. */
    { apa: 'banyaknya kartu di bank', hitung: () => BANK16.length, khusus: false,
      dekat: 'kartu terverifikasi' },
  ],
};

export default KLAIM;
