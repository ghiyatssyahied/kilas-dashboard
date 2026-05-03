'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import SummaryCard from '@/components/dashboard/SummaryCard';
import KPIAccordion from '@/components/dashboard/KPIAccordion';
import { useKPIData } from '@/hooks/useKPIData';
import Image from 'next/image';
import { AlertTriangle, Menu } from 'lucide-react';

/* ── Skeleton ───────────────────────────────────────────── */

function SkeletonDashboard() {
  return (
    <div className="space-y-4">
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="skeleton w-[120px] h-[120px] sm:w-[168px] sm:h-[168px] rounded-full mx-auto sm:mx-0 flex-shrink-0" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="skeleton h-6 w-48 rounded" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-4 w-40 rounded" />
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="skeleton h-24 sm:h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="skeleton w-7 h-7 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-5 rounded" style={{ width: `${40 + i * 8}%` }} />
              <div className="skeleton h-3 w-28 rounded" />
            </div>
            <div className="skeleton h-9 w-28 rounded hidden sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Error State ────────────────────────────────────────── */

function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 sm:p-12 flex flex-col items-center gap-6"
    >
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(209,69,69,0.08)', border: '1px solid rgba(209,69,69,0.18)' }}
      >
        <AlertTriangle size={24} style={{ color: '#D14545' }} />
      </div>
      <div className="text-center">
        <h3 className="font-display text-xl mb-2" style={{ color: '#0A2342' }}>
          Gagal Memuat Data
        </h3>
        <p className="text-sm max-w-sm" style={{ color: '#6A7D99' }}>{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 rounded-lg text-sm font-semibold"
        style={{
          background: 'linear-gradient(135deg, #C9A227, #A8841F)',
          color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(201,162,39,0.25)',
        }}
      >
        Coba Lagi
      </button>
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default function DashboardPage() {
  const { data, loading, error, lastUpdated, selectedUnit, setSelectedUnit, refresh } = useKPIData();
  const [openCategorySignal, setOpenCategorySignal] = useState(null);
  const [sidebarOpen,        setSidebarOpen]        = useState(false);

  // Tutup sidebar otomatis saat layar melebar ke desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = () => { if (mq.matches) setSidebarOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex min-h-screen">

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.35)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onRefresh={refresh}
        loading={loading}
        lastUpdated={lastUpdated}
        error={error}
        data={data}
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
      />

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-[272px] min-h-screen flex flex-col">

        {/* Mobile topbar */}
        <div
          className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3"
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ color: '#0A2342' }}
          >
            <Menu size={20} />
          </button>

          <Image
            src="/logo.png"
            alt="KILAS"
            width={28}
            height={28}
            className="rounded flex-shrink-0 object-contain"
          />

          <div className="flex-1 min-w-0">
            <div className="font-display text-[15px] leading-tight tracking-wide truncate" style={{ color: '#0A2342' }}>
              KILAS
            </div>
            {data && (
              <div className="text-[10px] truncate" style={{ color: '#9AAAC4' }}>
                {data.meta.nama_unit}
              </div>
            )}
          </div>

          {data && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full flex-shrink-0"
              style={{ background: 'rgba(24,180,114,0.08)', border: '1px solid rgba(24,180,114,0.18)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#18B472' }} />
              <span className="text-[10px] font-medium" style={{ color: '#18B472' }}>Live</span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-16">
          {/* Desktop page header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 hidden lg:flex items-end justify-between"
          >
            <div>
              <h1 className="font-display text-3xl text-gold-gradient leading-tight">
                Monitoring Kinerja
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6A7D99' }}>
                {data
                  ? `${data.meta.nama_unit}`
                  : 'Memuat data…'}
              </p>
            </div>
            {data && (
              <div
                className="px-3 py-1.5 rounded-lg flex items-center gap-2"
                style={{ background: 'rgba(24,180,114,0.08)', border: '1px solid rgba(24,180,114,0.18)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#18B472' }} />
                <span className="text-[11px] font-medium" style={{ color: '#18B472' }}>Live</span>
              </div>
            )}
          </motion.div>

          {/* Mobile page header (compact) */}
          {data && (
            <div className="lg:hidden mb-4">
              <h1 className="font-display text-xl text-gold-gradient leading-tight">
                Monitoring Kinerja
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#9AAAC4' }}>
                Data per {data.meta.posisi_data}
              </p>
            </div>
          )}

          {/* ── Content states ── */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SkeletonDashboard />
              </motion.div>
            )}

            {!loading && error && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ErrorState message={error} onRetry={loadData} />
              </motion.div>
            )}

            {!loading && !error && data && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 sm:space-y-6"
              >
                <SummaryCard data={data} onCategoryClick={setOpenCategorySignal} />
                <KPIAccordion data={data.data} openSignal={openCategorySignal} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
