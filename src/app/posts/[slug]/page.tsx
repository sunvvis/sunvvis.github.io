import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import ClientTableOfContents from "@/components/ClientTableOfContents";
import PostTagBadge from "@/components/ui/PostTagBadge";
import PostMeta from "@/components/ui/PostMeta";
import Icon from "@/components/ui/Icon";
import ClientGiscusComments from "@/components/ClientGiscusComments";
import Image from "next/image";

/**
 * 블로그 포스트 페이지 props 타입 정의
 * @typedef {Object} Props
 * @property {Promise<{slug: string}>} params - URL 파라미터 (포스트 슬러그)
 */
type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * 블로그 포스트 상세 페이지 컴포넌트
 *
 * 특정 슬러그에 해당하는 블로그 포스트의 전체 내용을 표시합니다.
 * 포스트 내용, 메타데이터, 목차, 댓글 섹션을 포함합니다.
 *
 * @param {Props} props - 컴포넌트 props
 * @returns {Promise<JSX.Element>} 블로그 포스트 페이지
 */
export default async function BlogPostPage({ params }: Props) {
  // Next.js에서 params가 Promise이므로 await로 해결
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 슬러그에 해당하는 포스트 데이터 가져오기
  const post = await getPostBySlug(slug);

  // 포스트가 없으면 404 페이지로 리다이렉트
  if (!post) {
    notFound();
  }

  // 이전/다음 포스트 가져오기 (날짜순 네비게이션)
  const allPosts = getAllPosts();
  const currentPostIndex = allPosts.findIndex((p) => p.slug === slug);

  // 날짜순으로 정렬된 포스트 목록에서 현재 포스트의 이전/다음 포스트 찾기
  const previousPost =
    currentPostIndex < allPosts.length - 1
      ? allPosts[currentPostIndex + 1]
      : null;

  const nextPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null;

  return (
    <PageLayout title="" fullWidth={false} isPostPage={true}>
      {/* 본문과 목차를 감싸는 컨테이너 - 상대적 위치 설정 */}
      <div className="relative flex flex-col lg:flex-row justify-center -mx-4">
        {/* 본문 영역 - 왼쪽 정렬로 변경 */}
        <article className="animate-fade-in w-full lg:w-3/4 px-4">
          {/* 이미지를 최상단에 크게 배치 */}
          {post.coverImage && (
            <div className="mb-8 relative aspect-[16/9] overflow-hidden rounded-lg w-full">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                className="object-cover object-center"
                priority
              />
            </div>
          )}

          <header className="mb-4 bg-transparent rounded-lg">
            {/* 제목을 이미지 아래로 이동 */}
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <PostMeta date={post.date} />

              <span className="text-gray-400 dark:text-gray-500">•</span>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <PostTagBadge key={tag} tag={tag} className="text-sm" />
                ))}
              </div>
            </div>
          </header>

          <div className="bg-transparent rounded-lg mb-8">
            <div
              id="post-content"
              className="prose dark:prose-invert max-w-none"
            >
              <div
                className="prose-img:rounded-xl prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {/* 이전/다음 포스트 네비게이션 */}
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-4">
            {previousPost ? (
              <Link
                href={`/posts/${previousPost.slug}`}
                className="group flex flex-col bg-transparent p-4 rounded-lg hover:shadow-sm"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                  <Icon name="arrow-left" className="w-4 h-4 mr-1" />
                  이전 포스트
                </span>
                <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                  {previousPost.title}
                </span>
              </Link>
            ) : (
              <div></div>
            )}

            {nextPost ? (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="group flex flex-col bg-transparent p-4 rounded-lg hover:shadow-sm md:text-right md:items-end"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center md:justify-end">
                  다음 포스트
                  <Icon name="arrow-right" className="w-4 h-4 ml-1" />
                </span>
                <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div></div>
            )}
          </nav>

          {/* 댓글 섹션 */}
          <div className="bg-transparent rounded-lg mt-4">
            <h2 className="text-2xl font-bold mb-6">댓글</h2>
            <ClientGiscusComments />
          </div>

          {/* 블로그 목록으로 돌아가기 버튼 */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/posts"
              className="btn btn-secondary text-base px-6 py-3 rounded-lg shadow-sm hover:shadow-md flex items-center text-gray-500 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:shadow-lg dark:shadow-gray-900 transition-shadow"
            >
              <Icon name="arrow-left" className="w-4 h-4 mr-2" />
              블로그 목록으로 돌아가기
            </Link>
          </div>
        </article>

        {/* 목차 영역 - 벨로그처럼 본문 옆에 따라오게 */}
        <aside className="hidden lg:block lg:w-1/4 max-w-xs">
          <div className="lg:sticky lg:top-24 pl-8">
            {/* 데스크톱 목차 */}
            <ClientTableOfContents contentSelector="#post-content" />
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
