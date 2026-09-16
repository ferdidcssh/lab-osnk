/* ============================================================
   UJI MODUL 13 — DYNAMIC PROGRAMMING
   Rumus dan angkanya dibuktikan verify/13-dp.py
   Bagian "berlaku umum" diuji pada soal ACAK dengan poin dan
   masa jeda berbeda-beda, bukan cuma tabel soal OSN-K.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('13-dp');
const c = await bangunModul('13-dp');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

const NAMA = ['T', 'O', 'K'];
const P1415 = [[2,2,2,2,2,2,2,2,2,2],[3,3,3,3,3,3,3,3,3,3],[5,5,5,5,5,5,5,5,5,5]];
const P16 = [[2,2,2,1,7,8,4,5,3,4],[3,3,3,1,5,6,9,7,5,6],[5,5,5,1,4,3,5,6,8,9]];

t.bagian('Jawaban OSN-K 2026 nomor 14-16');
c.klik('solve');
t.cek('nomor 14 = 40', /jawaban: 40/.test(c.teks('s1')), c.teks('s1').slice(0, 70));
t.cek('nomor 15 = 32', /jawaban: 32/.test(c.teks('s2')));
t.cek('nomor 16 = 56', /jawaban: 56/.test(c.teks('s3')));
t.cek('rumus setuju nomor 14', M.dpJadwal(P1415, [1,1,1], NAMA).best === 40);
t.cek('rumus setuju nomor 15', M.dpJadwal(P1415, [1,2,3], NAMA).best === 32);
t.cek('rumus setuju nomor 16', M.dpJadwal(P16, [1,1,1], NAMA).best === 56);

t.bagian('Jadwalnya sah dan benar-benar bernilai segitu');
const periksaJadwal = (poin, jeda, harap) => {
  const r = M.dpJadwal(poin, jeda, NAMA);
  const nilai = r.jadwal.reduce((a, x, i) => x === 'I' ? a : a + poin[NAMA.indexOf(x)][i], 0);
  const pakai = [-1e9, -1e9, -1e9]; let sah = true;
  r.jadwal.forEach((x, i) => { if (x === 'I') return;
    const j = NAMA.indexOf(x);
    if (i - pakai[j] <= jeda[j]) sah = false; pakai[j] = i; });
  t.cek(`jadwal jeda ${jeda.join(',')} bernilai ${harap}`, nilai === harap, String(nilai));
  t.cek(`jadwal jeda ${jeda.join(',')} mematuhi masa jeda`, sah, r.jadwal.join(' '));
  t.cek('jadwal memakai huruf T/O/K, bukan huruf mesin',
    r.jadwal.every((x) => ['T','O','K','I'].includes(x)), r.jadwal.join(''));
};
periksaJadwal(P1415, [1,1,1], 40);
periksaJadwal(P1415, [1,2,3], 32);
periksaJadwal(P16, [1,1,1], 56);

t.bagian('Lab 1 · tabel DP');
c.klik('go');
const out = c.teks('out');
t.cek('menyebut banyaknya keadaan', /= 8 keadaan/.test(out), out.slice(0, 120));
t.cek('menampilkan jadwal berhuruf T/O/K', /Jadwal terbaik : [TOKI ]+/.test(out));
t.cek('menyebut 1.048.576 jadwal', /1\.048\.576/.test(out));
c.klik('adu');
t.cek('DP dan pencarian menyeluruh sepakat', /DUA CARA SAMA/.test(c.teks('out')));
t.cek('tabel digambar', /<svg/.test(c.el('viz').innerHTML));
t.cek('tabel memakai viewBox', /viewBox=/.test(c.el('viz').innerHTML));
t.cek('tabel punya 40 sel', (c.el('viz').innerHTML.match(/<rect/g) || []).length === 40,
  (c.el('viz').innerHTML.match(/<rect/g) || []).length + '');

t.bagian('Lab 1 · kasus tepi');
c.isi('tabel', '1, 2\n3, 4'); c.klik('go');
t.cek('kurang dari tiga baris ditolak halus', /Tulis tiga baris/.test(c.teks('out')));
c.isi('tabel', '1, 1, 1\n1, 1, 1\n1, 1, 1');
c.isi('ja', 6); c.isi('jb', 6); c.isi('jc', 6); c.klik('go');
t.cek('masa jeda lebih panjang daripada N', /Total poin     : 3/.test(c.teks('out')), c.teks('out').slice(0, 200));
c.isi('ja', 0); c.isi('jb', 0); c.isi('jc', 0);
c.isi('tabel', '5, 5\n1, 1\n1, 1'); c.klik('go');
t.cek('masa jeda 0 boleh tiap hari', /Total poin     : 10/.test(c.teks('out')), c.teks('out').slice(0, 200));
t.cek('rumus setuju masa jeda 0', M.dpJadwal([[5,5],[1,1],[1,1]], [0,0,0], NAMA).best === 10);
t.cek('nol hari tidak merusak', M.dpJadwal([[],[],[]], [1,1,1], NAMA).best === 0);

t.bagian('Lab 2 · trik dua terbesar');
c.isi('tabel', P16.map((r) => r.join(', ')).join('\n'));
c.isi('ja', 1); c.isi('jb', 1); c.isi('jc', 1);
c.klik('tgo');
t.cek('trik cocok dengan DP penuh', /cocok dengan DP penuh/.test(c.teks('tout')), c.teks('tout').slice(-90));
c.klik('tbanding');
const tout = c.teks('tout');
t.cek('trik 70 langkah', /70 langkah/.test(tout));
t.cek('14.979 kali lebih ringan', /14\.979×/.test(tout));
t.cek('memperingatkan syarat jeda 1', /kalau masa jedanya bukan semua 1/.test(tout));
t.cek('menyebut hasil salah 40 vs 32', /hasilnya 40, padahal jawabannya 32/.test(tout));
t.cek('rumus setuju: trik 70 langkah', M.dpDuaTerbesar(P16).langkah === 70);
t.cek('rumus setuju: trik dipaksakan ke soal 15 = 40', M.dpDuaTerbesar(P1415).best === 40);

t.bagian('Lab 3 · serakah memang meleset');
c.isi('ja', 1); c.isi('jb', 2); c.isi('jc', 3);
c.isi('tabel', P1415.map((r) => r.join(', ')).join('\n'));
c.klik('sgo');
t.cek('serakah meleset di soal 15', /SERAKAH MELESET/.test(c.teks('sout')), c.teks('sout').slice(-120));
t.cek('rumus setuju: serakah soal 15 = 28', M.dpSerakah(P1415, [1,2,3], NAMA).best === 28);
t.cek('serakah kebetulan benar di soal 14', M.dpSerakah(P1415, [1,1,1], NAMA).best === 40);
c.klik('sacak');
t.cek('300 soal acak diuji', /300 soal acak/.test(c.teks('sout')));
t.cek('serakah meleset pada sebagian besar', /meleset : \d+ dari 300/.test(c.teks('sout')));

t.bagian('Uji sendiri');
c.klik('uall');
t.cek('150 soal acak tidak meleset', /TIDAK ADA YANG MELESET/.test(c.teks('uout')),
  c.teks('uout').slice(0, 140));

t.bagian('Rumusnya berlaku umum — soal acak, bukan tabel soal');
let uji = 0, beda = 0;
for (let p = 0; p < 300; p++) {
  const N = 1 + Math.floor(Math.random() * 7);
  const jeda = [0,0,0].map(() => Math.floor(Math.random() * 5));
  const poin = [...Array(3)].map(() => [...Array(N)].map(() => Math.floor(Math.random() * 10)));
  const kasar = M.dpJadwalKasar(poin, jeda, 8);
  if (kasar.best === null) continue;
  uji++;
  if (kasar.best !== M.dpJadwal(poin, jeda, NAMA).best) beda++;
}
t.cek(`DP cocok pencarian menyeluruh pada ${uji} soal acak`, beda === 0, String(beda));
let bedaTrik = 0;
for (let p = 0; p < 300; p++) {
  const N = 1 + Math.floor(Math.random() * 9);
  const poin = [...Array(3)].map(() => [...Array(N)].map(() => Math.floor(Math.random() * 10)));
  if (M.dpDuaTerbesar(poin).best !== M.dpJadwal(poin, [1,1,1], NAMA).best) bedaTrik++;
}
t.cek('trik dua terbesar cocok pada 300 soal acak bermasa jeda 1', bedaTrik === 0, String(bedaTrik));
let gugur = 0;
for (let p = 0; p < 300; p++) {
  const N = 2 + Math.floor(Math.random() * 7);
  const jeda = [0,0,0].map(() => Math.floor(Math.random() * 4));
  if (jeda.join() === '1,1,1') continue;
  const poin = [...Array(3)].map(() => [...Array(N)].map(() => Math.floor(Math.random() * 10)));
  if (M.dpDuaTerbesar(poin).best !== M.dpJadwal(poin, jeda, NAMA).best) gugur++;
}
t.cek('trik memang gugur di luar syaratnya', gugur > 0, String(gugur));
let salahSerakah = 0;
for (let p = 0; p < 300; p++) {
  const N = 2 + Math.floor(Math.random() * 7);
  const jeda = [0,0,0].map(() => Math.floor(Math.random() * 4));
  const poin = [...Array(3)].map(() => [...Array(N)].map(() => Math.floor(Math.random() * 10)));
  if (M.dpSerakah(poin, jeda, NAMA).best !== M.dpJadwal(poin, jeda, NAMA).best) salahSerakah++;
}
t.cek('serakah memang sering meleset', salahSerakah > 50, String(salahSerakah));

t.bagian('Rumus satu jenis tetap benar');
const kasar1 = (v, K) => { let best = 0;
  for (let m = 0; m < (1 << v.length); m++) { const idx = [];
    for (let i = 0; i < v.length; i++) if (m >> i & 1) idx.push(i);
    let ok = true;
    for (let j = 0; j + 1 < idx.length; j++) if (idx[j+1] - idx[j] <= K) ok = false;
    if (ok) best = Math.max(best, idx.reduce((a, i) => a + v[i], 0)); }
  return best; };
let salah1 = 0;
for (let p = 0; p < 500; p++) {
  const n = Math.floor(Math.random() * 12), K = 1 + Math.floor(Math.random() * 4);
  const v = [...Array(n)].map(() => Math.floor(Math.random() * 21) - 10);
  if (M.dpCool(v, K).best !== kasar1(v, K)) salah1++;
  if (K === 1 && M.dpRob(v).best !== kasar1(v, 1)) salah1++;
}
t.cek('dpCool dan dpRob benar pada 500 larik acak termasuk negatif', salah1 === 0, String(salah1));

t.bagian('Syarat gugur tertulis di modul');
const teks = c.badan.textContent;
t.cek('menyebut trik gugur kalau jeda berbeda', /trik dua terbesar gugur/.test(teks));
t.cek('menyebut serakah meleset', /serakah/.test(teks));
t.cek('menyebut menjumlah per jenis salah', /tiap hari cuma satu agenda/.test(teks));
t.cek('menyebut DP berlebihan kalau keputusan berdiri sendiri', /berdiri sendiri/.test(teks));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
