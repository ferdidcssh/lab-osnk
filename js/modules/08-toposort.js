/* ============================================================
   MODUL 08 — LEVEL & TOPOLOGICAL SORT
   Semua rumus di berkas ini dibuktikan oleh
   verify/08-toposort.py — jangan diubah tanpa menjalankannya lagi.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, AreaTeks, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Kode, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

/* ---------- baca daftar prasyarat dari kotak teks ---------- */
function bacaPra(teks) {
  const pre = {};
  teks.split('\n').map((b) => b.trim()).filter(Boolean).forEach((b) => {
    const i = b.indexOf(':');
    if (i < 0) { if (b) pre[b] = pre[b] || []; return; }
    const nama = b.slice(0, i).trim();
    const isi = b.slice(i + 1).split(',').map((s) => s.trim()).filter(Boolean);
    if (nama) pre[nama] = isi;
  });
  /* prasyarat yang belum punya barisnya sendiri tetap didaftarkan */
  Object.values(pre).flat().forEach((p) => { if (!(p in pre)) pre[p] = []; });
  return pre;
}

/* ---------- gambar graf berlapis ---------- */
function gambarGraf(pre, lapis, sorotSampai, idPanah, sorotSimpul) {
  const W = 660, tinggiBaris = 74, atas = 22;
  const H = atas + lapis.length * tinggiBaris + 12;
  const posisi = {};
  lapis.forEach((L, r) => L.forEach((v, k) => {
    posisi[v] = { x: W * (k + 0.5) / L.length, y: atas + r * tinggiBaris, lapis: r + 1 };
  }));
  const lebar = (v) => Math.min(150, Math.max(64, v.length * 6.4 + 14));

  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Graf prasyarat berlapis">`;
  s += `<defs><marker id="${idPanah}" markerWidth="8" markerHeight="8" refX="7" refY="3"
        orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="var(--garis-tebal)"/></marker></defs>`;

  /* garis penghubung digambar dulu supaya berada di belakang kotak */
  Object.keys(pre).forEach((v) => (pre[v] || []).forEach((p) => {
    const a = posisi[p], b = posisi[v];
    if (!a || !b) return;
    const mati = sorotSampai !== null && (a.lapis > sorotSampai || b.lapis > sorotSampai);
    s += `<path d="M ${a.x.toFixed(1)} ${a.y + 13} C ${a.x.toFixed(1)} ${a.y + 40},
          ${b.x.toFixed(1)} ${b.y - 34}, ${b.x.toFixed(1)} ${b.y - 15}"
          fill="none" stroke="${mati ? 'var(--garis)' : 'var(--garis-tebal)'}"
          stroke-width="1.5" marker-end="url(#${idPanah})"/>`;
  }));

  /* kotak kegiatan */
  Object.keys(posisi).forEach((v) => {
    const p = posisi[v], w = lebar(v);
    const terkupas = sorotSampai !== null && p.lapis <= sorotSampai;
    const disorot = sorotSimpul === v;
    const isi = disorot ? 'var(--stabilo)' : terkupas ? 'var(--kertas)' : 'var(--putih)';
    const garis = disorot ? 'var(--tinta)' : terkupas ? 'var(--garis-tebal)' : 'var(--tinta)';
    const warna = terkupas && !disorot ? 'var(--tinta-3)' : 'var(--tinta)';
    s += `<rect x="${(p.x - w / 2).toFixed(1)}" y="${p.y - 13}" width="${w}" height="26" rx="6"
          fill="${isi}" stroke="${garis}" stroke-width="${disorot ? 2.5 : 1.8}"/>`;
    s += `<text x="${p.x.toFixed(1)}" y="${p.y + 4}" text-anchor="middle"
          style="font-family:var(--body);font-size:10.5px;font-weight:600;fill:${warna}
          ${terkupas && !disorot ? ';text-decoration:line-through' : ''}">${v}</text>`;
  });

  /* label lapis di kiri */
  lapis.forEach((L, r) => {
    s += `<text x="3" y="${atas + r * tinggiBaris + 4}"
          style="font-family:var(--mono);font-size:10px;fill:var(--tinta-3)">L${r + 1}</text>`;
  });
  return s + '</svg>';
}

const CONTOH24 = `Memotong sayuran:
Memasak air:
Menyiapkan alat mandi:
Membuat sup: Memotong sayuran, Memasak air
Mandi air hangat: Memasak air, Menyiapkan alat mandi
Membuat teh: Memasak air
Makan sup: Membuat sup
Minum teh: Membuat teh, Makan sup
Tidur: Makan sup, Mandi air hangat, Minum teh`;

export default {
  id: 'toposort', n: '08', kelompok: 'Graf',
  judul: 'Level & Topological Sort',
  lede: 'Kegiatan yang punya prasyarat: yang satu harus selesai dulu sebelum yang lain boleh mulai. Cara tercepat mengerjakannya di kertas bukan menelusuri jalur, tapi mengupas berlapis — dan itu selesai dalam satu sapuan.',
  lencana: ['<span class="chip r">2024 &amp; 2025</span>', '<span class="chip v">Diuji lengkap pada soal aslinya</span>'],

  kartu: [
    { q: '“Kegiatan B hanya bisa dilakukan kalau kegiatan A sudah selesai”', a: 'graf', why: 'Prasyarat = graf berarah. Kupas berlapis, atau hitung leluhurnya.' },
    { q: '“Pada urutan ke berapa paling awal kegiatan X bisa ditaruh?”', a: 'graf', why: 'Hitung semua leluhur X, lalu tambah 1. Jangan tertukar dengan level.' },
  ],
  kamus: [
    ['“prasyarat”, “harus selesai dulu”, panah antar kegiatan', 'Kupas berlapis (level)'],
    ['“urutan ke berapa paling awal”', 'Hitung leluhur + 1 — BUKAN level'],
    ['ada durasi tiap kegiatan', 'Jalur kritis: durasi + prasyarat terlama'],
  ],

  bangun(root, { ids, pasangTab }) {
    const I = (t) => ids.i(t);

    root.innerHTML = [

      /* ===== APA ITU ===== */
      Kartu({
        judul: 'Apa itu Level & Topological Sort?',
        isi: `
        <p style="margin:10px 0">Bayangkan kamu mau bikin teh. Kamu tidak bisa menuang teh sebelum airnya mendidih, dan tidak bisa merebus air sebelum menyalakan kompor. Ada <b>urutan yang wajib</b>.</p>
        <p style="margin:10px 0">Kalau kegiatannya cuma tiga, gampang diurutkan di kepala. Tapi kalau ada sembilan kegiatan yang saling bergantung — seperti di soal OSN-K 2024 — kamu butuh cara yang rapi.</p>
        <p style="margin:10px 0"><b>Topological sort</b> artinya menyusun semua kegiatan jadi satu barisan, dengan syarat: setiap kegiatan selalu muncul <b>setelah</b> semua prasyaratnya. <b>Level</b> adalah cara mengelompokkannya — kegiatan yang bisa dikerjakan bersamaan masuk level yang sama.</p>` +
        Catatan({ jenis: 'awas', isi: `<b>Ini yang paling sering bikin salah jawab.</b> "Level" dan "urutan ke-berapa" itu <b>dua angka yang berbeda</b>, dan soal OSN-K memakai keduanya.
        <br><br>Contoh dari soal 2024: kegiatan "Minum teh" ada di <b>level 4</b>. Tapi kalau kegiatan harus dikerjakan <b>satu per satu</b>, posisi paling awal untuk Minum teh adalah <b>urutan ke-6</b>.
        <br><br>Bedanya dari mana? Level cuma menghitung <b>rantai terpanjang</b> menuju kegiatan itu. Sementara posisi urutan harus memasukkan <b>semua</b> kegiatan yang wajib duluan — termasuk yang jalurnya beda-beda.
        <br><br>Baca soalnya baik-baik: kalau boleh dikerjakan bersamaan, pakai level. Kalau satu per satu, hitung leluhurnya.` }) +
        Catatan({ isi: `<b>Satu syarat penting.</b> Susunan seperti ini hanya mungkin kalau <b>tidak ada lingkaran</b> di antara prasyaratnya.
        <br><br>Kalau A butuh B, B butuh C, dan C butuh A — ketiganya saling menunggu selamanya. Tidak ada yang bisa mulai. Soal BENAR/SALAH sering memakai jebakan ini.` }) +
        `<h4 style="margin:18px 0 6px;font-size:14px">Kenapa penting untuk OSN-K?</h4>
        <p class="tiny" style="margin:0">Karena bentuk ini gampang sekali disamarkan — kegiatan harian, jadwal pelatihan, modul software, resep masakan. Sudah muncul di <b>2024</b> (urutan kegiatan malam) dan <b>2025</b> (jadwal pelatihan dengan durasi), dengan pertanyaan yang berbeda-beda.</p>`,
      }),

      /* ===== LAB 1: KUPAS BERLAPIS ===== */
      Lab({
        judul: 'Lab 1 · Kupas berlapis', petunjuk: 'teknik kertas yang paling cepat',
        isi:
          `<p style="margin:0 0 12px">Caranya begini. Coret semua kegiatan yang <b>prasyaratnya sudah tidak ada</b> — itu lapis 1. Sekarang coret lagi yang prasyaratnya sudah tercoret semua — itu lapis 2. Ulangi sampai habis.</p>
           <p style="margin:0 0 12px"><b>Nomor lapisnya itulah levelnya.</b> Tidak perlu menelusuri jalur apa pun.</p>` +
          AreaTeks({ ids, id: 'pra', label: 'daftar prasyarat — tulis "kegiatan: prasyarat1, prasyarat2"', nilai: CONTOH24, baris: 9 }) +
          Kontrol({
            ids, kolom: [],
            tombol: [
              { id: 'satu', teks: 'Kupas satu lapis' },
              { id: 'semua', teks: 'Kupas sampai habis', gaya: 'alt' },
              { id: 'ulang', teks: 'Ulang', gaya: 'alt' },
            ],
          }) +
          Wadah({ ids, id: 'graf', gaya: 'margin:12px 0' }) +
          Keluaran({ ids, id: 'out' }),
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Aturan level',
        isi: `level kegiatan tanpa prasyarat = <mark>1</mark><br>
              level kegiatan lain = <mark>1 + level tertinggi dari prasyaratnya</mark><br>
              <span style="font-size:12.5px;color:var(--tinta-2)">hasilnya sama persis dengan nomor lapis saat dikupas</span>`,
        verifikasi: 'Sudah diuji: nomor lapis selalu sama dengan level',
        pesan: 'Kupas dulu di Lab 1 — aturannya lebih nempel kalau kamu lihat sendiri.',
      }),

      /* ===== LAB 2: HITUNG LELUHUR ===== */
      Lab({
        judul: 'Lab 2 · Trik hitung leluhur — yang paling terasa curang', petunjuk: 'tanpa menyusun urutannya sama sekali',
        isi:
          `<p style="margin:0 0 12px">Kalau soal tanya <b>"pada urutan ke berapa paling awal"</b>, kebanyakan orang mencoba menyusun urutannya dengan coba-coba. Lama, dan gampang keliru.</p>
           <p style="margin:0 0 14px">Padahal ada cara yang jauh lebih pendek: <b>hitung saja ada berapa kegiatan yang wajib duluan, lalu tambah 1</b>. Selesai. Kamu tidak perlu menyusun apa pun.</p>` +
          Kontrol({
            ids, kolom: [{ id: 'target', label: 'kegiatan yang dicari', nilai: 'Minum teh', jenis: 'teks', lebar: true }],
            tombol: [{ id: 'lgo', teks: 'Hitung leluhurnya' }],
          }) +
          Wadah({ ids, id: 'lviz', gaya: 'margin:12px 0' }) +
          Keluaran({ ids, id: 'lout' }),
      }),

      Catatan({ jenis: 'baik', isi: `<b>Kenapa boleh begitu?</b> Semua leluhur wajib berada di depan kegiatan itu — tidak ada pilihan lain. Jadi paling cepat pun, kegiatan itu baru bisa muncul setelah semuanya lewat.
        <br><br>Dan angka itu memang <b>bisa dicapai</b>: susun saja semua leluhurnya dulu (mereka sendiri tidak saling bertabrakan), baru kegiatan itu. Jadi bukan cuma batas bawah — itu jawabannya.
        <span class="tiny" style="display:block;margin-top:6px">✅ Sudah diuji dengan mencoba SEMUA urutan yang mungkin pada soal 2024: rumus ini cocok untuk kesembilan kegiatan.</span>` }),

      /* ===== LAB 3: DURASI ===== */
      Lab({
        judul: 'Lab 3 · Kalau tiap kegiatan punya durasi', petunjuk: 'soal 2025 memakai ini',
        isi:
          `<p style="margin:0 0 12px">Kadang tiap kegiatan butuh waktu berbeda. Kalau boleh dikerjakan berbarengan, total waktunya ditentukan oleh <b>rangkaian terpanjang</b> — bukan oleh jumlah semua durasi.</p>` +
          AreaTeks({ ids, id: 'dpra', label: 'tulis "kegiatan (durasi): prasyarat1, prasyarat2"', baris: 8,
            nilai: `CPP (7):\nAA (3): CPP\nDS (5): CPP\nDNC (1): DS\nDP (4): DNC\nBF (6): AA, DS\nGRE (2): BF, DP` }) +
          Kontrol({ ids, kolom: [], tombol: [{ id: 'dgo', teks: 'Hitung waktu selesai' }] }) +
          Keluaran({ ids, id: 'dout' }),
      }),

      /* ===== CARA CEPAT ===== */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Semuanya sudah diadu dengan pemeriksaan menyeluruh pada soal aslinya.',
        isi: Tab({
          ids, id: 'trik', daftar: [
            {
              kunci: 'k1', judul: 'Baca soalnya dulu',
              isi: `<p style="margin:0 0 10px">Ini langkah <b>pertama dan paling menentukan</b>. Tiga pertanyaan yang mirip, tapi cara hitungnya berbeda:</p>` +
                `<div class="scroll"><table class="t" style="text-align:left">
                  <tr><th style="text-align:left">Kalau soal tanya…</th><th style="text-align:left">Pakai cara ini</th></tr>
                  <tr><td style="text-align:left">"minimal berapa <b>hari/tahap</b>?" (boleh barengan)</td><td style="text-align:left">level tertinggi = <b>banyak lapis</b></td></tr>
                  <tr><td style="text-align:left">"pada <b>urutan ke berapa</b>?" (satu per satu)</td><td style="text-align:left"><b>banyak leluhur + 1</b></td></tr>
                  <tr><td style="text-align:left">ada <b>durasi</b> tiap kegiatan</td><td style="text-align:left"><b>jalur kritis</b> — durasi + prasyarat terlama</td></tr>
                </table></div>` +
                Catatan({ jenis: 'awas', isi: '<b>Jebakan yang paling sering makan korban:</b> memakai level padahal soal minta urutan. Di soal 2024, level Minum teh adalah 4 tapi jawaban yang benar 6. Dua-duanya angka "masuk akal", jadi kalau salah pilih kamu tidak akan sadar.' }),
            },
            {
              kunci: 'k2', judul: 'Kupas berlapis',
              isi: `<p style="margin:0 0 10px">Cara paling cepat menghitung level di kertas. Tidak perlu menelusuri jalur satu-satu.</p>` +
                Rumus({
                  label: 'Tiga langkah',
                  isi: `1. coret semua yang <mark>tidak punya prasyarat</mark> → lapis 1<br>
                        2. coret lagi yang prasyaratnya <mark>sudah tercoret semua</mark> → lapis 2<br>
                        3. ulangi sampai habis`,
                  verifikasi: 'Sudah diuji: nomor lapis == level',
                }) +
                `<p class="tiny">Yang enak dari cara ini: kamu tidak pernah perlu mengingat jalur. Cukup lihat "prasyaratnya sudah tercoret belum". Kalau semua sudah, coret.</p>` +
                Catatan({ isi: '<b>Bonus:</b> kalau di suatu putaran <b>tidak ada satu pun</b> yang bisa dicoret padahal masih ada sisa, berarti ada <b>lingkaran</b> — dan soalnya tidak punya jawaban. Ini cara tercepat mendeteksinya.' }),
            },
            {
              kunci: 'k3', judul: 'Hitung leluhur',
              isi: `<p style="margin:0 0 10px">Untuk pertanyaan "urutan ke berapa paling awal".</p>` +
                Rumus({
                  label: 'Rumusnya',
                  isi: `posisi paling awal = <mark>banyaknya leluhur + 1</mark>`,
                  verifikasi: 'Sudah diuji dengan mencoba semua urutan pada soal 2024',
                }) +
                `<p style="margin:10px 0"><b>Cara menghitung leluhur di kertas:</b> mulai dari kegiatan yang dicari, telusuri mundur lewat panah. Tandai semua yang kamu lewati. Yang ditandai itulah leluhurnya.</p>
                 <div class="out">Contoh soal 2024 — leluhur "Minum teh":

  Minum teh ← Membuat teh, Makan sup
  Membuat teh ← Memasak air
  Makan sup ← Membuat sup
  Membuat sup ← Memotong sayuran, Memasak air

  Yang tertandai: Membuat teh, Makan sup, Membuat sup,
                  Memotong sayuran, Memasak air  → ${hijau('5')}

  posisi paling awal = 5 + 1 = ${hijau('6')}</div>` +
                Catatan({ jenis: 'awas', isi: '<b>Jangan menghitung ganda.</b> "Memasak air" muncul dua kali di penelusuran (lewat Membuat teh dan lewat Membuat sup), tapi tetap dihitung <b>satu</b>. Coret nama yang sudah tertandai supaya tidak terhitung dua kali.' }),
            },
            {
              kunci: 'k4', judul: 'Jalur kritis',
              isi: `<p style="margin:0 0 10px">Kalau tiap kegiatan punya durasi dan boleh dikerjakan berbarengan.</p>` +
                Rumus({
                  label: 'Waktu selesai tiap kegiatan',
                  isi: `selesai(v) = <mark>durasi(v) + waktu selesai prasyarat yang PALING LAMBAT</mark><br>
                        total = <mark>waktu selesai yang paling besar</mark>`,
                  verifikasi: 'Sudah diuji pada soal 2025',
                }) +
                `<div class="out" style="margin-top:12px">Soal 2025:

  CPP (7)  tanpa prasyarat        → selesai hari 7
  AA  (3)  butuh CPP(7)           → 7 + 3  = 10
  DS  (5)  butuh CPP(7)           → 7 + 5  = 12
  DNC (1)  butuh DS(12)           → 12 + 1 = 13
  DP  (4)  butuh DNC(13)          → 13 + 4 = 17
  BF  (6)  butuh AA(10) & DS(12)  → 12 + 6 = 18   ${redup('ambil yang terlambat')}
  GRE (2)  butuh BF(18) & DP(17)  → 18 + 2 = ${hijau('20')}

  Jalur kritisnya: CPP → DS → BF → GRE
                   7  +  5 +  6 +  2 = ${hijau('20')} hari</div>` +
                Catatan({ jenis: 'awas', isi: '<b>Jangan dijumlahkan semua.</b> Total durasi ketujuh pelatihan itu 28 hari, tapi jawabannya 20 — karena beberapa bisa dikerjakan berbarengan. Dan jangan pakai level juga: level tertinggi di soal itu 5, bukan 20.' }),
            },
            {
              kunci: 'k5', judul: 'Cek instan',
              isi: `<p style="margin:0 0 10px">Empat hal untuk membuang pilihan jawaban yang salah:</p>` +
                Rumus({
                  isi: `1. kegiatan tanpa prasyarat <mark>selalu level 1</mark> dan bisa ditaruh di urutan 1<br><br>
                        2. level anak <mark>selalu lebih besar</mark> dari level prasyaratnya<br><br>
                        3. "urutan ke-berapa" <mark>tidak pernah lebih kecil</mark> dari levelnya<br><br>
                        4. banyaknya lapis <mark>tidak pernah melebihi</mark> banyaknya kegiatan`,
                  verifikasi: 'Sudah diuji pada soal aslinya',
                }) +
                `<p class="tiny">Sifat nomor 3 berguna sebagai pemeriksa cepat: kalau jawabanmu untuk "urutan ke-berapa" ternyata lebih kecil dari levelnya, pasti ada yang salah.</p>`,
            },
            {
              kunci: 'k6', judul: 'Variasi lain',
              isi: `<p style="margin:0 0 10px">Bentuk pertanyaan lain yang mungkin muncul, dan cara menanganinya:</p>` +
                `<div class="scroll"><table class="t" style="text-align:left">
                  <tr><th style="text-align:left">Pertanyaan</th><th style="text-align:left">Caranya</th></tr>
                  <tr><td style="text-align:left">"urutan ke berapa <b>paling akhir</b>?"</td><td style="text-align:left">total kegiatan − banyaknya keturunan</td></tr>
                  <tr><td style="text-align:left">"apakah urutannya <b>tunggal</b>?"</td><td style="text-align:left">tunggal hanya kalau tiap lapis isinya satu</td></tr>
                  <tr><td style="text-align:left">"ada berapa <b>urutan sah</b>?"</td><td style="text-align:left">hitung dengan menelusuri — tidak ada rumus pendek</td></tr>
                  <tr><td style="text-align:left">"mana yang bisa <b>berbarengan</b>?"</td><td style="text-align:left">yang selevel dan tidak saling jadi leluhur</td></tr>
                  <tr><td style="text-align:left">"apakah susunannya <b>mungkin</b>?"</td><td style="text-align:left">mungkin, asal tidak ada lingkaran</td></tr>
                </table></div>` +
                Catatan({ isi: '<b>Untuk "paling akhir":</b> logikanya kebalikan. Semua <b>keturunan</b> wajib berada di belakang kegiatan itu. Jadi posisi paling akhir = total kegiatan dikurangi banyaknya keturunan.' }),
            },
          ],
        }),
      }),

      /* ===== PENYAMARAN ===== */
      Kartu({
        judul: 'Penyamaran',
        sub: 'Ceritanya berganti-ganti, tapi yang dicari selalu sama: apa yang harus selesai duluan.',
        isi: Tab({
          ids, id: 'samar', daftar: [
            {
              kunci: 'a', judul: 'A · Kegiatan harian',
              isi: Catatan({ isi: '"Ada 9 kegiatan malam. Kalau ada panah dari kegiatan A ke kegiatan B, artinya B hanya bisa dilakukan setelah A selesai. Pada urutan ke berapa paling awal kegiatan Minum teh bisa dirancang?"' }) +
                '<p class="tiny">Bentuk asli OSN-K 2024. Perhatikan kata <b>"urutan ke berapa"</b> — berarti satu per satu, jadi hitung leluhur, bukan level.</p>',
            },
            {
              kunci: 'b', judul: 'B · Jadwal dengan durasi',
              isi: Catatan({ isi: '"Tiap pelatihan punya durasi dan daftar prasyarat. Dalam satu hari boleh mengikuti lebih dari satu pelatihan, tapi pelatihan tidak bisa dipotong di tengah. Berapa waktu minimum untuk menyelesaikan semuanya?"' }) +
                '<p class="tiny">Bentuk asli OSN-K 2025. Kata <b>"boleh lebih dari satu"</b> artinya boleh berbarengan, dan ada <b>durasi</b> — jadi ini jalur kritis.</p>',
            },
            {
              kunci: 'c', judul: 'C · Modul software',
              isi: Catatan({ isi: '"Sebuah proyek terdiri dari beberapa modul. Modul B baru bisa dikompilasi setelah modul A selesai. Berapa gelombang kompilasi minimum, kalau dalam satu gelombang boleh banyak modul asal dependensinya sudah beres?"' }) +
                '<p class="tiny">Kata "dependensi" menggantikan "prasyarat", "gelombang" menggantikan "tahap". Isinya sama: hitung banyaknya lapis.</p>',
            },
            {
              kunci: 'd', judul: 'D · Kode',
              isi: Kode(`<span class="kw">while</span> (masih ada kegiatan tersisa) {
  cari semua yang sisa prasyaratnya nol;
  keluarkan dari daftar;
  kurangi hitungan prasyarat kegiatan yang bergantung padanya;
}`) +
                Catatan({ isi: '<b>Ini kupas berlapis yang ditulis sebagai kode.</b> "Sisa prasyarat nol" artinya semua yang harus duluan sudah beres. Kalau kamu lihat pola ini di Bagian C, kamu tahu itu topological sort — dan kamu bisa langsung membayangkan lapisannya.' }),
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: Catatan({ jenis: 'awas', isi: '"A harus sebelum B, B harus sebelum C, dan C harus sebelum A."' }) +
                '<p class="tiny">Ada <b>lingkaran</b> — ketiganya saling menunggu. Tidak ada urutan yang sah. Kalau soal BENAR/SALAH menanyakan "apakah bisa disusun", jawabannya SALAH.</p>' +
                Catatan({ jenis: 'awas', isi: '"Ayam X berteman ayam Y. Kalau X berteman Y dan Y berteman Z, maka X juga berteman Z. Ada berapa lingkaran pertemanan?"' }) +
                '<p class="tiny">Ini <b>bukan</b> topological sort. Pertemanan itu dua arah, tidak ada yang "duluan". Yang dicari adalah <b>kelompok yang saling terhubung</b> — konsep berbeda.</p>',
            },
          ],
        }),
      }),

      /* ===== BEDAH SOAL ===== */
      Kartu({
        judul: 'Bedah soal asli OSN-K',
        sub: 'Dua tahun, dua pertanyaan yang berbeda dari struktur yang mirip. Perhatikan bagaimana kata-kata di soal menentukan cara hitungnya.',
        isi: Kisi([
          KartuSoal({ ids, nomor: '2024 · Soal 2', pertanyaan: '9 kegiatan malam dengan prasyarat. Pada urutan ke berapa paling awal kegiatan "Minum teh" bisa dirancang?', idKeluaran: 's1' }),
          KartuSoal({ ids, nomor: '2025 · Soal 9', pertanyaan: '7 pelatihan dengan durasi dan prasyarat. Berapa waktu minimum untuk menyelesaikan semuanya?', idKeluaran: 's2' }),
        ]) + `<button class="btn" id="${I('solve')}" style="margin-top:14px">Selesaikan keduanya</button>`,
      }),

      Catatan({
        jenis: 'awas', isi: `<b>Ringkasan bedanya.</b>
        <table class="t" style="margin-top:10px;background:transparent">
          <tr><th style="text-align:left">Yang ditanya</th><th style="text-align:left">Caranya</th><th style="text-align:left">Jawaban soal 2024</th></tr>
          <tr><td style="text-align:left">minimal berapa tahap</td><td style="text-align:left">banyaknya lapis</td><td style="text-align:left">5</td></tr>
          <tr><td style="text-align:left">level "Minum teh"</td><td style="text-align:left">1 + level prasyarat tertinggi</td><td style="text-align:left">4</td></tr>
          <tr><td style="text-align:left"><b>urutan ke berapa "Minum teh"</b></td><td style="text-align:left"><b>banyak leluhur + 1</b></td><td style="text-align:left"><b>6</b> ✅</td></tr>
        </table>
        <span style="display:block;margin-top:10px">Tiga angka berbeda dari satu gambar yang sama. Itulah kenapa membaca soalnya baik-baik lebih penting daripada hafal rumus.</span>`,
      }),

      Catatan({ isi: '<b>Biasakan cek 30 detik sebelum menjawab.</b>' +
        '<br><br><b>Satu.</b> Pastikan tidak ada lingkaran. Coba kupas — kalau macet, berarti ada.' +
        '<br><br><b>Dua.</b> Cek jawabanmu masuk akal. "Urutan ke-berapa" tidak boleh lebih kecil dari levelnya. Juga tidak boleh lebih besar dari total kegiatan.' +
        '<br><br><b>Tiga.</b> Baca ulang kata kunci di soal. "Boleh bersamaan" berarti level. "Satu per satu" berarti hitung leluhur.' }),

    ].join('');

    /* ================= PERILAKU ================= */
    let lapis = null, sampai = 0, preAktif = null;

    function siapkan() {
      preAktif = bacaPra(ids.q('pra').value);
      lapis = M.topoKupas(preAktif);
      sampai = 0;
      if (!lapis) {
        ids.q('graf').innerHTML = '';
        const lv = M.levels(preAktif);
        const buruk = Object.keys(lv).filter((k) => isNaN(lv[k]));
        ids.tulis('out', `${merah('✗ ADA LINGKARAN')}

Kegiatan berikut saling menunggu, jadi tidak ada urutan yang sah:
  ${buruk.join(', ')}

${redup('Coba periksa: apakah ada kegiatan yang secara tidak langsung\nmenjadi prasyarat bagi dirinya sendiri?')}`);
        return false;
      }
      gambar();
      return true;
    }
    function gambar() {
      ids.q('graf').innerHTML = gambarGraf(preAktif, lapis, sampai || null, ids.i('panah'), null);
    }
    function ringkas() {
      const lv = M.levels(preAktif);
      let s = '';
      lapis.forEach((L, i) => { s += `  lapis ${i + 1}:  ${L.join(', ')}\n`; });
      ids.tulis('out', `${s}
${hijau(`Banyaknya lapis = ${lapis.length}`)}   ${redup('(= level tertinggi)')}

${redup('Kalau boleh dikerjakan bersamaan, semua selesai dalam ' + lapis.length + ' tahap.\nKalau harus satu per satu, butuh ' + Object.keys(preAktif).length + ' urutan.')}`);
      bukaRumus(ids, 'rumus');
    }

    ids.klik('ulang', () => { if (siapkan()) ids.tulis('out', `Siap. Ada ${Object.keys(preAktif).length} kegiatan.\nTekan <b>Kupas satu lapis</b> untuk melihat prosesnya pelan-pelan.`); });
    ids.klik('satu', () => {
      if (!lapis) { if (!siapkan()) return; }
      if (sampai >= lapis.length) { sampai = 0; gambar(); ids.tulis('out', 'Sudah habis — diulang dari awal.'); return; }
      sampai++;
      gambar();
      const L = lapis[sampai - 1];
      ids.tulis('out', `Lapis ${sampai}: ${hijau(L.join(', '))}
  ${redup(L.length === 1 ? 'satu kegiatan siap dikerjakan' : L.length + ' kegiatan ini bisa dikerjakan bersamaan')}

${sampai < lapis.length
          ? redup('Sekarang prasyarat mereka sudah tercoret. Tekan lagi untuk lapis berikutnya.')
          : hijau(`Habis. Total ${lapis.length} lapis.`)}`);
      if (sampai === lapis.length) bukaRumus(ids, 'rumus');
    });
    ids.klik('semua', () => {
      if (!lapis) { if (!siapkan()) return; }
      sampai = lapis.length; gambar(); ringkas();
    });
    siapkan();
    ids.tulis('out', `Siap. Ada ${Object.keys(preAktif).length} kegiatan.\nTekan <b>Kupas satu lapis</b> untuk melihat prosesnya pelan-pelan.`);

    /* ---- Lab 2: hitung leluhur ---- */
    ids.klik('lgo', () => {
      const pre = bacaPra(ids.q('pra').value);
      const cari = ids.s('target').trim();
      const nama = Object.keys(pre).find((v) => v.toLowerCase() === cari.toLowerCase());
      if (!nama) {
        ids.q('lviz').innerHTML = '';
        ids.tulis('lout', merah(`Kegiatan "${cari}" tidak ada di daftar Lab 1.`) +
          `\n\nYang tersedia:\n  ${Object.keys(pre).join('\n  ')}`);
        return;
      }
      const lel = M.topoLeluhur(pre, nama);
      const lv = M.levels(pre);
      const lp = M.topoKupas(pre);
      if (lp) ids.q('lviz').innerHTML = gambarGraf(pre, lp, null, ids.i('panah2'), nama);
      const daftar = [...lel].sort();
      ids.tulis('lout', `Kegiatan: ${hijau(nama)}

Telusuri mundur lewat panah, tandai semua yang dilewati:
${daftar.map((v, i) => `  ${i + 1}. ${v}`).join('\n') || '  (tidak ada — kegiatan ini tidak butuh prasyarat)'}

  banyaknya leluhur = ${hijau(lel.size)}
  posisi paling awal = ${lel.size} + 1 = ${hijau(lel.size + 1)}

${redup('Bandingkan dengan levelnya: ' + (isNaN(lv[nama]) ? '(ada lingkaran)' : lv[nama]) + '.')}
${!isNaN(lv[nama]) && lel.size + 1 !== lv[nama]
          ? merah(`Perhatikan — dua angka ini BERBEDA (${lv[nama]} vs ${lel.size + 1}).`) +
            `\n${redup('Level cuma menghitung rantai terpanjang. Posisi urutan harus\nmemasukkan semua leluhur, termasuk yang jalurnya berbeda.')}`
          : redup('Kebetulan kedua angka ini sama, tapi tidak selalu begitu.')}`);
    });
    ids.q('lgo').click();

    /* ---- Lab 3: durasi ---- */
    ids.klik('dgo', () => {
      const baris = ids.q('dpra').value.split('\n').map((b) => b.trim()).filter(Boolean);
      const pre = {}, dur = {};
      baris.forEach((b) => {
        const i = b.indexOf(':');
        const kepala = (i < 0 ? b : b.slice(0, i)).trim();
        const m = kepala.match(/^(.*?)\s*\((\d+)\)\s*$/);
        const nama = (m ? m[1] : kepala).trim();
        if (!nama) return;
        dur[nama] = m ? parseInt(m[2], 10) : 1;
        pre[nama] = i < 0 ? [] : b.slice(i + 1).split(',').map((s) => s.trim()).filter(Boolean);
      });
      Object.values(pre).flat().forEach((p) => { if (!(p in pre)) { pre[p] = []; dur[p] = dur[p] || 1; } });
      if (!M.topoKupas(pre)) { ids.tulis('dout', merah('✗ Ada lingkaran — tidak ada urutan yang sah.')); return; }
      const fin = M.topoSelesai(pre, dur);
      const urut = M.topoUrutan(pre);
      const total = Math.max(...Object.values(fin));
      const jk = M.topoJalurKritis(pre, dur);
      const totalDurasi = Object.values(dur).reduce((a, b) => a + b, 0);
      ids.tulis('dout', urut.map((v) => {
        const p = pre[v] || [];
        const mulai = p.length ? Math.max(...p.map((q) => fin[q])) : 0;
        return `  ${v.padEnd(6)} durasi ${String(dur[v]).padStart(2)}  mulai hari ${String(mulai).padStart(2)}  selesai hari ${String(fin[v]).padStart(2)}`;
      }).join('\n') + `

${hijau('Total waktu = ' + total)}

Jalur kritisnya: ${hijau(jk.join(' → '))}
  ${jk.map((v) => dur[v]).join(' + ')} = ${total}

${redup(`Kalau semua dijumlahkan mentah-mentah: ${totalDurasi}. Jauh lebih besar,\nkarena beberapa kegiatan sebenarnya bisa dikerjakan berbarengan.`)}`);
    });
    ids.q('dgo').click();

    /* ---- bedah soal ---- */
    ids.klik('solve', () => {
      const pre = bacaPra(CONTOH24);
      const lel = M.topoLeluhur(pre, 'Minum teh');
      const lv = M.levels(pre);
      const lp = M.topoKupas(pre);
      ids.tulis('s1', `Kata kuncinya: ${hijau('"pada urutan ke berapa"')}
Berarti dikerjakan satu per satu — jadi hitung leluhur.

Telusuri mundur dari "Minum teh":
  ← Membuat teh, Makan sup
  Membuat teh ← Memasak air
  Makan sup ← Membuat sup
  Membuat sup ← Memotong sayuran, Memasak air

Yang tertandai (Memasak air cuma dihitung sekali):
  ${[...lel].sort().join(', ')}
  ada ${hijau(lel.size)} kegiatan

  posisi paling awal = ${lel.size} + 1 = ${hijau(lel.size + 1)}

${merah('Jangan tertukar:')} level "Minum teh" cuma ${lv['Minum teh']},
dan banyaknya lapis ${lp.length}. Yang benar untuk soal ini: ${hijau(lel.size + 1)}.`);

      const pre25 = { CPP: [], AA: ['CPP'], DS: ['CPP'], DNC: ['DS'], DP: ['DNC'], BF: ['AA', 'DS'], GRE: ['BF', 'DP'] };
      const dur = { CPP: 7, AA: 3, DS: 5, DNC: 1, DP: 4, BF: 6, GRE: 2 };
      const fin = M.topoSelesai(pre25, dur), jk = M.topoJalurKritis(pre25, dur);
      ids.tulis('s2', `Kata kuncinya: ${hijau('"boleh lebih dari satu pelatihan sehari"')}
Berarti boleh berbarengan, dan ada durasi — jadi jalur kritis.

  CPP (7)  tanpa prasyarat       → ${fin.CPP}
  AA  (3)  butuh CPP(${fin.CPP})          → ${fin.AA}
  DS  (5)  butuh CPP(${fin.CPP})          → ${fin.DS}
  DNC (1)  butuh DS(${fin.DS})           → ${fin.DNC}
  DP  (4)  butuh DNC(${fin.DNC})          → ${fin.DP}
  BF  (6)  butuh AA(${fin.AA}) & DS(${fin.DS})  → ${fin.BF}  ${redup('ambil yang terlambat')}
  GRE (2)  butuh BF(${fin.BF}) & DP(${fin.DP})  → ${hijau(fin.GRE)}

Jalur kritis: ${hijau(jk.join(' → '))} = ${jk.map((v) => dur[v]).join('+')} = ${hijau(fin.GRE)}

${merah('Jangan tertukar:')} total semua durasi ${Object.values(dur).reduce((a, b) => a + b, 0)} hari (terlalu besar),
level tertinggi cuma ${Math.max(...Object.values(M.levels(pre25)))} (bukan satuan hari). Yang benar: ${hijau(fin.GRE + ' hari')}.`);
    });

    pasangTab('trik'); pasangTab('samar');
  },
};
