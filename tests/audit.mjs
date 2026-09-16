/* ============================================================
   AUDIT LAPIS 2 & 3
   ------------------------------------------------------------
   Berkas ini sebelumnya TIDAK ADA. Akibatnya tests/klaim.mjs
   yatim: seluruh angka yang terdaftar di sana tidak pernah
   diperiksa siapa pun.

   LAPIS 2 — tiap angka yang dikutip modul DIHITUNG ULANG dari
   math.js, lalu dipastikan benar-benar muncul di teks modul.
   LAPIS 3 — tiap modul wajib punya minimal satu catatan `awas`
   yang menyebut kapan rumusnya tidak berlaku.

   Teks modul yang diperiksa = keadaan awal DITAMBAH keadaan
   setelah tiap tombol ditekan, karena siswa memang bisa menekan
   semuanya. Kotak "Bedah soal" baru terisi setelah ditekan.

   SATU HAL YANG SENGAJA DIBUAT BEDA dari uraian PANDUAN-AUDIT §4:
   kalau jangkar `dekat` TIDAK KETEMU, di sini klaimnya GAGAL,
   bukan lolos diam-diam. Jangkar yang lenyap justru tanda
   modulnya berubah — itu harus berisik, bukan hijau.

   Angka SATU DIGIT tidak boleh didaftarkan di klaim.mjs. Digit
   tunggal hampir selalu muncul juga di "2024", "soal 9", atau
   nomor daftar, jadi klaimnya tidak bisa gagal. Auditor ini
   menolaknya dan menyuruh memindahkannya ke berkas uji modul
   dengan pencocokan tepat.

   Jalankan:  node tests/audit.mjs            semua modul
              node tests/audit.mjs 03-gcd     satu modul
   ============================================================ */

import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { siapkanDom, bangunModul } from './alat.mjs';
import { KLAIM } from './klaim.mjs';
import { M } from '../js/core/math.js';

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEBAR = 160;          /* lebar jendela di kiri dan kanan jangkar */

const pinta = process.argv[2];
const angkaId = (v) => Number(v).toLocaleString('id-ID');

let lolos = 0, gagal = 0;
const rusak = [];
const khusus = [];
const dicatat = [];

function nilaiKlaim(k) {
  const v = k.hitung(M);
  if (k.format === 'teks') return String(v);
  if (typeof v === 'bigint') return angkaId(Number(v));
  return typeof v === 'number' ? angkaId(v) : String(v);
}

/* Teks modul dalam semua keadaan yang bisa dicapai siswa. */
function teksSemuaKeadaan(ctx) {
  const bagian = [ctx.badan.textContent];
  for (const b of [...ctx.panel.querySelectorAll('button')]) {
    try { b.click(); } catch (e) { /* tombol yang meledak diurus semua.mjs */ }
    bagian.push(ctx.badan.textContent);
  }
  return bagian.join('\n\u0000\n');
}

function periksaKlaim(modul, teks, k) {
  const s = nilaiKlaim(k);
  const nama = `${modul} · ${k.apa}`;

  /* angka satu digit tidak bisa dijaga lapis ini */
  if (/^\d$/.test(s)) {
    gagal++;
    rusak.push(`${nama}  — angka satu digit (${s}); pindahkan ke tests/${modul}.test.mjs`);
    return;
  }

  let jendela;
  if (!k.dekat) {
    jendela = [teks];
  } else {
    const m = [...teks.matchAll(new RegExp(k.dekat, 'g'))];
    if (!m.length) {
      if (k.opsional) { dicatat.push(`${nama} — jangkar tidak ada (opsional)`); return; }
      gagal++;
      rusak.push(`${nama}  — jangkar "${k.dekat}" TIDAK KETEMU di modul`);
      return;
    }
    jendela = m.map((x) => teks.slice(Math.max(0, x.index - LEBAR), x.index + x[0].length + LEBAR));
  }

  const cocok = k.semua ? jendela.every((j) => j.includes(s)) : jendela.some((j) => j.includes(s));
  if (cocok) {
    lolos++;
  } else if (k.opsional) {
    dicatat.push(`${nama} — tidak dikutip modul (opsional), nilainya ${s}`);
  } else {
    gagal++;
    rusak.push(`${nama}  — nilainya ${s}, tidak ada di ${k.semua ? 'SETIAP' : ''} jendela `
      + `"${k.dekat || '(seluruh modul)'}" (${jendela.length} jendela)`);
  }
  if (k.khusus) khusus.push(`${modul} · ${k.apa} = ${s}`);
}

/* ============================================================
   JALANKAN
   ============================================================ */
siapkanDom();

const kunci = Object.keys(KLAIM)
  .filter((m) => !pinta || m === pinta)
  .filter((m) => {
    const ada = existsSync(join(AKAR, 'js/modules', m + '.js'));
    if (!ada) dicatat.push(`${m} — berkas modulnya tidak ada, dilewati`);
    return ada;
  });

if (pinta && !kunci.length) {
  console.log(`Modul "${pinta}" tidak punya klaim atau berkasnya tidak ada.`);
  process.exit(1);
}

for (const modul of kunci) {
  console.log(`\n=== ${modul} ===`);
  const ctx = await bangunModul(modul);
  if (ctx.galat.length) {
    gagal++;
    rusak.push(`${modul} — meledak saat dibangun: ${ctx.galat.map((e) => e.message).join(' | ')}`);
    continue;
  }
  const teks = teksSemuaKeadaan(ctx);

  /* --- lapis 2 --- */
  const daftar = KLAIM[modul];
  daftar.forEach((k) => periksaKlaim(modul, teks, k));
  console.log(`  lapis 2 · ${daftar.length} klaim diperiksa`);

  /* --- lapis 3 --- */
  const awas = ctx.badan.querySelectorAll('.note.warn');
  if (awas.length) {
    lolos++;
    console.log(`  lapis 3 · ${awas.length} catatan "awas"`);
  } else {
    gagal++;
    rusak.push(`${modul} — TIDAK ADA catatan "awas": trik tanpa syarat gugur itu jebakan`);
  }
}

console.log('\n' + '='.repeat(58));
console.log(`LAPIS 2 & 3: ${lolos} LOLOS, ${gagal} GAGAL`);
if (rusak.length) { console.log('\nYANG RUSAK:'); rusak.forEach((r) => console.log('  ✗ ' + r)); }
if (dicatat.length) { console.log('\nDICATAT:'); dicatat.forEach((r) => console.log('  · ' + r)); }

if (khusus.length) {
  console.log('\n' + '-'.repeat(58));
  console.log('ANGKA YANG HANYA BERLAKU UNTUK SOAL ITU — periksa manual:');
  console.log('  modulnya harus menulis "di pohon ini" atau "untuk soal 2024"');
  console.log('  di dekat angka ini, supaya siswa tidak menghafalnya sebagai patokan.');
  khusus.forEach((r) => console.log('  · ' + r));
}
process.exitCode = gagal ? 1 : 0;
