export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'panitia';
  createdAt: string;
}

export interface ClassItem {
  id: string;
  className: string;
  grade: number; // 7, 8, 9
  createdAt: string;
}

export interface Voter {
  id: string;
  nisn: string;
  name: string;
  classId: string;
  className: string;
  pin: string; // Stored securely
  hasVoted: boolean;
  votedAt?: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Candidate {
  id: string;
  candidateNumber: number;
  chairmanName: string;
  viceChairmanName: string;
  chairmanPhoto: string;
  viceChairmanPhoto?: string;
  tagline: string;
  vision: string;
  mission: string[];
  programs: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export type ElectionStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Election {
  id: string;
  electionName: string;
  academicYear: string;
  startTime: string;
  endTime: string;
  status: ElectionStatus;
  createdAt: string;
}

export interface Vote {
  id: string;
  voterId: string;
  candidateId: string;
  electionId: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  ipAddress: string;
  createdAt: string;
}

export interface SchoolSettings {
  schoolName: string;
  subTitle: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  academicYear: string;
  electionName: string;
  slogan: string;
  committeeContact: string;
  committeePhone: string;
  committeeChair: string;
  committeeSecretary: string;
  osisSupervisor: string;
  principal: string;
  principalNip: string;
}

export interface CandidateResult {
  candidate: Candidate;
  voteCount: number;
  percentage: number;
}

export interface ClassStatistic {
  classId: string;
  className: string;
  totalVoters: number;
  votedCount: number;
  unvotedCount: number;
  percentage: number;
}
