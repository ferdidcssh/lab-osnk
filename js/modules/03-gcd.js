/* ============================================================
   MODUL 03 — FPB &amp; Euler’s Totient
   Rumus diverifikasi oleh verify/03-gcd.py
   ============================================================ */

import { M } from '../core/math.js';
import { bukaRumus } from '../core/ui.js';

export default {
  id: 'gcd', n: '03', kelompok: 'Teori Bilangan',
  judul: 'FPB &amp; Euler’s Totient',
  lede: 'Algoritma Euclid untuk mencari faktor persekutuan terbesar, dan fungsi φ(n) yang menghitung ada berapa bilangan dari 1 sampai n yang tidak berbagi faktor dengan n. Di OSN-K 2025 keduanya muncul dalam satu grup soal yang sama.',
  lencana: ['<span class="chip r">2025</span>','<span class="chip v">Diuji A=1..149</span>'],
  kartu: [
    { q: 'return MERAH(B, A % B);', a: 'gcd', why: 'Parameter tertukar posisi + modulo = Euclidean. Bukan Josephus.' },
    { q: '“Berapa banyak bilangan ≤ n yang koprima dengan n?”', a: 'gcd', why: 'Itu definisi persis fungsi totient Euler, ditulis φ(n).' }
  ],
  kamus: [
    ['F(B, A % B) — parameter tertukar', 'FPB Euclidean'],
    ['“berapa yang koprima dengan n”', 'Euler’s Totient φ(n)'],
    ['“ada berapa C yang FPB(A, C)-nya tepat B”',
     'Jalan pintas φ(A ÷ B) — nol kalau B tidak membagi habis A'],
    ['“ubin terbesar yang menutupi lantai tanpa dipotong”',
     'FPB dari kedua ukuran lantainya'],
    ['“bersamaan lagi setelah berapa hari”, “berbunyi serentak”',
     'KPK, bukan FPB — hitung a × b ÷ FPB(a, b)'],
    ['dua bilangan Fibonacci berurutan sebagai masukan',
     'Kasus terlama cara Euclid — banyaknya langkah paling banyak']
  ],
  bangun(root, { ids, pasangTab }) {
root.innerHTML=`
<!-- ============ APA ITU ============ -->
<div class="card">
  <h3>Apa itu FPB dan Euler’s Totient?</h3>
  <p style="margin:10px 0"><b>FPB</b> (faktor persekutuan terbesar) adalah bilangan terbesar yang membagi habis dua bilangan sekaligus. FPB(48, 18) = 6, karena 6 membagi habis keduanya dan tidak ada yang lebih besar.</p>
  <p style="margin:10px 0">Dua bilangan disebut <b>koprima</b> (saling prima) kalau FPB-nya 1 — artinya mereka tidak punya faktor bersama sama sekali selain 1. Contoh: 8 dan 15 koprima, walaupun keduanya bukan bilangan prima. Jadi kamu tidak perlu keduanya prima.</p>

  <div class="note"><b>Satu nama, dua bahasa.</b> Di naskah soal dan di kode C++ kamu akan bertemu <code>GCD</code> (<i>greatest common divisor</i>) dan fungsi <code>__gcd(a, b)</code>. Itu benda yang sama dengan FPB. Di modul ini dipakai FPB, supaya tidak ada dua istilah di kepalamu sekaligus.</div>
  <p style="margin:10px 0"><b>Euler’s Totient</b>, ditulis <b>φ(n)</b>, menghitung <b>ada berapa bilangan dari 1 sampai n yang koprima dengan n</b>. Contoh φ(15) = 8, karena dari 1 sampai 15 ada delapan bilangan yang tidak berbagi faktor dengan 15: yaitu 1, 2, 4, 7, 8, 11, 13, dan 14.</p>

  <div class="note">
    <b>Asal-usulnya.</b> Cara menghitung yang kamu pakai sekarang tercatat dalam <i>Elements</i> karya <b>Euclid</b> (sekitar 300 SM) — salah satu algoritma tertua yang masih dipakai sampai hari ini. Bentuk aslinya bukan tentang angka, melainkan tentang <b>panjang garis</b>: berulang kali potong yang panjang dengan yang pendek.
    <br><br>
    Fungsi φ diperkenalkan <b>Leonhard Euler</b> pada abad ke-18. Lambang φ baru dipakai <b>Gauss</b> dalam <i>Disquisitiones Arithmeticae</i> (1801). Hari ini φ jadi tulang punggung kriptografi RSA.
  </div>

  <div class="note good">
    <b>Kenapa dua topik ini digabung?</b> Karena di OSN-K 2025 keduanya muncul dalam <b>satu grup soal yang sama</b>. Soalnya terlihat seperti tiga fungsi rekursif biasa, padahal isinya: fungsi pertama algoritma Euclid, dan fungsi ketiga diam-diam menghitung φ. Kalau kamu tidak mengenalinya, kamu harus menghitung 2.025 kali dengan tangan.
  </div>
</div>

<!-- ============ LAB 1: GEOMETRIS ============ -->
<div class="lab">
  <div class="lab-head"><b>Lab 1 · Bentuk asli algoritma Euclid</b><span class="hint">persegi terbesar yang memenuhi persegi panjang</span></div>
  <div class="lab-body">
    <p style="margin:0 0 12px">Bayangkan persegi panjang berukuran a × b. Potong persegi sebesar mungkin, berulang-ulang, sampai habis. <b>Ukuran persegi terakhir adalah FPB-nya.</b></p>
    <div class="ctl">
      <div class="f"><label>a</label><input id="${ids.i('gcA')}" type="number" value="48" min="1" max="120"></div>
      <div class="f"><label>b</label><input id="${ids.i('gcB')}" type="number" value="18" min="1" max="120"></div>
      <button class="btn" id="${ids.i('gcGo')}">Potong</button>
    </div>
    <div id="${ids.i('gcViz')}" style="max-width:400px;margin:8px auto"></div>
    <div class="out" id="${ids.i('gcOut')}">Tekan “Potong” untuk mulai.</div>
  </div>
</div>

<div class="note good">
  <b>Kenapa cara ini benar?</b> Kalau sebuah persegi berukuran d × d bisa memenuhi persegi panjang a × b tanpa sisa, maka d pasti membagi habis a <b>dan</b> b. Setiap kali kamu memotong persegi, sisanya masih punya pembagi bersama yang sama persis. Jadi persegi terakhir — yang pas menghabiskan sisanya — adalah pembagi bersama terbesar.
  <span class="tiny" style="display:block;margin-top:6px">✅ Terverifikasi: sisi persegi terakhir = FPB, untuk semua a, b dari 1 sampai 119.</span>
</div>

<!-- ============ LAB 2: TANGGA EUCLIDEAN ============ -->
<div class="lab">
  <div class="lab-head"><b>Lab 2 · Versi angka (yang dipakai di kode)</b><span class="hint">tiap baris: ganti dengan sisanya</span></div>
  <div class="lab-body">
    <pre class="code" style="margin-bottom:14px"><span class="kw">int</span> <span class="fn">MERAH</span>(<span class="kw">int</span> A, <span class="kw">int</span> B) {
  <span class="kw">if</span> (B == 0) <span class="kw">return</span> A;
  <span class="kw">else</span> <span class="kw">return</span> <span class="fn">MERAH</span>(B, A % B);   <span class="c">// ← parameter TERTUKAR</span>
}</pre>
    <div class="ctl">
      <div class="f"><label>a</label><input id="${ids.i('gcEa')}" type="number" value="2025" min="0" max="9999999"></div>
      <div class="f"><label>b</label><input id="${ids.i('gcEb')}" type="number" value="135" min="0" max="9999999"></div>
      <button class="btn" id="${ids.i('gcEgo')}">Telusuri</button>
    </div>
    <div class="out" id="${ids.i('gcEout')}">—</div>
  </div>
</div>

<div class="lockwrap">
  <div class="rumus locked" id="${ids.i('grumus')}">
    <span class="lbl">Algoritma Euclid · terverifikasi a,b = 0..300</span>
    FPB(a, b) = <mark>FPB(b, a mod b)</mark> &nbsp;&nbsp; berhenti saat b = 0<br>
    <span style="font-size:12.5px;color:var(--tinta-2)">Ciri khas kodenya: <b>parameter bertukar posisi</b> dan ada operasi modulo</span>
    <span class="tiny" style="display:block;margin-top:8px;color:var(--tinta-2)">✅ Diadu dengan simulasi persegi untuk a, b = 1 sampai 119</span>
  </div>
  <div class="lockmsg" id="${ids.i('grumus-pesan')}">Potong perseginya dulu di Lab 1 — rumusnya lebih membekas kalau kamu sendiri yang melihat sisanya mengecil.</div>
</div>

<!-- ============ LAB 3: KISI KOPRIMA ============ -->
<div class="lab">
  <div class="lab-head"><b>Lab 3 · Apa yang dihitung φ(n)?</b><span class="hint">yang berwarna adalah yang koprima</span></div>
  <div class="lab-body">
    <div class="ctl">
      <div class="f"><label>n</label><input id="${ids.i('gcPn')}" type="number" value="15" min="1" max="120"></div>
      <button class="btn" id="${ids.i('gcPgo')}">Tandai yang koprima</button>
    </div>
    <div id="${ids.i('gcPgrid')}" style="margin:14px 0"></div>
    <div class="out" id="${ids.i('gcPout')}">—</div>
  </div>
</div>

<div class="lab">
  <div class="lab-head"><b>Lab 5 · Jalan pintas φ(A/B) — yang paling terasa curang</b><span class="hint">2.025 hitungan jadi dua langkah</span></div>
  <div class="lab-body">
    <p style="margin:0 0 10px">Soal 2025 nomor 40 bertanya: ada berapa C dari 1 sampai 2.025 yang FPB(2025, C)-nya tepat 135?</p>
    <p style="margin:0 0 10px">Cara polosnya kamu hitung FPB sebanyak <b>2.025 kali</b>. Di kertas itu mustahil.</p>
    <p style="margin:0 0 12px">Jalan pintasnya dua langkah. Cek apakah B membagi habis A, lalu hitung φ(A ÷ B). Selesai.</p>
    <div class="ctl">
      <div class="f"><label>A</label><input id="${ids.i('gcXa')}" type="number" value="2025" min="1" max="200000"></div>
      <div class="f"><label>B</label><input id="${ids.i('gcXb')}" type="number" value="135" min="1" max="200000"></div>
      <button class="btn" id="${ids.i('gcXgo')}">Bandingkan biayanya</button>
    </div>
    <div class="out" id="${ids.i('gcXout')}">Tekan “Bandingkan biayanya” untuk mulai.</div>
  </div>
</div>

<div class="note good"><b>Kenapa boleh begitu.</b> Kalau FPB(A, C) = B, maka B pasti membagi habis A dan juga C.
Tulis C = B·k. Syaratnya berubah jadi FPB(A ÷ B, k) = 1 — dengan kata lain k harus koprima dengan A ÷ B.
Jadi yang kamu cari sebenarnya banyaknya k yang koprima dengan A ÷ B, dan itu persis definisi φ.
<br><br>Dan kalau B <b>tidak</b> membagi habis A, tidak ada satu pun C yang memenuhi — jawabannya nol tanpa perlu menghitung apa pun.
<span class="tiny" style="display:block;margin-top:6px">✅ Rumus ini diadu dengan pencacahan langsung untuk seluruh 20.300 pasangan A dari 1 sampai 200 dan B dari 0 sampai A. Nol beda.</span></div>

<!-- ============ CARA CEPAT ============ -->
<div class="card">
  <h3>Kumpulan cara cepat</h3>
  <p class="sub">Semua sudah diuji terhadap perhitungan langsung.</p>
  <div class="tabs" id="${ids.i('gcTrik')}">
    <button class="tab on" data-t="k1">Kupas prima</button>
    <button class="tab" data-t="k2">Rumus φ(A/B)</button>
    <button class="tab" data-t="k3">Sifat φ</button>
    <button class="tab" data-t="k4">Teorema Gauss</button>
    <button class="tab" data-t="k5">Euclid cepat</button>
  </div>

  <div class="tp on" data-t="k1">
    <p style="margin:0 0 10px">Rumus baku φ(n) = n × (1 − 1/p₁) × (1 − 1/p₂) × … penuh pecahan, dan pecahan itu sumber kesalahan di kertas. Ada cara yang <b>seluruhnya bilangan bulat</b>:</p>
    <div class="rumus">
      <span class="lbl">Kupas prima · terverifikasi n = 1..3.000</span>
      Mulai dari n. Untuk tiap faktor prima p:<br>
      <mark>bagi dengan p, lalu kali dengan (p − 1)</mark>
    </div>
    <div class="out" style="margin-top:12px">Contoh φ(60):
  faktor prima 60 = 2, 3, 5

  60 → bagi 2, kali 1 → <span class="g">30</span>
  30 → bagi 3, kali 2 → <span class="g">20</span>
  20 → bagi 5, kali 4 → <span class="g">16</span>

  φ(60) = 16     <span class="d">tanpa satu pun pecahan</span></div>
    <div class="ctl" style="margin-top:12px">
      <div class="f"><label>n</label><input id="${ids.i('gcKn')}" type="number" value="2025" min="1" max="9999999"></div>
      <button class="btn" id="${ids.i('gcKgo')}">Kupas</button>
    </div>
    <div class="out" id="${ids.i('gcKout')}">—</div>
  </div>

  <div class="tp" data-t="k2">
    <p style="margin:0 0 10px">Ini jalan pintas terpenting di modul ini. Kalau soal bertanya <b>"ada berapa C dari 1 sampai A yang FPB(A, C)-nya tepat B?"</b> — kamu tidak perlu menghitung satu per satu.</p>
    <div class="rumus">
      <span class="lbl">Terverifikasi A = 1..199, semua nilai B</span>
      banyaknya C = <mark>φ(A / B)</mark> &nbsp; bila B membagi habis A<br>
      banyaknya C = <mark>0</mark> &nbsp; bila B tidak membagi habis A
    </div>
    <div class="note" style="margin-top:12px"><b>Kenapa begitu?</b> Kalau FPB(A, C) = B, berarti C pasti kelipatan B — tulis C = B·k. Bagi semuanya dengan B, syaratnya jadi FPB(A/B, k) = 1. Jadi kamu sebenarnya sedang menghitung <b>ada berapa k ≤ A/B yang koprima dengan A/B</b> — dan itu persis definisi φ.</div>
    <div class="ctl" style="margin-top:12px">
      <div class="f"><label>A</label><input id="${ids.i('gcNa')}" type="number" value="2025" min="1" max="200000"></div>
      <div class="f"><label>B</label><input id="${ids.i('gcNb')}" type="number" value="135" min="1"></div>
      <button class="btn" id="${ids.i('gcNgo')}">Bandingkan dua cara</button>
    </div>
    <div class="out" id="${ids.i('gcNout')}">—</div>
  </div>

  <div class="tp" data-t="k3">
    <p style="margin:0 0 10px">Kalau bentuk n-nya khusus, φ bisa dijawab tanpa memfaktorkan sama sekali:</p>
    <div class="rumus" style="text-align:left">
      <span class="lbl">Terverifikasi</span>
      p prima &nbsp;→&nbsp; <mark>φ(p) = p − 1</mark><br><br>
      pangkat prima &nbsp;→&nbsp; <mark>φ(pᵏ) = pᵏ − pᵏ⁻¹</mark><br>
      <span style="font-size:12.5px;color:var(--tinta-2)">contoh φ(32) = φ(2⁵) = 32 − 16 = 16</span><br><br>
      FPB(a,b) = 1 &nbsp;→&nbsp; <mark>φ(a·b) = φ(a) · φ(b)</mark><br>
      <span style="font-size:12.5px;color:var(--tinta-2)">contoh φ(15) = φ(3) × φ(5) = 2 × 4 = 8</span><br><br>
      n &gt; 2 &nbsp;→&nbsp; <mark>φ(n) selalu genap</mark><br>
      <span style="font-size:12.5px;color:var(--tinta-2)">pakai ini untuk membuang pilihan jawaban ganjil</span><br><br>
      n ganjil &nbsp;→&nbsp; <mark>φ(2n) = φ(n)</mark> &nbsp;·&nbsp; n genap &nbsp;→&nbsp; <mark>φ(2n) = 2φ(n)</mark>
    </div>
    <p class="tiny">✅ Kelimanya diuji: sifat prima sampai p &lt; 500, pangkat prima sampai p⁶, sifat perkalian untuk semua pasangan koprima &lt; 60, sifat genap untuk n = 3..3.000.</p>
  </div>

  <div class="tp" data-t="k4">
    <p style="margin:0 0 10px">Kalau kamu menjumlahkan φ dari <b>semua pembagi</b> sebuah bilangan, hasilnya kembali ke bilangan itu sendiri. Ditemukan Gauss.</p>
    <div class="rumus">
      <span class="lbl">Teorema Gauss · terverifikasi n = 1..2.000</span>
      <mark>Σ φ(d) untuk setiap pembagi d dari n &nbsp;=&nbsp; n</mark>
    </div>
    <p style="margin:10px 0">Gunanya dua: sebagai <b>pemeriksa</b> kalau kamu menghitung beberapa nilai φ sekaligus, dan sebagai cara <b>menghitung mundur</b> kalau satu nilai belum diketahui.</p>
    <div class="ctl">
      <div class="f"><label>n</label><input id="${ids.i('gcGn')}" type="number" value="30" min="1" max="5000"></div>
      <button class="btn" id="${ids.i('gcGgo')}">Jumlahkan</button>
    </div>
    <div id="${ids.i('gcGbar')}" style="margin:14px 0"></div>
    <div class="out" id="${ids.i('gcGout')}">—</div>
  </div>

  <div class="tp" data-t="k5">
    <p style="margin:0 0 10px">Empat pintasan untuk mempercepat FPB di kertas:</p>
    <div class="rumus" style="text-align:left">
      <span class="lbl">Terverifikasi</span>
      1. Kalau b membagi habis a &nbsp;→&nbsp; <mark>FPB = b</mark>, langsung selesai<br><br>
      2. <mark>FPB(a, b) = FPB(a − b, b)</mark> — berguna saat a dan b berdekatan<br>
      <span style="font-size:12.5px;color:var(--tinta-2)">contoh FPB(1001, 1000) = FPB(1, 1000) = 1</span><br><br>
      3. Dua bilangan berurutan <b>selalu</b> koprima: <mark>FPB(n, n+1) = 1</mark><br><br>
      4. <mark>FPB(a,b) × lcm(a,b) = a × b</mark> — cari KPK dari FPB
    </div>
    <div class="note" style="margin-top:12px"><b>Seberapa cepat Euclid?</b> Menurut <b>teorema Lamé</b>, banyaknya langkah tidak pernah lebih dari <b>5 × jumlah digit</b> bilangan yang lebih kecil. Artinya untuk bilangan 4 digit, cukup 20 langkah — padahal biasanya jauh lebih sedikit.
    <br><br>Kasus paling lambat justru terjadi pada <b>bilangan Fibonacci berurutan</b>: FPB(89, 55) butuh 9 langkah, paling banyak untuk ukuran sebesar itu.
    <span class="tiny" style="display:block;margin-top:6px">✅ Terverifikasi untuk semua pasangan a, b &lt; 3.000.</span></div>
  </div>
</div>

<!-- ============ LAB 4: PARTISI ============ -->
<div class="lab">
  <div class="lab-head"><b>Lab 4 · Mengelompokkan 1..A menurut FPB-nya</b><span class="hint">inilah bentuk soal OSN-K 2025</span></div>
  <div class="lab-body">
    <p style="margin:0 0 12px">Ambil semua bilangan 1 sampai A, lalu kelompokkan menurut nilai FPB-nya dengan A. Perhatikan ukuran tiap kelompok.</p>
    <div class="ctl">
      <div class="f"><label>A</label><input id="${ids.i('gcPa')}" type="number" value="12" min="1" max="60"></div>
      <button class="btn" id="${ids.i('gcPago')}">Kelompokkan</button>
    </div>
    <div id="${ids.i('gcPaviz')}" style="margin:14px 0"></div>
    <div class="out" id="${ids.i('gcPaout')}">—</div>
  </div>
</div>

<div class="note good">
  <b>Dua hal sekaligus terlihat di sini.</b> Pertama, ukuran tiap kelompok tepat φ(A/B) — itulah jawaban soal OSN-K 2025. Kedua, karena setiap bilangan 1..A pasti masuk ke tepat satu kelompok, jumlah semua ukuran kelompok harus sama dengan A — dan itulah <b>teorema Gauss</b>. Soal olimpiadenya ternyata potongan dari bukti teorema klasik.
  <span class="tiny" style="display:block;margin-top:6px">✅ Terverifikasi untuk A = 1 sampai 500.</span>
</div>

<!-- ============ PENYAMARAN ============ -->
<div class="card">
  <h3>Penyamaran</h3>
  <div class="tabs" id="${ids.i('gcTabs')}">
    <button class="tab on" data-t="a">A · Rekursif</button>
    <button class="tab" data-t="b">B · Perulangan</button>
    <button class="tab" data-t="c">C · Pengurangan</button>
    <button class="tab" data-t="d">D · Cerita</button>
    <button class="tab" data-t="e">E · Jebakan</button>
  </div>
  <div class="tp on" data-t="a">
    <pre class="code"><span class="kw">int</span> <span class="fn">MERAH</span>(<span class="kw">int</span> A, <span class="kw">int</span> B) {
  <span class="kw">if</span> (B == 0) <span class="kw">return</span> A;
  <span class="kw">else</span> <span class="kw">return</span> <span class="fn">MERAH</span>(B, A % B);
}</pre>
    <div class="note"><b>Ciri khas:</b> parameter <b>bertukar posisi</b> — B naik ke depan, dan yang di belakang jadi <code>A % B</code>. Berhenti saat parameter kedua nol. ✅ Terverifikasi identik dengan FPB untuk a, b = 0..199.</div>
  </div>
  <div class="tp" data-t="b">
    <pre class="code"><span class="kw">while</span> (b != 0) { <span class="kw">int</span> t = b; b = a % b; a = t; }
<span class="kw">return</span> a;</pre>
    <div class="note">Tanpa rekursi. Variabel <code>t</code> hanya untuk menukar. Isinya sama persis.</div>
  </div>
  <div class="tp" data-t="c">
    <pre class="code"><span class="kw">while</span> (a != b) { <span class="kw">if</span> (a &gt; b) a -= b; <span class="kw">else</span> b -= a; }
<span class="kw">return</span> a;</pre>
    <div class="note warn">Versi <b>pengurangan</b> — inilah bentuk asli Euclid. Hasilnya sama, tapi jauh lebih lambat: FPB(1000, 1) butuh 999 langkah, sementara versi modulo cukup 1 langkah. Kalau soal menanyakan <b>banyaknya langkah</b>, bedanya besar sekali.</div>
  </div>
  <div class="tp" data-t="d">
    <div class="note">"Lantai berukuran 48 × 18 cm akan ditutup ubin persegi identik tanpa memotong satu pun ubin. Berapa ukuran ubin terbesar yang bisa dipakai?"</div>
    <p class="tiny">Tidak ada kode, tidak ada satu pun istilah teknis. Tapi ini persis Lab 1 di atas. Jawabannya 6 × 6 cm.</p>
    <div class="note" style="margin-top:10px">"Ada berapa bilangan dari 1 sampai 15 yang tidak punya faktor persekutuan dengan 15 selain 1?"</div>
    <p class="tiny">Ini definisi φ(15) yang ditulis ulang. Jawabannya 8.</p>
  </div>
  <div class="tp" data-t="e">
    <pre class="code"><span class="kw">return</span> (<span class="fn">pndk</span>(N-1,K)+K-1)%N+1;</pre>
    <div class="note warn">Ada modulo, ada rekursi — tapi ini <b>Josephus</b>, bukan FPB. Bedanya: Josephus turun <b>satu langkah</b> (<code>N−1</code>) dan dimodulo dengan N yang berubah tiap tingkat. FPB <b>menukar posisi</b> parameter.</div>
    <pre class="code" style="margin-top:12px"><span class="kw">while</span> (b != 0) { a = a % b; b = b % a; }</pre>
    <div class="note warn">Terlihat seperti Euclid tapi <b>tidak menukar</b> — ini bisa membagi dengan nol dan hasilnya salah. Perhatikan pertukarannya, bukan sekadar adanya modulo.</div>
  </div>
</div>

<!-- ============ SOAL ASLI ============ -->
<div class="card">
  <h3>Bedah soal asli OSN-K 2025 · soal 38–40</h3>
  <p class="sub">Kode <code>MERAH</code> (FPB), <code>PUTIH</code> (menghitung berapa C yang FPB-nya = B), <code>NUSANTARA(A,B) = PUTIH(A,B,A)</code>.</p>
  <div class="grid2">
    <div><div class="chip r">Soal 38</div><p style="margin:8px 0 0">Mana yang terbesar: <code>MERAH(24,4)</code>, <code>(24,9)</code>, <code>(24,17)</code>, <code>(24,18)</code>, <code>(24,34)</code>?</p><div class="out" style="margin-top:8px" id="${ids.i('gcS1')}">—</div></div>
    <div><div class="chip r">Soal 39</div><p style="margin:8px 0 0"><code>NUSANTARA(12, 3)</code>?</p><div class="out" style="margin-top:8px" id="${ids.i('gcS2')}">—</div></div>
    <div><div class="chip r">Soal 40</div><p style="margin:8px 0 0"><code>NUSANTARA(2025, 135)</code>?</p><div class="out" style="margin-top:8px" id="${ids.i('gcS3')}">—</div></div>
  </div>
  <button class="btn" id="${ids.i('gcSolve')}" style="margin-top:14px">Selesaikan ketiganya</button>
</div>

<div class="note warn">
  <b>Kapan ini BUKAN FPB.</b>
  <table class="t" style="margin-top:10px;background:transparent">
    <tr><th style="text-align:left">Bentuk</th><th style="text-align:left">Sebenarnya</th></tr>
    <tr><td style="text-align:left"><code>F(B, A % B)</code> — parameter tertukar</td><td style="text-align:left">✅ FPB Euclidean</td></tr>
    <tr><td style="text-align:left"><code>while(a!=b){ a-=b atau b-=a }</code></td><td style="text-align:left">✅ FPB versi lambat (perhatikan bila ditanya jumlah langkah)</td></tr>
    <tr><td style="text-align:left"><code>(f(N−1)+K−1)%N+1</code></td><td style="text-align:left">❌ Josephus</td></tr>
    <tr><td style="text-align:left"><code>(X%10) + f(X/10)</code></td><td style="text-align:left">❌ Digit sum</td></tr>
  </table>
</div>

<div class="note">
  <b>Verifikasi 30 detik sebelum memakai rumus φ(A/B).</b> Cek dulu apakah B benar-benar membagi habis A — kalau tidak, jawabannya langsung 0. Lalu coba kasus kecil: NUSANTARA(12, 3) seharusnya φ(4) = 2, dan memang hanya C = 3 dan C = 9 yang FPB-nya dengan 12 tepat 3.
</div>`;

/* ---------- LAB 1: pemotongan persegi (SVG) ---------- */
function potong(a,b){
  const kotak=[]; let x=0,y=0,A=a,B=b, aman=0;
  while(A>0&&B>0&&aman++<200){
    const s=Math.min(A,B), n=Math.floor(Math.max(A,B)/s);
    for(let i=0;i<n;i++){
      if(A>B) kotak.push({x:x+i*s,y:y,s:s});
      else    kotak.push({x:x,y:y+i*s,s:s});
    }
    if(A>B){ x+=n*s; A-=n*s; } else { y+=n*s; B-=n*s; }
  }
  return kotak;
}
ids.q('gcGo').onclick=()=>{
  bukaRumus(ids, 'grumus');
  const a=Math.min(120,Math.max(1,ids.n('gcA')||48)), b=Math.min(120,Math.max(1,ids.n('gcB')||18));
  const kotak=potong(a,b), g=M.gcd(a,b);
  const skala=340/Math.max(a,b), W=a*skala, H=b*skala;
  const warna=['#D9E6F0','#C2D8E8','#AAC9DF','#93BBD7','#7BACCE','#649EC6','#4C8FBD'];
  let sv=`<svg viewBox="-2 -2 ${W+4} ${H+4}" width="100%" role="img" aria-label="Pemotongan persegi ${a} kali ${b}">`;
  kotak.forEach((k,i)=>{
    const c=warna[Math.min(i,warna.length-1)];
    sv+=`<rect x="${(k.x*skala).toFixed(1)}" y="${(k.y*skala).toFixed(1)}" `+
        `width="${(k.s*skala).toFixed(1)}" height="${(k.s*skala).toFixed(1)}" `+
        `fill="${k.s===g?'var(--stabilo)':c}" stroke="var(--tinta)" stroke-width="1.5"/>`;
    if(k.s*skala>26) sv+=`<text x="${((k.x+k.s/2)*skala).toFixed(1)}" y="${((k.y+k.s/2)*skala+5).toFixed(1)}" `+
        `text-anchor="middle" style="font-family:var(--mono);font-size:${Math.min(15,k.s*skala/3).toFixed(0)}px;font-weight:600;fill:var(--tinta)">${k.s}</text>`;
  });
  sv+=`<rect x="0" y="0" width="${W.toFixed(1)}" height="${H.toFixed(1)}" fill="none" stroke="var(--tinta)" stroke-width="3"/>`;
  sv+='</svg>';
  ids.q('gcViz').innerHTML=sv+
    `<p class="tiny" style="text-align:center;margin-top:6px">persegi kuning berukuran ${g}×${g} — itulah FPB-nya</p>`;
  // ringkasan langkah
  const urut=[]; let A=a,B=b,aman=0;
  while(A>0&&B>0&&aman++<50){
    const s=Math.min(A,B), n=Math.floor(Math.max(A,B)/s);
    urut.push(`  sisa ${A}×${B} → potong ${n} persegi ${s}×${s}`);
    if(A>B) A-=n*s; else B-=n*s;
  }
  ids.q('gcOut').innerHTML=
`${urut.join('\n')}

<span class="g">Persegi terakhir: ${g}×${g}  →  FPB(${a}, ${b}) = ${g}</span>
<span class="d">Total ${kotak.length} persegi menutupi seluruh ${a}×${b} tanpa sisa.</span>`;
};

/* ---------- LAB 2: tangga Euclidean ---------- */
ids.q('gcEgo').onclick=()=>{
  const a0=Math.max(0,ids.n('gcEa')||0), b0=Math.max(0,ids.n('gcEb')||0);
  let a=a0,b=b0; const baris=[];
  while(b!==0 && baris.length<60){ baris.push(`  ${a} = ${b} × ${Math.floor(a/b)} + ${a%b}`); [a,b]=[b,a%b]; }
  const digit=String(Math.min(a0,b0)||1).length;
  ids.q('gcEout').innerHTML=
`${baris.join('\n')||'  (langsung selesai)'}

<span class="g">FPB(${a0}, ${b0}) = ${a}</span>

<span class="d">${baris.length} langkah. Batas teorema Lamé: 5 × ${digit} digit = ${5*digit} langkah.</span>`;
};
ids.q('gcEgo').click();

/* ---------- LAB 3: kisi koprima ---------- */
ids.q('gcPgo').onclick=()=>{
  const n=Math.min(120,Math.max(1,ids.n('gcPn')||15));
  const kop=[];
  let sel='';
  for(let k=1;k<=n;k++){
    const c=M.gcd(k,n)===1; if(c) kop.push(k);
    sel+=`<span style="display:inline-block;width:30px;height:30px;line-height:28px;text-align:center;margin:2px;
      font-family:var(--mono);font-size:${n>60?10:12}px;font-weight:600;border-radius:5px;
      border:2px solid ${c?'var(--hijau)':'var(--garis-tebal)'};
      background:${c?'var(--hijau-pucat)':'var(--kertas)'};
      color:${c?'var(--hijau)':'var(--tinta-3)'}">${k}</span>`;
  }
  ids.q('gcPgrid').innerHTML=`<div style="text-align:center;line-height:1">${sel}</div>`;
  const f=M.faktorPrima(n);
  ids.q('gcPout').innerHTML=
`n = ${n}${Object.keys(f).length?`   faktor prima: ${Object.keys(f).join(', ')}`:''}

Yang koprima dengan ${n} (FPB = 1):
  ${kop.length<=40?kop.join(', '):kop.slice(0,40).join(', ')+' …'}

<span class="g">φ(${n}) = ${M.totient(n)}</span>   <span class="d">(hitung manual: ${kop.length})</span>   ${kop.length===M.totient(n)?'✓ cocok':'<span class="k">✗</span>'}`;
};
ids.q('gcPgo').click();

/* ---------- kupas prima ---------- */
ids.q('gcKgo').onclick=()=>{
  const n=Math.max(1,ids.n('gcKn')||1);
  const f=M.faktorPrima(n), ps=Object.keys(f).map(Number);
  let r=n; const jejak=[];
  ps.forEach(p=>{ const lama=r; r=r/p*(p-1); jejak.push(`  ${lama} → bagi ${p}, kali ${p-1} → <span class="g">${r}</span>`); });
  ids.q('gcKout').innerHTML=
`n = ${n.toLocaleString('id-ID')}
faktorisasi: ${Object.entries(f).map(([p,e])=>e>1?`${p}^${e}`:p).join(' × ')||'1'}
faktor prima berbeda: ${ps.join(', ')||'(tidak ada)'}

${jejak.join('\n')||'  (tidak ada faktor prima)'}

<span class="g">φ(${n.toLocaleString('id-ID')}) = ${M.totient(n).toLocaleString('id-ID')}</span>

<span class="d">Perhatikan: yang dipakai hanya faktor prima BERBEDA — pangkatnya diabaikan.</span>`;
};
ids.q('gcKgo').click();

/* ---------- rumus phi(A/B) ---------- */
ids.q('gcXgo').onclick=()=>{
  const A=Math.min(200000,Math.max(1,ids.n('gcXa')||1));
  const B=Math.min(200000,Math.max(1,ids.n('gcXb')||1));
  const bagi = A%B===0;
  const jawab = bagi ? M.totient(A/B) : 0;
  let kasar=0; for(let C=1;C<=A;C++) if(M.gcd(A,C)===B) kasar++;
  ids.q('gcXout').innerHTML=
`CARA POLOS — hitung FPB untuk tiap C
  ${A.toLocaleString('id-ID')} kali hitung FPB
  hasil = <span class="g">${kasar.toLocaleString('id-ID')}</span>

JALAN PINTAS — dua langkah
  1. apakah ${B} membagi habis ${A}?  ${bagi?'YA':'<span class="k">TIDAK</span>'}
  ${bagi
    ? `2. φ(${A} ÷ ${B}) = φ(${A/B}) = <span class="g">${jawab}</span>`
    : `   tidak ada C yang memenuhi → <span class="g">0</span>`}

${kasar===jawab?'<span class="g">✓ DUA CARA SAMA</span>':'<span class="k">✗ beda</span>'}
<span class="d">${A.toLocaleString('id-ID')} hitungan jadi 2 langkah — sekitar ${Math.floor(A/2).toLocaleString('id-ID')} kali lebih ringan.</span>
<span class="d">Perhatikan: kamu tidak pernah menyentuh satu pun nilai C.</span>`;
};

ids.q('gcNgo').onclick=()=>{
  const A=Math.min(200000,Math.max(1,ids.n('gcNa')||1)), B=Math.max(1,ids.n('gcNb')||1);
  const habis=A%B===0;
  let langsung=null;
  if(A<=200000){ langsung=0; for(let c=1;c<=A;c++) if(M.gcd(A,c)===B) langsung++; }
  const cepat=habis?M.totient(A/B):0;
  const f=habis?M.faktorPrima(A/B):{};
  ids.q('gcNout').innerHTML=
`CARA 1 — periksa C = 1, 2, …, ${A.toLocaleString('id-ID')} satu per satu
  hasil = <span class="g">${langsung.toLocaleString('id-ID')}</span>   <span class="d">(${A.toLocaleString('id-ID')} kali hitung FPB)</span>

CARA 2 — jalan pintas
  Apakah ${B} membagi habis ${A}?  ${habis?'<span class="g">YA</span>':'<span class="k">TIDAK → jawabannya 0</span>'}
${habis?`  ${A.toLocaleString('id-ID')} ÷ ${B} = ${A/B}
  faktor prima ${A/B} = ${Object.keys(f).join(', ')||'(tidak ada)'}
  φ(${A/B}) = <span class="g">${cepat}</span>   <span class="d">(beberapa detik di kertas)</span>`:''}

${langsung===cepat?'<span class="g">✓ DUA CARA SAMA</span>':'<span class="k">✗ beda</span>'}`;
};
ids.q('gcNgo').click();

/* ---------- teorema Gauss ---------- */
ids.q('gcGgo').onclick=()=>{
  const n=Math.min(5000,Math.max(1,ids.n('gcGn')||30));
  const d=[]; for(let i=1;i<=n;i++) if(n%i===0) d.push(i);
  const ph=d.map(x=>M.totient(x)), tot=ph.reduce((a,b)=>a+b,0);
  const warna=['#C8102E','#136F51','#12263C','#7BACCE','#C9A227','#8E5AA8','#3E8E7E','#B4654A'];
  let bar='<div style="display:flex;height:38px;border:2px solid var(--tinta);border-radius:7px;overflow:hidden">';
  d.forEach((x,i)=>{
    const w=ph[i]/n*100;
    bar+=`<div title="φ(${x}) = ${ph[i]}" style="width:${w}%;background:${warna[i%warna.length]};
      display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--mono);
      font-size:11px;font-weight:600;overflow:hidden">${w>7?ph[i]:''}</div>`;
  });
  bar+='</div>';
  ids.q('gcGbar').innerHTML=bar+
    `<p class="tiny" style="text-align:center;margin-top:6px">tiap warna = satu pembagi, lebarnya = φ(pembagi itu) · total tepat memenuhi 100%</p>`;
  ids.q('gcGout').innerHTML=
`Pembagi ${n}: ${d.join(', ')}

${d.map((x,i)=>`  φ(${String(x).padStart(4)}) = ${ph[i]}`).join('\n')}
  ${'─'.repeat(18)}
  jumlah    = <span class="g">${tot}</span>

${tot===n?`<span class="g">✓ Sama dengan n = ${n}</span>`:'<span class="k">✗</span>'}`;
};
ids.q('gcGgo').click();

/* ---------- partisi menurut FPB ---------- */
ids.q('gcPago').onclick=()=>{
  const A=Math.min(60,Math.max(1,ids.n('gcPa')||12));
  const kel={};
  for(let c=1;c<=A;c++){ const g=M.gcd(A,c); (kel[g]=kel[g]||[]).push(c); }
  const kunci=Object.keys(kel).map(Number).sort((a,b)=>a-b);
  const warna=['#C8102E','#136F51','#12263C','#7BACCE','#C9A227','#8E5AA8','#3E8E7E','#B4654A','#5A7189'];
  let h='';
  kunci.forEach((g,i)=>{
    const c=warna[i%warna.length];
    h+=`<div style="margin-bottom:8px">
      <div class="tiny" style="font-family:var(--mono);margin-bottom:3px">
        FPB = <b style="color:${c}">${g}</b> &nbsp;·&nbsp; ${kel[g].length} bilangan &nbsp;·&nbsp; φ(${A}/${g}) = φ(${A/g}) = ${M.totient(A/g)}</div>
      <div>${kel[g].map(v=>`<span style="display:inline-block;min-width:28px;height:26px;line-height:24px;
        text-align:center;margin:1px;padding:0 4px;font-family:var(--mono);font-size:11.5px;font-weight:600;
        border-radius:5px;border:2px solid ${c};background:#fff;color:${c}">${v}</span>`).join('')}</div></div>`;
  });
  ids.q('gcPaviz').innerHTML=h;
  const jml=kunci.reduce((s,g)=>s+kel[g].length,0);
  ids.q('gcPaout').innerHTML=
`A = ${A}

${kunci.map(g=>`  FPB = ${String(g).padStart(3)} → ${String(kel[g].length).padStart(3)} bilangan   ${kel[g].length===M.totient(A/g)?`= φ(${A/g}) ✓`:'<span class="k">✗</span>'}`).join('\n')}
  ${'─'.repeat(34)}
  total = <span class="g">${jml}</span>   ${jml===A?`✓ sama dengan A = ${A} (teorema Gauss)`:'<span class="k">✗</span>'}

<span class="d">Soal OSN-K 2025 hanya menanyakan ukuran SATU kelompok.</span>`;
};
ids.q('gcPago').click();

/* ---------- soal asli ---------- */
ids.q('gcSolve').onclick=()=>{
  const opt=[4,9,17,18,34].map(b=>[b,M.gcd(24,b)]);
  const best=opt.reduce((a,b)=>b[1]>a[1]?b:a);
  ids.q('gcS1').innerHTML=
`MERAH = FPB, jadi tinggal hitung FPB-nya:

${opt.map(([b,g])=>`  FPB(24, ${String(b).padStart(2)}) = ${g}`).join('\n')}

<span class="g">→ terbesar: MERAH(24, ${best[0]}) = ${best[1]}</span>
<span class="d">24 = 2³×3, dan 18 = 2×3² — keduanya berbagi 2×3 = 6.</span>`;
  let brute1=0; for(let c=1;c<=12;c++) if(M.gcd(12,c)===3) brute1++;
  const c3=[]; for(let c=1;c<=12;c++) if(M.gcd(12,c)===3) c3.push(c);
  ids.q('gcS2').innerHTML=
`NUSANTARA(12,3) = berapa C dari 1..12 dengan FPB(12,C) = 3?

Apakah 3 membagi habis 12? YA → 12 ÷ 3 = 4
φ(4) = 4 × (1 − 1/2) = <span class="g">2</span>

Cek manual: C = ${c3.join(' dan ')}   <span class="d">(${brute1} bilangan)</span> ✓`;
  const f=M.faktorPrima(15);
  ids.q('gcS3').innerHTML=
`NUSANTARA(2025,135) = berapa C dari 1..2025 dengan FPB(2025,C) = 135?

Apakah 135 membagi habis 2025? YA → 2025 ÷ 135 = 15
15 = 3 × 5
φ(15) = 15 → bagi 3 kali 2 → 10 → bagi 5 kali 4 → <span class="g">8</span>

<span class="g">Jawaban: 8</span>
<span class="d">Tanpa jalan pintas: harus menghitung FPB sebanyak 2.025 kali.</span>`;
};

pasangTab('gcTrik'); pasangTab('gcTabs');
},
};
