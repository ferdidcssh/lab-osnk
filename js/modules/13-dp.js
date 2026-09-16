/* ============================================================
   MODUL 13 — DYNAMIC PROGRAMMING
   Soal utama: OSN-K 2026 nomor 14-16, Jadwal Pembinaan Tim Olimpiade.

   Semua rumus dan angka dibuktikan verify/13-dp.py — DP diadu dengan
   pencarian menyeluruh (coba SEMUA 4^N jadwal) pada ratusan soal acak
   berpoin dan bermasa jeda berbeda-beda, bukan cuma soal OSN-K.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, AreaTeks, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Tabel, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

/* ---------- tabel poin OSN-K 2026 ---------- */
const POIN_1415 = [[2,2,2,2,2,2,2,2,2,2],
                   [3,3,3,3,3,3,3,3,3,3],
                   [5,5,5,5,5,5,5,5,5,5]];
const POIN_16 = [[2,2,2,1,7,8,4,5,3,4],
                 [3,3,3,1,5,6,9,7,5,6],
                 [5,5,5,1,4,3,5,6,8,9]];
const NAMA = ['T', 'O', 'K'];

/* ---------- TABEL DP ----------
   Menggambar tabel 4 baris: T, O, K, dan Istirahat. Sel yang menang
   di tiap kolom disorot, supaya siswa melihat rantai keputusannya. */
function gambarTabel(poin, hasil, { sorotJadwal = null } = {}) {
  const N = poin[0].length;
  const baris = [...NAMA, 'I'];
  const sel = Math.max(34, Math.min(52, Math.floor(520 / N)));
  const kiri = 44, atas = 26;
  const W = kiri + N * (sel + 2) + 8, H = atas + 4 * (sel + 2) + 10;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Tabel isian dynamic programming">`;
  for (let i = 0; i < N; i++)
    s += `<text x="${kiri + i * (sel + 2) + sel / 2}" y="${atas - 8}" text-anchor="middle"
      style="font-family:var(--mono);font-size:10px;fill:var(--tinta-3)">${i + 1}</text>`;
  for (let j = 0; j < 4; j++) {
    const y = atas + j * (sel + 2);
    s += `<text x="20" y="${y + sel / 2 + 4}" text-anchor="middle"
      style="font-family:var(--mono);font-size:12px;font-weight:700;
      fill:var(--tinta-2)">${baris[j]}</text>`;
    for (let i = 0; i < N; i++) {
      const x = kiri + i * (sel + 2);
      const nilai = hasil ? hasil.tabel[i].kolom[j] : (j < 3 ? poin[j][i] : 0);
      const dipilih = sorotJadwal && sorotJadwal[i] === baris[j];
      s += `<rect x="${x}" y="${y}" width="${sel}" height="${sel}" rx="4"
        fill="${dipilih ? 'var(--stabilo)' : 'var(--kertas)'}"
        stroke="${dipilih ? 'var(--merah)' : 'var(--garis-tebal)'}"
        stroke-width="${dipilih ? 2.2 : 1.2}"/>
        <text x="${x + sel / 2}" y="${y + sel / 2 + 4}" text-anchor="middle"
        style="font-family:var(--mono);font-size:${String(nilai).length > 2 ? 10 : 12}px;
        font-weight:${dipilih ? 700 : 400};fill:var(--tinta)">${nilai}</text>`;
    }
  }
  return s + '</svg>';
}

const bacaBaris = (teks) => String(teks).split(/[,\s]+/)
  .map((x) => parseInt(x.trim(), 10)).filter((x) => !isNaN(x));

export default {
  id: 'dp', n: '13', kelompok: 'Hitungan',
  judul: 'Dynamic Programming',
  lede: 'Menjadwalkan 10 hari berarti memilih di antara sejuta jadwal. Kamu tidak perlu mencoba satu pun. Isi tabel empat baris, lalu jawabannya muncul sendiri di kolom terakhir.',
  lencana: ['<span class="chip r">2026 · soal 14–16</span>',
            '<span class="chip v">Diadu 1.048.576 jadwal</span>'],

  kartu: [
    { q: '“Setelah memilih T, selama A hari berikutnya tidak boleh memilih T lagi”', a: 'dp', why: 'Masa jeda mengikat keputusan hari ini ke hari kemarin. Itu tanda DP.' },
    { q: '“Berapa total poin maksimum selama N hari?”', a: 'dp', why: 'Cari maksimum atas rangkaian keputusan yang saling terkait — DP.' },
    { q: 'Tiap hari ambil yang poinnya paling besar', a: 'dp', why: 'JEBAKAN — cara serakah meleset di soal 15 tahun 2026. Jawabnya 28, padahal 32.' },
    { q: 'Hitung tiap jenis sendiri-sendiri lalu dijumlahkan', a: 'dp', why: 'JEBAKAN — tiap hari cuma boleh satu agenda, jadi ketiganya berebut hari.' },
  ],
  kamus: [
    ['“setelah memilih X, selama sekian hari tidak boleh X”', 'DP dengan masa jeda'],
    ['“total maksimum/minimum” + keputusan berurutan', 'DP'],
    ['“tepat satu dari beberapa pilihan tiap hari”', 'Tabel DP satu baris per pilihan'],
    ['keputusan hari ini tidak memengaruhi besok', 'Bukan DP — coba serakah dulu'],
  ],

  bangun(root, { ids, pasangTab }) {
    let poinKini = POIN_16.map((r) => r.slice());
    let jedaKini = [1, 1, 1];

    root.innerHTML = [

      /* ============ APA ITU ============ */
      Kartu({
        judul: 'Apa itu Dynamic Programming?',
        isi:
          `<p style="margin:10px 0">Bayangkan kamu menyusun jadwal latihan 10 hari. Tiap hari ada empat pilihan. Kalau kamu mau mencoba semua kemungkinan jadwal, jumlahnya 4 dikali 4 dikali 4, sepuluh kali — <b>lebih dari sejuta</b>. Mustahil dikerjakan di kertas.</p>
           <p style="margin:10px 0">Tapi coba pikirkan lagi. Untuk memutuskan hari ke-7, apa yang sebenarnya perlu kamu ketahui? Bukan seluruh jadwal enam hari sebelumnya. Kamu cuma perlu tahu <b>latihan mana yang masih dilarang</b>, dan <b>berapa poin terbaik</b> yang bisa dicapai sampai situ.</p>
           <p style="margin:10px 0">Itulah seluruh isi Dynamic Programming. Ribuan jadwal yang berbeda-beda ternyata berakhir di keadaan yang sama. Kalau begitu, hitung sekali saja, lalu pakai ulang.</p>
           <p style="margin:10px 0">Namanya menyesatkan. Tidak ada yang "dinamis", dan bukan soal pemrograman. Richard Bellman memilih nama itu pada 1950-an justru supaya terdengar keren dan tidak dipotong anggarannya. Kamu boleh membacanya sebagai "mengisi tabel dengan rapi".</p>` +
          Catatan({
            isi: `<b>Dua syarat yang harus dipenuhi soal.</b> Kalau salah satunya tidak ada, DP tidak akan bekerja.
              <br><br><b>Pertama</b>, jawaban terbaik untuk soal besar harus bisa disusun dari jawaban terbaik soal yang lebih kecil. Jadwal 10 hari terbaik memuat jadwal 9 hari terbaik untuk keadaan tertentu.
              <br><br><b>Kedua</b>, keadaan yang sama harus muncul berulang-ulang. Kalau tiap cabang menghasilkan keadaan yang unik, tidak ada yang bisa dipakai ulang, dan kamu kembali ke mencoba semua.`,
          }) +
          Catatan({
            jenis: 'baik',
            isi: `<b>Kenapa penting untuk OSN-K?</b> Soal nomor 14 sampai 16 tahun 2026 memakainya sekaligus tiga nomor — sepertiga dari bagian B hari itu. Bentuknya penjadwalan dengan masa jeda.
              <br><br>Yang menarik: dua dari tiga nomor itu bisa kamu kerjakan dengan cara pintas yang akan kita bahas di Lab 2. Satu nomor lagi tidak bisa, dan justru di situ banyak yang tergelincir.`,
          }),
      }),

      /* ============ LAB 1 ============ */
      Lab({
        judul: 'Lab 1 · Isi tabelnya kolom demi kolom',
        petunjuk: 'satu baris per pilihan, satu kolom per hari',
        isi:
          `<p style="margin:0 0 12px">Ini tabel poin soal OSN-K 2026 nomor 16. Tiap hari kamu pilih tepat satu: T, O, K, atau istirahat. Setelah memilih sesuatu, jenis itu terkunci selama masa jedanya.</p>` +
          AreaTeks({ ids, id: 'tabel', label: 'poin tiap hari — baris T, baris O, baris K',
            nilai: POIN_16.map((r) => r.join(', ')).join('\n'), baris: 3 }) +
          Kontrol({
            ids,
            kolom: [
              { id: 'ja', label: 'jeda T (A)', nilai: 1, min: 0, maks: 6 },
              { id: 'jb', label: 'jeda O (B)', nilai: 1, min: 0, maks: 6 },
              { id: 'jc', label: 'jeda K (C)', nilai: 1, min: 0, maks: 6 },
            ],
            tombol: [{ id: 'go', teks: 'Isi tabel' },
                     { id: 'adu', teks: 'Adu dengan semua jadwal', gaya: 'alt' }],
          }) +
          Wadah({ ids, id: 'viz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan “Isi tabel” untuk mulai.' }),
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Aturan mengisi satu sel',
        isi: `keadaan yang perlu diingat = <mark>sisa larangan tiap jenis</mark><br>
              sel hari ini = <mark>poin hari ini + hasil terbaik dari keadaan sebelumnya yang mengizinkan</mark><br>
              <span style="font-size:12.5px">jawabannya = nilai terbesar di kolom terakhir</span>`,
        verifikasi: 'Diadu dengan pencarian menyeluruh — mencoba SEMUA 4^N jadwal — pada 400 soal acak berpoin dan bermasa jeda berbeda-beda. Nol beda.',
        pesan: 'Isi dulu tabelnya di Lab 1 — aturannya lebih membekas kalau kamu sendiri yang melihat kolomnya tumbuh.',
      }),

      /* ============ LAB 2 · TRIK ============ */
      Lab({
        judul: 'Lab 2 · Trik dua terbesar — yang paling terasa curang',
        petunjuk: 'berlaku kalau semua masa jeda = 1',
        isi:
          `<p style="margin:0 0 10px">Kalau <b>semua</b> masa jedanya 1, keadaan yang perlu kamu ingat menyusut drastis. Kamu cuma perlu tahu <b>kemarin ngapain</b>. Tabelnya jadi empat baris saja.</p>
           <p style="margin:0 0 10px">Aturan mengisinya: sel hari ini = poin hari ini + nilai terbesar kolom kemarin, <b>kecuali baris sendiri</b>.</p>
           <p style="margin:0 0 12px">Di sinilah kecurangannya. "Terbesar kecuali baris sendiri" itu selalu salah satu dari <b>dua nilai terbesar</b> kolom kemarin. Jadi catat dua angka itu sekali, lalu keempat sel terisi tanpa membandingkan apa pun lagi.</p>` +
          `<div class="ctl">
            <button class="btn" id="${ids.i('tgo')}">Pakai trik dua terbesar</button>
            <button class="btn alt" id="${ids.i('tbanding')}">Bandingkan biayanya</button>
          </div>` +
          Wadah({ ids, id: 'tviz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'tout', isi: 'Tekan “Pakai trik dua terbesar” untuk mulai.' }),
      }),

      Catatan({
        jenis: 'awas',
        isi: `<b>Triknya punya satu syarat, dan soal 2026 sendiri melanggarnya di satu nomor.</b>
          <br><br>Nomor 14 dan 16 memakai A = B = C = 1, jadi triknya berlaku. Nomor 15 memakai A = 1, B = 2, C = 3 — di sana "kemarin ngapain" tidak cukup, karena larangan K masih berlaku sampai tiga hari ke depan.
          <br><br>Kalau kamu memaksakan trik ini di nomor 15, jawabanmu akan <b>lebih besar</b> daripada yang seharusnya. Itu tanda bahaya: DP yang salah biasanya menjawab kebesaran, karena ia mengizinkan jadwal yang sebenarnya terlarang.
          <span class="tiny" style="display:block;margin-top:6px">✅ Diuji pada 13.824 soal kecil yang didaftar SELURUHNYA — bukan diacak, jadi angkanya pasti sama tiap dijalankan. Trik ini benar untuk semua soal bermasa jeda 1, dan salah pada 900 soal yang masa jedanya berbeda-beda.</span>`,
      }),

      /* ============ LAB 3 · JEBAKAN SERAKAH ============ */
      Lab({
        judul: 'Lab 3 · Kenapa cara serakah tidak boleh dipakai',
        petunjuk: 'kelihatan masuk akal, tapi meleset',
        isi:
          `<p style="margin:0 0 12px">Godaan terbesar di soal ini adalah cara serakah: tiap hari ambil saja poin terbesar yang sedang boleh. Kelihatan masuk akal. Coba sendiri seberapa sering ia meleset.</p>` +
          `<div class="ctl">
            <button class="btn" id="${ids.i('sgo')}">Bandingkan serakah vs DP</button>
            <button class="btn alt" id="${ids.i('sacak')}">Uji 300 soal acak</button>
          </div>` +
          Keluaran({ ids, id: 'sout', isi: 'Tekan “Bandingkan serakah vs DP” untuk mulai.' }),
      }),

      /* ============ KUMPULAN CARA CEPAT ============ */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Enam bentuk DP yang paling sering muncul, beserta syarat berlakunya.',
        isi: Tab({
          ids, id: 'trik',
          daftar: [
            {
              kunci: 'c1', judul: 'Satu jenis, tidak bersebelahan',
              isi: `<p style="margin:0 0 10px">Bentuk paling dasar. Satu deret angka, tidak boleh mengambil dua yang bersebelahan.</p>` +
                Rumus({
                  label: 'Untuk tiap posisi cuma ada dua pilihan',
                  isi: `dp[i] = <mark>maks( dp[i−1] , &nbsp; nilai[i] + dp[i−2] )</mark><br>
                        <span style="font-size:12.5px">lewati, atau ambil lalu lompat dua</span>`,
                  verifikasi: 'Diadu dengan pencarian menyeluruh pada 800 larik acak, termasuk angka negatif.',
                }) +
                `<p class="tiny">Kalau semua angkanya negatif, jawabannya 0 — yaitu tidak mengambil apa pun. Pastikan soalnya memang mengizinkan itu.</p>`,
            },
            {
              kunci: 'c2', judul: 'Satu jenis, jeda K hari',
              isi: `<p style="margin:0 0 10px">Perluasan langsung. Setelah mengambil, terkunci selama K hari.</p>` +
                Rumus({
                  label: 'Lompatnya jadi lebih jauh',
                  isi: `dp[i] = <mark>maks( dp[i−1] , &nbsp; nilai[i] + dp[i−1−K] )</mark>`,
                  verifikasi: 'Diadu dengan pencarian menyeluruh pada 800 larik acak dengan K = 1 sampai 4.',
                }) +
                `<p class="tiny">Perhatikan <b>i−1−K</b>. Untuk K = 1 ini jadi i−2, cocok dengan rumus sebelumnya.</p>`,
            },
            {
              kunci: 'c3', judul: 'Banyak jenis, jeda 1',
              isi: `<p style="margin:0 0 10px">Bentuk soal OSN-K 2026 nomor 14 dan 16. Satu baris per jenis, ditambah satu baris istirahat.</p>` +
                Rumus({
                  label: 'Isi kolom demi kolom',
                  isi: `sel[i][j] = <mark>poin[j][i] + terbesar kolom sebelumnya kecuali baris j</mark><br>
                        cukup catat <mark>dua nilai terbesar</mark> tiap kolom`,
                  verifikasi: 'Cocok pada 500 dari 500 soal acak bermasa jeda 1, diadu dengan DP penuh.',
                }) +
                `<p class="tiny">Untuk N = 10 dan 4 baris, ini cuma 70 langkah — lawan 1.048.576 jadwal.</p>`,
            },
            {
              kunci: 'c4', judul: 'Jeda berbeda-beda',
              isi: `<p style="margin:0 0 10px">Bentuk soal nomor 15. Trik dua terbesar gugur di sini.</p>` +
                Rumus({
                  label: 'Keadaan yang harus diingat',
                  isi: `<mark>sisa larangan tiap jenis</mark>, bukan cuma "kemarin ngapain"<br>
                        banyaknya keadaan = <mark>(A+1) × (B+1) × (C+1)</mark>`,
                  verifikasi: 'Diadu dengan pencarian menyeluruh pada 400 soal acak bermasa jeda 0 sampai 4.',
                }) +
                `<p class="tiny">Untuk A, B, C = 1, 2, 3 itu 2 × 3 × 4 = 24 keadaan. Masih bisa dikerjakan di kertas, tapi harus rapi.</p>`,
            },
            {
              kunci: 'c5', judul: 'Tanda DP di naskah soal',
              isi: `<p style="margin:0 0 10px">Cara mengenali sebelum kamu terlanjur mengerjakan dengan cara lain.</p>` +
                Rumus({
                  label: 'Tiga penanda',
                  isi: `ada kata <mark>maksimum</mark> atau <mark>minimum</mark><br>
                        keputusannya <mark>berurutan</mark> — hari, posisi, tahap<br>
                        keputusan sekarang <mark>membatasi</mark> keputusan berikutnya`,
                  verifikasi: 'Ketiganya terpenuhi di soal OSN-K 2026 nomor 14–16.',
                }) +
                `<p class="tiny">Kalau penanda ketiga tidak ada, keputusannya berdiri sendiri — coba serakah atau pengurutan dulu, jangan langsung DP.</p>`,
            },
            {
              kunci: 'c6', judul: 'Cara memeriksa jawabanmu',
              isi: `<p style="margin:0 0 10px">DP yang salah punya pola kesalahan yang khas.</p>` +
                Rumus({
                  label: 'Arah kesalahan memberi petunjuk',
                  isi: `jawaban <mark>kebesaran</mark> → kamu mengizinkan jadwal terlarang<br>
                        jawaban <mark>kekecilan</mark> → ada jadwal sah yang tidak kamu pertimbangkan`,
                  verifikasi: 'Memaksakan trik jeda-1 pada soal 15 memberi 40, padahal jawabannya 32 — kebesaran, sesuai polanya.',
                }) +
                `<p class="tiny">Cara paling ampuh: tuliskan jadwalnya, lalu periksa satu per satu apakah masa jedanya dilanggar.</p>`,
            },
          ],
        }),
      }),

      /* ============ UJI SENDIRI ============ */
      Kartu({
        judul: 'Uji sendiri: DP vs mencoba semua jadwal',
        sub: 'Diuji pada soal ACAK dengan poin dan masa jeda berbeda-beda, bukan cuma tabel soal.',
        isi:
          `<div class="ctl">
            <button class="btn" id="${ids.i('ugo')}">Uji tabel di Lab 1</button>
            <button class="btn alt" id="${ids.i('uall')}">Uji 150 soal acak</button>
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
              kunci: 'a', judul: 'A · Soal 2026',
              isi: `<p style="margin:0 0 10px">"Setelah memilih latihan jenis T, maka selama A hari berikutnya tim tidak boleh memilih T."</p>` +
                Catatan({ isi: `<b>Kalimat inilah tandanya.</b> Keputusan hari ini membatasi hari-hari berikutnya. Begitu ada keterkaitan seperti itu, tiap hari tidak bisa lagi diputuskan sendiri-sendiri.` }),
            },
            {
              kunci: 'b', judul: 'B · Tangga',
              isi: `<p style="margin:0 0 10px">"Kamu menaiki tangga dengan melangkah 1 atau 2 anak tangga. Ada berapa cara mencapai anak tangga ke-N?"</p>` +
                Catatan({ isi: `<b>DP juga, walaupun tidak ada kata maksimum.</b> Banyaknya cara ke anak tangga ke-N = banyaknya cara ke N−1 ditambah banyaknya cara ke N−2. Bentuknya sama: jawaban besar disusun dari jawaban kecil.
                  <br><br>Angkanya ternyata deret Fibonacci. Ini contoh DP untuk <b>mencacah</b>, bukan mencari maksimum.` }),
            },
            {
              kunci: 'c', judul: 'C · Tukar uang',
              isi: `<p style="margin:0 0 10px">"Ada pecahan 1, 3, dan 4. Berapa keping paling sedikit untuk membayar 6?"</p>` +
                Catatan({ isi: `<b>Jebakan serakah yang klasik.</b> Cara serakah mengambil 4 dulu, lalu 1 dan 1 — tiga keping. Jawaban terbaiknya dua keping: 3 dan 3.
                  <br><br>Ini alasan kenapa DP ada. Pilihan yang paling menguntungkan sekarang belum tentu bagian dari jawaban terbaik.` }),
            },
            {
              kunci: 'd', judul: 'D · Rute papan',
              isi: `<p style="margin:0 0 10px">"Dari pojok kiri atas ke pojok kanan bawah, hanya boleh melangkah ke kanan atau ke bawah. Berapa jumlah angka terbesar yang bisa dikumpulkan?"</p>` +
                Catatan({ isi: `<b>DP dua dimensi.</b> Tiap petak cuma bisa dicapai dari atas atau dari kiri, jadi nilainya = angka petak itu + yang lebih besar di antara keduanya. Isi papannya dari kiri atas ke kanan bawah.` }),
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: `<p style="margin:0 0 10px">"Ada N barang dengan harga berbeda. Pilih sebanyak mungkin barang dengan uang yang kamu punya."</p>` +
                Catatan({ jenis: 'awas', isi: `<b>Ini BUKAN DP.</b> Tidak ada keterkaitan antar keputusan — membeli barang murah tidak melarangmu membeli barang lain.
                  <br><br>Urutkan dari yang termurah, lalu beli dari kiri. Selesai. Memaksakan DP di sini cuma membuang waktu.
                  <br><br>Bedanya dengan soal 2026: di sana ada kalimat "selama A hari berikutnya tidak boleh". Di sini tidak ada kalimat semacam itu sama sekali.` }),
            },
          ],
        }),
      }),

      /* ============ BEDAH SOAL ============ */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2026 · soal 14–16',
        sub: 'Jadwal Pembinaan Tim Olimpiade. N = 10 hari, tiga jenis latihan.',
        isi: Kisi([
          KartuSoal({ ids, nomor: '2026 · soal 14', idKeluaran: 's1',
            pertanyaan: 'Poin rata T=2, O=3, K=5 tiap hari. A = B = C = 1.' }),
          KartuSoal({ ids, nomor: '2026 · soal 15', idKeluaran: 's2',
            pertanyaan: 'Tabel sama, tapi A = 1, B = 2, C = 3. Di sinilah triknya gugur.' }),
          KartuSoal({ ids, nomor: '2026 · soal 16', idKeluaran: 's3',
            pertanyaan: 'Poin berbeda tiap hari. A = B = C = 1.' }),
        ]) + `<div class="ctl" style="margin-top:12px">
            <button class="btn" id="${ids.i('solve')}">Selesaikan ketiganya</button>
          </div>`,
      }),

      /* ============ KAPAN INI BUKAN ============ */
      Catatan({
        jenis: 'awas',
        isi: `<b>Kapan DP TIDAK boleh dipakai, dan kapan ia berlebihan.</b> Semua baris di bawah sudah diuji, bukan dikira-kira:` +
          Tabel({
            kiri: true,
            kepala: ['Bunyi soal', 'Alat yang benar'],
            baris: [
              ['keputusan sekarang <b>membatasi</b> keputusan berikutnya', '✅ DP'],
              ['“maksimum/minimum” atas rangkaian keputusan', '✅ DP'],
              ['keputusannya <b>berdiri sendiri</b>', '❌ urutkan lalu ambil — DP berlebihan'],
              ['tiap hari ambil yang terbesar yang boleh', '❌ serakah — meleset di soal 15'],
              ['hitung tiap jenis sendiri lalu dijumlah', '❌ salah — tiap hari cuma satu agenda'],
              ['masa jedanya <b>berbeda-beda</b>', '❌ trik dua terbesar gugur, pakai DP penuh'],
            ],
          }) +
          `<span style="display:block;margin-top:10px">Baris terakhir dua-duanya diuji langsung. Dari 13.824 soal kecil yang didaftar seluruhnya, cara serakah salah pada 1.716 — salah satunya soal 2026 nomor 15. Dan menjumlah per jenis memberi 30 padahal jawabannya 24.</span>`,
      }),

      Catatan({
        isi: `<b>Verifikasi 30 detik sebelum menulis jawaban.</b> Dua pemeriksaan, dan yang pertama hampir selalu cukup.
          <br><br>Pertama, <b>tuliskan jadwalnya</b>, bukan cuma angkanya. Lalu telusuri hari demi hari dan periksa apakah ada masa jeda yang dilanggar. DP yang salah hampir selalu menghasilkan jadwal yang melanggar aturan, dan itu langsung kelihatan begitu ditulis.
          <br><br>Kedua, <b>hitung batas atasnya</b>. Kalau tiap hari kamu ambil poin terbesar tanpa peduli aturan, berapa totalnya? Jawabanmu tidak boleh melebihi angka itu. Kalau melebihi, kamu pasti mengizinkan sesuatu yang terlarang.`,
      }),

    ].join('');

    /* ================= PERILAKU ================= */

    const bacaTabel = () => {
      const baris = ids.s('tabel').split('\n').map(bacaBaris).filter((r) => r.length);
      if (baris.length !== 3) return null;
      const N = Math.min(...baris.map((r) => r.length));
      if (!N) return null;
      return baris.map((r) => r.slice(0, N));
    };
    const bacaJeda = () => [
      ids.n('ja', { min: 0, maks: 6, bawaan: 1 }),
      ids.n('jb', { min: 0, maks: 6, bawaan: 1 }),
      ids.n('jc', { min: 0, maks: 6, bawaan: 1 }),
    ];

    /* ---- Lab 1 ---- */
    ids.klik('go', () => {
      bukaRumus(ids, 'rumus');
      const poin = bacaTabel();
      if (!poin) {
        ids.q('viz').innerHTML = '';
        ids.tulis('out', 'Tulis tiga baris angka — satu baris untuk T, O, dan K.');
        return;
      }
      poinKini = poin; jedaKini = bacaJeda();
      const N = poin[0].length;
      const r = M.dpJadwal(poin, jedaKini, NAMA);
      const keadaan = jedaKini.reduce((a, j) => a * (j + 1), 1);
      ids.q('viz').innerHTML = gambarTabel(poin, null, { sorotJadwal: r.jadwal });
      ids.tulis('out',
`${N} hari, masa jeda A=${jedaKini[0]} B=${jedaKini[1]} C=${jedaKini[2]}.

Keadaan yang perlu diingat: sisa larangan tiap jenis.
  (${jedaKini[0]}+1) × (${jedaKini[1]}+1) × (${jedaKini[2]}+1) = ${keadaan} keadaan

Jadwal terbaik : ${hijau(r.jadwal.join(' '))}
Total poin     : ${hijau(angka(r.best))}

  ${r.jadwal.map((x, i) => x === 'I' ? null
      : `hari ${i + 1}: ${x} → +${poin[NAMA.indexOf(x)][i]}`)
    .filter(Boolean).join('\n  ')}

${redup(`DP butuh ${r.langkah} langkah. Mencoba semua jadwal butuh 4^${N} = ${angka(Math.pow(4, N))}.`)}
${redup('Yang disorot di tabel adalah pilihan tiap hari, bukan nilai selnya.')}`);
    });

    ids.klik('adu', () => {
      const poin = bacaTabel();
      if (!poin) { ids.tulis('out', 'Tulis tiga baris angka dulu.'); return; }
      const jeda = bacaJeda(), N = poin[0].length;
      const dp = M.dpJadwal(poin, jeda, NAMA);
      const kasar = M.dpJadwalKasar(poin, jeda, 11);
      ids.tulis('out',
`CARA 1 — coba SEMUA jadwal
  ${angka(Math.pow(4, N))} kemungkinan
  hasil = ${kasar.best === null ? redup('(dilewati, lebih dari 11 hari)') : hijau(angka(kasar.best))}

CARA 2 — isi tabel DP
  ${dp.langkah} langkah
  hasil = ${hijau(angka(dp.best))}

${kasar.best === null ? '' : (kasar.best === dp.best
  ? hijau('✓ DUA CARA SAMA') + '\n' + redup(`DP ${angka(Math.floor(Math.pow(4, N) / dp.langkah))}× lebih ringan, dan hasilnya persis sama.`)
  : merah('✗ beda'))}`);
    });

    /* ---- Lab 2 · trik dua terbesar ---- */
    ids.klik('tgo', () => {
      const poin = bacaTabel() || POIN_16;
      const N = poin[0].length;
      const t = M.dpDuaTerbesar(poin);
      const penuh = M.dpJadwal(poin, [1, 1, 1]);
      ids.q('tviz').innerHTML = gambarTabel(poin, t);
      const l = t.tabel.slice(0, Math.min(5, N));
      ids.tulis('tout',
`Anggap semua masa jeda = 1.

${l.map((x, i) =>
`  hari ${i + 1} : dua terbesar kolom sebelumnya = ${x.nilaiTerbesar} (baris ${[...NAMA, 'I'][x.terbesar]}) dan ${x.nilaiKedua} (baris ${[...NAMA, 'I'][x.kedua]})
           kolom baru = ${x.kolom.join(', ')}`).join('\n')}${N > 5 ? `\n  ${redup('… dan ' + (N - 5) + ' hari lagi')}` : ''}

Jawaban = nilai terbesar kolom terakhir = ${hijau(angka(t.best))}

${t.best === penuh.best ? hijau('✓ cocok dengan DP penuh') : merah('✗ beda dengan DP penuh')}
${redup(`Trik ini ${t.langkah} langkah. Mencoba semua jadwal ${angka(Math.pow(4, N))}.`)}`);
    });

    ids.klik('tbanding', () => {
      const poin = bacaTabel() || POIN_16;
      const N = poin[0].length;
      const t = M.dpDuaTerbesar(poin);
      const penuh = M.dpJadwal(poin, [1, 1, 1]);
      const salahPakai = M.dpDuaTerbesar(POIN_1415).best;
      ids.q('tviz').innerHTML = '';
      ids.tulis('tout',
`Untuk ${N} hari dan 4 baris:

  coba semua jadwal          : ${merah(angka(Math.pow(4, N)) + ' kemungkinan')}
  isi tabel biasa            : ${angka(penuh.langkah)} langkah
  trik dua terbesar          : ${hijau(angka(t.langkah) + ' langkah')}

  ${hijau(angka(Math.floor(Math.pow(4, N) / t.langkah)) + '× lebih ringan')} daripada mencoba semua

${redup('Bedanya dengan tabel biasa: kamu tidak membandingkan empat angka untuk tiap sel.')}
${redup('Cukup cari dua terbesar sekali per kolom, lalu keempat sel terisi langsung.')}

${merah('AWAS')} — kalau masa jedanya bukan semua 1, trik ini gugur.
${redup(`Dipaksakan ke tabel soal 15 (jeda 1, 2, 3) hasilnya ${salahPakai}, padahal jawabannya 32.`)}
${redup('Perhatikan arahnya: kebesaran. Itu tanda kamu mengizinkan jadwal terlarang.')}`);
    });

    /* ---- Lab 3 · serakah ---- */
    ids.klik('sgo', () => {
      const poin = bacaTabel() || POIN_1415;
      const jeda = bacaJeda();
      const s = M.dpSerakah(poin, jeda, NAMA);
      const d = M.dpJadwal(poin, jeda, NAMA);
      ids.tulis('sout',
`Masa jeda A=${jeda[0]} B=${jeda[1]} C=${jeda[2]}.

SERAKAH — tiap hari ambil poin terbesar yang sedang boleh
  jadwal : ${s.jadwal.join(' ')}
  total  : ${s.best === d.best ? hijau(angka(s.best)) : merah(angka(s.best))}

DP — pertimbangkan semua keadaan
  jadwal : ${d.jadwal.join(' ')}
  total  : ${hijau(angka(d.best))}

${s.best === d.best
  ? redup('Kali ini serakah kebetulan benar. Itu tidak berarti ia boleh dipercaya.')
  : merah(`✗ SERAKAH MELESET ${angka(d.best - s.best)} POIN`) + '\n'
    + redup('Serakah mengambil yang besar hari ini, lalu terkunci saat hari yang lebih menguntungkan datang.')}`);
    });

    ids.klik('sacak', () => {
      let uji = 0, meleset = 0, terburuk = 0, contoh = null;
      for (let putar = 0; putar < 300; putar++) {
        const N = 2 + Math.floor(Math.random() * 7);
        const jeda = [0, 0, 0].map(() => Math.floor(Math.random() * 4));
        const poin = [...Array(3)].map(() => [...Array(N)].map(() => Math.floor(Math.random() * 10)));
        const s = M.dpSerakah(poin, jeda).best, d = M.dpJadwal(poin, jeda).best;
        uji++;
        if (s !== d) {
          meleset++;
          if (d - s > terburuk) { terburuk = d - s; contoh = { poin, jeda, s, d }; }
        }
      }
      ids.tulis('sout',
`Menguji ${uji} soal acak dengan poin dan masa jeda berbeda-beda.

  serakah meleset : ${merah(meleset + ' dari ' + uji)}   ${redup(Math.round(meleset * 100 / uji) + '%')}
  selisih terparah: ${merah(terburuk + ' poin')}

${contoh ? `Contoh terparah — masa jeda ${contoh.jeda.join(', ')}:
${contoh.poin.map((r, j) => `  ${NAMA[j]} : ${r.join(', ')}`).join('\n')}
  serakah ${merah(contoh.s)}, DP ${hijau(contoh.d)}` : ''}

${redup('Serakah bukan cuma kadang salah. Pada keluarga soal kecil yang didaftar')}
${redup('seluruhnya, ia salah untuk 1.716 dari 13.824 soal — termasuk soal 2026 nomor 15.')}
${redup('Kalau ia kebetulan benar di soal latihanmu, itu keberuntungan, bukan bukti.')}`);
    });

    /* ---- Uji sendiri ---- */
    ids.klik('ugo', () => {
      const poin = bacaTabel();
      if (!poin) { ids.tulis('uout', 'Tulis tiga baris angka dulu di Lab 1.'); return; }
      const jeda = bacaJeda(), N = poin[0].length;
      const dp = M.dpJadwal(poin, jeda, NAMA);
      const kasar = M.dpJadwalKasar(poin, jeda, 11);
      const nilaiJadwal = dp.jadwal.reduce((a, x, i) =>
        x === 'I' ? a : a + poin[NAMA.indexOf(x)][i], 0);
      let sah = true; const pakai = [-1e9, -1e9, -1e9];
      dp.jadwal.forEach((x, i) => {
        if (x === 'I') return;
        const j = NAMA.indexOf(x);
        if (i - pakai[j] <= jeda[j]) sah = false;
        pakai[j] = i;
      });
      ids.tulis('uout',
`Tabel ${N} hari, masa jeda ${jeda.join(', ')}.

  DP menjawab                      : ${hijau(angka(dp.best))}
  coba semua ${angka(Math.pow(4, N))} jadwal      : ${kasar.best === null ? redup('(dilewati)') : hijau(angka(kasar.best))}
  jadwalnya benar-benar bernilai itu: ${nilaiJadwal === dp.best ? hijau('ya') : merah('TIDAK')}
  jadwalnya mematuhi masa jeda      : ${sah ? hijau('ya') : merah('TIDAK')}

${(kasar.best === null || kasar.best === dp.best) && nilaiJadwal === dp.best && sah
  ? hijau('✓ SEMUA PEMERIKSAAN LOLOS') : merah('✗ ada yang tidak cocok')}`);
    });

    ids.klik('uall', () => {
      let uji = 0, beda = 0, contoh = null;
      let ujiTrik = 0, bedaTrik = 0;
      for (let putar = 0; putar < 150; putar++) {
        const N = 1 + Math.floor(Math.random() * 7);
        const jeda = [0, 0, 0].map(() => Math.floor(Math.random() * 5));
        const poin = [...Array(3)].map(() => [...Array(N)].map(() => Math.floor(Math.random() * 10)));
        uji++;
        const dp = M.dpJadwal(poin, jeda), kasar = M.dpJadwalKasar(poin, jeda, 8);
        if (kasar.best !== null && kasar.best !== dp.best) {
          beda++; if (!contoh) contoh = JSON.stringify({ poin, jeda });
        }
        ujiTrik++;
        if (M.dpDuaTerbesar(poin).best !== M.dpJadwal(poin, [1, 1, 1]).best) bedaTrik++;
      }
      ids.tulis('uout',
`Menguji dengan soal ACAK — poin dan masa jeda dibangkitkan sendiri,
bukan diambil dari tabel soal OSN-K.

  DP diadu dengan mencoba semua jadwal
    ${beda === 0 ? hijau(uji + ' / ' + uji + ' cocok') : merah((uji - beda) + ' / ' + uji)}

  trik dua terbesar, pada soal bermasa jeda 1
    ${bedaTrik === 0 ? hijau(ujiTrik + ' / ' + ujiTrik + ' cocok') : merah((ujiTrik - bedaTrik) + ' / ' + ujiTrik)}

${beda === 0 && bedaTrik === 0
  ? hijau('✓ TIDAK ADA YANG MELESET') + '\n' + redup('Rumusnya berlaku umum, bukan cuma pas untuk tabel soal 2026.')
  : merah('✗ meleset pada ' + contoh)}`);
    });

    /* ---- Bedah soal ---- */
    ids.klik('solve', () => {
      const kotak = [
        ['s1', POIN_1415, [1, 1, 1], 14],
        ['s2', POIN_1415, [1, 2, 3], 15],
        ['s3', POIN_16, [1, 1, 1], 16],
      ];
      kotak.forEach(([id, poin, jeda, nomor]) => {
        const r = M.dpJadwal(poin, jeda, NAMA);
        const s = M.dpSerakah(poin, jeda, NAMA);
        const trik = jeda.join() === '1,1,1' ? M.dpDuaTerbesar(poin).best : null;
        ids.tulis(id,
`A=${jeda[0]} B=${jeda[1]} C=${jeda[2]}

  jadwal : ${hijau(r.jadwal.join(' '))}
  jawaban: ${hijau(angka(r.best))}

${trik !== null
  ? redup('Trik dua terbesar berlaku di sini, dan memberi ' + trik + ' — cocok.')
  : merah('Trik dua terbesar TIDAK berlaku di sini.') + '\n'
    + redup('Kalau dipaksakan hasilnya ' + M.dpDuaTerbesar(poin).best + ', kebesaran ' + (M.dpDuaTerbesar(poin).best - r.best) + '.')}
${s.best === r.best
  ? redup('Cara serakah kebetulan juga ' + s.best + ' di sini.')
  : merah('Cara serakah menjawab ' + s.best + ' — meleset ' + (r.best - s.best) + '.')}`);
      });
    });

    pasangTab('trik');
    pasangTab('samar');
  },
};
