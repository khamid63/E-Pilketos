import React, { useState, useEffect } from 'react';
import { Candidate } from '../types';
import { AlertTriangle, Check, X, Loader2 } from 'lucide-react';

interface VoteConfirmModalProps {
  candidate: Candidate | null;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export const VoteConfirmModal: React.FC<VoteConfirmModalProps> = ({
  candidate,
  onCancel,
  onConfirm,
  isSubmitting,
}) => {
  // Local submission lock to eliminate any race condition / double-clicking
  const [hasClickedSubmit, setHasClickedSubmit] = useState(false);

  useEffect(() => {
    // Reset submission lock when candidate changes or modal opens
    setHasClickedSubmit(false);
  }, [candidate]);

  if (!candidate) return null;

  const handleVoteSubmit = () => {
    if (hasClickedSubmit || isSubmitting) return; // Immediate lock
    setHasClickedSubmit(true);
    onConfirm();
  };

  const isLocked = isSubmitting || hasClickedSubmit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Warning Bar */}
        <div className="bg-amber-500 text-blue-950 px-5 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-950/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-blue-950" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-tight uppercase tracking-tight">KONFIRMASI PILIHAN SUARA</h3>
            <p className="text-xs text-blue-950/80 mt-0.5">Pemilihan Ketua &amp; Wakil Ketua OSIS</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 text-center">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
            Anda akan memilih pasangan:
          </p>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 mb-4 sm:mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-900 text-amber-300 font-black text-2xl shadow-sm mb-2">
              0{candidate.candidateNumber}
            </div>
            <h4 className="text-base sm:text-lg font-bold text-blue-950 leading-snug">
              {candidate.chairmanName}
            </h4>
            <div className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              &amp; {candidate.viceChairmanName}
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-left leading-relaxed">
            <p className="font-bold text-amber-900 mb-1">Perhatian Penting:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-800 font-normal">
              <li>Apakah Anda yakin dengan pilihan Anda?</li>
              <li>Pilihan yang sudah dikirim <strong>tidak dapat diubah</strong> kembali.</li>
              <li>Satu siswa hanya memiliki 1 (satu) hak suara yang sah.</li>
              <li>Status Anda akan langsung ditandai <strong>&quot;Sudah Memilih&quot;</strong>.</li>
            </ul>
          </div>
        </div>

        {/* Thumb-friendly mobile buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLocked}
            className="w-full sm:w-auto h-11 sm:h-10 px-5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Kembali / Batal</span>
          </button>
          <button
            type="button"
            onClick={handleVoteSubmit}
            disabled={isLocked}
            className="w-full sm:flex-1 h-12 px-5 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLocked ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Mengunci &amp; Mencatat Suara...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-amber-300" />
                <span>Ya, Kirim Suara Sah</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
