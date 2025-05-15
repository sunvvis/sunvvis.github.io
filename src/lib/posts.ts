import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";

/**
 * 블로그 포스트 파일이 저장된 디렉토리 경로
 */
const postsDirectory = path.join(process.cwd(), "src/content/posts");

/**
 * 포스트 메타데이터 타입 정의
 * @typedef {Object} PostMetadata
 * @property {string} slug - 포스트 URL 슬러그 (파일명에서 .md 확장자 제거)
 * @property {string} title - 포스트 제목
 * @property {string} date - 포스트 작성일 (YYYY-MM-DD 형식)
 * @property {string} excerpt - 포스트 요약 (미사용)
 * @property {string} author - 포스트 작성자 (미사용)
 * @property {string[]} categories - 포스트 카테고리 목록 (미사용)
 * @property {string[]} tags - 포스트 태그 목록
 * @property {boolean} published - 포스트 공개 여부
 * @property {string} [coverImage] - 포스트 커버 이미지 URL (선택적)
 */
export type PostMetadata = {
  slug: string;
  title: string;
  date: string;
  // excerpt: string;
  // author: string;
  // categories: string[];
  tags: string[];
  published: boolean;
  coverImage?: string;
};

/**
 * 포스트 전체 데이터 타입 정의 (메타데이터 + 내용)
 * @typedef {Object} Post
 * @property {string} content - 변환된 HTML 콘텐츠
 */
export type Post = PostMetadata & {
  content: string;
};

/**
 * 모든 포스트의 메타데이터를 가져오는 함수
 *
 * @returns {PostMetadata[]} 날짜순으로 정렬된 게시된 포스트 메타데이터 배열
 */
export function getAllPosts(): PostMetadata[] {
  // 포스트 디렉토리가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // 모든 마크다운 파일 가져오기
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // 파일 이름에서 .md 확장자 제거하여 slug 생성
      const slug = fileName.replace(/\.md$/, "");

      // 마크다운 파일을 문자열로 읽기
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // gray-matter를 사용하여 메타데이터 파싱
      const matterResult = matter(fileContents);

      // 메타데이터와 slug 반환
      return {
        slug,
        title: matterResult.data.title || "",
        date: matterResult.data.date || "",
        // excerpt: matterResult.data.excerpt || "",
        // author: matterResult.data.author || "",
        // categories: matterResult.data.categories || [],
        tags: matterResult.data.tags || [],
        published: matterResult.data.published !== false, // 기본값은 true
        coverImage: matterResult.data.coverImage || "",
      };
    })
    // 날짜 기준으로 정렬 (최신 글이 먼저)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    // 게시된 포스트만 필터링
    .filter((post) => post.published);

  return allPostsData;
}

/**
 * 특정 태그가 포함된 포스트 목록을 가져오는 함수
 *
 * @param {string} tag - 검색할 태그
 * @returns {PostMetadata[]} 해당 태그를 포함하는 포스트 메타데이터 배열
 */
export function getPostsByTag(tag: string): PostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.tags.some((t) => {
      // 태그 비교 시 공백/하이픈 정규화 (대소문자는 유지)
      const normalizedPostTag = t.replace(/\s+/g, "-");
      const normalizedSearchTag = tag.replace(/\s+/g, "-");
      // 대소문자를 무시하고 비교 (검색 기능을 위해)
      return (
        normalizedPostTag.toLowerCase() === normalizedSearchTag.toLowerCase()
      );
    })
  );
}

/**
 * 특정 슬러그에 해당하는 포스트의 전체 내용을 가져오는 함수
 *
 * @param {string} slug - 포스트 슬러그
 * @returns {Promise<Post | null>} 포스트 데이터 또는 찾지 못한 경우 null
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // URL에서 전달된 slug를 디코딩 (URL 인코딩된 공백 등을 원래 문자로 변환)
    const decodedSlug = decodeURIComponent(slug);

    // 디코딩된 slug로 파일 경로 생성
    const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);

    // 파일이 존재하지 않으면 null 반환
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // 마크다운을 HTML로 변환 (GFM 지원 및 코드 구문 강조 추가)
    const processedContent = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown 지원 (표, 체크리스트 등)
      .use(remarkRehype) // remark에서 rehype로 전환
      .use(rehypePrism, { showLineNumbers: false }) // 코드 구문 강조 추가
      .use(rehypeStringify) // HTML로 변환
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      // excerpt: data.excerpt || "",
      // author: data.author || "",
      // categories: data.categories || [],
      tags: data.tags || [],
      published: data.published !== false,
      coverImage: data.coverImage || "",
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error);
    return null;
  }
}

/**
 * 검색어에 해당하는 포스트를 찾는 함수
 *
 * @param {string} query - 검색어
 * @returns {PostMetadata[]} 검색어가 제목, 요약, 카테고리 또는 태그에 포함된 포스트 배열
 */
export function searchPosts(query: string): PostMetadata[] {
  const allPosts = getAllPosts();
  const lowerCaseQuery = query.toLowerCase();

  return allPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      // post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
      // post.categories.some((cat) =>
      //   cat.toLowerCase().includes(lowerCaseQuery)
      // ) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
    );
  });
}

/**
 * 모든 포스트에서 사용된 태그 목록을 가져오는 함수
 *
 * @returns {string[]} 중복 제거된 정렬된 태그 배열
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tagsSet = new Set<string>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagsSet.add(tag);
    });
  });

  return Array.from(tagsSet).sort();
}

/**
 * 모든 포스트 메타데이터를 JSON 파일로 내보내는 함수
 * 빌드 시점에 실행되어 public 디렉토리에 search-data.json 파일 생성
 */
export function generateSearchData() {
  const posts = getAllPosts();
  const searchData = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    coverImage: post.coverImage || "",
  }));

  // public 디렉토리가 없으면 생성
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 검색 데이터를 JSON 파일로 저장
  fs.writeFileSync(
    path.join(publicDir, "search-data.json"),
    JSON.stringify(searchData),
    "utf8"
  );

  return searchData;
}
