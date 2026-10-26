import React from 'react';
import { SchoolSettings } from '../types';
import { MapPin, Phone, ShieldCheck, Shield } from 'lucide-react';

interface FooterProps {
  settings: SchoolSettings;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdminLogin,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 text-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
          {/* Identity */}
          <div>
            <div className="text-white font-bold text-base tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              {settings.schoolName}
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Sistem Elektronik Pemilihan Ketua dan Wakil Ketua OSIS (E-Pilketos) Tahun Pelajaran {settings.academicYear}.
              Mewujudkan demokrasi sekolah yang langsung, umum, bebas, rahasia, jujur, dan adil.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-300/90 font-medium">
              <span>{settings.slogan}</span>
            </div>
          </div>

          {/* Location & Contacts */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Sekretariat Panitia
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.district}, {settings.regency}, {settings.province} {settings.postalCode}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/6282227563245"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors underline-offset-2 hover:underline"
                >
                  WhatsApp Panitia: {settings.committeePhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Ruang OSIS / Laboratorium Komputer Spensatem</span>
              </li>
            </ul>
          </div>

          {/* Admin & Committee Access */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Akses Panitia &amp; Pengawas
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Portal terautentikasi untuk Panitia Pemilihan OSIS dan Dewan Guru SMP Negeri 1 Tembarak guna memantau partisipasi dan tabulasi suara.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onOpenAdminLogin}
                className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-amber-300 font-semibold text-xs rounded-xl border border-blue-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                <span>Masuk Panel Admin Panitia</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            &copy; 2026 {settings.schoolName}. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Standar Keamanan KPU-OSIS</span>
            <span>·</span>
            <span>Enkripsi Suara Siswa</span>
            <span>·</span>
            <span>Audit Trail Transaksi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
