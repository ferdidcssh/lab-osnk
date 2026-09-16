# PANDUAN MENGGARAP MODUL

Berkas ini adalah **aturan main** untuk menggarap modul Lab OSN-K.
Unggah berkas ini bersama berkas inti saat memulai percakapan baru,
supaya hasilnya konsisten dengan modul yang sudah jadi.

Modul yang sudah digarap dengan panduan ini: **01–13**.

**Kalau cuma sempat membaca satu bagian, baca bagian 0.**

---

## 0. Aturan induk: semuanya harus BERLAKU UMUM

> Setiap penjelasan, rumus, klaim, cara cepat, dan trik "yang paling
> terasa curang" harus **terbukti berlaku untuk soal lain dengan materi
> yang sama** — bukan cuma untuk soal OSN-K yang kebetulan diunggah.

Soal OSN-K dipakai sebagai **contoh penerapan**, bukan sebagai bukti.
Rumus yang kebetulan cocok dengan satu soal itu tidak berarti apa-apa.

**Yang wajib dilakukan tiap kali menulis rumus atau trik:**

1. **Uji pada masukan ACAK, bukan angka soal.** Bangkitkan ratusan kasus
   dengan bentuk sama tapi angka berbeda, lalu adu dengan pencacahan
   langsung. Kalau materinya graf, bangkitkan graf acak. Kalau pohon,
   bangkitkan pohon acak. Jangan pernah menguji cuma pada gambar soal.
2. **Uji bentuk ekstrem dan aneh.** n = 0, n = 1, masukan kosong, angka
   raksasa, graf terpisah, jalan ganda, jalan yang memutar ke dirinya
   sendiri, kelompok berukuran 1. Kalau modulnya membatasi masukan di
   layar, **fungsinya di `math.js` tetap harus benar di luar batas itu**.
3. **Cari kasus yang membuat triknya GUGUR**, lalu tulis syaratnya di
   modul dalam catatan `awas`, lengkap dengan contoh terkecilnya dan
   rumus penggantinya. Trik tanpa syarat tertulis itu jebakan.
4. **Bedakan angka umum dari angka contoh.** "Hemat 71%" atau "3.112
   rute" itu khusus soal itu. Tulis "di pohon ini" atau "untuk soal
   2024" supaya siswa tidak memakainya sebagai patokan.

**Jalankan audit tiga lapis sebelum menyatakan modul selesai:**

```
node tests/audit-lama.mjs    lapis 1 · mesin hitung modul 01-08
node tests/audit-umum.mjs    lapis 1 · mesin hitung modul 09+
node tests/audit.mjs         lapis 2 · angka prosa, lapis 3 · syarat gugur
```

Cara kerjanya, apa saja yang perlu diunggah, dan cara menambahkan modul
baru ke tiap lapis ada di **`PANDUAN-AUDIT.md`**.

> **Bukti bahwa aturan ini perlu.** Audit inilah yang menemukan
> `kecilDigitSum` salah mulai X = 144 dan `mandirC00` salah mulai
> n = 54. Dua-duanya lolos semua uji lain selama berbulan-bulan, karena
> labnya membatasi masukan sehingga bug-nya tidak pernah terlihat.
> Untuk soal OSN-K yang ada, jawabannya benar. Untuk soal lain, salah.

---

## 1. Berkas yang perlu diunggah tiap sesi

```
js/core/ui.js       pustaka komponen
js/core/ids.js      aturan penamaan id
js/core/math.js     mesin hitung  ← PAKAI YANG PALING BARU
tests/alat.mjs      penguji + kontrak + pemeriksa bahasa
PANDUAN-MODUL.md    berkas ini
```

Untuk sesi **audit** (bukan menggarap modul baru), berkas yang perlu
diunggah berbeda — lihat `PANDUAN-AUDIT.md` bagian 1.

Lima berkas, sekitar 40 KB. **Jangan unggah PDF naskah soal** — itu
penyumbang token terbesar. Kalau butuh bunyi soalnya, ketik ulang
beberapa kalimat saja.

---

## 2. Susunan modul (wajib, urut)

| Bagian | Isi |
|---|---|
| **Apa itu** | Penjelasan dari nol dengan contoh konkret. Sertakan sejarah singkat kalau ada (siapa, tahun berapa). Tutup dengan "Kenapa penting untuk OSN-K?" |
| **Lab 1** | Lab dasar — siswa membangun/menghitung sendiri. Di akhir, buka rumus terkunci. |
| **Rumus terkunci** | `RumusTerkunci(...)` — buram sampai siswa mengerjakan Lab 1. Wajib punya lencana verifikasi. |
| **Lab 2 · trik "yang paling terasa curang"** | Cara pintas yang membuat soal selesai dalam detik. Judulnya harus memuat frasa *"yang paling terasa curang"*. |
| **Lab 3** | Lab tambahan: visual struktur, atau varian soal. |
| **Kumpulan cara cepat** | Tab berisi 4–6 trik. Tiap rumus wajib punya lencana verifikasi. |
| **Uji sendiri** | Bandingkan cara panjang vs rumus. Sediakan tombol uji massal (ratusan kasus acak). |
| **Penyamaran** | Tab 5 wajah: kode asli, varian kode, cerita, dan minimal satu **jebakan**. |
| **Bedah soal asli** | Kartu soal + tombol "Selesaikan". Sebutkan tahun dan nomor soalnya. |
| **Kapan ini BUKAN …** | Tabel pembeda dari modul lain. |
| **Verifikasi 30 detik** | Catatan penutup: cara siswa mengecek jawabannya sendiri. |

---

## 3. Aturan bahasa

**Diperiksa otomatis** oleh `periksaBahasa()` di `alat.mjs`. Modul yang
melanggar akan gagal diuji — jadi aturan ini tidak lagi bergantung pada
ingatan siapa pun.

**Wajib:**
- Sapa pembaca dengan **"kamu"** — minimal 8 kali
- Rata-rata kalimat prosa **di bawah 16 kata**
- Tidak ada kalimat prosa **di atas 32 kata**
- Pakai **FPB**, bukan "gcd", saat berbicara ke siswa.
  Diperiksa mesin; blok `<pre>` dan `<code>` dikecualikan, karena di situ
  "gcd" muncul sebagai potongan kode asli soal. Kalau modul memang perlu
  memperkenalkan istilah Inggrisnya, bungkus dengan `<code>` dan jelaskan
  sekali di bagian pembuka — lihat cara modul 03 melakukannya.

**Kata terlarang** (terjemahan kaku / istilah kuliah):

```
berhingga · tak-negatif · keterbentukan · koefisien
rumus tertutup · persamaan Diophantine · paritas · iteratif
kongruen · akar primitif · simpul · sisi berarah · DAG
traversal · in-degree · basis rekursi · multiplisitas
```

Ganti dengan: *jumlahnya terbatas · boleh dipakai berapa kali pun ·
rumus langsung · ganjil-genap · kegiatan · panah · dan seterusnya.*

> Pemeriksaan memakai **batas kata**, jadi "disimpulkan" dan
> "konsekuensi" tetap aman — yang ditolak hanya kata utuhnya.

**Hindari juga:**
- Pola kalimat Inggris — "Yang tidak sederhana adalah…", "Perhatikan bagaimana…"
- Kalimat panjang beranak-cabang. Pecah jadi dua-tiga kalimat pendek.
- Nada buku teks. Modul ini berbicara ke siswa SMA, bukan ke dosen.

---

## 3b. Yang diperiksa penguji secara otomatis

Cukup panggil tiga fungsi ini di berkas tes tiap modul:

```js
periksaKontrak(t, c);       // id, bentuk modul, tidak ada id ganda,
                            // galat di dalam penangan tombol
await periksaMesin(t, c);   // tiap M.* yang dipakai ADA di math.js
periksaBahasa(t, c);        // "kamu", kata terlarang, FPB, panjang kalimat
periksaSusunan(t, c);       // bagian wajib, gembok yang benar-benar
                            // mengunci, lencana ✅, kotak lab tidak "—"
```

Uji perilaku gembok berlaku untuk semua modul sekaligus, jalankan
terpisah: `node tests/kunci.test.mjs`

Lalu tambahkan pemeriksaan khusus modul itu: nilai lab, angka jawaban
soal, jumlah elemen visual, dan penanganan kasus tepi.

Untuk memeriksa seluruh modul sekaligus: `node tests/semua.mjs`

---

## 4. Disiplin verifikasi (tidak boleh dilewat)

Urutannya:

1. **Riset sumber kredibel** dulu kalau materinya punya teori mapan
   (MathWorld, AoPS, buku teks). Cantumkan nama penemu dan tahunnya.
2. **Tulis `verify/NN-nama.py`** yang membuktikan setiap klaim —
   rumus, sifat, dan jawaban tiap soal OSN-K. Jalankan sampai lolos semua.
   Aturannya harus diadu dengan **pencacahan langsung pada angka ACAK**,
   bukan cuma angka yang kebetulan muncul di soal OSN-K. Uji juga kasus
   yang membuat aturannya **PATAH**, lalu tulis syaratnya di modul.
3. **Tambahkan fungsi ke `math.js`**, lalu **adu dengan Python**.
   Nilai di aplikasi harus sama persis dengan hasil pembuktian.
4. **Tulis `tests/NN-nama.test.mjs`** yang memeriksa isi, visual,
   perilaku tombol, dan angka jawabannya.
5. Jalankan `tests/semua.mjs` — pastikan modul lain tidak rusak.

> **Aturan keras:** jangan pernah menulis lencana "✅ terverifikasi"
> untuk klaim yang belum benar-benar diuji. Kalau ragu, uji dulu.
>
> Dan lencana itu harus menyebut **cakupan** pengujiannya, bukan cuma
> kata "terverifikasi". Tulis "diadu dengan pencacahan langsung pada
> 1.075 peta acak", bukan "sudah dicek". Lihat bagian 0.

**Tulis juga syarat yang membuat triknya GUGUR.** Tiap modul wajib punya
satu catatan `awas` yang menyebut kapan rumusnya tidak berlaku, lengkap
dengan contoh terkecilnya dan rumus penggantinya. Yang sudah tercatat:

| Modul | Gugur kalau | Penggantinya |
|---|---|---|
| 09 LCA | satu titik punya lebih dari satu panah masuk | jawabannya tidak tunggal, soal jadi tidak sah |
| 10 Euler | jalannya satu arah | maks(1, jumlah kelebihan panah keluar) |
| 10 Euler | jalan boleh diulang | ruas + ruas yang terpaksa diulang |
| 11 Kombinatorika | ada syarat antar-kelompok | trik polos − banyaknya pelanggaran |
| 11 Kombinatorika | tahapnya saling bergantung | aturan perkalian gugur |

Dibuktikan di `verify/12-syarat-gugur.py`.

Kesalahan yang pernah terjadi dan harus dihindari:
- **Modul memakai fungsi `M.*` yang belum ada di `math.js` yang dikirim**
  (Modul 04 sempat rusak diam-diam — tiga lab mati)
- **Gembok rumus yang tidak mengunci**: modul menjalankan sendiri tombol
  Lab 1 saat dibangun, jadi rumusnya sudah terbuka begitu halaman dibuka
  (pernah terjadi di modul 04, 05, 06). Lab yang membuka rumus JANGAN
  dijalankan otomatis. Isi kotaknya dengan ajakan, bukan tanda hubung.
- **Timer `setInterval` yang tidak dimatikan saat panel diganti**
  (animasi Josephus meledak tiap 0,65 detik setelah pindah modul)
- **Rumus graf yang lupa syarat "petanya harus nyambung"** — modul 10
  versi lama menjawab 1 untuk peta yang terpisah dua bagian
- **Lencana tahun soal yang salah** — modul 10 versi lama menulis
  "2024 & 2026", padahal di naskah 2026 tidak ada soal Euler.
  Cek ke PDF-nya sebelum menulis tahun.
- **Angka besar dihitung pakai `Number`.** 21! sudah melewati batas
  ketelitian JavaScript dan hasilnya meleset diam-diam. Untuk faktorial,
  permutasi, kombinasi, dan perkalian berantai, **pakai BigInt**.
- **Angka 0 disaring sebelum dikalikan.** Modul 11 versi lama menjawab
  260 untuk "26, 0, 10". Satu tahap tanpa pilihan membuat seluruhnya 0.
- **Masukan di luar jangkauan dipotong diam-diam.** C(3, 10) harus 0,
  bukan diubah jadi C(3, 3). Kalau dipotong, siswa tidak sadar salah.
- **Alat pembuktian sendiri yang salah.** Dua kali terjadi di modul 10:
  pencari minimum cuma mencoba satu ruas sebagai pembuka, dan penyusun
  rute lupa menggeser putarannya. Kalau Python dan JS sama-sama salah
  dengan cara yang sama, tidak ada yang menangkap. Adu juga dengan
  pencarian menyeluruh yang ditulis terpisah.
- Menebak rumus tanpa uji (rumus "00" di Modul 05 sempat salah: 1023, seharusnya 682)
- Lupa menambahkan fungsi baru ke `math.js` yang dikirim ke pengguna
- Menguji lewat `isNaN(undefined)` yang lolos palsu
- Memakai `includes()` untuk mencari kata terlarang — "disimpulkan" ikut tertangkap
- **Mengirim berkas hasil perbaikan tapi berkas lama tidak diganti di komputer**

---

## 5. Aturan teknis

**Id.** Jangan pernah menulis id mentah. Selalu `ids.i('nama')` saat
menulis HTML dan `ids.q('nama')` saat mengambilnya. Ini termasuk
**penanda SVG** seperti `marker id` — pernah bikin gagal di Modul 07.

**Visual.** Pakai SVG dengan `viewBox` tetap, jangan bergantung pada
`clientWidth`. Modul dibangun saat panelnya masih tersembunyi, jadi
lebar elemen terbaca 0 — ini pernah merusak visual Josephus.

**Ukuran adaptif.** Kalau menggambar banyak elemen melingkar/berjajar,
hitung ukurannya dari jumlah elemen supaya tidak bertumpuk.

**Kasus tepi.** Uji n = 0, n = 1, input kosong, dan input yang
menyebabkan lingkaran/kegagalan.

---

## 6. Bentuk modul

```js
export default {
  id: 'namamodul', n: '09', kelompok: 'Graf',
  judul: '...',
  lede: '...',                    // 1–3 kalimat, memancing rasa penasaran
  lencana: ['<span class="chip r">2026 · soal 7</span>',
            '<span class="chip v">Diuji ...</span>'],
  kartu: [                        // dipanen modul Drill
    { q: 'potongan kode / kutipan soal', a: 'graf', why: 'kenapa' },
  ],
  kamus: [                        // dipanen modul Kamus
    ['kata kunci di soal', 'topik yang ditandai'],
  ],
  bangun(root, { ids, pasangTab }) {
    root.innerHTML = [ ... ].join('');
    /* pasang perilaku di sini */
    pasangTab('trik'); pasangTab('samar');
  },
};
```

Nilai `a` pada kartu drill: `josephus · gcd · digitsum · doubling ·
graf · kombi · prefix · dp · lain`.

---

## 7. Status modul

| Modul | Keadaan |
|---|---|
| 01 Josephus | ✅ digarap dalam — trik biner (geser bit) |
| 02 Digit Sum | ✅ digarap dalam — saringan mod 9 |
| 03 GCD & Totient | ✅ digarap dalam — φ(A/B) |
| 04 Frobenius | ✅ digarap dalam — cek FPB dulu |
| 05 Rekursi Doubling | ✅ digarap dalam — trik biner (jumlah bit 1) |
| 06 MAI | ✅ digarap dalam — jam 66 |
| 07 TIGA | ✅ digarap dalam — sisa bagi 3 |
| 08 Level & Toposort | ✅ digarap dalam — kupas berlapis, hitung leluhur |
| 09 LCA | ✅ digarap dalam — dua jari merambat, jebakan tinggi gambar |
| 10 Lintasan Euler | ✅ digarap dalam — trik satu persimpangan, pembanding tukang pos |
| 11 Kombinatorika | ✅ digarap dalam — trik "+1 lalu −1", BigInt |
| 12 Prefix Sum & Difference Array | ✅ digarap dalam — trik dua tanda |
| 13 Dynamic Programming | ✅ digarap dalam — trik dua terbesar |
| 14–15, 17 | ⏳ belum digarap dalam |
| 16 Drill Pengenalan Pola | ✅ digarap dalam — 123 kartu, bank terpisah |

Seluruh modul lolos `tests/semua.mjs`: **678 pemeriksaan, 0 gagal**,
ditambah `tests/kunci.test.mjs` (91), `tests/audit.mjs` (83), dan uji per modul.

**Modul latihan berbeda aturannya.** Modul dengan `kelompok: 'Latihan'`
tidak wajib punya "Apa itu", rumus terkunci, atau "Bedah soal" — ia bukan
modul ajar. `periksaSusunan()` otomatis mengalihkannya ke `periksaDrill()`,
dan `kunci.test.mjs` melewatinya.

**Kartu drill.** Bank kartunya ada di `js/core/kartu.js`, terpisah dari
modulnya supaya bisa diperiksa sendiri. Aturan menulis kartu ada di kepala
berkas itu. Yang paling penting: `a` adalah AREA soalnya, bukan "benar atau
jebakan" — jebakan di dalam sebuah area tetap memakai kategori areanya, dan
yang membedakan ditulis di `why`. Kartu di modul ajar tidak boleh berbeda
kategorinya dengan bank; diperiksa `tests/16-drill.test.mjs`.

**Audit generalisasi** — jalankan kalau ragu rumusnya cuma pas untuk soal
yang sudah ada:

```
node tests/audit-umum.mjs    modul 09-11 pada pohon/peta/kelompok acak
node tests/audit-lama.mjs    modul 01-08 pada masukan acak
```

Audit inilah yang menemukan `kecilDigitSum` salah mulai X = 144 dan
`mandirC00` salah mulai n = 54 — dua-duanya tidak pernah terlihat karena
labnya membatasi masukan.

**Berikutnya:** modul 14, topik ditentukan dari bobot nilai lagi.

> **Catatan modul 13.** Stub lamanya memakai materi yang BERBEDA dari soal
> aslinya — "tidak boleh bersebelahan" satu deret, padahal soal 2026 nomor
> 14–16 punya tiga jenis latihan dengan tiga masa jeda berbeda. Sebelum
> menggarap modul, **buka dulu naskah soalnya** dan pastikan materinya cocok.

> **Catatan modul 12.** Tidak semua topik punya soal OSN-K tingkat
> kabupaten yang meminta tekniknya secara langsung. Prefix sum adalah
> **alat**, bukan tipe soal — ia muncul terselubung sebagai pertanyaan
> cacah. Untuk topik seperti ini, bagian "Bedah soal asli" boleh memakai
> contoh soal dari silabus resmi TOKI, asal disebutkan sumbernya dan
> modulnya berterus terang bahwa ini alat, bukan tipe soal.

---

## 8. Cara memulai percakapan baru

Unggah lima berkas di bagian 1, lalu tulis:

> Garap **modul NN (topik)** sedalam modul 11, ikuti PANDUAN-MODUL.md.
> Soalnya dari OSN-K tahun sekian nomor sekian. Pastikan teori dan
> rumusnya diverifikasi dulu, dan sertakan Lab trik "yang paling terasa
> curang" kalau materinya memungkinkan.
>
> **Ikuti bagian 0:** semua penjelasan, rumus, klaim, cara cepat, dan
> triknya harus dipastikan berlaku kalau diterapkan pada soal lain
> dengan materi yang sama — bukan cuma pada soal OSN-K yang saya
> unggah. Uji pada masukan acak, uji bentuk ekstrem, dan tulis syarat
> yang membuat triknya gugur.

Di akhir, minta berkas ini diperbarui bagian **Status modul**-nya, dan
minta `audit-umum.mjs` diperluas supaya modul baru ikut teraudit.
