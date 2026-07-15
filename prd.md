# Product Requirements Document (PRD)
# KAWAN — Game Visual Novel Interaktif Adaptif untuk Anak ASD
**Versi:** 1.0
**Tanggal:** 13 Juli 2026
**Tim Pengembang:** Hanifa Aziz Sadida, Galih Parama Sutejo, Patrick Yosua Pratama Sianturi, Fadlan Buwono Mukti
**Dosen Pendamping:** Alia Bihrajihant Raya, S.P., M.P., Ph.D.
**Institusi:** Universitas Gadjah Mada
**Konteks:** Lomba Inovasi Digital Mahasiswa (LIDM) 2026 — Divisi IPDP

---

## 1. Ringkasan Eksekutif

**KAWAN** (*Keterampilan Adaptif Warga Autisme Nusantara*) adalah sebuah **game visual novel interaktif 2D berbasis web** yang dirancang secara inklusif sebagai media pembelajaran untuk anak-anak penyandang **Autism Spectrum Disorder (ASD)**. Game ini dikembangkan dengan mengadopsi metodologi **ADDIE** dan mengintegrasikan pendekatan **Social Stories**, **Game-Based Learning**, serta sistem **Adaptive Placement Gate** untuk menyesuaikan jalur bermain dengan kemampuan dasar masing-masing anak.

KAWAN hadir sebagai solusi atas keterbatasan media pembelajaran digital adaptif di Sekolah Luar Biasa (SLB), sebagaimana ditemukan dalam survei kebutuhan di SLB Autis Fajar Nugrah Yogyakarta (Juli 2026), di mana 100% tenaga pendidik mengonfirmasi ketiadaan media digital adaptif sebagai hambatan utama.

---

## 2. Latar Belakang & Permasalahan

### 2.1 Konteks Masalah

| Aspek | Data / Fakta |
|---|---|
| Prevalensi ASD global | 1 dari 44 anak |
| Kondisi SLB di Indonesia | Masih didominasi media fisik/cetak statis |
| Temuan lapangan (SLB Fajar Nugrah, Juli 2026) | 100% guru mengonfirmasi minimnya media digital adaptif |
| Hambatan utama anak ASD | Komunikasi verbal, interaksi sosial, keterampilan sensorimotorik |
| Potensi anak ASD | Memori kuat, kemampuan dekode visual di atas rata-rata |

### 2.2 Kesenjangan yang Ditangani

1. **Gap Media:** Tidak adanya media digital inklusif yang disesuaikan dengan kebutuhan sensorik anak ASD di SLB.
2. **Gap Kurikulum:** Kurikulum modifikasi fungsional tidak didukung oleh media digital interaktif yang memadai.
3. **Gap Aksesibilitas:** Keterbatasan perangkat dan koneksi internet di sekolah, termasuk wilayah 3T (terdepan, terpencil, tertinggal).
4. **Gap Evaluasi:** Tidak ada sistem pemantauan perkembangan anak secara digital dan real-time bagi guru/orang tua.

### 2.3 Urgensi

Membebaskan potensi anak ASD bukan hanya misi kemanusiaan, melainkan investasi strategis dalam mewujudkan visi **Indonesia Emas 2045**. KAWAN berpotensi menjadi *best practice* media inklusif digital yang dapat diadopsi oleh Disdikpora DIY dan diperluas secara nasional.

---

## 3. Tujuan Produk

### 3.1 Tujuan Utama

1. **Meningkatkan literasi sosial** anak ASD melalui simulasi interaksi antarpersona yang aman, terstruktur, dan menyenangkan dalam format visual novel.
2. **Meningkatkan pemahaman gizi dan kesehatan** melalui skenario cerita kontekstual yang mudah dipahami.
3. **Menumbuhkan kesadaran lingkungan** melalui misi interaktif yang menampilkan dampak nyata perilaku manusia terhadap ekosistem.
4. **Mengembangkan keterampilan pengambilan keputusan dan empati sosial** melalui mekanisme pilihan cerita bercabang (*branching story*) dengan konsekuensi berbeda.
5. **Menyediakan media intervensi dan pembelajaran digital adaptif** yang ramah sensorik autisme sebagai suplemen pendukung kurikulum inklusi nasional.

### 3.2 Manfaat per Stakeholder

| Stakeholder | Manfaat |
|---|---|
| **Peserta Didik ASD** | Melatih keterampilan fungsional dalam lingkungan aman & terstruktur; meningkatkan keberanian berkomunikasi |
| **Guru / Terapis** | Dashboard analitik real-time untuk memantau perkembangan individual; panduan intervensi berbasis data |
| **Orang Tua** | Buku komunikasi digital; dapat memantau progres anak di rumah; mendorong generalisasi ke dunia nyata |
| **Institusi SLB** | Media pembelajaran digital berinovasi tinggi; kompatibel dengan kurikulum modifikasi fungsional |
| **Ekosistem Pendidikan Nasional** | Model *best practice* media inklusif digital yang dapat direplikasi |

---

## 4. Target Pengguna

### 4.1 Pengguna Utama (Primary User)

- **Anak dengan ASD tingkat 1 (mild)** usia sekolah (7-15 tahun)
- Anak dengan kemampuan visual decoding yang baik namun memiliki hambatan komunikasi verbal ekspresif
- Anak yang belajar di SLB atau sekolah inklusif

### 4.2 Pengguna Sekunder (Secondary User)

- **Guru / Terapis SLB** — mengoperasikan Adaptive Placement Gate dan membaca dashboard
- **Orang tua / wali** — memantau perkembangan anak melalui laporan

### 4.3 Persona Pengguna

#### Persona 1 — Anak ASD (Jalur Pemula)
> **Nama:** Bima, 9 tahun
> **Kemampuan:** Kontak mata terbatas, belum verbalisasi, dapat duduk tenang 10-15 menit
> **Kebutuhan:** Pembelajaran visual matching sederhana, instruksi audio tenang, tidak ada animasi latar yang bergerak cepat
> **Jalur:** Beginner Path — pengenalan objek & warna

#### Persona 2 — Anak ASD (Jalur Lanjutan)
> **Nama:** Sari, 12 tahun
> **Kemampuan:** Kontak mata cukup, dapat verbalisasi kata sederhana, durasi duduk 30 menit
> **Kebutuhan:** Kategorisasi logika, penyusunan kalimat sederhana, PECS Digital Bersuara
> **Jalur:** Advanced Path — logika kategori & komunikasi PECS digital

#### Persona 3 — Guru Pendamping
> **Nama:** Bu Dewi, guru SLB
> **Kebutuhan:** Interface mudah dioperasikan, laporan visual data yang jelas (hijau-kuning-merah), dapat mengatur profil siswa

---

## 5. Fitur Produk

### 5.1 Fitur Inti (Core Features)

#### F-01: Adaptive Placement Gate (Gerbang Penempatan Adaptif)
- **Deskripsi:** Sistem penilaian awal berbasis checklist observasi guru yang secara dinamis membagi jalur bermain anak.
- **Input:** Checklist guru (kemampuan kontak mata, verbalisasi, durasi duduk tenang)
- **Output:** Otomatis menempatkan anak ke salah satu dari dua jalur:
  - Jalur 1 — Pemula (Beginner Path): Pengenalan objek & warna (visual matching)
  - Jalur 2 — Lanjutan (Advanced Path): Kategorisasi logika & penyusunan kalimat dengan Digital PECS Bersuara
- **Kriteria Penempatan:**

| Parameter | Jalur Pemula | Jalur Lanjutan |
|---|---|---|
| Kontak mata | < 3 detik/interaksi | >= 3 detik/interaksi |
| Verbalisasi | Belum ada | Minimal 1-2 kata |
| Durasi duduk tenang | < 15 menit | >= 15 menit |

---

#### F-02: Quest 1 — Lapak Gizi (Pola Hidup Sehat)
- **Tema:** Pemilihan makanan sehat di pasar tradisional
- **Mekanisme:** Drag-and-drop / tap untuk memilih makanan sehat vs tidak sehat
- **Learning Objective:**
  - Anak mampu membedakan makanan sehat dan tidak sehat
  - Anak memahami pentingnya pola makan bergizi seimbang
- **Jalur Pemula:** Matching warna/bentuk makanan ke kelompoknya
- **Jalur Lanjutan:** Mengkategorikan makanan berdasarkan kelompok gizi (karbohidrat, protein, sayur, buah)
- **Feedback:** Audio positif + animasi bintang/stiker (Token Economy)

---

#### F-03: Quest 2 — Kasir Bersuara (Komunikasi & Sosial)
- **Tema:** Simulasi interaksi sosial di kasir pasar tradisional
- **Mekanisme:** Digital PECS (Picture Exchange Communication System) Bersuara — anak menyusun kartu gambar untuk membentuk kalimat yang diucapkan oleh game
- **Contoh Interaksi:**
  - Anak menyusun kartu [Saya] + [Mau] + [Apel] -> Game membunyikan kalimat tersebut
  - Skenario mengucapkan "Terima Kasih", "Minta Tolong", konsep antre
- **Learning Objective:**
  - Melatih kemampuan verbal ekspresif
  - Menanamkan karakter sabar mengantri di kasir
  - Mengurangi kecemasan di tempat umum
- **Jalur Pemula:** Matching gambar kasir sederhana, 1-2 kartu PECS
- **Jalur Lanjutan:** Menyusun kalimat 3-4 kartu PECS + pilihan respons sosial bercabang

---

#### F-04: Quest 3 — Jalan Keluar Pasar (Kesadaran Lingkungan)
- **Tema:** Pemilahan sampah organik dan anorganik
- **Mekanisme:** Drag-and-drop sampah ke tempat sampah yang sesuai
- **Learning Objective:**
  - Membangun pengetahuan tentang jenis sampah (organik vs anorganik)
  - Menanamkan kesadaran menjaga kebersihan lingkungan pasar
- **Jalur Pemula:** Matching warna tempat sampah (hijau = organik, kuning = anorganik)
- **Jalur Lanjutan:** Kategorisasi multi-item + penjelasan singkat dampak lingkungan

---

#### F-05: Sistem Cerita Bercabang (Branching Narrative)
- **Deskripsi:** Pilihan dialog dan tindakan dalam game yang memiliki konsekuensi cerita berbeda, melatih pengambilan keputusan dan empati sosial.
- **Format:** Dialog singkat (teks minimal) + ilustrasi ekspresi karakter + narasi audio suara manusia asli berintonasi tenang
- **Prinsip Penulisan Dialog:**
  - Kalimat singkat dan konkret
  - Mengutamakan penguatan visual (Video Modeling)
  - Menghindari ambiguitas bahasa

---

#### F-06: Dashboard Guru & Analitik Perkembangan
- **Deskripsi:** Antarmuka khusus guru yang menampilkan data perkembangan anak secara real-time dari in-game tracker.
- **Metrik yang Ditampilkan:**
  - **Error Rate:** Frekuensi salah pilih makanan (Quest Gizi) atau salah pilah sampah (Quest Lingkungan)
  - **Response Time:** Kecepatan anak bereaksi setelah mendengar instruksi suara
  - **Prompt Level:** Tingkat kemandirian — apakah anak membutuhkan bantuan visual (hint) atau mandiri
  - **Waktu penyelesaian level**
  - **Jumlah sesi bermain**
- **Visualisasi:** Indikator warna Hijau-Kuning-Merah (traffic light) untuk kemudahan interpretasi guru
- **Penyimpanan:** Local Storage perangkat (offline, privasi terjaga)

---

#### F-07: Sistem Token Economy & Positive Reinforcement
- **Deskripsi:** Pemberian hadiah bintang/stiker instan sebagai positive reinforcement atas perilaku positif.
- **Mekanisme:**
  - Setiap jawaban benar -> animasi bintang + efek suara menyenangkan
  - Penyelesaian quest -> karakter merayakan + stiker koleksi
  - Tidak ada hukuman/efek negatif yang keras — hanya prompt lembut untuk mencoba ulang

---

#### F-08: Profil Siswa Multi-Akun
- **Deskripsi:** Guru dapat membuat dan mengelola profil bermain untuk masing-masing siswa.
- **Fitur:**
  - Input data profil siswa (nama, foto opsional, jalur Adaptive Placement Gate)
  - Riwayat progres per siswa
  - Reset progres jika diperlukan

---

### 5.2 Fitur Tambahan (Secondary Features)

| ID | Fitur | Deskripsi |
|---|---|---|
| F-09 | **Mode Guru / Mode Siswa** | Pemisahan antarmuka — mode guru diproteksi password sederhana |
| F-10 | **Buku Komunikasi Orang Tua** | Laporan progres yang dapat dicetak/dibagikan ke orang tua |
| F-11 | **Pengaturan Aksesibilitas** | Volume audio, ukuran teks, kecepatan narasi dapat disesuaikan |
| F-12 | **Layar Intro Pengatur Suasana** | Layar pembuka tenang dengan musik instrumental lembut untuk transisi anak ke mode bermain |

---

## 6. Desain UI/UX — Prinsip Ramah Sensorik ASD

### 6.1 Prinsip Desain Utama

Game KAWAN dirancang secara ketat berdasarkan prinsip mitigasi distraksi kognitif dan sensory overload:

| Elemen | Panduan Desain |
|---|---|
| **Palet Warna** | Warna pastel menenangkan (soft mint, warm cream, lavender muda) — menghindari kontras tinggi |
| **Animasi Latar** | Tidak ada animasi latar bergerak yang tidak diperlukan — latar statis atau sangat subtle |
| **Border Objek** | Bold border / outline tegas pada semua elemen interaktif untuk kemudahan persepsi visual |
| **Tipografi** | Font bulat, besar, jelas (minimal 18px) — tidak menggunakan font dekoratif |
| **Audio** | Suara manusia asli, intonasi tenang dan jelas; hindari suara mengejutkan |
| **Feedback** | Umpan balik instan setelah setiap interaksi (tidak ada delay yang membingungkan) |
| **Navigasi** | Tombol besar, area klik luas, langkah-langkah yang dapat diprediksi |
| **Teks Dialog** | Kalimat sangat pendek, 1-2 baris per layar, ukuran besar |

### 6.2 Panduan Warna

```
Latar utama  : #F8F4EF (Warm Cream)
Aksen utama  : #7EC8A4 (Soft Mint)
Aksen kedua  : #B8A9D9 (Lavender Muda)
Teks utama   : #3D3A38 (Coklat Gelap — bukan hitam pekat)
Border objek : #5C5C5C (Abu-abu tegas)
Positive     : #FFD166 (Kuning hangat — bintang)
Error/hint   : #F4A261 (Oranye lembut — bukan merah keras)
```

---

## 7. Arsitektur Teknis

### 7.1 Platform & Engine

| Aspek | Spesifikasi |
|---|---|
| **Engine Utama** | Ren'Py (Visual Novel Engine) — atau GDevelop / Construct 3 sebagai alternatif |
| **Platform Target** | Cross-platform: PC/Laptop (Windows, macOS), Tablet Android/iOS, Smartphone |
| **Mode Operasi** | **Offline-ready** (tidak memerlukan koneksi internet) |
| **Bahasa Pemrograman** | Ren'Py Script (Python-based) / GDScript / JavaScript (Construct 3) |
| **Distribusi** | Web Application (akses via browser) + paket instalasi ringan untuk tablet sekolah |

### 7.2 Mengapa Ren'Py?

- Gratis dan open-source
- Sangat cocok untuk format visual novel dengan dialog dan pilihan bercabang
- Dapat diekspor ke HTML5 (web), Android, Windows, dan iOS
- Dukungan audio, animasi sprite, dan sistem variabel yang cukup untuk game edukasi
- Ringan — dapat berjalan di tablet spesifikasi rendah (inventaris SLB)
- Komunitas luas dan dokumentasi lengkap

### 7.3 Struktur Data & Penyimpanan

```
Local Storage (Perangkat Lokal)
├── profil_siswa/
│   ├── siswa_001.json   (nama, jalur, tanggal mulai)
│   ├── siswa_002.json
│   └── ...
├── progres/
│   ├── quest_gizi/
│   │   ├── error_rate.log
│   │   ├── response_time.log
│   │   └── prompt_level.log
│   ├── quest_komunikasi/
│   └── quest_lingkungan/
└── pengaturan/
    ├── volume.json
    └── aksesibilitas.json
```

---

## 8. Alur Permainan (Game Flow)

### 8.1 Alur Utama

```
[Layar Pembuka / Splash Screen]
        |
        v
[Pilih Profil Siswa / Buat Profil Baru]
        |
        v
[Adaptive Placement Gate — Input Guru]
   +----+----+
   |         |
[Jalur 1]  [Jalur 2]
 Pemula    Lanjutan
   |         |
   +----+----+
        |
        v
[Intro Cerita: Selamat datang di Pasar KAWAN!]
        |
        v
[Quest 1: Lapak Gizi — Pilih Makanan Sehat]
        |
        v
[Feedback + Reward Bintang]
        |
        v
[Quest 2: Kasir Bersuara — Susun PECS]
        |
        v
[Feedback + Reward Bintang]
        |
        v
[Quest 3: Jalan Keluar — Pilah Sampah]
        |
        v
[Feedback + Reward Bintang]
        |
        v
[Layar Selesai — Stiker Koleksi + Ringkasan]
        |
        v
[Data tersimpan ke Local Storage -> Dashboard Guru]
```

### 8.2 Skenario Gameplay Contoh — Quest 2 (Jalur Lanjutan)

```
NARASI (Audio + Teks):
"Wah, kamu sudah sampai di kasir! Apa yang ingin kamu katakan?"

[Kartu PECS tersedia: Saya | Mau | Beli | Apel | Terima Kasih]

AKSI SISWA:
Menyusun -> [Saya] + [Mau] + [Beli] + [Apel]

GAME RESPONSE:
Suara berbunyi: "Saya mau beli apel."
Karakter kasir tersenyum -> Dialog: "Tentu! Ini apelnya."

PROMPT BERIKUTNYA:
"Jangan lupa ucapkan terima kasih!"
[Petunjuk visual berkedip pada kartu Terima Kasih]

AKSI SISWA: Memilih [Terima Kasih]
-> Reward: Bintang + Animasi tepuk tangan
```

---

## 9. Sistem Evaluasi (Assessment Triangulation)

KAWAN menggunakan pendekatan **Triangulasi Asesmen** yang menggabungkan:

### 9.1 Evaluasi Formatif Digital (In-Game Tracker)

| Metrik | Deskripsi | Indikator |
|---|---|---|
| **Error Rate** | Frekuensi salah pilih makanan/salah pilah sampah | Hijau: < 20% / Kuning: 20-40% / Merah: > 40% |
| **Response Time** | Kecepatan anak bereaksi setelah instruksi suara | Hijau: < 10 detik / Kuning: 10-20 detik / Merah: > 20 detik |
| **Prompt Level** | Apakah anak mandiri atau butuh hint visual | Hijau: Mandiri / Kuning: Butuh 1 hint / Merah: Butuh > 1 hint |
| **Completion Time** | Waktu penyelesaian per level | Direkam tanpa nilai negatif |

### 9.2 Evaluasi Sumatif Otentik

- **Lembar Observasi Guru:** Mengukur transfer perilaku dari game ke dunia nyata (mengucapkan "Terima Kasih", antre dengan sabar, membuang sampah pada tempatnya)
- **Buku Komunikasi Orang Tua:** Orang tua mencatat pembiasaan di rumah (belanja sehat ke pasar, generalisasi keterampilan)

---

## 10. Model Implementasi di Kelas

KAWAN diterapkan menggunakan metode **Blended Interventional Learning** dalam 3 fase:

| Fase | Aktivitas | Durasi |
|---|---|---|
| **Pre-Activity** | Guru memberikan pengantar visual singkat terkait tema hari itu | 5-10 menit |
| **Interactive Session** | Siswa bermain game KAWAN secara mandiri atau terpandu menggunakan tablet sekolah | 20-30 menit |
| **Post-Activity** | Guru observasi apakah siswa mempraktikkan hal yang dipelajari; diskusi ringan | 10-15 menit |

### 10.1 Persiapan Guru (Workshop Pelatihan)

1. Cara mengoperasikan Adaptive Placement Gate di menu guru
2. Teknik membaca visualisasi data dashboard (indikator Hijau-Kuning-Merah)
3. Panduan penanganan mitigasi jika anak menunjukkan kecemasan/distraksi saat gawai digunakan

---

## 11. Persyaratan Non-Fungsional

| Kategori | Persyaratan |
|---|---|
| **Performa** | Waktu muat < 3 detik pada tablet spesifikasi menengah (RAM 2GB, Android 9+) |
| **Aksesibilitas** | WCAG 2.1 AA — teks cukup besar, kontras memadai, navigasi tanpa mouse untuk tablet |
| **Offline** | Seluruh fitur dapat berjalan tanpa koneksi internet; data tersimpan di local storage |
| **Privasi** | Tidak ada data siswa yang dikirim ke server eksternal; semua tersimpan lokal |
| **Keandalan** | Tidak ada crash/freeze saat bermain; auto-save setiap perpindahan layar |
| **Kompatibilitas** | Windows (PC/laptop), Android tablet (Android 9+), iOS (iPad iOS 13+), browser modern |
| **Ukuran Aplikasi** | < 150 MB (termasuk semua aset audio & visual) |
| **Skalabilitas** | Mendukung minimal 30 profil siswa per perangkat |

---

## 12. Rencana Pengembangan & Milestone

### 12.1 Fase Pengembangan (Model ADDIE)

| Fase | Kegiatan | Output |
|---|---|---|
| **A — Analysis** | Survei kebutuhan di SLB Fajar Nugrah; wawancara guru & kepala sekolah | Dokumen analisis kebutuhan |
| **D — Design** | Perancangan arsitektur konten, storyboard, UI/UX, logika Adaptive Placement Gate | Wireframe, Storyboard, Design System |
| **D — Development** | Produksi aset digital (ilustrasi, audio, animasi), pemrograman di Ren'Py/GDevelop | Alpha Version |
| **I — Implementation** | Expert Judgment oleh guru/terapis SLB; workshop pelatihan guru; uji coba terbatas | Beta Version + Laporan Validasi |
| **E — Evaluation** | Pengukuran dampak menggunakan Assessment Triangulation | Laporan Evaluasi Dampak |

### 12.2 Timeline Target

| Minggu | Milestone |
|---|---|
| 1-2 | Finalisasi desain UI/UX & storyboard |
| 3-5 | Pengembangan Quest 1 (Lapak Gizi) + Adaptive Placement Gate |
| 6-8 | Pengembangan Quest 2 (Kasir Bersuara) + Digital PECS |
| 9-11 | Pengembangan Quest 3 (Jalan Keluar Pasar) + Dashboard Guru |
| 12 | Integrasi sistem + In-Game Tracker |
| 13 | Expert Judgment — validasi guru/terapis SLB |
| 14 | Revisi berdasarkan feedback validasi |
| 15 | Uji coba terbatas dengan siswa SLB |
| 16 | Evaluasi dampak & finalisasi laporan |

---

## 13. Kriteria Penerimaan (Acceptance Criteria)

### 13.1 Kriteria Fungsional

- [ ] Adaptive Placement Gate berhasil menempatkan anak ke jalur yang sesuai berdasarkan input checklist guru
- [ ] Ketiga quest (Gizi, Kasir, Lingkungan) dapat dimainkan secara penuh di kedua jalur (Pemula & Lanjutan)
- [ ] Sistem Digital PECS Bersuara dapat memutar audio kalimat yang disusun anak
- [ ] Dashboard guru menampilkan data Error Rate, Response Time, dan Prompt Level dengan benar
- [ ] Semua data tersimpan di local storage dan tetap ada setelah aplikasi ditutup/dibuka kembali
- [ ] Aplikasi dapat berjalan penuh dalam mode offline

### 13.2 Kriteria Kualitas ASD

- [ ] Tidak ada animasi latar yang bergerak secara terus-menerus
- [ ] Semua tombol interaktif memiliki ukuran minimal 44x44 px (standar aksesibilitas touch)
- [ ] Audio dapat dimatikan/disesuaikan volumenya
- [ ] Tidak ada efek suara mengejutkan atau kontras tinggi yang tiba-tiba
- [ ] Setiap instruksi disertai representasi visual (tidak hanya teks)

### 13.3 Kriteria Validasi Ahli

- [ ] Mendapat validasi dari minimal 2 guru/terapis SLB bahwa konten sesuai kebutuhan anak ASD
- [ ] Mendapat validasi dari kepala sekolah bahwa game sesuai kurikulum modifikasi fungsional
- [ ] Skor validasi ahli >= 80% dari total poin penilaian

---

## 14. Risiko & Mitigasi

| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|
| Anak mengalami sensory overload saat bermain | Sedang | Tinggi | Desain ramah sensorik + panduan guru; tombol pause mudah diakses |
| Perangkat tablet SLB spesifikasi sangat rendah | Tinggi | Sedang | Optimasi aset; target minimum Android 9 / RAM 2GB; uji di perangkat nyata |
| Tidak ada koneksi internet di sekolah | Tinggi | Rendah | Aplikasi dirancang offline-ready sejak awal |
| Guru kesulitan mengoperasikan dashboard | Sedang | Sedang | Workshop pelatihan + panduan visual di dalam aplikasi |
| Data siswa hilang/terhapus | Rendah | Tinggi | Auto-save + fitur ekspor data (backup manual) |
| Anak ASD menolak menggunakan gawai | Sedang | Sedang | Pendampingan guru terlatih; adaptasi bertahap; tidak dipaksakan |

---

## 15. Glosarium

| Istilah | Definisi |
|---|---|
| **ASD** | Autism Spectrum Disorder — Gangguan Spektrum Autisme |
| **Adaptive Placement Gate** | Sistem penilaian awal yang menentukan jalur bermain anak secara dinamis |
| **PECS Digital** | Picture Exchange Communication System — sistem komunikasi berbasis gambar yang didigitalisasi |
| **Social Stories** | Narasi singkat terstruktur yang menggambarkan situasi sosial untuk membantu anak ASD memahami konteks |
| **Token Economy** | Sistem reward berupa token (bintang/stiker) sebagai positive reinforcement |
| **Sensory Overload** | Kondisi kelebihan stimulasi sensorik yang dapat memicu kecemasan/tantrum pada anak ASD |
| **PPI** | Program Pembelajaran Individual — rencana belajar yang disesuaikan per individu |
| **ADDIE** | Analyze, Design, Develop, Implement, Evaluate — model pengembangan media pembelajaran |
| **UDL** | Universal Design for Learning — prinsip desain pembelajaran inklusif |
| **Local Storage** | Penyimpanan data di perangkat lokal, tanpa server eksternal |
| **SLB** | Sekolah Luar Biasa — sekolah khusus untuk anak berkebutuhan khusus |
| **Visual Novel** | Genre game digital yang berfokus pada narasi cerita dengan pilihan interaktif |

---

## 16. Referensi

1. Atherton, G., & Cross, L. (2021). Seeing more than human: autism and analogue social games.
2. Atsalaki, G., & Kazanidis, I. (2025). Visual Novels in Social-Emotional Learning for ASD Students.
3. Bal, V.H., et al. (2022). Twice-exceptional learners: Strengths and challenges in ASD.
4. Camingue, J., et al. (2021). Interactive narrative and social skills training. CHI Conference.
5. Dewi, R., & Morawati, T. (2024). Media pembelajaran di SLB: Kajian kebutuhan digital.
6. Dwiputra, A., & Pratama, R. (2025). Visual Novel sebagai Media Literasi Anak Autisme Tingkat 1.
7. Zanziarti, N., & Rivaldo, E. (2025). Game interaktif untuk kemandirian fungsional anak ASD.

---

*Dokumen ini merupakan bagian dari proposal pengembangan KAWAN untuk Lomba Inovasi Digital Mahasiswa (LIDM) 2026, Divisi Inovasi Perangkat Digital Pendidikan (IPDP), dalam rangka mewujudkan visi Indonesia Emas 2045.*

---
**© 2026 Tim KAWAN — Universitas Gadjah Mada**
