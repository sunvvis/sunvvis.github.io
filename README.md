# 개인 기술 블로그

이 기술 블로그는 Cline 확장과 Claude LLM를 활용하여 제작되었습니다. Next.js와 React를 기반으로 제작되었으며, 마크다운 기반의 콘텐츠 관리, 태그 시스템, 검색 기능, 댓글 시스템 등 다양한 기능을 제공합니다.

지속적인 업데이트를 통해 추후 블로그 테마로 배포할 계획입니다.

<!-- ![블로그 미리보기](https://via.placeholder.com/800x400?text=블로그+미리보기) -->

## 주요 기능

- ✨ **마크다운 기반 콘텐츠**: 마크다운 파일로 블로그 포스트 작성 및 관리
- 🔍 **검색 기능**: 제목, 내용, 태그 기반 포스트 검색
- 🏷️ **태그 시스템**: 포스트 분류 및 태그별 모아보기
- 📱 **반응형 디자인**: 모바일부터 데스크탑까지 모든 화면 크기 지원
- 🌓 **다크 모드**: 사용자 환경에 맞는 테마 자동 적용 및 수동 전환
- 💬 **댓글 시스템**: GitHub Discussions 기반 Giscus 댓글 기능
- 📑 **목차**: 포스트 내용 기반 자동 반응형 목차 생성
- 🔗 **SEO 최적화**: 검색 엔진 최적화를 위한 메타데이터 관리
- 🔒 **Private 포스팅 관리**: GitHub의 private 레포지토리를 통한 포스팅 콘텐츠 보호

## Private 포스팅 관리

이 블로그는 코드베이스는 public으로 공개하면서 포스팅 내용은 private으로 관리할 수 있도록 설계되었습니다. 이를 위해 Git submodule을 사용합니다:

1. **메인 레포지토리 (public)**: 블로그의 코드, 디자인, 설정 등이 포함됩니다.
2. **포스트 레포지토리 (private)**: 블로그 포스팅 내용만 포함하며, 메인 레포지토리에 submodule로 연결됩니다.

### 초기 설정 방법

1. GitHub에 private 레포지토리 생성 (예: `blog-posts`)
2. 메인 블로그 레포지토리에 submodule로 추가:
   ```bash
   git submodule add git@github.com:YOUR_USERNAME/blog-posts.git src/content/posts
   ```
3. GitHub Actions에서 private 레포지토리에 접근할 수 있도록 Personal Access Token 설정:
   - GitHub에서 Personal Access Token 생성 (`repo` 권한 필요)
   - 메인 레포지토리의 Settings > Secrets and variables > Actions에서 `ACCESS_TOKEN` 시크릿 추가

### 로컬 개발 시 사용법

1. 레포지토리 클론 시 submodule 함께 가져오기:
   ```bash
   git clone --recurse-submodules git@github.com:YOUR_USERNAME/blog.git
   ```
2. 이미 클론한 경우 submodule 초기화:
   ```bash
   git submodule update --init --recursive
   ```
3. 포스트 작성 후 private 레포지토리에 먼저 커밋 및 푸시:
   ```bash
   cd src/content/posts
   git add .
   git commit -m "Add new post"
   git push
   ```
4. 메인 레포지토리에서 submodule 참조 업데이트:
   ```bash
   cd ../../../
   git add src/content/posts
   git commit -m "Update posts submodule"
   git push
   ```

## 검색 기능 사용법

이 블로그는 클라이언트 사이드 검색 기능을 제공합니다. 검색 데이터는 빌드 시점에 생성되며, 다음과 같이 사용할 수 있습니다:

1. **개발 환경에서 검색 데이터 생성**:
   ```bash
   node scripts/generate-search-data.js
   ```
   이 명령어는 `public/search-data.json` 파일을 생성합니다.

2. **빌드 시 자동 생성**:
   빌드 과정에서 `postbuild` 스크립트가 자동으로 검색 데이터를 생성합니다.

3. **검색 사용**:
   네비게이션 바의 검색창에 검색어를 입력하고 엔터를 누르면 검색 결과 페이지로 이동합니다.

## 사용법

커스텀 시 아래 파일의 텍스트 수정이 필요합니다.

추후 config 파일 하나에서 수정 가능하도록 개선할 계획입니다.

```
blog/
└── src/
  ├── app
  │ ├── layout.tsx
  │ └── page.tsx
  └── components
    └── Navbar.tsx
```

<!-- ### 필수 조건

- Node.js 18.17.0 이상
- npm, yarn, 또는 pnpm

### 설치

1. 저장소를 클론합니다:

```bash
git clone https://github.com/yourusername/blog.git
cd blog
```

2. 의존성을 설치합니다:

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

3. 개발 서버를 실행합니다:

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 블로그를 확인합니다.

## 블로그 포스트 작성하기

1. `src/content/posts` 디렉토리에 새 마크다운 파일을 생성합니다 (예: `my-new-post.md`).

2. 다음과 같은 형식으로 포스트의 메타데이터와 내용을 작성합니다:

````markdown
---
title: "포스트 제목"
date: "2025-04-29"
excerpt: "포스트에 대한 간단한 설명"
author: "작성자 이름"
categories: ["카테고리1", "카테고리2"]
tags: ["태그1", "태그2", "태그3"]
published: true
coverImage: "/images/cover.jpg" # 선택 사항
---

여기에 마크다운 형식으로 포스트 내용을 작성합니다.

## 소제목

- 목록 항목 1
- 목록 항목 2

### 코드 예제

```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

이미지 삽입:

![이미지 설명](/images/example.jpg)

```

3. 개발 서버를 실행 중이라면 자동으로 새 포스트가 블로그에 표시됩니다.

## 댓글 시스템 설정 (Giscus)

Giscus 댓글 시스템을 설정하려면 [README-giscus.md](README-giscus.md) 파일의 지침을 따르세요. -->
<!--
## 프로젝트 구조

```

blog/
├── public/ # 정적 파일 (이미지, 아이콘 등)
├── src/
│ ├── app/ # Next.js 앱 라우터
│ │ ├── api/ # API 라우트
│ │ ├── blog/ # 블로그 관련 페이지
│ │ ├── search/ # 검색 페이지
│ │ ├── tags/ # 태그 관련 페이지
│ │ └── page.tsx # 홈페이지
│ ├── components/ # 재사용 가능한 컴포넌트
│ │ ├── ui/ # UI 컴포넌트
│ │ └── ...
│ ├── content/ # 블로그 콘텐츠
│ │ └── posts/ # 마크다운 포스트 파일
│ ├── contexts/ # React 컨텍스트
│ └── lib/ # 유틸리티 함수
├── tailwind.config.js # Tailwind CSS 설정
└── next.config.ts # Next.js 설정

```` -->

<!-- ## 커스터마이징

### 테마 변경

Tailwind CSS 테마는 `tailwind.config.js` 파일에서 수정할 수 있습니다:

```js
theme: {
  extend: {
    colors: {
      primary: { /* 원하는 색상으로 변경 */ },
      // 다른 색상 추가
    },
    // 다른 테마 속성 추가
  },
}
````

### 블로그 정보 변경

메인 페이지의 블로그 제목, 설명 등은 `src/app/page.tsx` 파일에서 수정할 수 있습니다. -->

<!-- ## 배포

이 블로그는 [Vercel](https://vercel.com/)에 쉽게 배포할 수 있습니다:

1. GitHub에 프로젝트를 푸시합니다.
2. Vercel에 가입하고 GitHub 저장소를 연결합니다.
3. 배포 설정을 구성하고 "Deploy" 버튼을 클릭합니다.

다른 호스팅 서비스를 사용하려면 먼저 프로젝트를 빌드해야 합니다:

```bash
npm run build
# 또는
yarn build
# 또는
pnpm build
```

그런 다음 `npm run start` 명령으로 프로덕션 서버를 실행하거나, 생성된 `.next` 디렉토리를 선택한 호스팅 서비스에 배포합니다. -->
<!-- 
## 기여하기

1. 이 저장소를 포크합니다.
2. 새 브랜치를 생성합니다: `git checkout -b feature/amazing-feature`
3. 변경 사항을 커밋합니다: `git commit -m 'Add amazing feature'`
4. 브랜치를 푸시합니다: `git push origin feature/amazing-feature`
5. Pull Request를 제출합니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요. -->
