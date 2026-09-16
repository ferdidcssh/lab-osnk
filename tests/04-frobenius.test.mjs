/* Uji nilai — memastikan perbaikan tampilan tidak mengubah angkanya */
import { siapkanDom, buatPencatat, bangunModul } from './alat.mjs';
import { M } from '../js/core/math.js';
siapkanDom();
const t = buatPencatat('04 · regresi nilai');
const c = await bangunModul('04-frobenius');

t.bagian('Angka lab cacah cocok dengan hitungan kasar');
const kasar = (N,a,b) => { let k=0; for(let n=1;n<=N;n++){ let bisa=false;
  for(let x=0;a*x<=n;x++) if((n-a*x)%b===0){bisa=true;break;} if(!bisa)k++; } return k; };
for (const [a,b,N] of [[9,21,1000],[9,21,20],[3,5,5],[3,5,1000],[4,8,50],[1,1,10],[7,11,3],[6,10,200]]) {
  c.isi('ca',a); c.isi('cb',b); c.isi('cn',N); c.klik('cgo');
  const teks = c.teks('cout');
  const cocok = /DUA CARA SAMA/.test(teks);
  t.cek(`a=${a} b=${b} N=${N} → ${kasar(N,a,b)}`, cocok && M.frobeniusCacah(N,a,b)===kasar(N,a,b), teks.slice(0,60));
}

t.bagian('Kasus tepi');
t.cek('frobeniusCacah(0,3,5) = 0', M.frobeniusCacah(0,3,5)===0);
t.cek('bisaBentuk(0,3,5) benar', M.bisaBentuk(0,3,5)===true);
t.cek('bisaBentuk(1,3,5) salah', M.bisaBentuk(1,3,5)===false);
t.cek('bisaBentuk(-4,3,5) salah', M.bisaBentuk(-4,3,5)===false);
t.cek('Frobenius(3,5) = 7 tidak bisa dibentuk', M.bisaBentuk(7,3,5)===false);
t.cek('8 ke atas semua bisa (3,5)', [8,9,10,11,12,13].every(n=>M.bisaBentuk(n,3,5)));

t.bagian('Lab lain tidak ikut rusak');
c.isi('a',3); c.isi('b',5); c.isi('lim',40); c.klik('go');
t.cek('Lab 1 memuat 40 kotak', (c.el('kisi').innerHTML.match(/border-radius/g)||[]).length >= 40);
c.isi('sa',4); c.isi('sb',7); c.klik('sgo');
t.cek('Lab 2 simetri jalan', /9/.test(c.teks('sout')) || c.teks('sout').length > 20, c.teks('sout').slice(0,50));
t.cek('judul Lab 2 memuat frasa wajib', /Pasangan cermin — yang paling terasa curang/.test(c.badan.textContent));
t.cek('tidak ada rujukan tab lama "Reduksi gcd"', !/Reduksi gcd/.test(c.badan.innerHTML));
t.ringkas();

/* ============================================================
   Jawaban soal asli OSN-K 2025 nomor 23-25.
   Dicocokkan TEPAT di sini, bukan lewat tests/klaim.mjs — jawaban
   soal 23 cuma satu digit (4), dan pencocokan substring di klaim.mjs
   ikut menemukannya di dalam "1, 2, 4, 5" yang kebetulan bersebelahan.
   ============================================================ */
const t2 = buatPencatat('04 · jawaban soal asli');

/* pembanding ditulis ulang dari bunyi soal, tanpa math.js */
const bisaTakar = (n, a, b) => {
  for (let x = 0; a * x <= n; x++) if ((n - a * x) % b === 0) return true;
  return false;
};
const cacahGagal = (N, a, b) => {
  let t = 0;
  for (let n = 1; n <= N; n++) if (!bisaTakar(n, a, b)) t++;
  return t;
};

c.klik('solve');
t2.bagian('Soal 23 — N = 20, gayung 3 dan 5');
t2.cek('modul menjawab tepat "Jawaban: 4 bebek"',
  /Jawaban: 4 bebek(?!\S)/.test(c.teks('s1')), c.teks('s1').replace(/\s+/g, ' ').slice(-70));
t2.cek('hitungan langsung setuju: 4', cacahGagal(20, 3, 5) === 4);
t2.cek('menyebut Frobenius(3,5) = 7', /3×5 − 3 − 5 = 7(?!\d)/.test(c.teks('s1')));

t2.bagian('Soal 24 — N = 1000, gayung 9 dan 21');
t2.cek('modul menjawab tepat "Jawaban: 673 bebek"',
  /Jawaban: 673 bebek(?!\S)/.test(c.teks('s2')), c.teks('s2').replace(/\s+/g, ' ').slice(-70));
t2.cek('hitungan langsung setuju: 673', cacahGagal(1000, 9, 21) === 673);
t2.cek('menyebut FPB(9,21) = 3 dan reduksi ke (3,7)',
  /FPB\(9, 21\) = 3/.test(c.teks('s2')) && /pasangan \(3, 7\)/.test(c.teks('s2')));

t2.bagian('Soal 25 — BENAR/SALAH, gayung 3 dan 100');
t2.cek('modul menjawab BENAR', /99 < 100  →  BENAR/.test(c.teks('s3')),
  c.teks('s3').replace(/\s+/g, ' ').slice(-90));
t2.cek('hitungan langsung setuju: 99 yang gagal', cacahGagal(400, 3, 100) === 99);
t2.cek('99 memang kurang dari 100', cacahGagal(400, 3, 100) < 100);
t2.cek('menyebut Frobenius(3,100) = 197', /3×100 − 3 − 100 = 197(?!\d)/.test(c.teks('s3')));
t2.cek('menjelaskan N = 10¹⁸ tidak berpengaruh', /N sebesar apa pun/.test(c.teks('s3')));

t2.bagian('math.js cocok dengan hitungan langsung pada masukan acak');
let salah = 0;
for (let p = 0; p < 300; p++) {
  const a = 1 + Math.floor(Math.random() * 20);
  const b = 1 + Math.floor(Math.random() * 20);
  const N = 1 + Math.floor(Math.random() * 200);
  if (M.frobeniusCacah(N, a, b) !== cacahGagal(N, a, b)) salah++;
}
t2.cek('frobeniusCacah cocok pada 300 kombinasi acak', salah === 0, String(salah));
t2.ringkas();
