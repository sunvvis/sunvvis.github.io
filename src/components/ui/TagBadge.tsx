import Link from "next/link";

/**
 * TagBadge 컴포넌트 props 타입 정의
 * @typedef {Object} TagBadgeProps
 * @property {string} tag - 표시할 태그 이름
 * @property {string} [className] - 추가 CSS 클래스 (선택적)
 */
type TagBadgeProps = {
  tag: string;
  className?: string;
};

/**
 * 태그 배지 컴포넌트
 *
 * 태그 페이지로 연결되는 링크 형태의 배지를 렌더링합니다.
 * 주로 태그 목록 페이지나 태그 클라우드에서 사용됩니다.
 * PostTagBadge와 달리 더 큰 크기와 테두리가 있는 디자인을 가집니다.
 *
 * @param {TagBadgeProps} props - 컴포넌트 props
 * @returns {JSX.Element} 태그 배지 컴포넌트
 */
export default function TagBadge({ tag, className = "" }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
      className={`text-base px-4 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
    >
      {tag}
    </Link>
  );
}
