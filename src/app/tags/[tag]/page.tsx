import { getPostsByTag, getAllTags } from "@/lib/posts";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import PageLayout from "@/components/PageLayout";
import Pagination from "@/components/Pagination";

// 서버 컴포넌트 명시
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ tag: string }>;
};

export default async function TagPage({ params }: Props) {
  // Next.js 15에서는 params가 Promise이므로 await로 해결
  const resolvedParams = await params;
  const tag = resolvedParams.tag;

  // URL 디코딩을 통해 원래 태그 이름으로 변환
  const decodedTag = decodeURIComponent(tag);

  // 모든 태그 가져오기
  const allTags = getAllTags();

  // 원본 태그 이름 찾기 (대소문자 유지)
  const originalTag =
    allTags.find(
      (t) =>
        t.toLowerCase().replace(/\s+/g, "-") ===
        decodedTag.toLowerCase().replace(/\s+/g, "-")
    ) || decodedTag;

  // 태그에 해당하는 포스트 가져오기
  const posts = getPostsByTag(decodedTag);

  // 포스트가 없으면 404 페이지로 리다이렉트
  if (posts.length === 0) {
    notFound();
  }

  // 페이지당 포스트 수 설정
  const postsPerPage = 12;

  // 총 페이지 수 계산 (최소 1페이지)
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));

  // 첫 페이지의 포스트만 표시
  const currentPosts = posts.slice(0, postsPerPage);

  return (
    <PageLayout
      title={`태그: ${originalTag}`}
      description={`${originalTag} 태그가 있는 포스트: ${posts.length}개`}
    >
      <div className="mb-8">
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              해당 태그의 포스트가 없습니다.
            </p>
          </div>
        )}
      </div>

      {/* 페이지네이션 추가 */}
      <Pagination
        currentPage={1}
        totalPages={totalPages}
        basePath={`/tags/${tag}`}
      />
    </PageLayout>
  );
}
