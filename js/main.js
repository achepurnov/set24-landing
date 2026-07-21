// ==================== STORE DATA ====================
const stores = [
  { id: 1, address: 'ул. Бударина, 3е' },
  { id: 2, address: 'ул. Конева, 8' },
  { id: 3, address: 'Волочаевская ул., 19 к4' },
  { id: 4, address: 'ул. Красный Путь, 143 к5' },
  { id: 5, address: 'ул. Красный Путь, 101 к1' },
  { id: 6, address: 'Взлётная ул., 13' },
  { id: 7, address: 'ул. Димитрова, 69' },
  { id: 8, address: 'ЖК Волна, Архитекторов б-р, 1в' },
  { id: 9, address: 'Архитекторов б-р, 13' },
  { id: 10, address: 'ЖК Садовый, ул. Ватутина, 25а' },
  { id: 11, address: 'б-р Кузьмина, 27' },
  { id: 12, address: 'ул. Перелёта, 18' },
  { id: 13, address: 'ЖК Уютный, ул. Игоря Мишина, 4' },
  { id: 14, address: 'ул. Молодова, 6/1' },
  { id: 15, address: '6-й Амурский проезд, 14' },
  { id: 16, address: '2-я Поселковая ул., 24' },
  { id: 17, address: 'ул. Завертяева, 23 к8' },
  { id: 18, address: 'ул. Бархатовой, 2а' },
  { id: 19, address: 'Пригородная ул., 23' },
];

// ==================== REVIEW DATA ====================
const reviews = [
  { name: 'Анна М.', date: '2 дня назад', stars: 5, text: 'Спасают в любое время! Захотелось мороженого в 2 часа ночи — зашла и купила. Магазин на Бударина чистый, всё свежее. Очень удобно!' },
  { name: 'Дмитрий К.', date: 'неделю назад', stars: 5, text: 'Живу на Левобережье, магазин на Конева в двух шагах. Очень удобно, когда срочно нужно что-то купить, а все супермаркеты уже закрыты. Цены радуют.' },
  { name: 'Елена В.', date: '2 недели назад', stars: 5, text: 'Выпечка просто бомба! Круассаны утром — свежайшие. Приятно, что есть скидка 20% ночью. Часто забегаю после работы на Красный Путь.' },
  { name: 'Сергей П.', date: '3 недели назад', stars: 4, text: 'Хороший ассортимент для магазина у дома. Есть всё самое нужное. Иногда не хватает некоторых позиций, но в целом — отлично. Удобно что 24/7.' },
  { name: 'Мария Т.', date: 'месяц назад', stars: 5, text: 'Пользуюсь картой лояльности уже полгода. Кэшбек реально работает! И кофе бесплатный каждый 3-й — приятный бонус. Советую всем омичам!' },
  { name: 'Алексей Р.', date: 'месяц назад', stars: 5, text: 'Дешевле, чем заказывать доставку. Посчитал — в месяц экономлю около 5-7 тысяч. Не надо ждать курьера по 40 минут. Вышел и купил.' },
];

// ==================== RENDER STORES ====================
const storeGrid = document.getElementById('storeGrid');
const storeCount = document.getElementById('storeCount');
const storeEmpty = document.getElementById('storeEmpty');
const storeSearch = document.getElementById('storeSearch');

const locationIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

function createStoreCard(store) {
  const mapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(store.address + ', Омск')}`;
  const gisUrl = `https://2gis.ru/omsk/search/${encodeURIComponent(store.address)}`;
  return `
    <article class="store-card reveal">
      <div class="store-card__badge">
        <span class="pulse-dot pulse-dot--sm"></span>
        24/7
      </div>
      <div class="store-card__info">
        <h3>Магазин №${store.id}</h3>
        <p>${locationIcon} ${store.address}</p>
        <div class="store-card__routes">
          <a href="${mapsUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Яндекс Карты</a>
          <a href="${gisUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">2ГИС</a>
        </div>
      </div>
    </article>
  `;
}

function renderStores(filterText = '') {
  const filtered = stores.filter(s => {
    const q = filterText.toLowerCase();
    return s.address.toLowerCase().includes(q);
  });
  storeGrid.innerHTML = filtered.map(createStoreCard).join('');
  storeCount.textContent = filtered.length;
  storeEmpty.classList.toggle('stores__empty--visible', filtered.length === 0);
  requestAnimationFrame(() => observeReveal());
}

if (storeSearch) storeSearch.addEventListener('input', (e) => renderStores(e.target.value));
renderStores();

// ==================== RENDER REVIEWS ====================
const reviewsGrid = document.getElementById('reviewsGrid');
if (reviewsGrid) {
  reviewsGrid.innerHTML = reviews.map(r => `
    <div class="review-card reveal">
      <div class="review-card__header">
        <div class="review-card__avatar">${r.name[0]}</div>
        <div>
          <div class="review-card__name">${r.name}</div>
          <div class="review-card__date">${r.date}</div>
        </div>
      </div>
      <div class="review-card__stars">${'★'.repeat(r.stars)}${r.stars < 5 ? '☆'.repeat(5 - r.stars) : ''}</div>
      <p class="review-card__text">${r.text}</p>
    </div>
  `).join('');
}

// ==================== NAV SCROLL ====================
const nav = document.getElementById('nav');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 50;
  nav.classList.toggle('nav--scrolled', scrolled);
  scrollTop.classList.toggle('scroll-top--visible', window.scrollY > 600);
});

scrollTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    if (counter.dataset.animated) return;
    counter.dataset.animated = 'true';
    const target = +counter.dataset.target;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(target * eased);
      counter.textContent = val >= 1000 ? Math.floor(val / 100) * 100 + '+' : val + '+';
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target >= 1000 ? Math.floor(target / 100) * 100 + '+' : target + '+';
    }
    requestAnimationFrame(update);
  });
}

// ==================== SCROLL REVEAL ====================
function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('reveal--visible')) observer.observe(el);
  });
}

// ==================== MOBILE MENU ====================
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu .btn');

function openMenu() { mobileMenu.classList.add('mobile-menu--open'); document.body.style.overflow = 'hidden'; }
function closeMenu() { mobileMenu.classList.remove('mobile-menu--open'); document.body.style.overflow = ''; }

burger.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileMenu.addEventListener('click', (e) => { if (e.target === mobileMenu) closeMenu(); });
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// ==================== FAQ ACCORDION ====================
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq__question').forEach(b => b.setAttribute('aria-expanded', 'false'));
    btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
});

// ==================== CALCULATOR ====================
const calcRange = document.getElementById('calcRange');
const calcValue = document.getElementById('calcValue');
const calcDelivery = document.getElementById('calcDelivery');
const calcStore = document.getElementById('calcStore');
const calcSavings = document.getElementById('calcSavings');

function updateCalculator(val) {
  const amount = +val;
  const deliveryMarkup = Math.round(amount * 1.5);
  const savings = deliveryMarkup - amount;
  calcValue.textContent = amount.toLocaleString('ru-RU');
  calcDelivery.textContent = deliveryMarkup.toLocaleString('ru-RU') + ' ₽';
  calcStore.textContent = amount.toLocaleString('ru-RU') + ' ₽';
  calcSavings.textContent = savings.toLocaleString('ru-RU') + ' ₽';
}

if (calcRange) {
  calcRange.addEventListener('input', (e) => updateCalculator(e.target.value));
  updateCalculator(calcRange.value);
}

// ==================== LIVE COUNTER ====================
const liveCounter = document.getElementById('liveCounter');
if (liveCounter) {
  setInterval(() => {
    const base = new Date().getHours() < 6 ? 60 : 120;
    liveCounter.textContent = Math.floor(base + Math.random() * 40);
  }, 5000);
}

// ==================== PROMO TIMER ====================
const promoTimer = document.getElementById('promoTimer');
if (promoTimer) {
  function updatePromoTimer() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = end - now;
    if (diff <= 0) {
      promoTimer.textContent = 'завтра';
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    promoTimer.textContent = `ещё ${h} ч ${m} мин`;
  }
  updatePromoTimer();
  setInterval(updatePromoTimer, 60000);
}

// ==================== LOYALTY MODAL ====================
const loyaltyBtn = document.getElementById('loyaltyBtn');
const loyaltyModal = document.getElementById('loyaltyModal');
const loyaltyModalClose = document.getElementById('loyaltyModalClose');
const loyaltyModalAction = document.getElementById('loyaltyModalAction');

if (loyaltyBtn && loyaltyModal) {
  loyaltyBtn.addEventListener('click', () => loyaltyModal.classList.add('modal--open'));
  loyaltyModalClose.addEventListener('click', () => loyaltyModal.classList.remove('modal--open'));
  loyaltyModalAction.addEventListener('click', () => loyaltyModal.classList.remove('modal--open'));
  loyaltyModal.addEventListener('click', (e) => { if (e.target === loyaltyModal) loyaltyModal.classList.remove('modal--open'); });
}

// ==================== REQUEST FORM ====================
const requestForm = document.getElementById('requestForm');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('toast--visible');
  setTimeout(() => toast.classList.remove('toast--visible'), 3000);
}

if (requestForm) {
  requestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Спасибо! Ваша заявка принята. Мы учтём ваш район при расширении.');
    requestForm.reset();
  });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  observeReveal();
  animateCounters();

  const trustBar = document.querySelector('.trust-bar');
  if (trustBar) {
    const trustObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { animateCounters(); trustObserver.disconnect(); }
    }, { threshold: 0.3 });
    trustObserver.observe(trustBar);
  }
});
