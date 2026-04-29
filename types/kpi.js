/**
 * @typedef {Object} Meta
 * @property {string} unit
 * @property {string} nama_unit
 * @property {string} kelas
 * @property {string} kepala_unit
 * @property {string} periode
 * @property {string} posisi_data
 */

/**
 * @typedef {Object} Summary
 * @property {number} total_nilai
 * @property {number} target_nilai
 */

/**
 * @typedef {Object} Indikator
 * @property {number} no
 * @property {string} indikator
 * @property {string} satuan
 * @property {string} bobot
 * @property {number|null} realisasi_des25
 * @property {number|null} realisasi_jan26
 * @property {number|null} realisasi_feb26
 * @property {number|null} realisasi_mar26
 * @property {number|null} realisasi_apr_w1
 * @property {number|null} target_apr_w1
 * @property {number} persen_pencapaian
 * @property {number|null} nilai
 * @property {number|null} target_apr_mtd
 */

/**
 * @typedef {Object} Kategori
 * @property {string} bobot_kategori
 * @property {number} nilai_kategori
 * @property {Indikator[]} indikators
 */

/**
 * @typedef {Object} KpiData
 * @property {'success'|'error'} status
 * @property {Meta} meta
 * @property {Summary} summary
 * @property {Object.<string, Kategori>} data
 */

/**
 * @typedef {'Retail Funding'|'Wealth'|'TB Retail'|'TB Wholesale'|'SME'|'Cons Loan'|'KUM KUR'|'KSM'|'Credit Card'} KategoriKey
 */

export {};
