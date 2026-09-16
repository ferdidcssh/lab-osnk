/* ============================================================
   UJI MODUL 10 — LINTASAN EULER
   Angka-angkanya dibuktikan verify/10-euler.py
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('10-euler');
const c = await bangunModul('10-euler');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

const R24 = [['0','1'],['0','5'],['0','4'],['1','6'],['1','2'],['5','6'],
             ['5','7'],['4','7'],['4','3'],['2','6'],['2','3'],['3','7']];

t.bagian('Jawaban OSN-K 2024 nomor 5');
c.klik('solve');
t.cek('jawabannya 4 hari', /= 4$/m.test(c.teks('s2')) || /4/.test(c.teks('s2')));
t.cek('rumus memberi 4', M.eulerMinLintasan(R24) === 4, String(M.eulerMinLintasan(R24)));
t.cek('kedelapan persimpangan ganjil', M.eulerGanjil(R24).length === 8);
t.cek('pembanding 2023 disebut 14 menit', /14 menit/.test(c.teks('s3')));
t.cek('pembanding 2023 ditandai BUKAN Euler', /bukan Euler/i.test(c.teks('s3')));

t.bagian('Lab 1 · derajat dan pengaman');
c.klik('go');
const out = c.teks('out');
t.cek('menyebut 12 ruas', /Total ruas jalan : 12/.test(out));
t.cek('pengaman jumlah derajat cocok', /24 harus = 2 × 12 = 24\s+cocok/.test(out));
t.cek('pengaman banyak ganjil genap', /harus genap\s+cocok \(8\)/.test(out));
t.cek('menyimpulkan 4', /8 \/ 2 = 4/.test(out));

t.bagian('Lab 1 · kasus tepi');
c.isi('in', ''); c.klik('go');
t.cek('peta kosong tidak merusak lab', /kosong/i.test(c.teks('out')));
c.isi('in', '0-1\nrusak sekali ya\n1-2'); c.klik('go');
t.cek('baris rusak dilaporkan', /tidak terbaca/.test(c.teks('out')), c.teks('out').slice(0, 60));
t.cek('sisanya tetap dihitung', /Total ruas jalan : 2/.test(c.teks('out')));
c.isi('in', '0-1\n1-2\n2-0\n3-4\n4-5\n5-3'); c.klik('go');
const pisah = c.teks('out');
t.cek('peta terpisah terdeteksi', /terpisah jadi 2 bagian/.test(pisah), pisah.slice(0, 80));
t.cek('peta terpisah dijawab 2, bukan 1', /jumlah = 2/.test(pisah));
t.cek('rumus setuju: dua segitiga = 2',
  M.eulerMinLintasan([['0','1'],['1','2'],['2','0'],['3','4'],['4','5'],['5','3']]) === 2);

t.bagian('Lab 2 · trik satu persimpangan');
c.klik('tgo');
t.cek('menyebut derajat seragam 3', /3 jalan/.test(c.teks('tout')));
t.cek('menyimpulkan 8 / 2 = 4', /8 \/ 2 = 4/.test(c.teks('tout')));
c.klik('tlama');
t.cek('membandingkan dengan coba-coba', /3\.112/.test(c.teks('tout')), c.teks('tout').slice(0,60));

t.bagian('Lab 3 · rute sungguhan');
c.klik('reset'); c.klik('rgo');
const rout = c.teks('rout');
t.cek('menyusun 4 rute', /^4 rute/.test(rout), rout.slice(0, 40));
const rute = M.eulerSusun(R24);
t.cek('banyaknya rute = rumus', rute.length === M.eulerMinLintasan(R24));
const dipakai = [];
rute.forEach((r) => { for (let i = 0; i < r.length - 1; i++) dipakai.push([r[i], r[i+1]].sort().join('|')); });
t.cek('keempat rute memakai 12 ruas', dipakai.length === 12, String(dipakai.length));
t.cek('tiap ruas dipakai tepat sekali',
  JSON.stringify(dipakai.slice().sort()) === JSON.stringify(R24.map(([a,b]) => [a,b].sort().join('|')).sort()));
c.klik('rnext');
t.cek('tombol rute berikutnya berpindah', /▶ rute 2/.test(c.teks('rout')));

t.bagian('Visualisasi');
const svg = c.el('viz').innerHTML;
t.cek('ada SVG denah', /<svg/.test(svg));
t.cek('memakai viewBox, bukan lebar tetap', /viewBox=/.test(svg));
t.cek('menggambar 8 persimpangan', (svg.match(/<circle/g)||[]).length === 8, (svg.match(/<circle/g)||[]).length + '');
t.cek('menggambar 12 ruas jalan', (svg.match(/<line/g)||[]).length === 12, (svg.match(/<line/g)||[]).length + '');
t.cek('rute tersorot memakai warna merah', /var\(--merah\)/.test(svg));
c.isi('in', '0-1\n1-2\n2-3\n3-4\n4-5\n5-6\n6-0'); c.klik('go');
t.cek('peta baru digambar ulang (7 titik)',
  (c.el('viz').innerHTML.match(/<circle/g)||[]).length === 7,
  (c.el('viz').innerHTML.match(/<circle/g)||[]).length + '');
c.isi('in', ''); c.klik('go');
t.cek('peta kosong tidak menggambar SVG rusak', !/<svg/.test(c.el('viz').innerHTML));

t.bagian('Uji sendiri');
c.klik('reset'); c.klik('ugo');
t.cek('dua cara sepakat pada peta 2024', /DUA CARA SAMA/.test(c.teks('uout')));
c.klik('uall');
t.cek('300 peta acak tidak ada yang meleset', /TIDAK ADA YANG MELESET/.test(c.teks('uout')),
  c.teks('uout').slice(0, 100));

t.bagian('Klaim rumus di modul');
t.cek('peta kosong = 0 lintasan', M.eulerMinLintasan([]) === 0);
t.cek('satu ruas = 1 lintasan', M.eulerMinLintasan([['0','1']]) === 1);
t.cek('segitiga = 1 (semua genap)', M.eulerMinLintasan([['0','1'],['1','2'],['2','0']]) === 1);
t.cek('jenis sirkuit terdeteksi', M.eulerJenis([['0','1'],['1','2'],['2','0']]) === 'sirkuit');
t.cek('jenis lintasan terdeteksi', M.eulerJenis([['0','1'],['1','2']]) === 'lintasan');
t.cek('2024 berjenis pecah', M.eulerJenis(R24) === 'pecah');
let salah = 0;
for (let p = 0; p < 400; p++) {
  const n = 3 + Math.floor(Math.random() * 5), ruas = [];
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++)
    if (Math.random() < 0.5) ruas.push([String(a), String(b)]);
  if (!ruas.length) continue;
  const d = M.eulerDerajat(ruas);
  if (Object.values(d).reduce((x,y)=>x+y,0) !== 2*ruas.length) salah++;
  if (M.eulerGanjil(ruas).length % 2 !== 0) salah++;
}
t.cek('lema jabat tangan berlaku di 400 peta acak', salah === 0, String(salah));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;

/* ---- syarat yang membuat modul ini gugur (verify/12-syarat-gugur.py) ---- */
const t2 = buatPencatat('10-euler · syarat gugur');
t2.bagian('Peringatan jalan satu arah');
const teks10 = c.badan.textContent;
t2.cek('modul memperingatkan jalan satu arah', /satu arah/.test(teks10));
t2.cek('memberi rumus penggantinya', /kelebihan panah keluar/.test(teks10));
const BEDA = [['0','1'],['1','2'],['0','2']];
t2.cek('contohnya benar: dua arah menjawab 1', M.eulerMinLintasan(BEDA) === 1);
t2.cek('contohnya benar: satu arah menjawab 2', M.eulerBerarah(BEDA).min === 2);
t2.cek('putaran searah tetap 1', M.eulerBerarah([['0','1'],['1','2'],['2','0']]).min === 1);
t2.cek('derajat dua arah semuanya genap (2,2,2)',
  Object.values(M.eulerDerajat(BEDA)).every((d) => d % 2 === 0));
t2.cek('tiga garis, bukan empat', /ketiga garisnya/.test(teks10));
t2.ringkas();
