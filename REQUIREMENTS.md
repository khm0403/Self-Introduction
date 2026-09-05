# 요구사항 정의서 — 나를 소개하는 반응형 포트폴리오 웹페이지

> 원문: `미션 - AI 도구 학습.pdf` (AI/SW 기초 / 웹 기초와 프론트엔드 / 80시간)

## 0. 한 줄 정의

외부 라이브러리 없이 **HTML + CSS + JavaScript 3개 파일만으로**, 내 GitHub 저장소 목록을
실시간으로 불러와 보여주는 개인 소개 사이트를 만들고 **GitHub Pages에 배포**한다.

채점의 핵심은 디자인 완성도가 아니라
**"사용자 이벤트 → 상태 변경 → 화면 갱신" 흐름을 코드로 증명했는가** 이다. (제약사항 7항 명시)

---

## 1. 제출물 (3종 — 하나라도 없으면 미완)

| ID | 제출물 | 형태 |
|----|--------|------|
| D-1 | GitHub 저장소 URL | 소스코드 공개 |
| D-2 | 배포된 사이트 URL | GitHub Pages (`https://{아이디}.github.io/{저장소명}/`) |
| D-3 | 스크린샷 3장 | 데스크톱 / 모바일 / 다크모드 |
| D-4 | README.md | 프로젝트 설명 + 사용 기술 + 배포 URL + 스크린샷 + **임계값 명시** |

> D-4의 "임계값 명시": 스크롤탑 버튼 기준(300px), 네비 배경 변경 기준(60px),
> Intersection Observer threshold(0.2) — 값은 바꿔도 되지만 README에 적어야 함.

---

## 2. 프로젝트 구조 (F-01)

```
포트폴리오/
├── index.html          # 메인 페이지 (단 하나)
├── css/
│   └── style.css       # 외부 스타일시트
├── js/
│   └── main.js         # defer 속성으로 연결
├── images/
│   └── profile.jpg
└── README.md
```

- [ ] F-01-1 위 4개 역할(html/css/js/images)이 폴더로 분리되어 있다
- [ ] F-01-2 CSS는 `<link rel="stylesheet">`, JS는 `<script defer src>` 로 연결
- [ ] F-01-3 VS Code + Live Server 확장으로 개발 (저장 시 브라우저 자동 새로고침)

---

## 3. HTML 구조 (F-02)

- [ ] F-02-1 `<div>` 남발 금지. `<header> <nav> <main> <section> <article> <footer>` 사용
- [ ] F-02-2 6개 섹션 존재: **Hero / About / Skills / Projects / Contact / Footer**
  - Hero: 인사말 + CTA 버튼 2개
  - About: 자기소개 텍스트 + 프로필 이미지
  - Skills: 기술 스택 목록
  - Projects: GitHub API로 채워지는 빈 컨테이너
  - Contact: 이름/이메일/메시지 폼
  - Footer: 저작권 + 소셜 링크
- [ ] F-02-3 네비게이션에 `href="#about"` 형태의 앵커 링크 (섹션 `id`와 일치)
- [ ] F-02-4 모든 `<img>`에 의미 있는 `alt` 속성
- [ ] F-02-5 모든 폼 입력에 `<label for="name">` ↔ `<input id="name">` 매칭

---

## 4. CSS (F-03)

### 4-1. 변수
- [ ] F-03-1 `:root { --color-bg: ...; --color-text: ...; --space-md: ...; }` 로 색/폰트/간격 정의
- [ ] F-03-2 `[data-theme="dark"] { --color-bg: ...; }` 로 다크모드 값 재정의

### 4-2. 레이아웃 (기술 지정됨 — 마음대로 바꾸면 감점)
- [ ] F-03-3 네비게이션 → **Flexbox** (로고 왼쪽, 메뉴 오른쪽)
- [ ] F-03-4 Projects 카드 → **Grid** + `repeat(auto-fit, minmax(280px, 1fr))`

### 4-3. 반응형
- [ ] F-03-5 **모바일 퍼스트** (기본 CSS = 모바일, `min-width` 미디어쿼리로 확장)
- [ ] F-03-6 브레이크포인트 `768px`(태블릿), `1024px`(데스크톱)
- [ ] F-03-7 모바일에서 네비 메뉴 숨김 + 햄버거 버튼 표시

### 4-4. 시각 효과
- [ ] F-03-8 버튼·카드에 `:hover` + `transition`
- [ ] F-03-9 카드에 `box-shadow`

---

## 5. JavaScript 기본기 (F-04)

- [ ] F-04-1 `var` 금지 — `const`, `let`만
- [ ] F-04-2 HTML에 `onclick="..."` 금지 — `addEventListener`만
- [ ] F-04-3 인라인 `style="..."` 금지 — 클래스 토글로 스타일 변경
- [ ] F-04-4 요소 선택: `querySelector`, `querySelectorAll`
- [ ] F-04-5 내용 변경: `textContent`, `innerHTML`
- [ ] F-04-6 클래스 조작: `classList.add / remove / toggle`
- [ ] F-04-7 이벤트 4종 사용: `click`, `submit`, `scroll`, `input`
- [ ] F-04-8 `event.preventDefault()` 사용

---

## 6. 인터랙션 6종 (F-05) — 전부 동작해야 함

| ID | 기능 | 동작 조건 | 핵심 API |
|----|------|-----------|----------|
| F-05-a | 햄버거 메뉴 | 모바일에서 클릭 시 메뉴 열림/닫힘 | `classList.toggle('active')` |
| F-05-b | 부드러운 스크롤 | 메뉴 클릭 시 해당 섹션으로 스르륵 이동 | `scrollIntoView({behavior:'smooth'})` 또는 CSS `scroll-behavior` |
| F-05-c | 스크롤탑 버튼 | 스크롤 **300px 이상**에서 등장, 클릭 시 최상단 | `window.scrollY`, `scrollTo` |
| F-05-d | 네비 스타일 변경 | 스크롤 **60px 이상**에서 배경색 변경 | `scroll` 이벤트 + 클래스 토글 |
| F-05-e | 다크 모드 | 토글 클릭 시 테마 전환 + **새로고침 후 유지** | `localStorage`, `data-theme` 속성 |
| F-05-f | 스크롤 애니메이션 | 섹션이 화면에 들어오면 fade-in | `IntersectionObserver` (threshold ≥ 0.2) |

---

## 7. 폼 UX (F-06)

- [ ] F-06-1 이름 / 이메일 / 메시지 입력 필드
- [ ] F-06-2 빈 필드 제출 차단 (필수값 검증)
- [ ] F-06-3 이메일 형식 검증 (정규식)
- [ ] F-06-4 에러 메시지를 **해당 입력 필드 바로 아래**에 표시
- [ ] F-06-5 제출 시 `preventDefault()` → 페이지 새로고침 막고 성공 메시지 표시

---

## 8. ES6+ 문법 (F-07) — 사용 흔적이 코드에 있어야 함

- [ ] F-07-1 화살표 함수 `() => {}`
- [ ] F-07-2 템플릿 리터럴 `` `<div>${name}</div>` `` 로 HTML 동적 생성
- [ ] F-07-3 구조분해 할당 `const { name, stargazers_count } = repo;`
- [ ] F-07-4 `map()` — GitHub 데이터 → HTML 카드 변환
- [ ] F-07-5 `forEach()` — 배열 순회
- [ ] F-07-6 `filter()` — 조건부 표시 *(선택)*

---

## 9. GitHub API 연동 (F-08) — 이 과제의 최난이도

- 엔드포인트: `https://api.github.com/users/{내아이디}/repos`
- [ ] F-08-1 `fetch` + `async/await` 로 호출
- [ ] F-08-2 `try / catch` 로 에러 처리
- [ ] F-08-3 **4가지 상태를 전부 UI로 구현**

| 상태 | 화면 |
|------|------|
| 로딩 | 스피너 또는 "로딩 중..." |
| 성공 | 카드 리스트 렌더링 |
| 에러 | "프로젝트를 불러올 수 없습니다" + **[다시 시도] 버튼** |
| 빈 데이터 | "표시할 프로젝트가 없습니다" |

- [ ] F-08-4 레이트 리밋(403, 시간당 60회) 발생 시에도 에러 UI가 뜨는지 확인
  - 테스트 팁: 잘못된 아이디로 호출하면 404 → 에러 UI 확인 가능

---

## 10. 상태 관리 패턴 (F-09) — **채점 핵심**

"이벤트 → 상태 변경 → 화면 업데이트" 흐름이 **3개 이상** 코드에서 명확히 드러나야 한다.

| # | 이벤트 | 상태 | 렌더링 |
|---|--------|------|--------|
| 1 | 토글 버튼 클릭 | `theme = 'dark'` | `<html data-theme>` 변경 → 전체 색상 전환 |
| 2 | 페이지 로드 / 재시도 클릭 | `status = loading→success/error` | Projects 섹션 내용 교체 |
| 3 | 폼 제출 / 입력 | `errors = {email: '형식오류'}` | 에러 메시지 표시·숨김 |
| 4 | 필터 버튼 클릭 *(선택)* | `filter = 'JavaScript'` | 카드 목록 재렌더링 |

> 구현 규칙: 상태를 변수에 담고, **상태를 바꾸는 함수**와 **상태를 보고 그리는 함수**를 분리한다.
> DOM을 직접 여기저기서 건드리지 않는다. (React 학습을 위한 사전 훈련)

---

## 11. 금지 / 허용

| 금지 | 허용 |
|------|------|
| React, Vue, jQuery, Bootstrap, Tailwind | Font Awesome (아이콘) |
| 모든 외부 JS/CSS 라이브러리 | Google Fonts (웹폰트) |
| `var`, `onclick=`, `style="..."` | 최신 Chrome 기준 동작 |

---

## 12. 완료 기준 (Definition of Done)

배포된 URL을 Chrome에서 열었을 때 아래가 전부 통과해야 완료:

1. [ ] 창 너비를 375px → 768px → 1440px로 줄였다 늘렸을 때 레이아웃이 깨지지 않는다
2. [ ] 375px에서 햄버거 버튼이 보이고, 클릭하면 메뉴가 열린다
3. [ ] 메뉴 클릭 시 해당 섹션으로 부드럽게 이동한다
4. [ ] 아래로 스크롤하면 네비 배경이 바뀌고, 스크롤탑 버튼이 나타난다
5. [ ] 다크모드 토글 → 색 전환 → **F5 새로고침 후에도 다크모드 유지**
6. [ ] Projects 섹션에 내 실제 GitHub 저장소가 카드로 뜬다
7. [ ] 네트워크를 끊고 새로고침하면 에러 메시지 + 재시도 버튼이 뜬다
8. [ ] 폼을 빈 채로 제출 → 에러 메시지, 잘못된 이메일 → 형식 에러, 정상 입력 → 성공 메시지
9. [ ] 스크롤 시 섹션이 fade-in 된다
10. [ ] README에 배포 URL, 스크린샷 3장, 임계값이 적혀 있다

---

## 13. 권장 작업 순서 (의존성 순)

```
1단계  폴더 구조 + index.html 뼈대(시맨틱 태그 6섹션)      → F-01, F-02
2단계  CSS 변수 + 모바일 퍼스트 기본 스타일               → F-03-1,5
3단계  네비 Flexbox + 미디어쿼리 + 햄버거 CSS             → F-03-3,6,7
4단계  main.js 연결 + 햄버거 토글 + 부드러운 스크롤        → F-04, F-05-a,b
5단계  스크롤 이벤트(네비 색, 스크롤탑 버튼)               → F-05-c,d
6단계  다크모드 + localStorage                           → F-03-2, F-05-e
7단계  GitHub API fetch + 4상태 UI + Grid 카드            → F-08, F-03-4, F-07
8단계  Contact 폼 유효성 검사                            → F-06
9단계  IntersectionObserver 스크롤 애니메이션             → F-05-f
10단계 README 작성 + GitHub Pages 배포 + 스크린샷         → D-1~D-4
```

7단계(API)가 가장 어렵고, 6·8단계가 "상태 관리 패턴" 점수의 핵심이다.
