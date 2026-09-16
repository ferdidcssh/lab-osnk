/* ============================================================
   UJI MODUL 06 — DOUBLING PADA ANGKA (MAI)
   Rumus (x + 2ʸ × z) mod 67 diadu dengan MENELUSURI rekursinya
   apa adanya dari kode C++ naskahnya. Ketiga jawaban soal
   OSN-K 2026 nomor 38-40 dicocokkan tepat.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('06-mai');
const c = await bangunModul('06-mai');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

/* ditelusuri apa adanya dari kode C++ naskah, tanpa math.js */
const maiSim = (x, y, z) => y === 0 ? (x + z) % 67 : maiSim(maiSim(x, y - 1, z), y - 1, z);
const pow2 = (y) => { let v = 1; for (let i = 0; i < ((y % 66) + 66) % 66; i++) v = v * 2 % 67; return v; };
const mai = (x, y, z) => (x + pow2(y) * z) % 67;

t.bagian('Rumus diadu dengan telusuran rekursi sungguhan');
let beda = 0, uji = 0;
for (let x = 0; x < 20; x++) for (let y = 0; y < 8; y++) for (let z = 0; z < 20; z++) {
  uji++;
  if (maiSim(x, y, z) !== mai(x, y, z)) beda++;
}
t.cek(`rumus cocok untuk ${uji} kombinasi (x, y, z)`, beda === 0, String(beda));
t.cek('math.js setuju dengan telusuran', (() => {
  let s = 0;
  for (let x = 0; x < 15; x++) for (let y = 0; y < 7; y++) for (let z = 0; z < 15; z++)
    if (M.mai(x, y, z) !== maiSim(x, y, z)) s++;
  return s === 0; })());
t.cek('periode 2 pangkat sekian mod 67 = 66', M.ord2mod67() === 66);
t.cek('2^66 kembali ke 1', pow2(66) === 1 && pow2(0) === 1);

t.bagian('Jawaban OSN-K 2026 soal 38-40');
c.klik('solve');
t.cek('soal 38: modul menjawab 50',
  /mod 67 = 50 mod 67 = 50(?!\d)/.test(c.teks('s1')), c.teks('s1').replace(/\s+/g, ' ').slice(-120));
t.cek('kode C++ setuju: MAI(13, 666666, 37) = 50', mai(13, 666666, 37) === 50);
t.cek('666.666 memang habis dibagi 66', 666666 % 66 === 0);
t.cek('soal 39: modul menjawab 121.203',
  /jawabannya = 40\.401 × 3 = 121\.203(?!\d)/.test(c.teks('s2')), c.teks('s2').replace(/\s+/g, ' ').slice(-90));
t.cek('hitungan langsung setuju: 121.203', (() => {
  let n = 0;
  for (let y = 0; y <= 200; y++) { const p = pow2(y);
    for (let z = 0; z <= 200; z++) { const r = ((-p * z) % 67 + 67) % 67;
      for (let x = 0; x <= 200; x++) if (x % 67 === r) n++; } }
  return n === 121203; })());
t.cek('201 memang 3 × 67 tepat', 201 === 3 * 67);
t.cek('soal 40: modul menjawab 16',
  /jadi ada 15 \+ 1 = 16(?!\d)/.test(c.teks('s3')), c.teks('s3').replace(/\s+/g, ' ').slice(-90));
t.cek('telusuran sungguhan setuju: MAI(0,0,2) dipanggil 16 kali', (() => {
  let n = 0;
  const jalan = (a, b) => { if (b === 0) { if (a === 0) n++; return (a + 2) % 67; }
    return jalan(jalan(a, b - 1), b - 1); };
  jalan(0, 10);
  return n === 16; })());
t.cek('total pemanggilan dasarnya 1.024', /2¹⁰ = 1\.024 pemanggilan dasar/.test(c.teks('s3')));

t.bagian('math.js: pencacah pemanggilan dasar');
let salah = 0;
for (let p = 0; p < 200; p++) {
  const x = Math.floor(Math.random() * 67), z = Math.floor(Math.random() * 67);
  const y = Math.floor(Math.random() * 7), a = Math.floor(Math.random() * 67);
  let n = 0;
  const jalan = (u, v) => { if (v === 0) { if (u === a) n++; return (u + z) % 67; }
    return jalan(jalan(u, v - 1), v - 1); };
  jalan(x, y);
  if (M.maiHitungPanggilan(x, y, z, a) !== n) salah++;
}
t.cek('maiHitungPanggilan cocok dengan telusuran pada 200 kasus acak', salah === 0, String(salah));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
