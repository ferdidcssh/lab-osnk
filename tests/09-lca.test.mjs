/* ============================================================
   UJI MODUL 09 — LCA
   Angka-angkanya dibuktikan verify/09-lca.py
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { M } from '../js/core/math.js';

siapkanDom();
const t = buatPencatat('09-lca');
const c = await bangunModul('09-lca');

periksaKontrak(t, c);
await periksaMesin(t, c);
periksaBahasa(t, c);
periksaSusunan(t, c);

/* pohon yang dipakai modul */
const ANAK = {A:['B','C','D'],B:['E','F'],C:['G','H','M'],D:['I'],E:['J','T'],F:['K'],
  G:['L'],H:['N'],I:['O','P'],J:['Q'],L:['R','U'],N:['S','Z'],O:['V'],Q:['W'],S:['Y'],U:['X']};
const induk={}; for(const a in ANAK) for(const b of ANAK[a]) induk[b]=a;
const HURUF=[...Array(26)].map((_,i)=>String.fromCharCode(65+i));

t.bagian('Jawaban soal OSN-K 2026 nomor 7');
c.klik('solve');
const s3 = c.teks('s3');
t.cek('string jawabannya BALIC', /BALIC/.test(s3), s3.slice(0, 90));
[['F','T','B'],['N','O','A'],['R','U','L'],['I','V','I'],['X','H','C']].forEach(([a,b,g]) =>
  t.cek(`LCA(${a}, ${b}) = ${g}`, M.lca(induk,a,b)===g, M.lca(induk,a,b)));

t.bagian('Lab 1 · telusuri dua jalur');
c.isi('a','X'); c.isi('b','H'); c.klik('go');
const out = c.teks('out');
t.cek('menampilkan jalur X lengkap', /A → C → G → L → U → X/.test(out));
t.cek('menyebut awalan yang sama A C', /awalan yang sama: A C/.test(out));
t.cek('menyimpulkan LCA = C', /LCA\(X, H\) = C/.test(out));
t.cek('menghitung batu berbeda = 6', /= 6$/m.test(out), out.split('\n').pop());
c.isi('a','Q'); c.isi('b','Q'); c.klik('go');
t.cek('kasus tepi: dua batu sama tidak merusak lab', /LCA\(Q, Q\) = Q/.test(c.teks('out')));

t.bagian('Lab 2 · trik dua jari');
c.isi('ta','X'); c.isi('tb','H'); c.klik('tgo');
const tout = c.teks('tout');
t.cek('trik X,H selesai dalam 4 langkah', /4 langkah/.test(tout));
t.cek('menyebut hemat 5 langkah', /Hemat 5 langkah/.test(tout));
t.cek('fase samakan lalu bareng terlihat', /samakan 1/.test(tout) && /bareng/.test(tout));
c.isi('ta','R'); c.isi('tb','R'); c.klik('tgo');
t.cek('kasus tepi: dua batu sama ditolak halus', /berbeda/.test(c.teks('tout')));

t.bagian('Lab 3 · jebakan gambar');
c.klik('psoal');
t.cek('susunan naskah menyorot M, T, Z', /M, T, dan Z/.test(c.teks('pout')));
const svgSoal = c.el('pviz').innerHTML;
c.klik('plapis');
const svgLapis = c.el('pviz').innerHTML;
t.cek('dua susunan menghasilkan gambar berbeda', svgSoal !== svgLapis);
t.cek('gambar memuat 26 lingkaran batu', (svgLapis.match(/<circle/g)||[]).length === 26,
  (svgLapis.match(/<circle/g)||[]).length + ' lingkaran');
t.cek('gambar memuat 25 panah', (svgLapis.match(/<line/g)||[]).length === 25,
  (svgLapis.match(/<line/g)||[]).length + ' garis');
t.cek('SVG memakai viewBox, bukan lebar tetap', /viewBox=/.test(svgLapis));
t.cek('penanda panah berawalan nama modul', /marker id="lca-pnh"/.test(svgLapis));

t.bagian('Uji sendiri');
c.klik('uall');
const uout = c.teks('uout');
t.cek('325 pasangan diuji', /325/.test(uout), uout.slice(0, 60));
t.cek('ketiga cara sepakat semuanya', /TIDAK ADA YANG MELESET/.test(uout));

t.bagian('Klaim angka yang tertulis di modul');
const soal=[['F','T'],['N','O'],['R','U'],['I','V'],['X','H']];
const panjang = soal.reduce((a,[x,y])=>a+M.lcaLangkahPanjang(induk,x,y),0);
const trik = soal.reduce((a,[x,y])=>a+M.lcaTrik(induk,x,y).langkah,0);
t.cek('cara panjang 42 langkah', panjang===42, String(panjang));
t.cek('cara trik 12 langkah', trik===12, String(trik));
t.cek('ada 75 pasangan yang LCA-nya salah satu hurufnya sendiri',
  HURUF.flatMap((a,i)=>HURUF.slice(i+1).map(b=>[a,b]))
    .filter(([a,b])=>[a,b].includes(M.lca(induk,a,b))).length===75);
t.cek('lapis terdalam = 6', Math.max(...HURUF.map(h=>M.lcaDalam(induk,h)))===6);
t.cek('langkah trik terburuk di pohon ini = 5',
  Math.max(...HURUF.flatMap((a,i)=>HURUF.slice(i+1).map(b=>M.lcaTrik(induk,a,b).langkah)))===5);

t.bagian('Klaim "titik terbaik selalu LCA" — sumber rumus terkuncinya');
let meleset=0, tunggal=0;
for(let i=0;i<26;i++) for(let j=i+1;j<26;j++){
  const a=HURUF[i], b=HURUF[j];
  for(const cara of ['dijumlah','berbeda']){
    const r=M.lcaTitikTerbaik(induk,HURUF,a,b,cara);
    if(r.titik!==M.lca(induk,a,b)) meleset++;
    if(cara==='dijumlah' && r.juara.length===1) tunggal++;
  }
}
t.cek('650 pencarian titik terbaik semuanya mendarat di LCA', meleset===0, String(meleset));
t.cek('titik terbaiknya tunggal pada semua 325 pasangan', tunggal===325, String(tunggal));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;

/* ---- syarat yang membuat modul ini gugur (verify/12-syarat-gugur.py) ---- */
const t2 = buatPencatat('09-lca · syarat gugur');
t2.bagian('Peringatan banyak induk');
const teks09 = c.badan.textContent;
t2.cek('modul memperingatkan syarat satu panah masuk', /TEPAT SATU panah masuk/.test(teks09));
t2.cek('memberi contoh terkecilnya', /tidak tunggal/.test(teks09));
const CONTOH = { x: ['a','b'], y: ['a','b'], a: [], b: [] };
t2.cek('contohnya benar: ada 2 leluhur terdekat',
  M.lcaSemuaTerdekat(CONTOH, 'x', 'y').join(',') === 'a,b',
  M.lcaSemuaTerdekat(CONTOH, 'x', 'y').join(','));
let jamak = 0;
for (let p = 0; p < 500; p++) {
  const n = 2 + Math.floor(Math.random() * 8), pre = {};
  for (let i = 0; i < n; i++) pre['v' + i] = i ? ['v' + Math.floor(Math.random() * i)] : [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
    if (M.lcaSemuaTerdekat(pre, 'v' + i, 'v' + j).length !== 1) jamak++;
}
t2.cek('di pohon biasa selalu tepat satu', jamak === 0, String(jamak));
t2.ringkas();
