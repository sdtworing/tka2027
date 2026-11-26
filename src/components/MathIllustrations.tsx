import React from 'react';

interface IllustrationProps {
  id: string;
  data?: Record<string, unknown>;
}

const AnalogClockSvg: React.FC<{
  cx: number;
  cy: number;
  r: number;
  hour: number;
  minute: number;
  label?: string;
  highlightAngle?: boolean;
}> = ({ cx, cy, r, hour, minute, label, highlightAngle }) => {
  const minuteDeg = minute * 6;
  const hourDeg = ((hour % 12) + minute / 60) * 30;
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  const hX = cx + Math.cos(rad(hourDeg)) * (r * 0.52);
  const hY = cy + Math.sin(rad(hourDeg)) * (r * 0.52);
  const mX = cx + Math.cos(rad(minuteDeg)) * (r * 0.74);
  const mY = cy + Math.sin(rad(minuteDeg)) * (r * 0.74);

  const sectorEndX = cx + Math.cos(rad(hourDeg)) * (r * 0.42);
  const sectorEndY = cy + Math.sin(rad(hourDeg)) * (r * 0.42);
  const sectorStartX = cx;
  const sectorStartY = cy - r * 0.42;
  const largeArc = hourDeg > 180 ? 1 : 0;

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r - 6} fill="none" stroke="#E2E8F0" strokeWidth="1" />
      {highlightAngle && (
        <path
          d={`M ${cx} ${cy} L ${sectorStartX} ${sectorStartY} A ${r * 0.42} ${r * 0.42} 0 ${largeArc} 1 ${sectorEndX} ${sectorEndY} Z`}
          fill="#F59E0B"
          fillOpacity="0.28"
          stroke="#D97706"
          strokeWidth="1.5"
        />
      )}
      {Array.from({ length: 12 }).map((_, i) => {
        const num = i === 0 ? 12 : i;
        const a = rad(i * 30);
        const tx = cx + Math.cos(a) * (r * 0.78);
        const ty = cy + Math.sin(a) * (r * 0.78);
        const tick1X = cx + Math.cos(a) * (r * 0.91);
        const tick1Y = cy + Math.sin(a) * (r * 0.91);
        const tick2X = cx + Math.cos(a) * r;
        const tick2Y = cy + Math.sin(a) * r;
        return (
          <g key={num}>
            <line x1={tick1X} y1={tick1Y} x2={tick2X} y2={tick2Y} stroke="#334155" strokeWidth="2" />
            <text
              x={tx}
              y={ty + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#0F172A"
            >
              {num}
            </text>
          </g>
        );
      })}
      <line x1={cx} y1={cy} x2={hX} y2={hY} stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mX} y2={mY} stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4.5" fill="#0F172A" />
      {label && (
        <text x={cx} y={cy + r + 24} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1E293B">
          {label}
        </text>
      )}
    </g>
  );
};

export const MathIllustration: React.FC<IllustrationProps> = ({ id, data = {} }) => {
  switch (id) {
    case 'math-q1': {
      const rows = (data.rows as number) ?? 3;
      const cols = (data.cols as number) ?? 4;
      const shaded = (data.shaded as number) ?? 5;
      const size = Math.min(56, Math.floor(240 / cols), Math.floor(170 / rows));
      const totalW = cols * size;
      const totalH = rows * size;
      const startX = (320 - totalW) / 2;
      const startY = (220 - totalH) / 2;

      return (
        <svg viewBox="0 0 320 220" className="w-full max-w-[340px] mx-auto" role="img" aria-label={`Persegi panjang terbagi menjadi ${rows * cols} bagian sama besar dengan ${shaded} bagian diarsir`}>
          <rect x="0" y="0" width="320" height="220" rx="12" fill="#F8FAFC" />
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const index = r * cols + c;
              const isShaded = index < shaded;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={startX + c * size}
                  y={startY + r * size}
                  width={size}
                  height={size}
                  fill={isShaded ? '#0284C7' : '#FFFFFF'}
                  stroke="#0F172A"
                  strokeWidth="2.5"
                />
              );
            })
          )}
        </svg>
      );
    }

    case 'math-q7': {
      const mul = (data.mul as number) ?? 5;
      const sub = (data.sub as number) ?? 30;
      const div = (data.div as number) ?? 6;
      return (
        <svg viewBox="0 0 560 150" className="w-full max-w-[560px] mx-auto" role="img" aria-label="Diagram alir operasi hitung bilangan">
          <rect x="0" y="0" width="560" height="150" rx="12" fill="#F8FAFC" />
          <rect x="16" y="45" width="96" height="60" rx="28" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.2" />
          <text x="64" y="71" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E3A8A">Bilangan</text>
          <text x="64" y="88" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E3A8A">Awal</text>

          <line x1="112" y1="75" x2="138" y2="75" stroke="#334155" strokeWidth="2.2" />
          <polygon points="136,70 146,75 136,80" fill="#334155" />

          <rect x="148" y="45" width="84" height="60" rx="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <text x="190" y="68" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748B">Langkah 1</text>
          <text x="190" y="88" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0F172A">× {mul}</text>

          <line x1="232" y1="75" x2="258" y2="75" stroke="#334155" strokeWidth="2.2" />
          <polygon points="256,70 266,75 256,80" fill="#334155" />

          <rect x="268" y="45" width="84" height="60" rx="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <text x="310" y="68" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748B">Langkah 2</text>
          <text x="310" y="88" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0F172A">− {sub}</text>

          <line x1="352" y1="75" x2="378" y2="75" stroke="#334155" strokeWidth="2.2" />
          <polygon points="376,70 386,75 376,80" fill="#334155" />

          <rect x="388" y="45" width="76" height="60" rx="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <text x="426" y="68" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748B">Langkah 3</text>
          <text x="426" y="88" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0F172A">: {div}</text>

          <line x1="464" y1="75" x2="484" y2="75" stroke="#334155" strokeWidth="2.2" />
          <polygon points="482,70 492,75 482,80" fill="#334155" />

          <rect x="494" y="45" width="52" height="60" rx="26" fill="#ECFDF5" stroke="#059669" strokeWidth="2.2" />
          <text x="520" y="72" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065F46">Hasil</text>
          <text x="520" y="87" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065F46">Akhir</text>
        </svg>
      );
    }

    case 'math-q14': {
      const variant = (data.variant as number) ?? 0;
      if (variant === 1) {
        // Segitiga siku-siku (I), Persegi (II), Jajaran genjang (III)
        return (
          <svg viewBox="0 0 380 230" className="w-full max-w-[380px] mx-auto" role="img" aria-label="Bangun segi banyak tersusun dari segitiga siku-siku, persegi, dan jajaran genjang">
            <rect x="0" y="0" width="380" height="230" rx="12" fill="#F8FAFC" />
            <polygon points="55,180 120,90 120,180" fill="#DBEAFE" />
            <rect x="120" y="90" width="90" height="90" fill="#E0F2FE" />
            <polygon points="210,90 305,90 275,180 210,180" fill="#FEF3C7" />
            <line x1="120" y1="90" x2="120" y2="180" stroke="#0F172A" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="210" y1="90" x2="210" y2="180" stroke="#0F172A" strokeWidth="2" strokeDasharray="6 4" />
            <polygon
              points="55,180 120,90 305,90 275,180"
              fill="none"
              stroke="#0F172A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <text x="98" y="152" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1E3A8A">I</text>
            <text x="165" y="140" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0369A1">II</text>
            <text x="248" y="140" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400E">III</text>
          </svg>
        );
      }
      if (variant === 2) {
        // Trapesium sama kaki (I, atas), Persegi panjang (II, tengah), Segitiga siku-siku (III, kanan)
        return (
          <svg viewBox="0 0 380 230" className="w-full max-w-[380px] mx-auto" role="img" aria-label="Bangun segi banyak tersusun dari trapesium sama kaki, persegi panjang, dan segitiga siku-siku">
            <rect x="0" y="0" width="380" height="230" rx="12" fill="#F8FAFC" />
            <polygon points="95,45 195,45 225,105 65,105" fill="#FEF3C7" />
            <rect x="65" y="105" width="160" height="80" fill="#E0F2FE" />
            <polygon points="225,105 310,185 225,185" fill="#DBEAFE" />
            <line x1="65" y1="105" x2="225" y2="105" stroke="#0F172A" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="225" y1="105" x2="225" y2="185" stroke="#0F172A" strokeWidth="2" strokeDasharray="6 4" />
            <polygon
              points="95,45 195,45 225,105 310,185 65,185 65,105"
              fill="none"
              stroke="#0F172A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <text x="145" y="82" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400E">I</text>
            <text x="145" y="150" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0369A1">II</text>
            <text x="255" y="162" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1E3A8A">III</text>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 380 230" className="w-full max-w-[380px] mx-auto" role="img" aria-label="Bangun segi banyak tersusun dari segitiga sama kaki, persegi panjang, dan trapesium siku-siku">
          <rect x="0" y="0" width="380" height="230" rx="12" fill="#F8FAFC" />
          <polygon points="70,105 140,35 210,105" fill="#DBEAFE" />
          <rect x="70" y="105" width="140" height="85" fill="#E0F2FE" />
          <polygon points="210,105 265,105 315,190 210,190" fill="#FEF3C7" />
          <line x1="70" y1="105" x2="210" y2="105" stroke="#0F172A" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="210" y1="105" x2="210" y2="190" stroke="#0F172A" strokeWidth="2" strokeDasharray="6 4" />
          <polygon
            points="140,35 210,105 265,105 315,190 70,190 70,105"
            fill="none"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <text x="140" y="85" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1E3A8A">I</text>
          <text x="140" y="153" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0369A1">II</text>
          <text x="248" y="158" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400E">III</text>
        </svg>
      );
    }

    case 'math-q15': {
      const alasLabel = (data.alas as string) ?? '3';
      const labels = (data.labels as string[]) ?? ['1', '2', '3', '4', '5', '6'];
      const s = 54;
      const ox = 72;
      const oy = 18;
      const cells = [
        { c: 1, r: 0, label: labels[0] },
        { c: 0, r: 1, label: labels[1] },
        { c: 1, r: 1, label: labels[2] },
        { c: 2, r: 1, label: labels[3] },
        { c: 3, r: 1, label: labels[4] },
        { c: 1, r: 2, label: labels[5] },
      ];
      return (
        <svg viewBox="0 0 360 200" className="w-full max-w-[360px] mx-auto" role="img" aria-label="Jaring-jaring kubus">
          <rect x="0" y="0" width="360" height="200" rx="12" fill="#F8FAFC" />
          {cells.map((cell) => {
            const isAlas = cell.label === alasLabel;
            return (
              <g key={cell.label}>
                <rect
                  x={ox + cell.c * s}
                  y={oy + cell.r * s}
                  width={s}
                  height={s}
                  fill={isAlas ? '#DBEAFE' : '#FFFFFF'}
                  stroke="#0F172A"
                  strokeWidth="2.2"
                />
                <text
                  x={ox + cell.c * s + s / 2}
                  y={oy + cell.r * s + s / 2 + 5}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="700"
                  fill="#0F172A"
                >
                  {cell.label}
                </text>
                {isAlas && (
                  <text
                    x={ox + cell.c * s + s / 2}
                    y={oy + cell.r * s + s - 6}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="#1D4ED8"
                  >
                    (Alas)
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      );
    }

    case 'math-q17': {
      const variant = (data.variant as number) ?? 0;
      const s = 26;
      const dx = s * 0.866;
      const dy = s * 0.5;
      const originX = 175;
      const originY = 105;

      const p = (x: number, y: number, z: number) => [
        originX + (x - y) * dx,
        originY + (x + y) * dy - z * s,
      ];

      const cubes: Array<{ x: number; y: number; z: number }> = [];
      if (variant === 1) {
        // 3x3 (9) + 3x2 (6) + 2x1 (2) = 17 cubes
        for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) cubes.push({ x, y, z: 0 });
        for (let x = 0; x < 3; x++) for (let y = 0; y < 2; y++) cubes.push({ x, y, z: 1 });
        for (let x = 0; x < 2; x++) cubes.push({ x, y: 0, z: 2 });
      } else if (variant === 2) {
        // 4x3 (12) + 2x2 (4) = 16 cubes
        for (let x = 0; x < 4; x++) for (let y = 0; y < 3; y++) cubes.push({ x, y, z: 0 });
        for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) cubes.push({ x, y, z: 1 });
      } else if (variant === 3) {
        // 3x3 (9) + 2x2 (4) + 2x1 (2) = 15 cubes
        for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) cubes.push({ x, y, z: 0 });
        for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) cubes.push({ x, y, z: 1 });
        for (let x = 0; x < 2; x++) cubes.push({ x, y: 0, z: 2 });
      } else {
        // Default: 3x3 (9) + 2x2 (4) + 1x1 (1) = 14 cubes
        for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) cubes.push({ x, y, z: 0 });
        for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) cubes.push({ x, y, z: 1 });
        cubes.push({ x: 0, y: 0, z: 2 });
      }

      cubes.sort((a, b) => a.x + a.y - (b.x + b.y) || a.z - b.z);
      const pts = (arr: number[][]) => arr.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');

      return (
        <svg viewBox="0 0 350 230" className="w-full max-w-[350px] mx-auto" role="img" aria-label="Susunan bangun kubus satuan 3 dimensi">
          <rect x="0" y="0" width="350" height="230" rx="12" fill="#F8FAFC" />
          {cubes.map(({ x, y, z }) => {
            const top = pts([p(x, y, z + 1), p(x + 1, y, z + 1), p(x + 1, y + 1, z + 1), p(x, y + 1, z + 1)]);
            const left = pts([p(x, y + 1, z), p(x + 1, y + 1, z), p(x + 1, y + 1, z + 1), p(x, y + 1, z + 1)]);
            const right = pts([p(x + 1, y, z), p(x + 1, y + 1, z), p(x + 1, y + 1, z + 1), p(x + 1, y, z + 1)]);
            return (
              <g key={`${x}-${y}-${z}`}>
                <polygon points={top} fill="#BAE6FD" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
                <polygon points={left} fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
                <polygon points={right} fill="#0284C7" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'math-q18': {
      const kgCount = (data.kgCount as number) ?? 2;
      const leftGrams = (data.leftGrams as number) ?? 500;
      const bagCount = (data.bagCount as number) ?? 3;
      const rightGrams = (data.rightGrams as number) ?? 400;
      const bagLabel = (data.bagLabel as string) ?? 'T';

      return (
        <svg viewBox="0 0 460 220" className="w-full max-w-[460px] mx-auto" role="img" aria-label="Neraca dua lengan dalam keadaan setimbang">
          <rect x="0" y="0" width="460" height="220" rx="12" fill="#F8FAFC" />
          <polygon points="190,202 270,202 252,186 208,186" fill="#475569" />
          <rect x="225" y="128" width="10" height="60" fill="#64748B" />
          <line x1="90" y1="128" x2="370" y2="128" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
          <circle cx="230" cy="128" r="7" fill="#0F172A" />

          {/* Left Pan */}
          <line x1="90" y1="128" x2="90" y2="152" stroke="#475569" strokeWidth="2.5" />
          <rect x="22" y="152" width="136" height="8" rx="4" fill="#334155" />
          {Array.from({ length: kgCount }).map((_, idx) => {
            const x = 28 + idx * 36;
            return (
              <g key={idx}>
                <rect x={x} y="114" width="33" height="38" rx="4" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.8" />
                <text x={x + 16.5} y="137" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0F172A">1 kg</text>
              </g>
            );
          })}
          {leftGrams > 0 && (
            <g>
              <rect x={28 + kgCount * 36} y="124" width="38" height="28" rx="4" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.8" />
              <text x={47 + kgCount * 36} y="142" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0F172A">{leftGrams} g</text>
            </g>
          )}

          {/* Right Pan */}
          <line x1="370" y1="128" x2="370" y2="152" stroke="#475569" strokeWidth="2.5" />
          <rect x="280" y="152" width="164" height="8" rx="4" fill="#334155" />
          {Array.from({ length: bagCount }).map((_, i) => {
            const bx = 286 + i * 33;
            return (
              <g key={i}>
                <path d={`M ${bx + 4} 122 L ${bx + 25} 122 L ${bx + 29} 152 L ${bx} 152 Z`} fill="#FEF3C7" stroke="#B45309" strokeWidth="1.8" />
                <text x={bx + 14.5} y="142" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#92400E">{bagLabel}</text>
              </g>
            );
          })}
          {rightGrams > 0 && (
            <g>
              <rect x={288 + bagCount * 33} y="124" width="38" height="28" rx="4" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.8" />
              <text x={307 + bagCount * 33} y="142" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0F172A">{rightGrams} g</text>
            </g>
          )}
        </svg>
      );
    }

    case 'math-q19': {
      const startH = (data.startH as number) ?? 8;
      const startM = (data.startM as number) ?? 15;
      const endH = (data.endH as number) ?? 10;
      const endM = (data.endM as number) ?? 40;
      const startLabel = (data.startLabel as string) ?? 'Waktu Mulai (Pagi)';
      const endLabel = (data.endLabel as string) ?? 'Waktu Selesai (Pagi)';
      return (
        <svg viewBox="0 0 420 210" className="w-full max-w-[420px] mx-auto" role="img" aria-label="Dua jam analog menunjukkan waktu mulai dan waktu selesai">
          <rect x="0" y="0" width="420" height="210" rx="12" fill="#F8FAFC" />
          <AnalogClockSvg cx={115} cy={92} r={72} hour={startH} minute={startM} label={startLabel} />
          <AnalogClockSvg cx={305} cy={92} r={72} hour={endH} minute={endM} label={endLabel} />
        </svg>
      );
    }

    case 'math-q20': {
      const topW = (data.topW as number) ?? 8;
      const innerV = (data.innerV as number) ?? 5;
      const innerH = (data.innerH as number) ?? 10;
      const rightV = (data.rightV as number) ?? 7;
      const bottomW = topW + innerH;
      const leftV = innerV + rightV;

      return (
        <svg viewBox="0 0 360 205" className="w-full max-w-[360px] mx-auto" role="img" aria-label="Bangun segi banyak tidak beraturan dengan panjang sisi diketahui">
          <rect x="0" y="0" width="360" height="205" rx="12" fill="#F8FAFC" />
          <polygon
            points="85,35 165,35 165,85 265,85 265,155 85,155"
            fill="#E0F2FE"
            stroke="#0F172A"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <polyline points="85,45 95,45 95,35" fill="none" stroke="#475569" strokeWidth="1.5" />
          <polyline points="85,145 95,145 95,155" fill="none" stroke="#475569" strokeWidth="1.5" />
          <polyline points="255,155 255,145 265,145" fill="none" stroke="#475569" strokeWidth="1.5" />
          <polyline points="255,85 255,95 265,95" fill="none" stroke="#475569" strokeWidth="1.5" />

          <text x="125" y="26" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">{topW} cm</text>
          <text x="188" y="64" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">{innerV} cm</text>
          <text x="215" y="77" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">{innerH} cm</text>
          <text x="292" y="124" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">{rightV} cm</text>
          <text x="175" y="176" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">{bottomW} cm</text>
          <text x="58" y="100" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">{leftV} cm</text>
        </svg>
      );
    }

    case 'math-q21': {
      const b1 = (data.b1 as number) ?? 8;
      const h1 = (data.h1 as number) ?? 6;
      const b2 = (data.b2 as number) ?? 10;
      const h2 = (data.h2 as number) ?? 8;
      const b3 = (data.b3 as number) ?? 8;
      const h3 = (data.h3 as number) ?? 6;

      return (
        <svg viewBox="0 0 340 210" className="w-full max-w-[360px] mx-auto" role="img" aria-label="Gabungan tiga bangun segitiga dengan alas dan tinggi diketahui">
          <rect x="0" y="0" width="340" height="210" rx="12" fill="#F8FAFC" />
          <polygon points="40,168 80,90 120,168" fill="#DBEAFE" stroke="#0F172A" strokeWidth="2.4" strokeLinejoin="round" />
          <polygon points="120,168 170,55 220,168" fill="#BAE6FD" stroke="#0F172A" strokeWidth="2.4" strokeLinejoin="round" />
          <polygon points="220,168 260,90 300,168" fill="#DBEAFE" stroke="#0F172A" strokeWidth="2.4" strokeLinejoin="round" />

          <line x1="80" y1="90" x2="80" y2="168" stroke="#DC2626" strokeWidth="1.8" strokeDasharray="4 3" />
          <line x1="170" y1="55" x2="170" y2="168" stroke="#DC2626" strokeWidth="1.8" strokeDasharray="4 3" />
          <line x1="260" y1="90" x2="260" y2="168" stroke="#DC2626" strokeWidth="1.8" strokeDasharray="4 3" />

          <text x="64" y="135" fontSize="11" fontWeight="700" fill="#B91C1C">{h1} cm</text>
          <text x="150" y="118" fontSize="11" fontWeight="700" fill="#B91C1C">{h2} cm</text>
          <text x="266" y="135" fontSize="11" fontWeight="700" fill="#B91C1C">{h3} cm</text>

          <text x="80" y="188" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">{b1} cm</text>
          <text x="170" y="188" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">{b2} cm</text>
          <text x="260" y="188" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F172A">{b3} cm</text>
        </svg>
      );
    }

    case 'math-q23': {
      const variant = (data.variant as number) ?? 0;
      const polyPts = (cx: number, cy: number, r: number, sides: number, offsetDeg = 0) =>
        Array.from({ length: sides })
          .map((_, i) => {
            const a = ((i * (360 / sides) + offsetDeg) * Math.PI) / 180;
            return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
          })
          .join(' ');

      if (variant === 1) {
        // Gambar 1: Rambu Stop Segidelapan, Gambar 2: Papan Catur/Bingkai Persegi, Gambar 3: Layang-layang/Belah Ketupat
        return (
          <svg viewBox="0 0 460 170" className="w-full max-w-[460px] mx-auto" role="img" aria-label="Tiga gambar benda berbentuk segidelapan, persegi, dan belah ketupat">
            <rect x="0" y="0" width="460" height="170" rx="12" fill="#F8FAFC" />
            <polygon points={polyPts(80, 72, 46, 8, 22.5)} fill="#EF4444" stroke="#7F1D1D" strokeWidth="3.5" strokeLinejoin="round" />
            <text x="80" y="78" textAnchor="middle" fontSize="16" fontWeight="800" fill="#FFFFFF">STOP</text>
            <text x="80" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1E293B">Gambar 1</text>

            <rect x="186" y="28" width="88" height="88" rx="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="3.5" />
            <rect x="200" y="42" width="60" height="60" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            <text x="230" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1E293B">Gambar 2</text>

            <polygon points="380,24 426,72 380,120 334,72" fill="#BAE6FD" stroke="#0369A1" strokeWidth="3.5" strokeLinejoin="round" />
            <text x="380" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1E293B">Gambar 3</text>
          </svg>
        );
      }

      return (
        <svg viewBox="0 0 460 170" className="w-full max-w-[460px] mx-auto" role="img" aria-label="Tiga gambar benda berbentuk segitiga, lingkaran, dan segienam">
          <rect x="0" y="0" width="460" height="170" rx="12" fill="#F8FAFC" />
          <polygon points="80,26 30,115 130,115" fill="#FDE047" stroke="#DC2626" strokeWidth="5" strokeLinejoin="round" />
          <text x="80" y="96" textAnchor="middle" fontSize="34" fontWeight="800" fill="#0F172A">!</text>
          <text x="80" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1E293B">Gambar 1</text>

          <circle cx="230" cy="72" r="46" fill="#FFFFFF" stroke="#0284C7" strokeWidth="5" />
          <line x1="230" y1="72" x2="230" y2="44" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <line x1="230" y1="72" x2="250" y2="72" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="230" cy="72" r="3" fill="#0F172A" />
          <text x="230" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1E293B">Gambar 2</text>

          <polygon points={polyPts(380, 72, 46, 6)} fill="#A7F3D0" stroke="#047857" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points={polyPts(380, 72, 28, 6)} fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="380" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1E293B">Gambar 3</text>
        </svg>
      );
    }

    case 'math-q25': {
      const hour = (data.hour as number) ?? 4;
      const padded = String(hour).padStart(2, '0');
      return (
        <svg viewBox="0 0 240 210" className="w-full max-w-[240px] mx-auto" role="img" aria-label={`Jam analog menunjukkan pukul ${padded}.00 dengan sudut terkecil diarsir`}>
          <rect x="0" y="0" width="240" height="210" rx="12" fill="#F8FAFC" />
          <AnalogClockSvg cx={120} cy={95} r={76} hour={hour} minute={0} label={`Pukul ${padded}.00`} highlightAngle />
        </svg>
      );
    }

    case 'math-q26': {
      const title = (data.title as string) ?? 'Pengunjung Perpustakaan SD Harapan';
      const ticks = (data.ticks as Array<{ label: string; y: number }>) ?? [
        { label: '50', y: 40 },
        { label: '40', y: 75 },
        { label: '20', y: 110 },
        { label: '10', y: 145 },
        { label: '0', y: 180 },
      ];
      const bars = (data.bars as Array<{ day: string; val: number; y: number }>) ?? [
        { day: 'Senin', val: 20, y: 110 },
        { day: 'Selasa', val: 35, y: 84 },
        { day: 'Rabu', val: 25, y: 101 },
        { day: 'Kamis', val: 40, y: 75 },
      ];
      return (
        <svg viewBox="0 0 420 225" className="w-full max-w-[420px] mx-auto" role="img" aria-label={title}>
          <rect x="0" y="0" width="420" height="225" rx="12" fill="#F8FAFC" />
          <text x="220" y="22" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#0F172A">
            {title}
          </text>
          {ticks.map((t) => (
            <g key={t.label}>
              <line x1="65" y1={t.y} x2="390" y2={t.y} stroke="#CBD5E1" strokeWidth="1" strokeDasharray={t.label === '0' ? undefined : '3 3'} />
              <text x="55" y={t.y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#334155">
                {t.label}
              </text>
            </g>
          ))}
          <line x1="65" y1="35" x2="65" y2="180" stroke="#0F172A" strokeWidth="2" />
          <line x1="65" y1="180" x2="390" y2="180" stroke="#0F172A" strokeWidth="2" />
          {bars.map((b, i) => {
            const x = 95 + i * 74;
            return (
              <g key={b.day}>
                <rect x={x} y={b.y} width="42" height={180 - b.y} rx="3" fill="#0284C7" />
                <text x={x + 21} y={b.y - 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                  {b.val}
                </text>
                <text x={x + 21} y="198" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#334155">
                  {b.day}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    case 'math-q29': {
      const title = (data.title as string) ?? 'Ekstrakurikuler Pilihan Siswa Kelas VI';
      const bars = (data.bars as Array<{ name: string; val: number }>) ?? [
        { name: 'Pramuka', val: 18 },
        { name: 'Futsal', val: 14 },
        { name: 'Tari', val: 10 },
        { name: 'Melukis', val: 8 },
      ];
      const colors = ['#0284C7', '#0EA5E9', '#38BDF8', '#7DD3FC'];
      const maxVal = Math.max(20, ...bars.map((b) => Math.ceil(b.val / 5) * 5));
      const scaleStep = maxVal <= 20 ? 5 : 10;
      const ticks: number[] = [];
      for (let v = 0; v <= maxVal; v += scaleStep) ticks.push(v);
      const pxPerUnit = 132 / maxVal;

      return (
        <svg viewBox="0 0 420 220" className="w-full max-w-[420px] mx-auto" role="img" aria-label={title}>
          <rect x="0" y="0" width="420" height="220" rx="12" fill="#F8FAFC" />
          <text x="220" y="22" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#0F172A">
            {title}
          </text>
          {ticks.map((v) => {
            const y = 178 - v * pxPerUnit;
            return (
              <g key={v}>
                <line x1="65" y1={y} x2="390" y2={y} stroke="#CBD5E1" strokeWidth="1" strokeDasharray={v === 0 ? undefined : '3 3'} />
                <text x="55" y={y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#334155">
                  {v}
                </text>
              </g>
            );
          })}
          <line x1="65" y1="40" x2="65" y2="178" stroke="#0F172A" strokeWidth="2" />
          <line x1="65" y1="178" x2="390" y2="178" stroke="#0F172A" strokeWidth="2" />
          {bars.map((b, i) => {
            const x = 92 + i * 74;
            const h = b.val * pxPerUnit;
            const y = 178 - h;
            return (
              <g key={b.name}>
                <rect x={x} y={y} width="44" height={h} rx="3" fill={colors[i % colors.length]} stroke="#0369A1" strokeWidth="1" />
                <text x={x + 22} y={y - 5} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#0F172A">
                  {b.val}
                </text>
                <text x={x + 22} y="196" textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155">
                  {b.name}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    case 'math-q30': {
      const title = (data.title as string) ?? 'Hasil Panen Jagung Desa Makmur (Ton)';
      const bars = (data.bars as Array<{ year: string; val: number }>) ?? [
        { year: '2021', val: 35 },
        { year: '2022', val: 45 },
        { year: '2023', val: 40 },
        { year: '2024', val: 55 },
        { year: '2025', val: 50 },
      ];
      const maxVal = Math.max(60, ...bars.map((b) => Math.ceil(b.val / 10) * 10));
      const pxPerUnit = 140 / maxVal;
      const ticks: number[] = [];
      for (let v = 0; v <= maxVal; v += 10) ticks.push(v);

      return (
        <svg viewBox="0 0 440 230" className="w-full max-w-[440px] mx-auto" role="img" aria-label={title}>
          <rect x="0" y="0" width="440" height="230" rx="12" fill="#F8FAFC" />
          <text x="230" y="22" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#0F172A">
            {title}
          </text>
          {ticks.map((v) => {
            const y = 188 - v * pxPerUnit;
            return (
              <g key={v}>
                <line x1="60" y1={y} x2="410" y2={y} stroke="#CBD5E1" strokeWidth="1" strokeDasharray={v === 0 ? undefined : '3 3'} />
                <text x="50" y={y + 4} textAnchor="end" fontSize="10.5" fontWeight="600" fill="#334155">
                  {v}
                </text>
              </g>
            );
          })}
          <line x1="60" y1="42" x2="60" y2="188" stroke="#0F172A" strokeWidth="2" />
          <line x1="60" y1="188" x2="410" y2="188" stroke="#0F172A" strokeWidth="2" />
          {bars.map((b, i) => {
            const x = 82 + i * 65;
            const h = b.val * pxPerUnit;
            const y = 188 - h;
            return (
              <g key={b.year}>
                <rect x={x} y={y} width="38" height={h} rx="3" fill="#059669" />
                <text x={x + 19} y={y - 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                  {b.val}
                </text>
                <text x={x + 19} y="206" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#334155">
                  {b.year}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    default:
      return null;
  }
};
