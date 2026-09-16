/* ============================================================
   UJI MODUL 11 — KOMBINATORIKA
   Angka dan aturannya dibuktikan verify/11-kombinatorika.py
   Bagian "berlaku umum" sengaja diuji pada angka ACAK,
   bukan cuma angka yang muncul di soal OSN-K.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('11-kombinatorika');
const c = await bangunModul('11-kombinatorika');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

const AYAM = [...Array(15)].map((_, i) => String.fromCharCode(65 + i));
const TEMAN = [['A','B'],['C','M'],['E','G'],['A','M'],['D','J'],['O','N'],
               ['B','O'],['K','L'],['D','I'],['B','N'],['L','D'],['H','F']];

t.bagian('Jawaban OSN-K 2024 nomor 14-16');
c.klik('solve');
t.cek('nomor 14 = 4 lingkaran', /4 lingkaran/.test(c.teks('s1')), c.teks('s1').slice(-40));
t.cek('nomor 15 = 120', /= 120/.test(c.teks('s2')));
t.cek('nomor 16 = 377', /377/.test(c.teks('s3')));
const kel = M.kKelompok(AYAM, TEMAN), uk = kel.map((k) => k.length);
t.cek('ukuran lingkaran 6,5,2,2', uk.join(',') === '6,5,2,2', uk.join(','));
t.cek('total ayam 15', uk.reduce((a, b) => a + b, 0) === 15);
t.cek('rumus 15: 120', M.kTepatSatuTiap(uk) === 120n);
t.cek('rumus 16: 377', M.kSetidaknyaSatu(uk) === 377n);

t.bagian('Lab 1 · aturan perkalian, termasuk bug lama');
c.isi('kb1', '26, 0, 10'); c.klik('kbgo');
t.cek('BUG LAMA: 0 pilihan membuat total 0', /= 0\b/.test(c.teks('kbout')), c.teks('kbout').slice(0, 120));
t.cek('0 pilihan diberi keterangan', /mustahil/.test(c.teks('kbout')));
c.isi('kb1', '26, 10, 10, 10'); c.klik('kbgo');
t.cek('26.000 dihitung benar', /26\.000/.test(c.teks('kbout')));
c.isi('kb1', ''); c.klik('kbgo');
t.cek('masukan kosong tidak merusak', /Tulis angkanya/.test(c.teks('kbout')));
c.isi('kb1', '-3, 4'); c.klik('kbgo');
t.cek('angka negatif ditangani', /negatif/.test(c.teks('kbout')));

t.bagian('Lab 2 · trik +1 lalu −1');
c.isi('tk', '6, 5, 2, 2'); c.klik('tgo');
t.cek('menampilkan 7 × 6 × 3 × 3', /7 × 6 × 3 × 3 = 378/.test(c.teks('tout')));
t.cek('jawabannya 377', /jawaban = 377/.test(c.teks('tout')));
t.cek('menyebut varian wajib kirim = 120', /120/.test(c.teks('tout')));
c.klik('tlama');
t.cek('cara panjang memakai 15 suku', /15 suku dijumlahkan = 377/.test(c.teks('tout')),
  c.teks('tout').replace(/\s+/g,' ').slice(0, 90));
t.cek('dua cara dinyatakan sama', /DUA CARA SAMA/.test(c.teks('tout')));

t.bagian('Lab 2 · kasus tepi');
c.isi('tk', '1'); c.klik('tgo');
t.cek('satu kelompok ukuran 1 → 1 cara', /jawaban = 1$/m.test(c.teks('tout')), c.teks('tout').slice(-60));
c.isi('tk', ''); c.klik('tgo');
t.cek('kosong tidak merusak', /Tulis ukuran/.test(c.teks('tout')));
c.isi('tk', '3,3,3,3,3,3,3,3,3,3'); c.klik('tlama');
t.cek('terlalu banyak kelompok ditolak halus', /Terlalu banyak/.test(c.teks('tout')));

t.bagian('Lab 3 · komplemen dan Pascal');
c.isi('cp', 4); c.isi('cs', 10); c.klik('cgo');
t.cek('sandi 4 angka: 10.000 − 6.561 = 3.439', /3\.439/.test(c.teks('cout')), c.teks('cout').slice(-90));
c.isi('pn', 8); c.isi('pr', 3); c.klik('pgo');
t.cek('C(8,3) = 56', /C\(8, 3\) = 56/.test(c.teks('pout')));
t.cek('menunjukkan dua angka asalnya', /21 \+ 35 = 56/.test(c.teks('pout')), c.teks('pout').slice(0, 160));
c.isi('pn', 5); c.isi('pr', 9); c.klik('pgo');
t.cek('r > n dijawab 0, bukan dipotong', /C\(5, 9\) = 0/.test(c.teks('pout')), c.teks('pout').slice(0, 80));

t.bagian('Visualisasi');
c.isi('kb1', '3, 2, 2'); c.klik('kbgo');
const pohon = c.el('viz').innerHTML;
t.cek('pohon pilihan digambar', /<svg/.test(pohon));
t.cek('pohon memakai viewBox', /viewBox=/.test(pohon));
t.cek('pohon punya 12 ujung', /12 ujung/.test(pohon), (pohon.match(/\d+ ujung/) || [])[0]);
c.isi('kb1', '26, 10, 10, 10'); c.klik('kbgo');
t.cek('pilihan terlalu banyak dibatasi, bukan meledak',
  /<svg/.test(c.el('viz').innerHTML) || /terlalu banyak/i.test(c.el('viz').innerHTML));
c.isi('tk', '6, 5, 2, 2'); c.klik('tgo');
const kotak = c.el('tviz').innerHTML;
t.cek('kotak kelompok digambar', (kotak.match(/<rect/g) || []).length === 6 + 5 + 2 + 2 + 4,
  (kotak.match(/<rect/g) || []).length + ' kotak');
c.isi('pn', 6); c.isi('pr', 2); c.klik('pgo');
const pas = c.el('pviz').innerHTML;
t.cek('segitiga Pascal digambar', (pas.match(/<text/g) || []).length === 28,
  (pas.match(/<text/g) || []).length + ' angka');

t.bagian('Uji sendiri');
c.isi('tk', '6, 5, 2, 2'); c.klik('ugo');
t.cek('tiga cara sepakat', /KETIGANYA SAMA/.test(c.teks('uout')), c.teks('uout').slice(-60));
c.klik('uall');
t.cek('200 soal acak tidak meleset', /TIDAK ADA YANG MELESET/.test(c.teks('uout')));

t.bagian('Rumusnya berlaku umum — diuji dengan angka acak');
const fakt = (n) => { let h = 1n; for (let i = 2n; i <= BigInt(n); i++) h *= i; return h; };
let salah = 0, uji = 0;
for (let n = 0; n <= 12; n++) for (let r = 0; r <= n + 2; r++) {
  uji++;
  const P = r > n ? 0n : fakt(n) / fakt(n - r);
  const C = r > n ? 0n : fakt(n) / (fakt(r) * fakt(n - r));
  if (M.kPermutasi(n, r) !== P || M.kKombinasi(n, r) !== C) salah++;
}
t.cek(`permutasi & kombinasi benar untuk ${uji} pasangan n,r`, salah === 0, String(salah));
salah = 0; uji = 0;
for (let p = 0; p < 300; p++) {
  const k = 1 + Math.floor(Math.random() * 5);
  const g = [...Array(k)].map(() => 1 + Math.floor(Math.random() * 6));
  uji++;
  if (M.kSetidaknyaSatu(g) !== M.kRinciPanjang(g).total) salah++;
}
t.cek(`trik = penjumlahan panjang pada ${uji} kelompok acak`, salah === 0, String(salah));
t.cek('20! tepat, tidak kehilangan ketelitian', M.kFaktorial(20) === 2432902008176640000n);
t.cek('25! tepat (di luar jangkauan angka biasa)',
  M.kFaktorial(25) === 15511210043330985984000000n);
t.cek('C(50,25) tepat', M.kKombinasi(50, 25) === 126410606437752n);
t.cek('BACA = 12', M.kPermutasiBerulang([2, 1, 1]) === 12n);
t.cek('duduk melingkar 5 orang = 24', M.kMelingkar(5) === 24n);
t.cek('beli 4 kue dari 3 jenis = 15', M.kBintangBatang(3, 4) === 15n);
t.cek('sapuan OSN pada SONO×7 = 112', M.kSapuan('SONO'.repeat(7), 'OSN').hasil === 112n);

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;

/* ---- syarat yang membuat trik ini gugur (verify/12-syarat-gugur.py) ---- */
const t2 = buatPencatat('11-kombinatorika · syarat gugur');
t2.bagian('Peringatan syarat antar-kelompok');
const teks11 = c.badan.textContent;
t2.cek('modul memperingatkan syarat antar-kelompok', /antar-kelompok/.test(teks11));
t2.cek('trik polos [3,3,2] = 47', M.kSetidaknyaSatu([3, 3, 2]) === 47n);
t2.cek('dengan satu larangan jadi 44',
  M.kBerlarangan([3, 3, 2], [[[0, 0], [1, 0]]]) === 44n,
  String(M.kBerlarangan([3, 3, 2], [[[0, 0], [1, 0]]])));
t2.cek('selisihnya 3, sesuai yang ditulis modul',
  M.kSetidaknyaSatu([3, 3, 2]) - M.kBerlarangan([3, 3, 2], [[[0, 0], [1, 0]]]) === 3n);
t2.cek('tanpa larangan hasilnya sama dengan trik polos',
  M.kBerlarangan([3, 3, 2], []) === M.kSetidaknyaSatu([3, 3, 2]));
t2.cek('angka 47 dan 44 tertulis di modul', /47/.test(teks11) && /44/.test(teks11));
t2.ringkas();
