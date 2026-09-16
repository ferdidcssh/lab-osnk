/* ============================================================
   UJI MODUL 02 — DIGIT SUM
   ------------------------------------------------------------
   Berkas ini menjaga angka SATU DIGIT yang tidak bisa dijaga
   lapis 2 (tests/audit.mjs). Sudah dibuktikan dengan merusak
   modulnya: akar digit 123456789 dirusak dari 9, dan jawaban
   soal 37 dirusak dari 3 — auditor tetap hijau dua-duanya.
   Digit tunggal selalu ketemu lagi di jendela yang sama.

   Di sini angkanya dicocokkan TEPAT: seluruh kalimatnya ikut
   dicocokkan, digit di belakangnya ditolak dengan (?!\d), dan
   SETIAP kemunculan pola itu wajib benar.

   Pembandingnya ditulis ULANG dari kode C++ naskah OSN-K 2024
   nomor 35-37 dan 2026 nomor 29-31, sengaja TANPA memakai
   math.js. RATA sengaja ditulis sebagai tiga gelung bersarang
   apa adanya — lambat, tapi itulah gunanya pembanding.

   Jalankan:  node tests/02-digit-sum.test.mjs
   ============================================================ */

import { siapkanDom, buatPencatat, bangunModul } from './alat.mjs';

/* ============================================================
   1. NASKAH OSN-K 2024 nomor 35-37

     int panas(int X)  { if (X == 0) return 0;
                         else return (X % 10) + panas(X / 10); }
     int dingin(int X, int Y) { int air = 0;
                                while (panas(air) != X) air = air + Y;
                                return air; }
   ============================================================ */
const panas = (X) => (X === 0 ? 0 : (X % 10) + panas(Math.floor(X / 10)));
const dingin = (X, Y, batas = 2e6) => {
  let air = 0;
  while (panas(air) !== X) { air += Y; if (air > batas) return null; }
  return air;
};

/* Soal 37 dicacah apa adanya: coba semua pasangan <X, Y>.
   Kalau air sudah melewati 77 tanpa pernah cocok, mustahil
   kembaliannya 77 — jadi penelusurannya boleh berhenti di situ. */
function pasanganYangMenghasilkan(hasil) {
  const daftar = [];
  for (let X = 0; X <= 81; X++) {
    for (let Y = 1; Y <= hasil; Y++) {
      let air = 0;
      while (panas(air) !== X && air <= hasil) air += Y;
      if (panas(air) === X && air === hasil) daftar.push([X, Y]);
    }
  }
  return daftar;
}

/* ============================================================
   2. NASKAH OSN-K 2026 nomor 29-31

     void CAMPUR(vector<int> &C, int x) { while (x > 0) { C[x%10]++; x /= 10; } }
     void ADUK (vector<int> &C, int x, int y) { for (i=x..y) CAMPUR(C,i); }
     void RATA (vector<int> &C, int x, int y) { for (i=x..y) for (j=i..y) ADUK(C,i,j); }
   ============================================================ */
const CAMPUR = (C, x) => { while (x > 0) { C[x % 10]++; x = Math.floor(x / 10); } };
const ADUK = (C, x, y) => { for (let i = x; i <= y; i++) CAMPUR(C, i); };
const RATA = (C, x, y) => { for (let i = x; i <= y; i++) for (let j = i; j <= y; j++) ADUK(C, i, j); };
const kosong = () => new Array(10).fill(0);

/* Soal 29: x terkecil yang CAMPUR-nya menghasilkan pola itu. Dicoba
   satu per satu dari 1, bukan disusun lewat trik modulnya. */
function xTerkecil(target) {
  for (let x = 1; x < 1e6; x++) {
    const C = kosong(); CAMPUR(C, x);
    if (C.every((v, i) => v === target[i])) return x;
  }
  return null;
}

/* Banyaknya pemanggilan CAMPUR bila RATA dijalankan apa adanya. */
function cacahCampur(x, y) {
  let n = 0;
  for (let i = x; i <= y; i++) for (let j = i; j <= y; j++) n += j - i + 1;
  return n;
}

/* ============================================================
   3. JAWABAN PEMBANDING
   ============================================================ */
const POLA29 = [1, 0, 2, 0, 0, 0, 1, 0, 0, 1];
const X26 = 997, Y26 = 1018;
const c30 = kosong(); ADUK(c30, X26, Y26);
const c31 = kosong(); RATA(c31, X26, Y26);

const J = {
  s35: dingin(10, 7),
  s36: dingin(2, 35),
  pasang37: pasanganYangMenghasilkan(77),
  x29: xTerkecil(POLA29),
  c0: c30[0],
  c9: c31[9],
  campur: cacahCampur(X26, Y26),
  jumlah4587: panas(4587),
  akar4587: (() => { let v = 4587; while (v > 9) v = panas(v); return v; })(),
  akarBesar: (() => { let v = 123456789; while (v > 9) v = panas(v); return v; })(),
};

/* ============================================================
   4. ALAT PENCOCOKAN TEPAT
   ============================================================ */
const glob = (p) => new RegExp(p.source, p.flags.replace(/[dg]/g, '') + 'dg');
const angkaId = (v) => Number(v).toLocaleString('id-ID');

function cocok(t, teks, apa, pola, benar, harapan = '') {
  const m = [...teks.matchAll(glob(pola))];
  const salah = m.filter((x) => !benar(x));
  t.cek(`${apa} — polanya ada di modul`, m.length >= 1, `0 kemunculan · pola ${pola}`);
  t.cek(`${apa} — semua ${m.length} kemunculan benar${harapan ? ` (${harapan})` : ''}`,
    m.length >= 1 && salah.length === 0,
    salah.map((x) => x[0].replace(/\s+/g, ' ')).join(' | '));
  ujiPalsu(t, teks, apa, pola, benar, m);
}

const samaDengan = (...harus) => (x) => harus.every((h, i) => x[i + 1] === String(h));

function ujiPalsu(t, teks, apa, pola, benar, m) {
  if (!m.length) return;
  const x = m[0];
  let rusak = teks;
  /* Yang dirusak HANYA grup terakhir. Merusak semua grup sekaligus kadang
     menghasilkan kombinasi yang kebetulan tetap sah — mis. "0(0)" jadi
     "1(1)", yang juga benar, sehingga uji palsunya salah menuduh. */
  for (let i = x.length - 1; i >= x.length - 1; i--) {
    if (x[i] === undefined || !x.indices[i]) continue;
    const [a, b] = x.indices[i];
    const ganti = /^[\d.]+$/.test(x[i]) ? String(Number(x[i].replace(/\./g, '')) + 1) : x[i] + 'X';
    rusak = rusak.slice(0, a) + ganti + rusak.slice(b);
  }
  const lagi = [...rusak.matchAll(glob(pola))];
  t.cek(`${apa} — uji palsu: angka dirusak, pola jadi merah`,
    lagi.length === 0 || lagi.some((y) => !benar(y)),
    'pola terlalu longgar — angka salah tetap lolos');
}

/* ============================================================
   5. JALANKAN
   ============================================================ */
siapkanDom();
const t = buatPencatat('02-digit-sum');

t.bagian('Pembanding dari naskah (tanpa math.js)');
t.cek('soal 35 — dingin(10, 7)', J.s35 === 28, String(J.s35));
t.cek('soal 36 — dingin(2, 35)', J.s36 === 10010, String(J.s36));
t.cek('soal 37 — banyaknya pasangan <X, Y>', J.pasang37.length === 3,
  J.pasang37.map((p) => `<${p[0]},${p[1]}>`).join(' '));
t.cek('soal 29 — x terkecil', J.x29 === 20269, String(J.x29));
t.cek('soal 30 — C[0] setelah ADUK', J.c0 === 31, String(J.c0));
t.cek('soal 31 — C[9] setelah RATA', J.c9 === 438, String(J.c9));
t.cek('akar digit 123456789', J.akarBesar === 9, String(J.akarBesar));
t.cek('rumus akar digit 1 + (n−1) mod 9 cocok dengan penjumlahan berulang',
  [...Array(2000)].every((_, i) => { const n = i + 1;
    let v = n; while (v > 9) v = panas(v);
    return v === 1 + (n - 1) % 9; }));
t.info('pasangan soal 37', J.pasang37.map((p) => `<${p[0]}, ${p[1]}>`).join(', '));
t.info('pemanggilan CAMPUR di RATA(997, 1018)', String(J.campur));

const ctx = await bangunModul('02-digit-sum');
t.cek('modul dibangun tanpa galat', ctx.galat.length === 0,
  ctx.galat.map((e) => e.message).join(' | '));

ctx.klik('dgo');
ctx.klik('dsolve24');
ctx.klik('dsolve26');
const da1 = ctx.el('da1').textContent;
const da2 = ctx.el('da2').textContent;
const da3 = ctx.el('da3').textContent;
const db1 = ctx.el('db1').textContent;
const db2 = ctx.el('db2').textContent;
const db3 = ctx.el('db3').textContent;
const badan = ctx.badan.textContent;

t.bagian('Bedah soal 2024 nomor 35-36 — pencocokan tepat');
cocok(t, da1, 'tiap kelipatan 7 dan digit sum-nya',
  /(\d+)\((\d+)\)/, (x) => Number(x[2]) === panas(Number(x[1])),
  'digit sum tiap kelipatan');
cocok(t, da1, 'jawaban soal 35', /Jawaban: (\d+)(?!\d)/, samaDengan(J.s35), String(J.s35));
cocok(t, da1, 'saringan modulo 9', /10 mod 9 = (\d+)(?!\d)/, samaDengan(10 % 9), String(10 % 9));
cocok(t, da1, 'satu-satunya yang perlu dicek',
  /perlu dicek → (\d+) saja/, samaDengan(J.s35), String(J.s35));
cocok(t, da2, 'jawaban soal 36 dan pemeriksaannya',
  /Jawaban: ([\d.]+) {3}\(= 35 × (\d+), digit sum (\d+)\)/,
  (x) => x[1] === angkaId(J.s36) && Number(x[2]) * 35 === J.s36
    && Number(x[3]) === panas(J.s36),
  `${angkaId(J.s36)} = 35 × ${J.s36 / 35}`);

t.bagian('Bedah soal 2024 nomor 37 — angka satu digit, pencocokan tepat');
cocok(t, da3, 'X wajib sama dengan digit sum 77',
  /digit sum 77 = (\d+)(?!\d)/, samaDengan(panas(77)), String(panas(77)));
cocok(t, da3, 'tiap baris dingin(14, Y)',
  /dingin\((\d+),(\d+)\) = +(\d+)(?!\d)/,
  (x) => Number(x[3]) === dingin(Number(x[1]), Number(x[2])),
  'semuanya = dingin(X, Y) dari naskah');
cocok(t, da3, 'jawaban soal 37',
  /Jawaban: (\d+) pasang(?!\d)/, samaDengan(J.pasang37.length), String(J.pasang37.length));
cocok(t, da3, 'tiap pasangan yang didaftar benar-benar menghasilkan 77',
  /<(\d+), (\d+)>/, (x) => dingin(Number(x[1]), Number(x[2])) === 77,
  'dingin(X, Y) = 77');
t.cek('semua pasangan pembanding ikut didaftar modul',
  J.pasang37.every(([X, Y]) => da3.includes(`<${X}, ${Y}>`)),
  J.pasang37.map((p) => `<${p[0]}, ${p[1]}>`).join(' '));

t.bagian('Bedah soal 2026 nomor 29-31 — pencocokan tepat');
cocok(t, db1, 'jawaban soal 29',
  /Jawaban: ([\d.]+)(?!\d)/, samaDengan(angkaId(J.x29)), angkaId(J.x29));
cocok(t, db1, 'banyaknya digit bahan',
  /\((\d+) digit\)/, samaDengan(String(J.x29).length), String(String(J.x29).length));
cocok(t, db2, 'jawaban soal 30',
  /Jawaban: C\[0\] = (\d+)(?!\d)/, samaDengan(J.c0), String(J.c0));
cocok(t, db3, 'jawaban soal 31',
  /Jawaban: C\[9\] = (\d+)(?!\d)/, samaDengan(J.c9), String(J.c9));
cocok(t, db3, 'bobot tiap k',
  /k=(\d+)\s+→ (\d+) × (\d+) = (\d+)(?!\d)/,
  (x) => { const k = Number(x[1]);
    return Number(x[2]) === k - X26 + 1 && Number(x[3]) === Y26 - k + 1
      && Number(x[4]) === Number(x[2]) * Number(x[3]); },
  'bobot = (k−997+1) × (1018−k+1)');
cocok(t, db3, 'total pemanggilan CAMPUR apa adanya',
  /Total pemanggilan CAMPUR kalau dijalankan apa adanya: (\d+)(?!\d)/,
  samaDengan(J.campur), String(J.campur));

t.bagian('Akar digit — angka satu digit, pencocokan tepat');
const drout = ctx.el('drout').textContent;
cocok(t, drout, 'cara 1 — jumlahkan berulang',
  /(\d+) → (\d+) → (\d+)(?!\d)/,
  (x) => panas(Number(x[1])) === Number(x[2]) && panas(Number(x[2])) === Number(x[3]),
  'tiap langkah = digit sum langkah sebelumnya');
cocok(t, drout, 'cara 2 — rumus langsung',
  /1 \+ \((\d+) − 1\) mod 9 = 1 \+ (\d+) = (\d+)(?!\d)/,
  (x) => { const n = Number(x[1]);
    return Number(x[2]) === (n - 1) % 9 && Number(x[3]) === 1 + (n - 1) % 9; },
  'akar digitnya 9');
t.cek('lab akar digit menyatakan dua cara sama', /✓ DUA CARA SAMA/.test(drout),
  drout.slice(0, 60));

t.bagian('Angka mati di prosa — pencocokan tepat');
cocok(t, badan, 'contoh akar digit 4587 di "Apa itu"',
  /4587 → (\d+) → (\d+) \+ (\d+) = (\d+)(?!\d)/,
  (x) => Number(x[1]) === J.jumlah4587
    && Number(x[2]) + Number(x[3]) === J.akar4587
    && Number(x[4]) === J.akar4587,
  `${J.jumlah4587} lalu ${J.akar4587}`);
const dout = ctx.el('dout').textContent;
cocok(t, dout, 'lab digit sum 4587',
  /= (\d+)\n\n4587 mod 9 = (\d+)\n(\d+) mod 9 = (\d+)/,
  (x) => Number(x[1]) === J.jumlah4587 && Number(x[3]) === J.jumlah4587
    && Number(x[2]) === 4587 % 9 && Number(x[4]) === J.jumlah4587 % 9,
  `${J.jumlah4587}, sisa ${4587 % 9}`);

const hasil = t.ringkas();
process.exit(hasil.gagal ? 1 : 0);
