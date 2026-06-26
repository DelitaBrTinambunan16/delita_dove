// Helper untuk mengelola data guest: orders, rating, campaign, giveaway, membership tier
// Disimpan di localStorage agar persist antar session

const ORDERS_KEY = "guestOrders";
const RATINGS_KEY = "guestRatings";
const CAMPAIGN_KEY = "guestCampaigns";
const GIVEAWAY_KEY = "guestGiveaways";

/* ---------- util baca/tulis aman ---------- */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(e);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}

/* ---------- ORDERS ---------- */
export function getGuestOrders(email) {
  if (!email) return [];
  const all = readJSON(ORDERS_KEY, {});
  return all[email] || [];
}

export function addGuestOrder(email, order) {
  if (!email) return [];
  const all = readJSON(ORDERS_KEY, {});
  if (!all[email]) all[email] = [];
  const newOrder = {
    id: `GORD-${Date.now()}`,
    ...order,
    orderDate: order.orderDate || new Date().toISOString().split("T")[0],
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  all[email].unshift(newOrder);
  writeJSON(ORDERS_KEY, all);
  return all[email];
}

/* ---------- MEMBERSHIP TIER ---------- */
// Tier dihitung dari jumlah pesanan yang pernah dibuat member
export function computeMembershipTier(orderCount) {
  if (orderCount >= 10) return "Platinum";
  if (orderCount >= 6) return "Gold";
  if (orderCount >= 3) return "Silver";
  return "Bronze";
}

export function getMembershipTier(email) {
  const orders = getGuestOrders(email);
  return computeMembershipTier(orders.length);
}

/* ---------- RATING ---------- */
export function getGuestRatings(email) {
  if (!email) return [];
  const all = readJSON(RATINGS_KEY, {});
  return all[email] || [];
}

export function addGuestRating(email, rating) {
  if (!email) return [];
  const all = readJSON(RATINGS_KEY, {});
  if (!all[email]) all[email] = [];
  all[email].unshift({ ...rating, id: Date.now(), date: new Date().toISOString().split("T")[0] });
  writeJSON(RATINGS_KEY, all);
  return all[email];
}

// Rata-rata rating yang diberikan member (dipakai sebagai rating profil)
export function getAverageRating(email) {
  const ratings = getGuestRatings(email);
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((acc, r) => acc + Number(r.stars || 0), 0);
  return Number((sum / ratings.length).toFixed(1));
}

/* ---------- CAMPAIGN ---------- */
export function getJoinedCampaign(email) {
  if (!email) return null;
  const all = readJSON(CAMPAIGN_KEY, {});
  return all[email] || null;
}

export function joinCampaign(email, campaignCode) {
  if (!email) return null;
  const all = readJSON(CAMPAIGN_KEY, {});
  all[email] = campaignCode;
  writeJSON(CAMPAIGN_KEY, all);
  return campaignCode;
}

export function leaveCampaign(email) {
  if (!email) return null;
  const all = readJSON(CAMPAIGN_KEY, {});
  delete all[email];
  writeJSON(CAMPAIGN_KEY, all);
  return null;
}

/* ---------- GIVEAWAY ---------- */
export function getGiveawayStatus(email) {
  if (!email) return "Tidak";
  const all = readJSON(GIVEAWAY_KEY, {});
  return all[email] ? "Ya" : "Tidak";
}

export function toggleGiveaway(email) {
  if (!email) return "Tidak";
  const all = readJSON(GIVEAWAY_KEY, {});
  const current = Boolean(all[email]);
  if (current) {
    delete all[email];
  } else {
    all[email] = true;
  }
  writeJSON(GIVEAWAY_KEY, all);
  return current ? "Tidak" : "Ya";
}

/* ---------- DAFTAR CAMPAIGN YANG TERSEDIA ---------- */
export const availableCampaigns = [
  { code: "1", name: "Diskon 20% Paket Dekorasi" },
  { code: "2", name: "Bonus Undangan Digital" },
  { code: "3", name: "Free Gift Card" },
  { code: "4", name: "VIP Tamu Eksklusif" },
  { code: "5", name: "Paket Honeymoon Spesial" },
  { code: "6", name: "Cashback 1 Juta" },
];

export function getCampaignName(code) {
  if (!code || code === "-") return "-";
  const found = availableCampaigns.find((c) => c.code === String(code));
  return found ? found.name : `Promo #${code}`;
}
