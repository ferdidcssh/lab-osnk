/* ============================================================
   AUDIT GENERALISASI
   ------------------------------------------------------------
   Pertanyaannya: apakah rumus dan trik di modul 09, 10, dan 11
   berlaku untuk soal LAIN, bukan cuma soal OSN-K yang diunggah?

   Cara mengujinya: bangkitkan soal acak yang BENTUKNYA sama tapi
   angkanya berbeda, lalu adu tiap rumus dengan pencacahan
   menyeluruh. Termasuk bentuk yang sengaja aneh:
     - pohon acak, bukan pohon A-Z dari soal
     - peta dengan jalan ganda dan jalan yang memutar ke dirinya
       sendiri (Konigsberg sendiri punya jembatan ganda!)
     - kelompok berukuran ekstrem
   ============================================================ */
import { M } from '../js/core/math.js';

let uji = 0, gagal = 0;
const rusak = [];
const cek = (nama, syarat, ket = '') => {
  uji++;
  if (!syarat) { gagal++; if (rusak.length < 8) rusak.push(nama + '  ' + ket); }
};
const acak = (n) => Math.floor(Math.random() * n);

/* ============================================================
   09 · LCA — diuji pada POHON ACAK, bukan pohon A-Z soal 2026
   ============================================================ */
console.log('=== 09 · LCA pada pohon acak ===');
let pohonDiuji = 0, pasangDiuji = 0;
for (let putar = 0; putar < 300; putar++) {
  const n = 2 + acak(11);
  const titik = [...Array(n)].map((_, i) => 't' + i);
  const induk = {};
  for (let i = 1; i < n; i++) induk[titik[i]] = titik[acak(i)];   // pasti pohon
  pohonDiuji++;

  /* acuan: jalur ke akar, ambil awalan terpanjang yang sama */
  const jalurKasar = (v) => { const j = []; let x = v;
    while (x !== undefined) { j.push(x); x = induk[x]; } return j.reverse(); };
  const lcaKasar = (a, b) => { const ja = jalurKasar(a), jb = jalurKasar(b);
    let g = null;
    for (let i = 0; i < Math.min(ja.length, jb.length); i++) {
      if (ja[i] !== jb[i]) break; g = ja[i]; }
    return g; };

  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const a = titik[i], b = titik[j], benar = lcaKasar(a, b);
    pasangDiuji++;
    cek('lca', M.lca(induk, a, b) === benar, `${a},${b}`);
    cek('trik dua jari', M.lcaTrik(induk, a, b).lca === benar, `${a},${b}`);
    cek('jalur', M.lcaJalur(induk, a).join() === jalurKasar(a).join(), a);
    /* klaim rumus terkunci: titik awal terbaik SELALU LCA */
    const r = M.lcaTitikTerbaik(induk, titik, a, b, 'dijumlah');
    cek('titik terbaik = LCA', r.titik === benar && r.juara.length === 1,
        `${a},${b} -> ${r.titik} vs ${benar}, juara ${r.juara.length}`);
    const r2 = M.lcaTitikTerbaik(induk, titik, a, b, 'berbeda');
    cek('titik terbaik (cara hitung lain)', r2.titik === benar, `${a},${b}`);
  }
}
console.log(`  ${pohonDiuji} pohon acak, ${pasangDiuji} pasangan titik`);

/* bentuk ekstrem: rantai lurus, bintang, pohon sedalam mungkin */
const rantai = {}; for (let i = 1; i < 40; i++) rantai['n' + i] = 'n' + (i - 1);
cek('rantai 40 dalam: LCA ujung dan akar', M.lca(rantai, 'n39', 'n0') === 'n0');
cek('rantai: trik mendarat sama', M.lcaTrik(rantai, 'n39', 'n7').lca === 'n7');
const bintang = {}; for (let i = 1; i < 30; i++) bintang['d' + i] = 'pusat';
cek('bintang 30 daun: LCA dua daun = pusat', M.lca(bintang, 'd3', 'd29') === 'pusat');
cek('LCA titik dengan dirinya sendiri', M.lca(bintang, 'd3', 'd3') === 'd3');

/* ============================================================
   10 · EULER — diuji pada peta dengan JALAN GANDA dan JALAN MEMUTAR
   Ini yang paling saya curigai: soal Konigsberg aslinya punya
   jembatan ganda, tapi pembuktian modul 10 cuma memakai peta
   sederhana tanpa jalan ganda.
   ============================================================ */
console.log('\n=== 10 · Euler pada peta ganda & memutar ===');

/* pencarian menyeluruh: minimum lintasan yang memakai tiap ruas tepat sekali */
const kasarEuler = (ruas) => {
  const n = ruas.length;
  if (!n) return 0;
  const penuh = (1 << n) - 1, tetangga = {};
  ruas.forEach(([a, b], i) => {
    (tetangga[a] = tetangga[a] || []).push([b, i]);
    (tetangga[b] = tetangga[b] || []).push([a, i]);
  });
  const ingat = new Map();
  const f = (topeng, v) => {
    if (topeng === penuh) return 0;
    const k = topeng + '|' + v;
    if (ingat.has(k)) return ingat.get(k);
    ingat.set(k, n + 1);
    let hasil = n + 1;
    if (v === null) {
      for (let i = 0; i < n; i++) if (!((topeng >> i) & 1))
        hasil = Math.min(hasil, 1 + f(topeng | (1 << i), ruas[i][1]),
                                1 + f(topeng | (1 << i), ruas[i][0]));
    } else {
      hasil = f(topeng, null);
      for (const [w, i] of (tetangga[v] || [])) if (!((topeng >> i) & 1))
        hasil = Math.min(hasil, f(topeng | (1 << i), w));
    }
    ingat.set(k, hasil);
    return hasil;
  };
  return f(0, null);
};

let petaGanda = 0, petaMemutar = 0, petaBiasa = 0;
for (let putar = 0; putar < 500; putar++) {
  const n = 2 + acak(4);                       // 2..5 persimpangan
  const banyak = 1 + acak(8);                  // 1..8 ruas
  const ruas = [];
  for (let i = 0; i < banyak; i++) {
    const a = acak(n);
    let b = acak(n);
    if (putar % 5 === 0 && Math.random() < 0.3) b = a;     // jalan memutar
    ruas.push([String(a), String(b)]);
  }
  const kunci = ruas.map(([a, b]) => [a, b].sort().join('|'));
  const adaGanda = new Set(kunci).size !== kunci.length;
  const adaMemutar = ruas.some(([a, b]) => a === b);
  if (adaMemutar) petaMemutar++; else if (adaGanda) petaGanda++; else petaBiasa++;

  const rumus = M.eulerMinLintasan(ruas);
  const benar = kasarEuler(ruas);
  cek('euler minimum lintasan', rumus === benar,
      `${JSON.stringify(ruas)} rumus=${rumus} benar=${benar}`);

  /* susunannya juga harus memakai tiap ruas tepat sekali */
  const rute = M.eulerSusun(ruas);
  const dipakai = [];
  rute.forEach((r) => { for (let i = 0; i < r.length - 1; i++)
    dipakai.push([r[i], r[i + 1]].sort().join('|')); });
  cek('euler susunan memakai tiap ruas sekali',
      dipakai.length === ruas.length &&
      JSON.stringify(dipakai.sort()) === JSON.stringify(kunci.slice().sort()),
      `${JSON.stringify(ruas)} -> ${JSON.stringify(rute)}`);
  cek('banyaknya rute = rumus', rute.length === rumus,
      `${JSON.stringify(ruas)} ${rute.length} vs ${rumus}`);
}
console.log(`  ${petaBiasa} peta biasa, ${petaGanda} peta berjalan ganda, ${petaMemutar} peta berjalan memutar`);

/* Konigsberg asli: 4 daratan, 7 jembatan, dua pasang jembatan ganda */
const KONIGSBERG = [['A','B'],['A','B'],['A','C'],['A','C'],['A','D'],['B','D'],['C','D']];
cek('Konigsberg: 4 daratan ganjil semua', M.eulerGanjil(KONIGSBERG).length === 4,
    M.eulerGanjil(KONIGSBERG).join(''));
cek('Konigsberg: butuh 2 lintasan, jadi mustahil sekali jalan',
    M.eulerMinLintasan(KONIGSBERG) === 2, String(M.eulerMinLintasan(KONIGSBERG)));
cek('Konigsberg: pencarian menyeluruh setuju',
    kasarEuler(KONIGSBERG) === 2, String(kasarEuler(KONIGSBERG)));

/* ============================================================
   11 · KOMBINATORIKA — jangkauan yang jauh lebih lebar
   ============================================================ */
console.log('\n=== 11 · Kombinatorika di jangkauan lebar ===');
const daftarLangsung = (uk) => {
  let hasil = 0n;
  const telusur = (i, ada) => {
    if (i === uk.length) { if (ada) hasil += 1n; return; }
    telusur(i + 1, ada);
    for (let j = 0; j < uk[i]; j++) telusur(i + 1, true);
  };
  telusur(0, false);
  return hasil;
};
let kelDiuji = 0;
for (let putar = 0; putar < 400; putar++) {
  const k = 1 + acak(7);
  const uk = [...Array(k)].map(() => 1 + acak(8));
  if (uk.reduce((a, b) => a * (b + 1), 1) > 300000) continue;
  kelDiuji++;
  cek('trik +1 lalu -1', M.kSetidaknyaSatu(uk) === daftarLangsung(uk), uk.join(','));
  cek('trik = penjumlahan panjang', M.kSetidaknyaSatu(uk) === M.kRinciPanjang(uk).total, uk.join(','));
}
const fakt = (n) => { let h = 1n; for (let i = 2n; i <= BigInt(n); i++) h *= i; return h; };
for (let n = 0; n <= 60; n++) for (let r = 0; r <= n + 2; r++) {
  const P = r > n ? 0n : fakt(n) / fakt(n - r);
  const C = r > n ? 0n : fakt(n) / (fakt(r) * fakt(n - r));
  cek(`P(${n},${r})`, M.kPermutasi(n, r) === P);
  cek(`C(${n},${r})`, M.kKombinasi(n, r) === C);
}
/* sapuan pada pola dan teks acak, termasuk pola berulang */
const sapuanKasar = (teks, pola) => {
  let h = 0n;
  const telusur = (i, j) => {
    if (j === pola.length) { h += 1n; return; }
    for (let x = i; x < teks.length; x++) if (teks[x] === pola[j]) telusur(x + 1, j + 1);
  };
  telusur(0, 0);
  return h;
};
for (let putar = 0; putar < 200; putar++) {
  const huruf = 'ABC';
  const teks = [...Array(acak(11))].map(() => huruf[acak(3)]).join('');
  const pola = [...Array(1 + acak(3))].map(() => huruf[acak(3)]).join('');
  cek('sapuan satu lintasan', M.kSapuan(teks, pola).hasil === sapuanKasar(teks, pola),
      `${teks} / ${pola}`);
}
console.log(`  ${kelDiuji} susunan kelompok acak, P dan C sampai n = 60, 200 pola sapuan acak`);

/* ============================================================
   12 · PREFIX SUM — larik acak, termasuk negatif, nol, kosong
   ============================================================ */
console.log('\n=== 12 · Prefix sum & difference array pada larik acak ===');
let larikDiuji = 0, rentangDiuji = 0;
for (let putar = 0; putar < 400; putar++) {
  const n = acak(13);
  const a = [...Array(n)].map(() => acak(19) - 9);     // sengaja pakai negatif dan nol
  const P = M.psTabel(a);
  larikDiuji++;
  cek('panjang tabel bantu', P.length === n + 1);
  for (let l = 1; l <= n; l++) for (let r = l; r <= n; r++) {
    rentangDiuji++;
    cek('jumlah rentang', M.psJumlah(P, l, r) === a.slice(l - 1, r).reduce((x, y) => x + y, 0),
        `${a} [${l}..${r}]`);
  }
  cek('selisih lalu prefix kembali semula',
      JSON.stringify(M.psTabel(M.psSelisih(a)).slice(1)) === JSON.stringify(a), String(a));

  const N = 1 + acak(12), op = [];
  for (let q = 0; q < acak(6); q++) {
    const l = 1 + acak(N), r = l + acak(N - l + 1);
    op.push({ l, r, v: acak(11) - 5 });
  }
  cek('trik dua tanda',
      JSON.stringify(M.psTerapkan(N, op).hasil) === JSON.stringify(M.psTerapkanKasar(N, op).hasil),
      JSON.stringify(op));
}
/* dua dimensi */
for (let putar = 0; putar < 60; putar++) {
  const b = 1 + acak(5), k = 1 + acak(5);
  const g = [...Array(b)].map(() => [...Array(k)].map(() => acak(19) - 9));
  const P = M.psTabel2D(g);
  for (let r1 = 1; r1 <= b; r1++) for (let r2 = r1; r2 <= b; r2++)
  for (let c1 = 1; c1 <= k; c1++) for (let c2 = c1; c2 <= k; c2++) {
    let langsung = 0;
    for (let i = r1 - 1; i < r2; i++) for (let j = c1 - 1; j < c2; j++) langsung += g[i][j];
    cek('kotak 2D', M.psKotak(P, r1, c1, r2, c2) === langsung, `${r1},${c1},${r2},${c2}`);
  }
}
/* bentuk ekstrem */
cek('larik kosong', JSON.stringify(M.psTabel([])) === '[0]');
cek('rentang kosong = 0', M.psJumlah(M.psTabel([1, 2, 3]), 3, 2) === 0);
cek('di luar batas = null', M.psJumlah(M.psTabel([1, 2, 3]), 0, 3) === null);
cek('operasi terbalik diabaikan',
    JSON.stringify(M.psTerapkan(5, [{ l: 4, r: 2, v: 9 }]).hasil) === JSON.stringify([0, 0, 0, 0, 0]));
/* subbarisan habis dibagi N, pada larik acak */
for (let putar = 0; putar < 400; putar++) {
  const N = 1 + acak(12), a = [...Array(N)].map(() => acak(50));
  const h = M.psHabisDibagi(a);
  cek('subbarisan habis dibagi N selalu ada', h !== null, String(a));
  if (h) cek('jumlahnya benar habis dibagi N',
    a.slice(h.l - 1, h.r).reduce((x, y) => x + y, 0) % N === 0, String(a));
}
console.log(`  ${larikDiuji} larik acak, ${rentangDiuji} rentang, plus papan 2D dan bentuk ekstrem`);

/* ============================================================
   13 · DYNAMIC PROGRAMMING — soal acak, bukan tabel soal OSN-K
   ============================================================ */
console.log('\n=== 13 · DP penjadwalan pada soal acak ===');
const NAMA13 = ['T', 'O', 'K'];
let soalDiuji = 0, trikDiuji = 0, trikGugur = 0, serakahMeleset = 0;
for (let putar = 0; putar < 400; putar++) {
  const N = 1 + acak(8);
  const jeda = [acak(5), acak(5), acak(5)];
  const poin = [...Array(3)].map(() => [...Array(N)].map(() => acak(10)));
  const dp = M.dpJadwal(poin, jeda, NAMA13);

  const kasar = M.dpJadwalKasar(poin, jeda, 8);
  if (kasar.best !== null) {
    soalDiuji++;
    cek('dp vs mencoba semua jadwal', kasar.best === dp.best,
        `N=${N} jeda=${jeda} ${dp.best} vs ${kasar.best}`);
  }
  /* jadwalnya harus sah dan benar-benar bernilai segitu */
  const nilai = dp.jadwal.reduce((a, x, i) =>
    x === 'I' ? a : a + poin[NAMA13.indexOf(x)][i], 0);
  cek('nilai jadwal cocok', nilai === dp.best, `${dp.jadwal.join('')} ${nilai} vs ${dp.best}`);
  const pakai = [-1e9, -1e9, -1e9]; let sah = true;
  dp.jadwal.forEach((x, i) => { if (x === 'I') return;
    const j = NAMA13.indexOf(x);
    if (i - pakai[j] <= jeda[j]) sah = false; pakai[j] = i; });
  cek('jadwal mematuhi masa jeda', sah, dp.jadwal.join(''));

  /* trik dua terbesar: sah untuk jeda 1, harus gugur di luar itu */
  trikDiuji++;
  cek('trik dua terbesar pada jeda 1',
      M.dpDuaTerbesar(poin).best === M.dpJadwal(poin, [1, 1, 1], NAMA13).best,
      JSON.stringify(poin));
  if (jeda.join() !== '1,1,1' && M.dpDuaTerbesar(poin).best !== dp.best) trikGugur++;
  if (M.dpSerakah(poin, jeda, NAMA13).best !== dp.best) serakahMeleset++;
}
cek('trik memang gugur di luar syaratnya', trikGugur > 0, String(trikGugur));
cek('serakah memang sering meleset', serakahMeleset > 0, String(serakahMeleset));
/* bentuk ekstrem */
cek('nol hari', M.dpJadwal([[], [], []], [1, 1, 1], NAMA13).best === 0);
cek('masa jeda 0', M.dpJadwal([[5, 5], [1, 1], [1, 1]], [0, 0, 0], NAMA13).best === 10);
cek('masa jeda lebih panjang daripada N',
    M.dpJadwal([[1, 1, 1], [1, 1, 1], [1, 1, 1]], [99, 99, 99], NAMA13).best === 3);
cek('semua poin nol', M.dpJadwal([[0, 0], [0, 0], [0, 0]], [1, 1, 1], NAMA13).best === 0);
/* rumus satu jenis, termasuk angka negatif */
const kasarSatu = (v, K) => { let best = 0;
  for (let m = 0; m < (1 << v.length); m++) { const idx = [];
    for (let i = 0; i < v.length; i++) if (m >> i & 1) idx.push(i);
    let ok = true;
    for (let j = 0; j + 1 < idx.length; j++) if (idx[j + 1] - idx[j] <= K) ok = false;
    if (ok) best = Math.max(best, idx.reduce((a, i) => a + v[i], 0)); }
  return best; };
for (let putar = 0; putar < 400; putar++) {
  const n = acak(12), K = 1 + acak(4);
  const v = [...Array(n)].map(() => acak(21) - 10);
  cek('dpCool', M.dpCool(v, K).best === kasarSatu(v, K), `${v} K=${K}`);
  if (K === 1) cek('dpRob', M.dpRob(v).best === kasarSatu(v, 1), String(v));
}
console.log(`  ${soalDiuji} soal diadu pencarian menyeluruh, ${trikDiuji} uji trik, `
  + `trik gugur ${trikGugur}x, serakah meleset ${serakahMeleset}x (memang seharusnya)`);

/* ============================================================
   14 · SKENARIO TERBURUK — susunan toples acak, bukan angka soal
   ============================================================ */
console.log('\n=== 14 · Skenario terburuk pada susunan acak ===');
let phDiuji = 0, phMustahil = 0, phGeser = 0, phCoba = 0;
for (let putar = 0; putar < 600; putar++) {
  const n = 1 + acak(5);
  const isi = [...Array(n)].map(() => acak(7));      // 0 ikut, supaya mustahil teruji
  const m = acak(5);
  const jawab = M.phDijamin(isi, m);
  if (jawab === null) {
    phMustahil++;
    cek('mustahil memang beralasan',
        isi.length === 0 || isi.some((x) => x < 0) || (m > 0 && isi.some((x) => x < m)),
        String(isi) + ' m=' + m);
    continue;
  }
  const kasar = M.phKasar(isi, m);
  if (kasar === undefined) continue;
  phDiuji++;
  cek('dijamin vs mendaftar semua keadaan', kasar === jawab,
      `${isi} m=${m}: ${jawab} vs ${kasar}`);
  cek('dijamin tidak pernah lebih kecil daripada mungkin',
      m === 0 || jawab >= M.phMungkin(isi, m), `${isi} m=${m}`);
  cek('dijamin tidak melebihi total isi',
      m === 0 || jawab <= isi.reduce((a, b) => a + b, 0) + m, `${isi} m=${m}`);
}
/* cuma toples terkecil yang berpengaruh */
for (let putar = 0; putar < 600; putar++) {
  const isi = [...Array(2 + acak(5))].map(() => 1 + acak(9));
  const kecil = Math.min(...isi);
  const besar = isi.map((v, i) => v > kecil ? i : -1).filter((i) => i >= 0);
  if (besar.length < 2) continue;
  const i = besar[0], j = besar[besar.length - 1];
  const d = isi.slice(), pindah = Math.min(d[i] - kecil, 3);
  if (pindah <= 0) continue;
  d[i] -= pindah; d[j] += pindah;
  if (Math.min(...d) !== kecil) continue;
  phCoba++;
  if (M.phDijamin(d, 1) !== M.phDijamin(isi, 1)) phGeser++;
}
cek('cuma toples terkecil yang berpengaruh', phGeser === 0, String(phGeser));
/* bentuk ekstrem */
cek('satu toples', M.phDijamin([5], 1) === 1);
cek('toples kosong = mustahil', M.phDijamin([5, 0, 5], 1) === null);
cek('angka negatif = mustahil', M.phDijamin([-3, 5], 1) === null);
cek('daftar kosong = mustahil', M.phDijamin([], 1) === null);
cek('syarat nol = 0', M.phDijamin([4, 4], 0) === 0);
cek('isi tepat sebanyak syarat', M.phDijamin([3, 3, 3], 3) === 9);
cek('sangat timpang', M.phDijamin([1, 100], 1) === 101);
cek('mesin capit 20 tarikan',
    M.phCapit({ boneka: 16, bola: 4, mobil: 7, puzzle: 2 }, 5, 2).tarikan === 20);
console.log(`  ${phDiuji} susunan diadu menyeluruh, ${phMustahil} susunan mustahil ditolak, `
  + `${phCoba} percobaan geser butir`);

/* ============================================================
   15 · KOTAK BERSARANG — daftar acak, dan bentuk yang membuat gugur
   ============================================================ */
console.log('\n=== 15 · Kotak bersarang pada daftar acak ===');
let dwDiuji = 0, dwTolak = 0, dwBalok = 0, dwGugur = 0, dwBerubah = 0;
for (let putar = 0; putar < 500; putar++) {
  const n = 1 + acak(8);
  const sisi = [...Array(n)].map(() => acak(6));        // 0 ikut, supaya tidak sah teruji
  const jawab = M.dwMin(sisi);
  if (jawab === null) {
    dwTolak++;
    cek('penolakan memang beralasan', sisi.some((x) => x <= 0), String(sisi));
    continue;
  }
  dwDiuji++;
  cek('rumus kembar vs pencocokan', jawab === M.dwMinUmum(sisi.map((x) => [x])),
      `${sisi}: ${jawab} vs ${M.dwMinUmum(sisi.map((x) => [x]))}`);
  const anti = M.dwAntirantai(sisi.map((x) => [x]));
  cek('Dilworth: rantai = antirantai', anti && anti.ukuran === jawab, String(sisi));
  /* susunannya harus sah */
  const r = M.dwSusun(sisi);
  cek('banyak tumpukan = rumus', r.length === jawab, String(sisi));
  cek('tiap tumpukan menaik tegas',
      r.every((x) => x.every((v, i) => i === 0 || x[i - 1] < v)), JSON.stringify(r));
  cek('semua kotak terpakai',
      JSON.stringify(r.flat().sort((a, b) => a - b))
      === JSON.stringify(sisi.slice().sort((a, b) => a - b)), JSON.stringify(r));
}
/* ukuran sisinya tidak berpengaruh */
for (let putar = 0; putar < 400; putar++) {
  const k = 1 + acak(6);
  const cacah = [...Array(k)].map(() => 1 + acak(6));
  const A = [], B = [];
  cacah.forEach((n, i) => { for (let j = 0; j < n; j++) { A.push(1 + i * 3); B.push(700 + i * 61); } });
  if (M.dwMin(A) !== M.dwMin(B)) dwBerubah++;
}
cek('ukuran sisi tidak berpengaruh', dwBerubah === 0, String(dwBerubah));
/* kotak balok: rumus kembar HARUS gugur, dan Dilworth HARUS tetap berlaku */
for (let putar = 0; putar < 400; putar++) {
  const n = 2 + acak(5);
  const kotak = [...Array(n)].map(() => [1 + acak(4), 1 + acak(4)]);
  const benar = M.dwMinUmum(kotak);
  const cb = {};
  kotak.forEach((k) => { const s = k.join(','); cb[s] = (cb[s] || 0) + 1; });
  dwBalok++;
  if (Math.max(...Object.values(cb)) !== benar) dwGugur++;
  const anti = M.dwAntirantai(kotak);
  cek('Dilworth berlaku untuk balok', anti && anti.ukuran === benar, JSON.stringify(kotak));
}
cek('rumus kembar memang gugur untuk balok', dwGugur > 0, String(dwGugur));
/* bentuk ekstrem */
cek('tidak ada kotak', M.dwMin([]) === 0);
cek('satu kotak', M.dwMin([7]) === 1);
cek('semua sama', M.dwMin([4, 4, 4, 4]) === 4);
cek('semua berbeda', M.dwMin([1, 2, 3, 4, 5]) === 1);
cek('sisi nol tidak sah', M.dwMin([2, 0, 2]) === null);
cek('sisi negatif tidak sah', M.dwMin([-5, 3]) === null);
cek('dua balok saling tak muat', M.dwMinUmum([[2, 5], [5, 2]]) === 2);
cek('lebar 1 sama dengan rumus biasa', M.dwLebar([1, 1, 2], 1) === M.dwMin([1, 1, 2]));
console.log(`  ${dwDiuji} daftar diadu, ${dwTolak} daftar tidak sah ditolak, `
  + `${dwGugur} dari ${dwBalok} susunan balok membuat rumus kembar gugur`);

console.log('\n' + '='.repeat(58));
console.log(`TOTAL: ${uji} pemeriksaan, ${gagal} gagal`);
if (rusak.length) { console.log('\nYANG RUSAK:'); rusak.forEach((r) => console.log('  ✗ ' + r)); }
process.exitCode = gagal ? 1 : 0;
