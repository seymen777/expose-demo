// =========================================
// STICKY SCROLL BAR
// =========================================
(function () {
  const bar      = document.getElementById('stickyBar');
  const closeBtn = document.getElementById('stickyBarClose');
  if (!bar || !closeBtn) return;

  if (sessionStorage.getItem('stickyDismissed')) return;

  let shown = false;
  window.addEventListener('scroll', () => {
    if (shown) return;
    if (window.scrollY > 600) {
      shown = true;
      bar.classList.add('visible');
    }
  }, { passive: true });

  closeBtn.addEventListener('click', () => {
    bar.classList.remove('visible');
    sessionStorage.setItem('stickyDismissed', '1');
  });
})();

// =========================================
// WEBSITE ANALYSE FORM
// =========================================
(function () {
  const form = document.getElementById('analyseForm');
  if (!form) return;

  const btn   = document.getElementById('analyseBtn');
  const err   = document.getElementById('analyseErr');
  const card  = document.getElementById('analyseCard');
  const succ  = document.getElementById('analyseSuccess');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    err.style.display = 'none';

    const url   = form.querySelector('[name="url"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();

    if (!url || !email) {
      err.textContent = 'Bitte URL und E-Mail eingeben.';
      err.style.display = 'block';
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i;
    if (!urlPattern.test(url)) {
      err.textContent = 'Bitte eine gültige URL eingeben (z.B. https://deinebusiness.de).';
      err.style.display = 'block';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = 'Bitte eine gültige E-Mail-Adresse eingeben.';
      err.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Analyse läuft…';

    const normalized = url.startsWith('http') ? url : 'https://' + url;

    try {
      const res = await fetch('https://n8n-production-608e.up.railway.app/webhook/website-analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-GrAIt-Secret': 'grait2026secret' },
        body: JSON.stringify({ url: normalized, email })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      form.style.display = 'none';
      succ.style.display = 'block';
    } catch {
      btn.disabled = false;
      btn.textContent = 'Kostenlose Analyse starten →';
      err.textContent = 'Etwas ist schiefgelaufen. Schreib uns direkt: seymen.pasa.d@gmail.com';
      err.style.display = 'block';
    }
  });
})();

// =========================================
// ANNOUNCEMENT BAR
// =========================================
(function () {
  const bar = document.getElementById('annBar');
  const closeBtn = document.getElementById('annClose');
  if (!bar || !closeBtn) return;

  if (sessionStorage.getItem('annDismissed')) {
    bar.classList.add('ann-dismissed');
    document.documentElement.style.setProperty('--ann-h', '0px');
    document.body.classList.add('ann-dismissed');
  }

  closeBtn.addEventListener('click', () => {
    bar.classList.add('ann-dismissed');
    document.documentElement.style.setProperty('--ann-h', '0px');
    document.body.classList.add('ann-dismissed');
    sessionStorage.setItem('annDismissed', '1');
  });
})();

// =========================================
// HERO LIVE FEED WIDGET
// =========================================
(function () {
  const feed = document.getElementById('heroFeed');
  if (!feed) return;

  const events = [
    { icon: '📩', text: 'ImmoScout-Anfrage: Thomas M. — 3-Zi. Berlin-Mitte', badge: 'hot', badgeText: 'NEU', time: 'gerade eben' },
    { icon: '🤖', text: 'Lead-Score berechnet: <strong>9/10</strong> — hohes Kaufinteresse', badge: null, time: '0:09' },
    { icon: '⚡', text: 'Personalisierte Antwort gesendet — <strong>87 Sek.</strong>', badge: 'ok', badgeText: 'OK', time: '1:27' },
    { icon: '🎯', text: 'Lead qualifiziert: <strong>🔥 HOT</strong> — sofort anrufen', badge: 'hot', badgeText: 'HOT', time: '1:28' },
    { icon: '📊', text: 'Eigentümer-Bericht KW31 für 4 Objekte versandt', badge: 'ok', badgeText: 'OK', time: '08:01' },
    { icon: '🔄', text: 'Follow-up #2 an 8 Interessenten automatisch gesendet', badge: null, time: '10:30' },
    { icon: '📧', text: 'Neues Lead-Formular: Sandra K. — Score 11/12', badge: 'warm', badgeText: 'WARM', time: '14:17' },
    { icon: '📄', text: 'Exposé generiert — Friedrichstraße 45, 650.000 €', badge: null, time: '15:42' },
  ];

  let idx = 0;

  function addFeedItem() {
    const ev = events[idx % events.length];
    idx++;

    const item = document.createElement('div');
    item.className = 'hw-feed-item';
    item.innerHTML = `
      <span class="hw-feed-icon">${ev.icon}</span>
      <span class="hw-feed-text">${ev.text}</span>
      <span class="hw-feed-time">${ev.time}</span>
      ${ev.badge ? `<span class="hw-feed-badge badge-${ev.badge}">${ev.badgeText}</span>` : ''}
    `;

    feed.insertBefore(item, feed.firstChild);

    const items = feed.querySelectorAll('.hw-feed-item');
    if (items.length > 4) items[items.length - 1].remove();
  }

  addFeedItem();
  addFeedItem();
  addFeedItem();
  setInterval(addFeedItem, 2600);

  // Counter: 0 → 23
  const countEl = document.querySelector('.hw-num-count');
  if (countEl) {
    let v = 0;
    const target = 23;
    const tick = () => {
      v = Math.min(v + 1, target);
      countEl.textContent = v;
      if (v < target) setTimeout(tick, 80);
    };
    setTimeout(tick, 400);
  }
})();

// Cookie banner
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieBanner && cookieAccept) {
  if (localStorage.getItem('cookieAccepted')) {
    cookieBanner.style.display = 'none';
  }
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieAccepted', '1');
    cookieBanner.classList.add('cookie-hidden');
    setTimeout(() => { cookieBanner.style.display = 'none'; }, 350);
  });
}

// Sticky nav
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
navToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
navMobile.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navMobile.classList.remove('open')));

// Scroll reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Counter animation
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('de-DE');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Dashboard counters
const dashObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      dashObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const dashCard = document.querySelector('.dashboard-card');
if (dashCard) dashObserver.observe(dashCard);

// Stats bar counters
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stats-num[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), 1400);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsBar = document.querySelector('.stats-inner');
if (statsBar) statsObserver.observe(statsBar);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// =========================================
// MODAL + LEAD FORM — Multi-step + n8n webhook
// =========================================

const leadModal = document.getElementById('leadModal');
const leadForm  = document.getElementById('leadForm');

function openModal() {
  leadModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  leadModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-form').forEach(btn => btn.addEventListener('click', openModal));
document.querySelectorAll('a[href="#kontakt"]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); openModal(); });
});
document.getElementById('modalClose').addEventListener('click', closeModal);
leadModal.addEventListener('click', e => { if (e.target === leadModal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && leadModal.classList.contains('open')) closeModal(); });

// Conditional "other" fields
document.getElementById('f-branche').addEventListener('change', function() {
  document.getElementById('otherBrancheField').classList.toggle('visible', this.value === 'Anderes');
});
document.getElementById('f-zeitfresser').addEventListener('change', function() {
  document.getElementById('otherZeitfresserField').classList.toggle('visible', this.value === 'Etwas anderes');
});

if (leadForm) {
  let currentStep = 1;

  function updateProgress(step) {
    [1, 2, 3].forEach(i => {
      const s = document.getElementById(`pStep${i}`);
      const l = document.getElementById(`pLine${i}`);
      s.classList.remove('active', 'done');
      if (l) l.classList.remove('done');
      if (i < step) { s.classList.add('done'); s.textContent = '✓'; }
      else if (i === step) { s.classList.add('active'); s.textContent = String(i); }
      else { s.textContent = String(i); }
      if (l && i < step) l.classList.add('done');
    });
  }

  function goToStep(n) {
    leadForm.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
    const isBack = n < currentStep;
    currentStep = n;
    const nextEl = leadForm.querySelector(`[data-step="${currentStep}"]`);
    if (isBack) nextEl.classList.add('slide-left');
    nextEl.classList.add('active');
    setTimeout(() => nextEl.classList.remove('slide-left'), 280);
    updateProgress(currentStep);
    document.querySelector('.modal-card').scrollTop = 0;
  }

  function validate(step) {
    const err = document.getElementById(`err${step}`);
    err.style.display = 'none';
    if (step === 1) {
      const name  = leadForm.querySelector('[name="name"]').value.trim();
      const email = leadForm.querySelector('[name="email"]').value.trim();
      const firma = leadForm.querySelector('[name="unternehmen"]').value.trim();
      if (!name || !email || !firma) { err.textContent = 'Bitte alle drei Felder ausfüllen.'; err.style.display = 'block'; return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Bitte eine gültige E-Mail-Adresse eingeben.'; err.style.display = 'block'; return false; }
    }
    if (step === 2) {
      const b = leadForm.querySelector('[name="branche"]').value;
      const z = leadForm.querySelector('[name="zeitfresser"]').value;
      if (!b || !z) { err.textContent = 'Bitte beide Felder auswählen.'; err.style.display = 'block'; return false; }
    }
    if (step === 3) {
      const missing = ['stunden','umsatz','entscheider','dringlichkeit'].filter(n => !leadForm.querySelector(`[name="${n}"]:checked`));
      if (missing.length) { err.textContent = 'Bitte alle 4 Optionen anklicken.'; err.style.display = 'block'; return false; }
    }
    return true;
  }

  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => { if (validate(currentStep)) goToStep(parseInt(btn.dataset.next)); });
  });

  document.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.prev)));
  });

  leadForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate(3)) return;

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet…';

    const g  = name => leadForm.querySelector(`[name="${name}"]`);
    const gr = name => leadForm.querySelector(`[name="${name}"]:checked`);

    let brancheVal = g('branche').value;
    const brancheOther = g('branche_other')?.value.trim();
    if (brancheVal === 'Anderes' && brancheOther) brancheVal = `Anderes: ${brancheOther}`;

    let zeitfresserVal = g('zeitfresser').value;
    const zeitfresserOther = g('zeitfresser_other')?.value.trim();
    if (zeitfresserVal === 'Etwas anderes' && zeitfresserOther) zeitfresserVal = `Etwas anderes: ${zeitfresserOther}`;

    const v = {
      name:          g('name').value.trim(),
      email:         g('email').value.trim(),
      unternehmen:   g('unternehmen').value.trim(),
      branche:       brancheVal,
      zeitfresser:   zeitfresserVal,
      stunden:       gr('stunden')?.value || '',
      umsatz:        gr('umsatz')?.value || '',
      entscheider:   gr('entscheider')?.value || '',
      dringlichkeit: gr('dringlichkeit')?.value || '',
    };

    const field = (label, type, value) => ({ label, type, value, options: [{ id: value, text: value }] });

    const payload = { data: { fields: [
      field('Vorname und Nachname',                                'INPUT_TEXT',      v.name),
      field('E-Mail-Adresse',                                     'INPUT_EMAIL',     v.email),
      field('Unternehmensname',                                    'INPUT_TEXT',      v.unternehmen),
      field('In welcher Branche arbeitest du?',                   'DROPDOWN',        v.branche),
      field('Was frisst dir täglich die meiste Zeit?',            'DROPDOWN',        v.zeitfresser),
      field('Wie viele Stunden verlierst du damit pro Woche?',    'MULTIPLE_CHOICE', v.stunden),
      field('Was kommt in deinem Betrieb ungefähr pro Monat rein?', 'MULTIPLE_CHOICE', v.umsatz),
      field('Kannst du diese Investition selbst entscheiden?',    'MULTIPLE_CHOICE', v.entscheider),
      field('Wie dringend ist dieses Problem für dich?',          'MULTIPLE_CHOICE', v.dringlichkeit),
    ]}};

    try {
      const res = await fetch('https://n8n-production-608e.up.railway.app/webhook/graait-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-GrAIt-Secret': 'grait2026secret' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      document.getElementById('leadFormContainer').style.display = 'none';
      const s = document.getElementById('formSuccess');
      s.style.display = 'block';
      s.classList.add('visible');
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Anfrage senden →';
      const err = document.getElementById('err3');
      err.textContent = 'Etwas ist schiefgelaufen. Schreib uns direkt: seymen.pasa.d@gmail.com';
      err.style.display = 'block';
    }
  });
}

// =========================================
// SCROLL PROGRESS + BACK TO TOP
// =========================================
(function () {
  const progress = document.getElementById('scrollProgress');
  const btt = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0 && progress) progress.style.width = (window.scrollY / total * 100) + '%';
    if (btt) btt.classList.toggle('visible', window.scrollY > 800);
  }, { passive: true });

  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// =========================================
// ANALYSE BARS — animate on scroll
// =========================================
(function () {
  const section = document.querySelector('.analyse-section');
  if (!section) return;
  const bars = section.querySelectorAll('.asb-fill[data-width]');
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          bars.forEach(bar => { bar.style.width = bar.dataset.width; });
        }, 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(section);
})();

// =========================================
// ACTIVE NAV SECTION TRACKING
// =========================================
(function () {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navLinks.length) return;

  const sectionIds = [...navLinks].map(a => a.getAttribute('href').slice(1)).filter(Boolean);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('nav-active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px' });

  sections.forEach(s => obs.observe(s));
})();

// =========================================
// EMAIL COPY TOAST
// =========================================
(function () {
  const toastEl = document.getElementById('toastEl');
  if (!toastEl || !navigator.clipboard) return;

  let timer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toastEl.classList.remove('show'), 2500);
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      const email = link.href.replace('mailto:', '');
      navigator.clipboard.writeText(email)
        .then(() => showToast('✓ E-Mail kopiert'));
    });
  });
})();

// =========================================
// LIVE EXPOSÉ GENERATOR DEMO
// =========================================
(function () {
  const form      = document.getElementById('exposeForm');
  if (!form) return;

  const submitBtn = document.getElementById('exposeSubmitBtn');
  const errEl     = document.getElementById('exposeFormErr');
  const stateEmpty   = document.getElementById('exposeStateEmpty');
  const stateLoading = document.getElementById('exposeStateLoading');
  const stateResult  = document.getElementById('exposeStateResult');
  const resultBody   = document.getElementById('exposeResultBody');
  const genTimeEl    = document.getElementById('exposeGenTime');
  const copyBtn      = document.getElementById('exposeCopyBtn');
  const newBtn       = document.getElementById('exposeNewBtn');

  function setState(state) {
    stateEmpty.style.display   = state === 'empty'   ? 'flex' : 'none';
    stateLoading.style.display = state === 'loading' ? 'flex' : 'none';
    stateResult.style.display  = state === 'result'  ? 'flex' : 'none';
  }

  function renderMarkdown(text) {
    return text
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
      .replace(/<\/ul>\s*<ul>/g, '')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hpuol])(.+)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/---/g, '<hr>');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    errEl.style.display = 'none';

    const g = name => form.querySelector(`[name="${name}"]`)?.value.trim() || '';
    const payload = {
      objekttyp: g('objekttyp'),
      adresse:   g('adresse'),
      zimmer:    g('zimmer'),
      flaeche:   g('flaeche'),
      preis:     g('preis'),
      details:   g('details'),
      lage:      g('lage'),
    };

    if (!payload.adresse) {
      errEl.textContent = 'Bitte Adresse eingeben.';
      errEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    setState('loading');
    const startTime = Date.now();

    try {
      const res = await fetch('https://n8n-production-608e.up.railway.app/webhook/expose-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-GrAIt-Secret': 'grait2026secret' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = await res.text();
      let text = raw;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) text = parsed[0]?.text || raw;
        else if (parsed.text) text = parsed.text;
      } catch (_) {}

      const elapsed = Math.round((Date.now() - startTime) / 1000);
      genTimeEl.textContent = elapsed;
      resultBody.innerHTML = renderMarkdown(text);
      setState('result');
    } catch (err) {
      setState('empty');
      errEl.textContent = 'Fehler beim Generieren — bitte nochmal versuchen.';
      errEl.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = resultBody.innerText;
      navigator.clipboard?.writeText(text).then(() => {
        copyBtn.textContent = '✓ Kopiert!';
        setTimeout(() => { copyBtn.textContent = 'Kopieren'; }, 2000);
      });
    });
  }

  if (newBtn) {
    newBtn.addEventListener('click', () => {
      setState('empty');
      submitBtn.disabled = false;
    });
  }
})();
