/* ============================================================
   MODUL 06 — DOUBLING PADA ANGKA (MAI)
   Semua rumus di berkas ini dibuktikan oleh
   verify/06-mai.py — jangan diubah tanpa menjalankannya lagi.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Kode, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

/* --- jam 66 posisi (SVG, tidak bergantung ukuran layar) --- */
function gambarJam(sisa) {
  const R = 120, cx = 150, cy = 150;
  let s = `<svg viewBox="0 0 300 300" width="100%" role="img" aria-label="Jam 66 posisi">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--garis-tebal)"
        stroke-width="2" stroke-dasharray="3 4"/>`;
  for (let i = 0; i < 66; i++) {
    const a = -Math.PI / 2 + 2 * Math.PI * i / 66;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    const aktif = i === sisa;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${aktif ? 11 : 4}"
          fill="${aktif ? 'var(--stabilo)' : 'var(--putih)'}"
          stroke="${aktif ? 'var(--tinta)' : 'var(--garis-tebal)'}" stroke-width="${aktif ? 2.5 : 1.5}"/>`;
    if (aktif || i % 11 === 0) {
      const rl = R + (aktif ? 26 : 18);
      s += `<text x="${(cx + rl * Math.cos(a)).toFixed(1)}" y="${(cy + rl * Math.sin(a) + 4).toFixed(1)}"
            text-anchor="middle" style="font-family:var(--mono);font-size:${aktif ? 13 : 10}px;
            font-weight:${aktif ? 700 : 500};fill:${aktif ? 'var(--merah)' : 'var(--tinta-3)'}">${i}</text>`;
    }
  }
  const a = -Math.PI / 2 + 2 * Math.PI * sisa / 66;
  s += `<line x1="${cx}" y1="${cy}" x2="${(cx + (R - 14) * Math.cos(a)).toFixed(1)}"
        y2="${(cy + (R - 14) * Math.sin(a)).toFixed(1)}" stroke="var(--merah)" stroke-width="3"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="5" fill="var(--merah)"/>`;
  s += `<text x="${cx}" y="${cy + 34}" text-anchor="middle"
        style="font-family:var(--mono);font-size:11px;fill:var(--tinta-2)">jarum berhenti di</text>`;
  s += `<text x="${cx}" y="${cy + 58}" text-anchor="middle"
        style="font-family:var(--disp);font-size:26px;font-weight:700;fill:var(--tinta)">${sisa}</text>`;
  return s + '</svg>';
}

/* --- pohon pemanggilan (SVG) --- */
function gambarPohon(x, y, z) {
  const W = 640, tinggi = 46, atas = 26;
  const H = atas + y * tinggi + 40;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Pohon pemanggilan MAI">`;
  for (let d = 0; d <= y; d++) {
    const n = Math.pow(2, d), yy = atas + d * tinggi;
    for (let i = 0; i < n; i++) {
      const xx = W * (i + 0.5) / n;
      if (d > 0) {
        const induk = W * (Math.floor(i / 2) + 0.5) / Math.pow(2, d - 1);
        s += `<line x1="${induk.toFixed(1)}" y1="${(yy - tinggi + 9).toFixed(1)}"
              x2="${xx.toFixed(1)}" y2="${(yy - 9).toFixed(1)}"
              stroke="var(--garis-tebal)" stroke-width="1.5"/>`;
      }
      const dasar = d === y;
      const r = n > 16 ? 4 : (dasar ? 9 : 7);
      s += `<circle cx="${xx.toFixed(1)}" cy="${yy}" r="${r}"
            fill="${dasar ? 'var(--stabilo)' : 'var(--putih)'}"
            stroke="var(--tinta)" stroke-width="${dasar ? 2.5 : 1.5}"/>`;
    }
    s += `<text x="4" y="${yy + 4}" style="font-family:var(--mono);font-size:10px;
          fill:var(--tinta-3)">y=${y - d}</text>`;
  }
  s += `<text x="${W / 2}" y="${H - 12}" text-anchor="middle"
        style="font-family:var(--mono);font-size:11px;fill:var(--tinta-2)">
        ${angka(Math.pow(2, y))} pemanggilan dasar (kuning) = 2^${y}</text>`;
  return s + '</svg>';
}

export default {
  id: 'mai', n: '06', kelompok: 'Rekursi',
  judul: 'Doubling pada Angka (MAI)',
  lede: 'Fungsi yang memanggil dirinya sendiri dua kali, bersarang. Soal OSN-K 2026 memakai y = 666.666 — mustahil ditelusuri satu per satu. Tapi ada rumus langsungnya, dan angka 666.666 itu ternyata bukan asal pilih.',
  lencana: ['<span class="chip r">2026 · soal 38–40</span>', '<span class="chip v">Diuji semua x, z = 0..66</span>'],

  kartu: [
    { q: 'return MAI(MAI(x, y-1, z), y-1, z);', a: 'doubling', why: 'Memanggil diri sendiri dua kali bersarang — efeknya berlipat dua tiap tingkat, jadi 2ʸ.' },
    { q: '“Berapa hasilnya kalau y = 666.666?”', a: 'doubling', why: 'Jangan ditelusuri. Cari rumus langsungnya, lalu perkecil y dengan sisa bagi.' },
  ],
  kamus: [
    ['f(f(x, y−1), y−1) — bersarang dua kali', 'Doubling pada angka — efeknya jadi 2ʸ'],
    ['“y = 666.666” atau angka raksasa lain', 'Cari siklusnya, perkecil pakai sisa bagi'],
  ],

  bangun(root, { ids, pasangTab }) {
    const I = (t) => ids.i(t);

    root.innerHTML = [

      /* ===== APA ITU ===== */
      Kartu({
        judul: 'Apa itu Doubling pada Angka?',
        isi: `
        <p style="margin:10px 0">Di Modul 05 kamu lihat doubling pada <b>teks</b> — hasilnya makin panjang tiap tingkat. Sekarang bentuk yang sama muncul pada <b>angka</b>, dan efeknya lebih halus: bukan panjangnya yang berlipat, tapi <b>seberapa besar perubahannya</b>.</p>
        <p style="margin:10px 0">Kuncinya ada di satu baris:</p>` +
        Kode(`<span class="kw">return</span> <span class="fn">MAI</span>(<span class="fn">MAI</span>(x, y-1, z), y-1, z);`, 'margin:12px 0') +
        `<p style="margin:10px 0">Perhatikan — <code>MAI</code> muncul <b>dua kali</b>, dan yang di dalam <b>bersarang</b> di dalam yang luar. Hasil panggilan dalam langsung jadi bahan panggilan luar.</p>
        <p style="margin:10px 0">Artinya: apa pun yang dilakukan tingkat y−1, sekarang dikerjakan <b>dua kali berturut-turut</b>. Naik satu tingkat lagi, jadi dua kali lipatnya lagi.</p>` +
        Catatan({ jenis: 'baik', isi: `<b>Coba runut pelan-pelan.</b> Fungsi dasarnya cuma menambah z.
        <br><br>Tingkat 0 menambah z <b>satu</b> kali.
        <br>Tingkat 1 menjalankan tingkat 0 dua kali → menambah z <b>dua</b> kali.
        <br>Tingkat 2 menjalankan tingkat 1 dua kali → menambah z <b>empat</b> kali.
        <br>Tingkat 3 → <b>delapan</b> kali.
        <br><br>Polanya jelas: tingkat y menambah z sebanyak <b>2ʸ</b> kali. Itu saja isi seluruh fungsi ini.` }) +
        `<p style="margin:14px 0 10px">Nah, di sinilah masalahnya. Soal OSN-K 2026 menanyakan hasil untuk <b>y = 666.666</b>. Kalau kamu telusuri, itu berarti 2<sup>666.666</sup> pemanggilan — angka dengan 200.000 digit lebih. Komputer tercepat pun tidak akan selesai sampai alam semesta berakhir.</p>
        <p style="margin:10px 0"><b>Tapi jawabannya bisa didapat dalam sepuluh detik di kertas.</b> Caranya ada di Lab 2.</p>` +
        Catatan({ isi: `<b>Kenapa angkanya 67?</b> Fungsi ini selalu mengambil sisa bagi 67, dan itu bukan kebetulan. <b>67 adalah bilangan prima</b> — sifat itu yang membuat pola pangkat duanya rapi dan bisa diprediksi.
        <br><br>Kalau pembaginya bukan prima, polanya jadi berantakan dan soal semacam ini tidak akan punya jawaban yang rapi.` }) +
        `<h4 style="margin:18px 0 6px;font-size:14px">Kenapa penting untuk OSN-K?</h4>
        <p class="tiny" style="margin:0">Karena bentuk "panggil diri sendiri dua kali bersarang" ini punya ciri yang sangat khas dan gampang dikenali. Di OSN-K 2026 dia mengisi satu grup penuh — soal 38, 39, dan 40.</p>`,
      }),

      /* ===== LAB 1 ===== */
      Lab({
        judul: 'Lab 1 · Lihat efeknya berlipat', petunjuk: 'bandingkan tiap tingkat',
        isi:
          Kode(`<span class="kw">int</span> <span class="fn">MAI</span>(<span class="kw">int</span> x, <span class="kw">int</span> y, <span class="kw">int</span> z) {
  <span class="kw">if</span> (y == 0) {
    <span class="kw">return</span> (x + z) % 67;
  }
  <span class="kw">return</span> <span class="fn">MAI</span>(<span class="fn">MAI</span>(x, y-1, z), y-1, z);
}`, 'margin-bottom:14px') +
          Kontrol({
            ids, kolom: [
              { id: 'x', label: 'x', nilai: 0, min: 0, maks: 66 },
              { id: 'z', label: 'z', nilai: 1, min: 0, maks: 66 },
            ],
            tombol: [{ id: 'go', teks: 'Telusuri tingkat 0 sampai 8' }],
          }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan “Telusuri” untuk mulai.' }),
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Rumus langsungnya',
        isi: `MAI(x, y, z) = <mark>(x + 2ʸ × z) mod 67</mark>`,
        verifikasi: 'Sudah diuji untuk SEMUA x dan z dari 0 sampai 66, dengan y = 0 sampai 8',
        pesan: 'Telusuri dulu di Lab 1 — polanya lebih nempel kalau kamu yang lihat sendiri.',
      }),

      /* ===== LAB 2: JAM 66 ===== */
      Lab({
        judul: 'Lab 2 · Jam 66 — yang paling terasa curang', petunjuk: 'y sebesar apa pun langsung mengecil',
        isi:
          `<p style="margin:0 0 12px">Rumusnya sudah dapat, tapi masih ada masalah: <b>2<sup>666.666</sup></b> itu angka raksasa. Bagaimana cara mengambil sisa baginya dengan 67?</p>
           <p style="margin:0 0 12px">Ternyata pangkat dua kalau di-mod 67 itu <b>berputar</b>, seperti jarum jam. Bedanya, jam ini punya <b>66 posisi</b>, bukan 12.</p>
           <p style="margin:0 0 14px">Jadi kamu <b>tidak perlu tahu 2<sup>666.666</sup></b>. Cukup cari <b>666.666 dibagi 66 sisa berapa</b> — itu saja.</p>` +
          Kontrol({
            ids, kolom: [{ id: 'jy', label: 'y (boleh sebesar apa pun)', nilai: 666666, min: 0, lebar: true }],
            tombol: [{ id: 'jgo', teks: 'Putar jarum' }],
          }) +
          Wadah({ ids, id: 'jam', gaya: 'max-width:320px;margin:8px auto' }) +
          Keluaran({ ids, id: 'jout' }),
      }),

      Catatan({ jenis: 'baik', isi: `<b>Kenapa jamnya punya 66 posisi?</b> Karena 67 itu bilangan prima. Ada aturan dalam matematika yang bilang: kalau p prima, maka pangkat apa pun akan kembali ke 1 setelah p − 1 langkah. Di sini p = 67, jadi 67 − 1 = <b>66</b>.
        <br><br>Untuk angka 2 dan pembagi 67, 66 itu bahkan jumlah putaran <b>terpendek</b> — sebelum itu tidak pernah kembali ke 1. Jadi 2 menyapu <b>semua</b> sisa dari 1 sampai 66 sebelum mengulang.
        <span class="tiny" style="display:block;margin-top:6px">✅ Sudah diuji: 2ʸ mod 67 memang menghasilkan seluruh nilai 1 sampai 66, lalu mengulang.</span>` }),

      Catatan({ jenis: 'awas', isi: `<b>Dan ini yang bikin kaget.</b> Coba bagi 666.666 dengan 66:
        <br><br><b>666.666 ÷ 66 = 10.101 pas, tanpa sisa.</b>
        <br><br>Artinya jarum jamnya berhenti tepat di posisi <b>0</b>, dan 2<sup>666.666</sup> mod 67 = <b>1</b>. Angka raksasa itu langsung lenyap.
        <br><br>Ini jelas bukan kebetulan. Penyusun soal sengaja memilih angka yang habis dibagi 66, supaya siswa yang paham triknya bisa menjawab dalam hitungan detik — sementara yang tidak paham akan mencoba menelusuri dan kehabisan waktu.` }),

      /* ===== LAB 3: POHON ===== */
      Lab({
        judul: 'Lab 3 · Pohon pemanggilan', petunjuk: 'kenapa jumlahnya 2ʸ',
        isi:
          `<p style="margin:0 0 12px">Tiap pemanggilan bercabang jadi <b>dua</b>. Jadi tingkat demi tingkat jumlahnya berlipat: 1, 2, 4, 8, 16… Di dasar pohon ada tepat <b>2ʸ</b> pemanggilan.</p>` +
          Kontrol({
            ids, kolom: [{ id: 'py', label: 'y', nilai: 4, min: 0, maks: 7 }],
            tombol: [{ id: 'pgo', teks: 'Gambar pohon' }],
          }) +
          Wadah({ ids, id: 'pohon', gaya: 'margin:10px 0' }) +
          Keluaran({ ids, id: 'pout' }),
      }),

      /* ===== CARA CEPAT ===== */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Semuanya sudah diadu dengan simulasi rekursif sungguhan.',
        isi: Tab({
          ids, id: 'trik', daftar: [
            {
              kunci: 'k1', judul: 'Perkecil y',
              isi: `<p style="margin:0 0 10px">Ini senjata utamanya. Berapa pun besarnya y, langsung mengecil jadi angka di bawah 66.</p>` +
                Rumus({
                  label: 'Tiga langkah, selesai',
                  isi: `1. hitung <mark>y mod 66</mark>  &nbsp;→ misalnya hasilnya r<br>
                        2. hitung <mark>2ʳ mod 67</mark>  &nbsp;→ misalnya hasilnya a<br>
                        3. jawabannya <mark>(x + a × z) mod 67</mark>`,
                  verifikasi: 'Sudah diuji y = 0 sampai 300, dan pada y raksasa',
                }) +
                `<div class="out" style="margin-top:12px">Contoh soal 38: MAI(13, 666666, 37)

  666.666 ÷ 66 = 10.101 pas   → r = 0
  2⁰ mod 67 = 1               → a = 1
  (13 + 1 × 37) mod 67 = ${hijau('50')}

${redup('Tiga baris. Tanpa menelusuri satu pun pemanggilan.')}</div>` +
                Catatan({ isi: '<b>Kalau r-nya tidak nol?</b> Hitung 2ʳ dengan mengalikan dua berulang, tapi <b>selalu ambil sisa bagi 67 di tiap langkah</b> supaya angkanya tidak membengkak. Misal 2⁸: 2, 4, 8, 16, 32, 64, lalu 128 mod 67 = 61, lalu 122 mod 67 = 55.' }),
            },
            {
              kunci: 'k2', judul: 'Menghitung pemanggilan',
              isi: `<p style="margin:0 0 10px">Kalau soal bertanya "berapa kali suatu pemanggilan terjadi", kamu perlu tahu isi dasarnya.</p>` +
                Rumus({
                  label: 'Urutan pemanggilan dasar',
                  isi: `total pemanggilan dasar = <mark>2ʸ</mark><br><br>
                        pemanggilan dasar ke-k punya argumen pertama<br>
                        <mark>(x + k × z) mod 67</mark> &nbsp; untuk k = 0, 1, 2, …, 2ʸ−1`,
                  verifikasi: 'Sudah diuji pada banyak kombinasi x, y, z',
                }) +
                `<p class="tiny">Masuk akal kalau dipikir: tiap pemanggilan dasar menambah z, jadi argumen berikutnya selalu z lebih besar dari sebelumnya. Tinggal dihitung mundur sampai bertemu angka yang dicari.</p>` +
                Kontrol({
                  ids, kolom: [
                    { id: 'hx', label: 'x', nilai: 0, min: 0, maks: 66 },
                    { id: 'hy', label: 'y', nilai: 10, min: 0, maks: 20 },
                    { id: 'hz', label: 'z', nilai: 2, min: 0, maks: 66 },
                    { id: 'ha', label: 'cari argumen', nilai: 0, min: 0, maks: 66 }],
                  tombol: [{ id: 'hgo', teks: 'Hitung' }],
                }) +
                Keluaran({ ids, id: 'hout' }),
            },
            {
              kunci: 'k3', judul: 'Menghitung tripel',
              isi: `<p style="margin:0 0 10px">Soal 39 menanyakan ada berapa tripel (x, y, z) dari 0 sampai 200 yang hasilnya 0. Kelihatannya harus dicoba 201³ = lebih dari 8 juta kombinasi.</p>` +
                `<p style="margin:0 0 10px"><b>Tapi ada jalan pintas yang bikin senyum.</b> Perhatikan angka 201:</p>` +
                Rumus({
                  label: 'Kuncinya',
                  isi: `<mark>201 = 3 × 67 tepat</mark><br><br>
                        Jadi di antara 0 sampai 200, tiap sisa-bagi-67<br>
                        muncul <mark>persis 3 kali</mark>`,
                  verifikasi: 'Sudah diuji',
                }) +
                `<p style="margin:10px 0">Akibatnya begini. Untuk pasangan (y, z) <b>apa pun</b>, nilai x harus punya satu sisa tertentu — dan sisa itu selalu tersedia dalam 3 pilihan.</p>
                 <div class="out">Jawaban = 201 × 201 × 3 = ${hijau(angka(201 * 201 * 3))}

${redup('Perhatikan: kamu bahkan tidak perlu tahu berapa 2^y sama sekali.\nBerapa pun nilainya, x-nya tetap punya 3 pilihan.')}</div>` +
                Catatan({ jenis: 'awas', isi: '<b>Hati-hati kalau batasnya berubah.</b> Trik ini jalan mulus karena 201 kebetulan kelipatan 67. Kalau soal memakai batas lain, misalnya 0 sampai 150, tiap sisa tidak lagi muncul sama banyak — harus dihitung lebih teliti.' }),
            },
            {
              kunci: 'k4', judul: 'Cek instan',
              isi: `<p style="margin:0 0 10px">Empat hal yang bisa langsung kamu pakai untuk membuang pilihan jawaban yang salah:</p>` +
                Rumus({
                  isi: `1. hasilnya <mark>selalu antara 0 dan 66</mark> — kalau ada pilihan di luar itu, coret<br><br>
                        2. kalau <mark>z = 0</mark>, hasilnya selalu x mod 67 berapa pun y-nya<br><br>
                        3. kalau <mark>y kelipatan 66</mark>, hasilnya sama dengan y = 0<br><br>
                        4. y hanya berpengaruh lewat <mark>sisa baginya dengan 66</mark>`,
                  verifikasi: 'Sudah diuji',
                }) +
                `<p class="tiny">Sifat nomor 3 itu yang dipakai soal 38. Begitu kamu lihat angka besar, langsung cek dulu: habis dibagi 66 atau tidak?</p>`,
            },
            {
              kunci: 'k5', judul: 'Bedanya dengan Modul 05',
              isi: `<p style="margin:0 0 10px">Dua-duanya doubling, tapi bentuk kodenya beda. Jangan sampai tertukar:</p>` +
                `<div class="scroll"><table class="t" style="text-align:left">
                  <tr><th style="text-align:left">Modul 05 — pada teks</th><th style="text-align:left">Modul 06 — pada angka</th></tr>
                  <tr><td style="text-align:left"><code>f(n-1) + ubah(f(n-1))</code></td><td style="text-align:left"><code>f(f(x, y-1), y-1)</code></td></tr>
                  <tr><td style="text-align:left">dua panggilan <b>berdampingan</b>, hasilnya ditempel</td><td style="text-align:left">dua panggilan <b>bersarang</b>, hasilnya dioper</td></tr>
                  <tr><td style="text-align:left">yang berlipat: <b>panjangnya</b></td><td style="text-align:left">yang berlipat: <b>efeknya</b></td></tr>
                  <tr><td style="text-align:left">panjang jadi 2ⁿ</td><td style="text-align:left">efek jadi 2ʸ kali lipat</td></tr>
                </table></div>` +
                `<p class="tiny" style="margin-top:10px">Cara cepat membedakan: lihat apakah ada tanda <b>+</b> di antara dua pemanggilan (berdampingan, hasil ditempel) atau tanda <b>kurung di dalam kurung</b> (bersarang, hasil dioper).</p>`,
            },
          ],
        }),
      }),

      /* ===== UJI RUMUS ===== */
      Kartu({
        judul: 'Uji sendiri: rumus vs telusuri sungguhan',
        sub: 'Jangan percaya rumus sebelum kamu mengujinya. Kolom kiri benar-benar menjalankan rekursinya, kolom kanan pakai rumus.',
        isi: Kontrol({
          ids, kolom: [
            { id: 'ux', label: 'x', nilai: 13, min: 0, maks: 66 },
            { id: 'uy', label: 'y', nilai: 8, min: 0, maks: 14 },
            { id: 'uz', label: 'z', nilai: 37, min: 0, maks: 66 }],
          tombol: [{ id: 'ugo', teks: 'Bandingkan' }, { id: 'u500', teks: 'Uji 500 kombinasi acak', gaya: 'alt' }],
        }) + Keluaran({ ids, id: 'uout' }),
      }),

      /* ===== PENYAMARAN ===== */
      Kartu({
        judul: 'Penyamaran',
        sub: 'Yang perlu kamu cari: apakah fungsi memanggil dirinya sendiri dua kali secara bersarang?',
        isi: Tab({
          ids, id: 'samar', daftar: [
            {
              kunci: 'a', judul: 'A · Bentuk asli',
              isi: Kode(`<span class="kw">return</span> <span class="fn">MAI</span>(<span class="fn">MAI</span>(x, y-1, z), y-1, z);`) +
                Catatan({ isi: '<b>Bentuk asli OSN-K 2026.</b> Cirinya: nama fungsi muncul dua kali, dan yang satu berada <b>di dalam tanda kurung</b> yang lain. Begitu lihat ini, langsung pikirkan 2ʸ.' }),
            },
            {
              kunci: 'b', judul: 'B · Ditulis terpisah',
              isi: Kode(`<span class="kw">int</span> r = <span class="fn">F</span>(x, y-1, z);
<span class="kw">return</span> <span class="fn">F</span>(r, y-1, z);`) +
                Catatan({ isi: 'Persis sama, cuma dipecah jadi dua baris pakai variabel bantu. Justru lebih gampang dikenali: hasil panggilan pertama <b>dipakai jadi input</b> panggilan kedua.' }),
            },
            {
              kunci: 'c', judul: 'C · Operasi lain',
              isi: Kode(`<span class="kw">if</span> (y == 0) <span class="kw">return</span> (x * z) % 101;
<span class="kw">return</span> <span class="fn">G</span>(<span class="fn">G</span>(x, y-1, z), y-1, z);`) +
                Catatan({ isi: 'Struktur sama, tapi fungsi dasarnya <b>mengalikan</b>, bukan menambah. Efeknya tetap berlipat: kalau dasarnya kali z, maka tingkat y jadi kali z sebanyak 2ʸ kali — yaitu <b>z pangkat 2ʸ</b>.<br><br>Pembaginya juga ganti jadi 101. Cari dulu jam berapa posisinya: 101 prima, jadi jamnya 100 posisi.' }),
            },
            {
              kunci: 'd', judul: 'D · Cerita',
              isi: Catatan({ isi: '"Sebuah mesin fotokopi disetel untuk menyalin dokumen, lalu hasil salinannya disalin lagi dengan mesin yang sama. Kalau proses ini diulang 20 tingkat, ada berapa lembar dokumen yang dihasilkan?"' }) +
                '<p class="tiny">Tidak ada kode sama sekali, tapi bentuknya sama: tiap tingkat menggandakan tingkat sebelumnya. Jawabannya 2²⁰.</p>',
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: Kode(`<span class="kw">return</span> <span class="fn">F</span>(x, y-1, z) + <span class="fn">F</span>(x, y-1, z);`) +
                Catatan({ jenis: 'awas', isi: 'Dua panggilan, tapi <b>berdampingan</b> — hasilnya dijumlahkan, bukan dioper. Efeknya beda: ini bikin hasilnya <b>dikali dua</b> tiap tingkat, bukan menjalankan operasi dua kali. Perhatikan tanda <b>+</b> di tengahnya.' }) +
                Kode(`<span class="kw">return</span> <span class="fn">F</span>(<span class="fn">F</span>(x, y-1, z), y-2, z);`, 'margin-top:10px') +
                Catatan({ jenis: 'awas', isi: 'Bersarang, tapi tingkatnya <b>tidak sama</b> — yang luar pakai y−2. Polanya jadi tidak berlipat rapi. Kerjakan dengan cara biasa: hitung nilai untuk y kecil, cari polanya.' }),
            },
          ],
        }),
      }),

      /* ===== BEDAH SOAL ===== */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2026 · soal 38–40',
        sub: 'Ketiganya dari kode yang sama, tapi menanyakan hal yang benar-benar berbeda. Soal pertama butuh rumus, kedua butuh insight bilangan, ketiga butuh paham struktur pohonnya.',
        isi: Kisi([
          KartuSoal({ ids, nomor: 'Soal 38', pertanyaan: 'Berapa nilai <code>MAI(13, 666666, 37)</code>?', idKeluaran: 's1' }),
          KartuSoal({ ids, nomor: 'Soal 39', pertanyaan: 'Untuk semua tripel (x, y, z) dengan 0 ≤ x, y, z ≤ 200, ada berapa tripel yang membuat <code>MAI(x,y,z)</code> bernilai 0?', idKeluaran: 's2' }),
          KartuSoal({ ids, nomor: 'Soal 40', pertanyaan: 'Berapa kali pemanggilan <code>MAI(0, 0, 2)</code> terjadi saat <code>MAI(0, 10, 2)</code> dijalankan?', idKeluaran: 's3' }),
        ]) + `<button class="btn" id="${I('solve')}" style="margin-top:14px">Selesaikan ketiganya</button>`,
      }),

      Catatan({
        jenis: 'awas', isi: `<b>Kapan ini bukan doubling pada angka.</b>
        <table class="t" style="margin-top:10px;background:transparent">
          <tr><th style="text-align:left">Bentuknya</th><th style="text-align:left">Sebenarnya apa</th></tr>
          <tr><td style="text-align:left"><code>f(f(x, y−1), y−1)</code></td><td style="text-align:left">✅ doubling pada angka — efeknya 2ʸ</td></tr>
          <tr><td style="text-align:left"><code>f(n−1) + ubah(f(n−1))</code></td><td style="text-align:left">⚠️ doubling pada teks — Modul 05</td></tr>
          <tr><td style="text-align:left"><code>f(x, y−1) + f(x, y−1)</code></td><td style="text-align:left">❌ berdampingan, bukan bersarang</td></tr>
          <tr><td style="text-align:left"><code>f(f(x, y−1), y−2)</code></td><td style="text-align:left">❌ tingkatnya beda — hitung suku awalnya</td></tr>
          <tr><td style="text-align:left"><code>F(B, A % B)</code></td><td style="text-align:left">❌ FPB Euclid — Modul 03</td></tr>
        </table>`,
      }),

      Catatan({ isi: '<b>Biasakan cek 30 detik sebelum pakai rumus.</b><br><br>Uji dulu di y kecil yang bisa kamu hitung dengan tangan. Ambil x = 0, z = 1. Rumus bilang MAI(0, 3, 1) = 2³ × 1 = 8. Telusuri sendiri: tingkat 0 menambah 1, tingkat 1 menambah 2, tingkat 2 menambah 4, tingkat 3 menambah 8. Cocok.<br><br>Lalu pastikan pembaginya. Kalau soal memakai angka selain 67, cari dulu berapa posisi jamnya — biasanya pembagi dikurangi satu, asalkan pembaginya prima.' }),

    ].join('');

    /* ================= PERILAKU ================= */

    /* ---- Lab 1: efek berlipat ---- */
    ids.klik('go', () => {
      const x = ids.n('x', { min: 0, maks: 66, bawaan: 0 });
      const z = ids.n('z', { min: 0, maks: 66, bawaan: 1 });
      const baris = [];
      for (let y = 0; y <= 8; y++) {
        const hasil = M.maiSim(x, y, z), lipat = Math.pow(2, y);
        baris.push(`  y=${y}  →  ${String(hasil).padStart(2)}    ${redup(`menambah z sebanyak ${String(lipat).padStart(3)} kali  (2^${y})`)}`);
      }
      ids.tulis('out', `x = ${x}, z = ${z}

${baris.join('\n')}

${redup('Perhatikan kolom kanan: 1, 2, 4, 8, 16, 32, 64, 128, 256.\nTiap naik satu tingkat, jumlah penambahannya berlipat dua.')}

Jadi hasilnya = ${hijau(`(${x} + 2^y × ${z}) mod 67`)}`);
      bukaRumus(ids, 'rumus');
    });
    
    /* ---- Lab 2: jam 66 ---- */
    ids.klik('jgo', () => {
      const el = ids.q('jy');
      const y = Math.max(0, parseInt(String(el.value).replace(/\D/g, ''), 10) || 0);
      const r = y % 66, a = M.pow2mod67(y);
      ids.q('jam').innerHTML = gambarJam(r);
      const pas = r === 0;
      ids.tulis('jout', `y = ${angka(y)}

  ${angka(y)} ÷ 66 = ${angka(Math.floor(y / 66))} sisa ${hijau(r)}
  ${pas && y > 0 ? redup(`  (66 × ${angka(Math.floor(y / 66))} = ${angka(y)} — habis, tanpa sisa!)`) : ''}

  2^${angka(y)} mod 67 = 2^${r} mod 67 = ${hijau(a)}

${pas && y > 0
        ? hijau('Jarum kembali ke titik nol. Angka raksasa itu langsung lenyap.')
        : redup(`Cukup hitung 2^${r} — bukan 2^${angka(y)}.`)}

${redup(`Cek: kalau y diganti ${angka(y + 66)} atau ${angka(y + 132)}, hasilnya tetap ${a}.`)}
  2^${angka(y + 66)} mod 67 = ${M.pow2mod67(y + 66)}   ${M.pow2mod67(y + 66) === a ? '✓ sama' : merah('✗')}
  2^${angka(y + 132)} mod 67 = ${M.pow2mod67(y + 132)}   ${M.pow2mod67(y + 132) === a ? '✓ sama' : merah('✗')}`);
    });
    ids.q('jgo').click();

    /* ---- Lab 3: pohon ---- */
    ids.klik('pgo', () => {
      const y = ids.n('py', { min: 0, maks: 7, bawaan: 4 });
      ids.q('pohon').innerHTML = gambarPohon(0, y, 2);
      const n = Math.pow(2, y);
      ids.tulis('pout', `y = ${y}

  tingkat teratas : 1 pemanggilan
  tiap turun satu : jumlahnya dikali 2
  di dasar        : ${hijau(angka(n))} pemanggilan = 2^${y}

${redup('Untuk y = 10 sudah 1.024 pemanggilan dasar.\nUntuk y = 666.666? Angkanya punya 200.000 digit lebih —\nitulah kenapa menelusuri bukan pilihan.')}`);
    });
    ids.q('pgo').click();

    /* ---- menghitung pemanggilan ---- */
    ids.klik('hgo', () => {
      const x = ids.n('hx', { min: 0, maks: 66, bawaan: 0 });
      const y = ids.n('hy', { min: 0, maks: 20, bawaan: 10 });
      const z = ids.n('hz', { min: 0, maks: 66, bawaan: 2 });
      const a = ids.n('ha', { min: 0, maks: 66, bawaan: 0 });
      const n = Math.pow(2, y), jml = M.maiHitungPanggilan(x, y, z, a);
      const cocok = [];
      for (let k = 0; k < Math.min(n, 400) && cocok.length < 6; k++)
        if ((x + k * z) % 67 === a % 67) cocok.push(k);
      ids.tulis('hout', `MAI(${x}, ${y}, ${z}) dijalankan → ${angka(n)} pemanggilan dasar.

Argumen pertama pemanggilan ke-k = (${x} + k × ${z}) mod 67
Dicari yang argumennya = ${a}

  k yang cocok: ${cocok.join(', ')}${cocok.length >= 6 ? ', …' : ''}
  ${z % 67 !== 0 ? redup(`(setelah itu berulang tiap 67 langkah)`) : ''}

  jawabannya ${hijau(angka(jml))} kali`);
    });
    ids.q('hgo').click();

    /* ---- uji rumus ---- */
    ids.klik('ugo', () => {
      const x = ids.n('ux', { min: 0, maks: 66, bawaan: 13 });
      const y = ids.n('uy', { min: 0, maks: 14, bawaan: 8 });
      const z = ids.n('uz', { min: 0, maks: 66, bawaan: 37 });
      const sim = M.maiSim(x, y, z), rum = (x + M.pow2mod67(y) * z) % 67;
      ids.tulis('uout', `MAI(${x}, ${y}, ${z})

TELUSURI SUNGGUHAN — menjalankan ${angka(Math.pow(2, y))} pemanggilan dasar
  hasil = ${hijau(sim)}

RUMUS — tiga langkah
  ${y} mod 66 = ${y % 66}
  2^${y % 66} mod 67 = ${M.pow2mod67(y)}
  (${x} + ${M.pow2mod67(y)} × ${z}) mod 67 = ${hijau(rum)}

${sim === rum ? hijau('✓ SAMA') : merah('✗ beda')}`);
    });
    ids.klik('u500', () => {
      let gagal = 0, contoh = null;
      for (let i = 0; i < 500; i++) {
        const x = Math.floor(Math.random() * 67), z = Math.floor(Math.random() * 67),
          y = Math.floor(Math.random() * 11);
        if (M.maiSim(x, y, z) !== (x + M.pow2mod67(y) * z) % 67) { gagal++; if (!contoh) contoh = `${x},${y},${z}`; }
      }
      ids.tulis('uout', gagal === 0
        ? `Diuji 500 kombinasi (x, y, z) acak.\nTelusuri sungguhan vs rumus langsung.\n\n${hijau('✓ KEDUANYA COCOK PADA SEMUA 500 KASUS')}`
        : merah(`✗ ${gagal} kasus tidak cocok, contoh (${contoh})`));
    });
    ids.q('ugo').click();

    /* ---- bedah soal ---- */
    ids.klik('solve', () => {
      /* Angka soalnya jadi tetapan, semua turunannya DIHITUNG. */
      const X38 = 13, Y38 = 666666, Z38 = 37;
      const per = M.ord2mod67();                  // periode 2 pangkat sekian, mod 67
      const r38 = Y38 % per, p38 = M.pow2mod67(Y38);
      const j38 = M.mai(X38, Y38, Z38);
      ids.tulis('s1', `Pakai rumus: (x + 2ʸ × z) mod 67

Langkah 1 — perkecil y
  ${angka(Y38)} ÷ ${per} = ${angka(Y38 / per)} ${r38 === 0 ? hijau('pas, tanpa sisa') : hijau('sisa ' + r38)}
  jadi ${angka(Y38)} mod ${per} = ${r38}

Langkah 2 — hitung pangkatnya
  2^${r38} mod 67 = ${p38}

Langkah 3 — masukkan ke rumus
  (${X38} + ${p38} × ${Z38}) mod 67 = ${X38 + p38 * Z38} mod 67 = ${hijau(j38)}

${redup('Angka ' + angka(Y38) + ' sengaja dipilih habis dibagi ' + per + '.\nBegitu kamu sadar itu, soalnya selesai dalam sepuluh detik.')}`);

      ids.tulis('s2', `Syaratnya: (x + 2ʸ × z) mod 67 = 0
artinya x harus punya sisa tertentu, tergantung y dan z.

KUNCINYA di angka 201:
  ${hijau('201 = 3 × 67 tepat')}

Berarti di antara 0 sampai 200, tiap sisa-bagi-67
muncul persis 3 kali.

Jadi untuk pasangan (y, z) ${hijau('apa pun')}, selalu ada
tepat 3 pilihan x yang memenuhi.

  banyaknya pasangan (y, z) = 201 × 201 = ${angka(201 * 201)}
  tiap pasangan punya 3 pilihan x
  ────────────────────────────────
  jawabannya = ${angka(201 * 201)} × 3 = ${hijau(angka(201 * 201 * 3))}

${redup('Yang mengejutkan: kamu tidak perlu tahu berapa 2^y sama sekali.')}`);

      const jml = M.maiHitungPanggilan(0, 10, 2, 0);
      ids.tulis('s3', `MAI(0, 10, 2) menghasilkan 2¹⁰ = ${angka(1024)} pemanggilan dasar.

Argumen pertamanya berurutan naik 2:
  k=0 → 0,  k=1 → 2,  k=2 → 4,  k=3 → 6, …
  rumusnya (0 + 2k) mod 67

Dicari yang argumennya 0, yaitu 2k habis dibagi 67.
Karena 67 prima dan 2 bukan kelipatannya,
berarti ${hijau('k harus kelipatan 67')}.

  k = 0, 67, 134, …, 1005
  ${angka(1005)} ÷ 67 = 15, jadi ada 15 + 1 = ${hijau(angka(jml))}

${hijau('Jawabannya: ' + jml + ' kali')}`);
    });

    pasangTab('trik'); pasangTab('samar');
  },
};
