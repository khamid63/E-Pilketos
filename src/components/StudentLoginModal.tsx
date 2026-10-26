import React, { useState } from 'react';
import { db } from '../services/db';
import { Voter } from '../types';
import { Vote, Key, Eye, EyeOff, X, ShieldAlert } from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (voter: Voter) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [nisn, setNisn] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNisn = nisn.trim();
    const cleanPin = pin.trim();

    if (!cleanNisn || !cleanPin) {
      setErrorMsg('Harap masukkan NISN dan Kode Pemilihan dengan lengkap.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // 1. Verifikasi NISN dan Kode Pemilihan di basis data
      const voter = db.findVoterByNisnAndPin(cleanNisn, cleanPin);

      if (!voter) {
        setErrorMsg('NISN atau Kode Pemilihan tidak sesuai. Periksa kembali kartu pemilih resmi Anda.');
        return;
      }

      // 2. Verifikasi status pemilihan saat ini
      const election = db.getElection();
      if (election.status !== 'ongoing') {
        setErrorMsg(
          election.status === 'upcoming'
            ? 'Bilik suara belum dibuka oleh panitia. Silakan tunggu jadwal resmi pemilihan.'
            : 'Pemilihan telah selesai dan ditutup oleh panitia.'
        );
        return;
      }

      // 3. Verifikasi status akun aktif/ditangguhkan
      if (voter.status !== 'active') {
        setErrorMsg('Hak akses pemilih Anda sedang dinonaktifkan oleh panitia.');
        return;
      }

      // 4. Validasi hak suara (Satu Siswa, Satu Suara)
      if (voter.hasVoted) {
        setErrorMsg('Hak suara Anda telah digunakan dan tidak dapat memilih kembali.');
        return;
      }

      // 5. Masuk ke bilik suara
      onLoginSuccess(voter);
      onClose();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors active:scale-95"
            aria-label="Tutup formulir"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center shadow-md shrink-0">
              <Vote className="w-6 h-6 text-blue-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                Akses Bilik Suara Digital
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Verifikasi NISN &amp; Kode Pemilihan Siswa
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="text-xs text-slate-600 bg-blue-50/80 border border-blue-100/80 rounded-xl p-3.5 leading-relaxed">
            Masukkan <strong>NISN</strong> dan <strong>Kode Pemilihan (PIN unik)</strong> resmi yang tertera pada kartu suara dari Panitia Pilketos.
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="font-semibold leading-relaxed">{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nomor Induk Siswa Nasional (NISN)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 0081234001"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              className="h-12 w-full px-4 text-base sm:text-sm font-mono tracking-wider bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all shadow-2xs placeholder:text-slate-400 placeholder:font-sans placeholder:tracking-normal"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kode Pemilihan (Token / PIN Unik)
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={10}
                placeholder="Masukkan PIN / Token"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="h-12 w-full px-4 pr-12 text-base sm:text-sm font-mono tracking-widest bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all shadow-2xs placeholder:text-slate-400 placeholder:font-sans placeholder:tracking-normal"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-all"
                aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 leading-normal">
              Kode pemilihan bersifat rahasia dan hanya dapat digunakan 1 (satu) kali.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full py-3.5 px-4 bg-blue-900 hover:bg-blue-800 active:scale-[0.98] disabled:opacity-60 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{loading ? 'Memverifikasi Hak Suara...' : 'MASUK / MULAI MEMILIH'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
