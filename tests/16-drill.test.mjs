/* ============================================================
   UJI MODUL 16 — DRILL PENGENALAN POLA
   Angka di tiap kartu dihitung ulang oleh tests/adu16.mjs.
   Berkas ini memeriksa bentuk kartunya, perilaku drill-nya, dan
   memastikan kartu di modul ajar TIDAK berbeda dengan bank.
   ============================================================ */
import {
  siapkanDom, buatPencatat, bangunModul, daftarBerkasModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';
import { BANK, KATEGORI, LABEL, TOPIK } from '../js/core/kartu.js';

siapkanDom();
const t = buatPencatat('16-drill');
const c = await bangunModul('16-drill');
periksaKontrak(t, c); await periksaMesin(t, c); periksaBahasa(t, c); periksaSusunan(t, c);

t.bagian('Bentuk bank kartu');
t.cek('bank memuat minimal 90 kartu', BANK.length >= 90, String(BANK.length));
t.info('banyaknya kartu', String(BANK.length));
KATEGORI.forEach((a) => {
  t.cek(`kategori "${a}" punya kartu`, BANK.some((k) => k.a === a));
  t.cek(`kategori "${a}" punya label`, !!LABEL[a]);
});
const topikAda = [...new Set(BANK.map((k) => k.topik))];
topikAda.forEach((tp) => {
  t.cek(`topik ${tp} dikenali`, !!TOPIK[tp], tp);
  t.cek(`topik ${tp} punya kartu jebakan`, BANK.some((k) => k.topik === tp && k.tk === 3), tp);
  t.cek(`topik ${tp} punya minimal 4 kartu`,
    BANK.filter((k) => k.topik === tp).length >= 4,
    String(BANK.filter((k) => k.topik === tp).length));
});
t.cek('semua tingkat 1, 2, atau 3', BANK.every((k) => [1, 2, 3].includes(k.tk)));
t.cek('tidak ada pertanyaan kembar',
  new Set(BANK.map((k) => k.q.replace(/\s+/g, ' ').trim())).size === BANK.length);
t.cek('tiap alasan minimal 6 kata',
  BANK.every((k) => k.why.split(/\s+/).length >= 6),
  BANK.filter((k) => k.why.split(/\s+/).length < 6).map((k) => k.q.slice(0, 30)).join(' | '));
t.cek('alasan tidak sekadar menyebut nama topik',
  BANK.every((k) => !/^(Ini|Itu) [A-Z]/.test(k.why.trim())));
t.cek('tiap kartu bertingkat 3 memuat penjelasan jebakannya',
  BANK.filter((k) => k.tk === 3).every((k) => /JEBAKAN|bukan|gugur|basi|mustahil|berbeda/i.test(k.why)),
  BANK.filter((k) => k.tk === 3 && !/JEBAKAN|bukan|gugur|basi|mustahil|berbeda/i.test(k.why))
    .map((k) => k.q.slice(0, 30)).join(' | '));

t.bagian('Bahasa kartu mengikuti aturan modul');
const terlarang = ['simpul', 'DAG', 'traversal', 'in-degree', 'paritas', 'iteratif',
  'berhingga', 'koefisien', 'kongruen', 'multiplisitas', 'sekuens'];
terlarang.forEach((w) => {
  const kena = BANK.filter((k) => new RegExp('\\b' + w + '\\b', 'i').test(k.q + ' ' + k.why));
  t.cek(`tidak ada kartu memakai "${w}"`, kena.length === 0,
    kena.map((k) => k.q.slice(0, 35)).join(' | '));
});
const pakaiGcd = BANK.filter((k) => /\bgcd\b/.test(k.why));
t.cek('alasan memakai FPB, bukan gcd', pakaiGcd.length === 0,
  pakaiGcd.map((k) => k.q.slice(0, 35)).join(' | '));

t.bagian('Kartu modul ajar tidak boleh berbeda dengan bank');
let cocok = 0, bentrok = [], hilang = [];
for (const berkas of daftarBerkasModul()) {
  const mod = (await import('../js/modules/' + berkas)).default;
  if (!mod.kartu) continue;
  for (const k of mod.kartu) {
    const inti = k.q.replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
    const ada = BANK.find((b) => b.q.replace(/[“”"]/g, '').replace(/\s+/g, ' ').includes(inti)
      || inti.includes(b.q.replace(/[“”"]/g, '').replace(/\s+/g, ' ').slice(0, 40)));
    if (!ada) { hilang.push(`${mod.n}: ${inti}`); continue; }
    cocok++;
    if (ada.a !== k.a) bentrok.push(`${mod.n}: "${inti}" modul=${k.a} bank=${ada.a}`);
  }
}
t.cek('tidak ada kartu modul yang jawabannya bentrok dengan bank',
  bentrok.length === 0, bentrok.slice(0, 4).join(' | '));
t.info('kartu modul yang juga ada di bank', String(cocok));
t.info('kartu modul yang belum masuk bank', String(hilang.length));

t.bagian('Perilaku drill');
c.klik('mulai');
t.cek('drill menyiapkan kartu', /kartu disiapkan/.test(c.teks('siap')), c.teks('siap').slice(0, 60));
t.cek('penghitung waktu berjalan', c.teks('waktu') === '15', c.teks('waktu'));
t.cek('soal ditampilkan', c.el('soal').innerHTML.length > 40);
t.cek('ada 9 tombol jawaban',
  c.el('tombol').querySelectorAll('button').length === KATEGORI.length,
  c.el('tombol').querySelectorAll('button').length + '');
const tombolBenar = [...c.el('tombol').querySelectorAll('button')];
tombolBenar[0].click();
t.cek('setelah menjawab, alasannya muncul', /note/.test(c.el('alasan').innerHTML));
t.cek('skor ikut berubah', /Kartu 1 dari/.test(c.teks('skor')), c.teks('skor'));

t.bagian('Penyaring topik dan tingkat');
c.isi('topik', '10'); c.isi('tk', '3'); c.klik('mulai');
const jml = BANK.filter((k) => k.topik === '10' && k.tk === 3).length;
t.cek(`penyaring topik 10 tingkat 3 memberi ${jml} kartu`,
  new RegExp(jml + ' kartu disiapkan').test(c.teks('siap')), c.teks('siap').slice(0, 70));
c.isi('topik', ''); c.isi('tk', ''); c.klik('mulai');
t.cek(`tanpa penyaring memberi ${BANK.length} kartu`,
  new RegExp(BANK.length + ' kartu disiapkan').test(c.teks('siap')), c.teks('siap').slice(0, 70));

t.bagian('Kasus tepi');
c.klik('henti');
t.cek('tombol berhenti mematikan penghitung', c.teks('waktu') === '—', c.teks('waktu'));
c.klik('lewat');
t.cek('melewati kartu saat berhenti tidak merusak', true);
c.isi('detik', 3); c.klik('mulai');
t.cek('waktu bisa diatur jadi 3 detik', c.teks('waktu') === '3', c.teks('waktu'));
c.isi('detik', 99); c.klik('mulai');
t.cek('waktu dibatasi 60 detik', c.teks('waktu') === '60', c.teks('waktu'));

t.bagian('Timer tidak boleh bocor saat pindah modul');
{
  const aslinya = global.setInterval, asliClear = global.clearInterval;
  const hidup = new Set();
  global.setInterval = (fn, ms) => { const id = aslinya(fn, ms); hidup.add(id); return id; };
  global.clearInterval = (id) => { hidup.delete(id); return asliClear(id); };
  const d = await bangunModul('16-drill');
  d.klik('mulai');
  t.cek('satu penghitung hidup saat drill jalan', hidup.size === 1, String(hidup.size));
  await bangunModul('12-prefix');
  await new Promise((r) => setTimeout(r, 2400));
  t.cek('penghitung mati sendiri setelah panel diganti', hidup.size === 0, String(hidup.size));
  global.setInterval = aslinya; global.clearInterval = asliClear;
}

const hasil = t.ringkas();
process.exitCode = hasil.gagal ? 1 : 0;
