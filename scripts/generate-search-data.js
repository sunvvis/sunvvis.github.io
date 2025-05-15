// 빌드 시 검색 데이터 생성 스크립트
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 포스트 디렉토리 경로
const postsDirectory = path.join(process.cwd(), 'src/content/posts');

// 모든 포스트 메타데이터 가져오기
function getAllPosts() {
  // 포스트 디렉토리가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // 모든 마크다운 파일 가져오기
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // 파일 이름에서 .md 확장자 제거하여 slug 생성
      const slug = fileName.replace(/\.md$/, '');

      // 마크다운 파일을 문자열로 읽기
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // gray-matter를 사용하여 메타데이터 파싱
      const matterResult = matter(fileContents);

      // 메타데이터와 slug 반환
      return {
        slug,
        title: matterResult.data.title || '',
        date: matterResult.data.date || '',
        tags: matterResult.data.tags || [],
        published: matterResult.data.published !== false, // 기본값은 true
        coverImage: matterResult.data.coverImage || '',
      };
    })
    // 날짜 기준으로 정렬 (최신 글이 먼저)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    // 게시된 포스트만 필터링
    .filter((post) => post.published);

  return allPostsData;
}

// 검색 데이터 생성 및 저장
function generateSearchData() {
  console.log('Generating search data...');
  
  try {
    const posts = getAllPosts();
    const searchData = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      tags: post.tags,
      coverImage: post.coverImage || '',
    }));

    // 검색 데이터 JSON 문자열
    const jsonData = JSON.stringify(searchData);

    // 1. public 디렉토리에 저장 (개발 환경용)
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(publicDir, 'search-data.json'),
      jsonData,
      'utf8'
    );

    // 2. out 디렉토리에도 저장 (빌드 후 정적 파일용)
    const outDir = path.join(process.cwd(), 'out');
    if (fs.existsSync(outDir)) {
      fs.writeFileSync(
        path.join(outDir, 'search-data.json'),
        jsonData,
        'utf8'
      );
      console.log(`Also copied search data to out directory for static export`);
    }

    console.log(`Generated search data for ${searchData.length} posts`);
    return searchData;
  } catch (error) {
    console.error('Error generating search data:', error);
    process.exit(1);
  }
}

// 스크립트 실행
generateSearchData(); 