/* ============================================================
   UJI MODUL 05 — REKURSI DOUBLING
   Ketiga jawaban soal OSN-K 2026 nomor 32-34 diadu dengan string
   MANDIR yang dibangun apa adanya dari kode C++ naskahnya.

   Soal 33 jawabannya berupa TEKS ("100"), jadi tidak bisa lewat
   tests/klaim.mjs — dicocokkan tepat di sini.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('05-doubling');
const c = await bangunModul('05-doubling');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

/* dibangun apa adanya dari kode C++ naskah, tanpa math.js */
const mondar = (P) => [...P].map((x) => x === '0' ? '1' : '0').join('');
const mandir = (n) => { let s = '0'; for (let i = 0; i < n; i++) s = s + mondar(s); return s; };
const S12 = mandir(12), S11 = mandir(11);

t.bagian('Jawaban OSN-K 2026 soal 32-34 — Mondar-Mandir');
c.klik('solve');
t.cek('soal 32: modul menjawab 2.048',
  /4\.096 ÷ 2 = 2\.048/.test(c.teks('s1')), c.teks('s1').replace(/\s+/g, ' ').slice(0, 90));
t.cek('kode C++ setuju: 2048 angka "1" di MANDIR(12)',
  [...S12].filter((x) => x === '1').length === 2048);
t.cek('soal 33: modul menjawab "100"',
  /jawabannya "100"(?!\S)/.test(c.teks('s2')), c.teks('s2').replace(/\s+/g, ' ').slice(0, 200));
t.cek('kode C++ setuju: karakter ke-2025..2027 adalah "100"',
  S11.slice(2024, 2027) === '100', S11.slice(2024, 2027));
t.cek('trik biner memberi jawaban yang sama',
  /→ "100" ✓ sama/.test(c.teks('s2')));
t.cek('soal 34: modul menjawab 682',
  /÷ 3 ⌋ = 682(?!\d)/.test(c.teks('s3')), c.teks('s3').replace(/\s+/g, ' ').slice(0, 120));
t.cek('kode C++ setuju: 682 substring "00" di MANDIR(12)', (() => {
  let n = 0; for (let i = 0; i < S12.length - 1; i++) if (S12[i] === '0' && S12[i + 1] === '0') n++;
  return n === 682; })());

t.bagian('math.js cocok dengan string yang dibangun apa adanya');
t.cek('mandir(12) sama persis', M.mandir(12) === S12);
let salah = 0;
for (let i = 0; i < 4096; i++) if (String(M.tm(i)) !== S12[i]) salah++;
t.cek('trik biner cocok untuk keempat ribu karakter', salah === 0, String(salah));
t.cek('mandirC00(12) = 682', M.mandirC00(12) === 682n, String(M.mandirC00(12)));
let salahC = 0;
for (let n = 1; n <= 14; n++) {
  const s = mandir(n); let x = 0;
  for (let i = 0; i < s.length - 1; i++) if (s[i] === '0' && s[i + 1] === '0') x++;
  if (M.mandirC00(n) !== BigInt(x)) salahC++;
}
t.cek('rumus "00" cocok untuk n = 1..14', salahC === 0, String(salahC));
t.cek('mandirPotong cocok dengan string aslinya',
  M.mandirPotong(2024, 3) === S11.slice(2024, 2027));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
