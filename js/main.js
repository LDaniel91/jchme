/* ═══════════════════════════════════════════
   III JORNADA CIENTÍFICA NACIONAL
   Dr. Joaquín Castillo Duany — Interactividad
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. Header con fondo al hacer scroll ─── */
  const header = document.getElementById('header');
  const toTop  = document.getElementById('toTop');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    toTop.classList.toggle('show', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── 2. Menú móvil ─── */
  const menuToggle = document.getElementById('menuToggle');
  const nav        = document.getElementById('nav');

  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ─── 3. Botón volver arriba ─── */
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── 4. Animaciones de aparición ─── */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ─── 5. Fechas clave del evento (hora de Cuba, UTC-5) ─── */
  const FECHAS = {
    cierreResumenes: new Date('2026-11-30T23:59:59-05:00').getTime(), // cierre de resúmenes
    inicioJornada:   new Date('2027-01-06T00:00:00-05:00').getTime(), // inicio de la Jornada
    finJornada:      new Date('2027-01-08T23:59:59-05:00').getTime()  // fin de la Jornada
  };

  const pad = (n) => String(n).padStart(2, '0');

  /* ─── 5.A Cuenta regresiva HERO → cierre de resúmenes ─── */
  const cdCierre = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs')
  };

  function updateCierre() {
    const diff = FECHAS.cierreResumenes - Date.now();

    if (diff <= 0) {
      cdCierre.days.textContent  = '00';
      cdCierre.hours.textContent = '00';
      cdCierre.mins.textContent  = '00';
      cdCierre.secs.textContent  = '00';
      return;
    }

    cdCierre.days.textContent  = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
    cdCierre.hours.textContent = pad(Math.floor((diff / (1000 * 60 * 60)) % 24));
    cdCierre.mins.textContent  = pad(Math.floor((diff / (1000 * 60)) % 60));
    cdCierre.secs.textContent  = pad(Math.floor((diff / 1000) % 60));
  }

  /* ─── 5.B Cuenta regresiva SECCIÓN → inicio de la Jornada ─── */
  const cdJornada = {
    days:  document.getElementById('jc-days'),
    hours: document.getElementById('jc-hours'),
    mins:  document.getElementById('jc-mins'),
    secs:  document.getElementById('jc-secs'),
    wrap:  document.getElementById('journey-countdown')
  };

  function updateJornada() {
    if (!cdJornada.days) return;

    const diff = FECHAS.inicioJornada - Date.now();
    const now  = Date.now();

    // Si ya inició la Jornada
    if (diff <= 0 && now < FECHAS.finJornada) {
      cdJornada.days.textContent  = '🎉';
      cdJornada.hours.textContent = 'EN';
      cdJornada.mins.textContent  = 'CUR';
      cdJornada.secs.textContent  = 'SO';
      return;
    }

    // Si ya terminó la Jornada
    if (now >= FECHAS.finJornada) {
      cdJornada.days.textContent  = '—';
      cdJornada.hours.textContent = '—';
      cdJornada.mins.textContent  = '—';
      cdJornada.secs.textContent  = '—';
      return;
    }

    // Cuenta normal
    cdJornada.days.textContent  = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
    cdJornada.hours.textContent = pad(Math.floor((diff / (1000 * 60 * 60)) % 24));
    cdJornada.mins.textContent  = pad(Math.floor((diff / (1000 * 60)) % 60));
    cdJornada.secs.textContent  = pad(Math.floor((diff / 1000) % 60));
  }

  /* ─── Tick global cada segundo ─── */
  function tick() {
    updateCierre();
    updateJornada();
  }
  tick();
  setInterval(tick, 1000);

  /* ─── 6. Scroll suave para enlaces internos ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── 7. Año dinámico en el footer ─── */
  const yearEl = document.querySelector('.footer-copy');
  if (yearEl) {
    const y = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace('2026–2027', `2026–${Math.max(y, 2027)}`);
  }

})();