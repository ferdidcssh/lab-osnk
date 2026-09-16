import {
  siapkanDom, buatPencatat, bangunModul, daftarBerkasModul,
  periksaKontrak, periksaMesin, periksaBahasa, periksaSusunan,
} from './alat.mjs';

siapkanDom();
let L = 0, G = 0; const rusak = [];
for (const f of daftarBerkasModul()) {
  const berkas = f.replace(/\.js$/, '');
  const t = buatPencatat(berkas);
  const ctx = await bangunModul(berkas);
  periksaKontrak(t, ctx);
  await periksaMesin(t, ctx);
  periksaBahasa(t, ctx);
  periksaSusunan(t, ctx);
  const r = t.ringkas();
  L += r.lolos; G += r.gagal;
  if (r.gagal) rusak.push([berkas, r.daftarGagal]);
}
console.log('\n' + '#'.repeat(60));
console.log(`SEMUA MODUL: ${L} LOLOS, ${G} GAGAL`);
rusak.forEach(([m, d]) => console.log(`  ${m}: ` + d.join(' | ')));
