(function () {
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  let theme = 'dark';
  root.setAttribute('data-theme', theme);

  const sun =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const moon =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function paintTheme() {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      themeBtn.innerHTML = theme === 'dark' ? sun : moon;
    }
  }
  paintTheme();
  themeBtn &&
    themeBtn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      paintTheme();
    });

  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  menuBtn &&
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.getAttribute('data-open') === 'true';
      mobileNav.setAttribute('data-open', open ? 'false' : 'true');
      menuBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });

  document.querySelectorAll('[data-mobile-nav] a').forEach((a) => {
    a.addEventListener('click', () => {
      mobileNav.setAttribute('data-open', 'false');
      menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('button');
    btn &&
      btn.addEventListener('click', () => {
        const isOpen = item.hasAttribute('open');
        document.querySelectorAll('.faq-item[open]').forEach((el) => el.removeAttribute('open'));
        if (!isOpen) item.setAttribute('open', '');
        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });
  });

  const tabs = [...document.querySelectorAll('[data-tab]')];
  const panels = [...document.querySelectorAll('[data-tab-panel]')];
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-tab');
      tabs.forEach((t) => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
      panels.forEach((p) => {
        p.hidden = p.getAttribute('data-tab-panel') !== id;
      });
    });
  });

  const quotes = [
    {
      text: 'We needed a site that felt as serious as the work we do in the field. ESCOTECH rebuilt the whole thing around calls and bookings. Customers find the service they need in seconds, and the phone actually rings.',
      name: 'Mike R.',
      role: 'General Manager, SummitAir Heating',
    },
    {
      text: 'Our old website made us look small. The new one is fast, clean, and built for a thumb on a phone. Quote requests jumped the first month. The process was straightforward from kickoff to launch.',
      name: 'Dana K.',
      role: 'Owner, Brightline Pressure Washing',
    },
    {
      text: 'I have been burned by web shops before. This was the opposite. They handled copy, pages, and the technical setup. We woke up to real plumbing calls instead of another pretty brochure.',
      name: 'Carlos M.',
      role: 'Owner, ClearFlow Plumbing Co.',
    },
  ];
  let qi = 0;
  const quoteEl = document.querySelector('[data-quote]');
  const whoEl = document.querySelector('[data-who]');
  const dotsEl = document.querySelector('[data-dots]');
  function renderQuote() {
    if (!quoteEl) return;
    const q = quotes[qi];
    quoteEl.textContent = '“' + q.text + '”';
    whoEl.innerHTML = q.name + '<span>' + q.role + '</span>';
    if (dotsEl) {
      [...dotsEl.children].forEach((d, i) => d.setAttribute('aria-current', i === qi ? 'true' : 'false'));
    }
  }
  if (dotsEl && quoteEl) {
    quotes.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show review ' + (i + 1));
      b.addEventListener('click', () => {
        qi = i;
        renderQuote();
      });
      dotsEl.appendChild(b);
    });
  }
  document.querySelector('[data-prev]') &&
    document.querySelector('[data-prev]').addEventListener('click', () => {
      qi = (qi + quotes.length - 1) % quotes.length;
      renderQuote();
    });
  document.querySelector('[data-next]') &&
    document.querySelector('[data-next]').addEventListener('click', () => {
      qi = (qi + 1) % quotes.length;
      renderQuote();
    });
  renderQuote();

  const sections = ['examples', 'pricing', 'process', 'build', 'reviews', 'faqs'];
  const navLinks = [...document.querySelectorAll('[data-nav] a')];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => {
          const href = a.getAttribute('href') || '';
          a.classList.toggle('is-active', href.endsWith('#' + e.target.id));
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  sections.forEach((id) => {
    const el = document.getElementById(id);
    el && io.observe(el);
  });

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let ok = true;
      form.querySelectorAll('[required]').forEach((field) => {
        const valid = !!String(field.value || '').trim();
        field.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;
      form.hidden = true;
      const success = document.querySelector('[data-success]');
      if (success) success.setAttribute('data-show', 'true');
    });
  }

  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.style.background = 'var(--color-surface-offset)';
      img.alt = img.alt || '';
    });
  });
})();
