import { Question } from '../types/exam';
import { MATH_QUESTIONS } from './mathQuestions';

function shuffleOptionsWithSeed(
  options: Array<{ text: string; isCorrect: boolean }>,
  seed: number
): {
  options: Array<{ id: string; text: string }>;
  correctOption?: string;
  correctOptions?: string[];
} {
  const letters = ['A', 'B', 'C', 'D'];
  const arr = [...options];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (seed * (i + 3) + 7) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const mapped = arr.map((item, idx) => ({ id: letters[idx], text: item.text }));
  const correctList = arr
    .map((item, idx) => (item.isCorrect ? letters[idx] : null))
    .filter((x): x is string => x !== null);

  return {
    options: mapped,
    correctOption: correctList[0],
    correctOptions: correctList,
  };
}

export function getMathQuestionsForPacket(packetNumber: number): Question[] {
  if (packetNumber <= 1) return MATH_QUESTIONS;

  const p = packetNumber - 2; // 0 for Paket 2, 1 for Paket 3, ...
  const seed = packetNumber * 17 + 5;

  // Q1: Pecahan dari gambar
  const q1Configs = [
    { rows: 2, cols: 5, shaded: 3 },
    { rows: 3, cols: 3, shaded: 4 },
    { rows: 2, cols: 6, shaded: 7 },
    { rows: 3, cols: 5, shaded: 8 },
    { rows: 4, cols: 4, shaded: 9 },
  ];
  const q1c = q1Configs[p % q1Configs.length];
  const q1Total = q1c.rows * q1c.cols;
  const q1Unshaded = q1Total - q1c.shaded;
  const q1Opts = shuffleOptionsWithSeed(
    [
      { text: `[[frac:${q1c.shaded}/${q1Total}]]`, isCorrect: true },
      { text: `[[frac:${q1Unshaded}/${q1Total}]]`, isCorrect: false },
      { text: `[[frac:${q1c.shaded}/${q1Unshaded}]]`, isCorrect: false },
      { text: `[[frac:${q1Total}/${q1c.shaded}]]`, isCorrect: false },
    ],
    seed + 1
  );

  // Q2: Mengurutkan bilangan berbagai bentuk
  const q2Sets = [
    {
      items: ['0,45', '[[frac:2/5]]', '48%', '[[frac:1/2]]'],
      asc: '[[frac:2/5]]; 0,45; 48%; [[frac:1/2]]',
      d1: '0,45; [[frac:2/5]]; 48%; [[frac:1/2]]',
      d2: '[[frac:2/5]]; 48%; 0,45; [[frac:1/2]]',
      d3: '[[frac:1/2]]; 48%; 0,45; [[frac:2/5]]',
      exp: '[[frac:2/5]] = 0,40; 0,45 = 0,45; 48% = 0,48; [[frac:1/2]] = 0,50.',
    },
    {
      items: ['75%', '0,72', '[[frac:4/5]]', '[[frac:7/10]]'],
      asc: '[[frac:7/10]]; 0,72; 75%; [[frac:4/5]]',
      d1: '0,72; [[frac:7/10]]; 75%; [[frac:4/5]]',
      d2: '[[frac:7/10]]; 75%; 0,72; [[frac:4/5]]',
      d3: '[[frac:4/5]]; 75%; 0,72; [[frac:7/10]]',
      exp: '[[frac:7/10]] = 0,70; 0,72 = 0,72; 75% = 0,75; [[frac:4/5]] = 0,80.',
    },
    {
      items: ['0,35', '32%', '[[frac:3/8]]', '[[frac:3/10]]'],
      asc: '[[frac:3/10]]; 32%; 0,35; [[frac:3/8]]',
      d1: '32%; [[frac:3/10]]; 0,35; [[frac:3/8]]',
      d2: '[[frac:3/10]]; 0,35; 32%; [[frac:3/8]]',
      d3: '[[frac:3/8]]; 0,35; 32%; [[frac:3/10]]',
      exp: '[[frac:3/10]] = 0,300; 32% = 0,320; 0,35 = 0,350; [[frac:3/8]] = 0,375.',
    },
  ];
  const q2s = q2Sets[p % q2Sets.length];
  const q2Opts = shuffleOptionsWithSeed(
    [
      { text: q2s.asc, isCorrect: true },
      { text: q2s.d1, isCorrect: false },
      { text: q2s.d2, isCorrect: false },
      { text: q2s.d3, isCorrect: false },
    ],
    seed + 2
  );

  // Q3: Membandingkan pecahan, desimal, persen (Kategori)
  const q3Sets = [
    {
      text: 'Empat siswa mencatat jarak lari pagi:\n• Edo: **[[frac:3/5]]** km\n• Beni: **65%** km\n• Lani: **0,6** km\n• Dayu: **[[frac:3/4]]** km',
      s1: 'Jarak lari Edo sama jauh dengan jarak lari Lani.',
      v1: 0,
      s2: 'Jarak lari Beni lebih jauh daripada jarak lari Dayu.',
      v2: 1,
      s3: 'Siswa yang berlari paling jauh adalah Dayu.',
      v3: 0,
      exp: 'Edo = [[frac:3/5]] = 0,60; Beni = 65% = 0,65; Lani = 0,60; Dayu = [[frac:3/4]] = 0,75. Jadi Edo = Lani (Benar), Beni < Dayu (Salah), paling jauh Dayu (Benar).',
    },
    {
      text: 'Empat peserta lomba memetik teh menimbang hasil petikan:\n• Rina: **0,85** kg\n• Sinta: **[[frac:4/5]]** kg\n• Tono: **82%** kg\n• Budi: **[[frac:17/20]]** kg',
      s1: 'Berat petikan Rina sama dengan berat petikan Budi.',
      v1: 0,
      s2: 'Berat petikan Sinta lebih berat daripada Tono.',
      v2: 1,
      s3: 'Urutan dari paling ringan dimulai dari Sinta (0,80 kg).',
      v3: 0,
      exp: 'Rina = 0,85; Sinta = 0,80; Tono = 0,82; Budi = [[frac:17/20]] = 0,85. Jadi Rina = Budi (Benar), Sinta < Tono (Salah), paling ringan Sinta (Benar).',
    },
  ];
  const q3s = q3Sets[p % q3Sets.length];

  // Q4: Operasi bilangan cacah
  const q4Configs = [
    { a: 1440, b: 12, c: 245, d: 6 }, // 120 + 1470 = 1590
    { a: 1625, b: 13, c: 310, d: 5 }, // 125 + 1550 = 1675
    { a: 1848, b: 14, c: 280, d: 4 }, // 132 + 1120 = 1252
    { a: 2160, b: 15, c: 420, d: 3 }, // 144 + 1260 = 1404
  ];
  const q4c = q4Configs[p % q4Configs.length];
  const q4Ans = q4c.a / q4c.b + q4c.c * q4c.d;
  const q4Opts = shuffleOptionsWithSeed(
    [
      { text: q4Ans.toLocaleString('id-ID'), isCorrect: true },
      { text: (q4Ans + 90).toLocaleString('id-ID'), isCorrect: false },
      { text: (q4Ans - 110).toLocaleString('id-ID'), isCorrect: false },
      { text: (q4c.a / q4c.b + q4c.c + q4c.d).toLocaleString('id-ID'), isCorrect: false },
    ],
    seed + 4
  );

  // Q5: Kalimat matematika dari cerita (MCMA)
  const q5Configs = [
    { packs: 15, perPack: 12, sold: 55, added: 40 }, // 180 - 55 + 40 = 165
    { packs: 14, perPack: 10, sold: 35, added: 50 }, // 140 - 35 + 50 = 155
    { packs: 16, perPack: 12, sold: 42, added: 30 }, // 192 - 42 + 30 = 180
  ];
  const q5c = q5Configs[p % q5Configs.length];
  const q5Init = q5c.packs * q5c.perPack;
  const q5Final = q5Init - q5c.sold + q5c.added;
  const q5Opts = shuffleOptionsWithSeed(
    [
      { text: `(${q5c.packs} × ${q5c.perPack}) − ${q5c.sold} + ${q5c.added} = ${q5Final}`, isCorrect: true },
      { text: `${q5Init} + (${q5c.added} − ${q5c.sold}) = ${q5Final}`, isCorrect: true },
      { text: `${q5c.packs} × (${q5c.perPack} − ${q5c.sold}) + ${q5c.added}`, isCorrect: false },
      { text: `(${q5c.packs} + ${q5c.perPack}) × ${q5c.added} − ${q5c.sold}`, isCorrect: false },
    ],
    seed + 5
  );

  // Q6: Operasi campuran pecahan
  const q6Configs = [
    {
      expr: '[[mixed:2:1/2]] + 3 × [[frac:1/2]] − [[mixed:1:1/4]]',
      ans: '[[mixed:2:3/4]]',
      w1: '[[mixed:2:1/4]]',
      w2: '[[mixed:3:1/4]]',
      w3: '[[mixed:3:3/4]]',
      exp: '3 × [[frac:1/2]] = [[mixed:1:1/2]]. Lalu [[mixed:2:1/2]] + [[mixed:1:1/2]] = 4. Kemudian 4 − [[mixed:1:1/4]] = [[mixed:2:3/4]].',
    },
    {
      expr: '[[mixed:4:1/4]] + 2 × [[frac:3/8]] − [[mixed:1:1/2]]',
      ans: '[[mixed:3:1/2]]',
      w1: '[[mixed:3:1/4]]',
      w2: '[[mixed:2:3/4]]',
      w3: '[[mixed:4:1/2]]',
      exp: '2 × [[frac:3/8]] = [[frac:3/4]]. Lalu [[mixed:4:1/4]] + [[frac:3/4]] = 5. Kemudian 5 − [[mixed:1:1/2]] = [[mixed:3:1/2]].',
    },
    {
      expr: '[[mixed:3:3/4]] + 4 × [[frac:1/4]] − [[mixed:2:1/2]]',
      ans: '[[mixed:2:1/4]]',
      w1: '[[mixed:2:3/4]]',
      w2: '[[mixed:1:3/4]]',
      w3: '[[mixed:3:1/4]]',
      exp: '4 × [[frac:1/4]] = 1. Lalu [[mixed:3:3/4]] + 1 = [[mixed:4:3/4]]. Kemudian [[mixed:4:3/4]] − [[mixed:2:1/2]] = [[mixed:2:1/4]].',
    },
  ];
  const q6c = q6Configs[p % q6Configs.length];
  const q6Opts = shuffleOptionsWithSeed(
    [
      { text: q6c.ans, isCorrect: true },
      { text: q6c.w1, isCorrect: false },
      { text: q6c.w2, isCorrect: false },
      { text: q6c.w3, isCorrect: false },
    ],
    seed + 6
  );

  // Q7: Diagram alir operasi hitung (Kategori)
  const q7Configs = [
    { mul: 4, sub: 20, div: 5, in1: 20, in2: 15, wrongIn3: 25 }, // (20*4-20)/5 = 12; 15*4-20 = 40; (25*4-20)/5 = 16
    { mul: 6, sub: 24, div: 4, in1: 12, in2: 10, wrongIn3: 16 }, // (12*6-24)/4 = 12; 10*6-24 = 36; (16*6-24)/4 = 18
    { mul: 5, sub: 15, div: 5, in1: 15, in2: 12, wrongIn3: 20 }, // (15*5-15)/5 = 12; 12*5-15 = 45; (20*5-15)/5 = 17
  ];
  const q7c = q7Configs[p % q7Configs.length];
  const q7Out1 = (q7c.in1 * q7c.mul - q7c.sub) / q7c.div;
  const q7Step2 = q7c.in2 * q7c.mul - q7c.sub;
  const q7Actual3 = (q7c.wrongIn3 * q7c.mul - q7c.sub) / q7c.div;
  const q7Claimed3 = q7Actual3 + 4;

  // Q8: Persamaan penjumlahan
  const q8Add = 165 + (p % 5) * 30;
  const q8Total = 450 + (p % 5) * 45;
  const q8Ans = q8Total - q8Add;
  const q8Opts = shuffleOptionsWithSeed(
    [
      { text: String(q8Ans), isCorrect: true },
      { text: String(q8Ans - 10), isCorrect: false },
      { text: String(q8Ans + 15), isCorrect: false },
      { text: String(q8Total + q8Add), isCorrect: false },
    ],
    seed + 8
  );

  // Q9: Persamaan pengurangan
  const q9Min = 680 + (p % 5) * 45;
  const q9Rem = 245 + (p % 5) * 23;
  const q9Ans = q9Min - q9Rem;
  const q9Opts = shuffleOptionsWithSeed(
    [
      { text: String(q9Ans), isCorrect: true },
      { text: String(q9Ans - 12), isCorrect: false },
      { text: String(q9Ans + 18), isCorrect: false },
      { text: String(q9Min + q9Rem), isCorrect: false },
    ],
    seed + 9
  );

  // Q10: Persamaan berbagai operasi (MCMA)
  const q10A = 8 + (p % 3) * 2; // 8, 10, 12
  const q10M = 4 + (p % 2); // 4, 5
  const q10B = q10A * 3; // guarantees b : a = 3
  const q10Total = q10A * q10M + q10B;
  const q10Opts = shuffleOptionsWithSeed(
    [
      { text: `Nilai b yang memenuhi persamaan adalah ${q10B}.`, isCorrect: true },
      { text: `Nilai b : a sama dengan 3.`, isCorrect: true },
      { text: `Nilai b − a sama dengan ${q10B - q10A + 5}.`, isCorrect: false },
      { text: `Nilai a + b sama dengan ${q10A + q10B + 10}.`, isCorrect: false },
    ],
    seed + 10
  );

  // Q11: Mengevaluasi informasi dengan persamaan (Kategori)
  const q11BookPrice = 5500 + (p % 3) * 1000;
  const q11PenPrice = 2000 + (p % 2) * 500;
  const q11Books = 4;
  const q11Pens = 3 + (p % 3); // 3, 4, 5
  const q11Total = q11Books * q11BookPrice + q11Pens * q11PenPrice;
  const q11Paid = 50000;
  const q11Change = q11Paid - q11Total;

  // Q12: KPK dan FPB
  const q12Configs = [
    {
      prompt: 'Lampu taman P menyala setiap **10 detik**, lampu Q setiap **15 detik**, dan lampu R setiap **20 detik**. Jika ketiganya menyala bersamaan pukul **18.30.00**, pukul berapa ketiganya menyala bersamaan lagi?',
      ans: '18.31.00',
      w1: '18.30.45',
      w2: '18.31.30',
      w3: '18.32.00',
      exp: 'KPK(10, 15, 20) = 60 detik = 1 menit. Jadi menyala bersama lagi pada 18.30.00 + 00.01.00 = 18.31.00.',
    },
    {
      prompt: 'Ibu menyiapkan **36 kue bolu** dan **48 kue lapis** untuk dimasukkan ke dalam kotak bingkisan dengan jumlah kue sama banyak di setiap kotak. Banyak kotak paling banyak yang dapat dibuat ibu adalah ....',
      ans: '12 kotak',
      w1: '6 kotak',
      w2: '8 kotak',
      w3: '24 kotak',
      exp: 'FPB(36, 48): 36 = 2² × 3², 48 = 2⁴ × 3 → FPB = 2² × 3 = 12 kotak.',
    },
    {
      prompt: 'Bus A berangkat dari terminal setiap **15 menit**, sedangkan Bus B setiap **25 menit**. Jika kedua bus berangkat bersama pukul **07.00**, pukul berapa keduanya berangkat bersama lagi?',
      ans: '08.15',
      w1: '07.45',
      w2: '08.00',
      w3: '08.30',
      exp: 'KPK(15, 25) = 75 menit = 1 jam 15 menit. Pukul 07.00 + 01.15 = 08.15.',
    },
  ];
  const q12c = q12Configs[p % q12Configs.length];
  const q12Opts = shuffleOptionsWithSeed(
    [
      { text: q12c.ans, isCorrect: true },
      { text: q12c.w1, isCorrect: false },
      { text: q12c.w2, isCorrect: false },
      { text: q12c.w3, isCorrect: false },
    ],
    seed + 12
  );

  // Q13: Ciri-ciri bangun datar (MCMA)
  const q13Configs = [
    {
      shape: 'layang-layang',
      c1: 'Memiliki dua pasang sisi berdekatan yang sama panjang.',
      c2: 'Kedua diagonalnya saling berpotongan tegak lurus.',
      w1: 'Keempat sisinya selalu memiliki panjang yang sama.',
      w2: 'Keempat sudutnya selalu siku-siku (90°).',
      exp: 'Layang-layang memiliki dua pasang sisi berdekatan sama panjang dan diagonal berpotongan tegak lurus.',
    },
    {
      shape: 'jajaran genjang',
      c1: 'Sisi-sisi yang berhadapan sejajar dan sama panjang.',
      c2: 'Sudut-sudut yang berhadapan memiliki besar yang sama.',
      w1: 'Kedua diagonalnya selalu berpotongan tegak lurus.',
      w2: 'Hanya memiliki tepat satu pasang sisi yang sejajar.',
      exp: 'Jajaran genjang memiliki dua pasang sisi berhadapan sejajar serta sama panjang, dan sudut berhadapan sama besar.',
    },
  ];
  const q13c = q13Configs[p % q13Configs.length];
  const q13Opts = shuffleOptionsWithSeed(
    [
      { text: q13c.c1, isCorrect: true },
      { text: q13c.c2, isCorrect: true },
      { text: q13c.w1, isCorrect: false },
      { text: q13c.w2, isCorrect: false },
    ],
    seed + 13
  );

  // Q14: Bangun penyusun segi banyak
  const q14Variant = (p % 2) + 1; // 1 or 2
  const q14Desc =
    q14Variant === 1
      ? {
          ans: 'segitiga siku-siku, persegi, dan jajaran genjang',
          w1: 'segitiga sama kaki, persegi panjang, dan trapesium',
          w2: 'segitiga sembarang, belah ketupat, dan persegi',
          w3: 'trapesium siku-siku, layang-layang, dan segitiga',
          exp: 'Bagian I berbentuk segitiga siku-siku, bagian II berbentuk persegi (empat sisi sama panjang), dan bagian III berbentuk jajaran genjang.',
        }
      : {
          ans: 'trapesium sama kaki, persegi panjang, dan segitiga siku-siku',
          w1: 'jajaran genjang, persegi, dan segitiga sama kaki',
          w2: 'segitiga sama sisi, layang-layang, dan trapesium',
          w3: 'belah ketupat, persegi panjang, dan segitiga tumpul',
          exp: 'Bagian I berbentuk trapesium sama kaki, bagian II berbentuk persegi panjang, dan bagian III berbentuk segitiga siku-siku.',
        };
  const q14Opts = shuffleOptionsWithSeed(
    [
      { text: q14Desc.ans, isCorrect: true },
      { text: q14Desc.w1, isCorrect: false },
      { text: q14Desc.w2, isCorrect: false },
      { text: q14Desc.w3, isCorrect: false },
    ],
    seed + 14
  );

  // Q15: Jaring-jaring kubus
  const q15Pairs = [
    { alas: '2', tutup: '4', wrong: ['1', '3', '5'] },
    { alas: '1', tutup: '6', wrong: ['2', '4', '5'] },
    { alas: '4', tutup: '2', wrong: ['3', '5', '6'] },
    { alas: '6', tutup: '1', wrong: ['2', '3', '4'] },
  ];
  const q15c = q15Pairs[p % q15Pairs.length];
  const q15Opts = shuffleOptionsWithSeed(
    [
      { text: q15c.tutup, isCorrect: true },
      { text: q15c.wrong[0], isCorrect: false },
      { text: q15c.wrong[1], isCorrect: false },
      { text: q15c.wrong[2], isCorrect: false },
    ],
    seed + 15
  );

  // Q16: Satuan panjang logis (Kategori)
  const q16Sets = [
    {
      s1: 'Panjang lapangan upacara sekolah diukur dengan satuan meter.',
      v1: 0,
      s2: 'Tinggi botol minum anak sekolah adalah sekitar 20 kilometer.',
      v2: 1,
      s3: 'Diameter uang koin logam diukur lebih tepat menggunakan satuan milimeter atau sentimeter.',
      v3: 0,
      s4: 'Panjang jalan tol antarkota diukur menggunakan satuan milimeter.',
      v4: 1,
    },
    {
      s1: 'Jarak dari rumah ke sekolah sejauh 3 kilometer adalah masuk akal.',
      v1: 0,
      s2: 'Panjang penggaris siswa yang biasa dibawa di kotak pensil adalah 30 meter.',
      v2: 1,
      s3: 'Tinggi tiang bendera di halaman sekolah sekitar 8 meter.',
      v3: 0,
      s4: 'Lebar buku tulis siswa adalah sekitar 16 kilometer.',
      v4: 1,
    },
  ];
  const q16s = q16Sets[p % q16Sets.length];

  // Q17: Volume kubus satuan
  const q17Variants = [
    { variant: 1, total: 17, exp: 'Lapisan bawah 3×3 = 9 kubus, lapisan tengah 3×2 = 6 kubus, lapisan atas 2 kubus. Total = 9 + 6 + 2 = 17 kubus satuan.' },
    { variant: 2, total: 16, exp: 'Lapisan bawah 4×3 = 12 kubus, lapisan atas 2×2 = 4 kubus. Total = 12 + 4 = 16 kubus satuan.' },
    { variant: 3, total: 15, exp: 'Lapisan bawah 3×3 = 9 kubus, lapisan tengah 2×2 = 4 kubus, lapisan atas 2 kubus. Total = 9 + 4 + 2 = 15 kubus satuan.' },
  ];
  const q17c = q17Variants[p % q17Variants.length];
  const q17Opts = shuffleOptionsWithSeed(
    [
      { text: `${q17c.total} kubus satuan`, isCorrect: true },
      { text: `${q17c.total - 2} kubus satuan`, isCorrect: false },
      { text: `${q17c.total - 1} kubus satuan`, isCorrect: false },
      { text: `${q17c.total + 2} kubus satuan`, isCorrect: false },
    ],
    seed + 17
  );

  // Q18: Kesetimbangan neraca
  const q18Configs = [
    { kgCount: 2, leftGrams: 200, bagCount: 2, rightGrams: 400 }, // 2200 - 400 = 1800 / 2 = 900g
    { kgCount: 2, leftGrams: 400, bagCount: 4, rightGrams: 200 }, // 2400 - 200 = 2200 / 4 = 550g
    { kgCount: 1, leftGrams: 800, bagCount: 3, rightGrams: 300 }, // 1800 - 300 = 1500 / 3 = 500g
  ];
  const q18c = q18Configs[p % q18Configs.length];
  const q18LeftTotal = q18c.kgCount * 1000 + q18c.leftGrams;
  const q18BagWeight = (q18LeftTotal - q18c.rightGrams) / q18c.bagCount;
  const q18Opts = shuffleOptionsWithSeed(
    [
      { text: `${q18BagWeight} gram`, isCorrect: true },
      { text: `${q18BagWeight - 100} gram`, isCorrect: false },
      { text: `${q18BagWeight + 100} gram`, isCorrect: false },
      { text: `${q18BagWeight + 150} gram`, isCorrect: false },
    ],
    seed + 18
  );

  // Q19: Durasi waktu pada jam analog
  const q19Configs = [
    { startH: 7, startM: 20, endH: 9, endM: 55, ans: '2 jam 35 menit', w1: '2 jam 25 menit', w2: '2 jam 45 menit', w3: '3 jam 35 menit' },
    { startH: 9, startM: 10, endH: 11, endM: 45, ans: '2 jam 35 menit', w1: '2 jam 15 menit', w2: '2 jam 45 menit', w3: '1 jam 35 menit' },
    { startH: 6, startM: 30, endH: 9, endM: 15, ans: '2 jam 45 menit', w1: '2 jam 15 menit', w2: '2 jam 35 menit', w3: '3 jam 15 menit' },
  ];
  const q19c = q19Configs[p % q19Configs.length];
  const q19Opts = shuffleOptionsWithSeed(
    [
      { text: q19c.ans, isCorrect: true },
      { text: q19c.w1, isCorrect: false },
      { text: q19c.w2, isCorrect: false },
      { text: q19c.w3, isCorrect: false },
    ],
    seed + 19
  );

  // Q20: Keliling segi banyak tidak beraturan
  const q20Configs = [
    { topW: 9, innerV: 6, innerH: 11, rightV: 8 }, // bottomW=20, leftV=14 -> Perim = 68
    { topW: 7, innerV: 4, innerH: 12, rightV: 9 }, // bottomW=19, leftV=13 -> Perim = 64
    { topW: 10, innerV: 5, innerH: 14, rightV: 6 }, // bottomW=24, leftV=11 -> Perim = 70
  ];
  const q20c = q20Configs[p % q20Configs.length];
  const q20Bottom = q20c.topW + q20c.innerH;
  const q20Left = q20c.innerV + q20c.rightV;
  const q20Perim = q20c.topW + q20c.innerV + q20c.innerH + q20c.rightV + q20Bottom + q20Left;
  const q20Opts = shuffleOptionsWithSeed(
    [
      { text: `${q20Perim} cm`, isCorrect: true },
      { text: `${q20Perim - 6} cm`, isCorrect: false },
      { text: `${q20Perim - 4} cm`, isCorrect: false },
      { text: `${q20Perim + 6} cm`, isCorrect: false },
    ],
    seed + 20
  );

  // Q21: Luas gabungan segitiga
  const q21Configs = [
    { b1: 6, h1: 6, b2: 12, h2: 8, b3: 6, h3: 6 }, // 18 + 48 + 18 = 84
    { b1: 10, h1: 6, b2: 12, h2: 10, b3: 10, h3: 6 }, // 30 + 60 + 30 = 120
    { b1: 8, h1: 8, b2: 10, h2: 10, b3: 8, h3: 8 }, // 32 + 50 + 32 = 114
  ];
  const q21c = q21Configs[p % q21Configs.length];
  const q21A1 = (q21c.b1 * q21c.h1) / 2;
  const q21A2 = (q21c.b2 * q21c.h2) / 2;
  const q21A3 = (q21c.b3 * q21c.h3) / 2;
  const q21Total = q21A1 + q21A2 + q21A3;
  const q21Opts = shuffleOptionsWithSeed(
    [
      { text: `${q21Total} cm²`, isCorrect: true },
      { text: `${q21Total - 12} cm²`, isCorrect: false },
      { text: `${q21Total + 12} cm²`, isCorrect: false },
      { text: `${q21Total * 2} cm²`, isCorrect: false },
    ],
    seed + 21
  );

  // Q22: Keliling dan luas persegi/persegi panjang (MCMA)
  const q22L = 16 + (p % 3) * 2; // 16, 18, 20
  const q22W = 10 + (p % 2) * 2; // 10, 12
  const q22Perim = 2 * (q22L + q22W);
  const q22Area = q22L * q22W;
  const q22Opts = shuffleOptionsWithSeed(
    [
      { text: `Keliling taman tersebut adalah ${q22Perim} meter.`, isCorrect: true },
      { text: `Luas permukaan taman yang ditanami rumput adalah ${q22Area} m².`, isCorrect: true },
      { text: `Selisih panjang dan lebar taman adalah ${q22L - q22W + 3} meter.`, isCorrect: false },
      { text: `Setengah keliling taman sama dengan ${q22L + q22W + 6} meter.`, isCorrect: false },
    ],
    seed + 22
  );

  // Q23: Bentuk benda di sekitar kita (Kategori)
  const q23Variant = (p + 1) % 2; // 1 or 0
  const q23Sts =
    q23Variant === 1
      ? [
          { id: 's1', text: 'Gambar 1 (rambu STOP) berbentuk segidelapan karena dibatasi 8 sisi lurus.', correctValue: 0 },
          { id: 's2', text: 'Gambar 2 berbentuk lingkaran tanpa titik sudut.', correctValue: 1 },
          { id: 's3', text: 'Gambar 3 berbentuk belah ketupat karena memiliki 4 sisi sama panjang.', correctValue: 0 },
        ]
      : [
          { id: 's1', text: 'Gambar 1 berbentuk segitiga karena memiliki 3 sisi dan 3 sudut.', correctValue: 0 },
          { id: 's2', text: 'Gambar 2 berbentuk lingkaran yang memiliki 1 sisi lengkung tertutup.', correctValue: 0 },
          { id: 's3', text: 'Gambar 3 berbentuk segiempat beraturan.', correctValue: 1 },
        ];

  // Q24: Satuan panjang dan berat (MCMA)
  const q24Kuintal = 3 + (p % 2); // 3 or 4
  const q24Kg = 65 + (p % 3) * 15; // 65, 80, 95
  const q24TotalKg = q24Kuintal * 100 + q24Kg;
  const q24M = 3.5 + (p % 2); // 3.5 or 4.5
  const q24Cm = 75;
  const q24TotalCm = Math.round(q24M * 100) + q24Cm;
  const q24Opts = shuffleOptionsWithSeed(
    [
      { text: `Total berat muatan beras dan gula adalah ${q24TotalKg} kg.`, isCorrect: true },
      { text: `Total panjang kedua tali adalah ${q24TotalCm} cm.`, isCorrect: true },
      { text: `Berat ${q24Kuintal} kuintal beras sama dengan ${q24Kuintal * 10} kg.`, isCorrect: false },
      { text: `Selisih panjang kedua tali adalah ${Math.round(q24M * 100) - q24Cm + 50} cm.`, isCorrect: false },
    ],
    seed + 24
  );

  // Q25: Besar dan jenis sudut
  const q25Hours = [
    { hour: 2, deg: 60, kind: 'sudut lancip', w1: '30° dan merupakan sudut lancip', w2: '90° dan merupakan sudut siku-siku', w3: '120° dan merupakan sudut tumpul' },
    { hour: 3, deg: 90, kind: 'sudut siku-siku', w1: '60° dan merupakan sudut lancip', w2: '120° dan merupakan sudut tumpul', w3: '180° dan merupakan sudut lurus' },
    { hour: 5, deg: 150, kind: 'sudut tumpul', w1: '120° dan merupakan sudut tumpul', w2: '90° dan merupakan sudut siku-siku', w3: '60° dan merupakan sudut lancip' },
  ];
  const q25c = q25Hours[p % q25Hours.length];
  const q25Padded = String(q25c.hour).padStart(2, '0');
  const q25Opts = shuffleOptionsWithSeed(
    [
      { text: `${q25c.deg}° dan merupakan ${q25c.kind}`, isCorrect: true },
      { text: q25c.w1, isCorrect: false },
      { text: q25c.w2, isCorrect: false },
      { text: q25c.w3, isCorrect: false },
    ],
    seed + 25
  );

  // Q26: Kesalahan penyajian diagram batang
  const q26Opts = shuffleOptionsWithSeed(
    [
      { text: 'Skala pada sumbu tegak tidak konsisten karena melompati nilai dengan jarak yang sama', isCorrect: true },
      { text: 'Nama hari pada sumbu mendatar ditulis menggunakan huruf kapital semua', isCorrect: false },
      { text: 'Batang diagram digambar menggunakan warna biru yang seragam', isCorrect: false },
      { text: 'Garis bantu horizontal dibuat putus-putus', isCorrect: false },
    ],
    seed + 26
  );

  // Q27: Membaca tabel untuk memecahkan masalah
  const q27Configs = [
    {
      caption: 'Data Penjualan Pensil Warna Koperasi Sekolah',
      rows: [
        ['Senin', '15 buah'],
        ['Selasa', '22 buah'],
        ['Rabu', '18 buah'],
        ['Kamis', '25 buah'],
      ],
      totalUnits: 80,
      price: 3500,
    },
    {
      caption: 'Data Penjualan Penggaris Koperasi Sekolah',
      rows: [
        ['Senin', '12 buah'],
        ['Selasa', '18 buah'],
        ['Rabu', '14 buah'],
        ['Kamis', '16 buah'],
      ],
      totalUnits: 60,
      price: 4000,
    },
  ];
  const q27c = q27Configs[p % q27Configs.length];
  const q27Rev = q27c.totalUnits * q27c.price;
  const q27Opts = shuffleOptionsWithSeed(
    [
      { text: `Rp${q27Rev.toLocaleString('id-ID')},00`, isCorrect: true },
      { text: `Rp${(q27Rev - 35000).toLocaleString('id-ID')},00`, isCorrect: false },
      { text: `Rp${(q27Rev + 40000).toLocaleString('id-ID')},00`, isCorrect: false },
      { text: `Rp${(q27Rev - 15000).toLocaleString('id-ID')},00`, isCorrect: false },
    ],
    seed + 27
  );

  // Q28: Membaca data berdasarkan kategori (Kategori)
  const q28Configs = [
    {
      counts: [3, 5, 11, 7, 4], // total 30, >75 = 11+7+4 = 22, modus = 80, remedial = 8
      tuntas: 22,
      modus: 80,
      wrongRemedial: 10,
      realRemedial: 8,
    },
    {
      counts: [2, 7, 8, 10, 3], // total 30, >75 = 8+10+3 = 21, modus = 90, remedial = 9
      tuntas: 21,
      modus: 90,
      wrongRemedial: 12,
      realRemedial: 9,
    },
  ];
  const q28c = q28Configs[p % q28Configs.length];

  // Q29: Menyajikan data dalam tabel dan diagram (MCMA)
  const q29Configs = [
    {
      title: 'Hobi Membaca Siswa Kelas VI',
      bars: [
        { name: 'Komik', val: 16 },
        { name: 'Cerita', val: 12 },
        { name: 'Sains', val: 8 },
        { name: 'Sejarah', val: 4 },
      ],
      total: 40,
      pctTarget: 'Sains',
      pctVal: 20, // 8/40 = 20%
      diffPair: ['Komik', 'Cerita', 4],
    },
    {
      title: 'Olahraga Favorit Siswa Kelas VI',
      bars: [
        { name: 'Sepakbola', val: 20 },
        { name: 'Renang', val: 12 },
        { name: 'Basket', val: 10 },
        { name: 'Bulutangkis', val: 8 },
      ],
      total: 50,
      pctTarget: 'Basket',
      pctVal: 20, // 10/50 = 20%
      diffPair: ['Sepakbola', 'Renang', 8],
    },
  ];
  const q29c = q29Configs[p % q29Configs.length];
  const q29Opts = shuffleOptionsWithSeed(
    [
      { text: `Jumlah seluruh siswa yang didata adalah ${q29c.total} siswa.`, isCorrect: true },
      { text: `Persentase siswa yang memilih ${q29c.pctTarget} adalah ${q29c.pctVal}%.`, isCorrect: true },
      { text: `Selisih pemilih ${q29c.diffPair[0]} dan ${q29c.diffPair[1]} adalah ${Number(q29c.diffPair[2]) + 3} siswa.`, isCorrect: false },
      { text: `Lebih dari setengah jumlah siswa memilih ${q29c.bars[0].name}.`, isCorrect: false },
    ],
    seed + 29
  );

  // Q30: Membaca diagram batang untuk memecahkan masalah
  const q30Configs = [
    {
      title: 'Hasil Panen Padi Desa Sukatani (Ton)',
      bars: [
        { year: '2021', val: 30 },
        { year: '2022', val: 40 },
        { year: '2023', val: 35 },
        { year: '2024', val: 50 },
        { year: '2025', val: 45 },
      ],
      avg: 40, // sum = 200 / 5 = 40
    },
    {
      title: 'Hasil Panen Kedelai Desa Mulya (Ton)',
      bars: [
        { year: '2021', val: 25 },
        { year: '2022', val: 35 },
        { year: '2023', val: 30 },
        { year: '2024', val: 45 },
        { year: '2025', val: 40 },
      ],
      avg: 35, // sum = 175 / 5 = 35
    },
  ];
  const q30c = q30Configs[p % q30Configs.length];
  const q30Opts = shuffleOptionsWithSeed(
    [
      { text: `${q30c.avg} ton`, isCorrect: true },
      { text: `${q30c.avg - 3} ton`, isCorrect: false },
      { text: `${q30c.avg + 4} ton`, isCorrect: false },
      { text: `${q30c.avg + 7} ton`, isCorrect: false },
    ],
    seed + 30
  );

  return [
    {
      number: 1,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Pecahan dari Gambar',
      indicator: MATH_QUESTIONS[0].indicator,
      type: 'pg',
      svgId: 'math-q1',
      svgData: q1c,
      prompt: 'Perhatikan gambar persegi panjang yang terbagi menjadi beberapa bagian sama besar di atas. Pecahan yang menyatakan bagian yang diarsir biru terhadap seluruh bagian adalah ....',
      options: q1Opts.options,
      correctOption: q1Opts.correctOption,
      explanation: `Bangun terbagi menjadi ${q1c.rows} × ${q1c.cols} = ${q1Total} bagian sama besar, dan ${q1c.shaded} bagian diarsir biru. Jadi pecahannya adalah [[frac:${q1c.shaded}/${q1Total}]].`,
    },
    {
      number: 2,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Mengurutkan Bilangan Berbagai Bentuk',
      indicator: MATH_QUESTIONS[1].indicator,
      type: 'pg',
      prompt: `Diketahui empat bilangan sebagai berikut:\n**${q2s.items[0]}**  ;  **${q2s.items[1]}**  ;  **${q2s.items[2]}**  ;  **${q2s.items[3]}**\n\nUrutan bilangan dari yang **terkecil hingga terbesar** adalah ....`,
      options: q2Opts.options,
      correctOption: q2Opts.correctOption,
      explanation: `Ubah semua bilangan menjadi bentuk desimal:\n${q2s.exp}\nJadi urutannya adalah ${q2s.asc}.`,
    },
    {
      number: 3,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Membandingkan Pecahan, Desimal, dan Persen',
      indicator: MATH_QUESTIONS[2].indicator,
      type: 'kategori',
      stimulusText: q3s.text,
      prompt: 'Tentukan apakah setiap pernyataan berikut **Benar** atau **Salah** berdasarkan data di atas!',
      kategoriLabels: ['Benar', 'Salah'],
      statements: [
        { id: 's1', text: q3s.s1, correctValue: q3s.v1 },
        { id: 's2', text: q3s.s2, correctValue: q3s.v2 },
        { id: 's3', text: q3s.s3, correctValue: q3s.v3 },
      ],
      explanation: q3s.exp,
    },
    {
      number: 4,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Operasi Bilangan Cacah',
      indicator: MATH_QUESTIONS[3].indicator,
      type: 'pg',
      prompt: `Hasil dari operasi hitung **${q4c.a.toLocaleString('id-ID')} : ${q4c.b} + ${q4c.c} × ${q4c.d}** adalah ....`,
      options: q4Opts.options,
      correctOption: q4Opts.correctOption,
      explanation: `Kerjakan pembagian dan perkalian lebih dahulu:\n• ${q4c.a.toLocaleString('id-ID')} : ${q4c.b} = ${q4c.a / q4c.b}\n• ${q4c.c} × ${q4c.d} = ${q4c.c * q4c.d}\n• Total = ${q4Ans.toLocaleString('id-ID')}.`,
    },
    {
      number: 5,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Kalimat Matematika dari Cerita',
      indicator: MATH_QUESTIONS[4].indicator,
      type: 'mcma',
      prompt: `Toko alat tulis sekolah memiliki **${q5c.packs} pak** penghapus, tiap pak berisi **${q5c.perPack} buah**. Hari ini terjual **${q5c.sold} buah**, lalu datang kiriman baru **${q5c.added} buah**.\n\nPilih **dua** kalimat matematika yang tepat untuk menyatakan banyak penghapus sekarang!`,
      options: q5Opts.options,
      correctOptions: q5Opts.correctOptions,
      explanation: `Stok awal = ${q5c.packs} × ${q5c.perPack} = ${q5Init}. Dikurangi penjualan ${q5c.sold} lalu ditambah kiriman ${q5c.added} menghasilkan ${q5Final}.`,
    },
    {
      number: 6,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Operasi Campuran Pecahan',
      indicator: MATH_QUESTIONS[5].indicator,
      type: 'pg',
      prompt: `Hasil dari **${q6c.expr}** adalah ....`,
      options: q6Opts.options,
      correctOption: q6Opts.correctOption,
      explanation: q6c.exp,
    },
    {
      number: 7,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Diagram Alir Operasi Hitung',
      indicator: MATH_QUESTIONS[6].indicator,
      type: 'kategori',
      svgId: 'math-q7',
      svgData: { mul: q7c.mul, sub: q7c.sub, div: q7c.div },
      prompt: 'Perhatikan diagram alir operasi hitung bilangan di atas. Tentukan apakah setiap pernyataan berikut **Benar** atau **Salah**!',
      kategoriLabels: ['Benar', 'Salah'],
      statements: [
        { id: 's1', text: `Jika bilangan awal adalah ${q7c.in1}, maka hasil akhirnya adalah ${q7Out1}.`, correctValue: 0 },
        { id: 's2', text: `Jika bilangan awal adalah ${q7c.in2}, maka hasil setelah Langkah 2 adalah ${q7Step2}.`, correctValue: 0 },
        { id: 's3', text: `Jika bilangan awal adalah ${q7c.wrongIn3}, maka hasil akhirnya adalah ${q7Claimed3}.`, correctValue: 1 },
      ],
      explanation: `1) (${q7c.in1} × ${q7c.mul} − ${q7c.sub}) : ${q7c.div} = ${q7Out1} (Benar).\n2) ${q7c.in2} × ${q7c.mul} − ${q7c.sub} = ${q7Step2} (Benar).\n3) (${q7c.wrongIn3} × ${q7c.mul} − ${q7c.sub}) : ${q7c.div} = ${q7Actual3}, bukan ${q7Claimed3} (Salah).`,
    },
    {
      number: 8,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Persamaan Penjumlahan',
      indicator: MATH_QUESTIONS[7].indicator,
      type: 'pg',
      prompt: `Di dalam sebuah keranjang terdapat sejumlah jeruk. Setelah ditambah **${q8Add} buah** jeruk lagi, jumlah seluruhnya menjadi **${q8Total} buah**. Nilai **n** pada persamaan **n + ${q8Add} = ${q8Total}** adalah ....`,
      options: q8Opts.options,
      correctOption: q8Opts.correctOption,
      explanation: `n = ${q8Total} − ${q8Add} = ${q8Ans}.`,
    },
    {
      number: 9,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Persamaan Pengurangan',
      indicator: MATH_QUESTIONS[8].indicator,
      type: 'pg',
      prompt: `Nilai **p** yang tepat untuk memenuhi persamaan **${q9Min} − p = ${q9Rem}** adalah ....`,
      options: q9Opts.options,
      correctOption: q9Opts.correctOption,
      explanation: `p = ${q9Min} − ${q9Rem} = ${q9Ans}.`,
    },
    {
      number: 10,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Persamaan Berbagai Operasi',
      indicator: MATH_QUESTIONS[9].indicator,
      type: 'mcma',
      prompt: `Diketahui nilai **a = ${q10A}** dan persamaan **(a × ${q10M}) + b = ${q10Total}**.\nPilih **dua** pernyataan yang bernilai benar!`,
      options: q10Opts.options,
      correctOptions: q10Opts.correctOptions,
      explanation: `Substitusi a = ${q10A}: (${q10A} × ${q10M}) + b = ${q10Total} → ${q10A * q10M} + b = ${q10Total} → b = ${q10B}. Maka b : a = ${q10B} : ${q10A} = 3.`,
    },
    {
      number: 11,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'Evaluasi Informasi dengan Persamaan',
      indicator: MATH_QUESTIONS[10].indicator,
      type: 'kategori',
      stimulusText: `Harga 1 buku tulis adalah **Rp${q11BookPrice.toLocaleString('id-ID')},00** dan harga 1 penghapus adalah **Rp${q11PenPrice.toLocaleString('id-ID')},00**. Dita membeli **${q11Books} buku tulis** dan **k** penghapus dengan total harga **Rp${q11Total.toLocaleString('id-ID')},00**.`,
      prompt: 'Tentukan apakah pernyataan berikut **Sesuai** atau **Tidak Sesuai**!',
      kategoriLabels: ['Sesuai', 'Tidak Sesuai'],
      statements: [
        { id: 's1', text: `Persamaan belanja Dita adalah (${q11Books} × ${q11BookPrice.toLocaleString('id-ID')}) + (k × ${q11PenPrice.toLocaleString('id-ID')}) = ${q11Total.toLocaleString('id-ID')}.`, correctValue: 0 },
        { id: 's2', text: `Banyak penghapus (k) yang dibeli Dita adalah ${q11Pens + 2} buah.`, correctValue: 1 },
        { id: 's3', text: `Jika Dita membayar dengan uang Rp50.000,00, uang kembaliannya adalah Rp${q11Change.toLocaleString('id-ID')},00.`, correctValue: 0 },
      ],
      explanation: `Harga ${q11Books} buku = Rp${(q11Books * q11BookPrice).toLocaleString('id-ID')}. Sisa = Rp${(q11Pens * q11PenPrice).toLocaleString('id-ID')} → k = ${q11Pens} penghapus (bukan ${q11Pens + 2}). Kembalian = Rp50.000 − Rp${q11Total.toLocaleString('id-ID')} = Rp${q11Change.toLocaleString('id-ID')}.`,
    },
    {
      number: 12,
      subject: 'matematika',
      domain: 'Bilangan',
      subtopic: 'KPK dan FPB Kontekstual',
      indicator: MATH_QUESTIONS[11].indicator,
      type: 'pg',
      prompt: q12c.prompt,
      options: q12Opts.options,
      correctOption: q12Opts.correctOption,
      explanation: q12c.exp,
    },
    {
      number: 13,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Ciri-ciri Bangun Datar',
      indicator: MATH_QUESTIONS[12].indicator,
      type: 'mcma',
      prompt: `Perhatikan ciri-ciri bangun datar segi empat berikut. Pilih **dua** ciri yang pasti dimiliki oleh bangun **${q13c.shape}**!`,
      options: q13Opts.options,
      correctOptions: q13Opts.correctOptions,
      explanation: q13c.exp,
    },
    {
      number: 14,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Bangun Penyusun Segi Banyak',
      indicator: MATH_QUESTIONS[13].indicator,
      type: 'pg',
      svgId: 'math-q14',
      svgData: { variant: q14Variant },
      prompt: 'Perhatikan gambar bangun segi banyak yang terbagi menjadi bagian I, II, dan III di atas. Bangun datar penyusun gambar tersebut berturut-turut dari I, II, dan III adalah ....',
      options: q14Opts.options,
      correctOption: q14Opts.correctOption,
      explanation: q14Desc.exp,
    },
    {
      number: 15,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Bangun Ruang & Visualisasi Spasial',
      indicator: MATH_QUESTIONS[14].indicator,
      type: 'pg',
      svgId: 'math-q15',
      svgData: { alas: q15c.alas },
      prompt: `Perhatikan jaring-jaring kubus di atas. Jika persegi bernomor **${q15c.alas}** dijadikan sebagai **alas** kubus, sisi yang akan menjadi **tutup (bagian atas)** kubus adalah nomor ....`,
      options: q15Opts.options,
      correctOption: q15Opts.correctOption,
      explanation: `Pada jaring-jaring kubus ini, pasangan sisi berhadapan adalah (1 dengan 6), (2 dengan 4), dan (3 dengan 5). Karena alasnya nomor ${q15c.alas}, maka tutupnya adalah nomor ${q15c.tutup}.`,
    },
    {
      number: 16,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Satuan Panjang yang Logis',
      indicator: MATH_QUESTIONS[15].indicator,
      type: 'kategori',
      prompt: 'Evaluasilah apakah pernyataan penggunaan satuan baku panjang berikut **Benar** (logis) atau **Salah** (tidak logis)!',
      kategoriLabels: ['Benar', 'Salah'],
      statements: [
        { id: 's1', text: q16s.s1, correctValue: q16s.v1 },
        { id: 's2', text: q16s.s2, correctValue: q16s.v2 },
        { id: 's3', text: q16s.s3, correctValue: q16s.v3 },
        { id: 's4', text: q16s.s4, correctValue: q16s.v4 },
      ],
      explanation: 'Satuan mm digunakan untuk benda sangat tipis/kecil, cm untuk alat tulis/benda harian, m untuk panjang ruangan/tiang, dan km untuk jarak jauh antartempat.',
    },
    {
      number: 17,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Volume dengan Kubus Satuan',
      indicator: MATH_QUESTIONS[16].indicator,
      type: 'pg',
      svgId: 'math-q17',
      svgData: { variant: q17c.variant },
      prompt: 'Perhatikan susunan bangun ruang dari kubus-kubus satuan yang tersusun rapat di atas. Volume bangun tersebut adalah ....',
      options: q17Opts.options,
      correctOption: q17Opts.correctOption,
      explanation: q17c.exp,
    },
    {
      number: 18,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Kesetimbangan Neraca',
      indicator: MATH_QUESTIONS[17].indicator,
      type: 'pg',
      svgId: 'math-q18',
      svgData: q18c,
      prompt: 'Perhatikan gambar neraca dalam keadaan **setimbang** di atas. Jika seluruh kantong berlabel **T** memiliki berat sama, berat **satu** kantong **T** adalah ....',
      options: q18Opts.options,
      correctOption: q18Opts.correctOption,
      explanation: `Berat kiri = ${q18c.kgCount} kg + ${q18c.leftGrams} g = ${q18LeftTotal} gram.\nBerat kanan = ${q18c.bagCount}T + ${q18c.rightGrams} gram.\n${q18c.bagCount}T = ${q18LeftTotal} − ${q18c.rightGrams} = ${q18LeftTotal - q18c.rightGrams} gram → T = ${q18BagWeight} gram.`,
    },
    {
      number: 19,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Durasi Waktu pada Jam Analog',
      indicator: MATH_QUESTIONS[18].indicator,
      type: 'pg',
      svgId: 'math-q19',
      svgData: { startH: q19c.startH, startM: q19c.startM, endH: q19c.endH, endM: q19c.endM },
      prompt: 'Lama waktu kegiatan membaca di perpustakaan berdasarkan kedua jam analog di atas adalah ....',
      options: q19Opts.options,
      correctOption: q19Opts.correctOption,
      explanation: `Jam mulai pukul ${String(q19c.startH).padStart(2, '0')}.${String(q19c.startM).padStart(2, '0')} dan selesai pukul ${String(q19c.endH).padStart(2, '0')}.${String(q19c.endM).padStart(2, '0')}. Selisih waktunya adalah ${q19c.ans}.`,
    },
    {
      number: 20,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Keliling Segi Banyak Tidak Beraturan',
      indicator: MATH_QUESTIONS[19].indicator,
      type: 'pg',
      svgId: 'math-q20',
      svgData: q20c,
      prompt: 'Perhatikan gambar bangun segi banyak tidak beraturan dengan ukuran sisi seperti di atas. Keliling bangun tersebut adalah ....',
      options: q20Opts.options,
      correctOption: q20Opts.correctOption,
      explanation: `Keliling = ${q20c.topW} + ${q20c.innerV} + ${q20c.innerH} + ${q20c.rightV} + ${q20Bottom} + ${q20Left} = ${q20Perim} cm.`,
    },
    {
      number: 21,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Luas Gabungan Segitiga',
      indicator: MATH_QUESTIONS[20].indicator,
      type: 'pg',
      svgId: 'math-q21',
      svgData: q21c,
      prompt: 'Perhatikan bangun datar yang tersusun dari tiga buah segitiga di atas. Luas seluruh bangun gabungan tersebut adalah ....',
      options: q21Opts.options,
      correctOption: q21Opts.correctOption,
      explanation: `Luas masing-masing segitiga = [[frac:1/2]] × alas × tinggi:\n• Segitiga kiri = ${q21A1} cm²\n• Segitiga tengah = ${q21A2} cm²\n• Segitiga kanan = ${q21A3} cm²\nTotal luas = ${q21Total} cm².`,
    },
    {
      number: 22,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Keliling & Luas Persegi Panjang',
      indicator: MATH_QUESTIONS[21].indicator,
      type: 'mcma',
      prompt: `Taman sekolah berbentuk persegi panjang dengan panjang **${q22L} m** dan lebar **${q22W} m**.\nPilih **dua** pernyataan yang benar tentang taman tersebut!`,
      options: q22Opts.options,
      correctOptions: q22Opts.correctOptions,
      explanation: `Keliling = 2 × (${q22L} + ${q22W}) = ${q22Perim} meter. Luas = ${q22L} × ${q22W} = ${q22Area} m².`,
    },
    {
      number: 23,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Bentuk Benda di Sekitar Kita',
      indicator: MATH_QUESTIONS[22].indicator,
      type: 'kategori',
      svgId: 'math-q23',
      svgData: { variant: q23Variant },
      prompt: 'Perhatikan ketiga gambar benda di atas. Tentukan apakah pernyataan mengenai bentuk bangun datar berikut **Benar** atau **Salah**!',
      kategoriLabels: ['Benar', 'Salah'],
      statements: q23Sts,
      explanation: 'Segitiga memiliki 3 sisi, segiempat (seperti persegi/belah ketupat) memiliki 4 sisi, segidelapan memiliki 8 sisi, dan lingkaran memiliki 1 sisi lengkung tanpa titik sudut.',
    },
    {
      number: 24,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Satuan Panjang dan Berat',
      indicator: MATH_QUESTIONS[23].indicator,
      type: 'mcma',
      prompt: `Sebuah mobil bak membawa **${q24Kuintal} kuintal** beras dan **${q24Kg} kg** gula. Pengemudi juga membawa dua tali masing-masing sepanjang **${String(q24M).replace('.', ',')} m** dan **${q24Cm} cm**.\n\nPilih **dua** pernyataan yang benar!`,
      options: q24Opts.options,
      correctOptions: q24Opts.correctOptions,
      explanation: `${q24Kuintal} kuintal = ${q24Kuintal * 100} kg, ditambah ${q24Kg} kg menjadi ${q24TotalKg} kg. Panjang ${String(q24M).replace('.', ',')} m = ${Math.round(q24M * 100)} cm, ditambah ${q24Cm} cm menjadi ${q24TotalCm} cm.`,
    },
    {
      number: 25,
      subject: 'matematika',
      domain: 'Geometri dan Pengukuran',
      subtopic: 'Besar dan Jenis Sudut',
      indicator: MATH_QUESTIONS[24].indicator,
      type: 'pg',
      svgId: 'math-q25',
      svgData: { hour: q25c.hour },
      prompt: `Jarum jam dinding ruang perpustakaan tepat menunjukkan pukul **${q25Padded}.00** seperti pada gambar. Besar sudut terkecil yang terbentuk beserta jenis sudutnya adalah ....`,
      options: q25Opts.options,
      correctOption: q25Opts.correctOption,
      explanation: `Setiap 1 jam besarnya 30°. Pada pukul ${q25Padded}.00, besar sudut = ${q25c.hour} × 30° = ${q25c.deg}° (${q25c.kind}).`,
    },
    {
      number: 26,
      subject: 'matematika',
      domain: 'Data dan Ketidakpastian',
      subtopic: 'Kesalahan Penyajian Diagram Batang',
      indicator: MATH_QUESTIONS[25].indicator,
      type: 'pg',
      svgId: 'math-q26',
      svgData: {
        title: 'Pengunjung Ruang Baca Senin–Kamis',
        ticks: [
          { label: '50', y: 40 },
          { label: '40', y: 75 },
          { label: '20', y: 110 },
          { label: '10', y: 145 },
          { label: '0', y: 180 },
        ],
        bars: [
          { day: 'Senin', val: 20, y: 110 },
          { day: 'Selasa', val: 30, y: 92 },
          { day: 'Rabu', val: 40, y: 75 },
          { day: 'Kamis', val: 15, y: 127 },
        ],
      },
      stimulusTable: {
        caption: 'Tabel Data Asli Pengunjung Ruang Baca',
        headers: ['Hari', 'Senin', 'Selasa', 'Rabu', 'Kamis'],
        rows: [['Jumlah Siswa', '20', '30', '40', '15']],
      },
      prompt: 'Berdasarkan tabel data asli dan gambar diagram batang di atas, kesalahan penyajian yang tampak pada diagram batang tersebut adalah ....',
      options: q26Opts.options,
      correctOption: q26Opts.correctOption,
      explanation: 'Pada sumbu tegak tertulis 0, 10, 20, 40, 50 dengan jarak antar garis dibuat sama rata meskipun selisihnya melompati angka 30.',
    },
    {
      number: 27,
      subject: 'matematika',
      domain: 'Data dan Ketidakpastian',
      subtopic: 'Membaca Tabel untuk Memecahkan Masalah',
      indicator: MATH_QUESTIONS[26].indicator,
      type: 'pg',
      stimulusTable: {
        caption: q27c.caption,
        headers: ['Hari', 'Banyak Terjual'],
        rows: q27c.rows,
      },
      prompt: `Jika harga 1 buah barang tersebut adalah **Rp${q27c.price.toLocaleString('id-ID')},00**, total uang hasil penjualan selama 4 hari adalah ....`,
      options: q27Opts.options,
      correctOption: q27Opts.correctOption,
      explanation: `Total terjual = ${q27c.totalUnits} buah. Total pendapatan = ${q27c.totalUnits} × Rp${q27c.price.toLocaleString('id-ID')} = Rp${q27Rev.toLocaleString('id-ID')},00.`,
    },
    {
      number: 28,
      subject: 'matematika',
      domain: 'Data dan Ketidakpastian',
      subtopic: 'Membaca Data Berdasarkan Kategori',
      indicator: MATH_QUESTIONS[27].indicator,
      type: 'kategori',
      stimulusTable: {
        caption: 'Daftar Nilai Ulangan IPA Kelas VI (KKM = 75)',
        headers: ['Nilai', '60', '70', '80', '90', '100'],
        rows: [['Banyak Siswa', ...q28c.counts.map(String)]],
      },
      prompt: 'Berdasarkan tabel nilai di atas, tentukan apakah setiap pernyataan berikut **Benar** atau **Salah**!',
      kategoriLabels: ['Benar', 'Salah'],
      statements: [
        { id: 's1', text: `Banyak siswa yang nilainya di atas KKM 75 adalah ${q28c.tuntas} siswa.`, correctValue: 0 },
        { id: 's2', text: `Modus nilai pada tabel tersebut adalah ${q28c.modus}.`, correctValue: 0 },
        { id: 's3', text: `Sebanyak ${q28c.wrongRemedial} siswa memperoleh nilai di bawah 75.`, correctValue: 1 },
      ],
      explanation: `Siswa tuntas (80, 90, 100) = ${q28c.tuntas} siswa (Benar). Modus adalah nilai frekuensi tertinggi yaitu ${q28c.modus} (Benar). Siswa di bawah 75 (nilai 60 dan 70) berjumlah ${q28c.realRemedial} siswa, bukan ${q28c.wrongRemedial} (Salah).`,
    },
    {
      number: 29,
      subject: 'matematika',
      domain: 'Data dan Ketidakpastian',
      subtopic: 'Menyajikan Data Tabel dan Diagram',
      indicator: MATH_QUESTIONS[28].indicator,
      type: 'mcma',
      svgId: 'math-q29',
      svgData: { title: q29c.title, bars: q29c.bars },
      prompt: 'Perhatikan diagram batang di atas. Pilih **dua** pernyataan yang tepat apabila data diagram disajikan dalam bentuk tabel atau persentase!',
      options: q29Opts.options,
      correctOptions: q29Opts.correctOptions,
      explanation: `Jumlah total = ${q29c.total} siswa. Persentase ${q29c.pctTarget} = ${q29c.pctVal}%.`,
    },
    {
      number: 30,
      subject: 'matematika',
      domain: 'Data dan Ketidakpastian',
      subtopic: 'Membaca Diagram Batang untuk Memecahkan Masalah',
      indicator: MATH_QUESTIONS[29].indicator,
      type: 'pg',
      svgId: 'math-q30',
      svgData: { title: q30c.title, bars: q30c.bars },
      prompt: 'Perhatikan diagram batang di atas. **Rata-rata** hasil panen setiap tahun dari tahun 2021 sampai 2025 adalah ....',
      options: q30Opts.options,
      correctOption: q30Opts.correctOption,
      explanation: `Jumlah seluruh hasil panen = ${q30c.bars.map((b) => b.val).join(' + ')} = ${q30c.avg * 5} ton. Rata-rata = ${q30c.avg * 5} : 5 = ${q30c.avg} ton.`,
    },
  ];
}
