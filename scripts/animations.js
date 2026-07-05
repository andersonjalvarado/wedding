/* ============================================================
   ANIMATIONS.JS — Intersection Observer, Splitting.js, Embla Carousel
   Se inicializa después de que main.js renderiza el DOM.
   ============================================================ */

/* ---------- Intersection Observer para reveals ---------- */

function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    document.querySelectorAll('.reveal, .reveal-corner').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* Adornos de esquina: toggle en entrada/salida para efecto de aparecer/desaparecer al scrollear.
     Umbral 0 y rootMargin generoso para que aparezcan también en pantallas móviles. */
  const cornerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, {
    threshold: 0,
    rootMargin: '50px 0px 50px 0px',
  });

  const corners = document.querySelectorAll('.reveal-corner');
  corners.forEach(el => cornerObserver.observe(el));

  /* Fallback: si alguno queda oculto tras la primera pasada (móvil con transiciones lentas
     o carga tardía de imágenes), lo hacemos visible cuando la imagen termine de cargar
     y ya esté dentro del viewport. */
  corners.forEach(img => {
    const reveal = () => {
      const rect = img.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) img.classList.add('is-visible');
    };
    if (img.complete) reveal();
    else img.addEventListener('load', reveal, { once: true });
  });
}

/* ---------- Splitting.js para el título hero ---------- */

function initSplitting() {
  if (typeof Splitting === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-splitting]');

  if (!targets.length) return;

  Splitting({ targets });

  if (prefersReduced) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  setTimeout(() => {
    targets.forEach(el => el.classList.add('is-visible'));
  }, 300);
}

/* ---------- Embla Carousel ---------- */

async function initCarousel() {
  const root = document.getElementById('gallery-embla');
  if (!root) return;

  let EmblaCarousel;
  let EmblaAutoplay;

  try {
    const mod = await import('https://unpkg.com/embla-carousel@8.6.0/esm/embla-carousel.esm.js');
    EmblaCarousel = mod.default;
  } catch {
    console.warn('Embla Carousel no se pudo cargar. La galería funciona sin carousel.');
    return;
  }

  try {
    const autoMod = await import('https://unpkg.com/embla-carousel-autoplay@8.6.0/esm/embla-carousel-autoplay.esm.js');
    EmblaAutoplay = autoMod.default;
  } catch {
    EmblaAutoplay = null;
  }

  const plugins = EmblaAutoplay
    ? [EmblaAutoplay({ delay: 3500, stopOnInteraction: true })]
    : [];

  const embla = EmblaCarousel(root, {
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    dragFree: false,
  }, plugins);

  const prevBtn  = document.getElementById('gallery-prev');
  const nextBtn  = document.getElementById('gallery-next');
  const dots     = document.querySelectorAll('.gallery-dot');

  if (prevBtn) prevBtn.addEventListener('click', () => embla.scrollPrev());
  if (nextBtn) nextBtn.addEventListener('click', () => embla.scrollNext());

  function updateDots() {
    const i = embla.selectedScrollSnap();
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-selected', idx === i);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => embla.scrollTo(i));
  });

  embla.on('select', updateDots);
  updateDots();
}

/* ---------- Nav progress indicator (opcional) ---------- */

function initScrollProgress() {
  const indicator = document.getElementById('scroll-progress');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    const total   = document.documentElement.scrollHeight - window.innerHeight;
    const current = window.scrollY;
    indicator.style.transform = `scaleX(${current / total})`;
  }, { passive: true });
}

/* ---------- Init ---------- */
// Los módulos se ejecutan en orden de documento: main.js (que renderiza todo)
// va antes que animations.js en el HTML, así que para cuando este módulo
// corre, el DOM ya está poblado. Llamamos init() directamente.

function init() {
  initSplitting();
  initReveal();
  initCarousel();
  initScrollProgress();
}

init();
