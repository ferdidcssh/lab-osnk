/* ============================================================
   UJI MODUL 14 — PIGEONHOLE & SKENARIO TERBURUK
   Rumus dan angkanya dibuktikan verify/14-pigeonhole.py
   Bagian "berlaku umum" diuji pada susunan ACAK, termasuk toples
   kosong, syarat nol, dan susunan yang memang mustahil.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('14-pigeonhole');
const c = await bangunModul('14-pigeonhole');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

const C17 = [5, 5, 5, 5, 5, 5, 5];
const C18 = [...Array(100)].map((_, i) => 10 * (i + 1));
const STOK = { boneka: 16, bola: 4, mobil: 7, puzzle: 2 };

t.bagian('Jawaban OSN-K 2024 nomor 17-19');
c.klik('solve');
t.cek('nomor 17 = 31', /= 31/.test(c.teks('s1')), c.teks('s1').slice(0, 70));
t.cek('nomor 18 = 50.495', /50\.495/.test(c.teks('s2')));
t.cek('nomor 19 = 21', /selisihnya = 21/.test(c.teks('s3')), c.teks('s3').slice(-120));
t.cek('rumus setuju nomor 17', M.phDijamin(C17, 1) === 31);
t.cek('rumus setuju nomor 18', M.phDijamin(C18, 5) === 50495);
t.cek('rumus setuju nomor 19', M.phSusunan(25, 20, 3, 1).length === 21);
t.cek('total nomor 18 lewat rumus deret', C18.reduce((a, b) => a + b, 0) === 10 * (100 * 101 / 2));
t.cek('semua susunan nomor 19 ber-terkecil 6',
  M.phSusunan(25, 20, 3, 1).every((x) => Math.min(...x) === 6));
t.cek('teks <A,B,C> tidak tertelan HTML', /<A,B,C>/.test(c.teks('s3')));

t.bagian('Soal pendukung OSN-K 2023');
c.klik('cgo');
t.cek('mesin capit 20 tarikan', /20 tarikan/.test(c.teks('cout')), c.teks('cout').slice(-120));
t.cek('mesin capit Rp 200.000', /Rp 200\.000/.test(c.teks('cout')));
t.cek('rumus setuju mesin capit', M.phCapit(STOK, 5, 2).tarikan === 20);
t.cek('paling sial 19 tarikan', M.phCapit(STOK, 5, 2).terburuk === 19);
t.cek('cuma 2 kombinasi yang lolos', M.phCapit(STOK, 5, 2).sasaran.length === 2);
c.klik('solve2');
t.cek('kotak buah: pernyataan 2 dan 3', /Yang pasti benar: 2 dan 3/.test(c.teks('s4')),
  c.teks('s4').slice(-90));
t.cek('pernyataan 1 dan 4 gugur',
  (c.teks('s4').match(/gugur/g) || []).length === 2,
  (c.teks('s4').match(/gugur/g) || []).length + '');

t.bagian('Lab 1 · skenario terburuk');
c.isi('isi', '5, 5, 5, 5, 5, 5, 5'); c.isi('m', 1); c.klik('go');
const out = c.teks('out');
t.cek('menyebut paling lama bertahan 30', /paling lama bertahan = 30/.test(out));
t.cek('menyimpulkan 31', /35 − 5 \+ 1 = 31/.test(out));
t.cek('membandingkan dengan "supaya mungkin" = 7', /jawabannya cuma 7/.test(out));
t.cek('toples digambar', /<svg/.test(c.el('viz').innerHTML));
t.cek('gambar memakai viewBox', /viewBox=/.test(c.el('viz').innerHTML));
t.cek('gambar memuat 35 butir', (c.el('viz').innerHTML.match(/<rect/g) || []).length === 35,
  (c.el('viz').innerHTML.match(/<rect/g) || []).length + '');

t.bagian('Lab 1 · kasus tepi yang jadi bug di versi lama');
c.isi('isi', '5, 0, 5'); c.klik('go');
t.cek('BUG LAMA: toples kosong dijawab mustahil, bukan diabaikan',
  /MUSTAHIL/.test(c.teks('out')), c.teks('out').slice(0, 80));
t.cek('menyebut toples kosong', /toples KOSONG/.test(c.teks('out')));
t.cek('rumus setuju: toples kosong = mustahil', M.phDijamin([5, 0, 5], 1) === null);
c.isi('isi', '-3, 5'); c.klik('go');
t.cek('BUG LAMA: angka negatif ditolak', /MUSTAHIL/.test(c.teks('out')));
t.cek('rumus setuju: negatif = mustahil', M.phDijamin([-3, 5], 1) === null);
c.isi('isi', '5, 5, 5, 5, 5, 5, 5'); c.isi('m', 0); c.klik('go');
t.cek('BUG LAMA: syarat nol dijawab 0, bukan dipaksa jadi 1',
  /jawaban = 0/.test(c.teks('out')), c.teks('out').slice(0, 90));
t.cek('rumus setuju: syarat nol = 0', M.phDijamin(C17, 0) === 0);
c.isi('isi', '2, 5, 5'); c.isi('m', 3); c.klik('go');
t.cek('toples kurang dari syarat = mustahil', /MUSTAHIL/.test(c.teks('out')));
c.isi('isi', ''); c.klik('go');
t.cek('masukan kosong tidak merusak', /Tulis isi tiap toples/.test(c.teks('out')));
c.isi('isi', '1, 100'); c.isi('m', 1); c.klik('go');
t.cek('susunan sangat timpang benar', /= 101/.test(c.teks('out')), c.teks('out').slice(-90));

t.bagian('Lab 1 · adu dengan pencarian menyeluruh');
c.isi('isi', '3, 4, 5'); c.isi('m', 2); c.klik('adu');
t.cek('dua cara sepakat', /DUA CARA SAMA/.test(c.teks('out')), c.teks('out').slice(0, 120));
t.cek('rumus setuju', M.phDijamin([3, 4, 5], 2) === M.phKasar([3, 4, 5], 2));

t.bagian('Lab 2 · trik satu angka');
c.klik('tgo');
const tout = c.teks('tout');
t.cek('memakai rumus deret 10 x 5.050', /10 × 5\.050 = 50\.500/.test(tout));
t.cek('menyimpulkan 50.495', /50\.500 − 10 \+ 5 = 50\.495/.test(tout));
t.cek('menyebut ruang keadaannya 259 digit', /259 digit/.test(tout),
  String(M.phRuang(C18)).length + ' digit');
t.cek('rumus setuju: ruang nomor 18 = 259 digit', String(M.phRuang(C18)).length === 259);
c.klik('tgeser');
t.cek('membuktikan isi lain tidak berpengaruh', /SAMA PERSIS/.test(c.teks('tout')),
  c.teks('tout').slice(0, 140));
t.cek('menguji ratusan susunan acak', /jawaban berubah pada 0 susunan/.test(c.teks('tout')));

t.bagian('Uji sendiri');
c.klik('uall');
t.cek('200 susunan acak tidak meleset', /TIDAK ADA YANG MELESET/.test(c.teks('uout')),
  c.teks('uout').slice(0, 140));

t.bagian('Rumusnya berlaku umum — susunan acak, bukan angka soal');
let uji = 0, beda = 0, mustahil = 0;
for (let p = 0; p < 400; p++) {
  const n = 1 + Math.floor(Math.random() * 5);
  const isi = [...Array(n)].map(() => Math.floor(Math.random() * 7));
  const m = Math.floor(Math.random() * 5);
  const jawab = M.phDijamin(isi, m);
  if (jawab === null) { mustahil++; continue; }
  const kasar = M.phKasar(isi, m);
  if (kasar === undefined) continue;
  uji++;
  if (kasar !== jawab) beda++;
}
t.cek(`rumus cocok pencarian menyeluruh pada ${uji} susunan acak`, beda === 0, String(beda));
t.cek('susunan mustahil ikut teruji', mustahil > 0, String(mustahil));
let berubah = 0, coba = 0;
for (let p = 0; p < 500; p++) {
  const isi = [...Array(2 + Math.floor(Math.random() * 5))]
    .map(() => 1 + Math.floor(Math.random() * 9));
  const kecil = Math.min(...isi);
  const besar = isi.map((v, i) => v > kecil ? i : -1).filter((i) => i >= 0);
  if (besar.length < 2) continue;
  const i = besar[0], j = besar[besar.length - 1];
  const d = isi.slice(), pindah = Math.min(d[i] - kecil, 3);
  if (pindah <= 0) continue;
  d[i] -= pindah; d[j] += pindah;
  if (Math.min(...d) !== kecil) continue;
  coba++;
  if (M.phDijamin(d, 1) !== M.phDijamin(isi, 1)) berubah++;
}
t.cek(`cuma toples terkecil yang berpengaruh (${coba} percobaan)`, berubah === 0, String(berubah));
t.cek('dijamin selalu lebih besar daripada mungkin',
  M.phDijamin(C17, 1) > M.phMungkin(C17, 1) && M.phDijamin(C18, 5) > M.phMungkin(C18, 5));
t.cek('mungkin nomor 17 = 7', M.phMungkin(C17, 1) === 7);
t.cek('mungkin nomor 18 = 500', M.phMungkin(C18, 5) === 500);

t.bagian('Syarat gugur tertulis di modul');
const teks = c.badan.textContent;
t.cek('menyebut dijamin vs mungkin', /MUNGKIN/.test(teks));
t.cek('menyebut wadah kurang dari syarat = mustahil', /MUSTAHIL/.test(teks));
t.cek('menyebut kalau boleh ambil lebih dari satu', /lebih dari satu/.test(teks));
t.cek('menyebut kalau ada wadah yang tidak wajib', /tidak wajib/.test(teks));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
