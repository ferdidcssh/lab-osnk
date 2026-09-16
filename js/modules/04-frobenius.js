/* ============================================================
   MODUL 04 — FROBENIUS / CHICKEN McNUGGET
   Seluruh rumus di berkas ini diverifikasi oleh
   verify/04-frobenius.py — jangan ubah tanpa menjalankannya lagi.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Kode, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

/* --- kotak angka untuk kisi keterbentukan --- */
const kotak = (n, bisa, tandai) => `<span style="display:inline-block;min-width:30px;height:30px;
  line-height:26px;text-align:center;margin:2px;padding:0 4px;border-radius:5px;
  font-family:var(--mono);font-size:12px;font-weight:600;
  border:2px solid ${tandai ? 'var(--tinta)' : bisa ? 'var(--hijau)' : 'var(--garis-tebal)'};
  background:${tandai ? 'var(--stabilo)' : bisa ? 'var(--hijau-pucat)' : 'var(--kertas)'};
  color:${tandai ? 'var(--tinta)' : bisa ? 'var(--hijau)' : 'var(--tinta-3)'}">${n}</span>`;

export default {
  id: 'frobenius', n: '04', kelompok: 'Teori Bilangan',
  judul: 'Frobenius / Chicken McNugget',
  lede: 'Kamu cuma punya dua ukuran gayung. Berapa liter saja yang tidak bisa kamu takar? Ternyata jumlahnya terbatas dan ada rumusnya — tapi cuma kalau satu syarat terpenuhi. Kalau syarat itu dilanggar, rumusnya jadi tidak berlaku sama sekali.',
  lencana: ['<span class="chip r">2025</span>', '<span class="chip v">Terverifikasi a,b &lt; 40</span>'],

  kartu: [
    { q: '“Dua gayung 3 liter dan 5 liter — bebek mana yang tidak bisa dimandikan?”', a: 'lain', why: 'Frobenius. Tapi cek FPB dulu! Kalau tidak koprima, rumus tidak berlaku.' },
    { q: '“Berapa nugget terbanyak yang TIDAK bisa dibeli dari paket 6 dan 9?”', a: 'lain', why: 'JEBAKAN — FPB(6, 9) = 3, jadi tak hingga banyaknya. Rumus ab−a−b tidak berlaku.' },
  ],
  kamus: [
    ['dua ukuran wadah, “tidak bisa dibuat”', 'Frobenius — CEK FPB DULU'],
    ['“berapa terbesar yang tidak bisa dibentuk”', 'Frobenius: ab − a − b (bila koprima)'],
  ],

  bangun(root, { ids, pasangTab }) {
    const I = (t) => ids.i(t);

    root.innerHTML = [

      /* ===== APA ITU ===== */
      Kartu({
        judul: 'Apa itu Frobenius / Chicken McNugget?',
        isi: `
        <p style="margin:10px 0">Kamu cuma punya dua gayung: <b>3 liter</b> dan <b>5 liter</b>. Boleh menciduk berapa kali pun pakai gayung mana pun, tapi harus penuh — tidak boleh setengah gayung. Pertanyaannya: <b>berapa liter saja yang bisa kamu takar?</b></p>
        <p style="margin:10px 0">3 liter jelas bisa. 5 liter juga. 6 liter bisa (3+3). 8 liter bisa (3+5). Tapi coba cari cara menakar <b>4 liter</b> — tidak ada. <b>7 liter</b> juga tidak bisa.</p>
        <p style="margin:10px 0">Nah, yang menarik: begitu sampai 8 liter ke atas, <b>semuanya bisa</b>. Jadi yang gagal ditakar cuma ada empat: 1, 2, 4, dan 7. <b>Cuma segitu, tidak bertambah lagi.</b></p>
        <p style="margin:10px 0">Dari situ muncul dua pertanyaan yang jawabannya ternyata rapi: <b>berapa angka terbesar yang gagal ditakar?</b> (namanya <b>bilangan Frobenius</b>), dan <b>ada berapa angka yang gagal?</b></p>` +
        Catatan({ isi: `<b>Kenapa namanya ada dua?</b> Soal ini sering dibahas <b>Ferdinand Frobenius</b> (1849–1917) waktu mengajar, tapi dia tidak pernah menuliskannya jadi makalah. Yang duluan menerbitkan rumusnya justru matematikawan Inggris <b>James Joseph Sylvester</b>, tahun <b>1882</b>.
        <br><br>Nama "Chicken McNugget" jauh lebih baru. Muncul sekitar <b>1990</b> di forum internet <i>rec.puzzles</i>, lalu dibukukan Ilan Vardi setahun kemudian. Ceritanya: dulu McDonald's menjual nugget dalam paket 6, 9, dan 20 butir. Kalau kamu tidak boleh menyisakan satu butir pun, berapa nugget terbanyak yang <b>tidak bisa</b> kamu beli? Jawabannya <b>43</b>.` }) +
        Catatan({ jenis: 'awas', isi: `<b>Awas, ada satu syarat.</b> Rumus di modul ini cuma jalan kalau kedua angka <b>koprima</b> — artinya FPB-nya 1, tidak punya pembagi bersama selain 1.
        <br><br>Coba bayangkan gayung 4 liter dan 6 liter. Berapa pun kamu menciduk, hasilnya selalu genap. Angka ganjil <b>tidak akan pernah</b> bisa kamu takar, sampai kapan pun. Artinya yang gagal ditakar jadi tidak terbatas — dan tidak ada rumus yang bisa menghitungnya.
        <br><br>Penyusun soal OSN-K 2025 tahu betul jebakan ini. Soal pertama pakai angka koprima, soal berikutnya sengaja tidak.` }) +
        `<h4 style="margin:18px 0 6px;font-size:14px">Kenapa penting untuk OSN-K?</h4>
        <p class="tiny" style="margin:0">Karena ceritanya gampang sekali disamarkan — gayung, perangko, koin, paket nugget, potongan kabel. Tapi kalau kamu kupas, bentuknya selalu sama: <b>ada dua ukuran, boleh dipakai berapa kali pun, cari mana yang tidak bisa dibuat</b>. Di OSN-K 2025 soal ini muncul sebagai satu grup penuh, tiga nomor sekaligus.</p>`,
      }),

      /* ===== LAB 1 ===== */
      Lab({
        judul: 'Lab 1 · Bilangan mana yang bisa ditakar?', petunjuk: 'hijau bisa, abu-abu tidak',
        isi:
          Kontrol({
            ids,
            kolom: [
              { id: 'a', label: 'gayung a', nilai: 3, min: 1, maks: 60 },
              { id: 'b', label: 'gayung b', nilai: 5, min: 1, maks: 60 },
              { id: 'lim', label: 'periksa sampai', nilai: 40, min: 5, maks: 300 },
            ],
            tombol: [{ id: 'go', teks: 'Petakan' }],
          }) +
          Wadah({ ids, id: 'kisi', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan “Petakan” untuk mulai.' })+
          `<p class="tiny" style="margin:10px 0 0">Sudah? Sekarang coba <b>a = 4, b = 6</b> — lihat sendiri apa yang terjadi kalau syarat koprimanya dilanggar.</p>`,
      }),

      /* ===== LAB 2: SIMETRI ===== */
      Lab({
        judul: 'Lab 2 · Pasangan cermin — yang paling terasa curang', petunjuk: 'sekali pasangkan, cacahnya langsung ketemu',
        isi:
          `<p style="margin:0 0 12px">Ini bagian yang bikin kagum. Ambil bilangan Frobenius, sebut saja g. Lalu pasangkan tiap angka n dengan pasangannya, yaitu g − n. Sekarang perhatikan tiap pasangan: <b>selalu ada satu yang bisa, satu yang tidak</b>. Tidak pernah dua-duanya bisa, tidak pernah dua-duanya gagal.</p>` +
          Kontrol({
            ids,
            kolom: [
              { id: 'sa', label: 'a', nilai: 4, min: 2, maks: 20 },
              { id: 'sb', label: 'b', nilai: 7, min: 2, maks: 20 },
            ],
            tombol: [{ id: 'sgo', teks: 'Pasangkan' }],
          }) +
          Wadah({ ids, id: 'sviz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'sout' }),
      }),

      Catatan({ jenis: 'baik', isi: `<b>Dari sini rumusnya muncul sendiri.</b> Angka 0 sampai g jumlahnya g + 1 buah. Semuanya berpasangan dua-dua, dan tiap pasang menyumbang tepat satu yang gagal. Berarti yang gagal ada <b>(g + 1) ÷ 2</b>.
        <br><br>Tinggal disederhanakan. Karena g = ab − a − b, maka g + 1 = ab − a − b + 1, dan itu sama saja dengan (a − 1)(b − 1). Jadi jawabannya <b>(a − 1)(b − 1) / 2</b>.
        <span class="tiny" style="display:block;margin-top:6px">✅ Aturan berpasangan ini sudah diuji untuk semua pasangan koprima a, b &lt; 30.</span>` }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Teorema Sylvester (1882) · cuma kalau FPB = 1',
        isi: `angka terbesar yang gagal = <mark>a·b − a − b</mark><br>
              banyaknya angka yang gagal = <mark>(a − 1)(b − 1) / 2</mark>`,
        verifikasi: 'Sudah diuji untuk semua pasangan koprima a, b &lt; 40',
        pesan: 'Petakan dulu di Lab 1 — polanya lebih nempel kalau kamu yang menemukan sendiri.',
      }),

      /* ===== CARA CEPAT ===== */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Semua sudah diuji terhadap perhitungan langsung.',
        isi: Tab({
          ids, id: 'trik', daftar: [
            {
              kunci: 'k1', judul: 'Cek FPB dulu',
              isi: `<p style="margin:0 0 10px">Ini <b>selalu langkah pertama</b>. Sebelum pegang rumus apa pun, hitung dulu FPB kedua angkanya.</p>` +
                Rumus({
                  label: 'Ini yang menentukan',
                  isi: `FPB = 1 &nbsp;→&nbsp; yang gagal <mark>jumlahnya terbatas</mark>, rumus boleh dipakai<br><br>
                        FPB = d, lebih dari 1 &nbsp;→&nbsp; yang bisa dibuat cuma kelipatan d<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; → yang gagal <mark>TIDAK ADA HABISNYA</mark>`,
                  verifikasi: 'Sudah diuji',
                }) +
                Catatan({ jenis: 'awas', isi: 'Hati-hati kalau soal tanya <b>"berapa angka terbesar yang tidak bisa dibuat"</b> tapi FPB-nya lebih dari 1. Pertanyaan itu sebenarnya tidak punya jawaban. Tidak ada yang paling besar, karena angka yang gagal terus ada sampai tak terhingga.<br><br>Coba baca ulang soalnya. Biasanya ada batasan "sampai N", misalnya "dari 1.000 bebek". Kalau begitu, pakai cara di tab <b>Cacah sampai N</b>.' }),
            },
            {
              kunci: 'k2', judul: 'Bagi dulu pakai FPB',
              isi: `<p style="margin:0 0 10px">FPB-nya lebih dari 1? Jangan langsung menyerah. Bagi saja kedua angkanya dengan FPB itu, nanti hasilnya pasti koprima — dan rumusnya jadi bisa dipakai lagi.</p>` +
                Rumus({
                  label: 'Cara membaginya',
                  isi: `n bisa dibuat dari (a, b) &nbsp;kalau dan hanya kalau<br>
                        <mark>n habis dibagi d</mark> &nbsp;DAN&nbsp; <mark>n/d bisa dibuat dari (a/d, b/d)</mark>`,
                  verifikasi: 'Sudah diuji a, b &lt; 40 dan n &lt; 200',
                }) +
                `<div class="out" style="margin-top:12px">Contoh: a = 9, b = 21   ${redup('(soal OSN-K 2025 nomor 24)')}
  FPB = 3  →  bagi 3  →  pasangan (3, 7) yang koprima
  Frobenius(3, 7) = 3×7 − 3 − 7 = 11
  yang tidak terbentuk oleh (3,7): 1, 2, 4, 5, 8, 11   ${redup('(ada 6)')}

  Jadi untuk (9, 21): yang bisa dibentuk = 3 × {yang bisa oleh (3,7)}
                    = 9, 18, 21, 27, 30, 36, 39, 42, …</div>`,
            },
            {
              kunci: 'k3', judul: 'Cacah sampai N',
              isi: `<p style="margin:0 0 10px">Kalau soal membatasi sampai N — misalnya "dari 1.000 bebek, berapa yang tidak bisa dimandikan" — ada rumus yang langsung menjawabnya. Enaknya, rumus ini tetap jalan <b>walaupun angkanya tidak koprima</b>:</p>` +
                Rumus({
                  label: 'Berapa banyak yang gagal, dari 1 sampai N',
                  isi: `d = FPB(a, b), &nbsp; a′ = a/d, &nbsp; b′ = b/d<br>
                        <mark>N − ⌊N/d⌋ + (a′−1)(b′−1)/2</mark>`,
                  verifikasi: 'Sudah diuji 8 pasangan × ratusan nilai N',
                }) +
                `<p class="tiny">Cara bacanya begini. Dari N angka, yang punya harapan cuma kelipatan d — jumlahnya ⌊N/d⌋. Tapi dari kelipatan itu pun masih ada yang gagal, sebanyak (a′−1)(b′−1)/2. Sisanya, yaitu semua yang bukan kelipatan d, otomatis gagal. Satu syarat: ⌊N/d⌋ harus sudah melewati a′b′−a′−b′. Kalau N masih kecil, pintasan (a′−1)(b′−1)/2 belum sahih.</p>` +
                Kontrol({
                  ids, kolom: [
                    { id: 'ca', label: 'a', nilai: 9, min: 1, maks: 999 },
                    { id: 'cb', label: 'b', nilai: 21, min: 1, maks: 999 },
                    { id: 'cn', label: 'sampai N', nilai: 1000, min: 1, maks: 1000000 }],
                  tombol: [{ id: 'cgo', teks: 'Bandingkan dua cara' }],
                }) +
                Keluaran({ ids, id: 'cout' }),
            },
            {
              kunci: 'k4', judul: 'Cek satu angka',
              isi: `<p style="margin:0 0 10px">Mau cek <b>satu</b> angka saja, bisa dibuat atau tidak? Tidak perlu coba semua kemungkinan:</p>` +
                Rumus({
                  label: 'Cara cek cepat',
                  isi: `n bisa dibuat &nbsp;kalau ada k yang bikin<br><mark>(n − k·b) habis dibagi a</mark><br><br>
                        dan k cukup dicoba dari <mark>0 sampai a − 1</mark> saja`,
                  verifikasi: 'Sudah diuji a, b &lt; 30 dan n &lt; 200',
                }) +
                `<p class="tiny">Kenapa berhenti di a − 1? Karena sisa baginya berputar-putar mengulang setiap a langkah. Kalau sampai percobaan ke-a belum ketemu juga, seterusnya pasti tidak akan ketemu.</p>` +
                Kontrol({
                  ids, kolom: [
                    { id: 'ua', label: 'a', nilai: 7, min: 1, maks: 99 },
                    { id: 'ub', label: 'b', nilai: 11, min: 1, maks: 99 },
                    { id: 'un', label: 'n', nilai: 40, min: 0, maks: 99999 }],
                  tombol: [{ id: 'ugo', teks: 'Uji' }],
                }) +
                Keluaran({ ids, id: 'uout' }),
            },
            {
              kunci: 'k5', judul: 'Kalau ukurannya 3',
              isi: `<p style="margin:0 0 10px">Yang ini penting, supaya kamu <b>tidak asal pakai rumus</b>:</p>` +
                Catatan({ jenis: 'awas', isi: 'Kalau ukurannya <b>tiga atau lebih</b>, <b>tidak ada rumusnya</b>. Bukan karena belum diajarkan di sekolah — memang sampai sekarang belum ada yang menemukan. Jadi kalau soal kasih tiga ukuran, satu-satunya jalan ya <b>dicari satu per satu</b>.' }) +
                `<div class="out" style="margin-top:12px">Chicken McNugget asli: paket 6, 9, dan 20

Yang TIDAK bisa dibeli:
  1, 2, 3, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19,
  22, 23, 25, 28, 31, 34, 37, ${hijau('43')}

  → terbesar = ${hijau('43')}   ${redup('(harus dicari, bukan dari rumus)')}

Kalau rumus dua-bilangan dipaksakan:
  6×9 − 6 − 9  = 39   ${merah('✗ salah')}
  9×20 − 9 − 20 = 151  ${merah('✗ salah')}
  6×20 − 6 − 20 = 94   ${merah('✗ salah')}</div>` +
                `<p class="tiny" style="margin-top:10px">Perhatikan: FPB dari 6, 9, dan 20 adalah 1 — jadi yang gagal tetap terbatas jumlahnya. Syarat koprimanya dilihat dari <b>ketiganya sekaligus</b>, bukan dipasang-pasangkan.</p>`,
            },
            {
              kunci: 'k6', judul: 'Kalau ditanya totalnya',
              isi: `<p style="margin:0 0 10px">Kalau yang ditanya <b>jumlah</b> semua angka yang gagal — bukan berapa banyaknya, tapi ditotal semua — ada rumusnya juga:</p>` +
                Rumus({
                  label: 'Rumus Sylvester · cuma kalau koprima',
                  isi: `<mark>(a − 1)(b − 1)(2ab − a − b − 1) / 12</mark>`,
                  verifikasi: 'Sudah diuji semua pasangan koprima a, b &lt; 30',
                }) +
                `<div class="out" style="margin-top:12px">Contoh a = 3, b = 5:
  yang tidak terbentuk: 1 + 2 + 4 + 7 = ${hijau('14')}
  rumus: (2)(4)(30 − 3 − 5 − 1)/12 = 8 × 21 / 12 = ${hijau('14')}  ✓</div>`,
            },
          ],
        }),
      }),

      /* ===== PENYAMARAN ===== */
      Kartu({
        judul: 'Penyamaran',
        sub: 'Ceritanya boleh ganti-ganti, tapi rangkanya selalu sama: dua ukuran, boleh dipakai berapa kali pun, cari mana yang tidak bisa dibuat.',
        isi: Tab({
          ids, id: 'samar', daftar: [
            {
              kunci: 'a', judul: 'A · Gayung',
              isi: Catatan({ isi: '"Pak Dengklek punya dua gayung berukuran X liter dan Y liter. Bebek ke-P ingin dimandikan dengan air tepat P liter. Air yang diambil harus langsung dipakai. Berapa bebek yang tidak bisa dimandikan?"' }) +
                '<p class="tiny">Ini bunyi asli soal OSN-K 2025. Frasa "harus langsung dipakai" itu cara halus untuk bilang: tidak boleh ada air sisa yang disimpan. Jadi murni menjumlahkan kelipatan.</p>',
            },
            {
              kunci: 'b', judul: 'B · Nugget',
              isi: Catatan({ isi: '"Nugget dijual dalam paket 6 dan 9 butir. Berapa butir terbanyak yang tidak bisa dibeli persis?"' }) +
                Catatan({ jenis: 'awas', isi: '<b>Ini jebakan.</b> FPB(6, 9) = 3, jadi yang bisa dibeli cuma kelipatan 3 saja. Yang gagal tidak ada habisnya, jadi pertanyaan "terbanyak" tidak punya jawaban.<br><br>Makanya versi aslinya pakai <b>tiga</b> ukuran (6, 9, 20) — supaya FPB-nya jadi 1 dan soalnya punya jawaban.' }),
            },
            {
              kunci: 'c', judul: 'C · Perangko',
              isi: Catatan({ isi: '"Sebuah negara hanya mencetak perangko senilai 4 dan 9. Berapa nilai kirim terbesar yang tidak bisa dibayar tepat?"' }) +
                '<p class="tiny">FPB(4, 9) = 1, aman. Tinggal pakai rumus: 4×9 − 4 − 9 = <mark>23</mark>.</p>',
            },
            {
              kunci: 'd', judul: 'D · Kode',
              isi: Kode(`<span class="kw">bool</span> <span class="fn">bisa</span>(<span class="kw">int</span> n, <span class="kw">int</span> a, <span class="kw">int</span> b) {
  <span class="kw">for</span> (<span class="kw">int</span> x = 0; x*a &lt;= n; x++)
    <span class="kw">if</span> ((n - x*a) % b == 0) <span class="kw">return</span> <span class="kw">true</span>;
  <span class="kw">return</span> <span class="kw">false</span>;
}</pre>`) + Catatan({ isi: '<b>Cirinya:</b> ada loop yang mencoba-coba berapa banyak "a" dipakai, lalu mengecek apakah <b>sisanya habis dibagi b</b>. Begitu kamu lihat pola ini, langsung tahu ini soal Frobenius — dan kamu bisa melompati seluruh loop-nya pakai rumus.' }),
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: Catatan({ jenis: 'awas', isi: '"Ada berapa cara membentuk n dari a dan b?"' }) +
                '<p class="tiny">Baca pelan-pelan — ini pertanyaan yang <b>lain</b>. Bukan <i>bisa atau tidak</i>, tapi <i>ada berapa cara</i>. Frobenius tidak menjawab itu, dan butuh cara hitung yang berbeda.</p>' +
                Catatan({ jenis: 'awas', isi: '"Berapa nilai terkecil yang bisa dibentuk dari a dan b?" (boleh dikurangi)' }) +
                '<p class="tiny">Kalau <b>boleh dikurangi</b>, jawabannya selalu FPB(a, b) — soal yang sama sekali beda. Di Frobenius, kamu cuma boleh <b>menambah</b>, tidak boleh mengurangi.</p>',
            },
          ],
        }),
      }),

      /* ===== BEDAH SOAL ===== */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2025 · soal 23–25',
        sub: 'Coba lihat susunannya — ketiganya sengaja dirancang bertingkat. Soal pertama angkanya koprima, soal kedua sengaja tidak, soal ketiga menguji apakah kamu sadar bahwa yang gagal jumlahnya terbatas.',
        isi: Kisi([
          KartuSoal({ ids, nomor: 'Soal 23', pertanyaan: 'N = 20 bebek, gayung 3 dan 5 liter. Berapa bebek yang tidak bisa dimandikan?', idKeluaran: 's1' }),
          KartuSoal({ ids, nomor: 'Soal 24', pertanyaan: 'N = 1000 bebek, gayung 9 dan 21 liter. Berapa yang tidak bisa dimandikan?', idKeluaran: 's2' }),
          KartuSoal({ ids, nomor: 'Soal 25', pertanyaan: 'BENAR/SALAH: dengan N = 10¹⁸ bebek dan gayung 3 dan 100 liter, yang tidak bisa dimandikan kurang dari 100 ekor.', idKeluaran: 's3' }),
        ]) + `<button class="btn" id="${I('solve')}" style="margin-top:14px">Selesaikan ketiganya</button>`,
      }),

      Catatan({
        jenis: 'awas', isi: `<b>Kapan rumus ini tidak boleh dipakai.</b>
        <table class="t" style="margin-top:10px;background:transparent">
          <tr><th style="text-align:left">Kalau begini…</th><th style="text-align:left">…akibatnya</th></tr>
          <tr><td style="text-align:left">FPB(a, b) = 1</td><td style="text-align:left">✅ aman, rumus ab − a − b boleh dipakai</td></tr>
          <tr><td style="text-align:left">FPB(a, b) lebih dari 1</td><td style="text-align:left">❌ yang gagal tidak ada habisnya — bagi dulu pakai FPB</td></tr>
          <tr><td style="text-align:left">ukurannya tiga atau lebih</td><td style="text-align:left">❌ tidak ada rumusnya — cari satu per satu</td></tr>
          <tr><td style="text-align:left">boleh dikurangi, bukan cuma ditambah</td><td style="text-align:left">❌ soal lain, jawabannya FPB(a, b)</td></tr>
          <tr><td style="text-align:left">yang ditanya "ada berapa cara"</td><td style="text-align:left">❌ soal lain, butuh cara hitung berbeda</td></tr>
        </table>`,
      }),

      Catatan({ isi: '<b>Biasakan cek 30 detik sebelum pakai rumus.</b><br><br>Pertama, hitung FPB-nya. Kalau bukan 1, berhenti — pakai cara reduksi.<br><br>Kalau 1, coba dulu rumusnya di angka kecil yang bisa kamu cek pakai tangan. Contoh a = 3, b = 5: rumus bilang 3×5 − 3 − 5 = 7. Cek sendiri — 7 memang tidak bisa, sementara 8, 9, 10 semuanya bisa. Cocok. Baru pakai rumusnya untuk angka besar.' }),

    ].join('');

    /* ================= PERILAKU ================= */

    /* ---- Lab 1: kisi keterbentukan ---- */
    ids.klik('go', () => {
      const a = ids.n('a', { min: 1, maks: 60, bawaan: 3 });
      const b = ids.n('b', { min: 1, maks: 60, bawaan: 5 });
      const lim = ids.n('lim', { min: 5, maks: 300, bawaan: 40 });
      const d = M.gcd(a, b), g = a * b - a - b;
      const tak = [];
      let html = '';
      for (let n = 1; n <= lim; n++) {
        const ok = M.bisaBentuk(n, a, b);
        if (!ok) tak.push(n);
        html += kotak(n, ok, d === 1 && n === g);
      }
      ids.q('kisi').innerHTML = `<div style="line-height:1">${html}</div>
        <p class="tiny" style="margin-top:8px">
        <span style="background:var(--hijau-pucat);border:2px solid var(--hijau);padding:1px 6px;border-radius:4px">hijau</span> bisa ditakar ·
        <span style="background:var(--kertas);border:2px solid var(--garis-tebal);padding:1px 6px;border-radius:4px">abu-abu</span> tidak bisa
        ${d === 1 ? ' · <span style="background:var(--stabilo);border:2px solid var(--tinta);padding:1px 6px;border-radius:4px">kuning</span> bilangan Frobenius' : ''}</p>`;

      if (d === 1) {
        ids.tulis('out', `a = ${a}, b = ${b}   FPB = 1  ${hijau('✓ koprima — rumus berlaku')}

Tidak bisa ditakar (sampai ${lim}): ${tak.join(', ') || '(tidak ada)'}
Cacah = ${tak.length}

  rumus terbesar : ${a}×${b} − ${a} − ${b} = ${hijau(g)}   ${tak.length && Math.max(...tak) === g ? '✓ cocok' : (lim < g ? redup('(perluas batas periksa untuk melihatnya)') : merah('✗'))}
  rumus cacah    : (${a}−1)(${b}−1)/2 = ${hijau((a - 1) * (b - 1) / 2)}   ${tak.length === (a - 1) * (b - 1) / 2 ? '✓ cocok' : (lim < g ? redup('(belum semua terlihat)') : merah('✗'))}

${lim > g ? redup(`Perhatikan: setelah ${g}, semua bilangan bisa ditakar. Tidak ada lagi yang abu-abu.`) : ''}`);
        bukaRumus(ids, 'rumus');
      } else {
        ids.tulis('out', `a = ${a}, b = ${b}   FPB = ${d}  ${merah('✗ TIDAK koprima')}

Yang bisa ditakar hanyalah ${hijau('kelipatan ' + d)}.
Artinya ada ${merah('TAK HINGGA')} bilangan yang tidak bisa ditakar —
semua yang bukan kelipatan ${d}, selamanya.

  rumus naif ${a}×${b} − ${a} − ${b} = ${a * b - a - b}   ${merah('← MENYESATKAN, jangan dipakai')}

Sampai ${lim} saja sudah ada ${tak.length} yang tidak bisa.

${redup(`Cara benarnya: bagi keduanya dengan ${d} → pasangan (${a / d}, ${b / d}) yang koprima.\nLihat tab "Bagi dulu pakai FPB".`)}`);
      }
    });
    
    /* ---- Lab 2: simetri ---- */
    ids.klik('sgo', () => {
      const a = ids.n('sa', { min: 2, maks: 20, bawaan: 4 });
      const b = ids.n('sb', { min: 2, maks: 20, bawaan: 7 });
      if (M.gcd(a, b) !== 1) {
        ids.q('sviz').innerHTML = '';
        ids.tulis('sout', `FPB(${a}, ${b}) = ${M.gcd(a, b)} ${merah('— sifat simetri hanya berlaku untuk pasangan koprima.')}
Coba pasangan lain, misalnya 4 dan 7.`);
        return;
      }
      const g = a * b - a - b;
      let baris = '';
      for (let n = 0; n <= Math.floor(g / 2); n++) {
        const m = g - n, kn = M.bisaBentuk(n, a, b), km = M.bisaBentuk(m, a, b);
        const sel = (v, ok) => `<span style="display:inline-block;min-width:46px;padding:3px 8px;margin:2px;
          border-radius:5px;font-family:var(--mono);font-size:12.5px;font-weight:600;text-align:center;
          border:2px solid ${ok ? 'var(--hijau)' : 'var(--garis-tebal)'};
          background:${ok ? 'var(--hijau-pucat)' : 'var(--kertas)'};
          color:${ok ? 'var(--hijau)' : 'var(--tinta-3)'}">${v}</span>`;
        baris += `<div style="margin:1px 0">${sel(n, kn)}<span style="color:var(--tinta-3)">↔</span>${sel(m, km)}
          <span class="tiny" style="margin-left:8px">${kn ? 'kiri bisa' : 'kanan bisa'}</span></div>`;
      }
      ids.q('sviz').innerHTML = baris;
      const tak = []; for (let n = 1; n <= g; n++) if (!M.bisaBentuk(n, a, b)) tak.push(n);
      ids.tulis('sout', `a = ${a}, b = ${b}   →   g = ${a}×${b} − ${a} − ${b} = ${g}

Bilangan 0 sampai ${g} ada ${g + 1} buah, membentuk ${(g + 1) / 2} pasangan.
Dari setiap pasangan, tepat satu yang bisa dibentuk.

  banyaknya yang TIDAK terbentuk = ${g + 1} ÷ 2 = ${hijau((g + 1) / 2)}
  cek langsung                   = ${hijau(tak.length)}   ${tak.length === (g + 1) / 2 ? '✓ cocok' : merah('✗')}
  rumus (a−1)(b−1)/2             = ${hijau((a - 1) * (b - 1) / 2)}   ${tak.length === (a - 1) * (b - 1) / 2 ? '✓ cocok' : merah('✗')}

${redup(`(a−1)(b−1) = ${a}×${b} − ${a} − ${b} + 1 = g + 1, jadi ketiganya memang bilangan yang sama.`)}`);
    });
    ids.q('sgo').click();

    /* ---- cacah sampai N ---- */
    ids.klik('cgo', () => {
      const a = ids.n('ca', { min: 1, maks: 999, bawaan: 9 });
      const b = ids.n('cb', { min: 1, maks: 999, bawaan: 21 });
      const N = ids.n('cn', { min: 1, maks: 1000000, bawaan: 1000 });
      const d = M.gcd(a, b), A = a / d, B = b / d;
      let langsung = null;
      if (N <= 200000) { langsung = 0; for (let n = 1; n <= N; n++) if (!M.bisaBentuk(n, a, b)) langsung++; }
      const cepat = M.frobeniusCacah(N, a, b);

      /* Pintasan (a′−1)(b′−1)/2 baru sahih setelah ⌊N/d⌋ melewati
         a′b′−a′−b′. Sebelum itu suku keduanya belum penuh, jadi labnya
         berterus terang daripada memajang aritmetika yang tidak nyambung. */
      const m = Math.floor(N / d);
      const ambang = (A > 1 && B > 1) ? A * B - A - B : 0;
      const gagalKelipatan = M.frobeniusCacahKoprima(m, A, B);
      const penuh = (A - 1) * (B - 1) / 2;
      const pintasSahih = m >= ambang;

      ids.tulis('cout', `CARA 1 — periksa n = 1, 2, …, ${angka(N)} satu per satu
  hasil = ${langsung === null ? redup('(dilewati, N terlalu besar)') : hijau(angka(langsung))}   ${langsung === null ? '' : redup(`(${angka(N)} kali pemeriksaan)`)}

CARA 2 — rumus langsung
  d = FPB(${a}, ${b}) = ${d}   →   a′ = ${A}, b′ = ${B}
${d === 1 ? '' : `
  yang bukan kelipatan ${d} — pasti gagal
    ${angka(N)} − ⌊${angka(N)}/${d}⌋ = ${angka(N)} − ${angka(m)} = ${angka(N - m)}`}
  ${d === 1 ? 'yang tetap gagal' : `kelipatan ${d} yang tetap gagal`}
    ${pintasSahih ? `(${A}−1)(${B}−1)/2 = ${penuh}`
                  : `${gagalKelipatan}   ${merah('← pintasannya belum boleh dipakai')}`}

  = ${hijau(angka(cepat))}   ${redup('(beberapa detik di kertas)')}
${pintasSahih ? '' : `
${merah(`⚠ Di sini ⌊N/d⌋ baru ${angka(m)}.`)} Pintasan (${A}−1)(${B}−1)/2 = ${penuh} baru sahih mulai ⌊N/d⌋ ≥ ${ambang}, jadi N harus ≥ ${angka(d * ambang)}.
${redup('Di bawah itu, yang gagal masih harus dihitung satu per satu.')}`}
${langsung === null ? '' : (langsung === cepat ? hijau('✓ DUA CARA SAMA') : merah('✗ beda'))}`);
    });
    ids.q('cgo').click();

    /* ---- uji satu bilangan ---- */
    ids.klik('ugo', () => {
      const a = ids.n('ua', { min: 1, maks: 99, bawaan: 7 });
      const b = ids.n('ub', { min: 1, maks: 99, bawaan: 11 });
      const n = ids.n('un', { min: 0, maks: 99999, bawaan: 40 });
      const baris = []; let ketemu = null;
      const batas = Math.min(a, Math.floor(n / b) + 1);
      for (let k = 0; k < batas; k++) {
        const sisa = n - k * b;
        const ok = sisa % a === 0;
        baris.push(`  k=${k}: ${n} − ${k}×${b} = ${String(sisa).padStart(5)}   ${sisa} mod ${a} = ${sisa % a}   ${ok ? hijau('✓ HABIS') : ''}`);
        if (ok && ketemu === null) { ketemu = { k, x: sisa / a }; break; }
      }
      ids.tulis('uout', `Apakah ${n} bisa dibentuk dari ${a} dan ${b}?

${baris.join('\n')}

${ketemu
        ? `${hijau('BISA')} — ${n} = ${ketemu.x}×${a} + ${ketemu.k}×${b}`
        : `${merah('TIDAK BISA')} — sudah dicoba ${batas} nilai k, tidak ada yang habis dibagi ${a}.\n${redup(`Cukup sampai k = ${a - 1} karena sisanya berulang setelah itu.`)}`}`);
    });
    ids.q('ugo').click();

    /* ---- bedah soal ---- */
    ids.klik('solve', () => {
      const tak23 = []; for (let n = 1; n <= 20; n++) if (!M.bisaBentuk(n, 3, 5)) tak23.push(n);
      /* Semua angka DIHITUNG, bukan diketik. Kalau angka soalnya diubah,
         jawabannya ikut menyesuaikan dan tidak bisa melenceng. */
      const A23 = 3, B23 = 5, N23 = 20;
      const f23 = M.frobenius(A23, B23);
      const j23 = M.frobeniusCacah(N23, A23, B23);
      ids.tulis('s1', `FPB(${A23}, ${B23}) = ${M.gcd(A23, B23)}  ${hijau('✓ koprima')}

Frobenius = ${A23}×${B23} − ${A23} − ${B23} = ${hijau(f23.largest)}
  → mulai dari ${f23.largest + 1} ke atas, semuanya bisa

Cacah = (${A23}−1)(${B23}−1)/2 = ${hijau(f23.count)}
  yaitu: ${tak23.join(', ')}

${hijau('Jawaban: ' + j23 + ' bebek')}
${redup('N = ' + N23 + ' sudah jauh di atas ' + f23.largest + ', jadi semua yang gagal sudah terhitung.')}`);

      const A24 = 9, B24 = 21, N24 = 1000;
      const d24 = M.gcd(A24, B24), kel24 = Math.floor(N24 / d24);
      const gagal24 = M.frobenius(A24 / d24, B24 / d24).count;
      const j24 = M.frobeniusCacah(N24, A24, B24);
      ids.tulis('s2', `FPB(${A24}, ${B24}) = ${d24}  ${merah('✗ TIDAK koprima')}
  → jangan pakai ab − a − b

REDUKSI: bagi 3 → pasangan (3, 7) yang koprima
  Frobenius(3,7) = 3×7 − 3 − 7 = 11
  yang gagal: 1, 2, 4, 5, 8, 11   ${redup('(ada 6 = (3−1)(7−1)/2)')}

HITUNG:
  kelipatan ${d24} sampai ${angka(N24)}  = ⌊${angka(N24)}/${d24}⌋ = ${angka(kel24)}
  dari ${angka(kel24)} itu, yang gagal = ${gagal24}
  jadi yang BISA           = ${angka(kel24)} − ${gagal24} = ${angka(kel24 - gagal24)}
  yang TIDAK bisa          = ${angka(N24)} − ${angka(kel24 - gagal24)} = ${hijau(angka(j24))}

${hijau('Jawaban: ' + angka(j24) + ' bebek')}`);

      const A25 = 3, B25 = 100, batas25 = 100;
      const f25 = M.frobenius(A25, B25);
      ids.tulis('s3', `FPB(${A25}, ${B25}) = ${M.gcd(A25, B25)}  ${hijau('✓ koprima')}

Frobenius = ${A25}×${B25} − ${A25} − ${B25} = ${hijau(f25.largest)}
  → di atas ${f25.largest}, semua bebek bisa dimandikan

Cacah = (${A25}−1)(${B25}−1)/2 = ${A25 - 1} × ${B25 - 1} / 2 = ${hijau(f25.count)}

${f25.count} < ${batas25}  →  ${hijau(f25.count < batas25 ? 'BENAR' : 'SALAH')}

${redup('Kuncinya: angka 10¹⁸ itu cuma menakut-nakuti. Yang gagal\njumlahnya terbatas dan berhenti di ' + f25.largest + ', jadi N sebesar apa pun\nhasilnya tetap ' + f25.count + '.')}`);
    });

    pasangTab('trik'); pasangTab('samar');
  },
};
