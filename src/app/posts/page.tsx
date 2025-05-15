import { getAllPosts } from "@/lib/posts";
import PageLayout from "@/components/PageLayout";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

// 정적 내보내기를 위해 dynamic 설정 제거
// export const dynamic = "force-dynamic";

export default function BlogPage() {
  const posts = getAllPosts();
  const postsPerPage = 12; // 페이지당 12개 포스트로 변경
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPage = 1;
  const currentPosts = posts.slice(0, postsPerPage);

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
              아직 작성된 블로그 포스트가 없습니다.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              곧 새로운 콘텐츠가 업데이트될 예정입니다.
            </p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/posts"
      />
    </PageLayout>
  );
}
