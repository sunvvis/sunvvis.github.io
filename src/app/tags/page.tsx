import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { humanizeString } from "@/lib/utils";
import PageLayout from "@/components/PageLayout";
import TagBadge from "@/components/ui/TagBadge";

// 정적 내보내기를 위해 dynamic 설정 제거
// export const dynamic = "force-dynamic";

export default function TagsPage() {
  // 모든 태그 가져오기
  const tags = getAllTags();

  return (
    <PageLayout title="태그" description="블로그의 모든 태그 목록입니다.">
      <div className="grid gap-6">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => {
            // URL에 사용할 태그 값 (공백이 있는 경우 인코딩)
            const encodedTag = encodeURIComponent(tag);

            return <TagBadge key={tag} tag={tag} />;
          })}
        </div>

        {tags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              아직 태그가 없습니다.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
