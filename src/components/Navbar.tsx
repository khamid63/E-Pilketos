import React from 'react';
import { User, Voter } from '../types';
import { Vote, Shield, LogOut, CheckCircle2, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentStudent: Voter | null;
  isAdmin: boolean;
  onOpenStudentLogin: () => void;
  onOpenAdminLogin: () => void;
  onStudentLogout: () => void;
  onAdminLogout: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  isElectionOngoing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStudent,
  isAdmin,
  onOpenStudentLogin,
  onOpenAdminLogin,
  onStudentLogout,
  onAdminLogout,
  activeSection,
  setActiveSection,
  isElectionOngoing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => setActiveSection('home')}
          className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-hidden min-w-0 cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 font-bold shadow-xs shrink-0">
            <Vote className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-base font-black tracking-tight text-blue-950 uppercase leading-none truncate">
              E-PILKETOS SPENABARA
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-tight sm:tracking-wide truncate mt-1">
              SMP Negeri 1 Tembarak 2026/2027
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        {!isAdmin && !currentStudent && (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveSection('home')}
              className={`hover:text-blue-900 transition-colors pb-0.5 cursor-pointer ${
                activeSection === 'home' ? 'text-blue-900 font-semibold border-b-2 border-amber-500' : ''
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => {
                setActiveSection('home');
                setTimeout(() => {
                  document.getElementById('section-candidates')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="hover:text-blue-900 transition-colors cursor-pointer"
            >
              Pasangan Calon
            </button>
            <button
              onClick={() => {
                setActiveSection('home');
                setTimeout(() => {
                  document.getElementById('section-tutorial')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="hover:text-blue-900 transition-colors cursor-pointer"
            >
              Tata Cara
            </button>
            <button
              onClick={() => {
                setActiveSection('home');
                setTimeout(() => {
                  document.getElementById('section-schedule')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="hover:text-blue-900 transition-colors cursor-pointer"
            >
              Jadwal &amp; Info
            </button>
          </nav>
        )}

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {currentStudent ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-900">{currentStudent.name}</div>
                <div className="text-[11px] text-slate-500">
                  NISN {currentStudent.nisn} · Kelas {currentStudent.className}
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium bg-slate-100 text-slate-700">
                {currentStudent.hasVoted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden xs:inline">Sudah Memilih</span>
                    <span className="xs:hidden">Sudah</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="hidden xs:inline">Belum Memilih</span>
                    <span className="xs:hidden">Belum</span>
                  </>
                )}
              </div>
              <button
                onClick={onStudentLogout}
                className="h-10 px-2.5 sm:px-3 text-xs font-medium text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                title="Keluar dari akun siswa"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-medium text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Panel Panitia
              </span>
              <button
                onClick={onAdminLogout}
                className="h-10 px-2.5 sm:px-3 text-xs font-medium text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onOpenAdminLogin}
                className="h-10 px-2.5 sm:px-3 text-xs font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-xl transition-all active:scale-[0.98] flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                onClick={onOpenStudentLogin}
                className="h-10 px-3 sm:px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 tracking-wide cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xs:inline">Masuk Bilik Suara</span>
                <span className="xs:hidden">Bilik Suara</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
