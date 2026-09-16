/* ============================================================
   MODUL 14 — PIGEONHOLE & SKENARIO TERBURUK
   Soal utama    : OSN-K 2024 nomor 17-19, "Mencicipi Biskuit"
   Soal pendukung: OSN-K 2023 nomor 19 (mesin capit), nomor 6 (dua kotak)

   Semua rumus dan angka dibuktikan verify/14-pigeonhole.py — rumusnya
   diadu dengan pencarian menyeluruh pada ratusan susunan acak, bukan
   cuma angka yang kebetulan muncul di soal OSN-K.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Tabel, KartuSoal, hijau, merah, redup, angka,
} from '../core/ui.js';

const C17 = [5, 5, 5, 5, 5, 5, 5];
const C18 = [...Array(100)].map((_, i) => 10 * (i + 1));
const STOK = { boneka: 16, bola: 4, mobil: 7, puzzle: 2 };
const M17 = 1, M18 = 5;          // syarat tiap toples di soal 17 dan 18

/* ---------- TOPLES ----------
   Menggambar tiap toples sebagai tumpukan butir. Toples terkecil
   disorot, karena cuma dia yang benar-benar menentukan jawabannya. */
function gambarToples(isi, { sorotTerkecil = true, diambil = null } = {}) {
  if (!isi.length) return '<div class="out">Belum ada toples.</div>';
  const n = isi.length;
  const lebar = Math.max(24, Math.min(52, Math.floor(560 / n)));
  const maks = Math.max(...isi, 1);
  const tinggiButir = Math.max(5, Math.min(14, Math.floor(150 / maks)));
  const kiri = 8, atas = 18;
  const W = kiri + n * (lebar + 6) + 8;
  const H = atas + maks * (tinggiButir + 2) + 34;
  const kecil = Math.min(...isi);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Toples biskuit, tiap kotak satu butir">`;
  isi.forEach((v, i) => {
    const x = kiri + i * (lebar + 6);
    const sorot = sorotTerkecil && v === kecil;
    for (let b = 0; b < v; b++) {
      const y = atas + (maks - 1 - b) * (tinggiButir + 2);
      const habis = diambil && b < diambil[i];
      s += `<rect x="${x}" y="${y}" width="${lebar}" height="${tinggiButir}" rx="2"
        fill="${habis ? 'var(--kertas)' : sorot ? 'var(--stabilo)' : 'var(--hijau-pucat)'}"
        stroke="${sorot ? 'var(--merah)' : 'var(--garis-tebal)'}"
        stroke-width="${sorot ? 1.4 : 0.8}"${habis ? ' stroke-dasharray="2 2"' : ''}/>`;
    }
    s += `<text x="${x + lebar / 2}" y="${H - 18}" text-anchor="middle"
      style="font-family:var(--mono);font-size:11px;font-weight:${sorot ? 700 : 400};
      fill:${sorot ? 'var(--merah)' : 'var(--tinta-3)'}">${v}</text>
      <text x="${x + lebar / 2}" y="${H - 5}" text-anchor="middle"
      style="font-family:var(--mono);font-size:9px;fill:var(--tinta-3)">${i + 1}</text>`;
  });
  return s + '</svg>';
}

const bacaAngka = (teks) => String(teks).split(/[,\s]+/)
  .map((x) => parseInt(x.trim(), 10)).filter((x) => !isNaN(x));

export default {
  id: 'pigeon', n: '14', kelompok: 'Hitungan',
  judul: 'Pigeonhole & Skenario Terburuk',
  lede: 'Soalnya bercerita tentang bebek yang mengambil biskuit satu per satu. Jawabannya tidak pernah menyebut bebek sama sekali — cukup tiga operasi, dan dari seratus angka kamu hanya perlu melihat satu.',
  lencana: ['<span class="chip r">2024 · soal 17–19</span>',
            '<span class="chip v">Diadu pencarian menyeluruh</span>'],

  kartu: [
    { q: '"Minimal berapa bebek supaya DIJAMIN semua tipe pernah dicicipi?"', a: 'lain', why: 'Kata "dijamin" menandakan skenario terburuk. Total butir dikurangi toples terkecil, lalu tambah syaratnya.' },
    { q: '"Minimal berapa bebek supaya MUNGKIN semua tipe dicicipi?"', a: 'lain', why: 'JEBAKAN — "mungkin" bukan "dijamin". Jawabannya cuma banyak tipe dikali syarat, jauh lebih kecil.' },
    { q: 'Ada toples yang isinya KOSONG', a: 'lain', why: 'JEBAKAN — toples kosong tidak akan pernah tercicipi, jadi soalnya mustahil. Bukan diabaikan.' },
    { q: '"Berapa uang minimal supaya dijamin dapat mainan yang diinginkan?"', a: 'lain', why: 'Skenario terburuk juga. Cari keadaan paling sial yang belum memenuhi, lalu tambah satu tarikan.' },
  ],
  kamus: [
    ['"minimal supaya DIJAMIN" atau "PASTI"', 'Skenario terburuk'],
    ['"minimal supaya MUNGKIN" atau "bisa"', 'Bukan skenario terburuk — jawabannya banyak wadah × syarat'],
    ['"pernyataan mana yang PASTI benar"', 'Cari satu contoh pembatal untuk tiap pernyataan'],
    ['"berapa kemungkinan" tanpa kata dijamin', 'Kombinatorika — mencacah kemungkinan, bukan mencari yang terjamin'],
  ],

  bangun(root, { ids, pasangTab }) {

    root.innerHTML = [

      /* ============ APA ITU ============ */
      Kartu({
        judul: 'Apa itu Skenario Terburuk?',
        isi:
          `<p style="margin:10px 0">Ada sepuluh kaus kaki di laci gelap: lima hitam, lima putih. Kamu mengambil satu per satu tanpa melihat. Berapa kaus kaki yang harus kamu ambil supaya <b>dijamin</b> dapat sepasang sewarna?</p>
           <p style="margin:10px 0">Jawabannya tiga. Bukan karena dua saja sering gagal, tapi karena dengan dua kamu <b>bisa</b> gagal. Dan "dijamin" artinya tidak boleh ada satu pun kemungkinan gagal.</p>
           <p style="margin:10px 0">Itulah seluruh isi modul ini. Kamu tidak menghitung kemungkinan, dan tidak menghitung rata-rata. Kamu membayangkan <b>lawan</b> yang sengaja menyulitkanmu, lalu bertanya: paling lama, sampai kapan dia bisa bertahan? Jawabannya satu langkah setelah itu.</p>
           <p style="margin:10px 0">Nama resminya <b>asas kotak burung</b>. Bunyinya sederhana: kalau ada lebih banyak burung daripada sangkar, pasti ada sangkar yang berisi lebih dari satu burung. Peter Gustav Lejeune Dirichlet menuliskannya pada 1834, dan sampai sekarang orang masih menyebutnya asas laci Dirichlet.</p>` +
          Catatan({
            isi: `<b>Tiga langkah yang selalu sama.</b> Berapa pun bentuk soalnya, urutannya tidak berubah.
              <br><br><b>Satu</b>, bayangkan lawan yang tahu jawabanmu dan sengaja menghindarkan syaratnya selama mungkin. <b>Dua</b>, hitung berapa lama dia bisa bertahan. <b>Tiga</b>, tambah satu.
              <br><br>Langkah ketiga itu yang sering lupa ditulis. Angka yang kamu hitung di langkah dua adalah keadaan yang <b>masih gagal</b>, bukan jawabannya.`,
          }) +
          Catatan({
            jenis: 'baik',
            isi: `<b>Kenapa penting untuk OSN-K?</b> Tipe soal ini muncul hampir tiap tahun, dan tahun 2024 dapat tiga nomor sekaligus. Bentuknya selalu bercerita — biskuit, mesin capit, kotak buah — tapi kata pemicunya cuma satu: <b>dijamin</b>, atau <b>pasti</b>.
              <br><br>Yang membuatnya menguntungkan: soal seperti ini nyaris tidak butuh hitungan. Kalau kamu mengenali bentuknya, tiga operasi selesai. Kalau tidak, kamu akan mencoba menghitung kemungkinan dan kehabisan waktu.`,
          }),
      }),

      /* ============ LAB 1 ============ */
      Lab({
        judul: 'Lab 1 · Bayangkan lawan yang paling jahat',
        petunjuk: 'toples terkecil disorot merah',
        isi:
          `<p style="margin:0 0 12px">Beberapa toples berisi sekian butir biskuit. Bebek datang satu per satu, masing-masing mengambil satu butir mana pun yang ia mau. Minimal berapa bebek supaya <b>dijamin</b> tiap toples pernah tersentuh?</p>` +
          Kontrol({
            ids,
            kolom: [
              { id: 'isi', label: 'butir tiap toples', nilai: '5, 5, 5, 5, 5, 5, 5', lebar: true, jenis: 'teks' },
              { id: 'm', label: 'tiap toples dicicipi minimal', nilai: 1, min: 0, maks: 20 },
            ],
            tombol: [{ id: 'go', teks: 'Cari yang paling sial' },
                     { id: 'adu', teks: 'Adu dengan semua keadaan', gaya: 'alt' }],
          }) +
          Wadah({ ids, id: 'viz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan “Cari yang paling sial” untuk mulai.' }),
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Minimal supaya DIJAMIN',
        isi: `paling sial = <mark>(total butir − toples terkecil) + (syarat − 1)</mark><br>
              jawaban = paling sial + 1 = <mark>total − terkecil + syarat</mark><br>
              <span style="font-size:12.5px">mustahil kalau ada toples yang isinya kurang dari syarat</span>`,
        verifikasi: 'Diadu dengan pencarian menyeluruh — daftarkan SEMUA keadaan pengambilan — pada 500 susunan acak dengan syarat 0 sampai 4. Nol beda.',
        pesan: 'Cari dulu keadaan paling sialnya di Lab 1 — rumusnya lebih membekas kalau kamu sendiri yang melihat lawan itu bertahan.',
      }),

      /* ============ LAB 2 · TRIK ============ */
      Lab({
        judul: 'Lab 2 · Trik satu angka — yang paling terasa curang',
        petunjuk: 'dari 100 angka, cuma 1 yang perlu kamu lihat',
        isi:
          `<p style="margin:0 0 10px">Soal nomor 18 memberi kamu <b>100 angka</b>: toples pertama 10 butir, kedua 20, sampai keseratus 1.000 butir. Kelihatannya kamu harus memikirkan seratus toples.</p>
           <p style="margin:0 0 10px">Tidak. Dari seratus angka itu, yang benar-benar perlu kamu <b>lihat</b> cuma satu — yang <b>terkecil</b>. Sisanya cukup dijumlahkan, dan tidak peduli bagaimana isinya dibagi-bagi.</p>
           <p style="margin:0 0 12px">Dan karena angkanya berpola 10, 20, 30, jumlahnya pun tidak perlu dijumlahkan satu per satu. Pakai rumus deret: 10 × (1+2+…+100) = 10 × 5.050.</p>
           <p style="margin:0 0 12px">Sebagai pembanding: kalau soal itu dikerjakan dengan mendaftar semua keadaan pengambilan satu per satu, banyaknya keadaan punya <b>${String(M.phRuang(C18)).length} digit</b>. Rumusnya cuma tiga operasi.</p>` +
          `<div class="ctl">
            <button class="btn" id="${ids.i('tgo')}">Kerjakan soal 100 toples</button>
            <button class="btn alt" id="${ids.i('tgeser')}">Buktikan isi lain tidak berpengaruh</button>
          </div>` +
          Wadah({ ids, id: 'tviz', gaya: 'margin:14px 0' }) +
          Keluaran({ ids, id: 'tout', isi: 'Tekan “Kerjakan soal 100 toples” untuk mulai.' }),
      }),

      Catatan({
        jenis: 'baik',
        isi: `<b>Kenapa cuma yang terkecil yang berpengaruh.</b> Lawanmu akan memilih satu toples untuk dihindari, lalu menghabiskan semua toples lain. Supaya dia bertahan paling lama, toples yang dia hindari harus yang <b>paling sedikit isinya</b> — sebab yang dia korbankan cuma segitu.
          <br><br>Jadi bentuk rumusnya total dikurangi yang terkecil. Toples-toples besar tidak pernah ditanya satu per satu, mereka cuma menyumbang ke jumlah.
          <br><br>Yang membuatnya terasa curang: seluruh soal bercerita tentang bebek yang mengambil biskuit satu per satu, dan <b>jawabanmu tidak pernah menyebut bebek sama sekali</b>.
          <span class="tiny" style="display:block;margin-top:6px">✅ Diuji: memindahkan butir antar toples besar tanpa mengubah jumlah dan yang terkecil, jawabannya tidak berubah pada 500 dari 500 percobaan.</span>`,
      }),

      /* ============ LAB 3 · MESIN CAPIT ============ */
      Lab({
        judul: 'Lab 3 · Kalau bentuknya lebih rumit',
        petunjuk: 'OSN-K 2023 nomor 19',
        isi:
          `<p style="margin:0 0 12px">Tidak semua soal punya rumus sependek itu. Kadang kamu harus benar-benar mencari keadaan paling sialnya. Cara berpikirnya tetap sama persis: cari yang paling lama bertahan, lalu tambah satu.</p>
           <p style="margin:0 0 12px">Mesin capit berisi ${STOK.boneka} boneka, ${STOK.bola} bola, ${STOK.mobil} mobil-mobilan, dan ${STOK.puzzle} puzzle. Tiap tarikan berharga Rp 10.000 dan memberi satu mainan acak. Pak Dengklek butuh 2 mainan untuk masing-masing 5 bebek, dan semua bebek harus dapat kombinasi jenis yang sama.</p>` +
          `<div class="ctl">
            <button class="btn" id="${ids.i('cgo')}">Cari keadaan paling sial</button>
          </div>` +
          Keluaran({ ids, id: 'cout', isi: 'Tekan “Cari keadaan paling sial” untuk mulai.' }),
      }),

      /* ============ KUMPULAN CARA CEPAT ============ */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Enam bentuk yang menutup hampir semua soal bernada "dijamin".',
        isi: Tab({
          ids, id: 'trik',
          daftar: [
            {
              kunci: 'c1', judul: 'Rumus inti',
              isi: `<p style="margin:0 0 10px">Untuk soal berbentuk toples: beberapa wadah, pengambil datang satu per satu, tiap wadah harus tersentuh sekian kali.</p>` +
                Rumus({
                  label: 'Minimal supaya dijamin',
                  isi: `<mark>total isi − isi wadah terkecil + syarat</mark><br>
                        <span style="font-size:12.5px">mustahil kalau ada wadah yang isinya kurang dari syarat</span>`,
                  verifikasi: 'Diadu dengan pencarian menyeluruh pada 500 susunan acak, syarat 0 sampai 4.',
                }) +
                `<p class="tiny">Perhatikan tanda plus di ujung. Kalau kamu berhenti di "total − terkecil + syarat − 1", itu keadaan yang masih gagal, bukan jawabannya.</p>`,
            },
            {
              kunci: 'c2', judul: 'Dijamin vs mungkin',
              isi: `<p style="margin:0 0 10px">Jebakan paling sering. Dua pertanyaan ini bunyinya nyaris sama.</p>` +
                Rumus({
                  label: 'Bandingkan',
                  isi: `dijamin &nbsp;→&nbsp; <mark>total − terkecil + syarat</mark><br>
                        mungkin &nbsp;→&nbsp; <mark>banyak wadah × syarat</mark>`,
                  verifikasi: 'Keduanya diadu dengan pencarian menyeluruh. Untuk soal 2024 nomor 17: mungkin 7, dijamin 31.',
                }) +
                `<p class="tiny">Untuk soal 100 toples, bedanya 500 lawan 50.495. Salah membaca satu kata, jawabanmu meleset seratus kali lipat.</p>`,
            },
            {
              kunci: 'c3', judul: 'Wadah kosong',
              isi: `<p style="margin:0 0 10px">Yang paling sering luput, dan yang paling merugikan karena jawabannya bukan angka.</p>` +
                Rumus({
                  label: 'Sebelum menghitung apa pun',
                  isi: `ada wadah yang isinya <mark>kurang dari syarat</mark> &nbsp;→&nbsp; <mark>MUSTAHIL</mark>`,
                  verifikasi: 'Diuji: toples kosong membuat seluruh soalnya mustahil, bukan diabaikan.',
                }) +
                `<p class="tiny">Toples kosong tidak akan pernah tercicipi berapa pun bebek yang datang. Periksa ini dulu, sebelum menjumlahkan.</p>`,
            },
            {
              kunci: 'c4', judul: 'Soal balik',
              isi: `<p style="margin:0 0 10px">Kadang jawabannya yang diberikan, dan yang ditanya susunannya. Bentuk soal 2024 nomor 19.</p>` +
                Rumus({
                  label: 'Balik rumusnya',
                  isi: `jawaban = total − terkecil + syarat<br>
                        maka <mark>terkecil = total − jawaban + syarat</mark>`,
                  verifikasi: 'Untuk total 25, jawaban 20, syarat 1: terkecil = 6. Ada 21 susunan yang memenuhi.',
                }) +
                `<p class="tiny">Setelah nilai terkecilnya ketemu, sisanya jadi soal kombinatorika biasa: cacah susunan yang terkecilnya tepat segitu.</p>`,
            },
            {
              kunci: 'c5', judul: 'Bentuk tanpa rumus',
              isi: `<p style="margin:0 0 10px">Kalau soalnya tidak berbentuk toples, jangan cari rumus. Cari keadaannya.</p>` +
                Rumus({
                  label: 'Tiga langkah yang selalu berlaku',
                  isi: `1. daftar semua cara <mark>memenuhi</mark> syarat<br>
                        2. cari keadaan terbanyak yang <mark>belum</mark> memenuhi satu pun<br>
                        3. <mark>tambah satu</mark>`,
                  verifikasi: 'Dipakai pada mesin capit OSN-K 2023 nomor 19: paling sial 19 tarikan, jawabannya 20.',
                }) +
                `<p class="tiny">Langkah 1 sering menyaring banyak kemungkinan. Di soal mesin capit, dari sepuluh kombinasi cuma dua yang stoknya cukup.</p>`,
            },
            {
              kunci: 'c6', judul: 'Pernyataan mana yang pasti benar',
              isi: `<p style="margin:0 0 10px">Bentuk pilihan ganda, seperti OSN-K 2023 nomor 6.</p>` +
                Rumus({
                  label: 'Cara tercepat',
                  isi: `untuk tiap pernyataan, cari <mark>satu contoh pembatal</mark><br>
                        ketemu satu saja &nbsp;→&nbsp; pernyataan itu gugur`,
                  verifikasi: 'Diuji pada seluruh 8 cara membagi 7 buah busuk ke dua kotak.',
                }) +
                `<p class="tiny">Jangan mencoba membuktikan pernyataan itu benar. Jauh lebih cepat mencari satu keadaan yang mematahkannya.</p>`,
            },
          ],
        }),
      }),

      /* ============ UJI SENDIRI ============ */
      Kartu({
        judul: 'Uji sendiri: rumus vs mendaftar semua keadaan',
        sub: 'Diuji pada susunan toples ACAK, bukan cuma angka soal.',
        isi:
          `<div class="ctl">
            <button class="btn" id="${ids.i('ugo')}">Uji susunan di Lab 1</button>
            <button class="btn alt" id="${ids.i('uall')}">Uji 200 susunan acak</button>
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
              isi: `<p style="margin:0 0 10px">"Minimal bebek yang perlu diundang agar semua tipe biskuit pernah dicicipi oleh setidaknya 1 ekor bebek."</p>` +
                Catatan({ isi: `<b>Kata "agar semua … pernah" itu setara dengan "dijamin".</b> Tidak boleh ada satu pun urutan pengambilan yang gagal. Jadi hitung yang paling sial, lalu tambah satu.` }),
            },
            {
              kunci: 'b', judul: 'B · Kaus kaki',
              isi: `<p style="margin:0 0 10px">"Laci gelap berisi 5 kaus kaki hitam dan 5 putih. Berapa yang harus diambil supaya pasti dapat sepasang sewarna?"</p>` +
                Catatan({ isi: `<b>Bentuk paling murni.</b> Paling sial kamu dapat satu hitam dan satu putih — dua kaus kaki, masih gagal. Yang ketiga pasti menyamai salah satunya. Jawabannya 3, bukan 6.` }),
            },
            {
              kunci: 'c', judul: 'C · Mesin capit',
              isi: `<p style="margin:0 0 10px">"Berapa uang minimal yang perlu dipersiapkan agar dijamin mendapat mainan yang diinginkan?"</p>` +
                Catatan({ isi: `<b>Uang cuma pembungkus.</b> Yang sebenarnya ditanya banyaknya tarikan. Bedanya dengan soal toples: di sini "berhasil" punya beberapa bentuk, jadi kamu harus mendaftar dulu bentuk mana saja yang stoknya cukup.` }),
            },
            {
              kunci: 'd', judul: 'D · Pernyataan pasti',
              isi: `<p style="margin:0 0 10px">"Dua kotak berisi 40 buah, 7 di antara 80 buah busuk. Pernyataan mana yang pasti benar?"</p>` +
                Catatan({ isi: `<b>Bentuk terbalik.</b> Kamu tidak mencari angka, tapi menguji pernyataan. Caranya sama: untuk tiap pernyataan, cari satu keadaan yang mematahkannya. Kalau tidak ada, pernyataannya pasti benar.` }),
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: `<p style="margin:0 0 10px">"Minimal berapa bebek supaya <b>mungkin</b> semua tipe biskuit tercicipi?"</p>` +
                Catatan({ jenis: 'awas', isi: `<b>Ini BUKAN skenario terburuk.</b> "Mungkin" berarti kamu boleh memilih urutan yang paling beruntung. Jawabannya cuma banyak tipe dikali syaratnya.
                  <br><br>Untuk soal 2024 nomor 17: mungkin <b>7</b>, dijamin <b>31</b>. Untuk soal nomor 18: mungkin <b>500</b>, dijamin <b>50.495</b>.
                  <br><br>Satu kata berbeda, jawabannya meleset seratus kali lipat. Baca kata itu dua kali sebelum menghitung.` }),
            },
          ],
        }),
      }),

      /* ============ BEDAH SOAL ============ */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2024 · soal 17–19',
        sub: 'Mencicipi Biskuit. Tiga nomor bertingkat, dan nomor terakhir membalik rumusnya.',
        isi: Kisi([
          KartuSoal({ ids, nomor: '2024 · soal 17', idKeluaran: 's1',
            pertanyaan: '7 tipe biskuit, masing-masing 5 butir. Tiap tipe dicicipi minimal 1 ekor.' }),
          KartuSoal({ ids, nomor: '2024 · soal 18', idKeluaran: 's2',
            pertanyaan: '100 tipe, tipe ke-i berisi 10i butir. Tiap tipe dicicipi minimal 5 ekor.' }),
          KartuSoal({ ids, nomor: '2024 · soal 19', idKeluaran: 's3',
            pertanyaan: 'A + B + C = 25 dan jawabannya tepat 20. Ada berapa susunan?' }),
        ]) + `<div class="ctl" style="margin-top:12px">
            <button class="btn" id="${ids.i('solve')}">Selesaikan ketiganya</button>
            <button class="btn alt" id="${ids.i('solve2')}">Soal 2023 nomor 6</button>
          </div>` +
          Keluaran({ ids, id: 's4', isi: '—', gaya: 'margin-top:12px' }),
      }),

      /* ============ KAPAN INI BUKAN ============ */
      Catatan({
        jenis: 'awas',
        isi: `<b>Kapan rumus ini TIDAK berlaku.</b> Semua baris di bawah sudah diuji, bukan dikira-kira:` +
          Tabel({
            kiri: true,
            kepala: ['Bunyi soal', 'Yang terjadi'],
            baris: [
              ['"minimal supaya DIJAMIN / PASTI"', '✅ total − terkecil + syarat'],
              ['"minimal supaya MUNGKIN / bisa"', '❌ banyak wadah × syarat — jauh lebih kecil'],
              ['ada wadah yang isinya <b>kurang dari syarat</b>', '❌ MUSTAHIL, bukan angka'],
              ['tiap pengambil boleh mengambil <b>lebih dari satu</b>', '❌ rumusnya berubah total'],
              ['ada wadah yang <b>tidak wajib</b> tersentuh', '❌ yang terkecil bukan lagi penentunya'],
              ['"berapa kemungkinan" tanpa kata dijamin', '❌ itu kombinatorika, bukan modul ini'],
            ],
          }) +
          `<span style="display:block;margin-top:10px">Baris terakhir dua-duanya diuji. Kalau satu wadah boleh dilewat, jawaban soal nomor 17 turun dari 31 jadi 26 — karena lawanmu kehilangan sasaran terbaiknya.</span>`,
      }),

      Catatan({
        isi: `<b>Verifikasi 30 detik sebelum menulis jawaban.</b> Dua pemeriksaan, dan yang pertama menangkap hampir semua kesalahan.
          <br><br>Pertama, <b>kecilkan soalnya</b>. Ganti angkanya dengan 2 toples berisi 2 butir, lalu daftarkan sendiri semua kemungkinan dengan tangan. Rumusmu harus memberi angka yang sama. Ini pemeriksaan paling ampuh dan hampir tidak pernah dipakai orang.
          <br><br>Kedua, <b>cek arah jawabannya</b>. Jawabanmu harus lebih besar daripada "supaya mungkin", dan tidak boleh melebihi total isi seluruh wadah. Kalau melebihi total, kamu pasti salah tanda.`,
      }),

    ].join('');

    /* ================= PERILAKU ================= */

    const baca = () => {
      const isi = bacaAngka(ids.s('isi'));
      const m = ids.n('m', { min: 0, maks: 20, bawaan: 1 });
      return { isi, m };
    };

    const laporkanMustahil = (isi, m) => {
      const kosong = isi.filter((x) => x === 0).length;
      const kurang = isi.filter((x) => x > 0 && x < m).length;
      const negatif = isi.filter((x) => x < 0).length;
      return `${merah('MUSTAHIL — tidak ada angka yang menjawabnya.')}

${negatif ? '  ada ' + negatif + ' toples berisi angka negatif\n' : ''}${kosong ? '  ada ' + kosong + ' toples KOSONG — tidak akan pernah tercicipi\n' : ''}${kurang ? '  ada ' + kurang + ' toples yang isinya kurang dari syarat ' + m + '\n' : ''}
${redup('Berapa pun bebek yang datang, toples itu tidak bisa memenuhi syarat.')}
${redup('Periksa ini SEBELUM menjumlahkan. Angka nol tidak boleh dilewati begitu saja.')}`;
    };

    /* ---- Lab 1 ---- */
    ids.klik('go', () => {
      bukaRumus(ids, 'rumus');
      const { isi, m } = baca();
      if (!isi.length) {
        ids.q('viz').innerHTML = '';
        ids.tulis('out', 'Tulis isi tiap toples dulu, dipisahkan koma. Misalnya 5, 5, 5.');
        return;
      }
      const jawab = M.phDijamin(isi, m);
      ids.q('viz').innerHTML = gambarToples(isi);
      if (jawab === null) { ids.tulis('out', laporkanMustahil(isi, m)); return; }
      const total = isi.reduce((a, b) => a + b, 0);
      const kecil = Math.min(...isi);
      const ke = isi.indexOf(kecil) + 1;
      if (m === 0) {
        ids.tulis('out', `Syaratnya nol, jadi tidak ada yang perlu dipenuhi.\n\n  jawaban = ${hijau('0')}`);
        return;
      }
      const sial = total - kecil + (m - 1);
      ids.tulis('out',
`${isi.length} toples, total ${angka(total)} butir.
Toples terkecil: nomor ${ke}, isinya ${kecil} butir. ${redup('(disorot merah)')}

SKENARIO PALING SIAL — lawan menghindari toples ${ke} selama mungkin
  habiskan semua toples lain : ${angka(total)} − ${kecil} = ${angka(total - kecil)} bebek
  ambil ${m - 1} butir dari toples ${ke}${m > 1 ? ' (kurang satu dari syarat)' : ' (belum tersentuh)'} : ${m - 1} bebek
  ${'─'.repeat(38)}
  paling lama bertahan = ${merah(angka(sial))} bebek, syarat masih GAGAL

Bebek ke-${angka(sial + 1)} tidak punya pilihan lain selain toples ${ke}.

  jawaban = ${angka(total)} − ${kecil} + ${m} = ${hijau(angka(jawab))}

${redup('Bandingkan: kalau yang ditanya "supaya MUNGKIN", jawabannya cuma ' + angka(M.phMungkin(isi, m)) + '.')}`);
    });

    ids.klik('adu', () => {
      const { isi, m } = baca();
      if (!isi.length) { ids.tulis('out', 'Tulis isi tiap toples dulu.'); return; }
      const jawab = M.phDijamin(isi, m);
      if (jawab === null) { ids.tulis('out', laporkanMustahil(isi, m)); return; }
      const kasar = M.phKasar(isi, m);
      const ruang = M.phRuang(isi);
      ids.tulis('out',
`CARA 1 — daftarkan SEMUA keadaan pengambilan
  ${ruang.toLocaleString('id-ID')} keadaan
  hasil = ${kasar === undefined ? redup('(dilewati, terlalu banyak)') : hijau(angka(kasar))}

CARA 2 — rumus
  total − terkecil + syarat = ${hijau(angka(jawab))}   ${redup('3 operasi')}

${kasar === undefined ? '' : (kasar === jawab
  ? hijau('✓ DUA CARA SAMA') + '\n' + redup(`Rumusnya ${angka(Math.floor(Number(ruang) / 3))}× lebih ringan.`)
  : merah('✗ beda'))}`);
    });

    /* ---- Lab 2 · trik ---- */
    ids.klik('tgo', () => {
      const jawab = M.phDijamin(C18, M18);
      const total = C18.reduce((a, b) => a + b, 0);
      ids.q('tviz').innerHTML = gambarToples(C18.slice(0, 20));
      ids.tulis('tout',
`${C18.length} toples: ${C18[0]}, ${C18[1]}, ${C18[2]}, … , ${angka(C18[C18.length - 1])} butir. Syarat ${M18} ekor tiap toples.
${redup('(gambar memperlihatkan 20 toples pertama saja)')}

Langkah 1 — jumlahkan semuanya, pakai rumus deret
  ${C18[0]} × (1 + 2 + … + ${C18.length}) = ${C18[0]} × ${angka(C18.length * (C18.length + 1) / 2)} = ${angka(total)}
  ${redup('tidak perlu menjumlahkan 100 angka satu per satu')}

Langkah 2 — lihat yang terkecil
  toples ${C18.indexOf(Math.min(...C18)) + 1}, isinya ${Math.min(...C18)} butir
  ${redup('99 angka lainnya tidak pernah dilihat satu per satu')}

Langkah 3 — tiga operasi
  ${angka(total)} − ${Math.min(...C18)} + ${M18} = ${hijau(angka(jawab))}

${redup('Kalau didaftarkan satu per satu, keadaannya ada ' + String(M.phRuang(C18)).length + ' digit.')}
${redup('Kamu tidak pernah menyebut satu pun bebek.')}`);
    });

    ids.klik('tgeser', () => {
      const asal = [3, 8, 9, 20];
      const geser = [3, 12, 5, 20];
      const a = M.phDijamin(asal, 1), b = M.phDijamin(geser, 1);
      ids.q('tviz').innerHTML = gambarToples(asal) + gambarToples(geser);
      let uji = 0, berubah = 0;
      for (let p = 0; p < 300; p++) {
        const isi = [...Array(2 + Math.floor(Math.random() * 5))]
          .map(() => 1 + Math.floor(Math.random() * 9));
        const kecil = Math.min(...isi);
        const besar = isi.map((v, i) => v > kecil ? i : -1).filter((i) => i >= 0);
        if (besar.length < 2) continue;
        const i = besar[0], j = besar[besar.length - 1];
        const d = isi.slice(), pindah = Math.min(d[i] - kecil, 3);
        if (pindah <= 0) continue;
        d[i] -= pindah; d[j] += pindah;
        if (Math.min(...d) !== kecil) continue;
        uji++;
        if (M.phDijamin(d, 1) !== M.phDijamin(isi, 1)) berubah++;
      }
      ids.tulis('tout',
`Dua susunan berbeda, jumlah dan toples terkecilnya sama:

  susunan 1 : ${asal.join(', ')}   total ${asal.reduce((x, y) => x + y, 0)}, terkecil ${Math.min(...asal)}
  susunan 2 : ${geser.join(', ')}   total ${geser.reduce((x, y) => x + y, 0)}, terkecil ${Math.min(...geser)}

  jawaban 1 = ${hijau(a)}
  jawaban 2 = ${hijau(b)}

${a === b ? hijau('✓ SAMA PERSIS') : merah('✗ beda')}

Diuji pada ${uji} susunan acak: butir dipindahkan antar toples besar,
jumlah dan yang terkecil dijaga tetap.
  jawaban berubah pada ${berubah === 0 ? hijau('0') : merah(berubah)} susunan

${redup('Toples besar tidak pernah ditanya satu per satu. Mereka cuma menyumbang ke jumlah.')}`);
    });

    /* ---- Lab 3 · mesin capit ---- */
    ids.klik('cgo', () => {
      const r = M.phCapit(STOK, 5, 2);
      const nama = { boneka: 'boneka', bola: 'bola', mobil: 'mobil-mobilan', puzzle: 'puzzle' };
      ids.tulis('cout',
`Langkah 1 — kombinasi mana yang stoknya CUKUP untuk 5 bebek?

${Object.keys(STOK).map((k) => {
  const dua = STOK[k] >= 10;
  return `  ${nama[k].padEnd(14)} ${String(STOK[k]).padStart(2)} buah   ${
    dua ? hijau('cukup untuk 10 (5 pasang sejenis)') : redup('kurang dari 10')}   ${
    STOK[k] >= 5 ? hijau('cukup untuk 5') : merah('kurang dari 5')}`;
}).join('\n')}

  Yang lolos: ${hijau(r.sasaran.map((s) => Object.keys(s).map((k) => nama[k]).join(' + ')).join('  |  '))}
  ${redup('Semua kombinasi yang memakai bola atau puzzle gugur — stoknya di bawah 5.')}

Langkah 2 — keadaan paling sial yang BELUM memenuhi apa pun
  ${Object.keys(r.bukti).map((k) => `${nama[k]}: ${r.bukti[k]}`).join(', ')}
  = ${merah(r.terburuk + ' tarikan')}, dan belum satu pun kombinasi terpenuhi

Langkah 3 — tambah satu
  ${hijau(r.tarikan + ' tarikan')} × Rp 10.000 = ${hijau('Rp ' + (r.tarikan * 10000).toLocaleString('id-ID'))}

${redup('Sisa stok saat itu cuma boneka dan mobil-mobilan, jadi tarikan berikutnya')}
${redup('pasti melengkapi salah satu dari dua kombinasi yang lolos tadi.')}`);
    });

    /* ---- Uji sendiri ---- */
    ids.klik('ugo', () => {
      const { isi, m } = baca();
      if (!isi.length) { ids.tulis('uout', 'Tulis isi toples dulu di Lab 1.'); return; }
      const jawab = M.phDijamin(isi, m);
      if (jawab === null) { ids.tulis('uout', laporkanMustahil(isi, m)); return; }
      const kasar = M.phKasar(isi, m);
      ids.tulis('uout',
`Susunan: ${isi.join(', ')}   syarat ${m}

  rumus                        : ${hijau(angka(jawab))}
  daftar semua ${M.phRuang(isi).toLocaleString('id-ID')} keadaan : ${
        kasar === undefined ? redup('(dilewati, terlalu banyak)') : hijau(angka(kasar))}
  supaya MUNGKIN (bukan dijamin): ${redup(angka(M.phMungkin(isi, m)))}

${kasar === undefined || kasar === jawab
  ? hijau('✓ COCOK') : merah('✗ beda')}`);
    });

    ids.klik('uall', () => {
      let uji = 0, beda = 0, contoh = null, mustahil = 0;
      for (let putar = 0; putar < 200; putar++) {
        const n = 1 + Math.floor(Math.random() * 5);
        const isi = [...Array(n)].map(() => Math.floor(Math.random() * 7));
        const m = Math.floor(Math.random() * 5);
        const jawab = M.phDijamin(isi, m);
        if (jawab === null) { mustahil++; continue; }
        const kasar = M.phKasar(isi, m);
        if (kasar === undefined) continue;
        uji++;
        if (kasar !== jawab) { beda++; if (!contoh) contoh = isi.join(',') + ' m=' + m; }
      }
      ids.tulis('uout',
`Menguji dengan susunan ACAK — isi toples dan syaratnya dibangkitkan
sendiri, termasuk toples kosong dan syarat nol.

  rumus diadu dengan mendaftar semua keadaan
    ${beda === 0 ? hijau(uji + ' / ' + uji + ' cocok') : merah((uji - beda) + ' / ' + uji)}

  susunan yang memang MUSTAHIL dan ditolak dengan benar
    ${hijau(mustahil)}

${beda === 0
  ? hijau('✓ TIDAK ADA YANG MELESET') + '\n' + redup('Rumusnya berlaku umum, bukan cuma pas untuk angka soal 2024.')
  : merah('✗ meleset pada ' + contoh)}`);
    });

    /* ---- Bedah soal ---- */
    ids.klik('solve', () => {
      const j17 = M.phDijamin(C17, M17);
      ids.tulis('s1',
`${C17.length} toples × ${C17[0]} butir, syarat ${M17} ekor.

  total ${C17.reduce((a, b) => a + b, 0)} − terkecil ${Math.min(...C17)} + ${M17} = ${hijau(angka(j17))}

${redup('Paling sial: 6 toples habis (30 bebek), toples ke-7 belum tersentuh.')}
${redup('Bebek ke-31 tidak punya pilihan lain.')}`);

      const j18 = M.phDijamin(C18, M18);
      const t18 = C18.reduce((a, b) => a + b, 0);
      ids.tulis('s2',
`${C18.length} toples: ${C18[0]}, ${C18[1]}, … , ${angka(C18[C18.length - 1])} butir. Syarat ${M18} ekor.

  total = ${C18[0] / 1} × ${angka(C18.length * (C18.length + 1) / 2)} = ${angka(t18)}
  ${angka(t18)} − ${Math.min(...C18)} + ${M18} = ${hijau(angka(j18))}

${redup('Dari 100 angka, cuma yang terkecil yang dilihat satu per satu.')}`);

      const susunan = M.phSusunan(25, 20, 3, 1);
      const kecilnya = 25 - 20 + 1;
      ids.tulis('s3',
`Rumusnya dibalik. total − terkecil + syarat = jawaban
  25 − terkecil + 1 = 20   →   terkecil = ${hijau(kecilnya)}

Sekarang tinggal mencacah: ada berapa susunan &lt;A,B,C&gt; berjumlah 25
yang nilai terkecilnya tepat ${kecilnya}?

  semua ≥ ${kecilnya}  : C(9,2) = 36
  semua ≥ ${kecilnya + 1}  : C(6,2) = 15
  selisihnya = ${hijau(susunan.length)}

${redup('Contoh: ' + susunan.slice(0, 4).map((t) => '<' + t.join(',') + '>').join('  '))}
${redup('Nomor ini menyilang ke kombinatorika — modul 11 memakai cara yang sama.')}`);
    });

    ids.klik('solve2', () => {
      const pecah = [...Array(8)].map((_, a) => [a, 7 - a]);
      const cek = {
        1: ([a, b]) => (40 - a) >= 36 && (40 - b) >= 36,
        2: ([a, b]) => a > 3 || b > 3,
        3: ([a, b]) => (40 - a) >= 37 || (40 - b) >= 37,
        4: ([a, b]) => (((40 - a) >= 33) ? 1 : 0) + (((40 - b) >= 33) ? 1 : 0) === 1,
      };
      const bunyi = {
        1: 'setiap kotak berisi setidaknya 36 buah segar',
        2: 'salah satu kotak berisi lebih dari 3 buah busuk',
        3: 'salah satu kotak berisi setidaknya 37 buah segar',
        4: 'tepat satu kotak berisi setidaknya 33 buah segar',
      };
      const pasti = [];
      const baris = Object.keys(cek).map((no) => {
        const lawan = pecah.filter((p) => !cek[no](p));
        if (!lawan.length) pasti.push(no);
        return `  (${no}) ${bunyi[no]}
      ${lawan.length ? merah('gugur') + ' — contoh pembatal: busuk terbagi ' + lawan[0][0] + ' dan ' + lawan[0][1]
                     : hijau('PASTI BENAR') + ' — tidak ada satu pun pembagian yang mematahkannya'}`;
      }).join('\n');
      ids.tulis('s4',
`OSN-K 2023 nomor 6 — dua kotak berisi 40 buah, 7 dari 80 busuk.

Cara tercepat: coba SEMUA 8 cara membagi 7 buah busuk ke dua kotak,
lalu cari satu contoh yang mematahkan tiap pernyataan.

${baris}

  Yang pasti benar: ${hijau(pasti.join(' dan '))}

${redup('Jangan mencoba membuktikan pernyataannya benar. Jauh lebih cepat mencari pembatal.')}`);
    });

    pasangTab('trik');
    pasangTab('samar');
  },
};
