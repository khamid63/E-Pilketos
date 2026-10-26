import React, { useState } from 'react';
import { db } from '../../services/db';
import { Candidate } from '../../types';
import {
  Award,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  X,
  Upload,
  AlertCircle,
  ImageIcon,
} from 'lucide-react';

interface CandidateManagementProps {
  onRefreshData: () => void;
  onPreviewCandidate: (cand: Candidate) => void;
}

export const CandidateManagement: React.FC<CandidateManagementProps> = ({
  onRefreshData,
  onPreviewCandidate,
}) => {
  const candidates = db.getCandidates();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [deleteTargetCandidate, setDeleteTargetCandidate] = useState<Candidate | null>(null);

  // Form states
  const [formNumber, setFormNumber] = useState<number>(1);
  const [formChairman, setFormChairman] = useState('');
  const [formViceChairman, setFormViceChairman] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [formVision, setFormVision] = useState('');
  const [formMissions, setFormMissions] = useState<string>('');
  const [formPrograms, setFormPrograms] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenAdd = () => {
    setEditingCandidate(null);
    setFormNumber(candidates.length + 1);
    setFormChairman('');
    setFormViceChairman('');
    setFormTagline('');
    setFormPhoto(candidates[0]?.chairmanPhoto || '');
    setFormVision('');
    setFormMissions('');
    setFormPrograms('');
    setFormStatus('active');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cand: Candidate) => {
    setEditingCandidate(cand);
    setFormNumber(cand.candidateNumber);
    setFormChairman(cand.chairmanName);
    setFormViceChairman(cand.viceChairmanName);
    setFormTagline(cand.tagline || '');
    setFormPhoto(cand.chairmanPhoto);
    setFormVision(cand.vision);
    setFormMissions(cand.mission.join('\n'));
    setFormPrograms(cand.programs.join('\n'));
    setFormStatus(cand.status);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (<= 3MB)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Format file harus berupa JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormPhoto(reader.result as string);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formChairman.trim() || !formViceChairman.trim() || !formVision.trim()) {
      setErrorMsg('Harap lengkapi nama calon ketua, wakil, dan visi.');
      return;
    }

    const missionArray = formMissions
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const programArray = formPrograms
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingCandidate) {
      const updated: Candidate = {
        ...editingCandidate,
        candidateNumber: Number(formNumber),
        chairmanName: formChairman.trim(),
        viceChairmanName: formViceChairman.trim(),
        tagline: formTagline.trim(),
        chairmanPhoto: formPhoto || editingCandidate.chairmanPhoto,
        vision: formVision.trim(),
        mission: missionArray.length > 0 ? missionArray : editingCandidate.mission,
        programs: programArray.length > 0 ? programArray : editingCandidate.programs,
        status: formStatus,
      };
      db.saveCandidate(updated, false, 'admin');
    } else {
      const newCand: Candidate = {
        id: 'cand-' + Date.now(),
        candidateNumber: Number(formNumber),
        chairmanName: formChairman.trim(),
        viceChairmanName: formViceChairman.trim(),
        tagline: formTagline.trim() || 'Bersama Membangun SMP Negeri 1 Tembarak',
        chairmanPhoto: formPhoto || candidates[0]?.chairmanPhoto,
        vision: formVision.trim(),
        mission:
          missionArray.length > 0
            ? missionArray
            : ['Meningkatkan kedisiplinan dan akhlak mulia siswa.'],
        programs:
          programArray.length > 0
            ? programArray
            : ['Kegiatan Literasi dan Porseni Antarkelas.'],
        status: formStatus,
        createdAt: new Date().toISOString(),
      };
      db.saveCandidate(newCand, true, 'admin');
    }

    setIsModalOpen(false);
    onRefreshData();
  };

  const handleConfirmDeleteCandidate = () => {
    if (!deleteTargetCandidate) return;
    db.deleteCandidate(deleteTargetCandidate.id, 'admin');
    setDeleteTargetCandidate(null);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Manajemen Pasangan Calon OSIS
          </h2>
          <p className="text-xs text-slate-500">
            Kelola nomor urut, foto, nama kandidat, visi, misi, dan program kerja
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pasangan Calon</span>
        </button>
      </div>

      {/* Grid of Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {candidates.map((cand) => (
          <div
            key={cand.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden justify-between"
          >
            <div>
              {/* Header */}
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  PASANGAN CALON
                </span>
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 font-black text-lg flex items-center justify-center">
                  0{cand.candidateNumber}
                </span>
              </div>

              {/* Photo */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={cand.chairmanPhoto}
                  alt={`Paslon 0${cand.candidateNumber}`}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2">
                  {cand.status === 'active' ? (
                    <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      AKTIF
                    </span>
                  ) : (
                    <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      NON-AKTIF
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Calon Ketua</span>
                  <div className="font-bold text-sm text-slate-900">{cand.chairmanName}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Calon Wakil Ketua</span>
                  <div className="font-semibold text-xs text-slate-800">{cand.viceChairmanName}</div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Motto</span>
                  <p className="text-xs text-slate-600 italic line-clamp-2">&ldquo;{cand.tagline}&rdquo;</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => onPreviewCandidate(cand)}
                className="p-1.5 text-xs text-blue-900 hover:bg-blue-100 rounded-lg flex items-center gap-1 font-semibold"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cand)}
                  className="p-1.5 text-xs text-slate-700 hover:text-blue-900 hover:bg-slate-200 rounded-lg flex items-center gap-1 font-semibold"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetCandidate(cand)}
                  className="p-1.5 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Pasangan Calon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-base">
                {editingCandidate ? `Edit Pasangan Calon 0${editingCandidate.candidateNumber}` : 'Tambah Pasangan Calon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Urut
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={9}
                    value={formNumber}
                    onChange={(e) => setFormNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Pasangan
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="active">Aktif (Dapat Dipilih)</option>
                    <option value="inactive">Non-Aktif (Ditangguhkan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Calon Ketua
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Calon Ketua OSIS"
                    value={formChairman}
                    onChange={(e) => setFormChairman(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Calon Wakil Ketua
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Calon Wakil Ketua OSIS"
                    value={formViceChairman}
                    onChange={(e) => setFormViceChairman(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Motto / Slogan Paslon
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Berkarakter, Berprestasi, dan Berbudaya Lingkungan"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Photo Upload / Preview */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Foto Pasangan Calon (Format JPG/PNG/WebP, Maks 3MB)
                </label>
                <div className="flex items-center gap-4">
                  {formPhoto && (
                    <div className="w-20 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                      <img src={formPhoto} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageFileChange}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Visi Pasangan Calon
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan visi kepemimpinan..."
                  value={formVision}
                  onChange={(e) => setFormVision(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Misi Pasangan Calon (1 Butir Misi per Baris)
                </label>
                <textarea
                  rows={4}
                  placeholder="Butir misi 1&#10;Butir misi 2&#10;Butir misi 3"
                  value={formMissions}
                  onChange={(e) => setFormMissions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Program Kerja Unggulan (1 Program per Baris)
                </label>
                <textarea
                  rows={4}
                  placeholder="Program kerja unggulan 1&#10;Program kerja unggulan 2"
                  value={formPrograms}
                  onChange={(e) => setFormPrograms(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg leading-relaxed font-sans"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Simpan Pasangan Calon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Candidate */}
      {deleteTargetCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-red-600 text-white p-5 flex items-center gap-3">
              <Trash2 className="w-6 h-6 text-white" />
              <div>
                <h4 className="font-bold text-base">Hapus Pasangan Calon</h4>
                <p className="text-xs text-red-100">Penghapusan Data dari Bilik Suara</p>
              </div>
            </div>

            <div className="p-6 text-xs text-slate-700 space-y-3">
              <p>Apakah Anda yakin ingin menghapus data pasangan calon berikut?</p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-sm text-slate-900">
                  Paslon 0{deleteTargetCandidate.candidateNumber}: {deleteTargetCandidate.chairmanName} &amp; {deleteTargetCandidate.viceChairmanName}
                </div>
                <div className="text-[11px] text-slate-500 italic">
                  &ldquo;{deleteTargetCandidate.tagline}&rdquo;
                </div>
              </div>
              <p className="text-red-700 font-medium">
                Peringatan: Pasangan ini tidak akan lagi muncul dalam surat suara pemilihan.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTargetCandidate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCandidate}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Pasangan Calon</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
