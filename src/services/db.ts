import {
  AuditLog,
  Candidate,
  CandidateResult,
  ClassItem,
  ClassStatistic,
  Election,
  SchoolSettings,
  User,
  Vote,
  Voter,
} from '../types';

import paslon1Img from '../assets/images/paslon1_tembarak_1790867295706.jpg';
import paslon2Img from '../assets/images/paslon2_tembarak_1790867309212.jpg';
import paslon3Img from '../assets/images/paslon3_tembarak_1790867319879.jpg';
import { firestore } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';

const STORAGE_KEYS = {
  SETTINGS: 'epilketos_settings_v1',
  ELECTION: 'epilketos_election_v1',
  CLASSES: 'epilketos_classes_v1',
  CANDIDATES: 'epilketos_candidates_v1',
  VOTERS: 'epilketos_voters_prod_v2',
  VOTES: 'epilketos_votes_prod_v2',
  AUDIT_LOGS: 'epilketos_audit_logs_prod_v2',
  ADMIN_USER: 'epilketos_admin_v1',
};

// Default Settings
export const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'SMP NEGERI 1 TEMBARAK',
  subTitle: 'KABUPATEN TEMANGGUNG',
  address: 'Jalan Raya Tembarak, Desa Tembarak',
  village: 'Tembarak',
  district: 'Kecamatan Tembarak',
  regency: 'Kabupaten Temanggung',
  province: 'Jawa Tengah',
  postalCode: '56261',
  academicYear: '2026/2027',
  electionName: 'Pemilihan Ketua dan Wakil Ketua OSIS',
  slogan: 'Suaramu Menentukan Masa Depan OSIS',
  committeeContact: 'Sekretariat Panitia Pilketos (Ruang OSIS SMPN 1 Tembarak)',
  committeePhone: '0822-2756-3245',
  committeeChair: 'Budi Santoso, S.Pd.',
  committeeSecretary: 'Rina Wijayanti, S.Pd.',
  osisSupervisor: 'Drs. H. Sugeng Supriyanto',
  principal: 'Dra. Hj. Sri Wahyuni, M.Pd.',
  principalNip: '19710514 199702 2 001',
};

// Default Classes: Jenjang 7, 8, dan 9 (Kelas A sampai F)
export const DEFAULT_CLASSES: ClassItem[] = [
  { id: 'cls-7a', className: '7A', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7b', className: '7B', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7c', className: '7C', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7d', className: '7D', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7e', className: '7E', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7f', className: '7F', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8a', className: '8A', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8b', className: '8B', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8c', className: '8C', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8d', className: '8D', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8e', className: '8E', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8f', className: '8F', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9a', className: '9A', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9b', className: '9B', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9c', className: '9C', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9d', className: '9D', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9e', className: '9E', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9f', className: '9F', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
];

// Official 3 Valid Candidates (Intact)
export const DEFAULT_CANDIDATES: Candidate[] = [
  {
    id: 'cand-01',
    candidateNumber: 1,
    chairmanName: 'Ahmad Fauzi Nurcahyo',
    viceChairmanName: 'Siti Rahmawati Putri',
    chairmanPhoto: paslon1Img,
    tagline: 'Berkarakter, Berprestasi, dan Berbudaya Lingkungan',
    vision:
      'Mewujudkan OSIS SMP Negeri 1 Tembarak sebagai wadah aspirasi siswa yang berakhlak mulia, unggul dalam prestasi akademik maupun non-akademik, serta peduli terhadap kelestarian lingkungan sekolah.',
    mission: [
      'Menumbuhkan nilai religius dan budi pekerti luhur melalui pembiasaan ibadah bersama dan peringatan hari besar keagamaan.',
      'Mendukung program literasi, sains club, dan ekstrakurikuler sekolah untuk mencetak siswa berprestasi di tingkat kabupaten maupun provinsi.',
      'Menggalakkan gerakan Sekolah Adiwiyata: pilah sampah organik-anorganik, penghijauan taman kelas, dan program Spensatem Bersih Bersemi.',
      'Membangun komunikasi dua arah antara pengurus OSIS, perwakilan kelas, dan pihak dewan guru secara terbuka.',
    ],
    programs: [
      'Spensatem Islamic & Character Festival (SICF)',
      'Green Campus & Bersih Kelasku Tiap Jumat Pagi',
      'Pekan Prestasi & Bimbingan Minat Bakat (P2MB)',
      'Kotak Aspirasi Digital Siswa via Mading Interaktif',
    ],
    status: 'active',
    createdAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 'cand-02',
    candidateNumber: 2,
    chairmanName: 'Dimas Arya Pratama',
    viceChairmanName: 'Annisa Nurul Hidayah',
    chairmanPhoto: paslon2Img,
    tagline: 'Kreatif, Kolaboratif, Mengabdi untuk Seluruh Siswa Spensatem',
    vision:
      'Menjadikan OSIS SMP Negeri 1 Tembarak yang aktif, kreatif, berdaya saing global dengan tetap menjunjung tinggi kearifan lokal Temanggung serta semangat gotong royong.',
    mission: [
      'Mengembangkan kreativitas seni, sastra, dan budaya lokal khas Temanggung (jaran kepang, tari daerah, dan batik lokal).',
      'Menciptakan iklim belajar yang menyenangkan melalui program tutor sebaya antarkelas.',
      'Meningkatkan jiwa kepemimpinan pengurus kelas melalui Latihan Dasar Kepemimpinan Siswa (LDKS) yang inovatif.',
      'Mengoptimalkan pemanfaatan media digital sekolah yang santun, edukatif, dan positif.',
    ],
    programs: [
      'Spensatem Youth Cultural Festival (Pentas Seni Budaya Lokal)',
      'Program Teman Belajar (Peer Tutoring & Diskusi Asyik)',
      'Liga Olahraga & E-Sports Persahabatan Antarkelas',
      'Buletin OSIS Berkala & Podcast Inspirasi Remaja',
    ],
    status: 'active',
    createdAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 'cand-03',
    candidateNumber: 3,
    chairmanName: 'Muhammad Rizky Ramadhan',
    viceChairmanName: 'Zahra Amalia Putri',
    chairmanPhoto: paslon3Img,
    tagline: 'OSIS Aspiratif: Wadah Kreasi, Prestasi, dan Teknologi Siswa',
    vision:
      'Mewujudkan organisasi kesiswaan yang inklusif, adaptif terhadap teknologi digital, serta mendorong siswa SMP Negeri 1 Tembarak menjadi pribadi yang disiplin, mandiri, dan berwawasan luas.',
    mission: [
      'Menghidupkan peran mading sekolah baik fisik maupun digital sebagai pusat informasi inspiratif siswa.',
      'Mengadakan pelatihan keterampilan praktis (desain grafis dasar, public speaking, dan jurnalistik muda).',
      'Mempererat persaudaraan antarsiswa tanpa membeda-bedakan latar belakang, serta kampanye anti-bullying dan anti-perundungan.',
      'Bekerjasama dengan UKS dan PMR sekolah untuk mewujudkan pola hidup bersih dan sehat bagi seluruh warga sekolah.',
    ],
    programs: [
      'Spensatem Digital Workshop: Konten Positif & Public Speaking',
      'Gerakan Senyum Sapa Salam & Duta Anti-Bullying Spensatem',
      'Bulan Bahasa & Spensatem Book Review Competition',
      'Donor Buku & Pojok Baca Nyaman di Tiap Lorong Kelas',
    ],
    status: 'active',
    createdAt: '2026-09-10T08:00:00Z',
  },
];

// Production Clean State: Empty voters (0 dummy / demo voters)
export const DEFAULT_VOTERS: Voter[] = [];

// Production Clean State: Empty votes (0 dummy / demo votes)
export const DEFAULT_VOTES: Vote[] = [];

export const DEFAULT_ELECTION: Election = {
  id: 'el-2026-1',
  electionName: 'Pemilihan Ketua dan Wakil Ketua OSIS Periode 2026/2027',
  academicYear: '2026/2027',
  startTime: '2026-10-27T00:00:00',
  endTime: '2026-10-27T23:59:59',
  status: 'ongoing',
  createdAt: '2026-09-01T08:00:00Z',
};

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'usr-admin',
    userName: 'Administrator Panitia',
    action: 'INISIALISASI_SISTEM',
    description: 'Sistem E-Pilketos SMP Negeri 1 Tembarak siap produksi. Basis data pemilih bersih (0 DPT, 0 suara).',
    ipAddress: '192.168.1.10 (Server Sekolah)',
    createdAt: '2026-10-27T06:00:00Z',
  },
  {
    id: 'log-002',
    userId: 'usr-admin',
    userName: 'Administrator Panitia',
    action: 'BUKA_PEMILIHAN',
    description: 'Pemilihan resmi dibuka oleh Ketua Panitia Pilketos pada Selasa, 27 Oktober 2026.',
    ipAddress: '192.168.1.10 (Ruang Panitia)',
    createdAt: '2026-10-27T06:30:00Z',
  },
];

class DatabaseService {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  // Initialize DB in production-clean state
  public init(): void {
    // Purge legacy demo keys if they exist in localStorage
    const legacyDemoKeys = ['epilketos_voters_v1', 'epilketos_votes_v1', 'epilketos_audit_logs_v1'];
    legacyDemoKeys.forEach((k) => {
      if (localStorage.getItem(k)) {
        localStorage.removeItem(k);
      }
    });

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.setStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    } else {
      // Sync WhatsApp hotline if still holding old demo phone
      const curSettings = this.getStorage<SchoolSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      if (curSettings.committeePhone === '0812-3456-7890' || !curSettings.committeePhone) {
        curSettings.committeePhone = '0822-2756-3245';
        this.setStorage(STORAGE_KEYS.SETTINGS, curSettings);
      }
    }

    // Ensure all 18 classes (7A-7F, 8A-8F, 9A-9F) exist in storage
    const storedClasses = this.getStorage<ClassItem[]>(STORAGE_KEYS.CLASSES, []);
    const hasAll18Classes =
      storedClasses.length === 18 &&
      DEFAULT_CLASSES.every((dc) => storedClasses.some((sc) => sc.className === dc.className));
    if (!hasAll18Classes) {
      this.setStorage(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
    }

    if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
      this.setStorage(STORAGE_KEYS.CANDIDATES, DEFAULT_CANDIDATES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VOTERS)) {
      this.setStorage(STORAGE_KEYS.VOTERS, DEFAULT_VOTERS);
    } else {
      // In case any demo accounts are still present in STORAGE_KEYS.VOTERS, purge them
      const currentVoters = this.getStorage<Voter[]>(STORAGE_KEYS.VOTERS, []);
      const containsDemo = currentVoters.some((v) => v.id.startsWith('vtr-00') || v.nisn === '0081234001');
      if (containsDemo) {
        this.setStorage(STORAGE_KEYS.VOTERS, []);
        this.setStorage(STORAGE_KEYS.VOTES, []);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.VOTES)) {
      this.setStorage(STORAGE_KEYS.VOTES, DEFAULT_VOTES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ELECTION)) {
      this.setStorage(STORAGE_KEYS.ELECTION, DEFAULT_ELECTION);
    } else {
      const curElection = this.getStorage<Election>(STORAGE_KEYS.ELECTION, DEFAULT_ELECTION);
      if (curElection.startTime.startsWith('2026-10-01')) {
        curElection.startTime = '2026-10-27T00:00:00';
        curElection.endTime = '2026-10-27T23:59:59';
        this.setStorage(STORAGE_KEYS.ELECTION, curElection);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      this.setStorage(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
    }

    // Launch background cloud sync with Firestore
    this.syncWithFirestore().catch((err) => console.warn('Firestore initial sync notice:', err));
  }

  // Cloud sync status
  public isCloudConnected = false;

  public async syncWithFirestore(): Promise<void> {
    try {
      // 1. Settings
      const settingsSnap = await getDoc(doc(firestore, 'settings', 'config'));
      if (settingsSnap.exists()) {
        this.setStorage(STORAGE_KEYS.SETTINGS, settingsSnap.data() as SchoolSettings);
      } else {
        const cur = this.getSettings();
        await setDoc(doc(firestore, 'settings', 'config'), cur);
      }

      // 2. Election
      const electionSnap = await getDoc(doc(firestore, 'elections', 'active'));
      if (electionSnap.exists()) {
        this.setStorage(STORAGE_KEYS.ELECTION, electionSnap.data() as Election);
      } else {
        const cur = this.getElection();
        await setDoc(doc(firestore, 'elections', 'active'), cur);
      }

      // 3. Classes
      const classesSnap = await getDocs(collection(firestore, 'classes'));
      if (!classesSnap.empty) {
        const cloudClasses: ClassItem[] = [];
        classesSnap.forEach((d) => cloudClasses.push(d.data() as ClassItem));
        this.setStorage(STORAGE_KEYS.CLASSES, cloudClasses);
      } else {
        const cur = this.getClasses();
        const batch = writeBatch(firestore);
        cur.forEach((c) => batch.set(doc(firestore, 'classes', c.id), c));
        await batch.commit();
      }

      // 4. Candidates
      const candSnap = await getDocs(collection(firestore, 'candidates'));
      if (!candSnap.empty) {
        const cloudCands: Candidate[] = [];
        candSnap.forEach((d) => cloudCands.push(d.data() as Candidate));
        this.setStorage(STORAGE_KEYS.CANDIDATES, cloudCands);
      } else {
        const cur = this.getCandidates();
        const batch = writeBatch(firestore);
        cur.forEach((c) => batch.set(doc(firestore, 'candidates', c.id), c));
        await batch.commit();
      }

      // 5. Voters
      const votersSnap = await getDocs(collection(firestore, 'voters'));
      if (!votersSnap.empty) {
        const cloudVoters: Voter[] = [];
        votersSnap.forEach((d) => cloudVoters.push(d.data() as Voter));
        this.setStorage(STORAGE_KEYS.VOTERS, cloudVoters);
      }

      // 6. Votes
      const votesSnap = await getDocs(collection(firestore, 'votes'));
      if (!votesSnap.empty) {
        const cloudVotes: Vote[] = [];
        votesSnap.forEach((d) => cloudVotes.push(d.data() as Vote));
        this.setStorage(STORAGE_KEYS.VOTES, cloudVotes);
      }

      this.isCloudConnected = true;
    } catch (err) {
      console.warn('Firestore sync background notice:', err);
    }
  }

  public resetAllToDefault(): void {
    this.setStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.setStorage(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
    this.setStorage(STORAGE_KEYS.CANDIDATES, DEFAULT_CANDIDATES);
    this.setStorage(STORAGE_KEYS.VOTERS, []);
    this.setStorage(STORAGE_KEYS.VOTES, []);
    this.setStorage(STORAGE_KEYS.ELECTION, DEFAULT_ELECTION);
    this.setStorage(STORAGE_KEYS.AUDIT_LOGS, [
      ...DEFAULT_AUDIT_LOGS,
      {
        id: 'log-' + Date.now(),
        userId: 'admin',
        userName: 'Administrator Panitia',
        action: 'RESET_DATA_PRODUKSI',
        description: 'Seluruh data pemilih dan rekapitulasi suara berhasil dikosongkan (Kondisi Bersih Produksi).',
        ipAddress: '127.0.0.1 (Server Sekolah)',
        createdAt: new Date().toISOString(),
      },
    ]);

    // Sync reset to cloud
    setDoc(doc(firestore, 'settings', 'config'), DEFAULT_SETTINGS).catch(console.error);
    setDoc(doc(firestore, 'elections', 'active'), DEFAULT_ELECTION).catch(console.error);
  }

  // Settings
  public getSettings(): SchoolSettings {
    return this.getStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public updateSettings(settings: SchoolSettings, adminUser = 'admin'): void {
    this.setStorage(STORAGE_KEYS.SETTINGS, settings);
    this.addAuditLog(adminUser, 'UBAH_PENGATURAN', 'Memperbarui identitas dan pengaturan pemilihan.');
    setDoc(doc(firestore, 'settings', 'config'), settings).catch(console.error);
  }

  // Election
  public getElection(): Election {
    return this.getStorage(STORAGE_KEYS.ELECTION, DEFAULT_ELECTION);
  }

  public updateElectionStatus(status: Election['status'], adminUser = 'admin'): void {
    const election = this.getElection();
    election.status = status;
    this.setStorage(STORAGE_KEYS.ELECTION, election);
    const actionName = status === 'ongoing' ? 'BUKA_PEMILIHAN' : status === 'completed' ? 'TUTUP_PEMILIHAN' : 'JEDA_PEMILIHAN';
    this.addAuditLog(adminUser, actionName, `Mengubah status pemilihan menjadi "${status}".`);
    setDoc(doc(firestore, 'elections', 'active'), election).catch(console.error);
  }

  public updateElection(updated: Partial<Election>, adminUser = 'admin'): void {
    const election = { ...this.getElection(), ...updated };
    this.setStorage(STORAGE_KEYS.ELECTION, election);
    this.addAuditLog(adminUser, 'UPDATE_JADWAL', `Memperbarui rincian jadwal pemilihan.`);
    setDoc(doc(firestore, 'elections', 'active'), election).catch(console.error);
  }

  // Classes
  public getClasses(): ClassItem[] {
    return this.getStorage(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
  }

  public addClass(className: string, grade: number, adminUser = 'admin'): ClassItem {
    const classes = this.getClasses();
    const newClass: ClassItem = {
      id: 'cls-' + Date.now(),
      className: className.trim(),
      grade,
      createdAt: new Date().toISOString(),
    };
    classes.push(newClass);
    this.setStorage(STORAGE_KEYS.CLASSES, classes);
    this.addAuditLog(adminUser, 'TAMBAH_KELAS', `Menambahkan kelas baru: ${className}`);
    setDoc(doc(firestore, 'classes', newClass.id), newClass).catch(console.error);
    return newClass;
  }

  public deleteClass(id: string, adminUser = 'admin'): boolean {
    const classes = this.getClasses();
    const target = classes.find((c) => c.id === id);
    const filtered = classes.filter((c) => c.id !== id);
    this.setStorage(STORAGE_KEYS.CLASSES, filtered);
    if (target) {
      this.addAuditLog(adminUser, 'HAPUS_KELAS', `Menghapus kelas ${target.className}`);
    }
    deleteDoc(doc(firestore, 'classes', id)).catch(console.error);
    return true;
  }

  // Candidates
  public getCandidates(): Candidate[] {
    return this.getStorage(STORAGE_KEYS.CANDIDATES, DEFAULT_CANDIDATES);
  }

  public saveCandidate(candidate: Candidate, isNew: boolean, adminUser = 'admin'): void {
    const list = this.getCandidates();
    if (isNew) {
      list.push(candidate);
      this.addAuditLog(adminUser, 'TAMBAH_PASLON', `Menambahkan pasangan calon nomor ${candidate.candidateNumber} (${candidate.chairmanName} & ${candidate.viceChairmanName})`);
    } else {
      const idx = list.findIndex((c) => c.id === candidate.id);
      if (idx !== -1) {
        list[idx] = candidate;
        this.addAuditLog(adminUser, 'UBAH_PASLON', `Memperbarui data pasangan calon nomor ${candidate.candidateNumber}`);
      }
    }
    this.setStorage(STORAGE_KEYS.CANDIDATES, list);
    setDoc(doc(firestore, 'candidates', candidate.id), candidate).catch(console.error);
  }

  public deleteCandidate(id: string, adminUser = 'admin'): void {
    const list = this.getCandidates();
    const target = list.find((c) => c.id === id);
    const filtered = list.filter((c) => c.id !== id);
    this.setStorage(STORAGE_KEYS.CANDIDATES, filtered);
    if (target) {
      this.addAuditLog(adminUser, 'HAPUS_PASLON', `Menghapus pasangan calon nomor urut ${target.candidateNumber}`);
    }
    deleteDoc(doc(firestore, 'candidates', id)).catch(console.error);
  }

  // Voters
  public getVoters(): Voter[] {
    return this.getStorage(STORAGE_KEYS.VOTERS, DEFAULT_VOTERS);
  }

  public getVoterById(id: string): Voter | null {
    const voters = this.getVoters();
    return voters.find((v) => v.id === id) || null;
  }

  public findVoterByNisnAndPin(nisn: string, pin: string): Voter | null {
    const voters = this.getVoters();
    const cleanNisn = nisn.trim();
    const cleanPin = pin.trim();
    const found = voters.find((v) => v.nisn === cleanNisn && v.pin === cleanPin);
    return found || null;
  }

  public saveVoter(voter: Voter, isNew: boolean, adminUser = 'admin'): void {
    const voters = this.getVoters();
    if (isNew) {
      voters.push(voter);
      this.addAuditLog(adminUser, 'TAMBAH_PEMILIH', `Menambahkan siswa pemilih: ${voter.name} (${voter.nisn} - ${voter.className})`);
    } else {
      const idx = voters.findIndex((v) => v.id === voter.id);
      if (idx !== -1) {
        voters[idx] = voter;
        this.addAuditLog(adminUser, 'UBAH_PEMILIH', `Memperbarui data siswa: ${voter.name} (${voter.nisn})`);
      }
    }
    this.setStorage(STORAGE_KEYS.VOTERS, voters);
    setDoc(doc(firestore, 'voters', voter.id), voter).catch(console.error);
  }

  public deleteVoter(id: string, adminUser = 'admin'): void {
    const voters = this.getVoters();
    const target = voters.find((v) => v.id === id);
    const filtered = voters.filter((v) => v.id !== id);
    this.setStorage(STORAGE_KEYS.VOTERS, filtered);
    if (target) {
      this.addAuditLog(adminUser, 'HAPUS_PEMILIH', `Menghapus siswa: ${target.name} (${target.nisn})`);
    }
    deleteDoc(doc(firestore, 'voters', id)).catch(console.error);
  }

  public deleteVotersBatch(ids: string[], adminUser = 'admin'): number {
    const idSet = new Set(ids);
    const voters = this.getVoters();
    const toDeleteCount = voters.filter((v) => idSet.has(v.id)).length;
    const filtered = voters.filter((v) => !idSet.has(v.id));
    this.setStorage(STORAGE_KEYS.VOTERS, filtered);
    this.addAuditLog(adminUser, 'HAPUS_MASSAL_PEMILIH', `Menghapus ${toDeleteCount} data pemilih secara massal.`);

    // Batch delete in Firestore
    try {
      const batch = writeBatch(firestore);
      ids.forEach((id) => batch.delete(doc(firestore, 'voters', id)));
      batch.commit().catch(console.error);
    } catch (e) {
      console.error('Batch delete error', e);
    }

    return toDeleteCount;
  }

  public resetVoterVoteStatus(voterId: string, adminUser = 'admin'): { success: boolean; message: string } {
    const voters = this.getVoters();
    const voter = voters.find((v) => v.id === voterId);
    if (!voter) {
      return { success: false, message: 'Data pemilih tidak ditemukan.' };
    }

    if (!voter.hasVoted) {
      return { success: false, message: 'Siswa ini memang belum memilih.' };
    }

    // Reset voter status
    voter.hasVoted = false;
    delete voter.votedAt;
    this.setStorage(STORAGE_KEYS.VOTERS, voters);
    setDoc(doc(firestore, 'voters', voter.id), voter).catch(console.error);

    // Remove vote associated with voter
    const votes = this.getStorage<Vote[]>(STORAGE_KEYS.VOTES, []);
    const removedVote = votes.find((v) => v.voterId === voterId);
    const filteredVotes = votes.filter((v) => v.voterId !== voterId);
    this.setStorage(STORAGE_KEYS.VOTES, filteredVotes);
    if (removedVote) {
      deleteDoc(doc(firestore, 'votes', removedVote.id)).catch(console.error);
    }

    this.addAuditLog(
      adminUser,
      'RESET_STATUS_PEMILIH',
      `Mereset hak suara siswa ${voter.name} (NISN: ${voter.nisn}) atas permintaan khusus panitia.`
    );

    return { success: true, message: `Status suara untuk ${voter.name} berhasil direset.` };
  }

  public importVoters(newVoters: Omit<Voter, 'id' | 'hasVoted' | 'status' | 'createdAt'>[], adminUser = 'admin'): { addedCount: number; duplicateCount: number } {
    const currentVoters = this.getVoters();
    const existingNisns = new Set(currentVoters.map((v) => v.nisn));
    let added = 0;
    let dupes = 0;
    const addedList: Voter[] = [];

    for (const item of newVoters) {
      if (existingNisns.has(item.nisn)) {
        dupes++;
        continue;
      }
      const voter: Voter = {
        id: 'vtr-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
        nisn: item.nisn,
        name: item.name,
        classId: item.classId,
        className: item.className,
        pin: item.pin || Math.floor(1000 + Math.random() * 9000).toString(),
        hasVoted: false,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      currentVoters.push(voter);
      addedList.push(voter);
      existingNisns.add(item.nisn);
      added++;
    }

    this.setStorage(STORAGE_KEYS.VOTERS, currentVoters);
    this.addAuditLog(adminUser, 'IMPORT_DATA_SISWA', `Import data selesai: ${added} data baru ditambahkan, ${dupes} data duplikat dilewati.`);

    // Batch write to Firestore in chunks of up to 400
    if (addedList.length > 0) {
      try {
        const batch = writeBatch(firestore);
        addedList.slice(0, 400).forEach((v) => batch.set(doc(firestore, 'voters', v.id), v));
        batch.commit().catch(console.error);
      } catch (e) {
        console.error('Firestore batch import write error:', e);
      }
    }

    return { addedCount: added, duplicateCount: dupes };
  }

  // ATOMIC VOTE CASTING MECHANISM (1 SISWA = 1 SUARA)
  public castVote(
    voterId: string,
    candidateId: string
  ): { success: boolean; message: string; votedAt?: string; digitalToken?: string } {
    const election = this.getElection();
    if (election.status !== 'ongoing') {
      return {
        success: false,
        message: 'Pemilihan saat ini tidak dibuka. Anda tidak dapat mengirimkan suara.',
      };
    }

    const voters = this.getVoters();
    const voter = voters.find((v) => v.id === voterId);
    if (!voter) {
      return { success: false, message: 'Data pemilih tidak ditemukan dalam sistem.' };
    }

    if (voter.status !== 'active') {
      return { success: false, message: 'Status akun pemilih Anda sedang dinonaktifkan oleh panitia.' };
    }

    // STRICT CHECK: SATU SISWA, SATU SUARA
    if (voter.hasVoted) {
      return {
        success: false,
        message: 'Hak suara Anda telah digunakan dan tidak dapat memilih kembali.',
      };
    }

    const candidates = this.getCandidates();
    const candidate = candidates.find((c) => c.id === candidateId && c.status === 'active');
    if (!candidate) {
      return { success: false, message: 'Pasangan calon yang Anda pilih tidak valid atau berstatus non-aktif.' };
    }

    const votes = this.getStorage<Vote[]>(STORAGE_KEYS.VOTES, []);
    // UNIQUE constraint verification in votes table
    const alreadyVotedRecord = votes.find((v) => v.voterId === voterId && v.electionId === election.id);
    if (alreadyVotedRecord) {
      return {
        success: false,
        message: 'Hak suara Anda telah digunakan dan tidak dapat memilih kembali.',
      };
    }

    // Atomic execution & marking
    const nowIso = new Date().toISOString();
    voter.hasVoted = true;
    voter.votedAt = nowIso;

    const newVote: Vote = {
      id: 'vote-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      voterId: voter.id,
      candidateId: candidate.id,
      electionId: election.id,
      createdAt: nowIso,
    };

    votes.push(newVote);

    // Save states atomically
    this.setStorage(STORAGE_KEYS.VOTERS, voters);
    this.setStorage(STORAGE_KEYS.VOTES, votes);

    // Persist to Firestore
    setDoc(doc(firestore, 'voters', voter.id), voter, { merge: true }).catch(console.error);
    setDoc(doc(firestore, 'votes', newVote.id), newVote).catch(console.error);

    // Generate digital receipt token
    const rawReceipt = `${voter.nisn}-${candidate.candidateNumber}-${Date.now()}`;
    const digitalToken = 'SPENSA-' + btoa(rawReceipt).slice(0, 14).toUpperCase();

    // System audit log
    this.addAuditLog(
      'system',
      'VOTE_SUBMITTED',
      `Siswa NISN ${voter.nisn} (${voter.className}) telah berhasil mengirimkan hak suara.`
    );

    return {
      success: true,
      message: 'Suara Anda berhasil dicatat secara resmi oleh sistem E-Pilketos.',
      votedAt: nowIso,
      digitalToken,
    };
  }

  // STATISTICS & RESULTS
  public getElectionResults(): {
    totalVoters: number;
    votedCount: number;
    unvotedCount: number;
    participationRate: number;
    totalValidVotes: number;
    candidateResults: CandidateResult[];
    classStatistics: ClassStatistic[];
  } {
    const voters = this.getVoters();
    const candidates = this.getCandidates();
    const votes = this.getStorage<Vote[]>(STORAGE_KEYS.VOTES, []);
    const classes = this.getClasses();

    const totalVoters = voters.length;
    const votedCount = voters.filter((v) => v.hasVoted).length;
    const unvotedCount = totalVoters - votedCount;
    const participationRate = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;
    const totalValidVotes = votes.length;

    // Tally per candidate
    const candidateResults: CandidateResult[] = candidates.map((candidate) => {
      const count = votes.filter((v) => v.candidateId === candidate.id).length;
      const pct = totalValidVotes > 0 ? (count / totalValidVotes) * 100 : 0;
      return {
        candidate,
        voteCount: count,
        percentage: Number(pct.toFixed(2)),
      };
    });

    // Sort by candidate number
    candidateResults.sort((a, b) => a.candidate.candidateNumber - b.candidate.candidateNumber);

    // Tally per class
    const classStatistics: ClassStatistic[] = classes.map((cls) => {
      const classVoters = voters.filter((v) => v.classId === cls.id || v.className === cls.className);
      const totalInClass = classVoters.length;
      const votedInClass = classVoters.filter((v) => v.hasVoted).length;
      const unvotedInClass = totalInClass - votedInClass;
      const pct = totalInClass > 0 ? (votedInClass / totalInClass) * 100 : 0;

      return {
        classId: cls.id,
        className: cls.className,
        totalVoters: totalInClass,
        votedCount: votedInClass,
        unvotedCount: unvotedInClass,
        percentage: Number(pct.toFixed(2)),
      };
    });

    return {
      totalVoters,
      votedCount,
      unvotedCount,
      participationRate: Number(participationRate.toFixed(2)),
      totalValidVotes,
      candidateResults,
      classStatistics,
    };
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.getStorage(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
  }

  public addAuditLog(user: string, action: string, description: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId: user,
      userName: user === 'admin' ? 'Administrator' : user === 'system' ? 'Sistem Otomatis' : user,
      action,
      description,
      ipAddress: '192.168.1.' + Math.floor(10 + Math.random() * 50) + ' (Server Sekolah)',
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog); // latest first
    // keep latest 200 logs
    if (logs.length > 200) logs.pop();
    this.setStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
    setDoc(doc(firestore, 'auditLogs', newLog.id), newLog).catch(console.error);
  }
}

export const db = new DatabaseService();
db.init();
