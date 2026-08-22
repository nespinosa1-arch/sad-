// Interactive behaviors: menu toggle, year, single-section view, and form handler
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  }, { once: true });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const showAllBtn = document.getElementById('showAllBtn');
  const sections = Array.from(document.querySelectorAll('main > section'));
  const links = Array.from(document.querySelectorAll('.main-nav a'));
  const yearEl = document.getElementById('year');

  // menu toggle for small screens
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      const hidden = nav.getAttribute('aria-hidden') === 'false' ? 'true' : 'false';
      nav.setAttribute('aria-hidden', hidden);
    });
  }

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Show a single section and hide others
  function showSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    document.body.classList.add('single-view');
    sections.forEach(s => {
      if (s.id === id) {
        s.classList.remove('section-hidden');
        s.setAttribute('aria-hidden', 'false');
        s.scrollIntoView({behavior: 'smooth'});
      } else {
        s.classList.add('section-hidden');
        s.setAttribute('aria-hidden', 'true');
      }
    });
    // update nav active
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    if (showAllBtn) showAllBtn.style.display = 'inline-block';
  }

  function showAll() {
    document.body.classList.remove('single-view');
    sections.forEach(s => { s.classList.remove('section-hidden'); s.setAttribute('aria-hidden','false'); });
    links.forEach(a => a.classList.remove('active'));
    if (showAllBtn) showAllBtn.style.display = 'none';
    window.scrollTo({top:0,behavior:'smooth'});
    history.pushState(null, '', location.pathname);
  }

  // Intercept nav clicks to toggle single-section view
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        const id = href.replace('#','');
        showSection(id);
        // update URL hash without jumping
        history.pushState(null, '', '#' + id);
      }
    });
  });

  if (showAllBtn) showAllBtn.addEventListener('click', showAll);

  // contact form handler (demo only)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      alert('Thanks, ' + (data.name || 'there') + '! This demo does not send messages.');
      form.reset();
    });
  }

  // deep-link support: if there's a hash, show that section
  if (location.hash) {
    const id = location.hash.replace('#','');
    // small timeout to allow layout
    setTimeout(() => showSection(id), 80);
  }
});
