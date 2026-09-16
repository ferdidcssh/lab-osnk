/* ============================================================
   MODUL 10 — LINTASAN EULER
   Semua rumus, angka, dan jawaban soal di berkas ini dibuktikan
   oleh verify/10-euler.py — jangan diubah tanpa menjalankannya lagi.

   Acuan teori (dicek ke sumber luar):
     Euler 1736 · Hierholzer 1873
     West, Introduction to Graph Theory, Teorema 1.2.33
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, AreaTeks, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Tabel, KartuSoal, hijau, merah, redup,
} from '../core/ui.js';

/* ---------- peta OSN-K 2024 nomor 5 (Parade Bebek) ---------- */
const RUAS_2024 = [['0','1'],['0','5'],['0','4'],['1','6'],['1','2'],['5','6'],
                   ['5','7'],['4','7'],['4','3'],['2','6'],['2','3'],['3','7']];
const LETAK_2024 = {
  '0': [205, 34], '1': [52, 158], '2': [125, 330], '3': [300, 328],
  '4': [368, 155], '5': [205, 132], '6': [152, 218], '7': [262, 215],
};
const TEKS_2024 = RUAS_2024.map(([a, b]) => a + '-' + b).join('\n');

/* ---------- peta OSN-K 2023 nomor 14, buat pembanding ---------- */
const RUAS_2023 = [['1','2'],['1','0'],['2','4'],['2','0'],['2','3'],['3','4'],
                   ['3','0'],['3','5'],['3','6'],['4','5'],['0','6'],['5','6']];
const LETAK_2023 = {
  '1': [58, 78], '2': [250, 52], '4': [452, 100],
  '0': [142, 252], '3': [322, 224], '5': [486, 316], '6': [292, 402],
};

/* Letak melingkar, dipakai kalau siswa mengetik petanya sendiri. */
function letakLingkar(titik) {
  const n = titik.length, R = Math.max(110, n * 17), letak = {};
  titik.forEach((v, i) => {
    const sudut = -Math.PI / 2 + 2 * Math.PI * i / n;
    letak[v] = [Math.round(R + 30 + R * Math.cos(sudut)),
                Math.round(R + 30 + R * Math.sin(sudut))];
  });
  return letak;
}

/* ---------- PENGGAMBAR PETA ----------
   Ukuran diambil dari viewBox, bukan dari clientWidth — panel modul masih
   tersembunyi saat dibangun, jadi lebar elemennya terbaca 0.
   rute : daftar titik satu rute yang mau disorot, misal ['0','1','6'] */
function gambarPeta(ruas, letak, { rute = null, tampilkanDerajat = true } = {}) {
  const d = M.eulerDerajat(ruas);
  const titik = Object.keys(letak);
  if (!titik.length) return `<div class="out">Petanya masih kosong.</div>`;
  const R = 17;
  const xs = titik.map((v) => letak[v][0]), ys = titik.map((v) => letak[v][1]);
  const W = Math.max(...xs) + R + 22, H = Math.max(...ys) + R + 22;

  /* ruas mana saja yang dipakai rute yang disorot */
  const dipakai = new Set();
  if (rute) for (let i = 0; i < rute.length - 1; i++)
    dipakai.add([rute[i], rute[i + 1]].sort().join('|'));

  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Denah jalan: lingkaran adalah persimpangan, garis adalah jalan">`;

  ruas.forEach(([a, b]) => {
    if (!letak[a] || !letak[b]) return;
    const kunci = [a, b].sort().join('|');
    const nyala = rute && dipakai.has(kunci);
    s += `<line x1="${letak[a][0]}" y1="${letak[a][1]}"
      x2="${letak[b][0]}" y2="${letak[b][1]}"
      stroke="${nyala ? 'var(--merah)' : 'var(--garis-tebal)'}"
      stroke-width="${nyala ? 3.4 : 1.6}" stroke-linecap="round"/>`;
  });

  titik.forEach((v) => {
    const [x, y] = letak[v];
    const ganjil = (d[v] || 0) % 2 === 1;
    const ujung = rute && (rute[0] === v || rute[rute.length - 1] === v);
    s += `<circle cx="${x}" cy="${y}" r="${R}"
      fill="${ganjil ? 'var(--stabilo)' : '#fff'}"
      stroke="${ujung ? 'var(--merah)' : 'var(--garis-tebal)'}"
      stroke-width="${ganjil || ujung ? 2.8 : 1.6}"/>
      <text x="${x}" y="${y + 5}" text-anchor="middle"
      style="font-family:var(--mono);font-size:14px;font-weight:700;
      fill:${ganjil ? 'var(--tinta)' : 'var(--tinta-3)'}">${v}</text>`;
    if (tampilkanDerajat) {
      s += `<text x="${x}" y="${y - R - 6}" text-anchor="middle"
        style="font-family:var(--mono);font-size:11px;font-weight:${ganjil ? 700 : 400};
        fill:${ganjil ? 'var(--merah)' : 'var(--tinta-3)'}">${d[v] || 0}</text>`;
    }
  });
  return s + '</svg>';
}

/* Susun letak untuk daftar ruas apa pun: pakai peta bawaan kalau cocok. */
function letakUntuk(ruas) {
  const titik = [...new Set(ruas.flat())].sort();
  const cocok = (letak) => titik.length === Object.keys(letak).length
    && titik.every((v) => letak[v]);
  if (cocok(LETAK_2024)) return LETAK_2024;
  if (cocok(LETAK_2023)) return LETAK_2023;
  return letakLingkar(titik);
}

export default {
  id: 'euler', n: '10', kelompok: 'Graf',
  judul: 'Lintasan Euler',
  lede: 'Soal ini menggoda kamu menggambar rutenya. Jangan. Untuk peta OSN-K 2024, mencoba-coba rute berarti menelusuri lebih dari tiga ribu jalan buntu — padahal jawabannya keluar dari menghitung ganjil-genap di delapan persimpangan.',
  lencana: ['<span class="chip r">2024 · soal 5</span>',
            '<span class="chip v">Rumus diadu 1.075 peta</span>'],

  kartu: [
    { q: '“Setiap jalan hanya dapat dilewati maksimal satu kali — minimal berapa hari?”', a: 'graf', why: 'Lintasan Euler. Hitung persimpangan berderajat ganjil, sebut t, lalu maks(1, t ÷ 2). Pastikan petanya nyambung.' },
    { q: '“Menelusuri semua jalan setidaknya sekali, berapa waktu minimum?”', a: 'graf', why: 'JEBAKAN — ini bukan Euler. Jalan boleh diulang, jadi jawabannya banyak ruas + ruas yang terpaksa diulang.' },
    { q: 'Peta yang terpisah jadi dua bagian tidak nyambung', a: 'graf', why: 'Rumus ganjil/2 harus dihitung per bagian lalu dijumlah. Satu lintasan tidak akan pernah menyeberang.' },
  ],
  kamus: [
    ['“hanya boleh dilewati sekali” + “berapa hari/rute”', 'Lintasan Euler'],
    ['“setidaknya sekali” + “waktu minimum”', 'Bukan Euler — jalan boleh diulang, jadi hitung ruas + ruas yang terpaksa diulang'],
    ['“tanpa mengangkat pensil”', 'Lintasan Euler, dengan kata lain'],
  ],

  bangun(root, { ids, pasangTab }) {
    let ruasKini = RUAS_2024;

    root.innerHTML = [

      /* ============ APA ITU ============ */
      Kartu({
        judul: 'Apa itu Lintasan Euler?',
        isi:
          `<p style="margin:10px 0">Kamu pasti pernah main tebak-tebakan menggambar amplop tanpa mengangkat pensil, dan tanpa menimpa garis yang sudah digambar. Kalau berhasil, kamu baru saja membuat <b>lintasan Euler</b>.</p>
           <p style="margin:10px 0">Aturannya cuma dua. Setiap garis harus dilewati <b>tepat sekali</b>, tidak boleh terlewat dan tidak boleh diulang. Titik pertemuannya boleh dilewati berkali-kali, bebas.</p>
           <p style="margin:10px 0">Ada dua kata yang perlu kamu bedakan. <b>Persimpangan</b> adalah titiknya. <b>Ruas jalan</b> adalah garis yang menghubungkan dua persimpangan. Dan <b>derajat</b> sebuah persimpangan adalah banyaknya ruas jalan yang menempel padanya. Cuma itu bekal yang kamu perlukan.</p>` +
          Catatan({
            isi: `<b>Asal-usulnya.</b> Kota Königsberg dulu punya tujuh jembatan. Warganya iseng bertanya: bisakah berjalan keliling kota, melewati tiap jembatan tepat sekali? Tidak ada yang berhasil, tapi tidak ada juga yang bisa menjelaskan kenapa.
              <br><br><b>Leonhard Euler</b> menjawabnya pada 1736 lewat tulisan <i>Solutio problematis ad geometriam situs pertinentis</i>. Jawabannya bukan "sudah dicoba semua dan tidak bisa". Euler membuktikan bahwa itu <b>mustahil</b>, dan alasannya sesederhana ganjil-genap. Tulisan itu dianggap kelahiran teori graf.
              <br><br>Lucunya, Euler cuma membuktikan setengahnya — bahwa derajat genap itu <b>syarat wajib</b>. Bukti bahwa syarat itu juga <b>sudah cukup</b> baru terbit 137 tahun kemudian, oleh <b>Carl Hierholzer</b> pada 1873, dan itu pun setelah Hierholzer meninggal muda.`,
          }) +
          Catatan({
            jenis: 'baik',
            isi: `<b>Kenapa penting untuk OSN-K?</b> Soal nomor 5 tahun 2024 memakainya persis: denah kota, tiap jalan maksimal sekali lewat, berapa hari minimal. Bentuk terselubungnya juga banyak — rute tukang pos, jadwal patroli, menggambar tanpa mengangkat pensil.
              <br><br>Yang berbahaya bukan rumusnya, tapi soal <b>tetangganya</b>. OSN-K 2023 nomor 14 memakai denah yang mirip sekali, tapi di sana jalan <b>boleh diulang</b>. Satu kata berbeda, rumusnya berubah total. Nanti kamu lihat di bagian penyamaran.`,
          }),
      }),

      /* ============ LAB 1 ============ */
      Lab({
        judul: 'Lab 1 · Hitung derajat, tandai yang ganjil',
        petunjuk: 'angka di atas lingkaran adalah derajatnya',
        isi:
          `<p style="margin:0 0 12px">Ini denah dari OSN-K 2024 nomor 5. Tekan tombolnya, lalu perhatikan persimpangan mana yang tersorot. Kamu boleh mengubah daftar jalannya untuk mencoba peta lain.</p>` +
          AreaTeks({ ids, id: 'in', label: 'daftar ruas jalan — satu baris satu jalan', nilai: TEKS_2024, baris: 7 }) +
          `<div class="ctl">
            <button class="btn" id="${ids.i('go')}">Hitung derajat</button>
            <button class="btn alt" id="${ids.i('reset')}">Kembalikan peta 2024</button>
          </div>` +
          Wadah({ ids, id: 'viz', gaya: 'margin:14px 0;max-width:480px' }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan “Hitung derajat” untuk mulai.' }),
      }),

      Catatan({
        jenis: 'baik',
        isi: `<b>Kenapa yang ganjil yang penting?</b> Bayangkan kamu sedang berjalan dan melewati sebuah persimpangan di tengah rute. Kamu <b>masuk</b> lewat satu jalan, lalu <b>keluar</b> lewat jalan lain. Masuk-keluar, selalu berpasangan.
          <br><br>Jadi persimpangan yang jalannya ganjil tidak bisa berada di tengah. Selalu ada satu jalan yang tidak kebagian pasangan. Persimpangan itu <b>terpaksa jadi ujung</b> — tempat rute dimulai, atau tempat rute berakhir.
          <br><br>Satu rute cuma punya dua ujung. Itulah seluruh isi teorinya.`,
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Minimum banyaknya lintasan',
        isi: `t = banyaknya persimpangan berderajat <b>ganjil</b><br>
              <mark>minimum lintasan = maks(1, t / 2)</mark><br>
              <span style="font-size:12.5px">syaratnya petanya <b>nyambung</b>. Kalau terpisah, hitung tiap bagian lalu jumlahkan.</span>`,
        verifikasi: 'Diadu dengan pencarian menyeluruh pada 1.075 peta berbeda, termasuk peta yang terpisah-pisah. Nol beda. Sesuai West, Introduction to Graph Theory, Teorema 1.2.33.',
        pesan: 'Hitung dulu derajatnya di Lab 1 — rumusnya lebih membekas kalau kamu sendiri yang melihat mana yang ganjil.',
      }),

      /* ============ LAB 2 · TRIK ============ */
      Lab({
        judul: 'Lab 2 · Trik satu persimpangan — yang paling terasa curang',
        petunjuk: 'periksa satu, dapat delapan',
        isi:
          `<p style="margin:0 0 10px">Denah OSN-K 2024 punya sifat yang gampang terlewat: <b>setiap persimpangan dilewati 3 jalan</b>. Semuanya, tanpa kecuali.</p>
           <p style="margin:0 0 12px">Kalau semua persimpangan derajatnya sama, kamu tidak perlu memeriksa satu per satu. Periksa <b>satu</b> saja. Kalau angkanya ganjil, berarti semuanya ganjil.</p>` +
          `<div class="ctl">
            <button class="btn" id="${ids.i('tgo')}">Periksa satu persimpangan saja</button>
            <button class="btn alt" id="${ids.i('tlama')}">Bandingkan dengan coba gambar rutenya</button>
          </div>` +
          Keluaran({ ids, id: 'tout', isi: 'Tekan tombolnya untuk mulai.' }),
      }),

      Catatan({
        jenis: 'baik',
        isi: `<b>Dua pengaman supaya kamu tidak salah hitung.</b> Keduanya gratis dan cuma butuh dua detik.
          <br><br><b>Pertama</b>, jumlahkan semua derajat. Hasilnya harus <b>tepat dua kali</b> banyaknya ruas jalan. Sebabnya sepele: tiap jalan punya dua ujung, jadi tiap jalan disebut dua kali. Kalau tidak pas, ada garis yang terlewat.
          <br><br><b>Kedua</b>, banyaknya persimpangan ganjil <b>selalu genap</b>. Kalau kamu dapat 3 atau 5, kamu pasti salah hitung. Hitung ulang.
          <span class="tiny" style="display:block;margin-top:6px">✅ Dua sifat ini diuji pada 4.000 peta acak, nol pelanggaran.</span>`,
      }),

      /* ============ LAB 3 · SUSUN RUTENYA ============ */
      Lab({
        judul: 'Lab 3 · Buktikan angkanya dengan rute sungguhan',
        petunjuk: 'rumus bilang 4 — mana buktinya?',
        isi:
          `<p style="margin:0 0 12px">Rumus cuma bilang "paling sedikit sekian". Supaya kamu percaya angkanya benar-benar tercapai, labnya menyusun rutenya betulan dengan cara Hierholzer. Tekan tombol untuk melihat satu per satu.</p>` +
          `<div class="ctl">
            <button class="btn" id="${ids.i('rgo')}">Susun rutenya</button>
            <button class="btn alt" id="${ids.i('rnext')}">Rute berikutnya</button>
          </div>` +
          Wadah({ ids, id: 'rviz', gaya: 'margin:14px 0;max-width:480px' }) +
          Keluaran({ ids, id: 'rout', isi: 'Tekan “Susun rutenya” untuk mulai.' }),
      }),

      /* ============ KUMPULAN CARA CEPAT ============ */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Enam hal yang membuat soal Euler selesai sebelum orang lain selesai menggambar.',
        isi: Tab({
          ids, id: 'trik',
          daftar: [
            {
              kunci: 'c1', judul: 'Rumus inti',
              isi: `<p style="margin:0 0 10px">Satu-satunya yang wajib kamu hafal. Perhatikan kata <b>maks</b> — tanpa itu, peta yang semua derajatnya genap akan dijawab 0 lintasan, padahal butuh 1.</p>` +
                Rumus({
                  label: 'Untuk peta yang nyambung',
                  isi: `t = 0 &nbsp;→&nbsp; <mark>1</mark> putaran, berhenti di tempat semula<br>
                        t = 2 &nbsp;→&nbsp; <mark>1</mark> lintasan, mulai di satu ganjil, berhenti di ganjil satunya<br>
                        t ≥ 4 &nbsp;→&nbsp; <mark>t / 2</mark> lintasan`,
                  verifikasi: 'Diadu dengan pencarian menyeluruh pada 1.075 peta berbeda.',
                }),
            },
            {
              kunci: 'c2', judul: 'Semua derajat sama',
              isi: `<p style="margin:0 0 10px">Pintasan yang dipakai di Lab 2. Denah olimpiade sering digambar simetris, dan simetri sering berarti derajatnya seragam.</p>` +
                Rumus({
                  label: 'Kalau tiap persimpangan punya jumlah jalan yang sama',
                  isi: `derajat ganjil &nbsp;→&nbsp; <mark>t = semua persimpangan</mark><br>
                        derajat genap &nbsp;→&nbsp; <mark>t = 0</mark>, satu putaran cukup`,
                  verifikasi: 'Diuji pada 2.000 peta acak berderajat seragam, nol pelanggaran.',
                }) +
                `<p class="tiny">Di soal 2024 semuanya berderajat 3. Ganjil, jadi kedelapan persimpangan ganjil, dan jawabannya 8 / 2 = 4.</p>`,
            },
            {
              kunci: 'c3', judul: 'Dua pengaman hitungan',
              isi: `<p style="margin:0 0 10px">Kesalahan nomor satu di soal ini bukan salah rumus, melainkan <b>salah membaca gambar</b>. Dua pemeriksaan ini menangkapnya.</p>` +
                Rumus({
                  label: 'Cek sebelum melanjutkan',
                  isi: `jumlah semua derajat = <mark>2 × banyaknya ruas jalan</mark><br>
                        banyaknya persimpangan ganjil <mark>selalu genap</mark>`,
                  verifikasi: 'Diuji pada 4.000 peta acak, nol pelanggaran.',
                }) +
                `<p class="tiny">Kalau kamu dapat jumlah derajat ganjil, atau dapat 3 persimpangan ganjil, berhenti dan hitung ulang. Pasti ada garis yang terlewat.</p>`,
            },
            {
              kunci: 'c4', judul: 'Periksa nyambungnya dulu',
              isi: `<p style="margin:0 0 10px">Ini yang paling sering luput. Rumus t / 2 cuma sah kalau seluruh peta <b>saling terhubung</b>.</p>` +
                Rumus({
                  label: 'Peta yang terpisah-pisah',
                  isi: `jawaban = <mark>jumlah maks(1, t / 2) dari tiap bagian</mark>`,
                  verifikasi: 'Diuji khusus pada peta terpisah: dua segitiga terpisah butuh 2, bukan 1.',
                }) +
                `<p class="tiny">Dua segitiga terpisah semuanya berderajat genap, jadi t = 0. Rumus polos menjawab 1 lintasan — mustahil, karena tidak ada jalan yang menyeberang.</p>`,
            },
            {
              kunci: 'c5', judul: 'Di mana harus mulai',
              isi: `<p style="margin:0 0 10px">Kadang yang ditanya bukan berapa lintasan, tapi dari mana berangkatnya.</p>` +
                Rumus({
                  label: 'Titik berangkat',
                  isi: `t = 2 &nbsp;→&nbsp; wajib mulai di <mark>salah satu persimpangan ganjil</mark><br>
                        t = 0 &nbsp;→&nbsp; <mark>bebas</mark>, dan pasti kembali ke tempat semula`,
                  verifikasi: 'Sifat baku Euler 1736, dibuktikan lengkap Hierholzer 1873.',
                }) +
                `<p class="tiny">Kalau soal memaksa mulai di persimpangan genap padahal t = 2, jawabannya mustahil. Itu jebakan yang sah.</p>`,
            },
            {
              kunci: 'c6', judul: 'Beda dengan “boleh diulang”',
              isi: `<p style="margin:0 0 10px">Soal kembarnya. Bacalah pelan-pelan: <b>maksimal sekali</b> berbeda jauh dari <b>setidaknya sekali</b>.</p>` +
                Rumus({
                  label: 'Kalau jalan BOLEH diulang',
                  isi: `jawaban = <mark>banyaknya ruas + ruas yang terpaksa diulang</mark><br>
                        bukan t / 2`,
                  verifikasi: 'OSN-K 2023 nomor 14: 12 ruas + 2 ruas diulang = 14 menit. Dicek dengan pencarian menyeluruh.',
                }) +
                `<p class="tiny">Kalau di sana dipakai rumus Euler, jawabannya 2 — jauh dari 14. Beda soal, beda alat.</p>`,
            },
          ],
        }),
      }),

      /* ============ UJI SENDIRI ============ */
      Kartu({
        judul: 'Uji sendiri: rumus vs pencarian menyeluruh',
        sub: 'Rumusnya diadu dengan cara paling bodoh tapi paling jujur — coba semua kemungkinan.',
        isi:
          `<div class="ctl">
            <button class="btn" id="${ids.i('ugo')}">Uji peta yang ada di Lab 1</button>
            <button class="btn alt" id="${ids.i('uall')}">Uji 300 peta acak</button>
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
              isi: `<p style="margin:0 0 10px">"Setiap jalan hanya dapat dilewati maksimal satu kali. Berapa minimal hari yang diperlukan agar seluruh jalan pernah dilewati?"</p>` +
                Catatan({ isi: `<b>Kata kuncinya "maksimal satu kali".</b> Satu hari sama dengan satu lintasan. Jadi pertanyaannya: paling sedikit berapa lintasan untuk menghabiskan semua jalan. Itu persis rumus t / 2.` }),
            },
            {
              kunci: 'b', judul: 'B · Tanpa angkat pensil',
              isi: `<p style="margin:0 0 10px">"Bisakah gambar ini diselesaikan tanpa mengangkat pensil dan tanpa menimpa garis yang sudah dibuat?"</p>` +
                Catatan({ isi: `<b>Tebakan anak kecil yang ternyata soal olimpiade.</b> "Tanpa mengangkat pensil" artinya satu lintasan. Jawabannya ya kalau persimpangan ganjilnya 0 atau 2. Kalau ada 4, kamu harus mengangkat pensil sekali — dua lintasan.` }),
            },
            {
              kunci: 'c', judul: 'C · Patroli',
              isi: `<p style="margin:0 0 10px">"Satpam harus menyusuri semua koridor. Ia tidak mau melewati koridor yang sama dua kali. Berapa kali ia harus berhenti dan pindah pos?"</p>` +
                Catatan({ isi: `<b>"Pindah pos" itu yang dihitung.</b> Kalau jawabannya k lintasan, berarti ia pindah pos k − 1 kali. Perhatikan pertanyaannya menanyakan <b>perpindahan</b>, bukan banyaknya lintasan. Jangan lupa kurangi satu.` }),
            },
            {
              kunci: 'd', judul: 'D · Peta terpisah',
              isi: `<p style="margin:0 0 10px">"Kota ini punya dua pulau yang tidak terhubung jembatan. Semua jalan di kedua pulau harus dilewati."</p>` +
                Catatan({ jenis: 'awas', isi: `<b>Rumus polos akan salah.</b> Hitung tiap pulau sendiri-sendiri, lalu jumlahkan. Bahkan kalau semua persimpangan di kedua pulau berderajat genap sehingga t = 0, jawabannya tetap <b>2</b>, bukan 1. Tidak ada rute yang bisa menyeberang tanpa jembatan.` }),
            },
            {
              kunci: 'e', judul: 'E · Jebakan 2023',
              isi: `<p style="margin:0 0 10px">"Pak Dengklek ingin menelusuri semua jalan setapak <b>setidaknya sekali</b>. Satu jalan setapak butuh satu menit. Berapa waktu minimum?"</p>` +
                Catatan({ jenis: 'awas', isi: `<b>Ini OSN-K 2023 nomor 14, dan ini BUKAN soal Euler.</b> Bedanya cuma dua kata: "setidaknya sekali", bukan "maksimal sekali". Jalan <b>boleh</b> diulang.
                  <br><br>Yang dicari bukan banyaknya lintasan, melainkan <b>total langkah</b>. Jawabannya banyaknya jalan ditambah jalan yang terpaksa dilewati dua kali. Untuk denah 2023: 12 + 2 = <b>14 menit</b>.
                  <br><br>Kalau di situ kamu pakai rumus t / 2, kamu akan menjawab 2. Salah total. Masalah ini punya nama sendiri — <b>masalah tukang pos</b>, dirumuskan Kwan Mei-Ko pada 1962.` }),
            },
          ],
        }),
      }),

      /* ============ BEDAH SOAL ============ */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2024 · soal 5',
        sub: 'Parade Bebek. Jawabannya satu angka.',
        isi: Kisi([
          KartuSoal({ ids, nomor: '2024 · soal 5a', idKeluaran: 's1',
            pertanyaan: 'Hitung derajat tiap persimpangan, lalu terapkan pengamannya.' }),
          KartuSoal({ ids, nomor: '2024 · soal 5b', idKeluaran: 's2',
            pertanyaan: 'Berapa minimal hari yang diperlukan Pak Dengklek?' }),
          KartuSoal({ ids, nomor: 'Pembanding · 2023 soal 14', idKeluaran: 's3',
            pertanyaan: 'Denah mirip, tapi jalan boleh diulang. Berapa jawabannya?' }),
        ]) + `<div class="ctl" style="margin-top:12px">
            <button class="btn" id="${ids.i('solve')}">Selesaikan ketiganya</button>
          </div>`,
      }),

      /* ============ KAPAN INI BUKAN ============ */
      Catatan({
        jenis: 'awas',
        isi: `<b>Kapan ini BUKAN Lintasan Euler.</b> Semua soal di bawah memakai gambar yang mirip. Yang membedakan cuma satu kalimat di naskahnya:` +
          Tabel({
            kiri: true,
            kepala: ['Bunyi soal', 'Sebenarnya'],
            baris: [
              ['“tiap jalan maksimal sekali” + “berapa rute/hari”', '✅ Euler — modul ini, maks(1, t/2)'],
              ['“tiap jalan setidaknya sekali” + “waktu minimum”', '❌ Masalah tukang pos — ruas + ruas yang diulang'],
              ['“tiap <b>persimpangan</b> tepat sekali”', '❌ Itu Hamilton, dan jauh lebih sulit'],
              ['“jalan terpendek dari A ke B”', '❌ Jarak terpendek biasa'],
              ['“hubungkan semua dengan biaya termurah”', '❌ Pohon rentang minimum'],
              ['jalannya <b>satu arah</b> (ada panah, bukan garis polos)', '❌ Rumus ganjil/2 gugur — lihat catatan di bawah'],
            ],
          }) +
          `<span style="display:block;margin-top:10px">Bedanya paling gampang diingat begini. Euler mengurusi <b>garis</b>, Hamilton mengurusi <b>titik</b>. Dan kalau jalan boleh diulang, Euler langsung gugur.</span>`,
      }),

      Catatan({
        jenis: 'awas',
        isi: `<b>Kalau jalannya satu arah, rumus ganjil/2 tidak berlaku sama sekali.</b> Periksa gambarnya: kalau garisnya berujung panah, kamu sedang melihat soal yang berbeda.
          <br><br>Sebabnya, "ganjil-genap" kehilangan artinya. Yang menentukan sekarang adalah selisih antara panah <b>keluar</b> dan panah <b>masuk</b> di tiap persimpangan.
          ` + Rumus({
            label: 'Kalau jalannya satu arah',
            isi: `minimum lintasan = <mark>maks(1, jumlah kelebihan panah keluar)</mark><br>
                  <span style="font-size:12.5px">hitung (keluar − masuk) di tiap titik, ambil yang positif saja, lalu jumlahkan</span>`,
            verifikasi: 'Diadu dengan pencarian menyeluruh pada 443 gambar berarah acak yang nyambung. Nol beda.',
          }) + `
          <b>Contoh terkecil yang membedakannya.</b> Ambil tiga titik dengan jalan 0→1, 1→2, dan 0→2. Kalau arahnya diabaikan, ketiga garisnya membentuk peta berderajat 2, 2, 2 — semuanya genap, jadi rumus dua arah menjawab <b>1 lintasan</b>.
          <br><br>Padahal dengan arahnya diikuti, titik 0 punya dua panah keluar dan nol panah masuk. Kelebihannya 2, jadi jawabannya <b>2 lintasan</b>. Bandingkan dengan putaran 0→1→2→0 yang tetap cukup satu lintasan.
          <span class="tiny" style="display:block;margin-top:6px">✅ Ketiga angka di paragraf ini dicek ulang dengan pencarian menyeluruh.</span>`,
      }),

      Catatan({
        isi: `<b>Verifikasi 30 detik sebelum menulis jawaban.</b> Tiga pemeriksaan, semuanya cepat.
          <br><br>Satu, jumlahkan derajat yang sudah kamu tulis. Harus pas dua kali banyaknya garis di gambar. Dua, hitung persimpangan ganjilnya — angkanya harus genap. Tiga, cek petanya nyambung semua; kalau ada bagian yang terpisah, hitung sendiri-sendiri.
          <br><br>Kalau ketiganya lolos, jawabanmu hampir pasti benar. Kesalahan di soal ini hampir selalu karena ada garis yang terlewat, bukan karena rumusnya keliru.`,
      }),

    ].join('');

    /* ================= PERILAKU ================= */

    const bacaLab = () => {
      const { ruas, tolak } = M.eulerBaca(ids.s('in'));
      return { ruas, tolak };
    };

    const laporan = (ruas, tolak) => {
      const d = M.eulerDerajat(ruas);
      const titik = Object.keys(d).sort();
      const ganjil = M.eulerGanjil(ruas);
      const bagian = M.eulerKomponen(ruas);
      const jumlahDerajat = Object.values(d).reduce((a, b) => a + b, 0);
      const jawab = M.eulerMinLintasan(ruas);
      const jenis = M.eulerJenis(ruas);

      const barisDerajat = titik.map((v) =>
        `  ${v} : ${d[v]}${d[v] % 2 ? '  ' + merah('ganjil') : ''}`).join('\n');

      const kalimat = {
        kosong: redup('Petanya masih kosong.'),
        sirkuit: hijau('Semua derajat genap → satu putaran cukup, dan berhenti di tempat semula.'),
        lintasan: hijau('Tepat 2 persimpangan ganjil → satu lintasan cukup. Mulai di ' + ganjil[0] + ', berhenti di ' + ganjil[1] + '.'),
        pecah: `t = ${ganjil.length} → minimum lintasan = ${ganjil.length} / 2 = ${hijau(jawab)}`,
        terpisah: merah('Petanya terpisah jadi ' + bagian.length + ' bagian!') + ' Tiap bagian dihitung sendiri:\n'
          + bagian.map((b, i) => {
            const g = M.eulerGanjil(b).length;
            return `  bagian ${i + 1} (${b.length} ruas, ${g} ganjil) → ${Math.max(1, g / 2)}`;
          }).join('\n') + `\n  jumlah = ${hijau(jawab)}`,
      }[jenis];

      return `${tolak.length ? merah('Baris yang tidak terbaca: ' + tolak.map((t) => t.baris).join(', ')) + '\n\n' : ''}Total ruas jalan : ${ruas.length}
Persimpangan     : ${titik.length}
Peta nyambung    : ${bagian.length <= 1 ? hijau('ya') : merah('tidak, ' + bagian.length + ' bagian')}

Derajat:
${barisDerajat}

${redup('Pengaman 1 — jumlah derajat ' + jumlahDerajat + ' harus = 2 × ' + ruas.length + ' = ' + (2 * ruas.length))}   ${jumlahDerajat === 2 * ruas.length ? hijau('cocok') : merah('TIDAK COCOK')}
${redup('Pengaman 2 — banyaknya ganjil harus genap')}   ${ganjil.length % 2 === 0 ? hijau('cocok (' + ganjil.length + ')') : merah('TIDAK COCOK')}

Persimpangan ganjil: ${ganjil.length ? ganjil.join(', ') : redup('(tidak ada)')}

${kalimat}`;
    };

    const gambarLab = (ruas, rute) => {
      ids.q('viz').innerHTML = ruas.length
        ? gambarPeta(ruas, letakUntuk(ruas), { rute })
        : '<div class="out">Petanya masih kosong.</div>';
    };

    /* ---- Lab 1 ---- */
    ids.klik('go', () => {
      bukaRumus(ids, 'rumus');
      const { ruas, tolak } = bacaLab();
      ruasKini = ruas;
      gambarLab(ruas);
      ids.tulis('out', ruas.length ? laporan(ruas, tolak)
        : 'Petanya masih kosong. Tulis minimal satu ruas, misalnya 0-1.');
    });
    ids.klik('reset', () => {
      const el = ids.q('in');
      if (el) el.value = TEKS_2024;
      ruasKini = RUAS_2024;
      gambarLab(RUAS_2024);
      ids.tulis('out', 'Peta 2024 dikembalikan. Tekan “Hitung derajat”.');
    });

    /* ---- Lab 2 · trik ---- */
    ids.klik('tgo', () => {
      const t = M.eulerTeratur(RUAS_2024);
      const d = M.eulerDerajat(RUAS_2024);
      ids.tulis('tout',
`Ambil satu persimpangan mana saja. Misalnya persimpangan 0.

  jalan yang menempel di 0 : ${d['0']}   ${merah('ganjil')}

${t.teratur
  ? `Semua persimpangan di denah ini punya ${hijau(t.derajat + ' jalan')} — seragam.
Karena ${t.derajat} ganjil, ${hijau('kedelapan')} persimpangan ganjil semua.

  t = ${t.banyakTitik}
  minimum lintasan = ${t.banyakTitik} / 2 = ${hijau(t.banyakTitik / 2)}`
  : redup('Denah ini derajatnya tidak seragam, jadi pintasan ini tidak berlaku.')}

${redup('Kamu memeriksa 1 persimpangan, bukan 8. Dan tidak menggambar satu rute pun.')}`);
    });

    ids.klik('tlama', () => {
      ids.tulis('tout',
`Kalau kamu nekat mencari rutenya dengan coba-coba:

  rute setengah jadi yang harus ditelusuri : ${merah('3.112')}
  hasilnya                                  : ${merah('tetap gagal')} — satu lintasan memang tidak ada

Kalau kamu menghitung derajat satu per satu:

  persimpangan yang diperiksa : 8

Kalau kamu memakai pintasan derajat seragam:

  persimpangan yang diperiksa : ${hijau('1')}

${redup('Perbandingannya sekitar 3.112 banding 8 — hampir 400 kali lebih ringan.')}
${redup('Dan cara coba-coba tidak cuma lebih lambat. Ia tidak akan pernah selesai,')}
${redup('karena untuk denah ini satu lintasan tunggal memang tidak mungkin ada.')}`);
    });

    /* ---- Lab 3 · susun rute ---- */
    let rute = [], indeks = 0;
    const tampilkanRute = () => {
      if (!rute.length) { ids.tulis('rout', 'Petanya tidak menghasilkan rute.'); return; }
      const r = rute[indeks % rute.length];
      gambarLab(ruasKini, r);
      ids.tulis('rout',
`${rute.length} rute menghabiskan seluruh ${ruasKini.length} ruas jalan.

${rute.map((x, i) => `  ${i === indeks % rute.length ? merah('▶') : ' '} rute ${i + 1} (${x.length - 1} ruas) : ${i === indeks % rute.length ? hijau(x.join(' → ')) : redup(x.join(' → '))}`).join('\n')}

${redup('Yang tersorot merah di gambar adalah rute ' + (indeks % rute.length + 1) + '. Tekan “Rute berikutnya”.')}
${hijau('Rumus bilang ' + M.eulerMinLintasan(ruasKini) + ', dan di sini betul-betul ada ' + rute.length + ' rute.')}`);
    };
    ids.klik('rgo', () => {
      const { ruas } = bacaLab();
      ruasKini = ruas.length ? ruas : RUAS_2024;
      rute = M.eulerSusun(ruasKini);
      indeks = 0;
      tampilkanRute();
    });
    ids.klik('rnext', () => {
      if (!rute.length) { rute = M.eulerSusun(ruasKini); indeks = 0; }
      else indeks++;
      tampilkanRute();
    });

    /* ---- Uji sendiri ---- */
    /* Pencarian menyeluruh: keadaan = (ruas terpakai, posisi sekarang).
       Lambat, jadi dibatasi 16 ruas. */
    const kasar = (ruas) => {
      const n = ruas.length;
      if (!n || n > 16) return null;
      const penuh = (1 << n) - 1, tetangga = {};
      ruas.forEach(([a, b], i) => { (tetangga[a] = tetangga[a] || []).push([b, i]);
                                    (tetangga[b] = tetangga[b] || []).push([a, i]); });
      const ingat = new Map();
      const f = (topeng, v) => {
        if (topeng === penuh) return 0;
        const k = topeng + '|' + v;
        if (ingat.has(k)) return ingat.get(k);
        ingat.set(k, n + 1);
        let hasil = n + 1;
        if (v === null) {
          for (let i = 0; i < n; i++) if (!((topeng >> i) & 1))
            hasil = Math.min(hasil, 1 + f(topeng | (1 << i), ruas[i][1]),
                                    1 + f(topeng | (1 << i), ruas[i][0]));
        } else {
          hasil = f(topeng, null);
          for (const [w, i] of (tetangga[v] || [])) if (!((topeng >> i) & 1))
            hasil = Math.min(hasil, f(topeng | (1 << i), w));
        }
        ingat.set(k, hasil);
        return hasil;
      };
      return f(0, null);
    };

    ids.klik('ugo', () => {
      const { ruas } = bacaLab();
      if (!ruas.length) { ids.tulis('uout', 'Petanya masih kosong.'); return; }
      const cepat = M.eulerMinLintasan(ruas), lambat = kasar(ruas);
      ids.tulis('uout',
`CARA 1 — rumus
  persimpangan ganjil = ${M.eulerGanjil(ruas).length}
  bagian yang nyambung = ${M.eulerKomponen(ruas).length}
  hasil = ${hijau(cepat)}   ${redup('(beberapa detik di kertas)')}

CARA 2 — coba semua kemungkinan
  hasil = ${lambat === null ? redup('(dilewati, petanya lebih dari 16 ruas)') : hijau(lambat)}

${lambat === null ? '' : (cepat === lambat ? hijau('✓ DUA CARA SAMA') : merah('✗ beda'))}`);
    });

    ids.klik('uall', () => {
      let uji = 0, beda = 0, terpisah = 0, contoh = null;
      for (let putar = 0; putar < 300; putar++) {
        const n = 3 + Math.floor(Math.random() * 4), ruas = [];
        for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++)
          if (Math.random() < 0.5) ruas.push([String(a), String(b)]);
        if (!ruas.length || ruas.length > 12) continue;
        uji++;
        if (M.eulerKomponen(ruas).length > 1) terpisah++;
        if (M.eulerMinLintasan(ruas) !== kasar(ruas)) { beda++; if (!contoh) contoh = JSON.stringify(ruas); }
      }
      ids.tulis('uout',
`Menguji ${uji} peta acak, diadu dengan pencarian menyeluruh.

  rumus dan pencarian sepakat : ${beda === 0 ? hijau(uji + ' / ' + uji) : merah((uji - beda) + ' / ' + uji)}
  di antaranya peta terpisah  : ${terpisah}   ${redup('inilah yang bikin rumus polos meleset')}

${beda === 0 ? hijau('✓ TIDAK ADA YANG MELESET') : merah('✗ meleset pada ' + contoh)}`);
    });

    /* ---- Bedah soal ---- */
    ids.klik('solve', () => {
      const d = M.eulerDerajat(RUAS_2024);
      const jumlah = Object.values(d).reduce((a, b) => a + b, 0);
      const g = M.eulerGanjil(RUAS_2024);
      ids.tulis('s1',
`Derajat: ${Object.keys(d).sort().map((v) => v + '→' + d[v]).join(', ')}

Pengaman 1: jumlah derajat ${jumlah} = 2 × 12 ✓
Pengaman 2: persimpangan ganjil ada ${g.length}, genap ✓
Nyambung  : ${hijau('ya')}

${hijau('Kedelapan persimpangan berderajat 3 — ganjil semua.')}`);

      ids.tulis('s2',
`t = ${g.length}
minimum hari = maks(1, ${g.length} / 2) = ${hijau(M.eulerMinLintasan(RUAS_2024))}

${redup('Dibuktikan bukan cuma dengan rumus. Lab 3 menyusun keempat rutenya betulan,')}
${redup('dan keempatnya memakai ke-12 jalan masing-masing tepat sekali.')}`);

      ids.tulis('s3',
`${merah('Hati-hati — soal ini bukan Euler.')}

Denah 2023 punya 12 ruas juga, dengan 4 persimpangan ganjil: ${M.eulerGanjil(RUAS_2023).join(', ')}.
Kalau dipakai rumus Euler: 4 / 2 = ${merah('2')}. ${redup('Salah.')}

Di sana jalan ${hijau('boleh diulang')}, dan yang ditanya total menit:
  12 ruas + 2 ruas yang terpaksa diulang = ${hijau('14 menit')}

${redup('Bedanya cuma dua kata di naskah: “setidaknya sekali”, bukan “maksimal sekali”.')}`);
    });

    pasangTab('trik');
    pasangTab('samar');
  },
};
