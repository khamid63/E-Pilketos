import React from 'react';
import { Candidate, Election, SchoolSettings } from '../types';
import {
  Vote,
  Shield,
  Clock,
  CheckCircle2,
  FileText,
  UserCheck,
  ChevronRight,
  Award,
  Calendar,
} from 'lucide-react';

interface LandingPageProps {
  settings: SchoolSettings;
  election: Election;
  candidates: Candidate[];
  onOpenStudentLogin: () => void;
  onOpenAdminLogin: () => void;
  onOpenCandidateDetail: (candidate: Candidate) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  settings,
  election,
  candidates,
  onOpenStudentLogin,
  onOpenAdminLogin,
  onOpenCandidateDetail,
}) => {
  const isOngoing = election.status === 'ongoing';

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white rounded-3xl mx-3 sm:mx-6 lg:mx-8 px-4 sm:px-10 py-12 sm:py-16 md:py-20 shadow-xl border border-blue-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_50%)] pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tahun Pelajaran {settings.academicYear} · Resmi KPU-OSIS</span>
          </div>

          {/* Titles */}
          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-[11px] sm:text-xs uppercase tracking-widest text-blue-200 font-bold">
              Sistem Elektronik Pemilihan
            </h2>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
              Ketua &amp; Wakil Ketua OSIS
            </h1>
            <div className="text-lg sm:text-2xl font-bold text-amber-400 tracking-wide">
              {settings.schoolName}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              {settings.address}, {settings.district}, {settings.regency}
            </p>
          </div>

          {/* Slogan */}
          <div className="pt-1">
            <p className="text-sm sm:text-base md:text-lg italic text-amber-300/90 font-serif">
              &ldquo;{settings.slogan}&rdquo;
            </p>
          </div>

          {/* Status Indicator */}
          <div className="pt-1 flex justify-center">
            {isOngoing ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                PEMILIHAN SEDANG BERLANGSUNG
              </span>
            ) : election.status === 'upcoming' ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                PEMILIHAN BELUM DIMULAI
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] sm:text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                PEMILIHAN TELAH SELESAI
              </span>
            )}
          </div>

          {/* Primary CTA Button */}
          <div className="pt-3 flex justify-center">
            <button
              onClick={onOpenStudentLogin}
              className="w-full sm:w-auto h-12 sm:h-13 px-8 sm:px-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-sm sm:text-base shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <UserCheck className="w-5 h-5 text-blue-950" />
              <span>MASUK BILIK SUARA</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Candidates Spotlight Section */}
      <section id="section-candidates" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] sm:text-xs font-bold text-blue-900 uppercase tracking-widest">
            Kandidat Pemimpin OSIS
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mt-1">
            Pasangan Calon Ketua &amp; Wakil Ketua
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Pelajari visi, misi, dan program kerja terbaik dari para calon pemimpin kesiswaan SMP Negeri 1 Tembarak.
          </p>
        </div>

        {/* Dynamic Centering with Flexbox: always centered regardless of candidate count */}
        <div className="flex flex-wrap justify-center items-stretch gap-6">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="w-full max-w-sm sm:w-[320px] md:w-[360px] bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col overflow-hidden"
            >
              {/* Photo Area with Floating Badge */}
              <div className="relative aspect-4/3 sm:aspect-1/1 lg:aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={cand.chairmanPhoto}
                  alt={`Paslon 0${cand.candidateNumber}`}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Paslon Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-400 text-blue-950 font-black text-sm px-3 py-1.5 rounded-xl shadow-md border border-amber-300/60">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-950/70">PASLON</span>
                  <span className="text-base leading-none">0{cand.candidateNumber}</span>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-3.5 text-white">
                  <div className="text-[11px] sm:text-xs text-amber-300 font-medium italic line-clamp-1">
                    &ldquo;{cand.tagline}&rdquo;
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Calon Ketua
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                      {cand.chairmanName}
                    </h3>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Calon Wakil Ketua
                    </span>
                    <h4 className="font-semibold text-sm sm:text-base text-slate-700 leading-snug">
                      {cand.viceChairmanName}
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed pt-2.5 border-t border-slate-100">
                    {cand.vision}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onOpenCandidateDetail(cand)}
                    className="flex-1 h-11 px-3 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
                  >
                    Lihat Visi &amp; Misi
                  </button>
                  <button
                    onClick={onOpenStudentLogin}
                    className="h-11 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
                  >
                    Pilih Paslon
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tutorial / Steps Section */}
      <section id="section-tutorial" className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-5 sm:p-8 md:p-12">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-bold text-blue-900 uppercase tracking-widest">
              Panduan Pemilih
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mt-1">
              Tata Cara Memilih di E-Pilketos
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              Ikuti 6 langkah mudah berikut untuk menggunakan hak suara Anda:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 font-bold text-xs flex items-center justify-center mb-3.5">
                  01
                </span>
                <h3 className="font-bold text-sm text-slate-900 mb-1.5">Input NISN &amp; Kode Pemilihan</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Masukkan NISN dan Kode Pemilihan (Token/PIN) yang telah dibagikan oleh panitia.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-900 font-semibold">
                Kerahasiaan Terjamin
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 font-bold text-xs flex items-center justify-center mb-3.5">
                  02
                </span>
                <h3 className="font-bold text-sm text-slate-900 mb-1.5">Buka Bilik Suara Digital</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Klik tombol &quot;Masuk / Mulai Memilih&quot; untuk membuka bilik suara digital.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-900 font-semibold">
                Verifikasi Seketika
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 font-bold text-xs flex items-center justify-center mb-3.5">
                  03
                </span>
                <h3 className="font-bold text-sm text-slate-900 mb-1.5">Pelajari Visi &amp; Misi Paslon</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Pelajari visi, misi, dan program kerja masing-masing Pasangan Calon (Paslon).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-900 font-semibold">
                Pilih Berdasarkan Nurani
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 font-bold text-xs flex items-center justify-center mb-3.5">
                  04
                </span>
                <h3 className="font-bold text-sm text-slate-900 mb-1.5">Tentukan Paslon Pilihan</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Tentukan pilihan dengan menekan tombol &quot;Pilih&quot; pada kartu Paslon yang dikehendaki.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-900 font-semibold">
                1 Siswa = 1 Hak Suara
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 font-bold text-xs flex items-center justify-center mb-3.5">
                  05
                </span>
                <h3 className="font-bold text-sm text-slate-900 mb-1.5">Konfirmasi Pilihan Suara</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Konfirmasi pilihan suara Anda pada jendela dialog yang muncul.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-900 font-semibold">
                Validasi Final
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3.5">
                  06
                </span>
                <h3 className="font-bold text-sm text-slate-900 mb-1.5">Suara Sah Tercatat</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Setelah konfirmasi berhasil, hak suara Anda telah resmi tercatat dan sesi pemilihan selesai. Setiap siswa hanya dapat memilih 1 (satu) kali.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold">
                Hak Suara Terkunci Aman
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule & Rules Section */}
      <section id="section-schedule" className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Rules Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">Ketentuan &amp; Tata Tertib Pemilihan</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pemilih adalah seluruh siswa aktif SMP Negeri 1 Tembarak kelas 7, 8, dan 9 (rombel 7A-7F, 8A-8F, 9A-9F) yang terdaftar dalam DPT.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Setiap pemilih hanya berhak memberikan 1 (satu) suara secara sah dan tidak dapat diwakilkan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pemberian suara bersifat Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil (LUBER JURDIL).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Dilarang melakukan intimidasi, penyebaran hoaks, atau manipulasi akun pemilih siswa lain.</span>
              </li>
            </ul>
          </div>

          {/* Schedule & Contact Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900">Jadwal &amp; Kontak Panitia</h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Hari / Tanggal Pemungutan Suara
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                    Selasa, 27 Oktober 2026
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Laboratorium Komputer &amp; Akses Mandiri Siswa
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Bantuan &amp; Pengaduan Teknis Panitia
                  </div>
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                    {settings.committeeContact}
                  </div>
                  <div className="pt-1">
                    <a
                      href="https://wa.me/6282227563245"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-[0.98] hover:shadow-md cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      <span>WhatsApp Panitia: 0822-2756-3245</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4 sm:mt-0">
              <span>Penanggung Jawab: {settings.principal}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
