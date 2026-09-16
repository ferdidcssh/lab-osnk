/* ============================================================
   UJI PERILAKU GEMBOK RUMUS
   ------------------------------------------------------------
   alat.mjs sudah memeriksa bahwa rumus terkunci MASIH tertutup
   saat modul baru dibuka. Yang belum diperiksa: apakah gemboknya
   benar-benar BISA dibuka.

   Dua-duanya perlu. Kalau panggilan bukaRumus hilang, rumusnya
   akan terkunci selamanya dan pemeriksa lain tidak akan protes.

   Berkas ini menemukan sendiri modul dan tombolnya, jadi modul
   baru otomatis ikut terperiksa tanpa perlu didaftarkan.

   Cara pakai:  node tests/kunci.test.mjs
   ============================================================ */

import {
  siapkanDom, buatPencatat, bangunModul, daftarBerkasModul,
} from './alat.mjs';

siapkanDom();
const t = buatPencatat('perilaku gembok rumus');

for (const f of daftarBerkasModul()) {
  const berkas = f.replace(/\.js$/, '');
  t.bagian(berkas);

  const awal = await bangunModul(berkas);

  /* Modul berkelompok 'Latihan' memang tidak punya rumus terkunci.
     Melewatinya bukan kelonggaran — ia tidak mengajarkan rumus. */
  if (awal.mod.kelompok === 'Latihan') {
    t.info('dilewati', 'modul latihan, tidak punya rumus terkunci');
    continue;
  }

  const gembok = [...awal.badan.querySelectorAll('.lockwrap .rumus')];

  if (!gembok.length) {
    t.cek('punya rumus terkunci', false, 'tidak ada .lockwrap sama sekali');
    continue;
  }

  t.cek(`mulai dalam keadaan terkunci (${gembok.length} rumus)`,
    gembok.every((e) => e.classList.contains('locked')),
    gembok.filter((e) => !e.classList.contains('locked')).map((e) => e.id).join(', '));

  t.cek('ada pesan yang mengajak mengerjakan lab',
    [...awal.badan.querySelectorAll('.lockmsg')]
      .every((e) => /\bkamu\b/.test(e.textContent)));

  /* Cari tombol mana yang membuka gemboknya. Jangan batasi ke dalam .lab:
     Modul 01 membukanya dari tombol "Isi tabel otomatis" yang duduk di
     sebuah kartu, bukan di dalam lab. Tombol tab dilewati karena cuma
     berpindah panel. Modul dibangun ulang tiap percobaan supaya klik
     sebelumnya tidak ikut terbawa. */
  const tombolLab = [...awal.badan.querySelectorAll('button')]
    .filter((b) => !b.classList.contains('tab') && b.id)
    .map((b) => b.id.replace(awal.ids.awalan, ''));

  let pembuka = null;
  for (const nama of tombolLab) {
    const c = await bangunModul(berkas);
    c.klik(nama);
    const masih = [...c.badan.querySelectorAll('.lockwrap .rumus')];
    if (masih.some((e) => !e.classList.contains('locked'))) { pembuka = nama; break; }
  }

  t.cek('ada tombol lab yang membuka gemboknya', pembuka !== null,
    `dicoba ${tombolLab.length} tombol, tidak ada yang membuka`);

  if (!pembuka) continue;
  t.info('tombol pembukanya', pembuka);

  const c = await bangunModul(berkas);
  c.klik(pembuka);
  const rumus = [...c.badan.querySelectorAll('.lockwrap .rumus')]
    .find((e) => !e.classList.contains('locked'));
  t.cek('rumusnya diberi tanda "reveal" untuk animasinya',
    rumus.classList.contains('reveal'));

  const pesan = c.badan.querySelector('#' + rumus.id + '-pesan');
  t.cek('pesan ajakannya disembunyikan setelah terbuka',
    pesan && pesan.style.display === 'none');

  t.cek('labnya tetap menghasilkan keluaran',
    [...c.badan.querySelectorAll('.out')]
      .some((e) => e.textContent.trim().length > 12));

  t.cek('lencana ✅ ada di dalam kotak rumusnya', /✅/.test(rumus.textContent));
}

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
