import React, { useState } from 'react';
import { db } from '../../services/db';
import { Election, SchoolSettings } from '../../types';
import {
  Settings,
  Save,
  RotateCcw,
  Database,
  FileCode,
  ShieldAlert,
  CheckCircle2,
  Download,
  Server,
  BookOpen,
} from 'lucide-react';

interface SettingsViewProps {
  settings: SchoolSettings;
  election: Election;
  onRefreshData: () => void;
  onOpenSqlModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  election,
  onRefreshData,
  onOpenSqlModal,
}) => {
  const [formData, setFormData] = useState<SchoolSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleChange = (field: keyof SchoolSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(formData, 'admin');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    onRefreshData();
  };

  const handleResetToDemo = () => {
    db.resetAllToDefault();
    setFormData(db.getSettings());
    setIsResetConfirmOpen(false);
    onRefreshData();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Pengaturan Sistem &amp; Ekspor Hosting
        </h2>
        <p className="text-xs text-slate-500">
          Sesuaikan identitas sekolah, pejabat penandatangan, serta kelola basis data
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengaturan identitas sekolah berhasil diperbarui.</span>
        </div>
      )}

      {/* Database & Hosting Deployment Card */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Paket Deployment Hosting Sekolah (PHP 8+ &amp; MySQL)
              </h3>
              <p className="text-xs text-slate-300">
                Unduh skema database SQL siap impor dan panduan instalasi server lokal / cPanel sekolah
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSqlModal}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <FileCode className="w-4 h-4" />
            <span>Lihat Skema SQL &amp; Panduan PHP</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-2 border-t border-white/10">
          <div>
            <strong className="text-white block mb-0.5">Kompatibilitas:</strong>
            PHP 8.0 - 8.3+, Apache/Nginx, MariaDB / MySQL 5.7+
          </div>
          <div>
            <strong className="text-white block mb-0.5">Keamanan:</strong>
            PDO Prepared Statements, Password Hashing, CSRF Shield
          </div>
          <div>
            <strong className="text-white block mb-0.5">Integritas Suara:</strong>
            Unique voter_id constraint &amp; DB Transaction Rollback
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-sm text-slate-900">Identitas Sekolah &amp; Pemilihan</h3>
          <p className="text-xs text-slate-500">Data ini muncul pada kop surat, landing page, dan berita acara resmi.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Sekolah
            </label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tahun Pelajaran
            </label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => handleChange('academicYear', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Lengkap Sekolah
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kecamatan &amp; Kabupaten
            </label>
            <input
              type="text"
              value={`${formData.district}, ${formData.regency}`}
              onChange={(e) => handleChange('regency', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Slogan Pemilihan
            </label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => handleChange('slogan', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
        </div>

        {/* Committee & Principals for Berita Acara */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Pejabat &amp; Penandatangan Berita Acara</h3>
          <p className="text-xs text-slate-500 mb-4">Nama pejabat yang tercantum pada lembar tanda tangan dokumen resmi.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ketua Panitia Pemilihan
              </label>
              <input
                type="text"
                value={formData.committeeChair}
                onChange={(e) => handleChange('committeeChair', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sekretaris Panitia
              </label>
              <input
                type="text"
                value={formData.committeeSecretary}
                onChange={(e) => handleChange('committeeSecretary', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pembina OSIS
              </label>
              <input
                type="text"
                value={formData.osisSupervisor}
                onChange={(e) => handleChange('osisSupervisor', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.principal}
                onChange={(e) => handleChange('principal', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.principalNip}
                onChange={(e) => handleChange('principalNip', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Telepon / Hotline Panitia
              </label>
              <input
                type="text"
                value={formData.committeePhone}
                onChange={(e) => handleChange('committeePhone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset to Production Clean Slate */}
      <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <h3 className="font-bold text-sm text-red-950">Zona Pembersihan Data (Reset Produksi)</h3>
            <p className="text-xs text-red-800">
              Kosongkan seluruh data pemilih (DPT) dan riwayat suara masuk untuk memulai pemungutan suara resmi dari kondisi bersih (0 suara).
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500">
            Perhatian: 3 Pasangan Calon dan Rombel Kelas tetap dipertahankan. Hanya data pemilih dan tabulasi suara yang akan dikosongkan.
          </div>
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 text-xs font-bold text-red-700 hover:text-white bg-white hover:bg-red-600 border border-red-300 rounded-xl transition-colors shadow-xs shrink-0"
          >
            Kosongkan Data Pemilih &amp; Suara
          </button>
        </div>
      </div>

      {/* Modal Confirm Reset */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-red-600 text-white p-5 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6" />
              <div>
                <h4 className="font-bold text-base">Konfirmasi Pengosongan Data</h4>
                <p className="text-xs text-red-100">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="p-6 text-xs text-slate-700 space-y-3">
              <p>
                Apakah Anda benar-benar yakin ingin mengosongkan seluruh data pemilih dan riwayat suara masuk?
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>3 Pasangan calon resmi dan rombel kelas <strong>tetap dipertahankan</strong></li>
                <li>Seluruh data DPT pemilih akan <strong>dikosongkan (0 pemilih)</strong></li>
                <li>Seluruh suara masuk akan <strong>dibersihkan (0 suara)</strong></li>
                <li>Sistem siap menerima import data Excel siswa riil</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleResetToDemo}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Ya, Bersihkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
