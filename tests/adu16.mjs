/* Tiap angka yang tertulis di kartu drill dihitung ULANG dari math.js.
   Kalau kartunya mengklaim angka, angkanya harus benar. */
import { M } from '../js/core/math.js';
import { BANK, KATEGORI } from '../js/core/kartu.js';

let uji=0, gagal=0;
const cek=(n,s,k='')=>{ uji++; if(!s){ gagal++; console.log('  ✗ '+n+'  '+k); } };
const punya = (potongan, nilai) => {
  const kartu = BANK.find(k => (k.q+' '+k.why).includes(potongan));
  if(!kartu){ cek('kartu memuat "'+potongan+'"', false, '(kartu tidak ditemukan)'); return; }
  const bentuk=[String(nilai), Number(nilai).toLocaleString('id-ID')];
  cek(`"${potongan.slice(0,42)}" → ${nilai}`,
      bentuk.some(b=>kartu.why.includes(b)), 'why: '+kartu.why.slice(0,80));
};

/* 01 Josephus */
punya('2(n−p)+1', 2);
cek('Josephus K=2 untuk 100 = 73', M.jos2(100)===73, String(M.jos2(100)));

/* 02 Digit Sum */
punya('Isi 9 sebanyak mungkin', 299);
cek('bilangan terkecil berjumlah digit 20 = 299', M.kecilDigitSum(20)===299n, String(M.kecilDigitSum(20)));
cek('akar digit rumusnya 1 + (n-1) mod 9', M.digitalRoot(9999)===1+((9999-1)%9));

/* 03 FPB & Totient */
punya('FPB(48, 18)', 6);
cek('FPB(48,18) = 6', M.gcd(48,18)===6);
punya('12 × 18 ÷ 6', 36);
cek('KPK(12,18) = 36', 12*18/M.gcd(12,18)===36);
punya('(3+1)(2+1)(1+1)', 24);
cek('pembagi 360 = 24', Object.values(M.faktorPrima(360)).reduce((a,e)=>a*(e+1),1)===24,
    String(Object.values(M.faktorPrima(360)).reduce((a,e)=>a*(e+1),1)));
cek('360 = 2^3 x 3^2 x 5', JSON.stringify(M.faktorPrima(360))==='{"2":3,"3":2,"5":1}',
    JSON.stringify(M.faktorPrima(360)));

/* 04 Frobenius */
punya('3×5−3−5', 7);
cek('Frobenius(3,5) = 7', M.frobenius(3,5).largest===7);
cek('7 memang tidak bisa dibentuk dari 3 dan 5', M.bisaBentuk(7,3,5)===false);
punya('(4−1)(7−1)/2', 9);
cek('cacah gagal (4,7) = 9', M.frobenius(4,7).count===9, String(M.frobenius(4,7).count));
punya('5×8−5−8', 27);
cek('Frobenius(5,8) = 27', M.frobenius(5,8).largest===27);
cek('27 tidak bisa dibentuk dari 5 dan 8', M.bisaBentuk(27,5,8)===false);
cek('28 sudah bisa', M.bisaBentuk(28,5,8)===true);
cek('FPB(6,9) = 3, tidak koprima', M.gcd(6,9)===3 && M.frobenius(6,9).ok===false);
cek('FPB(6,10) = 2', M.gcd(6,10)===2);

/* 05 Doubling */
punya('⌊2^(n−1) ÷ 3⌋', 682);
cek('mandirC00(12) = 682', M.mandirC00(12)===682n, String(M.mandirC00(12)));
cek('tm memakai ganjil-genap banyaknya bit 1', M.tm(1000)===M.popcount(1000)%2);

/* 06 MAI */
punya('berputar tiap 66 langkah', 66);
cek('periode 2 pangkat sekian mod 67 = 66', M.ord2mod67()===66, String(M.ord2mod67()));
cek('2^1000 mod 67 lewat sisa 66', M.pow2mod67(1000)===M.pow2mod67(1000%66));

/* 07 TIGA */
punya('N ÷ 3 + 1 = 676', 676);
cek('TIGA(2025) = 676', M.tiga(2025)===676, String(M.tiga(2025)));
cek('2025 kelipatan 3', 2025%3===0);

/* 10 Euler */
punya('8 ÷ 2 = 4', 4);
const R24=[['0','1'],['0','5'],['0','4'],['1','6'],['1','2'],['5','6'],
           ['5','7'],['4','7'],['4','3'],['2','6'],['2','3'],['3','7']];
cek('8 persimpangan berderajat 3 → 4 lintasan', M.eulerMinLintasan(R24)===4);
cek('derajatnya memang seragam 3', M.eulerTeratur(R24).derajat===3);
cek('dua segitiga terpisah butuh 2, walau derajatnya genap',
    M.eulerMinLintasan([['0','1'],['1','2'],['2','0'],['3','4'],['4','5'],['5','3']])===2);

/* 11 Kombinatorika */
punya('10⁴ − 9⁴', 3439);
cek('sandi 4 angka dengan minimal satu 7 = 3.439', M.kKomplemen(4,10).jawab===3439n);
punya('4! ÷ 2!', 12);
cek('BACA = 12', M.kPermutasiBerulang([2,1,1])===12n);
cek('tanpa memperhatikan kembar jadi 24', M.kFaktorial(4)===24n);
punya('(5−1)! = 24', 24);
cek('melingkar 5 orang = 24', M.kMelingkar(5)===24n);
punya('C(6,2) = 15', 15);
cek('bintang batang 4 kue 3 anak = 15', M.kBintangBatang(3,4)===15n);
punya('10 × 9 × 8 = 720', 720);
cek('P(10,3) = 720', M.kPermutasi(10,3)===720n);
punya('C(10,3) = 120', 120);
cek('C(10,3) = 120', M.kKombinasi(10,3)===120n);

/* 12 Prefix */
punya('N+1 saldo tapi cuma N sisa bagi', 1);
for(let p=0;p<200;p++){
  const N=1+Math.floor(Math.random()*10);
  const a=[...Array(N)].map(()=>Math.floor(Math.random()*40));
  const h=M.psHabisDibagi(a);
  cek('potongan habis dibagi N selalu ada',
      h!==null && a.slice(h.l-1,h.r).reduce((x,y)=>x+y,0)%N===0, String(a));
}

/* 13 DP */
punya('Yang benar 3 + 3', 2);
const koin=(target,pecahan)=>{ const d=new Array(target+1).fill(1e9); d[0]=0;
  for(let i=1;i<=target;i++) for(const c of pecahan) if(c<=i) d[i]=Math.min(d[i],d[i-c]+1);
  return d[target]; };
cek('pecahan 1,3,4 untuk 6 = 2 keping', koin(6,[1,3,4])===2, String(koin(6,[1,3,4])));
cek('cara serakah memberi 3 keping', (()=>{ let sisa=6,n=0;
  for(const c of [4,3,1]) while(sisa>=c){ sisa-=c; n++; } return n; })()===3);
const P1415=[[2,2,2,2,2,2,2,2,2,2],[3,3,3,3,3,3,3,3,3,3],[5,5,5,5,5,5,5,5,5,5]];
cek('serakah meleset di jadwal jeda 1,2,3',
    M.dpSerakah(P1415,[1,2,3],['T','O','K']).best!==M.dpJadwal(P1415,[1,2,3],['T','O','K']).best);
cek('dp[i-1-K] jadi dp[i-2] saat K=1', M.dpCool([3,7,2,8,5],1).best===M.dpRob([3,7,2,8,5]).best);

/* bentuk & bahasa kartu */
const terlarang=['simpul','DAG','traversal','in-degree','paritas','iteratif','berhingga','koefisien'];
BANK.forEach(k=>{
  const teks=k.q+' '+k.why;
  terlarang.forEach(w=>{
    cek(`kartu tidak memakai "${w}"`, !new RegExp('\\b'+w+'\\b','i').test(teks),
        k.q.slice(0,45));
  });
  cek('gcd ditulis FPB', !/\bgcd\b/.test(k.why), k.q.slice(0,45));
  cek('kategori dikenali', KATEGORI.includes(k.a), k.a);
  cek('punya topik dan tingkat', !!k.topik && [1,2,3].includes(k.tk), k.q.slice(0,45));
});

console.log(`\nadu kartu vs math.js: ${uji} pemeriksaan, ${gagal} gagal`);
