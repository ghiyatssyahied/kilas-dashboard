/** Mock data dengan struktur identik GAS API — dipakai saat env var tidak ada */
const MOCK_DATA = {
  status: 'success',
  meta: {
    posisi_data: '9-Apr-26',
    kode_unit:   '11903',
    nama_unit:   'Jakarta Angkasa',
  },
  summary: { total_nilai: 45.93, target_nilai: 100 },
  data: {
    'Retail Funding': {
      total_nilai_kategori: 15.34,
      indikators: [
        { indikator:'Akuisisi New CIF Payroll',                   satuan:'# CIF',    bobot:0.02,  realisasi:2,      target_week:31,     persen_pencapaian:6.45,   nilai_akhir:0.13, target_mtd:124    },
        { indikator:'Akuisisi New CIF Pebisnis',                  satuan:'# CIF',    bobot:0.02,  realisasi:3,      target_week:4,      persen_pencapaian:85.71,  nilai_akhir:1.71, target_mtd:14     },
        { indikator:'Akuisisi New CIF Individu',                  satuan:'# CIF',    bobot:0.02,  realisasi:161,    target_week:48,     persen_pencapaian:130.00, nilai_akhir:2.60, target_mtd:191    },
        { indikator:'Nominal Akuisisi New CIF Tabungan Retail',   satuan:'Rp. Juta', bobot:0.02,  realisasi:219,    target_week:631,    persen_pencapaian:34.66,  nilai_akhir:0.69, target_mtd:2523   },
        { indikator:'Akuisisi Rekening Berbiaya',                 satuan:'# Rek',    bobot:0.02,  realisasi:263,    target_week:116,    persen_pencapaian:130.00, nilai_akhir:2.60, target_mtd:465    },
        { indikator:'USAK FIN Livin',                             satuan:'# USAK',   bobot:0.02,  realisasi:748,    target_week:387,    persen_pencapaian:130.00, nilai_akhir:2.60, target_mtd:387    },
        { indikator:'Akuisisi GMM New CIF',                       satuan:'# CIF',    bobot:0.02,  realisasi:8,      target_week:37,     persen_pencapaian:21.62,  nilai_akhir:0.43, target_mtd:148    },
        { indikator:'Nominal Akuisisi GMM New CIF',               satuan:'Rp. Juta', bobot:0.02,  realisasi:17,     target_week:217,    persen_pencapaian:8.02,   nilai_akhir:0.16, target_mtd:866    },
        { indikator:'Endbal Deposito Retail Counter',             satuan:'Rp. Juta', bobot:0.02,  realisasi:213181, target_week:49920,  persen_pencapaian:130.00, nilai_akhir:2.60, target_mtd:49920  },
        { indikator:'Avgbal Tabungan All Segmen (MtD)',           satuan:'Rp. Juta', bobot:0.02,  realisasi:587594, target_week:650552, persen_pencapaian:90.32,  nilai_akhir:1.81, target_mtd:650552 },
      ],
    },
    'Wealth': {
      total_nilai_kategori: 0,
      indikators: [
        { indikator:'RTW - Upgrade',             satuan:'# CIF',    bobot:0.015, realisasi:null, target_week:2,    persen_pencapaian:0.00, nilai_akhir:null, target_mtd:6     },
        { indikator:'Nominal RTW - Upgrade',     satuan:'Rp. Juta', bobot:0.03,  realisasi:0,    target_week:375,  persen_pencapaian:0.00, nilai_akhir:null, target_mtd:1500  },
        { indikator:'New to Bank Wealth',        satuan:'# CIF',    bobot:0.015, realisasi:null, target_week:1,    persen_pencapaian:0.00, nilai_akhir:null, target_mtd:2     },
        { indikator:'Nominal New to Bank Wealth',satuan:'Rp. Juta', bobot:0.03,  realisasi:0,    target_week:125,  persen_pencapaian:0.00, nilai_akhir:null, target_mtd:500   },
        { indikator:'Fee Based Bancassurance',   satuan:'Rp. Juta', bobot:0.02,  realisasi:0,    target_week:1,    persen_pencapaian:0.00, nilai_akhir:null, target_mtd:3     },
        { indikator:'Akuisisi MDS & MDCI',       satuan:'Rp. Juta', bobot:0.04,  realisasi:null, target_week:6020, persen_pencapaian:0.00, nilai_akhir:null, target_mtd:24080 },
      ],
    },
    'TB Retail': {
      total_nilai_kategori: 6.33,
      indikators: [
        { indikator:'Akuisisi EDC Regular + (GMM+LEAKAGE)', satuan:'#MID',     bobot:0.06, realisasi:null, target_week:2,    persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:8   },
        { indikator:'Intesifikasi Optimalisasi EDC',         satuan:'#MID',     bobot:0.01, realisasi:null, target_week:2,    persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:6   },
        { indikator:'USAK LVM Regular + (GMM + LEAKAGE)',   satuan:'#MID',     bobot:0.04, realisasi:1,    target_week:5,    persen_pencapaian:21.05,  nilai_akhir:0.84, target_mtd:19  },
        { indikator:'Intesifikasi Optimalisasi LVM',         satuan:'#MID',     bobot:0.01, realisasi:2,    target_week:3,    persen_pencapaian:80.00,  nilai_akhir:0.80, target_mtd:10  },
        { indikator:'Funding Akuisisi EDC',                  satuan:'Rp. Juta', bobot:0.02, realisasi:null, target_week:100,  persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:400 },
        { indikator:'Funding Akuisisi LVM',                  satuan:'Rp. Juta', bobot:0.02, realisasi:2,    target_week:48,   persen_pencapaian:4.59,   nilai_akhir:0.09, target_mtd:190 },
        { indikator:'SV Mass Retail',                        satuan:'Rp. Juta', bobot:0.03, realisasi:14111,target_week:6129, persen_pencapaian:130.00, nilai_akhir:3.90, target_mtd:6129},
        { indikator:'GMM Duta Transaksi % ON US',            satuan:'%',        bobot:0.01, realisasi:52.10,target_week:75,   persen_pencapaian:69.47,  nilai_akhir:0.69, target_mtd:75  },
      ],
    },
    'TB Wholesale': {
      total_nilai_kategori: 3.00,
      indikators: [
        { indikator:'New Account Giro', satuan:'#Rek',   bobot:0.03, realisasi:2,    target_week:2, persen_pencapaian:100.00, nilai_akhir:3.00, target_mtd:6 },
        { indikator:'Ureg KOPRA',       satuan:'#Ureg',  bobot:0.07, realisasi:null, target_week:1, persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:4 },
      ],
    },
    'SME': {
      total_nilai_kategori: 6.70,
      indikators: [
        { indikator:'Booking Kredit SME',       satuan:'Rp. Juta', bobot:0.02, realisasi:380,   target_week:797,   persen_pencapaian:47.69,  nilai_akhir:0.95, target_mtd:7968  },
        { indikator:'Net Downgrade Kredit SME', satuan:'Rp. Juta', bobot:0.02, realisasi:null,  target_week:16,    persen_pencapaian:130.00, nilai_akhir:2.60, target_mtd:65    },
        { indikator:'Bade Kredit SME',          satuan:'Rp. Juta', bobot:0.03, realisasi:49491, target_week:47204, persen_pencapaian:104.84, nilai_akhir:3.15, target_mtd:26628 },
      ],
    },
    'Cons Loan': {
      total_nilai_kategori: 3.23,
      indikators: [
        { indikator:'Booking Ekosistem Kredit Cons Loan', satuan:'Rp. Juta', bobot:0.01, realisasi:null,  target_week:228,   persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:2280  },
        { indikator:'Net Downgrade Kredit Cons Loan',     satuan:'Rp. Juta', bobot:0.01, realisasi:0,     target_week:77,    persen_pencapaian:130.00, nilai_akhir:1.30, target_mtd:309   },
        { indikator:'Booking LKP YtD',                   satuan:'Rp. Juta', bobot:0.02, realisasi:null,  target_week:150,   persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:600   },
        { indikator:'Booking Autoloan',                   satuan:'Rp. Juta', bobot:0.01, realisasi:null,  target_week:67,    persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:672   },
        { indikator:'Bade Kredit Cons Loan',              satuan:'Rp. Juta', bobot:0.02, realisasi:25291, target_week:26200, persen_pencapaian:96.53,  nilai_akhir:1.93, target_mtd:34025 },
      ],
    },
    'KUM KUR': {
      total_nilai_kategori: 2.28,
      indikators: [
        { indikator:'Booking KUM (by Leads)',    satuan:'Rp. Juta', bobot:0.021,  realisasi:null, target_week:null, persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:null },
        { indikator:'Downgrade KUM KUR',         satuan:'Rp. Juta', bobot:0.0175, realisasi:null, target_week:26,   persen_pencapaian:130.00, nilai_akhir:2.28, target_mtd:102  },
        { indikator:'LVM Debitur (% USAK)',      satuan:'% USAK',   bobot:0.007,  realisasi:0,    target_week:null, persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:0    },
        { indikator:'Akuisisi Agen (#Agen) - YtD',satuan:'#Agen',  bobot:0.0105, realisasi:null, target_week:null, persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:null },
        { indikator:'Bade Kredit KUM',           satuan:'Rp. Juta', bobot:0.014,  realisasi:null, target_week:null, persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:null },
      ],
    },
    'KSM': {
      total_nilai_kategori: 3.21,
      indikators: [
        { indikator:'Booking Ekosistem KSM', satuan:'Rp. Juta', bobot:0.02, realisasi:150,    target_week:1239,   persen_pencapaian:12.11, nilai_akhir:0.24, target_mtd:12387  },
        { indikator:'Net Downgrade KSM',     satuan:'Rp. Juta', bobot:0.02, realisasi:2432,   target_week:73,     persen_pencapaian:0.00,  nilai_akhir:null, target_mtd:291    },
        { indikator:'Bade New KSM',          satuan:'Rp. Juta', bobot:0.03, realisasi:114465, target_week:115850, persen_pencapaian:98.80, nilai_akhir:2.96, target_mtd:120517 },
      ],
    },
    'Credit Card': {
      total_nilai_kategori: 5.86,
      indikators: [
        { indikator:'Akuisisi New CIF Credit Card',    satuan:'# CIF',    bobot:0.01, realisasi:1,     target_week:6,     persen_pencapaian:16.08,  nilai_akhir:0.16, target_mtd:25    },
        { indikator:'Penetrasi Prioritas Credit Card', satuan:'Rp. Juta', bobot:0.01, realisasi:null,  target_week:1,     persen_pencapaian:0.00,   nilai_akhir:null, target_mtd:4     },
        { indikator:'SV Card',                        satuan:'Rp. Juta', bobot:0.01, realisasi:1741,  target_week:1609,  persen_pencapaian:108.26, nilai_akhir:1.08, target_mtd:6434  },
        { indikator:'Net Downgrade Credit Card',      satuan:'Rp. Juta', bobot:0.02, realisasi:4,     target_week:22,    persen_pencapaian:130.00, nilai_akhir:2.60, target_mtd:88    },
        { indikator:'Bade Kredit CC',                 satuan:'Rp. Juta', bobot:0.02, realisasi:21321, target_week:21174, persen_pencapaian:100.70, nilai_akhir:2.01, target_mtd:20736 },
      ],
    },
  },
};

/**
 * Hitung total bobot sebuah kategori dari array indikatornya.
 * Dipakai juga oleh komponen (export agar bisa di-reuse).
 */
export const getBobotPct = (indikators = []) =>
  indikators.reduce((s, i) => s + (i.bobot || 0), 0) * 100;

/**
 * Fetch KPI data langsung dari GAS API.
 * Set NEXT_PUBLIC_GAS_API_URL di .env.local untuk data live.
 * Tidak ada transformer — struktur dikembalikan apa adanya.
 * @returns {Promise<object>}
 */
export async function fetchKPI() {
  const apiUrl = process.env.NEXT_PUBLIC_GAS_API_URL;

  if (!apiUrl) {
    console.log('📦 Using mock data (no API URL configured)');
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_DATA;
  }

  console.log('🔄 Fetching from GAS API...');

  const res = await fetch(apiUrl, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();

  if (json.status !== 'success') {
    throw new Error(json.message || 'API returned an error response');
  }

  console.log('✅ Data loaded');
  return json;
}
