import React, { useState } from 'react';
import { db } from '../../services/db';
import { ClassItem, Voter } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Filter,
  X,
  AlertTriangle,
  Download,
} from 'lucide-react';

interface VoterManagementProps {
  onRefreshData: () => void;
}

export const VoterManagement: React.FC<VoterManagementProps> = ({ onRefreshData }) => {
  const voters = db.getVoters();
  const classes = db.getClasses();

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // all, voted, unvoted

  // Modals state
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resetTargetVoter, setResetTargetVoter] = useState<Voter | null>(null);
  const [deleteTargetVoter, setDeleteTargetVoter] = useState<Voter | null>(null);
  const [selectedVoterIds, setSelectedVoterIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Form states
  const [formNisn, setFormNisn] = useState('');
  const [formName, setFormName] = useState('');
  const [formClassId, setFormClassId] = useState(classes[0]?.id || '');
  const [formPin, setFormPin] = useState('');
  const [formError, setFormError] = useState('');

  // Filtering
  const filteredVoters = voters.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.nisn.includes(search) ||
      v.className.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'all' || v.classId === filterClass || v.className === filterClass;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'voted' && v.hasVoted) ||
      (filterStatus === 'unvoted' && !v.hasVoted);
    return matchSearch && matchClass && matchStatus;
  });

  const handleOpenAdd = () => {
    setFormNisn('');
    setFormName('');
    setFormClassId(classes[0]?.id || '');
    setFormPin(Math.floor(1000 + Math.random() * 9000).toString());
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (voter: Voter) => {
    setEditingVoter(voter);
    setFormNisn(voter.nisn);
    setFormName(voter.name);
    setFormClassId(voter.classId);
    setFormPin(voter.pin);
    setFormError('');
  };

  const handleSaveVoter = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formNisn.trim() || !formName.trim() || !formPin.trim()) {
      setFormError('Semua kolom wajib diisi.');
      return;
    }

    const selectedClass = classes.find((c) => c.id === formClassId) || {
      id: formClassId,
      className: 'Umum',
    };

    if (editingVoter) {
      // Update
      const updated: Voter = {
        ...editingVoter,
        nisn: formNisn.trim(),
        name: formName.trim(),
        classId: selectedClass.id,
        className: selectedClass.className,
        pin: formPin.trim(),
      };
      db.saveVoter(updated, false, 'admin');
      setEditingVoter(null);
    } else {
      // Create new
      const exists = voters.some((v) => v.nisn === formNisn.trim());
      if (exists) {
        setFormError('NISN ini sudah terdaftar sebelumnya.');
        return;
      }

      const newVoter: Voter = {
        id: 'vtr-' + Date.now(),
        nisn: formNisn.trim(),
        name: formName.trim(),
        classId: selectedClass.id,
        className: selectedClass.className,
        pin: formPin.trim(),
        hasVoted: false,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      db.saveVoter(newVoter, true, 'admin');
      setIsAddModalOpen(false);
    }

    onRefreshData();
  };

  const handleConfirmReset = () => {
    if (!resetTargetVoter) return;
    db.resetVoterVoteStatus(resetTargetVoter.id, 'admin');
    setResetTargetVoter(null);
    onRefreshData();
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetVoter) return;
    db.deleteVoter(deleteTargetVoter.id, 'admin');
    setSelectedVoterIds((prev) => prev.filter((id) => id !== deleteTargetVoter.id));
    setDeleteTargetVoter(null);
    onRefreshData();
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedVoterIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllFilteredSelected =
    filteredVoters.length > 0 &&
    filteredVoters.every((v) => selectedVoterIds.includes(v.id));

  const handleSelectAll = () => {
    if (isAllFilteredSelected) {
      const filteredIds = new Set(filteredVoters.map((v) => v.id));
      setSelectedVoterIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const allFilteredIds = filteredVoters.map((v) => v.id);
      setSelectedVoterIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleConfirmBulkDelete = () => {
    if (selectedVoterIds.length === 0) return;
    db.deleteVotersBatch(selectedVoterIds, 'admin');
    setSelectedVoterIds([]);
    setIsBulkDeleteModalOpen(false);
    onRefreshData();
  };

  // Export DPT to CSV
  const handleExportCsv = () => {
    const headers = ['No', 'NISN', 'Nama Siswa', 'Kelas', 'PIN', 'Status Memilih', 'Waktu Memilih'];
    const rows = voters.map((v, idx) => [
      idx + 1,
      `'${v.nisn}`,
      `"${v.name}"`,
      v.className,
      v.pin,
      v.hasVoted ? 'SUDAH MEMILIH' : 'BELUM MEMILIH',
      v.votedAt ? new Date(v.votedAt).toLocaleString('id-ID') : '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DPT_PEMILIH_SMPN1_TEMBARAK_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Data Siswa Pemilih (DPT)
          </h2>
          <p className="text-xs text-slate-500">
            Total {voters.length} siswa terdaftar ({voters.filter((v) => v.hasVoted).length} sudah memilih)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedVoterIds.length > 0 && (
            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 animate-in fade-in"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih ({selectedVoterIds.length})</span>
            </button>
          )}
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DPT</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pemilih</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NISN, atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Semua Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.className}>
                Kelas {c.className}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Semua Status</option>
            <option value="unvoted">Belum Memilih</option>
            <option value="voted">Sudah Memilih</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllFilteredSelected}
                    onChange={handleSelectAll}
                    title="Pilih Semua"
                    className="w-4 h-4 rounded-sm border-slate-300 text-blue-900 focus:ring-blue-600 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">PIN</th>
                <th className="py-3 px-4">Status Pemilihan</th>
                <th className="py-3 px-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVoters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-semibold text-slate-700">
                        {voters.length === 0
                          ? 'Belum ada data siswa pemilih (DPT) yang tersimpan di sistem.'
                          : 'Tidak ditemukan data pemilih yang sesuai kriteria pencarian.'}
                      </p>
                      {voters.length === 0 && (
                        <p className="text-xs text-slate-400">
                          Silakan unggah berkas Excel (.xlsx) melalui tab <strong>Import Data Siswa</strong> atau tekan tombol <strong>Tambah Pemilih</strong> di atas untuk memasukkan data pemilih resmi.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVoters.map((voter, index) => (
                  <tr
                    key={voter.id}
                    className={`transition-colors ${
                      selectedVoterIds.includes(voter.id)
                        ? 'bg-blue-50/70'
                        : 'hover:bg-blue-50/40'
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedVoterIds.includes(voter.id)}
                        onChange={() => handleToggleSelectOne(voter.id)}
                        className="w-4 h-4 rounded-sm border-slate-300 text-blue-900 focus:ring-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400 tabular-nums">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                      {voter.nisn}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {voter.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded text-[11px]">
                        {voter.className}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 bg-slate-50/50">
                      {voter.pin}
                    </td>
                    <td className="py-3 px-4">
                      {voter.hasVoted ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sudah Memilih</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Belum Memilih</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Reset vote button */}
                        {voter.hasVoted && (
                          <button
                            onClick={() => setResetTargetVoter(voter)}
                            title="Reset status hak suara siswa"
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEdit(voter)}
                          title="Edit siswa"
                          className="p-1 text-slate-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetVoter(voter)}
                          title="Hapus siswa"
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Voter Modal */}
      {(isAddModalOpen || editingVoter) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingVoter ? 'Edit Data Pemilih' : 'Tambah Pemilih Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingVoter(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVoter} className="p-6 space-y-4">
              {formError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Induk Siswa Nasional (NISN)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 0081234055"
                  value={formNisn}
                  onChange={(e) => setFormNisn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Bintang Pratama"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelas
                </label>
                <select
                  value={formClassId}
                  onChange={(e) => setFormClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    PIN Pemilih (4-6 Digit)
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormPin(Math.floor(1000 + Math.random() * 9000).toString())}
                    className="text-[11px] text-blue-900 hover:underline"
                  >
                    Acak PIN
                  </button>
                </div>
                <input
                  type="text"
                  value={formPin}
                  onChange={(e) => setFormPin(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono tracking-widest"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingVoter(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg"
                >
                  {editingVoter ? 'Simpan Perubahan' : 'Tambah Pemilih'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Reset Voter Vote Status */}
      {resetTargetVoter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-amber-600 text-white p-5 flex items-center gap-3">
              <RotateCcw className="w-6 h-6" />
              <div>
                <h4 className="font-bold text-base">Konfirmasi Reset Hak Suara</h4>
                <p className="text-xs text-amber-100">Audit Trail Pencatatan Resmi</p>
              </div>
            </div>

            <div className="p-6 text-xs text-slate-700 space-y-3">
              <p>
                Anda akan mereset status suara untuk siswa:
                <strong className="block text-sm text-slate-900 mt-1 font-bold">
                  {resetTargetVoter.name} ({resetTargetVoter.nisn} - Kelas {resetTargetVoter.className})
                </strong>
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                Peringatan: Tindakan ini akan mengembalikan status pemilih menjadi &quot;Belum Memilih&quot; dan menghapus catatan suara pemilih ini dari tabulasi. Aktivitas ini akan dicatat ke dalam <strong>Audit Log Panitia</strong>.
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setResetTargetVoter(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
              >
                Ya, Reset Status Suara
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Voter */}
      {deleteTargetVoter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-red-600 text-white p-5 flex items-center gap-3">
              <Trash2 className="w-6 h-6" />
              <div>
                <h4 className="font-bold text-base">Hapus Data Pemilih</h4>
                <p className="text-xs text-red-100">Penghapusan dari DPT</p>
              </div>
            </div>

            <div className="p-6 text-xs text-slate-700 space-y-2">
              <p>Apakah Anda yakin ingin menghapus data siswa berikut dari daftar pemilih?</p>
              <div className="p-3 bg-slate-100 rounded-lg font-medium text-slate-900">
                {deleteTargetVoter.name} (NISN: {deleteTargetVoter.nisn} - Kelas {deleteTargetVoter.className})
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTargetVoter(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Bulk Delete Voters */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-red-600 text-white p-5 flex items-center gap-3">
              <Trash2 className="w-6 h-6 text-white" />
              <div>
                <h4 className="font-bold text-base">Hapus Massal Data Pemilih</h4>
                <p className="text-xs text-red-100">Penghapusan Massal dari DPT</p>
              </div>
            </div>

            <div className="p-6 text-xs text-slate-700 space-y-3">
              <p>
                Apakah Anda yakin ingin menghapus sebanyak{' '}
                <strong className="text-red-700 font-bold text-sm">
                  {selectedVoterIds.length} data pemilih
                </strong>{' '}
                yang telah dicentang dari basis data?
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
                <div className="font-bold">Peringatan:</div>
                <div>
                  Tindakan ini akan menghapus data siswa secara permanen dari DPT pemilihan. Data yang dihapus tidak dapat dipulihkan kembali.
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus {selectedVoterIds.length} Pemilih</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
