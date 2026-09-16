/* ============================================================
   MESIN HITUNG
   Setiap fungsi di sini mereplikasi kode asli soal OSN-K dan
   sudah diverifikasi terhadap simulasi langsung.
   Jangan mengubah tanpa menjalankan ulang skrip di verify/.
   ============================================================ */

export const M = {
  josSim(n,k){ const p=[...Array(n)].map((_,i)=>i+1); const ord=[]; let i=0;
    while(p.length>1){ i=(i+k-1)%p.length; ord.push(p[i]); p.splice(i,1); }
    return {survivor:p[0], order:ord}; },
  pow2le(n){ let p=1; while(p*2<=n) p*=2; return p; },
  jos2(n){ const p=M.pow2le(n); return 2*(n-p)+1; },
  josRec(n,k){ let r=0; for(let i=2;i<=n;i++) r=(r+k)%i; return r+1; },
  digits(n){ return String(n).split('').map(Number); },
  digitSum(n){ return M.digits(n).reduce((a,b)=>a+b,0); },
  altSum(n){ return M.digits(n).reverse().reduce((a,d,i)=>a+(i%2?-d:d),0); },
  gcdSteps(a,b){ const s=[]; while(b!==0){ s.push([a,b,a%b]); [a,b]=[b,a%b]; } return {g:a,steps:s}; },


  gcd(a,b){ while(b){ [a,b]=[b,a%b]; } return a; },
  mandir(n){ let s="0"; for(let i=0;i<n;i++) s+=s.split('').map(c=>c==='0'?'1':'0').join(''); return s; },
  /* --- Rekursi doubling / Thue-Morse (dibuktikan verify/05-doubling.py) --- */
  /* Karakter ke-i (indeks mulai 0) dari MANDIR, tanpa membangun stringnya.
     Kuncinya: hitung banyak angka 1 pada biner i, lalu lihat ganjil/genapnya. */
  tm(i){ return M.popcount(i) % 2; },
  /* Banyaknya "00" di dalam MANDIR(n). Mengembalikan BigInt:
     2^(n-1)/3 melewati batas ketelitian angka biasa mulai n = 54. */
  mandirC00(n){ return n<1 ? 0n : (2n**BigInt(n-1))/3n; },
  /* Potongan MANDIR mulai indeks awal (0-based) sepanjang panjang,
     dihitung langsung lewat trik biner — tidak membangun string raksasa. */
  mandirPotong(awal,panjang){ let s='';
    for(let i=awal;i<awal+panjang;i++) s+=M.tm(i);
    return s; },
  mai(x,y,z){ let e=1n, two=2n, m=67n, yy=BigInt(y); let base=2n;
    while(yy>0n){ if(yy&1n) e=e*base%m; base=base*base%m; yy>>=1n; }
    return Number((BigInt(x)+e*BigInt(z))%m); },
  ord2mod67(){ let o=1,t=2%67; while(t!==1){ t=t*2%67; o++; } return o; },
  /* --- Doubling pada angka / MAI (dibuktikan verify/06-mai.py) --- */
  /* 2^y mod 67 untuk y sebesar apa pun. Karena 2^66 = 1 (mod 67),
     cukup lihat sisa bagi y dengan 66. */
  pow2mod67(y){ const r=((y%66)+66)%66; let v=1;
    for(let i=0;i<r;i++) v=v*2%67;
    return v; },
  /* Simulasi rekursif sungguhan — dipakai untuk membuktikan rumusnya.
     Hanya untuk y kecil, karena butuh 2^y pemanggilan. */
  maiSim(x,y,z){ if(y===0) return (x+z)%67;
    return M.maiSim(M.maiSim(x,y-1,z), y-1, z); },
  /* Banyaknya pemanggilan dasar MAI(a,0,z) saat MAI(x,y,z) dijalankan.
     Pemanggilan dasar ke-k punya argumen pertama (x + k*z) mod 67. */
  maiHitungPanggilan(x,y,z,a){ const n=Math.pow(2,y);
    if(z%67===0) return (a%67===x%67) ? n : 0;
    let inv=1; for(let i=1;i<67;i++) if((z%67)*i%67===1){ inv=i; break; }
    const k0=(((a-x)%67+67)%67)*inv%67;
    return k0>=n ? 0 : Math.floor((n-1-k0)/67)+1; },
  tiga(n){ return n%3 ? 1 : n/3+1; },
  /* --- Rekursi bercabang / TIGA (dibuktikan verify/07-tiga.py) --- */
  /* Simulasi rekursif sungguhan — dipakai untuk membuktikan rumusnya.
     Hanya untuk n kecil karena pemanggilannya menumpuk. */
  tigaSim(n){ if(n<=1) return 1;
    if(n%3===0) return M.tigaSim(n-1)+M.tigaSim(n-3);
    if(n%3===1) return M.tigaSim(n-2);
    return M.tigaSim(n-3); },
  /* Jumlah TIGA(1) + ... + TIGA(n) */
  tigaJumlah(n){ if(n<1) return 0; const K=Math.floor(n/3); return n + K*(K+1)/2; },
  /* Banyaknya k di 1..n yang TIGA(k) = 1 */
  tigaCacah1(n){ return n<1 ? 0 : n - Math.floor(n/3); },
  /* Jalur lompatan dari n sampai berhenti. Tiap langkah:
     {dari, ke, sisa, lompat, sampingan} — sampingan = nilai 1 yang
     disumbang cabang TIGA(N-1) pada kelipatan 3. */
  tigaJalur(n, batas = 30){ const j=[]; let x=n;
    while(x>1 && j.length<batas){
      const sisa=x%3;
      if(sisa===0) j.push({dari:x, ke:x-3, sisa:0, lompat:3, sampingan:true});
      else if(sisa===1) j.push({dari:x, ke:x-2, sisa:1, lompat:2, sampingan:false});
      else j.push({dari:x, ke:x-3, sisa:2, lompat:3, sampingan:false});
      x=j[j.length-1].ke;
    }
    return j; },
  /* Banyaknya pemanggilan kalau TIGA ditelusuri apa adanya (tanpa mengingat hasil) */
  tigaPanggilan(n, memo = {}){ if(n in memo) return memo[n];
    let r;
    if(n<=1) r=1;
    else if(n%3===0) r=1+M.tigaPanggilan(n-1,memo)+M.tigaPanggilan(n-3,memo);
    else if(n%3===1) r=1+M.tigaPanggilan(n-2,memo);
    else r=1+M.tigaPanggilan(n-3,memo);
    memo[n]=r; return r; },
  prefix(a){ const b=[0]; a.forEach((v,i)=>b.push(b[i]+v)); return b; },
  dpRob(v){ let a=0,b=0; const t=[]; for(const x of v){ const nb=Math.max(b,a+x); t.push({skip:b,take:a+x,best:nb}); [a,b]=[b,nb]; } return {best:b,trace:t}; },
  dpCool(v,K){ const n=v.length, dp=new Array(n+1).fill(0), tr=[];
    for(let i=1;i<=n;i++){ const take=v[i-1]+dp[Math.max(0,i-1-K)]; dp[i]=Math.max(dp[i-1],take); tr.push({skip:dp[i-1],take,best:dp[i]}); }
    return {best:dp[n],trace:tr}; },
  frobenius(a,b){ const g=M.gcd(a,b);
    if(g!==1) return {ok:false,g};
    return {ok:true,g:1,largest:a*b-a-b,count:(a-1)*(b-1)/2}; },
  /* --- Frobenius / Chicken McNugget (dibuktikan verify/04-frobenius-tambahan.py) --- */
  /* Bisakah n ditakar pas dengan gayung a dan b, dipakai berapa kali pun?
     x cukup dicoba sampai b-1 saja: sisa (n - a*x) mod b sudah berulang
     setelah itu. Batas ini yang menjaga lab tetap cepat sampai N besar. */
  bisaBentuk(n,a,b){ if(n<0||a<1||b<1) return false;
    if(n===0) return true;
    const batas=Math.min(Math.floor(n/a), b-1);
    for(let x=0;x<=batas;x++) if((n-a*x)%b===0) return true;
    return false; },
  /* Banyaknya k di 1..m yang tidak bisa dibentuk, khusus FPB(A,B)=1.
     Pada tiap kelas sisa mod A, bilangan terkecil yang bisa dibentuk
     adalah B*r — semua yang di bawahnya pada kelas itu tidak bisa. */
  frobeniusCacahKoprima(m,A,B){ if(m<1||A===1||B===1) return 0;
    let t=0;
    for(let r=0;r<A;r++){ const besar=B*r;
      const hi=Math.floor((besar-1)/A);
      const lo=Math.max(1, -Math.floor((m-besar)/A));
      if(hi>=lo) t+=hi-lo+1; }
    return t; },
  /* Banyaknya n di 1..N yang TIDAK bisa dibentuk dari a dan b.
     Benar untuk N berapa pun, termasuk N kecil — tidak memakai
     pintasan (A-1)(B-1)/2 yang cuma berlaku setelah N besar. */
  frobeniusCacah(N,a,b){ if(N<1) return 0;
    const d=M.gcd(a,b), A=a/d, B=b/d;
    return (N-Math.floor(N/d)) + M.frobeniusCacahKoprima(Math.floor(N/d),A,B); },
  levels(pre){
    // state: undefined = belum disentuh, 1 = sedang ditelusuri, 2 = selesai.
    // Simpul yang terlibat siklus DITULIS sebagai NaN ke lv, supaya pemanggil
    // bisa mendeteksinya lewat Object.entries(lv).filter(isNaN).
    const lv={}, state={};
    const f=v=>{
      if(state[v]===2) return lv[v];
      if(state[v]===1) return NaN;          // ketemu simpul yang sedang ditelusuri = siklus
      state[v]=1;
      let m=0, siklus=false;
      for(const p of (pre[v]||[])){
        const r=f(p);
        if(isNaN(r)) siklus=true; else m=Math.max(m,r);
      }
      state[v]=2;
      lv[v] = siklus ? NaN : m+1;
      return lv[v];
    };
    for(const v of Object.keys(pre)) f(v);
    return lv; },
  /* --- Level & Topological Sort (dibuktikan verify/08-toposort.py) --- */
  /* Kupas berlapis: buang berulang semua simpul yang prasyaratnya sudah habis.
     Nomor lapis == level. Mengembalikan null bila ada siklus. */
  topoKupas(pre){ const sisa=new Set(Object.keys(pre)), lapis=[];
    while(sisa.size){
      const siap=[...sisa].filter(v => (pre[v]||[]).every(p => !sisa.has(p)));
      if(!siap.length) return null;                 // ada siklus
      lapis.push(siap.sort());
      siap.forEach(v => sisa.delete(v));
    }
    return lapis; },
  /* Semua leluhur v — prasyarat langsung maupun tidak langsung. */
  topoLeluhur(pre, v, acc){ acc = acc || new Set();
    for(const p of (pre[v]||[])) if(!acc.has(p)){ acc.add(p); M.topoLeluhur(pre,p,acc); }
    return acc; },
  /* Posisi paling awal v bisa ditaruh, kalau dikerjakan satu per satu. */
  topoPosisiAwal(pre, v){ return M.topoLeluhur(pre,v).size + 1; },
  /* Waktu selesai tiap kegiatan bila punya durasi (jalur kritis). */
  topoSelesai(pre, durasi){ const f={};
    const g=(v)=>{ if(v in f) return f[v];
      const p=(pre[v]||[]).map(g);
      f[v]=(durasi[v]||0)+(p.length?Math.max(...p):0);
      return f[v]; };
    for(const v of Object.keys(pre)) g(v);
    return f; },
  /* Rangkaian kegiatan yang menentukan total waktu. */
  topoJalurKritis(pre, durasi){ const f=M.topoSelesai(pre,durasi);
    const kunci=Object.keys(f); if(!kunci.length) return [];
    let v=kunci.reduce((a,b)=> f[b]>f[a]?b:a);
    const j=[v];
    while((pre[v]||[]).length){
      v=pre[v].reduce((a,b)=> f[b]>f[a]?b:a); j.push(v);
    }
    return j.reverse(); },
  /* Satu urutan sah (kalau ada). Mengembalikan null bila bersiklus. */
  topoUrutan(pre){ const L=M.topoKupas(pre); return L ? L.flat() : null; },
  /* --- LCA / leluhur bersama terdekat (dibuktikan verify/09-lca.py) ---
     Pohon diwakili objek `induk`: induk[anak] = orang tuanya.
     Akar tidak punya entri, jadi induk[akar] === undefined.          */
  /* Jalur dari akar sampai v, misal ['A','C','G','L','U','X'] */
  lcaJalur(induk, v){ const j=[]; let x=v, n=0;
    while(x!==undefined && x!==null && n<1000){ j.push(x); x=induk[x]; n++; }
    return j.reverse(); },
  /* Kedalaman v, akar berkedalaman 1 */
  lcaDalam(induk, v){ return M.lcaJalur(induk,v).length; },
  /* Leluhur bersama terdekat: awalan terpanjang yang sama dari dua jalur */
  lca(induk, a, b){ const ja=M.lcaJalur(induk,a), jb=M.lcaJalur(induk,b);
    let g=null, n=Math.min(ja.length,jb.length);
    for(let i=0;i<n;i++){ if(ja[i]!==jb[i]) break; g=ja[i]; }
    return g; },
  /* Trik: samakan lapis dulu, baru naikkan dua-duanya bareng.
     Mengembalikan jejaknya supaya bisa digambar langkah demi langkah. */
  lcaTrik(induk, a, b){ let x=a, y=b; const jejak=[];
    let dx=M.lcaDalam(induk,x), dy=M.lcaDalam(induk,y);
    while(dx>dy){ jejak.push({fase:'samakan', sisi:'a', dari:x, ke:induk[x]}); x=induk[x]; dx--; }
    while(dy>dx){ jejak.push({fase:'samakan', sisi:'b', dari:y, ke:induk[y]}); y=induk[y]; dy--; }
    let putar=0;
    while(x!==y && putar<1000){
      jejak.push({fase:'bareng', dariA:x, keA:induk[x], dariB:y, keB:induk[y]});
      x=induk[x]; y=induk[y]; putar++; }
    return { lca:x, jejak, langkah:jejak.length }; },
  /* Banyak langkah kalau jalur kedua huruf ditulis penuh sampai akar */
  lcaLangkahPanjang(induk, a, b){ return M.lcaDalam(induk,a)+M.lcaDalam(induk,b); },
  /* Semua keturunan s, termasuk s sendiri */
  lcaKeturunan(induk, s){ const hasil=new Set([s]);
    let berubah=true, putar=0;
    while(berubah && putar<1000){ berubah=false; putar++;
      for(const k of Object.keys(induk))
        if(!hasil.has(k) && hasil.has(induk[k])){ hasil.add(k); berubah=true; } }
    return hasil; },
  /* Total batu yang dikunjungi dua robot yang berangkat dari s.
     cara 'dijumlah' = batu bersama dihitung dua kali (bunyi soal),
     cara 'berbeda'  = hanya batu yang berlainan.
     null berarti s tidak bisa mencapai keduanya. */
  lcaKunjungan(induk, s, a, b, cara){
    const bisa=M.lcaKeturunan(induk,s);
    if(!bisa.has(a) || !bisa.has(b)) return null;
    const d=M.lcaDalam(induk,s);
    const pa=M.lcaJalur(induk,a).slice(d-1), pb=M.lcaJalur(induk,b).slice(d-1);
    if(cara==='berbeda') return new Set([...pa,...pb]).size;
    return pa.length+pb.length; },
  /* Batu awal terbaik menurut definisi soal, dicari dengan mencoba semua.
     Dipakai untuk MEMBUKTIKAN bahwa jawabannya memang LCA. */
  lcaTitikTerbaik(induk, semua, a, b, cara){
    let terbaik=null, nilai=Infinity, juara=[];
    for(const s of semua){ const v=M.lcaKunjungan(induk,s,a,b,cara);
      if(v===null) continue;
      if(v<nilai){ nilai=v; terbaik=s; juara=[s]; }
      else if(v===nilai) juara.push(s); }
    return { titik:terbaik, nilai, juara }; },
  /* --- Lintasan Euler (dibuktikan verify/10-euler.py) ---
     `ruas` adalah daftar pasangan, misal [['0','1'], ['1','2']].       */
  eulerDerajat(ruas){ const d={};
    for(const [a,b] of ruas){ d[a]=(d[a]||0)+1; d[b]=(d[b]||0)+1; }
    return d; },
  eulerGanjil(ruas){ const d=M.eulerDerajat(ruas);
    return Object.keys(d).filter(v=>d[v]%2===1).sort(); },
  /* Kelompokkan ruas menurut bagian yang saling terhubung. */
  eulerKomponen(ruas){ const tetangga={};
    for(const [a,b] of ruas){ (tetangga[a]=tetangga[a]||new Set()).add(b);
                              (tetangga[b]=tetangga[b]||new Set()).add(a); }
    const belum=new Set(Object.keys(tetangga)), hasil=[];
    while(belum.size){
      const awal=belum.values().next().value; belum.delete(awal);
      const blok=new Set([awal]), antre=[awal];
      while(antre.length){ const v=antre.shift();
        for(const w of (tetangga[v]||[])) if(!blok.has(w)){ blok.add(w); belum.delete(w); antre.push(w); } }
      hasil.push(ruas.filter(([a,b])=>blok.has(a)&&blok.has(b)));
    }
    return hasil; },
  /* Minimum banyaknya lintasan: max(1, ganjil/2) TIAP BAGIAN, lalu dijumlah.
     Menjumlahkan per bagian itu yang sering terlupa — kalau petanya
     terpisah jadi dua, satu lintasan tidak akan pernah cukup. */
  eulerMinLintasan(ruas){ if(!ruas.length) return 0;
    return M.eulerKomponen(ruas).reduce((t,blok)=>
      t + Math.max(1, M.eulerGanjil(blok).length/2), 0); },
  /* 'sirkuit' = bisa satu putaran kembali ke awal,
     'lintasan' = bisa sekali jalan tapi beda tempat berhenti,
     'pecah'    = butuh lebih dari satu lintasan,
     'terpisah' = petanya sendiri tidak nyambung. */
  eulerJenis(ruas){ if(!ruas.length) return 'kosong';
    if(M.eulerKomponen(ruas).length>1) return 'terpisah';
    const g=M.eulerGanjil(ruas).length;
    return g===0 ? 'sirkuit' : g===2 ? 'lintasan' : 'pecah'; },
  /* Apakah semua persimpangan punya jumlah jalan yang sama?
     Kalau ya, satu persimpangan saja sudah mewakili semuanya. */
  eulerTeratur(ruas){ const d=M.eulerDerajat(ruas), n=Object.values(d);
    if(!n.length) return {teratur:false};
    const sama=n.every(x=>x===n[0]);
    return {teratur:sama, derajat:n[0], banyakTitik:n.length,
            semuaGanjil: sama && n[0]%2===1}; },
  /* Susun lintasannya sungguhan, cara Hierholzer:
     pasangkan titik ganjil, tambah ruas bayangan, cari satu putaran penuh,
     lalu potong putarannya tepat di ruas bayangan. */
  eulerSusun(ruas){ if(!ruas.length) return [];
    const hasil=[];
    for(const blok of M.eulerKomponen(ruas)){
      const ganjil=M.eulerGanjil(blok);
      const bayangan=[]; for(let i=0;i<ganjil.length;i+=2) bayangan.push([ganjil[i],ganjil[i+1]]);
      const kerja=[...blok,...bayangan], ib=new Set();
      for(let i=blok.length;i<kerja.length;i++) ib.add(i);
      const tetangga={};
      kerja.forEach(([a,b],i)=>{ (tetangga[a]=tetangga[a]||[]).push([b,i]);
                                 (tetangga[b]=tetangga[b]||[]).push([a,i]); });
      const pakai=new Array(kerja.length).fill(false);
      const mulai = bayangan.length ? bayangan[0][0] : kerja[0][0];
      const tumpuk=[[mulai,null]], putaran=[];
      let aman=0;
      while(tumpuk.length && aman++<20000){
        const [v]=tumpuk[tumpuk.length-1];
        let maju=null;
        for(const [w,i] of (tetangga[v]||[])) if(!pakai[i]){ maju=[w,i]; break; }
        if(maju===null) putaran.push(tumpuk.pop());
        else { pakai[maju[1]]=true; tumpuk.push(maju); }
      }
      putaran.reverse();
      /* Putarannya tertutup. Kalau dipotong di ruas bayangan tanpa
         menggeser dulu, potongan pertama dan terakhir sebenarnya satu
         rute yang sama — dan hasilnya kelebihan satu rute. Jadi
         putarannya digeser dulu supaya berakhir di ruas bayangan. */
      const urut=[];
      for(let i=1;i<putaran.length;i++)
        urut.push({dari:putaran[i-1][0], ke:putaran[i][0], lewat:putaran[i][1]});
      let r=-1;
      for(let i=0;i<urut.length;i++) if(ib.has(urut[i].lewat)){ r=i; break; }
      const geser = r<0 ? urut : urut.slice(r+1).concat(urut.slice(0,r+1));
      if(!geser.length) continue;
      let jalan=[geser[0].dari];
      for(const u of geser){
        if(ib.has(u.lewat)){ if(jalan.length>1) hasil.push(jalan); jalan=[u.ke]; }
        else jalan.push(u.ke);
      }
      if(jalan.length>1) hasil.push(jalan);
    }
    return hasil; },
  /* Baca daftar ruas dari teks: satu baris satu ruas, "0-1" atau "0 1". */
  eulerBaca(teks){ const ruas=[], tolak=[];
    teks.split('\n').forEach((baris,i)=>{ const t=baris.trim(); if(!t) return;
      const p=t.split(/[-\s,]+/).map(x=>x.trim()).filter(Boolean);
      if(p.length===2) ruas.push([p[0],p[1]]); else tolak.push({baris:i+1, teks:t});
    });
    return {ruas, tolak}; },
  /* --- Kombinatorika (dibuktikan verify/11-kombinatorika.py) ---
     Semua memakai BigInt. Alasannya: 21! sudah melewati batas angka
     biasa JavaScript, dan hasilnya diam-diam meleset tanpa peringatan. */
  kFaktorial(n){ if(n<0) return null; let h=1n;
    for(let i=2n;i<=BigInt(n);i++) h*=i; return h; },
  /* Urutan diperhitungkan. r > n memberi 0, bukan dipotong diam-diam. */
  kPermutasi(n,r){ if(r<0||n<0) return null; if(r>n) return 0n;
    let h=1n; for(let i=0;i<r;i++) h*=BigInt(n-i); return h; },
  /* Urutan tidak diperhitungkan. */
  kKombinasi(n,r){ if(r<0||n<0) return null; if(r>n) return 0n;
    r=Math.min(r,n-r); let h=1n;
    for(let i=0;i<r;i++){ h=h*BigInt(n-i)/BigInt(i+1); }
    return h; },
  /* Banyaknya kata berbeda dari huruf yang sebagiannya kembar. */
  kPermutasiBerulang(hitung){ const total=hitung.reduce((a,b)=>a+b,0);
    let h=M.kFaktorial(total);
    for(const c of hitung) h/=M.kFaktorial(c);
    return h; },
  /* Duduk melingkar: susunan yang tinggal diputar dianggap sama. */
  kMelingkar(n){ return n<1 ? 0n : M.kFaktorial(n-1); },
  /* Ambil r benda dari n jenis, tiap jenis boleh diambil berkali-kali. */
  kBintangBatang(jenis, ambil){ if(jenis<1) return 0n;
    return M.kKombinasi(ambil+jenis-1, jenis-1); },
  /* Aturan perkalian. Satu tahap berisi 0 pilihan membuat totalnya 0 —
     ini yang sering hilang kalau angka 0 disaring lebih dulu. */
  kKali(daftar){ let h=1n; for(const p of daftar) h*=BigInt(p); return h; },
  /* Tiap kelompok WAJIB mengirim tepat satu wakil. */
  kTepatSatuTiap(ukuran){ return M.kKali(ukuran); },
  /* Tiap kelompok mengirim paling banyak satu, dan totalnya minimal satu.
     Inilah trik "+1 lalu −1": tambahkan pilihan "tidak mengirim" ke tiap
     kelompok, kalikan semuanya, lalu buang satu kemungkinan kosong. */
  kSetidaknyaSatu(ukuran){ return M.kKali(ukuran.map(u=>u+1)) - 1n; },
  /* Cara panjangnya, dipakai untuk memperlihatkan bedanya:
     jumlahkan tiap kemungkinan "kelompok mana saja yang mengirim". */
  kRinciPanjang(ukuran){ const k=ukuran.length, suku=[];
    for(let topeng=1; topeng<(1<<k); topeng++){
      const pilih=[]; for(let i=0;i<k;i++) if((topeng>>i)&1) pilih.push(ukuran[i]);
      suku.push({pilih, nilai:M.kKali(pilih)});
    }
    return {suku, total:suku.reduce((a,s)=>a+s.nilai,0n)}; },
  /* "setidaknya satu X" pada susunan panjang L dari S lambang. */
  kKomplemen(L,S){ const total=BigInt(S)**BigInt(L), tanpa=BigInt(S-1)**BigInt(L);
    return {total, tanpa, jawab: total-tanpa}; },
  /* Berapa cara memilih huruf `pola` secara berurutan dari `teks`,
     boleh melompati huruf lain. Satu kali sapuan dari kiri. */
  kSapuan(teks, pola){ const dp=new Array(pola.length+1).fill(0n); dp[0]=1n;
    const jejak=[];
    for(const ch of teks){
      for(let j=pola.length-1;j>=0;j--) if(ch===pola[j]) dp[j+1]+=dp[j];
      jejak.push({huruf:ch, isi:[...dp]});
    }
    return {hasil:dp[pola.length], jejak}; },
  /* Segitiga Pascal sampai baris ke-n (baris 0 = [1]). */
  kPascal(n){ const b=[[1n]];
    for(let i=1;i<=n;i++){ const baris=[1n];
      for(let j=1;j<i;j++) baris.push(b[i-1][j-1]+b[i-1][j]);
      baris.push(1n); b.push(baris); }
    return b; },
  /* Kelompokkan benda yang saling terhubung — dipakai soal Pertemanan Ayam. */
  kKelompok(semua, pasangan){ const induk={};
    semua.forEach(x=>{ induk[x]=x; });
    const cari=(x)=>{ while(induk[x]!==x){ induk[x]=induk[induk[x]]; x=induk[x]; } return x; };
    for(const [a,b] of pasangan){ if(induk[a]===undefined||induk[b]===undefined) continue;
      induk[cari(a)]=cari(b); }
    const kel={};
    semua.forEach(x=>{ const a=cari(x); (kel[a]=kel[a]||[]).push(x); });
    return Object.values(kel).map(v=>v.sort()).sort((p,q)=>q.length-p.length||String(p).localeCompare(String(q))); },
  /* --- Tiga syarat yang membuat trik modul 09-11 gugur ---
     (dibuktikan verify/12-syarat-gugur.py) */
  /* Kalau satu titik boleh punya BANYAK induk, leluhur bersama terdekat
     bisa lebih dari satu. Fungsi ini mengembalikan semuanya. Di pohon
     biasa hasilnya selalu tepat satu. */
  lcaSemuaTerdekat(pre, a, b){
    const lel=(v)=>{ const acc=new Set(), isi=(x)=>{
      for(const p of (pre[x]||[])) if(!acc.has(p)){ acc.add(p); isi(p); } };
      isi(v); return acc; };
    const la=lel(a), lb=lel(b);
    la.add(a); lb.add(b);
    const bersama=[...la].filter(x=>lb.has(x));
    return bersama.filter(x=>!bersama.some(y=>y!==x && lel(y).has(x))).sort(); },
  /* Minimum lintasan pada gambar dengan jalan SATU ARAH.
     Bukan ganjil/2 — melainkan jumlah kelebihan panah keluar tiap titik. */
  eulerBerarah(ruas){ if(!ruas.length) return {min:0, tak:{}, lebih:0};
    const masuk={}, keluar={};
    for(const [a,b] of ruas){ keluar[a]=(keluar[a]||0)+1; masuk[b]=(masuk[b]||0)+1; }
    const titik=[...new Set([...Object.keys(masuk),...Object.keys(keluar)])].sort();
    const tak={}; let lebih=0;
    for(const v of titik){ const d=(keluar[v]||0)-(masuk[v]||0);
      if(d!==0) tak[v]=d;
      if(d>0) lebih+=d; }
    return {min:Math.max(1,lebih), tak, lebih, titik}; },
  /* Trik "+1 lalu −1" dengan SYARAT: pasangan tertentu tidak boleh
     dipilih bersamaan. Dicacah apa adanya — triknya memang gugur. */
  kBerlarangan(ukuran, larangan){
    const kunci=(i,j)=>i+':'+j;
    const lar=larangan.map(([p,q])=>[kunci(...p),kunci(...q)]);
    let hasil=0n;
    const telusur=(i, dipilih)=>{
      if(i===ukuran.length){ if(dipilih.length) hasil+=1n; return; }
      telusur(i+1, dipilih);
      for(let j=0;j<ukuran[i];j++){
        const k=kunci(i,j);
        if(lar.some(([p,q])=>(p===k&&dipilih.includes(q))||(q===k&&dipilih.includes(p)))) continue;
        telusur(i+1, [...dipilih,k]);
      }
    };
    telusur(0, []);
    return hasil; },
  /* --- Prefix Sum & Difference Array (dibuktikan verify/12-prefix.py) ---
     Kesepakatan indeks di seluruh modul 12: larik dibaca mulai 1,
     dan P[0] = 0. Ini yang dipakai silabus resmi TOKI, dan yang
     membuat rumus jumlah rentangnya tidak punya kasus khusus.       */
  /* Tabel bantu. Panjangnya n+1, bukan n. */
  psTabel(a){ const P=[0];
    for(const x of a) P.push(P[P.length-1]+x);
    return P; },
  /* Jumlah A[l..r], indeks mulai 1. Rentang kosong bernilai 0. */
  psJumlah(P,l,r){ if(l>r) return 0;
    if(l<1||r>P.length-1) return null;
    return P[r]-P[l-1]; },
  /* Berapa langkah cara apa adanya vs tabel bantu, untuk N dan Q. */
  psLangkah(N,Q,rentangRata){ const r=rentangRata===undefined?Math.ceil(N/2):rentangRata;
    return {kasar:r*Q, cepat:N+Q}; },
  /* Larik selisih: D[i] = A[i] - A[i-1], dengan A[0] dianggap 0. */
  psSelisih(a){ const D=[]; let lalu=0;
    for(const x of a){ D.push(x-lalu); lalu=x; }
    return D; },
  /* Terapkan operasi "tambah v ke posisi l..r" dengan menandai ujungnya saja.
     operasi: [{l, r, v}]. Mengembalikan larik akhir DAN larik penandanya. */
  psTerapkan(n, operasi){ const D=new Array(n+2).fill(0);
    let tanda=0;
    for(const {l,r,v} of operasi){
      if(l<1||r>n||l>r) continue;
      D[l]+=v; D[r+1]-=v; tanda+=2; }
    const hasil=[]; let jalan=0;
    for(let i=1;i<=n;i++){ jalan+=D[i]; hasil.push(jalan); }
    return {hasil, penanda:D.slice(1,n+1), tanda, langkah:tanda+n}; },
  /* Cara apa adanya — dipakai sebagai pembanding jujur di lab. */
  psTerapkanKasar(n, operasi){ const a=new Array(n+1).fill(0); let langkah=0;
    for(const {l,r,v} of operasi){
      if(l<1||r>n||l>r) continue;
      for(let i=l;i<=r;i++){ a[i]+=v; langkah++; } }
    return {hasil:a.slice(1), langkah}; },
  /* Tabel bantu dua dimensi. Ukurannya (b+1) x (k+1). */
  psTabel2D(g){ const b=g.length, k=b?g[0].length:0;
    const P=[...Array(b+1)].map(()=>new Array(k+1).fill(0));
    for(let i=1;i<=b;i++) for(let j=1;j<=k;j++)
      P[i][j]=g[i-1][j-1]+P[i-1][j]+P[i][j-1]-P[i-1][j-1];
    return P; },
  /* Jumlah isi kotak (r1,c1) sampai (r2,c2), indeks mulai 1.
     Suku terakhir WAJIB — tanpa itu pojok kiri atas terpotong dua kali. */
  psKotak(P,r1,c1,r2,c2){ if(r1>r2||c1>c2) return 0;
    return P[r2][c2]-P[r1-1][c2]-P[r2][c1-1]+P[r1-1][c1-1]; },
  /* Subbarisan berurutan yang jumlahnya habis dibagi N — selalu ada.
     Sebabnya: ada N+1 nilai tabel bantu tapi cuma N sisa bagi yang mungkin. */
  psHabisDibagi(a){ const N=a.length; if(!N) return null;
    const P=M.psTabel(a), lihat={};
    for(let i=0;i<=N;i++){ const s=((P[i]%N)+N)%N;
      if(s in lihat) return {l:lihat[s]+1, r:i, sisa:s};
      lihat[s]=i; }
    return null; },
  /* --- Dynamic Programming penjadwalan (dibuktikan verify/13-dp.py) ---
     Bentuk soal OSN-K 2026 nomor 14-16: N hari, tiap hari pilih TEPAT
     SATU dari beberapa jenis latihan atau istirahat. Tiap jenis punya
     masa jeda sendiri. poin[j][i] = poin jenis j pada hari i.        */
  /* DP penuh. Keadaan yang diingat: sisa larangan tiap jenis.
     Mengembalikan nilai terbaik, jadwalnya, dan banyaknya langkah. */
  dpJadwal(poin, jeda, nama){ const J=poin.length, N=J?poin[0].length:0;
    if(!N) return {best:0, jadwal:[], langkah:0};
    let kini=new Map([[new Array(J).fill(0).join(','), {nilai:0, jalan:[]}]]);
    let langkah=0;
    for(let i=0;i<N;i++){
      const nanti=new Map();
      for(const [kunci, {nilai, jalan}] of kini){
        const sisa=kunci.split(',').map(Number);
        const turun=sisa.map(s=>Math.max(0,s-1));
        langkah++;
        const kI=turun.join(',');
        if(!nanti.has(kI) || nanti.get(kI).nilai<nilai)
          nanti.set(kI, {nilai, jalan:[...jalan,'I']});
        for(let j=0;j<J;j++){
          langkah++;
          if(sisa[j]!==0) continue;
          const s2=turun.slice(); s2[j]=jeda[j];
          const k2=s2.join(','), v=nilai+poin[j][i];
          if(!nanti.has(k2) || nanti.get(k2).nilai<v)
            nanti.set(k2, {nilai:v, jalan:[...jalan, (nama&&nama[j])||String.fromCharCode(65+j)]});
        }
      }
      kini=nanti;
    }
    let best=-Infinity, jadwal=[];
    for(const {nilai, jalan} of kini.values())
      if(nilai>best){ best=nilai; jadwal=jalan; }
    return {best, jadwal, langkah}; },
  /* Coba SEMUA jadwal. Pembanding jujur — hanya untuk N kecil. */
  dpJadwalKasar(poin, jeda, batas=11){ const J=poin.length, N=J?poin[0].length:0;
    if(!N) return {best:0, langkah:0};
    if(N>batas) return {best:null, langkah:Math.pow(J+1,N)};
    const total=Math.pow(J+1,N);
    let best=0;
    for(let m=0;m<total;m++){
      let sisa=m, pakai=new Array(J).fill(-1e9), nilai=0, sah=true;
      for(let i=0;i<N;i++){
        const pilih=sisa%(J+1); sisa=Math.floor(sisa/(J+1));
        if(pilih===J) continue;
        if(i-pakai[pilih]<=jeda[pilih]){ sah=false; break; }
        pakai[pilih]=i; nilai+=poin[pilih][i];
      }
      if(sah && nilai>best) best=nilai;
    }
    return {best, langkah:total}; },
  /* TRIK dua terbesar. Sah HANYA kalau semua masa jeda = 1.
     Keadaannya menyusut jadi "kemarin ngapain", jadi tabelnya
     cuma (jenis+1) baris. Tiap kolom cukup dicari dua nilai
     terbesarnya sekali, lalu semua sel diisi tanpa membandingkan lagi. */
  dpDuaTerbesar(poin){ const J=poin.length, N=J?poin[0].length:0;
    if(!N) return {best:0, langkah:0, tabel:[]};
    const baris=[...poin, new Array(N).fill(0)];      // baris terakhir = istirahat
    let kolom=new Array(J+1).fill(0);
    const tabel=[]; let langkah=0;
    for(let i=0;i<N;i++){
      const urut=kolom.map((v,k)=>[v,k]).sort((a,b)=>b[0]-a[0]);
      const p1=urut[0][1], p2=urut[1][1];
      langkah+=J;
      const baru=kolom.map((_,j)=>{ langkah++;
        return baris[j][i] + (j!==p1 ? kolom[p1] : kolom[p2]); });
      tabel.push({kolom:baru.slice(), terbesar:p1, kedua:p2,
                  nilaiTerbesar:kolom[p1], nilaiKedua:kolom[p2]});
      kolom=baru;
    }
    return {best:Math.max(...kolom), langkah, tabel}; },
  /* Cara serakah: tiap hari ambil poin terbesar yang sedang boleh.
     BUKAN cara yang benar — disediakan untuk memperlihatkan kegagalannya. */
  dpSerakah(poin, jeda, nama){ const J=poin.length, N=J?poin[0].length:0;
    const pakai=new Array(J).fill(-1e9), jalan=[]; let total=0;
    for(let i=0;i<N;i++){
      const urut=[...Array(J).keys()].sort((a,b)=>poin[b][i]-poin[a][i]);
      let ambil=null;
      for(const j of urut) if(i-pakai[j]>jeda[j]){ ambil=j; break; }
      if(ambil===null){ jalan.push('I'); continue; }
      pakai[ambil]=i; total+=poin[ambil][i];
      jalan.push((nama&&nama[ambil])||String.fromCharCode(65+ambil));
    }
    return {best:total, jadwal:jalan}; },
  /* --- Pigeonhole & skenario terburuk (dibuktikan verify/14-pigeonhole.py) ---
     Bentuk soal OSN-K 2024 nomor 17-19: beberapa toples berisi sekian
     butir. Pengambil datang satu per satu, masing-masing mengambil satu
     butir mana pun. Minimal berapa pengambil supaya DIJAMIN tiap toples
     tersentuh minimal m kali.                                          */
  /* null = mustahil (ada toples yang isinya kurang dari syarat, termasuk
     toples kosong). Angka 0 di daftar TIDAK boleh disaring diam-diam —
     toples kosong membuat seluruh soalnya mustahil. */
  phDijamin(isi, m){ if(!isi.length) return null;
    if(isi.some(x=>x<0)) return null;
    if(m<=0) return 0;
    if(isi.some(x=>x<m)) return null;
    return isi.reduce((a,b)=>a+b,0) - Math.min(...isi) + m; },
  /* Minimal supaya syaratnya MUNGKIN terpenuhi — bukan dijamin.
     Ini jebakan utamanya: bunyinya mirip, jawabannya jauh berbeda. */
  phMungkin(isi, m){ if(!isi.length) return null;
    if(isi.some(x=>x<0)) return null;
    if(m<=0) return 0;
    if(isi.some(x=>x<m)) return null;
    return isi.length * m; },
  /* Pembanding jujur: daftarkan SEMUA keadaan pengambilan, cari yang
     paling banyak butirnya tapi syaratnya belum terpenuhi. Lambat. */
  phKasar(isi, m, batas=200000){ if(!isi.length) return null;
    if(isi.some(x=>x<0)) return null;
    if(m<=0) return 0;
    if(isi.some(x=>x<m)) return null;
    const ruang=isi.reduce((a,b)=>a*(b+1),1);
    if(ruang>batas) return undefined;                 // dilewati
    let terburuk=-1;
    const telusur=(i, ambil, jum)=>{
      if(i===isi.length){ if(!ambil.every(a=>a>=m)) terburuk=Math.max(terburuk,jum); return; }
      for(let a=0;a<=isi[i];a++) telusur(i+1, [...ambil,a], jum+a);
    };
    telusur(0, [], 0);
    return terburuk+1; },
  /* Berapa banyak keadaan yang harus diperiksa cara kasar. BigInt karena
     untuk soal 100 toples angkanya jauh melewati batas angka biasa. */
  phRuang(isi){ return isi.reduce((a,b)=>a*BigInt(b+1), 1n); },
  /* Soal balik: total butir diketahui, jawabannya diketahui — ada berapa
     susunan <A,B,C,...> yang mungkin? Dipakai OSN-K 2024 nomor 19. */
  phSusunan(total, jawab, banyakToples, m=1){
    const hasil=[];
    const telusur=(sisaToples, sisaTotal, kini)=>{
      if(sisaToples===1){
        if(sisaTotal<1) return;
        const c=[...kini, sisaTotal];
        if(M.phDijamin(c,m)===jawab) hasil.push(c);
        return; }
      for(let x=1;x<=sisaTotal-(sisaToples-1);x++)
        telusur(sisaToples-1, sisaTotal-x, [...kini,x]);
    };
    telusur(banyakToples, total, []);
    return hasil; },
  /* Mesin capit OSN-K 2023 nomor 19. stok = {jenis: banyaknya}.
     Butuh `orang` orang, tiap orang dapat `per` barang, dan semua orang
     harus dapat KOMBINASI JENIS yang sama. Cari tarikan paling sial. */
  phCapit(stok, orang, per){ const jenis=Object.keys(stok);
    const sasaran=[];
    if(per===2){
      for(const x of jenis) if(stok[x]>=orang*2) sasaran.push({[x]:orang*2});
      for(let i=0;i<jenis.length;i++) for(let j=i+1;j<jenis.length;j++){
        const x=jenis[i], y=jenis[j];
        if(stok[x]>=orang && stok[y]>=orang) sasaran.push({[x]:orang, [y]:orang}); }
    }
    if(!sasaran.length) return {ok:false, sasaran:[]};
    const tercapai=(p)=>sasaran.some(s=>Object.keys(s).every(k=>(p[k]||0)>=s[k]));
    let terburuk=-1, bukti=null;
    const telusur=(i, punya, jum)=>{
      if(i===jenis.length){ if(!tercapai(punya) && jum>terburuk){ terburuk=jum; bukti={...punya}; } return; }
      const k=jenis[i];
      for(let a=0;a<=stok[k];a++) telusur(i+1, {...punya, [k]:a}, jum+a);
    };
    telusur(0, {}, 0);
    return {ok:true, sasaran, terburuk, bukti, tarikan:terburuk+1}; },
  /* --- Kotak bersarang / Dilworth (dibuktikan verify/15-dilworth.py) ---
     Soal OSN-K 2025 nomor 17-19: kotak berbentuk KUBUS, kotak kecil boleh
     masuk ke kotak besar kalau sisinya LEBIH KECIL (bukan sama). Tiap
     kotak yang dibuka hanya boleh memuat satu kotak. Cari banyaknya kotak
     paling sedikit yang terlihat dari luar.

     Acuan: Dilworth 1950 — rantai paling sedikit untuk menutupi sebuah
     himpunan terurut sebagian sama dengan antirantai terbesarnya.        */
  /* Untuk kubus: dua kotak hanya saling tak-muat kalau sisinya SAMA.
     Jadi antirantai terbesar = cacah ukuran yang paling sering muncul.
     Angka nol dan negatif TIDAK boleh disaring diam-diam — kotak bersisi
     nol bukan kotak. */
  dwMin(sisi){ if(!Array.isArray(sisi)) return null;
    if(!sisi.length) return 0;
    if(sisi.some(x=>!Number.isFinite(x)||x<=0)) return null;
    const c={}; for(const x of sisi) c[x]=(c[x]||0)+1;
    return Math.max(...Object.values(c)); },
  /* Cacah tiap ukuran, diurutkan menaik. */
  dwCacah(sisi){ const c={}; for(const x of sisi) c[x]=(c[x]||0)+1;
    return Object.keys(c).map(Number).sort((a,b)=>a-b).map(u=>({ukuran:u, banyak:c[u]})); },
  /* Susun rantainya sungguhan: urutkan ukurannya, lalu taruh berputar.
     Tiap rantai dikembalikan dari yang TERKECIL ke terbesar. */
  dwSusun(sisi){ const m=M.dwMin(sisi);
    if(m===null||m===0) return [];
    const rantai=[...Array(m)].map(()=>[]);
    for(const {ukuran, banyak} of M.dwCacah(sisi))
      for(let i=0;i<banyak;i++) rantai[i].push(ukuran);
    return rantai; },
  /* Rantai paling sedikit untuk kotak berdimensi berapa pun.
     kotak = [[p,l], [p,l], ...] atau [[p,l,t], ...]. Muat kalau SEMUA
     sisinya lebih kecil. Dihitung lewat pencocokan dua sisi:
     banyak kotak dikurangi pasangan terbanyak. */
  dwMinUmum(kotak){ const n=kotak.length; if(!n) return 0;
    const muat=(i,j)=>kotak[i].every((v,d)=>v<kotak[j][d]);
    const pasangan=new Array(n).fill(-1);
    const telusur=(i, lihat)=>{
      for(let j=0;j<n;j++){
        if(!muat(i,j)||lihat.has(j)) continue;
        lihat.add(j);
        if(pasangan[j]===-1||telusur(pasangan[j],lihat)){ pasangan[j]=i; return true; }
      }
      return false; };
    let cocok=0;
    for(let i=0;i<n;i++) if(telusur(i,new Set())) cocok++;
    return n-cocok; },
  /* Antirantai terbesar — kumpulan kotak yang tidak ada satu pun bisa
     masuk ke yang lain. Dicari menyeluruh, jadi dibatasi jumlahnya. */
  dwAntirantai(kotak, batas=14){ const n=kotak.length; if(!n) return 0;
    if(n>batas) return null;
    const muat=(i,j)=>kotak[i].every((v,d)=>v<kotak[j][d]);
    let terbaik=0, isi=[];
    for(let topeng=1; topeng<(1<<n); topeng++){
      const pilih=[]; for(let i=0;i<n;i++) if((topeng>>i)&1) pilih.push(i);
      if(pilih.length<=terbaik) continue;
      let sah=true;
      for(let a=0;a<pilih.length&&sah;a++) for(let b=a+1;b<pilih.length;b++)
        if(muat(pilih[a],pilih[b])||muat(pilih[b],pilih[a])){ sah=false; break; }
      if(sah){ terbaik=pilih.length; isi=pilih.map(i=>kotak[i]); }
    }
    return {ukuran:terbaik, isi}; },
  /* Kalau tiap kotak boleh memuat `lebar` kotak sekaligus — bukan satu. */
  dwLebar(sisi, lebar){ const m=M.dwMin(sisi);
    if(m===null) return null;
    if(m===0) return 0;
    return Math.max(1, Math.ceil(m/Math.max(1,lebar))); },
  comb(total,without){ return total-without; },
  rotL(n){ const b=n.toString(2); return parseInt(b.slice(1)+b[0],2); },
  popcount(n){ let c=0; while(n){ c+=n&1; n>>>=1; } return c; },
  sumJ2(n){ const p=M.pow2le(n), m=Math.round(Math.log2(p)), L=n-p;
            return (Math.pow(4,m)-1)/3 + Math.pow(L+1,2); },
  digitalRoot(n){ return n<=0 ? 0 : 1+((n-1)%9); },
  /* Bilangan terkecil yang jumlah digitnya X.
     Mengembalikan BigInt. Dulu memakai parseInt dan hasilnya diam-diam
     salah mulai X = 144 — di situ jawabannya sudah 16 digit, melewati
     batas ketelitian angka biasa JavaScript. */
  kecilDigitSum(X){ if(X<=0) return 0n;
    const sembilan=Math.floor(X/9), sisa=X%9;
    return BigInt((sisa? String(sisa):'')+'9'.repeat(sembilan)); },
  rataBobot(x,y){ const C=new Array(10).fill(0);
    for(let k=x;k<=y;k++){ const w=(k-x+1)*(y-k+1); let kk=k;
      while(kk>0){ C[kk%10]+=w; kk=Math.floor(kk/10); } }
    return C; },
  faktorPrima(n){ const f={}; let x=n;
    for(let p=2;p*p<=x;p++){ while(x%p===0){ f[p]=(f[p]||0)+1; x/=p; } }
    if(x>1) f[x]=(f[x]||0)+1;
    return f; },
  totient(n){ if(n<1) return 0; let r=n;
    for(const p of Object.keys(M.faktorPrima(n))) r=r/p*(p-1);
    return Math.round(r); }
};

export default M;
