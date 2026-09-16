/* ============================================================
   MODUL 07 — REKURSI BERCABANG (TIGA)
   Semua rumus di berkas ini dibuktikan oleh
   verify/07-tiga.py — jangan diubah tanpa menjalankannya lagi.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Kode, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

/* --- peta cabang: deretan angka diwarnai menurut sisa bagi 3 --- */
function gambarPeta(sampai, idPanah) {
  const W = 660, kotak = 30, jarak = 4, perBaris = Math.floor(W / (kotak + jarak));
  const baris = Math.ceil(sampai / perBaris);
  const H = baris * 62 + 10;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Peta cabang TIGA">`;
  for (let n = 1; n <= sampai; n++) {
    const i = n - 1, r = Math.floor(i / perBaris), k = i % perBaris;
    const x = k * (kotak + jarak) + 2, y = r * 62 + 6;
    const sisa = n % 3;
    const isi = sisa === 0 ? 'var(--stabilo)' : 'var(--kertas)';
    const garis = sisa === 0 ? 'var(--tinta)' : 'var(--garis-tebal)';
    const warna = sisa === 0 ? 'var(--tinta)' : 'var(--tinta-3)';
    s += `<rect x="${x}" y="${y}" width="${kotak}" height="${kotak}" rx="5"
          fill="${isi}" stroke="${garis}" stroke-width="${sisa === 0 ? 2.5 : 1.5}"/>`;
    s += `<text x="${x + kotak / 2}" y="${y + kotak / 2 + 4}" text-anchor="middle"
          style="font-family:var(--mono);font-size:12px;font-weight:600;fill:${warna}">${n}</text>`;
    s += `<text x="${x + kotak / 2}" y="${y + kotak + 15}" text-anchor="middle"
          style="font-family:var(--mono);font-size:11px;font-weight:${sisa === 0 ? 700 : 400};
          fill:${sisa === 0 ? 'var(--merah)' : 'var(--tinta-3)'}">${M.tiga(n)}</text>`;
    /* panah rantai antar kelipatan 3 yang bersebelahan di baris sama */
    if (sisa === 0 && n > 3 && k >= 3) {
      const xs = (k - 3) * (kotak + jarak) + 2 + kotak;
      s += `<path d="M ${xs} ${y + kotak + 26} L ${x} ${y + kotak + 26}"
            stroke="var(--merah)" stroke-width="1.5" marker-end="url(#${idPanah})"/>`;
      s += `<text x="${(xs + x) / 2}" y="${y + kotak + 22}" text-anchor="middle"
            style="font-family:var(--mono);font-size:9px;fill:var(--merah)">+1</text>`;
    }
  }
  s = s.replace('>', `><defs><marker id="${idPanah}" markerWidth="7" markerHeight="7" refX="6" refY="2.5"
       orient="auto"><path d="M0,0 L6,2.5 L0,5 z" fill="var(--merah)"/></marker></defs>`);
  return s + '</svg>';
}

export default {
  id: 'tiga', n: '07', kelompok: 'Rekursi',
  judul: 'Rekursi Bercabang (TIGA)',
  lede: 'Kodenya punya tiga cabang dan kelihatan rumit. Tapi ini justru contoh terbaik teknik "hitung suku awal, cari polanya" — empat suku pertama saja sudah cukup untuk membongkar seluruh grup soal.',
  lencana: ['<span class="chip r">2025 · soal 26–28</span>', '<span class="chip v">Diuji n = 0 sampai 5.000</span>'],

  kartu: [
    { q: 'return TIGA(N-1) + TIGA(N-3);', a: 'lain', why: 'Rekursi bercabang biasa — bukan Josephus, bukan doubling. Hitung suku awalnya, cari polanya.' },
    { q: '“Berapa TIGA(2025)?” padahal kodenya bercabang tiga', a: 'lain', why: 'Jangan ditelusuri. Isi tabel 12 suku pertama, polanya langsung kelihatan.' },
  ],
  kamus: [
    ['rekursi bercabang f(N−1) + f(N−3)', 'Hitung suku awal, cari polanya'],
    ['kode bercabang menurut sisa bagi', 'Kelompokkan menurut sisa baginya'],
  ],

  bangun(root, { ids, pasangTab }) {
    const I = (t) => ids.i(t);

    root.innerHTML = [

      /* ===== APA ITU ===== */
      Kartu({
        judul: 'Apa itu Rekursi Bercabang?',
        isi: `
        <p style="margin:10px 0">Sampai sini kamu sudah lihat rekursi yang polanya rapi — Josephus, doubling. Sekarang bentuk yang berbeda: rekursi yang <b>bercabang tiga</b>, dan tiap cabang melompat mundur sejauh yang berbeda-beda.</p>` +
        Kode(`<span class="kw">int</span> <span class="fn">TIGA</span>(<span class="kw">int</span> N) {
  <span class="kw">if</span> (N &lt;= 1) {
    <span class="kw">return</span> 1;
  } <span class="kw">else if</span> (N % 3 == 0) {
    <span class="kw">return</span> <span class="fn">TIGA</span>(N - 1) + <span class="fn">TIGA</span>(N - 3);   <span class="c">// bercabang DUA</span>
  } <span class="kw">else if</span> (N % 3 == 1) {
    <span class="kw">return</span> <span class="fn">TIGA</span>(N - 2);
  } <span class="kw">else</span> {
    <span class="kw">return</span> <span class="fn">TIGA</span>(N - 3);
  }
}`, 'margin:12px 0') +
        `<p style="margin:10px 0">Kelihatannya berat. Ada tiga jalur, salah satunya bahkan pecah jadi dua. Kalau kamu coba telusuri TIGA(18) di kertas, kamu butuh <b>34 pemanggilan</b>. Untuk TIGA(99)? Lebih dari <b>600</b>.</p>
        <p style="margin:10px 0">Dan soal OSN-K 2025 menanyakan sesuatu yang jauh lebih besar dari itu.</p>` +
        Catatan({ jenis: 'baik', isi: `<b>Tapi ada jalan yang jauh lebih pendek.</b> Jangan pusingkan cabang-cabangnya dulu. Hitung saja <b>TIGA(1) sampai TIGA(12)</b> pelan-pelan — perlu sekitar dua menit.
        <br><br>Begitu deretannya tertulis di kertas, polanya langsung menampar mata. Dan dari situ ketiga soalnya selesai tanpa kamu perlu benar-benar memahami kodenya.` }) +
        `<h4 style="margin:18px 0 6px;font-size:14px">Kenapa modul ini penting?</h4>
        <p class="tiny" style="margin:0">Bukan karena rumusnya — rumus TIGA cuma berlaku untuk soal ini saja. Yang penting adalah <b>tekniknya</b>: ketemu rekursi asing, jangan langsung telusuri, tapi hitung beberapa suku awal dan cari polanya. Teknik ini dipakai berkali-kali di Bagian C, untuk kode yang berbeda-beda tiap tahun.</p>`,
      }),

      /* ===== LAB 1: ISI TABEL ===== */
      Lab({
        judul: 'Lab 1 · Isi tabelnya sendiri', petunjuk: 'inilah teknik utamanya',
        isi:
          `<p style="margin:0 0 12px">Cara mengisi: mulai dari N kecil, pakai hasil yang sudah kamu tulis untuk mengisi yang berikutnya. Ingat TIGA(0) dan TIGA(1) dua-duanya bernilai 1.</p>` +
          `<div class="scroll"><table class="t" id="${I('tab')}"></table></div>
           <button class="btn alt" id="${I('isi')}" style="margin-top:12px">Isi tabel otomatis</button>
           <div id="${I('petunjuk')}" style="margin-top:14px"></div>`,
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Rumus langsungnya',
        isi: `N <b>bukan</b> kelipatan 3 &nbsp;→&nbsp; <mark>TIGA(N) = 1</mark><br>
              N <b>kelipatan</b> 3 &nbsp;→&nbsp; <mark>TIGA(N) = N ÷ 3 + 1</mark>`,
        verifikasi: 'Sudah diuji untuk N = 0 sampai 5.000',
        pesan: 'Isi tabelnya dulu — polanya lebih nempel kalau kamu yang menemukan sendiri.',
      }),

      /* ===== LAB 2: TRIK SISA BAGI 3 ===== */
      Lab({
        judul: 'Lab 2 · Trik sisa bagi 3 — yang paling terasa curang', petunjuk: 'N sebesar apa pun, dua detik selesai',
        isi:
          `<p style="margin:0 0 14px">Begitu polanya ketemu, kamu tidak perlu menyentuh kodenya lagi. Cukup <b>bagi N dengan 3</b>, lihat sisanya. Kalau sisanya 1 atau 2, jawabannya 1. Kalau sisanya 0, jawabannya N ÷ 3 + 1.</p>` +
          Kontrol({
            ids, kolom: [{ id: 'bn', label: 'N (boleh sebesar apa pun)', nilai: 2025, min: 0, lebar: true }],
            tombol: [{ id: 'bgo', teks: 'Hitung' }],
          }) +
          Wadah({ ids, id: 'bviz', gaya: 'margin:16px 0' }) +
          Keluaran({ ids, id: 'bout' }),
      }),

      /* ===== LAB 3: PETA CABANG ===== */
      Lab({
        judul: 'Lab 3 · Kenapa polanya begitu', petunjuk: 'dua dari tiga cabang ternyata buntu',
        isi:
          `<p style="margin:0 0 12px">Angka kuning adalah kelipatan 3. Angka merah di bawah tiap kotak adalah nilai TIGA-nya. Perhatikan: yang abu-abu <b>semuanya bernilai 1</b>, sementara yang kuning naik satu per satu.</p>` +
          Kontrol({
            ids, kolom: [{ id: 'pn', label: 'sampai N', nilai: 21, min: 6, maks: 60 }],
            tombol: [{ id: 'pgo', teks: 'Gambar peta' }],
          }) +
          Wadah({ ids, id: 'peta', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'pout' }),
      }),

      Catatan({ jenis: 'baik', isi: `<b>Ini penjelasan lengkapnya, kalau kamu penasaran.</b> Kuncinya: perhatikan <b>sisa bagi 3 berubah jadi berapa</b> setelah melompat.
        <br><br><b>Sisa 2</b> → melompat mundur 3. Mundur 3 tidak mengubah sisa bagi 3, jadi sisanya <b>tetap 2</b>. Akibatnya dia terus meluncur turun — 3, lagi 3, lagi 3 — sampai mentok di bawah dan mengembalikan 1. <b>Buntu.</b>
        <br><br><b>Sisa 1</b> → melompat mundur 2, jadi sisanya berubah menjadi 2. Langsung masuk ke jalur buntu di atas. <b>Buntu juga.</b>
        <br><br><b>Sisa 0</b> → pecah jadi dua. Cabang <code>TIGA(N−1)</code> mendarat di sisa 2, jadi cuma menyumbang <b>1</b>. Cabang <code>TIGA(N−3)</code> mendarat di kelipatan 3 lagi, jadi <b>rantainya berlanjut</b>.
        <br><br>Jadi tiap turun satu mata rantai, nilainya <b>bertambah tepat 1</b>. Mulai dari TIGA(0) = 1, lalu TIGA(3) = 2, TIGA(6) = 3, dan seterusnya.
        <span class="tiny" style="display:block;margin-top:6px">✅ Ketiga cabang sudah diuji terpisah untuk N sampai 3.000.</span>` }),

      /* ===== CARA CEPAT ===== */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Semuanya sudah diadu dengan simulasi rekursif sungguhan.',
        isi: Tab({
          ids, id: 'trik', daftar: [
            {
              kunci: 'k1', judul: 'Teknik induknya',
              isi: `<p style="margin:0 0 10px">Ini yang paling penting dibawa keluar dari modul ini, karena berlaku untuk <b>rekursi asing apa pun</b>, bukan cuma TIGA.</p>` +
                Rumus({
                  label: 'Empat langkah',
                  isi: `1. hitung <mark>suku awal</mark> dari yang paling kecil, naik pelan-pelan<br>
                        2. tulis berjejer, jangan langsung disimpulkan<br>
                        3. cari <mark>pengelompokan</mark> — biasanya menurut sisa bagi<br>
                        4. <mark>uji dugaanmu</mark> pada dua suku berikutnya`,
                }) +
                `<p style="margin:10px 0">Untuk TIGA, empat suku pertama sudah memberi petunjuk:</p>
                 <div class="out">TIGA(1) = 1
TIGA(2) = 1
TIGA(3) = 2   ${redup('← naik!')}
TIGA(4) = 1   ${redup('← turun lagi')}

Kelihatan ada pengulangan tiap 3 langkah.
Lanjutkan sampai 12, dugaan itu terbukti.</div>` +
                Catatan({ jenis: 'awas', isi: '<b>Langkah 4 jangan dilewat.</b> Banyak siswa berhenti di langkah 3 dan langsung yakin. Padahal beberapa barisan baru menunjukkan wajah aslinya di suku ke-7 atau ke-8. Tambah dua suku lagi itu murah, salah jawab itu mahal.' }),
            },
            {
              kunci: 'k2', judul: 'Membandingkan nilai',
              isi: `<p style="margin:0 0 10px">Soal 26 minta dibandingkan lima nilai TIGA. Kamu tidak perlu menghitung satu pun.</p>` +
                Rumus({
                  label: 'Aturan perbandingan',
                  isi: `yang <b>bukan</b> kelipatan 3 nilainya <mark>selalu 1</mark> — langsung coret<br><br>
                        di antara yang kelipatan 3, yang <mark>paling besar N-nya</mark> menang`,
                  verifikasi: 'Sudah diuji untuk N sampai 1.000',
                }) +
                `<div class="out" style="margin-top:12px">Soal 26: TIGA(2), TIGA(6), TIGA(14), TIGA(18), TIGA(25)

  2  → bukan kelipatan 3 → 1   coret
  6  → kelipatan 3 ✓
  14 → bukan kelipatan 3 → 1   coret
  18 → kelipatan 3 ✓
  25 → bukan kelipatan 3 → 1   coret

Tinggal 6 dan 18. Yang lebih besar menang.
  ${hijau('TIGA(18) = 18÷3 + 1 = 7')}</div>`,
            },
            {
              kunci: 'k3', judul: 'Menghitung yang bernilai 1',
              isi: `<p style="margin:0 0 10px">Soal 27 menanyakan berapa banyak dari TIGA(1) sampai TIGA(2025) yang hasilnya 1.</p>` +
                `<p style="margin:0 0 10px">Karena TIGA(N) bernilai 1 <b>tepat ketika N bukan kelipatan 3</b>, ini jadi soal berhitung biasa:</p>` +
                Rumus({
                  label: 'Banyaknya TIGA(k) = 1 untuk k = 1 sampai n',
                  isi: `<mark>n − ⌊n ÷ 3⌋</mark>`,
                  verifikasi: 'Sudah diuji n = 1 sampai 3.000',
                }) +
                `<div class="out" style="margin-top:12px">n = 2025

  kelipatan 3 di 1..2025 = 2025 ÷ 3 = 675
  sisanya                = 2025 − 675 = ${hijau('1.350')}</div>` +
                Kontrol({
                  ids, kolom: [{ id: 'cn', label: 'sampai n', nilai: 2025, min: 1, maks: 200000 }],
                  tombol: [{ id: 'cgo', teks: 'Bandingkan dua cara' }],
                }) +
                Keluaran({ ids, id: 'cout' }),
            },
            {
              kunci: 'k4', judul: 'Menjumlahkan',
              isi: `<p style="margin:0 0 10px">Soal 28 minta jumlah TIGA(1) sampai TIGA(100). Pisahkan jadi dua kelompok, lalu jumlahkan masing-masing.</p>` +
                Rumus({
                  label: 'Jumlah TIGA(1) sampai TIGA(n)',
                  isi: `K = ⌊n ÷ 3⌋<br>
                        jumlah = <mark>n + K(K+1) ÷ 2</mark>`,
                  verifikasi: 'Sudah diuji n = 1 sampai 3.000',
                }) +
                `<div class="out" style="margin-top:12px">n = 100, K = 33

  Kelompok bukan kelipatan 3: ada 67, tiap-tiap 1  → 67
  Kelompok kelipatan 3: nilainya 2, 3, 4, …, 34    → 594
  ─────────────────────────────────────────────────
  total = ${hijau('661')}

Lewat rumus: 100 + 33×34÷2 = 100 + 561 = ${hijau('661')}</div>` +
                `<p class="tiny">Kenapa rumusnya jadi <b>n + K(K+1)/2</b>? Karena tiap bilangan menyumbang minimal 1 (itu bagian "n"), lalu kelipatan 3 menyumbang tambahan 1, 2, 3, …, K di atasnya.</p>` +
                Kontrol({
                  ids, kolom: [{ id: 'jn', label: 'sampai n', nilai: 100, min: 1, maks: 200000 }],
                  tombol: [{ id: 'jgo', teks: 'Bandingkan dua cara' }],
                }) +
                Keluaran({ ids, id: 'jout' }),
            },
            {
              kunci: 'k5', judul: 'Cek instan',
              isi: `<p style="margin:0 0 10px">Empat hal yang bisa langsung kamu pakai untuk membuang pilihan jawaban yang salah:</p>` +
                Rumus({
                  isi: `1. nilai TIGA <mark>tidak pernah kurang dari 1</mark><br><br>
                        2. nilainya <mark>lebih dari 1 hanya di kelipatan 3</mark><br><br>
                        3. nilai terbesar di 1..n selalu ada di <mark>kelipatan 3 terbesar</mark><br><br>
                        4. dua bilangan berdekatan yang bukan kelipatan 3 <mark>pasti nilainya sama</mark>`,
                  verifikasi: 'Sudah diuji N sampai 3.000',
                }) +
                `<p class="tiny">Sifat nomor 2 itu senjata paling cepat. Begitu lihat pilihan jawaban berupa TIGA dari bilangan yang bukan kelipatan 3, langsung tahu nilainya 1 tanpa hitung apa pun.</p>`,
            },
            {
              kunci: 'k6', judul: 'Kalau kodenya berubah',
              isi: `<p style="margin:0 0 10px">Rumus TIGA cuma berlaku untuk kode ini. Kalau tahun depan kodenya diubah sedikit, rumusnya ikut berubah — tapi <b>tekniknya tetap sama</b>.</p>` +
                `<p style="margin:0 0 10px">Yang perlu kamu perhatikan saat kodenya lain:</p>` +
                `<div class="scroll"><table class="t" style="text-align:left">
                  <tr><th style="text-align:left">Lihat bagian ini</th><th style="text-align:left">Kenapa penting</th></tr>
                  <tr><td style="text-align:left">pembagi di <code>N % ?</code></td><td style="text-align:left">menentukan pola berulang tiap berapa langkah</td></tr>
                  <tr><td style="text-align:left">besar lompatan tiap cabang</td><td style="text-align:left">menentukan cabang mana yang buntu, mana yang menyambung</td></tr>
                  <tr><td style="text-align:left">cabang mana yang <b>menjumlahkan</b> dua panggilan</td><td style="text-align:left">di situlah nilainya menumpuk</td></tr>
                  <tr><td style="text-align:left">nilai di kasus dasar</td><td style="text-align:left">titik awal seluruh rantai</td></tr>
                </table></div>` +
                Catatan({ isi: '<b>Trik membaca cepat:</b> untuk tiap cabang, tanya "setelah melompat, sisa baginya jadi berapa?" Kalau sisanya <b>tetap sama</b>, berarti cabang itu meluncur lurus sampai mentok — buntu. Kalau <b>berubah</b>, dia pindah ke jalur lain. Itu saja yang perlu kamu lacak.' }),
            },
          ],
        }),
      }),

      /* ===== UJI RUMUS ===== */
      Kartu({
        judul: 'Uji sendiri: rumus vs telusuri sungguhan',
        sub: 'Jangan percaya rumus sebelum kamu mengujinya. Kolom kiri benar-benar menjalankan rekursinya, kolom kanan pakai rumus.',
        isi: Kontrol({
          ids, kolom: [{ id: 'un', label: 'N', nilai: 18, min: 0, maks: 400 }],
          tombol: [{ id: 'ugo', teks: 'Bandingkan' }, { id: 'u400', teks: 'Uji N = 0 sampai 400', gaya: 'alt' }],
        }) + Keluaran({ ids, id: 'uout' }),
      }),

      /* ===== PENYAMARAN ===== */
      Kartu({
        judul: 'Penyamaran',
        sub: 'Rekursi bercabang gampang tertukar dengan pola lain. Kenali bedanya.',
        isi: Tab({
          ids, id: 'samar', daftar: [
            {
              kunci: 'a', judul: 'A · Bentuk asli',
              isi: Kode(`<span class="kw">if</span> (N % 3 == 0) <span class="kw">return</span> <span class="fn">TIGA</span>(N-1) + <span class="fn">TIGA</span>(N-3);
<span class="kw">else if</span> (N % 3 == 1) <span class="kw">return</span> <span class="fn">TIGA</span>(N-2);
<span class="kw">else</span> <span class="kw">return</span> <span class="fn">TIGA</span>(N-3);`) +
                Catatan({ isi: '<b>Cirinya:</b> percabangan menurut <b>sisa bagi</b>, dan tiap cabang melompat mundur sejauh berbeda. Salah satu cabang menjumlahkan dua pemanggilan — di situlah nilainya menumpuk.' }),
            },
            {
              kunci: 'b', judul: 'B · Fibonacci',
              isi: Kode(`<span class="kw">return</span> <span class="fn">F</span>(N-1) + <span class="fn">F</span>(N-2);`) +
                Catatan({ isi: 'Bercabang juga, tapi <b>tanpa syarat sisa bagi</b> — semua N diperlakukan sama. Hasilnya Fibonacci, dan nilainya membengkak cepat. Kalau soal minta N besar, cari rumus atau pola sisa baginya.' }),
            },
            {
              kunci: 'c', judul: 'C · Menurun tetap',
              isi: Kode(`<span class="kw">return</span> <span class="fn">G</span>(N-1) + 1;`) +
                Catatan({ isi: 'Cuma satu cabang, dan tiap langkah menambah 1. Jelas hasilnya sekitar N. Ini kasus paling sederhana — pola langsung kelihatan dari dua suku.' }),
            },
            {
              kunci: 'd', judul: 'D · Cerita',
              isi: Catatan({ isi: '"Seekor katak melompat mundur di deretan batu bernomor. Kalau nomor batunya habis dibagi 3, dia bercabang ke dua batu sekaligus. Kalau tidak, dia melompat sendirian. Ada berapa jalur berbeda sampai dia mencapai batu nomor 1?"' }) +
                '<p class="tiny">Tidak ada kode sama sekali, tapi strukturnya sama persis. Kerjakan dengan cara yang sama: hitung untuk batu bernomor kecil dulu, lalu cari polanya.</p>',
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: Kode(`<span class="kw">return</span> <span class="fn">MAI</span>(<span class="fn">MAI</span>(x, y-1, z), y-1, z);`) +
                Catatan({ jenis: 'awas', isi: 'Dua pemanggilan, tapi <b>bersarang</b>, bukan dijumlahkan. Ini doubling — Modul 06. Perhatikan ada kurung di dalam kurung, bukan tanda <b>+</b> di tengah.' }) +
                Kode(`<span class="kw">return</span> (<span class="fn">pndk</span>(N-1,K)+K-1)%N+1;`, 'margin-top:10px') +
                Catatan({ jenis: 'awas', isi: 'Cuma satu pemanggilan, lalu dimodulo dengan N yang berubah tiap tingkat. Ini Josephus — Modul 01.' }),
            },
          ],
        }),
      }),

      /* ===== BEDAH SOAL ===== */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2025 · soal 26–28',
        sub: 'Ketiganya dari kode yang sama. Begitu tabelnya jadi, semuanya selesai tanpa satu pun pemanggilan ditelusuri.',
        isi: Kisi([
          KartuSoal({ ids, nomor: 'Soal 26', pertanyaan: 'Mana yang paling besar: <code>TIGA(2)</code>, <code>TIGA(6)</code>, <code>TIGA(14)</code>, <code>TIGA(18)</code>, <code>TIGA(25)</code>?', idKeluaran: 's1' }),
          KartuSoal({ ids, nomor: 'Soal 27', pertanyaan: 'Dari <code>TIGA(1)</code> sampai <code>TIGA(2025)</code>, ada berapa yang hasilnya 1?', idKeluaran: 's2' }),
          KartuSoal({ ids, nomor: 'Soal 28', pertanyaan: 'Berapa <code>TIGA(1) + TIGA(2) + … + TIGA(100)</code>?', idKeluaran: 's3' }),
        ]) + `<button class="btn" id="${I('solve')}" style="margin-top:14px">Selesaikan ketiganya</button>`,
      }),

      Catatan({
        jenis: 'awas', isi: `<b>Bedanya dengan pola rekursi lain.</b>
        <table class="t" style="margin-top:10px;background:transparent">
          <tr><th style="text-align:left">Bentuknya</th><th style="text-align:left">Polanya</th></tr>
          <tr><td style="text-align:left"><code>f(N−1) + f(N−3)</code> dengan syarat sisa bagi</td><td style="text-align:left">✅ bercabang — hitung suku awal</td></tr>
          <tr><td style="text-align:left"><code>f(N−1) + f(N−2)</code> tanpa syarat</td><td style="text-align:left">⚠️ Fibonacci — nilainya membengkak cepat</td></tr>
          <tr><td style="text-align:left"><code>f(f(x, y−1), y−1)</code></td><td style="text-align:left">❌ doubling bersarang — Modul 06</td></tr>
          <tr><td style="text-align:left"><code>f(n−1) + ubah(f(n−1))</code></td><td style="text-align:left">❌ doubling pada teks — Modul 05</td></tr>
          <tr><td style="text-align:left"><code>(f(N−1) + K − 1) % N + 1</code></td><td style="text-align:left">❌ Josephus — Modul 01</td></tr>
        </table>`,
      }),

      Catatan({ isi: '<b>Biasakan cek 30 detik sebelum pakai rumus.</b><br><br>Uji dugaanmu di dua suku yang belum kamu pakai untuk menemukannya. Kalau polamu dari TIGA(1) sampai TIGA(6), maka ujilah di TIGA(7) dan TIGA(9). Rumus bilang TIGA(9) = 9÷3 + 1 = 4. Hitung sendiri: TIGA(9) = TIGA(8) + TIGA(6) = 1 + 3 = 4. Cocok.<br><br>Kalau dua suku uji itu cocok, rumusmu hampir pasti benar.' }),

    ].join('');

    /* ================= PERILAKU ================= */

    /* ---- Lab 1: tabel ---- */
    const isiTabel = (penuh) => {
      let h = '<tr><th>N</th>';
      for (let n = 1; n <= 12; n++) h += `<th>${n}</th>`;
      h += '</tr><tr><th>TIGA</th>';
      for (let n = 1; n <= 12; n++)
        h += penuh ? `<td class="${n % 3 === 0 ? 'hi' : ''}">${M.tiga(n)}</td>` : '<td>?</td>';
      ids.q('tab').innerHTML = h + '</tr>';
    };
    isiTabel(false);
    ids.klik('isi', () => {
      isiTabel(true);
      ids.q('petunjuk').innerHTML = Catatan({
        jenis: 'baik', isi: `<b>Lihat kolom yang disorot — semuanya kelipatan 3.</b>
        <br><br>Kolom lain nilainya <b>selalu 1</b>, tidak pernah berubah. Sementara yang kelipatan 3 naik teratur: 2, 3, 4, 5.
        <br><br>Coba cocokkan: TIGA(3) = 2, TIGA(6) = 3, TIGA(9) = 4, TIGA(12) = 5. Selalu <b>N dibagi 3, lalu tambah 1</b>.
        <br><br>Sekarang tebak sendiri — berapa TIGA(30)?`,
      });
      bukaRumus(ids, 'rumus');
    });

    /* ---- Lab 2: trik sisa bagi 3 ---- */
    ids.klik('bgo', () => {
      const el = ids.q('bn');
      const n = Math.max(0, parseInt(String(el.value).replace(/\D/g, ''), 10) || 0);
      const sisa = n % 3, hasil = M.tiga(n);
      const petak = (teks, warna, isi) => `<div style="display:inline-block;text-align:center;margin:0 8px">
        <div style="font-family:var(--mono);font-size:22px;font-weight:700;border:2.5px solid ${warna};
          border-radius:8px;padding:10px 18px;background:${isi};color:${warna}">${teks}</div></div>`;
      ids.q('bviz').innerHTML = `<div style="text-align:center">
        <div class="tiny" style="margin-bottom:6px">N = ${angka(n)}</div>
        ${petak(`${angka(n)} ÷ 3 sisa ${sisa}`, sisa === 0 ? 'var(--merah)' : 'var(--tinta-2)',
        sisa === 0 ? 'var(--merah-pucat)' : 'var(--kertas)')}
        <div style="font-size:20px;color:var(--tinta-3);margin:8px 0">↓</div>
        <div style="font-family:var(--disp);font-size:32px;font-weight:700;color:var(--tinta)">
          TIGA(${angka(n)}) = ${angka(hasil)}</div></div>`;
      const bisaTelusur = n <= 60;
      ids.tulis('bout', `N = ${angka(n)}
${angka(n)} ÷ 3 = ${angka(Math.floor(n / 3))} sisa ${sisa}

${sisa === 0
          ? `sisa 0 → kelipatan 3 → TIGA = N ÷ 3 + 1 = ${angka(Math.floor(n / 3))} + 1 = ${hijau(angka(hasil))}`
          : `sisa ${sisa} → bukan kelipatan 3 → TIGA = ${hijau('1')}`}
` + (bisaTelusur
        ? `\nTelusuri sungguhan = ${hijau(M.tigaSim(n))}   ${M.tigaSim(n) === hasil ? '✓ sama' : merah('✗')}
${redup(`(butuh sekitar ${angka(M.tigaPanggilan(n))} pemanggilan)`)}`
        : `\n${redup(`Kalau ditelusuri sungguhan, N sebesar ini butuh terlalu banyak\npemanggilan untuk dijalankan — tapi rumusnya tetap berlaku.`)}`));
    });
    ids.q('bgo').click();

    /* ---- Lab 3: peta cabang ---- */
    ids.klik('pgo', () => {
      const n = ids.n('pn', { min: 6, maks: 60, bawaan: 21 });
      ids.q('peta').innerHTML = gambarPeta(n, ids.i('panah')) +
        `<p class="tiny" style="margin-top:8px">
         <span style="background:var(--stabilo);border:2px solid var(--tinta);padding:1px 8px;border-radius:4px">kuning</span> kelipatan 3 — nilainya naik ·
         <span style="background:var(--kertas);border:1.5px solid var(--garis-tebal);padding:1px 8px;border-radius:4px">abu-abu</span> selalu bernilai 1</p>`;
      const kel = []; for (let k = 3; k <= n; k += 3) kel.push(`TIGA(${k})=${M.tiga(k)}`);
      ids.tulis('pout', `Kelipatan 3 sampai ${n}:
  ${kel.join('  ')}

${redup('Naik satu-satu, tanpa pernah melompat. Itulah rantainya.')}

Yang bukan kelipatan 3: ${angka(n - Math.floor(n / 3))} bilangan, ${hijau('semuanya bernilai 1')}.

${redup('Dua dari tiga cabang ternyata buntu — meluncur turun sampai mentok\ndan mengembalikan 1. Cuma cabang kelipatan 3 yang menumpuk nilai.')}`);
    });
    ids.q('pgo').click();

    /* ---- menghitung yang bernilai 1 ---- */
    ids.klik('cgo', () => {
      const n = ids.n('cn', { min: 1, maks: 200000, bawaan: 2025 });
      const cepat = M.tigaCacah1(n);
      let langsung = null;
      if (n <= 200000) { langsung = 0; for (let k = 1; k <= n; k++) if (M.tiga(k) === 1) langsung++; }
      ids.tulis('cout', `CARA 1 — periksa satu per satu dari 1 sampai ${angka(n)}
  hasil = ${hijau(angka(langsung))}   ${redup(`(${angka(n)} kali pemeriksaan)`)}

CARA 2 — rumus langsung
  kelipatan 3 di 1..${angka(n)} = ⌊${angka(n)} ÷ 3⌋ = ${angka(Math.floor(n / 3))}
  sisanya = ${angka(n)} − ${angka(Math.floor(n / 3))} = ${hijau(angka(cepat))}   ${redup('(satu pengurangan)')}

${langsung === cepat ? hijau('✓ DUA CARA SAMA') : merah('✗ beda')}`);
    });
    ids.q('cgo').click();

    /* ---- menjumlahkan ---- */
    ids.klik('jgo', () => {
      const n = ids.n('jn', { min: 1, maks: 200000, bawaan: 100 });
      const K = Math.floor(n / 3), cepat = M.tigaJumlah(n);
      let langsung = 0; for (let k = 1; k <= n; k++) langsung += M.tiga(k);
      ids.tulis('jout', `CARA 1 — jumlahkan satu per satu TIGA(1) sampai TIGA(${angka(n)})
  hasil = ${hijau(angka(langsung))}   ${redup(`(${angka(n)} kali penjumlahan)`)}

CARA 2 — rumus langsung
  K = ⌊${angka(n)} ÷ 3⌋ = ${angka(K)}
  ${angka(n)} + ${angka(K)}×${angka(K + 1)}÷2 = ${angka(n)} + ${angka(K * (K + 1) / 2)}
  = ${hijau(angka(cepat))}   ${redup('(dua perkalian)')}

${langsung === cepat ? hijau('✓ DUA CARA SAMA') : merah('✗ beda')}`);
    });
    ids.q('jgo').click();

    /* ---- uji rumus ---- */
    ids.klik('ugo', () => {
      const n = ids.n('un', { min: 0, maks: 400, bawaan: 18 });
      const sim = M.tigaSim(n), rum = M.tiga(n);
      ids.tulis('uout', `TIGA(${n})

TELUSURI SUNGGUHAN — menjalankan rekursinya apa adanya
  hasil = ${hijau(sim)}   ${redup(`(sekitar ${angka(M.tigaPanggilan(n))} pemanggilan)`)}

RUMUS — lihat sisa baginya
  ${n} ÷ 3 sisa ${n % 3}
  ${n % 3 === 0 ? `kelipatan 3 → ${n} ÷ 3 + 1 = ${hijau(rum)}` : `bukan kelipatan 3 → ${hijau(1)}`}

${sim === rum ? hijau('✓ SAMA') : merah('✗ beda')}`);
    });
    ids.klik('u400', () => {
      let gagal = 0, contoh = null;
      for (let n = 0; n <= 400; n++)
        if (M.tigaSim(n) !== M.tiga(n)) { gagal++; if (contoh === null) contoh = n; }
      ids.tulis('uout', gagal === 0
        ? `Diuji semua N dari 0 sampai 400.\nTelusuri sungguhan vs rumus sisa bagi 3.\n\n${hijau('✓ KEDUANYA COCOK PADA SEMUA 401 KASUS')}`
        : merah(`✗ ${gagal} kasus tidak cocok, contoh N = ${contoh}`));
    });
    ids.q('ugo').click();

    /* ---- bedah soal ---- */
    ids.klik('solve', () => {
      const pil = [2, 6, 14, 18, 25];
      ids.tulis('s1', `Buang dulu yang bukan kelipatan 3 — nilainya pasti 1.

${pil.map((n) => `  TIGA(${String(n).padStart(2)}) → ${n % 3 === 0
        ? `kelipatan 3 ✓  = ${n}÷3 + 1 = ${M.tiga(n)}`
        : `bukan kelipatan 3 → 1  ${redup('coret')}`}`).join('\n')}

Tinggal 6 dan 18. Yang N-nya lebih besar pasti menang.

${hijau('Jawabannya TIGA(18) = 7')}`);

      /* Angka soalnya jadi tetapan, semua turunannya DIHITUNG. */
      const N27 = 2025, kel27 = Math.floor(N27 / 3), j27 = M.tigaCacah1(N27);
      ids.tulis('s2', `TIGA(k) bernilai 1 tepat ketika k ${hijau('bukan')} kelipatan 3.
Jadi tinggal berhitung biasa.

  kelipatan 3 di 1..${angka(N27)} = ${angka(N27)} ÷ 3 = ${angka(kel27)}
  sisanya                = ${angka(N27)} − ${angka(kel27)}

${hijau('Jawabannya ' + angka(j27))}

${redup(N27 % 3 === 0
  ? 'Perhatikan ' + angka(N27) + ' habis dibagi 3, jadi pembagiannya pas.'
  : 'Perhatikan ' + angka(N27) + ' TIDAK habis dibagi 3, jadi pembulatannya ke bawah.')}`);

      const N28 = 100, K28 = Math.floor(N28 / 3);
      const satu28 = M.tigaCacah1(N28);
      const jumKel = M.tigaJumlah(N28) - satu28;
      const j28 = M.tigaJumlah(N28);
      ids.tulis('s3', `Pisahkan jadi dua kelompok.

  Bukan kelipatan 3: ada ${N28} − ${K28} = ${satu28} bilangan
    masing-masing bernilai 1  →  ${satu28}

  Kelipatan 3: yaitu 3, 6, 9, …, ${K28 * 3}
    nilainya 2, 3, 4, …, ${K28 + 1}
    jumlahnya = (2 + ${K28 + 1}) × ${K28} ÷ 2  →  ${jumKel}
  ────────────────────────────────────
  total = ${satu28} + ${jumKel} = ${hijau(j28)}

${redup('Lewat rumus: K = ' + K28 + ', jadi ' + N28 + ' + ' + K28 + '×' + (K28 + 1)
  + '÷2 = ' + N28 + ' + ' + (K28 * (K28 + 1) / 2) + ' = ' + j28)}`);
    });

    pasangTab('trik'); pasangTab('samar');
  },
};
