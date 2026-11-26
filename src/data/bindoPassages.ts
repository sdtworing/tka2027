import { Passage } from '../types/exam';

export const BINDO_PASSAGES: Record<string, Passage> = {
  p1: {
    id: 'p1',
    title: 'Gerakan Sekolah Bebas Sampah Plastik di SD Harapan Nusantara',
    genre: 'Teks Berita Anak',
    paragraphs: [
      'Mulai hari Senin, 12 Agustus 2025, SD Harapan Nusantara resmi meluncurkan program "Gerakan Sekolah Bebas Sampah Plastik". Kegiatan ini berawal dari keprihatinan warga sekolah terhadap menumpuknya sampah bungkus jajanan plastik di tempat sampah dan halaman belakang sekolah setiap jam istirahat berakhir.',
      'Melalui program ini, seluruh siswa diimbau membawa botol minum isi ulang serta kotak bekal sendiri dari rumah setiap hari. Petugas kantin sekolah pun berkomitmen mengganti kantong plastik sekali pakai dengan daun pisang atau wadah kertas ramah lingkungan saat membungkus makanan.',
      'Setelah berjalan satu bulan, dampak positif mulai dirasakan bersama. Volume sampah plastik di sekolah menurun drastis hingga lebih dari separuhnya, halaman sekolah tampak lebih bersih, dan siswa semakin terbiasa hidup hemat serta peduli terhadap kelestarian lingkungan.',
    ],
  },
  p2: {
    id: 'p2',
    title: 'Kancil, Kura-Kura, dan Jembatan Bambu',
    genre: 'Fabel',
    paragraphs: [
      'Hujan deras semalaman membuat jembatan kayu di Sungai Jernih hanyut terbawa arus. Pagi itu, Kancil, Kura-Kura, dan Berang-Berang kebingungan karena tidak bisa menyeberang untuk mencari buah segar di seberang hutan.',
      'Kancil segera mencari akal. "Kita bisa membuat jembatan baru dari batang bambu yang tumbang di pinggir tebing," usulnya. Kura-Kura mengangguk setuju meski langkahnya lambat. Tanpa ragu, Kura-Kura membantu memanggul ikatan rotan dengan tempurungnya yang kuat dan mendorong batang bambu ke tepi sungai.',
      'Sementara itu, Berang-Berang menancapkan pancang kayu ke tanah lumpur, dan Kancil mengikat batang-batang bambu dengan simpul yang erat. Berkat kerja sama mereka, jembatan bambu yang kokoh pun selesai sebelum tengah hari dan dapat dilalui seluruh penghuni hutan.',
    ],
  },
  p3: {
    id: 'p3',
    title: 'Cara Membuat Pupuk Kompos Sederhana dari Daun Kering',
    genre: 'Teks Prosedur',
    paragraphs: [
      'Daun-daun kering yang gugur di halaman rumah atau sekolah sebenarnya dapat diolah menjadi pupuk kompos yang menyuburkan tanaman. Ikuti langkah-langkah berikut untuk membuatnya:',
    ],
    isProcedureList: true,
    steps: [
      'Kumpulkan daun-daun kering yang sudah gugur, lalu cacah atau remas hingga berukuran kecil agar lebih cepat membusuk.',
      'Siapkan ember plastik atau tong tertutup yang bagian bawahnya sudah diberi beberapa lubang kecil untuk sirkulasi udara.',
      'Masukkan selapis tanah gembur di dasar wadah, kemudian tumpuk daun kering cacahan di atasnya secara merata.',
      'Siram tumpukan daun dengan air secukupnya (boleh dicampur sedikit cairan pengurai alami) hingga terasa lembap, tetapi tidak menggenang.',
      'Tutup wadah dengan rapat dan diamkan di tempat teduh selama 4 minggu sambil sesekali diaduk setiap pekan hingga berwarna cokelat kehitaman dan tidak berbau menyengat.',
    ],
  },
  p4: {
    id: 'p4',
    title: 'Pengumuman Lomba Kebun Apotek Hidup Sekolah',
    genre: 'Teks Pengumuman',
    announcementMeta: {
      header: 'PENGUMUMAN PANITIA PEKAN LINGKUNGAN SD MELATI',
      date: '2 September 2025',
      to: 'Seluruh Siswa Kelas IV, V, dan VI',
    },
    paragraphs: [
      'Dalam rangka memperingati Hari Cinta Puspa dan Satwa, sekolah akan menyelenggarakan Lomba Kebun Apotek Hidup antarkelas. Setiap kelas diminta menanam minimal lima jenis tanaman obat keluarga (TOGA), termasuk tanaman berjenis rimpang seperti jahe, kunyit, dan temulawak.',
      'Pendaftaran peserta dibuka mulai tanggal 4 sampai 8 September 2025 di Ruang UKS pada jam istirahat pertama. Lahan kebun mini masing-masing kelas berada di taman samping perpustakaan. Penilaian kebersihan, kerapian label nama latin, serta kesuburan tanaman akan dilaksanakan pada tanggal 25 September 2025.',
    ],
  },
  p5: {
    id: 'p5',
    title: 'Sepatu Baru untuk Adik',
    genre: 'Cerita Anak',
    paragraphs: [
      'Setiap pulang sekolah, Bima tidak langsung bermain bersama teman-temannya. Siswa kelas VI itu selalu mampir ke kios tanaman milik Pak Tarno di ujung gang. Dengan cekatan, Bima membantu menyiram pot anggrek dan menata bibit tanaman hias di rak depan.',
      'Upah harian dari Pak Tarno selalu disimpan Bima di dalam celengan kaleng di lemari kamarnya. Bima bercita-cita menjadi ahli pertanian suatu hari nanti, tetapi keinginannya yang paling dekat saat ini adalah membelikan sepatu sekolah baru untuk adiknya, Lala, yang sol sepatunya sudah mulai terlepas.',
      'Saat celengan itu dibuka pada akhir bulan, senyum Bima merekah. Uangnya cukup untuk membeli sepasang sepatu hitam baru bagi Lala beserta sepasang kaus kaki putih.',
    ],
  },
  p6: {
    id: 'p6',
    title: 'Warung Kejujuran di Ujung Koridor',
    genre: 'Cerita Edukatif',
    paragraphs: [
      'Sebelum ada Warung Kejujuran, sudut koridor kelas VI sering tampak sepi dan kadang menyisakan bungkus permen yang terjatuh di lantai. Siswa yang lupa membawa alat tulis pun harus menunggu jam istirahat agar bisa meminjam atau membeli di kantin utama yang antreannya sangat panjang.',
      'Kini, suasana berubah sejak sekolah membuka Warung Kejujuran di ujung koridor. Tidak ada penjaga yang mengawasi rak berisi pensil, penghapus, buku tulis, dan roti kemasan tersebut. Siswa cukup mengambil barang yang dibutuhkan, melihat daftar harga, lalu memasukkan uang pas ke dalam kotak kayu terkunci.',
      'Lina, ketua kelas VI yang dikenal ringan tangan, setiap pagi membantu menata barang dan mencatat stok bersama guru pembina. Berkat Warung Kejujuran, antrean kantin berkurang dan para siswa terlatih bersikap jujur meski tidak diawasi siapa pun.',
    ],
  },
  p7: {
    id: 'p7',
    title: 'Gotong Royong Memperbaiki Bendungan Desa',
    genre: 'Cerita Rakyat & Budaya',
    paragraphs: [
      'Musim tanam padi tinggal dua pekan lagi, tetapi tanggul bendungan irigasi di Desa Sukamaju jebol akibat luapan air sungai. Tanpa perbaikan cepat, puluhan hektare sawah milik warga terancam gagal tanam karena tidak mendapat aliran air.',
      'Sejak matahari terbit, warga desa—mulai dari petani hingga para pemuda—berkumpul membawa cangkul, karung pasir, dan batu kali. Pak Karto selaku ketua kelompok tani tampak banting tulang mengangkut batu-batu besar bersama para tetangganya meski usianya tidak lagi muda.',
      'Menjelang siang, gerimis mulai turun membasahi tubuh mereka. Namun, tidak seorang pun beranjak pulang. Mereka terus bekerja bahu-membahu mengokohkan tanggul hingga aliran air kembali mengalir tenang menuju petak-petak sawah warga.',
    ],
  },
  p8a: {
    id: 'p8a',
    title: 'Lomba Cerdas Cermat Tingkat Kecamatan',
    genre: 'Cerita Anak',
    paragraphs: [
      'Tiga hari menjelang Lomba Cerdas Cermat tingkat kecamatan, Dimas masih merasa gugup. Ia khawatir tidak mampu menjawab pertanyaan babak rebutan dengan cepat. Malam harinya, Dimas berlatih bersama kedua rekan timnya, Sari dan Bagas, dengan membagi tugas penguasaan materi.',
      'Saat lomba berlangsung di aula kecamatan, babak pertama berjalan ketat. Pada soal terakhir babak rebutan, tim lain menekan bel lebih dulu tetapi jawabannya kurang tepat. Dimas menarik napas dalam-dalam, mengingat kembali latihan timnya, lalu menjawab dengan tenang dan benar. Tim SD Nusantara pun berhasil meraih juara pertama.',
    ],
  },
  p8b: {
    id: 'p8b',
    title: 'Mengenal Energi Surya sebagai Sumber Listrik Ramah Lingkungan',
    genre: 'Teks Informasi',
    paragraphs: [
      'Indonesia merupakan negara tropis yang memperoleh sinar matahari hampir sepanjang tahun. Potensi cahaya matahari yang melimpah ini dapat dimanfaatkan sebagai sumber energi terbarukan yang disebut energi surya. Penggunaan energi surya sangat penting untuk mengurangi ketergantungan pada bahan bakar fosil seperti batu bara dan minyak bumi.',
      'Pemanfaatan energi surya menjadi listrik dilakukan menggunakan alat bernama panel surya. Ketika cahaya matahari menyinari permukaan panel surya, sel-sel silikon di dalamnya menangkap energi cahaya dan langsung mengubahnya menjadi arus listrik searah. Arus tersebut kemudian dialirkan ke alat pengubah (inverter) agar dapat menyalakan lampu, televisi, hingga pompa air di rumah.',
      'Selain tidak menimbulkan asap polusi yang mencemari udara, panel surya memiliki usia pakai yang panjang hingga puluhan tahun. Kini, banyak sekolah dan fasilitas umum di daerah terpencil mulai memasang panel surya di atap bangunan untuk memenuhi kebutuhan listrik secara mandiri.',
    ],
  },
  p9: {
    id: 'p9',
    title: 'Riko dan Sepeda Tua Kakek',
    genre: 'Cerita Anak',
    paragraphs: [
      'Awalnya, Riko selalu memarkir sepeda tua pemberian kakeknya di sudut paling belakang halaman sekolah. Cat rangkanya sudah memudar dan rantainya sering berderit. Beberapa teman sempat menertawakan sepedanya, sehingga Riko merasa malu, murung, dan hampir memutuskan untuk berjalan kaki saja.',
      'Mengetahui kegelisahan cucunya, Kakek tersenyum hangat sambil menyodorkan kaleng cat kecil dan kuas. "Sepeda ini masih kuat, Riko. Kamu hanya perlu merawatnya. Mulailah menabung dari sisa uang saku untuk membeli rantai dan bel baru. Ingatlah, sedikit demi sedikit, lama-lama menjadi bukit," nasihat Kakek lembut.',
      'Kata-kata Kakek membangkitkan semangat Riko. Setiap hari, Riko menyisihkan separuh uang jajannya dan rajin membersihkan karat di pelek roda bersama Kakek. Setelah dua bulan, uang tabungannya cukup untuk mengganti rantai, ban dalam, dan mengecat ulang rangka sepeda dengan warna biru cerah.',
      'Kini, Riko mengayuh sepedanya ke sekolah dengan langkah mantap dan penuh rasa bangga. Ia tidak lagi peduli pada ejekan masa lalu karena sepeda itu adalah bukti ketekunan dan kasih sayang kakeknya.',
    ],
  },
  p10: {
    id: 'p10',
    title: 'Hutan Mangrove: Benteng Alami Pesisir Indonesia',
    genre: 'Teks Informasi Lingkungan',
    paragraphs: [
      'Di sepanjang garis pantai tropis Indonesia tumbuh subur ekosistem unik yang disebut hutan mangrove atau hutan bakau. Pohon bakau memiliki akar tunjang yang kokoh, rapat, dan menjulur kuat menancap ke dalam lumpur pantai.',
      'Susunan akar yang rapat tersebut berfungsi sebagai benteng alami yang mampu meredam kekuatan gelombang laut dan angin kencang. Ketika ombak besar datang menghantam pantai, akar mangrove memecah energi ombak sehingga mencegah terjadinya abrasi atau pengikisan daratan pantai. Selain itu, sela-sela akar mangrove menjadi tempat berlindung dan berkembang biak yang aman bagi kepiting, udang, serta anak-anak ikan.',
      'Sayangnya, beberapa wilayah pesisir mengalami kerusakan akibat alih fungsi lahan dan tumpukan sampah plastik kiriman dari sungai. Oleh karena itu, menjaga kelestarian hutan mangrove dan menghentikan kebiasaan membuang sampah ke aliran sungai menjadi tanggung jawab bersama agar kawasan pesisir tetap lestari.',
    ],
  },
  p11: {
    id: 'p11',
    title: 'Isi Piringku: Panduan Gizi Seimbang Anak Sekolah',
    genre: 'Teks Informasi Kesehatan',
    svgId: 'bindo-q26',
    paragraphs: [
      'Agar tubuh anak usia sekolah tumbuh sehat, kuat, dan bersemangat saat belajar, Kementerian Kesehatan memperkenalkan panduan makan sehat bernama "Isi Piringku". Panduan ini mengajarkan komposisi makanan bergizi seimbang dalam satu piring setiap kali makan.',
      'Dalam panduan Isi Piringku, separuh (setengah) bagian piring diisi oleh sayuran dan buah-buahan yang kaya vitamin serta serat, dengan rincian sepertiga bagian piring berupa sayuran dan seperenam bagian piring berupa buah-buahan. Separuh bagian piring lainnya diisi oleh makanan pokok sumber karbohidrat (sepertiga bagian piring) seperti nasi atau jagung, serta lauk pauk sumber protein (seperenam bagian piring) seperti ikan, telur, atau tempe.',
      'Selain mengatur isi piring, anak-anak juga dianjurkan minum air putih yang cukup, mencuci tangan dengan sabun sebelum makan, serta membatasi konsumsi makanan yang terlalu manis, asin, dan berlemak.',
    ],
  },
  p12: {
    id: 'p12',
    title: 'Perpustakaan Terapung di Sungai Kapuas',
    genre: 'Cerita Inspiratif',
    paragraphs: [
      'Setiap hari Sabtu pagi, perahu kayu bercat biru milik Kak Ardi menyusuri tepian Sungai Kapuas menuju desa-desa yang jauh dari kota. Di dalam perahu sederhana itu tersusun rapi ratusan buku cerita bergambar, ensiklopedia alam, dan buku pengetahuan anak. Warga setempat menjulukinya "Perahu Pustaka".',
      'Sabtu itu langit mendung dan angin bertiup kencang di permukaan sungai. Kak Ardi sempat khawatir tidak ada anak yang datang ke dermaga kayu. Namun, begitu peluit perahu dibunyikan, belasan anak berseragam pramuka berlarian ke tepi sungai sambil memayungi kepala mereka dengan daun pisang agar tidak kehujanan.',
      'Dengan senyum ramah, Kak Ardi segera membentangkan terpal pelindung hujan di atas perahu dan membagikan buku-buku kepada anak-anak. Ia bahkan membacakan dongeng dengan suara lantang dan penuh ekspresi agar anak-anak tetap hangat dan gembira meski rintik hujan membasahi atap terpal.',
    ],
  },
};
