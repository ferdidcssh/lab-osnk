/* ============================================================
   MODUL 11 — KOMBINATORIKA
   Semua aturan di berkas ini dibuktikan oleh
   verify/11-kombinatorika.py — jangan diubah tanpa menjalankannya lagi.

   Cara pembuktiannya: tiap aturan diadu dengan pencacahan langsung
   pada RATUSAN angka acak, bukan cuma angka yang muncul di soal OSN-K.
   Tiap aturan juga diuji pada kasus yang membuatnya PATAH.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Tabel, KartuSoal, hijau, merah, redup,
} from '../core/ui.js';

/* Angka besar perlu BigInt — 21! saja sudah melewati batas angka biasa. */
const ang = (b) => BigInt(b).toLocaleString('id-ID');

/* ---------- soal OSN-K 2024 nomor 14-16 ---------- */
const AYAM = [...Array(15)].map((_, i) => String.fromCharCode(65 + i));
const TEMAN = [['A','B'],['C','M'],['E','G'],['A','M'],['D','J'],['O','N'],
               ['B','O'],['K','L'],['D','I'],['B','N'],['L','D'],['H','F']];

/* ---------- POHON PILIHAN ----------
   Memperlihatkan kenapa tahapan berurutan itu DIKALIKAN: tiap cabang
   pecah lagi sebanyak pilihan di tahap berikutnya. */
function gambarPohon(pilihan) {
  const batas = [];
  let lebar = 1;
  for (const p of pilihan) {           // batasi supaya gambarnya terbaca
    if (p < 1 || lebar * p > 24) break;
    batas.push(p); lebar *= p;
  }
  if (!batas.length) return '<div class="out">Pilihannya terlalu banyak untuk digambar.</div>';

  const W = 640, tinggiLapis = 62;
  const H = (batas.length + 1) * tinggiLapis + 26;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Pohon pilihan: tiap tahap memecah cabang">`;

  const lapis = [[W / 2]];
  s += `<circle cx="${W / 2}" cy="24" r="7" fill="var(--tinta)"/>`;
  batas.forEach((p, i) => {
    const berikut = [], y0 = 24 + i * tinggiLapis, y1 = y0 + tinggiLapis;
    const total = lapis[i].length * p;
    let ke = 0;
    lapis[i].forEach((x) => {
      for (let j = 0; j < p; j++) {
        const xb = W * (ke + 0.5) / total; ke++;
        berikut.push(xb);
        s += `<line x1="${x.toFixed(1)}" y1="${y0 + 7}" x2="${xb.toFixed(1)}" y2="${y1 - 8}"
          stroke="var(--garis-tebal)" stroke-width="1.2"/>`;
      }
    });
    berikut.forEach((x) => {
      s += `<circle cx="${x.toFixed(1)}" cy="${y1}" r="${Math.max(3.5, 8 - i)}"
        fill="${i === batas.length - 1 ? 'var(--merah)' : 'var(--kertas)'}"
        stroke="var(--garis-tebal)" stroke-width="1.4"/>`;
    });
    s += `<text x="8" y="${y1 + 4}" style="font-family:var(--mono);font-size:11px;
      fill:var(--tinta-3)">×${p}</text>`;
    lapis.push(berikut);
  });
  const daun = lapis[lapis.length - 1].length;
  s += `<text x="${W / 2}" y="${H - 4}" text-anchor="middle"
    style="font-family:var(--mono);font-size:12px;font-weight:700;fill:var(--merah)">
    ${daun} ujung${batas.length < pilihan.length ? ' (baru ' + batas.length + ' tahap)' : ''}</text>`;
  return s + '</svg>';
}

/* ---------- KOTAK KELOMPOK ----------
   Untuk trik "+1 lalu −1". Tiap kelompok digambar sebagai deret kotak,
   ditambah satu kotak putus-putus yang artinya tidak mengirim siapa-siapa. */
function gambarKelompok(ukuran, { pakaiTambahan = false, nama = null } = {}) {
  if (!ukuran.length) return '<div class="out">Belum ada kelompok.</div>';
  const kotak = 30, jarak = 5, kiri = 96, atasBaris = 52;
  const maks = Math.max(...ukuran) + (pakaiTambahan ? 1 : 0);
  const W = kiri + maks * (kotak + jarak) + 110;
  const H = ukuran.length * atasBaris + 16;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Kelompok dan pilihan wakilnya">`;
  ukuran.forEach((u, i) => {
    const y = i * atasBaris + 12;
    s += `<text x="6" y="${y + kotak / 2 + 4}" style="font-family:var(--mono);
      font-size:12px;font-weight:600;fill:var(--tinta-2)">kel ${i + 1}</text>`;
    for (let j = 0; j < u; j++) {
      const x = kiri + j * (kotak + jarak);
      s += `<rect x="${x}" y="${y}" width="${kotak}" height="${kotak}" rx="6"
        fill="var(--kertas)" stroke="var(--garis-tebal)" stroke-width="1.6"/>
        <text x="${x + kotak / 2}" y="${y + kotak / 2 + 5}" text-anchor="middle"
        style="font-family:var(--mono);font-size:12px;fill:var(--tinta-2)">${
          nama && nama[i] && nama[i][j] ? nama[i][j] : j + 1}</text>`;
    }
    if (pakaiTambahan) {
      const x = kiri + u * (kotak + jarak);
      s += `<rect x="${x}" y="${y}" width="${kotak}" height="${kotak}" rx="6"
        fill="var(--stabilo)" stroke="var(--merah)" stroke-width="2"
        stroke-dasharray="4 3"/>
        <text x="${x + kotak / 2}" y="${y + kotak / 2 + 5}" text-anchor="middle"
        style="font-family:var(--mono);font-size:15px;font-weight:700;fill:var(--merah)">–</text>`;
    }
    const xt = kiri + maks * (kotak + jarak) + 8;
    s += `<text x="${xt}" y="${y + kotak / 2 + 4}" style="font-family:var(--mono);
      font-size:12px;font-weight:700;fill:${pakaiTambahan ? 'var(--merah)' : 'var(--tinta)'}">${
      u}${pakaiTambahan ? ' + 1 = ' + (u + 1) : ''} pilihan</text>`;
  });
  return s + '</svg>';
}

/* ---------- SEGITIGA PASCAL ---------- */
function gambarPascal(n, sorotN = -1, sorotR = -1) {
  const P = M.kPascal(n), sel = 46, tinggi = 34;
  const W = (n + 1) * sel + 20, H = (n + 1) * tinggi + 20;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Segitiga Pascal">`;
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= i; j++) {
      const x = W / 2 + (j - i / 2) * sel, y = i * tinggi + 22;
      const ini = i === sorotN && j === sorotR;
      const asal = i === sorotN - 1 && (j === sorotR - 1 || j === sorotR);
      s += `<text x="${x}" y="${y}" text-anchor="middle"
        style="font-family:var(--mono);font-size:${P[i][j] > 99999n ? 10 : 12}px;
        font-weight:${ini || asal ? 700 : 400};
        fill:${ini ? 'var(--merah)' : asal ? 'var(--hijau)' : 'var(--tinta-3)'}">${P[i][j]}</text>`;
      if (ini) s += `<rect x="${x - 21}" y="${y - 14}" width="42" height="19" rx="4"
        fill="none" stroke="var(--merah)" stroke-width="1.8"/>`;
    }
  }
  return s + '</svg>';
}

const bacaAngka = (teks) => String(teks).split(/[,\s]+/)
  .map((x) => parseInt(x.trim(), 10)).filter((x) => !isNaN(x));

export default {
  id: 'kombi', n: '11', kelompok: 'Hitungan',
  judul: 'Kombinatorika',
  lede: 'Dua aturan induk, dan satu trik yang mengubah penjumlahan panjang jadi satu perkalian. Untuk soal 10 kelompok, bedanya 1.023 suku lawan 11 langkah.',
  lencana: ['<span class="chip r">2024 · soal 14–16</span>',
            '<span class="chip v">Tiap aturan diadu pencacahan langsung</span>'],

  kartu: [
    { q: '“Berapa banyak susunan yang mungkin?”', a: 'kombi', why: 'Tentukan dulu: tahapan berurutan (kalikan) atau pilihan yang saling lepas (jumlahkan)?' },
    { q: '“…yang mengandung setidaknya satu angka 7”', a: 'kombi', why: 'Trik komplemen: total dikurangi yang tanpa angka 7 sama sekali.' },
    { q: '“Tiap kelompok boleh mengirim wakil atau tidak, minimal satu orang ikut”', a: 'kombi', why: 'Trik +1 lalu −1: kalikan (ukuran + 1), lalu buang satu kemungkinan kosong.' },
    { q: '“Berapa banyak kata dari huruf penyusun BACA?”', a: 'kombi', why: 'Ada huruf kembar. Bagi dengan faktorial tiap huruf yang berulang.' },
  ],
  kamus: [
    ['“lalu”, “kemudian”, tahapan berurutan', 'Aturan perkalian'],
    ['“atau”, pilihan yang saling lepas', 'Aturan penjumlahan — cek irisannya'],
    ['“setidaknya satu”, “minimal satu”', 'Trik komplemen'],
    ['“boleh tidak memilih”', 'Trik +1 lalu −1'],
    ['“urutan tidak diperhatikan”', 'Kombinasi, bukan permutasi'],
    ['“duduk melingkar”', 'Permutasi melingkar (n−1)!'],
  ],

  bangun(root, { ids, pasangTab }) {
    const kelAyam = M.kKelompok(AYAM, TEMAN);
    const ukAyam = kelAyam.map((k) => k.length);

    root.innerHTML = [

      /* ============ APA ITU ============ */
      Kartu({
        judul: 'Apa itu Kombinatorika?',
        isi:
          `<p style="margin:10px 0">Kombinatorika adalah ilmu <b>menghitung tanpa mendaftar</b>. Kalau kamu ditanya ada berapa cara menyusun sesuatu, kamu bisa saja menulis semuanya lalu menghitung. Untuk 4 benda itu masih mungkin. Untuk 20 benda, daftarnya lebih panjang daripada umurmu.</p>
           <p style="margin:10px 0">Jadi kita cari jalan lain: menghitung <b>banyaknya</b> susunan tanpa pernah menuliskan satu pun susunannya.</p>
           <p style="margin:10px 0">Seluruh isi bab ini bertumpu pada dua aturan saja. Kalau sebuah pekerjaan dilakukan <b>bertahap</b> — pilih ini, lalu pilih itu — banyaknya cara <b>dikalikan</b>. Kalau pekerjaannya terpecah jadi beberapa <b>pilihan yang saling lepas</b> — lewat jalan A atau jalan B — banyaknya cara <b>dijumlahkan</b>.</p>` +
          Catatan({
            jenis: 'awas',
            isi: `<b>Dua aturan itu punya syarat, dan di situlah orang tergelincir.</b>
              <br><br>Perkalian menuntut tiap tahap <b>tidak bergantung</b> pada tahap sebelumnya. "Pilih 2 huruf berbeda dari a, b, c" bukan 3 × 3 = 9, melainkan 6 — karena huruf kedua tergantung pada huruf pertama.
              <br><br>Penjumlahan menuntut kelompoknya <b>tidak beririsan</b>. Kalau ada satu cara yang masuk dua kelompok sekaligus, ia terhitung dua kali. Obatnya: kurangi irisannya.
              <span class="tiny" style="display:block;margin-top:6px">✅ Diuji pada 300 pasang kelompok acak. 205 di antaranya beririsan, dan penjumlahan polos meleset di semuanya.</span>`,
          }) +
          Catatan({
            jenis: 'baik',
            isi: `<b>Kenapa penting untuk OSN-K?</b> Kombinatorika muncul hampir tiap tahun, dan biasanya bukan sebagai rumus telanjang. Ia disamarkan jadi cerita: memilih tim, menyusun sandi, membagi kue, mengundang ayam.
              <br><br>Yang diuji sebenarnya cuma satu hal — apakah kamu bisa memisahkan mana yang <b>tahapan</b> dan mana yang <b>pilihan lepas</b>. Setelah itu selesai.`,
          }),
      }),

      /* ============ LAB 1 ============ */
      Lab({
        judul: 'Lab 1 · Kenapa tahapan itu dikalikan',
        petunjuk: 'tulis banyaknya pilihan di tiap tahap',
        isi:
          `<p style="margin:0 0 12px">Tiap tahap memecah setiap cabang yang sudah ada. Itulah kenapa hasilnya dikalikan, bukan dijumlahkan. Coba ubah angkanya dan lihat pohonnya melebar.</p>` +
          Kontrol({
            ids,
            kolom: [{ id: 'kb1', label: 'pilihan tiap tahap, pisahkan dengan koma', nilai: '3, 2, 2', lebar: true, jenis: 'teks' }],
            tombol: [{ id: 'kbgo', teks: 'Kalikan' },
                     { id: 'kbsandi', teks: 'Contoh: sandi 26,10,10,10', gaya: 'alt' }],
          }) +
          Wadah({ ids, id: 'viz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'kbout', isi: 'Tekan “Kalikan” untuk mulai.' }),
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Dua aturan induk',
        isi: `tahapan berurutan &nbsp;→&nbsp; <mark>KALIKAN</mark> &nbsp; <span style="font-size:12.5px">syarat: tahapnya tidak saling bergantung</span><br>
              pilihan yang saling lepas &nbsp;→&nbsp; <mark>JUMLAHKAN</mark> &nbsp; <span style="font-size:12.5px">syarat: tidak beririsan</span><br>
              kalau beririsan &nbsp;→&nbsp; <mark>|A| + |B| − |irisan|</mark>`,
        verifikasi: 'Aturan perkalian diadu dengan pencacahan langsung pada 400 kombinasi acak, aturan penjumlahan pada 300 pasang kelompok acak. Nol beda.',
        pesan: 'Kalikan dulu beberapa angka di Lab 1 — aturannya lebih membekas kalau kamu sendiri yang melihat pohonnya melebar.',
      }),

      /* ============ LAB 2 · TRIK ============ */
      Lab({
        judul: 'Lab 2 · Trik “+1 lalu −1” — yang paling terasa curang',
        petunjuk: 'penjumlahan panjang jadi satu perkalian',
        isi:
          `<p style="margin:0 0 10px">Bentuk soalnya begini: ada beberapa kelompok, tiap kelompok boleh mengirim <b>paling banyak satu</b> wakil, dan totalnya harus <b>minimal satu</b> orang.</p>
           <p style="margin:0 0 10px">Cara panjangnya menyiksa. Kamu harus menjumlahkan tiap kemungkinan kelompok mana saja yang mengirim: cuma kelompok 1, cuma kelompok 2, kelompok 1 dan 2, dan seterusnya.</p>
           <p style="margin:0 0 12px">Triknya: beri tiap kelompok <b>satu pilihan tambahan</b> yang artinya "tidak mengirim siapa-siapa". Kalikan semuanya. Lalu buang <b>satu</b> kemungkinan — yaitu saat semua kelompok memilih tidak mengirim.</p>` +
          Kontrol({
            ids,
            kolom: [{ id: 'tk', label: 'ukuran tiap kelompok', nilai: '6, 5, 2, 2', lebar: true, jenis: 'teks' }],
            tombol: [{ id: 'tgo', teks: 'Pakai trik' },
                     { id: 'tlama', teks: 'Bandingkan cara panjang', gaya: 'alt' }],
          }) +
          Wadah({ ids, id: 'tviz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'tout', isi: 'Tekan “Pakai trik” untuk mulai.' }),
      }),

      Catatan({
        jenis: 'baik',
        isi: `<b>Kenapa ini terasa curang.</b> Cara panjang tumbuh <b>berlipat ganda</b> mengikuti banyaknya kelompok. Untuk k kelompok, kamu harus menjumlahkan 2<sup>k</sup> − 1 suku. Triknya cuma butuh k perkalian dan satu pengurangan.
          <br><br>4 kelompok berarti 15 suku lawan 5 langkah. 10 kelompok berarti <b>1.023 suku lawan 11 langkah</b>. Makin besar soalnya, makin jauh bedanya.
          <br><br>Dan triknya berlaku umum. Ia tidak peduli soalnya tentang ayam, tim, kue, atau menu makan siang. Yang ia butuhkan cuma satu bentuk: <b>tiap kelompok paling banyak satu, minimal satu total</b>.
          <span class="tiny" style="display:block;margin-top:6px">✅ Diadu dengan penjumlahan panjangnya pada 250 susunan kelompok acak, dan dengan pendaftaran satu per satu semua kemungkinan. Nol beda.</span>`,
      }),

      Catatan({
        jenis: 'awas',
        isi: `<b>Tiga saudara triknya, supaya kamu tidak salah pakai.</b>
          <br><br>Kalau tiap kelompok <b>wajib</b> mengirim tepat satu: cukup kalikan ukurannya, tanpa +1 dan tanpa −1.
          <br>Kalau boleh tidak mengirim dan <b>boleh kosong semua</b>: kalikan (ukuran + 1), tanpa −1.
          <br>Kalau tiap kelompok boleh mengirim <b>berapa pun</b> anggotanya: ganti (ukuran + 1) jadi 2<sup>ukuran</sup>.
          <br><br>Bacalah pertanyaannya dua kali. Bedanya cuma satu kata, tapi jawabannya jauh berbeda.`,
      }),

      /* ============ LAB 3 ============ */
      Lab({
        judul: 'Lab 3 · Trik komplemen dan segitiga Pascal',
        petunjuk: 'dua alat yang paling sering menyelamatkan',
        isi:
          `<p style="margin:0 0 12px">Trik komplemen memakai gagasan yang sama dengan Lab 2: menghitung yang <b>dilarang</b> sering jauh lebih mudah daripada menghitung yang boleh.</p>` +
          Kontrol({
            ids,
            kolom: [
              { id: 'cp', label: 'panjang susunan', nilai: 4, min: 1, maks: 12 },
              { id: 'cs', label: 'banyaknya lambang', nilai: 10, min: 2, maks: 36 },
            ],
            tombol: [{ id: 'cgo', teks: 'Hitung dua cara' }],
          }) +
          Keluaran({ ids, id: 'cout', isi: 'Tekan “Hitung dua cara” untuk mulai.' }) +
          `<p style="margin:16px 0 12px">Dan kalau kamu perlu nilai kombinasi tanpa mengalikan faktorial raksasa, pakai segitiga Pascal. Tiap angka adalah jumlah dua angka di atasnya.</p>` +
          Kontrol({
            ids,
            kolom: [
              { id: 'pn', label: 'n', nilai: 8, min: 1, maks: 14 },
              { id: 'pr', label: 'r', nilai: 3, min: 0, maks: 14 },
            ],
            tombol: [{ id: 'pgo', teks: 'Gambar segitiganya' }],
          }) +
          Wadah({ ids, id: 'pviz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'pout', isi: 'Tekan “Gambar segitiganya” untuk mulai.' }),
      }),

      /* ============ KUMPULAN CARA CEPAT ============ */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Enam rumus yang menutup hampir semua soal hitungan OSN-K.',
        isi: Tab({
          ids, id: 'trik',
          daftar: [
            {
              kunci: 'c1', judul: 'Urutan penting?',
              isi: `<p style="margin:0 0 10px">Pertanyaan pertama yang harus kamu jawab, sebelum menyentuh rumus apa pun.</p>` +
                Rumus({
                  label: 'Ambil r benda dari n benda',
                  isi: `urutan diperhatikan &nbsp;→&nbsp; <mark>P(n,r) = n × (n−1) × … sebanyak r faktor</mark><br>
                        urutan tidak diperhatikan &nbsp;→&nbsp; <mark>C(n,r) = P(n,r) ÷ r!</mark><br>
                        r &gt; n &nbsp;→&nbsp; <mark>0</mark>, bukan dipotong diam-diam`,
                  verifikasi: 'Diadu dengan pendaftaran langsung untuk semua n = 0..7 dan r = 0..n+1.',
                }) +
                `<p class="tiny">Uji cepatnya: tukar dua benda yang sudah kamu pilih. Kalau hasilnya dianggap susunan yang sama, pakai C. Kalau dianggap berbeda, pakai P.</p>`,
            },
            {
              kunci: 'c2', judul: 'Ada yang kembar',
              isi: `<p style="margin:0 0 10px">Kalau bendanya ada yang sama persis, susunan yang cuma menukar benda kembar itu sebenarnya satu susunan.</p>` +
                Rumus({
                  label: 'Menyusun huruf yang sebagiannya kembar',
                  isi: `<mark>n! ÷ (r₁! × r₂! × … )</mark> &nbsp; dengan rᵢ = banyaknya huruf yang sama`,
                  verifikasi: 'Diadu dengan pendaftaran langsung untuk 6 kata. BACA = 12, MEGAGIGA = 3.360.',
                }) +
                `<p class="tiny">BACA punya 4 huruf dengan A kembar dua, jadi 4! ÷ 2! = 12. Bukan 24.</p>`,
            },
            {
              kunci: 'c3', judul: 'Duduk melingkar',
              isi: `<p style="margin:0 0 10px">Kalau susunannya melingkar, memutar seluruh lingkaran tidak menghasilkan susunan baru.</p>` +
                Rumus({
                  label: 'n orang duduk melingkar',
                  isi: `<mark>(n − 1)!</mark> &nbsp; bukan n!`,
                  verifikasi: 'Diadu dengan pendaftaran langsung untuk n = 1 sampai 7.',
                }) +
                `<p class="tiny">Kuncinya: pakukan satu orang di satu kursi, lalu susun sisanya. Itu menghapus semua putaran yang menghasilkan susunan sama.</p>`,
            },
            {
              kunci: 'c4', judul: 'Bintang dan batang',
              isi: `<p style="margin:0 0 10px">Untuk soal "bagi n benda ke r kotak, kotak boleh kosong". Bentuk lain dari soal yang sama: berapa cara memilih n benda dari r jenis, tiap jenis boleh diambil berkali-kali.</p>` +
                Rumus({
                  label: 'n benda dibagi ke r kotak',
                  isi: `<mark>C(n + r − 1, r − 1)</mark>`,
                  verifikasi: 'Diadu dengan pendaftaran langsung untuk semua jenis 1..7 dan ambil 0..8. Contoh silabus: beli 4 kue dari 3 jenis = 15.',
                }) +
                `<p class="tiny">Bayangkan n bintang berjajar, lalu sisipkan r−1 batang pembatas. Yang kamu pilih sebenarnya cuma letak batangnya.</p>`,
            },
            {
              kunci: 'c5', judul: 'Trik komplemen',
              isi: `<p style="margin:0 0 10px">Untuk semua soal bernada "setidaknya", "minimal", atau "paling tidak ada satu".</p>` +
                Rumus({
                  label: 'Setidaknya satu X',
                  isi: `<mark>semua kemungkinan − yang TANPA X sama sekali</mark>`,
                  verifikasi: 'Diadu dengan pendaftaran langsung pada 200 kombinasi panjang dan lambang secara acak.',
                }) +
                `<p class="tiny">Sandi 4 angka yang memuat setidaknya satu angka 7: 10⁴ − 9⁴ = 10.000 − 6.561 = 3.439. Cara langsungnya harus menjumlah 4 kasus terpisah.</p>`,
            },
            {
              kunci: 'c6', judul: 'Segitiga Pascal',
              isi: `<p style="margin:0 0 10px">Kalau kamu perlu beberapa nilai kombinasi sekaligus, jangan hitung faktorial berulang-ulang.</p>` +
                Rumus({
                  label: 'Tiap angka adalah jumlah dua angka di atasnya',
                  isi: `<mark>C(n,r) = C(n−1, r−1) + C(n−1, r)</mark>`,
                  verifikasi: 'Diperiksa untuk seluruh n sampai 24, nol pelanggaran.',
                }) +
                `<p class="tiny">Untuk C(20,10) lewat faktorial kamu harus melewati angka 19 digit. Lewat segitiga, cukup penjumlahan angka kecil sampai baris ke-20.</p>`,
            },
          ],
        }),
      }),

      /* ============ UJI SENDIRI ============ */
      Kartu({
        judul: 'Uji sendiri: rumus vs mendaftar satu per satu',
        sub: 'Kalau rumusnya benar, ia harus cocok dengan pendaftaran manual — untuk angka apa pun, bukan cuma angka soal.',
        isi:
          `<div class="ctl">
            <button class="btn" id="${ids.i('ugo')}">Uji kelompok di Lab 2</button>
            <button class="btn alt" id="${ids.i('uall')}">Uji 200 soal acak</button>
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
              kunci: 'a', judul: 'A · Soal 2024',
              isi: `<p style="margin:0 0 10px">"Ayam yang diajak berasal dari lingkaran pertemanan yang berbeda. Minimal satu ekor diajak. Jika tiap lingkaran <b>tidak harus</b> ada perwakilan, ada berapa cara?"</p>` +
                Catatan({ isi: `<b>Bentuk baku trik +1 lalu −1.</b> "Dari lingkaran yang berbeda" artinya tiap lingkaran paling banyak satu. "Tidak harus ada perwakilan" artinya boleh melewatkan lingkaran. "Minimal satu ekor" artinya buang kemungkinan kosong.` }),
            },
            {
              kunci: 'b', judul: 'B · Menu',
              isi: `<p style="margin:0 0 10px">"Warung menyediakan 5 nasi, 4 lauk, dan 3 minuman. Kamu boleh memesan paling banyak satu dari tiap jenis, tapi tidak boleh pulang tanpa memesan apa pun. Ada berapa pesanan berbeda?"</p>` +
                Catatan({ isi: `<b>Soal yang sama, kostum berbeda.</b> 6 × 5 × 4 − 1 = 119. Perhatikan bahwa jumlah kelompoknya berubah dari 4 jadi 3, dan triknya tetap jalan tanpa diubah sedikit pun.` }),
            },
            {
              kunci: 'c', judul: 'C · Pembagi',
              isi: `<p style="margin:0 0 10px">"Berapa banyak pembagi positif dari 360, tidak termasuk 1?"</p>` +
                Catatan({ isi: `<b>Ini juga trik yang sama.</b> 360 = 2³ × 3² × 5. Pangkat 2 boleh 0 sampai 3 — itu 4 pilihan. Pangkat 3 boleh 0 sampai 2 — 3 pilihan. Pangkat 5 boleh 0 atau 1 — 2 pilihan.
                  <br><br>Jadi (3+1)(2+1)(1+1) = 24 pembagi, lalu buang pembagi 1 yang muncul saat semua pangkatnya nol: 23. Bentuknya identik dengan soal ayam.` }),
            },
            {
              kunci: 'd', judul: 'D · Sandi',
              isi: `<p style="margin:0 0 10px">"Sandi terdiri dari 6 karakter dari 26 huruf. Berapa banyak sandi yang memuat setidaknya satu huruf A?"</p>` +
                Catatan({ isi: `<b>Trik komplemen.</b> 26⁶ − 25⁶. Cara langsungnya harus menjumlah enam kasus terpisah: tepat satu A, tepat dua A, sampai enam A. Enam perhitungan rumit lawan satu pengurangan.` }),
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: `<p style="margin:0 0 10px">"Dari 10 siswa dipilih ketua, sekretaris, dan bendahara. Ada berapa cara?"</p>` +
                Catatan({ jenis: 'awas', isi: `<b>Ini BUKAN kombinasi.</b> Godaannya menjawab C(10,3) = 120. Salah — jabatannya berbeda, jadi urutannya berpengaruh. Jawabannya 10 × 9 × 8 = 720.
                  <br><br>Cara mengeceknya: bayangkan Ani dan Budi sudah terpilih. Ani ketua Budi sekretaris, versus Budi ketua Ani sekretaris — itu dua hasil berbeda. Berarti urutan penting, berarti P bukan C.
                  <br><br>Jebakan kebalikannya juga ada: "pilih 3 siswa untuk mewakili sekolah" tanpa jabatan. Itu baru C(10,3).` }),
            },
          ],
        }),
      }),

      /* ============ BEDAH SOAL ============ */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2024 · soal 14–16',
        sub: 'Pertemanan Ayam. 15 ayam, 12 pertemanan, tiga pertanyaan bertingkat.',
        isi: Kisi([
          KartuSoal({ ids, nomor: '2024 · soal 14', idKeluaran: 's1',
            pertanyaan: 'Ada berapa banyak lingkaran pertemanan?' }),
          KartuSoal({ ids, nomor: '2024 · soal 15', idKeluaran: 's2',
            pertanyaan: 'Jika tiap lingkaran HARUS ada perwakilan, ada berapa cara memilih?' }),
          KartuSoal({ ids, nomor: '2024 · soal 16', idKeluaran: 's3',
            pertanyaan: 'Jika tiap lingkaran TIDAK harus ada perwakilan, ada berapa cara?' }),
        ]) + `<div class="ctl" style="margin-top:12px">
            <button class="btn" id="${ids.i('solve')}">Selesaikan ketiganya</button>
          </div>` +
          Wadah({ ids, id: 'sviz', gaya: 'margin:14px 0' }),
      }),

      /* ============ KAPAN INI BUKAN ============ */
      Catatan({
        jenis: 'awas',
        isi: `<b>Kapan rumusnya BUKAN yang kamu kira.</b> Semua baris di bawah terdengar mirip. Bedanya satu kata:` +
          Tabel({
            kiri: true,
            kepala: ['Bunyi soal', 'Rumus yang benar'],
            baris: [
              ['“pilih r orang untuk jadi tim”', 'C(n,r) — urutan tidak berpengaruh'],
              ['“pilih r orang untuk r jabatan berbeda”', 'P(n,r) — urutan berpengaruh'],
              ['“tiap kelompok wajib satu wakil”', 'kalikan ukurannya saja'],
              ['“tiap kelompok boleh tidak mengirim, minimal satu total”', '∏(ukuran + 1) − 1'],
              ['“tiap kelompok boleh mengirim berapa pun”', '∏ 2^ukuran, kurangi 1 bila perlu'],
              ['“setidaknya satu X”', 'total − yang tanpa X'],
              ['“benda identik dibagi ke kotak”', 'bintang &amp; batang, bukan pangkat'],
              ['ada <b>syarat antar-kelompok</b>, misalnya “A dan B tidak boleh bersama”', 'trik +1 lalu −1 gugur — lihat catatan di bawah'],
            ],
          }) +
          `<span style="display:block;margin-top:10px">Kalau ragu antara P dan C, pakai uji tukar: ambil dua benda yang sudah terpilih, lalu tukar posisinya. Kalau hasilnya dianggap sama, pakai C.</span>`,
      }),

      Catatan({
        jenis: 'awas',
        isi: `<b>Trik "+1 lalu −1" punya satu syarat tersembunyi: tiap kelompok harus memilih SENDIRI-SENDIRI.</b> Begitu ada kalimat yang mengaitkan dua kelompok, triknya kelebihan menghitung.
          <br><br>Contohnya begini. Tiga kelompok berukuran 3, 3, dan 2. Trik polos menjawab 4 × 4 × 3 − 1 = <b>47</b>. Sekarang tambahkan satu kalimat: anggota pertama kelompok 1 dan anggota pertama kelompok 2 <b>bermusuhan</b>, tidak boleh diajak bersama.
          <br><br>Jawaban yang benar jadi <b>44</b>. Trik polos kelebihan 3.
          ` + Rumus({
            label: 'Perbaikannya',
            isi: `jawaban = <mark>hasil trik polos − banyaknya susunan yang melanggar</mark><br>
                  <span style="font-size:12.5px">di contoh ini: 1 × 1 × 3 = 3 susunan melanggar, jadi 47 − 3 = 44</span>`,
            verifikasi: 'Diadu dengan pendaftaran semua kemungkinan satu per satu. Dari 300 soal berlarangan yang dibangkitkan acak, 159 di antaranya membuat trik polos meleset.',
          }) + `
          <b>Cara mengenalinya di naskah soal.</b> Cari kata yang mengaitkan pilihan dari kelompok berbeda: "tidak boleh bersama", "harus bersama", "kalau A dipilih maka B juga", "berbeda warna". Kalau tidak ada satu pun kata seperti itu, triknya aman dipakai langsung.
          <br><br>Kalau larangannya cuma satu atau dua, kurangi saja pelanggarannya seperti di atas. Kalau larangannya banyak dan saling tumpang tindih, jangan dipaksakan — daftarkan saja kemungkinannya.`,
      }),

      Catatan({
        isi: `<b>Verifikasi 30 detik sebelum menulis jawaban.</b> Tiga pemeriksaan yang menangkap hampir semua kesalahan.
          <br><br>Pertama, kecilkan soalnya. Ganti angka besarnya dengan 2 atau 3, lalu daftarkan semua kemungkinan dengan tangan. Rumusmu harus memberi angka yang sama. Ini pemeriksaan paling ampuh, dan hampir tidak pernah dipakai orang.
          <br><br>Kedua, cek arah jawabannya. Kalau kamu menghitung "setidaknya satu", jawabannya harus <b>lebih kecil</b> daripada total, dan <b>lebih besar</b> daripada nol. Ketiga, kalau ada tahap yang pilihannya nol, seluruh hasilnya harus nol — bukan tahap itu yang dilewati.`,
      }),

    ].join('');

    /* ================= PERILAKU ================= */

    /* ---- Lab 1 · aturan perkalian ---- */
    const hitungKali = () => {
      bukaRumus(ids, 'rumus');
      const p = bacaAngka(ids.s('kb1'));
      if (!p.length) {
        ids.q('viz').innerHTML = '';
        ids.tulis('kbout', 'Tulis angkanya dulu, dipisahkan koma. Misalnya 3, 2, 2.');
        return;
      }
      const negatif = p.filter((x) => x < 0);
      const bersih = p.map((x) => Math.max(0, x));
      const total = M.kKali(bersih);
      ids.q('viz').innerHTML = gambarPohon(bersih);
      ids.tulis('kbout',
`${negatif.length ? merah('Ada angka negatif, dianggap 0.') + '\n\n' : ''}${bersih.map((x, i) =>
  `tahap ${i + 1} : ${x} pilihan${x === 0 ? '  ' + merah('← nol') : ''}`).join('\n')}

${bersih.join(' × ')} = ${hijau(ang(total))}

${total === 0n
  ? merah('Satu tahap tidak punya pilihan sama sekali, jadi seluruhnya mustahil.')
    + '\n' + redup('Angka 0 tidak boleh dilewati begitu saja — ia membatalkan semuanya.')
  : redup('Tiap tahap memecah SETIAP cabang yang sudah ada. Itu perkalian, bukan penjumlahan.')}`);
    };
    ids.klik('kbgo', hitungKali);
    ids.klik('kbsandi', () => {
      const el = ids.q('kb1');
      if (el) el.value = '26, 10, 10, 10';
      hitungKali();
      ids.tulis('kbout', ids.q('kbout').innerHTML +
        `\n\n${redup('Contoh sandi: satu huruf lalu tiga angka. 26 × 10 × 10 × 10 = 26.000.')}`);
    });

    /* ---- Lab 2 · trik +1 lalu −1 ---- */
    const bacaKel = () => bacaAngka(ids.s('tk')).filter((x) => x > 0);

    ids.klik('tgo', () => {
      const uk = bacaKel();
      if (!uk.length) { ids.tulis('tout', 'Tulis ukuran kelompoknya dulu. Misalnya 6, 5, 2, 2.'); return; }
      ids.q('tviz').innerHTML = gambarKelompok(uk, { pakaiTambahan: true });
      const tambah = uk.map((u) => u + 1);
      ids.tulis('tout',
`${uk.length} kelompok, ukurannya ${uk.join(', ')}

Beri tiap kelompok satu pilihan tambahan: "tidak mengirim siapa-siapa".
  ${uk.map((u, i) => `kel ${i + 1} : ${u} + 1 = ${u + 1} pilihan`).join('\n  ')}

  ${tambah.join(' × ')} = ${ang(M.kKali(tambah))}
  buang 1 kemungkinan kosong (semua kelompok memilih tidak mengirim)

  jawaban = ${hijau(ang(M.kSetidaknyaSatu(uk)))}

${redup('Kalau tiap kelompok WAJIB mengirim tepat satu: ' + uk.join(' × ') + ' = ' + ang(M.kTepatSatuTiap(uk)))}
${redup('Kalau boleh kosong semua: ' + ang(M.kKali(tambah)) + ', tanpa dikurangi 1.')}`);
    });

    ids.klik('tlama', () => {
      const uk = bacaKel();
      if (!uk.length) { ids.tulis('tout', 'Tulis ukuran kelompoknya dulu.'); return; }
      if (uk.length > 8) { ids.tulis('tout', 'Terlalu banyak kelompok untuk dirinci di layar — itu justru intinya.'); return; }
      const r = M.kRinciPanjang(uk);
      const tampil = r.suku.slice(0, 20);
      ids.q('tviz').innerHTML = gambarKelompok(uk, { pakaiTambahan: false });
      ids.tulis('tout',
`CARA PANJANG — jumlahkan tiap kemungkinan kelompok mana saja yang mengirim

${tampil.map((s) => `  ${s.pilih.join(' × ').padEnd(16)} = ${ang(s.nilai)}`).join('\n')}${
  r.suku.length > tampil.length ? `\n  ${redup('… dan ' + (r.suku.length - tampil.length) + ' suku lagi')}` : ''}
  ${'─'.repeat(30)}
  ${r.suku.length} suku dijumlahkan = ${hijau(ang(r.total))}

CARA TRIK
  ${uk.map((u) => u + 1).join(' × ')} − 1 = ${hijau(ang(M.kSetidaknyaSatu(uk)))}

${r.total === M.kSetidaknyaSatu(uk) ? hijau('✓ DUA CARA SAMA') : merah('✗ beda')}
${redup('Cara panjang butuh 2^' + uk.length + ' − 1 = ' + r.suku.length + ' suku. Trik butuh ' + uk.length + ' perkalian.')}
${redup('Untuk 10 kelompok bedanya jadi 1.023 suku lawan 11 langkah.')}`);
    });

    /* ---- Lab 3 · komplemen ---- */
    ids.klik('cgo', () => {
      const L = ids.n('cp', { min: 1, maks: 12, bawaan: 4 });
      const S = ids.n('cs', { min: 2, maks: 36, bawaan: 10 });
      const r = M.kKomplemen(L, S);
      ids.tulis('cout',
`Berapa susunan panjang ${L} dari ${S} lambang yang memuat SETIDAKNYA satu lambang tertentu?

CARA LANGSUNG — menjumlah ${L} kasus terpisah:
  tepat 1 lambang itu, tepat 2, … sampai tepat ${L}.
  ${redup('Tiap kasus butuh kombinasi sendiri. Panjang dan gampang salah.')}

CARA KOMPLEMEN — satu pengurangan:
  semua kemungkinan   = ${S}^${L} = ${ang(r.total)}
  yang TANPA lambang itu = ${S - 1}^${L} = ${ang(r.tanpa)}
  ${'─'.repeat(34)}
  yang memuat minimal satu = ${hijau(ang(r.jawab))}

${redup('Pemeriksaan arah: jawabannya harus lebih kecil daripada ' + ang(r.total) + ' dan lebih besar daripada 0.')}`);
    });

    /* ---- Lab 3 · Pascal ---- */
    ids.klik('pgo', () => {
      const n = ids.n('pn', { min: 1, maks: 14, bawaan: 8 });
      const r = ids.n('pr', { min: 0, maks: 14, bawaan: 3 });
      ids.q('pviz').innerHTML = gambarPascal(n, n, r <= n ? r : -1);
      if (r > n) {
        ids.tulis('pout',
`r = ${r} lebih besar daripada n = ${n}.

${hijau('C(' + n + ', ' + r + ') = 0')}   ${redup('kamu tidak bisa mengambil ' + r + ' benda dari ' + n + ' benda.')}
${redup('Perhatikan: jawabannya 0, bukan "ambil semuanya saja". Ini kesalahan yang sering terjadi.')}`);
        return;
      }
      const P = M.kPascal(n);
      ids.tulis('pout',
`C(${n}, ${r}) = ${hijau(ang(M.kKombinasi(n, r)))}

Yang tersorot merah adalah C(${n}, ${r}).
${n > 0 && r > 0 && r < n
  ? `Dua angka hijau di atasnya adalah C(${n - 1}, ${r - 1}) = ${ang(P[n - 1][r - 1])} dan C(${n - 1}, ${r}) = ${ang(P[n - 1][r])}.
${ang(P[n - 1][r - 1])} + ${ang(P[n - 1][r])} = ${hijau(ang(M.kKombinasi(n, r)))}`
  : redup('Angka di tepi segitiga selalu 1 — cuma ada satu cara mengambil semuanya atau tidak sama sekali.')}

${redup('Lewat faktorial kamu harus melewati ' + n + '! = ' + ang(M.kFaktorial(n)) + '.')}
${redup('Lewat segitiga cukup penjumlahan angka kecil.')}`);
    });

    /* ---- Uji sendiri ---- */
    /* Pendaftaran langsung: daftarkan SEMUA kemungkinan satu per satu.
       Lambat, jadi dibatasi. Inilah pembanding yang jujur. */
    const daftarLangsung = (uk) => {
      let hasil = 0n;
      const telusur = (i, adaYangDikirim) => {
        if (i === uk.length) { if (adaYangDikirim) hasil += 1n; return; }
        telusur(i + 1, adaYangDikirim);                 // kelompok ini tidak mengirim
        for (let j = 0; j < uk[i]; j++) telusur(i + 1, true);
      };
      telusur(0, false);
      return hasil;
    };

    ids.klik('ugo', () => {
      const uk = bacaKel();
      if (!uk.length) { ids.tulis('uout', 'Tulis ukuran kelompoknya dulu di Lab 2.'); return; }
      const besar = uk.reduce((a, b) => a * (b + 1), 1);
      const lambat = besar <= 200000 ? daftarLangsung(uk) : null;
      const r = M.kRinciPanjang(uk);
      ids.tulis('uout',
`Kelompok: ${uk.join(', ')}

CARA 1 — trik +1 lalu −1
  ${hijau(ang(M.kSetidaknyaSatu(uk)))}

CARA 2 — jumlahkan ${r.suku.length} suku
  ${hijau(ang(r.total))}

CARA 3 — daftarkan semua kemungkinan satu per satu
  ${lambat === null ? redup('(dilewati, terlalu banyak)') : hijau(ang(lambat))}

${lambat === null
  ? (r.total === M.kSetidaknyaSatu(uk) ? hijau('✓ DUA CARA SAMA') : merah('✗ beda'))
  : (lambat === r.total && r.total === M.kSetidaknyaSatu(uk)
      ? hijau('✓ KETIGANYA SAMA') : merah('✗ ada yang beda'))}`);
    });

    ids.klik('uall', () => {
      let uji = 0, beda = 0, contoh = null;
      for (let putar = 0; putar < 200; putar++) {
        const k = 1 + Math.floor(Math.random() * 5);
        const uk = [...Array(k)].map(() => 1 + Math.floor(Math.random() * 5));
        if (uk.reduce((a, b) => a * (b + 1), 1) > 60000) continue;
        uji++;
        const trik = M.kSetidaknyaSatu(uk);
        if (trik !== daftarLangsung(uk) || trik !== M.kRinciPanjang(uk).total) {
          beda++; if (!contoh) contoh = uk.join(',');
        }
      }
      /* rumus lain ikut diuji pada angka acak, bukan cuma angka soal */
      let bedaLain = 0, ujiLain = 0;
      for (let n = 0; n <= 9; n++) for (let r = 0; r <= n + 2; r++) {
        ujiLain++;
        const P = r > n ? 0n : M.kFaktorial(n) / M.kFaktorial(n - r);
        const C = r > n ? 0n : M.kFaktorial(n) / (M.kFaktorial(r) * M.kFaktorial(n - r));
        if (M.kPermutasi(n, r) !== P || M.kKombinasi(n, r) !== C) bedaLain++;
      }
      ids.tulis('uout',
`Menguji dengan angka ACAK, bukan angka yang kebetulan ada di soal.

  trik +1 lalu −1, diadu dengan pendaftaran satu per satu
    ${beda === 0 ? hijau(uji + ' / ' + uji + ' cocok') : merah((uji - beda) + ' / ' + uji)}

  permutasi dan kombinasi, diadu dengan hitungan faktorial
    ${bedaLain === 0 ? hijau(ujiLain + ' / ' + ujiLain + ' cocok') : merah((ujiLain - bedaLain) + ' / ' + ujiLain)}

${beda === 0 && bedaLain === 0
  ? hijau('✓ TIDAK ADA YANG MELESET') + '\n' + redup('Rumusnya berlaku umum, bukan cuma pas untuk soal OSN-K.')
  : merah('✗ meleset pada ' + contoh)}`);
    });

    /* ---- Bedah soal ---- */
    ids.klik('solve', () => {
      ids.q('sviz').innerHTML = gambarKelompok(ukAyam, { pakaiTambahan: true, nama: kelAyam });
      ids.tulis('s1',
`Kelompokkan ayam yang saling berteman, langsung maupun lewat teman:

${kelAyam.map((k, i) => `  lingkaran ${i + 1} (${k.length} ayam) : ${k.join(' ')}`).join('\n')}

  ${ukAyam.join(' + ')} = ${ukAyam.reduce((a, b) => a + b, 0)} ayam ${hijau('✓ pas 15')}

${hijau('Jawaban: ' + kelAyam.length + ' lingkaran')}`);

      ids.tulis('s2',
`Tiap lingkaran WAJIB mengirim tepat satu wakil.
Ini murni aturan perkalian — pilih satu dari tiap lingkaran.

  ${ukAyam.join(' × ')} = ${hijau(ang(M.kTepatSatuTiap(ukAyam)))}

${redup('Tanpa +1 dan tanpa −1. Tidak ada kelompok yang boleh melewat.')}`);

      const r = M.kRinciPanjang(ukAyam);
      ids.tulis('s3',
`Tiap lingkaran boleh mengirim atau tidak, tapi minimal satu ayam ikut.

  ${ukAyam.map((u) => u + 1).join(' × ')} = ${ang(M.kKali(ukAyam.map((u) => u + 1)))}
  buang 1 kemungkinan kosong
  ${'─'.repeat(26)}
  ${hijau(ang(M.kSetidaknyaSatu(ukAyam)))}

${redup('Cara panjangnya harus menjumlah ' + r.suku.length + ' suku dan hasilnya juga ' + ang(r.total) + '.')}
${redup('Empat kelompok masih bisa dikerjakan tangan. Sepuluh kelompok berarti 1.023 suku.')}`);
    });

    pasangTab('trik');
    pasangTab('samar');
  },
};
