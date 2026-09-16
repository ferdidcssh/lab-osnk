/* ============================================================
   MODUL 05 — REKURSI DOUBLING
   Semua rumus di berkas ini dibuktikan oleh
   verify/05-doubling.py — jangan diubah tanpa menjalankannya lagi.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Kode, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

/* --- satu kotak karakter untuk peta barisan --- */
const kotak = (c, gaya = '') => `<span style="display:inline-block;width:17px;height:17px;
  line-height:15px;text-align:center;margin:1px;border-radius:3px;
  font-family:var(--mono);font-size:10px;font-weight:600;${gaya}">${c}</span>`;
const kotak0 = (c) => kotak(c, c === '0'
  ? 'border:1.5px solid var(--garis-tebal);background:var(--kertas);color:var(--tinta-3)'
  : 'border:1.5px solid var(--tinta);background:var(--tinta);color:#fff');

export default {
  id: 'doubling', n: '05', kelompok: 'Rekursi',
  judul: 'Rekursi Doubling',
  lede: 'Ada fungsi yang tiap dipanggil bikin hasilnya jadi dua kali lipat. Panggil 12 kali, panjangnya sudah 4.096. Panggil 2026 kali, panjangnya melebihi jumlah atom di alam semesta. Kategori baru yang muncul di OSN-K 2026 — langsung 6 soal sekaligus.',
  lencana: ['<span class="chip r">2026 · 6 soal</span>', '<span class="chip v">Diuji sampai 2¹⁷</span>'],

  kartu: [
    { q: 'return MANDIR(n-1) + MONDAR(MANDIR(n-1));', a: 'doubling', why: 'Hasil lama ditempel lagi di belakang — panjangnya jadi 2ⁿ, dan bagian depannya tidak pernah berubah.' },
    { q: '“Apa karakter ke-2025 dari string sepanjang 2²⁰²⁶?”', a: 'doubling', why: 'Tidak perlu bangun stringnya. Pakai trik biner, atau bangun versi terkecil yang sudah cukup panjang.' },
  ],
  kamus: [
    ['f(n) = f(n−1) + ubah(f(n−1))', 'Rekursi doubling — panjang 2ⁿ, awalan tidak berubah'],
    ['“karakter ke-i dari string raksasa”', 'Trik biner: hitung angka 1 pada biner i'],
  ],

  bangun(root, { ids, pasangTab }) {
    const I = (t) => ids.i(t);

    root.innerHTML = [

      /* ===== APA ITU ===== */
      Kartu({
        judul: 'Apa itu Rekursi Doubling?',
        isi: `
        <p style="margin:10px 0">Coba mulai dari satu huruf saja: <b>0</b></p>
        <p style="margin:10px 0">Sekarang aturannya begini — <b>tempel lagi di belakangnya, tapi dibalik</b>. Angka 0 jadi 1, angka 1 jadi 0.</p>
        <div class="out" style="margin:12px 0">0
0 → tempel kebalikannya (1)   jadi  <b>01</b>
01 → tempel kebalikannya (10) jadi  <b>0110</b>
0110 → tempel kebalikannya    jadi  <b>01101001</b></div>
        <p style="margin:10px 0">Perhatikan panjangnya: 1, 2, 4, 8, 16, 32… <b>Selalu dua kali lipat.</b> Itulah kenapa disebut <i>doubling</i>.</p>
        <p style="margin:10px 0">Kelihatannya sepele. Tapi coba pikirkan: kalau diulang 2026 kali, panjangnya jadi 2²⁰²⁶. Itu angka dengan lebih dari 600 digit — jauh lebih banyak daripada jumlah atom di seluruh alam semesta. Tidak ada komputer yang sanggup menyimpannya.</p>
        <p style="margin:10px 0"><b>Nah, soal OSN-K 2026 menanyakan karakter ke-2025 dari string itu.</b> Bagaimana caranya?</p>` +
        Catatan({ jenis: 'baik', isi: `<b>Ada dua jalan keluar, dan dua-duanya ada di modul ini.</b>
        <br><br>Jalan pertama: sadar bahwa bagian depan string ini <b>tidak pernah berubah</b>, jadi kamu cukup membangun versi kecilnya saja.
        <br><br>Jalan kedua — dan ini yang bikin kaget: ada cara menghitung karakter ke-berapa pun <b>cuma dengan melihat bilangan binernya</b>. Tanpa membangun apa pun.` }) +
        Catatan({ isi: `<b>Barisan ini punya nama.</b> Namanya <b>barisan Thue–Morse</b>. Yang pertama menemukannya <b>Eugène Prouhet</b> (1851), lalu ditemukan ulang oleh <b>Axel Thue</b> (1906) dan <b>Marston Morse</b> (1921) — ketiganya untuk keperluan yang berbeda-beda.
        <br><br>Thue mencarinya karena ingin membuat deretan huruf yang <b>tidak pernah mengulang tiga kali berturut-turut</b>. Coba cari "000" atau "111" di dalam barisan ini — kamu tidak akan menemukannya, sepanjang apa pun barisannya. Sifat itu nanti dipakai untuk trik menghitung di bagian akhir modul.` }) +
        `<h4 style="margin:18px 0 6px;font-size:14px">Kenapa penting untuk OSN-K?</h4>
        <p class="tiny" style="margin:0">Karena ini <b>kategori baru</b>. Di 2024 dan 2025 tidak ada sama sekali, lalu tiba-tiba di 2026 muncul enam soal — dua grup penuh di Bagian C. Kalau tren ini lanjut, kamu wajib kenal bentuknya.</p>`,
      }),

      /* ===== LAB 1: BANGUN LAPIS DEMI LAPIS ===== */
      Lab({
        judul: 'Lab 1 · Bangun lapis demi lapis', petunjuk: 'lihat sendiri panjangnya berlipat',
        isi:
          Kode(`<span class="kw">string</span> <span class="fn">MONDAR</span>(<span class="kw">string</span> P) {   <span class="c">// membalik: 0 jadi 1, 1 jadi 0</span>
  <span class="kw">string</span> C;
  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; P.length(); i++)
    C += (P[i] == <span class="fn">'0'</span>) ? <span class="fn">'1'</span> : <span class="fn">'0'</span>;
  <span class="kw">return</span> C;
}

<span class="kw">string</span> <span class="fn">MANDIR</span>(<span class="kw">int</span> n) {
  <span class="kw">if</span> (n == 0) <span class="kw">return</span> <span class="fn">"0"</span>;
  <span class="kw">return</span> <span class="fn">MANDIR</span>(n-1) + <span class="fn">MONDAR</span>(<span class="fn">MANDIR</span>(n-1));
}`, 'margin-bottom:14px') +
          Kontrol({
            ids, kolom: [{ id: 'n', label: 'bangun sampai n', nilai: 5, min: 0, maks: 10 }],
            tombol: [{ id: 'go', teks: 'Bangun' }],
          }) +
          Wadah({ ids, id: 'lapis', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan “Bangun” untuk mulai.' }),
      }),

      Catatan({ jenis: 'baik', isi: `<b>Perhatikan warnanya.</b> Bagian gelap adalah salinan dari baris di atasnya — <b>persis sama, tidak berubah sedikit pun</b>. Yang baru cuma bagian terangnya.
        <br><br>Ini yang paling penting dari seluruh modul: <b>bagian depan tidak pernah diutak-atik</b>. Mau dipanggil 12 kali atau 2026 kali, 100 karakter pertamanya tetap sama.` }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Dua hal yang langsung kelihatan',
        isi: `panjang MANDIR(n) = <mark>2ⁿ</mark><br>
              banyaknya angka 1 = <mark>2ⁿ⁻¹</mark> &nbsp; (tepat separuhnya)`,
        verifikasi: 'Sudah diuji n = 0 sampai 16',
        pesan: 'Bangun dulu di Lab 1 — polanya lebih nempel kalau kamu yang lihat sendiri.',
      }),

      /* ===== LAB 2: TRIK BINER ===== */
      Lab({
        judul: 'Lab 2 · Trik biner — yang paling terasa curang', petunjuk: 'tanpa membangun apa pun',
        isi:
          `<p style="margin:0 0 14px">Kamu mau tahu karakter ke-<b>i</b>? Begini caranya. Tulis <b>i</b> dalam biner. Hitung ada berapa <b>angka 1</b> di situ. Kalau jumlahnya <b>genap</b>, jawabannya <b>0</b>. Kalau <b>ganjil</b>, jawabannya <b>1</b>.</p>
           <p style="margin:0 0 14px"><b>Selesai.</b> Tidak ada string yang dibangun, tidak ada perkalian. Cuma menghitung angka 1.</p>` +
          Kontrol({
            ids, kolom: [{ id: 'bi', label: 'karakter ke-i (mulai 0)', nilai: 100, min: 0, maks: 1000000 }],
            tombol: [{ id: 'bgo', teks: 'Hitung' }],
          }) +
          Wadah({ ids, id: 'bviz', gaya: 'margin:16px 0' }) +
          Keluaran({ ids, id: 'bout' }),
      }),

      Catatan({ jenis: 'baik', isi: `<b>Kenapa bisa begitu?</b> Ingat aturan tempel-balik tadi. Setiap kali barisan digandakan, separuh belakangnya adalah kebalikan separuh depan.
        <br><br>Sekarang perhatikan: posisi ke-i dan posisi ke-(i + separuh panjang) itu isinya pasti berlawanan. Dan menambah "separuh panjang" ke sebuah angka sama saja dengan <b>menyalakan satu bit baru</b> di binernya. Jadi tiap kali ada tambahan angka 1 di biner, jawabannya berbalik.
        <br><br>Mulai dari i = 0 yang binernya tidak punya angka 1 sama sekali (jawabannya 0), lalu tinggal dihitung: berapa kali berbalik? Sebanyak angka 1 yang ada. Genap berarti kembali ke 0, ganjil berarti jadi 1.
        <span class="tiny" style="display:block;margin-top:6px">✅ Sudah diuji untuk semua i dari 0 sampai 131.071.</span>` }),

      /* ===== LAB 3: PETA BARISAN ===== */
      Lab({
        judul: 'Lab 3 · Peta barisan', petunjuk: 'lihat bentuknya mengulang diri sendiri',
        isi:
          Kontrol({
            ids, kolom: [{ id: 'pn', label: 'sampai 2^n karakter', nilai: 8, min: 3, maks: 12 }],
            tombol: [{ id: 'pgo', teks: 'Gambar' }],
          }) +
          Wadah({ ids, id: 'peta', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'pout' }),
      }),

      /* ===== CARA CEPAT ===== */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Semuanya sudah diadu dengan perhitungan langsung.',
        isi: Tab({
          ids, id: 'trik', daftar: [
            {
              kunci: 'k1', judul: 'Trik biner',
              isi: `<p style="margin:0 0 10px">Ini senjata utamanya. Berlaku untuk <b>berapa pun</b> n, bahkan n = 2026.</p>` +
                Rumus({
                  label: 'Cara paling cepat',
                  isi: `karakter ke-i (mulai dari 0) =<br>
                        <mark>jumlah angka 1 pada biner i, lalu lihat ganjil-genapnya</mark><br>
                        <span style="font-size:12.5px;color:var(--tinta-2)">genap → 0 &nbsp;·&nbsp; ganjil → 1</span>`,
                  verifikasi: 'Sudah diuji i = 0 sampai 131.071',
                }) +
                `<div class="out" style="margin-top:12px">Contoh: karakter ke-100

  100 dalam biner = 1100100
  angka 1-nya ada : 3 buah
  3 itu ganjil    → jawabannya ${hijau('1')}

Tidak perlu tahu n sama sekali. Asal 2ⁿ > 100, hasilnya
selalu sama — karena bagian depannya tidak pernah berubah.</div>` +
                Catatan({ jenis: 'awas', isi: '<b>Awas indeks.</b> Trik ini pakai indeks <b>mulai dari 0</b>. Kalau soal bilang "karakter ke-2025 dengan indeks mulai 1", kamu harus pakai i = <b>2024</b>. Salah satu langkah ini bikin jawabanmu meleset.' }),
            },
            {
              kunci: 'k2', judul: 'Bangun secukupnya',
              isi: `<p style="margin:0 0 10px">Kalau kamu lupa trik binernya, masih ada cara aman: <b>bangun versi terkecil yang sudah cukup panjang</b>.</p>` +
                Rumus({
                  label: 'Awalan tidak pernah berubah',
                  isi: `MANDIR(n−1) selalu jadi <mark>awalan</mark> MANDIR(n)<br>
                        jadi untuk karakter ke-i, cukup cari <mark>n terkecil dengan 2ⁿ ≥ i</mark>`,
                  verifikasi: 'Sudah diuji n = 0 sampai 16',
                }) +
                `<div class="out" style="margin-top:12px">Soal minta karakter ke-2025 dari MANDIR(2026).

  2¹⁰ = 1024  → kurang panjang
  2¹¹ = 2048  → ${hijau('cukup!')}

Jadi bangun ${hijau('MANDIR(11)')} saja — 2.048 karakter.
Bukan MANDIR(2026) yang panjangnya 600+ digit.</div>` +
                Kontrol({
                  ids, kolom: [
                    { id: 'ci', label: 'karakter ke- (mulai 1)', nilai: 2025, min: 1, maks: 100000 },
                    { id: 'cb', label: 'ambil berapa', nilai: 3, min: 1, maks: 16 }],
                  tombol: [{ id: 'cgo', teks: 'Cari' }],
                }) +
                Keluaran({ ids, id: 'cout' }),
            },
            {
              kunci: 'k3', judul: 'Menghitung "00"',
              isi: `<p style="margin:0 0 10px">Soal 34 menanyakan ada berapa "00" di dalam MANDIR(12). Panjangnya 4.096 — kelamaan kalau dihitung satu per satu di kertas.</p>` +
                `<p style="margin:0 0 10px">Triknya pakai sifat yang tadi disebut: <b>barisan ini tidak pernah punya "000"</b>. Artinya "00" tidak pernah bertumpuk, jadi menghitungnya jadi mudah.</p>` +
                Rumus({
                  label: 'Banyaknya "00" di MANDIR(n)',
                  isi: `<mark>⌊ 2ⁿ⁻¹ ÷ 3 ⌋</mark> &nbsp; <span style="font-size:12.5px;color:var(--tinta-2)">(dibulatkan ke bawah)</span>`,
                  verifikasi: 'Sudah diuji n = 1 sampai 18',
                }) +
                `<div class="out" style="margin-top:12px">MANDIR(12) → ⌊ 2¹¹ ÷ 3 ⌋ = ⌊ 2048 ÷ 3 ⌋ = ${hijau('682')}</div>` +
                Catatan({ isi: '<b>Kalau kamu penasaran dari mana rumusnya.</b> Potong barisan jadi pasangan dua-dua. Tiap pasangan pasti "01" atau "10" — tidak pernah "00" atau "11". Berarti "00" cuma bisa muncul di <b>sambungan</b> antar pasangan: yaitu saat pasangan "10" ketemu pasangan "01".<br><br>Nah, itu sama saja dengan mencari pola "10" di barisan satu tingkat sebelumnya. Dari situ munculah polanya.' }) +
                Kontrol({
                  ids, kolom: [{ id: 'hn', label: 'n', nilai: 12, min: 1, maks: 20 }],
                  tombol: [{ id: 'hgo', teks: 'Bandingkan dua cara' }],
                }) +
                Keluaran({ ids, id: 'hout' }),
            },
            {
              kunci: 'k4', judul: 'Cek instan',
              isi: `<p style="margin:0 0 10px">Tiga hal yang bisa kamu pakai dalam dua detik untuk membuang pilihan jawaban yang salah:</p>` +
                Rumus({
                  isi: `1. panjangnya <mark>selalu pangkat 2</mark> — kalau pilihan jawabannya bukan, coret<br><br>
                        2. angka 0 dan angka 1 <mark>selalu sama banyak</mark> (untuk n ≥ 1)<br><br>
                        3. <mark>tidak pernah ada "000" atau "111"</mark> — barisan tidak mungkin memuatnya`,
                  verifikasi: 'Sudah diuji n = 0 sampai 16',
                }) +
                `<p class="tiny">Sifat nomor 3 itu penemuan Thue tahun 1906, dan justru itu tujuan awal dia membuat barisan ini.</p>`,
            },
            {
              kunci: 'k5', judul: 'Doubling pada angka',
              isi: `<p style="margin:0 0 10px">Doubling tidak cuma terjadi pada teks. Bentuk ini juga sering muncul pada fungsi angka:</p>` +
                Kode(`<span class="kw">int</span> <span class="fn">F</span>(<span class="kw">int</span> x, <span class="kw">int</span> y) {
  <span class="kw">if</span> (y == 0) <span class="kw">return</span> <span class="c">/* sesuatu yang sederhana */</span>;
  <span class="kw">return</span> <span class="fn">F</span>(<span class="fn">F</span>(x, y-1), y-1);   <span class="c">// ← memanggil DIRI SENDIRI dua kali, bersarang</span>
}`) +
                Catatan({ jenis: 'awas', isi: '<b>Cirinya:</b> fungsi memanggil dirinya <b>dua kali dan bersarang</b> — hasil panggilan dalam langsung dipakai jadi input panggilan luar. Efeknya persis sama: tiap naik satu tingkat, dampaknya berlipat dua.<br><br>Kalau fungsi dasarnya "tambah z", maka setelah y tingkat yang ditambahkan menjadi <b>2ʸ × z</b>.<br><br>Bentuk ini dipakai soal 38–40 OSN-K 2026. Bahas lengkapnya ada di <b>Modul 06</b>.' }),
            },
          ],
        }),
      }),

      /* ===== PENYAMARAN ===== */
      Kartu({
        judul: 'Penyamaran',
        sub: 'Yang perlu kamu cari cuma satu: apakah hasil lama dipakai lagi untuk bikin hasil baru?',
        isi: Tab({
          ids, id: 'samar', daftar: [
            {
              kunci: 'a', judul: 'A · Tempel-balik',
              isi: Kode(`<span class="kw">return</span> <span class="fn">MANDIR</span>(n-1) + <span class="fn">MONDAR</span>(<span class="fn">MANDIR</span>(n-1));`) +
                Catatan({ isi: '<b>Bentuk asli OSN-K 2026.</b> <code>MANDIR(n-1)</code> muncul <b>dua kali</b> di baris yang sama — sekali apa adanya, sekali diubah. Begitu kamu lihat ini, langsung tahu panjangnya berlipat dua tiap tingkat.' }),
            },
            {
              kunci: 'b', judul: 'B · Tempel biasa',
              isi: Kode(`<span class="kw">return</span> <span class="fn">G</span>(n-1) + <span class="fn">G</span>(n-1);`) +
                Catatan({ isi: 'Tanpa dibalik. Panjangnya <b>tetap</b> 2ⁿ, tapi isinya cuma satu huruf diulang-ulang. Lebih gampang, tapi keluarganya sama.' }) +
                Kode(`<span class="kw">return</span> <span class="fn">G</span>(n-1) + <span class="fn">"X"</span> + <span class="fn">G</span>(n-1);`, 'margin-top:10px') +
                Catatan({ isi: 'Ini juga doubling, tapi panjangnya <b>2ⁿ⁺¹ − 1</b> karena ada sisipan di tengah. Kalau ketemu bentuk begini, hitung ulang panjangnya — jangan langsung pakai 2ⁿ.' }),
            },
            {
              kunci: 'c', judul: 'C · Pada angka',
              isi: Kode(`<span class="kw">return</span> <span class="fn">MAI</span>(<span class="fn">MAI</span>(x, y-1, z), y-1, z);`) +
                Catatan({ isi: 'Bukan teks, tapi angka. Pemanggilan bersarang dua kali bikin efeknya jadi <b>2ʸ kali lipat</b>. Ini soal 38–40 OSN-K 2026, dibahas di Modul 06.' }),
            },
            {
              kunci: 'd', judul: 'D · Cerita',
              isi: Catatan({ isi: '"Selembar kertas dilipat dua, lalu dilipat dua lagi, terus sampai 12 kali. Setelah dibuka, ada berapa garis lipatan? Garis mana yang menghadap ke atas dan mana yang ke bawah?"' }) +
                `<p class="tiny">Kalau kamu urutkan arah lipatannya, hasilnya juga barisan yang menggandakan diri — mirip sekali dengan MANDIR. Tidak ada kode sama sekali, tapi bentuknya sama.</p>`,
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: Kode(`<span class="kw">return</span> <span class="fn">f</span>(n-1) + <span class="fn">f</span>(n-3);`) +
                Catatan({ jenis: 'awas', isi: 'Memang bercabang, tapi <b>bukan</b> doubling. Yang dipanggil dua tingkat yang <b>berbeda</b>, jadi panjangnya tidak berlipat rapi. Kerjakan dengan cara biasa: hitung suku-suku awalnya, cari polanya.' }) +
                Kode(`<span class="kw">return</span> <span class="fn">g</span>(n/2) + <span class="fn">g</span>(n/2);`, 'margin-top:10px') +
                Catatan({ jenis: 'awas', isi: 'Ini juga bukan doubling biasa. Karena yang dipanggil <code>n/2</code> (bukan <code>n−1</code>), kedalamannya cuma sekitar log n. Perhatikan <b>apa yang dikurangi atau dibagi</b>, jangan cuma lihat ada dua pemanggilan.' }),
            },
          ],
        }),
      }),

      /* ===== BEDAH SOAL ===== */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2026 · soal 32–34',
        sub: 'Lihat susunannya. Soal pertama masih bisa dihitung kalau kamu telaten, soal kedua mustahil tanpa insight, soal ketiga butuh sifat khusus barisan ini.',
        isi: Kisi([
          KartuSoal({ ids, nomor: 'Soal 32', pertanyaan: 'Ada berapa karakter <code>1</code> di dalam <code>MANDIR(12)</code>?', idKeluaran: 's1' }),
          KartuSoal({ ids, nomor: 'Soal 33', pertanyaan: 'Kalau S = <code>MANDIR(2026)</code>, apa substring karakter ke-2025 sampai ke-2027? (indeks mulai dari 1)', idKeluaran: 's2' }),
          KartuSoal({ ids, nomor: 'Soal 34', pertanyaan: 'Ada berapa substring <code>"00"</code> di dalam <code>MANDIR(12)</code>?', idKeluaran: 's3' }),
        ]) + `<button class="btn" id="${I('solve')}" style="margin-top:14px">Selesaikan ketiganya</button>`,
      }),

      Catatan({
        jenis: 'awas', isi: `<b>Kapan ini bukan doubling.</b>
        <table class="t" style="margin-top:10px;background:transparent">
          <tr><th style="text-align:left">Bentuknya</th><th style="text-align:left">Sebenarnya apa</th></tr>
          <tr><td style="text-align:left"><code>f(n−1) + ubah(f(n−1))</code></td><td style="text-align:left">✅ doubling — panjang 2ⁿ</td></tr>
          <tr><td style="text-align:left"><code>f(f(x, y−1), y−1)</code></td><td style="text-align:left">✅ doubling pada angka — efeknya 2ʸ</td></tr>
          <tr><td style="text-align:left"><code>f(n−1) + f(n−3)</code></td><td style="text-align:left">❌ bercabang biasa — hitung suku awalnya</td></tr>
          <tr><td style="text-align:left"><code>g(n/2) + g(n/2)</code></td><td style="text-align:left">❌ membagi dua, bukan menggandakan</td></tr>
          <tr><td style="text-align:left"><code>(f(N−1) + K − 1) % N + 1</code></td><td style="text-align:left">❌ Josephus (Modul 01)</td></tr>
        </table>`,
      }),

      Catatan({ isi: '<b>Biasakan cek 30 detik sebelum pakai trik biner.</b><br><br>Coba dulu di angka kecil yang bisa kamu cocokkan dengan tangan. Karakter ke-3 (mulai dari 0): binernya 11, ada dua angka 1, genap, jadi harusnya <b>0</b>. Lihat MANDIR(2) = 0110 — karakter ke-3 memang <b>0</b>. Cocok.<br><br>Lalu pastikan indeksnya. Kalau soal memakai indeks mulai 1, kurangi dulu satu.' }),

    ].join('');

    /* ================= PERILAKU ================= */

    /* ---- Lab 1: bangun lapis demi lapis ---- */
    ids.klik('go', () => {
      const n = ids.n('n', { min: 0, maks: 10, bawaan: 5 });
      let html = '';
      for (let k = 0; k <= n; k++) {
        const s = M.mandir(k), lama = k > 0 ? Math.pow(2, k - 1) : s.length;
        const potong = s.length > 128 ? s.slice(0, 128) : s;
        const sel = potong.split('').map((c, i) => {
          const salinan = k > 0 && i < lama;
          return kotak(c, salinan
            ? 'border:1.5px solid var(--tinta);background:var(--tinta);color:#fff'
            : 'border:1.5px solid var(--garis-tebal);background:var(--putih);color:var(--tinta-2)');
        }).join('');
        html += `<div style="margin-bottom:7px">
          <span class="tiny" style="font-family:var(--mono);display:inline-block;min-width:74px">n=${k}</span>
          ${sel}${s.length > 128 ? '<span class="tiny"> …</span>' : ''}
          <span class="tiny" style="color:var(--tinta-3)"> panjang ${angka(s.length)}</span></div>`;
      }
      ids.q('lapis').innerHTML = html +
        `<p class="tiny" style="margin-top:8px">
         <span style="background:var(--tinta);color:#fff;padding:1px 6px;border-radius:4px">gelap</span> salinan persis dari baris atasnya ·
         <span style="background:var(--putih);border:1.5px solid var(--garis-tebal);padding:1px 6px;border-radius:4px">terang</span> bagian baru (kebalikannya)</p>`;
      const s = M.mandir(n), satu = s.split('').filter((c) => c === '1').length;
      ids.tulis('out', `MANDIR(${n})
  panjang     = ${angka(s.length)} = 2^${n}
  banyak '1'  = ${angka(satu)}${n >= 1 ? ` = 2^${n - 1}` : ''}
  banyak '0'  = ${angka(s.length - satu)}   ${n >= 1 && satu === s.length - satu ? '← sama banyak' : ''}

${redup('Tiap turun satu baris, panjangnya dikali dua. Dari n=0 ke n=10 saja\nsudah dari 1 karakter jadi 1.024 karakter.')}`);
      bukaRumus(ids, 'rumus');
    });
    
    /* ---- Lab 2: trik biner ---- */
    ids.klik('bgo', () => {
      const i = ids.n('bi', { min: 0, maks: 1000000, bawaan: 100 });
      const b = i.toString(2), satu = M.popcount(i), hasil = M.tm(i);
      const sel = (c) => `<span style="display:inline-block;width:30px;height:38px;line-height:38px;
        text-align:center;font-family:var(--mono);font-size:17px;font-weight:600;
        border:2px solid ${c === '1' ? 'var(--merah)' : 'var(--garis-tebal)'};border-radius:6px;margin:2px;
        background:${c === '1' ? 'var(--merah)' : '#fff'};color:${c === '1' ? '#fff' : 'var(--tinta-3)'}">${c}</span>`;
      ids.q('bviz').innerHTML = `<div style="text-align:center">
        <div class="tiny" style="margin-bottom:4px">i = ${angka(i)} dalam biner</div>
        <div>${b.split('').map(sel).join('')}</div>
        <div style="font-size:15px;color:var(--merah);margin:8px 0;font-family:var(--mono)">
          angka 1 yang merah: <b style="font-size:20px">${satu}</b> buah — ${satu % 2 ? 'GANJIL' : 'GENAP'}</div>
        <div style="font-family:var(--disp);font-size:34px;font-weight:700;
          color:${hasil ? 'var(--tinta)' : 'var(--tinta-2)'}">karakter = ${hasil}</div></div>`;
      const cek = i < 65536 ? M.mandir(16)[i] : null;
      ids.tulis('bout', `i = ${angka(i)}   biner ${b}
banyak angka 1 = ${satu}  →  ${satu % 2 ? 'ganjil → 1' : 'genap → 0'}

hasil trik biner = ${hijau(hasil)}
` + (cek !== null
        ? `dibangun sungguhan = ${hijau(cek)}   ${String(hasil) === cek ? '✓ sama' : merah('✗ beda')}`
        : redup('(terlalu besar untuk dibangun sungguhan — tapi triknya tetap berlaku)')) +
        `\n\n${redup('Perhatikan: kamu tidak perlu tahu n sama sekali. Asal 2ⁿ lebih besar\ndari i, jawabannya selalu sama.')}`);
    });
    ids.q('bgo').click();

    /* ---- Lab 3: peta barisan ---- */
    ids.klik('pgo', () => {
      const n = ids.n('pn', { min: 3, maks: 12, bawaan: 8 });
      const total = Math.pow(2, n), baris = Math.min(64, Math.pow(2, Math.ceil(n / 2)));
      const sisi = Math.max(4, Math.floor(420 / baris));
      let html = '';
      for (let r = 0; r * baris < total; r++) {
        html += '<div style="line-height:0;font-size:0">';
        for (let k = 0; k < baris && r * baris + k < total; k++) {
          const v = M.tm(r * baris + k);
          html += `<span style="display:inline-block;width:${sisi}px;height:${sisi}px;
            background:${v ? 'var(--tinta)' : 'var(--kertas)'};
            outline:0.5px solid rgba(169,192,208,.4)"></span>`;
        }
        html += '</div>';
      }
      ids.q('peta').innerHTML = html +
        `<p class="tiny" style="margin-top:8px">${angka(total)} karakter, ${baris} per baris ·
         <span style="background:var(--tinta);padding:1px 8px;border-radius:3px">&nbsp;</span> = 1 ·
         <span style="background:var(--kertas);border:1px solid var(--garis-tebal);padding:1px 8px;border-radius:3px">&nbsp;</span> = 0</p>`;
      ids.tulis('pout', `Menampilkan 2^${n} = ${angka(total)} karakter pertama.

${redup('Coba ubah n-nya naik-turun. Bentuknya mengulang diri sendiri:\nkalau kamu ambil separuhnya, polanya mirip dengan keseluruhan.\nItulah tanda khas barisan yang menggandakan diri.')}`);
    });
    ids.q('pgo').click();

    /* ---- bangun secukupnya ---- */
    ids.klik('cgo', () => {
      const ke = ids.n('ci', { min: 1, maks: 100000, bawaan: 2025 });
      const byk = ids.n('cb', { min: 1, maks: 16, bawaan: 3 });
      const akhir = ke + byk - 1;
      let m = 0; while (Math.pow(2, m) < akhir) m++;
      const s = M.mandir(Math.min(m, 17));
      const sub = s.slice(ke - 1, ke - 1 + byk);
      const sBesar = M.mandir(Math.min(m + 2, 18));
      const subBesar = sBesar.slice(ke - 1, ke - 1 + byk);
      const lewatBiner = M.mandirPotong(ke - 1, byk);
      ids.tulis('cout', `Butuh karakter ke-${angka(ke)} sampai ke-${angka(akhir)} (indeks mulai 1).

Cari n terkecil dengan 2^n ≥ ${angka(akhir)}:
  2^${m} = ${angka(Math.pow(2, m))}  ${hijau('cukup')}

Cukup bangun ${hijau('MANDIR(' + m + ')')} — bukan MANDIR(2026).

  hasil = ${hijau('"' + sub + '"')}

Cek pakai MANDIR(${Math.min(m + 2, 18)}) yang jauh lebih panjang: "${subBesar}"
${sub === subBesar ? hijau('✓ SAMA — awalannya memang tidak berubah') : merah('✗ beda')}

Cek pakai trik biner (indeks 0-based ${angka(ke - 1)}..${angka(akhir - 1)}): "${lewatBiner}"
${sub === lewatBiner ? hijau('✓ SAMA JUGA') : merah('✗ beda')}`);
    });
    ids.q('cgo').click();

    /* ---- menghitung "00" ---- */
    ids.klik('hgo', () => {
      const n = ids.n('hn', { min: 1, maks: 20, bawaan: 12 });
      const rumus = M.mandirC00(n);
      let langsung = null;
      if (n <= 18) {
        const s = M.mandir(n); langsung = 0n;
        for (let i = 0; i < s.length - 1; i++) if (s[i] === '0' && s[i + 1] === '0') langsung++;
      }
      ids.tulis('hout', `CARA 1 — bangun MANDIR(${n}) lalu periksa satu per satu
  hasil = ${langsung === null ? redup('(terlalu besar untuk dibangun)') : hijau(langsung.toLocaleString('id-ID'))}   ${langsung === null ? '' : redup(`${(2n ** BigInt(n) - 1n).toLocaleString('id-ID')} kali pemeriksaan`)}

CARA 2 — rumus langsung
  ⌊ 2^${n - 1} ÷ 3 ⌋ = ⌊ ${(2n ** BigInt(n - 1)).toLocaleString('id-ID')} ÷ 3 ⌋ = ${hijau(rumus.toLocaleString('id-ID'))}   ${redup('(satu pembagian)')}

${langsung === null ? '' : (langsung === rumus ? hijau('✓ DUA CARA SAMA') : merah('✗ beda'))}`);
    });
    ids.q('hgo').click();

    /* ---- bedah soal ---- */
    ids.klik('solve', () => {
      const s12 = M.mandir(12), satu = s12.split('').filter((c) => c === '1').length;
      /* Angka soalnya jadi tetapan, dan semua turunannya DIHITUNG.
         Kalau N diubah, seluruh kalimatnya ikut menyesuaikan. */
      const N05 = 12, panjang05 = Math.pow(2, N05);
      ids.tulis('s1', `panjang MANDIR(${N05}) = 2^${N05} = ${angka(panjang05)}
angka 0 dan 1 selalu sama banyak,
jadi angka 1 ada separuhnya.

  ${angka(panjang05)} ÷ 2 = ${hijau(angka(satu))}

${redup('Atau langsung: 2^(' + N05 + '−1) = 2^' + (N05 - 1) + ' = ' + Math.pow(2, N05 - 1) + '.')}`);

      let m = 0; while (Math.pow(2, m) < 2027) m++;
      const sub = M.mandir(m).slice(2024, 2027);
      ids.tulis('s2', `MANDIR(2026) panjangnya 2²⁰²⁶ — mustahil dibangun.

Tapi awalannya tidak pernah berubah. Cari n terkecil
yang sudah cukup panjang:
  2^${m - 1} = ${angka(Math.pow(2, m - 1))}  kurang
  2^${m} = ${angka(Math.pow(2, m))}  ${hijau('cukup, karena 2027 ≤ ' + angka(Math.pow(2, m)))}

Bangun MANDIR(${m}) saja, ambil karakter ke-2025..2027.

  jawabannya ${hijau('"' + sub + '"')}

${redup('Cara kedua — trik biner, indeks 0-based 2024, 2025, 2026:')}
  2024 = ${(2024).toString(2)}  → ${M.popcount(2024)} angka 1 → ${M.popcount(2024) % 2 ? 'ganjil' : 'genap'} → ${M.tm(2024)}
  2025 = ${(2025).toString(2)}  → ${M.popcount(2025)} angka 1 → ${M.popcount(2025) % 2 ? 'ganjil' : 'genap'} → ${M.tm(2025)}
  2026 = ${(2026).toString(2)}  → ${M.popcount(2026)} angka 1 → ${M.popcount(2026) % 2 ? 'ganjil' : 'genap'} → ${M.tm(2026)}
  → ${hijau('"' + M.mandirPotong(2024, 3) + '"')} ${M.mandirPotong(2024, 3) === sub ? '✓ sama' : merah('✗')}`);

      let c = 0; for (let i = 0; i < s12.length - 1; i++) if (s12[i] === '0' && s12[i + 1] === '0') c++;
      ids.tulis('s3', `Barisan ini tidak pernah punya "000",
jadi "00" tidak pernah bertumpuk — gampang dihitung.

  ⌊ 2^${N05 - 1} ÷ 3 ⌋ = ⌊ ${angka(Math.pow(2, N05 - 1))} ÷ 3 ⌋ = ${hijau(angka(c))}

${redup(`Cek dengan menghitung langsung di 4.096 karakter: ${angka(c)} ✓`)}`);
    });

    pasangTab('trik'); pasangTab('samar');
  },
};
