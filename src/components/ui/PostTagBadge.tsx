import Link from "next/link";

/**
 * PostTagBadge 컴포넌트 props 타입 정의
 * @typedef {Object} PostTagBadgeProps
 * @property {string} tag - 표시할 태그 이름
 * @property {string} [className] - 추가 CSS 클래스 (선택적)
 */
type PostTagBadgeProps = {
  tag: string;
  className?: string;
};

/**
 * 포스트 태그 배지 컴포넌트
 *
 * 블로그 포스트 내에서 사용되는 작은 태그 링크를 렌더링합니다.
 * TagBadge와 달리 더 작은 크기와 '#' 접두사를 가지며, 테두리가 없는
 * 간결한 디자인을 가집니다. 주로 포스트 메타데이터 영역에서 사용됩니다.
 *
 * @param {PostTagBadgeProps} props - 컴포넌트 props
 * @returns {JSX.Element} 포스트 태그 배지 컴포넌트
 */
export default function PostTagBadge({
  tag,
  className = "",
}: PostTagBadgeProps) {
  return (
    <Link
      href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
      className={`text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors ${className}`}
    >
      #{tag}
    </Link>
  );
}
