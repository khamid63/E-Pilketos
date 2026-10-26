import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../../services/db';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Check,
  FileUp,
  X,
  FileCheck,
} from 'lucide-react';

interface ParsedRow {
  nisn: string;
  name: string;
  className: string;
  pin: string;
  isDuplicate: boolean;
  isValid: boolean;
  error?: string;
}

interface ImportVotersProps {
  onRefreshData: () => void;
}

export const ImportVoters: React.FC<ImportVotersProps> = ({ onRefreshData }) => {
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileError, setFileError] = useState<string>('');
  const [importResult, setImportResult] = useState<{ added: number; dupes: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const existingVoters = db.getVoters();
  const existingNisns = new Set(existingVoters.map((v) => v.nisn));

  // Handler for Excel (.xlsx) file upload
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    setImportResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict validation: must be .xlsx
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setFileError('Format berkas tidak valid. Harap hanya unggah berkas berekstensi Excel (.xlsx).');
      setSelectedFileName('');
      setParsedRows([]);
      return;
    }

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          setFileError('Berkas Excel kosong atau tidak memiliki lembar kerja (sheet).');
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        // Read raw 2D array of rows
        const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        if (!rawData || rawData.length === 0) {
          setFileError('Lembar kerja Excel kosong, tidak ditemukan baris data.');
          setParsedRows([]);
          return;
        }

        // Find header row or assume row 0
        const headerRow = rawData[0] || [];
        const isHeaderPresent = headerRow.some(
          (col: any) =>
            typeof col === 'string' &&
            (col.toLowerCase().includes('nisn') || col.toLowerCase().includes('nama'))
        );

        const dataRows = isHeaderPresent ? rawData.slice(1) : rawData;
        const currentNisnsInBatch = new Set<string>();
        const rows: ParsedRow[] = [];

        // Helper to normalize and validate class names into 7A-7F, 8A-8F, 9A-9F
        const normalizeClass = (raw: string): { normalized: string; isValid: boolean } => {
          let c = raw.trim().toUpperCase().replace(/\s+/g, '');
          if (c.startsWith('KELAS')) c = c.replace('KELAS', '');
          if (c.startsWith('VII')) c = c.replace('VII', '7');
          else if (c.startsWith('VIII')) c = c.replace('VIII', '8');
          else if (c.startsWith('IX')) c = c.replace('IX', '9');

          const match = c.match(/^([789])([A-F])$/);
          if (match) {
            return { normalized: `${match[1]}${match[2]}`, isValid: true };
          }
          return { normalized: raw.trim(), isValid: false };
        };

        for (const row of dataRows) {
          if (!row || row.length === 0) continue;

          // Column 0: NISN, Column 1: Nama, Column 2: Kelas, Column 3: Kode Pemilihan / PIN
          const rawNisn = String(row[0] ?? '').trim();
          const rawName = String(row[1] ?? '').trim();
          const rawClass = String(row[2] ?? '').trim();
          let rawPin = String(row[3] ?? '').trim();

          // Skip completely empty rows
          if (!rawNisn && !rawName) continue;

          if (!rawPin) {
            // Auto generate 4-digit PIN if empty
            rawPin = Math.floor(1000 + Math.random() * 9000).toString();
          }

          const classRes = normalizeClass(rawClass);
          const isDupe = existingNisns.has(rawNisn) || currentNisnsInBatch.has(rawNisn);
          const isBasicValid = rawNisn.length >= 4 && rawName.length >= 2;
          const isValid = isBasicValid && classRes.isValid;

          let error = '';
          if (!isBasicValid) error = 'Format NISN/Nama belum lengkap';
          else if (!classRes.isValid) error = 'Kelas tidak valid (Wajib 7A-7F, 8A-8F, 9A-9F)';
          else if (isDupe) error = 'NISN sudah ada di sistem (Duplikat)';

          if (rawNisn) {
            currentNisnsInBatch.add(rawNisn);
          }

          rows.push({
            nisn: rawNisn,
            name: rawName,
            className: classRes.isValid ? classRes.normalized : rawClass,
            pin: rawPin,
            isDuplicate: isDupe,
            isValid,
            error,
          });
        }

        if (rows.length === 0) {
          setFileError('Tidak ditemukan baris data siswa yang valid pada berkas Excel tersebut.');
        }

        setParsedRows(rows);
      } catch (err: any) {
        console.error('Error reading Excel file:', err);
        setFileError('Gagal membaca berkas Excel. Pastikan berkas tidak rusak dan berformat .xlsx.');
      }
    };

    reader.readAsArrayBuffer(file);
    // Reset input value so same file can be re-selected if needed
    e.target.value = '';
  };

  // Commit valid parsed voters into the database
  const handleCommitImport = () => {
    setIsProcessing(true);
    const validRows = parsedRows.filter((r) => r.isValid && !r.isDuplicate);

    const payload = validRows.map((r) => ({
      nisn: r.nisn,
      name: r.name,
      className: r.className,
      classId: 'cls-' + r.className.toLowerCase(),
      pin: r.pin,
    }));

    const result = db.importVoters(payload, 'admin');

    setIsProcessing(false);
    setImportResult({ added: result.addedCount, dupes: result.duplicateCount });
    setParsedRows([]);
    setSelectedFileName('');
    onRefreshData();
  };

  // Generate & Download sample Excel template (.xlsx) with 7A - 9F
  const downloadSampleXlsx = () => {
    const templateData = [
      ['NISN', 'Nama', 'Kelas', 'Kode Pemilihan'],
      ['0081234031', 'Anindya Kirana Putri', '7A', '4123'],
      ['0081234032', 'Bramantyo Yudha Pratama', '7F', '5234'],
      ['0081234033', 'Cahyo Nugroho', '8A', '6345'],
      ['0081234034', 'Dini Permatasari', '8E', '7456'],
      ['0081234035', 'Ervan Dwi Syahputra', '9A', '8567'],
      ['0081234036', 'Fanya Az-Zahra', '9F', ''],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths for readability
    worksheet['!cols'] = [
      { wch: 16 }, // NISN
      { wch: 28 }, // Nama
      { wch: 12 }, // Kelas
      { wch: 18 }, // Kode Pemilihan
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DPT Siswa');

    XLSX.writeFile(workbook, 'TEMPLATE_IMPORT_SISWA_SMPN1_TEMBARAK.xlsx');
  };

  const validCount = parsedRows.filter((r) => r.isValid && !r.isDuplicate).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Import Data Siswa Pemilih (.xlsx Only)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Unggah berkas Microsoft Excel (.xlsx) untuk menambahkan data DPT pemilih secara massal
          </p>
        </div>

        <button
          onClick={downloadSampleXlsx}
          className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 self-start shadow-xs hover:border-emerald-500"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Unduh Template Excel (.xlsx)</span>
        </button>
      </div>

      {/* Result Alert */}
      {importResult && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <strong>Import Excel Berhasil!</strong> Sebanyak <strong>{importResult.added}</strong> siswa baru berhasil ditambahkan ke DPT. {importResult.dupes > 0 && `(${importResult.dupes} data duplikat dilewati).`}
          </div>
        </div>
      )}

      {/* Error Alert */}
      {fileError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Upload Box Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-100 shadow-xs">
            <FileSpreadsheet className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-900">
              Pilih Berkas Spreadsheet Excel (.xlsx)
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Sistem hanya menerima format file Excel berekstensi <strong>.xlsx</strong> dengan struktur kolom: <strong>NISN, Nama, Kelas, Kode Pemilihan</strong>.
            </p>
          </div>

          {/* Drag & Drop / File Input */}
          <div className="mt-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 transition-colors bg-slate-50/50">
            <input
              type="file"
              accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleExcelUpload}
              className="hidden"
              id="excel-file-upload-input"
            />
            <label
              htmlFor="excel-file-upload-input"
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <FileUp className="w-4 h-4 text-emerald-100" />
              <span>Pilih File Excel (.xlsx)</span>
            </label>

            {selectedFileName ? (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 w-fit mx-auto">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>{selectedFileName}</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 mt-2">
                Format berkas wajib berupa file Microsoft Excel (.xlsx)
              </p>
            )}
          </div>

          <div className="text-[11px] text-slate-500 bg-blue-50/70 border border-blue-200/60 p-3 rounded-xl text-left leading-relaxed">
            💡 <strong>Petunjuk Kolom Template Excel (.xlsx):</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
              <li><strong>Kolom A: NISN</strong> (Nomor Induk Siswa Nasional, unik).</li>
              <li><strong>Kolom B: Nama</strong> (Nama lengkap siswa).</li>
              <li><strong>Kolom C: Kelas</strong> (Rombel resmi: 7A-7F, 8A-8F, 9A-9F).</li>
              <li><strong>Kolom D: Kode Pemilihan</strong> (PIN unik siswa. Jika dikosongkan, sistem akan otomatis membuat PIN 4 digit acak).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      {parsedRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Preview Verifikasi Data Excel (.xlsx)
              </h3>
              <p className="text-xs text-slate-500">
                Ditemukan <strong>{validCount}</strong> data valid siap disimpan, dan{' '}
                <strong className="text-amber-600">{parsedRows.length - validCount}</strong> data bermasalah/duplikat.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setParsedRows([]);
                  setSelectedFileName('');
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCommitImport}
                disabled={validCount === 0 || isProcessing}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Simpan {validCount} Siswa ke Database</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">NISN</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Kode Pemilihan (PIN)</th>
                  <th className="py-2.5 px-3">Status Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      row.isDuplicate || !row.isValid
                        ? 'bg-red-50/40 text-red-900'
                        : 'hover:bg-slate-50'
                    }
                  >
                    <td className="py-2 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-mono font-semibold">{row.nisn}</td>
                    <td className="py-2 px-3 font-medium">{row.name}</td>
                    <td className="py-2 px-3">
                      <span className="bg-blue-50 text-blue-900 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {row.className}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold text-slate-700 bg-slate-50/50">
                      {row.pin}
                    </td>
                    <td className="py-2 px-3">
                      {row.isValid && !row.isDuplicate ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Siap Diimpor</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 text-[11px] font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{row.error}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
