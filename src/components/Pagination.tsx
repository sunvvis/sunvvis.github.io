import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  isQueryString?: boolean; // 쿼리 파라미터 사용 여부
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  isQueryString = false, // 기본값은 false
}: PaginationProps) {
  // totalPages가 0인 경우 페이지네이션을 표시하지 않음
  if (totalPages <= 0) return null;

  // 페이지 경로 생성 함수
  const getPagePath = (page: number) => {
    if (isQueryString) {
      // 쿼리 파라미터 방식 (/search?q=query&page=2)
      const hasQueryChar = basePath.includes("?");
      const separator = hasQueryChar ? "&" : "?";
      return page === 1 ? basePath : `${basePath}${separator}page=${page}`;
    } else {
      // 일반 경로 방식 (/tags/tag/page/2)
      if (page === 1) return basePath;
      return `${basePath}/page/${page}`;
    }
  };

  // 표시할 페이지 번호 범위 계산
  const pageNumbers = [];
  const maxVisiblePages = 5; // 표시할 페이지 번호 수 증가

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-10 flex justify-center">
      <nav className="flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm p-1 border border-gray-200 dark:border-gray-700">
        {/* 첫 페이지 링크 */}
        {currentPage > 2 && (
          <Link
            href={getPagePath(1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="첫 페이지"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
        )}

        {/* 이전 페이지 링크 */}
        {currentPage > 1 && (
          <Link
            href={getPagePath(currentPage - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="이전 페이지"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        )}

        {/* 페이지 번호 */}
        {pageNumbers.map((page) => (
          <Link
            key={page}
            href={getPagePath(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              page === currentPage
                ? "bg-blue-600 text-white font-medium"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ))}

        {/* 다음 페이지 링크 */}
        {currentPage < totalPages && (
          <Link
            href={getPagePath(currentPage + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="다음 페이지"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}

        {/* 마지막 페이지 링크 */}
        {currentPage < totalPages - 1 && (
          <Link
            href={getPagePath(totalPages)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="마지막 페이지"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </nav>
    </div>
  );
}
