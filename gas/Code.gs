// ============================================================
// API_Aggregator — Google Apps Script Web App
// Deploy: Extensions > Apps Script > Deploy > Web App
//   Execute as : Me
//   Who has access : Anyone
// CORS headers are injected automatically by Google's CDN
// for GET requests when deployed with "Anyone" access.
// ============================================================

const SHEET_NAME = "API_Aggregator";

const REQUIRED_COLS = [
  "Bulan", "Kode_Unit", "Kategori", "Indikator",
  "Satuan", "Bobot", "Realisasi", "Target",
  "Persentase_Pencapaian", "Nilai_Akhir"
];

// ------------------------------------------------------------
// Entry point
// ------------------------------------------------------------

function doGet(e) {
  const out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);

  try {
    const params = e.parameter || {};
    const bulan  = (params.bulan || "").trim();
    const unit   = (params.unit  || "").trim();

    if (!bulan || !unit) {
      return respond(out, 400, null, "Parameter 'bulan' dan 'unit' wajib diisi");
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return respond(out, 500, null, `Sheet '${SHEET_NAME}' tidak ditemukan`);
    }

    const [headerRow, ...dataRows] = sheet.getDataRange().getValues();
    const idx = buildColIndex(headerRow);

    const missing = REQUIRED_COLS.filter(c => idx[c] === undefined);
    if (missing.length) {
      return respond(out, 500, null, `Kolom tidak ditemukan: ${missing.join(", ")}`);
    }

    const filtered = dataRows.filter(r =>
      normalizeStr(r[idx.Bulan])     === bulan &&
      normalizeStr(r[idx.Kode_Unit]) === unit
    );

    if (!filtered.length) {
      return respond(out, 404, null,
        `Tidak ada data untuk bulan '${bulan}' dan unit '${unit}'`);
    }

    const { data, totalNilai } = aggregate(filtered, idx);

    return respond(out, 200, {
      meta    : { unit, periode: bulan },
      summary : { total_nilai: round2(totalNilai), target_nilai: 100 },
      data
    });

  } catch (err) {
    return respond(out, 500, null, err.message);
  }
}

// ------------------------------------------------------------
// Aggregation
// ------------------------------------------------------------

function aggregate(rows, idx) {
  const data      = {};  // { [kategori]: { bobot_kategori, nilai_kategori, indikators[] } }
  let   totalNilai = 0;
  let   no         = 1;

  rows.forEach(row => {
    const kategori = normalizeStr(row[idx.Kategori]);
    if (!data[kategori]) {
      data[kategori] = { _bobotSum: 0, nilai_kategori: 0, indikators: [] };
    }

    const bobotNum  = parsePct(row[idx.Bobot]);
    const nilaiNum  = toNumOrNull(row[idx.Nilai_Akhir]);
    const pctNum    = toNumOrNull(row[idx.Persentase_Pencapaian]);

    data[kategori]._bobotSum      += bobotNum;
    data[kategori].nilai_kategori += nilaiNum ?? 0;
    if (nilaiNum !== null) totalNilai += nilaiNum;

    data[kategori].indikators.push({
      no,
      indikator           : normalizeStr(row[idx.Indikator]),
      satuan              : normalizeStr(row[idx.Satuan]),
      bobot               : fmtPct(bobotNum),
      realisasi           : toNumOrNull(row[idx.Realisasi]),
      target              : toNumOrNull(row[idx.Target]),
      persen_pencapaian   : pctNum,
      nilai               : nilaiNum
    });

    no++;
  });

  // Finalise kategori-level fields; strip internal accumulator
  Object.keys(data).forEach(k => {
    data[k].bobot_kategori  = fmtPct(data[k]._bobotSum);
    data[k].nilai_kategori  = round2(data[k].nilai_kategori);
    delete data[k]._bobotSum;
  });

  return { data, totalNilai };
}

// ------------------------------------------------------------
// Response builder
// ------------------------------------------------------------

function respond(out, code, payload, message) {
  const body = code === 200
    ? { status: "success", ...payload }
    : { status: "error",   code,   message };

  out.setContent(JSON.stringify(body));
  return out;
}

// ------------------------------------------------------------
// Utilities
// ------------------------------------------------------------

function buildColIndex(headerRow) {
  return headerRow.reduce((acc, h, i) => {
    acc[String(h).trim()] = i;
    return acc;
  }, {});
}

/** Returns "" for blank, trims whitespace */
function normalizeStr(val) {
  return String(val ?? "").trim();
}

/** Converts cell value to number or null; rounds to 2 dp */
function toNumOrNull(val) {
  if (val === "" || val === null || val === undefined) return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : round2(n);
}

/** Parses "2.00%" or 0.02 or 2 → 2 (as percentage points) */
function parsePct(val) {
  if (val === "" || val === null || val === undefined) return 0;
  const s = String(val).trim();
  if (s.endsWith("%")) return parseFloat(s) || 0;        // "2.00%" → 2
  const n = parseFloat(s) || 0;
  return n <= 1 && n > 0 ? round2(n * 100) : n;          // 0.02 → 2, 2 → 2
}

/** Formats a numeric percentage back to "2.00%" */
function fmtPct(n) {
  return n.toFixed(2) + "%";
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
