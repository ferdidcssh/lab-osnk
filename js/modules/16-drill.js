/* ============================================================
   MODUL 16 — DRILL PENGENALAN POLA
   Bank kartunya ada di js/core/kartu.js, dan tiap angka di dalamnya
   dihitung ulang oleh tests/adu16.mjs. Kartu tiap modul ajar juga
   diperiksa supaya tidak berbeda dengan bank ini.

   Catatan perbaikan: versi lama membiarkan setInterval hidup setelah
   siswa pindah modul. Sekarang tiap detak memeriksa apakah panelnya
   masih terpasang, dan mati sendiri kalau tidak.
   ============================================================ */

import { BANK, LABEL, TOPIK, KATEGORI } from '../core/kartu.js';
import { Kartu, Kontrol, Keluaran, Wadah, Catatan, Tabel, hijau, merah, redup } from '../core/ui.js';

const acakUrut = (a) => {
  const s = a.slice();
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
};

export default {
  id: 'flash', n: '16', kelompok: 'Latihan',
  judul: 'Drill Pengenalan Pola',
  lede: 'Lihat potongan kode atau kutipan soal, lalu tebak topiknya sebelum waktunya habis. Sepertiga kartunya sengaja menjebak — di situlah nilai ujian biasanya hilang.',
  lencana: ['<span class="chip">Berwaktu</span>',
            `<span class="chip v">${BANK.length} kartu terverifikasi</span>`],
  bank: BANK,

  bangun(root, { ids, pasangTab, panel }) {
    const daftarTopik = [...new Set(BANK.map((k) => k.topik))].sort();

    root.innerHTML = [
      Kartu({
        judul: 'Untuk apa drill ini',
        isi:
          `<p style="margin:10px 0">Di ruang ujian, hal pertama yang harus kamu putuskan bukan jawabannya — melainkan <b>topiknya</b>. Salah menebak topik berarti kamu mengerjakan soal dengan rumus yang salah, dan itu tidak bisa diselamatkan seberapa pun telitinya hitunganmu.</p>
           <p style="margin:10px 0">Bank soalnya berisi ${BANK.length} kartu terverifikasi, dari ketiga belas modul yang sudah kamu pelajari.</p>
           <p style="margin:10px 0">Latihan ini melatih satu hal saja: mengenali bentuk soal dalam hitungan detik, <b>tanpa</b> menghitung apa pun. Kamu tidak perlu tahu jawabannya. Kamu cuma perlu tahu alat mana yang harus diambil.</p>` +
          Catatan({
            jenis: 'baik',
            isi: `<b>Cara memakainya.</b> Mulailah dari satu topik saja, sampai kamu benar semua. Baru setelah itu pilih Campuran.
              <br><br>Kalau kamu sudah lancar, naikkan ke tingkat <b>jebakan</b>. Kartu-kartu itu sengaja mirip dengan topik lain, dan justru itu yang paling sering muncul di OSN-K.
              <br><br>Kartu yang kamu jawab salah akan diulang di akhir putaran. Ulangi sampai bersih.`,
          }),
      }),

      Kartu({
        judul: 'Atur latihannya',
        isi: Kontrol({
          ids,
          kolom: [{ id: 'detik', label: 'waktu per kartu (detik)', nilai: 15, min: 3, maks: 60 }],
          tombol: [],
        }) +
          `<div class="ctl">
            <div class="f wide"><label for="${ids.i('topik')}">topik</label>
              <select id="${ids.i('topik')}" style="padding:7px;border:1.5px solid var(--garis-tebal);border-radius:6px">
                <option value="">Semua topik</option>
                ${daftarTopik.map((t) => `<option value="${t}">${t === 'xx' ? 'Campuran &amp; pembeda' : t + ' · ' + TOPIK[t]}</option>`).join('')}
              </select></div>
            <div class="f wide"><label for="${ids.i('tk')}">tingkat</label>
              <select id="${ids.i('tk')}" style="padding:7px;border:1.5px solid var(--garis-tebal);border-radius:6px">
                <option value="">Semua tingkat</option>
                <option value="1">1 · mudah</option>
                <option value="2">2 · sedang</option>
                <option value="3">3 · jebakan saja</option>
              </select></div>
          </div>
          <div class="ctl">
            <button class="btn" id="${ids.i('mulai')}">Mulai drill</button>
            <button class="btn alt" id="${ids.i('lewat')}">Lewati kartu</button>
            <button class="btn alt" id="${ids.i('henti')}">Berhenti</button>
          </div>` +
          Keluaran({ ids, id: 'siap', isi: 'Pilih topik dan tingkatnya, lalu tekan “Mulai drill”.' }),
      }),

      Kartu({
        judul: 'Kartu',
        isi:
          `<div class="timer" id="${ids.i('waktu')}" style="font-family:var(--mono);font-size:30px;
            font-weight:700;text-align:center;color:var(--tinta-2)">—</div>` +
          Wadah({ ids, id: 'soal', gaya: 'margin:14px 0' }) +
          Wadah({ ids, id: 'tombol', gaya: 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:12px 0' }) +
          Wadah({ ids, id: 'alasan', gaya: 'margin-top:12px' }) +
          Keluaran({ ids, id: 'skor', isi: 'Belum ada kartu yang dikerjakan.' }),
      }),

      Kartu({
        judul: 'Rapor per topik',
        sub: 'Muncul setelah satu putaran selesai. Pakai ini untuk memilih modul mana yang perlu diulang.',
        isi: Wadah({ ids, id: 'rapor' }) +
          Keluaran({ ids, id: 'rapornya', isi: 'Selesaikan satu putaran dulu.' }),
      }),

      Catatan({
        jenis: 'awas',
        isi: `<b>Menebak topiknya benar TIDAK berarti jawabanmu benar.</b> Drill ini cuma melatih langkah pertama.
          <br><br>Sepertiga kartunya sengaja menjebak, dan hampir semuanya jebakan yang sama bentuknya: soal terlihat seperti topik yang kamu kenal, tapi satu kata di naskahnya mengubah alatnya. "Setidaknya sekali" bukan "maksimal sekali". "Persimpangan" bukan "jalan". "Jabatan berbeda" bukan "sekadar dipilih".
          <br><br>Jadi jangan berhenti di tebakan. Setelah topiknya ketemu, baca ulang naskahnya sekali lagi dan cari kata yang bisa mematahkan alat pilihanmu.`,
      }),

      Catatan({
        isi: `<b>Setelah kamu bisa menebak topiknya, apa langkah berikutnya?</b> Bukan langsung menghitung.
          <br><br>Ambil kasus terkecil yang bisa kamu kerjakan dengan tangan, lalu cocokkan dengan rumus yang kamu pilih. Kalau cocok, baru kerjakan angka aslinya. Pemeriksaan itu memakan sepuluh detik dan menyelamatkan seluruh nomor.`,
      }),
    ].join('');

    /* ---------- keadaan ---------- */
    let urutan = [], ke = 0, benar = 0, salah = 0;
    let sisa = 0, detak = null, tunda = null, jalan = false;
    let ulangi = [], perTopik = {};

    const hidup = () => !!ids.q('waktu') && document.contains(ids.q('waktu'));
    const stop = () => {
      if (detak) { clearInterval(detak); detak = null; }
      if (tunda) { clearTimeout(tunda); tunda = null; }
    };

    /* ---------- tombol jawaban ---------- */
    const wadahTombol = ids.q('tombol');
    KATEGORI.forEach((k) => {
      const b = document.createElement('button');
      b.className = 'btn alt';
      b.textContent = LABEL[k];
      b.onclick = () => jawab(k);
      wadahTombol.appendChild(b);
    });

    const tulisSkor = () => {
      ids.tulis('skor', jalan || ke > 0
        ? `Benar ${hijau(benar)} · Salah ${merah(salah)} · Kartu ${Math.min(ke, urutan.length)} dari ${urutan.length}`
          + (ulangi.length ? `\n${redup('Menunggu diulang: ' + ulangi.length + ' kartu')}` : '')
        : 'Belum ada kartu yang dikerjakan.');
    };

    const gambarSoal = (teks, tingkat) => {
      ids.q('soal').innerHTML =
        `<div class="rumus" style="min-height:72px;display:flex;align-items:center">
          <span class="lbl">tingkat ${tingkat}${tingkat === 3 ? ' · jebakan' : ''}</span>
          <pre style="margin:0;white-space:pre-wrap;font-family:var(--mono);font-size:14px">${
            String(teks).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</pre>
        </div>`;
    };

    const rapor = () => {
      const baris = Object.keys(perTopik).sort().map((t) => {
        const p = perTopik[t];
        const persen = Math.round(p.benar * 100 / p.total);
        return [`${t} · ${TOPIK[t] || t}`, `${p.benar} / ${p.total}`,
          persen >= 80 ? hijau(persen + '%') : merah(persen + '%')];
      });
      ids.q('rapor').innerHTML = baris.length
        ? Tabel({ kiri: true, kepala: ['Topik', 'Benar', 'Nilai'], baris })
        : '';
      const lemah = Object.keys(perTopik).filter((t) => perTopik[t].benar * 100 / perTopik[t].total < 80);
      ids.tulis('rapornya', lemah.length
        ? `${merah('Ulangi modul ini dulu:')} ${lemah.map((t) => (TOPIK[t] || t)).join(', ')}`
        : hijau('Semua topik di atas 80%. Naikkan ke tingkat jebakan.'));
    };

    /* ---------- jalannya drill ---------- */
    const detakSekali = () => {
      if (!hidup()) { stop(); return; }          // panelnya sudah diganti
      sisa--;
      ids.q('waktu').textContent = sisa;
      ids.q('waktu').style.color = sisa <= 5 ? 'var(--merah)' : 'var(--tinta-2)';
      if (sisa <= 0) { stop(); jawab(null); }
    };

    const berikutnya = () => {
      stop();
      ids.q('alasan').innerHTML = '';
      if (ke >= urutan.length) {
        if (ulangi.length) {
          const lagi = ulangi.slice();
          ulangi = [];
          urutan = urutan.concat(lagi);
          ids.q('alasan').innerHTML = Catatan({
            isi: `<b>Putaran ulang.</b> ${lagi.length} kartu yang tadi kamu jawab salah akan ditanyakan lagi.`,
          });
        } else {
          jalan = false;
          gambarSoal('Selesai. Benar ' + benar + ' dari ' + urutan.length + ' kartu.', 1);
          ids.q('waktu').textContent = '—';
          ids.q('waktu').style.color = 'var(--tinta-2)';
          tulisSkor(); rapor();
          return;
        }
      }
      const k = urutan[ke];
      gambarSoal(k.q, k.tk);
      sisa = ids.n('detik', { min: 3, maks: 60, bawaan: 15 });
      ids.q('waktu').textContent = sisa;
      ids.q('waktu').style.color = 'var(--tinta-2)';
      detak = setInterval(detakSekali, 1000);
      tulisSkor();
    };

    function jawab(pilih) {
      stop();
      if (!jalan || ke >= urutan.length) return;
      const k = urutan[ke];
      const tepat = pilih === k.a;
      if (tepat) benar++; else { salah++; if (!ulangi.includes(k)) ulangi.push(k); }
      perTopik[k.topik] = perTopik[k.topik] || { benar: 0, total: 0 };
      perTopik[k.topik].total++;
      if (tepat) perTopik[k.topik].benar++;
      ids.q('alasan').innerHTML = Catatan({
        jenis: tepat ? 'baik' : 'awas',
        isi: `<b>${pilih === null ? 'Waktu habis' : tepat ? 'Benar' : 'Belum tepat'} — ${LABEL[k.a]}.</b> ${k.why}`,
      });
      ke++; tulisSkor();
      tunda = setTimeout(() => { if (hidup()) berikutnya(); }, tepat ? 900 : 2600);
    }

    /* ---------- tombol ---------- */
    ids.klik('mulai', () => {
      const t = ids.s('topik'), tk = ids.s('tk');
      let pilihan = BANK.filter((k) => (!t || k.topik === t) && (!tk || String(k.tk) === tk));
      if (!pilihan.length) {
        ids.tulis('siap', merah('Tidak ada kartu untuk pilihan itu. Longgarkan penyaringnya.'));
        return;
      }
      stop();
      urutan = acakUrut(pilihan);
      ke = 0; benar = 0; salah = 0; ulangi = []; perTopik = {}; jalan = true;
      ids.q('rapor').innerHTML = '';
      ids.tulis('rapornya', 'Selesaikan putaran ini dulu.');
      ids.tulis('siap',
`${urutan.length} kartu disiapkan${t ? ' dari topik ' + (TOPIK[t] || t) : ''}${tk ? ', tingkat ' + tk : ''}.
${redup('Kartu yang salah akan diulang di akhir putaran.')}`);
      berikutnya();
    });

    ids.klik('lewat', () => {
      if (!jalan || ke >= urutan.length) return;
      jawab('__lewat__');
    });

    ids.klik('henti', () => {
      stop(); jalan = false;
      ids.q('waktu').textContent = '—';
      ids.q('waktu').style.color = 'var(--tinta-2)';
      ids.q('alasan').innerHTML = '';
      gambarSoal('Berhenti. Tekan “Mulai drill” untuk mengulang.', 1);
      if (ke > 0) rapor();
      tulisSkor();
    });

    tulisSkor();
  },
};
