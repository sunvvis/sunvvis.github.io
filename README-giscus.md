# Giscus 댓글 시스템 설정 가이드

이 가이드는 블로그에 Giscus 댓글 시스템을 설정하는 방법을 안내합니다.

## 1. GitHub 저장소 설정

### 1.1 GitHub 저장소 생성 (이미 있는 경우 건너뛰기)

1. GitHub에 로그인합니다.
2. 오른쪽 상단의 '+' 버튼을 클릭하고 'New repository'를 선택합니다.
3. 저장소 이름을 입력하고 필요한 설정을 선택한 후 'Create repository'를 클릭합니다.

### 1.2 Discussions 기능 활성화

1. 생성한 저장소 페이지로 이동합니다.
2. 'Settings' 탭을 클릭합니다.
3. 'Features' 섹션에서 'Discussions'를 찾아 체크박스를 선택합니다.
4. 페이지 하단의 'Save changes' 버튼을 클릭합니다.

## 2. Giscus 앱 설치

1. [Giscus 앱 페이지](https://github.com/apps/giscus)로 이동합니다.
2. 'Install' 버튼을 클릭합니다.
3. 'Only select repositories'를 선택하고 Discussions를 활성화한 저장소를 선택합니다.
4. 'Install' 버튼을 클릭하여 설치를 완료합니다.

## 3. Giscus 설정 정보 가져오기

1. [Giscus 웹사이트](https://giscus.app/ko)로 이동합니다.
2. 다음 정보를 입력합니다:
   - 저장소: `username/repository` 형식으로 입력합니다.
   - 페이지와 Discussion 연결 방법: 'pathname'을 선택합니다.
   - Discussion 카테고리: 'Announcements'를 선택하거나 원하는 카테고리를 선택합니다.
   - 기능: 원하는 기능을 선택합니다 (기본값 사용 권장).
   - 테마: 'preferred_color_scheme'을 선택합니다.
   - 언어: '한국어'를 선택합니다.
3. 페이지 하단에 생성된 설정 코드에서 다음 정보를 확인합니다:
   - `data-repo`: 저장소 이름 (예: username/repository)
   - `data-repo-id`: 저장소 ID
   - `data-category`: 카테고리 이름
   - `data-category-id`: 카테고리 ID

## 4. 블로그 코드 업데이트

`src/components/GiscusComments.tsx` 파일을 열고 다음 부분을 수정합니다:

```tsx
// GitHub 저장소 설정이 완료되지 않은 경우 안내 메시지 표시
const isConfigured = true; // false에서 true로 변경

// ...

return (
  <Giscus
    id="comments"
    repo="username/repository" // 실제 저장소 이름으로 변경
    repoId="R_kgDOXXXXXX" // giscus.app에서 생성된 저장소 ID로 변경
    category="Announcements" // 선택한 카테고리로 변경
    categoryId="DIC_kwDOXXXXXXXXXX" // giscus.app에서 생성된 카테고리 ID로 변경
    mapping="pathname"
    reactionsEnabled="1"
    emitMetadata="0"
    inputPosition="top"
    theme={theme === "dark" ? "dark_dimmed" : "light"}
    lang="ko"
    loading="lazy"
  />
);
```

## 5. 테스트 및 확인

1. 개발 서버를 실행합니다: `npm run dev`
2. 브라우저에서 블로그 포스트 페이지로 이동합니다.
3. 댓글 섹션이 제대로 표시되는지 확인합니다.
4. 댓글을 작성하여 기능이 정상적으로 작동하는지 테스트합니다.

## 참고 사항

- Giscus는 GitHub Discussions를 기반으로 하므로, 댓글을 작성하려면 사용자가 GitHub 계정으로 로그인해야 합니다.
- 댓글은 GitHub 저장소의 Discussions 탭에서도 확인할 수 있습니다.
- 테마 설정은 블로그의 다크 모드와 자동으로 동기화됩니다.
