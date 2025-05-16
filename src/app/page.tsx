import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import PageLayout from "@/components/PageLayout";
import PostCard from "@/components/PostCard";
import TagBadge from "@/components/ui/TagBadge";

// 정적 내보내기를 위해 dynamic 설정 제거
// export const dynamic = "force-dynamic";

export default function Home() {
  // 최근 포스트 가져오기 (최대 6개)
  const recentPosts = getAllPosts().slice(0, 6);

  // 태그 가져오기
  const tags = getAllTags().slice(0, 20); // 최대 20개 태그만 표시

  return (
    <PageLayout
      title="블로그"
      description="AI 관련 지식과 인사이트를 공유하는 기술 블로그입니다"
      fullWidth={false}
    >
      {/* 히어로 섹션 */}
      <section className="mb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 shadow-md relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-50 mt-4 leading-tight">
            AI 엔지니어링에 관한 <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
              지식과 인사이트
            </span>
            를 공유합니다
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            머신러닝, 딥러닝, LLM, AI 도구, 그리고 엔지니어링 경험에
            관한 글을 작성합니다. 최신 AI 기술과 실용적인 팁을 이곳에서 만나보세요.
          </p>
        </div>
      </section>

      {/* 포스트 섹션 */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
            최신 포스트
          </h2>
          <Link
            href="/posts"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center font-medium"
          >
            더보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => <PostCard key={post.slug} post={post} />)
          ) : (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700">
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
                아직 작성된 포스트가 없습니다.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                곧 새로운 콘텐츠가 업데이트될 예정입니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 태그 섹션 */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
            태그
          </h2>
          <Link
            href="/tags"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center font-medium"
          >
            더보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
        <div className="mt-4">
          <div className="flex flex-wrap gap-3">
            {tags.length > 0 ? (
              tags.map((tag) => <TagBadge key={tag} tag={tag} />)
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                아직 태그가 없습니다.
              </p>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
