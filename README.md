# Lab OSN-K Informatika 2027

Lab interaktif 17 modul untuk persiapan OSN-K Informatika.

## Menjalankan

Aplikasi memakai ES modules, jadi **tidak bisa** dibuka langsung
lewat klik ganda (`file://` diblokir browser). Jalankan server lokal:

```bash
cd lab-osnk
python -m http.server 8000
```
Lalu buka <http://localhost:8000>

## Mengunggah ke internet

Seluruhnya berkas statis — tidak perlu server aplikasi maupun database.

- **Netlify Drop** (paling cepat): seret folder ini ke <https://app.netlify.com/drop>
- **Cloudflare Pages** atau **GitHub Pages**: unggah isi folder apa adanya

## Struktur

```
index.html              kerangka tipis
css/tokens.css          warna, huruf  ← ubah di sini untuk mengubah tampilan
css/base.css            tata letak, navigasi, responsif
css/components.css      Kartu, Lab, Rumus, Catatan, Tab
js/main.js              navigasi + muat malas
js/core/math.js         mesin hitung TERVERIFIKASI
js/core/ui.js           pustaka komponen
js/core/ids.js          penamaan id otomatis (anti-tabrakan)
js/core/storage.js      progres (lokal; siap disambung ke database)
js/core/registry.js     daftar modul  ← satu-satunya tempat menambah modul
js/core/judul.js        judul untuk navigasi
js/modules/NN-nama.js   satu berkas per modul
tests/                  penguji
verify/                 skrip Python pembukti rumus
```

## Menambah modul baru

1. Buat `js/modules/18-nama.js`
2. Tambahkan satu baris di `js/core/registry.js`
3. Tambahkan judulnya di `js/core/judul.js`
4. Jalankan `node tests/semua.mjs`

## Kontrak modul

```js
export default {
  id, n, kelompok, judul, lede, lencana,
  kartu: [{q, a, why}],     // opsional — untuk drill
  kamus: [[kataKunci, topik]], // opsional
  bangun(root, { ids, pasangTab }) { ... }
};
```

Aturan penting: **jangan pernah menulis id mentah.** Selalu lewat
`ids.i('nama')` saat menulis HTML dan `ids.q('nama')` saat mengambilnya.
Penguji akan menolak modul yang melanggar.

## Menguji

```bash
node tests/semua.mjs              # kontrak semua modul
node tests/01-josephus.test.mjs   # uji mendalam satu modul
node tests/04-frobenius.test.mjs
python3 verify/04-frobenius.py    # pembuktian rumusnya
```

## Status

| Modul | Keadaan |
|---|---|
| 01 Josephus | ✅ digarap dalam, 48 uji lolos |
| 02 Digit Sum | ✅ isi lengkap, dipindahkan |
| 03 GCD & Totient | ✅ isi lengkap, dipindahkan |
| 04 Frobenius | ✅ digarap dalam, 46 uji lolos, verify/04-frobenius.py 11 klaim |
| 05–17 | ⏳ berfungsi, tapi belum digarap sedalam 01–04 |

## Rencana berikutnya

1. Garap modul 04–17 sedalam modul 01 (Apa itu → Lab → Rumus → Cara cepat →
   Penyamaran → Bedah soal → Kapan bukan), masing-masing dengan skrip
   verifikasi Python
2. Sambungkan Drill (modul 16) dan Kamus (modul 17) agar mengumpulkan
   `kartu` dan `kamus` dari seluruh modul secara otomatis
3. Unggah ke hosting
4. Opsional: akun siswa + papan pantau guru (lihat `js/core/storage.js`,
   fungsi `pasangPenyediaAwan`)
