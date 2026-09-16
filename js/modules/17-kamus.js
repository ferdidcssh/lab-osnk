/* ============================================================
   MODUL 17 — KAMUS KATA KUNCI
   Bank entrinya ada di js/core/kamus.js, dipanen dari `kamus` milik
   tiap modul ajar lalu ditambah entri pembeda.

   BENTUK TAMPILAN: daftar modul yang bisa dibuka satu per satu.
   Versi sebelumnya menampilkan 73 baris sekaligus dalam satu tabel
   berkolom empat — lengkap, tapi melelahkan dibaca dan tidak jelas
   harus mulai dari mana. Sekarang siswa membuka satu modul, membaca
   kata kuncinya, lalu membaca jebakannya.
   ============================================================ */

import { ENTRI, JUDUL } from '../core/kamus.js';
import { Kartu, Kontrol, Keluaran, Wadah, Catatan, hijau, merah, redup } from '../core/ui.js';

const lolos = (t) => String(t).replace(/[&<>]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function sorot(teks, cari) {
  const aman = lolos(teks);
  if (!cari) return aman;
  const i = aman.toLowerCase().indexOf(cari.toLowerCase());
  if (i < 0) return aman;
  return aman.slice(0, i) + '<mark>' + aman.slice(i, i + cari.length) + '</mark>'
    + aman.slice(i + cari.length);
}

export default {
  id: 'kamus', n: '17', kelompok: 'Latihan',
  judul: 'Kamus Kata Kunci',
  lede: 'Satu daftar modul. Buka satu, dan kamu melihat frasa apa saja yang menandainya di naskah soal — lalu frasa mana yang justru menjebak, terlihat seperti apa, dan sebenarnya soal apa.',
  lencana: ['<span class="chip">Referensi</span>',
            `<span class="chip v">${ENTRI.length} entri</span>`],
  entri: ENTRI,

  bangun(root, { ids, pasangTab }) {
    let cari = '', buka = new Set(), sembunyi = false;

    /* kelompokkan entri menurut modulnya, urut nomor, yang tanpa modul di akhir */
    const kelompok = [];
    Object.keys(JUDUL).sort().forEach((n) => {
      const isi = ENTRI.filter((e) => e.n === n);
      if (isi.length) kelompok.push({ n, judul: JUDUL[n], isi });
    });
    const tanpa = ENTRI.filter((e) => !e.n);
    if (tanpa.length) kelompok.push({ n: null, judul: 'Belum ada modulnya di lab ini', isi: tanpa });

    root.innerHTML = [
      Kartu({
        judul: 'Untuk apa kamus ini',
        isi:
          `<p style="margin:10px 0">Di ruang ujian, waktumu habis bukan saat menghitung, melainkan saat kamu memutuskan <b>alat mana yang harus dipakai</b>. Kamus ini memetakan frasa di naskah soal ke alat yang ditandainya.</p>
           <p style="margin:10px 0">Tiap modul punya dua daftar. Yang pertama <b>kata kunci biasa</b> — frasa yang memang menandakan modul itu. Yang kedua <b>jebakan</b>: frasa yang terlihat seperti modul itu, padahal alatnya lain. Untuk tiap jebakan kamu bisa melihat ia menyerupai apa, dan sebenarnya soal apa.</p>
           <p style="margin:10px 0">Kamu tidak perlu menghafal semuanya. Yang perlu kamu latih cuma satu: mengenali bentuknya dalam hitungan detik.</p>
           <p style="margin:10px 0">Dari ${ENTRI.length} entri, ${ENTRI.filter((e) => e.jebakan).length} di antaranya jebakan. Di situlah nilai ujianmu biasanya hilang, dan di situ pula kamu paling banyak bisa memperbaiki diri.</p>` +
          Catatan({
            jenis: 'baik',
            isi: `<b>Cara memakainya.</b> Buka satu modul sehari, jangan semuanya sekaligus. Baca kata kuncinya dulu sampai terasa akrab bagi kamu, baru baca jebakannya.
              <br><br>Kalau sudah lancar, tekan <b>Sembunyikan jawaban</b>. Kamu akan melihat frasanya saja, dan harus menyebut sendiri alat apa yang ditandainya. Itu yang benar-benar melatih refleksmu.
              <br><br>Kalau kamu menemukan frasa asing di soal latihan, catat sendiri lalu cocokkan dengan daftar ini. Kamu akan tahu kamus ini sudah cukup ketika kamu bisa menyebut alatnya sebelum selesai membaca frasanya.`,
          }),
      }),

      Kartu({
        judul: 'Cari',
        isi:
          `<div class="ctl">
            <div class="f wide"><label for="${ids.i('cari')}">cari frasa atau topik</label>
              <input id="${ids.i('cari')}" type="text" placeholder="misalnya: melingkar, dijamin, rentang, kubus"></div>
          </div>
          <div class="ctl">
            <button class="btn alt" id="${ids.i('semua')}">Buka semua</button>
            <button class="btn alt" id="${ids.i('tutup')}">Tutup semua</button>
            <button class="btn" id="${ids.i('sembunyi')}">Sembunyikan jawaban</button>
          </div>` +
          Keluaran({ ids, id: 'ringkas', isi: 'Pilih satu modul di bawah untuk membukanya.' }),
      }),

      Kartu({ judul: 'Daftar modul', isi: Wadah({ ids, id: 'daftar' }) }),

      Catatan({
        jenis: 'awas',
        isi: `<b>Kamus ini memberitahu ARAH, bukan JAWABAN.</b> Mengenali topiknya baru langkah pertama, dan langkah itu saja tidak pernah cukup untuk kamu.
          <br><br>Tiap modul punya syarat yang membuat alatnya gugur. Rumus Euler gugur kalau jalannya satu arah. Prefix sum gugur kalau lariknya berubah. Trik dua terbesar gugur kalau masa jedanya berbeda-beda.
          <br><br>Jadi setelah kamu menemukan barisnya di sini, bukalah modulnya dan baca bagian <b>"Kapan ini BUKAN"</b>. Baris di kamus ini menunjuk pintunya; syarat yang menentukan nilaimu ada di dalam.`,
      }),
    ].join('');

    /* ---------- satu baris entri biasa ---------- */
    const barisBiasa = (e, q) => `
      <div style="padding:8px 0;border-bottom:1px solid var(--garis)">
        <div style="font-family:var(--mono);font-size:13px">${sorot(e.kata, q)}</div>
        <div style="font-size:12.5px;color:var(--tinta-2);margin-top:3px">
          ${sembunyi ? redup('· · · · · · · · · ·') : '→ ' + sorot(e.topik, q)}</div>
      </div>`;

    /* ---------- satu baris jebakan ---------- */
    const barisJebakan = (e, q) => `
      <div style="padding:9px 10px;margin:7px 0;border-left:3px solid var(--merah);
        background:var(--stabilo);border-radius:0 5px 5px 0">
        <div style="font-family:var(--mono);font-size:13px;font-weight:600">${sorot(e.kata, q)}</div>
        ${sembunyi ? `<div style="font-size:12.5px;margin-top:4px">${redup('· · · · · · · · · ·')}</div>` : `
        ${e.tertukar ? `<div style="font-size:12.5px;margin-top:4px">
          <b>Terlihat seperti:</b> ${sorot(e.tertukar, q)}</div>` : ''}
        <div style="font-size:12.5px;margin-top:2px">
          <b>Sebenarnya:</b> ${sorot(e.topik, q)}</div>`}
      </div>`;

    /* ---------- menggambar daftar ---------- */
    const gambar = () => {
      const q = cari.trim().toLowerCase();
      const cocokEntri = (e) => !q || [e.kata, e.topik, e.tertukar || '']
        .join(' ').toLowerCase().includes(q);

      let totalCocok = 0;
      const html = kelompok.map((k) => {
        const isi = k.isi.filter(cocokEntri);
        if (q && !isi.length) return '';
        totalCocok += isi.length;
        const biasa = isi.filter((e) => !e.jebakan);
        const jebakan = isi.filter((e) => e.jebakan);
        const terbuka = buka.has(k.n) || (q && isi.length);

        const kepala = `
          <button class="btn alt" data-buka="${k.n === null ? 'x' : k.n}"
            style="display:flex;width:100%;justify-content:space-between;align-items:center;
            text-align:left;padding:10px 12px;font-size:13.5px">
            <span><b>${terbuka ? '▾' : '▸'} ${k.n ? k.n + ' · ' : ''}${lolos(k.judul)}</b></span>
            <span style="font-family:var(--mono);font-size:11.5px;color:var(--tinta-3)">
              ${biasa.length} kata kunci${jebakan.length ? ' · ' + jebakan.length + ' jebakan' : ''}</span>
          </button>`;

        if (!terbuka) return `<div style="margin-bottom:6px">${kepala}</div>`;

        return `<div style="margin-bottom:6px">${kepala}
          <div style="padding:10px 12px 14px;border:1.5px solid var(--garis-tebal);
            border-top:none;border-radius:0 0 6px 6px">
            ${biasa.length ? `<div style="font-size:11.5px;font-weight:700;
              color:var(--tinta-3);letter-spacing:.04em;margin-bottom:2px">KATA KUNCI</div>
              ${biasa.map((e) => barisBiasa(e, q)).join('')}` : ''}
            ${jebakan.length ? `<div style="font-size:11.5px;font-weight:700;
              color:var(--merah);letter-spacing:.04em;margin:14px 0 2px">JEBAKAN — ${jebakan.length} frasa</div>
              ${jebakan.map((e) => barisJebakan(e, q)).join('')}` : ''}
          </div></div>`;
      }).join('');

      ids.q('daftar').innerHTML = html
        || `<div class="out">${merah('Tidak ada yang cocok.')} Coba kata yang lebih pendek.</div>`;

      ids.tulis('ringkas', q
        ? `${totalCocok} entri cocok dengan “${lolos(cari.trim())}”. Modul yang memuatnya terbuka otomatis.`
        : `${ENTRI.length} entri di ${kelompok.length} modul. ${buka.size ? buka.size + ' modul terbuka.' : 'Tekan judul modul untuk membukanya.'}${
            sembunyi ? '\n' + redup('Jawaban disembunyikan — sebutkan sendiri alatnya sebelum membukanya lagi.') : ''}`);

      ids.qa('[data-buka]').forEach((b) => {
        b.onclick = () => {
          const k = b.dataset.buka === 'x' ? null : b.dataset.buka;
          if (buka.has(k)) buka.delete(k); else buka.add(k);
          gambar();
        };
      });
    };

    /* ---------- perilaku ---------- */
    const kotak = ids.q('cari');
    if (kotak) kotak.oninput = () => { cari = kotak.value; gambar(); };
    ids.klik('semua', () => { kelompok.forEach((k) => buka.add(k.n)); gambar(); });
    ids.klik('tutup', () => { buka.clear(); gambar(); });
    ids.klik('sembunyi', () => {
      sembunyi = !sembunyi;
      const b = ids.q('sembunyi');
      if (b) b.textContent = sembunyi ? 'Tampilkan jawaban' : 'Sembunyikan jawaban';
      gambar();
    });

    gambar();
  },
};
