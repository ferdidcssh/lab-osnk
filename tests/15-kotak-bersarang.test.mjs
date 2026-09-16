/* ============================================================
   UJI MODUL 15 — KOTAK BERSARANG (DILWORTH)
   Rumus dan angkanya dibuktikan verify/15-dilworth.py
   Bagian "berlaku umum" diuji pada daftar ACAK, termasuk kotak
   bersisi nol, kotak balok, dan syarat yang diubah.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('15-kotak-bersarang');
const c = await bangunModul('15-kotak-bersarang');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

const S17 = [1, 1, 2, 2, 2, 3, 3, 4, 6, 8];
const TABEL19 = [[2, 5], [3, 12], [5, 19], [8, 4], [13, 15], [21, 7], [34, 8]];
const S19 = TABEL19.flatMap(([u, n]) => Array(n).fill(u));

t.bagian('Jawaban OSN-K 2025 nomor 17-19');
c.klik('solve');
t.cek('nomor 17 = 3', /jawaban = 3/.test(c.teks('s1')), c.teks('s1').slice(0, 80));
t.cek('nomor 18 = BENAR', /jawaban = BENAR/.test(c.teks('s2')));
t.cek('nomor 19 = 19', /jawaban = 19/.test(c.teks('s3')));
t.cek('rumus setuju nomor 17', M.dwMin(S17) === 3);
t.cek('rumus setuju nomor 19', M.dwMin(S19) === 19);
t.cek('total 70 kotak', S19.length === 70, String(S19.length));
t.cek('nomor 17 lawan pencocokan', M.dwMinUmum(S17.map((x) => [x])) === 3);
t.cek('nomor 19 lawan pencocokan', M.dwMinUmum(S19.map((x) => [x])) === 19);
t.cek('nomor 17 lawan antirantai', M.dwAntirantai(S17.map((x) => [x])).ukuran === 3);
t.cek('modul menyebut Fibonacci itu umpan', /umpan/.test(c.teks('s3')));

t.bagian('Nomor 18 diuji, bukan sekadar dijawab');
let bukanSatu = 0;
for (let p = 0; p < 400; p++) {
  const n = 1 + Math.floor(Math.random() * 9), pakai = new Set();
  while (pakai.size < n) pakai.add(1 + Math.floor(Math.random() * 300));
  if (M.dwMin([...pakai]) !== 1) bukanSatu++;
}
t.cek('semua sisi berbeda selalu memberi 1', bukanSatu === 0, String(bukanSatu));

t.bagian('Lab 1 · susunan kotak');
c.isi('sisi', S17.join(', ')); c.klik('go');
const out = c.teks('out');
t.cek('menyebut sisi 2 terbanyak', /sisi\s+2 :\s+3 kotak\s+← terbanyak/.test(out), out.slice(0, 200));
t.cek('menyusun 3 tumpukan', (out.match(/tumpukan \d+ :/g) || []).length === 3,
  (out.match(/tumpukan \d+ :/g) || []).length + '');
t.cek('tumpukan pertama lengkap', /1 ⊂ 2 ⊂ 3 ⊂ 4 ⊂ 6 ⊂ 8/.test(out));
t.cek('batang cacah digambar', /<svg/.test(c.el('viz').innerHTML));
t.cek('kotak bersarang digambar', /<svg/.test(c.el('viz2').innerHTML));
t.cek('gambar memakai viewBox', /viewBox=/.test(c.el('viz2').innerHTML));
t.cek('gambar rantai memuat 10 kotak',
  (c.el('viz2').innerHTML.match(/<rect/g) || []).length === 10,
  (c.el('viz2').innerHTML.match(/<rect/g) || []).length + '');

t.bagian('Lab 1 · kasus tepi yang jadi bug di versi lama');
c.isi('sisi', '2, 0, 2'); c.klik('go');
t.cek('BUG LAMA: kotak bersisi nol ditolak, bukan diabaikan',
  /tidak sah/.test(c.teks('out')), c.teks('out').slice(0, 80));
t.cek('rumus setuju: sisi nol tidak sah', M.dwMin([2, 0, 2]) === null);
c.isi('sisi', '-5, 3, 3'); c.klik('go');
t.cek('BUG LAMA: sisi negatif ditolak', /tidak sah/.test(c.teks('out')));
t.cek('rumus setuju: negatif tidak sah', M.dwMin([-5, 3, 3]) === null);
c.isi('sisi', ''); c.klik('go');
t.cek('masukan kosong tidak merusak', /Tulis ukuran sisinya/.test(c.teks('out')));
c.isi('sisi', '7'); c.klik('go');
t.cek('satu kotak = 1', /jawaban = 1/.test(c.teks('out')));
c.isi('sisi', '4, 4, 4, 4'); c.klik('go');
t.cek('semua sama = sebanyak kotaknya', /jawaban = 4/.test(c.teks('out')));
t.cek('rumus setuju', M.dwMin([4, 4, 4, 4]) === 4 && M.dwMin([1, 2, 3, 4, 5]) === 1);
c.isi('sisi', S17.join(', ')); c.klik('adu');
t.cek('tiga cara sepakat', /SEMUA CARA SAMA/.test(c.teks('out')), c.teks('out').slice(-90));

t.bagian('Lab 2 · trik abaikan kolom ukuran');
c.klik('tgo');
t.cek('menyorot 19 sebagai terbesar', /19  ← terbesar/.test(c.teks('tout')), c.teks('tout').slice(0, 240));
t.cek('menyatakan kolom kiri diabaikan', /diabaikan seluruhnya/.test(c.teks('tout')));
t.cek('menyebut tidak perlu menjumlahkan 70', /menjumlahkan 70/.test(c.teks('tout')));
c.klik('tumpan');
t.cek('membuktikan Fibonacci tidak berpengaruh', /SAMA PERSIS/.test(c.teks('tout')),
  c.teks('tout').slice(0, 160));
t.cek('menguji ratusan daftar acak', /jawaban berubah pada 0 daftar/.test(c.teks('tout')));
const PALSU = [[1, 5], [2, 12], [3, 19], [4, 4], [5, 15], [6, 7], [7, 8]]
  .flatMap(([u, n]) => Array(n).fill(u));
t.cek('rumus setuju: ukuran diganti hasilnya sama', M.dwMin(PALSU) === M.dwMin(S19));

t.bagian('Lab 3 · kotak balok membuat rumus gugur');
c.klik('bgo');
t.cek('rumus kubus meleset di balok', /RUMUS KUBUS MELESET/.test(c.teks('bout')),
  c.teks('bout').slice(0, 160));
t.cek('rumus setuju: dua balok saling tak muat', M.dwMinUmum([[2, 5], [5, 2]]) === 2);
t.cek('balok bersarang tetap 1', M.dwMinUmum([[1, 1], [2, 2], [3, 3]]) === 1);
c.isi('balok', '1x1, 2x2, 3x3'); c.klik('bgo');
t.cek('balok yang memang bersarang dijawab 1', /kebetulan sama/.test(c.teks('bout')),
  c.teks('bout').slice(0, 140));
c.isi('balok', ''); c.klik('bgo');
t.cek('balok kosong tidak merusak', /Tulis kotaknya dulu/.test(c.teks('bout')));

t.bagian('Uji sendiri');
c.isi('sisi', S17.join(', ')); c.klik('ugo');
t.cek('semua pemeriksaan lolos', /SEMUA PEMERIKSAAN LOLOS/.test(c.teks('uout')),
  c.teks('uout').slice(-80));
c.klik('uall');
t.cek('200 daftar acak tidak meleset', /TIDAK ADA YANG MELESET/.test(c.teks('uout')),
  c.teks('uout').slice(0, 140));

t.bagian('Rumusnya berlaku umum — daftar acak, bukan daftar soal');
let uji = 0, beda = 0, tolak = 0;
for (let p = 0; p < 500; p++) {
  const n = 1 + Math.floor(Math.random() * 8);
  const sisi = [...Array(n)].map(() => Math.floor(Math.random() * 6));
  const jawab = M.dwMin(sisi);
  if (jawab === null) { tolak++; continue; }
  uji++;
  if (jawab !== M.dwMinUmum(sisi.map((x) => [x]))) beda++;
}
t.cek(`rumus cocok pencocokan pada ${uji} daftar acak`, beda === 0, String(beda));
t.cek('daftar tidak sah ikut teruji', tolak > 0, String(tolak));
let berubah = 0;
for (let p = 0; p < 400; p++) {
  const k = 1 + Math.floor(Math.random() * 6);
  const cacah = [...Array(k)].map(() => 1 + Math.floor(Math.random() * 6));
  const A = [], B = [];
  cacah.forEach((n, i) => { for (let j = 0; j < n; j++) { A.push(1 + i * 3); B.push(500 + i * 91); } });
  if (M.dwMin(A) !== M.dwMin(B)) berubah++;
}
t.cek('ukuran sisi tidak berpengaruh pada 400 daftar acak', berubah === 0, String(berubah));
let susunSalah = 0;
for (let p = 0; p < 300; p++) {
  const n = 1 + Math.floor(Math.random() * 9);
  const sisi = [...Array(n)].map(() => 1 + Math.floor(Math.random() * 5));
  const r = M.dwSusun(sisi);
  if (r.length !== M.dwMin(sisi)) susunSalah++;
  if (!r.every((x) => x.every((v, i) => i === 0 || x[i - 1] < v))) susunSalah++;
  if (JSON.stringify(r.flat().sort((a, b) => a - b)) !== JSON.stringify(sisi.slice().sort((a, b) => a - b))) susunSalah++;
}
t.cek('susunan rantainya selalu sah pada 300 daftar acak', susunSalah === 0, String(susunSalah));
let gugurBalok = 0, ujiBalok = 0, dilworthSalah = 0;
for (let p = 0; p < 300; p++) {
  const n = 2 + Math.floor(Math.random() * 5);
  const kotak = [...Array(n)].map(() =>
    [1 + Math.floor(Math.random() * 4), 1 + Math.floor(Math.random() * 4)]);
  const benar = M.dwMinUmum(kotak);
  const cb = {};
  kotak.forEach((k) => { const s = k.join(','); cb[s] = (cb[s] || 0) + 1; });
  ujiBalok++;
  if (Math.max(...Object.values(cb)) !== benar) gugurBalok++;
  const anti = M.dwAntirantai(kotak);
  if (!anti || anti.ukuran !== benar) dilworthSalah++;
}
t.cek(`teorema Dilworth berlaku pada ${ujiBalok} susunan balok acak`, dilworthSalah === 0, String(dilworthSalah));
t.cek('rumus kubus memang gugur untuk balok', gugurBalok > 50, String(gugurBalok));
t.cek('varian boleh muat 2 kotak', M.dwLebar(S17, 2) === 2 && M.dwLebar(S19, 2) === 10);
t.cek('lebar 1 sama dengan rumus biasa', M.dwLebar(S17, 1) === M.dwMin(S17));

t.bagian('Syarat gugur tertulis di modul');
const teks = c.badan.textContent;
t.cek('menyebut kotak balok membuat rumus gugur', /balok/.test(teks));
t.cek('menyebut syarat "lebih kecil atau sama"', /atau sama/.test(teks));
t.cek('menyebut varian boleh lebih dari satu', /lebih dari satu/.test(teks));
t.cek('menyebut sisi nol tidak sah', /nol/.test(teks));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
