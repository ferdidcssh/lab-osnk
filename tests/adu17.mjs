/* Isi kamus diperiksa terhadap kenyataan, bukan cuma bentuknya.
   Tiap entri yang mengklaim rumus harus cocok dengan math.js. */
import { M } from '../js/core/math.js';
import { ENTRI } from '../js/core/kamus.js';

let uji = 0, gagal = 0;
const cek = (n, s, k = '') => { uji++; if (!s) { gagal++; console.log('  ✗ ' + n + '  ' + k); } };
const cari = (potongan) => ENTRI.find((e) =>
  (e.kata + ' ' + e.topik + ' ' + (e.tertukar || '')).includes(potongan));
const ada = (potongan, ket) => {
  const e = cari(potongan);
  cek(`ada entri untuk "${potongan.slice(0, 40)}"`, !!e, '(tidak ketemu)');
  return e;
};

/* --- klaim yang bisa dihitung ulang --- */
let e = ada('ab − a − b');
if (e) cek('Frobenius(3,5) memang 7', M.frobenius(3, 5).largest === 7 && M.frobenius(3, 5).ok);
e = ada('(n−1)!');
if (e) cek('permutasi melingkar 5 = 24', M.kMelingkar(5) === 24n);
e = ada('hitung angka 1 pada biner');
if (e) cek('trik biner cocok dengan Thue-Morse', M.tm(1000) === M.popcount(1000) % 2);
e = ada('Euler’s Totient');
if (e) cek('totient 2025 benar', M.totient(2025) === (() => {
  let c = 0; for (let k = 1; k <= 2025; k++) if (M.gcd(2025, k) === 1) c++; return c; })());
e = ada('leluhur + 1');
if (e) cek('posisi awal = leluhur + 1', (() => {
  const pre = { a: [], b: ['a'], c: ['a', 'b'] };
  return M.topoPosisiAwal(pre, 'c') === M.topoLeluhur(pre, 'c').size + 1; })());
e = ada('cacah ukuran yang paling sering muncul');
if (e) cek('kotak bersarang 2025 nomor 17 = 3', M.dwMin([1,1,2,2,2,3,3,4,6,8]) === 3);
e = ada('Rumus kembar gugur');
if (e) cek('balok memang membuat rumus kembar gugur', M.dwMinUmum([[2,5],[5,2]]) === 2);
e = ada('jawabannya selalu 1');
if (e) cek('kalau boleh sama, semua jadi satu rantai',
  M.dwMinUmum([[1],[1],[2]]) === 2 && M.dwMin([1,2,3,4,5]) === 1);
e = ada('selisih panah keluar dan masuk');
if (e) cek('gambar berarah: rumus dua arah memberi jawaban lain',
  M.eulerMinLintasan([['0','1'],['1','2'],['0','2']]) === 1
  && M.eulerBerarah([['0','1'],['1','2'],['0','2']]).min === 2);
e = ada('Hamilton');
if (e) cek('Euler mengurusi garis, bukan titik',
  M.eulerMinLintasan([['0','1'],['0','5'],['0','4'],['1','6'],['1','2'],['5','6'],
                      ['5','7'],['4','7'],['4','3'],['2','6'],['2','3'],['3','7']]) === 4);
e = ada('nilai terbesar tidak bisa dikurangkan');
if (e) {
  const a = [3, 9, 1, 7], P = M.psTabel(a);
  cek('jumlah rentang bisa dikurangkan', M.psJumlah(P, 2, 4) === 17);
  cek('nilai terbesar rentang tidak bisa diturunkan dari selisih',
      Math.max(...a.slice(1, 4)) !== Math.max(...a) - Math.max(...a.slice(0, 1)));
}
e = ada('Trik +1 lalu −1');
if (e) cek('trik +1 lalu -1 pada 6,5,2,2 = 377', M.kSetidaknyaSatu([6,5,2,2]) === 377n);
/* CATATAN: klaim "meleset sekitar sekian persen" pernah ada di sini dan
   HARUS dibuang — angkanya berubah tiap kali diacak, jadi tidak bisa
   diverifikasi. Yang diperiksa sekarang contoh nyatanya, dan keluarga
   soal yang bisa didaftar seluruhnya sehingga angkanya pasti sama. */
e = ada('menjawab 28, padahal 32');
if (e) {
  const P = [[2,2,2,2,2,2,2,2,2,2],[3,3,3,3,3,3,3,3,3,3],[5,5,5,5,5,5,5,5,5,5]];
  cek('serakah soal 2026 nomor 15 = 28', M.dpSerakah(P, [1,2,3], ['T','O','K']).best === 28);
  cek('jawaban benarnya 32', M.dpJadwal(P, [1,2,3], ['T','O','K']).best === 32);
  /* keluarga lengkap, bukan acak: hasilnya pasti sama tiap dijalankan */
  let total = 0, salah = 0;
  const N = 3;
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 3; c++) {
    const jeda = [a, b, c];
    for (let m = 0; m < (1 << (3 * N)); m++) {
      const poin = [[], [], []];
      for (let j = 0; j < 3; j++) for (let i = 0; i < N; i++)
        poin[j].push(((m >> (j * N + i)) & 1) + 1);
      total++;
      if (M.dpSerakah(poin, jeda, ['T','O','K']).best
          !== M.dpJadwal(poin, jeda, ['T','O','K']).best) salah++;
    }
  }
  cek('keluarga lengkap berisi 13.824 soal', total === 13824, String(total));
  cek('serakah salah pada tepat 1.716 soal', salah === 1716, String(salah));
}
e = ada('MUSTAHIL');
if (e) cek('wadah kurang dari syarat memang mustahil', M.phDijamin([2,5,5], 3) === null);
e = ada('Skenario terburuk');
if (e) cek('dijamin jauh lebih besar daripada mungkin',
  M.phDijamin([5,5,5,5,5,5,5], 1) === 31 && M.phMungkin([5,5,5,5,5,5,5], 1) === 7);
e = ada('perkecil pakai sisa bagi');
if (e) cek('2 pangkat besar mod 67 lewat sisa 66',
  M.pow2mod67(666666) === M.pow2mod67(666666 % 66));
e = ada('jumlah berselang-seling');
if (e) cek('sisa bagi 11 memang butuh jumlah berselang-seling',
  ((M.altSum(4587) % 11) + 11) % 11 === 4587 % 11);
e = ada('Difference array');
if (e) cek('difference array cocok dengan penambahan satu per satu', (() => {
  const op = [{ l: 2, r: 5, v: 3 }, { l: 1, r: 3, v: -2 }];
  return JSON.stringify(M.psTerapkan(6, op).hasil) === JSON.stringify(M.psTerapkanKasar(6, op).hasil); })());

/* --- setiap entri jebakan harus benar-benar berbunyi menolak --- */
const kataTolak = /bukan|BUKAN|gugur|MUSTAHIL|basi|salah|jebakan|kelebihan|meleset|selalu 1|lebih sulit|berbeda/i;
ENTRI.filter((x) => x.jebakan).forEach((x) => {
  cek('entri jebakan berbunyi menolak', kataTolak.test(x.topik + ' ' + (x.tertukar || '')),
      x.kata.slice(0, 45));
});
/* --- entri tanpa modul harus mengakuinya --- */
ENTRI.filter((x) => !x.n).forEach((x) => {
  cek('entri tanpa modul mengakui belum ada modulnya',
      /belum ada modulnya/.test(x.topik), x.kata.slice(0, 45));
});


/* --- empat entri modul 02 yang baru: klaimnya diadu dengan kenyataan --- */
e = ada('1 + (n−1) mod 9');
if (e) {
  let salah = 0;
  for (let n = 1; n <= 5000; n++) {
    let x = n; while (x > 9) x = M.digitSum(x);
    if (x !== 1 + ((n - 1) % 9)) salah++;
  }
  cek('akar digit = 1 + (n−1) mod 9 untuk n = 1..5000', salah === 0, String(salah));
}
e = ada('Isi angka 9 sebanyak mungkin dari belakang');
if (e) {
  let salah = 0;
  for (let X = 1; X <= 200; X++) if (M.digitSum(M.kecilDigitSum(X)) !== X) salah++;
  for (let X = 1; X <= 25; X++) {
    let cari = null;
    for (let n = 1; n <= 200000; n++) if (M.digitSum(n) === X) { cari = n; break; }
    if (cari !== null && BigInt(cari) !== M.kecilDigitSum(X)) salah++;
  }
  cek('bilangan terkecil berjumlah digit X benar dan memang terkecil', salah === 0, String(salah));
}
e = ada('habis dibagi FPB(Y, 9)');
if (e) {
  let salah = 0, uji2 = 0;
  for (let Y = 1; Y <= 40; Y++) for (let X = 1; X <= 25; X++) {
    uji2++;
    const boleh = X % M.gcd(Y, 9) === 0;
    let ketemu = false;
    for (let k = 1; k <= 40000; k++) if (M.digitSum(k * Y) === X) { ketemu = true; break; }
    if (ketemu && !boleh) salah++;      // saringan tidak boleh menolak yang ternyata ada
  }
  cek(`saringan FPB(Y,9) tidak pernah salah menolak (${uji2} pasangan)`, salah === 0, String(salah));
}
e = ada('(k − x + 1) × (y − k + 1)');
if (e) {
  const x = 997, y = 1018, C = M.rataBobot(x, y), D = new Array(10).fill(0);
  for (let k = x; k <= y; k++) {
    const w = (k - x + 1) * (y - k + 1);
    let kk = k; while (kk > 0) { D[kk % 10] += w; kk = Math.floor(kk / 10); }
  }
  cek('rumus bobot cocok dengan pencacahan langsung',
      JSON.stringify(C) === JSON.stringify(D));
}



/* --- empat entri modul 03 yang baru --- */
e = ada('φ(A ÷ B)');
if (e) {
  const kasar = (A, B) => { let n = 0; for (let C = 1; C <= A; C++) if (M.gcd(A, C) === B) n++; return n; };
  let salah = 0, uji3 = 0;
  for (let a = 1; a <= 150; a++) for (let b = 0; b <= a; b++) {
    uji3++;
    const rumus = (b > 0 && a % b === 0) ? M.totient(a / b) : 0;
    if (rumus !== kasar(a, b)) salah++;
  }
  cek(`jalan pintas φ(A÷B) benar untuk ${uji3} pasangan`, salah === 0, String(salah));
}
e = ada('FPB dari kedua ukuran lantainya');
if (e) cek('ubin 48 × 18 = 6', M.gcd(48, 18) === 6);
e = ada('a × b ÷ FPB(a, b)');
if (e) {
  let salah = 0;
  for (let a = 1; a <= 60; a++) for (let b = 1; b <= 60; b++) {
    const kpk = a * b / M.gcd(a, b);
    let cari = null;
    for (let k = 1; k <= 3600; k++) if (k % a === 0 && k % b === 0) { cari = k; break; }
    if (cari !== kpk) salah++;
  }
  cek('rumus KPK a×b÷FPB diadu pencarian langsung', salah === 0, String(salah));
}
e = ada('Kasus terlama cara Euclid');
if (e) {
  let terlama = 0, pasangan = null;
  for (let a = 1; a <= 200; a++) for (let b = 1; b <= a; b++) {
    const n = M.gcdSteps(a, b).steps.length;
    if (n > terlama) { terlama = n; pasangan = [a, b]; }
  }
  const fib = [1, 1];
  while (fib[fib.length - 1] < 300) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  cek('pasangan terlama memang Fibonacci berurutan',
      fib.includes(pasangan[0]) && fib.includes(pasangan[1]), String(pasangan));
}

console.log(`\nadu kamus vs math.js: ${uji} pemeriksaan, ${gagal} gagal`);
