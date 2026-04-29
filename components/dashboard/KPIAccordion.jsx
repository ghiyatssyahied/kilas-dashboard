'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ArrowUpDown, ArrowUp, ArrowDown,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react';

/* ── Helpers ────────────────────────────────────────────── */

/** Hitung total bobot kategori (%) dari array indikators */
const getBobotPct = (indikators = []) =>
  indikators.reduce((s, i) => s + (i.bobot || 0), 0) * 100;

function getStatus(pct) {
  if (pct === null || pct === undefined)
    return { color: '#9AAAC4', bg: 'rgba(0,0,0,0.04)', label: 'N/A' };
  if (pct >= 100)
    return { color: '#18B472', bg: 'rgba(24,180,114,0.1)', label: 'Tercapai' };
  if (pct >= 80)
    return { color: '#C68A00', bg: 'rgba(198,138,0,0.1)', label: 'Mendekati' };
  return   { color: '#D14545', bg: 'rgba(209,69,69,0.1)', label: 'Di Bawah' };
}

function fmtNum(n, satuan) {
  if (n === null || n === undefined) return '—';
  if (satuan?.includes('Rp')) {
    if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}T`;
    if (Math.abs(n) >= 1_000)     return `${(n / 1_000).toFixed(1)}M`;
    return n.toLocaleString('id-ID');
  }
  if (Math.abs(n) >= 1_000) return n.toLocaleString('id-ID');
  return n % 1 === 0 ? n.toString() : n.toFixed(2);
}

const SORT_FIELDS = {
  no:                null,           // sort by row index — handled separately
  bobot:             'bobot',
  realisasi:         'realisasi',
  target:            'target_week',
  persen_pencapaian: 'persen_pencapaian',
  nilai:             'nilai_akhir',
};

/* ── Animated Number Counter ─────────────────────────────── */

function AnimatedNumber({ value, decimals = 2 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 900;
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

  return <>{display.toFixed(decimals)}</>;
}

/* ── Progress Bar ───────────────────────────────────────── */

function ProgressBar({ pct, color, delay = 0 }) {
  // 100% = bar penuh; nilai di atas 100% (maks 130%) tetap penuh
  const width = pct === null ? 0 : Math.min(pct, 100);
  const overTarget = pct !== null && pct >= 100;

  return (
    // Tanpa overflow-hidden agar box-shadow glow tidak terclip
    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.07)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{
          backgroundColor: color,
          maxWidth: '100%',
          boxShadow: overTarget ? `0 0 7px ${color}CC, 0 0 3px ${color}` : 'none',
          transition: 'box-shadow 0.4s ease',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.9, ease: 'easeOut', delay }}
      />
    </div>
  );
}

/* ── Sort Header ────────────────────────────────────────── */

function SortTh({ field, label, sortConfig, onSort, align = 'right' }) {
  const active = sortConfig.field === field;
  return (
    <th onClick={() => onSort(field)} className="cursor-pointer select-none" style={{ textAlign: align }}>
      <span className="inline-flex items-center gap-1" style={{ color: active ? '#C9A227' : undefined }}>
        {label}
        {active
          ? sortConfig.dir === 'asc'
            ? <ArrowUp size={11} style={{ color: '#C9A227' }} />
            : <ArrowDown size={11} style={{ color: '#C9A227' }} />
          : <ArrowUpDown size={10} style={{ opacity: 0.3 }} />
        }
      </span>
    </th>
  );
}

/* ── Indicator Row ──────────────────────────────────────── */

function IndikatorRow({ ind, rowIdx }) {
  const status = getStatus(ind.persen_pencapaian);
  const hasRealisasi = ind.realisasi !== null && ind.realisasi !== undefined;

  const TrendIcon =
    ind.persen_pencapaian >= 100 ? TrendingUp :
    ind.persen_pencapaian >= 80  ? Minus :
    TrendingDown;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rowIdx * 0.03, duration: 0.3 }}
      className="accordion-row-hover"
    >
      {/* No */}
      <td className="font-mono" style={{ color: '#9AAAC4' }}>
        {rowIdx + 1}
      </td>

      {/* Indikator */}
      <td style={{ maxWidth: 240 }}>
        <div
          className="font-medium leading-snug truncate"
          style={{ color: '#0A2342', maxWidth: 230 }}
          title={ind.indikator}
        >
          {ind.indikator}
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: '#9AAAC4' }}>
          {ind.satuan}
        </div>
      </td>

      {/* Bobot */}
      <td className="text-right font-mono text-[11px]" style={{ color: '#6A7D99' }}>
        {(ind.bobot * 100).toFixed(2)}%
      </td>

      {/* Realisasi */}
      <td className="text-right font-mono text-[12px]" style={{ color: hasRealisasi ? '#0A2342' : '#9AAAC4' }}>
        {fmtNum(ind.realisasi, ind.satuan)}
      </td>

      {/* Target — disembunyikan di mobile */}
      <td className="hidden sm:table-cell text-right font-mono text-[12px]" style={{ color: '#6A7D99' }}>
        {fmtNum(ind.target_week, ind.satuan)}
      </td>

      {/* Persen Pencapaian */}
      <td className="min-w-[140px]">
        <div className="flex items-center gap-2">
          <ProgressBar pct={ind.persen_pencapaian} color={status.color} delay={0.1} />
          <span
            className="text-[11px] font-mono font-semibold flex-shrink-0 flex items-center gap-1"
            style={{ color: status.color, minWidth: 52 }}
          >
            <TrendIcon size={10} />
            {ind.persen_pencapaian !== null ? `${ind.persen_pencapaian.toFixed(1)}%` : '—'}
          </span>
        </div>
      </td>

      {/* Nilai */}
      <td className="text-right">
        {ind.nilai_akhir !== null && ind.nilai_akhir !== undefined ? (
          <span
            className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold"
            style={{ background: status.bg, color: status.color }}
          >
            {ind.nilai_akhir.toFixed(2)}
          </span>
        ) : (
          <span className="text-[11px] font-mono" style={{ color: '#9AAAC4' }}>—</span>
        )}
      </td>
    </motion.tr>
  );
}

/* ── Category Accordion Item ────────────────────────────── */

function KategoriItem({ name, kategoriData, index, sortConfig, onSort, openSignal }) {
  const [open, setOpen] = useState(index === 0);

  // Buka dan scroll ke item ini saat sinyal cocok dengan nama kategori
  useEffect(() => {
    if (openSignal === name) {
      setOpen(true);
      setTimeout(() => {
        document
          .getElementById(`kategori-${name.replace(/\s+/g, '-')}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }, [openSignal, name]);

  const bobot       = getBobotPct(kategoriData.indikators);
  const nilai       = kategoriData.total_nilai_kategori;
  const achievement = bobot > 0 ? Math.min((nilai / bobot) * 100, 130) : 0;
  const status      = getStatus(achievement);

  const sorted = useMemo(() => {
    const field = SORT_FIELDS[sortConfig.field];
    if (!field) return [...kategoriData.indikators]; // 'no' — pakai urutan asli
    return [...kategoriData.indikators].sort((a, b) => {
      const av = a[field] ?? (sortConfig.dir === 'asc' ? Infinity : -Infinity);
      const bv = b[field] ?? (sortConfig.dir === 'asc' ? Infinity : -Infinity);
      return sortConfig.dir === 'asc' ? av - bv : bv - av;
    });
  }, [kategoriData.indikators, sortConfig]);

  const nilaiCount  = kategoriData.indikators.filter((i) => i.nilai_akhir !== null && i.nilai_akhir !== undefined).length;
  const greenCount  = kategoriData.indikators.filter((i) => i.persen_pencapaian >= 100).length;
  const yellowCount = kategoriData.indikators.filter((i) => i.persen_pencapaian >= 80 && i.persen_pencapaian < 100).length;
  const redCount    = kategoriData.indikators.filter((i) => i.persen_pencapaian < 80 && i.nilai_akhir !== null && i.nilai_akhir !== undefined).length;

  return (
    <motion.div
      id={`kategori-${name.replace(/\s+/g, '-')}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass-card overflow-hidden"
      style={{ borderLeft: '3px solid #C9A227' }}
    >
      {/* ── Header ── */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full px-5 py-4 flex items-center gap-4 transition-colors"
        style={{ borderBottom: open ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent' }}
      >
        {/* Index badge */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold font-mono"
          style={{
            background: 'rgba(201,162,39,0.1)',
            border: '1px solid rgba(201,162,39,0.2)',
            color: '#B8881E',
          }}
        >
          {index + 1}
        </div>

        {/* Name + meta */}
        <div className="flex-1 text-left">
          <div className="font-display text-[15px] leading-tight" style={{ color: '#0A2342' }}>
            {name}
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-[10px]" style={{ color: '#9AAAC4' }}>
              Bobot: <span style={{ color: '#6A7D99' }}>{bobot.toFixed(0)}%</span>
            </span>
            <span className="text-[10px]" style={{ color: '#9AAAC4' }}>
              Aktif: <span style={{ color: '#6A7D99' }}>{nilaiCount}/{kategoriData.indikators.length}</span>
            </span>
            <div className="flex gap-1">
              {greenCount > 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
                  style={{ background: 'rgba(24,180,114,0.1)', color: '#18B472' }}>
                  ✓{greenCount}
                </span>
              )}
              {yellowCount > 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
                  style={{ background: 'rgba(198,138,0,0.1)', color: '#C68A00' }}>
                  ~{yellowCount}
                </span>
              )}
              {redCount > 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
                  style={{ background: 'rgba(209,69,69,0.1)', color: '#D14545' }}>
                  ✗{redCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nilai + progress */}
        <div className="hidden md:flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px]" style={{ color: '#9AAAC4' }}>Nilai</div>
            <div className="font-display text-[18px] leading-none mt-0.5 tabular-nums" style={{ color: status.color }}>
              <AnimatedNumber value={nilai} />
            </div>
          </div>
          <div className="w-28">
            <div className="flex justify-between text-[10px] mb-1.5">
              <span style={{ color: '#9AAAC4' }}>Capaian</span>
              <span className="tabular-nums" style={{ color: status.color }}>
                <AnimatedNumber value={achievement} decimals={1} />%
              </span>
            </div>
            <ProgressBar pct={achievement} color={status.color} />
          </div>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          style={{ color: '#9AAAC4' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* ── Table ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full kpi-table">
                <thead>
                  <tr>
                    <SortTh field="no"                label="#"         sortConfig={sortConfig} onSort={onSort} align="left" />
                    <th style={{ textAlign: 'left', minWidth: 160 }}>Indikator</th>
                    <SortTh field="bobot"             label="Bobot"     sortConfig={sortConfig} onSort={onSort} />
                    <SortTh field="realisasi"         label="Realisasi" sortConfig={sortConfig} onSort={onSort} />
                    <th className="hidden sm:table-cell" style={{ textAlign: 'right' }}>
                      <span className="inline-flex items-center gap-1 cursor-pointer" onClick={() => onSort('target')}>
                        Target
                        {sortConfig.field === 'target'
                          ? sortConfig.dir === 'asc' ? <span style={{color:'#C9A227',fontSize:11}}>↑</span> : <span style={{color:'#C9A227',fontSize:11}}>↓</span>
                          : <span style={{opacity:0.3,fontSize:11}}>↕</span>}
                      </span>
                    </th>
                    <th style={{ minWidth: 140 }}>% Pencapaian</th>
                    <SortTh field="nilai"             label="Nilai"     sortConfig={sortConfig} onSort={onSort} />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((ind, ri) => (
                    <IndikatorRow key={ri} ind={ind} rowIdx={ri} />
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(0,0,0,0.05)', background: '#FAFBFC' }}
            >
              <span className="text-[10px]" style={{ color: '#9AAAC4' }}>
                Klik header kolom untuk mengurutkan
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[11px]" style={{ color: '#6A7D99' }}>
                  Total Nilai Kategori:
                </span>
                <span className="font-display text-[14px]" style={{ color: status.color }}>
                  {nilai.toFixed(2)}{' '}
                  <span style={{ fontSize: 10, color: '#9AAAC4' }}>/ {bobot.toFixed(2)}</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main KPIAccordion ──────────────────────────────────── */

export default function KPIAccordion({ data, openSignal }) {
  const [sortConfig, setSortConfig] = useState({ field: 'no', dir: 'asc' });

  const handleSort = useCallback((field) => {
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const categories = Object.entries(data);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl" style={{ color: '#0A2342' }}>
          Detail KPI per Kategori
        </h2>
        <span className="text-[10px]" style={{ color: '#9AAAC4' }}>
          {categories.length} kategori
        </span>
      </div>

      {categories.map(([name, katData], idx) => (
        <KategoriItem
          key={name}
          name={name}
          kategoriData={katData}
          index={idx}
          sortConfig={sortConfig}
          onSort={handleSort}
          openSignal={openSignal}
        />
      ))}
    </div>
  );
}
