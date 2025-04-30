import Link from "next/link";
import { calculateReadingTime } from "@/lib/utils";
import type { PostMetadata } from "@/lib/posts";
import TagBadge from "./ui/TagBadge";
import PostMeta from "./ui/PostMeta";
import Icon from "./ui/Icon";
import Image from "next/image";

/**
 * PostCard 컴포넌트 props 타입 정의
 * @typedef {Object} PostCardProps
 * @property {PostMetadata} post - 표시할 포스트 메타데이터
 */
type PostCardProps = {
  post: PostMetadata;
};

/**
 * 블로그 포스트 카드 컴포넌트
 *
 * 블로그 목록 페이지에서 각 포스트를 카드 형태로 표시합니다.
 * 포스트 커버 이미지(있는 경우), 제목, 작성일을 표시하고
 * 호버 시 애니메이션 효과를 제공합니다.
 *
 * @param {PostCardProps} props - 컴포넌트 props
 * @returns {JSX.Element} 포스트 카드 컴포넌트
 */
export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <article className="group hover:translate-y-[-3px] transition-transform duration-300 overflow-hidden bg-transparent">
        {post.coverImage && (
          <div className="aspect-[2/1] relative overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="py-6 pr-6">
          <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {post.title}
          </h2>

          <div className="flex items-center justify-between mb-0">
            <PostMeta date={post.date} />
          </div>
        </div>
      </article>
    </Link>
  );
}
