/* ============================================================
   MODUL 15 — KOTAK BERSARANG (DILWORTH)
   Soal: OSN-K 2025 nomor 17-19, "Menyimpan Kotak Penyimpanan"

   Semua rumus dan angka dibuktikan verify/15-dilworth.py — rumusnya
   diadu dengan DUA cara berbeda (pencocokan dan mencoba semua urutan)
   pada ratusan susunan acak, bukan cuma daftar kotak di soal.

   Acuan teori: Robert P. Dilworth, "A Decomposition Theorem for
   Partially Ordered Sets", Annals of Mathematics 51 (1950).
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Tabel, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

const S17 = [1, 1, 2, 2, 2, 3, 3, 4, 6, 8];
const TABEL19 = [[2, 5], [3, 12], [5, 19], [8, 4], [13, 15], [21, 7], [34, 8]];
const S19 = TABEL19.flatMap(([u, c]) => Array(c).fill(u));

/* ---------- KOTAK BERSARANG ----------
   Menggambar tiap rantai sebagai persegi di dalam persegi. Ukurannya
   dibuat sebanding dengan sisi aslinya, supaya siswa melihat kenapa
   yang kecil muat di yang besar. */
function gambarRantai(rantai, { batas = 6 } = {}) {
  if (!rantai.length) return '<div class="out">Belum ada kotak.</div>';
  const tampil = rantai.slice(0, batas);
  const maksSisi = Math.max(...rantai.flat(), 1);
  const petak = 118, jarak = 14;
  const W = tampil.length * (petak + jarak) + jarak;
  const H = petak + 46;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Tumpukan kotak bersarang">`;
  tampil.forEach((ch, i) => {
    const x0 = jarak + i * (petak + jarak);
    /* gambar dari yang TERBESAR dulu supaya yang kecil menimpa di atasnya */
    [...ch].reverse().forEach((sisi, k) => {
      const sk = Math.max(12, Math.round(petak * sisi / maksSisi));
      const off = (petak - sk) / 2;
      s += `<rect x="${(x0 + off).toFixed(1)}" y="${(22 + off).toFixed(1)}"
        width="${sk}" height="${sk}" rx="3"
        fill="${k === ch.length - 1 ? 'var(--stabilo)' : 'none'}"
        stroke="var(--garis-tebal)" stroke-width="1.5"/>
        <text x="${(x0 + petak / 2).toFixed(1)}" y="${(22 + off + 12).toFixed(1)}"
        text-anchor="middle" style="font-family:var(--mono);font-size:10px;
        fill:var(--tinta-3)">${sisi}</text>`;
    });
    s += `<text x="${x0 + petak / 2}" y="14" text-anchor="middle"
      style="font-family:var(--mono);font-size:11px;font-weight:700;
      fill:var(--merah)">tumpukan ${i + 1}</text>
      <text x="${x0 + petak / 2}" y="${H - 6}" text-anchor="middle"
      style="font-family:var(--mono);font-size:10px;fill:var(--tinta-3)">${ch.join(' ⊂ ')}</text>`;
  });
  if (rantai.length > batas) {
    s += `<text x="${W - 8}" y="${H / 2}" text-anchor="end"
      style="font-family:var(--mono);font-size:11px;fill:var(--tinta-3)">
      … ${rantai.length - batas} tumpukan lagi</text>`;
  }
  return s + '</svg>';
}

/* ---------- BATANG CACAH ----------
   Satu batang per ukuran. Yang terpanjang disorot — itulah jawabannya. */
function gambarCacah(sisi) {
  const c = M.dwCacah(sisi);
  if (!c.length) return '<div class="out">Belum ada kotak.</div>';
  const maks = Math.max(...c.map((x) => x.banyak));
  const tinggi = 22, kiri = 62, lebarMaks = 420;
  const W = kiri + lebarMaks + 56, H = c.length * (tinggi + 5) + 12;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Banyaknya kotak untuk tiap ukuran sisi">`;
  c.forEach((x, i) => {
    const y = i * (tinggi + 5) + 6;
    const w = Math.max(6, Math.round(lebarMaks * x.banyak / maks));
    const juara = x.banyak === maks;
    s += `<text x="54" y="${y + tinggi / 2 + 4}" text-anchor="end"
      style="font-family:var(--mono);font-size:12px;fill:var(--tinta-2)">sisi ${x.ukuran}</text>
      <rect x="${kiri}" y="${y}" width="${w}" height="${tinggi}" rx="3"
      fill="${juara ? 'var(--stabilo)' : 'var(--hijau-pucat)'}"
      stroke="${juara ? 'var(--merah)' : 'var(--garis-tebal)'}" stroke-width="${juara ? 2 : 1}"/>
      <text x="${kiri + w + 8}" y="${y + tinggi / 2 + 4}"
      style="font-family:var(--mono);font-size:12px;font-weight:${juara ? 700 : 400};
      fill:${juara ? 'var(--merah)' : 'var(--tinta-3)'}">${x.banyak}${juara ? '  ← terbanyak' : ''}</text>`;
  });
  return s + '</svg>';
}

const bacaSisi = (teks) => String(teks).split(/[,\s]+/)
  .map((x) => parseInt(x.trim(), 10)).filter((x) => !isNaN(x));

export default {
  id: 'kotak', n: '15', kelompok: 'Hitungan',
  judul: 'Kotak Bersarang (Dilworth)',
  lede: 'Soalnya memberi tabel dua kolom. Kolom pertama berisi deret Fibonacci, dan kamu boleh mengabaikannya seluruhnya. Jawabannya ada di kolom kedua, dan cuma satu angka di sana yang perlu kamu lihat.',
  lencana: ['<span class="chip r">2025 · soal 17–19</span>',
            '<span class="chip v">Diadu dua cara berbeda</span>'],

  kartu: [
    { q: '"Kotak boleh dimasukkan ke kotak lain kalau sisinya lebih kecil."', a: 'lain', why: 'Kotak bersarang. Susunannya membentuk rantai, dan yang dicari banyaknya rantai paling sedikit.' },
    { q: '"Tiap kotak yang dibuka hanya boleh memperlihatkan maksimal satu kotak."', a: 'lain', why: 'Kalimat inilah yang memaksa bentuknya jadi rantai lurus, bukan pohon bercabang.' },
    { q: '"Berapa kotak paling sedikit yang terlihat dari luar?"', a: 'lain', why: 'Jawabannya cacah ukuran yang paling sering muncul. Kotak sesama ukuran tidak bisa saling masuk.' },
    { q: 'Kotaknya BALOK, bukan kubus', a: 'lain', why: 'JEBAKAN — dua balok bisa berbeda ukuran tapi tetap tidak saling muat. Rumus kembar gugur.' },
  ],
  kamus: [
    ['"boleh dimasukkan kalau lebih kecil" + "maksimal satu di dalam"', 'Kotak bersarang'],
    ['"paling sedikit yang terlihat dari luar"', 'Banyaknya rantai paling sedikit'],
    ['kotak berbentuk KUBUS', 'Cukup cacah ukuran yang paling sering muncul'],
    ['kotak berbentuk BALOK', 'Rumus kembar gugur — butuh Dilworth penuh'],
  ],

  bangun(root, { ids, pasangTab }) {

    root.innerHTML = [

      /* ============ APA ITU ============ */
      Kartu({
        judul: 'Apa itu Kotak Bersarang?',
        isi:
          `<p style="margin:10px 0">Kamu punya setumpuk kotak kardus berbentuk kubus. Kotak kecil boleh dimasukkan ke kotak besar, asal sisinya benar-benar lebih kecil. Dan ada satu aturan tambahan: tiap kotak yang dibuka hanya boleh memperlihatkan <b>satu</b> kotak di dalamnya.</p>
           <p style="margin:10px 0">Aturan terakhir itu penting. Ia melarang kamu menjejalkan tiga kotak sekaligus ke dalam satu kotak besar. Jadi susunanmu bukan pohon bercabang, melainkan <b>rantai lurus</b>: kotak di dalam kotak di dalam kotak.</p>
           <p style="margin:10px 0">Pertanyaannya: paling sedikit berapa kotak yang masih terlihat dari luar? Dengan kata lain, paling sedikit berapa <b>rantai</b> yang kamu perlukan untuk menampung semua kotak.</p>` +
          Catatan({
            isi: `<b>Kapan dua kotak TIDAK bisa disatukan?</b> Hanya kalau sisinya sama persis. Kotak sisi 5 tidak muat di kotak sisi 5 yang lain, karena syaratnya "lebih kecil", bukan "lebih kecil atau sama".
              <br><br>Selain itu, dua kotak apa pun pasti bisa disatukan — yang kecil masuk ke yang besar. Jadi kotak-kotak yang saling menolak selalu berukuran sama.
              <br><br>Dari situ jawabannya muncul sendiri. Kalau ada 19 kotak bersisi 5, kesembilan belasnya wajib berada di rantai berbeda. Dan ternyata sebanyak itu saja sudah cukup.`,
          }) +
          Catatan({
            isi: `<b>Asal-usulnya.</b> Yang baru saja kamu baca adalah bentuk sederhana dari <b>teorema Dilworth</b>. Robert P. Dilworth menerbitkannya pada 1950 dalam <i>Annals of Mathematics</i>, dan bunyinya begini: banyaknya rantai paling sedikit untuk menampung semua benda sama dengan ukuran kelompok terbesar yang <b>saling menolak</b>.
              <br><br>Kelompok saling menolak itu namanya <b>antirantai</b>. Untuk kotak kubus, antirantai selalu berarti sekumpulan kotak berukuran sama — dan di situlah rumus pendeknya berasal.`,
          }) +
          Catatan({
            jenis: 'baik',
            isi: `<b>Kenapa penting untuk OSN-K?</b> Soal 2025 nomor 17 sampai 19 memakainya tiga nomor berturut-turut, dan salah satunya berbentuk BENAR/SALAH — jenis soal yang gampang dijawab asal-asalan dan kebetulan benar.
              <br><br>Yang membuat modul ini menguntungkan: begitu kamu mengenali bentuknya, tidak ada hitungan sama sekali. Kamu cuma perlu melihat satu angka.`,
          }),
      }),

      /* ============ LAB 1 ============ */
      Lab({
        judul: 'Lab 1 · Susun kotaknya, lalu hitung tumpukannya',
        petunjuk: 'batang terpanjang adalah jawabannya',
        isi:
          `<p style="margin:0 0 12px">Tulis ukuran sisi tiap kotak. Perhatikan bahwa yang menentukan jawabannya cuma <b>batang terpanjang</b> — yaitu ukuran yang paling sering muncul.</p>` +
          Kontrol({
            ids,
            kolom: [{ id: 'sisi', label: 'ukuran sisi tiap kotak', nilai: S17.join(', '), lebar: true, jenis: 'teks' }],
            tombol: [{ id: 'go', teks: 'Susun kotaknya' },
                     { id: 'adu', teks: 'Adu dengan cara panjang', gaya: 'alt' }],
          }) +
          Wadah({ ids, id: 'viz', gaya: 'margin:14px 0' }) +
          Wadah({ ids, id: 'viz2', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan “Susun kotaknya” untuk mulai.' }),
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Kotak paling sedikit yang terlihat',
        isi: `dua kotak saling menolak <mark>hanya kalau sisinya sama</mark><br>
              <mark>jawaban = cacah ukuran yang paling sering muncul</mark><br>
              <span style="font-size:12.5px">berlaku untuk kotak KUBUS, dan syaratnya "lebih kecil", bukan "lebih kecil atau sama"</span>`,
        verifikasi: 'Diadu dengan DUA cara berbeda — pencocokan dua sisi dan mencoba SEMUA urutan penempatan — pada 400 susunan kotak acak. Nol beda. Sesuai teorema Dilworth 1950.',
        pesan: 'Susun dulu beberapa daftar kotak di Lab 1 — rumusnya lebih membekas kalau kamu sendiri yang melihat batang terpanjangnya menentukan.',
      }),

      /* ============ LAB 2 · TRIK ============ */
      Lab({
        judul: 'Lab 2 · Trik abaikan satu kolom — yang paling terasa curang',
        petunjuk: 'kolom ukuran boleh dilewati seluruhnya',
        isi:
          `<p style="margin:0 0 10px">Soal nomor 19 memberi tabel dua kolom: <b>panjang sisi</b> dan <b>banyaknya kotak</b>. Kolom pertama berisi 2, 3, 5, 8, 13, 21, 34 — deret Fibonacci.</p>
           <p style="margin:0 0 10px">Deret itu tidak berpengaruh apa-apa. Ganti dengan 1, 2, 3, 4, 5, 6, 7 dan jawabannya sama persis. Yang penting cuma bahwa ketujuh ukurannya <b>berbeda</b>.</p>
           <p style="margin:0 0 12px">Jadi tutup kolom pertama dengan jari. Lalu di kolom kedua, cari angka terbesar. Itu jawabannya. Kamu bahkan tidak perlu menjumlahkan 70.</p>` +
          `<div class="ctl">
            <button class="btn" id="${ids.i('tgo')}">Kerjakan soal nomor 19</button>
            <button class="btn alt" id="${ids.i('tumpan')}">Buktikan Fibonacci itu umpan</button>
          </div>` +
          Wadah({ ids, id: 'tviz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'tout', isi: 'Tekan “Kerjakan soal nomor 19” untuk mulai.' }),
      }),

      Catatan({
        jenis: 'baik',
        isi: `<b>Kenapa ukurannya boleh diabaikan.</b> Dua kotak hanya saling menolak kalau ukurannya sama. Berapa pun selisih ukuran yang berbeda, mereka tetap bisa disatukan — yang kecil masuk ke yang besar.
          <br><br>Jadi angka sisinya cuma menentukan <b>siapa masuk ke siapa</b>, bukan <b>berapa tumpukan yang dibutuhkan</b>. Yang menentukan jumlah tumpukan hanyalah berapa banyak kotak yang kembar.
          <br><br>Yang membuatnya terasa curang: soal memberi kamu 14 angka di tabel, dan kamu cuma melihat satu.
          <span class="tiny" style="display:block;margin-top:6px">✅ Diuji: ukuran sisinya diganti total sambil cacah tiap ukuran dijaga tetap, pada 600 susunan acak. Jawabannya tidak berubah sekali pun.</span>`,
      }),

      /* ============ LAB 3 · KALAU BUKAN KUBUS ============ */
      Lab({
        judul: 'Lab 3 · Kalau kotaknya balok, rumusnya gugur',
        petunjuk: 'di sinilah Dilworth yang sesungguhnya dipakai',
        isi:
          `<p style="margin:0 0 12px">Soal 2025 menyebut kotaknya <b>kubus</b>, dan itu bukan hiasan. Kalau kotaknya balok dengan panjang dan lebar terpisah, dua kotak bisa berbeda ukuran tapi tetap tidak saling muat — misalnya 2×5 dan 5×2.</p>
           <p style="margin:0 0 12px">Begitu itu terjadi, "cacah yang kembar" tidak lagi menjawab. Yang berlaku teorema Dilworth penuh: cari kelompok terbesar yang saling menolak.</p>` +
          Kontrol({
            ids,
            kolom: [{ id: 'balok', label: 'kotak balok — tulis panjang×lebar, pisahkan koma',
                      nilai: '2x5, 5x2, 3x3, 1x1, 4x6', lebar: true, jenis: 'teks' }],
            tombol: [{ id: 'bgo', teks: 'Bandingkan dua rumus' }],
          }) +
          Keluaran({ ids, id: 'bout', isi: 'Tekan “Bandingkan dua rumus” untuk mulai.' }),
      }),

      /* ============ KUMPULAN CARA CEPAT ============ */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Enam hal yang menutup semua bentuk soal kotak bersarang.',
        isi: Tab({
          ids, id: 'trik',
          daftar: [
            {
              kunci: 'c1', judul: 'Rumus inti',
              isi: `<p style="margin:0 0 10px">Untuk kotak kubus, dengan syarat "lebih kecil" yang tegas.</p>` +
                Rumus({
                  label: 'Kotak paling sedikit yang terlihat',
                  isi: `<mark>cacah ukuran yang paling sering muncul</mark><br>
                        <span style="font-size:12.5px">bukan banyaknya ukuran berbeda, bukan total kotak</span>`,
                  verifikasi: 'Diadu dengan pencocokan dua sisi DAN dengan mencoba semua urutan penempatan, pada 400 susunan acak.',
                }) +
                `<p class="tiny">Kalau semua kotak berbeda ukuran, jawabannya 1. Kalau semua sama, jawabannya sebanyak kotaknya.</p>`,
            },
            {
              kunci: 'c2', judul: 'Kenapa cukup segitu',
              isi: `<p style="margin:0 0 10px">Dua arah, dan dua-duanya perlu supaya jawabannya sah.</p>` +
                Rumus({
                  label: 'Tidak bisa kurang, dan tidak perlu lebih',
                  isi: `kotak sesama ukuran <mark>wajib</mark> di tumpukan berbeda → tidak bisa kurang<br>
                        ukuran berbeda <mark>selalu</mark> bisa disatukan → tidak perlu lebih`,
                  verifikasi: 'Susunannya dibangun sungguhan dan diperiksa: tiap tumpukan menaik tegas, semua kotak terpakai.',
                }) +
                `<p class="tiny">Di ujian, cukup tulis arah pertama. Tapi kalau soalnya minta penjelasan, arah kedua yang membuktikan angkanya tercapai.</p>`,
            },
            {
              kunci: 'c3', judul: 'Cara menyusunnya',
              isi: `<p style="margin:0 0 10px">Kalau soal minta susunannya, bukan cuma angkanya.</p>` +
                Rumus({
                  label: 'Bagi berputar',
                  isi: `urutkan ukurannya menaik<br>
                        <mark>taruh berputar</mark> ke tumpukan 1, 2, 3, … lalu kembali ke 1`,
                  verifikasi: 'Diuji pada 300 susunan acak: tiap tumpukan selalu menaik tegas dan semua kotak terpakai.',
                }) +
                `<p class="tiny">Cara ini otomatis benar karena kotak sesama ukuran pasti jatuh ke tumpukan berbeda.</p>`,
            },
            {
              kunci: 'c4', judul: 'Kalau boleh muat lebih dari satu',
              isi: `<p style="margin:0 0 10px">Ubah satu kata di soal, rumusnya berubah.</p>` +
                Rumus({
                  label: 'Tiap kotak boleh memuat L kotak',
                  isi: `<mark>bulatkan ke atas ( terbanyak ÷ L )</mark>, minimal 1`,
                  verifikasi: 'Diuji: soal nomor 17 jadi 2 tumpukan, dan soal nomor 19 jadi 10 tumpukan.',
                }) +
                `<p class="tiny">Untuk soal nomor 19 yang ukuran terbanyaknya 19 kotak, kalau tiap kotak boleh memuat dua, jawabannya jadi ${M.dwLebar(S19, 2)} tumpukan. Perhatikan pembulatan ke atas — sepuluh kotak kembar dengan L = 3 butuh 4 tumpukan, bukan 3.</p>`,
            },
            {
              kunci: 'c5', judul: 'Kalau syaratnya berubah',
              isi: `<p style="margin:0 0 10px">Bacalah kata "lebih kecil" baik-baik.</p>` +
                Rumus({
                  label: 'Dua bunyi yang berbeda jauh',
                  isi: `"lebih kecil" &nbsp;→&nbsp; <mark>cacah terbanyak</mark><br>
                        "lebih kecil ATAU SAMA" &nbsp;→&nbsp; <mark>selalu 1</mark>`,
                  verifikasi: 'Diuji: kalau ukuran sama boleh saling masuk, seluruh kotak jadi satu rantai.',
                }) +
                `<p class="tiny">Kalau kotak sama besar boleh dimasukkan, tidak ada lagi kotak yang saling menolak — semuanya jadi satu tumpukan.</p>`,
            },
            {
              kunci: 'c6', judul: 'Dilworth yang sesungguhnya',
              isi: `<p style="margin:0 0 10px">Untuk kotak balok, atau benda apa pun yang tidak selalu bisa dibandingkan.</p>` +
                Rumus({
                  label: 'Teorema Dilworth, 1950',
                  isi: `<mark>rantai paling sedikit = kelompok saling-menolak terbesar</mark>`,
                  verifikasi: 'Diuji pada 200 susunan kotak balok acak: rantai terkecil selalu sama dengan antirantai terbesar.',
                }) +
                `<p class="tiny">Rumus "cacah terbanyak" cuma kasus khusus dari ini, yaitu saat benda yang saling menolak pasti berukuran sama.</p>`,
            },
          ],
        }),
      }),

      /* ============ UJI SENDIRI ============ */
      Kartu({
        judul: 'Uji sendiri: rumus vs mencoba semua urutan',
        sub: 'Diuji pada daftar kotak ACAK, bukan cuma daftar di soal.',
        isi:
          `<div class="ctl">
            <button class="btn" id="${ids.i('ugo')}">Uji daftar di Lab 1</button>
            <button class="btn alt" id="${ids.i('uall')}">Uji 200 daftar acak</button>
          </div>` +
          Keluaran({ ids, id: 'uout', isi: 'Tekan salah satu tombol untuk mulai.' }),
      }),

      /* ============ PENYAMARAN ============ */
      Kartu({
        judul: 'Penyamaran: satu konsep, lima wajah',
        sub: 'Kenali bentuknya, bukan kata kuncinya.',
        isi: Tab({
          ids, id: 'samar',
          daftar: [
            {
              kunci: 'a', judul: 'A · Soal 2025',
              isi: `<p style="margin:0 0 10px">"Seluruh kotak, jika dibuka, akan terlihat di dalamnya maksimal satu kotak kardus saja."</p>` +
                Catatan({ isi: `<b>Kalimat inilah kuncinya.</b> Tanpa kalimat itu, kamu boleh menjejalkan semua kotak kecil ke dalam satu kotak besar dan jawabannya selalu 1. Kalimat itu yang memaksa susunannya jadi rantai lurus.` }),
            },
            {
              kunci: 'b', judul: 'B · Boneka Rusia',
              isi: `<p style="margin:0 0 10px">"Berapa set boneka matryoshka paling sedikit yang bisa dibuat dari sekumpulan boneka berbagai ukuran?"</p>` +
                Catatan({ isi: `<b>Soal yang sama, kostum berbeda.</b> Satu set boneka adalah satu rantai. Jawabannya cacah ukuran yang paling sering muncul.` }),
            },
            {
              kunci: 'c', judul: 'C · Antrean tinggi badan',
              isi: `<p style="margin:0 0 10px">"Siswa berbaris membentuk beberapa barisan. Dalam satu barisan, tinggi badan harus menaik tegas. Paling sedikit berapa barisan?"</p>` +
                Catatan({ isi: `<b>Rantai lagi.</b> Siswa bertinggi sama tidak bisa satu barisan, jadi jawabannya cacah tinggi yang paling sering muncul. Tidak perlu menyusun barisannya sama sekali.` }),
            },
            {
              kunci: 'd', judul: 'D · Kelompok saling menolak',
              isi: `<p style="margin:0 0 10px">"Berapa banyak kotak paling banyak yang bisa dipilih sehingga tidak ada satu pun yang muat ke dalam yang lain?"</p>` +
                Catatan({ isi: `<b>Ini sisi sebaliknya.</b> Yang ditanya antirantai terbesar. Menurut Dilworth angkanya sama persis dengan jawaban soal utama — jadi kalau kamu sudah menghitung satu, kamu dapat dua.` }),
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: `<p style="margin:0 0 10px">"Kotak kardus berbentuk balok dengan panjang dan lebar berbeda-beda. Berapa kotak paling sedikit yang terlihat?"</p>` +
                Catatan({ jenis: 'awas', isi: `<b>Rumus cacah-terbanyak GUGUR di sini.</b> Dua balok bisa berukuran berbeda tapi tetap tidak saling muat — misalnya 2×5 dan 5×2.
                  <br><br>Jawabannya bukan 1, melainkan 2. Dan untuk daftar yang lebih panjang, kamu harus benar-benar mencari kelompok saling-menolak terbesar.
                  <br><br>Penandanya di naskah soal cuma satu kata: <b>kubus</b>. Kalau kata itu ada, rumus pendeknya berlaku. Kalau tidak ada, periksa dulu.` }),
            },
          ],
        }),
      }),

      /* ============ BEDAH SOAL ============ */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2025 · soal 17–19',
        sub: 'Menyimpan Kotak Penyimpanan. Tiga nomor, salah satunya BENAR/SALAH.',
        isi: Kisi([
          KartuSoal({ ids, nomor: '2025 · soal 17', idKeluaran: 's1',
            pertanyaan: '10 kotak bersisi 1, 1, 2, 2, 2, 3, 3, 4, 6, 8.' }),
          KartuSoal({ ids, nomor: '2025 · soal 18', idKeluaran: 's2',
            pertanyaan: 'BENAR atau SALAH: kalau semua sisi berbeda, jawabannya satu kotak saja.' }),
          KartuSoal({ ids, nomor: '2025 · soal 19', idKeluaran: 's3',
            pertanyaan: '70 kotak, tabel tujuh ukuran dengan cacahnya masing-masing.' }),
        ]) + `<div class="ctl" style="margin-top:12px">
            <button class="btn" id="${ids.i('solve')}">Selesaikan ketiganya</button>
          </div>`,
      }),

      /* ============ KAPAN INI BUKAN ============ */
      Catatan({
        jenis: 'awas',
        isi: `<b>Kapan rumus pendek ini TIDAK berlaku.</b> Semua baris di bawah sudah diuji, bukan dikira-kira:` +
          Tabel({
            kiri: true,
            kepala: ['Bunyi soal', 'Yang terjadi'],
            baris: [
              ['kotak <b>kubus</b>, syarat "lebih kecil"', '✅ cacah ukuran yang paling sering muncul'],
              ['kotak <b>balok</b> atau berdimensi banyak', '❌ rumus kembar gugur — pakai Dilworth penuh'],
              ['syaratnya "lebih kecil <b>atau sama</b>"', '❌ jawabannya selalu 1'],
              ['boleh terlihat <b>lebih dari satu</b> kotak di dalam', '❌ bagi dengan berapa yang boleh, bulatkan ke atas'],
              ['ditanya <b>banyaknya susunan</b>, bukan tumpukan', '❌ itu kombinatorika, bukan modul ini'],
              ['ada kotak bersisi <b>nol</b> atau negatif', '❌ bukan kotak — daftarnya tidak sah'],
            ],
          }) +
          `<span style="display:block;margin-top:10px">Baris kedua yang paling berbahaya, karena gambarnya terlihat mirip. Untuk kotak balok, rumus kembar meleset pada 365 dari 400 susunan acak yang diuji.</span>`,
      }),

      Catatan({
        isi: `<b>Verifikasi 30 detik sebelum menulis jawaban.</b> Dua pemeriksaan, dan yang pertama nyaris selalu cukup.
          <br><br>Pertama, <b>periksa dua batas</b>. Jawabanmu tidak boleh kurang dari 1, dan tidak boleh lebih dari banyaknya kotak yang ukurannya paling sering muncul. Kalau jawabanmu sama dengan total kotak, berarti semua kotak berukuran sama — periksa lagi daftarnya.
          <br><br>Kedua, <b>susun satu tumpukan dengan tangan</b>. Ambil satu kotak dari tiap ukuran berbeda, urutkan, lalu masukkan berurutan. Kalau itu berhasil, kamu sudah membuktikan sisanya bisa disusun dengan cara yang sama.`,
      }),

    ].join('');

    /* ================= PERILAKU ================= */

    const bacaBalok = (teks) => String(teks).split(/,/)
      .map((s) => s.trim().split(/[x×*]/).map((x) => parseInt(x.trim(), 10)))
      .filter((p) => p.length >= 2 && p.every((v) => Number.isFinite(v) && v > 0));

    const tolak = (sisi) => {
      const nol = sisi.filter((x) => x === 0).length;
      const neg = sisi.filter((x) => x < 0).length;
      return `${merah('Daftarnya tidak sah.')}

${neg ? '  ada ' + neg + ' kotak bersisi negatif\n' : ''}${nol ? '  ada ' + nol + ' kotak bersisi NOL\n' : ''}
${redup('Kotak bersisi nol atau negatif bukan kotak. Angka itu tidak boleh dilewati begitu saja —')}
${redup('kalau disaring diam-diam, jawabannya jadi angka yang kelihatan masuk akal padahal salah.')}`;
    };

    /* ---- Lab 1 ---- */
    ids.klik('go', () => {
      bukaRumus(ids, 'rumus');
      const sisi = bacaSisi(ids.s('sisi'));
      if (!sisi.length) {
        ids.q('viz').innerHTML = ''; ids.q('viz2').innerHTML = '';
        ids.tulis('out', 'Tulis ukuran sisinya dulu, dipisahkan koma. Misalnya 1, 1, 2, 3.');
        return;
      }
      const jawab = M.dwMin(sisi);
      if (jawab === null) {
        ids.q('viz').innerHTML = ''; ids.q('viz2').innerHTML = '';
        ids.tulis('out', tolak(sisi));
        return;
      }
      const cacah = M.dwCacah(sisi);
      const rantai = M.dwSusun(sisi);
      const juara = cacah.filter((x) => x.banyak === jawab);
      ids.q('viz').innerHTML = gambarCacah(sisi);
      ids.q('viz2').innerHTML = gambarRantai(rantai);
      ids.tulis('out',
`${sisi.length} kotak, ${cacah.length} ukuran berbeda.

${cacah.map((x) => `  sisi ${String(x.ukuran).padStart(3)} : ${String(x.banyak).padStart(2)} kotak${
  x.banyak === jawab ? '  ' + merah('← terbanyak') : ''}`).join('\n')}

Ukuran yang paling sering muncul: ${juara.map((x) => 'sisi ' + x.ukuran).join(', ')}, sebanyak ${jawab}.
${redup('Kotak sesama ukuran tidak bisa saling masuk, jadi masing-masing wajib di tumpukan berbeda.')}

Susunannya (dibaca dari terkecil):
${rantai.map((ch, i) => `  tumpukan ${i + 1} : ${ch.join(' ⊂ ')}`).join('\n')}

  jawaban = ${hijau(angka(jawab))} kotak terlihat dari luar`);
    });

    ids.klik('adu', () => {
      const sisi = bacaSisi(ids.s('sisi'));
      if (!sisi.length) { ids.tulis('out', 'Tulis ukuran sisinya dulu.'); return; }
      const jawab = M.dwMin(sisi);
      if (jawab === null) { ids.tulis('out', tolak(sisi)); return; }
      const umum = M.dwMinUmum(sisi.map((x) => [x]));
      const anti = M.dwAntirantai(sisi.map((x) => [x]));
      ids.tulis('out',
`CARA 1 — rumus pendek
  cacah ukuran yang paling sering muncul = ${hijau(angka(jawab))}
  ${redup('satu pandangan ke tabel')}

CARA 2 — pencocokan dua sisi (cara umum, tanpa mengandalkan bentuk kubus)
  ${sisi.length} kotak − pasangan terbanyak = ${hijau(angka(umum))}

CARA 3 — kelompok saling-menolak terbesar (teorema Dilworth)
  ${anti === null ? redup('(dilewati, kotaknya terlalu banyak)')
    : hijau(angka(anti.ukuran)) + '   ' + redup('isinya: ' + anti.isi.map((x) => x[0]).join(', '))}

${jawab === umum && (anti === null || anti.ukuran === jawab)
  ? hijau('✓ SEMUA CARA SAMA') + '\n' + redup('Rumus pendek itu memang kasus khusus teorema Dilworth.')
  : merah('✗ ada yang beda')}`);
    });

    /* ---- Lab 2 · trik ---- */
    ids.klik('tgo', () => {
      const jawab = M.dwMin(S19);
      const terbanyak = TABEL19.reduce((a, b) => b[1] > a[1] ? b : a);
      ids.q('tviz').innerHTML = gambarCacah(S19);
      ids.tulis('tout',
`Tabel soal nomor 19:

  panjang sisi │ banyaknya kotak
  ${'─'.repeat(13)}┼${'─'.repeat(18)}
${TABEL19.map(([u, c]) => `      ${redup(String(u).padStart(6))} │ ${String(c).padStart(6)}${
  c === jawab ? '  ' + merah('← terbesar') : ''}`).join('\n')}

Kolom kiri ${redup('diabaikan seluruhnya')} — cuma perlu tahu ketujuhnya berbeda.
Kolom kanan: ambil yang terbesar.

  jawaban = ${hijau(angka(jawab))} kotak terlihat dari luar
  ${redup('sisi ' + terbanyak[0] + ' ada ' + terbanyak[1] + ' buah, dan sebanyak itu pula tumpukannya')}

${redup('Kamu tidak perlu menjumlahkan 70. Tidak perlu menyusun satu kotak pun.')}
${redup('Dari 14 angka di tabel, kamu melihat satu.')}`);
    });

    ids.klik('tumpan', () => {
      const palsu = [[1, 5], [2, 12], [3, 19], [4, 4], [5, 15], [6, 7], [7, 8]];
      const sPalsu = palsu.flatMap(([u, c]) => Array(c).fill(u));
      let berubah = 0, coba = 0;
      for (let p = 0; p < 300; p++) {
        const k = 1 + Math.floor(Math.random() * 6);
        const cacah = [...Array(k)].map(() => 1 + Math.floor(Math.random() * 6));
        const A = [], B = [];
        cacah.forEach((c, i) => {
          for (let j = 0; j < c; j++) { A.push(1 + i * 3); B.push(1000 + i * 77); }
        });
        coba++;
        if (M.dwMin(A) !== M.dwMin(B)) berubah++;
      }
      ids.q('tviz').innerHTML = '';
      ids.tulis('tout',
`Ukuran asli  : ${TABEL19.map((x) => x[0]).join(', ')}   ${redup('(deret Fibonacci)')}
Ukuran ganti : ${palsu.map((x) => x[0]).join(', ')}   ${redup('(angka biasa)')}
Cacahnya sama persis: ${TABEL19.map((x) => x[1]).join(', ')}

  jawaban dengan ukuran asli  = ${hijau(angka(M.dwMin(S19)))}
  jawaban dengan ukuran ganti = ${hijau(angka(M.dwMin(sPalsu)))}

${M.dwMin(S19) === M.dwMin(sPalsu) ? hijau('✓ SAMA PERSIS') : merah('✗ beda')}

Diuji pada ${coba} daftar acak: ukuran sisinya diganti total,
cacah tiap ukuran dijaga tetap.
  jawaban berubah pada ${berubah === 0 ? hijau('0') : merah(berubah)} daftar

${redup('Angka sisinya cuma menentukan siapa masuk ke siapa, bukan berapa tumpukan yang perlu.')}`);
    });

    /* ---- Lab 3 · balok ---- */
    ids.klik('bgo', () => {
      const kotak = bacaBalok(ids.s('balok'));
      if (!kotak.length) {
        ids.tulis('bout', 'Tulis kotaknya dulu, misalnya 2x5, 5x2, 3x3.');
        return;
      }
      const benar = M.dwMinUmum(kotak);
      const c = {};
      kotak.forEach((k) => { const s = k.join('×'); c[s] = (c[s] || 0) + 1; });
      const kembar = Math.max(...Object.values(c));
      const anti = M.dwAntirantai(kotak);
      ids.tulis('bout',
`${kotak.length} kotak balok: ${kotak.map((k) => k.join('×')).join(', ')}

RUMUS KUBUS — cacah yang kembar
  ${kembar === benar ? hijau(angka(kembar)) : merah(angka(kembar))}

DILWORTH PENUH — kelompok saling-menolak terbesar
  ${hijau(angka(benar))}${anti && anti.ukuran ? '   ' + redup('contohnya: ' + anti.isi.map((k) => k.join('×')).join(', ')) : ''}

${kembar === benar
  ? redup('Kali ini kebetulan sama. Itu tidak berarti rumus kubus boleh dipercaya di sini.')
  : merah('✗ RUMUS KUBUS MELESET ' + (benar - kembar)) + '\n'
    + redup('Ada kotak berukuran berbeda yang tetap tidak saling muat — misalnya 2×5 dan 5×2.')}

${redup('Penandanya di naskah soal cuma satu kata: kubus. Kalau kata itu tidak ada, periksa dulu.')}`);
    });

    /* ---- Uji sendiri ---- */
    ids.klik('ugo', () => {
      const sisi = bacaSisi(ids.s('sisi'));
      if (!sisi.length) { ids.tulis('uout', 'Tulis daftar kotaknya dulu di Lab 1.'); return; }
      const jawab = M.dwMin(sisi);
      if (jawab === null) { ids.tulis('uout', tolak(sisi)); return; }
      const rantai = M.dwSusun(sisi);
      const menaik = rantai.every((x) => x.every((v, i) => i === 0 || x[i - 1] < v));
      const lengkap = JSON.stringify(rantai.flat().slice().sort((a, b) => a - b))
        === JSON.stringify(sisi.slice().sort((a, b) => a - b));
      ids.tulis('uout',
`Daftar: ${sisi.join(', ')}

  rumus pendek                  : ${hijau(angka(jawab))}
  pencocokan dua sisi           : ${hijau(angka(M.dwMinUmum(sisi.map((x) => [x]))))}
  banyaknya tumpukan yang disusun: ${hijau(rantai.length)}
  tiap tumpukan menaik tegas    : ${menaik ? hijau('ya') : merah('TIDAK')}
  semua kotak terpakai          : ${lengkap ? hijau('ya') : merah('TIDAK')}

${jawab === M.dwMinUmum(sisi.map((x) => [x])) && rantai.length === jawab && menaik && lengkap
  ? hijau('✓ SEMUA PEMERIKSAAN LOLOS') : merah('✗ ada yang tidak cocok')}`);
    });

    ids.klik('uall', () => {
      let uji = 0, beda = 0, tolakan = 0;
      let ujiBalok = 0, gugurBalok = 0;
      for (let putar = 0; putar < 200; putar++) {
        const n = 1 + Math.floor(Math.random() * 8);
        const sisi = [...Array(n)].map(() => Math.floor(Math.random() * 6));
        const jawab = M.dwMin(sisi);
        if (jawab === null) { tolakan++; continue; }
        uji++;
        if (jawab !== M.dwMinUmum(sisi.map((x) => [x]))) beda++;
        /* balok: rumus kubus harus sering gugur */
        const balok = [...Array(2 + Math.floor(Math.random() * 4))]
          .map(() => [1 + Math.floor(Math.random() * 4), 1 + Math.floor(Math.random() * 4)]);
        const cb = {};
        balok.forEach((k) => { const s = k.join(','); cb[s] = (cb[s] || 0) + 1; });
        ujiBalok++;
        if (Math.max(...Object.values(cb)) !== M.dwMinUmum(balok)) gugurBalok++;
      }
      ids.tulis('uout',
`Menguji dengan daftar ACAK — ukuran kotaknya dibangkitkan sendiri,
termasuk kotak bersisi nol yang seharusnya ditolak.

  rumus pendek diadu dengan pencocokan dua sisi
    ${beda === 0 ? hijau(uji + ' / ' + uji + ' cocok') : merah((uji - beda) + ' / ' + uji)}

  daftar tidak sah yang ditolak dengan benar
    ${hijau(tolakan)}

  kotak BALOK: rumus kubus meleset
    ${merah(gugurBalok + ' dari ' + ujiBalok)}   ${redup('memang seharusnya meleset')}

${beda === 0
  ? hijau('✓ TIDAK ADA YANG MELESET') + '\n' + redup('Rumusnya berlaku umum untuk kotak kubus, bukan cuma daftar di soal 2025.')
  : merah('✗ ada yang meleset')}`);
    });

    /* ---- Bedah soal ---- */
    ids.klik('solve', () => {
      const j17 = M.dwMin(S17);
      const c17 = M.dwCacah(S17);
      const t17 = c17.filter((x) => x.banyak === j17);
      ids.tulis('s1',
`Sisi: ${S17.join(', ')}

${c17.map((x) => `  sisi ${x.ukuran} : ${x.banyak} kotak${x.banyak === j17 ? '  ' + merah('← terbanyak') : ''}`).join('\n')}

  jawaban = ${hijau(angka(j17))}

${redup('Ketiga kotak bersisi ' + t17[0].ukuran + ' tidak bisa saling masuk, jadi wajib di tumpukan berbeda.')}
${redup('Susunannya: ' + M.dwSusun(S17).map((ch) => ch.join(' ⊂ ')).join('  |  '))}`);

      let bukanSatu = 0;
      for (let p = 0; p < 300; p++) {
        const n = 1 + Math.floor(Math.random() * 9), pakai = new Set();
        while (pakai.size < n) pakai.add(1 + Math.floor(Math.random() * 200));
        if (M.dwMin([...pakai]) !== 1) bukanSatu++;
      }
      ids.tulis('s2',
`Kalau semua sisi berbeda, tidak ada dua kotak yang saling menolak.
Jadi cacah terbanyaknya ${hijau('1')}, dan semuanya muat jadi satu tumpukan.

  jawaban = ${hijau('BENAR')}

${redup('Diuji pada 300 daftar acak bersisi beda semua: ' + bukanSatu + ' yang jawabannya bukan 1.')}
${redup('Contoh: 1, 2, 3, 4, 5 tersusun jadi 1 ⊂ 2 ⊂ 3 ⊂ 4 ⊂ 5 — satu tumpukan.')}`);

      const j19 = M.dwMin(S19);
      const t19 = TABEL19.filter((x) => x[1] === j19);
      ids.tulis('s3',
`Tujuh ukuran, total ${S19.length} kotak.

${TABEL19.map(([u, c]) => `  sisi ${String(u).padStart(2)} : ${String(c).padStart(2)} kotak${
  c === j19 ? '  ' + merah('← terbanyak') : ''}`).join('\n')}

  jawaban = ${hijau(angka(j19))}

${redup('Ukurannya 2, 3, 5, 8, 13, 21, 34 — deret Fibonacci, dan itu umpan.')}
${redup('Diganti 1 sampai 7 pun jawabannya tetap ' + angka(j19) + '. Yang penting cuma ketujuhnya berbeda.')}
${redup('Kamu juga tidak perlu menjumlahkan sampai ' + S19.length + '.')}`);
    });

    pasangTab('trik');
    pasangTab('samar');
  },
};
