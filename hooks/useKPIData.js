'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchKPI } from '@/services/kpiService';

export function useKPIData() {
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('11903');

  const loadData = useCallback(async (unit) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchKPI(unit);
      setData(result);
      setLastUpdated(
        new Date().toLocaleString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedUnit);
  }, [selectedUnit, loadData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    selectedUnit,
    setSelectedUnit,
    refresh: () => loadData(selectedUnit),
  };
}
