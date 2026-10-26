import React from 'react';
import { db } from '../../services/db';
import { SchoolSettings } from '../../types';
import { Printer, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface BeritaAcaraProps {
  settings: SchoolSettings;
  onBack: () => void;
}

export const BeritaAcara: React.FC<BeritaAcaraProps> = ({ settings, onBack }) => {
  const stats = db.getElectionResults();
  const election = db.getElection();

  const handlePrint = () => {
    window.print();
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Determine winner
  const sortedCandidates = [...stats.candidateResults].sort((a, b) => b.voteCount - a.voteCount);
  const winner = sortedCandidates[0];

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden during print) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Hasil Suara</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-5 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>Cetak / Simpan PDF Berita Acara</span>
        </button>
      </div>

      {/* Official Printable Sheet Container */}
      <div className="bg-white p-8 sm:p-12 border border-slate-300 shadow-lg rounded-xl max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 text-slate-950 font-serif leading-relaxed">
        {/* Kop Surat Resmi */}
        <div className="text-center pb-4 border-b-4 border-double border-black space-y-1">
          <div className="text-sm font-bold tracking-wider uppercase">
            Pemerintah Kabupaten Temanggung
          </div>
          <div className="text-sm font-bold tracking-wider uppercase">
            Dinas Pendidikan, Kepemudaan dan Olahraga
          </div>
          <div className="text-xl font-black tracking-tight uppercase">
            {settings.schoolName}
          </div>
          <div className="text-xs font-sans text-slate-700">
            {settings.address}, {settings.district}, {settings.regency}, {settings.province} {settings.postalCode}
          </div>
          <div className="text-xs font-sans text-slate-700">
            Telepon: {settings.committeePhone} · Laman: https://smpn1tembarak.sch.id
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center my-6 space-y-1">
          <h2 className="text-base font-bold uppercase tracking-wide underline underline-offset-4">
            BERITA ACARA HASIL PEMILIHAN KETUA DAN WAKIL KETUA OSIS
          </h2>
          <div className="text-xs font-sans">
            Nomor: 421.3 / 088 / PAN-PILKETOS / {new Date().getFullYear()}
          </div>
          <div className="text-xs font-sans font-semibold">
            Tahun Pelajaran {settings.academicYear}
          </div>
        </div>

        {/* Legal Text Body */}
        <div className="text-xs sm:text-sm font-sans space-y-4 text-justify leading-relaxed">
          <p>
            Pada hari ini, <strong>{todayFormatted}</strong>, bertempat di <strong>SMP Negeri 1 Tembarak</strong>, telah diselenggarakan rangkaian pemungutan dan penghitungan suara secara elektronik dalam rangka <strong>Pemilihan Ketua dan Wakil Ketua OSIS Periode {settings.academicYear}</strong> dengan asas Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil.
          </p>

          <p>
            Berdasarkan hasil rekapitulasi data tabulasi sistem bilik suara digital E-Pilketos, dilaporkan rincian pelaksanaan sebagai berikut:
          </p>

          {/* Numerical Summary Table */}
          <div className="my-4 font-sans text-xs">
            <table className="w-full border-collapse border border-black">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 w-10 text-center font-bold">1.</td>
                  <td className="p-2 w-72">Jumlah Pemilih Terdaftar dalam DPT</td>
                  <td className="p-2 font-bold font-mono">: {stats.totalVoters} Siswa</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 text-center font-bold">2.</td>
                  <td className="p-2">Jumlah Pemilih yang Menggunakan Hak Suara</td>
                  <td className="p-2 font-bold font-mono">: {stats.votedCount} Siswa ({stats.participationRate}%)</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 text-center font-bold">3.</td>
                  <td className="p-2">Jumlah Pemilih yang Tidak Menggunakan Hak Suara</td>
                  <td className="p-2 font-mono">: {stats.unvotedCount} Siswa</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 text-center font-bold">4.</td>
                  <td className="p-2">Jumlah Total Suara Sah Masuk</td>
                  <td className="p-2 font-bold font-mono">: {stats.totalValidVotes} Suara</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Adapun perolehan suara masing-masing pasangan calon Ketua dan Wakil Ketua OSIS adalah sebagai berikut:
          </p>

          {/* Candidate Results Table */}
          <div className="my-4 font-sans text-xs">
            <table className="w-full border-collapse border border-black text-center">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-bold">
                  <th className="p-2 border-r border-black w-14">No. Urut</th>
                  <th className="p-2 border-r border-black text-left">Nama Pasangan Calon</th>
                  <th className="p-2 border-r border-black w-32">Perolehan Suara</th>
                  <th className="p-2 w-28">Persentase</th>
                </tr>
              </thead>
              <tbody>
                {stats.candidateResults.map((cand) => (
                  <tr key={cand.candidate.id} className="border-b border-black">
                    <td className="p-2 border-r border-black font-bold font-mono">
                      0{cand.candidate.candidateNumber}
                    </td>
                    <td className="p-2 border-r border-black text-left">
                      <strong>{cand.candidate.chairmanName}</strong>
                      <div className="text-slate-600">&amp; {cand.candidate.viceChairmanName}</div>
                    </td>
                    <td className="p-2 border-r border-black font-mono font-bold">
                      {cand.voteCount} Suara
                    </td>
                    <td className="p-2 font-mono font-bold">
                      {cand.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Winner Statement */}
          {winner && (
            <p className="bg-slate-50 border border-black p-3 rounded text-xs leading-relaxed">
              Berdasarkan perolehan suara terbanyak, maka Panitia Pemilihan menetapkan Pasangan Calon Nomor Urut <strong>0{winner.candidate.candidateNumber}</strong> atas nama <strong>{winner.candidate.chairmanName}</strong> (sebagai Calon Ketua OSIS Terpilih) dan <strong>{winner.candidate.viceChairmanName}</strong> (sebagai Calon Wakil Ketua OSIS Terpilih) untuk disahkan sebagai Ketua dan Wakil Ketua OSIS SMP Negeri 1 Tembarak Masa Bakti {settings.academicYear}.
            </p>
          )}

          <p>
            Demikian Berita Acara ini dibuat dengan sebenarnya dan ditandatangani oleh Panitia Pemilihan, Pembina OSIS, serta disahkan oleh Kepala Sekolah untuk dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* 4 Signatures Block */}
        <div className="mt-12 pt-6 font-sans text-xs">
          <div className="text-right mb-6 text-slate-800">
            Tembarak, {todayFormatted}
          </div>

          <div className="grid grid-cols-2 gap-12 text-center">
            {/* Ketua Panitia */}
            <div className="space-y-16">
              <div>
                <div className="font-semibold text-slate-600">Ketua Panitia Pilketos,</div>
              </div>
              <div>
                <div className="font-bold underline text-slate-900">{settings.committeeChair}</div>
                <div className="text-[11px] text-slate-500">NIP. -</div>
              </div>
            </div>

            {/* Sekretaris */}
            <div className="space-y-16">
              <div>
                <div className="font-semibold text-slate-600">Sekretaris Panitia,</div>
              </div>
              <div>
                <div className="font-bold underline text-slate-900">{settings.committeeSecretary}</div>
                <div className="text-[11px] text-slate-500">NIP. -</div>
              </div>
            </div>

            {/* Pembina OSIS */}
            <div className="space-y-16 pt-4">
              <div>
                <div className="font-semibold text-slate-600">Mengetahui,</div>
                <div className="font-semibold text-slate-600">Pembina OSIS SMPN 1 Tembarak</div>
              </div>
              <div>
                <div className="font-bold underline text-slate-900">{settings.osisSupervisor}</div>
                <div className="text-[11px] text-slate-500">NIP. 19680315 199412 1 002</div>
              </div>
            </div>

            {/* Kepala Sekolah */}
            <div className="space-y-16 pt-4">
              <div>
                <div className="font-semibold text-slate-600">Mengesahkan,</div>
                <div className="font-semibold text-slate-600">Kepala SMP Negeri 1 Tembarak</div>
              </div>
              <div>
                <div className="font-bold underline text-slate-900">{settings.principal}</div>
                <div className="text-[11px] text-slate-500">NIP. {settings.principalNip}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
