/* ============================================================
   MODUL 02 — Digit Sum
   Rumus diverifikasi oleh verify/02-digit-sum.py
   ============================================================ */

import { M } from '../core/math.js';
import { bukaRumus } from '../core/ui.js';

export default {
  id: 'digitsum', n: '02', kelompok: 'Teori Bilangan',
  judul: 'Digit Sum',
  lede: 'Menjumlahkan digit sebuah bilangan. Sifat tersembunyinya: berapa kali pun dijumlahkan, sisa bagi 9-nya tidak pernah berubah — dan sifat itu bisa dipakai sebagai saringan yang memangkas pekerjaan sampai sembilan kali lipat.',
  lencana: ['<span class="chip r">2024 &amp; 2026</span>','<span class="chip v">Diuji n=1..19.999</span>'],
  kartu: [
    { q: 'while (x > 0) { total += x % 10; x /= 10; }', a: 'digitsum', why: 'Pasangan %10 dan /10 = keluarga digit.' },
    { q: 'return (X%10)*(X%10) + f(X/10);', a: 'lain', why: 'JEBAKAN — ini jumlah KUADRAT digit, bukan digit sum.' }
  ],
  kamus: [
    ['x % 10 dan x / 10', 'Digit sum / frekuensi digit'],
    ['“sisa bagi 11”', 'JEBAKAN — butuh jumlah berselang-seling, bukan digit sum'],
    ['“jumlahkan digitnya berulang sampai tersisa satu angka”',
     'Akar digit — ada rumus langsungnya, 1 + (n−1) mod 9'],
    ['“bilangan terkecil yang jumlah digitnya X”',
     'Isi angka 9 sebanyak mungkin dari belakang, sisanya ditaruh di depan'],
    ['“kelipatan Y terkecil yang jumlah digitnya X”',
     'Saring dulu: mustahil kalau X tidak habis dibagi FPB(Y, 9)'],
    ['bobot (k − x + 1) × (y − k + 1)',
     'Mencacah berbobot — tiap angka dihitung sebanyak rentang yang memuatnya'],
  ],
  bangun(root, { ids, pasangTab }) {
root.innerHTML=`
<!-- ============ APA ITU ============ -->
<div class="card">
  <h3>Apa itu Digit Sum?</h3>
  <p style="margin:10px 0"><b>Digit sum</b> (jumlah digit) adalah hasil menjumlahkan seluruh angka penyusun sebuah bilangan. Untuk 4587, digit sum-nya adalah 4 + 5 + 8 + 7 = 24. Selesai — sesederhana itu.</p>
  <p style="margin:10px 0">Kalau kamu <b>mengulang</b> proses itu sampai tersisa satu angka saja, hasilnya disebut <b>akar digit</b> (<i>digital root</i>): 4587 → 24 → 2 + 4 = <b>6</b>.</p>

  <div class="note">
    <b>Kenapa ini menarik?</b> Karena menjumlahkan digit terlihat seperti operasi yang membuang informasi — susunan angkanya hilang, nilai tempatnya hilang. Tapi ternyata ada satu hal yang <b>tidak pernah hilang</b>: sisa bagi 9.
    <br><br>
    4587 dibagi 9 bersisa 6. Dan 24 dibagi 9 juga bersisa 6. Dan 6 dibagi 9 bersisa 6. Berapa kali pun dijumlahkan, sisa bagi 9-nya tidak berubah.
  </div>

  <div class="note good">
    <b>Nama dan sejarahnya.</b> Sifat ini sudah dipakai pedagang berabad-abad lalu untuk memeriksa hitungan, jauh sebelum aritmetika modular dirumuskan. Namanya <b>"membuang sembilan"</b> (<i>casting out nines</i>): coret semua angka 9 dan semua pasangan yang berjumlah 9, lalu jumlahkan sisanya. Kalau hasil perkalian yang kamu hitung tidak cocok dengan pemeriksaan ini, pasti ada yang salah.
  </div>

  <h4 style="margin:18px 0 6px;font-size:14px">Kenapa penting untuk OSN-K?</h4>
  <p class="tiny" style="margin:0">Dua alasan. Pertama, potongan kode <code>x % 10</code> dan <code>x / 10</code> adalah cara baku membedah digit di C++, dan itu muncul berulang di Bagian C. Kedua — dan ini yang sering terlewat — sifat mod 9 bisa dipakai sebagai <b>saringan</b>: menyingkirkan sebagian besar kemungkinan sebelum kamu mulai menghitung. Muncul di OSN-K <b>2024</b> dan <b>2026</b>.</p>
</div>

<!-- ============ LAB 1: KENAPA MOD 9 ============ -->
<div class="lab">
  <div class="lab-head"><b>Lab 1 · Kenapa sisa bagi 9-nya sama?</b><span class="hint">bongkar nilai tempatnya</span></div>
  <div class="lab-body">
    <div class="ctl">
      <div class="f"><label>bilangan</label><input id="${ids.i('dn')}" type="number" value="4587" min="0" max="999999999"></div>
      <button class="btn" id="${ids.i('dgo')}">Bongkar</button>
    </div>
    <div id="${ids.i('dviz')}" style="margin:14px 0"></div>
    <div class="out" id="${ids.i('dout')}">Tekan “Bongkar” untuk mulai.</div>
  </div>
</div>

<div class="lockwrap">
  <div class="rumus locked" id="${ids.i('drumus')}">
    <span class="lbl">Inti seluruh modul ini</span>
    10 ≡ 1, 100 ≡ 1, 1000 ≡ 1, … &nbsp; <b>semua pangkat 10 ≡ 1 (mod 9)</b><br>
    maka bobot nilai tempat <b>lenyap</b>, tersisa jumlah digitnya saja<br>
    <mark>S(n) ≡ n (mod 9)</mark>
    <span class="tiny" style="display:block;margin-top:8px;color:var(--tinta-2)">✅ Diuji n = 1 sampai 50.000</span>
  </div>
  <div class="lockmsg" id="${ids.i('drumus-pesan')}">Bongkar satu bilangan dulu di Lab 1 — rumusnya lebih membekas kalau kamu sendiri yang melihat bobotnya lenyap.</div>
</div>

<!-- ============ LAB 2: RODA MOD 9 ============ -->
<div class="lab">
  <div class="lab-head"><b>Lab 2 · Roda mod 9</b><span class="hint">berapa kali pun dijumlahkan, posisinya tetap</span></div>
  <div class="lab-body">
    <div class="ctl">
      <div class="f"><label>bilangan</label><input id="${ids.i('dwn')}" type="number" value="4587" min="1" max="999999999"></div>
      <button class="btn" id="${ids.i('dwgo')}">Putar roda</button>
    </div>
    <div id="${ids.i('dwheel')}" style="max-width:330px;margin:6px auto 10px"></div>
    <div class="out" id="${ids.i('dwout')}">—</div>
  </div>
</div>

<!-- ============ CARA CEPAT ============ -->
<div class="card">
  <h3>Kumpulan cara cepat</h3>
  <p class="sub">Semua sudah diuji terhadap perhitungan langsung. Pilih sesuai bentuk soalnya.</p>
  <div class="tabs" id="${ids.i('dtrik')}">
    <button class="tab on" data-t="c1">Buang sembilan</button>
    <button class="tab" data-t="c2">Akar digit</button>
    <button class="tab" data-t="c3">Saringan mod 9</button>
    <button class="tab" data-t="c4">Bilangan terkecil</button>
    <button class="tab" data-t="c5">Keterbagian</button>
    <button class="tab" data-t="c6">Sifat lain</button>
  </div>

  <div class="tp on" data-t="c1">
    <p style="margin:0 0 10px">Untuk mencari akar digit, kamu <b>tidak perlu menjumlahkan semua angkanya</b>. Coret dulu semua 9, lalu coret pasangan yang berjumlah 9. Jumlahkan yang tersisa.</p>
    <div class="ctl">
      <div class="f wide"><label>bilangan</label><input id="${ids.i('dcn')}" value="5624398"></div>
      <button class="btn" id="${ids.i('dcgo')}">Buang sembilan</button>
    </div>
    <div id="${ids.i('dcviz')}" style="margin:14px 0"></div>
    <div class="out" id="${ids.i('dcout')}">—</div>
  </div>

  <div class="tp" data-t="c2">
    <p style="margin:0 0 10px">Kalau soal meminta hasil penjumlahan berulang sampai satu angka, ada rumus langsungnya — tidak perlu mengulang sama sekali:</p>
    <div class="rumus">
      <span class="lbl">Akar digit · terverifikasi n = 1..50.000</span>
      dr(n) = <mark>1 + (n − 1) mod 9</mark> &nbsp; untuk n &gt; 0<br>
      <span style="font-size:12.5px;color:var(--tinta-2)">setara: dr(n) = n mod 9, kecuali kalau n kelipatan 9 maka hasilnya 9</span>
    </div>
    <div class="ctl">
      <div class="f"><label>n</label><input id="${ids.i('drn')}" type="number" value="123456789" min="1"></div>
      <button class="btn" id="${ids.i('drgo')}">Bandingkan dua cara</button>
    </div>
    <div class="out" id="${ids.i('drout')}">—</div>
    <div class="note" style="margin-top:12px"><b>Bonus — memeriksa hitungan.</b> Akar digit "tahan" terhadap penjumlahan dan perkalian:
    <br>dr(a + b) = dr(dr(a) + dr(b)) &nbsp;·&nbsp; dr(a × b) = dr(dr(a) × dr(b))
    <br>Jadi kalau kamu menghitung 4587 × 213 dan hasilmu akar digitnya tidak cocok, pasti ada yang salah. ✅ Diuji ribuan pasangan.</div>
  </div>

  <div class="tp" data-t="c3">
    <p style="margin:0 0 10px">Ini yang paling terasa curang. Kalau soal meminta <b>bilangan terkecil kelipatan Y yang digit sum-nya X</b> (persis soal OSN-K 2024), kamu tidak perlu memeriksa semua kelipatan.</p>
    <div class="rumus" style="text-align:left">
      <span class="lbl">Saringan</span>
      Karena S(v) ≡ v (mod 9), maka kandidat v hanya mungkin bila<br>
      <mark>v mod 9 = X mod 9</mark><br>
      <span style="font-size:12.5px;color:var(--tinta-2)">Kelipatan yang tidak memenuhi ini <b>tidak perlu dijumlahkan digitnya sama sekali</b> — langsung lewati.</span>
    </div>
    <div class="note warn" style="margin-top:12px"><b>Dan ada kejutan:</b> pencarian itu bisa <b>tidak pernah berhenti</b>. Kelipatan Y hanya bisa menghasilkan sisa-bagi-9 berupa kelipatan FPB(Y, 9). Jadi solusinya <b>ada</b> hanya bila:
    <div class="rumus" style="margin:10px 0 0"><mark>X mod FPB(Y, 9) = 0</mark></div>
    <span class="tiny" style="display:block;margin-top:8px">Contoh: Y = 3 dan X = 1 → FPB(3, 9) = 3, dan 1 bukan kelipatan 3 → <b>mustahil</b>, program akan berputar selamanya. ✅ Terverifikasi Y = 1..39, X = 1..19.</span></div>
    <div class="ctl" style="margin-top:12px">
      <div class="f"><label>X (digit sum)</label><input id="${ids.i('dfx')}" type="number" value="2" min="1" max="60"></div>
      <div class="f"><label>Y (kelipatan)</label><input id="${ids.i('dfy')}" type="number" value="35" min="1" max="999"></div>
      <button class="btn" id="${ids.i('dfgo')}">Cari dengan saringan</button>
    </div>
    <div class="out" id="${ids.i('dfout')}">—</div>
  </div>

  <div class="tp" data-t="c4">
    <p style="margin:0 0 10px">Untuk mencari <b>bilangan terkecil</b> yang digit sum-nya X: isi dari belakang dengan angka 9 sebanyak mungkin, sisanya taruh di depan.</p>
    <div class="rumus">
      <span class="lbl">Serakah dari belakang · terverifikasi X = 1..35</span>
      X = 20 → sisa 2, lalu 9, 9 → <mark>299</mark><br>
      X = 27 → 9, 9, 9 → <mark>999</mark><br>
      X = 28 → sisa 1, lalu 9, 9, 9 → <mark>1999</mark>
    </div>
    <p class="tiny">Alasannya: memperbanyak digit membuat bilangan makin besar, jadi pakai digit sesedikit mungkin — artinya tiap digit dibuat semaksimal mungkin, yaitu 9. Lalu sisanya diletakkan di depan supaya nilainya paling kecil.</p>
    <div class="ctl">
      <div class="f"><label>X</label><input id="${ids.i('dsx')}" type="number" value="20" min="1" max="90"></div>
      <button class="btn" id="${ids.i('dsgo')}">Susun</button>
    </div>
    <div class="out" id="${ids.i('dsout')}">—</div>
  </div>

  <div class="tp" data-t="c5">
    <p style="margin:0 0 10px">Semua aturan ini turunan langsung dari sifat yang sama. ✅ Diuji n = 1..30.000.</p>
    <div class="scroll"><table class="t" style="text-align:left">
      <tr><th style="text-align:left">Habis dibagi</th><th style="text-align:left">Cara cek</th></tr>
      <tr><td>2, 5, 10</td><td style="text-align:left">lihat digit terakhir</td></tr>
      <tr><td>4, 25</td><td style="text-align:left">lihat 2 digit terakhir</td></tr>
      <tr><td>8, 125</td><td style="text-align:left">lihat 3 digit terakhir</td></tr>
      <tr><td><b>3</b></td><td style="text-align:left"><b>digit sum</b> habis dibagi 3</td></tr>
      <tr><td><b>9</b></td><td style="text-align:left"><b>digit sum</b> habis dibagi 9</td></tr>
      <tr><td><b>11</b></td><td style="text-align:left"><b>jumlah berselang-seling</b> (+,−,+,− dari kanan) habis dibagi 11</td></tr>
    </table></div>
    <div class="note warn" style="margin-top:12px"><b>Jebakan mod 11.</b> Digit sum biasa <b>tidak berlaku</b> untuk 11, karena 10 ≡ −1 (mod 11), bukan +1. Tandanya berganti-ganti. Ini pembeda antara siswa yang paham dan yang cuma hafal.</div>
    <div class="ctl" style="margin-top:12px">
      <div class="f"><label>n</label><input id="${ids.i('dbagin')}" type="number" value="918273" min="1"></div>
      <button class="btn" id="${ids.i('dbagigo')}">Cek semua</button>
    </div>
    <div class="out" id="${ids.i('dbagiout')}">—</div>
  </div>

  <div class="tp" data-t="c6">
    <div class="rumus" style="text-align:left">
      <span class="lbl">Sifat yang sering dipakai menyaring pilihan jawaban</span>
      1. <mark>S(n) ≤ 9 × banyaknya digit</mark> — sama dengan hanya bila semua digitnya 9<br><br>
      2. Menambah 1: <mark>S(n+1) = S(n) + 1 − 9 × (banyak 9 di ekor)</mark><br>
      <span style="font-size:12.5px;color:var(--tinta-2)">contoh: S(199) = 19, ada dua 9 di ekor → S(200) = 19 + 1 − 18 = 2 ✓</span><br><br>
      3. <mark>S(n) tidak berubah kalau digitnya diacak</mark> — 4587, 8754, 7845 semuanya 24<br><br>
      4. <mark>Σ S(i) untuk i = 1..10ᵏ−1 = 45 · k · 10ᵏ⁻¹</mark>
      <span style="font-size:12.5px;color:var(--tinta-2);display:block">contoh: jumlah digit sum dari 1 sampai 999 = 45 × 3 × 100 = 13.500</span>
    </div>
    <p class="tiny">✅ Keempatnya diuji: sifat 1–3 untuk n = 1..50.000, sifat 4 untuk k = 1..5.</p>
  </div>
</div>

<!-- ============ PENYAMARAN ============ -->
<div class="card">
  <h3>Penyamaran</h3>
  <p class="sub">Ciri khas keluarga digit adalah pasangan operasi <code>% 10</code> dan <code>/ 10</code> — bukan bentuk kodenya.</p>
  <div class="tabs" id="${ids.i('dtabs')}">
    <button class="tab on" data-t="a">A · Rekursif</button>
    <button class="tab" data-t="b">B · Perulangan</button>
    <button class="tab" data-t="c">C · Frekuensi digit</button>
    <button class="tab" data-t="d">D · Cerita</button>
    <button class="tab" data-t="e">E · Jebakan</button>
  </div>
  <div class="tp on" data-t="a">
    <pre class="code"><span class="kw">int</span> <span class="fn">panas</span>(<span class="kw">int</span> X) {
  <span class="kw">if</span> (X==0) <span class="kw">return</span> 0;
  <span class="kw">else</span> <span class="kw">return</span> (X%10) + <span class="fn">panas</span>(X/10);
}</pre>
    <div class="note"><b>Bentuk asli OSN-K 2024.</b> <code>X%10</code> mengambil digit paling kanan, <code>X/10</code> membuangnya. ✅ Terverifikasi identik dengan digit sum untuk n = 0..19.999.</div>
  </div>
  <div class="tp" data-t="b">
    <pre class="code"><span class="kw">int</span> total = 0, sisa = N;
<span class="kw">while</span> (sisa &gt; 0) { total += sisa % 10; sisa /= 10; }</pre>
    <div class="note">Tanpa rekursi sama sekali, nama variabel berbeda total. Tapi pasangan operasinya sama persis.</div>
  </div>
  <div class="tp" data-t="c">
    <pre class="code"><span class="kw">void</span> <span class="fn">CAMPUR</span>(vector&lt;<span class="kw">int</span>&gt; &amp;C, <span class="kw">int</span> x) {
  <span class="kw">while</span> (x &gt; 0) { C[x % 10]++; x /= 10; }
}</pre>
    <div class="note warn"><b>OSN-K 2026.</b> Ini <b>bukan</b> menjumlahkan digit — ini <b>menghitung berapa kali</b> tiap digit muncul. Keluarga yang sama, tujuan berbeda. Perhatikan: <code>C[x%10]++</code> bukan <code>total += x%10</code>.</div>
  </div>
  <div class="tp" data-t="d">
    <div class="note">"Kode keanggotaan valid jika jumlah seluruh digitnya habis dibagi 9. Kode 4587 → 4+5+8+7 = 24, tidak habis dibagi 9 → tidak valid."</div>
    <p class="tiny">Tidak ada kode sama sekali, tapi ini aturan keterbagian 9 — jadi keluarga digit sum.</p>
  </div>
  <div class="tp" data-t="e">
    <pre class="code"><span class="kw">return</span> (X%10)*(X%10) + <span class="fn">f</span>(X/10);</pre>
    <div class="note warn">Mirip sekali, tapi ini <b>jumlah kuadrat digit</b> — sifat mod 9-nya <b>tidak berlaku</b>. Baca operatornya, bukan bentuknya.</div>
    <pre class="code" style="margin-top:12px"><span class="kw">while</span> (x &gt; 0) { total = total*10 + x%10; x /= 10; }</pre>
    <div class="note warn">Ini <b>membalik bilangan</b>, bukan menjumlahkan digit. Perhatikan <code>total*10 +</code>.</div>
  </div>
</div>

<!-- ============ SOAL ASLI ============ -->
<div class="card">
  <h3>Bedah soal asli OSN-K</h3>
  <div class="tabs" id="${ids.i('dsoal')}">
    <button class="tab on" data-t="s24">OSN-K 2024 · soal 35–37</button>
    <button class="tab" data-t="s26">OSN-K 2026 · soal 29–31</button>
  </div>

  <div class="tp on" data-t="s24">
    <p class="tiny" style="margin:0 0 10px">Kode <code>panas</code> (digit sum) dan <code>dingin(X,Y)</code> — mencari kelipatan Y terkecil yang digit sum-nya X.</p>
    <div class="grid2">
      <div><div class="chip r">Soal 35</div><p style="margin:8px 0 0"><code>dingin(10, 7)</code>?</p><div class="out" style="margin-top:8px" id="${ids.i('da1')}">—</div></div>
      <div><div class="chip r">Soal 36</div><p style="margin:8px 0 0"><code>dingin(2, 35)</code>?</p><div class="out" style="margin-top:8px" id="${ids.i('da2')}">—</div></div>
      <div><div class="chip r">Soal 37</div><p style="margin:8px 0 0">Berapa pasang &lt;X,Y&gt; berbeda dengan <code>dingin(X,Y) = 77</code>?</p><div class="out" style="margin-top:8px" id="${ids.i('da3')}">—</div></div>
    </div>
    <button class="btn" id="${ids.i('dsolve24')}" style="margin-top:14px">Selesaikan ketiganya</button>
  </div>

  <div class="tp" data-t="s26">
    <p class="tiny" style="margin:0 0 10px">Kode <code>CAMPUR</code> (hitung frekuensi digit), <code>ADUK</code> (untuk satu rentang), <code>RATA</code> (untuk semua sub-rentang).</p>
    <div class="grid2">
      <div><div class="chip r">Soal 29</div><p style="margin:8px 0 0">x terkecil sehingga <code>CAMPUR(C,x)</code> menghasilkan {1,0,2,0,0,0,1,0,0,1}?</p><div class="out" style="margin-top:8px" id="${ids.i('db1')}">—</div></div>
      <div><div class="chip r">Soal 30</div><p style="margin:8px 0 0"><code>ADUK(C, 997, 1018)</code> → berapa C[0]?</p><div class="out" style="margin-top:8px" id="${ids.i('db2')}">—</div></div>
      <div><div class="chip r">Soal 31</div><p style="margin:8px 0 0"><code>RATA(C, 997, 1018)</code> → berapa C[9]?</p><div class="out" style="margin-top:8px" id="${ids.i('db3')}">—</div></div>
    </div>
    <button class="btn" id="${ids.i('dsolve26')}" style="margin-top:14px">Selesaikan ketiganya</button>
    <div class="note" style="margin-top:14px"><b>Trik bobot untuk soal 31.</b> <code>RATA</code> punya tiga loop bersarang — mustahil ditelusuri di kertas. Tapi perhatikan: angka k ikut dihitung setiap kali ada pasangan (i, j) dengan i ≤ k ≤ j. Banyaknya pasangan itu:
    <div class="rumus" style="margin:10px 0"><mark>bobot(k) = (k − x + 1) × (y − k + 1)</mark></div>
    Jadi cukup hitung bobot tiap angka lalu kalikan dengan frekuensi digitnya — <b>22 perhitungan</b>, bukan 2.024 pemanggilan.
    <span class="tiny" style="display:block;margin-top:6px">✅ Terverifikasi identik dengan menjalankan RATA asli pada 7 rentang uji.</span></div>
    <div class="ctl" style="margin-top:12px">
      <div class="f"><label>dari x</label><input id="${ids.i('dbx')}" type="number" value="997" min="1"></div>
      <div class="f"><label>sampai y</label><input id="${ids.i('dby')}" type="number" value="1018" min="1"></div>
      <div class="f"><label>digit</label><input id="${ids.i('dbd')}" type="number" value="9" min="0" max="9"></div>
      <button class="btn alt" id="${ids.i('dbgo')}">Hitung dengan bobot</button>
    </div>
    <div class="out" id="${ids.i('dbout')}">—</div>
  </div>
</div>

<div class="note warn">
  <b>Kapan ini BUKAN digit sum.</b>
  <table class="t" style="margin-top:10px;background:transparent">
    <tr><th style="text-align:left">Bentuk</th><th style="text-align:left">Sebenarnya</th></tr>
    <tr><td style="text-align:left"><code>total += x%10; x/=10;</code></td><td style="text-align:left">✅ Digit sum</td></tr>
    <tr><td style="text-align:left"><code>C[x%10]++; x/=10;</code></td><td style="text-align:left">⚠️ Frekuensi digit (keluarga sama, tujuan beda)</td></tr>
    <tr><td style="text-align:left"><code>total = total*10 + x%10;</code></td><td style="text-align:left">❌ Membalik bilangan</td></tr>
    <tr><td style="text-align:left"><code>total += (x%10)*(x%10);</code></td><td style="text-align:left">❌ Jumlah kuadrat digit — sifat mod 9 gugur</td></tr>
    <tr><td style="text-align:left">"sisa bagi <b>11</b>"</td><td style="text-align:left">❌ Butuh jumlah berselang-seling</td></tr>
  </table>
</div>

<div class="note good">
  <b>Verifikasi 30 detik sebelum menulis jawaban.</b> Ambil bilangan kecil yang kamu bisa hitung dengan tangan — 4587 misalnya. Jumlahkan digitnya, lalu bagi 9. Sisanya harus sama dengan sisa bagi 9 bilangan aslinya.
  <br><br>
  Kalau soalnya mencari kelipatan Y dengan digit sum X, cek dulu apakah X habis dibagi FPB(Y, 9). Kalau tidak, jawabannya <b>tidak ada</b> — dan kamu baru saja menghemat lima menit.
</div>`;

/* ---------- LAB 1: pembongkaran nilai tempat ---------- */
ids.q('dgo').onclick=()=>{
  bukaRumus(ids, 'drumus');
  const n=Math.max(0,ids.n('dn')||0), d=M.digits(n), L=d.length, s=M.digitSum(n);
  const cell=(isi,warna,kecil)=>`<div style="display:inline-block;text-align:center;margin:2px 3px">
     <div style="font-family:var(--mono);font-size:${kecil?12:17}px;font-weight:600;border:2px solid var(--garis-tebal);
          border-radius:6px;width:${kecil?52:34}px;height:38px;line-height:34px;background:#fff">${isi}</div>
     <div class="tiny" style="margin-top:3px;color:${warna}">${kecil?'≡ 1':''}</div></div>`;
  let baris1='', baris2='';
  d.forEach((dg,i)=>{
    const pow=L-1-i;
    baris1+=`<div style="display:inline-block;text-align:center;margin:2px 3px">
      <div style="font-family:var(--mono);font-size:17px;font-weight:600;border:2px solid var(--tinta);
           border-radius:6px;width:34px;height:38px;line-height:34px;background:#fff">${dg}</div>
      <div class="tiny" style="margin-top:3px">×10<sup>${pow}</sup></div></div>`;
    baris2+=`<div style="display:inline-block;text-align:center;margin:2px 3px">
      <div style="font-family:var(--mono);font-size:17px;font-weight:600;border:2px solid var(--merah);
           border-radius:6px;width:34px;height:38px;line-height:34px;background:var(--merah-pucat)">${dg}</div>
      <div class="tiny" style="margin-top:3px;color:var(--merah)">×1</div></div>`;
  });
  ids.q('dviz').innerHTML=
    `<div style="text-align:center">
       <div class="tiny" style="margin-bottom:4px">nilai tempat asli</div>${baris1}
       <div style="font-size:20px;color:var(--merah);margin:8px 0;font-family:var(--mono)">↓ semua 10<sup>k</sup> ≡ 1 (mod 9) ↓</div>
       <div class="tiny" style="margin-bottom:4px">bobotnya lenyap</div>${baris2}
     </div>`;
  ids.q('dout').innerHTML=
`${n} = ${d.map((dg,i)=>`${dg}×10^${L-1-i}`).join(' + ')}

Karena setiap 10^k bersisa 1 saat dibagi 9:
    ≡ ${d.join(' + ')}   (mod 9)
    = ${s}

<span class="g">${n} mod 9 = ${n%9}</span>
<span class="g">${s} mod 9 = ${s%9}</span>   ${n%9===s%9?'✓ sama':'<span class="k">✗</span>'}`;
};

/* ---------- LAB 2: roda mod 9 (SVG) ---------- */
ids.q('dwgo').onclick=()=>{
  const n=Math.max(1,ids.n('dwn')||1);
  const rantai=[n]; let x=n;
  while(x>9){ x=M.digitSum(x); rantai.push(x); }
  const pos=n%9, R=110, cx=165, cy=155;
  let sv=`<svg viewBox="0 0 330 300" width="100%" role="img" aria-label="Roda mod 9">`;
  sv+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--garis-tebal)" stroke-width="2" stroke-dasharray="4 4"/>`;
  for(let i=0;i<9;i++){
    const a=-Math.PI/2+2*Math.PI*i/9, X=cx+R*Math.cos(a), Y=cy+R*Math.sin(a);
    const aktif=(i===pos);
    sv+=`<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="${aktif?24:18}" `+
        `fill="${aktif?'var(--stabilo)':'#fff'}" stroke="var(--tinta)" stroke-width="${aktif?3:2}"/>`;
    sv+=`<text x="${X.toFixed(1)}" y="${(Y+5).toFixed(1)}" text-anchor="middle" `+
        `style="font-family:var(--mono);font-size:${aktif?16:14}px;font-weight:600;fill:var(--tinta)">${i}</text>`;
  }
  sv+=`<text x="${cx}" y="${cy-10}" text-anchor="middle" style="font-family:var(--mono);font-size:12px;fill:var(--tinta-2)">sisa bagi 9</text>`;
  sv+=`<text x="${cx}" y="${cy+18}" text-anchor="middle" style="font-family:var(--disp);font-size:30px;font-weight:700;fill:var(--merah)">${pos}</text>`;
  sv+=`<text x="${cx}" y="${cy+40}" text-anchor="middle" style="font-family:var(--mono);font-size:11px;fill:var(--tinta-3)">untuk SEMUA ${rantai.length} langkah</text>`;
  sv+='</svg>';
  ids.q('dwheel').innerHTML=sv;
  ids.q('dwout').innerHTML=
`Rantai penjumlahan digit:
  ${rantai.join('  →  ')}

Sisa bagi 9 di setiap langkah:
  ${rantai.map(v=>v%9).join('  →  ')}

<span class="g">Semuanya mendarat di posisi ${pos} pada roda — tidak pernah bergeser.</span>

Akar digit (angka terakhir rantai) = <span class="g">${rantai[rantai.length-1]}</span>
Rumus 1 + (n−1) mod 9 = 1 + (${n}−1) mod 9 = <span class="g">${M.digitalRoot(n)}</span>  ${rantai[rantai.length-1]===M.digitalRoot(n)?'✓ cocok':'<span class="k">✗</span>'}`;
};
ids.q('dwgo').click();

/* ---------- buang sembilan ---------- */
ids.q('dcgo').onclick=()=>{
  const raw=(ids.q('dcn').value||'').replace(/\D/g,'')||'0';
  const d=raw.split('').map(Number);
  const dibuang=new Array(d.length).fill(false);
  // 1) buang semua angka 9
  d.forEach((v,i)=>{ if(v===9) dibuang[i]=true; });
  // 2) buang pasangan yang berjumlah 9
  for(let i=0;i<d.length;i++){ if(dibuang[i]) continue;
    for(let j=i+1;j<d.length;j++){ if(dibuang[j]) continue;
      if(d[i]+d[j]===9){ dibuang[i]=true; dibuang[j]=true; break; } } }
  const sisa=d.filter((_,i)=>!dibuang[i]);
  const jml=sisa.reduce((a,b)=>a+b,0);
  const cell=(v,buang)=>`<span style="display:inline-block;width:34px;height:40px;line-height:40px;text-align:center;
    font-family:var(--mono);font-size:18px;font-weight:600;margin:2px;border-radius:6px;
    border:2px solid ${buang?'var(--garis-tebal)':'var(--merah)'};
    background:${buang?'var(--kertas)':'#fff'};color:${buang?'var(--tinta-3)':'var(--tinta)'};
    text-decoration:${buang?'line-through':'none'}">${v}</span>`;
  ids.q('dcviz').innerHTML=
    `<div style="text-align:center">${d.map((v,i)=>cell(v,dibuang[i])).join('')}
     <div class="tiny" style="margin-top:8px">abu-abu dicoret (9 atau pasangan berjumlah 9) · merah tersisa</div></div>`;
  const n=parseInt(raw,10), penuh=M.digitSum(n), akar=M.digitalRoot(n);
  ids.q('dcout').innerHTML=
`Yang dicoret : ${d.filter((_,i)=>dibuang[i]).join(', ')||'(tidak ada)'}
Yang tersisa : ${sisa.join(' + ')||'0'} = <span class="g">${jml}</span>
Akar digit dari sisa = <span class="g">${M.digitalRoot(jml||9)===9&&jml===0?0:M.digitalRoot(jml)}</span>

Cara panjang: jumlahkan semua ${d.length} digit = ${penuh}, lalu ulangi sampai satu angka = <span class="g">${akar}</span>

${(jml===0?0:M.digitalRoot(jml))===(n===0?0:akar)?'<span class="g">✓ HASILNYA SAMA — kamu baru saja melewati '+(d.length-sisa.length)+' penjumlahan</span>':'<span class="d">(catatan: bila semua digit tercoret, akar digitnya 9 untuk n kelipatan 9)</span>'}`;
};
ids.q('dcgo').click();

/* ---------- akar digit ---------- */
ids.q('drgo').onclick=()=>{
  const n=Math.max(1,ids.n('drn')||1);
  const rantai=[n]; let x=n;
  while(x>9){ x=M.digitSum(x); rantai.push(x); }
  ids.q('drout').innerHTML=
`CARA 1 — jumlahkan berulang
  ${rantai.join(' → ')}
  hasil = <span class="g">${rantai[rantai.length-1]}</span>   <span class="d">(${rantai.length-1} kali penjumlahan)</span>

CARA 2 — rumus langsung
  1 + (${n} − 1) mod 9 = 1 + ${(n-1)%9} = <span class="g">${M.digitalRoot(n)}</span>   <span class="d">(satu langkah)</span>

${rantai[rantai.length-1]===M.digitalRoot(n)?'<span class="g">✓ DUA CARA SAMA</span>':'<span class="k">✗</span>'}`;
};
ids.q('drgo').click();

/* ---------- saringan mod 9 ---------- */
ids.q('dfgo').onclick=()=>{
  const X=Math.min(60,Math.max(1,ids.n('dfx')||2)), Y=Math.min(999,Math.max(1,ids.n('dfy')||35));
  const g=M.gcd(Y,9);
  if(X%g!==0){
    ids.q('dfout').innerHTML=
`X = ${X}, Y = ${Y}
FPB(${Y}, 9) = ${g}
${X} mod ${g} = ${X%g} ≠ 0

<span class="k">✗ MUSTAHIL — tidak ada kelipatan ${Y} yang digit sum-nya ${X}.</span>
<span class="d">Kalau dijalankan, program aslinya akan berputar SELAMANYA.
Saringan ini menghemat kamu dari pencarian yang tak berujung.</span>`;
    return;
  }
  let v=0, cekPenuh=0, cekSaring=0, hasil=null, lewat=[];
  for(let m=0;m<200000;m++){
    cekPenuh++;
    if(v%9===X%9){ cekSaring++; if(M.digitSum(v)===X){ hasil=v; break; } if(lewat.length<6&&m>0) lewat.push(v); }
    v+=Y;
  }
  ids.q('dfout').innerHTML= hasil===null
   ? `<span class="d">Tidak ketemu dalam 200.000 kelipatan — kemungkinan angkanya sangat besar.</span>`
   : `X = ${X}, Y = ${Y}   →   perlu v dengan v mod 9 = ${X%9}

Kelipatan yang LOLOS saringan dan sempat diperiksa:
  ${lewat.length?lewat.join(', ')+', …':''} <span class="g">${hasil}</span>  ← ketemu

<span class="g">Jawaban: ${hasil.toLocaleString('id-ID')}</span>   digit sum = ${M.digitSum(hasil)}

Tanpa saringan : periksa <b>${cekPenuh.toLocaleString('id-ID')}</b> kelipatan
Dengan saringan: periksa <b>${cekSaring.toLocaleString('id-ID')}</b> kelipatan
<span class="g">→ ${(cekPenuh/Math.max(cekSaring,1)).toFixed(1)}× lebih sedikit pekerjaan</span>`;
};
ids.q('dfgo').click();

/* ---------- bilangan terkecil ---------- */
ids.q('dsgo').onclick=()=>{
  const X=Math.min(500,Math.max(1,ids.n('dsx')||20));
  const res=M.kecilDigitSum(X);
  const banyak9=Math.floor(X/9), sisa=X%9;
  ids.q('dsout').innerHTML=
`X = ${X}
  ${X} ÷ 9 = ${banyak9} sisa ${sisa}
  → pakai ${banyak9} angka 9${sisa?`, ditambah angka ${sisa} di depan`:''}

<span class="g">Bilangan terkecil = ${res.toLocaleString('id-ID')}</span>
  <span class="d">punya ${String(res).length} digit</span>
  cek digit sum-nya = ${M.digitSum(res)}   ${M.digitSum(res)===X?'✓':'<span class="k">✗</span>'}

<span class="d">Bilangan lain dengan digit sum ${X} pasti lebih besar,
karena butuh lebih banyak digit atau digit depannya lebih besar.</span>`;
};
ids.q('dsgo').click();

/* ---------- keterbagian ---------- */
ids.q('dbagigo').onclick=()=>{
  const n=Math.max(1,ids.n('dbagin')||1), s=M.digitSum(n), a=M.altSum(n);
  const d=M.digits(n);
  const tanda=d.slice().reverse().map((v,i)=>(i%2?'−':'+')+v).reverse().join(' ');
  ids.q('dbagiout').innerHTML=
`n = ${n.toLocaleString('id-ID')}
digit sum          = ${s}
jumlah selang-seling = ${tanda} = ${a}

  habis dibagi 3  ? ${s%3===0?'<span class="g">YA</span>':'<span class="k">tidak</span>'}   <span class="d">(karena ${s} ${s%3===0?'habis':'tidak habis'} dibagi 3)</span>   cek: ${n%3===0?'ya':'tidak'} ${((s%3===0)===(n%3===0))?'✓':'✗'}
  habis dibagi 9  ? ${s%9===0?'<span class="g">YA</span>':'<span class="k">tidak</span>'}   <span class="d">(karena ${s} ${s%9===0?'habis':'tidak habis'} dibagi 9)</span>   cek: ${n%9===0?'ya':'tidak'} ${((s%9===0)===(n%9===0))?'✓':'✗'}
  habis dibagi 11 ? ${a%11===0?'<span class="g">YA</span>':'<span class="k">tidak</span>'}   <span class="d">(pakai jumlah selang-seling ${a})</span>   cek: ${n%11===0?'ya':'tidak'} ${((a%11===0)===(n%11===0))?'✓':'✗'}

<span class="d">Perhatikan: kalau kamu memakai digit sum untuk menguji 11, hasilnya akan salah.
Untuk n ini, digit sum ${s} ${s%11===0?'habis':'tidak habis'} dibagi 11 — sementara jawaban benarnya ${n%11===0?'habis':'tidak habis'} dibagi 11.</span>`;
};
ids.q('dbagigo').click();

/* ---------- soal asli 2024 ---------- */
ids.q('dsolve24').onclick=()=>{
  const din=(X,Y)=>{ let v=0; for(let m=0;m<500000;m++){ if(M.digitSum(v)===X) return v; v+=Y; } return null; };
  const a1=din(10,7);
  let jalur=[]; for(let v=0;v<=a1;v+=7) jalur.push(`${v}(${M.digitSum(v)})`);
  ids.q('da1').innerHTML=
`Kelipatan 7 dan digit sum-nya:
  ${jalur.join('  ')}
<span class="g">Jawaban: ${a1}</span>

<span class="d">Saringan: 10 mod 9 = 1, jadi hanya kelipatan
yang bersisa 1 saat dibagi 9 yang perlu dicek → ${a1} saja.</span>`;
  const a2=din(2,35);
  ids.q('da2').innerHTML=
`X = 2 → butuh v dengan v mod 9 = 2
Y = 35 → FPB(35, 9) = 1, jadi solusinya ADA.

Digit sum 2 berarti bentuknya 2, 11, 20, 101, 110, 200, …
dan harus kelipatan 35 (artinya kelipatan 5 dan 7).

<span class="g">Jawaban: ${a2.toLocaleString('id-ID')}</span>   (= 35 × ${a2/35}, digit sum ${M.digitSum(a2)})`;
  const pembagi=[1,7,11,77].map(y=>[y,din(14,y)]);
  ids.q('da3').innerHTML=
`Langkah 1 — X wajib = digit sum 77 = <b>${M.digitSum(77)}</b>
Langkah 2 — 77 harus kelipatan Y → Y pembagi 77 = 1, 7, 11, 77
Langkah 3 — cek mana yang 77-nya benar-benar TERKECIL:

${pembagi.map(([y,h])=>`  Y=${String(y).padStart(2)} → dingin(14,${y}) = ${String(h).padStart(3)}  ${h===77?'<span class="g">✓ sah</span>':'<span class="k">✗ '+h+' lebih kecil</span>'}`).join('\n')}

<span class="g">Jawaban: ${pembagi.filter(p=>p[1]===77).length} pasang</span>
${pembagi.filter(p=>p[1]===77).map(p=>`  <${M.digitSum(77)}, ${p[0]}>`).join('\n')}`;
};

/* ---------- soal asli 2026 ---------- */
ids.q('dsolve26').onclick=()=>{
  const target=[1,0,2,0,0,0,1,0,0,1];
  let dg=[]; target.forEach((c,d)=>{ for(let i=0;i<c;i++) dg.push(String(d)); });
  dg.sort();
  const depan=dg.find(c=>c!=='0'); const sisa=dg.slice(); sisa.splice(sisa.indexOf(depan),1);
  const x=parseInt(depan+sisa.join(''),10);
  ids.q('db1').innerHTML=
`C = {${target.join(',')}} artinya:
  digit 0 muncul 1×, digit 2 muncul 2×,
  digit 6 muncul 1×, digit 9 muncul 1×
  → bahan: ${dg.join(', ')}   (${dg.length} digit)

Supaya terkecil: digit depan pilih yang terkecil
tapi TIDAK boleh 0 → ${depan}
lalu sisanya urut menaik → ${sisa.join('')}

<span class="g">Jawaban: ${x.toLocaleString('id-ID')}</span>`;
  let c0=0; for(let k=997;k<=1018;k++) c0+=String(k).split('').filter(c=>c==='0').length;
  ids.q('db2').innerHTML=
`ADUK hanya menjalankan CAMPUR sekali untuk tiap
angka dari 997 sampai 1018. Jadi C[0] = banyaknya
angka '0' pada seluruh bilangan itu.

  997, 998, 999        → tidak ada 0
  1000                 → 3 buah 0
  1001..1009           → 2 buah 0 masing-masing
  1010                 → 2 buah 0
  1011..1018           → 1 buah 0 masing-masing

<span class="g">Jawaban: C[0] = ${c0}</span>`;
  ids.q('dbgo').click();
  const r=M.rataBobot(997,1018);
  ids.q('db3').innerHTML=
`RATA memanggil ADUK untuk SEMUA pasangan (i,j).
Angka k ikut terhitung sebanyak (k−997+1) × (1018−k+1) kali.

  k=997  → 1 × 22 = 22
  k=1007 → 11 × 12 = 132   ← bobot terbesar (di tengah)
  k=1018 → 22 × 1 = 22

Jumlahkan bobot × banyaknya digit 9 pada tiap k:

<span class="g">Jawaban: C[9] = ${r[9]}</span>

<span class="d">Total pemanggilan CAMPUR kalau dijalankan apa adanya: ${(()=>{let t=0;for(let k=997;k<=1018;k++)t+=(k-996)*(1019-k);return t;})()}</span>`;
};

/* ---------- kalkulator bobot ---------- */
ids.q('dbgo').onclick=()=>{
  const x=Math.max(1,ids.n('dbx')||997), y=Math.max(x,ids.n('dby')||1018), dd=Math.min(9,Math.max(0,ids.n('dbd')||0));
  if(y-x>3000){ ids.q('dbout').textContent='Rentang terlalu lebar untuk ditampilkan (maks 3.000 angka).'; return; }
  const C=M.rataBobot(x,y);
  let contoh=[];
  for(const k of [x, Math.floor((x+y)/2), y]){
    const w=(k-x+1)*(y-k+1), c=String(k).split('').filter(ch=>+ch===dd).length;
    contoh.push(`  k=${k}: bobot ${(k-x+1)}×${(y-k+1)} = ${w}, digit ${dd} muncul ${c}× → sumbang ${w*c}`);
  }
  let total=0; for(let k=x;k<=y;k++) total+=(k-x+1)*(y-k+1);
  ids.q('dbout').innerHTML=
`RATA(C, ${x}, ${y}) → C[${dd}]

${contoh.join('\n')}
  ...

<span class="g">C[${dd}] = ${C[dd].toLocaleString('id-ID')}</span>

<span class="d">Dengan bobot: ${y-x+1} perhitungan.
Kalau dijalankan apa adanya: ${total.toLocaleString('id-ID')} pemanggilan CAMPUR.</span>`;
};

pasangTab('dtrik'); pasangTab('dtabs'); pasangTab('dsoal');
},
};
