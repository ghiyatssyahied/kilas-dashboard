'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { RefreshCw, Clock, Wifi, WifiOff, Building2, X, ChevronDown } from 'lucide-react';
import { CABANG_LIST } from '@/services/kpiService';

const NAV_ITEMS = [
  'Retail Funding', 'Wealth', 'TB Retail', 'TB Wholesale',
  'SME', 'Cons Loan', 'KUM KUR', 'KSM', 'Credit Card',
];

export default function Sidebar({ isOpen, onClose, onRefresh, loading, lastUpdated, error, data, selectedUnit, onUnitChange }) {
  const meta = data?.meta;

  const scrollToKategori = (name) => {
    onClose?.(); // tutup drawer di mobile
    setTimeout(() => {
      document
        .getElementById(`kategori-${name.replace(/\s+/g, '-')}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 320); // tunggu animasi drawer tutup
  };

  const statusOk = !error && !loading && !!data;

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-[272px] flex flex-col z-40 overflow-hidden
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          background: '#FFFFFF',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Gold accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, #C9A227, #E4B84A, #C9A227)' }}
        />

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: '#9AAAC4' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <X size={16} />
        </button>

        <div className="flex flex-col h-full pt-[3px] overflow-y-auto">
          {/* ── Brand ── */}
          <div className="px-6 pt-6 pb-5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="KILAS Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                  priority
                />
              </div>
              <div>
                <div className="font-display text-[18px] leading-tight tracking-wide" style={{ color: '#0A2342' }}>
                  KILAS
                </div>
                <div className="text-[10px] font-medium tracking-widest uppercase mt-0.5" style={{ color: '#9AAAC4' }}>
                  Performance Dashboard
                </div>
              </div>
            </div>
          </div>

          <div className="mx-6 flex-shrink-0" style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

          {/* ── Pilih Cabang ── */}
          <div className="px-6 py-4 flex-shrink-0">
            <div
              className="text-[10px] font-semibold tracking-widest uppercase mb-2"
              style={{ color: '#9AAAC4' }}
            >
              Pilih Cabang
            </div>
            <div className="relative">
              <select
                value={selectedUnit}
                onChange={(e) => onUnitChange(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2.5 pr-8 rounded-lg text-[11px] font-medium appearance-none focus:outline-none focus:ring-1"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: '#0A2342',
                  opacity: loading ? 0.55 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  focusRingColor: '#C9A227',
                }}
              >
                {CABANG_LIST.map((c) => (
                  <option key={c.kode} value={c.kode}>
                    {c.kode} — {c.nama}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#9AAAC4' }}
              />
            </div>
          </div>

          <div className="mx-6 flex-shrink-0" style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

          {/* ── Unit Info ── */}
          <div className="px-6 py-4 flex-shrink-0">
            <div className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: '#9AAAC4' }}>
              Unit Kerja
            </div>
            {meta ? (
              <div className="space-y-2">
                <div>
                  <div className="font-display text-[14px]" style={{ color: '#0A2342' }}>
                    {meta.nama_unit}
                  </div>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  {/* <MetaRow label="Data per" value={meta.posisi_data} /> */}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[32, 24, 28].map((w, i) => (
                  <div key={i} className="skeleton h-3 rounded" style={{ width: w * 4 }} />
                ))}
              </div>
            )}
          </div>

          <div className="mx-6 flex-shrink-0" style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

          {/* ── Category Quick Nav ── */}
          <div className="px-4 py-4">
            <div
              className="text-[10px] font-semibold tracking-widest uppercase px-2 mb-3"
              style={{ color: '#9AAAC4' }}
            >
              Kategori
            </div>
            <nav className="space-y-0.5">
              {NAV_ITEMS.map((name) => {
                const kat   = data?.data?.[name];
                const inds  = kat?.indikators ?? [];
                const bobot = inds.reduce((s, i) => s + (i.bobot || 0), 0) * 100;
                const nilai = kat?.total_nilai_kategori ?? 0;
                const pct   = bobot > 0 ? (nilai / bobot) * 100 : 0;
                const color = pct >= 100 ? '#18B472' : pct >= 80 ? '#C68A00' : '#D14545';

                return (
                  <button
                    key={name}
                    onClick={() => scrollToKategori(name)}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all text-xs font-medium"
                    style={{ color: '#4A6080' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201,162,39,0.07)';
                      e.currentTarget.style.color = '#0A2342';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#4A6080';
                    }}
                  >
                    <span className="truncate">{name}</span>
                    {kat && (
                      <span
                        className="text-[10px] font-mono flex-shrink-0 ml-2 font-semibold"
                        style={{ color }}
                      >
                        {nilai.toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mx-6" style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

          {/* ── Refresh + Status ── */}
          <div className="px-6 py-4">
            <motion.button
              onClick={onRefresh}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all mb-4"
              style={{
                background: loading
                  ? 'rgba(201,162,39,0.12)'
                  : 'linear-gradient(135deg, #C9A227, #A8841F)',
                color: loading ? '#B8881E' : '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(201,162,39,0.3)',
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Memuat…' : 'Refresh Data'}
            </motion.button>

            <div className="flex items-center gap-2 mb-1.5">
              {statusOk
                ? <Wifi size={12} style={{ color: '#18B472' }} />
                : error
                  ? <WifiOff size={12} style={{ color: '#D14545' }} />
                  : <Wifi size={12} style={{ color: '#9AAAC4' }} />
              }
              <span
                className="text-[11px] font-medium"
                style={{ color: statusOk ? '#18B472' : error ? '#D14545' : '#9AAAC4' }}
              >
                {statusOk ? 'Data Termuat' : error ? 'Gagal Memuat' : 'Memuat…'}
              </span>
            </div>

            {error && (
              <div
                className="text-[10px] rounded-lg p-2.5 mb-2"
                style={{
                  background: 'rgba(209,69,69,0.06)',
                  border: '1px solid rgba(209,69,69,0.15)',
                  color: '#D14545',
                }}
              >
                {error}
              </div>
            )}

            {lastUpdated && (
              <div className="flex items-center gap-1.5 mb-3">
                <Clock size={10} style={{ color: '#9AAAC4' }} />
                <span className="text-[10px]" style={{ color: '#9AAAC4' }}>{lastUpdated}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Building2 size={11} style={{ color: '#9AAAC4' }} />
              <span className="text-[10px]" style={{ color: '#9AAAC4' }}>
                Bank Mandiri · Unit {meta?.kode_unit ?? '11903'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex gap-2">
      <span className="w-16 flex-shrink-0" style={{ color: '#9AAAC4' }}>{label}:</span>
      <span className="flex-1 truncate font-medium" style={{ color: '#4A6080' }}>{value}</span>
    </div>
  );
}
