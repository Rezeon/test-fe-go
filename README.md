Article Manager Frontend (React JS)

Aplikasi ini adalah antarmuka pengguna (frontend) yang dikembangkan menggunakan React dan Tailwind CSS. Tujuannya adalah memfasilitasi pengelolaan konten artikel, berinteraksi langsung dengan API backend yang dibuat dengan Go, serta menyediakan tempat bagi pengguna untuk melihat, menyunting, menghapus, dan mempublikasikan artikel.

CATATAN PENTING: Aplikasi ini dirancang sebagai Komponen Satu File (ArticleDashboard.jsx) untuk memastikan kompatibilitas penuh di lingkungan Canvas. Aplikasi ini menggunakan alamat API lokal (http://localhost:8080/article), jadi pastikan layanan backend Go Anda sudah berjalan di alamat tersebut.

Fitur dan Kemampuan Utama

Dashboard Artikel: Anda dapat melihat semua artikel yang terdaftar, yang dikelompokkan berdasarkan status:

Published: Artikel yang sudah tayang dan dapat diakses publik.

Drafts: Artikel yang masih Anda kerjakan dan belum siap publikasi.

Trashed: Artikel yang telah Anda hapus sementara (berada di tempat sampah).

Operasi CRUD (Saat ini dalam mode Simulasi):

Buat/Edit (ArticleForm): Terdapat formulir sederhana untuk membuat artikel baru atau menyunting judul artikel yang sudah ada. (Catatan: Bagian ini masih berupa mock dan memerlukan implementasi API Create/Update yang sesungguhnya).

Pindah ke Sampah (Thrash): Mengubah status artikel menjadi trashed melalui panggilan API PUT /article/{id}.

Hapus Permanen (Delete Permanent): Menghapus artikel secara permanen dari database melalui panggilan API DELETE /article/{id}.

Pengambilan Data Real-Time: Aplikasi mengambil data artikel secara langsung dari backend Go menggunakan endpoint /article/limit/1000/0.

Instalasi dan Persiapan Awal

Aplikasi ini adalah aplikasi React yang didistribusikan dalam format file tunggal (JSX).

Persiapan Prasyarat

Sebelum mencoba menjalankan frontend, pastikan lingkungan backend Anda sudah siap:

Backend Go: Layanan backend Go Anda harus berjalan pada alamat:
http://localhost:8080

Database: Pastikan database (PostgreSQL) Anda terhubung dengan backend dan memiliki data artikel.

Lokasi Kode Sumber

Seluruh kode komponen dan logika aplikasi ini berada di dalam satu file:

ArticleDashboard.jsx (File utama aplikasi)

Konfigurasi API

Aplikasi ini sudah dikonfigurasi untuk berkomunikasi dengan backend Go menggunakan alamat dasar berikut:

const API_BASE_URL = 'http://localhost:8080/article';


Jika Anda menggunakan alamat API yang berbeda, Anda perlu mengubah variabel API_BASE_URL di dalam file ArticleDashboard.jsx.

Pemetaan Status Artikel

Berikut adalah pemetaan status yang digunakan antara antarmuka pengguna (frontend / FE) dan database (backend / BE):

Status di FE (Tampilan Tab)

Status di BE (Nilai Database)

Published

publish

Drafts

draft

Trashed

trashed

Pemetaan ini diimplementasikan dalam kode React di dalam ArticleDashboard.jsx.

Poin Penting Implementasi

Autentikasi: Fitur otentikasi (seperti Firebase) telah dinonaktifkan dan diganti dengan ID pengguna (userId) simulasi agar fokus pada fungsionalitas CRUD API.

Formulir Artikel (ArticleForm): Form ini masih berupa simulasi dan tidak mengirimkan semua data yang diperlukan saat membuat atau memperbarui. Implementasi lengkap untuk API POST dan PUT harus ditambahkan di sini.

Konfirmasi Penghapusan: Kami menggunakan fungsi bawaan browser (window.confirm()) untuk konfirmasi penghapusan. Untuk penggunaan di lingkungan produksi, disarankan menggantinya dengan komponen modal kustom.