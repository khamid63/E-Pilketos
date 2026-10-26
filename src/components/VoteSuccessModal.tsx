import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck, LogOut, Calendar, Hash } from 'lucide-react';

interface VoteSuccessModalProps {
  votedAt?: string;
  digitalToken?: string;
  onFinish: () => void;
  schoolName: string;
}

export const VoteSuccessModal: React.FC<VoteSuccessModalProps> = ({
  votedAt,
  digitalToken,
  onFinish,
  schoolName,
}) => {
  useEffect(() => {
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1e3a8a', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      console.log('Confetti effect skipped', e);
    }
  }, []);

  const formattedTime = votedAt
    ? new Date(votedAt).toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    : new Date().toLocaleString('id-ID');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-center">
        {/* Success Icon */}
        <div className="bg-emerald-600 text-white pt-7 pb-5 px-6 relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-xs mx-auto flex items-center justify-center shadow-lg border-2 border-white/40 mb-3">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
            Suara Berhasil Dicatat!
          </h2>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            Hak suara Anda telah tersimpan secara sah &amp; terenkripsi
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 text-sm">
          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
            Terima kasih telah berpartisipasi aktif dalam <strong>Pemilihan Ketua dan Wakil Ketua OSIS {schoolName}</strong>. Suara Anda sangat berarti bagi kemajuan organisasi kesiswaan.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-900" />
                <span>Waktu Pemilihan:</span>
              </span>
              <span className="font-semibold text-slate-800 tabular-nums text-[11px] sm:text-xs">{formattedTime}</span>
            </div>

            {digitalToken && (
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-900" />
                  <span>Kode Verifikasi:</span>
                </span>
                <span className="font-mono font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                  {digitalToken}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sesuai asas LUBER JURDIL, pilihan individu Anda dijaga kerahasiaannya.</span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={onFinish}
              className="w-full h-12 px-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-amber-300" />
              <span>Selesai &amp; Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
