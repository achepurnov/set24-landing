// ==================== RocketData Integration ====================
// RocketData API: https://rocketdata.ru/
// Для работы нужен API-ключ (получить в личном кабинете rocketdata.ru)
// Задайте ключ здесь или в localStorage через консоль:
//   localStorage.setItem('rocketdata_key', 'ваш_ключ');
//   localStorage.setItem('rocketdata_org_id', 'ваш_org_id');

const RD_CONFIG = {
  apiKey: localStorage.getItem('rocketdata_key') || '',
  orgId: localStorage.getItem('rocketdata_org_id') || '',
  baseUrl: 'https://api.rocketdata.ru/v1',
};

let rdRealStores = null;
let rdRealReviews = null;
let rdAggregateRating = null;

async function rdFetch(endpoint) {
  if (!RD_CONFIG.apiKey) return null;
  try {
    const res = await fetch(`${RD_CONFIG.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${RD_CONFIG.apiKey}`,
        'X-Organization-Id': RD_CONFIG.orgId,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error(`RocketData API: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('RocketData fetch error:', e.message);
    return null;
  }
}

async function rdFetchLocations() {
  const data = await rdFetch('/locations');
  if (!data) return null;
  return (data.items || data.locations || data.data || []).map((loc, i) => ({
    id: i + 1,
    address: loc.address || loc.name || '',
    lat: loc.latitude || loc.lat,
    lng: loc.longitude || loc.lng || loc.lon,
    phone: loc.phone || '',
    rating: loc.rating,
    reviewsCount: loc.reviews_count || loc.reviewsCount,
    schedule: loc.schedule || loc.working_hours || '24/7',
  }));
}

async function rdFetchReviews() {
  const data = await rdFetch('/reviews');
  if (!data) return null;
  return (data.items || data.reviews || data.data || []).map(r => ({
    name: r.author || r.name || 'Клиент',
    date: r.date || r.created_at || '',
    stars: r.rating || r.stars || 5,
    text: r.text || r.content || r.body || '',
  }));
}

async function rdFetchRating() {
  const data = await rdFetch('/rating');
  if (!data) return null;
  return {
    score: data.rating || data.score || data.average || 4.9,
    count: data.reviews_count || data.count || data.total || 2534,
    platforms: data.platforms || ['Яндекс Карты', 'Google Maps', '2ГИС'],
  };
}

async function rdLoadAll() {
  if (!RD_CONFIG.apiKey) return false;
  const [stores, reviews, rating] = await Promise.all([
    rdFetchLocations(),
    rdFetchReviews(),
    rdFetchRating(),
  ]);
  if (stores) rdRealStores = stores;
  if (reviews) rdRealReviews = reviews;
  if (rating) rdAggregateRating = rating;
  return !!(stores || reviews || rating);
}

function rdGetStores() {
  if (rdRealStores && rdRealStores.length > 0) return rdRealStores;
  return null;
}

function rdGetReviews() {
  if (rdRealReviews && rdRealReviews.length > 0) return rdRealReviews;
  return null;
}

function rdGetRating() {
  return rdAggregateRating;
}

function rdIsConfigured() {
  return !!RD_CONFIG.apiKey;
}

(function rdInit() {
  if (rdIsConfigured()) {
    rdLoadAll().then(success => {
      if (success) {
        window.dispatchEvent(new CustomEvent('rocketdata:loaded'));
        console.log('RocketData: данные загружены');
      }
    });
  } else {
    console.log('RocketData: API-ключ не задан. Используются локальные данные. Задайте ключ: localStorage.setItem("rocketdata_key", "ваш_ключ")');
  }
})();
