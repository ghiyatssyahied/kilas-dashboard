'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin } from 'lucide-react';

/* ── Helpers ────────────────────────────────────────────── */

/** Hitung total bobot kategori (%) dari array indikators */
const getBobotPct = (indikators = []) =>
  indikators.reduce((s, i) => s + (i.bobot || 0), 0) * 100;

function getStatusColor(pct) {
  if (pct >= 100) return '#18B472';
  if (pct >= 80)  return '#C68A00';
  return '#D14545';
}

/* ── Main Score Ring ────────────────────────────────────── */

function ScoreRing({ value, max = 100 }) {
  const R  = 80;
  const CX = 100;
  const CY = 100;
  const SW = 8;
  const circumference = 2 * Math.PI * R;
  const [animated, setAnimated] = useState(0);
  const [display,  setDisplay]  = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 120);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    let frame;
    const duration  = 1400;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * ease);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const offset = circumference - (Math.min(animated, 100) / 100) * circumference;
  const pct    = (value / max) * 100;
  const stroke = pct >= 100 ? 'url(#ringGreen)' : pct >= 80 ? 'url(#ringYellow)' : 'url(#ringGold)';

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="w-[132px] h-[132px] sm:w-[168px] sm:h-[168px]"
        style={{ filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.12))' }}
      >
        <defs>
          <linearGradient id="ringGold"   x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#C9A227" />
            <stop offset="100%" stopColor="#E4B84A" />
          </linearGradient>
          <linearGradient id="ringGreen"  x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#18B472" />
            <stop offset="100%" stopColor="#0D9058" />
          </linearGradient>
          <linearGradient id="ringYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#C68A00" />
            <stop offset="100%" stopColor="#A87200" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={SW} />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(201,162,39,0.08)" strokeWidth={SW + 4} />

        {/* Progress arc */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke={stroke}
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
        />

        {/* Center text — dark for light bg */}
        <text x="50%" y="43%" dominantBaseline="middle" textAnchor="middle"
          fontSize="34" fontFamily="var(--font-dm-serif)" fill="#0A2342" style={{ letterSpacing: '-0.5px' }}>
          {display.toFixed(2)}
        </text>
        <text x="50%" y="59%" dominantBaseline="middle" textAnchor="middle"
          fontSize="11" fontFamily="var(--font-ibm-plex)" fill="#9AAAC4" fontWeight="500" letterSpacing="1">
          / {max} POIN
        </text>
      </svg>
    </div>
  );
}

/* ── Category Circular Chip ─────────────────────────────── */

function CategoryChip({ name, data, index, onClick }) {
  const bobot  = getBobotPct(data.indikators);
  const nilai  = data.total_nilai_kategori;
  const rawPct = bobot > 0 ? (nilai / bobot) * 100 : 0;
  const pct    = Math.min(rawPct, 130);   // angka ditampilkan, maks 130
  const barPct = Math.min(rawPct, 100);   // isian ring, penuh di 100
  const color  = getStatusColor(pct);
  const achieved = pct >= 100;

  const R  = 29;
  const CX = 37;
  const CY = 37;
  const SW = 5;
  const C  = 2 * Math.PI * R;
  const dashOffset = C * (1 - barPct / 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.04, y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ delay: 0.2 + index * 0.07, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer"
      onClick={onClick}
      style={{
        background: achieved ? 'rgba(24,180,114,0.06)' : '#F8FAFB',
        border: `1px solid ${achieved ? 'rgba(24,180,114,0.2)' : 'rgba(0,0,0,0.08)'}`,
      }}
    >
      {/* SVG Ring */}
      <div className="relative">
        {achieved && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(24,180,114,0.12) 0%, transparent 70%)',
              transform: 'scale(1.5)',
            }}
          />
        )}
        <svg viewBox="0 0 74 74" className="w-[74px] h-[74px] relative">
          {/* Dim track tinted */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={color} strokeWidth={SW} opacity={0.12} />
          {/* Base track */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={SW} />

          {/* Animated progress arc */}
          <motion.circle
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={color}
            strokeWidth={SW}
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 + index * 0.07 }}
            transform={`rotate(-90 ${CX} ${CY})`}
          />

          {/* Center text */}
          {achieved ? (
            <>
              <text x="50%" y="43%" dominantBaseline="middle" textAnchor="middle"
                fontSize="17" fill={color} fontFamily="var(--font-dm-serif)">
                ✓
              </text>
              <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle"
                fontSize="8" fill={color} opacity={0.85} fontFamily="var(--font-ibm-plex-mono)" fontWeight="500">
                {pct.toFixed(0)}%
              </text>
            </>
          ) : (
            <>
              <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle"
                fontSize="13" fill={color} fontFamily="var(--font-ibm-plex-mono)" fontWeight="600">
                {pct.toFixed(0)}%
              </text>
              <text x="50%" y="63%" dominantBaseline="middle" textAnchor="middle"
                fontSize="7" fill="#9AAAC4" fontFamily="var(--font-ibm-plex)">
                capaian
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Label */}
      <div className="w-full text-center space-y-0.5">
        <div className="text-[10.5px] font-medium leading-tight" style={{ color: '#4A6080' }} title={name}>
          {name}
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="font-mono font-semibold text-[11px]" style={{ color }}>
            {nilai.toFixed(2)}
          </span>
          <span className="text-[9px]" style={{ color: '#9AAAC4' }}>
            /{bobot.toFixed(0)}
          </span>
        </div>
        <div className="text-[9px]" style={{ color: '#9AAAC4' }}>
          bobot {bobot.toFixed(0)}%
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main SummaryCard ───────────────────────────────────── */

export default function SummaryCard({ data, onCategoryClick }) {
  const { meta, summary } = data;
  const categories = Object.entries(data.data);

  const achievedCount = categories.filter(([, v]) => {
    const b = getBobotPct(v.indikators);
    return b > 0 && (v.total_nilai_kategori / b) * 100 >= 100;
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-4 sm:p-6"
    >
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">

        {/* ── Left: Score Ring + Unit Info ── */}
        <div className="flex flex-col sm:flex-row xl:flex-col gap-4 xl:gap-4 xl:w-[220px] flex-shrink-0">
          <div className="flex flex-col items-center">
            <ScoreRing value={summary.total_nilai} max={summary.target_nilai} />

            <div className="mt-2 text-center">
              <div className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#9AAAC4' }}>
                Total Nilai KPI
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-3 mt-4">
              <div
                className="flex flex-col items-center px-3 py-2 rounded-lg"
                style={{ background: 'rgba(24,180,114,0.08)', border: '1px solid rgba(24,180,114,0.18)' }}
              >
                <span className="text-[18px] font-display" style={{ color: '#18B472' }}>
                  {achievedCount}
                </span>
                <span className="text-[9px] font-medium" style={{ color: '#18B472' }}>
                  Tercapai
                </span>
              </div>
              <div
                className="flex flex-col items-center px-3 py-2 rounded-lg"
                style={{ background: 'rgba(209,69,69,0.08)', border: '1px solid rgba(209,69,69,0.18)' }}
              >
                <span className="text-[18px] font-display" style={{ color: '#D14545' }}>
                  {categories.length - achievedCount}
                </span>
                <span className="text-[9px] font-medium" style={{ color: '#D14545' }}>
                  Perlu Kerja
                </span>
              </div>
            </div>
          </div>

          {/* Unit info */}
          <div className="flex-1 xl:flex-none space-y-3">
            <div>
              <h1 className="font-display text-[22px] leading-tight text-gold-gradient">
                {meta.nama_unit}
              </h1>
            </div>
            <div className="space-y-2">
              {/* <InfoRow icon={<MapPin size={11} />}     label="Posisi Data" value={meta.posisi_data} /> */}
              <InfoRow icon={<TrendingUp size={11} />} label="Unit"        value={meta.kode_unit} />
            </div>
          </div>
        </div>

        {/* ── Right: Category circular grid ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#9AAAC4' }}>
              Capaian per Kategori
            </h2>
            <div className="flex items-center gap-3 text-[9px]" style={{ color: '#9AAAC4' }}>
              <span className="flex items-center gap-1">
                <span style={{ color: '#18B472' }}>●</span> ≥100%
              </span>
              <span className="flex items-center gap-1">
                <span style={{ color: '#C68A00' }}>●</span> 80–99%
              </span>
              <span className="flex items-center gap-1">
                <span style={{ color: '#D14545' }}>●</span> &lt;80%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {categories.map(([name, katData], i) => (
              <CategoryChip
                key={name}
                name={name}
                data={katData}
                index={i}
                onClick={() => onCategoryClick?.(name)}
              />
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: '#9AAAC4' }}>{icon}</span>
      <span className="text-[10px] w-[72px] flex-shrink-0" style={{ color: '#9AAAC4' }}>
        {label}
      </span>
      <span className="text-[11px] font-medium flex-1 truncate" style={{ color: '#4A6080' }}>
        {value}
      </span>
    </div>
  );
}
