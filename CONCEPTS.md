# 개념 정리 — 이 프로젝트에서 실제로 쓴 것들

이 프로젝트에 들어간 개념을 **작성한 순서대로** 정리했습니다.
설명마다 `index.html`, `css/style.css`, `js/main.js`의 실제 코드를 근거로 들었습니다.

- [0. 큰 그림 — 브라우저가 페이지를 만드는 순서](#0-큰-그림--브라우저가-페이지를-만드는-순서)
- [1. HTML](#1-html)
- [2. CSS](#2-css)
- [3. JavaScript](#3-javascript)
- [4. 과제 목표 6문항 답안](#4-과제-목표-6문항-답안)
- [5. 자주 하는 실수](#5-자주-하는-실수)

---

## 0. 큰 그림 — 브라우저가 페이지를 만드는 순서

주소창에 URL을 치면 브라우저는 이 순서로 움직입니다.

```
1. HTML 파일을 받아 위에서 아래로 읽는다
2. 읽으면서 DOM(문서 객체 모델)이라는 나무 구조를 메모리에 만든다
3. <link>를 만나면 CSS를 받아 CSSOM(스타일 규칙 표)을 만든다
4. DOM + CSSOM을 합쳐 "무엇을 어디에 어떤 모양으로" 그릴지 계산한다
5. 화면에 그린다 (렌더링)
6. defer가 붙은 JS를 실행한다 → JS가 DOM을 바꾸면 4~5를 다시 한다
```

세 언어의 역할은 이렇게 나뉩니다.

| 언어 | 역할 | 결과물 |
|------|------|--------|
| HTML | 무엇이 있는가 (구조·의미) | DOM |
| CSS | 어떻게 보이는가 (모양) | CSSOM |
| JavaScript | 무엇을 하는가 (동작) | DOM을 바꿈 |

**중요한 사실 하나**: JavaScript가 바꾸는 것은 HTML 파일이 아니라 메모리 속 DOM입니다.
그래서 화면은 즉시 바뀌지만 새로고침하면 원래대로 돌아갑니다.
값을 남기려면 `localStorage` 같은 저장소가 따로 필요합니다. (다크 모드가 이걸 씁니다)

---

## 1. HTML

### 1.1 태그의 문법

```html
<title>김현민 | Portfolio</title>
└여는 태그┘└──── 내용 ────┘└닫는 태그┘
```

- 닫는 태그에는 `/`가 붙습니다.
- `<meta>`, `<link>`, `<img>` 처럼 **감쌀 내용이 없는 태그는 닫지 않습니다.** (빈 태그 / void element)
- 태그 안의 `lang="ko"`, `href="..."` 는 **속성(attribute)** 이며 `이름="값"` 형태입니다.

### 1.2 문서의 3층 구조

```html
<!DOCTYPE html>   <!-- 1층: 표준 모드로 해석하라는 선언 -->
<html lang="ko">  <!-- 2층: 문서 전체 -->
  <head>          <!-- 3층-A: 브라우저에게 하는 말 (화면에 안 보임) -->
  <body>          <!-- 3층-B: 사람에게 보여줄 것 -->
</html>
```

`head`와 `body`를 나누는 기준은 **"브라우저가 보나, 사람이 보나"** 입니다.

### 1.3 `<head>`의 필수 요소

| 코드 | 하는 일 | 빠뜨리면 |
|------|---------|----------|
| `<!DOCTYPE html>` | 표준 모드 선언 | 브라우저가 옛 호환 모드(quirks mode)로 전환 → 크기 계산이 어긋남 |
| `<html lang="ko">` | 문서 언어 | 스크린리더가 한글을 영어 발음으로 읽음 |
| `<meta charset="UTF-8">` | 글자 인코딩 | 한글이 `ìëíì¸ì`처럼 깨짐 |
| `<meta name="viewport" ...>` | 모바일 화면 폭 기준 | **미디어쿼리를 써도 반응형이 동작하지 않음** |
| `<title>` | 탭 이름·검색 결과 제목 | 파일 경로가 그대로 노출 |

**charset은 `<head>` 맨 위에** 둡니다. 브라우저는 문서 앞부분 1024바이트 안에서만 이 선언을 찾습니다.

**viewport가 필요한 이유**: 모바일 브라우저는 기본적으로 자기 화면을 가상의 980px이라고 가정하고 그린 뒤 축소해서 보여줍니다. 옛날 데스크톱 전용 사이트를 그나마 보이게 하려는 장치입니다.
`width=device-width`가 "진짜 기기 폭을 써라", `initial-scale=1.0`이 "축소하지 마라"입니다.

### 1.4 `defer` — JS를 언제 실행할 것인가

```html
<script defer src="js/main.js"></script>
```

`defer` 없이 `<head>`에 스크립트를 두면 브라우저는 **HTML 읽기를 멈추고** JS를 먼저 실행합니다.
그 시점엔 `<body>`가 아직 없으므로 `querySelector`가 `null`을 반환하고 전부 에러가 납니다.

`defer` = "다운로드는 미리 하되, **HTML을 끝까지 읽은 뒤에 실행**하라".
그래서 `main.js`는 맨 위에서 바로 `document.querySelector('#header')`를 해도 안전합니다.

### 1.5 시맨틱 태그 — 왜 `<div>`로만 하지 않는가

화면 결과는 같습니다. 차이는 **기계가 읽을 수 있는 의미**입니다.

| 태그 | 의미 | 이 프로젝트에서 |
|------|------|----------------|
| `<header>` | 페이지 맨 위 영역 | 로고 + 메뉴 + 버튼 |
| `<nav>` | 사이트 이동용 링크 묶음 | 메뉴 5개 |
| `<main>` | 이 페이지의 본문. **문서에 하나만** | Hero~Contact |
| `<section>` | 주제가 하나인 덩어리 | 6개 섹션 |
| `<article>` | **떼어내도 말이 되는** 독립된 덩어리 | 기술 카드, 저장소 카드 |
| `<footer>` | 맨 아래 부가 정보 | 저작권 + 링크 |

**`<section>` vs `<article>` 판단 기준**: 오려내서 다른 곳에 붙여도 말이 되는가?
"Skills" 섹션은 이 페이지 안에서만 의미가 있으니 `<section>`,
"Frontend / HTML5, CSS3" 카드는 떼어내도 완결된 정보이니 `<article>`입니다.

**실용적 효과**: 스크린리더에는 "본문으로 건너뛰기", "메뉴로 건너뛰기" 기능이 있고 그 기준이 `<main>`, `<nav>` 태그입니다. `<div>`로 감싸면 이 기능이 동작하지 않습니다.
헤더·푸터처럼 모든 페이지에 반복되는 것은 `<main>` **밖**에 둡니다.

### 1.6 제목 계층 `<h1>` ~ `<h6>`

```
<h1> 저는 김현민입니다        ← 페이지 전체 제목. 딱 하나.
  <h2> About Me / Skills / Projects / Contact
    <h3> Frontend / Tools / Learning, 저장소 이름
```

두 가지 규칙:
- **`<h1>`은 페이지에 하나**. 검색엔진이 "이 페이지가 무엇에 관한 것인가"를 판단하는 1순위 근거입니다.
- **번호를 건너뛰지 않습니다.** `<h2>` 다음에 `<h4>`가 오면 스크린리더 사용자는 중간을 놓쳤다고 착각합니다.

글자가 커 보여서 `<h1>`을 쓰면 안 됩니다. **크기는 CSS로, 태그는 의미로** 고릅니다.
같은 원칙이 `<b>`(모양)와 `<strong>`(중요), `<i>`(모양)와 `<em>`(강조)에도 적용됩니다.

### 1.7 `class`와 `id`

| | `class` | `id` |
|---|---------|------|
| 중복 | 여러 요소가 같은 값 가능 | **문서에 딱 하나** |
| 주 용도 | CSS 스타일 지정 | JS로 콕 집기, 앵커 링크 대상 |
| CSS 표기 | `.header { }` | `#header { }` |

원칙: **스타일은 class, JS가 잡을 손잡이는 id.**

`class="skill-card"`가 세 번 반복되는 게 class의 존재 이유입니다.
CSS에서 `.skill-card { }` 한 번만 쓰면 세 카드가 동시에 그 스타일을 받고, 카드가 10개로 늘어도 CSS는 그대로입니다.

### 1.8 BEM 작명 규칙

문법이 아니라 **약속된 이름 짓기 방식**입니다.

```
nav              블록 — 덩어리 이름
nav__menu        요소 — 그 블록의 부품 (밑줄 2개)
btn--primary     변형 — 같은 물건의 다른 버전 (하이픈 2개)
```

CSS가 800줄쯤 되면 `.menu`, `.link`, `.item` 같은 이름이 여기저기서 충돌합니다.
이름만 보고 소속을 알 수 있게 하는 장치입니다.

`class="btn btn--primary"`처럼 **공백으로 여러 클래스**를 붙일 수 있고, 규칙이 전부 함께 적용됩니다.
공통 모양은 `btn`에 한 번만 쓰고 색 차이만 `btn--primary` / `btn--outline`에 씁니다.

### 1.9 앵커 링크

```html
<a href="#about">  ──찾아감──▶  <section id="about">
```

`#`으로 시작하는 링크는 같은 페이지 안의 위치를 가리킵니다.
**id 값이 한 글자라도 다르면(대소문자 포함) 동작하지 않습니다.**

### 1.10 `<a>` vs `<button>`

**어딘가로 이동하면 `<a>`, 무언가를 실행하면 `<button>`.**
겉모습이 아니라 동작으로 고릅니다.

`View Projects`는 CSS로 버튼처럼 칠했지만 이동이므로 `<a>`입니다.
`<button>`으로 만들면 "새 탭에서 열기"가 안 되고, 스크린리더가 "버튼"이라고 읽어 사용자가 무언가 실행될 거라 오해합니다.

`<button>`의 `type` 기본값은 **`submit`** 입니다.
`<form>` 안에서 type 없는 버튼을 누르면 폼이 제출되며 페이지가 새로고침됩니다. 그래서 항상 `type`을 명시합니다.

### 1.11 이미지 `<img>`

```html
<img src="images/profile-placeholder.svg" alt="김현민의 프로필 사진" width="400" height="400">
```

- **`alt`** — 이미지를 못 볼 때 대신 읽히는 글자. 스크린리더가 읽고, 경로가 틀리면 화면에 대신 표시되고, 검색엔진이 이걸로 내용을 판단합니다.
  `alt="이미지"`는 아무 정보도 주지 않습니다. **"이 이미지를 못 보는 사람에게 뭐라고 설명할까"** 를 씁니다.
- **`width` / `height`** — 실제 크기는 CSS가 정하지만, 이 값이 있으면 브라우저가 이미지를 받기 전에 **자리를 미리 비워둡니다.**
  없으면 이미지가 도착하는 순간 아래 내용이 확 밀립니다(레이아웃 이동). 기사를 읽다가 광고가 뜨며 화면이 튀는 그 현상입니다.

### 1.12 폼과 `<label>`

```html
<label class="form__label" for="email">이메일</label>
<input class="form__input" type="email" id="email" name="email">
```

`for`와 `id`가 같아야 라벨 클릭 시 입력창이 선택되고, 스크린리더가 "이메일, 편집창"이라고 읽어줍니다.
값이 다르면 라벨은 그냥 장식 글자가 됩니다.

```html
<form id="contact-form" novalidate>
```

`novalidate`는 **브라우저 기본 검증을 끄는 속성**입니다.
이게 없으면 브라우저가 자체 경고창을 먼저 띄워서, 우리가 만든 JS 검증(에러 문구를 필드 아래 표시)이 실행되지 않습니다.

### 1.13 접근성 속성 `aria-*`

햄버거 버튼과 테마 버튼에는 **글자가 없습니다.** 이모지와 막대기뿐이라 스크린리더는 그냥 "버튼"이라고만 읽습니다. 그래서 정보를 따로 붙입니다.

| 속성 | 뜻 |
|------|-----|
| `aria-label="다크 모드 전환"` | 이 요소의 이름 (화면엔 안 보임) |
| `aria-expanded="false"` | 지금 메뉴가 닫혀 있다 → JS가 열 때 `true`로 바꿈 |
| `aria-controls="nav-menu"` | 이 버튼이 조종하는 대상 |
| `aria-hidden="true"` | 장식이니 읽지 마라 (🌙, 햄버거 막대) |
| `aria-live="polite"` | 이 안의 내용이 바뀌면 알려줘 → Projects 상태 영역 |
| `role="alert"` | 즉시 알려야 할 오류 → 폼 에러 문구 |

`aria-expanded`가 중요합니다. **화면의 변화와 정보의 변화를 함께 관리**하는 것이 상태 관리의 기본 형태입니다.

### 1.14 HTML 엔티티

HTML에는 문법으로 예약된 글자 3개가 있습니다.

| 글자 | 역할 | 글자로 쓰려면 |
|------|------|--------------|
| `<` | 태그 시작 | `&lt;` |
| `>` | 태그 끝 | `&gt;` |
| `&` | 특수문자 시작 | `&amp;` |

`Git &amp; GitHub`이 화면에는 `Git & GitHub`으로 나옵니다.
`&copy;`는 `©`입니다. 이 규칙은 [3.9 XSS 방지](#39-innerhtml과-xss-escapehtml이-필요한-이유)에서 다시 중요해집니다.

---

## 2. CSS

### 2.1 CSS 규칙의 문법

```css
.btn--primary {          /* 선택자 — 누구에게 */
  background-color: blue;   /* 속성: 값 — 무엇을 */
}
```

| 선택자 | 대상 |
|--------|------|
| `.btn` | class가 btn인 모든 요소 |
| `#header` | id가 header인 요소 |
| `button` | 모든 button 태그 |
| `.nav__menu.active` | 두 클래스를 **동시에** 가진 요소 |
| `.nav__toggle.active .nav__toggle-bar` | (공백) 안쪽의 자손 요소 |
| `.btn:hover` | 마우스를 올린 상태 |
| `.projects__status:empty` | 내용이 비어 있는 상태 |
| `[data-theme="dark"]` | 속성값이 dark인 요소 |
| `li:nth-child(2)` | 형제 중 두 번째 |
| `.lang::before` | 그 요소 앞에 만들어지는 가상 요소 |

### 2.2 CSS 변수 (사용자 정의 속성)

```css
:root {
  --color-primary: #3b82f6;
  --space-md: 1.5rem;
}

.btn--primary {
  background-color: var(--color-primary);
}
```

`:root`는 문서의 최상위(`<html>`)를 가리킵니다. 여기에 정의하면 **문서 전체에서** `var(--이름)`으로 꺼내 쓸 수 있습니다.

이 프로젝트에서 변수를 쓴 진짜 이유는 **다크 모드** 때문입니다.

```css
[data-theme="dark"] {
  --color-bg: #0f172a;      /* 값만 교체 */
  --color-text: #e2e8f0;
}
```

`<html>`에 `data-theme="dark"`가 붙는 순간 **변수 값 9개만 바뀌고**, 그 변수를 쓰는 800줄의 모든 규칙이 자동으로 새 색을 씁니다.
변수가 없었다면 JS가 배경·글자·카드·테두리 색을 하나하나 바꿔야 했을 겁니다.

### 2.3 초기화(reset)와 `box-sizing`

```css
*, *::before, *::after { box-sizing: border-box; }
```

`*`는 모든 요소입니다. `box-sizing`은 **`width`가 무엇을 뜻하는지**를 정합니다.

```
content-box (기본)          border-box (우리가 설정)
width = 내용만              width = 내용 + padding + border
→ padding을 주면 총 폭이     → padding을 줘도 총 폭이
   커져서 레이아웃이 깨짐        그대로 유지됨
```

`width: 100%`에 `padding: 1rem`을 준 요소가 부모 밖으로 삐져나가는 사고를 막습니다. 거의 모든 프로젝트가 이 한 줄을 씁니다.

나머지 초기화는 브라우저마다 다른 기본값을 지우는 작업입니다.
`body { margin: 0 }`(기본 8px 여백), `ul { list-style: none }`(불릿), `a { text-decoration: none }`(파란 밑줄).

### 2.4 단위 — px / rem / %  / vh

| 단위 | 기준 | 이 프로젝트에서 |
|------|------|----------------|
| `px` | 절대 크기 | 테두리, 그림자처럼 커지면 안 되는 것 |
| `rem` | **루트 글자 크기(기본 16px)** | 글자 크기, 여백 |
| `%` | 부모 크기 | `width: 100%` |
| `vh` / `vw` | 화면 높이 / 폭의 1% | `min-height: calc(100vh - 64px)` |

`rem`을 쓰는 이유는 **사용자가 브라우저 글자 크기를 키웠을 때 레이아웃이 함께 커지기** 때문입니다.
`px`로 고정하면 시력이 나쁜 사용자가 글자를 키워도 그대로입니다.

`1rem = 16px`, `0.875rem = 14px`, `2.5rem = 40px`.

### 2.5 container 패턴

```css
.container {
  width: 100%;
  max-width: 1120px;
  margin-inline: auto;      /* 좌우 여백 자동 = 가운데 정렬 */
  padding-inline: 1rem;
}
```

27인치 모니터에서 글이 화면 끝까지 늘어나면 한 줄이 200글자가 되어 읽기 힘듭니다.
그래서 **배경은 화면 전체, 내용은 가운데 1120px까지**로 나눕니다. 이걸 하려면 상자가 두 겹 필요합니다.

```
┌── section (배경색은 화면 끝까지) ──────────────┐
│      ┌── container (내용은 1120px) ──┐        │
│      └──────────────────────────────┘        │
└──────────────────────────────────────────────┘
```

`max-width`는 "이보다 커지지는 마라"이므로, 화면이 좁으면 `width: 100%`가 이겨서 자동으로 줄어듭니다. **반응형의 기본 도구**입니다.

### 2.6 Flexbox — 한 줄 정렬

```css
.nav {
  display: flex;                   /* 자식들을 가로로 나열 */
  align-items: center;             /* 교차축(세로) 가운데 */
  justify-content: space-between;  /* 주축(가로) 양 끝으로 벌림 */
}
```

**부모에게 명령하면 자식들이 정렬되는** 방식입니다. 그래서 나란히 놓을 것들은 반드시 하나의 부모로 묶어야 합니다. (`about__content`, `nav__actions`가 그 역할)

| 속성 | 하는 일 |
|------|---------|
| `flex-direction: row / column` | 주축을 가로/세로로 |
| `justify-content` | 주축 방향 정렬 (`center`, `space-between`) |
| `align-items` | 교차축 방향 정렬 |
| `gap` | 자식들 사이 간격 |
| `flex-wrap: wrap` | 넘치면 다음 줄로 |
| `flex-grow: 1` | 남는 공간을 이 자식이 차지 |
| `flex-shrink: 0` | 이 자식은 줄어들지 마라 |

`.project-card__desc { flex-grow: 1 }`이 좋은 예입니다. 설명 길이가 달라도 카드 아래쪽의 링크 위치가 맞춰집니다.

### 2.7 Grid — 격자 배치

```css
.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

이 한 줄이 **미디어쿼리 없이 반응형**을 만듭니다. 읽는 법:

- `minmax(280px, 1fr)` — 한 칸은 **최소 280px, 최대 남는 공간을 균등 분할(1fr)**
- `auto-fit` — 그 조건으로 **들어갈 수 있는 만큼 칸을 만들어라**

```
화면 1200px → 280px 칸이 3개 들어감 → 3열
화면  800px → 2개                  → 2열
화면  375px → 1개                  → 1열
```

`1fr`의 `fr`은 fraction(비율)입니다. 남는 공간을 나눠 갖는 단위입니다.

**Flexbox와 Grid, 언제 무엇을 쓰나**

| | Flexbox | Grid |
|---|---------|------|
| 차원 | 1차원 (한 줄) | 2차원 (행 + 열) |
| 크기 결정 | **내용이** 크기를 정함 | **격자가** 크기를 정함 |
| 적합 | 네비게이션 바, 버튼 묶음, 태그 목록 | 카드 목록, 페이지 전체 레이아웃 |
| 이 프로젝트 | `.nav`, `.nav__actions`, `.hero__actions`, `.skill-card__list` | `.projects__grid`, `.skills__groups` |

한 줄로 늘어놓고 간격만 맞추면 Flexbox, 크기가 같은 칸을 격자로 채우면 Grid입니다.

### 2.8 `position` — 요소를 문서 흐름에서 꺼내기

```css
.header      { position: fixed; top: 0; left: 0; z-index: 100; }
.scroll-top  { position: fixed; right: 1rem; bottom: 1rem; z-index: 90; }
.nav__menu   { position: fixed; top: 64px; }
```

| 값 | 뜻 |
|----|-----|
| `static` | 기본값. 문서 흐름대로 |
| `relative` | 원래 자리를 차지한 채 이동 |
| `absolute` | 흐름에서 빠져나와 가장 가까운 `relative` 부모 기준 |
| `fixed` | 흐름에서 빠져나와 **화면(뷰포트) 기준** → 스크롤해도 고정 |
| `sticky` | 스크롤하다 특정 지점에서 고정 |

헤더가 `fixed`가 되면 **문서 흐름에서 빠져나가므로 원래 자리가 사라집니다.**
그래서 Hero가 헤더 뒤에 가려집니다. 보정이 필요합니다.

```css
main { padding-top: var(--header-height); }        /* 본문을 64px 아래로 */
html { scroll-padding-top: var(--header-height); } /* 앵커 이동 시에도 64px 확보 */
```

`z-index`는 겹칠 때의 위아래 순서입니다. 숫자가 클수록 앞입니다. (헤더 100 > 스크롤탑 90)

### 2.9 `transition`과 `transform`

```css
.btn {
  transition: background-color 0.25s ease, transform 0.25s ease;
}
.btn--primary:hover {
  transform: translateY(-2px);
}
```

`transition`은 **값이 바뀔 때 그 사이를 부드럽게 채워라**는 지시입니다.
`속성 시간 가속도` 순서로 쓰고, 쉼표로 여러 개를 나열합니다.

`transform`은 요소를 이동·회전·확대합니다.

| 함수 | 하는 일 | 사용처 |
|------|---------|--------|
| `translateY(-2px)` | 세로 이동 | 버튼 hover 시 살짝 뜨기 |
| `translateY(-150%)` | 자기 높이의 150% 위로 | 모바일 메뉴를 화면 밖에 숨김 |
| `rotate(45deg)` | 회전 | 햄버거 → X자 |

`transform`으로 옮기면 **주변 요소의 위치를 다시 계산하지 않아서** `top`, `margin`으로 옮기는 것보다 훨씬 부드럽습니다.

**숨기는 방법 3가지의 차이**

| 방법 | 자리 차지 | 애니메이션 | 스크린리더 |
|------|:---:|:---:|:---:|
| `display: none` | ✕ | 불가 | 안 읽음 |
| `visibility: hidden` | ○ | 가능 | 안 읽음 |
| `opacity: 0` | ○ | 가능 | **읽음** (보이지 않는데 읽힘) |

모바일 메뉴는 세 개를 함께 씁니다. `opacity`와 `transform`으로 부드럽게 움직이고, `visibility`로 스크린리더와 클릭을 차단합니다.

### 2.10 미디어쿼리와 모바일 퍼스트

```css
/* 기본 = 모바일 */
.nav__menu { flex-direction: column; visibility: hidden; }

/* 768px 이상에서만 덮어쓰기 */
@media (min-width: 768px) {
  .nav__toggle { display: none; }
  .nav__menu { flex-direction: row; visibility: visible; }
}
```

**모바일 퍼스트**는 기본 CSS를 모바일 기준으로 쓰고, `min-width`로 큰 화면에 살을 붙이는 방식입니다.

반대(`max-width`로 줄여나가기)보다 나은 이유는 두 가지입니다.
모바일은 화면이 작아 요소가 단순한데, 단순한 것에서 시작해 추가하는 편이 코드가 짧습니다.
그리고 성능이 약한 모바일 기기가 **자기에게 필요 없는 규칙을 읽지 않아도** 됩니다.

이 프로젝트에서 미디어쿼리가 하는 일은 결국 하나입니다.
**HTML은 그대로 두고 CSS만 바꿔서 같은 구조를 다르게 배치하는 것.**

```
모바일 (~767px)          데스크톱 (768px~)
햄버거 표시              햄버거 숨김
메뉴 = 위에서 내려오는    메뉴 = 헤더 안 가로줄
       서랍 (fixed)             (static)
About = 세로             About = 사진 | 글 가로
```

미디어쿼리 안에서 `:root` 변수 자체를 바꾸기도 합니다. 화면이 커지면 제목이 커지고 섹션 간격이 넓어집니다.

```css
@media (min-width: 1024px) {
  :root { --space-xl: 6rem; --fs-3xl: 3.5rem; }
}
```

### 2.11 캐스케이드 — 규칙이 충돌하면

같은 요소에 서로 다른 값이 오면 이 순서로 결정됩니다.

1. **명시도(specificity)** — 더 구체적인 선택자가 이김
   `#id`(100) > `.class`(10) > `태그`(1)
   `.nav__menu.active`(20)가 `.nav__menu`(10)를 이깁니다.
2. **작성 순서** — 명시도가 같으면 **나중에 쓴 것**이 이김

그래서 CSS 파일의 **순서가 중요합니다.** 이 프로젝트는 이렇게 배치했습니다.

```
1~5   변수 · 초기화 · 공통      ← 가장 일반적
6~13  각 컴포넌트
14~15 애니메이션 · 다크 모드
16~18 미디어쿼리                ← 가장 구체적, 맨 뒤에서 덮어씀
```

미디어쿼리를 파일 앞쪽에 두면 뒤에 오는 일반 규칙에 덮어쓰여 동작하지 않습니다.

### 2.12 `@keyframes` — 반복 애니메이션

```css
.status__spinner { animation: spin 0.8s linear infinite; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

`transition`은 A→B 한 번, `animation`은 정해진 구간을 반복합니다.
로딩 스피너는 테두리 4개 중 위쪽만 색을 다르게 준 원을 무한 회전시킨 것입니다.

### 2.13 접근성 — 모션 최소화

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .status__spinner { animation: none; }
}
```

전정기관 장애가 있는 사용자는 화면이 움직이면 어지럼증을 느낍니다.
운영체제의 "동작 줄이기" 설정을 켜면 이 미디어쿼리가 적용되어 모든 애니메이션이 꺼집니다.

---

## 3. JavaScript

### 3.1 `var` 대신 `const`와 `let`

```js
const HEADER_SCROLL_THRESHOLD = 60;  // 재할당 금지
let firstInvalidInput = null;        // 재할당 예정
```

| | 유효 범위 | 재할당 |
|---|-----------|--------|
| `var` | 함수 전체 (블록 무시) | 가능 — **덮어쓰기 사고가 잦음** |
| `let` | `{ }` 블록 안 | 가능 |
| `const` | `{ }` 블록 안 | 불가 |

원칙: **기본은 `const`, 값을 바꿔야 할 때만 `let`, `var`는 쓰지 않는다.**

`const`로 선언해도 **객체나 배열의 내용은 바꿀 수 있습니다.** "이 이름이 다른 것을 가리키게 하지 마라"는 뜻이지 "안의 값을 얼리라"는 뜻이 아닙니다.

```js
const formFields = [ ... ];
formFields.forEach(...)          // OK — 내용을 읽고 쓰는 것
formFields = [];                 // 에러 — 이름을 다른 배열에 다시 붙이는 것
```

### 3.2 DOM 선택과 조작

```js
const header = document.querySelector('#header');        // 첫 하나
const navLinks = document.querySelectorAll('.nav__link'); // 전부 (유사 배열)
```

`querySelector`에는 **CSS 선택자를 그대로** 씁니다. `#id`, `.class`, `태그`, `.a .b` 모두 됩니다.
CSS에서 쓰던 문법을 JS에서 재사용하는 셈이라 따로 외울 게 없습니다.

**내용 바꾸기**

```js
themeIcon.textContent = '☀️';           // 글자만
projectsGrid.innerHTML = '<article>…';  // HTML 구조까지
```

`textContent`는 넣은 문자열을 **글자 그대로** 취급하고, `innerHTML`은 **HTML로 해석**합니다.
그래서 카드를 만들 때는 `innerHTML`이 필요하지만, 대신 [3.9의 위험](#39-innerhtml과-xss-escapehtml이-필요한-이유)이 따라옵니다.

**클래스 조작 — 이 프로젝트에서 가장 많이 쓴 도구**

```js
navMenu.classList.add('active');
navMenu.classList.remove('active');
navMenu.classList.toggle('active');            // 있으면 빼고 없으면 넣고
navMenu.classList.toggle('active', isOpen);    // 두 번째 인자로 명시 지정
navMenu.classList.contains('active');          // 있는지 확인 (true/false)
```

두 번째 인자가 있는 `toggle`이 특히 유용합니다. `if/else`가 필요 없습니다.

```js
header.classList.toggle('header--scrolled', y > 60);
```

**JS는 클래스만 붙이고, 실제 스타일은 CSS가 정한다** — 이것이 인라인 `style="..."`을 금지하는 이유입니다. 색을 바꾸고 싶으면 CSS 한 곳만 고치면 됩니다.

### 3.3 이벤트

```js
navToggle.addEventListener('click', () => {
  setMenuOpen(!navMenu.classList.contains('active'));
});
```

JS는 위에서 아래로 한 번 실행되고 끝납니다. 사용자가 언제 클릭할지는 알 수 없습니다.
그래서 **"클릭이 일어나면 이 함수를 불러줘"라고 브라우저에 미리 예약**해둡니다.

이 프로젝트에서 쓴 이벤트:

| 이벤트 | 대상 | 하는 일 |
|--------|------|---------|
| `click` | 햄버거, 테마 토글, 스크롤탑, 메뉴 링크, 재시도 | 대부분의 인터랙션 |
| `scroll` | `window` | 헤더 배경 + 스크롤탑 버튼 |
| `submit` | `<form>` | 유효성 검사 |
| `input` | 입력 필드 | 타이핑 중 재검증 |

**`preventDefault()`**

```js
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();   // 폼의 기본 동작(페이지 새로고침)을 막는다
  ...
});
```

`event`는 브라우저가 넘겨주는 "무슨 일이 일어났는지"에 대한 정보 객체입니다.
폼 제출의 기본 동작은 **서버로 데이터를 보내고 페이지를 새로고침**하는 것인데, 우리는 서버가 없으므로 막아야 합니다. 막지 않으면 화면이 깜빡이고 입력이 사라집니다.

**HTML의 `onclick` 대신 `addEventListener`를 쓰는 이유**
- 구조(HTML)와 동작(JS)을 파일 단위로 분리할 수 있습니다.
- 한 요소에 **여러 개의 핸들러**를 붙일 수 있습니다. `onclick`은 하나만 가능합니다.

### 3.4 화살표 함수

```js
const handleScroll = () => { ... };                    // 인자 없음
navLinks.forEach((link) => { ... });                   // 인자 하나
const applyTheme = (theme) => { ... };
const escapeHTML = (value) => String(value ?? '');     // 중괄호 없으면 자동 return
```

`function` 키워드를 짧게 쓴 형태입니다. **중괄호를 생략하면 그 식의 결과가 자동으로 반환**됩니다.

```js
(value) => value.trim() === '' ? '이름을 입력해주세요.' : ''
```

`조건 ? A : B` 는 삼항 연산자로, "조건이 참이면 A, 아니면 B"입니다. 짧은 `if/else`입니다.

### 3.5 템플릿 리터럴

```js
`https://api.github.com/users/${GITHUB_USERNAME}/repos`
```

백틱(`` ` ``)으로 감싼 문자열입니다. 두 가지 장점이 있습니다.

- `${ }` 안에 **변수와 식을 그대로 넣을 수 있습니다.**
- **줄바꿈이 그대로 유지**되어 여러 줄 HTML을 쓸 수 있습니다.

```js
return `
  <article class="project-card">
    <h3 class="project-card__title">${escapeHTML(name)}</h3>
    ${language ? `<span>${escapeHTML(language)}</span>` : ''}
  </article>`;
```

`${조건 ? A : ''}` 패턴은 **조건부로 HTML 조각을 넣는** 방법입니다.
언어 정보가 없는 저장소는 `''`(빈 문자열)이 되어 그 태그가 아예 생기지 않습니다.

### 3.6 구조분해 할당

```js
const { name, description, html_url, language, stargazers_count, forks_count } = repo;
```

객체에서 필요한 값을 **이름을 키로 삼아 한 번에 꺼내는** 문법입니다. 이 한 줄은 아래 6줄과 같습니다.

```js
const name = repo.name;
const description = repo.description;
// ...
```

GitHub API는 저장소 하나당 70개가 넘는 항목을 보내줍니다. 그중 6개만 쓰겠다는 의사가 코드에 드러나는 게 장점입니다.

### 3.7 배열 메서드 — `map` / `filter` / `forEach`

세 가지 모두 배열의 각 항목에 함수를 실행하지만 **결과가 다릅니다.**

```js
const ownRepos = repos.filter((repo) => !repo.fork);
// 조건이 참인 것만 골라 새 배열 반환 (fork한 저장소 제외)

projectsGrid.innerHTML = repos.map(createProjectCard).join('');
// 각 항목을 변환해 새 배열 반환 → join('')으로 하나의 문자열로 합침

navLinks.forEach((link) => link.addEventListener('click', ...));
// 각 항목에 무언가 실행. 반환값 없음
```

| 메서드 | 반환 | 쓰임 |
|--------|------|------|
| `filter` | 조건을 만족하는 항목들의 새 배열 | 걸러내기 |
| `map` | 변환된 새 배열 | **데이터 → HTML 변환** |
| `forEach` | 없음 (`undefined`) | 각 항목에 부수 효과 실행 |

`repos.map(createProjectCard)`는 저장소 객체 배열을 HTML 문자열 배열로 바꿉니다.
`.join('')`이 그 배열을 이어붙여 하나의 긴 문자열로 만들고, 그것을 `innerHTML`에 넣으면 카드가 화면에 생깁니다.

**이것이 React의 원리와 같습니다.** React도 결국 `데이터 배열 → map → 화면 요소`를 합니다.

### 3.8 비동기 처리 — `fetch` / `async` / `await` / `try-catch`

```js
const loadProjects = async () => {
  renderLoading();
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
    if (!response.ok) { throw new Error('프로젝트를 불러올 수 없습니다.'); }
    const repos = await response.json();
    renderProjects(repos);
  } catch (error) {
    renderError(error.message);
  }
};
```

GitHub 서버에 요청을 보내면 답이 오기까지 시간이 걸립니다(0.1~2초). 그동안 브라우저가 멈춰 있으면 아무것도 클릭할 수 없습니다. 그래서 JS는 요청만 보내고 다음 줄로 넘어갑니다. 이것이 **비동기**입니다.

- `async` — "이 함수 안에는 기다릴 일이 있다"는 표시. 함수 앞에 붙입니다.
- `await` — "여기서만 답이 올 때까지 기다려라". `async` 함수 안에서만 쓸 수 있습니다.
- `fetch(url)` — 네트워크 요청. 응답 객체를 돌려줍니다.
- `response.json()` — 받은 글자 덩어리를 JS 객체/배열로 변환합니다. **이것도 시간이 걸려서 `await`가 필요합니다.**

**`response.ok` 확인이 반드시 필요한 이유**

`fetch`는 서버가 404나 403을 돌려줘도 **에러를 던지지 않습니다.** "물어봤고 답을 받았다"는 점에서 성공이기 때문입니다.
그래서 상태 코드를 직접 확인하고 `throw`로 에러를 만들어야 `catch`가 잡습니다.

```js
if (!response.ok) {
  if (response.status === 403) throw new Error('GitHub API 요청 한도를 초과했습니다…');
  if (response.status === 404) throw new Error(`'${GITHUB_USERNAME}' 사용자를 찾을 수 없습니다.`);
  throw new Error('프로젝트를 불러올 수 없습니다.');
}
```

`fetch` 자체가 에러를 던지는 경우는 **인터넷이 끊겼거나 주소가 아예 잘못된 경우**뿐입니다. 그것도 같은 `catch`가 받습니다.

**`try / catch`**

```
try  { 문제가 생길 수 있는 코드 }
catch (error) { 문제가 생겼을 때 할 일 }
```

`catch`가 없으면 에러가 났을 때 스크립트가 멈추고 화면은 로딩 스피너가 영원히 도는 상태가 됩니다.
`catch`가 있어야 **에러 상태 UI**로 넘어갈 수 있습니다.

**4가지 상태를 모두 만드는 이유**

실제 서비스에서 네트워크 요청은 늘 성공하지 않습니다. 이 프로젝트는 4가지를 모두 화면으로 표현합니다.

| 상태 | 언제 | 화면 |
|------|------|------|
| 로딩 | 요청을 보낸 직후 | 스피너 |
| 성공 | 데이터가 왔고 항목이 있음 | 카드 목록 |
| 빈 데이터 | 데이터는 왔는데 항목이 0개 | "표시할 프로젝트가 없습니다" |
| 에러 | 요청 실패 | 메시지 + [다시 시도] |

**빈 데이터와 에러는 다릅니다.** 저장소가 없는 것은 정상이고, 못 가져온 것은 실패입니다. 사용자에게 다른 안내를 해야 합니다.

### 3.9 `innerHTML`과 XSS — `escapeHTML`이 필요한 이유

```js
const escapeHTML = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
```

GitHub 저장소 설명은 **남이 쓴 글**입니다. 만약 설명에 이런 게 들어 있으면?

```
<img src=x onerror="여기에 아무 코드나">
```

`innerHTML`에 그대로 넣으면 브라우저가 이걸 **진짜 태그로 해석해서 실행**합니다.
이 공격을 XSS(Cross-Site Scripting)라고 합니다.

`escapeHTML`은 `<`를 `&lt;`로 바꿔서 **태그가 아니라 글자로 보이게** 만듭니다.
[1.14 HTML 엔티티](#114-html-엔티티)에서 본 규칙이 여기서 보안 장치로 쓰입니다.

`value ?? ''`의 `??`는 **널 병합 연산자**입니다. 왼쪽이 `null`이나 `undefined`면 오른쪽을 씁니다.
설명이 없는 저장소의 `description`은 `null`이라서 이 처리가 필요합니다.

### 3.10 `localStorage` — 새로고침해도 남는 저장소

```js
localStorage.setItem('portfolio-theme', 'dark');
localStorage.getItem('portfolio-theme');   // 'dark'
```

브라우저가 제공하는 작은 저장 공간입니다. **문자열만** 저장되고, 사이트별로 분리되며, 사용자가 지우기 전까지 남습니다.

```js
const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;   // 시크릿 모드 등에서 접근이 막힐 수 있다
  }
};
```

`try/catch`로 감싼 이유는 **시크릿 모드나 쿠키 차단 설정에서 `localStorage` 접근 자체가 에러를 던지기** 때문입니다. 그때도 사이트는 동작해야 하므로 "저장은 못 하지만 화면은 정상"으로 처리합니다.

이것이 요구사항 **"새로고침 후에도 다크 모드가 유지된다"** 를 만족시키는 장치입니다.

### 3.11 `IntersectionObserver` — 화면에 들어왔는지 감시

```js
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);   // 한 번 나타나면 그만 관찰
      }
    });
  },
  { threshold: 0.2 }
);

revealTargets.forEach((element) => revealObserver.observe(element));
```

"이 요소가 화면 안에 들어오면 알려줘"라고 브라우저에 등록하는 도구입니다.

- `threshold: 0.2` — 요소의 **20% 이상**이 보이면 실행
- `entry.isIntersecting` — 지금 보이는 중인가 (true/false)
- `unobserve` — 한 번 나타난 요소는 관찰 목록에서 빼서 낭비를 줄입니다

`scroll` 이벤트로도 같은 걸 만들 수 있지만, `scroll`은 **1초에 수십 번 실행되며 매번 위치를 계산**해야 해서 느립니다. `IntersectionObserver`는 브라우저가 내부적으로 최적화해서 처리합니다.

CSS와 짝을 이룹니다.

```css
.reveal            { opacity: 0; transform: translateY(24px); transition: 0.6s; }
.reveal.is-visible { opacity: 1; transform: none; }
```

JS는 클래스만 붙이고 애니메이션은 CSS가 합니다. [3.2](#32-dom-선택과-조작)의 원칙 그대로입니다.

### 3.12 상태 → 렌더링 패턴 (이 과제의 핵심)

나쁜 코드는 클릭 핸들러 안에서 DOM을 직접 주무릅니다.

```js
// 나쁜 예 — 상태가 화면에 흩어져 있다
themeToggle.addEventListener('click', () => {
  document.body.style.background = '#0f172a';
  document.body.style.color = '#e2e8f0';
  document.querySelector('.header').style.background = '#1e293b';
  // ... 색깔마다 한 줄씩
});
```

좋은 코드는 **상태를 바꾸는 쪽**과 **상태를 보고 그리는 쪽**을 분리합니다.

```js
// 그리는 함수 — 상태 하나를 받아 화면 전체를 맞춘다
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
};

// 이벤트 핸들러 — 다음 상태만 계산해서 넘긴다
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
});
```

이 구조의 이점은 **화면을 그리는 경로가 하나뿐**이라는 것입니다.
페이지가 처음 열릴 때도 같은 함수를 씁니다.

```js
applyTheme(readStoredTheme() || 'light');
```

같은 패턴이 프로젝트 전체에 4번 나옵니다.

| # | 이벤트 | 상태 | 그리는 함수 |
|---|--------|------|-------------|
| 1 | 토글 클릭 | `data-theme` + localStorage | `applyTheme()` |
| 2 | 로드 / 재시도 클릭 | 로딩·성공·에러·빈 | `renderLoading()` `renderProjects()` `renderError()` `renderEmpty()` |
| 3 | 폼 제출 / 입력 | 필드별 에러 문자열 | `showFieldError()` |
| 4 | 햄버거 클릭 | 열림 여부 (boolean) | `setMenuOpen()` |

**React가 자동으로 해주는 것이 정확히 이 연결입니다.**
React에서 `useState`로 상태를 바꾸면 화면이 알아서 다시 그려집니다.
지금 손으로 만든 `applyTheme`, `renderProjects` 같은 함수를 React가 대신 호출해주는 것뿐입니다.
그래서 이 패턴을 이해하면 React의 상태-렌더링 흐름은 새로운 개념이 아니라 **자동화된 같은 것**이 됩니다.

---

## 4. 과제 목표 6문항 답안

미션 문서 3장 「과제 목표」에 적힌 6개 항목입니다. 이 프로젝트의 코드를 근거로 답합니다.

### Q1. HTML에서 시맨틱 태그를 왜 사용하는가? 어떤 기준으로 구조를 설계했는가?

**왜 쓰는가** — `<div>`로만 만들어도 화면은 같습니다. 차이는 기계가 읽을 수 있는 의미가 남는가입니다.
스크린리더는 `<nav>`, `<main>` 태그를 기준으로 "메뉴 건너뛰기 / 본문으로 가기"를 제공하고, 검색엔진은 `<h1>`으로 페이지 주제를 판단합니다. `<div>`는 이 정보를 전혀 주지 못합니다.

**설계 기준 세 가지**

1. **반복되는 것은 `<main>` 밖으로.** 헤더와 푸터는 어느 페이지에나 있으므로 본문이 아닙니다.
2. **떼어내도 말이 되면 `<article>`, 아니면 `<section>`.**
   "Skills" 섹션은 이 페이지 안에서만 의미가 있어 `<section>`, 기술 카드와 저장소 카드는 오려내도 완결된 정보라 `<article>`로 했습니다.
3. **모양이 아니라 의미로 태그를 고른다.**
   섹션 제목은 크기와 무관하게 `<h2>`, 카드 제목은 `<h3>`으로 계층을 지켰습니다. 강조는 `<b>`가 아니라 `<strong>`을 썼습니다.

결과 구조:

```
<header> → <nav>              메뉴 (반복되므로 main 밖)
<main>                        본문, 문서에 하나
  <section id="home">         Hero
  <section id="about">        About
  <section id="skills">       └ <article> × 3
  <section id="projects">     └ <article> × N (JS가 생성)
  <section id="contact">      └ <form>
<footer>                      저작권 (반복되므로 main 밖)
<button id="scroll-top">      특정 섹션 소속이 아니므로 main 밖
```

### Q2. Flexbox와 Grid의 차이는? 언제 각각을 선택하는가?

**핵심 차이는 차원과 크기 결정 주체입니다.**

| | Flexbox | Grid |
|---|---------|------|
| 차원 | 1차원 (한 줄) | 2차원 (행 + 열) |
| 크기 | **내용이** 결정 | **격자가** 결정 |

Flexbox는 "이것들을 한 줄에 늘어놓고 간격을 맞춰라", Grid는 "이런 격자를 만들고 그 안을 채워라"입니다.

**이 프로젝트의 선택**

```css
/* Flexbox — 로고와 메뉴를 한 줄에 양 끝으로 */
.nav { display: flex; align-items: center; justify-content: space-between; }
```
네비게이션은 한 줄이고 로고와 메뉴의 폭이 서로 다릅니다. 내용이 크기를 정해야 하므로 Flexbox입니다.

```css
/* Grid — 크기가 같은 칸을 화면 폭에 맞춰 자동 배치 */
.projects__grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
```
카드는 개수를 미리 알 수 없고(GitHub 저장소 수에 따라 달라짐) 크기가 같아야 합니다.
`auto-fit` + `minmax`는 **미디어쿼리 없이** 1200px에서 3열, 800px에서 2열, 375px에서 1열이 됩니다. Flexbox로는 이 자동 계산이 안 됩니다.

**판단 기준**: 한 줄로 늘어놓고 간격만 맞추면 Flexbox, 크기가 같은 칸을 격자로 채우면 Grid.
실제로는 함께 씁니다. `.projects__grid`(Grid) 안의 각 `.project-card`는 내부적으로 Flexbox입니다.

### Q3. `querySelector`로 DOM을 선택하고 `addEventListener`로 이벤트를 연결하는 흐름은?

```js
// 1. 브라우저가 HTML을 읽어 DOM(메모리 속 나무 구조)을 만든다
// 2. defer 덕분에 DOM이 완성된 뒤 main.js가 실행된다
const navToggle = document.querySelector('#nav-toggle');   // 3. DOM에서 요소를 찾아 변수에 담는다

// 4. "클릭이 일어나면 이 함수를 실행해줘"라고 브라우저에 예약한다
navToggle.addEventListener('click', () => {
  setMenuOpen(!navMenu.classList.contains('active'));      // 5. 클릭 시 실행됨
});
```

**핵심은 예약이라는 점입니다.** JS는 위에서 아래로 한 번 실행되고 끝나므로, "언제 일어날지 모르는 일"은 함수를 미리 맡겨두는 방식으로 처리합니다.

`querySelector`에는 CSS 선택자를 그대로 씁니다(`#id`, `.class`). CSS 문법을 재사용하는 셈입니다.
하나만 찾으면 `querySelector`, 전부 찾으면 `querySelectorAll` + `forEach`로 각각에 리스너를 붙입니다.

```js
navLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});
```

`defer`가 없으면 3번에서 `null`이 반환되어 4번에서 에러가 납니다. **순서가 전부입니다.**

### Q4. 화살표 함수, 구조분해 할당, 배열 메서드는 왜 필요하고 어떻게 쓰는가?

세 가지 모두 **의도를 짧게 드러내기 위한** 문법입니다.

**화살표 함수** — `function` 키워드 없이 함수를 만듭니다. 콜백을 인자로 넘길 일이 많은 JS에서 코드가 크게 짧아집니다.

```js
const applyTheme = (theme) => { ... };
navLinks.forEach((link) => link.addEventListener('click', ...));
```

**구조분해 할당** — 객체에서 필요한 값만 이름으로 꺼냅니다.

```js
const { name, description, html_url, language, stargazers_count, forks_count } = repo;
```

GitHub API는 저장소 하나당 70개 넘는 항목을 보냅니다. **이 6개만 쓴다는 의사가 코드에 드러나는 것**이 이 문법의 진짜 값어치입니다.

**배열 메서드** — 반복문 대신 "무엇을 하려는지"를 이름으로 말합니다.

```js
const ownRepos = repos.filter((repo) => !repo.fork);          // 걸러내기
projectsGrid.innerHTML = repos.map(createProjectCard).join(''); // 변환하기
navLinks.forEach((link) => { ... });                           // 각각 실행
```

`for` 반복문으로 쓰면 세 가지가 전부 같은 모양이라 읽는 사람이 목적을 추측해야 합니다.
`filter`는 "고른다", `map`은 "바꾼다", `forEach`는 "각각 실행한다"가 이름에 이미 있습니다.

`map`이 가장 중요합니다. **데이터 배열을 HTML 문자열 배열로 바꾸는 것**이 이 프로젝트의 렌더링 방식이고, React가 하는 일도 근본적으로 같습니다.

### Q5. `fetch`와 `async/await`로 비동기 데이터를 가져오고, 로딩·성공·실패 상태를 UI로 어떻게 표현했는가?

**비동기가 필요한 이유** — 네트워크 응답은 0.1~2초가 걸립니다. 그동안 화면이 멈추면 안 되므로 JS는 요청만 보내고 다음 줄로 넘어갑니다. `await`가 "여기서만 기다려라"를 표시합니다.

**흐름**

```js
const loadProjects = async () => {
  renderLoading();                                    // ① 로딩 상태를 먼저 그린다
  try {
    const response = await fetch(url);                // ② 요청하고 기다린다
    if (!response.ok) { throw new Error(...); }       // ③ 404·403을 직접 판별
    const repos = await response.json();              // ④ 글자 → 배열로 변환
    const ownRepos = repos.filter((repo) => !repo.fork);
    if (ownRepos.length === 0) { renderEmpty(); return; }  // ⑤ 빈 상태
    renderProjects(ownRepos);                         // ⑥ 성공 상태
  } catch (error) {
    renderError(error.message);                       // ⑦ 에러 상태
  }
};
```

**③이 특히 중요합니다.** `fetch`는 서버가 404나 403을 돌려줘도 에러를 던지지 않습니다. "물어봤고 답을 받았다"는 점에서 성공이기 때문입니다. `response.ok`를 직접 확인하고 `throw`해야 `catch`가 잡습니다.

**UI 표현**

| 상태 | 화면 | 구현 |
|------|------|------|
| 로딩 | 회전 스피너 + "프로젝트를 불러오는 중..." | CSS `@keyframes spin` |
| 성공 | 카드 목록 | `map` + 템플릿 리터럴 → `innerHTML` |
| 에러 | 메시지 + **[다시 시도]** 버튼 | 버튼에 `loadProjects`를 다시 연결 |
| 빈 데이터 | "표시할 프로젝트가 없습니다." | 별도 문구 |

**에러와 빈 데이터를 구분**한 것이 요점입니다. 저장소가 0개인 것은 정상이고, 못 가져온 것은 실패라서 사용자에게 다른 안내를 해야 합니다.
403(요청 한도 초과)과 404(사용자 없음)도 문구를 나눠, 사용자가 기다려야 할지 주소를 확인해야 할지 알 수 있게 했습니다.

### Q6. "하나의 기능"을 만들 때 이벤트 → 상태 변경 → DOM 업데이트는 어떻게 연결되는가?

다크 모드를 예로 들면 이렇게 연결됩니다.

```
[이벤트]                [상태 변경]                    [DOM 업데이트]
토글 버튼 click    →    theme = 'dark'            →   <html data-theme="dark">
                        localStorage에 저장            아이콘 🌙 → ☀️
                                                      CSS 변수 9개 교체
                                                      → 전체 색상 전환
```

코드에서는 **상태를 바꾸는 쪽과 그리는 쪽을 분리**했습니다.

```js
const applyTheme = (theme) => {              // 그리는 함수 — 상태 하나로 화면을 맞춘다
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', ...);
};

themeToggle.addEventListener('click', () => { // 핸들러 — 다음 상태만 계산한다
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
});

applyTheme(readStoredTheme() || 'light');     // 페이지 로드 시에도 같은 함수를 쓴다
```

**이 구조의 이점은 화면을 그리는 경로가 하나뿐이라는 것**입니다.
클릭이든 페이지 로드든 `applyTheme` 하나만 지나가므로, 상태와 화면이 어긋날 수 없습니다.
반대로 핸들러 안에서 DOM을 직접 주무르면, 처음 로드할 때 쓰는 코드를 따로 만들어야 하고 둘이 조금씩 달라지면서 버그가 생깁니다.

같은 패턴이 이 프로젝트에 **4번** 나옵니다. (테마 / API 상태 / 폼 에러 / 메뉴 열림)

**React와의 관계** — React의 `useState`는 상태를 바꾸면 화면을 다시 그려줍니다.
지금 손으로 만든 `applyTheme`, `renderProjects`를 React가 대신 호출해주는 것이 전부입니다.
그래서 이 패턴을 이해했다면 React의 상태-렌더링은 새로운 개념이 아니라 **자동화된 같은 것**입니다.

---

## 5. 자주 하는 실수

작업하면서 실제로 걸리기 쉬운 것들입니다.

| 증상 | 원인 | 해결 |
|------|------|------|
| CSS를 고쳤는데 화면이 그대로 | 저장 안 함 / 브라우저 캐시 | `⌘S` → `⌘⇧R`(강력 새로고침) |
| JS가 하나도 동작 안 함 | `<script>`에 `defer` 누락 | `defer` 추가 (또는 `</body>` 직전으로 이동) |
| `Cannot read properties of null` | `querySelector`가 요소를 못 찾음 | 선택자의 `#`/`.` 확인, id 오타 확인 |
| 앵커 링크를 눌러도 안 움직임 | `href="#about"`과 `id="about"` 불일치 | 대소문자까지 정확히 일치시키기 |
| 모바일에서 반응형이 안 됨 | viewport meta 태그 누락 | `<meta name="viewport" ...>` 추가 |
| 폼 제출 시 화면이 깜빡임 | `preventDefault()` 누락 | `submit` 핸들러 첫 줄에 추가 |
| 브라우저 경고창이 먼저 뜸 | `<form>`에 `novalidate` 누락 | `novalidate` 추가 |
| 버튼을 눌렀는데 폼이 제출됨 | `<button>`의 `type` 기본값이 `submit` | `type="button"` 명시 |
| 한글이 깨짐 | `<meta charset="UTF-8">` 누락 또는 위치가 늦음 | `<head>` 맨 위로 |
| 미디어쿼리가 안 먹음 | 파일 앞쪽에 써서 뒤 규칙에 덮어쓰임 | 미디어쿼리는 **파일 맨 뒤**로 |
| 고정 헤더가 내용을 가림 | `position: fixed`는 자리를 차지하지 않음 | `main { padding-top: 헤더높이 }` |
| 앵커 이동 시 제목이 헤더에 가림 | 스크롤 위치 보정 없음 | `html { scroll-padding-top: 헤더높이 }` |
| GitHub API가 403을 반환 | 인증 없이 시간당 60회 제한 | 잠시 기다리기. 에러 UI가 뜨는지 확인 |
| `file://`로 열면 API 실패 | 브라우저 보안 정책 | 반드시 로컬 서버(`http://`)로 실행 |
| 이미지 로딩 시 화면이 튐 | `<img>`에 `width`/`height` 없음 | 두 속성 추가로 자리 미리 확보 |
| 다크 모드가 새로고침 후 풀림 | `localStorage` 저장/복원 누락 | `setItem` + 로드 시 `getItem` |

---

## 참고

- MDN Web Docs — https://developer.mozilla.org/ko/
- CSS-Tricks Flexbox 가이드 — https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- CSS-Tricks Grid 가이드 — https://css-tricks.com/snippets/css/complete-guide-grid/
- GitHub REST API — https://docs.github.com/en/rest/repos/repos
