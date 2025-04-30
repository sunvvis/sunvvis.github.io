"use client";

import { Suspense } from "react";
import TableOfContents from "./TableOfContents";

/**
 * ClientTableOfContents 컴포넌트 props 타입 정의
 * @typedef {Object} ClientTableOfContentsProps
 * @property {string} contentSelector - 목차를 생성할 콘텐츠 요소의 CSS 선택자
 */
type ClientTableOfContentsProps = {
  contentSelector: string;
};

/**
 * 클라이언트 사이드 목차 컴포넌트
 *
 * 'use client' 지시문을 사용하여 클라이언트 컴포넌트로 선언하고,
 * Suspense로 TableOfContents 컴포넌트를 감싸 로딩 상태를 처리합니다.
 * 이 컴포넌트는 서버 컴포넌트에서 클라이언트 기능이 필요한 목차를 사용할 때 활용됩니다.
 *
 * @param {ClientTableOfContentsProps} props - 컴포넌트 props
 * @returns {JSX.Element} 클라이언트 사이드 목차 컴포넌트
 */
export default function ClientTableOfContents({
  contentSelector,
}: ClientTableOfContentsProps) {
  return (
    <Suspense
      fallback={
        <div className="h-32 bg-transparent rounded-xl animate-pulse"></div>
      }
    >
      <TableOfContents contentSelector={contentSelector} />
    </Suspense>
  );
}
