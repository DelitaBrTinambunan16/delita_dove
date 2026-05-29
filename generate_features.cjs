const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const customersPath = path.join(dataDir, 'customers.json');

if (!fs.existsSync(customersPath)) {
  console.error('customers.json not found at', customersPath);
  process.exit(1);
}

const customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (arr, n) => {
  const res = [];
  const copy = [...arr];
  const k = Math.min(n, copy.length);
  for (let i = 0; i < k; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    res.push(copy.splice(idx, 1)[0]);
  }
  return res;
};

// ORDERS
const paymentMethods = ['Transfer', 'COD', 'Card', 'E-Wallet'];
const orderStatuses = ['Completed', 'Pending', 'Cancelled', 'Processing'];
const productsSample = [
  'Paket A - Basic', 'Paket B - Standard', 'Paket C - Premium',
  'Dekorasi Minimalis', 'Dekorasi Tradisional', 'Catering Silver', 'Catering Gold'
];

const orders = [];
for (let i = 1; i <= 800; i++) {
  const cust = rand(customers);
  const itemsCount = randInt(1, 4);
  const items = [];
  let total = 0;
  for (let j = 0; j < itemsCount; j++) {
    const name = rand(productsSample);
    const price = randInt(50000, 2500000);
    items.push({ name, quantity: randInt(1, 3), price });
    total += price * items[items.length - 1].quantity;
  }
  const orderDate = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toISOString().slice(0,10);
  orders.push({
    orderId: `ORD${String(i).padStart(4,'0')}`,
    customerId: cust.customerId,
    customerName: cust.customerName,
    date: orderDate,
    items,
    total,
    paymentMethod: rand(paymentMethods),
    status: rand(orderStatuses)
  });
}

// CAMPAIGNS
const campaignTypes = ['Promo', 'Giveaway', 'Discount', 'Referral', 'Seasonal'];
const campaigns = [];
for (let i = 1; i <= 800; i++) {
  const start = new Date(Date.now() - randInt(0, 365) * 24 * 3600 * 1000);
  const durationDays = randInt(3, 60);
  const end = new Date(start.getTime() + durationDays * 24 * 3600 * 1000);
  const participantCount = Math.random() < 0.5 ? randInt(0, 30) : randInt(10, 200);
  const participants = sample(customers.map(c => c.customerId), Math.min(participantCount, 200));
  campaigns.push({
    campaignId: `CMP${String(i).padStart(4,'0')}`,
    name: `${rand(campaignTypes)} Campaign ${i}`,
    type: rand(campaignTypes),
    startDate: start.toISOString().slice(0,10),
    endDate: end.toISOString().slice(0,10),
    participantsCount: participants.length,
    participants: participants.slice(0, Math.min(participants.length, 20))
  });
}

// MESSAGES
const channels = ['email', 'sms', 'wa'];
const messageBodies = [
  'Terima kasih telah menjadi pelanggan kami!',
  'Dapatkan diskon khusus minggu ini.',
  'Kami butuh konfirmasi jadwal untuk layanan Anda.',
  'Selamat! Anda memenangkan giveaway.',
  'Ada pembaruan penting tentang pesanan Anda.'
];
const messages = [];
for (let i = 1; i <= 800; i++) {
  const cust = rand(customers);
  const sentAt = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toISOString();
  messages.push({
    messageId: `MSG${String(i).padStart(4,'0')}`,
    customerId: cust.customerId,
    channel: rand(channels),
    body: rand(messageBodies),
    sentAt,
    read: Math.random() < 0.6
  });
}

// Write files
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify(orders, null, 2), 'utf8');
fs.writeFileSync(path.join(dataDir, 'campaigns.json'), JSON.stringify(campaigns, null, 2), 'utf8');
fs.writeFileSync(path.join(dataDir, 'messages.json'), JSON.stringify(messages, null, 2), 'utf8');

console.log('Wrote orders.json, campaigns.json, messages.json with 800 entries each');
