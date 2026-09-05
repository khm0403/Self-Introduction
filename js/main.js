/* =========================================================
   main.js — 나를 소개하는 웹페이지
   "사용자 이벤트 → 상태 변경 → 화면 업데이트" 흐름 4가지
     1) 햄버거 클릭   → 메뉴 열림/닫힘 상태 → 메뉴 표시
     2) 스크롤        → 스크롤 위치 상태   → 헤더 배경 / 스크롤탑 버튼
     3) 토글 클릭     → 테마 상태          → 전체 색상 + localStorage
     4) API 호출/제출 → 로딩·성공·에러·빈  → Projects 섹션 / 폼 에러
   ========================================================= */

'use strict';

/* =========================================================
   0. 설정값 (README에 명시)
   ========================================================= */
const GITHUB_USERNAME = 'khm0403';
const HEADER_SCROLL_THRESHOLD = 60;   // 헤더 배경이 바뀌는 스크롤 위치(px)
const SCROLL_TOP_THRESHOLD = 300;     // 스크롤탑 버튼이 나타나는 위치(px)
const OBSERVER_THRESHOLD = 0.2;       // 스크롤 애니메이션 임계값
const THEME_STORAGE_KEY = 'portfolio-theme';

/* =========================================================
   1. 요소 참조
   ========================================================= */
const header = document.querySelector('#header');
const navToggle = document.querySelector('#nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('#theme-icon');

const scrollTopBtn = document.querySelector('#scroll-top');

const projectsStatus = document.querySelector('#projects-status');
const projectsGrid = document.querySelector('#projects-grid');

const contactForm = document.querySelector('#contact-form');
const formSuccess = document.querySelector('#form-success');

/* =========================================================
   2. 햄버거 메뉴 토글
   ========================================================= */
const setMenuOpen = (isOpen) => {
  navMenu.classList.toggle('active', isOpen);
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
};

navToggle.addEventListener('click', () => {
  setMenuOpen(!navMenu.classList.contains('active'));
});

// 메뉴 항목을 누르면 이동과 동시에 서랍을 닫는다
navLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

/* =========================================================
   3. 스크롤 — 헤더 배경 변경 + 스크롤탑 버튼
   ========================================================= */
const handleScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('header--scrolled', y > HEADER_SCROLL_THRESHOLD);
  scrollTopBtn.classList.toggle('active', y > SCROLL_TOP_THRESHOLD);
};

window.addEventListener('scroll', handleScroll);
handleScroll(); // 새로고침으로 중간 위치에서 시작한 경우를 위해 1회 실행

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   4. 다크 모드 — 상태를 localStorage에 보존
   ========================================================= */
const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null; // 시크릿 모드 등에서 접근이 막힐 수 있다
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    /* 저장 실패해도 화면 동작은 계속된다 */
  }
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
  );
};

applyTheme(readStoredTheme() || 'light');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
});

/* =========================================================
   5. GitHub API — 로딩 / 성공 / 에러 / 빈 상태
   ========================================================= */

// GitHub 저장소 설명에 <, &, " 등이 들어와도 화면이 깨지지 않게 한다
const escapeHTML = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderLoading = () => {
  projectsGrid.innerHTML = '';
  projectsStatus.innerHTML = `
    <div class="status">
      <div class="status__spinner" aria-hidden="true"></div>
      <p>프로젝트를 불러오는 중...</p>
    </div>`;
};

const renderEmpty = () => {
  projectsGrid.innerHTML = '';
  projectsStatus.innerHTML = `
    <div class="status">
      <p>표시할 프로젝트가 없습니다.</p>
    </div>`;
};

const renderError = (message) => {
  projectsGrid.innerHTML = '';
  projectsStatus.innerHTML = `
    <div class="status status--error">
      <p>${escapeHTML(message)}</p>
      <button type="button" class="btn btn--outline" id="retry-btn">다시 시도</button>
    </div>`;

  document.querySelector('#retry-btn').addEventListener('click', loadProjects);
};

const createProjectCard = (repo) => {
  const { name, description, html_url, language, stargazers_count, forks_count } = repo;

  return `
    <article class="project-card">
      <h3 class="project-card__title">${escapeHTML(name)}</h3>
      <p class="project-card__desc">${escapeHTML(description || '설명이 등록되지 않은 저장소입니다.')}</p>
      <div class="project-card__meta">
        ${language ? `<span class="project-card__lang">${escapeHTML(language)}</span>` : ''}
        <span>⭐ ${stargazers_count}</span>
        <span>🍴 ${forks_count}</span>
      </div>
      <a class="project-card__link" href="${escapeHTML(html_url)}"
         target="_blank" rel="noopener noreferrer">GitHub에서 보기 →</a>
    </article>`;
};

const renderProjects = (repos) => {
  projectsStatus.innerHTML = '';
  projectsGrid.innerHTML = repos.map(createProjectCard).join('');
};

const loadProjects = async () => {
  renderLoading();

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      }
      if (response.status === 404) {
        throw new Error(`'${GITHUB_USERNAME}' 사용자를 찾을 수 없습니다.`);
      }
      throw new Error('프로젝트를 불러올 수 없습니다.');
    }

    const repos = await response.json();
    const ownRepos = repos.filter((repo) => !repo.fork);

    if (ownRepos.length === 0) {
      renderEmpty();
      return;
    }

    renderProjects(ownRepos);
  } catch (error) {
    renderError(error.message || '프로젝트를 불러올 수 없습니다.');
  }
};

loadProjects();

/* =========================================================
   6. Contact 폼 유효성 검사
   ========================================================= */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formFields = [
  {
    input: document.querySelector('#name'),
    error: document.querySelector('#name-error'),
    validate: (value) => (value.trim() === '' ? '이름을 입력해주세요.' : ''),
  },
  {
    input: document.querySelector('#email'),
    error: document.querySelector('#email-error'),
    validate: (value) => {
      if (value.trim() === '') return '이메일을 입력해주세요.';
      if (!EMAIL_PATTERN.test(value.trim())) return '올바른 이메일 형식이 아닙니다.';
      return '';
    },
  },
  {
    input: document.querySelector('#message'),
    error: document.querySelector('#message-error'),
    validate: (value) => {
      if (value.trim() === '') return '메시지를 입력해주세요.';
      if (value.trim().length < 10) return '메시지를 10자 이상 입력해주세요.';
      return '';
    },
  },
];

const showFieldError = (field, message) => {
  const hasError = message !== '';
  field.error.textContent = message;
  field.input.classList.toggle('is-invalid', hasError);
  field.input.setAttribute('aria-invalid', String(hasError));
};

// 이미 에러가 뜬 필드는 입력하는 즉시 다시 검사해준다
formFields.forEach((field) => {
  field.input.addEventListener('input', () => {
    if (field.error.textContent !== '') {
      showFieldError(field, field.validate(field.input.value));
    }
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formSuccess.textContent = '';

  let firstInvalidInput = null;

  formFields.forEach((field) => {
    const message = field.validate(field.input.value);
    showFieldError(field, message);
    if (message !== '' && firstInvalidInput === null) {
      firstInvalidInput = field.input;
    }
  });

  if (firstInvalidInput !== null) {
    firstInvalidInput.focus();
    return;
  }

  formSuccess.textContent = '메시지가 전송되었습니다. 감사합니다!';
  contactForm.reset();
});

/* =========================================================
   7. 스크롤 애니메이션 (IntersectionObserver)
   ========================================================= */
const revealTargets = document.querySelectorAll(
  '.hero__inner, .section__title, .section__subtitle, .about__content, .skills__groups, .form, .footer__inner'
);

revealTargets.forEach((element) => element.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // 한 번 나타나면 그만 관찰한다
      }
    });
  },
  { threshold: OBSERVER_THRESHOLD }
);

revealTargets.forEach((element) => revealObserver.observe(element));
