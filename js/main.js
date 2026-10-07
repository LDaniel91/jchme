/* ═══════════════════════════════════════════
   CIENCIA EN GUARDIA — Interactividad
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

  // Cerrar menú al hacer clic en un enlace
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

  /* ─── 4. Animaciones de aparición (IntersectionObserver) ─── */
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

  /* ─── 5. Cuenta regresiva al 30 de noviembre de 2026 ─── */
  const deadline = new Date('2026-11-30T23:59:59-05:00').getTime();
  const cd = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs')
  };

  const pad = (n) => String(n).padStart(2, '0');

  function updateCountdown() {
    const now  = Date.now();
    const diff = deadline - now;

    if (diff <= 0) {
      cd.days.textContent  = '00';
      cd.hours.textContent = '00';
      cd.mins.textContent  = '00';
      cd.secs.textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins  = Math.floor((diff / (1000 * 60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);

    cd.days.textContent  = pad(days);
    cd.hours.textContent = pad(hours);
    cd.mins.textContent  = pad(mins);
    cd.secs.textContent  = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ─── 6. Scroll suave para enlaces internos (fallback) ─── */
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

  /* ─── 7. Año dinámico en el footer (opcional) ─── */
  const yearEl = document.querySelector('.footer-copy');
  if (yearEl) {
    const y = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace('2026–2027', `2026–${Math.max(y, 2027)}`);
  }

})();