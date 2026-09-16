/* Adu math.js dengan verify/15-dilworth.py — pada susunan ACAK */
import { M } from '../js/core/math.js';
let uji=0, gagal=0;
const cek=(n,s,k='')=>{ uji++; if(!s){ gagal++; if(gagal<6) console.log('  ✗ '+n+'  '+k); } };
const acak=(n)=>Math.floor(Math.random()*n);

/* rumus kubus vs pencocokan umum, susunan acak */
for(let p=0;p<600;p++){
  const n=1+acak(8), sisi=[...Array(n)].map(()=>1+acak(5));
  const umum=M.dwMinUmum(sisi.map(x=>[x]));
  cek('rumus kembar vs pencocokan', M.dwMin(sisi)===umum, `${sisi}: ${M.dwMin(sisi)} vs ${umum}`);
  const anti=M.dwAntirantai(sisi.map(x=>[x]));
  cek('Dilworth: rantai = antirantai', anti && anti.ukuran===umum, `${sisi}`);
}
/* bentuk ekstrem */
cek('tidak ada kotak', M.dwMin([])===0);
cek('satu kotak', M.dwMin([7])===1);
cek('semua sama', M.dwMin([4,4,4,4])===4);
cek('semua berbeda', M.dwMin([1,2,3,4,5])===1);
cek('kotak bersisi NOL = tidak sah', M.dwMin([2,0,2])===null, String(M.dwMin([2,0,2])));
cek('sisi NEGATIF = tidak sah', M.dwMin([-5,3,3])===null);
cek('sisi pecahan tetap jalan', M.dwMin([1.5,1.5,2])===2);
cek('bukan larik = null', M.dwMin('abc')===null);

/* ukuran sisinya tidak berpengaruh */
let berubah=0;
for(let p=0;p<600;p++){
  const k=1+acak(6), cacah=[...Array(k)].map(()=>1+acak(6));
  const a=[...Array(k)].map((_,i)=>1+i*3), b=[...Array(k)].map((_,i)=>1000+i*77);
  const A=[], B=[];
  cacah.forEach((c,i)=>{ for(let j=0;j<c;j++){ A.push(a[i]); B.push(b[i]); } });
  if(M.dwMin(A)!==M.dwMin(B)) berubah++;
}
cek('ukuran sisi tidak berpengaruh', berubah===0, String(berubah));

/* susunan rantainya sah */
for(let p=0;p<300;p++){
  const n=1+acak(9), sisi=[...Array(n)].map(()=>1+acak(5));
  const r=M.dwSusun(sisi);
  cek('banyak rantai = rumus', r.length===M.dwMin(sisi), `${sisi}`);
  cek('tiap rantai menaik tegas',
      r.every(x=>x.every((v,i)=>i===0||x[i-1]<v)), JSON.stringify(r));
  cek('semua kotak terpakai',
      JSON.stringify(r.flat().sort((a,b)=>a-b))===JSON.stringify(sisi.slice().sort((a,b)=>a-b)),
      JSON.stringify(r));
}

/* balok: rumus kembar GUGUR */
let gugurBalok=0;
for(let p=0;p<400;p++){
  const n=2+acak(5);
  const kotak=[...Array(n)].map(()=>[1+acak(4),1+acak(4)]);
  const benar=M.dwMinUmum(kotak);
  const c={}; kotak.forEach(k=>{ const s=k.join(','); c[s]=(c[s]||0)+1; });
  if(Math.max(...Object.values(c))!==benar) gugurBalok++;
  const anti=M.dwAntirantai(kotak);
  cek('Dilworth berlaku untuk balok', anti && anti.ukuran===benar, JSON.stringify(kotak));
}
cek('rumus kembar gugur untuk balok', gugurBalok>0, String(gugurBalok));
cek('dua balok saling tak muat', M.dwMinUmum([[2,5],[5,2]])===2);
cek('balok bersarang tetap 1', M.dwMinUmum([[1,1],[2,2],[3,3]])===1);

/* jawaban soal asli */
const S17=[1,1,2,2,2,3,3,4,6,8];
const TABEL19=[[2,5],[3,12],[5,19],[8,4],[13,15],[21,7],[34,8]];
const S19=TABEL19.flatMap(([u,c])=>Array(c).fill(u));
cek('nomor 17 = 3', M.dwMin(S17)===3, String(M.dwMin(S17)));
cek('nomor 17 lawan pencocokan', M.dwMinUmum(S17.map(x=>[x]))===3);
cek('total nomor 19 = 70 kotak', S19.length===70, String(S19.length));
cek('nomor 19 = 19', M.dwMin(S19)===19, String(M.dwMin(S19)));
cek('nomor 19 lawan pencocokan', M.dwMinUmum(S19.map(x=>[x]))===19);
/* nomor 18: semua berbeda -> selalu 1 */
let bukanSatu=0;
for(let p=0;p<300;p++){
  const n=1+acak(9), pakai=new Set();
  while(pakai.size<n) pakai.add(1+acak(200));
  if(M.dwMin([...pakai])!==1) bukanSatu++;
}
cek('nomor 18 BENAR: semua beda selalu 1', bukanSatu===0, String(bukanSatu));
/* Fibonacci itu umpan */
const PALSU=[[1,5],[2,12],[3,19],[4,4],[5,15],[6,7],[7,8]].flatMap(([u,c])=>Array(c).fill(u));
cek('deret Fibonacci tidak berpengaruh', M.dwMin(PALSU)===M.dwMin(S19));

/* varian: boleh memuat lebih dari satu */
cek('nomor 17 kalau boleh 2 kotak = 2', M.dwLebar(S17,2)===2, String(M.dwLebar(S17,2)));
cek('nomor 19 kalau boleh 2 kotak = 10', M.dwLebar(S19,2)===10, String(M.dwLebar(S19,2)));
cek('lebar 1 sama dengan rumus biasa', M.dwLebar(S17,1)===M.dwMin(S17));

console.log(`\nadu math.js vs Python: ${uji} pemeriksaan, ${gagal} gagal`);
