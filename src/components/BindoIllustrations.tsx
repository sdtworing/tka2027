import React from 'react';

interface BindoIllustrationProps {
  id: string;
  data?: Record<string, unknown>;
}

export const BindoIllustration: React.FC<BindoIllustrationProps> = ({ id, data = {} }) => {
  switch (id) {
    case 'bindo-q1': {
      const rootLine1 = (data.rootLine1 as string) ?? 'Gerakan Sekolah Bebas';
      const rootLine2 = (data.rootLine2 as string) ?? 'Sampah Plastik';
      const b1Title = (data.b1Title as string) ?? '1. Latar Belakang';
      const b1Lines = (data.b1Lines as string[]) ?? [
        'Tumpukan bungkus',
        'jajanan plastik di',
        'halaman sekolah',
      ];
      const b2Lines = (data.b2Lines as string[]) ?? [
        'Membawa botol minum',
        'isi ulang & kotak',
        'bekal dari rumah',
      ];
      const b3Title = (data.b3Title as string) ?? '3. Dampak Nyata';
      const b3Lines = (data.b3Lines as string[]) ?? [
        'Sampah plastik',
        'berkurang drastis',
        '& sekolah lebih asri',
      ];

      return (
        <svg viewBox="0 0 540 245" className="w-full max-w-[540px] mx-auto" role="img" aria-label={`Bagan kerangka isi teks ${rootLine1} ${rootLine2}`}>
          <rect x="0" y="0" width="540" height="245" rx="12" fill="#F8FAFC" />
          <rect x="135" y="18" width="270" height="44" rx="8" fill="#1D4ED8" />
          <text x="270" y="37" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#FFFFFF">
            {rootLine1}
          </text>
          <text x="270" y="52" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#FFFFFF">
            {rootLine2}
          </text>

          <line x1="270" y1="62" x2="270" y2="84" stroke="#64748B" strokeWidth="2" />
          <line x1="90" y1="84" x2="450" y2="84" stroke="#64748B" strokeWidth="2" />
          <line x1="90" y1="84" x2="90" y2="105" stroke="#64748B" strokeWidth="2" />
          <line x1="270" y1="84" x2="270" y2="105" stroke="#64748B" strokeWidth="2" />
          <line x1="450" y1="84" x2="450" y2="105" stroke="#64748B" strokeWidth="2" />

          <rect x="18" y="105" width="144" height="114" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.8" />
          <rect x="18" y="105" width="144" height="28" rx="8" fill="#DBEAFE" />
          <text x="90" y="123" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E3A8A">{b1Title}</text>
          {b1Lines.map((ln, idx) => (
            <text key={idx} x="90" y={154 + idx * 16} textAnchor="middle" fontSize="10.5" fill="#334155">{ln}</text>
          ))}

          <rect x="198" y="105" width="144" height="114" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.8" />
          <rect x="198" y="105" width="144" height="28" rx="8" fill="#FEF3C7" />
          <text x="270" y="123" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400E">2. [ ? ]</text>
          {b2Lines.map((ln, idx) => (
            <text key={idx} x="270" y={154 + idx * 16} textAnchor="middle" fontSize="10.5" fill="#334155">{ln}</text>
          ))}

          <rect x="378" y="105" width="144" height="114" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.8" />
          <rect x="378" y="105" width="144" height="28" rx="8" fill="#DCFCE7" />
          <text x="450" y="123" textAnchor="middle" fontSize="11" fontWeight="700" fill="#065F46">{b3Title}</text>
          {b3Lines.map((ln, idx) => (
            <text key={idx} x="450" y={154 + idx * 16} textAnchor="middle" fontSize="10.5" fill="#334155">{ln}</text>
          ))}
        </svg>
      );
    }

    case 'bindo-q26': {
      const variant = (data.variant as number) ?? 0;

      if (variant === 1) {
        // Ilustrasi Pembagian Waktu 24 Jam Sehat Anak Sekolah (Tidur 9 jam, Sekolah 6 jam, Belajar/Membaca 3 jam, Bermain/Olahraga 3 jam, Keluarga/Ibadah 3 jam)
        const cx = 180;
        const cy = 126;
        const r = 84;
        const pt = (deg: number) => {
          const a = ((deg - 90) * Math.PI) / 180;
          return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
        };
        // 9h = 135 deg, 6h = 90 deg, 3h = 45 deg, 3h = 45 deg, 3h = 45 deg
        return (
          <svg viewBox="0 0 430 245" className="w-full max-w-[430px] mx-auto" role="img" aria-label="Ilustrasi pembagian waktu 24 jam anak sekolah">
            <rect x="0" y="0" width="430" height="245" rx="12" fill="#F8FAFC" />
            <text x="215" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A">
              Diagram Pembagian Waktu 24 Jam Anak Sekolah
            </text>
            <path d={`M ${cx},${cy} L ${pt(0)} A ${r},${r} 0 0,1 ${pt(135)} Z`} fill="#DBEAFE" stroke="#0F172A" strokeWidth="1.8" />
            <path d={`M ${cx},${cy} L ${pt(135)} A ${r},${r} 0 0,1 ${pt(225)} Z`} fill="#FEF3C7" stroke="#0F172A" strokeWidth="1.8" />
            <path d={`M ${cx},${cy} L ${pt(225)} A ${r},${r} 0 0,1 ${pt(270)} Z`} fill="#BBF7D0" stroke="#0F172A" strokeWidth="1.8" />
            <path d={`M ${cx},${cy} L ${pt(270)} A ${r},${r} 0 0,1 ${pt(315)} Z`} fill="#FDE68A" stroke="#0F172A" strokeWidth="1.8" />
            <path d={`M ${cx},${cy} L ${pt(315)} A ${r},${r} 0 0,1 ${pt(360)} Z`} fill="#E9D5FF" stroke="#0F172A" strokeWidth="1.8" />

            <text x={cx + 38} y={cy - 18} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1E3A8A">Tidur</text>
            <text x={cx + 38} y={cy - 5} textAnchor="middle" fontSize="9.5" fill="#1E40AF">(9 jam)</text>

            <text x={cx} y={cy + 52} textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E">Sekolah (6 jam)</text>

            <rect x="290" y="54" width="128" height="142" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="354" y="74" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0F172A">Rincian Waktu</text>
            <rect x="300" y="86" width="11" height="11" fill="#DBEAFE" stroke="#0F172A" strokeWidth="1" />
            <text x="316" y="95" fontSize="9.5" fill="#334155">Tidur: 9 jam</text>
            <rect x="300" y="106" width="11" height="11" fill="#FEF3C7" stroke="#0F172A" strokeWidth="1" />
            <text x="316" y="115" fontSize="9.5" fill="#334155">Sekolah: 6 jam</text>
            <rect x="300" y="126" width="11" height="11" fill="#BBF7D0" stroke="#0F172A" strokeWidth="1" />
            <text x="316" y="135" fontSize="9.5" fill="#334155">Belajar: 3 jam</text>
            <rect x="300" y="146" width="11" height="11" fill="#FDE68A" stroke="#0F172A" strokeWidth="1" />
            <text x="316" y="155" fontSize="9.5" fill="#334155">Olahraga/Main: 3 jam</text>
            <rect x="300" y="166" width="11" height="11" fill="#E9D5FF" stroke="#0F172A" strokeWidth="1" />
            <text x="316" y="175" fontSize="9.5" fill="#334155">Keluarga: 3 jam</text>
          </svg>
        );
      }

      if (variant === 2) {
        // Ilustrasi Siklus Air (Pemanasan Matahari -> Penguapan -> Kondensasi/Awan -> Hujan -> Aliran Sungai)
        return (
          <svg viewBox="0 0 430 230" className="w-full max-w-[430px] mx-auto" role="img" aria-label="Ilustrasi daur atau siklus air alami">
            <rect x="0" y="0" width="430" height="230" rx="12" fill="#F0F9FF" />
            <text x="215" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A">
              Ilustrasi Tahapan Siklus Air di Alam
            </text>
            {/* Sun */}
            <circle cx="66" cy="64" r="24" fill="#FDE047" stroke="#D97706" strokeWidth="2" />
            <text x="66" y="102" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E">Matahari</text>

            {/* Sea */}
            <rect x="20" y="170" width="210" height="44" rx="6" fill="#0284C7" />
            <text x="125" y="196" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">Laut (Penguapan / Evaporasi)</text>

            {/* Evaporation Arrows */}
            <line x1="120" y1="164" x2="120" y2="112" stroke="#0369A1" strokeWidth="2.5" strokeDasharray="4 3" />
            <polygon points="115,116 120,104 125,116" fill="#0369A1" />
            <line x1="160" y1="164" x2="160" y2="112" stroke="#0369A1" strokeWidth="2.5" strokeDasharray="4 3" />
            <polygon points="155,116 160,104 165,116" fill="#0369A1" />

            {/* Cloud */}
            <ellipse cx="265" cy="70" rx="58" ry="24" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
            <text x="265" y="74" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0F172A">Awan (Kondensasi)</text>

            {/* Arrow cloud to mountain rain */}
            <line x1="326" y1="70" x2="355" y2="70" stroke="#475569" strokeWidth="2" />
            <polygon points="352,65 362,70 352,75" fill="#475569" />

            {/* Rain & Mountain */}
            <polygon points="270,170 350,105 415,170" fill="#86EFAC" stroke="#166534" strokeWidth="2" />
            <rect x="230" y="170" width="185" height="44" fill="#BBF7D0" />
            <text x="342" y="196" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#14532D">Daratan &amp; Aliran Sungai</text>
            <line x1="350" y1="88" x2="345" y2="112" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="370" y1="88" x2="365" y2="118" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
            <text x="365" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1D4ED8">Hujan (Presipitasi)</text>
          </svg>
        );
      }

      const cx = 190;
      const cy = 122;
      const r = 88;
      const pt = (deg: number, rad = r) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
      };
      return (
        <svg viewBox="0 0 430 245" className="w-full max-w-[430px] mx-auto" role="img" aria-label="Ilustrasi piring gizi seimbang Isi Piringku">
          <rect x="0" y="0" width="430" height="245" rx="12" fill="#F8FAFC" />
          <text x="215" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A">
            Ilustrasi Pembagian Porsi &quot;Isi Piringku&quot;
          </text>
          <circle cx={cx} cy={cy} r={r + 8} fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" />

          <path d={`M ${cx},${cy} L ${pt(0)} A ${r},${r} 0 0,1 ${pt(120)} Z`} fill="#FEF3C7" stroke="#0F172A" strokeWidth="2" />
          <path d={`M ${cx},${cy} L ${pt(120)} A ${r},${r} 0 0,1 ${pt(180)} Z`} fill="#FECACA" stroke="#0F172A" strokeWidth="2" />
          <path d={`M ${cx},${cy} L ${pt(180)} A ${r},${r} 0 0,1 ${pt(240)} Z`} fill="#FDE68A" stroke="#0F172A" strokeWidth="2" />
          <path d={`M ${cx},${cy} L ${pt(240)} A ${r},${r} 0 0,1 ${pt(360)} Z`} fill="#BBF7D0" stroke="#0F172A" strokeWidth="2" />

          <text x={cx - 38} y={cy - 18} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#14532D">Sayuran</text>
          <text x={cx - 38} y={cy - 5} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#166534">(1/3 piring)</text>

          <text x={cx - 32} y={cy + 46} textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E">Buah</text>
          <text x={cx - 32} y={cy + 58} textAnchor="middle" fontSize="9" fontWeight="600" fill="#92400E">(1/6)</text>

          <text x={cx + 40} y={cy - 18} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#78350F">Makanan</text>
          <text x={cx + 40} y={cy - 5} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#78350F">Pokok</text>
          <text x={cx + 40} y={cy + 8} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#92400E">(1/3 piring)</text>

          <text x={cx + 30} y={cy + 46} textAnchor="middle" fontSize="10" fontWeight="700" fill="#991B1B">Lauk Pauk</text>
          <text x={cx + 30} y={cy + 58} textAnchor="middle" fontSize="9" fontWeight="600" fill="#991B1B">(1/6)</text>

          <rect x="304" y="62" width="112" height="118" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <text x="360" y="82" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0F172A">Keterangan</text>
          <rect x="314" y="94" width="12" height="12" rx="2" fill="#BBF7D0" stroke="#0F172A" strokeWidth="1" />
          <text x="332" y="104" fontSize="10" fill="#334155">Sayur-sayuran</text>
          <rect x="314" y="114" width="12" height="12" rx="2" fill="#FDE68A" stroke="#0F172A" strokeWidth="1" />
          <text x="332" y="124" fontSize="10" fill="#334155">Buah-buahan</text>
          <rect x="314" y="134" width="12" height="12" rx="2" fill="#FEF3C7" stroke="#0F172A" strokeWidth="1" />
          <text x="332" y="144" fontSize="10" fill="#334155">Makanan Pokok</text>
          <rect x="314" y="154" width="12" height="12" rx="2" fill="#FECACA" stroke="#0F172A" strokeWidth="1" />
          <text x="332" y="164" fontSize="10" fill="#334155">Lauk Pauk</text>
        </svg>
      );
    }

    default:
      return null;
  }
};
