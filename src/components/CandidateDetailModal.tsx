import React from 'react';
import { Candidate, Voter } from '../types';
import { X, CheckCircle, Award, Target, Sparkles, UserCheck } from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onSelectCandidate?: (candidate: Candidate) => void;
  currentStudent: Voter | null;
  isElectionOngoing: boolean;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
  onSelectCandidate,
  currentStudent,
  isElectionOngoing,
}) => {
  if (!candidate) return null;

  const canVote = currentStudent && !currentStudent.hasVoted && isElectionOngoing && candidate.status === 'active';

  const handleSelect = () => {
    if (currentStudent?.hasVoted) {
      alert('Hak suara Anda telah digunakan dan tidak dapat memilih kembali.');
      return;
    }
    if (onSelectCandidate) {
      onClose();
      onSelectCandidate(candidate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-amber-400 text-blue-950 font-black text-xl flex items-center justify-center shadow-md">
              0{candidate.candidateNumber}
            </span>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Pasangan Calon Ketua & Wakil Ketua OSIS
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                {candidate.chairmanName} &amp; {candidate.viceChairmanName}
              </h2>
            </div>
          </div>
          <p className="mt-3 text-xs text-blue-100 italic border-l-2 border-amber-400 pl-3">
            &ldquo;{candidate.tagline}&rdquo;
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-sm">
          {/* Photo Showcase */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative aspect-4/3 max-h-72 flex items-center justify-center">
            <img
              src={candidate.chairmanPhoto}
              alt={`Paslon 0${candidate.candidateNumber}`}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 text-white">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-300 text-[10px] uppercase font-semibold">Calon Ketua OSIS</span>
                  <div className="font-semibold text-white truncate">{candidate.chairmanName}</div>
                </div>
                <div>
                  <span className="text-slate-300 text-[10px] uppercase font-semibold">Calon Wakil Ketua OSIS</span>
                  <div className="font-semibold text-white truncate">{candidate.viceChairmanName}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visi */}
          <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
              <Target className="w-4 h-4 text-amber-600" />
              <span>VISI</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
              {candidate.vision}
            </p>
          </div>

          {/* Misi */}
          <div>
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-3">
              <Award className="w-4 h-4 text-amber-600" />
              <span>MISI UTAMA</span>
            </div>
            <ol className="space-y-2.5">
              {candidate.mission.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Program Kerja */}
          <div>
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>PROGRAM KERJA UNGGULAN</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {candidate.programs.map((prog, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{prog}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-11 sm:h-10 px-5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
          >
            Tutup
          </button>
          {canVote && onSelectCandidate && (
            <button
              onClick={handleSelect}
              className="w-full sm:w-auto h-12 sm:h-10 px-6 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>Pilih Pasangan 0{candidate.candidateNumber}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
