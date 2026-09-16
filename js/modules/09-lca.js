/* ============================================================
   MODUL 09 — LCA (Leluhur Bersama Terdekat)
   Semua angka dan klaim di berkas ini dibuktikan oleh
   verify/09-lca.py — jangan diubah tanpa menjalankannya lagi.
   ============================================================ */

import { M } from '../core/math.js';
import {
  Kartu, Lab, Kontrol, Keluaran, Wadah, Rumus, RumusTerkunci, bukaRumus,
  Catatan, Tab, Kisi, Kode, Tabel, KartuSoal, hijau, merah, redup,
} from '../core/ui.js';

/* ---------- pohon air terjun OSN-K 2026 nomor 7 ---------- */
const ANAK = {
  A: ['B', 'C', 'D'], B: ['E', 'F'], C: ['G', 'H', 'M'], D: ['I'],
  E: ['J', 'T'], F: ['K'], G: ['L'], H: ['N'], I: ['O', 'P'],
  J: ['Q'], L: ['R', 'U'], N: ['S', 'Z'], O: ['V'], Q: ['W'], S: ['Y'], U: ['X'],
};
const INDUK = {};
for (const a of Object.keys(ANAK)) for (const b of ANAK[a]) INDUK[b] = a;
const HURUF = [...Array(26)].map((_, i) => String.fromCharCode(65 + i));

/* Letak batu PERSIS seperti tergambar di naskah soal. Sengaja tidak
   dirapikan: justru ketidakrapian inilah yang menjebak siswa. */
const LETAK_SOAL = {
  A: [252, 20],
  B: [198, 80], C: [290, 80], D: [376, 80],
  E: [100, 170], F: [182, 170], G: [252, 170], H: [358, 170], I: [440, 170],
  J: [70, 260], K: [158, 260], L: [210, 260], M: [290, 260],
  N: [370, 260], O: [440, 260], P: [496, 260],
  Q: [34, 320], R: [250, 345], S: [352, 345],
  T: [110, 400], U: [196, 400], V: [542, 425],
  W: [20, 495], X: [196, 495], Y: [350, 495], Z: [465, 495],
};

/* Letak versi rapi: satu lapis = satu kedalaman. */
function letakLapis() {
  const lapis = {};
  HURUF.forEach((h) => {
    const d = M.lcaDalam(INDUK, h);
    (lapis[d] = lapis[d] || []).push(h);
  });
  const letak = {}, W = 560;
  Object.keys(lapis).forEach((d) => {
    const baris = lapis[d], n = baris.length;
    baris.forEach((h, i) => {
      letak[h] = [Math.round(W * (i + 1) / (n + 1)), (Number(d) - 1) * 95 + 24];
    });
  });
  return letak;
}
const LETAK_LAPIS = letakLapis();

/* ---------- penggambar pohon ----------
   sorot  : { huruf: 'a' | 'b' | 'lca' | 'jalur' }
   Ukuran dibuat dari viewBox tetap, tidak dari clientWidth — panel
   modul masih tersembunyi saat dibangun, jadi lebarnya terbaca 0. */
function gambarPohon(letak, sorot = {}, idPanah = 'pnh') {
  const R = 15;
  const xs = Object.values(letak).map((p) => p[0]);
  const ys = Object.values(letak).map((p) => p[1]);
  const W = Math.max(...xs) + R + 14, H = Math.max(...ys) + R + 14;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"
    aria-label="Pohon batu air terjun berlabel A sampai Z">
    <defs><marker id="${idPanah}" markerWidth="7" markerHeight="7" refX="6.5" refY="2.5"
      orient="auto"><path d="M0,0 L6,2.5 L0,5 z" fill="var(--garis-tebal)"/></marker></defs>`;

  const warna = {
    a: ['var(--stabilo)', 'var(--tinta)', 'var(--tinta)'],
    b: ['var(--stabilo)', 'var(--tinta)', 'var(--tinta)'],
    lca: ['var(--hijau-pucat)', 'var(--hijau)', 'var(--tinta)'],
    jalur: ['var(--kertas)', 'var(--merah)', 'var(--merah)'],
  };

  /* panah dulu, supaya lingkarannya menimpa ujung garis */
  for (const anak of Object.keys(INDUK)) {
    const p = INDUK[anak];
    if (!letak[p] || !letak[anak]) continue;
    const [x1, y1] = letak[p], [x2, y2] = letak[anak];
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const tebal = (sorot[anak] === 'jalur' || sorot[anak] === 'lca'
      || sorot[anak] === 'a' || sorot[anak] === 'b')
      && (sorot[p] === 'jalur' || sorot[p] === 'lca');
    s += `<line x1="${(x1 + dx / L * R).toFixed(1)}" y1="${(y1 + dy / L * R).toFixed(1)}"
      x2="${(x2 - dx / L * (R + 5)).toFixed(1)}" y2="${(y2 - dy / L * (R + 5)).toFixed(1)}"
      stroke="${tebal ? 'var(--merah)' : 'var(--garis-tebal)'}"
      stroke-width="${tebal ? 2.6 : 1.4}" marker-end="url(#${idPanah})"/>`;
  }

  for (const h of HURUF) {
    if (!letak[h]) continue;
    const [x, y] = letak[h];
    const [isi, garis, teks] = warna[sorot[h]] || ['#fff', 'var(--garis-tebal)', 'var(--tinta-3)'];
    const tebal = sorot[h] ? 2.6 : 1.5;
    s += `<circle cx="${x}" cy="${y}" r="${R}" fill="${isi}" stroke="${garis}" stroke-width="${tebal}"/>
      <text x="${x}" y="${y + 5}" text-anchor="middle"
      style="font-family:var(--mono);font-size:14px;font-weight:700;fill:${teks}">${h}</text>`;
  }
  return s + '</svg>';
}

/* Tandai jalur dua huruf beserta LCA-nya, untuk dikirim ke gambarPohon. */
function sorotPasangan(a, b) {
  const sorot = {}, g = M.lca(INDUK, a, b);
  M.lcaJalur(INDUK, a).forEach((h) => { sorot[h] = 'jalur'; });
  M.lcaJalur(INDUK, b).forEach((h) => { sorot[h] = 'jalur'; });
  sorot[a] = 'a'; sorot[b] = 'b'; sorot[g] = 'lca';
  return sorot;
}

const pilihanHuruf = (terpilih) =>
  HURUF.map((h) => `<option value="${h}"${h === terpilih ? ' selected' : ''}>${h}</option>`).join('');

export default {
  id: 'lca', n: '09', kelompok: 'Graf',
  judul: 'LCA · Leluhur Bersama Terdekat',
  lede: 'Dua batu di air terjun, satu titik awal yang sama. Soal ini terlihat seperti soal graf yang harus ditelusuri panjang-panjang, padahal jawabannya cukup dua jari yang merambat naik. Yang menjebak justru gambarnya sendiri.',
  lencana: ['<span class="chip r">2026 · soal 7</span>',
            '<span class="chip v">Diuji 325 pasangan batu</span>'],

  kartu: [
    { q: '“Dua robot berangkat dari satu batu yang sama, total batu yang dikunjungi seminimal mungkin.”', a: 'graf', why: 'LCA. Batu awal terbaik selalu leluhur bersama yang paling bawah.' },
    { q: '“Setiap batu hanya dapat dicapai dari satu batu tepat di atasnya.”', a: 'graf', why: 'Kalimat ini memberitahu bentuknya pohon — tiap batu punya tepat satu induk.' },
    { q: 'Dua huruf tergambar sejajar, jadi lapisnya dianggap sama', a: 'graf', why: 'JEBAKAN — tinggi di gambar bukan kedalaman. Hitung panahnya, jangan lihat posisinya.' },
  ],
  kamus: [
    ['“satu titik awal yang sama” untuk dua tujuan', 'LCA'],
    ['“hanya dapat dicapai dari satu tempat di atasnya”', 'Pohon berakar — tiap titik satu induk'],
    ['“total yang dikunjungi seminimal mungkin”', 'LCA, bukan jarak terpendek biasa'],
  ],

  bangun(root, { ids, pasangTab }) {
    const P = (h) => M.lcaJalur(INDUK, h).join(' → ');
    const D = (h) => M.lcaDalam(INDUK, h);

    root.innerHTML = [

      /* ============ APA ITU ============ */
      Kartu({
        judul: 'Apa itu LCA?',
        isi:
          `<p style="margin:10px 0">Bayangkan pohon keluarga. Kamu dan sepupumu punya banyak leluhur bersama: kakek, buyut, dan seterusnya ke atas. Tapi ada satu yang <b>paling dekat</b> — kakek. Itulah <b>leluhur bersama terdekat</b>, disingkat <b>LCA</b>.</p>
           <p style="margin:10px 0">Aturannya cuma satu. Cari semua yang jadi leluhur dua-duanya, lalu ambil yang paling bawah.</p>` +
          Catatan({
            isi: `<b>Asal-usulnya.</b> Nama LCA dipakai pertama kali oleh <b>Alfred Aho, John Hopcroft, dan Jeffrey Ullman</b> pada 1973, dalam tulisan berjudul <i>On Finding Lowest Common Ancestors in Trees</i>. Ketiganya nama besar di ilmu komputer — Aho dan Ullman kelak menulis buku naga yang dipakai hampir semua kuliah kompilator.
              <br><br>Yang mereka kerjakan bukan cara mencarinya, karena itu mudah. Yang sulit adalah menjawab <b>jutaan pertanyaan LCA</b> pada satu pohon dengan cepat. Untuk OSN-K kamu tidak butuh itu — pertanyaannya cuma lima.`,
          }) +
          Catatan({
            jenis: 'baik',
            isi: `<b>Kenapa penting untuk OSN-K?</b> Soal nomor 7 tahun 2026 memakainya terang-terangan, sampai menyebut kata LCA di naskahnya. Tapi bentuk terselubungnya jauh lebih sering: "satu titik awal untuk dua tujuan", "nenek moyang bersama", "percabangan sungai", "atasan bersama di struktur organisasi".
              <br><br>Yang bikin soal ini menarik: rumusnya sepele, tapi <b>gambarnya menipu</b>. Nanti kamu lihat sendiri di Lab 3.`,
          }),
      }),

      /* ============ LAB 1 ============ */
      Lab({
        judul: 'Lab 1 · Telusuri dua jalur sampai bertemu',
        petunjuk: 'pilih dua batu, lihat jalurnya',
        isi:
          `<p style="margin:0 0 12px">Ini pohon dari soal OSN-K 2026 nomor 7. Pilih dua batu, lalu perhatikan dua jalur merah yang naik ke atas. Titik hijau adalah tempat keduanya pertama kali bertemu.</p>` +
          `<div class="ctl">
            <div class="f"><label for="${ids.i('a')}">batu pertama</label>
              <select id="${ids.i('a')}" style="padding:7px;border:1.5px solid var(--garis-tebal);border-radius:6px;font-family:var(--mono);font-weight:600">${pilihanHuruf('X')}</select></div>
            <div class="f"><label for="${ids.i('b')}">batu kedua</label>
              <select id="${ids.i('b')}" style="padding:7px;border:1.5px solid var(--garis-tebal);border-radius:6px;font-family:var(--mono);font-weight:600">${pilihanHuruf('H')}</select></div>
            <button class="btn" id="${ids.i('go')}">Telusuri</button>
          </div>` +
          Wadah({ ids, id: 'viz', gaya: 'margin:14px 0;max-width:620px' }) +
          Keluaran({ ids, id: 'out', isi: 'Tekan “Telusuri” untuk mulai.' }),
      }),

      Catatan({
        jenis: 'baik',
        isi: `<b>Perhatikan yang terjadi.</b> Dua jalur itu selalu berhimpit di bagian atas, lalu berpisah di satu titik dan tidak pernah bertemu lagi. Titik perpisahan terakhir itulah jawabannya.
          <br><br>Kalau kamu menulis kedua jalur sebagai deretan huruf, LCA adalah <b>awalan terpanjang yang sama</b>. Jalur X adalah A C G L U X, jalur H adalah A C H. Awalan yang sama: A C. Jadi jawabannya C.`,
      }),

      RumusTerkunci({
        ids, id: 'rumus', label: 'Kenapa batu awal terbaik selalu LCA',
        isi: `dua robot berangkat dari s, satu ke α satu ke β<br>
              total kunjungan = <mark>(dalam α − dalam s) + (dalam β − dalam s) + 2</mark><br>
              makin dalam s, makin kecil totalnya — jadi ambil <b>leluhur bersama paling bawah</b>`,
        verifikasi: 'Dibuktikan dengan mencoba SEMUA 26 batu sebagai titik awal, untuk seluruh 325 pasangan. Batu juaranya selalu LCA, dan selalu tunggal.',
        pesan: 'Telusuri dulu beberapa pasangan di Lab 1 — kamu akan melihat sendiri kenapa jawabannya harus yang paling bawah.',
      }),

      /* ============ LAB 2 · TRIK ============ */
      Lab({
        judul: 'Lab 2 · Dua jari merambat — yang paling terasa curang',
        petunjuk: 'tanpa menulis satu jalur pun',
        isi:
          `<p style="margin:0 0 10px">Menulis dua jalur penuh itu boros. Untuk lima pertanyaan soal 2026, kamu perlu <b>42 langkah</b> menaik. Ada cara yang cuma butuh <b>12</b>.</p>
           <p style="margin:0 0 12px">Caranya: taruh satu jari di tiap batu. Angkat jari yang <b>lebih dalam</b> sampai kedua jari selapis. Setelah itu naikkan dua-duanya <b>bareng</b>, selangkah demi selangkah, sampai bertemu.</p>` +
          `<div class="ctl">
            <div class="f"><label for="${ids.i('ta')}">batu pertama</label>
              <select id="${ids.i('ta')}" style="padding:7px;border:1.5px solid var(--garis-tebal);border-radius:6px;font-family:var(--mono);font-weight:600">${pilihanHuruf('X')}</select></div>
            <div class="f"><label for="${ids.i('tb')}">batu kedua</label>
              <select id="${ids.i('tb')}" style="padding:7px;border:1.5px solid var(--garis-tebal);border-radius:6px;font-family:var(--mono);font-weight:600">${pilihanHuruf('H')}</select></div>
            <button class="btn" id="${ids.i('tgo')}">Rambat</button>
          </div>` +
          Keluaran({ ids, id: 'tout', isi: 'Tekan “Rambat” untuk mulai.' }),
      }),

      Catatan({
        jenis: 'baik',
        isi: `<b>Kenapa boleh naik bareng?</b> Setelah kedua jari selapis, mereka pasti bertemu di lapis yang sama juga. Sebab LCA adalah leluhur dua-duanya, jadi jaraknya ke atas dari kedua jari itu sama persis.
          <br><br>Yang membuatnya terasa curang: kamu tidak pernah menulis jalur lengkapnya. Untuk soal 2026 nomor 7, langkah terpanjangnya cuma <b>4</b> — itu pasangan X dan H.
          <span class="tiny" style="display:block;margin-top:6px">✅ Diuji untuk seluruh 325 pasangan batu: cara ini selalu mendarat di jawaban yang sama dengan cara panjang.</span>`,
      }),

      /* ============ LAB 3 · JEBAKAN GAMBAR ============ */
      Lab({
        judul: 'Lab 3 · Gambarnya berbohong soal lapis',
        petunjuk: 'bandingkan dua susunan yang sama-sama benar',
        isi:
          `<p style="margin:0 0 12px">Trik dua jari butuh satu hal: kamu tahu batu mana yang lebih dalam. Godaannya adalah membacanya dari <b>tinggi gambar</b>. Jangan. Gambar di naskah soal digeser-geser supaya garisnya tidak bertumpuk.</p>` +
          `<div class="ctl">
            <button class="btn" id="${ids.i('psoal')}">Seperti di naskah soal</button>
            <button class="btn alt" id="${ids.i('plapis')}">Disusun ulang per lapis</button>
          </div>` +
          Wadah({ ids, id: 'pviz', gaya: 'margin:14px 0;max-width:620px' }) +
          Keluaran({ ids, id: 'pout', isi: 'Tekan salah satu tombol untuk mulai.' }),
      }),

      Catatan({
        jenis: 'awas',
        isi: `<b>Ini bukan jebakan teoretis — ada di soalnya.</b> Pertanyaan ketiga menanyakan LCA(R, U). Di gambar, U tergambar jelas lebih rendah daripada R. Kalau kamu percaya matamu, kamu akan mengangkat U dulu, lalu merambat naik, dan mendarat di <b>A</b>.
          <br><br>Padahal R dan U sama-sama berkedalaman 5, dua-duanya anak L. Jawabannya <b>L</b>. Satu kesalahan membaca gambar, satu soal hilang.
          <span class="tiny" style="display:block;margin-top:6px">✅ Diuji: ada 25 pasangan batu di pohon ini yang menipu kalau lapisnya dibaca dari tinggi gambar.</span>`,
      }),

      /* ============ KUMPULAN CARA CEPAT ============ */
      Kartu({
        judul: 'Kumpulan cara cepat',
        sub: 'Enam hal yang membuat soal LCA selesai dalam hitungan detik.',
        isi: Tab({
          ids, id: 'trik',
          daftar: [
            {
              kunci: 'c1', judul: 'Salah satunya leluhur',
              isi: `<p style="margin:0 0 10px">Kasus tercepat. Kalau satu batu ternyata leluhur batu yang lain, jawabannya <b>batu yang di atas itu sendiri</b>. Tidak perlu merambat sama sekali.</p>` +
                Rumus({
                  label: 'Cek ini paling awal',
                  isi: `α leluhur β &nbsp;→&nbsp; <mark>LCA(α, β) = α</mark>`,
                  verifikasi: 'Ada 75 pasangan seperti ini di pohon soal 2026 — hampir seperempatnya.',
                }) +
                `<p class="tiny">Contoh di soal: LCA(I, V). Jalur V adalah ${P('V')}. Huruf I ada di dalamnya, jadi jawabannya langsung <b>I</b>.</p>`,
            },
            {
              kunci: 'c2', judul: 'Awalan terpanjang',
              isi: `<p style="margin:0 0 10px">Tulis jalur kedua batu dari akar. LCA adalah huruf terakhir yang masih sama di kedua deretan.</p>` +
                Rumus({
                  label: 'Cara paling aman kalau kamu ragu',
                  isi: `jalur α = A … <br>jalur β = A … <br><mark>LCA = awalan terpanjang yang sama</mark>`,
                  verifikasi: 'Diadu dengan pencarian titik terbaik untuk seluruh 325 pasangan.',
                }) +
                `<p class="tiny">Lebih lambat daripada dua jari, tapi tidak bisa salah. Pakai ini kalau waktumu masih longgar.</p>`,
            },
            {
              kunci: 'c3', judul: 'Beda lapis dulu',
              isi: `<p style="margin:0 0 10px">Inti trik dua jari, ditulis sebagai rumus langkah.</p>` +
                Rumus({
                  label: 'Berapa langkah yang kamu perlukan',
                  isi: `langkah = <mark>|dalam α − dalam β| + (lapis setelah disamakan − dalam LCA)</mark>`,
                  verifikasi: 'Untuk lima pertanyaan soal 2026: 2 + 3 + 1 + 2 + 4 = 12 langkah, lawan 42 langkah cara panjang.',
                }) +
                `<p class="tiny">Di pohon ini langkah terbanyak yang mungkin cuma <b>5</b>, yaitu pasangan A dan W.</p>`,
            },
            {
              kunci: 'c4', judul: 'Hitung total kunjungan',
              isi: `<p style="margin:0 0 10px">Kadang yang ditanya bukan batunya, melainkan <b>berapa batu yang dikunjungi</b>. Jangan hitung ulang jalurnya.</p>` +
                Rumus({
                  label: 'Setelah LCA ketemu',
                  isi: `batu berbeda = <mark>dalam α + dalam β − 2 × dalam LCA + 1</mark>`,
                  verifikasi: 'Diadu dengan pencacahan langsung untuk seluruh 325 pasangan.',
                }) +
                `<p class="tiny">Kalau batu bersamanya dihitung dua kali seperti bunyi soal, tinggal tambah <b>dalam LCA</b> sekali lagi.</p>`,
            },
            {
              kunci: 'c5', judul: 'Tabel lapis sekali jadi',
              isi: `<p style="margin:0 0 10px">Kalau pertanyaannya banyak, jangan menghitung kedalaman berulang-ulang. Tulis sekali di pinggir gambar, di sebelah tiap huruf.</p>` +
                Rumus({
                  label: 'Lapis tiap batu di soal 2026',
                  isi: `1: A &nbsp;·&nbsp; 2: B C D &nbsp;·&nbsp; 3: E F G H I M<br>
                        4: J K L N O P T &nbsp;·&nbsp; 5: Q R S U V Z &nbsp;·&nbsp; 6: W X Y`,
                  verifikasi: 'Dihitung dari panahnya, bukan dari letaknya di gambar.',
                }) +
                `<p class="tiny">Lihat M, T, dan Z. Ketiganya tergambar jauh lebih rendah daripada lapisnya yang sebenarnya.</p>`,
            },
            {
              kunci: 'c6', judul: 'Pohon, bukan graf biasa',
              isi: `<p style="margin:0 0 10px">Satu kalimat di naskah soal menentukan segalanya: "setiap batu hanya dapat dicapai dari suatu batu tertentu yang letaknya tepat di atasnya".</p>` +
                Rumus({
                  label: 'Yang dijamin kalimat itu',
                  isi: `tiap batu punya <mark>tepat satu</mark> batu di atasnya<br>
                        jadi jalur ke akar <mark>tunggal</mark>, dan LCA pasti ada`,
                  verifikasi: 'Diperiksa: 26 batu, 25 panah, satu akar, tanpa lingkaran.',
                }) +
                `<p class="tiny">Kalau sebuah batu boleh dicapai dari dua tempat, jalurnya tidak tunggal lagi dan cara ini gugur.</p>`,
            },
          ],
        }),
      }),

      /* ============ UJI SENDIRI ============ */
      Kartu({
        judul: 'Uji sendiri: dua jari vs jalur penuh',
        sub: 'Bandingkan jawabannya, lalu uji ratusan pasangan sekaligus.',
        isi:
          `<div class="ctl">
            <div class="f"><label for="${ids.i('ua')}">batu pertama</label>
              <select id="${ids.i('ua')}" style="padding:7px;border:1.5px solid var(--garis-tebal);border-radius:6px;font-family:var(--mono);font-weight:600">${pilihanHuruf('R')}</select></div>
            <div class="f"><label for="${ids.i('ub')}">batu kedua</label>
              <select id="${ids.i('ub')}" style="padding:7px;border:1.5px solid var(--garis-tebal);border-radius:6px;font-family:var(--mono);font-weight:600">${pilihanHuruf('U')}</select></div>
            <button class="btn" id="${ids.i('ugo')}">Bandingkan</button>
            <button class="btn alt" id="${ids.i('uall')}">Uji semua 325 pasangan</button>
          </div>` +
          Keluaran({ ids, id: 'uout', isi: 'Tekan “Bandingkan” untuk mulai.' }),
      }),

      /* ============ PENYAMARAN ============ */
      Kartu({
        judul: 'Penyamaran: satu konsep, lima wajah',
        sub: 'Kenali bentuknya, bukan kata kuncinya.',
        isi: Tab({
          ids, id: 'samar',
          daftar: [
            {
              kunci: 'a', judul: 'A · Kode 2026',
              isi: Kode(`int induk[27];              // induk['X'-'A'] = batu di atasnya
int lca(int u, int v) {
    int a[27], b[27], na = 0, nb = 0;
    for (int x = u; x != -1; x = induk[x]) a[na++] = x;
    for (int x = v; x != -1; x = induk[x]) b[nb++] = x;
    int hasil = -1;
    for (int i = 0; i &lt; na &amp;&amp; i &lt; nb; i++)
        if (a[na-1-i] == b[nb-1-i]) hasil = a[na-1-i];
        else break;
    return hasil;
}`) +
                Catatan({ isi: `<b>Ciri khas:</b> dua kali menaiki <code>induk</code> sampai −1, lalu dua deretan dibandingkan <b>dari belakang</b>. Pembalikan indeks itu penanda paling jelas — dia sedang mencari awalan yang sama.` }),
            },
            {
              kunci: 'b', judul: 'B · Varian jarak',
              isi: Kode(`int jarak(int u, int v) {
    int g = lca(u, v);
    return dalam[u] + dalam[v] - 2 * dalam[g];
}`) +
                Catatan({ isi: `<b>Ciri khas:</b> ada <code>- 2 * dalam[g]</code>. Ini menghitung <b>panjang jalan</b> antara dua batu lewat leluhur bersamanya. Kalau soal menanyakan "berapa batu yang dilewati", jawabannya angka ini ditambah 1.` }),
            },
            {
              kunci: 'c', judul: 'C · Cerita',
              isi: `<p style="margin:0 0 10px">"Dua karyawan di sebuah perusahaan ingin mengadakan rapat. Undangan hanya boleh disebarkan dari atasan ke bawahan langsung. Siapa atasan paling rendah yang bisa mengundang keduanya?"</p>` +
                Catatan({ isi: `<b>Tidak ada kata LCA, tidak ada kode.</b> Tapi "hanya dari atasan ke bawahan langsung" artinya tiap orang punya satu atasan — itu pohon. Dan "atasan paling rendah yang bisa menjangkau keduanya" adalah definisi LCA, kata demi kata.` }),
            },
            {
              kunci: 'd', judul: 'D · Sungai',
              isi: `<p style="margin:0 0 10px">"Air hujan jatuh di dua anak sungai yang berbeda. Di titik pertemuan mana kedua tetes air itu pertama kali bercampur?"</p>` +
                Catatan({ isi: `<b>Arah alirnya terbalik</b> dari soal air terjun, tapi bentuknya sama. Anak sungai selalu mengalir ke satu sungai yang lebih besar, tidak pernah bercabang dua ke hilir. Jadi tiap titik punya satu tujuan — pohon lagi.` }),
            },
            {
              kunci: 'e', judul: 'E · Jebakan',
              isi: `<p style="margin:0 0 10px">"Dua kota terhubung jaringan jalan. Cari kota persinggahan yang membuat total perjalanan dua kendaraan paling pendek."</p>` +
                Catatan({ jenis: 'awas', isi: `<b>Ini BUKAN LCA.</b> Jaringan jalan boleh punya lingkaran, dan jalannya dua arah. Tidak ada "atas" dan "bawah", jadi tidak ada leluhur. Yang dibutuhkan di sini pencarian jarak terpendek, bukan merambat naik.
                  <br><br>Penandanya ada di kalimat soal. LCA butuh kata yang menjamin <b>satu arah dan satu induk</b> — "tepat di atasnya", "atasan langsung", "mengalir ke". Kalau kata itu tidak ada, jangan pakai cara ini.` }),
            },
          ],
        }),
      }),

      /* ============ BEDAH SOAL ============ */
      Kartu({
        judul: 'Bedah soal asli OSN-K 2026 · soal 7',
        sub: 'Misi Penyelamatan Bebek. Jawabannya string lima huruf kapital.',
        isi: Kisi([
          KartuSoal({ ids, nomor: '2026 · soal 7a', idKeluaran: 's1',
            pertanyaan: 'LCA(F, T) + LCA(N, O) — dua pertanyaan pertama.' }),
          KartuSoal({ ids, nomor: '2026 · soal 7b', idKeluaran: 's2',
            pertanyaan: 'LCA(R, U) + LCA(I, V) — dua yang paling sering salah.' }),
          KartuSoal({ ids, nomor: '2026 · soal 7c', idKeluaran: 's3',
            pertanyaan: 'LCA(X, H), lalu gabungkan kelimanya jadi satu string.' }),
        ]) + `<div class="ctl" style="margin-top:12px">
            <button class="btn" id="${ids.i('solve')}">Selesaikan ketiganya</button>
          </div>`,
      }),

      /* ============ KAPAN INI BUKAN LCA ============ */
      Catatan({
        jenis: 'awas',
        isi: `<b>Kapan ini BUKAN LCA.</b> Tiga modul di lab ini sama-sama memakai gambar berpanah. Bedakan baik-baik:` +
          Tabel({
            kiri: true,
            kepala: ['Yang ditanya soal', 'Sebenarnya'],
            baris: [
              ['“satu titik awal untuk dua tujuan”', '✅ LCA — modul ini'],
              ['“paling cepat berapa tahap semua selesai”', '❌ Level &amp; urutan kerja — modul 08'],
              ['“berapa prasyarat sebelum kegiatan X”', '❌ Hitung leluhur — modul 08, bukan LCA'],
              ['“ada berapa jalur berbeda dari A ke H”', '❌ Cacah jalur, bukan LCA'],
              ['“jalan terpendek antara dua kota”', '❌ Jarak di graf dua arah'],
              ['satu titik punya <b>dua panah masuk</b> atau lebih', '❌ LCA bisa tidak tunggal — lihat catatan di bawah'],
            ],
          }) +
          `<span style="display:block;margin-top:10px">Bedanya paling gampang dilihat dari <b>jumlah panah masuk</b>. LCA butuh tiap titik punya tepat satu panah masuk. Modul 08 justru sebaliknya — di sana satu kegiatan boleh punya banyak prasyarat.</span>`,
      }),

      Catatan({
        jenis: 'awas',
        isi: `<b>Syarat yang membuat seluruh modul ini gugur: tiap titik harus punya TEPAT SATU panah masuk.</b>
          <br><br>Naskah soal 2026 menjaminnya lewat kalimat "setiap batu hanya dapat dicapai dari suatu batu tertentu". Kalau kalimat itu tidak ada, periksa gambarnya sendiri.
          <br><br>Contoh terkecil yang mematahkannya: a dan b sama-sama menurunkan x, dan juga sama-sama menurunkan y. Leluhur bersama x dan y ada dua, yaitu a dan b, dan tidak ada yang lebih rendah. <b>Jawabannya tidak tunggal</b>, jadi pertanyaannya sendiri jadi tidak sah.
          <br><br>Trik dua jari juga gugur di situ. Ia mengandalkan jalur ke atas yang <b>tunggal</b>. Kalau ada dua jalur, jarimu bisa naik lewat cabang yang salah.
          <span class="tiny" style="display:block;margin-top:6px">✅ Diuji pada 2.000 pohon acak: leluhur terdekatnya selalu tepat satu. Pada gambar berpanah yang titiknya boleh punya banyak induk, sekitar 1 dari 50 pasangan menghasilkan jawaban jamak.</span>`,
      }),

      Catatan({
        isi: `<b>Verifikasi 30 detik sebelum menulis jawaban.</b> Cek jawabanmu mundur. Ambil huruf yang kamu dapat, telusuri turun — kamu harus bisa sampai ke kedua batu yang ditanyakan.
          <br><br>Lalu cek satu tingkat di bawahnya. Kalau salah satu anaknya juga bisa mencapai kedua batu itu, jawabanmu <b>belum yang paling bawah</b>. Dua pemeriksaan ini menangkap hampir semua kesalahan merambat.`,
      }),

    ].join('');

    /* ================= PERILAKU ================= */

    /* ---- Lab 1: telusuri dua jalur ---- */
    ids.klik('go', () => {
      bukaRumus(ids, 'rumus');
      const a = ids.s('a'), b = ids.s('b');
      const g = M.lca(INDUK, a, b);
      ids.q('viz').innerHTML = gambarPohon(LETAK_SOAL, sorotPasangan(a, b), ids.i('pnh'));
      if (a === b) {
        ids.tulis('out', `Kedua batunya sama. ${hijau('LCA(' + a + ', ' + a + ') = ' + a)}
${redup('Soal aslinya menjamin Kwak dan Kwik ada di batu yang berbeda.')}`);
        return;
      }
      const ja = M.lcaJalur(INDUK, a), jb = M.lcaJalur(INDUK, b);
      let sama = 0;
      while (sama < ja.length && sama < jb.length && ja[sama] === jb[sama]) sama++;
      const tandai = (j) => j.map((h, i) => i < sama ? hijau(h) : merah(h)).join(' → ');
      ids.tulis('out',
`jalur ${a} : ${tandai(ja)}      ${redup('dalam ' + D(a))}
jalur ${b} : ${tandai(jb)}      ${redup('dalam ' + D(b))}

awalan yang sama: ${hijau(ja.slice(0, sama).join(' '))}
${hijau('LCA(' + a + ', ' + b + ') = ' + g)}

${redup('Batu berbeda yang dikunjungi dua robot: ' + D(a) + ' + ' + D(b) + ' − 2×' + D(g) + ' + 1 = ' + (D(a) + D(b) - 2 * D(g) + 1))}`);
    });

    /* ---- Lab 2: trik dua jari ---- */
    ids.klik('tgo', () => {
      const a = ids.s('ta'), b = ids.s('tb');
      if (a === b) { ids.tulis('tout', `Pilih dua batu yang berbeda dulu.`); return; }
      const t = M.lcaTrik(INDUK, a, b);
      const panjang = M.lcaLangkahPanjang(INDUK, a, b);
      let x = a, y = b, baris = [];
      baris.push(`mulai        ${x} (lapis ${D(x)})   ·   ${y} (lapis ${D(y)})`);
      t.jejak.forEach((l, i) => {
        if (l.fase === 'samakan') {
          if (l.sisi === 'a') x = l.ke; else y = l.ke;
          baris.push(`samakan ${i + 1}    ${merah(l.dari + ' → ' + l.ke)}   ·   ${redup('yang lain diam')}   ${redup('lapis ' + D(x) + ' vs ' + D(y))}`);
        } else {
          x = l.keA; y = l.keB;
          baris.push(`bareng  ${i + 1}    ${merah(l.dariA + ' → ' + l.keA)}   ·   ${merah(l.dariB + ' → ' + l.keB)}`);
        }
      });
      ids.tulis('tout',
`${baris.join('\n')}

${hijau('bertemu di ' + t.lca)}   setelah ${hijau(t.langkah + ' langkah')}

${redup('Cara panjang butuh ' + panjang + ' langkah (tulis jalur ' + a + ' dan jalur ' + b + ' penuh).')}
${t.langkah < panjang ? hijau('Hemat ' + (panjang - t.langkah) + ' langkah.') : redup('Pasangan ini memang sudah pendek.')}`);
    });

    /* ---- Lab 3: dua susunan ---- */
    const gambarSusunan = (mana) => {
      const letak = mana === 'lapis' ? LETAK_LAPIS : LETAK_SOAL;
      const sorot = {}; ['M', 'T', 'Z'].forEach((h) => { sorot[h] = 'a'; });
      ids.q('pviz').innerHTML = gambarPohon(letak, sorot, ids.i('pnh'));
      if (mana === 'lapis') {
        ids.tulis('pout',
`Sekarang tiap baris benar-benar satu lapis.

${hijau('Lihat M, T, dan Z yang disorot.')} Ketiganya naik jauh dibanding gambar aslinya:
  M  di naskah tergambar sebaris dengan J K L N O P, padahal lapis ${D('M')} — sama dengan G H I
  T  di naskah tergambar sebaris dengan U V, padahal lapis ${D('T')} — sama dengan J K L
  Z  di naskah tergambar sebaris dengan W X Y, padahal lapis ${D('Z')} — sama dengan Q R S

${redup('Yang menentukan lapis adalah banyaknya panah dari A, bukan tinggi di kertas.')}`);
      } else {
        ids.tulis('pout',
`Ini susunan persis seperti di naskah soal.

${merah('M, T, dan Z disorot.')} Ketiganya digambar lebih rendah daripada lapisnya yang sebenarnya,
supaya garis panahnya tidak bertumpuk dengan yang lain.

${redup('Tekan tombol sebelahnya untuk melihat susunan yang sudah dirapikan.')}`);
      }
    };
    ids.klik('psoal', () => gambarSusunan('soal'));
    ids.klik('plapis', () => gambarSusunan('lapis'));

    /* ---- Uji sendiri ---- */
    ids.klik('ugo', () => {
      const a = ids.s('ua'), b = ids.s('ub');
      if (a === b) { ids.tulis('uout', 'Pilih dua batu yang berbeda dulu.'); return; }
      const panjang = M.lca(INDUK, a, b);
      const trik = M.lcaTrik(INDUK, a, b);
      const coba = M.lcaTitikTerbaik(INDUK, HURUF, a, b, 'dijumlah');
      ids.tulis('uout',
`CARA 1 — tulis dua jalur penuh, cari awalan yang sama
  ${M.lcaJalur(INDUK, a).join(' ')}
  ${M.lcaJalur(INDUK, b).join(' ')}
  hasil = ${hijau(panjang)}   ${redup('(' + M.lcaLangkahPanjang(INDUK, a, b) + ' langkah)')}

CARA 2 — dua jari merambat
  hasil = ${hijau(trik.lca)}   ${redup('(' + trik.langkah + ' langkah)')}

CARA 3 — coba SEMUA 26 batu sebagai titik awal, ambil yang totalnya terkecil
  hasil = ${hijau(coba.titik)}   ${redup('total kunjungan ' + coba.nilai + ', juara tunggal: ' + (coba.juara.length === 1 ? 'ya' : 'tidak'))}

${panjang === trik.lca && trik.lca === coba.titik ? hijau('✓ KETIGANYA SAMA') : merah('✗ ada yang beda')}`);
    });

    ids.klik('uall', () => {
      let uji = 0, beda = 0, tunggal = 0, hemat = 0, contoh = null;
      for (let i = 0; i < 26; i++) for (let j = i + 1; j < 26; j++) {
        const a = HURUF[i], b = HURUF[j];
        const p = M.lca(INDUK, a, b), t = M.lcaTrik(INDUK, a, b);
        const c = M.lcaTitikTerbaik(INDUK, HURUF, a, b, 'dijumlah');
        uji++;
        hemat += M.lcaLangkahPanjang(INDUK, a, b) - t.langkah;
        if (c.juara.length === 1) tunggal++;
        if (p !== t.lca || p !== c.titik) { beda++; if (!contoh) contoh = a + ',' + b; }
      }
      ids.tulis('uout',
`Menguji seluruh ${uji} pasangan batu di pohon ini.

  ketiga cara sepakat        : ${beda === 0 ? hijau(uji + ' / ' + uji) : merah((uji - beda) + ' / ' + uji)}
  titik terbaiknya tunggal   : ${tunggal === uji ? hijau(uji + ' / ' + uji) : merah(tunggal + ' / ' + uji)}
  langkah yang dihemat trik  : ${hijau(hemat)} langkah kalau semua pasangan dikerjakan

${beda === 0
  ? hijau('✓ TIDAK ADA YANG MELESET') + '\n' + redup('Ini sekaligus membuktikan janji naskah soal: batu terbaiknya memang selalu tepat satu.')
  : merah('✗ meleset pada ' + contoh)}`);
    });

    /* ---- Bedah soal ---- */
    ids.klik('solve', () => {
      const soal = [['F', 'T'], ['N', 'O'], ['R', 'U'], ['I', 'V'], ['X', 'H']];
      const jawab = soal.map(([a, b]) => M.lca(INDUK, a, b));
      const baris = ([a, b], i) => {
        const t = M.lcaTrik(INDUK, a, b);
        return `LCA(${a}, ${b}) : lapis ${D(a)} dan ${D(b)} → ${t.langkah} langkah → ${hijau(jawab[i])}`;
      };
      ids.tulis('s1', `${baris(soal[0], 0)}
${baris(soal[1], 1)}

${redup('F dan T: F lapis 3, T lapis 4. Angkat T sekali ke E, lalu naik bareng — ketemu di B.')}
${redup('N dan O: sama-sama lapis 4 tapi cabangnya beda dari puncak, jadi naik sampai A.')}`);

      ids.tulis('s2', `${baris(soal[2], 2)}
${baris(soal[3], 3)}

${merah('R dan U inilah jebakannya.')} Di gambar U tergambar jauh lebih rendah daripada R.
${redup('Padahal dua-duanya lapis 5 dan sama-sama anak L. Jawabannya L, bukan A.')}
${redup('I dan V: I ternyata leluhur V. Angkat V dua kali sampai selapis dengan I, dan di situ mereka sudah bertemu — tidak perlu naik bareng sama sekali.')}`);

      ids.tulis('s3', `${baris(soal[4], 4)}

${redup('X lapis 6, H lapis 3. Angkat X tiga kali: X → U → L → G. Lalu naik bareng sekali: G → C dan H → C.')}

Gabungan kelimanya:
${hijau(jawab.join(' + ') + '  =  ' + jawab.join(''))}

${redup('Cara panjang butuh 42 langkah untuk lima pertanyaan ini. Dua jari cukup 12.')}`);
    });

    pasangTab('trik');
    pasangTab('samar');
  },
};
