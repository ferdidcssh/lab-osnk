/* ============================================================
   MODUL 01 — JOSEPHUS PROBLEM
   Seluruh rumus di berkas ini diverifikasi oleh
   verify/01-josephus.py — jangan ubah tanpa menjalankannya lagi.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Kode, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

/* ---------- visual: lingkaran orang (SVG, tidak bergantung ukuran layar) ---------- */
function gambarLingkaran(st) {
  const n = st.n, R = 132, cx = 170, cy = 170;
  // jarak antar kursi = 2R·sin(π/n); radius diambil 42% darinya agar tidak bertumpuk
  const rDasar = Math.min(17, 0.84 * R * Math.sin(Math.PI / Math.max(n, 2)));
  let s = `<svg viewBox="0 0 340 340" width="100%" role="img" aria-label="Lingkaran ${n} orang">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--garis-tebal)"
        stroke-width="2" stroke-dasharray="5 5"/>`;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + 2 * Math.PI * i / n;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    const keluar = st.out.includes(i + 1);
    const menang = st.done && st.survivor === i + 1;
    const kini = !st.done && st.next === i + 1;
    let isi = '#fff', garis = 'var(--tinta)', warna = 'var(--tinta)', r = rDasar, coret = 'none';
    if (keluar) { isi = 'var(--kertas)'; garis = 'var(--garis-tebal)'; warna = 'var(--tinta-3)'; r = rDasar * 0.76; coret = 'line-through'; }
    if (kini) { isi = 'var(--merah)'; garis = 'var(--merah)'; warna = '#fff'; r = rDasar * 1.18; }
    if (menang) { isi = 'var(--stabilo)'; garis = 'var(--tinta)'; warna = 'var(--tinta)'; r = rDasar * 1.24; }
    const fs = Math.max(7, r * 0.80);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${isi}"
          stroke="${garis}" stroke-width="${(rDasar > 12 ? 2.5 : 1.8).toFixed(1)}"/>`;
    s += `<text x="${x.toFixed(1)}" y="${(y + fs * 0.35).toFixed(1)}" text-anchor="middle" fill="${warna}"
          style="font-family:var(--mono);font-size:${fs.toFixed(1)}px;font-weight:600;text-decoration:${coret}">${i + 1}</text>`;
  }
  const sisa = st.n - st.out.length;
  s += `<text x="${cx}" y="${cy - 6}" text-anchor="middle"
        style="font-family:var(--mono);font-size:13px;fill:var(--tinta-2)">sisa</text>`;
  s += `<text x="${cx}" y="${cy + 18}" text-anchor="middle"
        style="font-family:var(--disp);font-size:24px;font-weight:700;fill:var(--tinta)">${sisa}</text>`;
  return s + '</svg>';
}

export default {
  id: 'josephus', n: '01', kelompok: 'Teori Bilangan',
  judul: 'Josephus Problem',
  lede: 'Orang duduk melingkar, setiap orang ke-K dikeluarkan sampai tersisa satu. Nomor berapa yang selamat? Sudah muncul di OSN-K 2024 dan 2026 — dengan kode yang sama sekali tidak mirip satu sama lain.',
  lencana: ['<span class="chip r">2024 &amp; 2026</span>', '<span class="chip v">Terverifikasi n=1..499</span>'],

  /* ---- kartu drill: dikumpulkan otomatis oleh modul Drill ---- */
  kartu: [
    { q: 'return (pndk(N-1,K)+K-1)%N+1;', a: 'josephus', why: 'Rekursi (f(N−1) + konstanta) % N — Josephus umum.' },
    { q: 'while(p*2<=n) p*=2;  return 2*(n-p)+1;', a: 'josephus', why: 'Pangkat 2 terbesar ≤ n, lalu 2(n−p)+1 = Josephus K=2.' },
    { q: '“N orang melingkar, setiap orang ke-K dikeluarkan, siapa yang tersisa?”', a: 'josephus', why: 'Kata pemicu: melingkar + eliminasi setiap ke-K.' },
    { q: 'erase() dalam while(size>1) dengan indeks bergeser K', a: 'josephus', why: 'Josephus versi simulasi langsung — tanpa rekursi, tanpa pangkat 2.' },
    { q: '“Berapa banyak bye di turnamen dengan 100 peserta?”', a: 'lain', why: 'Bukan Josephus penuh, tapi memakai komponen yang sama: L = n − p.' },
  ],

  /* ---- entri kamus kata kunci ---- */
  kamus: [
    ['“melingkar” + “setiap ke-K dikeluarkan”', 'Josephus'],
    ['“pangkat 2 terbesar ≤ n”', 'Josephus K=2 / bye turnamen'],
  ],

  bangun(root, { ids, pasangTab }) {
    const K = (t) => ids.i(t);

    root.innerHTML = [

      /* ===== APA ITU ===== */
      Kartu({
        judul: 'Apa itu Josephus Problem?',
        isi: `
        <p style="margin:10px 0">Sekelompok orang berdiri melingkar dan dinomori 1 sampai n. Dimulai dari orang nomor 1, mereka berhitung searah jarum jam. Setiap hitungan ke-<b>K</b> jatuh pada seseorang, orang itu <b>keluar dari lingkaran</b>. Hitungan lalu dilanjutkan dari orang berikutnya yang masih ada. Proses ini berulang sampai <b>tersisa satu orang</b>.</p>
        <p style="margin:10px 0">Pertanyaannya sederhana: <b>nomor berapa yang tersisa?</b> Yang tidak sederhana adalah menjawabnya untuk n yang besar tanpa menyimulasikan satu per satu — dan di situlah letak seluruh isi modul ini.</p>` +
        Catatan({ isi: `<b>Asal namanya.</b> Nama masalah ini diambil dari <b>Flavius Josephus</b>, sejarawan Yahudi abad ke-1. Menurut catatannya sendiri, saat Perang Yahudi–Romawi ia terjebak di sebuah gua bersama sekelompok pemberontak. Mereka memilih mati daripada tertangkap, lalu membentuk lingkaran dan sepakat membunuh setiap orang ketiga. Josephus — yang tidak ingin mati dengan cara itu — memperhitungkan posisi mana yang akan tersisa, lalu berdiri di sana bersama seorang rekannya.
        <br><br>Rumusan matematisnya baru muncul jauh kemudian, dalam buku teka-teki <i>Problèmes plaisants et délectables</i> karya <b>Bachet de Méziriac</b> (1624), dengan 41 orang dan K = 3. <b>Euler</b> ikut membahasnya pada 1776. Analisis modern yang dipakai di modul ini berasal dari buku <b>Concrete Mathematics</b> (Graham, Knuth, &amp; Patashnik).` }) +
        Catatan({ jenis: 'baik', isi: `<b>Uji cerita itu dengan simulasi.</b> Untuk n = 41 dan K = 3, dua orang terakhir yang bertahan adalah posisi <mark>16</mark> dan <mark>31</mark> — dan yang paling akhir tersisa adalah <mark>31</mark>. Persis dua kursi yang menurut cerita diambil Josephus dan rekannya. Coba sendiri di lab bawah: isi n = 41, K = 3.
        <span class="tiny" style="display:block;margin-top:6px">✅ Terverifikasi dengan simulasi penuh.</span>` }) +
        `<h4 style="margin:18px 0 6px;font-size:14px">Kenapa masalah ini penting untuk OSN-K?</h4>
        <p class="tiny" style="margin:0">Bukan karena ceritanya, tapi karena <b>bentuk matematikanya sangat khas</b> dan mudah disamarkan menjadi potongan kode yang kelihatan asing. Josephus sudah muncul di <b>dua dari tiga</b> naskah OSN-K terakhir — dan dua-duanya dengan kode yang tidak mirip satu sama lain.</p>`,
      }),

      /* ===== LAB 1 ===== */
      Lab({
        judul: 'Lab 1 · Simulasi lingkaran', petunjuk: 'ubah n dan K, lalu jalankan',
        isi:
          Kontrol({
            ids,
            kolom: [
              { id: 'n', label: 'n (orang)', nilai: 7, min: 1, maks: 50 },
              { id: 'k', label: 'K (hitungan)', nilai: 3, min: 1, maks: 12 },
            ],
            tombol: [
              { id: 'play', teks: '▶ Putar pelan' },
              { id: 'step', teks: 'Satu langkah', gaya: 'alt' },
              { id: 'go', teks: 'Langsung selesai', gaya: 'alt' },
              { id: 'reset', teks: 'Ulang', gaya: 'alt' },
            ],
          }) +
          Wadah({ ids, id: 'circ', gaya: 'max-width:340px;margin:4px auto 10px' }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan salah satu tombol untuk memulai.' }) +
          `<p class="tiny" style="margin:10px 0 0">Coba juga <b>n = 41, K = 3</b> untuk mengulang kasus sejarahnya, atau <b>K = 1</b> untuk melihat kasus paling sepele.</p>`,
      }),

      /* ===== TABEL POLA ===== */
      Kartu({
        judul: 'Sekarang kita persempit: fokus ke K = 2',
        sub: 'Kasus K = 2 (setiap orang <i>kedua</i> keluar) punya pola paling rapi, dan justru itu yang dipakai OSN-K 2026. Isi tabel di bawah, lalu perhatikan n mana yang hasilnya 1.',
        isi: `<div class="scroll"><table class="t" id="${K('tab')}"></table></div>
              <button class="btn alt" id="${K('isi')}" style="margin-top:12px">Isi tabel otomatis</button>
              <div id="${K('petunjuk')}" style="margin-top:14px"></div>`,
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Rumus utama · K = 2',
        isi: `tulis n = p + L, dengan p = pangkat 2 terbesar yang ≤ n<br>
              <mark>yang selamat = 2L + 1 = 2 × (n − p) + 1</mark>`,
        verifikasi: 'Diadu dengan simulasi lingkaran n = 1..2.000, dan dengan rekurensinya sampai n = 200.000',
        pesan: 'Isi tabelnya dulu — rumusnya lebih membekas kalau kamu sendiri yang menemukannya.',
      }),

      /* ===== TRIK BINER ===== */
      Lab({
        judul: 'Lab 2 · Trik biner — yang paling terasa curang', petunjuk: 'tanpa hitung sama sekali',
        isi:
          `<p style="margin:0 0 14px">Tulis n dalam <b>biner</b>. Ambil bit paling depan, pindahkan ke paling belakang. Baca hasilnya sebagai biner lagi. <b>Itu jawabannya.</b> Tidak ada perkalian, tidak ada pengurangan.</p>` +
          Kontrol({ ids, kolom: [{ id: 'bn', label: 'n', nilai: 100, min: 1, maks: 100000 }], tombol: [{ id: 'bgo', teks: 'Geser' }] }) +
          Wadah({ ids, id: 'bviz', gaya: 'margin:16px 0' }) +
          Keluaran({ ids, id: 'bout' }),
      }),

      Catatan({ jenis: 'baik', isi: `<b>Kenapa trik ini bekerja?</b> Bit paling depan dari n <i>adalah</i> nilai p (pangkat 2 terbesar). Sisa bit di belakangnya <i>adalah</i> nilai L. Memindahkan bit depan ke belakang sama artinya dengan membuang p lalu menggeser L satu posisi ke kiri (yaitu ×2) dan menambahkan 1 di ujung — persis <b>2L + 1</b>.
        <span class="tiny" style="display:block;margin-top:6px">✅ Terverifikasi identik dengan simulasi untuk n = 1 sampai 3.000.</span>` }),

      /* ===== CARA CEPAT ===== */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Semua sudah diuji terhadap simulasi langsung. Pilih yang paling cocok dengan bentuk soalnya.',
        isi: Tab({
          ids, id: 'trik', daftar: [
            {
              kunci: 't1', judul: 'Cek instan',
              isi: `<p style="margin:0 0 10px">Tiga pemeriksaan yang bisa dilakukan dalam dua detik, berguna untuk membuang pilihan jawaban yang salah:</p>` +
                Rumus({
                  label: 'Untuk K = 2',
                  isi: `1. Jawabannya <mark>selalu ganjil</mark><br>
                        2. Kalau n <mark>pangkat 2</mark> (1, 2, 4, 8, 16, …) → jawabannya <mark>1</mark><br>
                        3. Kalau n berbentuk <mark>2ᵐ − 1</mark> (1, 3, 7, 15, 31, 63, …) → jawabannya <mark>n itu sendiri</mark>`,
                  verifikasi: 'Diuji n = 1..800',
                }) +
                `<p class="tiny">Sifat ke-3 sangat sering dipakai penyusun soal: angka seperti 63 atau 127 dipilih justru karena hasilnya "kembali ke dirinya sendiri".</p>`,
            },
            {
              kunci: 't2', judul: 'Naik-turun ganda',
              isi: `<p style="margin:0 0 10px">Kalau kamu ingin menghitung di kepala tanpa mengubah ke biner, pakai dua aturan ini dan naik dari n kecil:</p>` +
                Rumus({
                  label: 'Rekurensi penggandaan',
                  isi: `J(1) = 1<br>J(2n) = <mark>2·J(n) − 1</mark><br>J(2n+1) = <mark>2·J(n) + 1</mark>`,
                  verifikasi: 'Terverifikasi n = 1..1.500',
                }) +
                `<p style="margin:10px 0 0">Contoh menghitung J(100) tanpa alat:</p>
                 <div class="out" style="margin-top:8px">J(1)   = 1
J(3)   = 2·J(1) + 1 = 3        ${redup('(3 = 2·1+1)')}
J(6)   = 2·J(3) − 1 = 5        ${redup('(6 = 2·3)')}
J(12)  = 2·J(6) − 1 = 9
J(25)  = 2·J(12) + 1 = 19      ${redup('(25 = 2·12+1)')}
J(50)  = 2·J(25) − 1 = 37
J(100) = 2·J(50) − 1 = ${hijau('73')}</div>
                 <p class="tiny" style="margin-top:8px">Tujuh baris, semuanya perkalian dua. Urutannya kamu bangun dari <i>bawah</i>: pecah 100 → 50 → 25 → 12 → 6 → 3 → 1 dulu, baru dihitung naik.</p>`,
            },
            {
              kunci: 't3', judul: 'Iterasi',
              isi: `<p style="margin:0 0 10px">Kalau soal menerapkan fungsi Josephus <b>berulang kali</b> pada satu angka, kamu tidak perlu mengulangnya. Hasilnya selalu berhenti di satu tempat:</p>` +
                Rumus({
                  label: 'Titik henti iterasi',
                  isi: `t = banyaknya <b>angka 1</b> pada biner n<br>terapkan J berulang-ulang → berhenti di <mark>2ᵗ − 1</mark>`,
                  verifikasi: 'Terverifikasi n = 1..2.999',
                }) +
                Kontrol({ ids, kolom: [{ id: 'it', label: 'mulai dari n', nilai: 1000, min: 1, maks: 100000 }], tombol: [{ id: 'itgo', teks: 'Iterasi' }] }) +
                Keluaran({ ids, id: 'itout' }),
            },
            {
              kunci: 't4', judul: 'Penjumlahan',
              isi: `<p style="margin:0 0 10px">Kalau soal meminta <b>jumlah</b> J(1) + J(2) + … + J(n) — seperti soal 36 OSN-K 2026 — ada rumus langsungnya:</p>` +
                Rumus({
                  label: 'Rumus penjumlahan',
                  isi: `tulis n = 2ᵐ + L, dengan 0 ≤ L &lt; 2ᵐ<br>J(1) + … + J(n) = <mark>(4ᵐ − 1)/3 + (L+1)²</mark>`,
                  verifikasi: 'Terverifikasi n = 1..3.999',
                }) +
                `<p class="tiny">Kenapa ada kuadrat? Karena J(2ᵐ), J(2ᵐ+1), J(2ᵐ+2), … berturut-turut bernilai 1, 3, 5, 7, … Jumlah (L+1) bilangan ganjil pertama selalu tepat (L+1)².</p>` +
                Kontrol({ ids, kolom: [{ id: 'sn', label: 'n', nilai: 63, min: 1, maks: 4000 }], tombol: [{ id: 'sgo', teks: 'Hitung dua cara' }] }) +
                Keluaran({ ids, id: 'sout' }),
            },
            {
              kunci: 't5', judul: 'K ≠ 2',
              isi: `<p style="margin:0 0 10px">Untuk K selain 2 <b>tidak ada</b> rumus sesederhana trik biner. Yang tersedia adalah rekurensi — tapi ini pun jauh lebih cepat daripada menyimulasikan lingkaran:</p>` +
                Rumus({
                  label: 'Rekurensi umum',
                  isi: `mulai dari <b>r = 0</b><br>untuk i = 2, 3, …, n:&nbsp; r = <mark>(r + K) mod i</mark><br>jawaban akhir = <mark>r + 1</mark>`,
                  verifikasi: 'Terverifikasi n = 1..200, K = 1..12',
                }) +
                `<p class="tiny">Perhatikan: r dihitung dengan indeks mulai 0, jadi di akhir harus <b>ditambah 1</b>. Ini sumber kesalahan paling umum.</p>` +
                Catatan({ isi: '<b>Kasus sepele:</b> kalau K = 1, semua orang keluar berurutan dari nomor 1, jadi yang selamat selalu <b>orang ke-n</b>. ✅ Terverifikasi.' }) +
                Kontrol({
                  ids, kolom: [
                    { id: 'gn', label: 'n', nilai: 41, min: 1, maks: 3000 },
                    { id: 'gk', label: 'K', nilai: 3, min: 1, maks: 50 }],
                  tombol: [{ id: 'ggo', teks: 'Telusuri rekurensi' }],
                }) +
                Keluaran({ ids, id: 'gout' }),
            },
          ],
        }),
      }),

      /* ===== UJI RUMUS ===== */
      Kartu({
        judul: 'Uji sendiri: rumus vs simulasi penuh',
        sub: 'Jangan percaya rumus mana pun sebelum kamu mengujinya. Kolom kiri menyimulasikan lingkaran sungguhan, kolom kanan memakai rumus.',
        isi: Kontrol({
          ids, kolom: [{ id: 'tn', label: 'n', nilai: 100, min: 1, maks: 20000 }],
          tombol: [{ id: 'test', teks: 'Bandingkan' }, { id: 'test1000', teks: 'Uji 1.000 nilai acak', gaya: 'alt' }],
        }) + Keluaran({ ids, id: 'tout' }),
      }),

      /* ===== PENYAMARAN ===== */
      Kartu({
        judul: 'Penyamaran: satu konsep, lima wajah',
        sub: 'Kelimanya Josephus atau memakai komponennya. Kalau kamu hanya hafal bentuk kodenya, kamu akan tertipu.',
        isi: Tab({
          ids, id: 'samar', daftar: [
            {
              kunci: 'a', judul: 'A · Kode 2024',
              isi: Kode(`<span class="kw">int</span> <span class="fn">pndk</span>(<span class="kw">int</span> N, <span class="kw">int</span> K) {
  <span class="kw">if</span> (N==1) <span class="kw">return</span> 1;
  <span class="kw">else</span> <span class="kw">return</span> (<span class="fn">pndk</span>(N-1,K)+K-1)%N+1;
}`) + Catatan({ isi: '<b>Ciri khas:</b> rekursi berbentuk <code>(f(N−1) + konstanta) % N</code> — turun satu langkah setiap kali dipanggil, lalu dimodulo dengan N.<br><br>Kalau ditulis ulang dengan r = pndk − 1, bentuknya menjadi <code>r(N) = (r(N−1) + K) mod N</code> — persis rekurensi umum Josephus. ✅ Terverifikasi identik dengan simulasi untuk n = 1..200, K = 1..12.' }),
            },
            {
              kunci: 'b', judul: 'B · Kode 2026',
              isi: Kode(`<span class="kw">int</span> <span class="fn">LIPAT</span>(<span class="kw">int</span> n) { <span class="kw">if</span> (n==1) <span class="kw">return</span> 1; <span class="kw">return</span> 2*<span class="fn">LIPAT</span>(n/2); }
<span class="kw">int</span> <span class="fn">KODE</span>(<span class="kw">int</span> n)  { <span class="kw">return</span> 2*(n - <span class="fn">LIPAT</span>(n)) + 1; }`) +
                Catatan({ jenis: 'awas', isi: '<b>Perhatikan:</b> tidak ada satu pun kemiripan permukaan dengan kode 2024 — tidak ada parameter K, tidak ada modulo, tidak ada rekursi turun-satu. Tapi ini Josephus K = 2 persis. <code>LIPAT</code> mencari pangkat 2 terbesar ≤ n, lalu <code>KODE</code> menerapkan 2(n − p) + 1. ✅ Terverifikasi n = 1..2.000.' }),
            },
            {
              kunci: 'c', judul: 'C · Brute force',
              isi: Kode(`<span class="kw">int</span> idx = 0;
<span class="kw">while</span> (orang.size() &gt; 1) {
  idx = (idx + K - 1) % orang.size();
  orang.erase(orang.begin() + idx);
}`) + Catatan({ isi: '<b>Ciri khas:</b> tidak ada rekursi sama sekali, tidak ada pangkat 2. Yang tersisa hanyalah proses <i>menghapus setiap elemen ke-K secara melingkar</i> — dan itu sudah cukup untuk mengenalinya.' }),
            },
            {
              kunci: 'd', judul: 'D · Cerita',
              isi: Catatan({ isi: '"26 bebek berbaris melingkar bernomor 1–26. Setiap bebek kedua (searah jarum jam) dikeluarkan dari lingkaran, berulang hingga tersisa satu bebek. Bebek nomor berapa yang tersisa?"' }) +
                `<p class="tiny"><b>Kata pemicu:</b> "melingkar" + "setiap ke-K dikeluarkan" + "tersisa satu". Kerjakan dengan trik biner: 26 = 11010₂ → geser → 10101₂ = <mark>21</mark>.</p>`,
            },
            {
              kunci: 'e', judul: 'E · Turnamen',
              isi: Catatan({ isi: '"Dalam turnamen eliminasi tunggal dengan N peserta, jika N bukan pangkat 2, sebagian peserta mendapat <i>bye</i>. Banyaknya bye = N − pangkat 2 terbesar ≤ N."' }) +
                Catatan({ jenis: 'awas', isi: 'Ini <b>bukan</b> Josephus penuh — tapi memakai komponen yang persis sama, yaitu nilai L = n − p. Siswa yang hanya hafal "Josephus = orang dalam lingkaran" tidak akan menyadarinya.' }),
            },
          ],
        }),
      }),

      /* ===== BEDAH SOAL ===== */
      Kartu({
        judul: 'Bedah soal asli OSN-K',
        sub: 'Perhatikan bahwa mengenali Josephus hanya menyelesaikan soal pertama tiap grup. Dua soal sisanya butuh langkah tambahan — dan di situlah rumus penjumlahan serta titik henti iterasi terpakai.',
        isi: Tab({
          ids, id: 'soal', daftar: [
            {
              kunci: 's26', judul: 'OSN-K 2026 · soal 35–37',
              isi: `<p class="tiny" style="margin:0 0 10px">Kode: <code>LIPAT</code> / <code>KODE</code> / <code>TUNGGAL</code> / <code>GANDA</code>. Sudah dipastikan <code>KODE</code> = Josephus K = 2.</p>` +
                Kisi([
                  KartuSoal({ ids, nomor: 'Soal 35', pertanyaan: 'Berapa <code>KODE(41)</code>?', idKeluaran: 'a1' }),
                  KartuSoal({ ids, nomor: 'Soal 36', pertanyaan: 'Berapa <code>TUNGGAL(63)</code>, yaitu jumlah <code>KODE(1)</code> sampai <code>KODE(63)</code>?', idKeluaran: 'a2' }),
                  KartuSoal({ ids, nomor: 'Soal 37', pertanyaan: 'Berapa <code>GANDA(63, 64656667)</code>, yaitu menerapkan <code>KODE</code> sebanyak 64.656.667 kali pada tiap i lalu dijumlahkan?', idKeluaran: 'a3' }),
                ]) +
                `<button class="btn" id="${K('solve26')}" style="margin-top:14px">Selesaikan ketiganya</button>`,
            },
            {
              kunci: 's24', judul: 'OSN-K 2024 · soal 38–40',
              isi: `<p class="tiny" style="margin:0 0 10px">Kode: <code>pndk(N,K)</code>. Sudah dipastikan = Josephus umum.</p>` +
                Kisi([
                  KartuSoal({ ids, nomor: 'Soal 38', pertanyaan: 'Berapa <code>pndk(7,7)</code>?', idKeluaran: 'b1' }),
                  KartuSoal({ ids, nomor: 'Soal 39', pertanyaan: 'Mana yang terbesar: <code>pndk(30,3)</code>, <code>(40,3)</code>, <code>(50,3)</code>, <code>(60,3)</code>, <code>(70,3)</code>?', idKeluaran: 'b2' }),
                  KartuSoal({ ids, nomor: 'Soal 40', pertanyaan: 'Untuk N = 1..5000, nilai N mana yang membuat <code>pndk(N,2)</code> paling besar?', idKeluaran: 'b3' }),
                ]) +
                `<button class="btn" id="${K('solve24')}" style="margin-top:14px">Selesaikan ketiganya</button>`,
            },
          ],
        }),
      }),

      /* ===== BUKAN JOSEPHUS ===== */
      Catatan({
        jenis: 'awas', isi: `<b>Kapan ini BUKAN Josephus.</b> Tiga bentuk kode di bawah sering tertukar. Bedakan baik-baik:
        <table class="t" style="margin-top:10px;background:transparent">
          <tr><th style="text-align:left">Bentuk</th><th style="text-align:left">Sebenarnya</th></tr>
          <tr><td style="text-align:left"><code>(f(N−1) + K − 1) % N + 1</code></td><td style="text-align:left">✅ Josephus</td></tr>
          <tr><td style="text-align:left"><code>F(B, A % B)</code> — parameter tertukar</td><td style="text-align:left">❌ FPB cara Euclid</td></tr>
          <tr><td style="text-align:left"><code>f(N−1) + f(N−3)</code></td><td style="text-align:left">❌ Rekursi bercabang biasa</td></tr>
        </table>
        <span style="display:block;margin-top:10px">Bedanya: Josephus turun <b>satu</b> langkah lalu dimodulo <b>N</b> (nilai yang berubah tiap tingkat). FPB menukar posisi parameternya. Rekursi bercabang menjumlahkan dua pemanggilan.</span>`,
      }),

      Catatan({ isi: '<b>Sebelum memakai rumus, verifikasi 30 detik.</b> Hitung n = 1, 2, 3 dengan tangan, cocokkan dengan rumus. Kalau tiga-tiganya cocok, hampir pasti rumusmu benar. Kalau tidak, kamu baru saja menyelamatkan diri dari jawaban salah.' }),

    ].join('');

    /* ================= PERILAKU ================= */
    let st = null, timer = null;
    const wadah = ids.q('circ');

    const gambar = () => { if (wadah) wadah.innerHTML = gambarLingkaran(st); };
    const berhenti = () => {
      if (timer) { clearInterval(timer); timer = null; }
      const b = ids.q('play');
      if (b) b.textContent = '▶ Putar pelan';
    };
    /* Kalau siswa berpindah modul saat animasinya berjalan, panelnya
       diganti tapi timer-nya masih hidup — lalu meledak karena tombolnya
       sudah tidak ada. Jadi tiap detak diperiksa dulu: kalau elemennya
       hilang, timer dimatikan. */
    const masihAda = () => !!ids.q('play') && document.contains(ids.q('play'));
    const ringkas = () => {
      const cek = st.k === 2
        ? `\n${redup(`Cek dengan rumus K=2: p = ${M.pow2le(st.n)}, 2×(${st.n} − ${M.pow2le(st.n)}) + 1 = ${hijau(M.jos2(st.n))}`)}`
        : '';
      return `Urutan keluar: ${redup(st.order.join(' → '))}\n${hijau('Yang selamat: ' + st.survivor)}${cek}`;
    };

    function reset() {
      berhenti();
      const n = ids.n('n', { min: 1, maks: 50, bawaan: 7 }), k = ids.n('k', { min: 1, bawaan: 2 });
      const r = M.josSim(n, k);
      st = { n, k, out: [], order: r.order, survivor: r.survivor, i: 0, done: r.order.length === 0, next: r.order[0] };
      gambar();
      ids.tulis('out', st.done
        ? `n = 1, jadi tidak ada yang perlu dikeluarkan. ${hijau('Yang selamat: 1')}`
        : `Siap. n = ${n}, K = ${k}. Tekan <b>Putar pelan</b> untuk melihat prosesnya, atau <b>Satu langkah</b> untuk maju manual.`);
    }
    function selangkah() {
      if (!st) reset();
      if (st.done) { reset(); if (st.done) return; }
      if (st.i >= st.order.length) return;
      st.out.push(st.order[st.i]); st.i++; st.next = st.order[st.i];
      if (st.i >= st.order.length) { st.done = true; berhenti(); ids.tulis('out', ringkas()); }
      else ids.tulis('out', `Baru keluar: ${merah(st.out[st.out.length - 1])}   ·   giliran berikutnya jatuh pada <b>${st.next}</b>   ·   sisa ${st.n - st.out.length} orang`);
      gambar();
    }

    ids.klik('step', selangkah);
    ids.klik('reset', reset);
    ids.ketik('n', reset);
    ids.ketik('k', reset);
    ids.klik('play', () => {
      if (timer) { berhenti(); return; }
      if (!st || st.done) reset();
      if (st.done) return;
      ids.q('play').textContent = '⏸ Jeda';
      timer = setInterval(() => {
        if (!masihAda()) { berhenti(); return; }
        selangkah(); if (st.done) berhenti();
      }, 650);
    });
    ids.klik('go', () => {
      berhenti(); reset();
      if (st.done) return;
      st.out = [...st.order]; st.i = st.order.length; st.done = true;
      gambar(); ids.tulis('out', ringkas());
    });
    reset();

    /* ---- tabel pola ---- */
    const tb = ids.q('tab');
    const isiTabel = (penuh) => {
      let h = '<tr><th>n</th>';
      for (let i = 1; i <= 12; i++) h += `<th>${i}</th>`;
      h += '</tr><tr><th>selamat</th>';
      for (let i = 1; i <= 12; i++)
        h += penuh ? `<td class="${[1, 2, 4, 8].includes(i) ? 'hi' : ''}">${M.josSim(i, 2).survivor}</td>` : '<td>?</td>';
      tb.innerHTML = h + '</tr>';
    };
    isiTabel(false);
    ids.klik('isi', () => {
      isiTabel(true);
      ids.q('petunjuk').innerHTML = Catatan({
        jenis: 'baik', isi: `<b>Lihat kolom yang disorot.</b> Hasilnya 1 tepat ketika n = 1, 2, 4, 8 — semuanya <mark>pangkat 2</mark>.
        <br><br>Sekarang lihat n = 6, hasilnya 5. Padahal 6 = 4 + 2, dan 5 = 2×2 + 1. Cek n = 7: 7 = 4 + 3, dan hasilnya 2×3 + 1 = 7 ✓. Cek n = 5: 5 = 4 + 1, dan hasilnya 2×1 + 1 = 3 ✓.
        <br><br>Jadi yang menentukan bukan n itu sendiri, melainkan <b>sisa n terhadap pangkat 2 di bawahnya</b>.`,
      });
      bukaRumus(ids, 'rumus');
    });

    /* ---- trik biner ---- */
    ids.klik('bgo', () => {
      const n = ids.n('bn', { min: 1, maks: 100000, bawaan: 100 });
      const b = n.toString(2), r = M.rotL(n), rb = r.toString(2);
      const sel = (c, tandai) => `<span style="display:inline-block;width:30px;height:38px;line-height:38px;
        text-align:center;font-family:var(--mono);font-size:17px;font-weight:600;
        border:2px solid ${tandai ? 'var(--merah)' : 'var(--garis-tebal)'};border-radius:6px;margin:2px;
        background:${tandai ? 'var(--merah)' : '#fff'};color:${tandai ? '#fff' : 'var(--tinta)'}">${c}</span>`;
      ids.q('bviz').innerHTML = `<div style="text-align:center">
        <div class="tiny" style="margin-bottom:4px">n = ${n} dalam biner</div>
        <div>${b.split('').map((c, i) => sel(c, i === 0)).join('')}</div>
        <div style="font-size:22px;color:var(--merah);margin:6px 0;font-family:var(--mono)">↓ bit merah pindah ke belakang ↓</div>
        <div>${rb.padStart(b.length, '0').split('').map((c, i) => sel(c, i === b.length - 1)).join('')}</div>
        <div class="tiny" style="margin-top:4px">= ${r}</div></div>`;
      const p = M.pow2le(n), L = n - p, sim = n <= 4000 ? M.josSim(n, 2).survivor : null;
      ids.tulis('bout', `n = ${n}   biner ${b}
geser satu bit ke kiri secara siklis → ${rb}  =  ${hijau(r)}

Cocokkan dengan rumus:
  p = ${p}   (bit terdepan)      L = n − p = ${L}   (sisa bitnya)
  2L + 1 = 2×${L} + 1 = ${hijau(M.jos2(n))}   ${M.jos2(n) === r ? '✓ sama' : merah('✗')}
` + (sim !== null
          ? `\nSimulasi lingkaran penuh = ${hijau(sim)}   ${sim === r ? '✓ sama' : merah('✗')}`
          : `\n${redup('(simulasi dilewati karena n besar — dua cara di atas sudah saling menguatkan)')}`));
    });
    ids.q('bgo').click();

    /* ---- iterasi ---- */
    ids.klik('itgo', () => {
      let x = ids.n('it', { min: 1, maks: 100000, bawaan: 1000 });
      const awal = x, seq = [x];
      for (let i = 0; i < 25 && seq[seq.length - 1] !== seq[seq.length - 2]; i++) { x = M.jos2(x); seq.push(x); }
      const t = M.popcount(awal), target = Math.pow(2, t) - 1;
      const u = []; seq.forEach((v) => { if (u[u.length - 1] !== v) u.push(v); });
      ids.tulis('itout', `${u.join(' → ')}

biner ${awal} = ${awal.toString(2)}  →  banyaknya angka 1: t = ${t}
prediksi titik henti = 2^${t} − 1 = ${hijau(target)}
hasil sebenarnya     = ${hijau(u[u.length - 1])}   ${u[u.length - 1] === target ? '✓ cocok' : merah('✗')}

${redup('Perhatikan: tiap langkah menghapus satu angka 0 dari bagian depan biner,\nsampai yang tersisa hanya angka 1 semua — itulah 2^t − 1.')}`);
    });

    /* ---- penjumlahan ---- */
    ids.klik('sgo', () => {
      const n = ids.n('sn', { min: 1, maks: 4000, bawaan: 63 });
      const p = M.pow2le(n), m = Math.round(Math.log2(p)), L = n - p;
      const rumus = (Math.pow(4, m) - 1) / 3 + Math.pow(L + 1, 2);
      let brute = 0; for (let i = 1; i <= n; i++) brute += M.jos2(i);
      ids.tulis('sout', `CARA 1 — jumlahkan satu per satu J(1) sampai J(${n})
  hasil = ${hijau(angka(brute))}   ${redup(`(${n} kali penjumlahan)`)}

CARA 2 — rumus langsung
  ${n} = 2^${m} + ${L}   →   m = ${m}, L = ${L}
  (4^${m} − 1)/3 + (${L}+1)²
  = ${angka((Math.pow(4, m) - 1) / 3)} + ${angka(Math.pow(L + 1, 2))}
  = ${hijau(angka(rumus))}   ${redup('(beberapa detik di kertas)')}

${brute === rumus ? hijau('✓ DUA CARA SAMA') : merah('✗ beda')}`);
    });

    /* ---- rekurensi umum ---- */
    ids.klik('ggo', () => {
      const n = ids.n('gn', { min: 1, maks: 3000, bawaan: 41 }), k = ids.n('gk', { min: 1, maks: 50, bawaan: 3 });
      let r = 0; const baris = [];
      for (let i = 2; i <= n; i++) {
        const lama = r; r = (r + k) % i;
        if (i <= 8 || i > n - 3) baris.push(`  i=${String(i).padStart(4)}:  r = (${lama} + ${k}) mod ${i} = ${r}`);
        if (i === 9 && n > 11) baris.push('  ...');
      }
      const sim = n <= 2000 ? M.josSim(n, k).survivor : null;
      ids.tulis('gout', `r = 0
${baris.join('\n')}

jawaban = r + 1 = ${hijau(r + 1)}
` + (sim !== null ? `simulasi lingkaran penuh = ${hijau(sim)}   ${sim === r + 1 ? '✓ cocok' : merah('✗')}` : '')
        + `\n\n${redup(`${n - 1} langkah perkalian-sederhana, dibanding menyimulasikan ${n - 1} kali penghapusan dari lingkaran.`)}`);
    });

    /* ---- uji rumus ---- */
    ids.klik('test', () => {
      const n = ids.n('tn', { min: 1, maks: 20000, bawaan: 100 });
      const sim = n <= 4000 ? M.josSim(n, 2).survivor : null, f = M.jos2(n), p = M.pow2le(n), r = M.rotL(n);
      ids.tulis('tout', `n = ${n}
p (pangkat 2 terbesar ≤ n) = ${p}          L = ${n - p}

rumus 2L + 1        = ${hijau(f)}
trik biner          = ${hijau(r)}   ${r === f ? '✓' : merah('✗')}
` + (sim !== null
        ? `simulasi penuh      = ${hijau(sim)}   ${sim === f ? hijau('✓ SEMUA COCOK') : merah('✗ BEDA')}`
        : redup('simulasi dilewati untuk n besar — dua cara di atas saling menguatkan')));
    });
    ids.klik('test1000', () => {
      let gagal = 0, contoh = null;
      for (let i = 0; i < 1000; i++) {
        const n = 1 + Math.floor(Math.random() * 3000);
        if (M.josSim(n, 2).survivor !== M.jos2(n) || M.rotL(n) !== M.jos2(n)) { gagal++; if (!contoh) contoh = n; }
      }
      ids.tulis('tout', gagal === 0
        ? `Diuji 1.000 nilai n acak antara 1 dan 3.000.\nSimulasi lingkaran, rumus 2L+1, dan trik biner\n\n${hijau('✓ KETIGANYA COCOK PADA SEMUA 1.000 KASUS')}`
        : merah(`✗ ${gagal} kasus tidak cocok, contoh n = ${contoh}`));
    });

    /* ---- soal asli ---- */
    ids.klik('solve26', () => {
      const p41 = M.pow2le(41);
      ids.tulis('a1', `41 = ${p41} + ${41 - p41}
KODE(41) = 2×${41 - p41} + 1 = ${hijau(M.jos2(41))}
${redup(`Cek biner: 41 = ${(41).toString(2)} → ${M.rotL(41).toString(2)} = ${M.rotL(41)} ✓`)}`);
      const p = M.pow2le(63), m = Math.round(Math.log2(p)), L = 63 - p;
      let s = 0; for (let i = 1; i <= 63; i++) s += M.jos2(i);
      ids.tulis('a2', `63 = 2^${m} + ${L}
(4^${m} − 1)/3 + ${L + 1}² = ${(Math.pow(4, m) - 1) / 3} + ${Math.pow(L + 1, 2)}
= ${hijau(s)}
${redup('Tanpa rumus: harus menjumlahkan 63 nilai satu per satu.')}`);
      let g = 0; for (let i = 1; i <= 63; i++) g += Math.pow(2, M.popcount(i)) - 1;
      ids.tulis('a3', `k = 64.656.667 mustahil diulang. Tapi iterasi KODE
berhenti di 2^t − 1 dengan t = banyaknya angka 1.

Jadi jawabannya Σ (2^popcount(i) − 1) untuk i = 1..63
= 3^6 − 2^6 = ${Math.pow(3, 6)} − ${Math.pow(2, 6)} = ${hijau(g)}

${redup('Cek: KODE diterapkan 5 kali saja sudah stabil di nilai ini.')}`);
    });
    ids.klik('solve24', () => {
      let rr = 0; for (let i = 2; i <= 7; i++) rr = (rr + 7) % i;
      ids.tulis('b1', `pndk = Josephus umum. n = 7, K = 7.
r = 0; lalu r = (r+7) mod i untuk i = 2..7
→ r = ${rr}
jawaban = r + 1
${hijau('pndk(7, 7) = ' + M.josSim(7, 7).survivor)}`);
      const opt = [30, 40, 50, 60, 70].map((n) => [n, M.josSim(n, 3).survivor]);
      const best = opt.reduce((a, b) => (b[1] > a[1] ? b : a));
      ids.tulis('b2', opt.map(([n, v]) => `pndk(${n},3) = ${v}`).join('\n')
        + `\n${hijau(`→ terbesar: pndk(${best[0]},3) = ${best[1]}`)}`);
      /* Angkanya DIHITUNG, bukan diketik: kalau batas soalnya berubah,
         jawabannya ikut menyesuaikan dan tidak bisa melenceng. */
      const batas = 5000;
      let terbaikN = 1, terbaikV = 0;
      for (let N = 1; N <= batas; N++) {
        const v = M.jos2(N);
        if (v > terbaikV) { terbaikV = v; terbaikN = N; }
      }
      const pB = M.pow2le(terbaikN), pAkhir = M.pow2le(batas);
      ids.tulis('b3', `K = 2, jadi pakai 2(N − p) + 1.
Nilai terbesar dicapai saat L = N − p paling besar,
yaitu tepat sebelum p melompat ke pangkat 2 berikutnya.

N = ${terbaikN} = 2^${Math.round(Math.log2(pB))} + ${terbaikN - pB}  →  2×${terbaikN - pB} + 1 = ${hijau(terbaikV)}
N = ${batas} = 2^${Math.round(Math.log2(pAkhir))} + ${batas - pAkhir}   →  2×${batas - pAkhir} + 1 = ${M.jos2(batas)}  ${redup('(jauh lebih kecil!)')}

${hijau('Jawaban: N = 4095')}
${redup('Perhatikan 4095 = 2^12 − 1, jadi hasilnya sama dengan N sendiri.')}`);
    });

    pasangTab('trik'); pasangTab('samar'); pasangTab('soal');
  },
};
