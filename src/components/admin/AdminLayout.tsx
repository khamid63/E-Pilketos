import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  BarChart3,
  Upload,
  Download,
  FileCheck,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Vote,
  ExternalLink,
  Database,
} from 'lucide-react';
import { SchoolSettings } from '../../types';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
  onOpenPublicSite: () => void;
  settings: SchoolSettings;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onLogout,
  onOpenPublicSite,
  settings,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'voters', label: 'Data Pemilih', icon: Users },
    { id: 'classes', label: 'Data Kelas', icon: GraduationCap },
    { id: 'candidates', label: 'Pasangan Calon', icon: Award },
    { id: 'results', label: 'Hasil Suara & Grafik', icon: BarChart3 },
    { id: 'import', label: 'Import Data Siswa', icon: Upload },
    { id: 'berita-acara', label: 'Berita Acara Resmi', icon: FileCheck },
    { id: 'audit-log', label: 'Audit Log Sistem', icon: History },
    { id: 'settings', label: 'Pengaturan & SQL', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800 no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 font-bold flex items-center justify-center">
            <Vote className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-tight">E-Pilketos Admin</div>
            <div className="text-[10px] text-slate-400">SMPN 1 Tembarak</div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 md:min-h-screen border-r border-slate-800 flex flex-col justify-between z-30 no-print`}
      >
        <div>
          {/* Brand lockup */}
          <div className="p-5 border-b border-slate-800 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-amber-300 font-bold flex items-center justify-center shadow-xs">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-tight">
                Panel Panitia
              </div>
              <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {settings.schoolName}
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={onOpenPublicSite}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>Lihat Tampilan Siswa</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar Panitia</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3.5 hidden md:flex items-center justify-between no-print">
          <div className="text-xs font-medium text-slate-500">
            <span>E-Pilketos Panitia</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 font-semibold capitalize">
              {menuItems.find((m) => m.id === currentTab)?.label || currentTab}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Tahun Ajaran <strong className="text-slate-800">{settings.academicYear}</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-blue-900 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Admin Aktif
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
