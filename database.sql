-- ============================================================
-- DATABASE SCHEMA & SEED DATA E-PILKETOS SMP NEGERI 1 TEMBARAK
-- SISTEM PEMILIHAN KETUA DAN WAKIL KETUA OSIS
-- TAHUN PELAJARAN 2026/2027
-- Target Engine: MariaDB / MySQL 5.7+ / 8.0+
-- Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS `epilketos_tembarak` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `epilketos_tembarak`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `votes`;
DROP TABLE IF EXISTS `voters`;
DROP TABLE IF EXISTS `candidates`;
DROP TABLE IF EXISTS `elections`;
DROP TABLE IF EXISTS `classes`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. TABEL USERS (ADMIN & PANITIA)
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` ENUM('admin', 'panitia') NOT NULL DEFAULT 'panitia',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL CLASSES (ROMBEL KELAS)
CREATE TABLE `classes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `class_name` VARCHAR(20) NOT NULL UNIQUE,
  `grade` TINYINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL ELECTIONS (PERIODE PEMILIHAN)
CREATE TABLE `elections` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `election_name` VARCHAR(150) NOT NULL,
  `academic_year` VARCHAR(20) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `status` ENUM('upcoming', 'ongoing', 'completed') NOT NULL DEFAULT 'upcoming',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABEL CANDIDATES (PASANGAN CALON OSIS)
CREATE TABLE `candidates` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `candidate_number` TINYINT UNSIGNED NOT NULL UNIQUE,
  `chairman_name` VARCHAR(100) NOT NULL,
  `vice_chairman_name` VARCHAR(100) NOT NULL,
  `chairman_photo` VARCHAR(255) NOT NULL,
  `vice_chairman_photo` VARCHAR(255) DEFAULT NULL,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `vision` TEXT NOT NULL,
  `mission` JSON NOT NULL,
  `programs` JSON NOT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABEL VOTERS (DPT SISWA PEMILIH)
CREATE TABLE `voters` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nisn` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(120) NOT NULL,
  `class_id` INT UNSIGNED NOT NULL,
  `pin_hash` VARCHAR(255) NOT NULL,
  `has_voted` BOOLEAN NOT NULL DEFAULT FALSE,
  `voted_at` DATETIME DEFAULT NULL,
  `status` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_voter_nisn` (`nisn`),
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABEL VOTES (TABULASI SUARA RAHASIA)
CREATE TABLE `votes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `voter_id` INT UNSIGNED NOT NULL,
  `candidate_id` INT UNSIGNED NOT NULL,
  `election_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_voter_election` (`voter_id`, `election_id`),
  FOREIGN KEY (`voter_id`) REFERENCES `voters`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`election_id`) REFERENCES `elections`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABEL AUDIT LOGS (AUDIT TRAIL RESMI)
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA AWAL DEMO
-- ============================================================

-- Akun Administrator (Password demo: admin123)
-- Hash dibuat dengan password_hash('admin123', PASSWORD_BCRYPT)
INSERT INTO `users` (`username`, `password`, `name`, `role`) VALUES
('admin', '$2y$10$iN6t3RvhZJ72vPq6lC.14.lH9Z7FmR6Ww5bU7B0n0D6uK1j1Z1LqK', 'Administrator Panitia Pilketos', 'admin');

-- Kelas SMP Negeri 1 Tembarak (Jenjang 7, 8, 9 sampai F)
INSERT INTO `classes` (`id`, `class_name`, `grade`) VALUES
(1, '7A', 7), (2, '7B', 7), (3, '7C', 7), (4, '7D', 7), (5, '7E', 7), (6, '7F', 7),
(7, '8A', 8), (8, '8B', 8), (9, '8C', 8), (10, '8D', 8), (11, '8E', 8), (12, '8F', 8),
(13, '9A', 9), (14, '9B', 9), (15, '9C', 9), (16, '9D', 9), (17, '9E', 9), (18, '9F', 9);

-- Periode Pemilihan 2026/2027 (Selasa, 27 Oktober 2026)
INSERT INTO `elections` (`id`, `election_name`, `academic_year`, `start_time`, `end_time`, `status`) VALUES
(1, 'Pemilihan Ketua dan Wakil Ketua OSIS Periode 2026/2027', '2026/2027', '2026-10-27 00:00:00', '2026-10-27 23:59:59', 'ongoing');

-- Pasangan Calon 01, 02, 03
INSERT INTO `candidates` (`id`, `candidate_number`, `chairman_name`, `vice_chairman_name`, `chairman_photo`, `tagline`, `vision`, `mission`, `programs`, `status`) VALUES
(1, 1, 'Ahmad Fauzi Nurcahyo', 'Siti Rahmawati Putri', 'paslon1.jpg', 'Berkarakter, Berprestasi, dan Berbudaya Lingkungan',
 'Mewujudkan OSIS SMP Negeri 1 Tembarak sebagai wadah aspirasi siswa yang berakhlak mulia, unggul dalam prestasi akademik maupun non-akademik, serta peduli terhadap kelestarian lingkungan sekolah.',
 '["Menumbuhkan nilai religius dan budi pekerti luhur melalui pembiasaan ibadah bersama.","Mendukung program literasi dan sains club sekolah.","Menggalakkan gerakan Sekolah Adiwiyata: pilah sampah dan taman kelas."]',
 '["Spensatem Islamic & Character Festival","Green Campus Bersih Bersemi","Pekan Prestasi & Bimbingan Minat Bakat"]',
 'active'),

(2, 2, 'Dimas Arya Pratama', 'Annisa Nurul Hidayah', 'paslon2.jpg', 'Kreatif, Kolaboratif, Mengabdi untuk Seluruh Siswa Spensatem',
 'Menjadikan OSIS SMP Negeri 1 Tembarak yang aktif, kreatif, berdaya saing global dengan tetap menjunjung tinggi kearifan lokal Temanggung serta semangat gotong royong.',
 '["Mengembangkan kreativitas seni budaya lokal Temanggung.","Menciptakan iklim belajar menyenangkan melalui tutor sebaya.","Meningkatkan jiwa kepemimpinan pengurus kelas."]',
 '["Spensatem Youth Cultural Festival","Program Teman Belajar Asyik","Liga Olahraga Persahabatan"]',
 'active'),

(3, 3, 'Muhammad Rizky Ramadhan', 'Zahra Amalia Putri', 'paslon3.jpg', 'OSIS Aspiratif: Wadah Kreasi, Prestasi, dan Teknologi Siswa',
 'Mewujudkan organisasi kesiswaan yang inklusif, adaptif terhadap teknologi digital, serta mendorong siswa SMP Negeri 1 Tembarak menjadi pribadi yang disiplin dan mandiri.',
 '["Menghidupkan peran mading sekolah fisik dan digital.","Mengadakan pelatihan keterampilan desain dan public speaking.","Kampanye anti-bullying dan anti-perundungan."]',
 '["Spensatem Digital Workshop","Gerakan Senyum Sapa Salam & Duta Anti-Bullying","Bulan Bahasa & Donor Buku"]',
 'active');

-- Catatan audit perdana
INSERT INTO `audit_logs` (`user_id`, `action`, `description`, `ip_address`) VALUES
('admin', 'DATABASE_INIT', 'Inisialisasi skema database SQL E-Pilketos SMPN 1 Tembarak berhasil.', '127.0.0.1');
