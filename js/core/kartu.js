/* ============================================================
   BANK KARTU DRILL
   ------------------------------------------------------------
   Dipakai modul 16, dan diperiksa tests/16-drill.test.mjs.

   Tiap kartu:
     q       pertanyaan — potongan kode atau kutipan soal
     a       jawaban — salah satu kategori di KATEGORI (lihat bawah)
     why     alasannya, dalam bahasa yang dipakai ke siswa
     topik   modul asalnya, dipakai untuk menyaring latihan
     tk      tingkat: 1 mudah · 2 sedang · 3 jebakan

   ATURAN MENULIS KARTU
   1. `why` harus menyebut CIRI YANG BISA DILIHAT, bukan cuma nama topik.
      Buruk : "Ini Josephus."
      Baik  : "Rekursi (f(N−1) + K) mod N — ciri Josephus umum."
   2. Angka apa pun di `why` harus benar. Diperiksa berkas ujinya.
   3. Pakai FPB, bukan gcd. Pakai "titik"/"persimpangan", bukan simpul.
   4. Tiap topik wajib punya minimal satu kartu bertingkat 3 (jebakan).
   5. `a` adalah AREA soalnya, BUKAN "benar atau jebakan". Jebakan di
      dalam sebuah area tetap memakai kategori areanya — yang
      membedakan ditulis di `why`. Kalau jebakan diberi kategori
      'lain', drill malah mengajarkan pembedaan yang keliru: siswa
      belajar bahwa soal tukang pos "bukan graf", padahal ia graf.
      Pakai 'lain' HANYA kalau soalnya memang di luar kesembilan
      area — misalnya kotak burung, pengurutan, atau Frobenius dan
      TIGA yang tidak punya kategori sendiri.
   6. Kategori kartu di sini harus SAMA dengan kartu di modul ajarnya.
      Diperiksa tests/16-drill.test.mjs.
   ============================================================ */

export const KATEGORI = ['josephus', 'gcd', 'digitsum', 'doubling',
  'graf', 'kombi', 'prefix', 'dp', 'lain'];

export const LABEL = {
  josephus: 'Josephus', gcd: 'FPB / Totient', digitsum: 'Digit Sum',
  doubling: 'Rekursi Doubling', graf: 'Graf', kombi: 'Kombinatorika',
  prefix: 'Prefix Sum', dp: 'Dynamic Programming', lain: 'Lainnya / Jebakan',
};

export const TOPIK = {
  '01': 'Josephus', '02': 'Digit Sum', '03': 'FPB & Totient',
  '04': 'Frobenius', '05': 'Rekursi Doubling', '06': 'MAI',
  '07': 'TIGA', '08': 'Level & Urutan Kerja', '09': 'LCA',
  '10': 'Lintasan Euler', '11': 'Kombinatorika', '12': 'Prefix Sum',
  '13': 'Dynamic Programming',
  '14': 'Pigeonhole & Skenario Terburuk',
  '15': 'Kotak Bersarang (Dilworth)', 'xx': 'Campuran',
};

export const BANK = [

  /* ============ 01 JOSEPHUS ============ */
  { q: 'return (pndk(N-1, K) + K - 1) % N + 1;', a: 'josephus', topik: '01', tk: 1,
    why: 'Rekursi berbentuk (f(N−1) + K) mod N — ciri khas Josephus umum.' },
  { q: 'while (p * 2 <= n) p *= 2;\nreturn 2 * (n - p) + 1;', a: 'josephus', topik: '01', tk: 1,
    why: 'Cari pangkat 2 terbesar yang tidak melewati n, lalu 2(n−p)+1. Itu Josephus untuk K = 2.' },
  { q: '"N orang duduk melingkar, setiap orang ke-K dikeluarkan. Siapa yang tersisa?"', a: 'josephus', topik: '01', tk: 1,
    why: 'Dua kata pemicunya: melingkar, dan pembuangan setiap orang ke-K.' },
  { q: '"Bebek dinomori 1 sampai 100 mengelilingi kolam. Setiap bebek kedua keluar barisan."', a: 'josephus', topik: '01', tk: 2,
    why: 'Setiap yang kedua berarti K = 2. Tulis 100 dalam biner, geser bit paling depan ke belakang.' },
  { q: 'r = 0;\nfor (int i = 2; i <= n; i++) r = (r + k) % i;\nreturn r + 1;', a: 'josephus', topik: '01', tk: 2,
    why: 'Bentuk berulang dari rekursi Josephus. Yang ditumpuk adalah sisa bagi, dan penutupnya +1.' },
  { q: '"Siapa yang keluar KETIGA dari lingkaran?"', a: 'josephus', topik: '01', tk: 3,
    why: 'JEBAKAN — rumus 2(n−p)+1 cuma memberi yang SELAMAT. Untuk urutan keluar, simulasikan.' },
  { q: '"N orang berbaris lurus, setiap orang ke-K dikeluarkan."', a: 'lain', topik: '01', tk: 3,
    why: 'JEBAKAN — berbaris LURUS, bukan melingkar. Tidak ada putaran kembali, jadi bukan Josephus.' },

  /* ============ 02 DIGIT SUM ============ */
  { q: 'while (x > 0) { total += x % 10; x /= 10; }', a: 'digitsum', topik: '02', tk: 1,
    why: 'Pasangan % 10 dan / 10 adalah tanda keluarga digit.' },
  { q: '"Berapa sisa bagi 9 dari bilangan itu?"', a: 'digitsum', topik: '02', tk: 1,
    why: 'Sisa bagi 9 sebuah bilangan selalu sama dengan sisa bagi 9 jumlah digitnya.' },
  { q: 'while (n > 9) n = jumlahDigit(n);\nreturn n;', a: 'digitsum', topik: '02', tk: 1,
    why: 'Diulang sampai tersisa satu digit — itu akar digit. Rumusnya 1 + (n−1) mod 9.' },
  { q: '"Bilangan terkecil yang jumlah digitnya 20?"', a: 'digitsum', topik: '02', tk: 2,
    why: 'Isi 9 sebanyak mungkin dari belakang: 299. Sisa 2 ditaruh di depan.' },
  { q: 'return (X % 10) * (X % 10) + f(X / 10);', a: 'lain', topik: '02', tk: 3,
    why: 'JEBAKAN — digitnya dikuadratkan dulu. Ini bukan digit sum, dan sifat mod 9-nya tidak berlaku.' },
  { q: 'return (X % 10) + f(X / 100);', a: 'lain', topik: '02', tk: 3,
    why: 'JEBAKAN — pembaginya 100, jadi digitnya dilompati satu-satu. Bukan jumlah semua digit.' },
  { q: '"Berapa banyak bilangan di bawah 1000 yang jumlah digitnya habis dibagi 3?"', a: 'digitsum', topik: '02', tk: 2,
    why: 'Jumlah digit habis dibagi 3 sama artinya dengan bilangannya habis dibagi 3.' },

  /* ============ 03 FPB & TOTIENT ============ */
  { q: 'return MERAH(B, A % B);', a: 'gcd', topik: '03', tk: 1,
    why: 'Parameter bertukar posisi dan ada operasi modulo — ciri khas cara Euclid.' },
  { q: '"Berapa banyak bilangan 1 sampai n yang tidak punya faktor bersama dengan n?"', a: 'gcd', topik: '03', tk: 1,
    why: 'Itu definisi persis fungsi totient Euler.' },
  { q: '"Ubin persegi terbesar yang bisa menutupi lantai 48 × 18 cm tanpa dipotong?"', a: 'gcd', topik: '03', tk: 2,
    why: 'Sisi ubin harus membagi habis kedua ukurannya. Yang terbesar adalah FPB(48, 18) = 6.' },
  { q: '"Ada berapa C dari 1 sampai A yang FPB(A, C) tepat B?"', a: 'gcd', topik: '03', tk: 2,
    why: 'Bagi semuanya dengan B, syaratnya jadi koprima. Jawabannya totient dari A/B.' },
  { q: 'int a = 89, b = 55;\nwhile (b) { int t = a % b; a = b; b = t; }', a: 'gcd', topik: '03', tk: 2,
    why: 'Dua bilangan Fibonacci berurutan — itu kasus terlama untuk cara Euclid.' },
  { q: '"Kelipatan persekutuan terkecil dari 12 dan 18?"', a: 'gcd', topik: '03', tk: 3,
    why: 'JEBAKAN — yang ditanya KPK, bukan FPB. Hitung a × b ÷ FPB, jadi 12 × 18 ÷ 6 = 36.' },
  { q: '"Ada berapa pembagi positif dari 360?"', a: 'kombi', topik: '03', tk: 3,
    why: 'JEBAKAN — ini bukan FPB. Pecah 360 jadi 2³ × 3² × 5, lalu (3+1)(2+1)(1+1) = 24.' },

  /* ============ 04 FROBENIUS ============ */
  { q: '"Dua gayung 3 liter dan 5 liter. Volume mana yang tidak bisa ditakar pas?"', a: 'lain', topik: '04', tk: 1,
    why: 'Frobenius. Karena FPB(3,5) = 1, yang terbesar adalah 3×5−3−5 = 7.' },
  { q: '"Nugget dijual dalam kemasan 6 dan 9. Berapa jumlah terbesar yang tidak bisa dibeli pas?"', a: 'lain', topik: '04', tk: 3,
    why: 'JEBAKAN — FPB(6,9) = 3, jadi tidak koprima. Semua yang bukan kelipatan 3 mustahil, jumlahnya tak terbatas.' },
  { q: '"Berapa banyak nilai yang tidak bisa dibentuk dari 4 dan 7?"', a: 'lain', topik: '04', tk: 2,
    why: 'Koprima, jadi (4−1)(7−1)/2 = 9 nilai. Tepat separuh dari yang di bawah bilangan Frobenius.' },
  { q: '"Perangko 5 dan 8 sen. Bisakah membayar 27 sen?"', a: 'lain', topik: '04', tk: 2,
    why: 'Frobenius(5,8) = 5×8−5−8 = 27. Jadi 27 justru yang terbesar yang TIDAK bisa.' },
  { q: '"Dua gayung 6 dan 10 liter. Berapa yang tidak bisa ditakar sampai 100?"', a: 'lain', topik: '04', tk: 3,
    why: 'JEBAKAN — FPB-nya 2. Bagi dulu jadi pasangan (3,5), dan semua bilangan ganjil ikut mustahil.' },

  /* ============ 05 REKURSI DOUBLING ============ */
  { q: 'return MANDIR(n-1) + MONDAR(MANDIR(n-1));', a: 'doubling', topik: '05', tk: 1,
    why: 'Hasilnya sendiri ditempel ulang setelah diubah — panjangnya berlipat dua tiap tingkat.' },
  { q: '"Berapa karakter ke-1000 dari string yang panjangnya berlipat dua tiap langkah?"', a: 'doubling', topik: '05', tk: 1,
    why: 'Jangan bangun stringnya. Tulis 1000 dalam biner, lalu hitung banyaknya angka 1.' },
  { q: 'return popcount(i) % 2;', a: 'doubling', topik: '05', tk: 2,
    why: 'Ganjil-genap banyaknya bit 1 — itu rumus langsung barisan Thue-Morse.' },
  { q: '"Ada berapa pasangan 00 berurutan setelah 12 langkah?"', a: 'doubling', topik: '05', tk: 2,
    why: 'Ada rumus langsungnya, ⌊2^(n−1) ÷ 3⌋. Untuk n = 12 hasilnya 682.' },
  { q: '"String awalnya 0. Tiap langkah, tambahkan kebalikannya di belakang."', a: 'doubling', topik: '05', tk: 1,
    why: 'Panjangnya 2 pangkat n, dan awalannya tidak pernah berubah. Itu ciri doubling.' },
  { q: 'return MANDIR(n-1) + MANDIR(n-2);', a: 'lain', topik: '05', tk: 3,
    why: 'JEBAKAN — yang ditempel n−2, bukan salinan dirinya sendiri. Panjangnya Fibonacci, bukan 2 pangkat n.' },

  /* ============ 06 MAI ============ */
  { q: 'return MAI(MAI(x, y-1, z), y-1, z);', a: 'doubling', topik: '06', tk: 1,
    why: 'Memanggil dirinya dua kali bersarang, jadi efeknya berlipat dua — 2 pangkat y kali.' },
  { q: '"Berapa 2 pangkat 1000 sisa bagi 67?"', a: 'doubling', topik: '06', tk: 2,
    why: 'Sisanya berputar tiap 66 langkah. Cukup lihat 1000 sisa bagi 66.' },
  { q: 'e = 1; base = 2;\nwhile (y) { if (y & 1) e = e * base % m; base = base * base % m; y >>= 1; }', a: 'doubling', topik: '06', tk: 2,
    why: 'Pangkat dihitung lewat biner, tiap langkah pangkatnya dikuadratkan. Itu doubling pada angka.' },
  { q: '"Fungsi memanggil dirinya dua kali dengan parameter y−1. Berapa kali dasar dipanggil?"', a: 'doubling', topik: '06', tk: 2,
    why: 'Tiap tingkat menggandakan, jadi tepat 2 pangkat y pemanggilan dasar.' },
  { q: 'return MAI(x, y-1, z) + MAI(x, y-1, z);', a: 'lain', topik: '06', tk: 3,
    why: 'JEBAKAN — dua panggilan itu SEJAJAR, bukan bersarang. Hasilnya cuma dikali 2, bukan berlipat efek.' },

  /* ============ 07 TIGA ============ */
  { q: 'return TIGA(N-1) + TIGA(N-3);', a: 'lain', topik: '07', tk: 1,
    why: 'Rekursi bercabang. Hitung beberapa suku awal dulu, jangan langsung mencari rumusnya.' },
  { q: '"Fungsi bercabang tergantung sisa bagi 3 dari N."', a: 'lain', topik: '07', tk: 1,
    why: 'Sisa bagi 3 menentukan seberapa jauh lompatannya. Telusuri turun sampai berhenti.' },
  { q: 'if (n % 3 == 0) return f(n-1) + f(n-3);\nelse if (n % 3 == 1) return f(n-2);\nelse return f(n-3);', a: 'lain', topik: '07', tk: 2,
    why: 'Dua cabang dari tiga cuma melompat, tidak menambah. Jadi nilainya tumbuh pelan sekali.' },
  { q: '"Berapa TIGA(2025)?"', a: 'lain', topik: '07', tk: 2,
    why: 'Kelipatan 3, jadi jawabannya N ÷ 3 + 1 = 676. Tidak perlu menelusuri 2.025 langkah.' },
  { q: '"Berapa banyak pemanggilan fungsi kalau hasilnya tidak diingat?"', a: 'lain', topik: '07', tk: 3,
    why: 'JEBAKAN — yang ditanya banyaknya PEMANGGILAN, bukan nilai fungsinya. Dua angka yang sangat berbeda.' },

  /* ============ 08 LEVEL & URUTAN KERJA ============ */
  { q: '"Kegiatan B hanya bisa dilakukan setelah kegiatan A selesai."', a: 'graf', topik: '08', tk: 1,
    why: 'Prasyarat berarti panah satu arah. Kupas berlapis: buang yang prasyaratnya sudah habis.' },
  { q: '"Paling cepat berapa tahap semua kegiatan selesai kalau boleh paralel?"', a: 'graf', topik: '08', tk: 1,
    why: 'Itu banyaknya lapis. Tiap lapis dikerjakan bersamaan.' },
  { q: '"Kegiatan X paling awal bisa ditaruh di urutan ke berapa?"', a: 'graf', topik: '08', tk: 2,
    why: 'Hitung semua leluhurnya, langsung maupun tidak, lalu tambah 1.' },
  { q: '"Berapa lama seluruh proyek selesai kalau tiap kegiatan punya durasi?"', a: 'graf', topik: '08', tk: 2,
    why: 'Jalur kritis. Waktu selesai tiap kegiatan = durasinya + yang terlama di antara prasyaratnya.' },
  { q: '"Kegiatan A butuh B, B butuh C, dan C butuh A."', a: 'graf', topik: '08', tk: 3,
    why: 'JEBAKAN — ada lingkaran. Tidak ada urutan yang sah, jadi soalnya sendiri mustahil.' },
  { q: '"Level kegiatan itu 4, jadi ia dikerjakan keempat."', a: 'graf', topik: '08', tk: 3,
    why: 'JEBAKAN — level dan urutan itu dua angka berbeda. Level 4 bisa saja urutan ke-6.' },

  /* ============ 09 LCA ============ */
  { q: '"Dua robot berangkat dari satu batu yang sama menuju dua tujuan berbeda."', a: 'graf', topik: '09', tk: 1,
    why: 'LCA. Batu awal terbaik selalu leluhur bersama yang paling bawah.' },
  { q: '"Setiap batu hanya dapat dicapai dari satu batu tepat di atasnya."', a: 'graf', topik: '09', tk: 1,
    why: 'Kalimat ini menjamin bentuknya pohon — tiap titik punya tepat satu induk.' },
  { q: 'for (int x = u; x != -1; x = induk[x]) a[na++] = x;', a: 'graf', topik: '09', tk: 2,
    why: 'Menaiki induk sampai akar, lalu dua deretnya dibandingkan dari belakang. Itu mencari awalan yang sama.' },
  { q: 'return dalam[u] + dalam[v] - 2 * dalam[lca(u,v)];', a: 'graf', topik: '09', tk: 2,
    why: 'Panjang jalan antara dua titik lewat leluhur bersamanya. Tambah 1 kalau yang ditanya banyaknya titik.' },
  { q: '"Dua huruf tergambar sejajar, berarti kedalamannya sama."', a: 'graf', topik: '09', tk: 3,
    why: 'JEBAKAN — tinggi di gambar bukan kedalaman. Hitung panahnya dari akar, jangan lihat posisinya.' },
  { q: '"Satu titik punya dua panah masuk."', a: 'graf', topik: '09', tk: 3,
    why: 'JEBAKAN — itu bukan pohon lagi. Leluhur terdekatnya bisa lebih dari satu, jadi jawabannya tidak tunggal.' },

  /* ============ 10 LINTASAN EULER ============ */
  { q: '"Setiap jalan hanya boleh dilewati maksimal sekali. Minimal berapa hari?"', a: 'graf', topik: '10', tk: 1,
    why: 'Hitung persimpangan berderajat ganjil, sebut t. Jawabannya maks(1, t ÷ 2).' },
  { q: '"Bisakah gambar ini diselesaikan tanpa mengangkat pensil?"', a: 'graf', topik: '10', tk: 1,
    why: 'Bisa kalau persimpangan ganjilnya 0 atau 2. Kalau 4, kamu harus mengangkat pensil sekali.' },
  { q: '"Tiap persimpangan dilewati 3 jalan, ada 8 persimpangan."', a: 'graf', topik: '10', tk: 2,
    why: 'Derajatnya seragam dan ganjil, jadi kedelapan-delapannya ganjil. Jawabannya 8 ÷ 2 = 4.' },
  { q: '"Menelusuri semua jalan setidaknya sekali, berapa waktu minimum?"', a: 'graf', topik: '10', tk: 3,
    why: 'JEBAKAN — "setidaknya", bukan "maksimal". Jalan boleh diulang, jadi jawabannya banyak ruas + ruas yang terpaksa diulang.' },
  { q: '"Kota punya dua pulau yang tidak terhubung jembatan."', a: 'graf', topik: '10', tk: 3,
    why: 'JEBAKAN — hitung tiap pulau sendiri lalu jumlahkan. Walaupun semua derajatnya genap, jawabannya tetap 2.' },
  { q: '"Setiap PERSIMPANGAN dilewati tepat sekali."', a: 'graf', topik: '10', tk: 3,
    why: 'JEBAKAN — persimpangan, bukan jalan. Itu masalah Hamilton, dan jauh lebih sulit.' },
  { q: '"Jalannya satu arah, digambar dengan panah."', a: 'graf', topik: '10', tk: 3,
    why: 'JEBAKAN — rumus ganjil ÷ 2 gugur. Yang dipakai selisih panah keluar dikurangi panah masuk.' },

  /* ============ 11 KOMBINATORIKA ============ */
  { q: '"Ada berapa banyak susunan yang mungkin?"', a: 'kombi', topik: '11', tk: 1,
    why: 'Tentukan dulu: tahapan berurutan dikalikan, pilihan yang saling lepas dijumlahkan.' },
  { q: '"Sandi 4 angka yang memuat setidaknya satu angka 7?"', a: 'kombi', topik: '11', tk: 1,
    why: 'Trik komplemen: 10⁴ − 9⁴ = 3.439. Jauh lebih ringan daripada memisah empat kasus.' },
  { q: '"Tiap kelompok boleh mengirim satu wakil atau tidak, minimal satu orang ikut."', a: 'kombi', topik: '11', tk: 2,
    why: 'Kalikan (ukuran + 1) tiap kelompok, lalu buang 1 kemungkinan kosong.' },
  { q: '"Berapa banyak kata berbeda dari huruf penyusun BACA?"', a: 'kombi', topik: '11', tk: 2,
    why: 'Ada A kembar dua, jadi 4! ÷ 2! = 12. Bukan 24.' },
  { q: '"Lima orang duduk melingkar. Ada berapa susunan?"', a: 'kombi', topik: '11', tk: 2,
    why: 'Memutar seluruh lingkaran bukan susunan baru, jadi (5−1)! = 24.' },
  { q: '"Bagi 4 kue yang sama ke 3 anak, boleh ada yang tidak kebagian."', a: 'kombi', topik: '11', tk: 2,
    why: 'Bintang dan batang: C(4+3−1, 3−1) = C(6,2) = 15.' },
  { q: '"Dari 10 siswa dipilih ketua, sekretaris, dan bendahara."', a: 'kombi', topik: '11', tk: 3,
    why: 'JEBAKAN — jabatannya berbeda, jadi urutan berpengaruh. 10 × 9 × 8 = 720, bukan C(10,3) = 120.' },
  { q: '"Pilih 3 siswa untuk mewakili sekolah."', a: 'kombi', topik: '11', tk: 2,
    why: 'Tanpa jabatan, jadi urutannya tidak berpengaruh. Ini C(10,3) = 120.' },
  { q: '"A dan B bermusuhan, tidak boleh dipilih bersamaan."', a: 'kombi', topik: '11', tk: 3,
    why: 'JEBAKAN — ada syarat antar-kelompok, jadi perkalian polos kelebihan. Kurangi susunan yang melanggar.' },

  /* ============ 12 PREFIX SUM ============ */
  { q: 'B[i] = B[i-1] + A[i-1];\n…\nreturn B[y] - B[x-1];', a: 'prefix', topik: '12', tk: 1,
    why: 'Tabel bantu dibangun sekali, lalu tiap rentang dijawab dengan satu pengurangan.' },
  { q: '"Berapa jumlah nilai dari hari ke-3 sampai hari ke-9?" ditanya berkali-kali', a: 'prefix', topik: '12', tk: 1,
    why: 'Pertanyaan yang sama untuk banyak rentang — itu tanda tabel bantu.' },
  { q: '"Ada berapa bebek jantan di kandang 4 sampai 11?"', a: 'prefix', topik: '12', tk: 2,
    why: 'Mencacah juga prefix sum. Tandai 1 untuk jantan, 0 untuk betina, lalu rumusnya sama.' },
  { q: 'D[l] += v;  D[r+1] -= v;', a: 'prefix', topik: '12', tk: 2,
    why: 'Difference array. Tandai dua ujungnya saja, lalu sapu sekali sambil menjumlahkan.' },
  { q: '"Setiap petugas menyiram petak L sampai R. Di akhir, petak mana paling banjir?"', a: 'prefix', topik: '12', tk: 2,
    why: 'Difference array. Mengubah rentang berkali-kali, lalu bertanya sekali di akhir.' },
  { q: 'return P[r2][c2] - P[r1-1][c2] - P[r2][c1-1] + P[r1-1][c1-1];', a: 'prefix', topik: '12', tk: 2,
    why: 'Prefix sum dua dimensi. Suku terakhirnya mengembalikan pojok yang terpotong dua kali.' },
  { q: '"Berapa banyak angka BERBEDA dari indeks X sampai Y?"', a: 'prefix', topik: '12', tk: 3,
    why: 'JEBAKAN — yang unik tidak bisa dikurangkan. Prefix sum tidak berlaku.' },
  { q: '"Berapa nilai TERBESAR dari indeks X sampai Y?"', a: 'prefix', topik: '12', tk: 3,
    why: 'JEBAKAN — nilai terbesar tidak bisa dikurangkan, jadi rentangnya tidak bisa dipotong.' },
  { q: '"Berapa jumlah 3 sampai 7? Lalu ubah nilai posisi 5. Sekarang berapa jumlah 4 sampai 9?"', a: 'prefix', topik: '12', tk: 3,
    why: 'JEBAKAN — lariknya berubah di tengah, jadi tabel bantunya basi. Bangun ulang.' },

  /* ============ 13 DYNAMIC PROGRAMMING ============ */
  { q: '"Setelah memilih T, selama A hari berikutnya tidak boleh memilih T lagi."', a: 'dp', topik: '13', tk: 1,
    why: 'Masa jeda mengikat keputusan hari ini ke hari sebelumnya. Itu tanda DP.' },
  { q: 'dp[i] = max(dp[i-1], nilai[i] + dp[i-2]);', a: 'dp', topik: '13', tk: 1,
    why: 'Dua pilihan tiap posisi: lewati, atau ambil lalu lompat dua. Larangan bersebelahan.' },
  { q: 'dp[i] = max(dp[i-1], nilai[i] + dp[i-1-K]);', a: 'dp', topik: '13', tk: 2,
    why: 'Sama, tapi lompatnya sejauh masa jeda K. Untuk K = 1 ia kembali jadi dp[i−2].' },
  { q: '"Menaiki tangga dengan langkah 1 atau 2. Ada berapa cara sampai anak tangga ke-N?"', a: 'dp', topik: '13', tk: 2,
    why: 'DP untuk mencacah, bukan mencari maksimum. Angkanya jadi deret Fibonacci.' },
  { q: '"Pecahan 1, 3, dan 4. Berapa keping paling sedikit untuk membayar 6?"', a: 'dp', topik: '13', tk: 3,
    why: 'JEBAKAN untuk cara serakah. Serakah ambil 4 lalu 1 dan 1 — tiga keping. Yang benar 3 + 3, cuma 2 keping.' },
  { q: '"Dari pojok kiri atas ke kanan bawah, hanya boleh ke kanan atau ke bawah."', a: 'dp', topik: '13', tk: 2,
    why: 'DP dua dimensi. Tiap petak cuma bisa dicapai dari atas atau kiri.' },
  { q: '"Tiap hari ambil saja poin terbesar yang sedang boleh."', a: 'dp', topik: '13', tk: 3,
    why: 'JEBAKAN — itu cara serakah, dan ia meleset di sekitar separuh soal penjadwalan.' },
  { q: '"Ada N barang berbeda harga. Beli sebanyak mungkin dengan uang yang ada."', a: 'lain', topik: '13', tk: 3,
    why: 'JEBAKAN — keputusannya berdiri sendiri, tidak ada yang saling melarang. Urutkan lalu beli dari termurah.' },
  { q: '"Hitung tiap jenis latihan sendiri-sendiri, lalu jumlahkan."', a: 'dp', topik: '13', tk: 3,
    why: 'JEBAKAN — tiap hari cuma boleh satu agenda, jadi ketiga jenis berebut hari yang sama.' },

  /* ============ 14 PIGEONHOLE & SKENARIO TERBURUK ============ */
  { q: '"Minimal berapa bebek supaya DIJAMIN semua tipe biskuit pernah dicicipi?"', a: 'lain', topik: '14', tk: 1,
    why: 'Kata "dijamin" menandakan skenario terburuk. Total butir dikurangi toples terkecil, lalu tambah syaratnya.' },
  { q: '"Berapa kaus kaki harus diambil dari laci gelap supaya pasti dapat sepasang sewarna?"', a: 'lain', topik: '14', tk: 1,
    why: 'Bentuk paling murni. Paling sial dapat satu tiap warna, jadi jawabannya banyak warna ditambah satu.' },
  { q: '"Berapa uang minimal supaya dijamin mendapat mainan yang diinginkan?"', a: 'lain', topik: '14', tk: 2,
    why: 'Uang cuma pembungkus. Cari keadaan paling sial yang belum memenuhi, lalu tambah satu tarikan.' },
  { q: '"Pernyataan mana yang PASTI benar?"', a: 'lain', topik: '14', tk: 2,
    why: 'Bentuk terbalik. Untuk tiap pernyataan cari satu contoh pembatal, jangan mencoba membuktikannya benar.' },
  { q: '"7 toples berisi 5 butir. Berapa bebek supaya semua toples tersentuh?"', a: 'lain', topik: '14', tk: 2,
    why: 'Total 35 dikurangi toples terkecil 5, lalu tambah 1. Jawabannya 31, bukan 7.' },
  { q: '"Minimal berapa bebek supaya MUNGKIN semua tipe biskuit tercicipi?"', a: 'lain', topik: '14', tk: 3,
    why: 'JEBAKAN — "mungkin" bukan "dijamin". Jawabannya cuma banyak tipe dikali syarat, jauh lebih kecil.' },
  { q: '"Salah satu toples ternyata KOSONG."', a: 'lain', topik: '14', tk: 3,
    why: 'JEBAKAN — toples kosong tidak akan pernah tercicipi, jadi soalnya mustahil. Bukan diabaikan.' },
  { q: '"Tiap bebek boleh mengambil dua butir sekaligus."', a: 'lain', topik: '14', tk: 3,
    why: 'JEBAKAN — rumus total dikurangi terkecil gugur kalau satu pengambil boleh mengambil lebih dari satu.' },
  { q: '"Ada berapa kemungkinan susunan biskuit di toples?"', a: 'kombi', topik: '14', tk: 3,
    why: 'JEBAKAN — tidak ada kata "dijamin". Ini soal mencacah, bukan skenario terburuk.' },

  /* ============ 15 KOTAK BERSARANG (DILWORTH) ============ */
  { q: '"Kotak boleh dimasukkan ke kotak lain kalau sisinya lebih kecil."', a: 'lain', topik: '15', tk: 1,
    why: 'Kotak bersarang. Susunannya membentuk rantai, dan yang dicari banyaknya rantai paling sedikit.' },
  { q: '"Tiap kotak yang dibuka hanya boleh memperlihatkan maksimal satu kotak."', a: 'lain', topik: '15', tk: 1,
    why: 'Kalimat inilah yang memaksa susunannya jadi rantai lurus, bukan pohon bercabang.' },
  { q: '"Berapa kotak paling sedikit yang terlihat dari luar?"', a: 'lain', topik: '15', tk: 1,
    why: 'Jawabannya cacah ukuran yang paling sering muncul. Kotak sesama ukuran tidak bisa saling masuk.' },
  { q: '"Berapa set boneka matryoshka paling sedikit dari sekumpulan boneka?"', a: 'lain', topik: '15', tk: 2,
    why: 'Soal yang sama, kostum berbeda. Satu set adalah satu rantai, jadi hitung ukuran yang paling sering muncul.' },
  { q: '"Siswa berbaris, tinggi badan harus menaik tegas. Paling sedikit berapa barisan?"', a: 'lain', topik: '15', tk: 2,
    why: 'Rantai lagi. Siswa bertinggi sama tidak bisa satu barisan, jadi jawabannya cacah tinggi yang terbanyak.' },
  { q: '"Paling banyak berapa kotak yang bisa dipilih sehingga tidak ada yang muat ke yang lain?"', a: 'lain', topik: '15', tk: 2,
    why: 'Itu antirantai terbesar. Menurut teorema Dilworth angkanya sama dengan jawaban soal utamanya.' },
  { q: 'Kotaknya BALOK, panjang dan lebarnya terpisah', a: 'lain', topik: '15', tk: 3,
    why: 'JEBAKAN — dua balok bisa berbeda ukuran tapi tetap tidak saling muat, misalnya 2×5 dan 5×2. Rumus kembar gugur.' },
  { q: '"Kotak boleh dimasukkan kalau sisinya lebih kecil ATAU SAMA."', a: 'lain', topik: '15', tk: 3,
    why: 'JEBAKAN — kalau ukuran sama boleh masuk, tidak ada lagi kotak yang saling menolak. Jawabannya selalu 1.' },
  { q: 'Ukuran sisinya deret Fibonacci: 2, 3, 5, 8, 13, 21, 34', a: 'lain', topik: '15', tk: 3,
    why: 'JEBAKAN — deretnya umpan. Yang menentukan cuma cacah tiap ukuran, bukan angkanya.' },
  { q: '"Ada berapa cara berbeda menyusun kotak-kotak itu?"', a: 'kombi', topik: '15', tk: 3,
    why: 'JEBAKAN — yang ditanya banyaknya susunan, bukan banyaknya tumpukan. Itu soal mencacah.' },

  /* ============ CAMPURAN & PEMBEDA ============ */
  { q: '"Minimal berapa bebek diambil supaya DIJAMIN semua warna pernah kena?"', a: 'lain', topik: '14', tk: 2,
    why: 'Kata "dijamin" menandakan asas kotak burung. Bayangkan keadaan tersial, lalu tambah satu.' },
  { q: '"Pada larik berisi N angka, selalu ada potongan berurutan yang jumlahnya habis dibagi N."', a: 'prefix', topik: 'xx', tk: 2,
    why: 'Gabungan prefix sum dan kotak burung. Ada N+1 saldo tapi cuma N sisa bagi.' },
  { q: 'for (int i = 0; i < n; i++)\n  for (int j = i+1; j < n; j++)\n    if (a[i] + a[j] == X) cnt++;', a: 'lain', topik: 'xx', tk: 2,
    why: 'Mencacah pasangan dengan dua putaran bersarang. Bukan prefix sum, bukan DP.' },
  { q: '"Berapa jumlah semua angka di papan 8 × 8?"', a: 'lain', topik: 'xx', tk: 3,
    why: 'JEBAKAN — cuma ditanya sekali, jadi tabel bantu berlebihan. Jumlahkan langsung.' },
  { q: '"Urutkan dulu, lalu ambil dari yang terkecil sampai uangnya habis."', a: 'lain', topik: 'xx', tk: 2,
    why: 'Cara serakah, dan di sini memang benar — keputusannya tidak saling melarang.' },
  { q: '"Berapa banyak jalur berbeda dari A ke H?"', a: 'kombi', topik: 'xx', tk: 3,
    why: 'JEBAKAN — mencacah jalur, bukan LCA dan bukan Euler. Jumlahkan dari titik sebelumnya.' },
  { q: '"Hubungkan semua kota dengan total biaya termurah."', a: 'graf', topik: 'xx', tk: 3,
    why: 'JEBAKAN — itu pohon rentang minimum, bukan lintasan Euler dan bukan jarak terpendek.' },
  { q: '"Jarak terpendek dari kota A ke kota B."', a: 'graf', topik: 'xx', tk: 3,
    why: 'JEBAKAN — graf dua arah tanpa atas-bawah, jadi bukan LCA. Ini pencarian jarak biasa.' },

  /* ============ DIPANEN DARI KARTU TIAP MODUL AJAR ============
     Kartu di bawah disalin apa adanya dari `kartu` milik modul ajarnya.
     Sebagian sengaja mirip dengan kartu di atas tapi kalimatnya berbeda —
     itu justru berguna, karena siswa jadi mengenali BENTUKNYA, bukan
     menghafal kalimatnya. tests/16-drill.test.mjs memastikan kategori di
     sini tidak pernah berbeda dengan kategori di modulnya. */
  { q: 'return (pndk(N-1,K)+K-1)%N+1;', a: 'josephus', topik: '01', tk: 1,
    why: 'Rekursi (f(N−1) + konstanta) % N — Josephus umum.' },
  { q: 'while(p*2<=n) p*=2;  return 2*(n-p)+1;', a: 'josephus', topik: '01', tk: 1,
    why: 'Pangkat 2 terbesar ≤ n, lalu 2(n−p)+1 = Josephus K=2.' },
  { q: '“N orang melingkar, setiap orang ke-K dikeluarkan, siapa yang tersisa?”', a: 'josephus', topik: '01', tk: 1,
    why: 'Kata pemicu: melingkar + eliminasi setiap ke-K.' },
  { q: 'erase() dalam while(size>1) dengan indeks bergeser K', a: 'josephus', topik: '01', tk: 1,
    why: 'Josephus versi simulasi langsung — tanpa rekursi, tanpa pangkat 2.' },
  { q: '“Berapa banyak bye di turnamen dengan 100 peserta?”', a: 'lain', topik: '01', tk: 1,
    why: 'Bukan Josephus penuh, tapi memakai komponen yang sama: L = n − p.' },
  { q: 'return (X%10)*(X%10) + f(X/10);', a: 'lain', topik: '02', tk: 3,
    why: 'JEBAKAN — ini jumlah KUADRAT digit, bukan digit sum.' },
  { q: '“Berapa banyak bilangan ≤ n yang koprima dengan n?”', a: 'gcd', topik: '03', tk: 1,
    why: 'Itu definisi persis fungsi totient Euler, ditulis φ(n).' },
  { q: '“Dua gayung 3 liter dan 5 liter — bebek mana yang tidak bisa dimandikan?”', a: 'lain', topik: '04', tk: 1,
    why: 'Frobenius. Tapi cek FPB dulu! Kalau tidak koprima, rumus tidak berlaku.' },
  { q: '“Berapa nugget terbanyak yang TIDAK bisa dibeli dari paket 6 dan 9?”', a: 'lain', topik: '04', tk: 3,
    why: 'JEBAKAN — FPB(6, 9) = 3, jadi tak hingga banyaknya. Rumus ab−a−b tidak berlaku.' },
  { q: '“Apa karakter ke-2025 dari string sepanjang 2²⁰²⁶?”', a: 'doubling', topik: '05', tk: 1,
    why: 'Tidak perlu bangun stringnya. Pakai trik biner, atau bangun versi terkecil yang sudah cukup panjang.' },
  { q: '“Berapa hasilnya kalau y = 666.666?”', a: 'doubling', topik: '06', tk: 1,
    why: 'Jangan ditelusuri. Cari rumus langsungnya, lalu perkecil y dengan sisa bagi.' },
  { q: '“Kegiatan B hanya bisa dilakukan kalau kegiatan A sudah selesai”', a: 'graf', topik: '08', tk: 1,
    why: 'Prasyarat = graf berarah. Kupas berlapis, atau hitung leluhurnya.' },
  { q: '“Pada urutan ke berapa paling awal kegiatan X bisa ditaruh?”', a: 'graf', topik: '08', tk: 1,
    why: 'Hitung semua leluhur X, lalu tambah 1. Jangan tertukar dengan level.' },
  { q: 'Dua huruf tergambar sejajar, jadi lapisnya dianggap sama', a: 'graf', topik: '09', tk: 3,
    why: 'JEBAKAN — tinggi di gambar bukan kedalaman. Hitung panahnya, jangan lihat posisinya.' },
  { q: '“Setiap jalan hanya dapat dilewati maksimal satu kali — minimal berapa hari?”', a: 'graf', topik: '10', tk: 1,
    why: 'Lintasan Euler. Hitung persimpangan berderajat ganjil, sebut t, lalu maks(1, t ÷ 2). Pastikan petanya nyambung.' },
  { q: 'Peta yang terpisah jadi dua bagian tidak nyambung', a: 'graf', topik: '10', tk: 1,
    why: 'Rumus ganjil/2 harus dihitung per bagian lalu dijumlah. Satu lintasan tidak akan pernah menyeberang.' },
  { q: '“Berapa banyak susunan yang mungkin?”', a: 'kombi', topik: '11', tk: 1,
    why: 'Tentukan dulu: tahapan berurutan (kalikan) atau pilihan yang saling lepas (jumlahkan)?' },
  { q: '“…yang mengandung setidaknya satu angka 7”', a: 'kombi', topik: '11', tk: 1,
    why: 'Trik komplemen: total dikurangi yang tanpa angka 7 sama sekali.' },
  { q: '“Tiap kelompok boleh mengirim wakil atau tidak, minimal satu orang ikut”', a: 'kombi', topik: '11', tk: 1,
    why: 'Trik +1 lalu −1: kalikan (ukuran + 1), lalu buang satu kemungkinan kosong.' },
  { q: '“Berapa banyak kata dari huruf penyusun BACA?”', a: 'kombi', topik: '11', tk: 1,
    why: 'Ada huruf kembar. Bagi dengan faktorial tiap huruf yang berulang.' },
  { q: '“Berapa jumlah nilai dari indeks X sampai Y?” ditanya berkali-kali', a: 'prefix', topik: '12', tk: 1,
    why: 'Prefix sum. Satu tabel bantu, lalu tiap jawaban cuma satu pengurangan.' },
  { q: '“Tambahkan 1 ke setiap posisi L sampai R”, diulang ratusan kali', a: 'prefix', topik: '12', tk: 1,
    why: 'Difference array. Tandai dua ujungnya saja, jangan isi seluruh rentangnya.' },
  { q: '“Ada berapa yang genap di antara posisi 3 sampai 9?”', a: 'prefix', topik: '12', tk: 1,
    why: 'Sama saja. Tandai 1 kalau memenuhi, 0 kalau tidak, lalu buat tabel bantu.' },
  { q: 'Lariknya berubah di tengah-tengah pertanyaan', a: 'prefix', topik: '12', tk: 3,
    why: 'JEBAKAN — tabel bantu jadi basi. Harus dibangun ulang.' },
  { q: '“Berapa total poin maksimum selama N hari?”', a: 'dp', topik: '13', tk: 1,
    why: 'Cari maksimum atas rangkaian keputusan yang saling terkait — DP.' },
  { q: 'Tiap hari ambil yang poinnya paling besar', a: 'dp', topik: '13', tk: 3,
    why: 'JEBAKAN — cara serakah meleset di soal 15 tahun 2026. Jawabnya 28, padahal 32.' },
  { q: 'Hitung tiap jenis sendiri-sendiri lalu dijumlahkan', a: 'dp', topik: '13', tk: 3,
    why: 'JEBAKAN — tiap hari cuma boleh satu agenda, jadi ketiganya berebut hari.' },
];

export default BANK;
