/* ============================================================
   UJI MODUL 01 — JOSEPHUS
   Keenam jawaban soal aslinya diadu dengan kode C++ naskahnya,
   ditulis ulang di sini tanpa memakai math.js.

   CATATAN: jawaban berangka SATU DIGIT tidak boleh mengandalkan
   tests/klaim.mjs — pencocokannya substring, jadi angka 5 ikut
   cocok di dalam "50" atau "35" yang kebetulan ada di dekatnya.
   Untuk yang satu digit, dipakai pencocokan TEPAT di berkas ini.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('01-josephus');
const c = await bangunModul('01-josephus');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

/* --- ditulis ulang dari kode C++ naskah, tanpa math.js --- */
const lipat = (n) => n === 1 ? 1 : 2 * lipat(Math.floor(n / 2));
const kode = (n) => 2 * (n - lipat(n)) + 1;
const tunggal = (n) => { let s = 0; for (let i = 1; i <= n; i++) s += kode(i); return s; };
const ganda = (n) => { let s = 0;
  for (let i = 1; i <= n; i++) { let x = i, p = 0;
    while (p++ < 200) { const y = kode(x); if (y === x) break; x = y; }
    s += x; }
  return s; };
const pndk = (N, K) => { let r = 1; for (let i = 2; i <= N; i++) r = (r + K - 1) % i + 1; return r; };

t.bagian('Jawaban OSN-K 2026 soal 35-37 — Lipat Kode');
c.klik('solve26');
t.cek('soal 35: KODE(41) = 19', /KODE\(41\) = 2×9 \+ 1 = 19/.test(c.teks('a1')), c.teks('a1').slice(0, 60));
t.cek('soal 36: TUNGGAL(63) = 1.365', /341 \+ 1024\s*=\s*1365(?!\d)/.test(c.teks('a2')), c.teks('a2').slice(0, 80));
t.cek('soal 37: GANDA = 665', /= 729 − 64 = 665/.test(c.teks('a3')), c.teks('a3').slice(-70));
t.cek('kode C++ setuju: KODE(41) = 19', kode(41) === 19);
t.cek('kode C++ setuju: TUNGGAL(63) = 1365', tunggal(63) === 1365);
t.cek('kode C++ setuju: GANDA(63, k besar) = 665', ganda(63) === 665);
t.cek('math.js setuju: jos2(41) = KODE(41)', M.jos2(41) === kode(41));
t.cek('math.js setuju: sumJ2(63) = TUNGGAL(63)', M.sumJ2(63) === tunggal(63));

t.bagian('Jawaban OSN-K 2024 soal 38-40 — Fungsi Pendek');
c.klik('solve24');
/* satu digit: dicocokkan TEPAT, bukan lewat klaim.mjs */
t.cek('soal 38: pndk(7, 7) = 5 — dicocokkan tepat',
  /pndk\(7, 7\) = 5(?!\d)/.test(c.teks('b1')), c.teks('b1').replace(/\s+/g, ' ').slice(-50));
t.cek('soal 39: terbesar pndk(60,3) = 41', /terbesar: pndk\(60,3\) = 41/.test(c.teks('b2')));
t.cek('soal 40: N = 4.095', /N = 4095 = 2\^11 \+ 2047/.test(c.teks('b3')), c.teks('b3').slice(0, 100));
t.cek('kode C++ setuju: pndk(7,7) = 5', pndk(7, 7) === 5);
t.cek('kode C++ setuju: terbesar di antara lima pilihan = 41',
  Math.max(...[30, 40, 50, 60, 70].map((n) => pndk(n, 3))) === 41);
t.cek('kode C++ setuju: pndk(60,3) yang terbesar',
  [30, 40, 50, 70].every((n) => pndk(n, 3) < pndk(60, 3)));
t.cek('kode C++ setuju: N terkecil dengan kembalian terbesar = 4095', (() => {
  let bN = 1, bV = 0;
  for (let N = 1; N <= 5000; N++) { const v = pndk(N, 2); if (v > bV) { bV = v; bN = N; } }
  return bN === 4095; })());
t.cek('naskah menyebut pndk(20,3) = 20, dan memang begitu', pndk(20, 3) === 20);

t.bagian('math.js cocok dengan kode C++ pada masukan acak');
let salah = 0;
for (let p = 0; p < 400; p++) {
  const N = 1 + Math.floor(Math.random() * 300), K = 1 + Math.floor(Math.random() * 9);
  if (M.josRec(N, K) !== pndk(N, K)) salah++;
  if (K === 2 && M.jos2(N) !== kode(N)) salah++;
}
t.cek('josRec dan jos2 cocok dengan kode C++ pada 400 kasus acak', salah === 0, String(salah));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
