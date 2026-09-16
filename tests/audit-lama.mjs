/* ============================================================
   AUDIT GENERALISASI — MODUL 01-08
   ------------------------------------------------------------
   Berkas ini sebelumnya TIDAK ADA. Akibatnya mesin hitung modul
   01-08 belum pernah diadu dengan pencacahan langsung sama
   sekali: audit-umum.mjs hanya menangani modul 09 ke atas.

   Pertanyaannya sama seperti audit-umum.mjs: apakah rumus di
   math.js benar untuk soal LAIN, bukan cuma untuk soal OSN-K
   yang diunggah?

   Caranya: bangkitkan soal acak yang bentuknya sama tapi
   angkanya beda, lalu adu dengan cara paling bodoh tapi pasti
   benar. Pembandingnya TIDAK BOLEH memakai rumus yang diuji.

   Aturan yang tidak boleh dilanggar: modul membatasi masukan di
   layar (modul 03 membatasi 1..120, 1..200000), tapi fungsinya
   di math.js tetap harus benar DI LUAR batas itu. Justru begitu
   caranya kecilDigitSum dan mandirC00 dulu lolos berbulan-bulan.

   BELUM DIISI: modul 01, 04, 05, 06. Tambahkan dengan
   pola yang sama — pembanding jujur, pembangkit acak, bentuk
   ekstrem.

   Jalankan:  node tests/audit-lama.mjs
   ============================================================ */
import { M } from '../js/core/math.js';

let uji = 0, gagal = 0;
const rusak = [];
const cek = (nama, syarat, ket = '') => {
  uji++;
  if (!syarat) { gagal++; if (rusak.length < 12) rusak.push(nama + '  ' + ket); }
};
const acak = (n) => Math.floor(Math.random() * n);

/* ============================================================
   03 · FPB & TOTIENT — diuji pada bilangan acak, bukan 48/18/2025
   ============================================================ */
console.log('=== 03 · FPB & Totient pada bilangan acak ===');

/* Pembanding jujur: coba semua pembagi. Sama sekali bukan Euclid. */
const fpbKasar = (a, b) => {
  let g = 1;
  for (let d = 1; d <= Math.min(a, b); d++) if (a % d === 0 && b % d === 0) g = d;
  return g;
};
const phiKasar = (n) => {
  let c = 0;
  for (let k = 1; k <= n; k++) if (fpbKasar(n, k) === 1) c++;
  return c;
};

let pasangDiuji = 0;
for (let putar = 0; putar < 600; putar++) {
  const a = 1 + acak(400), b = 1 + acak(400);
  pasangDiuji++;
  cek('gcd', M.gcd(a, b) === fpbKasar(a, b), `${a},${b}`);
  cek('gcd setangkup', M.gcd(a, b) === M.gcd(b, a), `${a},${b}`);
  const s = M.gcdSteps(a, b);
  cek('gcdSteps berakhir di FPB yang sama', s.g === fpbKasar(a, b), `${a},${b}`);
}

/* totient: dicacah satu per satu, lalu dibandingkan dengan rumus faktor prima */
let phiDiuji = 0;
for (let n = 1; n <= 300; n++) { phiDiuji++; cek('totient', M.totient(n) === phiKasar(n), String(n)); }
for (let putar = 0; putar < 60; putar++) {
  const n = 301 + acak(900);
  phiDiuji++;
  cek('totient di luar batas layar', M.totient(n) === phiKasar(n), String(n));
}

/* sifat yang dipakai modul sebagai jalan pintas: banyaknya C dengan
   FPB(A, C) = B itu tepat φ(A ÷ B), dan nol bila B tidak membagi A */
let pintasDiuji = 0, pintasNol = 0;
for (let putar = 0; putar < 200; putar++) {
  const A = 2 + acak(300), B = 1 + acak(60);
  let n = 0;
  for (let C = 1; C <= A; C++) if (fpbKasar(A, C) === B) n++;
  const harus = A % B === 0 ? phiKasar(A / B) : 0;
  pintasDiuji++;
  if (harus === 0) pintasNol++;
  cek('jalan pintas φ(A ÷ B)', n === harus, `A=${A} B=${B} -> ${n} vs ${harus}`);
}

/* bentuk ekstrem */
cek('FPB dengan nol', M.gcd(0, 7) === 7 && M.gcd(7, 0) === 7);
cek('FPB nol dan nol', M.gcd(0, 0) === 0);
cek('FPB bilangan dengan dirinya', M.gcd(13, 13) === 13);
cek('FPB dua bilangan koprima', M.gcd(17, 4) === 1);
cek('FPB Fibonacci berurutan (kasus terlama)', M.gcd(89, 55) === 1);
cek('gcdSteps Fibonacci memang paling panjang',
  M.gcdSteps(89, 55).steps.length >= M.gcdSteps(89, 54).steps.length);
cek('φ(1)', M.totient(1) === 1);
cek('φ(0) tidak meledak', M.totient(0) === 0);
cek('φ(bilangan prima) = p − 1', M.totient(9973) === 9972);
cek('φ(2^10)', M.totient(1024) === 512);
cek('φ raksasa masih bulat', Number.isInteger(M.totient(999983)));
console.log(`  ${pasangDiuji} pasangan acak, ${phiDiuji} nilai φ dicacah, `
  + `${pintasDiuji} jalan pintas (${pintasNol} di antaranya harus nol)`);

/* ============================================================
   08 · LEVEL & TOPOSORT — diuji pada graf acak, bukan rutinitas malam
   ============================================================ */
console.log('\n=== 08 · Level & toposort pada graf acak ===');

/* Pembanding jujur 1: leluhur = telusuri mundur sampai mentok. */
const leluhurKasar = (pre, v, lihat = new Set()) => {
  for (const p of (pre[v] || [])) if (!lihat.has(p)) { lihat.add(p); leluhurKasar(pre, p, lihat); }
  return lihat;
};

/* Pembanding jujur 2: posisi paling awal = COBA SEMUA URUTAN SAH.
   Tidak memakai rumus "leluhur + 1" — rumus itulah yang diuji. */
function posisiKasar(pre, target) {
  const daftar = Object.keys(pre);
  let terbaik = Infinity;
  const sudah = new Set();
  (function maju(pos) {
    if (pos >= terbaik) return;
    for (const x of daftar) {
      if (sudah.has(x)) continue;
      if (!(pre[x] || []).every((p) => sudah.has(p))) continue;
      if (x === target) { terbaik = Math.min(terbaik, pos); continue; }
      sudah.add(x); maju(pos + 1); sudah.delete(x);
    }
  })(1);
  return terbaik;
}

/* Pembanding jujur 3: level = rantai terpanjang yang berakhir di v. */
const levelKasar = (pre, v) => ((pre[v] || []).length
  ? 1 + Math.max(...pre[v].map((p) => levelKasar(pre, p))) : 1);

/* Pembanding jujur 4: waktu selesai disimulasikan hari demi hari. */
function selesaiKasar(pre, dur) {
  const selesai = {};
  const belum = new Set(Object.keys(pre));
  for (let hari = 0; hari <= 20000 && belum.size; hari++) {
    for (const x of [...belum]) {
      if ((pre[x] || []).every((p) => p in selesai && selesai[p] <= hari)) {
        selesai[x] = hari + (dur[x] || 0);
        belum.delete(x);
      }
    }
  }
  return belum.size ? null : selesai;
}

/* graf acak yang DIJAMIN tidak bersiklus: panah selalu dari indeks kecil */
function grafAcak(n, rapat) {
  const titik = [...Array(n)].map((_, i) => 'k' + i);
  const pre = {};
  titik.forEach((v, i) => {
    pre[v] = titik.slice(0, i).filter(() => Math.random() < rapat);
  });
  return { titik, pre };
}

let grafDiuji = 0, posisiDiuji = 0, terpisah = 0;
for (let putar = 0; putar < 400; putar++) {
  const n = 1 + acak(8);
  const { titik, pre } = grafAcak(n, 0.35);
  grafDiuji++;
  if (titik.every((v) => pre[v].length === 0) && n > 1) terpisah++;

  const lapis = M.topoKupas(pre);
  cek('topoKupas menemukan urutan', lapis !== null, JSON.stringify(pre));
  const lv = M.levels(pre);

  for (const v of titik) {
    const benarLel = leluhurKasar(pre, v);
    const dapat = M.topoLeluhur(pre, v);
    cek('topoLeluhur', dapat.size === benarLel.size && [...dapat].every((x) => benarLel.has(x)),
      `${v} di ${JSON.stringify(pre)}`);
    cek('levels', lv[v] === levelKasar(pre, v), `${v} -> ${lv[v]} vs ${levelKasar(pre, v)}`);

    if (n <= 7) {
      posisiDiuji++;
      cek('posisi paling awal = leluhur + 1',
        M.topoPosisiAwal(pre, v) === posisiKasar(pre, v),
        `${v} -> ${M.topoPosisiAwal(pre, v)} vs ${posisiKasar(pre, v)} di ${JSON.stringify(pre)}`);
    }

    /* nomor lapis harus sama persis dengan level — ini yang diklaim rumus terkunci */
    if (lapis) {
      const nomor = lapis.findIndex((L) => L.includes(v)) + 1;
      cek('nomor lapis == level', nomor === lv[v], `${v} -> lapis ${nomor}, level ${lv[v]}`);
    }
  }

  /* urutan yang dikeluarkan harus benar-benar sah */
  const urut = M.topoUrutan(pre);
  cek('topoUrutan memuat semua kegiatan', urut && urut.length === n, JSON.stringify(pre));
  if (urut) {
    const posisi = {}; urut.forEach((v, i) => { posisi[v] = i; });
    cek('topoUrutan menghormati semua prasyarat',
      titik.every((v) => (pre[v] || []).every((p) => posisi[p] < posisi[v])),
      urut.join(','));
  }
}

/* durasi: waktu selesai dan jalur kritis */
let durDiuji = 0;
for (let putar = 0; putar < 300; putar++) {
  const n = 1 + acak(7);
  const { titik, pre } = grafAcak(n, 0.4);
  const dur = {}; titik.forEach((v) => { dur[v] = 1 + acak(9); });
  const benar = selesaiKasar(pre, dur);
  const dapat = M.topoSelesai(pre, dur);
  durDiuji++;
  cek('topoSelesai', benar && titik.every((v) => dapat[v] === benar[v]),
    JSON.stringify({ pre, dur }));

  const jk = M.topoJalurKritis(pre, dur);
  const total = jk.reduce((a, v) => a + dur[v], 0);
  const puncak = Math.max(...Object.values(dapat));
  cek('jalur kritis berjumlah sama dengan waktu selesai terlama',
    total === puncak, `${jk.join('→')} = ${total} vs ${puncak}`);
  cek('jalur kritis benar-benar berantai',
    jk.every((v, i) => i === 0 || (pre[jk[i]] || []).includes(jk[i - 1])),
    jk.join('→'));
}

/* bentuk ekstrem */
cek('graf kosong', M.topoKupas({}) !== null && M.topoKupas({}).length === 0);
cek('satu kegiatan tanpa prasyarat', M.topoPosisiAwal({ a: [] }, 'a') === 1);
cek('kegiatan yang tidak ada di daftar', M.topoLeluhur({ a: [] }, 'zz').size === 0);
cek('dua bagian terpisah tetap terurus',
  M.topoKupas({ a: [], b: ['a'], x: [], y: ['x'] }).length === 2);
cek('prasyarat ganda dihitung sekali',
  M.topoLeluhur({ a: [], b: ['a'], c: ['a', 'b'] }, 'c').size === 2);
cek('siklus terdeteksi topoKupas', M.topoKupas({ a: ['b'], b: ['a'] }) === null);
cek('siklus terdeteksi topoUrutan', M.topoUrutan({ a: ['b'], b: ['a'] }) === null);
cek('siklus ditandai NaN di levels', isNaN(M.levels({ a: ['b'], b: ['a'] }).a));
cek('menunjuk dirinya sendiri juga siklus', M.topoKupas({ a: ['a'] }) === null);
cek('rantai 30 dalam: posisi paling awal ujungnya',
  (() => { const p = { n0: [] };
    for (let i = 1; i < 30; i++) p['n' + i] = ['n' + (i - 1)];
    return M.topoPosisiAwal(p, 'n29') === 30; })());
cek('durasi tidak tertulis dianggap nol',
  M.topoSelesai({ a: [], b: ['a'] }, { a: 5 }).b === 5);
console.log(`  ${grafDiuji} graf acak, ${posisiDiuji} posisi diadu semua urutan, `
  + `${durDiuji} graf berdurasi`);

/* ============================================================
   02 · DIGIT SUM — diuji pada bilangan acak, bukan 4587/123456789
   ============================================================ */
console.log('\n=== 02 · Digit sum pada bilangan acak ===');

/* Pembanding jujur: ditulis ulang dari kode C++ naskah OSN-K 2024
   nomor 35-37, lalu digit dijumlahkan apa adanya. */
const panas = (X) => (X === 0 ? 0 : (X % 10) + panas(Math.floor(X / 10)));
const panasTeks = (v) => String(v).split('').reduce((a, c) => a + Number(c), 0);
const akarKasar = (n) => { let v = n; while (v > 9) v = panas(v); return v; };

let dsDiuji = 0;
for (let putar = 0; putar < 800; putar++) {
  const n = acak(2000000);
  dsDiuji++;
  cek('digitSum', M.digitSum(n) === panas(n), String(n));
  cek('digits menyusun ulang bilangannya',
    Number(M.digits(n).join('')) === n, String(n));
  if (n > 0) cek('digitalRoot', M.digitalRoot(n) === akarKasar(n), String(n));
}
/* rumus 1 + (n−1) mod 9 harus sama dengan penjumlahan berulang */
for (let n = 1; n <= 3000; n++) {
  cek('akar digit == 1 + (n−1) mod 9', M.digitalRoot(n) === 1 + (n - 1) % 9, String(n));
}
/* jumlah berselang-seling untuk sisa bagi 11 */
for (let putar = 0; putar < 200; putar++) {
  const n = 1 + acak(500000);
  const d = String(n).split('').reverse().map(Number);
  const selang = d.reduce((a, x, i) => a + (i % 2 ? -x : x), 0);
  cek('altSum', M.altSum(n) === selang, String(n));
  cek('altSum sepadan modulo 11', ((M.altSum(n) % 11) + 11) % 11 === n % 11, String(n));
}
/* bilangan terkecil yang jumlah digitnya X — DI LUAR batas layar juga */
let kdDiuji = 0;
for (let X = 1; X <= 90; X++) {
  /* kecilDigitSum mengembalikan BigInt untuk X besar — dijumlahkan lewat
     teksnya supaya tidak ada pembulatan diam-diam. */
  const dapat = String(M.kecilDigitSum(X));
  kdDiuji++;
  cek('kecilDigitSum jumlah digitnya benar', panasTeks(dapat) === X, `X=${X} -> ${dapat}`);
  /* tidak ada yang lebih kecil dengan jumlah digit sama (dicek kasar untuk X kecil) */
  if (X <= 20) {
    let terkecil = null;
    for (let v = 1; v <= 100000; v++) if (panas(v) === X) { terkecil = v; break; }
    if (terkecil !== null) cek('kecilDigitSum memang yang terkecil',
      dapat === String(terkecil), `X=${X} -> ${dapat} vs ${terkecil}`);
  }
}
/* bobot RATA: k terhitung sebanyak (k−x+1) × (y−k+1) kali */
let rbDiuji = 0;
for (let putar = 0; putar < 40; putar++) {
  const x = 1 + acak(60), y = x + acak(25);
  const C = new Array(10).fill(0);
  for (let i = x; i <= y; i++) for (let j = i; j <= y; j++) {
    for (let k = i; k <= j; k++) { let v = k; while (v > 0) { C[v % 10]++; v = Math.floor(v / 10); } }
  }
  const dapat = M.rataBobot(x, y);
  rbDiuji++;
  cek('rataBobot', C.every((v, i) => v === dapat[i]), `${x}..${y}`);
}
/* bentuk ekstrem */
cek('digitSum(0)', M.digitSum(0) === 0);
cek('akar digit kelipatan 9', M.digitalRoot(999999999) === 9);
cek('akar digit bilangan satu angka', M.digitalRoot(7) === 7);
cek('kecilDigitSum di atas batas layar (X = 144)', panasTeks(M.kecilDigitSum(144)) === 144);
cek('kecilDigitSum X = 1', String(M.kecilDigitSum(1)) === '1');
console.log(`  ${dsDiuji} bilangan acak, ${kdDiuji} nilai kecilDigitSum, ${rbDiuji} rentang RATA`);

/* ============================================================
   07 · REKURSI BERCABANG (TIGA) — diuji sampai N besar
   ============================================================ */
console.log('\n=== 07 · TIGA pada N acak ===');

/* Pembanding jujur: tabel diisi dari bawah, apa adanya dari naskah. */
const tabel07 = (batas) => { const t = [];
  const amb = (k) => (k <= 1 ? 1 : t[k]);
  for (let N = 0; N <= batas; N++) {
    t[N] = N <= 1 ? 1
      : N % 3 === 0 ? amb(N - 1) + amb(N - 3)
        : N % 3 === 1 ? amb(N - 2)
          : amb(N - 3);
  }
  return t; };
const T07 = tabel07(3000);

let tgDiuji = 0;
for (let putar = 0; putar < 600; putar++) {
  const N = acak(3001);
  tgDiuji++;
  cek('tiga', M.tiga(N) === T07[N], String(N));
}
for (let N = 0; N <= 200; N++) cek('tiga (N kecil, semuanya)', M.tiga(N) === T07[N], String(N));

/* klaim modul: TIGA(k) = 1 tepat ketika k bukan kelipatan 3,
   dan untuk kelipatan 3 nilainya k ÷ 3 + 1 */
for (let N = 1; N <= 900; N++) {
  cek('TIGA = 1 tepat ketika bukan kelipatan 3',
    (T07[N] === 1) === (N % 3 !== 0), String(N));
  if (N % 3 === 0) cek('kelipatan 3: TIGA = N ÷ 3 + 1', T07[N] === N / 3 + 1, String(N));
}
/* jumlah dan cacahan pada batas acak */
let jmDiuji = 0;
for (let putar = 0; putar < 120; putar++) {
  const N = 1 + acak(600);
  let jml = 0, satu = 0;
  for (let k = 1; k <= N; k++) { jml += T07[k]; if (T07[k] === 1) satu++; }
  jmDiuji++;
  cek('tigaJumlah', M.tigaJumlah(N) === jml, String(N));
  cek('tigaCacah1', M.tigaCacah1(N) === satu, String(N));
}
/* banyaknya pemanggilan kalau ditelusuri tanpa ingatan */
const panggilKasar = (N) => { let n = 0;
  (function jalan(k) { n++;
    if (k <= 1) return;
    if (k % 3 === 0) { jalan(k - 1); jalan(k - 3); }
    else if (k % 3 === 1) jalan(k - 2);
    else jalan(k - 3); })(N);
  return n; };
for (let N = 0; N <= 40; N++) {
  cek('tigaPanggilan', M.tigaPanggilan(N) === panggilKasar(N), String(N));
}
/* bentuk ekstrem */
cek('TIGA(0)', M.tiga(0) === 1);
cek('TIGA(1)', M.tiga(1) === 1);
cek('tigaJumlah(1)', M.tigaJumlah(1) === 1);
cek('tigaCacah1(1)', M.tigaCacah1(1) === 1);
cek('tigaCacah1(3) hanya 1 dan 2', M.tigaCacah1(3) === 2);
console.log(`  ${tgDiuji} nilai N acak, ${jmDiuji} batas jumlah/cacahan`);

console.log('\n' + '='.repeat(58));
console.log(`TOTAL: ${uji} pemeriksaan, ${gagal} gagal`);
console.log('BELUM DIISI: modul 01, 04, 05, 06');
if (rusak.length) { console.log('\nYANG RUSAK:'); rusak.forEach((r) => console.log('  ✗ ' + r)); }
process.exitCode = gagal ? 1 : 0;
