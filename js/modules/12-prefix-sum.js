/* ============================================================
   MODUL 12 — PREFIX SUM & DIFFERENCE ARRAY
   Semua rumus dan angka di berkas ini dibuktikan oleh
   verify/12-prefix.py — jangan diubah tanpa menjalankannya lagi.

   Cara pembuktiannya (PANDUAN-MODUL bagian 0): tiap rumus diadu
   dengan penjumlahan apa adanya pada RATUSAN larik acak, termasuk
   larik berisi angka negatif, nol, dan larik kosong.

   Acuan: pemrograman-kompetitif-dasar.pdf (silabus resmi TOKI),
   definisi sum(k) dan sum(A[l..r]) = sum(r) − sum(l−1).
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Tabel, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

/* ---------- PITA ANGKA ----------
   Menggambar larik sebagai deretan kotak. Kotak yang masuk rentang
   yang sedang ditanya diberi warna, supaya siswa melihat rentangnya
   sebagai satu potongan, bukan sebagai daftar angka. */
function gambarPita(a, { sorot = null, judul = '', mulai = 1, tinta = null } = {}) {
  if (!a.length) return '<div class="out">Lariknya masih kosong.</div>';
  const kotak = Math.max(26, Math.min(46, Math.floor(560 / a.length)));
  const kiri = 74, atas = judul ? 22 : 6;
  const W = kiri + a.length * (kotak + 3) + 8;
  const H = atas + kotak + 22;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Larik angka ${judul}">`;
  if (judul) s += `<text x="4" y="14" style="font-family:var(--mono);font-size:12px;
    font-weight:700;fill:var(--tinta-2)">${judul}</text>`;
  a.forEach((v, i) => {
    const x = kiri + i * (kotak + 3);
    const di = sorot && i + mulai >= sorot[0] && i + mulai <= sorot[1];
    const warna = tinta ? tinta(v, i) : null;
    s += `<rect x="${x}" y="${atas}" width="${kotak}" height="${kotak}" rx="5"
      fill="${warna || (di ? 'var(--stabilo)' : 'var(--kertas)')}"
      stroke="${di ? 'var(--merah)' : 'var(--garis-tebal)'}" stroke-width="${di ? 2.2 : 1.4}"/>
      <text x="${x + kotak / 2}" y="${atas + kotak / 2 + 5}" text-anchor="middle"
      style="font-family:var(--mono);font-size:${String(v).length > 3 ? 10 : 12}px;
      font-weight:${di ? 700 : 400};fill:var(--tinta)">${v}</text>
      <text x="${x + kotak / 2}" y="${atas + kotak + 15}" text-anchor="middle"
      style="font-family:var(--mono);font-size:10px;fill:var(--tinta-3)">${i + mulai}</text>`;
  });
  return s + '</svg>';
}

/* ---------- PAPAN DUA DIMENSI ---------- */
function gambarPapan(g, { kotakSorot = null, judul = '' } = {}) {
  const b = g.length, k = b ? g[0].length : 0;
  if (!b || !k) return '<div class="out">Papannya masih kosong.</div>';
  const sel = Math.max(28, Math.min(44, Math.floor(420 / k)));
  const kiri = 26, atas = judul ? 34 : 22;
  const W = kiri + k * (sel + 2) + 8, H = atas + b * (sel + 2) + 8;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Papan angka">`;
  if (judul) s += `<text x="4" y="14" style="font-family:var(--mono);font-size:12px;
    font-weight:700;fill:var(--tinta-2)">${judul}</text>`;
  for (let j = 0; j < k; j++)
    s += `<text x="${kiri + j * (sel + 2) + sel / 2}" y="${atas - 5}" text-anchor="middle"
      style="font-family:var(--mono);font-size:10px;fill:var(--tinta-3)">${j + 1}</text>`;
  for (let i = 0; i < b; i++) {
    s += `<text x="14" y="${atas + i * (sel + 2) + sel / 2 + 4}" text-anchor="middle"
      style="font-family:var(--mono);font-size:10px;fill:var(--tinta-3)">${i + 1}</text>`;
    for (let j = 0; j < k; j++) {
      const di = kotakSorot && i + 1 >= kotakSorot[0] && i + 1 <= kotakSorot[2]
        && j + 1 >= kotakSorot[1] && j + 1 <= kotakSorot[3];
      const x = kiri + j * (sel + 2), y = atas + i * (sel + 2);
      s += `<rect x="${x}" y="${y}" width="${sel}" height="${sel}" rx="4"
        fill="${di ? 'var(--stabilo)' : 'var(--kertas)'}"
        stroke="${di ? 'var(--merah)' : 'var(--garis-tebal)'}" stroke-width="${di ? 2 : 1.2}"/>
        <text x="${x + sel / 2}" y="${y + sel / 2 + 4}" text-anchor="middle"
        style="font-family:var(--mono);font-size:${String(g[i][j]).length > 2 ? 10 : 12}px;
        font-weight:${di ? 700 : 400};fill:var(--tinta)">${g[i][j]}</text>`;
    }
  }
  return s + '</svg>';
}

const bacaLarik = (teks) => String(teks).split(/[,\s]+/)
  .map((x) => parseInt(x.trim(), 10)).filter((x) => !isNaN(x));

export default {
  id: 'prefix', n: '12', kelompok: 'Hitungan',
  judul: 'Prefix Sum & Difference Array',
  lede: 'Dua tabel bantu yang saling kebalikan. Yang satu menjawab ratusan pertanyaan "jumlah dari X sampai Y" dengan satu pengurangan. Yang satunya lagi mengubah 500.000 langkah jadi 2.000.',
  lencana: ['<span class="chip r">Silabus TOKI · bab 2</span>',
            '<span class="chip v">Diadu 27.654 pemeriksaan</span>'],

  kartu: [
    { q: '“Berapa jumlah nilai dari indeks X sampai Y?” ditanya berkali-kali', a: 'prefix', why: 'Prefix sum. Satu tabel bantu, lalu tiap jawaban cuma satu pengurangan.' },
    { q: '“Tambahkan 1 ke setiap posisi L sampai R”, diulang ratusan kali', a: 'prefix', why: 'Difference array. Tandai dua ujungnya saja, jangan isi seluruh rentangnya.' },
    { q: '“Ada berapa yang genap di antara posisi 3 sampai 9?”', a: 'prefix', why: 'Sama saja. Tandai 1 kalau memenuhi, 0 kalau tidak, lalu buat tabel bantu.' },
    { q: 'Lariknya berubah di tengah-tengah pertanyaan', a: 'prefix', why: 'JEBAKAN — tabel bantu jadi basi. Harus dibangun ulang.' },
  ],
  kamus: [
    ['“jumlah dari X sampai Y”, ditanya berkali-kali', 'Prefix sum'],
    ['“tambahkan sekian ke rentang L sampai R”', 'Difference array'],
    ['“ada berapa yang … di antara posisi …”', 'Prefix sum atas penanda 0/1'],
    ['“jumlah isi kotak dari baris a kolom b sampai …”', 'Prefix sum dua dimensi'],
  ],

  bangun(root, { ids, pasangTab }) {

    root.innerHTML = [

      /* ============ APA ITU ============ */
      Kartu({
        judul: 'Apa itu Prefix Sum dan Difference Array?',
        isi:
          `<p style="margin:10px 0">Bayangkan buku tabungan. Tiap baris mencatat berapa yang kamu setor hari itu. Lalu ada yang bertanya: berapa total setoranmu dari hari ke-3 sampai hari ke-9?</p>
           <p style="margin:10px 0">Cara polosnya, kamu jumlahkan tujuh baris itu satu per satu. Kalau ditanya sekali, tidak apa-apa. Kalau ditanya seratus kali dengan rentang berbeda-beda, kamu akan kelelahan.</p>
           <p style="margin:10px 0"><b>Prefix sum</b> adalah kolom tambahan di buku tabungan itu: <b>saldo</b>. Tiap baris mencatat total sejak hari pertama. Begitu kolom itu ada, pertanyaan tadi selesai dengan satu pengurangan — saldo hari ke-9 dikurangi saldo hari ke-2.</p>
           <p style="margin:10px 0"><b>Difference array</b> adalah kebalikannya, dan gunanya juga kebalikan. Kalau prefix sum untuk <b>banyak pertanyaan</b>, difference array untuk <b>banyak perubahan</b>. Alih-alih menambah satu per satu ke seratus posisi, kamu cukup menandai dua ujungnya.</p>` +
          Catatan({
            isi: `<b>Dua tabel ini saling membatalkan.</b> Kalau kamu membuat larik selisih dari sebuah larik, lalu membuat prefix sum dari hasilnya, kamu kembali ke larik semula. Persis seperti tambah lalu kurang.
              <br><br>Itu bukan kebetulan. Prefix sum menjumlahkan, larik selisih mengurangkan. Karena itulah keduanya selalu diajarkan berpasangan.
              <span class="tiny" style="display:block;margin-top:6px">✅ Diuji pada 500 larik acak berisi angka negatif dan nol: selalu kembali ke larik semula.</span>`,
          }) +
          Catatan({
            jenis: 'baik',
            isi: `<b>Kenapa penting untuk OSN-K?</b> Jujur saja: tidak ada soal OSN-K tingkat kabupaten yang meminta kamu "buat prefix sum". Ini bukan tipe soal — ini <b>alat</b>.
              <br><br>Munculnya selalu terselubung, dan hampir selalu dalam bentuk pertanyaan cacah: "ada berapa bebek di kandang 5 sampai 12", "berapa total hujan minggu kedua", "petak mana yang paling sering dilewati". Begitu soal menanyakan hal yang sama untuk banyak rentang berbeda, alat inilah jawabannya.
              <br><br>Silabus resmi TOKI memakainya di bab Matematika Diskret Dasar, dan salah satu contoh soalnya kita bedah nanti.`,
          }),
      }),

      /* ============ LAB 1 ============ */
      Lab({
        judul: 'Lab 1 · Bangun tabel bantunya',
        petunjuk: 'satu pengurangan menjawab rentang apa pun',
        isi:
          `<p style="margin:0 0 12px">Tulis lariknya, lalu tanyakan rentang mana pun. Perhatikan bahwa tabel bantunya punya satu kotak lebih banyak — kotak nol di paling depan. Kotak itu yang membuat rumusnya tidak punya kasus khusus.</p>` +
          Kontrol({
            ids,
            kolom: [{ id: 'a', label: 'larik angka', nilai: '3, 1, 4, 1, 5, 9, 2, 6', lebar: true, jenis: 'teks' }],
            tombol: [{ id: 'bangun', teks: 'Bangun tabel' }],
          }) +
          Kontrol({
            ids,
            kolom: [
              { id: 'l', label: 'dari posisi', nilai: 3, min: 1, maks: 999 },
              { id: 'r', label: 'sampai posisi', nilai: 6, min: 1, maks: 999 },
            ],
            tombol: [{ id: 'tanya', teks: 'Tanya jumlahnya', gaya: 'alt' }],
          }) +
          Wadah({ ids, id: 'viz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan “Bangun tabel” untuk mulai.' }),
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Jumlah dari L sampai R',
        isi: `P[0] = 0, &nbsp; P[i] = A[1] + A[2] + … + A[i]<br>
              <mark>jumlah A[L..R] = P[R] − P[L−1]</mark><br>
              <span style="font-size:12.5px">perhatikan <b>L−1</b>, bukan L. Ini kesalahan nomor satu.</span>`,
        verifikasi: 'Diadu dengan penjumlahan apa adanya pada 10.702 rentang, dari 400 larik acak berisi angka negatif dan nol. Sesuai definisi silabus resmi TOKI.',
        pesan: 'Bangun dulu tabelnya di Lab 1 — rumusnya lebih membekas kalau kamu sendiri yang melihat saldonya bertambah.',
      }),

      /* ============ LAB 2 · TRIK ============ */
      Lab({
        judul: 'Lab 2 · Trik dua tanda — yang paling terasa curang',
        petunjuk: '500.000 langkah jadi 2.000',
        isi:
          `<p style="margin:0 0 10px">Soalnya begini. Ada 1.000 petak. Lalu 500 orang datang bergantian, masing-masing menyiram petak L sampai R. Di akhir, petak mana yang paling banjir?</p>
           <p style="margin:0 0 10px">Cara polosnya: tiap orang menambah 1 ke setiap petak yang ia siram. Kalau tiap orang menyiram 1.000 petak, itu <b>500.000</b> coretan.</p>
           <p style="margin:0 0 12px">Triknya: jangan tandai seluruh rentangnya. Tandai <b>dua ujungnya saja</b>. Tulis <b>+1</b> di petak L, dan <b>−1</b> di petak <b>R+1</b>. Setelah semua orang selesai, sapu sekali dari kiri sambil menjumlahkan.</p>` +
          Kontrol({
            ids,
            kolom: [
              { id: 'pn', label: 'banyaknya petak', nilai: 12, min: 1, maks: 40 },
              { id: 'pq', label: 'banyaknya penyiram', nilai: 4, min: 1, maks: 12 },
            ],
            tombol: [{ id: 'pgo', teks: 'Acak lalu bandingkan' },
                     { id: 'pbesar', teks: 'Coba ukuran soal sungguhan', gaya: 'alt' }],
          }) +
          Wadah({ ids, id: 'pviz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'pout', isi: 'Tekan “Acak lalu bandingkan” untuk mulai.' }),
      }),

      Catatan({
        jenis: 'baik',
        isi: `<b>Kenapa ini bekerja.</b> Penanda +1 di petak L artinya "mulai dari sini, nilainya naik satu". Penanda −1 di petak R+1 artinya "mulai dari sini, kenaikan itu berhenti". Saat kamu menyapu dari kiri sambil menjumlahkan, kenaikan itu berlaku persis di L sampai R.
          <br><br>Perhatikan <b>R+1</b>, bukan R. Kalau kamu menulis −1 di petak R, petak R sendiri tidak ikut tersiram. Ini kembaran dari kesalahan L−1 di Lab 1, dan sama seringnya memakan korban.
          <br><br>Yang membuatnya terasa curang: biaya menyiram <b>tidak lagi tergantung pada panjang rentangnya</b>. Menyiram 3 petak dan menyiram 1.000 petak sama-sama dua coretan.
          <span class="tiny" style="display:block;margin-top:6px">✅ Diadu dengan penambahan satu per satu pada 400 susunan operasi acak, termasuk nilai tambah negatif. Nol beda.</span>`,
      }),

      /* ============ LAB 3 · DUA DIMENSI ============ */
      Lab({
        judul: 'Lab 3 · Kalau soalnya berupa papan',
        petunjuk: 'empat angka menjawab kotak mana pun',
        isi:
          `<p style="margin:0 0 12px">Gagasannya sama, cuma naik satu dimensi. Tabel bantunya menyimpan jumlah seluruh isi kotak dari pojok kiri atas sampai posisi itu. Untuk menjawab satu kotak, kamu butuh <b>empat</b> angka, bukan dua.</p>` +
          Kontrol({
            ids,
            kolom: [
              { id: 'r1', label: 'baris dari', nilai: 2, min: 1, maks: 9 },
              { id: 'c1', label: 'kolom dari', nilai: 2, min: 1, maks: 9 },
              { id: 'r2', label: 'baris sampai', nilai: 4, min: 1, maks: 9 },
              { id: 'c2', label: 'kolom sampai', nilai: 4, min: 1, maks: 9 },
            ],
            tombol: [{ id: 'ggo', teks: 'Hitung isi kotak' },
                     { id: 'gacak', teks: 'Acak papannya', gaya: 'alt' }],
          }) +
          Wadah({ ids, id: 'gviz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'gout', isi: 'Tekan “Hitung isi kotak” untuk mulai.' }),
      }),

      Catatan({
        jenis: 'awas',
        isi: `<b>Suku terakhir itu wajib, dan gampang sekali dilupakan.</b> Saat kamu membuang bagian atas dan bagian kiri, pojok kiri atasnya terbuang <b>dua kali</b>. Jadi ia harus dikembalikan sekali.
          <br><br>Jangan anggap ini kesalahan kecil yang jarang terjadi. Kalau koreksi itu dilupakan, jawabannya salah untuk <b>sepertiga</b> kotak yang mungkin — semua kotak yang tidak menempel di tepi atas atau tepi kiri.
          <span class="tiny" style="display:block;margin-top:6px">✅ Diuji: dari 21.543 kotak acak, 7.411 di antaranya salah kalau koreksinya dilupakan.</span>`,
      }),

      /* ============ KUMPULAN CARA CEPAT ============ */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Enam bentuk yang menutup hampir semua soal rentang.',
        isi: Tab({
          ids, id: 'trik',
          daftar: [
            {
              kunci: 'c1', judul: 'Jumlah rentang',
              isi: `<p style="margin:0 0 10px">Bentuk paling dasar, dan yang paling sering menyamar jadi hal lain.</p>` +
                Rumus({
                  label: 'Setelah tabel bantu jadi',
                  isi: `<mark>jumlah A[L..R] = P[R] − P[L−1]</mark><br>
                        <span style="font-size:12.5px">berapa pun panjang rentangnya, biayanya tetap satu pengurangan</span>`,
                  verifikasi: 'Diadu dengan penjumlahan apa adanya pada 10.702 rentang dari 400 larik acak.',
                }) +
                `<p class="tiny">Kalau soal menanyakan hal yang sama untuk beberapa rentang berbeda, hampir pasti ini jawabannya.</p>`,
            },
            {
              kunci: 'c2', judul: 'Mencacah, bukan menjumlah',
              isi: `<p style="margin:0 0 10px">Bentuk yang paling sering muncul di OSN-K, dan paling sering tidak dikenali.</p>` +
                Rumus({
                  label: '“Ada berapa yang … di rentang L..R?”',
                  isi: `tandai <mark>1</mark> kalau memenuhi syarat, <mark>0</mark> kalau tidak<br>
                        lalu pakai rumus yang sama persis`,
                  verifikasi: 'Diuji pada 5.804 rentang: mencacah lewat penanda 0/1 selalu sama dengan menghitung satu per satu.',
                }) +
                `<p class="tiny">Contoh: "ada berapa bilangan genap di posisi 3 sampai 9". Ubah lariknya jadi 0 dan 1, sisanya identik.</p>`,
            },
            {
              kunci: 'c3', judul: 'Trik dua tanda',
              isi: `<p style="margin:0 0 10px">Untuk soal yang menambahkan sesuatu ke banyak rentang.</p>` +
                Rumus({
                  label: 'Menambah v ke posisi L sampai R',
                  isi: `tulis <mark>+v di L</mark> dan <mark>−v di R+1</mark><br>
                        setelah semua selesai, sapu sekali sambil menjumlahkan`,
                  verifikasi: 'Diadu dengan penambahan satu per satu pada 400 susunan operasi acak, termasuk v negatif.',
                }) +
                `<p class="tiny">Perhatikan R+1, bukan R. Kalau salah, petak terakhir tidak ikut berubah.</p>`,
            },
            {
              kunci: 'c4', judul: 'Papan dua dimensi',
              isi: `<p style="margin:0 0 10px">Kalau soalnya berupa petak-petak, bukan barisan.</p>` +
                Rumus({
                  label: 'Isi kotak dari (r1,c1) sampai (r2,c2)',
                  isi: `<mark>P[r2][c2] − P[r1−1][c2] − P[r2][c1−1] + P[r1−1][c1−1]</mark>`,
                  verifikasi: 'Diadu dengan penjumlahan apa adanya pada 10.336 kotak dari 120 papan acak.',
                }) +
                `<p class="tiny">Suku terakhirnya mengembalikan pojok kiri atas yang terpotong dua kali. Tanpa itu, sepertiga jawaban salah.</p>`,
            },
            {
              kunci: 'c5', judul: 'Rata-rata rentang',
              isi: `<p style="margin:0 0 10px">Turunan langsung, sering ditanya OSN-K dalam bentuk "berapa rata-rata nilai dari …".</p>` +
                Rumus({
                  label: 'Rata-rata A[L..R]',
                  isi: `<mark>(P[R] − P[L−1]) ÷ (R − L + 1)</mark>`,
                  verifikasi: 'Turunan langsung dari rumus jumlah rentang yang sudah diuji.',
                }) +
                `<p class="tiny">Perhatikan penyebutnya: R − L + 1, bukan R − L. Rentang 3 sampai 6 berisi empat angka, bukan tiga.</p>`,
            },
            {
              kunci: 'c6', judul: 'Sisa bagi dan kotak burung',
              isi: `<p style="margin:0 0 10px">Penerapan yang paling elegan, dan ada di silabus resmi TOKI.</p>` +
                Rumus({
                  label: 'Pada larik berisi N angka, selalu ADA subbarisan berurutan yang jumlahnya habis dibagi N',
                  isi: `ada <mark>N+1</mark> nilai tabel bantu (P[0] sampai P[N])<br>
                        tapi cuma <mark>N</mark> sisa bagi yang mungkin<br>
                        jadi pasti ada dua yang sisanya sama — potongan di antaranya itulah jawabannya`,
                  verifikasi: 'Diuji pada 800 larik acak: selalu ketemu, nol gagal.',
                }) +
                `<p class="tiny">Ini gabungan prefix sum dan asas kotak burung. Kalau dua saldo punya sisa bagi sama, selisihnya pasti habis dibagi N.</p>`,
            },
          ],
        }),
      }),

      /* ============ UJI SENDIRI ============ */
      Kartu({
        judul: 'Uji sendiri: rumus vs menjumlahkan satu per satu',
        sub: 'Diuji pada larik ACAK, bukan cuma larik contoh. Termasuk angka negatif dan nol.',
        isi:
          `<div class="ctl">
            <button class="btn" id="${ids.i('ugo')}">Uji larik di Lab 1</button>
            <button class="btn alt" id="${ids.i('uall')}">Uji 200 larik acak</button>
          </div>` +
          Keluaran({ ids, id: 'uout', isi: 'Tekan salah satu tombol untuk mulai.' }),
      }),

      /* ============ PENYAMARAN ============ */
      Kartu({
        judul: 'Penyamaran: satu alat, lima wajah',
        sub: 'Kenali bentuknya, bukan kata kuncinya.',
        isi: Tab({
          ids, id: 'samar',
          daftar: [
            {
              kunci: 'a', judul: 'A · Curah hujan',
              isi: `<p style="margin:0 0 10px">"Tabel mencatat curah hujan tiap hari selama 30 hari. Berapa total hujan pada minggu kedua? Minggu ketiga? Sepuluh hari terakhir?"</p>` +
                Catatan({ isi: `<b>Tiga pertanyaan, satu tabel bantu.</b> Buat kolom saldo sekali, lalu tiap jawaban satu pengurangan. Kalau dijumlahkan satu per satu, kamu mengerjakan pekerjaan yang sama tiga kali.` }),
            },
            {
              kunci: 'b', judul: 'B · Cacah',
              isi: `<p style="margin:0 0 10px">"Ada berapa bebek jantan di kandang nomor 4 sampai nomor 11?"</p>` +
                Catatan({ isi: `<b>Ini juga prefix sum</b>, walaupun tidak ada kata "jumlah". Ubah dulu datanya jadi 1 untuk jantan dan 0 untuk betina. Setelah itu, mencacah dan menjumlahkan jadi hal yang persis sama.
                  <br><br>Bentuk ini yang paling sering muncul di OSN-K, dan paling sering tidak dikenali karena soalnya berbunyi "ada berapa", bukan "berapa jumlah".` }),
            },
            {
              kunci: 'c', judul: 'C · Penyiraman',
              isi: `<p style="margin:0 0 10px">"Setiap petugas menyiram petak L sampai R. Setelah semua petugas selesai, petak mana yang paling sering tersiram?"</p>` +
                Catatan({ isi: `<b>Difference array.</b> Penandanya: soal <b>mengubah rentang</b>, lalu bertanya di akhir — bukan bertanya di tengah-tengah. Kalau soal bertanya setelah tiap perubahan, alat ini tidak cukup.` }),
            },
            {
              kunci: 'd', judul: 'D · Papan',
              isi: `<p style="margin:0 0 10px">"Pada papan 8 × 8, berapa jumlah angka di dalam persegi dari baris 3 kolom 2 sampai baris 6 kolom 5?"</p>` +
                Catatan({ isi: `<b>Dua dimensi.</b> Empat angka, satu penjumlahan bertanda campur. Jangan lupa suku terakhirnya — pojok kiri atas terpotong dua kali kalau tidak dikembalikan.` }),
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: `<p style="margin:0 0 10px">"Berapa jumlah dari posisi 3 sampai 7? Lalu ubah nilai di posisi 5 menjadi 20. Sekarang berapa jumlah dari posisi 4 sampai 9?"</p>` +
                Catatan({ jenis: 'awas', isi: `<b>Tabel bantunya sudah basi.</b> Begitu satu angka di lariknya berubah, seluruh saldo sesudahnya ikut berubah. Menjawab pertanyaan kedua dengan tabel lama akan salah.
                  <br><br>Untuk soal OSN-K tingkat kabupaten, cukup bangun ulang tabelnya. Untuk soal yang perubahannya ribuan kali, ada alat lain yang belum kita bahas di lab ini.
                  <br><br>Penandanya di naskah soal: kata <b>"lalu ubah"</b>, <b>"kemudian ganti"</b>, atau pertanyaan yang berselang-seling dengan perubahan.` }),
            },
          ],
        }),
      }),

      /* ============ BEDAH SOAL ============ */
      Kartu({
        judul: 'Bedah soal: Subhimpunan Terbagi',
        sub: 'Contoh Soal 2.1 dari silabus resmi TOKI, pemrograman-kompetitif-dasar.pdf.',
        isi:
          `<p style="margin:0 0 10px">Diberikan larik berisi N bilangan bulat tidak negatif. Pilih beberapa angka yang jumlahnya habis dibagi N. Apakah selalu bisa?</p>` +
          Kisi([
            KartuSoal({ ids, nomor: 'Silabus · bagian a', idKeluaran: 's1',
              pertanyaan: 'Buat tabel bantunya, lalu lihat sisa bagi tiap saldo.' }),
            KartuSoal({ ids, nomor: 'Silabus · bagian b', idKeluaran: 's2',
              pertanyaan: 'Temukan potongannya. Kenapa jawabannya selalu ada?' }),
          ]) + `<div class="ctl" style="margin-top:12px">
            <button class="btn" id="${ids.i('solve')}">Selesaikan</button>
            <button class="btn alt" id="${ids.i('sacak')}">Ganti lariknya</button>
          </div>`,
      }),

      /* ============ KAPAN INI BUKAN ============ */
      Catatan({
        jenis: 'awas',
        isi: `<b>Kapan alat ini TIDAK boleh dipakai.</b> Ketiganya sudah diuji, bukan dikira-kira:` +
          Tabel({
            kiri: true,
            kepala: ['Bunyi soal', 'Kenapa gugur'],
            baris: [
              ['“jumlah dari X sampai Y”, ditanya berkali-kali', '✅ pakai prefix sum'],
              ['“tambahkan ke rentang”, lalu tanya di akhir', '✅ pakai difference array'],
              ['lariknya <b>diubah</b> di antara pertanyaan', '❌ tabelnya basi — bangun ulang'],
              ['operasinya <b>dikali</b>, bukan ditambah', '❌ difference array gugur total'],
              ['operasinya <b>diganti</b> jadi nilai tertentu', '❌ bukan penambahan, gugur juga'],
              ['ditanya nilai <b>terbesar</b> di rentang, bukan jumlah', '❌ prefix sum tidak bisa — maksimum tidak bisa dikurangkan'],
            ],
          }) +
          `<span style="display:block;margin-top:10px">Baris terakhir itu yang paling halus. Jumlah bisa dikurangkan, jadi rentang bisa dipotong. Nilai terbesar <b>tidak bisa</b> — mengetahui nilai terbesar 1..9 dan 1..2 tidak memberi tahu apa pun tentang nilai terbesar 3..9.</span>`,
      }),

      Catatan({
        isi: `<b>Verifikasi 30 detik sebelum menulis jawaban.</b> Dua pemeriksaan, dan yang pertama menangkap hampir semua kesalahan.
          <br><br>Pertama, <b>uji rentang sepanjang satu</b>. Pakai rumusmu untuk mencari jumlah posisi 5 sampai 5. Hasilnya harus persis sama dengan angka di posisi 5. Kalau meleset, batas indeksmu bergeser satu.
          <br><br>Kedua, <b>uji seluruh larik</b>. Jumlah posisi 1 sampai N harus sama dengan angka terakhir tabel bantumu. Kalau kamu memakai difference array, jumlahkan semua penandanya — hasilnya harus nol kalau tiap penambahan berhenti di dalam larik.`,
      }),

    ].join('');

    /* ================= PERILAKU ================= */

    let larik = [3, 1, 4, 1, 5, 9, 2, 6];
    let papan = [[3,1,4,1,5],[9,2,6,5,3],[5,8,9,7,9],[3,2,3,8,4],[6,2,6,4,3]];
    let lartikSoal = [7, 12, 5, 9, 3];

    /* ---- Lab 1 ---- */
    const gambarLab1 = (sorot) => {
      const P = M.psTabel(larik);
      ids.q('viz').innerHTML =
        gambarPita(larik, { judul: 'larik A (mulai dari 1)', sorot }) +
        gambarPita(P, { judul: 'tabel bantu P (mulai dari 0)', mulai: 0,
          tinta: (v, i) => (sorot && (i === sorot[1] || i === sorot[0] - 1))
            ? 'var(--hijau-pucat)' : null });
    };

    ids.klik('bangun', () => {
      bukaRumus(ids, 'rumus');
      const baru = bacaLarik(ids.s('a'));
      if (!baru.length) {
        ids.q('viz').innerHTML = '';
        ids.tulis('out', 'Tulis angkanya dulu, dipisahkan koma. Misalnya 3, 1, 4.');
        return;
      }
      larik = baru;
      const P = M.psTabel(larik);
      gambarLab1(null);
      ids.tulis('out',
`Larik berisi ${larik.length} angka. Tabel bantunya berisi ${P.length} angka — satu lebih banyak.

  P[0] = 0   ${redup('kotak nol di depan, ini yang bikin rumusnya tanpa kasus khusus')}
${larik.map((v, i) => `  P[${i + 1}] = P[${i}] + ${v} = ${P[i + 1]}`).join('\n')}

${redup('Sekarang tanyakan rentang mana pun. Berapa pun panjangnya, jawabannya satu pengurangan.')}`);
    });

    ids.klik('tanya', () => {
      bukaRumus(ids, 'rumus');
      const P = M.psTabel(larik);
      const l = ids.n('l', { min: 1, maks: 999, bawaan: 1 });
      const r = ids.n('r', { min: 1, maks: 999, bawaan: larik.length });
      if (l > larik.length || r > larik.length) {
        gambarLab1(null);
        ids.tulis('out', merah(`Lariknya cuma sepanjang ${larik.length}, jadi posisi ${Math.max(l, r)} tidak ada.`));
        return;
      }
      if (l > r) {
        gambarLab1(null);
        ids.tulis('out',
`Batas kirinya (${l}) melewati batas kanannya (${r}), jadi rentangnya kosong.

  jumlah = ${hijau('0')}   ${redup('bukan galat — rentang kosong memang bernilai nol')}`);
        return;
      }
      gambarLab1([l, r]);
      const langsung = larik.slice(l - 1, r);
      ids.tulis('out',
`CARA 1 — jumlahkan satu per satu
  ${langsung.join(' + ')} = ${hijau(angka(langsung.reduce((a, b) => a + b, 0)))}
  ${redup(`${langsung.length} penjumlahan`)}

CARA 2 — tabel bantu
  P[${r}] − P[${l - 1}] = ${angka(P[r])} − ${angka(P[l - 1])} = ${hijau(angka(M.psJumlah(P, l, r)))}
  ${redup('1 pengurangan, berapa pun panjang rentangnya')}

${langsung.reduce((a, b) => a + b, 0) === M.psJumlah(P, l, r)
  ? hijau('✓ DUA CARA SAMA') : merah('✗ beda')}
${redup(`Rata-rata rentang ini: ${angka(M.psJumlah(P, l, r))} ÷ ${r - l + 1} = ${(M.psJumlah(P, l, r) / (r - l + 1)).toFixed(2)}`)}`);
    });

    /* ---- Lab 2 · trik dua tanda ---- */
    const jalankanTrik = (N, Q, tampilkanGambar) => {
      const op = [];
      for (let i = 0; i < Q; i++) {
        const l = 1 + Math.floor(Math.random() * N);
        const r = l + Math.floor(Math.random() * (N - l + 1));
        op.push({ l, r, v: 1 });
      }
      const cepat = M.psTerapkan(N, op);
      const kasar = M.psTerapkanKasar(N, op);
      const sama = JSON.stringify(cepat.hasil) === JSON.stringify(kasar.hasil);
      const puncak = Math.max(...cepat.hasil);
      const dimana = cepat.hasil.map((v, i) => v === puncak ? i + 1 : null).filter((x) => x);

      if (tampilkanGambar) {
        ids.q('pviz').innerHTML =
          gambarPita(cepat.penanda, { judul: 'penanda — cuma dua coretan per penyiram',
            tinta: (v) => v > 0 ? 'var(--hijau-pucat)' : v < 0 ? 'var(--stabilo)' : null }) +
          gambarPita(cepat.hasil, { judul: 'hasil setelah disapu sekali dari kiri',
            tinta: (v) => v === puncak && puncak > 0 ? 'var(--stabilo)' : null });
      } else {
        ids.q('pviz').innerHTML = '';
      }

      return { op, cepat, kasar, sama, puncak, dimana };
    };

    ids.klik('pgo', () => {
      const N = ids.n('pn', { min: 1, maks: 40, bawaan: 12 });
      const Q = ids.n('pq', { min: 1, maks: 12, bawaan: 4 });
      const { op, cepat, kasar, sama, puncak, dimana } = jalankanTrik(N, Q, true);
      ids.tulis('pout',
`${Q} penyiram, ${N} petak.

${op.map((o, i) => `  penyiram ${i + 1} : petak ${o.l}–${o.r}   ${redup(`+1 di ${o.l}, −1 di ${o.r + 1}`)}`).join('\n')}

CARA 1 — tambah satu per satu   : ${merah(kasar.langkah + ' langkah')}
CARA 2 — dua tanda lalu sapu    : ${hijau(cepat.langkah + ' langkah')}   ${redup(`(${cepat.tanda} tanda + ${N} sapuan)`)}

${sama ? hijau('✓ HASILNYA SAMA PERSIS') : merah('✗ beda')}
Petak paling banjir: ${hijau(dimana.join(', ') || '—')} dengan ${puncak} kali siraman.

${redup('Jumlah semua penanda harus 0 kalau tiap penyiraman berhenti di dalam larik.')}`);
    });

    ids.klik('pbesar', () => {
      const N = 1000, Q = 500;
      const op = [...Array(Q)].map(() => ({ l: 1, r: N, v: 1 }));
      const cepat = M.psTerapkan(N, op);
      const kasar = M.psTerapkanKasar(N, op);
      ids.q('pviz').innerHTML = '';
      ids.tulis('pout',
`Ukuran soal sungguhan: ${angka(N)} petak, ${angka(Q)} penyiram, masing-masing menyiram seluruh petak.

CARA 1 — tambah satu per satu
  ${angka(kasar.langkah)} langkah   ${merah('tidak mungkin dikerjakan di kertas')}

CARA 2 — dua tanda lalu sapu
  ${angka(cepat.tanda)} tanda + ${angka(N)} sapuan = ${hijau(angka(cepat.langkah) + ' langkah')}

  ${hijau(Math.floor(kasar.langkah / cepat.langkah) + '× lebih ringan')}

${JSON.stringify(cepat.hasil) === JSON.stringify(kasar.hasil)
  ? hijau('✓ hasilnya tetap sama persis') : merah('✗ beda')}

${redup('Perhatikan yang terjadi: biaya menyiram tidak lagi tergantung panjang rentangnya.')}
${redup('Menyiram 3 petak dan menyiram 1.000 petak sama-sama dua coretan.')}`);
    });

    /* ---- Lab 3 · dua dimensi ---- */
    const hitungKotak = () => {
      const P = M.psTabel2D(papan);
      const b = papan.length, k = papan[0].length;
      const r1 = Math.min(b, ids.n('r1', { min: 1, maks: 9, bawaan: 1 }));
      const c1 = Math.min(k, ids.n('c1', { min: 1, maks: 9, bawaan: 1 }));
      const r2 = Math.min(b, ids.n('r2', { min: 1, maks: 9, bawaan: b }));
      const c2 = Math.min(k, ids.n('c2', { min: 1, maks: 9, bawaan: k }));
      if (r1 > r2 || c1 > c2) {
        ids.q('gviz').innerHTML = gambarPapan(papan, { judul: 'papan' });
        ids.tulis('gout', `Kotaknya terbalik — baris ${r1} sampai ${r2}, kolom ${c1} sampai ${c2}.
Isinya ${hijau('0')}, karena tidak ada petak yang masuk.`);
        return;
      }
      ids.q('gviz').innerHTML = gambarPapan(papan, { kotakSorot: [r1, c1, r2, c2], judul: 'papan' });
      let langsung = 0;
      for (let i = r1 - 1; i < r2; i++) for (let j = c1 - 1; j < c2; j++) langsung += papan[i][j];
      const lupa = P[r2][c2] - P[r1 - 1][c2] - P[r2][c1 - 1];
      ids.tulis('gout',
`Kotak baris ${r1}–${r2}, kolom ${c1}–${c2}   (${(r2 - r1 + 1) * (c2 - c1 + 1)} petak)

CARA 1 — jumlahkan tiap petak
  hasil = ${hijau(angka(langsung))}   ${redup(`${(r2 - r1 + 1) * (c2 - c1 + 1)} penjumlahan`)}

CARA 2 — empat angka dari tabel bantu
  P[${r2}][${c2}] − P[${r1 - 1}][${c2}] − P[${r2}][${c1 - 1}] + P[${r1 - 1}][${c1 - 1}]
  = ${angka(P[r2][c2])} − ${angka(P[r1 - 1][c2])} − ${angka(P[r2][c1 - 1])} + ${angka(P[r1 - 1][c1 - 1])}
  = ${hijau(angka(M.psKotak(P, r1, c1, r2, c2)))}

${langsung === M.psKotak(P, r1, c1, r2, c2) ? hijau('✓ DUA CARA SAMA') : merah('✗ beda')}

${lupa === langsung
  ? redup('Kebetulan kotak ini menempel di tepi, jadi koreksinya kebetulan tidak berpengaruh.')
  : merah(`Kalau suku terakhirnya dilupakan: ${angka(lupa)} — salah ${angka(langsung - lupa)}.`)}`);
    };
    ids.klik('ggo', hitungKotak);
    ids.klik('gacak', () => {
      papan = [...Array(5)].map(() => [...Array(5)].map(() => 1 + Math.floor(Math.random() * 9)));
      hitungKotak();
    });

    /* ---- Uji sendiri ---- */
    ids.klik('ugo', () => {
      const P = M.psTabel(larik);
      let uji = 0, beda = 0;
      for (let l = 1; l <= larik.length; l++) for (let r = l; r <= larik.length; r++) {
        uji++;
        const langsung = larik.slice(l - 1, r).reduce((a, b) => a + b, 0);
        if (M.psJumlah(P, l, r) !== langsung) beda++;
      }
      ids.tulis('uout',
`Larik: ${larik.join(', ')}

Menguji SEMUA ${uji} rentang yang mungkin, diadu dengan penjumlahan satu per satu.

  cocok : ${beda === 0 ? hijau(uji + ' / ' + uji) : merah((uji - beda) + ' / ' + uji)}

${beda === 0 ? hijau('✓ TIDAK ADA YANG MELESET') : merah('✗ meleset ' + beda + ' rentang')}`);
    });

    ids.klik('uall', () => {
      let ujiRentang = 0, bedaRentang = 0;
      let ujiTanda = 0, bedaTanda = 0, adaNegatif = false;
      for (let putar = 0; putar < 200; putar++) {
        const n = Math.floor(Math.random() * 10);
        const a = [...Array(n)].map(() => Math.floor(Math.random() * 19) - 9);
        if (a.some((x) => x < 0)) adaNegatif = true;
        const P = M.psTabel(a);
        for (let l = 1; l <= n; l++) for (let r = l; r <= n; r++) {
          ujiRentang++;
          if (M.psJumlah(P, l, r) !== a.slice(l - 1, r).reduce((x, y) => x + y, 0)) bedaRentang++;
        }
        const N = 1 + Math.floor(Math.random() * 12), op = [];
        for (let q = 0; q < 1 + Math.floor(Math.random() * 5); q++) {
          const l = 1 + Math.floor(Math.random() * N);
          const r = l + Math.floor(Math.random() * (N - l + 1));
          op.push({ l, r, v: Math.floor(Math.random() * 11) - 5 });
        }
        ujiTanda++;
        if (JSON.stringify(M.psTerapkan(N, op).hasil)
            !== JSON.stringify(M.psTerapkanKasar(N, op).hasil)) bedaTanda++;
      }
      ids.tulis('uout',
`Menguji dengan larik ACAK, bukan larik contoh.

  rumus jumlah rentang, diadu penjumlahan satu per satu
    ${bedaRentang === 0 ? hijau(ujiRentang + ' / ' + ujiRentang + ' cocok') : merah((ujiRentang - bedaRentang) + ' / ' + ujiRentang)}

  trik dua tanda, diadu penambahan satu per satu
    ${bedaTanda === 0 ? hijau(ujiTanda + ' / ' + ujiTanda + ' cocok') : merah((ujiTanda - bedaTanda) + ' / ' + ujiTanda)}

  larik berisi angka negatif ikut diuji : ${adaNegatif ? hijau('ya') : redup('kebetulan tidak')}

${bedaRentang === 0 && bedaTanda === 0
  ? hijau('✓ TIDAK ADA YANG MELESET') + '\n' + redup('Rumusnya berlaku umum, bukan cuma pas untuk larik contoh.')
  : merah('✗ ada yang meleset')}`);
    });

    /* ---- Bedah soal ---- */
    const bedah = () => {
      const a = lartikSoal, N = a.length, P = M.psTabel(a);
      const h = M.psHabisDibagi(a);
      ids.tulis('s1',
`Larik: ${a.join(', ')}   (N = ${N})

  ${P.map((v, i) => `P[${i}] = ${angka(v)}`).join('\n  ')}

Sisa bagi tiap saldo dengan ${N}:
  ${P.map((v, i) => `P[${i}] mod ${N} = ${((v % N) + N) % N}`).join('\n  ')}

${redup('Ada ' + (N + 1) + ' saldo, tapi cuma ' + N + ' sisa bagi yang mungkin.')}`);

      ids.tulis('s2', h
? `Dua saldo bersisa sama: ${hijau('P[' + (h.l - 1) + ']')} dan ${hijau('P[' + h.r + ']')}, dua-duanya bersisa ${h.sisa}.

Potongannya: posisi ${h.l} sampai ${h.r}
  ${a.slice(h.l - 1, h.r).join(' + ')} = ${hijau(angka(a.slice(h.l - 1, h.r).reduce((x, y) => x + y, 0)))}
  ${angka(a.slice(h.l - 1, h.r).reduce((x, y) => x + y, 0))} ÷ ${N} = ${hijau('habis')} ✓

${redup('Kenapa selalu ada? Karena ' + (N + 1) + ' saldo dijejalkan ke ' + N + ' kemungkinan sisa.')}
${redup('Pasti ada dua yang sama, dan selisih dua saldo itu selalu habis dibagi ' + N + '.')}`
: merah('Tidak ketemu — ini seharusnya mustahil.'));
    };
    ids.klik('solve', bedah);
    ids.klik('sacak', () => {
      const N = 3 + Math.floor(Math.random() * 5);
      lartikSoal = [...Array(N)].map(() => Math.floor(Math.random() * 30));
      bedah();
    });

    pasangTab('trik');
    pasangTab('samar');
  },
};
