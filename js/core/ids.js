/* ============================================================
   PENAMAAN ID OTOMATIS
   ------------------------------------------------------------
   Masalah yang dipecahkan: dulu modul Digit Sum dan modul DP
   sama-sama memakai id "ddgo" sehingga bentrok. Dengan helper
   ini setiap id otomatis diberi awalan nama modul, jadi
   tabrakan menjadi MUSTAHIL secara struktur — bukan sekadar
   diawasi manual.

   Contoh: di modul "josephus", ids.i('go') menghasilkan
           "josephus-go".
   ============================================================ */

export function buatIds(modulId, root) {
  const awalan = modulId + '-';

  /** Ubah nama pendek jadi id lengkap. Dipakai saat menulis HTML. */
  const i = (nama) => awalan + nama;

  /** Ambil elemen berdasarkan nama pendek, dicari HANYA di dalam modul ini. */
  const q = (nama) => root.querySelector('#' + awalan + nama);

  /** Ambil semua elemen yang cocok, di dalam modul ini saja. */
  const qa = (pemilih) => root.querySelectorAll(pemilih);

  /** Baca nilai input sebagai bilangan bulat, dengan batas bawah/atas opsional. */
  const n = (nama, { min = -Infinity, maks = Infinity, bawaan = null } = {}) => {
    const el = q(nama);
    if (!el) return bawaan;
    const v = parseInt(el.value, 10);
    if (isNaN(v)) return bawaan;
    return Math.min(maks, Math.max(min, v));
  };

  /** Baca nilai input sebagai teks apa adanya. */
  const s = (nama) => {
    const el = q(nama);
    return el ? el.value : '';
  };

  /** Isi kotak keluaran dengan HTML. */
  const tulis = (nama, html) => {
    const el = q(nama);
    if (el) el.innerHTML = html;
  };

  /** Pasang penangan klik pada tombol. */
  const klik = (nama, fn) => {
    const el = q(nama);
    if (el) el.onclick = fn;
    return el;
  };

  /** Pasang penangan pada input saat diketik. */
  const ketik = (nama, fn) => {
    const el = q(nama);
    if (el) el.oninput = fn;
    return el;
  };

  return { i, q, qa, n, s, tulis, klik, ketik, awalan };
}

export default buatIds;
