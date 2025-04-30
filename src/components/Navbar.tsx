"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import ThemeToggle from "./ThemeToggle";
import Icon from "./ui/Icon";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // 검색 폼 제출 처리
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    // 검색 페이지로 이동
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#101218]/95 backdrop-blur-sm border-b border-gray-200 dark:border-[#292c32]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
        >
          <span className="text-black dark:text-white">기술 블로그</span>
        </Link>

        {/* 네비게이션 메뉴 (모바일 & 데스크톱) */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative mr-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어 입력..."
              className="w-36 sm:w-48 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              aria-label="검색"
            >
              <Icon name="search" className="h-4 w-4" />
            </button>
          </form>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
