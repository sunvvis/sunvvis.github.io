"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { PostMetadata } from "@/lib/posts";
import PageLayout from "@/components/PageLayout";
import Pagination from "@/components/Pagination";

// PostCard 컴포넌트를 동적으로 import (클라이언트 측에서만 로드)
const PostCard = dynamic(() => import("@/components/PostCard"), {
  ssr: false,
  loading: () => (
    <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
  ),
});

// 검색 결과 컴포넌트
function SearchResults() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const pageParam = searchParams.get("page");

  const [searchResults, setSearchResults] = useState<PostMetadata[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 페이지네이션 설정
  const postsPerPage = 12; // 페이지당 12개 포스트
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const totalPages = Math.ceil(searchResults.length / postsPerPage);

  // 현재 페이지에 표시할 포스트
  const currentPosts = searchResults.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // URL 쿼리 파라미터가 변경되면 검색 실행
  useEffect(() => {
    // 쿼리 파라미터가 있으면 자동으로 검색 실행
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  // 검색 실행 함수
  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      // 서버에 검색 요청 보내기
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("검색 중 오류가 발생했습니다");
      }

      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("검색 오류:", error);
      // 오류 발생 시 빈 결과 표시
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PageLayout
      title={`검색: ${queryParam}`}
      description={
        queryParam
          ? `"${queryParam}"에 대한 검색 결과: ${searchResults.length}개`
          : ""
      }
    >
      {isSearching ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              queryParam && (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    검색 결과가 없습니다. 다른 검색어를 시도해보세요.
                  </p>
                </div>
              )
            )}
          </div>

          {searchResults.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/search?q=${encodeURIComponent(queryParam)}`}
              isQueryString={true}
            />
          )}
        </>
      )}
    </PageLayout>
  );
}

export default function SearchPage() {
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    setMounted(true);
  }, []);

  // 마운트 전에는 최소한의 UI만 표시
  if (!mounted) {
    return (
      <PageLayout title="검색" description="">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </PageLayout>
    );
  }

  return (
    <Suspense
      fallback={
        <PageLayout title="검색" description="">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8"></div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </PageLayout>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
