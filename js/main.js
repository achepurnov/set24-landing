const stores = [
  { id: 1, address: 'ул. Тверская, д. 15', metro: 'Тверская', walk: '3 мин пешком' },
  { id: 2, address: 'ул. Новый Арбат, д. 22', metro: 'Арбатская', walk: '5 мин пешком' },
  { id: 3, address: 'Ленинский пр-т, д. 45', metro: 'Ленинский проспект', walk: '2 мин' },
  { id: 4, address: 'ул. Профсоюзная, д. 18', metro: 'Профсоюзная', walk: '4 мин пешком' },
  { id: 5, address: 'ул. Пятницкая, д. 30', metro: 'Новокузнецкая', walk: '3 мин' },
  { id: 6, address: 'Кутузовский пр-т, д. 24', metro: 'Кутузовская', walk: '6 мин пешком' },
  { id: 7, address: 'ул. Бауманская, д. 11', metro: 'Бауманская', walk: '2 мин пешком' },
  { id: 8, address: 'Мичуринский пр-т, д. 8', metro: 'Университет', walk: '5 мин' },
  { id: 9, address: 'ул. Покровка, д. 27', metro: 'Курская', walk: '4 мин пешком' },
  { id: 10, address: 'ул. Маросейка, д. 6', metro: 'Китай-город', walk: '1 мин пешком' },
  { id: 11, address: 'ул. Большая Грузинская, д. 12', metro: 'Белорусская', walk: '3 мин' },
  { id: 12, address: 'ул. Сретенка, д. 14', metro: 'Сретенский бульвар', walk: '4 мин' },
  { id: 13, address: 'Комсомольский пр-т, д. 33', metro: 'Фрунзенская', walk: '5 мин пешком' },
  { id: 14, address: 'ул. Плющиха, д. 9', metro: 'ЖК «Дом на Плющихе»', walk: '2 мин пешком' },
  { id: 15, address: 'ул. Земляной Вал, д. 21', metro: 'Курская', walk: '3 мин пешком' },
  { id: 16, address: 'ул. Новослободская, д. 41', metro: 'Менделеевская', walk: '2 мин' },
  { id: 17, address: 'ул. Малая Бронная, д. 18', metro: 'Пушкинская', walk: '4 мин пешком' },
  { id: 18, address: 'Звенигородское ш., д. 3', metro: 'Улица 1905 года', walk: '5 мин' },
  { id: 19, address: 'ул. Шаболовка, д. 25', metro: 'Шаболовская', walk: '3 мин пешком' },
];

const storeGrid = document.getElementById('storeGrid');
const storeCount = document.getElementById('storeCount');
const storeEmpty = document.getElementById('storeEmpty');
const storeSearch = document.getElementById('storeSearch');

const locationIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
const metroIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>';
const arrowIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

function createStoreCard(store) {
  const yandexUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(store.address)}`;
  return `
    <article class="store-card reveal">
      <div class="store-card__badge">
        <span class="pulse-dot pulse-dot--sm"></span>
        24/7
      </div>
      <div class="store-card__info">
        <h3>Магазин №${store.id}</h3>
        <p>${locationIcon} ${store.address}</p>
        <p>${metroIcon} м. ${store.metro}, ${store.walk}</p>
        <a href="${yandexUrl}" target="_blank" rel="noopener" class="store-card__route" onclick="event.stopPropagation()">
          ${arrowIcon} Проложить маршрут
        </a>
      </div>
    </article>
  `;
}

function renderStores(filterText = '') {
  const filtered = stores.filter(s => {
    const q = filterText.toLowerCase();
    return s.address.toLowerCase().includes(q) || s.metro.toLowerCase().includes(q);
  });

  storeGrid.innerHTML = filtered.map(createStoreCard).join('');
  storeCount.textContent = filtered.length;
  storeEmpty.classList.toggle('stores__empty--visible', filtered.length === 0);

  requestAnimationFrame(() => observeReveal());
}

storeSearch.addEventListener('input', (e) => renderStores(e.target.value));
renderStores();

// ==================== NAV SCROLL ====================
const nav = document.querySelector('.nav');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 50;
  nav.classList.toggle('nav--scrolled', scrolled);
  scrollTop.classList.toggle('scroll-top--visible', window.scrollY > 500);
});

scrollTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.dataset.target;
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target + '+';
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

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ==================== MOBILE MENU ====================
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = document.querySelectorAll('.mobile-menu__link');

function openMenu() { mobileMenu.classList.add('mobile-menu--open'); document.body.style.overflow = 'hidden'; }
function closeMenu() { mobileMenu.classList.remove('mobile-menu--open'); document.body.style.overflow = ''; }

burger.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileMenu.addEventListener('click', (e) => { if (e.target === mobileMenu) closeMenu(); });
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  observeReveal();

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
    }
  });

  const statsSection = document.querySelector('.hero__stats');
  if (statsSection) heroObserver.observe(statsSection);
});
