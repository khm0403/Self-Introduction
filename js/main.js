/* =========================================================
   main.js — 나를 소개하는 웹페이지

   설계 원칙: "사용자 이벤트 → 상태 변경 → 화면 업데이트"

     - 모든 상태는 아래 state 객체 한 곳에만 있다. (유일한 진실)
     - set*() 은 state 를 바꾸고 render*() 를 부른다.
     - render*() 는 오직 state 만 보고 화면을 그린다. 화면에서 상태를 읽지 않는다.

   구현한 흐름 5가지
     1) 햄버거 클릭   → state.menuOpen            → 서랍 메뉴 + 버튼 X자
     2) 스크롤        → state.scrolled / showScrollTop → 헤더 배경 / 맨위로 버튼
     3) 토글 클릭     → state.theme               → 전체 색상 (+ localStorage)
     4) API 호출      → state.projects.status     → 로딩·성공·에러·빈 화면
     5) 폼 제출/입력  → state.form.errors         → 에러 문구 + 테두리
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
   2. 상태(state) — 이 페이지의 "지금 상황"을 담는 유일한 곳
   ========================================================= */
const state = {
  menuOpen: false,          // 햄버거 메뉴가 열려 있는가

  scrolled: false,          // 헤더 배경을 바꿀 만큼 내려왔는가
  showScrollTop: false,     // 맨 위로 버튼을 보일 만큼 내려왔는가

  theme: 'light',           // 'light' | 'dark'

  projects: {
    status: 'loading',      // 'loading' | 'success' | 'error' | 'empty'
    repos: [],              // status가 'success'일 때의 저장소 목록
    error: '',              // status가 'error'일 때의 안내 문구
  },

  form: {
    errors: { name: '', email: '', message: '' },  // 빈 문자열이면 통과
    success: '',
  },
};

/* =========================================================
   3. 햄버거 메뉴 — state.menuOpen
   ========================================================= */
const renderMenu = () => {
  navMenu.classList.toggle('active', state.menuOpen);
  navToggle.classList.toggle('active', state.menuOpen);
};

const setMenuOpen = (isOpen) => {
  state.menuOpen = isOpen;
  renderMenu();
};

navToggle.addEventListener('click', () => {
  setMenuOpen(!state.menuOpen); // 화면이 아니라 state에서 현재 값을 읽는다
});

// 메뉴 항목을 누르면 이동과 동시에 서랍을 닫는다
navLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

/* =========================================================
   4. 스크롤 — state.scrolled / state.showScrollTop
   ========================================================= */
const renderScroll = () => {
  header.classList.toggle('header--scrolled', state.scrolled);
  scrollTopBtn.classList.toggle('active', state.showScrollTop);
};

const handleScroll = () => {
  const y = window.scrollY;
  const scrolled = y > HEADER_SCROLL_THRESHOLD;
  const showScrollTop = y > SCROLL_TOP_THRESHOLD;

  // 값이 그대로면 다시 그리지 않는다 (스크롤은 초당 수십 번 발생한다)
  if (scrolled === state.scrolled && showScrollTop === state.showScrollTop) return;

  state.scrolled = scrolled;
  state.showScrollTop = showScrollTop;
  renderScroll();
};

window.addEventListener('scroll', handleScroll);
renderScroll(); // 새로고침으로 중간 위치에서 시작한 경우를 위해 1회 실행
handleScroll();

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   5. 다크 모드 — state.theme (+ localStorage에 보존)
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

const renderTheme = () => {
  document.documentElement.setAttribute('data-theme', state.theme);
  themeIcon.textContent = state.theme === 'dark' ? '☀️' : '🌙';
};

const setTheme = (theme) => {
  state.theme = theme;
  renderTheme();
  storeTheme(theme);
};

// 저장된 값이 있으면 그것으로, 없으면 라이트 모드로 시작한다
setTheme(readStoredTheme() || 'light');

themeToggle.addEventListener('click', () => {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
});

/* =========================================================
   6. GitHub API — state.projects.status (로딩 / 성공 / 에러 / 빈)
   ========================================================= */

// GitHub 저장소 설명에 <, &, " 등이 들어와도 화면이 깨지지 않게 한다
const escapeHTML = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

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

// state.projects 만 보고 네 가지 상태 중 하나를 그린다
const renderProjects = () => {
  const { status, repos, error } = state.projects;

  if (status === 'loading') {
    projectsGrid.innerHTML = '';
    projectsStatus.innerHTML = `
      <div class="status">
        <div class="status__spinner"></div>
        <p>프로젝트를 불러오는 중...</p>
      </div>`;
    return;
  }

  if (status === 'error') {
    projectsGrid.innerHTML = '';
    projectsStatus.innerHTML = `
      <div class="status status--error">
        <p>${escapeHTML(error)}</p>
        <button type="button" class="btn btn--outline" id="retry-btn">다시 시도</button>
      </div>`;
    // 방금 만들어진 버튼이라 여기서 이벤트를 연결한다
    document.querySelector('#retry-btn').addEventListener('click', loadProjects);
    return;
  }

  if (status === 'empty') {
    projectsGrid.innerHTML = '';
    projectsStatus.innerHTML = `
      <div class="status">
        <p>표시할 프로젝트가 없습니다.</p>
      </div>`;
    return;
  }

  // status === 'success'
  projectsStatus.innerHTML = '';
  projectsGrid.innerHTML = repos.map(createProjectCard).join('');
};

const setProjects = (patch) => {
  Object.assign(state.projects, patch);
  renderProjects();
};

const loadProjects = async () => {
  setProjects({ status: 'loading', repos: [], error: '' });

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

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

    setProjects(
      repos.length === 0 ? { status: 'empty' } : { status: 'success', repos }
    );
  } catch (error) {
    setProjects({
      status: 'error',
      error: error.message || '프로젝트를 불러올 수 없습니다.',
    });
  }
};

loadProjects();

/* =========================================================
   7. Contact 폼 — state.form.errors / state.form.success
   ========================================================= */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formFields = [
  {
    key: 'name',
    input: document.querySelector('#name'),
    error: document.querySelector('#name-error'),
    validate: (value) => (value.trim() === '' ? '이름을 입력해주세요.' : ''),
  },
  {
    key: 'email',
    input: document.querySelector('#email'),
    error: document.querySelector('#email-error'),
    validate: (value) => {
      if (value.trim() === '') return '이메일을 입력해주세요.';
      if (!EMAIL_PATTERN.test(value.trim())) return '올바른 이메일 형식이 아닙니다.';
      return '';
    },
  },
  {
    key: 'message',
    input: document.querySelector('#message'),
    error: document.querySelector('#message-error'),
    validate: (value) => (value.trim() === '' ? '메시지를 입력해주세요.' : ''),
  },
];

// state.form 만 보고 에러 문구와 테두리를 그린다
const renderForm = () => {
  formFields.forEach((field) => {
    const message = state.form.errors[field.key];
    field.error.textContent = message;
    field.input.classList.toggle('is-invalid', message !== '');
  });

  formSuccess.textContent = state.form.success;
};

const setFieldError = (key, message) => {
  state.form.errors[key] = message;
  renderForm();
};

// 이미 에러가 뜬 필드는 입력하는 즉시 다시 검사해준다
formFields.forEach((field) => {
  field.input.addEventListener('input', () => {
    if (state.form.errors[field.key] !== '') {
      setFieldError(field.key, field.validate(field.input.value));
    }
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  let firstInvalidInput = null;

  formFields.forEach((field) => {
    const message = field.validate(field.input.value);
    state.form.errors[field.key] = message;
    if (message !== '' && firstInvalidInput === null) {
      firstInvalidInput = field.input;
    }
  });

  state.form.success =
    firstInvalidInput === null ? '메시지가 전송되었습니다. 감사합니다!' : '';

  renderForm();

  if (firstInvalidInput !== null) {
    firstInvalidInput.focus();
    return;
  }

  contactForm.reset();
});

/* =========================================================
   8. 스크롤 애니메이션 (IntersectionObserver)
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
