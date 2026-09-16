/* Uji auditnya sendiri: angka dirusak, berkas uji harus MERAH.
   Merusak satu angka di modul, lalu memastikan berkas uji yang baru
   BENAR-BENAR jadi merah. Modulnya selalu dikembalikan. */
import { readFileSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';

const KASUS = [
  ['08-toposort', 'leluhur di bedah soal (5 dan 6 hidup)',
    `const lel = M.topoLeluhur(pre, 'Minum teh');`,
    `const lel = M.topoLeluhur(pre, 'Membuat sup');`],
  ['08-toposort', 'angka mati "5 + 1 = 6" di tab Hitung leluhur',
    `posisi paling awal = 5 + 1 = \${hijau('6')}`,
    `posisi paling awal = 5 + 1 = \${hijau('9')}`],
  ['08-toposort', 'sel tabel level "Minum teh" (4)',
    `<tr><td style="text-align:left">level "Minum teh"</td><td style="text-align:left">1 + level prasyarat tertinggi</td><td style="text-align:left">4</td></tr>`,
    `<tr><td style="text-align:left">level "Minum teh"</td><td style="text-align:left">1 + level prasyarat tertinggi</td><td style="text-align:left">9</td></tr>`],
  ['08-toposort', 'durasi jalur kritis 2025 (7+5+6+2)',
    `const dur = { CPP: 7, AA: 3, DS: 5, DNC: 1, DP: 4, BF: 6, GRE: 2 };`,
    `const dur = { CPP: 7, AA: 3, DS: 5, DNC: 1, DP: 4, BF: 6, GRE: 3 };`],
  ['03-gcd', 'perhitungan FPB soal 38 (6)',
    `const opt=[4,9,17,18,34].map(b=>[b,M.gcd(24,b)]);`,
    `const opt=[4,9,17,18,34].map(b=>[b,M.gcd(25,b)]);`],
  ['03-gcd', 'cacahan manual soal 39 (2)',
    `let brute1=0; for(let c=1;c<=12;c++) if(M.gcd(12,c)===3) brute1++;`,
    `let brute1=0; for(let c=1;c<=24;c++) if(M.gcd(12,c)===3) brute1++;`],
  ['03-gcd', 'angka mati jawaban soal 40 (8)',
    `bagi 5 kali 4 → <span class="g">8</span>`,
    `bagi 5 kali 4 → <span class="g">9</span>`],
  ['03-gcd', 'angka mati FPB(48, 18) = 6 di prosa',
    `FPB(48, 18) = 6, karena 6 membagi habis keduanya`,
    `FPB(48, 18) = 9, karena 9 membagi habis keduanya`],
  ['03-gcd', 'angka mati φ(15) = 8 di prosa',
    `Contoh φ(15) = 8, karena dari 1 sampai 15 ada delapan bilangan`,
    `Contoh φ(15) = 9, karena dari 1 sampai 15 ada sembilan bilangan`],
  ['02-digit-sum', 'akar digit hidup (9)',
    '= 1 + ${(n-1)%9} = <span class="g">${M.digitalRoot(n)}</span>',
    '= 1 + ${(n-1)%9} = <span class="g">${M.digitalRoot(n)+1}</span>'],
  ['02-digit-sum', 'jawaban soal 37 hidup (3 pasang)',
    '<span class="g">Jawaban: ${pembagi.filter(p=>p[1]===77).length} pasang</span>',
    '<span class="g">Jawaban: ${pembagi.filter(p=>p[1]===77).length+1} pasang</span>'],
  ['02-digit-sum', 'angka mati akar digit 4587 di prosa',
    '4587 \u2192 24 \u2192 2 + 4 = <b>6</b>', '4587 \u2192 24 \u2192 2 + 4 = <b>9</b>'],
  ['02-digit-sum', 'jawaban soal 31 hidup (C[9] = 438)',
    'Jawaban: C[9] = ${r[9]}', 'Jawaban: C[9] = ${r[9]+1}'],
  ['07-tiga', 'jawaban soal 26 hidup (7)',
    "${hijau('Jawabannya TIGA(18) = 7')}", "${hijau('Jawabannya TIGA(18) = 9')}"],
  ['07-tiga', 'angka mati TIGA(18) = 7 di tab',
    "${hijau('TIGA(18) = 18\u00f73 + 1 = 7')}", "${hijau('TIGA(18) = 18\u00f73 + 1 = 9')}"],
  ['07-tiga', 'angka mati 34 pemanggilan di prosa',
    'kamu butuh <b>34 pemanggilan</b>', 'kamu butuh <b>44 pemanggilan</b>'],
];

for (const [modul, apa, dari, ke] of KASUS) {
  const jalur = `js/modules/${modul}.js`;
  const simpan = readFileSync(jalur, 'utf8');
  if (!simpan.includes(dari)) { console.log(`?? POLA TIDAK KETEMU — ${apa}`); continue; }
  writeFileSync(jalur, simpan.replace(dari, ke));
  let keluar = '';
  let kode = 0;
  try {
    keluar = execFileSync('node', [`tests/${modul}.test.mjs`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) { kode = e.status; keluar = (e.stdout || '') + (e.stderr || ''); }
  writeFileSync(jalur, simpan);
  const ringkas = (keluar.match(/\d+ LOLOS, (\d+) GAGAL/) || [])[1];
  console.log(`${kode !== 0 ? 'TERTANGKAP' : 'LOLOS (!!)'}  ${modul} · ${apa}` +
    `  → ${ringkas !== undefined ? ringkas + ' gagal' : 'meledak'}`);
  if (kode !== 0) {
    const baris = keluar.split('\n').filter((b) => b.includes('✗')).slice(0, 2);
    baris.forEach((b) => console.log('      ' + b.trim()));
  }
}
