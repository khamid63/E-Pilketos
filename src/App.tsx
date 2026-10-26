import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { Candidate, Election, SchoolSettings, Voter } from './types';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentLoginModal } from './components/StudentLoginModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { VoteConfirmModal } from './components/VoteConfirmModal';
import { VoteSuccessModal } from './components/VoteSuccessModal';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VoterManagement } from './components/admin/VoterManagement';
import { ClassManagement } from './components/admin/ClassManagement';
import { CandidateManagement } from './components/admin/CandidateManagement';
import { VoteResults } from './components/admin/VoteResults';
import { ImportVoters } from './components/admin/ImportVoters';
import { BeritaAcara } from './components/admin/BeritaAcara';
import { AuditLogView } from './components/admin/AuditLogView';
import { SettingsView } from './components/admin/SettingsView';
import { SqlExportModal } from './components/admin/SqlExportModal';

export default function App() {
  const [dataVersion, setDataVersion] = useState(0);

  // Core Data
  const [settings, setSettings] = useState<SchoolSettings>(db.getSettings());
  const [election, setElection] = useState<Election>(db.getElection());
  const [candidates, setCandidates] = useState<Candidate[]>(db.getCandidates());

  // User Auth State
  const [currentStudent, setCurrentStudent] = useState<Voter | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Navigation State
  const [activeSection, setActiveSection] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Modals
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<Candidate | null>(null);
  const [candidateToVote, setCandidateToVote] = useState<Candidate | null>(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [voteSuccessData, setVoteSuccessData] = useState<{ votedAt: string; digitalToken: string } | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);

  // Sync state whenever dataVersion changes
  const refreshData = () => {
    setDataVersion((v) => v + 1);
    setSettings(db.getSettings());
    setElection(db.getElection());
    setCandidates(db.getCandidates());

    // If student is logged in, refresh their voter record
    if (currentStudent) {
      const freshRecord = db.getVoterById(currentStudent.id);
      if (freshRecord) {
        setCurrentStudent(freshRecord);
      }
    }
  };

  const handleStudentLoginSuccess = (voter: Voter) => {
    setCurrentStudent(voter);
    setActiveSection('portal');
  };

  const handleStudentLogout = () => {
    setCurrentStudent(null);
    setActiveSection('home');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setAdminTab('dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  // Voting Flow
  const handleRequestVote = (candidate: Candidate) => {
    if (currentStudent?.hasVoted) {
      alert('Hak suara Anda telah digunakan dan tidak dapat memilih kembali.');
      return;
    }
    setCandidateToVote(candidate);
  };

  const handleConfirmVote = () => {
    if (!currentStudent || !candidateToVote || isSubmittingVote) return;

    // Strict validation: Re-query database to ensure single vote integrity
    const freshRecord = db.getVoterById(currentStudent.id);
    if (!freshRecord || freshRecord.hasVoted) {
      alert('Hak suara Anda telah digunakan dan tidak dapat memilih kembali.');
      setCandidateToVote(null);
      refreshData();
      return;
    }

    setIsSubmittingVote(true);
    setTimeout(() => {
      const result = db.castVote(currentStudent.id, candidateToVote.id);
      setIsSubmittingVote(false);

      if (result.success) {
        setCandidateToVote(null);
        setVoteSuccessData({
          votedAt: result.votedAt || new Date().toISOString(),
          digitalToken: result.digitalToken || 'SPENSA-SUCCESS',
        });
        refreshData();
      } else {
        alert(result.message);
        setCandidateToVote(null);
        refreshData();
      }
    }, 300);
  };

  const handleFinishVoteSuccess = () => {
    setVoteSuccessData(null);
    handleStudentLogout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-900 selection:text-amber-300">
      {/* If Admin is logged in, display full-blown Admin Portal */}
      {isAdmin ? (
        <AdminLayout
          currentTab={adminTab}
          setCurrentTab={setAdminTab}
          onLogout={handleAdminLogout}
          onOpenPublicSite={() => setIsAdmin(false)}
          settings={settings}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              settings={settings}
              election={election}
              onRefreshData={refreshData}
              onNavigateTab={(tab) => setAdminTab(tab)}
            />
          )}

          {adminTab === 'voters' && (
            <VoterManagement onRefreshData={refreshData} />
          )}

          {adminTab === 'classes' && (
            <ClassManagement onRefreshData={refreshData} />
          )}

          {adminTab === 'candidates' && (
            <CandidateManagement
              onRefreshData={refreshData}
              onPreviewCandidate={(cand) => setSelectedCandidateForDetail(cand)}
            />
          )}

          {adminTab === 'results' && (
            <VoteResults
              settings={settings}
              onOpenBeritaAcara={() => setAdminTab('berita-acara')}
            />
          )}

          {adminTab === 'import' && (
            <ImportVoters onRefreshData={refreshData} />
          )}

          {adminTab === 'berita-acara' && (
            <BeritaAcara
              settings={settings}
              onBack={() => setAdminTab('results')}
            />
          )}

          {adminTab === 'audit-log' && <AuditLogView />}

          {adminTab === 'settings' && (
            <SettingsView
              settings={settings}
              election={election}
              onRefreshData={refreshData}
              onOpenSqlModal={() => setIsSqlModalOpen(true)}
            />
          )}
        </AdminLayout>
      ) : (
        /* Public & Student Portal */
        <div className="flex-1 flex flex-col">
          <Navbar
            currentStudent={currentStudent}
            isAdmin={isAdmin}
            onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            onStudentLogout={handleStudentLogout}
            onAdminLogout={handleAdminLogout}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isElectionOngoing={election.status === 'ongoing'}
          />

          <main className="flex-1">
            {currentStudent ? (
              <StudentDashboard
                currentStudent={currentStudent}
                election={election}
                candidates={candidates}
                onOpenCandidateDetail={(cand) => setSelectedCandidateForDetail(cand)}
                onRequestVote={handleRequestVote}
                onLogout={handleStudentLogout}
              />
            ) : (
              <LandingPage
                settings={settings}
                election={election}
                candidates={candidates}
                onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
                onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
                onOpenCandidateDetail={(cand) => setSelectedCandidateForDetail(cand)}
              />
            )}
          </main>

          <Footer
            settings={settings}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          />
        </div>
      )}

      {/* MODALS */}
      {/* 1. Student Login Modal */}
      <StudentLoginModal
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        onLoginSuccess={handleStudentLoginSuccess}
      />

      {/* 2. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* 3. Candidate Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidateForDetail}
        onClose={() => setSelectedCandidateForDetail(null)}
        onSelectCandidate={(cand) => handleRequestVote(cand)}
        currentStudent={currentStudent}
        isElectionOngoing={election.status === 'ongoing'}
      />

      {/* 4. Vote Confirm Modal */}
      <VoteConfirmModal
        candidate={candidateToVote}
        onCancel={() => setCandidateToVote(null)}
        onConfirm={handleConfirmVote}
        isSubmitting={isSubmittingVote}
      />

      {/* 5. Vote Success Modal */}
      {voteSuccessData && (
        <VoteSuccessModal
          votedAt={voteSuccessData.votedAt}
          digitalToken={voteSuccessData.digitalToken}
          onFinish={handleFinishVoteSuccess}
          schoolName={settings.schoolName}
        />
      )}

      {/* 6. SQL & PHP Deployment Modal */}
      <SqlExportModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}
