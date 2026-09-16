/* ============================================================
   DAFTAR MODUL
   ------------------------------------------------------------
   Ini SATU-SATUNYA tempat yang perlu disunting untuk menambah
   modul baru. Isinya sengaja hanya keterangan ringan — kode
   modulnya sendiri baru diunduh saat siswa membukanya.
   ============================================================ */

export const KELOMPOK = ['Teori Bilangan', 'Rekursi', 'Graf', 'Hitungan', 'Latihan'];

export const MODUL = [
  { id: 'josephus',  berkas: '01-josephus',  n: '01', kelompok: 'Teori Bilangan' },
  { id: 'digitsum',  berkas: '02-digit-sum', n: '02', kelompok: 'Teori Bilangan' },
  { id: 'gcd',       berkas: '03-gcd',       n: '03', kelompok: 'Teori Bilangan' },
  { id: 'frobenius', berkas: '04-frobenius', n: '04', kelompok: 'Teori Bilangan' },
  { id: 'doubling',  berkas: '05-doubling',  n: '05', kelompok: 'Rekursi' },
  { id: 'mai',       berkas: '06-mai',       n: '06', kelompok: 'Rekursi' },
  { id: 'tiga',      berkas: '07-tiga',      n: '07', kelompok: 'Rekursi' },
  { id: 'toposort',  berkas: '08-toposort',  n: '08', kelompok: 'Graf' },
  { id: 'lca',       berkas: '09-lca',       n: '09', kelompok: 'Graf' },
  { id: 'euler',     berkas: '10-euler',     n: '10', kelompok: 'Graf' },
  { id: 'kombi',     berkas: '11-kombinatorika', n: '11', kelompok: 'Hitungan' },
  { id: 'prefix',    berkas: '12-prefix-sum', n: '12', kelompok: 'Hitungan' },
  { id: 'dp',        berkas: '13-dp',        n: '13', kelompok: 'Hitungan' },
  { id: 'pigeon',    berkas: '14-pigeonhole', n: '14', kelompok: 'Hitungan' },
  { id: 'kotak',     berkas: '15-kotak-bersarang', n: '15', kelompok: 'Hitungan' },
  { id: 'flash',     berkas: '16-drill',     n: '16', kelompok: 'Latihan' },
  { id: 'kamus',     berkas: '17-kamus',     n: '17', kelompok: 'Latihan' },
];

const cache = new Map();

/** Unduh dan simpan modul. Hanya terjadi sekali per modul. */
export async function muatModul(id) {
  if (cache.has(id)) return cache.get(id);
  const rec = MODUL.find((m) => m.id === id);
  if (!rec) throw new Error('Modul tidak dikenal: ' + id);
  const mod = (await import(`../modules/${rec.berkas}.js`)).default;
  cache.set(id, mod);
  return mod;
}

/** Muat SEMUA modul. Dipakai oleh Drill dan Kamus yang perlu
    mengumpulkan kartu & kata kunci dari seluruh materi. */
export async function muatSemua() {
  return Promise.all(MODUL.map((m) => muatModul(m.id)));
}

export default { MODUL, KELOMPOK, muatModul, muatSemua };
