/* Adu math.js dengan verify/14-pigeonhole.py — pada masukan ACAK */
import { M } from '../js/core/math.js';
let uji=0, gagal=0;
const cek=(n,s,k='')=>{ uji++; if(!s){ gagal++; if(gagal<6) console.log('  ✗ '+n+'  '+k); } };
const acak=(n)=>Math.floor(Math.random()*n);

/* rumus vs pencarian menyeluruh, susunan acak */
let diuji=0;
for(let p=0;p<500;p++){
  const n=1+acak(5), isi=[...Array(n)].map(()=>1+acak(6)), m=acak(5);
  const kasar=M.phKasar(isi,m);
  if(kasar===undefined) continue;
  diuji++;
  cek('dijamin vs menyeluruh', M.phDijamin(isi,m)===kasar, `${isi} m=${m}: ${M.phDijamin(isi,m)} vs ${kasar}`);
}
/* bentuk ekstrem */
cek('satu toples', M.phDijamin([5],1)===1);
cek('tiap toples satu butir', M.phDijamin([1,1,1],1)===3);
cek('isi tepat sebanyak syarat', M.phDijamin([3,3,3],3)===9);
cek('toples kurang dari syarat = mustahil', M.phDijamin([2,5,5],3)===null);
cek('toples KOSONG = mustahil', M.phDijamin([5,0,5],1)===null, String(M.phDijamin([5,0,5],1)));
cek('angka negatif = mustahil', M.phDijamin([-3,5],1)===null);
cek('syarat nol = 0', M.phDijamin([4,4],0)===0);
cek('daftar kosong = mustahil', M.phDijamin([],1)===null);
cek('sangat timpang', M.phDijamin([1,100],1)===101);

/* hanya yang terkecil yang berpengaruh */
let berubah=0, coba=0;
for(let p=0;p<600;p++){
  const isi=[...Array(2+acak(5))].map(()=>1+acak(9));
  const m=1+acak(Math.min(...isi));
  const kecil=Math.min(...isi);
  const besar=isi.map((v,i)=>v>kecil?i:-1).filter(i=>i>=0);
  if(besar.length<2) continue;
  const i=besar[acak(besar.length)], j=besar[acak(besar.length)];
  if(i===j) continue;
  const geser=Math.min(isi[i]-kecil,3);
  if(geser<=0) continue;
  const d=isi.slice(); d[i]-=geser; d[j]+=geser;
  if(Math.min(...d)!==kecil) continue;
  coba++;
  if(M.phDijamin(d,m)!==M.phDijamin(isi,m)) berubah++;
}
cek('menggeser butir antar toples besar tidak mengubah jawaban', berubah===0, String(berubah));
cek('percobaannya cukup banyak', coba>100, String(coba));

/* dijamin vs mungkin */
for(let p=0;p<300;p++){
  const n=1+acak(5), isi=[...Array(n)].map(()=>1+acak(6)), m=1+acak(Math.min(...[...Array(n)].map(()=>1),1));
  cek('mungkin = banyak toples x syarat', M.phMungkin(isi,1)===isi.length);
}
cek('nomor 17 mungkin 7, dijamin 31', M.phMungkin([5,5,5,5,5,5,5],1)===7 && M.phDijamin([5,5,5,5,5,5,5],1)===31);

/* jawaban soal asli */
const C17=[5,5,5,5,5,5,5];
const C18=[...Array(100)].map((_,i)=>10*(i+1));
cek('nomor 17 = 31', M.phDijamin(C17,1)===31, String(M.phDijamin(C17,1)));
cek('nomor 18 = 50495', M.phDijamin(C18,5)===50495, String(M.phDijamin(C18,5)));
cek('total nomor 18 = 50.500', C18.reduce((a,b)=>a+b,0)===50500);
cek('total lewat rumus deret', C18.reduce((a,b)=>a+b,0)===10*(100*101/2));
const trip=M.phSusunan(25,20,3,1);
cek('nomor 19 = 21 susunan', trip.length===21, String(trip.length));
cek('semua susunan ber-terkecil 6', trip.every(t=>Math.min(...t)===6));
cek('tiap susunan berjumlah 25', trip.every(t=>t.reduce((a,b)=>a+b,0)===25));

/* mesin capit */
const capit=M.phCapit({boneka:16,bola:4,mobil:7,puzzle:2},5,2);
cek('mesin capit 20 tarikan', capit.tarikan===20, String(capit.tarikan));
cek('paling sial 19 tarikan', capit.terburuk===19);
cek('dua kombinasi yang mungkin', capit.sasaran.length===2, String(capit.sasaran.length));
cek('bukti paling sial 9 boneka 4 bola 4 mobil 2 puzzle',
    capit.bukti.boneka===9 && capit.bukti.bola===4 && capit.bukti.mobil===4 && capit.bukti.puzzle===2,
    JSON.stringify(capit.bukti));

/* ruang pencarian */
cek('ruang nomor 17 = 279.936', M.phRuang(C17)===279936n, String(M.phRuang(C17)));
cek('ruang nomor 18 lebih dari 100 digit', String(M.phRuang(C18)).length>100,
    String(M.phRuang(C18)).length+' digit');

console.log(`\nadu math.js vs Python: ${uji} pemeriksaan, ${gagal} gagal  (${diuji} susunan diadu menyeluruh)`);
