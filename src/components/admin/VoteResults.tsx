import React from 'react';
import { db } from '../../services/db';
import { SchoolSettings } from '../../types';
import {
  BarChart3,
  PieChart,
  Download,
  FileCheck,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react';

interface VoteResultsProps {
  settings: SchoolSettings;
  onOpenBeritaAcara: () => void;
}

export const VoteResults: React.FC<VoteResultsProps> = ({ settings, onOpenBeritaAcara }) => {
  const stats = db.getElectionResults();

  // Export Results to CSV
  const handleExportResultsCsv = () => {
    const headers = ['Nomor Urut', 'Calon Ketua', 'Calon Wakil', 'Perolehan Suara', 'Persentase'];
    const rows = stats.candidateResults.map((r) => [
      `0${r.candidate.candidateNumber}`,
      `"${r.candidate.chairmanName}"`,
      `"${r.candidate.viceChairmanName}"`,
      r.voteCount,
      `${r.percentage}%`,
    ]);

    rows.push([]);
    rows.push(['Total Suara Sah Masuk', '', '', stats.totalValidVotes, '100%']);
    rows.push(['Total DPT Pemilih', '', '', stats.totalVoters, '']);
    rows.push(['Partisipasi Siswa', '', '', stats.votedCount, `${stats.participationRate}%`]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HASIL_SUARA_PILKETOS_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find leader
  const sorted = [...stats.candidateResults].sort((a, b) => b.voteCount - a.voteCount);
  const leading = sorted[0];

  return (
    <div className="space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Tabulasi Hasil &amp; Statistik Perolehan Suara
          </h2>
          <p className="text-xs text-slate-500">
            {settings.electionName} · {settings.schoolName} ({settings.academicYear})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportResultsCsv}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenBeritaAcara}
            className="px-4 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4 text-amber-300" />
            <span>Cetak Berita Acara</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Suara Sah Masuk</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5 tabular-nums font-mono">
            {stats.totalValidVotes}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Surat suara terverifikasi</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total DPT</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5 tabular-nums font-mono">
            {stats.totalVoters}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Hak pilih terdaftar</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Partisipasi</div>
          <div className="text-2xl font-black text-blue-900 mt-0.5 tabular-nums font-mono">
            {stats.participationRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{stats.votedCount} pemilih hadir</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Perolehan Tertinggi</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5 truncate">
            {leading && leading.voteCount > 0 ? `Paslon 0${leading.candidate.candidateNumber}` : '-'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate">
            {leading && leading.voteCount > 0 ? `${leading.voteCount} suara (${leading.percentage}%)` : 'Belum ada suara'}
          </div>
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Tabel Rekapitulasi Suara Pasangan Calon
          </h3>
          <span className="text-xs text-slate-500">Urut berdasarkan nomor urut</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-16 text-center">No. Urut</th>
                <th className="py-3 px-4">Nama Pasangan Calon</th>
                <th className="py-3 px-4">Motto / Tagline</th>
                <th className="py-3 px-4 text-right">Jumlah Suara</th>
                <th className="py-3 px-4 text-right">Persentase</th>
                <th className="py-3 px-4 w-44">Grafik Batang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.candidateResults.map((r) => (
                <tr key={r.candidate.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4 text-center">
                    <span className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 font-black text-xs flex items-center justify-center mx-auto">
                      0{r.candidate.candidateNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-slate-900">
                      {r.candidate.chairmanName}
                    </div>
                    <div className="text-xs text-slate-600">
                      &amp; {r.candidate.viceChairmanName}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 italic max-w-xs truncate">
                    &ldquo;{r.candidate.tagline}&rdquo;
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-base text-slate-900 tabular-nums">
                    {r.voteCount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-base text-blue-900 tabular-nums">
                    {r.percentage}%
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-800 transition-all duration-300"
                        style={{ width: `${r.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                <td colSpan={3} className="py-3 px-4 text-right">
                  TOTAL SUARA SAH MASUK:
                </td>
                <td className="py-3 px-4 text-right font-mono text-base tabular-nums">
                  {stats.totalValidVotes}
                </td>
                <td className="py-3 px-4 text-right font-mono text-base tabular-nums text-emerald-700">
                  100%
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Visual Chart Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Bar Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-900" />
            <h3 className="font-bold text-sm text-slate-900">
              Grafik Komparasi Suara Paslon
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {stats.candidateResults.map((r, i) => {
              const colors = ['bg-blue-800', 'bg-amber-500', 'bg-emerald-600'];
              const colorClass = colors[i % colors.length];

              return (
                <div key={r.candidate.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      0{r.candidate.candidateNumber}. {r.candidate.chairmanName}
                    </span>
                    <span className="font-mono font-bold tabular-nums text-slate-900">
                      {r.voteCount} suara ({r.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-5 bg-slate-100 rounded-md overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className={`h-full ${colorClass} rounded transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white`}
                      style={{ width: `${Math.max(r.percentage, 4)}%` }}
                    >
                      {r.percentage > 10 ? `${r.percentage}%` : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Turnout Participation Donut / Ring Simulation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Tingkat Kehadiran &amp; Partisipasi Siswa
            </h3>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Circular Ring Representation */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="3.8"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#1e3a8a"
                  strokeWidth="3.8"
                  strokeDasharray={`${stats.participationRate}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {stats.participationRate}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Partisipasi</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-900"></span>
                  <span className="text-slate-600">Sudah Memilih:</span>
                </div>
                <strong className="font-mono text-slate-900 tabular-nums">
                  {stats.votedCount} siswa
                </strong>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                  <span className="text-slate-600">Belum Memilih:</span>
                </div>
                <strong className="font-mono text-slate-900 tabular-nums">
                  {stats.unvotedCount} siswa
                </strong>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                Total Hak Pilih DPT: <strong>{stats.totalVoters}</strong> siswa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per Class Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Statistik Partisipasi Pemilih per Rombongan Belajar (Kelas)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Sesuai asas kerahasiaan suara (LUBER), pilihan spesifik per siswa tidak ditampilkan
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4 text-right">DPT Siswa</th>
                <th className="py-3 px-4 text-right">Sudah Memilih</th>
                <th className="py-3 px-4 text-right">Belum Memilih</th>
                <th className="py-3 px-4 text-right">Partisipasi</th>
                <th className="py-3 px-4 w-36">Bar Partisipasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.classStatistics.map((cls, idx) => (
                <tr key={cls.classId} className="hover:bg-blue-50/30">
                  <td className="py-2.5 px-4 text-center font-mono text-slate-400 tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-bold">
                      Kelas {cls.className}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-800">
                    {cls.totalVoters}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums text-emerald-600 font-semibold">
                    {cls.votedCount}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums text-amber-600">
                    {cls.unvotedCount}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-blue-900">
                    {cls.percentage}%
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${cls.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
