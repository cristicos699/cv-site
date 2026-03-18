const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const mailHref = (email) => `mailto:${email}`;
const telHref = (phone) => `tel:${phone.replace(/\s+/g, '')}`;

const state = {
  roleIndex: 0,
  roleChar: 0,
  deleting: false
};

function setActions() {
  $('#availabilityText').textContent = cvData.availability;
  $('#heroHeadline').textContent = cvData.heroHeadline || cvData.name;
  $('#heroSubheadline').textContent = cvData.heroSubheadline || cvData.role;
  $('#heroStatement').textContent = cvData.heroStatement || cvData.profile;
  $('#heroIntro').textContent = cvData.profile;
  $('#heroName').textContent = cvData.name;
  $('#heroRole').textContent = cvData.role;
  $('#heroTagline').textContent = cvData.tagline;
  $('#aboutText').textContent = cvData.profile;
  $('#emailLabel').textContent = cvData.email;
  $('#phoneLabel').textContent = cvData.phone;
  $('#footerLine').textContent = `${cvData.name} • ${cvData.role} • ${cvData.location}`;

  const actionLinks = [
    ['#navCv', cvData.cvFile],
    ['#heroCv', cvData.cvFile],
    ['#navMail', mailHref(cvData.email)],
    ['#heroMail', mailHref(cvData.email)],
    ['#heroLinkedin', cvData.social.linkedin],
    ['#callCard', telHref(cvData.phone)]
  ];

  actionLinks.forEach(([selector, href]) => {
    const element = $(selector);
    if (element) element.href = href;
  });
}

function renderStats() {
  $('#heroMetrics').innerHTML = cvData.stats
    .map(
      (item) => `
        <article class="metric-card">
          <strong>${item.value}</strong>
          <span>${item.label}</span>
        </article>
      `
    )
    .join('');
}

function renderFocus() {
  $('#focusTiles').innerHTML = cvData.focus
    .map(
      (item) => `
        <article class="focus-tile">
          <strong>${item.title}</strong>
          <span>${item.text}</span>
        </article>
      `
    )
    .join('');
}

function renderFacts() {
  $('#factList').innerHTML = cvData.quickFacts
    .map(
      (item) => `
        <article class="fact-item">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </article>
      `
    )
    .join('');
}

function renderEducation() {
  $('#educationPeriod').textContent = cvData.education.period;
  $('#educationInstitution').textContent = cvData.education.institution;
  $('#educationFaculty').textContent = cvData.education.faculty;
  $('#educationDegree').textContent = cvData.education.degree;
  $('#educationExtra').textContent = cvData.education.extra;

  $('#courseTags').innerHTML = cvData.coursework.map((item) => `<span>${item}</span>`).join('');
}

function renderProjects() {
  $('#projectGrid').innerHTML = cvData.projects
    .map(
      (project) => `
        <article class="glass project-card spotlight-card reveal delay-1">
          <div class="project-top">
            <div>
              <span class="project-kicker">${project.accent}</span>
              <h3>${project.title}</h3>
              <p class="project-subtitle">${project.subtitle}</p>
            </div>
          </div>
          <p class="project-summary">${project.summary}</p>
          <ul class="project-list">
            ${project.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
          </ul>
        </article>
      `
    )
    .join('');
}

function renderExperience() {
  $('#timeline').innerHTML = cvData.experience
    .map(
      (item) => `
        <article class="timeline-item reveal delay-1">
          <div>
            <span class="timeline-tag">${item.type}</span>
          </div>
          <div class="timeline-content">
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}</ul>
          </div>
        </article>
      `
    )
    .join('');
}

function renderSkills() {
  $('#skillCloud').innerHTML = cvData.skills.map((skill) => `<span>${skill}</span>`).join('');

  $('#skillGroups').innerHTML = cvData.skillGroups
    .map(
      (group) => `
        <article class="skill-group">
          <h3>${group.title}</h3>
          <p>${group.items.join(' • ')}</p>
        </article>
      `
    )
    .join('');

  $('#languageList').innerHTML = cvData.languages
    .map(
      (language) => `
        <article class="language-item">
          <span>${language.name}</span>
          <strong>${language.level}</strong>
        </article>
      `
    )
    .join('');
}

function renderContact() {
  $('#contactActions').innerHTML = `
    <a class="btn btn-primary magnetic" href="${mailHref(cvData.email)}">Send email</a>
    <a class="btn btn-secondary magnetic" href="${telHref(cvData.phone)}">Call</a>
    <a class="btn btn-secondary magnetic" href="${cvData.social.github}" target="_blank" rel="noreferrer">GitHub</a>
    <a class="btn btn-secondary magnetic" href="${cvData.social.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
    <a class="btn btn-ghost magnetic" href="${cvData.cvFile}" target="_blank" rel="noreferrer">Updated CV</a>
  `;

  $('#floatingDock').innerHTML = `
    <a href="${mailHref(cvData.email)}" aria-label="Email">✉️</a>
    <a href="${telHref(cvData.phone)}" aria-label="Phone">📞</a>
    <a href="${cvData.social.github}" target="_blank" rel="noreferrer" aria-label="GitHub">💻</a>
    <a href="${cvData.social.linkedin}" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
    <a href="${cvData.cvFile}" target="_blank" rel="noreferrer" aria-label="CV">CV</a>
  `;
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.14 }
  );

  $$('.reveal').forEach((item) => observer.observe(item));
}

function initTyping() {
  const target = $('#typingText');

  function step() {
    const current = cvData.heroRoles[state.roleIndex];

    if (!state.deleting) {
      state.roleChar += 1;
      target.textContent = current.slice(0, state.roleChar);

      if (state.roleChar === current.length) {
        state.deleting = true;
        setTimeout(step, 1200);
        return;
      }
    } else {
      state.roleChar -= 1;
      target.textContent = current.slice(0, state.roleChar);

      if (state.roleChar === 0) {
        state.deleting = false;
        state.roleIndex = (state.roleIndex + 1) % cvData.heroRoles.length;
      }
    }

    setTimeout(step, state.deleting ? 42 : 88);
  }

  step();
}

function initMenu() {
  const nav = $('#siteNav');
  const toggle = $('#menuToggle');
  toggle.addEventListener('click', () => nav.classList.toggle('open'));

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

function initActiveNav() {
  const sections = $$('main section[id]');
  const links = $$('#siteNav a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initHeaderShadow() {
  const header = $('#siteHeader');
  window.addEventListener('scroll', () => {
    header.style.filter = window.scrollY > 8 ? 'drop-shadow(0 20px 30px rgba(15,23,42,0.08))' : 'none';
  });
}

function initSpotlights() {
  $$('.spotlight-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    });
  });
}

function initCopyEmail() {
  const button = $('#copyEmailBtn');
  const toast = $('#toast');

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(cvData.email);
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1800);
    } catch {
      window.location.href = mailHref(cvData.email);
    }
  });
}

function initMagnetic() {
  $$('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    element.addEventListener('pointerleave', () => {
      element.style.transform = 'translate(0, 0)';
    });
  });
}

function init() {
  setActions();
  renderStats();
  renderFocus();
  renderFacts();
  renderEducation();
  renderProjects();
  renderExperience();
  renderSkills();
  renderContact();
  initReveal();
  initTyping();
  initMenu();
  initActiveNav();
  initHeaderShadow();
  initSpotlights();
  initCopyEmail();
  initMagnetic();
}

document.addEventListener('DOMContentLoaded', init);
