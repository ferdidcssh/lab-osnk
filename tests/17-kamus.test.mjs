/* ============================================================
   UJI MODUL 17 — KAMUS KATA KUNCI
   Isinya diperiksa tests/adu17.mjs. Berkas ini memeriksa bentuk
   entrinya, perilaku modulnya, dan memastikan entri di modul ajar
   TIDAK berbeda dengan bank.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul, daftarBerkasModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { ENTRI } from '../js/core/kamus.js';

siapkanDom();
const t = buatPencatat('17-kamus');
const c = await bangunModul('17-kamus');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

t.bagian('Bentuk bank kamus');
t.cek('bank memuat minimal 60 entri', ENTRI.length >= 60, String(ENTRI.length));
t.info('banyaknya entri', String(ENTRI.length));
t.cek('tiap entri punya kata kunci dan topik',
  ENTRI.every((e) => e.kata && e.topik));
t.cek('tidak ada kata kunci kembar',
  new Set(ENTRI.map((e) => e.kata.replace(/\s+/g, ' ').trim())).size === ENTRI.length);
t.cek('minimal 20 entri jebakan', ENTRI.filter((e) => e.jebakan).length >= 20,
  String(ENTRI.filter((e) => e.jebakan).length));
t.cek('minimal 15 entri menyebut yang sering tertukar',
  ENTRI.filter((e) => e.tertukar).length >= 15,
  String(ENTRI.filter((e) => e.tertukar).length));
t.cek('topiknya tidak sekadar mengulang kata kuncinya',
  ENTRI.every((e) => e.topik.toLowerCase() !== e.kata.toLowerCase()));

t.bagian('Nomor modul yang ditunjuk harus ADA');
const modul = {};
for (const berkas of daftarBerkasModul()) {
  const m = (await import('../js/modules/' + berkas)).default;
  modul[m.n] = m;
}
const nomorAsing = [...new Set(ENTRI.map((e) => e.n).filter(Boolean))]
  .filter((n) => !modul[n]);
t.cek('semua nomor modul yang ditunjuk benar-benar ada', nomorAsing.length === 0,
  nomorAsing.join(', '));
const idSalah = ENTRI.filter((e) => e.n && e.id && modul[e.n] && modul[e.n].id !== e.id);
t.cek('id modul cocok dengan nomornya', idSalah.length === 0,
  idSalah.slice(0, 3).map((e) => `${e.n}: ${e.id} vs ${modul[e.n].id}`).join(' | '));
t.cek('entri tanpa modul juga tanpa id',
  ENTRI.filter((e) => !e.n).every((e) => !e.id));

t.bagian('Entri modul ajar tidak boleh hilang atau berbeda');
let cocok = 0; const hilang = [], bentrok = [];
const rapi = (x) => x.replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim();
for (const berkas of daftarBerkasModul()) {
  const m = (await import('../js/modules/' + berkas)).default;
  if (!m.kamus) continue;
  for (const [kata, topik] of m.kamus) {
    const ada = ENTRI.find((e) => rapi(e.kata) === rapi(kata));
    if (!ada) { hilang.push(`${m.n}: ${rapi(kata).slice(0, 40)}`); continue; }
    cocok++;
    if (rapi(ada.topik) !== rapi(topik)) {
      bentrok.push(`${m.n}: "${rapi(kata).slice(0, 30)}" modul="${rapi(topik).slice(0, 30)}" bank="${rapi(ada.topik).slice(0, 30)}"`);
    }
    if (ada.n !== m.n) bentrok.push(`${m.n}: nomornya di bank ${ada.n}`);
  }
}
t.cek('tidak ada entri modul yang hilang dari bank', hilang.length === 0,
  hilang.slice(0, 4).join(' | '));
t.cek('tidak ada entri modul yang topiknya bentrok', bentrok.length === 0,
  bentrok.slice(0, 3).join(' | '));
t.info('entri modul yang terpanen', String(cocok));

t.bagian('Bahasa entri mengikuti aturan modul');
const terlarang = ['simpul', 'DAG', 'traversal', 'in-degree', 'paritas', 'iteratif',
  'berhingga', 'koefisien', 'kongruen', 'multiplisitas', 'sekuens'];
terlarang.forEach((w) => {
  const kena = ENTRI.filter((e) =>
    new RegExp('\\b' + w + '\\b', 'i').test(e.kata + ' ' + e.topik + ' ' + (e.tertukar || '')));
  t.cek(`tidak ada entri memakai "${w}"`, kena.length === 0,
    kena.map((e) => e.kata.slice(0, 30)).join(' | '));
});
const pakaiGcd = ENTRI.filter((e) => /\bgcd\b/.test(e.topik + ' ' + (e.tertukar || '')));
t.cek('memakai FPB, bukan gcd', pakaiGcd.length === 0,
  pakaiGcd.map((e) => e.kata.slice(0, 30)).join(' | '));

t.bagian('Judul modul di bank cocok dengan modul aslinya');
const { JUDUL } = await import('../js/core/kamus.js');
const bedaJudul = Object.keys(JUDUL).filter((n) =>
  modul[n] && modul[n].judul.replace(/&amp;/g, '&') !== JUDUL[n]);
t.cek('semua judul cocok dengan modulnya', bedaJudul.length === 0,
  bedaJudul.map((n) => `${n}: "${JUDUL[n]}" vs "${modul[n].judul}"`).join(' | '));
t.cek('tiap modul yang punya entri juga punya judul',
  [...new Set(ENTRI.map((e) => e.n).filter(Boolean))].every((n) => JUDUL[n]));

t.bagian('Tiap entri jebakan menjelaskan menyerupai apa dan sebenarnya apa');
const jebakan = ENTRI.filter((e) => e.jebakan);
t.cek('semua jebakan punya kolom "terlihat seperti"',
  jebakan.every((e) => e.tertukar),
  jebakan.filter((e) => !e.tertukar).map((e) => e.kata.slice(0, 34)).join(' | '));
t.cek('penjelasan "sebenarnya" berbeda dari "terlihat seperti"',
  jebakan.every((e) => e.topik !== e.tertukar));

t.bagian('Perilaku daftar yang bisa dibuka');
const barisModul = () => [...c.el('daftar').querySelectorAll('[data-buka]')];
t.cek('tiap modul jadi satu baris', barisModul().length === 16, String(barisModul().length));
t.cek('semua baris tertutup di awal', !/KATA KUNCI/.test(c.el('daftar').textContent));
t.cek('ringkasan menyebut jumlah entri dan modul',
  new RegExp(ENTRI.length + ' entri di 16 modul').test(c.teks('ringkas')),
  c.teks('ringkas').slice(0, 60));

const buka10 = () => barisModul().find((b) => b.dataset.buka === '10');
buka10().click();
const isi10 = c.el('daftar').textContent;
t.cek('modul 10 terbuka dan menampilkan kata kuncinya', /KATA KUNCI/.test(isi10));
t.cek('bagian jebakan muncul terpisah', /JEBAKAN — \d+ frasa/.test(isi10), (isi10.match(/JEBAKAN — \d+ frasa/) || [])[0]);
t.cek('jebakan menjelaskan menyerupai apa', /Terlihat seperti:/.test(isi10));
t.cek('jebakan menjelaskan sebenarnya apa', /Sebenarnya:/.test(isi10));
t.cek('modul lain tetap tertutup',
  (c.el('daftar').textContent.match(/KATA KUNCI/g) || []).length === 1);
buka10().click();
t.cek('ditekan lagi jadi tertutup', !/KATA KUNCI/.test(c.el('daftar').textContent));

c.klik('semua');
t.cek('tombol buka semua membuka semuanya',
  (c.el('daftar').textContent.match(/KATA KUNCI/g) || []).length >= 15,
  (c.el('daftar').textContent.match(/KATA KUNCI/g) || []).length + '');
c.klik('tutup');
t.cek('tombol tutup semua menutup semuanya', !/KATA KUNCI/.test(c.el('daftar').textContent));

t.bagian('Pencarian');
c.isi('cari', 'dijamin'); c.el('cari').oninput();
const jml = ENTRI.filter((e) => [e.kata, e.topik, e.tertukar || '']
  .join(' ').toLowerCase().includes('dijamin')).length;
t.cek(`cari "dijamin" memberi ${jml} entri`,
  new RegExp(jml + ' entri cocok').test(c.teks('ringkas')), c.teks('ringkas').slice(0, 70));
t.cek('modul yang memuatnya terbuka otomatis', /KATA KUNCI|JEBAKAN/.test(c.el('daftar').textContent));
t.cek('bagian yang cocok disorot', /<mark>/.test(c.el('daftar').innerHTML));
c.isi('cari', 'zzzzzz'); c.el('cari').oninput();
t.cek('pencarian tanpa hasil tidak merusak', /Tidak ada yang cocok/.test(c.el('daftar').innerHTML));
c.isi('cari', ''); c.el('cari').oninput();

t.bagian('Mode sembunyikan jawaban');
c.klik('semua'); c.klik('sembunyi');
t.cek('jawaban disembunyikan', /· · · ·/.test(c.el('daftar').textContent));
t.cek('frasanya tetap terbaca', /melingkar/.test(c.el('daftar').textContent));
t.cek('ringkasan menjelaskan modenya', /disembunyikan/.test(c.teks('ringkas')));
t.cek('tombolnya berubah jadi "Tampilkan jawaban"',
  /Tampilkan jawaban/.test(c.el('sembunyi').textContent), c.el('sembunyi').textContent);
c.klik('sembunyi');
t.cek('ditekan lagi jawabannya muncul kembali',
  !/· · · ·/.test(c.el('daftar').textContent) && /Lintasan Euler/.test(c.el('daftar').textContent));

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
