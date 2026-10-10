/*!
 * PERU NORTH SHORE — main.js  v2
 * Fases 1-6 completas · GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.14
 *
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  VARIABLES QUE PUEDES TOCAR                                  ║
 * ╠═══════════════════════════════════════════════════════════════╣
 * ║  CFG.preloaderDur    Duración total del preloader (s)        ║
 * ║  CFG.stampDur        Golpe del sello (s)                     ║
 * ║  CFG.curtainDur      Apertura de cortinas (s)                ║
 * ║  CFG.heroWordStagger Stagger entre SIN y CROWD (s)          ║
 * ║  CFG.underlineDur    Subrayado rojo dibujado (s)             ║
 * ║  CFG.parallaxImg     Intensidad parallax foto 0=max, 1=nada  ║
 * ║  CFG.logoSpinDur     Velocidad giro logo (s/vuelta)          ║
 * ║  CFG.marqueeDur      Velocidad cinta marquee (s)             ║
 * ║  CFG.counterDur      Duración contadores (s)                 ║
 * ║  CFG.ticketStagger   Retraso entre boletos (s)               ║
 * ║  CFG.checkStagger    Retraso entre checks (s)                ║
 * ║  CFG.magnetPx        Atracción magnética botón WA (px)       ║
 * ║  CFG.lenisDur        Suavidad del scroll (0.8-1.4)           ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

/* ─── CONFIGURACIÓN GLOBAL ────────────────────────────────────────────────── */
const CFG = {
  preloaderDur:    1.2,    // s — total del preloader
  stampDur:        0.42,   // s — golpe del sello
  curtainDur:      0.65,   // s — apertura de cortinas
  heroWordStagger: 0.12,   // s — stagger SIN → CROWD
  underlineDur:    0.65,   // s — trazo del subrayado
  parallaxImg:     0.38,   // 0-1 — intensidad parallax foto
  logoSpinDur:     20,     // s — una vuelta completa del logo
  marqueeDur:      28,     // s — una vuelta completa del marquee
  counterDur:      1.9,    // s — animación contadores
  ticketStagger:   0.13,   // s — retraso entre boletos
  checkStagger:    0.15,   // s — retraso entre checks
  magnetPx:        20,     // px — atracción botón WA
  lenisDur:        1.1,    // s — suavidad del scroll (Lenis)
};

/* ─── DETECCIÓN ───────────────────────────────────────────────────────────── */
const IS_TOUCH   = window.matchMedia('(pointer: coarse)').matches;
const IS_DESKTOP = !IS_TOUCH && window.innerWidth >= 768;

/* ─── CARGA DE LIBRERÍAS (A TRAVÉS DE HTML AHORA) ──────────────────────────── */
document.addEventListener('DOMContentLoaded', initAll);

/* ─── ARRANQUE PRINCIPAL ──────────────────────────────────────────────────── */
function initAll() {
  if (typeof gsap === 'undefined') {
    console.warn('[PNS] GSAP no cargó; animaciones desactivadas.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('js-loaded');

  // Siempre funcional (sin animación)
  initFAQ();

  // ── Infraestructura ──────────────────────────────────────────────────────
  initLenis();
  initScrollProgress();
  initNavbar();

  // ── Fases ────────────────────────────────────────────────────────────────
  initPreloader(); // cadena: al terminar llama a initAfterPreloader()
}

/* ═══════════════════════════════════════════════════════════════════════════
   INFRAESTRUCTURA
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Lenis (scroll suave) ─────────────────────────────────────────────────── */
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({
    duration: CFG.lenisDur,
    easing:   t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  });
  // Sincronizar con ScrollTrigger
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window._lenis = lenis;
}

/* ── Barra de progreso ────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0) bar.style.width = (window.scrollY / max * 100).toFixed(2) + '%';
  }, { passive: true });
}

/* ── Navbar (hide/show + transparent→solid) ────────────────────────── */
function initNavbar() {
  const hdr  = document.getElementById('main-header');
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('menu-close-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (!hdr) return;

  let lastY = window.scrollY;
  let ticking = false;

  function updateNavbar(y) {
    // Solid background if scrolled > 50px
    if (y > 50) {
      hdr.classList.add('is-scrolled');
    } else {
      hdr.classList.remove('is-scrolled');
    }
  }

  // Initial check
  updateNavbar(lastY);

  window.addEventListener('scroll', () => {
    lastY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavbar(lastY);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu logic
  if (menuBtn && mobileNav && closeBtn) {
    const toggleMenu = (open) => {
      if (open) {
        mobileNav.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      } else {
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    };

    menuBtn.addEventListener('click', () => toggleMenu(true));
    closeBtn.addEventListener('click', () => toggleMenu(false));
    
    // Close on click inside mobile nav links
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 1-A · PRELOADER
   ═══════════════════════════════════════════════════════════════════════════ */
function initPreloader() {
  const pre   = document.getElementById('preloader');
  const stamp = document.getElementById('preloader__stamp');
  const ctT   = document.getElementById('preloader__curtain-top');
  const ctB   = document.getElementById('preloader__curtain-bottom');

  if (!pre || !stamp) { initAfterPreloader(); return; }

  // Pausa antes de revelar (tiempo disponible entre stamp y curtain)
  const pause = Math.max(0.05, CFG.preloaderDur - CFG.stampDur - CFG.curtainDur - 0.1);

  gsap.timeline({ onComplete: initAfterPreloader })
    // 1 · Sello cae con golpe seco
    .fromTo(stamp,
      { scale: 1.65, opacity: 0, rotation: -10 },
      { scale: 1, opacity: 1, rotation: 0,
        duration: CFG.stampDur, ease: 'expo.out' }
    )
    // 2 · Pequeña vibración táctil
    .to(stamp, {
      keyframes: [
        { x: -4, duration: 0.045, ease: 'none' },
        { x:  4, duration: 0.045, ease: 'none' },
        { x: -2, duration: 0.035, ease: 'none' },
        { x:  0, duration: 0.035, ease: 'none' },
      ],
    })
    // 3 · Pausa visible
    .to({}, { duration: pause })
    // 4 · Cortinas se abren (papel que se despega)
    .to(ctT, { yPercent: -100, duration: CFG.curtainDur, ease: 'power3.inOut' }, 'open')
    .to(ctB, { yPercent:  100, duration: CFG.curtainDur, ease: 'power3.inOut' }, 'open')
    .to(stamp, { opacity: 0, scale: 0.9, duration: 0.25, ease: 'power2.in' }, 'open+=0.05')
    .set(pre, { display: 'none' });
}

/* Callback: arranca el resto de animaciones tras el preloader */
function initAfterPreloader() {
  /* Fase 1 */ initHero();
  /* Fase 2 */ initCarousels(); initSectionReveal(); initCounters();
  /* Fase 3 */ initTickets(); initChecklist(); initPostcards();
  /* Fase 4 */ initSpots();
  /* Fase 5 */ initSteps(); initCTAFinal();
  /* Fase 6 */ initAtmosphere();
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 1-B · HERO (rediseñado: bitácora de expedición)
   ═══════════════════════════════════════════════════════════════════════════ */
function initHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1 · Parallax foto (zoom 1.0 → 1.08 + movimiento vertical) ──────────
  const bgImg = document.getElementById('hero-bg-img');
  if (bgImg && !prefersReduced) {
    gsap.to(bgImg, {
      scale: 1.08,
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // ── 2 · Cascade entry animations ────────────────────────────────────────
  if (prefersReduced) return; // Everything visible by CSS

  const tl = gsap.timeline({ delay: 0.1 });

  // Antetítulo
  const pretitle = document.getElementById('hero-pretitle');
  if (pretitle) {
    gsap.set(pretitle, { opacity: 0, y: 20 });
    tl.to(pretitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  }

  // SIN word (mask slide up)
  const sinWord = document.getElementById('hero-word-sin');
  if (sinWord) {
    gsap.set(sinWord, { yPercent: 110 });
    tl.to(sinWord, { yPercent: 0, duration: 0.65, ease: 'power3.out' }, '-=0.2');
  }

  // CROWD word (mask slide up)
  const crowdWord = document.getElementById('hero-word-crowd');
  if (crowdWord) {
    gsap.set(crowdWord, { yPercent: 110 });
    tl.to(crowdWord, { yPercent: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45');
  }

  // Underline draw
  const underline = document.getElementById('hero-underline');
  if (underline) {
    tl.to(underline, { scaleX: 1, duration: CFG.underlineDur, ease: 'power3.out' }, '-=0.3');
  }

  // Description
  const desc = document.getElementById('hero-desc');
  if (desc) {
    gsap.set(desc, { opacity: 0, y: 16 });
    tl.to(desc, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.25');
  }

  // Buttons
  const actions = document.getElementById('hero-actions');
  if (actions) {
    gsap.set(actions, { opacity: 0, y: 16 });
    tl.to(actions, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.15');
  }

  // WA button tilt punch
  const waBtn = document.getElementById('hero-wa-btn');
  if (waBtn) {
    gsap.set(waBtn, { rotation: 0, opacity: 0 });
    tl.to(waBtn, {
      rotation: -2, opacity: 1, duration: 0.35, ease: 'power3.out',
    }, '-=0.35');
  }

  // Bottom coords
  const bottomBar = hero.querySelector('.hero-bottom-bar');
  if (bottomBar) {
    gsap.set(bottomBar, { opacity: 0 });
    tl.to(bottomBar, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');
  }

  // ── 3 · Parallax content (moves faster than photo) ──────────────────────
  const content = hero.querySelector('.hero-content');
  if (content) {
    gsap.to(content, {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 2-A · CARROUSELES INFINITOS (Sólo Cintas)
   ═══════════════════════════════════════════════════════════════════════════ */
function initCarousels() {
  const tweens = [];

  function buildMarquee(wrapSelector, baseSpeed, direction) {
    const wrap = document.querySelector(wrapSelector);
    if (!wrap) return;
    const track = wrap.querySelector('.marquee-track');
    const inner = wrap.querySelector('.marquee-inner');
    if (!track || !inner) return;

    // Quitar animaciones CSS residuales si existen
    inner.style.animation = 'none';
    inner.style.animationDirection = '';

    // Repetir el contenido de inner hasta que sea más ancho que la pantalla
    // Usaremos un span base.
    const originalContent = inner.innerHTML;
    // Agregamos copias hasta que el ancho de inner supere el de la ventana
    // Para asegurarnos, lo repetiremos unas 10 veces que es suficiente para cualquier pantalla (1920px+).
    // Así no dependemos de medir anchos y lidiar con fonts no cargadas.
    let newContent = '';
    for(let i=0; i<10; i++){
      newContent += originalContent;
    }
    inner.innerHTML = newContent;

    // Ahora clonamos todo el inner UNA vez
    const clone = inner.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);

    // Animamos el track de 0 a -50% (o al revés)
    let tween;
    if (direction === 'left') {
      tween = gsap.fromTo(track, 
        { xPercent: 0 },
        { xPercent: -50, ease: 'none', duration: baseSpeed, repeat: -1 }
      );
    } else {
      tween = gsap.fromTo(track,
        { xPercent: -50 },
        { xPercent: 0, ease: 'none', duration: baseSpeed, repeat: -1 }
      );
    }

    // Pausa en hover
    wrap.addEventListener('mouseenter', () => gsap.to(tween, { timeScale: 0, duration: 0.5, overwrite: 'auto' }));
    wrap.addEventListener('mouseleave', () => gsap.to(tween, { timeScale: 1, duration: 0.5, overwrite: 'auto' }));

    tweens.push(tween);
  }

  // 1. Cinta superior (izquierda, ~30s por ciclo)
  buildMarquee('.marquee-wrap:first-of-type', 30, 'left');
  
  // 2. Cinta inferior (derecha, ~40s por ciclo)
  buildMarquee('.marquee-wrap:last-of-type', 40, 'right');

  // Aumentar velocidad al hacer scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    tweens.forEach(t => gsap.to(t, { timeScale: 2.5, duration: 0.3, overwrite: 'auto' }));
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      tweens.forEach(t => gsap.to(t, { timeScale: 1, duration: 0.5, overwrite: 'auto' }));
    }, 150);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 2-B · REVEAL DE SECCIONES AL SCROLL
   ═══════════════════════════════════════════════════════════════════════════ */
function initSectionReveal() {
  const ST_OPTS = { once: true };

  // ── Titulares h2 · máscara de línea (no fade genérico) ──────────────────
  document.querySelectorAll('h2.font-slab').forEach(h2 => {
    if (h2.closest('#hero')) return;
    gsap.fromTo(h2,
      { clipPath: 'inset(0 0 100% 0)', y: 30, opacity: 0 },
      { clipPath: 'inset(0 0 0% 0)',   y: 0,  opacity: 1,
        duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: h2, start: 'top 87%', ...ST_OPTS }
      }
    );
  });

  // ── Labels rojos (texto pequeño encima de h2) ────────────────────────────
  document.querySelectorAll('[class*="text-stamp-red"][class*="uppercase"][class*="tracking"]').forEach(el => {
    if (el.closest('#hero') || el.closest('header')) return;
    gsap.fromTo(el,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', ...ST_OPTS }
      }
    );
  });

  // ── Blockquotes ──────────────────────────────────────────────────────────
  document.querySelectorAll('blockquote').forEach(bq => {
    gsap.fromTo(bq,
      { opacity: 0, x: -35 },
      { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: bq, start: 'top 87%', ...ST_OPTS }
      }
    );
  });

  // ── Párrafos monoespaciados de datos (máquina de escribir — selectivo) ───
  // Solo dentro de las cajas de datos/coaching/checklist
  document.querySelectorAll(
    '#coaching .font-mono.text-xs, #coaching .font-mono.text-sm, ' +
    '.border-2.border-ink-black.p-4 .font-mono'
  ).forEach(el => {
    if (el.dataset.typed) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => typewriter(el),
    });
  });

  // ── Libreta del expedicionario (notas de campo) ──────────────────────
  const notasCard = document.querySelector('.border-3.border-ink-black.p-5.bg-paper-card.space-y-4');
  if (notasCard) {
    gsap.fromTo(notasCard,
      { opacity: 0, x: -30, rotation: -1 },
      { opacity: 1, x: 0, rotation: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: notasCard, start: 'top 85%', once: true }
      }
    );
  }

  // ── Sección de Coaching: panel derecho (marco de vídeo) entra desde derecha
  const coachingPanel = document.querySelector('#coaching .lg\\:col-span-6:last-child');
  if (coachingPanel) {
    gsap.fromTo(coachingPanel,
      { opacity: 0, x: 50, rotation: 1 },
      { opacity: 1, x: 0, rotation: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: coachingPanel, start: 'top 83%', once: true }
      }
    );
  }

  // ── Pasos de coaching (lista numerada 01/02/03) ───────────────────────
  document.querySelectorAll('#coaching .flex.items-start.gap-2').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        delay: i * 0.1,
      }
    );
  });
}

/* Helper · efecto de máquina de escribir ────────────────────────────────── */
function typewriter(el) {
  if (el.dataset.typed) return;
  el.dataset.typed = '1';
  const text = el.textContent;
  if (text.length < 6) return;
  const speed = Math.max(12, Math.min(22, 500 / text.length));
  let i = 0;
  el.textContent = '';
  const t = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) clearInterval(t);
  }, speed);
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 2-C · CONTADORES (+9K, 06, +300, 15)
   ═══════════════════════════════════════════════════════════════════════════ */
function initCounters() {
  // Encontrar la sección de métricas (la que tiene +9K o "Comunidad Instagram")
  let metricSection = null;
  document.querySelectorAll('section').forEach(s => {
    if (s.textContent.includes('Comunidad Instagram')) metricSection = s;
  });
  if (!metricSection) return;

  // Definición de cada métrica: texto original → valor numérico + formato
  const metrics = [
    { originalText: '+9K',  target: 9,   format: v => '+' + v + 'K' },
    { originalText: '06',   target: 6,   format: v => (v < 10 ? '0' : '') + v },
    { originalText: '+300', target: 300, format: v => '+' + v },
    { originalText: '15',   target: 15,  format: v => '' + v },
  ];

  metricSection.querySelectorAll('.font-slab').forEach(el => {
    const rawText = el.textContent.trim();
    const def = metrics.find(m => rawText.includes(m.originalText.replace('+', '')) || rawText === m.originalText);
    if (!def) return;

    // Inclinación aleatoria para look disperso de imprenta
    const tilt = (Math.random() * 7 - 3.5).toFixed(1);
    gsap.set(el, { rotation: parseFloat(tilt) });

    ScrollTrigger.create({
      trigger: el, start: 'top 86%', once: true,
      onEnter() {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: def.target, duration: CFG.counterDur, ease: 'power2.out',
          onUpdate() { el.textContent = def.format(Math.round(obj.v)); },
          onComplete() { el.textContent = def.originalText; }, // restaurar original
        });
      },
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 3-A · BOLETOS (caen y se asientan con rotación)
   ═══════════════════════════════════════════════════════════════════════════ */
function initTickets() {
  const sec = document.getElementById('viajes');
  if (!sec) return;

  // Los tres bloques: trip 1 (7 cols), trip 2 (5 cols), trip privado (12 cols)
  const tickets = sec.querySelectorAll(
    '[class*="lg:col-span-7"], [class*="lg:col-span-5"], [class*="lg:col-span-12"]'
  );

  gsap.fromTo(tickets,
    {
      opacity: 0,
      y: -50,
      rotation: (i) => [-8, 9, 0][i] ?? 0,
    },
    {
      opacity: 1, y: 0,
      duration: 0.72,
      stagger: CFG.ticketStagger,
      ease: 'power3.out',
      scrollTrigger: { trigger: sec, start: 'top 78%', once: true },
    }
  );

  // ── Sellos rojos "CUPOS LIMITADOS" → stamp effect ───────────────────────
  sec.querySelectorAll('.bg-stamp-red.text-white').forEach((badge, i) => {
    // Solo el badge pequeño, no los botones grandes
    if (badge.tagName === 'A') return;
    gsap.fromTo(badge,
      { opacity: 0, scale: 1.7, rotation: -15 },
      { opacity: 1, scale: 1,   rotation: 0,
        duration: 0.38, ease: 'expo.out',
        scrollTrigger: { trigger: badge, start: 'top 88%', once: true },
        delay: 0.4 + i * 0.15,
      }
    );
  });

  // ── Hover: boleto se levanta y sombra dura se refuerza ──────────────────
  tickets.forEach(ticket => {
    ticket.style.transition = 'box-shadow 0.2s ease';
    ticket.addEventListener('mouseenter', () => {
      gsap.to(ticket, { y: -6, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
      ticket.style.boxShadow = '10px 10px 0px #1A1816';
    });
    ticket.addEventListener('mouseleave', () => {
      gsap.to(ticket, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      ticket.style.boxShadow = '';
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 3-B · CHECKLIST ([X] se estampan uno a uno)
   ═══════════════════════════════════════════════════════════════════════════ */
function initChecklist() {
  const sec = document.getElementById('incluye');
  if (!sec) return;

  // Tarjetas del checklist entran en cascada
  const cards = sec.querySelectorAll('.grid > div');
  gsap.fromTo(cards,
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0, duration: 0.52, stagger: 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: sec.querySelector('.grid'), start: 'top 82%', once: true },
    }
  );

  // Cada [X] se estampa con escala + golpe
  sec.querySelectorAll('.font-slab.text-2xl.text-stamp-red').forEach((lbl, i) => {
    gsap.fromTo(lbl,
      { opacity: 0, scale: 1.5, rotation: -12, x: -8 },
      {
        opacity: 1, scale: 1, rotation: 0, x: 0,
        duration: 0.38, ease: 'expo.out',
        scrollTrigger: { trigger: lbl, start: 'top 88%', once: true },
        delay: i * CFG.checkStagger,
      }
    );
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 3-C · POSTALES / TESTIMONIOS
   ═══════════════════════════════════════════════════════════════════════════ */
function initPostcards() {
  // Las 3 postales de testimonios
  const postcards = document.querySelectorAll(
    '#faq ~ section .border-3.bg-paper-card, ' +
    'section:has(h2) .border-3.border-ink-black.bg-paper-card.p-6'
  );

  // Fallback: encontrar la sección de testimonios por texto
  let testimonioSec = null;
  document.querySelectorAll('section').forEach(s => {
    if (s.querySelector('h2') && s.querySelector('h2').textContent.includes('Postales')) testimonioSec = s;
  });

  const cards = testimonioSec
    ? testimonioSec.querySelectorAll('.grid > div')
    : document.querySelectorAll('.border-3.border-ink-black.bg-paper-card.p-6');

  cards.forEach((card, i) => {
    const fromX   = i === 1 ? 0 : (i === 0 ? -70 : 70);
    const fromRot = i === 1 ? 0 : (i === 0 ? -10 : 10);

    gsap.fromTo(card,
      { opacity: 0, x: fromX, rotation: fromRot },
      {
        opacity: 1, x: 0,
        // preservar rotación original del HTML (ya tiene -rotate-2, rotate-1, -rotate-1)
        duration: 0.78, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      }
    );

    // Hover · se endereza y levanta
    const origRot = card.classList.contains('-rotate-2') ? -2
                  : card.classList.contains('rotate-1')  ?  1
                  : card.classList.contains('-rotate-1') ? -1 : 0;

    card.addEventListener('mouseenter', () =>
      gsap.to(card, { rotation: 0, y: -5, duration: 0.28, ease: 'power2.out' })
    );
    card.addEventListener('mouseleave', () =>
      gsap.to(card, { rotation: origRot, y: 0, duration: 0.35, ease: 'power2.out' })
    );
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 4 · SPOTS Y MAPA
   ═══════════════════════════════════════════════════════════════════════════ */
function initSpots() {
  const spotSec = document.getElementById('spots');
  if (!spotSec) return;

  // ── Pines del mapa aparecen en secuencia con pulso ───────────────────────
  const pins = spotSec.querySelectorAll(
    '.rounded-full.border-2, .rounded-full.border-3'
  );
  pins.forEach((pin, i) => {
    gsap.fromTo(pin,
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: pin, start: 'top 88%', once: true },
        delay: i * 0.1,
        onComplete() {
          // Pequeño pulso continuo
          gsap.to(pin, {
            scale: 1.08, duration: 0.7, ease: 'power1.inOut',
            yoyo: true, repeat: 2,
          });
        },
      }
    );
  });

  // ── Tarjetas de spot: entrada + duotono en hover ─────────────────────────
  spotSec.querySelectorAll('[id^="spot-"]').forEach((card, i) => {
    const img = card.querySelector('img');
    if (img) img.classList.add('spot-card-img');

    gsap.fromTo(card,
      { opacity: 0, y: 38 },
      {
        opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        delay: (i % 3) * 0.1,
      }
    );

    card.addEventListener('mouseenter', () =>
      gsap.to(card, { rotation: -1.5, y: -6, duration: 0.25, ease: 'power2.out' })
    );
    card.addEventListener('mouseleave', () =>
      gsap.to(card, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' })
    );
  });

  // ── Banner azul "Spots Sin Crowd" — texto horizontal scrub ───────────────
  const banner = spotSec.querySelector('.bg-petrol-dark');
  if (banner) {
    const h3 = banner.querySelector('h3');
    if (h3) {
      gsap.fromTo(h3,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: banner, start: 'top 85%', once: true },
        }
      );
    }

    // Logo girando detrás
    const bgSpiral = banner.querySelector('.absolute');
    if (bgSpiral) {
      gsap.to(bgSpiral, {
        rotation: 360, duration: 45, ease: 'none', repeat: -1,
      });
    }

    gsap.fromTo(banner,
      { opacity: 0 },
      { opacity: 1, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: banner, start: 'top 82%', once: true },
      }
    );
  }

  // ── Línea de ruta costera (SVG scrub) ───────────────────────────────────
  // Insertar SVG de ruta si no existe ya
  buildCoastlineRoute(spotSec);
}

/* Construye y anima la línea de ruta costera SVG */
function buildCoastlineRoute(container) {
  // El bloque del mapa (diagrama de spots)
  const mapBlock = container.querySelector('.border-4.border-ink-black.bg-paper-card');
  if (!mapBlock) return;

  // Buscar si hay un SVG de ruta; si no, crear uno
  let routeSvg = mapBlock.querySelector('#coast-route-svg');
  if (!routeSvg) {
    const routeWrap = mapBlock.querySelector('.relative.py-4.flex');
    if (!routeWrap) return;

    // Crear SVG de línea que conecte los pines
    routeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    routeSvg.id = 'coast-route-svg';
    routeSvg.setAttribute('aria-hidden', 'true');
    routeSvg.setAttribute('preserveAspectRatio', 'none');
    Object.assign(routeSvg.style, {
      position: 'absolute',
      top: '50%', left: '0', right: '0',
      width: '100%', height: '4px',
      overflow: 'visible',
      pointerEvents: 'none',
      zIndex: '0',
    });

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.id = 'coast-route-line';
    line.setAttribute('x1', '5%');
    line.setAttribute('y1', '2');
    line.setAttribute('x2', '95%');
    line.setAttribute('y2', '2');
    line.setAttribute('stroke', '#1A1816');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '6 4');
    line.style.opacity = '0.35';
    routeSvg.appendChild(line);

    const routeLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    routeLine.id   = 'coast-route-draw';
    routeLine.setAttribute('x1', '5%');
    routeLine.setAttribute('y1', '2');
    routeLine.setAttribute('x2', '5%');   // empieza en 0
    routeLine.setAttribute('y2', '2');
    routeLine.setAttribute('stroke', '#E8472B');
    routeLine.setAttribute('stroke-width', '2.5');
    routeSvg.appendChild(routeLine);

    routeWrap.style.position = 'relative';
    routeWrap.prepend(routeSvg);

    // Animar x2 de 5% → 95% con scrub
    const obj = { x2pct: 5 };
    gsap.to(obj, {
      x2pct: 95,
      ease: 'none',
      scrollTrigger: {
        trigger: mapBlock,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 0.5,
      },
      onUpdate() {
        routeLine.setAttribute('x2', obj.x2pct + '%');
      },
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 5-A · PASOS "CÓMO PLANEAR TU VIAJE" (escalera)
   ═══════════════════════════════════════════════════════════════════════════ */
function initSteps() {
  // Encontrar la sección de pasos por contenido
  let stepsSec = null;
  document.querySelectorAll('section').forEach(s => {
    if (s.querySelector('h2') && s.querySelector('h2').textContent.includes('Planear')) stepsSec = s;
  });
  if (!stepsSec) return;

  const grid  = stepsSec.querySelector('.grid');
  const cards = grid ? grid.querySelectorAll(':scope > div') : [];

  // Números gigantes (01, 02, 03, 04) en escalera
  cards.forEach((card, i) => {
    const num = card.querySelector('.font-slab.text-6xl');
    if (num) {
      gsap.fromTo(num,
        { opacity: 0, scale: 0.6, rotation: -15 },
        {
          opacity: 0.2, scale: 1, rotation: 0,
          duration: 0.6, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: card, start: 'top 84%', once: true },
          delay: i * 0.12,
        }
      );
    }

    gsap.fromTo(card,
      { opacity: 0, y: 50, rotation: -2 },
      {
        opacity: 1, y: 0, rotation: 0,
        duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 84%', once: true },
        delay: i * 0.1,
      }
    );
  });

  // Línea que conecta los pasos (se dibuja progresivamente)
  if (grid && cards.length >= 2) {
    const lineEl = document.createElement('div');
    Object.assign(lineEl.style, {
      position: 'absolute',
      top: '32px', left: '8.33%', right: '8.33%',
      height: '2px',
      background: 'repeating-linear-gradient(90deg, #1A1816 0, #1A1816 6px, transparent 6px, transparent 10px)',
      transformOrigin: 'left',
      transform: 'scaleX(0)',
      pointerEvents: 'none',
      zIndex: '0',
    });
    grid.style.position = 'relative';
    grid.prepend(lineEl);

    gsap.to(lineEl, {
      scaleX: 1, ease: 'none',
      scrollTrigger: {
        trigger: grid, start: 'top 82%', end: 'bottom 60%', scrub: 0.6,
      },
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 5-B · FAQ ACORDEÓN (altura animada, flecha gira)
   ═══════════════════════════════════════════════════════════════════════════ */
function initFAQ() {
  const items = document.querySelectorAll('details.group');
  if (!items.length) return;

  items.forEach(det => {
    const summary = det.querySelector('summary');
    const answer  = det.querySelector('div');
    const plus    = det.querySelector('.font-mono.text-2xl');
    if (!summary || !answer) return;

    // Impedir comportamiento nativo
    det.removeAttribute('open');
    summary.style.cursor = 'pointer';

    // Envolver respuesta en contenedor animable
    const wrapper = document.createElement('div');
    wrapper.className = 'faq-answer-wrap';
    Object.assign(wrapper.style, {
      overflow: 'hidden',
      height: '0px',
    });
    answer.parentNode.insertBefore(wrapper, answer);
    wrapper.appendChild(answer);

    if (plus) plus.style.transition = 'transform 0.3s ease';

    summary.addEventListener('click', e => {
      e.preventDefault();
      const isOpen = wrapper._open;

      // Cerrar todos
      items.forEach(other => {
        if (other === det) return;
        const ow = other.querySelector('.faq-answer-wrap');
        const op = other.querySelector('.font-mono.text-2xl');
        if (ow && ow._open) {
          gsap.to(ow, { height: 0, duration: 0.35, ease: 'power2.inOut' });
          ow._open = false;
          if (op) op.style.transform = 'rotate(0deg)';
          if (op) op.classList.remove('faq-plus-open');
        }
      });

      if (isOpen) {
        gsap.to(wrapper, { height: 0, duration: 0.35, ease: 'power2.inOut' });
        wrapper._open = false;
        if (plus) plus.style.transform = 'rotate(0deg)';
      } else {
        // Medir altura real
        gsap.set(wrapper, { height: 'auto' });
        const h = wrapper.offsetHeight;
        gsap.fromTo(wrapper, { height: 0 }, { height: h, duration: 0.42, ease: 'power2.out' });
        wrapper._open = true;
        if (plus) plus.style.transform = 'rotate(45deg)';
      }
    });

    // Estado inicial garantizado en 0
    gsap.set(wrapper, { height: 0 });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 5-C · CTA FINAL
   ═══════════════════════════════════════════════════════════════════════════ */
function initCTAFinal() {
  const sec = document.querySelector('section.bg-petrol-dark.text-paper');
  if (!sec) return;

  // Sello circular estampa al entrar
  const seal = sec.querySelector('.rounded-full.bg-paper');
  if (seal) {
    gsap.fromTo(seal,
      { opacity: 0, scale: 1.7, rotation: -25 },
      { opacity: 1, scale: 1, rotation: -3,
        duration: 0.55, ease: 'expo.out',
        scrollTrigger: { trigger: seal, start: 'top 88%', once: true },
      }
    );
  }

  // Titular crece levemente al entrar
  const h2 = sec.querySelector('h2');
  if (h2) {
    gsap.fromTo(h2,
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0,
        duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: h2, start: 'top 87%', once: true },
      }
    );
    // Parallax sutil al scroll
    gsap.to(h2, {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  // Espiral de fondo gira lentamente
  const bgLogo = sec.querySelector('.absolute.inset-0 img');
  if (bgLogo) {
    gsap.to(bgLogo, { rotation: 360, duration: 50, ease: 'none', repeat: -1 });
  }

  // Badge "TEMPORADA 2026 ABIERTA" aparece
  const badge = sec.querySelector('.bg-paper.px-3');
  if (badge) {
    gsap.fromTo(badge,
      { opacity: 0, scale: 1.4 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out',
        scrollTrigger: { trigger: badge, start: 'top 88%', once: true }, delay: 0.2,
      }
    );
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   FASE 6 · ATMÓSFERA Y DETALLES
   ═══════════════════════════════════════════════════════════════════════════ */
function initAtmosphere() {
  // Animación del sello del footer
  const footerStamp = document.querySelector('.footer-stamp');
  if (footerStamp && typeof gsap !== 'undefined') {
    // prefers-reduced-motion check
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(footerStamp,
        { opacity: 0, scale: 1.6, rotation: -25 },
        { opacity: 0.85, scale: 1, rotation: -15, duration: 0.4, ease: 'power3.out',
          scrollTrigger: { trigger: 'footer', start: 'top 80%', once: true }
        }
      );
    } else {
      gsap.set(footerStamp, { opacity: 0.85, scale: 1, rotation: -15 });
    }
  }

  // Cursor personalizado solo en desktop
  if (IS_DESKTOP) {
    initCursor();
    initMagneticWA();
  }

  // Botón WA flotante: efecto fill en hover (todos los botones wa.me)
  document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
    if (a.closest('aside')) return; // el flotante ya tiene magnetismo
    a.classList.add('wa-btn-fill');
  });
}

/* ── Cursor personalizado ────────────────────────────────────────────────── */
function initCursor() {
  const cur = document.getElementById('custom-cursor');
  if (!cur) return;

  // Movimiento suave
  document.addEventListener('mousemove', e => {
    gsap.to(cur, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'none', overwrite: 'auto' });
  });

  // Links y botones → círculo grande
  const hoverEls = document.querySelectorAll('a, button, summary, [role="button"]');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.classList.add('is-hover');
      cur.classList.remove('is-photo');
    });
    el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
  });

  // Fotos → "VER"
  document.querySelectorAll(
    '.aspect-video img, [class*="aspect-"] img, .relative.overflow-hidden img'
  ).forEach(img => {
    img.addEventListener('mouseenter', () => {
      cur.classList.add('is-photo');
      cur.classList.remove('is-hover');
    });
    img.addEventListener('mouseleave', () => cur.classList.remove('is-photo'));
  });
}

/* ── Botón WA flotante — magnético ──────────────────────────────────────── */
function initMagneticWA() {
  const wa = document.querySelector('aside a');
  if (!wa) return;

  wa.addEventListener('mousemove', e => {
    const r  = wa.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) * 0.32;
    const dy = (e.clientY - cy) * 0.32;
    gsap.to(wa, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
  });

  wa.addEventListener('mouseleave', () => {
    gsap.to(wa, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)' });
  });
}
