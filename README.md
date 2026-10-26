# E-PILKETOS SMP NEGERI 1 TEMBARAK
### Sistem Elektronik Pemilihan Ketua dan Wakil Ketua OSIS
**Tahun Pelajaran 2026/2027**  
*Jalan Raya Tembarak, Desa Tembarak, Kec. Tembarak, Kab. Temanggung, Jawa Tengah 56261*

---

## 1. Deskripsi Aplikasi
**E-Pilketos** adalah aplikasi web pemilihan elektronik yang dirancang khusus untuk memfasilitasi pemilihan Ketua dan Wakil Ketua OSIS SMP Negeri 1 Tembarak. Aplikasi ini mengedepankan prinsip pemilu: **Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil (LUBER JURDIL)** dengan arsitektur pencegahan pemilihan ganda (double-voting prevention), pencatatan audit log otomatis, dan pelaporan Berita Acara resmi siap cetak.

---

## 2. Fitur Utama

### A. Untuk Siswa / Pemilih
- **Login Pemilih Mudah**: Akses bilik suara menggunakan NISN dan PIN rahasia yang dibagikan panitia.
- **Pencegahan Suara Ganda**: Verifikasi status pemilih di sisi server dan database unik (`UNIQUE(voter_id, election_id)`).
- **Profil Lengkap Paslon**: Melihat nomor urut, foto resolusi tinggi, nama lengkap, visi, misi, dan program kerja unggulan.
- **Konfirmasi Pilihan**: Modal peringatan konfirmasi sebelum suara resmi dikirimkan.
- **Kerahasiaan Suara Terjamin**: Setelah memilih, siswa menerima tanda terima digital resmi tanpa menampilkan kembali hasil sementara atau pilihan individu kepada publik.

### B. Untuk Panitia / Administrator
- **Dashboard Statistik Real-Time**: Total DPT, jumlah siswa sudah memilih, belum memilih, dan persentase partisipasi.
- **Kontrol Bilik Suara**: Buka dan tutup bilik suara secara fleksibel dengan konfirmasi modal.
- **Manajemen DPT Pemilih**: Tambah, edit, hapus, filter kelas, dan reset status hak suara siswa dengan pencatatan audit log resmi.
- **Import Data Massal**: Unggah berkas Excel/CSV atau tempel teks data siswa dengan deteksi otomatis NISN duplikat dan pembuat PIN acak.
- **Manajemen Pasangan Calon**: Kelola foto, visi, misi, dan program kerja pasangan calon.
- **Grafik & Tabulasi Interaktif**: Grafik perolehan suara paslon dan statistik partisipasi per kelas (VII A s/d IX C).
- **Ekspor Data**: Ekspor tabulasi hasil ke CSV dan ekspor daftar hadir DPT pemilih.
- **Generator Berita Acara Resmi**: Dokumen standar hukum berkop surat SMP Negeri 1 Tembarak dengan 4 kolom tanda tangan (Ketua Panitia, Sekretaris, Pembina OSIS, dan Kepala Sekolah).
- **Audit Trail Lengkap**: Riwayat transparan seluruh aktivitas login, perubahan data, dan pembukaan/penutupan pemilihan.

---

## 3. Persyaratan Sistem (PHP / MySQL Deployment)
- **PHP**: Versi 8.0, 8.1, 8.2, atau 8.3+ (Ekstensi `pdo_mysql`, `mbstring`, `json` aktif).
- **Database**: MySQL 5.7+ atau MariaDB 10.3+.
- **Web Server**: Apache dengan `mod_rewrite` aktif atau Nginx.
- **Browser Klien**: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari (komputer, laptop, tablet, atau smartphone).

---

## 4. Panduan Instalasi di Web Hosting Sekolah (cPanel)

1. **Persiapan Database**:
   - Buka cPanel sekolah -> Pilih menu **MySQL Databases**.
   - Buat database baru (misal: `epilketos_tembarak`).
   - Buat pengguna database MySQL baru dan tautkan ke database tersebut dengan hak akses **ALL PRIVILEGES**.
   - Buka **phpMyAdmin** -> Pilih database yang baru dibuat -> Klik tab **Import**.
   - Pilih berkas `database.sql` yang disertakan di repositori ini, lalu klik **Go / Kirim**.

2. **Pengunggahan Berkas**:
   - Kompres seluruh berkas aplikasi ke dalam format `.zip`.
   - Buka **File Manager** cPanel -> Masuk ke direktori `public_html` atau direktori subdomain (contoh: `pilketos.smpn1tembarak.sch.id`).
   - Ekstrak berkas zip tersebut.

3. **Konfigurasi Database**:
   - Buka berkas konfigurasi database (misal: `config/database.php`).
   - Masukkan nama database, username, dan password MySQL sesuai konfigurasi cPanel Anda.

4. **Langkah Awal Pemilihan**:
   - Buka alamat URL aplikasi di peramban web.
   - Klik tombol **Admin** di pojok kanan atas.
   - Masuk dengan akun demo default:
     - **Username**: `admin`
     - **Password**: `admin123`
   - **PENTING**: Segera ganti password default administrator pada menu **Pengaturan**.
   - Masuk ke menu **Import Data Siswa** untuk mengunggah DPT siswa dari file Excel/CSV.
   - Atur data pasangan calon jika terdapat penyesuaian nomor urut dan foto.
   - Tekan tombol **BUKA PEMILIHAN** saat pemungutan suara resmi dimulai.
   - Setelah jadwal pemungutan suara selesai, tekan **TUTUP PEMILIHAN**, unduh hasil suara, dan cetak **Berita Acara Resmi**.

---

## 5. Kredensial Demo Pengujian Langsung

Untuk kemudahan pengujian dalam aplikasi interaktif ini:

| Peran | Kredensial / Akses |
|---|---|
| **Admin Panitia** | Username: `admin` · Password: `admin123` |
| **Siswa 1 (Belum Memilih)** | NISN: `0081234001` (Aditya Pratama, VII A) · PIN: `1234` |
| **Siswa 2 (Belum Memilih)** | NISN: `0081234003` (Bagas Wahyu, VII A) · PIN: `3456` |
| **Siswa 3 (Sudah Memilih)** | NISN: `0081234002` (Alya Putri, VII A) · PIN: `2345` |

*(Tersedia tombol **"Daftar Akun Demo Siswa"** di footer dan form login untuk memilih dan menguji akun siswa mana pun secara otomatis)*.
