const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const custPath = path.join(dataDir, 'customers.json');
const ordersPath = path.join(dataDir, 'orders.json');

if (!fs.existsSync(custPath)) {
  console.error('customers.json not found'); process.exit(1);
}

const customers = JSON.parse(fs.readFileSync(custPath, 'utf8'));
const orders = fs.existsSync(ordersPath) ? JSON.parse(fs.readFileSync(ordersPath, 'utf8')) : [];

const complaintSamples = [
  'Vendor terlambat datang',
  'Kualitas dekorasi tidak sesuai ekspektasi',
  'Catering kurang bumbu',
  'Koordinasi tim kurang baik',
  'Permintaan tambahan tidak ditindaklanjuti'
];
const devices = ['iOS', 'Android', 'Web', 'Unknown'];
const sources = ['Organic', 'Referral', 'Ad', 'Import', 'Event'];
const products = ['Paket A - Basic','Paket B - Standard','Paket C - Premium','Catering Gold','Dekorasi Elegan'];

const transformed = customers.map((c, idx) => {
  const phone = c.contact?.phone || c.phone || '';
  const email = c.contact?.email || c.email || '';
  const address = c.contact?.address || c.address || '';
  const city = c.contact?.city || (address.split(',').pop() || '').trim();
  const loyalty = c.profile?.loyalty || c.loyalty || 'Bronze';
  const status = c.profile?.status || c.status || 'Active';
  const joinDate = c.profile?.joinDate || c.joinDate || new Date().toISOString().slice(0,10);
  const rating = typeof c.profile?.rating === 'number' ? c.profile.rating : (c.rating || Number((Math.random()*1.5+3.5).toFixed(1)));
  const adminNotes = c.engagement?.adminNotes || c.adminNotes || '';
  const campaignDiikuti = c.engagement?.campaignDiikuti || c.campaignDiikuti || '-';
  const giveaway = c.engagement?.giveaway || c.giveaway || 'Tidak';
  const emailSub = c.engagement?.emailSub || c.emailSub || 'Tidak';

  const complaints = [];
  if (Math.random() < 0.25) {
    const n = Math.floor(Math.random()*3)+1;
    for (let i=0;i<n;i++) complaints.push({ issue: complaintSamples[Math.floor(Math.random()*complaintSamples.length)], date: new Date(Date.now()-Math.floor(Math.random()*200)*24*3600*1000).toISOString().slice(0,10), resolved: Math.random() < 0.6 });
  }

  const username = (c.customerName || 'user').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8) + String(idx+1).padStart(3,'0');
  const lastLogin = new Date(Date.now()-Math.floor(Math.random()*90)*24*3600*1000).toISOString();

  const totalTransaksi = Math.floor(Math.random()*6)+1;
  const totalNilai = Math.floor((Math.random()*9+1)*1000000);
  const lastProduct = products[Math.floor(Math.random()*products.length)];
  const paymentMethod = ['Transfer','COD','Card','E-Wallet'][Math.floor(Math.random()*4)];
  const lastTransactionDate = new Date(Date.now()-Math.floor(Math.random()*400)*24*3600*1000).toISOString().slice(0,10);

  return {
    ...c,
    // Flattened commonly-used fields for components
    phone,
    email,
    address,
    city,
    loyalty,
    status,
    joinDate,
    rating,
    adminNotes,
    campaignDiikuti,
    giveaway,
    emailSub,
    username,
    lastLogin,
    device: devices[Math.floor(Math.random()*devices.length)],
    source: sources[Math.floor(Math.random()*sources.length)],
    totalTransaksi,
    totalNilai,
    produkTerakhir: lastProduct,
    metodePembayaran: paymentMethod,
    tglTransaksiTerakhir: lastTransactionDate,
    complaints
  };
});

fs.writeFileSync(custPath, JSON.stringify(transformed, null, 2), 'utf8');
console.log('Transformed customers.json with flattened fields');

// Transform orders: ensure fields totalPrice and orderDate exist and customerName present
if (orders.length > 0) {
  const custMap = new Map(transformed.map(c => [c.customerId, c]));
  const newOrders = orders.map((o, idx) => {
    const customer = custMap.get(o.customerId) || {};
    return {
      ...o,
      totalPrice: o.totalPrice || o.total || o.totalAmount || o.total || Math.floor(Math.random()*5000000)+250000,
      orderDate: o.orderDate || o.date || (new Date(Date.now()-Math.floor(Math.random()*800)*24*3600*1000).toISOString().slice(0,10)),
      customerName: o.customerName || customer.customerName || `Customer ${idx+1}`
    };
  });
  fs.writeFileSync(ordersPath, JSON.stringify(newOrders, null, 2), 'utf8');
  console.log('Transformed orders.json to include totalPrice and orderDate');
} else {
  console.log('No orders.json found or empty, skipping orders transform');
}
