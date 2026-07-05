/* ============================================================
   MAIN.JS — render dinámico de todas las secciones desde data.js
   ============================================================ */

import { WEDDING } from './data.js';

const INVITE_TYPE = window.INVITE_TYPE || 'completa';
const ASSET_BASE  = window.ASSET_BASE  || '';

const asset = (path) => `${ASSET_BASE}${path}`;

/* ---------- Envelope (entrada con sobre sellado) ---------- */

function initEnvelope() {
  const overlay = document.getElementById('envelope-overlay');
  if (!overlay) return;

  const skipEnvelope = new URLSearchParams(location.search).get('noenv') === '1';
  const alreadyOpened = sessionStorage.getItem('envelope-opened') === '1';
  if (alreadyOpened || skipEnvelope) {
    overlay.remove();
    return;
  }

  document.body.classList.add('is-envelope-locked');

  const open = () => {
    if (overlay.classList.contains('is-opening')) return;
    overlay.classList.add('is-opening');
    setTimeout(() => {
      overlay.classList.add('is-open');
      setTimeout(() => {
        overlay.remove();
        document.body.classList.remove('is-envelope-locked');
        sessionStorage.setItem('envelope-opened', '1');
      }, 500);
    }, 750);
  };

  overlay.addEventListener('click', open);
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
}

/* ---------- Corner ornaments helper ---------- */

function cornerOrnaments(pattern) {
  if (pattern === 'none' || !pattern) return '';

  const tl = `<img class="corner-ornament corner-ornament--tl reveal-corner" src="${asset('assets/images/superior_izquierda.png')}" alt="" aria-hidden="true" loading="lazy">`;
  const tr = `<img class="corner-ornament corner-ornament--tr reveal-corner" src="${asset('assets/images/superior_derecha.png')}" alt="" aria-hidden="true" loading="lazy">`;
  const bl = `<img class="corner-ornament corner-ornament--bl reveal-corner" src="${asset('assets/images/inferior_izquierda.png')}" alt="" aria-hidden="true" loading="lazy">`;
  const br = `<img class="corner-ornament corner-ornament--br reveal-corner" src="${asset('assets/images/inferior_derecha.png')}" alt="" aria-hidden="true" loading="lazy">`;

  switch (pattern) {
    case 'diag1': return tl + br;
    case 'diag2': return tr + bl;
    case 'all':   return tl + tr + bl + br;
    default:      return '';
  }
}

/* ---------- Navbar ---------- */

function renderNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const linksExtra = INVITE_TYPE === 'completa'
    ? `<a href="#recepcion" class="nav__link">Recepción</a>`
    : '';

  nav.innerHTML = `
    <div class="nav__inner">
      <a href="#hero" class="nav__logo" aria-label="Inicio">${WEDDING.couple.shortNames}</a>
      <nav class="nav__links" aria-label="Navegación principal">
        <a href="#historia" class="nav__link">Nuestra historia</a>
        <a href="#ceremonia" class="nav__link">Ceremonia</a>
        ${linksExtra}
        <a href="#galeria" class="nav__link">Galería</a>
        <a href="#rsvp" class="nav__link">RSVP</a>
      </nav>
    </div>
  `;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ---------- Hero ---------- */

function renderHero() {
  const el = document.getElementById('hero');
  if (!el) return;

  const firstName1 = (WEDDING.couple.name1 || '').split(' ')[0];
  const firstName2 = (WEDDING.couple.name2 || '').split(' ')[0];

  el.innerHTML = `
    <img class="hero__bg" src="${asset('assets/images/principal_2.png')}" alt="${WEDDING.couple.fullNames}" loading="eager">
    <div class="hero__vignette" aria-hidden="true"></div>
    <div class="hero__content">
      <h1 class="hero__names reveal">
        <span class="hero__name">${firstName1}</span>
        <span class="hero__ampersand" aria-hidden="true">&amp;</span>
        <span class="hero__name">${firstName2}</span>
      </h1>
    </div>
  `;
}

/* ---------- Save the date (fecha + contador + calendario) ---------- */

function renderSaveDate() {
  const el = document.getElementById('save-date');
  if (!el) return;

  const { date } = WEDDING;

  el.innerHTML = `
    ${cornerOrnaments('diag2')}
    <div class="container--narrow">
      <div class="section-header">
        <span class="section-label reveal">Reserva Esta Fecha</span>
        <h2 class="section-title reveal delay-1">${date.dayName} · ${date.display}</h2>
      </div>

      <div class="countdown reveal delay-2" id="countdown" aria-label="Cuenta regresiva para la boda">
        <div class="countdown__item">
          <span class="countdown__num" id="cd-days">—</span>
          <span class="countdown__label">días</span>
        </div>
        <span class="countdown__sep" aria-hidden="true">·</span>
        <div class="countdown__item">
          <span class="countdown__num" id="cd-hours">—</span>
          <span class="countdown__label">horas</span>
        </div>
        <span class="countdown__sep" aria-hidden="true">·</span>
        <div class="countdown__item">
          <span class="countdown__num" id="cd-mins">—</span>
          <span class="countdown__label">min</span>
        </div>
        <span class="countdown__sep" aria-hidden="true">·</span>
        <div class="countdown__item">
          <span class="countdown__num" id="cd-secs">—</span>
          <span class="countdown__label">seg</span>
        </div>
      </div>

      <div class="calendar reveal delay-3" aria-label="Agosto 2026">
        <p class="calendar__header">Agosto 2026</p>
        <div class="calendar__grid" role="grid">
          <span class="calendar__wd">L</span>
          <span class="calendar__wd">M</span>
          <span class="calendar__wd">X</span>
          <span class="calendar__wd">J</span>
          <span class="calendar__wd">V</span>
          <span class="calendar__wd">S</span>
          <span class="calendar__wd">D</span>
          ${generateAugust2026Days()}
        </div>
      </div>
    </div>
  `;
}

function generateAugust2026Days() {
  // Aug 1, 2026 = Saturday. Week starts on Monday.
  // Empty cells before Aug 1: Mon-Fri (5 cells).
  const cells = [];
  for (let i = 0; i < 5; i++) cells.push('<span class="calendar__day is-empty" aria-hidden="true"></span>');

  for (let day = 1; day <= 31; day++) {
    if (day === 15) {
      cells.push(`<span class="calendar__day calendar__day--wedding" aria-label="15 de agosto, día de la boda">
        <svg class="calendar__heart" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-7-4.5-9.5-9.5C.5 7.5 3.5 3 8 3c2 0 3.5 1 4 2.5C12.5 4 14 3 16 3c4.5 0 7.5 4.5 5.5 8.5C19 16.5 12 21 12 21z" fill="currentColor"/>
        </svg>
        <span class="calendar__day-num">15</span>
      </span>`);
    } else {
      cells.push(`<span class="calendar__day">${day}</span>`);
    }
  }

  return cells.join('');
}

/* ---------- Countdown ---------- */

function initCountdown() {
  const target = new Date(WEDDING.date.iso).getTime();
  const ids = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };

  if (!ids.days) return;

  function tick() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      Object.values(ids).forEach(el => { if (el) el.textContent = '0'; });
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    const fmt = n => String(n).padStart(2, '0');
    if (ids.days)  ids.days.textContent  = days;
    if (ids.hours) ids.hours.textContent = fmt(hours);
    if (ids.mins)  ids.mins.textContent  = fmt(mins);
    if (ids.secs)  ids.secs.textContent  = fmt(secs);
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------- Intro / Bienvenida ---------- */

function renderIntro() {
  const el = document.getElementById('intro');
  if (!el) return;

  el.innerHTML = `
    ${cornerOrnaments('diag1')}
    <div class="container--narrow">
      <div class="section-header">
        <span class="intro-section__cross reveal" aria-hidden="true">✝</span>
        <p class="welcome-text reveal delay-1">${WEDDING.welcome}</p>
      </div>
    </div>
  `;
}

/* ---------- Historia — tarjetas apiladas con foto ---------- */

function renderHistory() {
  const el = document.getElementById('historia');
  if (!el) return;

  const backgrounds = [
    asset('assets/images/primera_vez.jpeg'),
    asset('assets/images/viaje.png'),
    asset('assets/images/dijo_si.jpeg'),
  ];

  const items = WEDDING.story.map((item, i) => `
    <article class="story-card reveal" style="background-image:url('${backgrounds[i] || backgrounds[0]}')">
      <div class="story-card__overlay" aria-hidden="true"></div>
      <div class="story-card__content">
        <span class="story-card__icon" aria-hidden="true">
          <i data-lucide="${item.icon || 'heart'}" width="18" height="18"></i>
        </span>
        <span class="story-card__year">${item.year}</span>
        <h3 class="story-card__title">${item.title}</h3>
        <p class="story-card__text">${item.text}</p>
      </div>
    </article>
  `).join('');

  el.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="section-label reveal">Nuestra historia</span>
        <h2 class="section-title reveal delay-1">El camino que nos trajo aquí</h2>
      </div>
      <div class="story-stack">${items}</div>
    </div>
  `;
}

/* ---------- Ceremonia ---------- */

function renderCeremony() {
  const el = document.getElementById('ceremonia');
  if (!el) return;

  const { date, ceremony } = WEDDING;

  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(ceremony.address)}&z=16&output=embed`;
  const mapContent = `<iframe
        src="${embedSrc}"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        title="Ubicación de la ceremonia"
      ></iframe>`;

  el.innerHTML = `
    ${cornerOrnaments('diag1')}
    <div class="container">
      <div class="section-header">
        <span class="section-label reveal">El gran día</span>
        <h2 class="section-title reveal delay-1">Ceremonia</h2>
      </div>

      <div class="ceremony-grid">
        <div class="ceremony-card reveal delay-1">
          <div class="ceremony-card__icon">
            <i data-lucide="calendar-heart" width="20" height="20"></i>
          </div>
          <span class="ceremony-card__label">Fecha</span>
          <div class="ceremony-card__value">${date.dayName}</div>
          <div class="ceremony-card__sub">${date.display}</div>
        </div>
        <div class="ceremony-card reveal delay-2">
          <div class="ceremony-card__icon">
            <i data-lucide="clock" width="20" height="20"></i>
          </div>
          <span class="ceremony-card__label">Hora</span>
          <div class="ceremony-card__value">${date.time}</div>
          <div class="ceremony-card__sub">Puertas abren: ${subtractMinutes(date.time, 20)}</div>
        </div>
        <div class="ceremony-card reveal delay-3">
          <div class="ceremony-card__icon">
            <i data-lucide="map-pin" width="20" height="20"></i>
          </div>
          <span class="ceremony-card__label">Lugar</span>
          <div class="ceremony-card__value">${ceremony.name}</div>
          <div class="ceremony-card__sub">${ceremony.address}</div>
        </div>
        <div class="ceremony-card reveal delay-4">
          <div class="ceremony-card__icon">
            <i data-lucide="shirt" width="20" height="20"></i>
          </div>
          <span class="ceremony-card__label">Dress code</span>
          <div class="ceremony-card__value">${ceremony.dresscode}</div>
          <div class="ceremony-card__sub">${ceremony.dressNote}</div>
        </div>
      </div>

      ${ceremony.note ? `
        <div class="ceremony-note reveal">
          <span class="ceremony-note__icon">
            <i data-lucide="info" width="18" height="18"></i>
          </span>
          <div>
            <p class="ceremony-note__text">${ceremony.note}</p>
            ${ceremony.note2 ? `<p class="ceremony-note__text" style="margin-top:0.5em">${ceremony.note2}</p>` : ''}
          </div>
        </div>
      ` : ''}

      <div class="location-block reveal">
        <h3 class="location-block__name">${ceremony.name}</h3>
        <p class="location-block__address">${ceremony.address}</p>
        <div class="location-block__map">
          ${mapContent}
        </div>
        <a
          href="${ceremony.mapsUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn--outline"
        >
          <i data-lucide="navigation" width="16" height="16"></i>
          Abrir en Google Maps
        </a>
      </div>
    </div>
  `;
}

/* ---------- Recepción ---------- */

function renderReception() {
  const el = document.getElementById('recepcion');
  if (!el) return;

  const { reception } = WEDDING;
  if (!reception) return;

  el.innerHTML = `
    ${cornerOrnaments('diag2')}
    <div class="container">
      <div class="section-header">
        <span class="section-label reveal">Después de la ceremonia</span>
        <h2 class="section-title reveal delay-1">Recepción</h2>
        <p class="section-subtitle reveal delay-2">Celebremos juntos el inicio de nuestra nueva vida.</p>
      </div>

      <div class="ceremony-grid">
        <div class="ceremony-card reveal delay-1">
          <div class="ceremony-card__icon">
            <i data-lucide="clock" width="20" height="20"></i>
          </div>
          <span class="ceremony-card__label">Hora</span>
          <div class="ceremony-card__value">${reception.time}</div>
          <div class="ceremony-card__sub">Te esperamos</div>
        </div>
        <div class="ceremony-card reveal delay-2">
          <div class="ceremony-card__icon">
            <i data-lucide="map-pin" width="20" height="20"></i>
          </div>
          <span class="ceremony-card__label">Lugar</span>
          <div class="ceremony-card__value">${reception.name}</div>
          <div class="ceremony-card__sub">${reception.address}</div>
        </div>
        <div class="ceremony-card reveal delay-3">
          <div class="ceremony-card__icon">
            <i data-lucide="glass-water" width="20" height="20"></i>
          </div>
          <span class="ceremony-card__label">Ambiente</span>
          <div class="ceremony-card__value">Brindis y cena</div>
          <div class="ceremony-card__sub">Reunión</div>
        </div>
      </div>

      <div class="location-block reveal">
        <h3 class="location-block__name">${reception.name}</h3>
        <p class="location-block__address">${reception.address}</p>
        <a
          href="${reception.mapsUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn--outline"
        >
          <i data-lucide="navigation" width="16" height="16"></i>
          Abrir en Google Maps
        </a>
      </div>
    </div>
  `;
}

/* ---------- Lluvia de sobres ---------- */

function renderShower() {
  const el = document.getElementById('lluvia-sobres');
  if (!el) return;

  el.innerHTML = `
    <div class="shower-block reveal">
      <span class="shower-block__icon" aria-hidden="true">
        <i data-lucide="mail" width="22" height="22"></i>
      </span>
      <h3 class="shower-block__title">Lluvia de sobres</h3>
      <p class="shower-block__text">
        Su presencia es, sin duda, el regalo más grande que podríamos recibir.
        Si además desean acompañarnos con un pequeño detalle para iniciar juntos esta nueva etapa,
        hemos preparado una <em>lluvia de sobres</em> a la entrada de la recepción.
        Cualquier gesto será atesorado con inmenso cariño.
      </p>
    </div>
  `;
}

/* ---------- Galería ---------- */

function renderGallery() {
  const el = document.getElementById('galeria');
  if (!el) return;

  const slides = WEDDING.images.gallery.map((src, i) => `
    <div class="embla__slide">
      <img
        src="${asset(src)}"
        alt="Foto ${i + 1} de la galería"
        loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      >
      <div class="img-placeholder" style="display:none;">
        <i data-lucide="image" width="32" height="32" style="opacity:0.35"></i>
        <p>Foto ${i + 1}</p>
      </div>
    </div>
  `).join('');

  const dots = WEDDING.images.gallery.map((_, i) =>
    `<button class="gallery-dot${i === 0 ? ' is-selected' : ''}" aria-label="Ir a foto ${i + 1}" data-index="${i}"></button>`
  ).join('');

  el.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="section-label reveal">Momentos</span>
        <h2 class="section-title reveal delay-1">Nuestra galería</h2>
      </div>
      <div class="embla reveal" id="gallery-embla">
        <div class="embla__container">${slides}</div>
      </div>
      <div class="gallery-controls">
        <button class="gallery-btn" id="gallery-prev" aria-label="Foto anterior">
          <i data-lucide="chevron-left" width="20" height="20"></i>
        </button>
        <div class="gallery-dots" role="tablist" aria-label="Fotos de galería">${dots}</div>
        <button class="gallery-btn" id="gallery-next" aria-label="Siguiente foto">
          <i data-lucide="chevron-right" width="20" height="20"></i>
        </button>
      </div>
    </div>
  `;
}

/* ---------- RSVP ---------- */

function renderRSVP() {
  const el = document.getElementById('rsvp');
  if (!el) return;

  const optionsExtra = INVITE_TYPE === 'completa'
    ? `<label class="form-radio-label">
        <input type="radio" name="attendance" value="Iré con acompañante">
        <i data-lucide="users" width="14" height="14"></i>
        Iré con acompañante
      </label>`
    : '';

  el.innerHTML = `
    ${cornerOrnaments('diag1')}
    <div class="container">
      <div class="section-header">
        <span class="section-label reveal">Confirmación</span>
        <h2 class="section-title reveal delay-1">¿Nos acompañas?</h2>
        <p class="section-subtitle reveal delay-2">
          Tu presencia es el regalo más especial que podemos recibir.
        </p>
      </div>

      <div class="rsvp-wrapper">
        <div class="rsvp-deadline reveal">
          <i data-lucide="calendar-clock" width="18" height="18" style="color:var(--color-primary);flex-shrink:0"></i>
          <p>Confirma antes del <strong>${WEDDING.rsvp.deadline}</strong></p>
        </div>

        <div id="rsvp-success" class="form-message form-message--success">
          <i data-lucide="check-circle-2" width="40" height="40" class="form-message__icon" style="color:#16a34a"></i>
          <h3 class="form-message__title">¡Gracias por confirmar!</h3>
          <p>Hemos recibido tu confirmación. ¡Nos vemos el gran día!</p>
        </div>

        <div id="rsvp-error" class="form-message form-message--error">
          <i data-lucide="alert-circle" width="40" height="40" class="form-message__icon" style="color:#dc2626"></i>
          <h3 class="form-message__title">Algo salió mal</h3>
          <p>No pudimos enviar tu confirmación. Intenta de nuevo o escríbenos directamente.</p>
        </div>

        <form
          class="form reveal"
          id="rsvp-form"
          action="https://formspree.io/f/${WEDDING.rsvp.formspreeId}"
          method="POST"
        >
          <input type="hidden" name="tipo_invitacion" value="${INVITE_TYPE}">

          <div class="form-group">
            <label class="form-label" for="rsvp-name">
              Nombre completo <span aria-hidden="true">*</span>
            </label>
            <input
              class="form-input"
              type="text"
              id="rsvp-name"
              name="name"
              placeholder="Tu nombre y apellido"
              required
              autocomplete="name"
            >
          </div>

          <div class="form-group">
            <label class="form-label" for="rsvp-whatsapp">
              Número de WhatsApp <span aria-hidden="true">*</span>
            </label>
            <input
              class="form-input"
              type="tel"
              id="rsvp-whatsapp"
              name="whatsapp"
              placeholder="+57 300 000 0000"
              required
              autocomplete="tel"
              inputmode="tel"
            >
          </div>

          <div class="form-group">
            <span class="form-label">¿Asistirás? <span aria-hidden="true">*</span></span>
            <div class="form-radio-group" role="radiogroup" aria-required="true">
              <label class="form-radio-label">
                <input type="radio" name="attendance" value="Sí, asistiré" required>
                <i data-lucide="check" width="14" height="14"></i>
                Sí, asistiré
              </label>
              ${optionsExtra}
              <label class="form-radio-label">
                <input type="radio" name="attendance" value="No podré asistir">
                <i data-lucide="x" width="14" height="14"></i>
                No podré asistir
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="rsvp-message">Mensaje para los novios</label>
            <textarea
              class="form-textarea"
              id="rsvp-message"
              name="message"
              placeholder="Comparte tus buenos deseos o algún mensaje especial..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-submit">
            <button type="submit" class="btn btn--primary btn--lg" id="rsvp-submit">
              <i data-lucide="send" width="16" height="16"></i>
              Enviar confirmación
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

/* ---------- Footer / Cierre ---------- */

function renderFooter() {
  const el = document.getElementById('footer');
  if (!el) return;

  const contacts = buildContacts();

  el.innerHTML = `
    <div class="container--narrow">
      <div class="bible-block">
        <blockquote class="bible-quote reveal">"${WEDDING.bible.verse}"</blockquote>
        <cite class="bible-ref reveal delay-1">— ${WEDDING.bible.reference}</cite>
      </div>

      <div class="couple-photo reveal">
        <img
          src="${asset(WEDDING.images.couple)}"
          alt="Foto de ${WEDDING.couple.fullNames}"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="img-placeholder" style="display:none;">
          <i data-lucide="camera-off" width="40" height="40" style="opacity:0.3"></i>
        </div>
      </div>

      <p class="footer__names reveal delay-1">
        <span class="footer__name">${WEDDING.couple.name1}</span>
        <span class="footer__ampersand" aria-hidden="true">&amp;</span>
        <span class="footer__name">${WEDDING.couple.name2}</span>
      </p>
      <p class="footer__year reveal delay-2">${WEDDING.date.display}</p>

      ${contacts ? `<div class="footer__contacts reveal delay-3">${contacts}</div>` : ''}

      <p class="footer__closing reveal delay-4">${WEDDING.closing}</p>

      <div class="footer__bottom reveal delay-5">
        <a href="#hero" class="footer__back">
          <i data-lucide="arrow-up" width="16" height="16"></i>
          Volver al inicio
        </a>
      </div>
    </div>
  `;
}

function buildContacts() {
  const people = WEDDING.contact?.people;
  if (!Array.isArray(people) || people.length === 0) return '';

  return people
    .filter(({ whatsapp }) => whatsapp)
    .map(({ nombre, whatsapp }) => {
      const clean = whatsapp.replace(/[^\d]/g, '');
      return `<a href="https://wa.me/${clean}" target="_blank" rel="noopener noreferrer" class="footer__contact">
        <i data-lucide="message-circle" width="14" height="14"></i>
        <span class="footer__contact-name">${nombre}</span>
        <span>${whatsapp}</span>
      </a>`;
    })
    .join('');
}

/* ---------- Helpers ---------- */

function subtractMinutes(timeStr, mins) {
  const [h, m] = timeStr.replace(' hrs', '').split(':').map(Number);
  const total = h * 60 + m - mins;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${hh}:${mm.toString().padStart(2, '0')} hrs`;
}

/* ---------- RSVP form submit ---------- */

function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('rsvp-submit');
    const successEl = document.getElementById('rsvp-success');
    const errorEl   = document.getElementById('rsvp-error');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-2" width="16" height="16" style="animation:spin 1s linear infinite"></i> Enviando...';
      if (window.lucide) window.lucide.createIcons();
    }

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.style.display = 'none';
        successEl?.classList.add('is-visible');
        if (window.lucide) window.lucide.createIcons();
      } else {
        throw new Error('Error en el servidor');
      }
    } catch {
      errorEl?.classList.add('is-visible');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="send" width="16" height="16"></i> Intentar de nuevo';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  });
}

/* ---------- Back to top ---------- */

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Init --- */

function init() {
  initEnvelope();
  renderNav();
  renderHero();
  renderSaveDate();
  renderIntro();
  renderHistory();
  renderCeremony();

  if (INVITE_TYPE === 'completa') {
    renderReception();
    renderShower();
  }

  renderGallery();
  renderRSVP();
  renderFooter();

  if (window.lucide) window.lucide.createIcons();
  initCountdown();
  initRSVPForm();
  initBackToTop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
