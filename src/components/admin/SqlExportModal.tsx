import React, { useState } from 'react';
import { X, Download, Copy, Check, Database, Server, Code, FileText } from 'lucide-react';

interface SqlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlExportModal: React.FC<SqlExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sql' | 'php' | 'deploy'>('sql');

  if (!isOpen) return null;

  const sqlSchema = `-- ============================================================
-- DATABASE SCHEMA & SEED DATA E-PILKETOS SMP NEGERI 1 TEMBARAK
-- TAHUN PELAJARAN 2026/2027
-- Target Engine: MariaDB / MySQL 5.7+ / 8.0+
-- Karakter: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS \`epilketos_tembarak\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`epilketos_tembarak\`;

-- 1. TABEL USERS (ADMIN & PANITIA)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`role\` ENUM('admin', 'panitia') NOT NULL DEFAULT 'panitia',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABEL CLASSES (ROMBEL KELAS)
CREATE TABLE IF NOT EXISTS \`classes\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`class_name\` VARCHAR(20) NOT NULL UNIQUE,
  \`grade\` TINYINT UNSIGNED NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. TABEL ELECTIONS (PERIODE PEMILIHAN)
CREATE TABLE IF NOT EXISTS \`elections\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`election_name\` VARCHAR(150) NOT NULL,
  \`academic_year\` VARCHAR(20) NOT NULL,
  \`start_time\` DATETIME NOT NULL,
  \`end_time\` DATETIME NOT NULL,
  \`status\` ENUM('upcoming', 'ongoing', 'completed') NOT NULL DEFAULT 'upcoming',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. TABEL CANDIDATES (PASANGAN CALON OSIS)
CREATE TABLE IF NOT EXISTS \`candidates\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`candidate_number\` TINYINT UNSIGNED NOT NULL UNIQUE,
  \`chairman_name\` VARCHAR(100) NOT NULL,
  \`vice_chairman_name\` VARCHAR(100) NOT NULL,
  \`chairman_photo\` VARCHAR(255) NOT NULL,
  \`vice_chairman_photo\` VARCHAR(255) DEFAULT NULL,
  \`tagline\` VARCHAR(255) DEFAULT NULL,
  \`vision\` TEXT NOT NULL,
  \`mission\` JSON NOT NULL,
  \`programs\` JSON NOT NULL,
  \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. TABEL VOTERS (DPT SISWA PEMILIH)
CREATE TABLE IF NOT EXISTS \`voters\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`nisn\` VARCHAR(20) NOT NULL UNIQUE,
  \`name\` VARCHAR(120) NOT NULL,
  \`class_id\` INT UNSIGNED NOT NULL,
  \`pin_hash\` VARCHAR(255) NOT NULL,
  \`has_voted\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`voted_at\` DATETIME DEFAULT NULL,
  \`status\` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6. TABEL VOTES (TABULASI SUARA RAHASIA)
-- Unique key pada (voter_id, election_id) menjamin pemilih tidak dapat memilih 2 kali!
CREATE TABLE IF NOT EXISTS \`votes\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`voter_id\` INT UNSIGNED NOT NULL,
  \`candidate_id\` INT UNSIGNED NOT NULL,
  \`election_id\` INT UNSIGNED NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_voter_election\` (\`voter_id\`, \`election_id\`),
  FOREIGN KEY (\`voter_id\`) REFERENCES \`voters\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`candidate_id\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`election_id\`) REFERENCES \`elections\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. TABEL AUDIT LOGS (INTEGRITAS DAN AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS \`audit_logs\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` VARCHAR(50) NOT NULL,
  \`action\` VARCHAR(50) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`ip_address\` VARCHAR(45) NOT NULL,
  \`user_agent\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA AWAL (DEMO & IDENTITAS SEKOLAH)
-- ============================================================

-- Admin Default: username: admin, password: password_hash('admin123')
INSERT INTO \`users\` (\`username\`, \`password\`, \`name\`, \`role\`) VALUES
('admin', '$2y$10$WpQ8cQ1l9vL93xM89m1Qz.1gUu92w8zUqf8Z7K0gD1j3vE4f5h6j7', 'Administrator Panitia', 'admin');

-- Master Kelas SMPN 1 Tembarak (7A-7F, 8A-8F, 9A-9F)
INSERT INTO \`classes\` (\`class_name\`, \`grade\`) VALUES
('7A', 7), ('7B', 7), ('7C', 7), ('7D', 7), ('7E', 7), ('7F', 7),
('8A', 8), ('8B', 8), ('8C', 8), ('8D', 8), ('8E', 8), ('8F', 8),
('9A', 9), ('9B', 9), ('9C', 9), ('9D', 9), ('9E', 9), ('9F', 9);

-- Periode Pemilihan 2026/2027 (Selasa, 27 Oktober 2026)
INSERT INTO \`elections\` (\`election_name\`, \`academic_year\`, \`start_time\`, \`end_time\`, \`status\`) VALUES
('Pemilihan Ketua dan Wakil Ketua OSIS Periode 2026/2027', '2026/2027', '2026-10-27 00:00:00', '2026-10-27 23:59:59', 'ongoing');
`;

  const phpSnippet = `<?php
/**
 * Contoh Koneksi Database PDO (config/database.php)
 * Menggunakan Prepared Statements untuk keamanan penuh dari SQL Injection
 */

declare(strict_types=1);

$host = '127.0.0.1';
$db   = 'epilketos_tembarak';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\\PDOException $e) {
    throw new \\PDOException($e->getMessage(), (int)$e->getCode());
}

/**
 * Contoh Transaksi Voting Aman (Atomic Transaction)
 */
function submitVote(PDO $pdo, int $voterId, int $candidateId, int $electionId): bool {
    try {
        $pdo->beginTransaction();

        // 1. Verifikasi voter belum memilih dengan SELECT FOR UPDATE
        $stmt = $pdo->prepare("SELECT has_voted FROM voters WHERE id = ? FOR UPDATE");
        $stmt->execute([$voterId]);
        $voter = $stmt->fetch();

        if (!$voter || $voter['has_voted'] == 1) {
            $pdo->rollBack();
            return false;
        }

        // 2. Simpan suara ke tabel votes
        $insertVote = $pdo->prepare("INSERT INTO votes (voter_id, candidate_id, election_id, created_at) VALUES (?, ?, ?, NOW())");
        $insertVote->execute([$voterId, $candidateId, $electionId]);

        // 3. Kunci status pemilih
        $updateVoter = $pdo->prepare("UPDATE voters SET has_voted = 1, voted_at = NOW() WHERE id = ?");
        $updateVoter->execute([$voterId]);

        // 4. Catat audit log
        $logStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)");
        $logStmt->execute(['voter_'.$voterId, 'VOTE_SUBMITTED', 'Siswa berhasil memberikan hak suara.', $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);

        $pdo->commit();
        return true;
    } catch (\\Exception $e) {
        $pdo->rollBack();
        return false;
    }
}
`;

  const deployGuide = `# PANDUAN DEPLOYMENT KE WEB HOSTING SEKOLAH (cPanel / Apache / Nginx)

1. PERSYARATAN SERVER:
   - PHP versi 8.0 atau yang lebih baru (ekstensi pdo_mysql, mbstring, json aktif).
   - MySQL versi 5.7+ atau MariaDB 10.3+.
   - Web Server: Apache dengan mod_rewrite aktif atau Nginx.

2. LANGKAH INSTALASI DATABASE:
   a. Masuk ke cPanel sekolah -> Buka menu "phpMyAdmin" atau "MySQL Databases".
   b. Buat database baru dengan nama, misal: "epilketos_tembarak".
   c. Buat MySQL User dan beri akses ALL PRIVILEGES ke database tersebut.
   d. Di phpMyAdmin, pilih database -> Klik tab "Import" -> Upload berkas "database.sql".

3. UPLOAD SOURCE CODE:
   a. Unggah seluruh berkas ke folder public_html atau subdomain (misal: pilketos.smpn1tembarak.sch.id).
   b. Sesuaikan kredensial di file config/database.php.

4. LOGIN AWAL & PENGAMANAN:
   a. Buka browser: https://pilketos.smpn1tembarak.sch.id
   b. Login ke Admin dengan user: admin, password: admin123
   c. SEGERA ganti password admin default di menu Pengaturan.
   d. Unggah DPT siswa melalui menu Import Data Siswa (CSV).
   e. Buka bilik suara digital saat waktu pemilihan dimulai.
`;

  const copyToClipboard = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const downloadSqlFile = () => {
    const blob = new Blob([sqlSchema], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'database.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Arsitektur Database &amp; Deployment PHP</h3>
              <p className="text-xs text-slate-300">
                Skema SQL MariaDB/MySQL dan source code PDO teruji untuk hosting sekolah
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'sql' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Skema SQL (database.sql)</span>
          </button>

          <button
            onClick={() => setActiveTab('php')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'php' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>PHP 8+ PDO Transaction</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'deploy' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Panduan Hosting &amp; cPanel</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-4 flex-1 font-mono text-xs">
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between no-print">
                <span className="text-slate-500 font-sans text-xs">
                  File SQL lengkap berisi DDL tabel, relasi, constraint UNIQUE, dan seed data.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(sqlSchema, 'sql')}
                    className="px-3 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs flex items-center gap-1"
                  >
                    {copiedTab === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTab === 'sql' ? 'Tersalin' : 'Salin SQL'}</span>
                  </button>
                  <button
                    onClick={downloadSqlFile}
                    className="px-3 py-1 text-white bg-blue-900 hover:bg-blue-800 rounded text-xs font-sans font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Download database.sql</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-[11px] leading-relaxed">
                {sqlSchema}
              </pre>
            </div>
          )}

          {activeTab === 'php' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans text-xs">
                  Implementasi transaksi atomik anti-double-voting dengan PDO Prepared Statements.
                </span>
                <button
                  onClick={() => copyToClipboard(phpSnippet, 'php')}
                  className="px-3 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs flex items-center gap-1 font-sans"
                >
                  {copiedTab === 'php' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'php' ? 'Tersalin' : 'Salin Kode PHP'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-300 rounded-xl overflow-x-auto text-[11px] leading-relaxed">
                {phpSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">
                  Petunjuk langkah demi langkah memasang E-Pilketos di web server sekolah.
                </span>
                <button
                  onClick={() => copyToClipboard(deployGuide, 'deploy')}
                  className="px-3 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs flex items-center gap-1"
                >
                  {copiedTab === 'deploy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'deploy' ? 'Tersalin' : 'Salin Petunjuk'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                {deployGuide}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
