# PANDUAN AUDIT PER MODUL

Berkas ini menjawab satu pertanyaan:

> Apakah penjelasan, rumus, klaim, cara cepat, dan trik "yang paling
> terasa curang" di modul ini **berlaku untuk soal lain dengan materi
> yang sama** — bukan cuma untuk soal OSN-K yang sudah diunggah?

Soal OSN-K dipakai sebagai **contoh penerapan**, bukan sebagai bukti.
Rumus yang kebetulan cocok dengan satu soal tidak membuktikan apa pun.

---

## 1. Berkas yang perlu diunggah

Untuk audit **penuh** (semua modul):

```
js/core/math.js          mesin hitung — yang paling penting
js/core/ui.js            dibutuhkan supaya modul bisa dibangun
js/core/ids.js           dibutuhkan supaya modul bisa dibangun
tests/alat.mjs           penguji
tests/klaim.mjs          daftar angka yang dikutip tiap modul
js/modules/*.js          SEMUA modul yang mau diaudit
```

Untuk audit **satu modul saja**, cukup lima berkas pertama ditambah satu
berkas modulnya.

**Tidak perlu diunggah:** naskah PDF soal OSN-K. Sudah ada di Project,
dan justru bukan itu yang diaudit.

---

## 2. Tiga lapis audit

Audit yang benar memeriksa tiga hal berbeda. Melewatkan salah satunya
membuat dua lapis lainnya kehilangan arti.

| Lapis | Yang diperiksa | Berkas | Menangkap |
|---|---|---|---|
| **1** | mesin hitung | `audit-umum.mjs`, `audit-lama.mjs` | rumus yang salah untuk masukan di luar soal |
| **2** | angka di prosa | `audit.mjs` | prosa yang melenceng dari kode |
| **3** | syarat gugur | `audit.mjs` | trik yang dipakai di luar batas berlakunya |

```
node tests/audit-umum.mjs        lapis 1, modul 09 ke atas
node tests/audit-lama.mjs        lapis 1, modul 01-08
node tests/audit.mjs             lapis 2 dan 3, semua modul
node tests/audit.mjs 10-euler    lapis 2 dan 3, satu modul
```

---

## 3. Lapis 1 · Mesin hitung

**Yang diperiksa:** tiap fungsi di `math.js` diadu dengan pencacahan
langsung, pada masukan **acak**.

Ini lapis terpenting, dan yang paling sering dilewati. Menguji rumus
dengan angka soal itu sama sekali bukan pengujian — angka itu justru
yang dipakai saat menyusun rumusnya.

### Cara menambahkan modul baru ke lapis ini

Untuk tiap fungsi baru di `math.js`, tulis di `audit-umum.mjs`:

1. **Pembanding jujur.** Tulis ulang jawabannya dengan cara paling bodoh
   tapi pasti benar — daftarkan semua kemungkinan, coba semua titik awal,
   simulasikan apa adanya. Pembanding ini **tidak boleh memakai rumusnya.**
2. **Pembangkit soal acak.** Bangkitkan ratusan kasus berbentuk sama tapi
   berangka beda. Graf acak untuk materi graf, pohon acak untuk pohon,
   kelompok acak untuk kombinatorika.
3. **Bentuk ekstrem.** n = 0, n = 1, masukan kosong, angka raksasa, graf
   terpisah, jalan ganda, jalan memutar ke dirinya sendiri, r lebih besar
   daripada n, kelompok berukuran 1.

### Aturan yang tidak boleh dilanggar

> Kalau modul membatasi masukan di layar (misalnya X maksimal 90),
> fungsinya di `math.js` **tetap harus benar di luar batas itu**.

Inilah cara dua bug lolos berbulan-bulan: `kecilDigitSum` salah mulai
X = 144 dan `mandirC00` salah mulai n = 54, tapi labnya membatasi masukan
sehingga tidak pernah terlihat. Untuk soal OSN-K yang ada jawabannya
benar; untuk soal lain salah.

---

## 4. Lapis 2 · Angka yang tertulis di prosa

**Yang diperiksa:** tiap angka yang dikutip modul dihitung **ulang** dari
`math.js`, lalu dipastikan benar-benar muncul di teks modul.

Kenapa perlu: mesin hitung boleh saja benar, tapi prosa modul menulis
angka yang sudah basi. Tidak ada uji lain yang menangkap itu.

### Cara menambahkan klaim

Buka `tests/klaim.mjs`, tambahkan entri untuk modulnya:

```js
'12-topik': [
  { apa: 'jawaban soal 2025 nomor 9',
    hitung: (M) => M.fungsiBaru(...),   // dihitung ulang, JANGAN disalin
    khusus: true,                        // cuma berlaku untuk soal itu
    dekat: 'minimum hari',               // angkanya harus dekat frasa ini
    semua: true },                       // SETIAP tempat harus cocok
],
```

| Kolom | Gunanya |
|---|---|
| `hitung` | menghitung ulang dari `math.js`. Kalau di sini angkanya disalin dari modul, auditnya tidak ada gunanya |
| `khusus` | `true` = angka ini cuma berlaku untuk soal itu. Akan dicetak di daftar akhir untuk kamu periksa manual |
| `format` | `'teks'` untuk jawaban berupa huruf seperti `BALIC` |
| `dekat` | frasa konteks. Tanpa ini, angka yang kebetulan muncul di halaman lain akan lolos |
| `semua` | menuntut SETIAP tempat yang menyebut frasa itu memuat angkanya |
| `opsional` | klaim yang boleh tidak dikutip modul — dicatat, tidak digagalkan |

### Dua aturan menulis `dekat` — dipelajari dengan cara yang mahal

**Jangkar tidak boleh memuat angka yang sedang diperiksa.** Kalau klaimnya
memeriksa angka 32 dan jangkarnya ditulis `'padahal jawabannya 32'`, maka
begitu angkanya dirusak jadi 33, jangkarnya ikut hilang. Jendelanya lenyap,
tidak ada yang bisa digagalkan, dan auditor tetap hijau. Tulis jangkarnya
`'padahal jawabannya'` saja, atau frasa lain yang tidak memuat angka itu.

**Jangkar harus cukup khas.** Di modul 13, frasa `'padahal jawabannya'`
ternyata dipakai dua klaim berbeda — satu untuk 32, satu untuk 24. Dengan
`semua: true`, klaim pertama gagal karena jendela klaim kedua tidak memuat
32. Pakai frasa yang cuma muncul di satu tempat, atau pola berpilihan
seperti `'(trik jeda-1 pada soal 15|tabel soal 15)'`.

### Batas kemampuan lapis ini — baca ini

Auditor memeriksa apakah **angka yang benar muncul di konteks yang
benar**. Ia tidak membaca kalimatnya.

- Tanpa `dekat`, angka yang muncul di bagian lain modul akan meloloskan
  klaim yang sebenarnya salah.
- Tanpa `semua`, modul yang menulis angka sama dua kali tetap lolos
  walaupun satu salinannya salah.
- Auditor tidak bisa menilai apakah **kalimat penjelasnya** benar. Itu
  tetap pekerjaan manusia.

**Cara mengurangi risikonya sejak awal:** jangan menulis angka penting
sebagai teks mati. Biarkan modul **mencetaknya dari `math.js`**, seperti
yang dilakukan bagian "Bedah soal". Angka yang dicetak dari kode tidak
bisa melenceng.

Cara menguji auditnya sendiri: rusak satu angka di modul dengan sengaja,
jalankan `node tests/audit.mjs`, pastikan ia merah. Kalau tetap hijau,
klaimnya butuh `dekat` atau `semua` yang lebih ketat.

---

## 5. Lapis 3 · Syarat gugur

**Yang diperiksa:** tiap modul wajib punya minimal satu catatan `awas`
yang menyebut kapan rumusnya **tidak berlaku**.

Trik tanpa syarat tertulis itu jebakan. Siswa akan memakainya di soal
yang bentuknya mirip tapi aturannya berbeda, lalu kehilangan nilai.

### Isi catatan yang wajib ada

1. **Kalimat pemicunya di naskah soal.** Kata apa yang menandakan
   rumusnya gugur. Contoh: "setidaknya sekali" bukan "maksimal sekali".
2. **Contoh terkecil yang mematahkannya.** Sekecil mungkin, dan angkanya
   harus dibuktikan di `verify/`.
3. **Rumus penggantinya**, kalau ada.

### Yang sudah tercatat

| Modul | Gugur kalau | Penggantinya |
|---|---|---|
| 09 LCA | satu titik punya lebih dari satu panah masuk | jawabannya tidak tunggal, soal jadi tidak sah |
| 10 Euler | jalannya satu arah | maks(1, jumlah kelebihan panah keluar) |
| 10 Euler | jalan boleh diulang | ruas + ruas yang terpaksa diulang |
| 10 Euler | petanya terpisah | hitung tiap bagian, lalu jumlahkan |
| 11 Kombinatorika | ada syarat antar-kelompok | trik polos − banyaknya pelanggaran |
| 11 Kombinatorika | tahapnya saling bergantung | aturan perkalian gugur |
| 11 Kombinatorika | kelompoknya beririsan | aturan penjumlahan gugur |
| 12 Prefix Sum | lariknya diubah di antara pertanyaan | bangun ulang tabelnya |
| 12 Prefix Sum | operasinya dikali atau diganti, bukan ditambah | difference array gugur |
| 12 Prefix Sum | ditanya nilai terbesar, bukan jumlah | tidak bisa dikurangkan |
| 13 DP | masa jedanya berbeda-beda | trik dua terbesar gugur, pakai DP penuh |
| 13 DP | tiap hari ambil yang terbesar | serakah meleset ~40% soal |
| 13 DP | keputusannya berdiri sendiri | DP berlebihan, urutkan saja |

Semuanya dibuktikan di `verify/12-syarat-gugur.py`.

---

## 6. Yang tetap harus diperiksa MANUSIA

Tiga hal ini tidak bisa diperiksa mesin. Di akhir `audit.mjs` ada daftar
**"angka yang hanya berlaku untuk soal itu"** — pakai daftar itu sebagai
lembar periksa.

**Pertama, angka contoh harus terbaca sebagai contoh.** "Hemat 71%",
"3.112 rute", "42 lawan 12 langkah" — semuanya khusus satu soal. Modul
harus menulis "di pohon ini" atau "untuk soal 2024" di dekatnya. Kalau
tidak, siswa akan menghafalnya sebagai patokan.

**Kedua, kalimat penjelasnya harus benar, bukan cuma angkanya.** Mesin
memeriksa angka. Kamu yang memeriksa apakah alasannya masuk akal.

**Ketiga, triknya harus benar-benar cepat di kertas.** Trik yang butuh
tabel besar atau hitungan panjang bukan trik, walaupun rumusnya benar.
Ujinya sederhana: kerjakan soalnya dengan pensil, hitung detiknya.

---

## 7. Urutan audit yang disarankan

```
1. node tests/semua.mjs         semua modul masih utuh?
2. node tests/audit-lama.mjs    mesin hitung modul 01-08
3. node tests/audit-umum.mjs    mesin hitung modul 09+
4. node tests/audit.mjs         angka prosa + syarat gugur
5. node tests/kunci.test.mjs    gembok rumus berfungsi
6. baca daftar "angka khusus soal" di akhir langkah 4
```

Jalankan **seluruhnya** setiap kali `math.js` disentuh. Perubahan satu
fungsi bisa merusak modul yang tidak kamu sangka.

---

## 8. Cara meminta audit di percakapan baru

Unggah berkas di bagian 1, lalu tulis:

> Audit modul NN mengikuti PANDUAN-AUDIT.md. Pastikan semua penjelasan,
> rumus, klaim, cara cepat, dan trik "yang paling terasa curang" berlaku
> kalau diterapkan pada soal lain dengan materi yang sama — bukan cuma
> pada soal OSN-K yang saya unggah.
>
> Jalankan ketiga lapisnya. Untuk lapis 1, bangkitkan soal acak
> berbentuk sama dan adu dengan pencacahan langsung. Untuk lapis 2,
> tambahkan klaim modul ini ke `tests/klaim.mjs` kalau belum ada. Untuk
> lapis 3, cari kasus yang membuat triknya gugur dan tulis syaratnya di
> modul.
>
> Uji juga auditnya sendiri: rusak satu angka dengan sengaja, pastikan
> auditor menangkapnya.

Kalimat terakhir itu penting. Audit yang tidak pernah merah belum tentu
berarti modulnya benar — bisa juga auditnya yang tidak bekerja.
