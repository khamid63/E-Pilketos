import React from 'react';
import { Candidate, Election, Voter } from '../types';
import { db } from '../services/db';
import { CheckCircle2, Clock, AlertTriangle, Eye, UserCheck, ShieldCheck, ShieldAlert, Info } from 'lucide-react';

interface StudentDashboardProps {
  currentStudent: Voter;
  election: Election;
  candidates: Candidate[];
  onOpenCandidateDetail: (candidate: Candidate) => void;
  onRequestVote: (candidate: Candidate) => void;
  onLogout: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentStudent,
  election,
  candidates,
  onOpenCandidateDetail,
  onRequestVote,
  onLogout,
}) => {
  const isElectionOngoing = election.status === 'ongoing';
  const isElectionUpcoming = election.status === 'upcoming';
  const isElectionCompleted = election.status === 'completed';

  const handleVoteAttempt = (candidate: Candidate) => {
    // Strict defense: check if already voted
    if (currentStudent.hasVoted) {
      alert('Hak suara Anda telah digunakan dan tidak dapat memilih kembali.');
      return;
    }
    onRequestVote(candidate);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Student Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/80 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs uppercase tracking-wider text-blue-900 font-bold mb-1">
              Portal Pemilih Siswa
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 truncate">
              Selamat datang, <span className="text-blue-950">{currentStudent.name}</span>
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-slate-600">
              <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-800 font-semibold text-[11px] sm:text-xs">
                NISN: {currentStudent.nisn}
              </span>
              <span className="font-semibold text-blue-900 bg-blue-100/80 px-2.5 py-1 rounded-md text-[11px] sm:text-xs">
                Kelas: {currentStudent.className}
              </span>
              <span className="hidden sm:inline-block text-slate-400">·</span>
              <span className="text-slate-500 text-[11px] sm:text-xs">SMP Negeri 1 Tembarak</span>
            </div>
          </div>

          {/* Status Box */}
          <div className="shrink-0 pt-2 sm:pt-0">
            {currentStudent.hasVoted ? (
              <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    Status Hak Suara
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-700">
                    Sudah Memilih
                  </div>
                  {currentStudent.votedAt && (
                    <div className="text-[10px] sm:text-[11px] text-emerald-600 tabular-nums">
                      Tercatat pukul {new Date(currentStudent.votedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </div>
                  )}
                </div>
              </div>
            ) : isElectionOngoing ? (
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500 text-blue-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Status Pemilihan
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-amber-900">
                    Belum Memilih
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-amber-700">
                    Silakan tentukan pilihan Anda di bawah ini
                  </div>
                </div>
              </div>
            ) : isElectionUpcoming ? (
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-100 border border-slate-300 flex items-center gap-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 shrink-0" />
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Status Pemilihan
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-700">
                    Pemilihan Belum Dimulai
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 shrink-0" />
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-red-900 uppercase tracking-wide">
                    Status Pemilihan
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-red-700">
                    Pemilihan Telah Ditutup
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prominent Warning & Advisory Message if Already Voted */}
      {currentStudent.hasVoted && (
        <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-4 sm:p-6 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-emerald-950 leading-snug">
                Hak suara Anda telah digunakan dan tidak dapat memilih kembali.
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                Pilihan Anda telah tercatat dengan aman pada sistem database pemilihan OSIS SMP Negeri 1 Tembarak. Demi menjaga integritas dan asas kerahasiaan pemilihan (Satu Siswa, Satu Suara), hak suara Anda telah terkunci secara permanen.
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full sm:w-auto h-11 px-5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs shrink-0 transition-all active:scale-[0.98] flex items-center justify-center"
          >
            Selesai &amp; Keluar
          </button>
        </div>
      )}

      {/* Notice if Election is Closed or Upcoming */}
      {!currentStudent.hasVoted && !isElectionOngoing && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-6 text-slate-800 flex items-start gap-3.5">
          <Info className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-amber-950">
              {isElectionUpcoming ? 'Pemilihan Belum Dimulai' : 'Pemilihan Telah Ditutup'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
              {isElectionUpcoming
                ? 'Jadwal bilik suara digital saat ini belum dibuka oleh panitia. Anda tetap dapat membaca visi, misi, dan program kerja masing-masing pasangan calon.'
                : 'Waktu pemberian suara untuk periode ini telah berakhir. Hubungi panitia pemilihan jika ada pertanyaan.'}
            </p>
          </div>
        </div>
      )}

      {/* Candidate Ballot Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-6 gap-1.5 sm:gap-2">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-blue-900 uppercase tracking-widest">
              Surat Suara Elektronik
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5">
              Daftar Pasangan Calon Ketua &amp; Wakil Ketua OSIS
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {currentStudent.hasVoted
              ? 'Hak suara Anda telah digunakan.'
              : 'Pilihlah salah satu pasangan calon terbaik Anda secara jujur dan mandiri.'}
          </p>
        </div>

        {/* Candidate Flexbox: dynamic centering regardless of candidate count */}
        <div className="flex flex-wrap justify-center items-stretch gap-6">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className={`w-full max-w-sm sm:w-[320px] md:w-[350px] bg-white rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden relative shadow-xs ${
                cand.status === 'active'
                  ? 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                  : 'opacity-60 border-slate-200'
              }`}
            >
              {/* Photo Area with Floating Candidate Badge */}
              <div className="relative aspect-4/3 sm:aspect-1/1 lg:aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={cand.chairmanPhoto}
                  alt={`Paslon 0${cand.candidateNumber}`}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Modern Floating Candidate Number Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-400 text-blue-950 font-black text-sm px-3 py-1.5 rounded-xl shadow-md border border-amber-300/60">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-950/70">PASLON</span>
                  <span className="text-base leading-none">0{cand.candidateNumber}</span>
                </div>

                {/* Slogan Overlay at bottom of image */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-3.5 text-white">
                  <div className="text-[11px] sm:text-xs text-amber-300 font-medium italic line-clamp-1">
                    &ldquo;{cand.tagline}&rdquo;
                  </div>
                </div>
              </div>

              {/* Names & Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Calon Ketua OSIS
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                      {cand.chairmanName}
                    </h3>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Calon Wakil Ketua OSIS
                    </span>
                    <h4 className="font-semibold text-sm sm:text-base text-slate-700 leading-snug">
                      {cand.viceChairmanName}
                    </h4>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Ringkasan Visi
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {cand.vision}
                    </p>
                  </div>
                </div>

                {/* Actions: High touch target for mobile */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <button
                    onClick={() => onOpenCandidateDetail(cand)}
                    className="w-full h-10 px-3 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Visi, Misi &amp; Program</span>
                  </button>

                  {!currentStudent.hasVoted && isElectionOngoing && cand.status === 'active' ? (
                    <button
                      onClick={() => handleVoteAttempt(cand)}
                      className="w-full h-12 px-4 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <UserCheck className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                      <span>Pilih Paslon 0{cand.candidateNumber}</span>
                    </button>
                  ) : currentStudent.hasVoted ? (
                    <div className="w-full h-11 px-3 text-center text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center">
                      Hak Suara Telah Digunakan
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
