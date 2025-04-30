"use client";

import React, { useEffect, useState } from "react";
import Giscus from "@giscus/react";

export default function GiscusComments() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 컴포넌트가 마운트된 후에만 Giscus를 렌더링하고 테마 감지
  useEffect(() => {
    setMounted(true);

    // 다크 모드 감지
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "light");

    // 테마 변경 감지를 위한 MutationObserver 설정
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          const isDarkMode =
            document.documentElement.classList.contains("dark");
          setTheme(isDarkMode ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // GitHub 저장소 설정이 완료되지 않은 경우 안내 메시지 표시
  const isConfigured = false; // TODO: 실제 저장소 설정 후 true로 변경

  if (!mounted) return null;

  if (!isConfigured) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg text-center">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          GitHub 저장소 설정이 필요합니다
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          댓글 기능을 사용하려면 GitHub 저장소에 Discussions 기능을 활성화하고
          giscus 앱을 설치한 후, 아래 코드의 설정을 업데이트해주세요.
        </p>
      </div>
    );
  }

  const giscusTheme = theme === "dark" ? "dark_dimmed" : "light";

  return (
    <Giscus
      id="comments"
      repo="[GITHUB_USERNAME]/[REPOSITORY_NAME]" // TODO: 실제 저장소로 변경 (예: username/blog)
      repoId="[REPOSITORY_ID]" // TODO: giscus.app에서 생성된 ID로 변경
      category="Announcements" // TODO: 원하는 카테고리로 변경
      categoryId="[CATEGORY_ID]" // TODO: giscus.app에서 생성된 ID로 변경
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={giscusTheme}
      lang="ko"
      loading="lazy"
    />
  );
}
