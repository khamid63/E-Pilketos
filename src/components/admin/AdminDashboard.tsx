import React, { useState } from 'react';
import { db } from '../../services/db';
import { Election, SchoolSettings } from '../../types';
import {
  Users,
  CheckCircle2,
  Clock,
  Percent,
  Play,
  Square,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  FileCheck,
  Upload,
} from 'lucide-react';

interface AdminDashboardProps {
  settings: SchoolSettings;
  election: Election;
  onRefreshData: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  election,
  onRefreshData,
  onNavigateTab,
}) => {
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState<boolean>(false);
  const [targetStatus, setTargetStatus] = useState<Election['status']>('ongoing');

  const stats = db.getElectionResults();
  const recentLogs = db.getAuditLogs().slice(0, 5);

  const handleToggleStatus = (newStatus: Election['status']) => {
    setTargetStatus(newStatus);
    setShowStatusConfirmModal(true);
  };

  const confirmToggleStatus = () => {
    db.updateElectionStatus(targetStatus, 'admin');
    setShowStatusConfirmModal(false);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Status Pemilihan & Action */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Kontrol Pemungutan Suara
          </div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Status Bilik Suara Digital
            </h1>
            {election.status === 'ongoing' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                PEMILIHAN DIBUKA
              </span>
            ) : election.status === 'upcoming' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                BELUM DIMULAI
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-300">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                PEMILIHAN DITUTUP
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {election.status === 'ongoing'
              ? 'Siswa dapat login dengan NISN & PIN untuk memberikan suara secara mandiri.'
              : 'Pemungutan suara sedang dikunci. Siswa tidak dapat mengirimkan suara baru.'}
          </p>
        </div>

        {/* Buttons to Open/Close */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {election.status !== 'ongoing' ? (
            <button
              onClick={() => handleToggleStatus('ongoing')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>BUKA PEMILIHAN SEKARANG</span>
            </button>
          ) : (
            <button
              onClick={() => handleToggleStatus('completed')}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>TUTUP PEMILIHAN</span>
            </button>
          )}

          {election.status !== 'upcoming' && (
            <button
              onClick={() => handleToggleStatus('upcoming')}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Jeda / Set Belum Dimulai
            </button>
          )}
        </div>
      </div>

      {/* 4 Core Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pemilih */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total DPT Pemilih
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">
              {stats.totalVoters}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Siswa terdaftar hak pilih</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Sudah Memilih */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Sudah Memilih
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-1 tabular-nums">
              {stats.votedCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Suara masuk &amp; terverifikasi</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Belum Memilih */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Belum Memilih
            </div>
            <div className="text-3xl font-black text-amber-600 mt-1 tabular-nums">
              {stats.unvotedCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Menunggu kehadiran siswa</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Partisipasi */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Tingkat Partisipasi
            </div>
            <div className="text-3xl font-black text-blue-900 mt-1 tabular-nums">
              {stats.participationRate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.votedCount} dari {stats.totalVoters} pemilih
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Progress Bar of Overall Turnout */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Progres Partisipasi Keseluruhan Siswa Spensatem</span>
          <span className="font-mono font-bold text-blue-900">{stats.participationRate}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-blue-700 to-emerald-500 transition-all duration-500"
            style={{ width: `${stats.participationRate}%` }}
          ></div>
        </div>
      </div>

      {/* Middle Row: Live Candidate Tallies & Quick Class Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Tally per Paslon */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Perolehan Suara Pasangan Calon</h3>
              <p className="text-xs text-slate-500">Hasil suara sah terhitung secara real-time</p>
            </div>
            <button
              onClick={() => onNavigateTab('results')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Lihat Detail Grafik</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {stats.candidateResults.map((item) => (
              <div
                key={item.candidate.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                      0{item.candidate.candidateNumber}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {item.candidate.chairmanName} &amp; {item.candidate.viceChairmanName}
                      </div>
                      <div className="text-[11px] text-slate-500 italic">
                        {item.candidate.tagline}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-blue-950 font-mono tabular-nums">
                      {item.voteCount} suara
                    </div>
                    <div className="text-xs text-slate-500 font-semibold font-mono tabular-nums">
                      {item.percentage}%
                    </div>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-800 transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Audit Trail Snippet */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Aksi Cepat Panitia
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('voters')}
                className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 rounded-lg flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Kelola Data Pemilih</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('import')}
                className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 rounded-lg flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Import Data Siswa (.xlsx)</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('berita-acara')}
                className="w-full py-2 px-3 text-xs font-semibold bg-blue-900 text-white hover:bg-blue-800 rounded-lg flex items-center justify-between transition-colors shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-300" />
                  <span>Cetak Berita Acara Resmi</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>

          {/* Recent Audit Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Aktivitas Audit Terbaru
              </h4>
              <button
                onClick={() => onNavigateTab('audit-log')}
                className="text-[11px] text-blue-900 hover:underline font-semibold"
              >
                Lihat Semua
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-2 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {new Date(log.createdAt).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{log.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Toggle Status */}
      {showStatusConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <div>
                <h4 className="font-bold text-base">Konfirmasi Perubahan Status</h4>
                <p className="text-xs text-slate-300">Pengaturan Akses Bilik Suara</p>
              </div>
            </div>

            <div className="p-6 text-sm text-slate-700 space-y-3">
              <p>
                Anda akan mengubah status pemilihan menjadi:
                <strong className="block mt-1 text-base text-blue-900 uppercase">
                  {targetStatus === 'ongoing'
                    ? '🟢 PEMILIHAN DIBUKA'
                    : targetStatus === 'completed'
                    ? '🔴 PEMILIHAN DITUTUP'
                    : '🟡 BELUM DIMULAI'}
                </strong>
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {targetStatus === 'completed'
                  ? 'Setelah pemilihan ditutup, siswa tidak akan dapat lagi mengirimkan suara. Pastikan waktu pemungutan suara telah selesai sesuai jadwal.'
                  : 'Siswa yang belum memilih akan dapat masuk dan memberikan hak suara mereka.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowStatusConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={confirmToggleStatus}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs"
              >
                Ya, Konfirmasi Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
