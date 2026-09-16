/* ============================================================
   PENYIMPANAN PROGRES
   ------------------------------------------------------------
   Lapisan ini sengaja dipisah supaya nanti bisa disambungkan ke
   database tanpa menyentuh satu pun modul materi.

   Sekarang  : tersimpan di perangkat siswa (localStorage).
   Nanti     : tinggal isi `penyediaAwan` di bawah, sisanya jalan
               sendiri. Aplikasi TETAP berfungsi penuh tanpa akun.
   ============================================================ */

const KUNCI = 'osnk2027:progres';

/* Diisi belakangan kalau fitur akun jadi dipakai.
   Bentuknya: { async muat(), async simpan(data) } */
let penyediaAwan = null;

export function pasangPenyediaAwan(p) { penyediaAwan = p; }

let cache = null;
const pendengar = new Set();

/** Daftarkan fungsi yang dipanggil setiap progres berubah. */
export function saatBerubah(fn) { pendengar.add(fn); return () => pendengar.delete(fn); }
const beritahu = () => pendengar.forEach((f) => { try { f(cache); } catch (e) { /* abaikan */ } });

function bacaLokal() {
  try {
    const t = localStorage.getItem(KUNCI);
    return t ? JSON.parse(t) : {};
  } catch (e) { return {}; }
}
function tulisLokal(d) {
  try { localStorage.setItem(KUNCI, JSON.stringify(d)); } catch (e) { /* mode privat */ }
}

/** Muat progres. Panggil sekali saat aplikasi mulai. */
export async function muat() {
  cache = bacaLokal();
  if (penyediaAwan) {
    try {
      const awan = await penyediaAwan.muat();
      if (awan) { cache = { ...cache, ...awan }; tulisLokal(cache); }
    } catch (e) { /* offline: pakai yang lokal saja */ }
  }
  beritahu();
  return cache;
}

export function semua() { return cache || (cache = bacaLokal()); }

export function ambil(kunci, bawaan = null) {
  const d = semua();
  return kunci in d ? d[kunci] : bawaan;
}

export async function setel(kunci, nilai) {
  const d = semua();
  d[kunci] = nilai;
  tulisLokal(d);
  beritahu();
  if (penyediaAwan) {
    try { await penyediaAwan.simpan({ [kunci]: nilai }); } catch (e) { /* nanti disinkronkan */ }
  }
}

export async function hapusSemua() {
  cache = {};
  tulisLokal(cache);
  beritahu();
}

/* ---------- Pembantu khusus progres modul ---------- */
export const modulSelesai = (id) => !!ambil('modul:' + id, false);
export const tandaiModul = (id, selesai) => setel('modul:' + id, !!selesai);

/* ---------- Pembantu untuk statistik drill ----------
   Disimpan per modul supaya nanti bisa jadi papan pantau guru. */
export function catatDrill(modulId, { benar, total, jenisSalah = [] }) {
  const k = 'drill:' + modulId;
  const lama = ambil(k, { sesi: 0, benar: 0, total: 0, salah: {} });
  lama.sesi += 1;
  lama.benar += benar;
  lama.total += total;
  jenisSalah.forEach((j) => { lama.salah[j] = (lama.salah[j] || 0) + 1; });
  lama.terakhir = new Date().toISOString();
  return setel(k, lama);
}

export default {
  muat, semua, ambil, setel, hapusSemua, saatBerubah,
  modulSelesai, tandaiModul, catatDrill, pasangPenyediaAwan,
};
