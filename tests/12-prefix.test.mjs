/* ============================================================
   UJI MODUL 12 — PREFIX SUM & DIFFERENCE ARRAY
   Rumus dan angkanya dibuktikan verify/12-prefix.py
   Bagian "berlaku umum" diuji pada larik ACAK, termasuk
   angka negatif, nol, larik kosong, dan rentang terbalik.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('12-prefix');
const c = await bangunModul('12-prefix');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

t.bagian('Lab 1 · tabel bantu');
c.klik('bangun');
t.cek('tabel bantu punya satu kotak lebih banyak', /9 angka — satu lebih banyak/.test(c.teks('out')),
  c.teks('out').slice(0, 90));
c.isi('l', 3); c.isi('r', 6); c.klik('tanya');
const out = c.teks('out');
t.cek('P[6] − P[2] = 19', /P\[6\] − P\[2\] = 23 − 4 = 19/.test(out), out.slice(0, 200));
t.cek('dua cara sepakat', /DUA CARA SAMA/.test(out));
t.cek('rata-rata ikut dihitung', /4\.75/.test(out));

t.bagian('Lab 1 · kasus tepi');
c.isi('l', 5); c.isi('r', 5); c.klik('tanya');
t.cek('rentang sepanjang satu benar', /= 5$/m.test(c.teks('out')) || /5 = 5/.test(c.teks('out')));
c.isi('l', 6); c.isi('r', 3); c.klik('tanya');
t.cek('rentang terbalik dijawab 0, bukan galat', /rentangnya kosong/.test(c.teks('out')));
c.isi('l', 1); c.isi('r', 99); c.klik('tanya');
t.cek('posisi di luar larik ditolak halus', /tidak ada/.test(c.teks('out')));
c.isi('a', ''); c.klik('bangun');
t.cek('larik kosong tidak merusak', /Tulis angkanya/.test(c.teks('out')));
c.isi('a', '-4, 0, 7, -2'); c.klik('bangun'); c.isi('l', 1); c.isi('r', 4); c.klik('tanya');
t.cek('angka negatif dan nol tetap benar', /= 1$/m.test(c.teks('out')) || /1\b/.test(c.teks('out')));
t.cek('rumus setuju: jumlah -4,0,7,-2 = 1', M.psJumlah(M.psTabel([-4,0,7,-2]), 1, 4) === 1);

t.bagian('Lab 2 · trik dua tanda');
c.klik('pbesar');
const pout = c.teks('pout');
t.cek('cara apa adanya 500.000 langkah', /500\.000 langkah/.test(pout));
t.cek('trik 2.000 langkah', /= 2\.000 langkah/.test(pout));
t.cek('250 kali lebih ringan', /250× lebih ringan/.test(pout));
t.cek('hasilnya tetap sama', /tetap sama persis/.test(pout));
const op500 = [...Array(500)].map(() => ({ l: 1, r: 1000, v: 1 }));
t.cek('rumus setuju: trik 2.000 langkah', M.psTerapkan(1000, op500).langkah === 2000);
t.cek('rumus setuju: kasar 500.000 langkah', M.psTerapkanKasar(1000, op500).langkah === 500000);
c.isi('pn', 12); c.isi('pq', 4); c.klik('pgo');
t.cek('lab kecil menyatakan hasilnya sama', /HASILNYA SAMA PERSIS/.test(c.teks('pout')));
t.cek('penanda digambar', (c.el('pviz').innerHTML.match(/<svg/g) || []).length === 2,
  (c.el('pviz').innerHTML.match(/<svg/g) || []).length + ' svg');

t.bagian('Lab 3 · dua dimensi');
c.isi('r1', 2); c.isi('c1', 2); c.isi('r2', 4); c.isi('c2', 4); c.klik('ggo');
const gout = c.teks('gout');
t.cek('empat angka dipakai', /P\[4\]\[4\] − P\[1\]\[4\] − P\[4\]\[1\] \+ P\[1\]\[1\]/.test(gout));
t.cek('dua cara sepakat', /DUA CARA SAMA/.test(gout));
t.cek('akibat melupakan koreksi ditunjukkan', /dilupakan/.test(gout));
c.isi('r1', 4); c.isi('c1', 4); c.isi('r2', 2); c.isi('c2', 2); c.klik('ggo');
t.cek('kotak terbalik dijawab 0', /Isinya 0/.test(c.teks('gout')), c.teks('gout').slice(0, 80));
const g33 = [[1,1,1],[1,1,1],[1,1,1]], P33 = M.psTabel2D(g33);
t.cek('rumus setuju: kotak kanan bawah 2x2 = 4', M.psKotak(P33, 2, 2, 3, 3) === 4);
t.cek('tanpa koreksi jadi 3', P33[3][3] - P33[1][3] - P33[3][1] === 3);

t.bagian('Bedah soal · subbarisan habis dibagi N');
c.klik('solve');
t.cek('menyebut jumlah saldo vs sisa', /saldo dijejalkan ke/.test(c.teks('s2')), c.teks('s2').slice(-90));
t.cek('menemukan potongannya', /habis/.test(c.teks('s2')));
for (let p = 0; p < 200; p++) {
  const N = 1 + Math.floor(Math.random() * 10);
  const a = [...Array(N)].map(() => Math.floor(Math.random() * 40));
  const h = M.psHabisDibagi(a);
  if (!h || a.slice(h.l - 1, h.r).reduce((x, y) => x + y, 0) % N !== 0) {
    t.cek('subbarisan selalu ada dan benar', false, String(a)); break;
  }
}
t.cek('200 larik acak: subbarisan selalu ketemu dan habis dibagi N', true);

t.bagian('Uji sendiri');
c.klik('uall');
t.cek('200 larik acak tidak meleset', /TIDAK ADA YANG MELESET/.test(c.teks('uout')),
  c.teks('uout').slice(0, 120));

t.bagian('Rumusnya berlaku umum — masukan acak, bukan larik contoh');
let salah = 0, uji = 0;
for (let p = 0; p < 300; p++) {
  const n = Math.floor(Math.random() * 12);
  const a = [...Array(n)].map(() => Math.floor(Math.random() * 19) - 9);
  const P = M.psTabel(a);
  if (P.length !== n + 1) salah++;
  for (let l = 1; l <= n; l++) for (let r = l; r <= n; r++) {
    uji++;
    if (M.psJumlah(P, l, r) !== a.slice(l - 1, r).reduce((x, y) => x + y, 0)) salah++;
  }
}
t.cek(`jumlah rentang benar untuk ${uji} rentang acak`, salah === 0, String(salah));
salah = 0;
for (let p = 0; p < 300; p++) {
  const a = [...Array(Math.floor(Math.random() * 12))].map(() => Math.floor(Math.random() * 41) - 20);
  if (JSON.stringify(M.psTabel(M.psSelisih(a)).slice(1)) !== JSON.stringify(a)) salah++;
}
t.cek('prefix sum dan larik selisih saling kebalikan pada 300 larik acak', salah === 0, String(salah));
salah = 0;
for (let p = 0; p < 300; p++) {
  const N = 1 + Math.floor(Math.random() * 12), op = [];
  for (let q = 0; q < Math.floor(Math.random() * 6); q++) {
    const l = 1 + Math.floor(Math.random() * N);
    const r = l + Math.floor(Math.random() * (N - l + 1));
    op.push({ l, r, v: Math.floor(Math.random() * 11) - 5 });
  }
  if (JSON.stringify(M.psTerapkan(N, op).hasil) !== JSON.stringify(M.psTerapkanKasar(N, op).hasil)) salah++;
}
t.cek('trik dua tanda benar pada 300 susunan operasi acak', salah === 0, String(salah));
t.cek('rentang kosong bernilai 0', M.psJumlah(M.psTabel([1,2,3]), 3, 2) === 0);
t.cek('larik kosong menghasilkan tabel [0]', JSON.stringify(M.psTabel([])) === '[0]');

t.bagian('Syarat gugur tertulis di modul');
const teks = c.badan.textContent;
t.cek('menyebut tabel jadi basi kalau larik berubah', /basi/.test(teks));
t.cek('menyebut perkalian membuat difference array gugur', /dikali/.test(teks));
t.cek('menyebut nilai terbesar tidak bisa dikurangkan', /tidak bisa dikurangkan/.test(teks));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
