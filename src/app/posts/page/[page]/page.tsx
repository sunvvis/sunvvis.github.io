import { getAllPosts } from "@/lib/posts";
import PageLayout from "@/components/PageLayout";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";

// 서버 컴포넌트 명시
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ page: string }>;
};

export default async function BlogPaginatedPage({ params }: Props) {
  // Next.js 15에서는 params가 Promise이므로 await로 해결
  const resolvedParams = await params;
  const pageNumber = parseInt(resolvedParams.page, 10);

  // 페이지 번호가 유효하지 않으면 404 페이지로 리다이렉트
  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const posts = getAllPosts();
  const postsPerPage = 12; // 페이지당 12개 포스트
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // 페이지 번호가 총 페이지 수보다 크면 404 페이지로 리다이렉트
  if (pageNumber > totalPages) {
    notFound();
  }

  // 현재 페이지에 해당하는 포스트 가져오기
  const startIndex = (pageNumber - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  return (
    <PageLayout
      title="포스트"
      description="블로그의 모든 포스트 목록입니다."
      fullWidth={false}
    >
      {/* 포스트 목록 */}
      <div className="mb-8">
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              이 페이지에 표시할 포스트가 없습니다.
            </p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={pageNumber}
        totalPages={totalPages}
        basePath="/posts"
      />
    </PageLayout>
  );
}
