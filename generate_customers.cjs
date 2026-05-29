const fs = require('fs');
const firstNames = [
  'Tri','Dewi','Rizky','Siti','Agus','Nina','Rian','Indah','Fajar','Andini',
  'Bayu','Aulia','Dani','Maya','Hadi','Rika','Yudha','Putri','Joko','Wulan',
  'Lia','Reza','Intan','Aldi','Vina','Dina','Bima','Fina','Tio','Mega',
  'Rama','Nia','Gilang','Nadia','Yoga','Citra','Dian','Rudi','Rosa','Teguh',
  'Lina','Imam','Santi','Fauzi','Yani','Arif','Lina','Budi','Tina','Eka',
  'Ari','Rini','Yusuf','Nia','Ferry','Rizka','Yulis','Hendra','Lisa','Tasya',
  'Romy','Meli','Ari','Rika','Nanda','Sari','Rian','Yuni','Adit','Indra',
  'Farah','Nico','Hesti','Bagus','Dinda','Riza','Denny','Rara','Rizal','Tia',
  'Ilham','Putu','Tia','Hana','Bram','Gita','Rina','Yosi','Tari','Riko',
  'Naila','Deni','Cici','Iwan','Fadhil','Rani','Arini','Sari','Bayu','Rani'
];
const lastNames = [
  'Batubara','Wibowo','Suryanto','Pratama','Safitri','Nugraha','Wijaya','Halim','Susanto','Puspita',
  'Ramadhan','Sari','Putra','Firmansyah','Wahyudi','Hidayat','Wijaya','Kusuma','Saputra','Amalia',
  'Prasetyo','Fauzan','Kurniawan','Yulianti','Azhari','Ramadhani','Kurnia','Lestari','Octavian','Pratami',
  'Zahra','Kusuma','Pratama','Hidayat','Ningsih','Santoso','Aditya','Pratama','Handayani','Setiawan',
  'Aminah','Nasution','Pranoto','Saputra','Anggraini','Utami','Budiman','Mei','Listiani','Sukma',
  'Wicaksono','Prasetyo','Hendri','Juminten','Lestari','Ramadhani','Pratiwi','Santika','Mulyadi','Irawan',
  'Wicaksono','Prayoga','Saputra','Karina','Rizky','Arifin','Rosalia','Kharisma','Wulandari','Nurhadi',
  'Rahayu','Sukma','Ramdhani','Hendri','Susanti','Mardiana','Purnomo','Hidayat','Setiawan','Rizky',
  'Nurul','Rahma','Iskandar','Cahyono','Ratna','Kholid','Wijaya','Sari','Sabri','Yuliana',
  'Kusuma','Setiawan','Mahendra','Fitri','Rachman','Halim','Setiono','Maharani','Firdaus','Nuraini'
];
const streets = [
  'Jl. Sudirman','Jl. Gatot Subroto','Jl. Jendral Ahmad Yani','Jl. Merdeka','Jl. Hayam Wuruk',
  'Jl. Diponegoro','Jl. Imam Bonjol','Jl. Pahlawan','Jl. Sultan Agung','Jl. Teuku Umar',
  'Jl. Sultan Hasanuddin','Jl. Pattimura','Jl. K.H. Wahid Hasyim','Jl. Gajah Mada','Jl. Thamrin',
  'Jl. Ahmad Yani','Jl. Raya Bogor','Jl. Raya Cibubur','Jl. Sisingamangaraja','Jl. Veteran'
];
const cities = [
  'Jakarta','Bandung','Surabaya','Yogyakarta','Medan','Semarang','Denpasar','Makassar','Palembang','Padang',
  'Balikpapan','Malang','Cirebon','Bengkulu','Pontianak','Jambi','Mataram','Kupang','Pekanbaru','Solo'
];
const loyaltyOptions = ['Gold','Silver','Bronze'];
const statusOptions = ['Active','Inactive'];
const emailSubOptions = ['Ya','Tidak'];
const giveawayOptions = ['Ya','Tidak'];
const notes = [
  'Pelanggan VIP, prioritaskan layanan utama',
  'Sering menggunakan paket wedding premium',
  'Perlu follow-up antara 2-3 hari setelah event',
  'Membutuhkan jadwal konsultasi khusus',
  'Suka dengan tema minimalis dan modern',
  'Sering memberi rating tinggi setelah event',
  'Mungkin akan melakukan repeat order',
  'Butuh penawaran khusus untuk keluarga besar',
  'Suka diskon dan promo email',
  'Ingin update promo mingguan via SMS',
  'Memiliki preferensi dekorasi tradisional',
  'Butuh paket lengkap dengan vendor catering',
  'Berharap layanan cepat dan fleksibel',
  'Sering memesan pada akhir pekan',
  'Pelanggan baru, perlu pendampingan tim',
  'Kontak mudah, jarang menyampaikan keluhan',
  'Pernah mengajukan komplain ringan, sudah terselesaikan',
  'Perlu perhatian ekstra pada hastag sosial media',
  'Suka warna pastel dan dekorasi elegan',
  'Menyukai paket hemat tapi berkualitas'
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randChoice = (arr, weights) => {
  const total = weights.reduce((a, b) => a + b, 0);
  const r = Math.random() * total;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += weights[i];
    if (r <= sum) return arr[i];
  }
  return arr[arr.length - 1];
};

const entries = [];
for (let i = 1; i <= 800; i++) {
  const first = rand(firstNames);
  const last = rand(lastNames);
  const city = rand(cities);
  const street = rand(streets);
  const number = Math.floor(Math.random() * 180) + 1;
  const phone = `081${Math.floor(Math.random() * 900000000 + 100000000)}`;
  const loyalty = randChoice(loyaltyOptions, [0.25, 0.35, 0.4]);
  const status = randChoice(statusOptions, [0.8, 0.2]);
  const rating = Number((Math.random() * 1.5 + 3.5).toFixed(1));
  const joinYear = rand([2023, 2024, 2025, 2026]);
  const joinMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const joinDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`.replace(/\s+/g, '');
  const giveaway = rand(giveawayOptions);
  const emailSub = rand(emailSubOptions);
  const campaignCount = Math.random() < 0.35 ? '-' : String(Math.floor(Math.random() * 6) + 1);
  const entry = {
    customerId: `CUST${String(i).padStart(3, '0')}`,
    customerName: `${first} ${last}`,
    contact: {
      phone,
      email,
      address: `${street} No. ${number}, ${city}`,
      city
    },
    profile: {
      joinDate: `${joinYear}-${joinMonth}-${joinDay}`,
      loyalty,
      status,
      rating
    },
    engagement: {
      campaignDiikuti: campaignCount,
      giveaway,
      emailSub,
      adminNotes: rand(notes)
    }
  };
  entries.push(entry);
}

fs.writeFileSync('src/data/customers.json', JSON.stringify(entries, null, 2), 'utf8');
console.log('Wrote', entries.length, 'entries to src/data/customers.json');
