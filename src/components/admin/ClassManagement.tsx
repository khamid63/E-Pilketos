import React, { useState } from 'react';
import { db } from '../../services/db';
import { ClassItem } from '../../types';
import { GraduationCap, Plus, Trash2, Users, CheckCircle2, X } from 'lucide-react';

interface ClassManagementProps {
  onRefreshData: () => void;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({ onRefreshData }) => {
  const classes = db.getClasses();
  const stats = db.getElectionResults();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [classNameInput, setClassNameInput] = useState('');
  const [gradeInput, setGradeInput] = useState<number>(7);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim()) {
      setErrorMsg('Nama kelas tidak boleh kosong.');
      return;
    }

    const exists = classes.some(
      (c) => c.className.toLowerCase() === classNameInput.trim().toLowerCase()
    );
    if (exists) {
      setErrorMsg('Kelas ini sudah ada.');
      return;
    }

    db.addClass(classNameInput.trim(), Number(gradeInput), 'admin');
    setIsAddOpen(false);
    setClassNameInput('');
    setErrorMsg('');
    onRefreshData();
  };

  const handleDeleteClass = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kelas ${name}?`)) {
      db.deleteClass(id, 'admin');
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Data Kelas &amp; Partisipasi Siswa
          </h2>
          <p className="text-xs text-slate-500">
            Daftar rombel kelas 7A-7F, 8A-8F, 9A-9F beserta statistik keaktifan pemilih
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Class Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Kelas</th>
                <th className="py-3 px-4 text-center">Tingkat</th>
                <th className="py-3 px-4 text-right">Total Pemilih</th>
                <th className="py-3 px-4 text-right">Sudah Memilih</th>
                <th className="py-3 px-4 text-right">Belum Memilih</th>
                <th className="py-3 px-4 text-right">Partisipasi</th>
                <th className="py-3 px-4 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.classStatistics.map((item, idx) => (
                <tr key={item.classId} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4 text-center font-mono text-slate-400 tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <span className="bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded text-xs">
                      Kelas {item.className}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">
                    Kelas {item.className.split(' ')[0]}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-slate-800">
                    {item.totalVoters}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-emerald-600">
                    {item.votedCount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-amber-600">
                    {item.unvotedCount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-blue-900">
                    {item.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteClass(item.classId, item.className)}
                      title="Hapus kelas"
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Class Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">Tambah Kelas Baru</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: VII D, VIII D, atau IX D"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tingkat Jenjang
                </label>
                <select
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value={7}>Kelas VII (Tujuh)</option>
                  <option value={8}>Kelas VIII (Delapan)</option>
                  <option value={9}>Kelas IX (Sembilan)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
