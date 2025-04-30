"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  contentSelector: string; // 본문 컨텐츠를 선택하는 CSS 선택자
};

export default function TableOfContents({
  contentSelector,
}: TableOfContentsProps) {
  // 클라이언트 사이드 렌더링을 위한 마운트 상태
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드 렌더링 중에는 아무것도 렌더링하지 않음
  if (!mounted) {
    return null;
  }

  // 클라이언트 사이드에서만 렌더링되는 실제 컴포넌트
  return <TableOfContentsContent contentSelector={contentSelector} />;
}

// 실제 목차 컴포넌트 - 클라이언트 사이드에서만 렌더링됨
function TableOfContentsContent({
  contentSelector,
}: {
  contentSelector: string;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [clickLock, setClickLock] = useState<boolean>(false);
  const [targetHeadingId, setTargetHeadingId] = useState<string | null>(null);
  const [themeChanging, setThemeChanging] = useState<boolean>(false);
  const { theme } = useTheme(); // 이제 안전하게 useTheme 훅 사용 가능
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingElementsRef = useRef<{
    [id: string]: IntersectionObserverEntry;
  }>({});
  const lastActiveIdRef = useRef<string>("");

  // 제목 요소에 ID 추가 및 목차 생성
  useEffect(() => {
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    // 제목 요소 찾기 (h1, h2, h3)
    const headingElements = Array.from(
      contentElement.querySelectorAll("h1, h2, h3")
    );

    // 제목 요소에 ID 추가 및 목차 데이터 생성
    const headingsData = headingElements.map((element, index) => {
      // ID가 없으면 생성
      if (!element.id) {
        element.id = `heading-${index}`;
      }

      // 스크롤 마진 추가 (상단 바에 의해 가려지지 않도록)
      (element as HTMLElement).style.scrollMarginTop = "80px";

      return {
        id: element.id,
        text: element.textContent || "",
        level: parseInt(element.tagName.substring(1)), // h1 -> 1, h2 -> 2, ...
      };
    });

    setHeadings(headingsData);

    // 모바일 화면에서는 기본적으로 목차 숨기기
    const handleResize = () => {
      setIsVisible(window.innerWidth >= 1024); // lg 브레이크포인트
    };

    handleResize(); // 초기 설정
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [contentSelector]);

  // 헤딩 요소의 위치 정보를 저장할 ref
  const headingPositionsRef = useRef<{ [id: string]: number }>({});
  // 마지막 스크롤 위치를 저장할 ref
  const lastScrollTopRef = useRef<number>(0);
  // 스크롤 방향을 저장할 ref (true: 아래로, false: 위로)
  const scrollDirectionRef = useRef<boolean>(true);
  // 스로틀 타이머를 저장할 ref
  const throttleTimerRef = useRef<number | null>(null);

  // 스크롤 위치에 따라 가장 가까운 헤딩을 찾는 함수
  const findActiveHeadingByScroll = useCallback(() => {
    if (clickLock || themeChanging || headings.length === 0) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollTopRef.current;
    scrollDirectionRef.current = scrollDirection;
    lastScrollTopRef.current = scrollTop;

    // 타겟 헤딩 ID가 있으면 해당 ID를 우선시
    if (targetHeadingId) {
      const targetElement = document.getElementById(targetHeadingId);
      if (
        targetElement &&
        Math.abs(targetElement.getBoundingClientRect().top) < 150
      ) {
        setActiveId(targetHeadingId);
        return;
      }
    }

    // 스크롤 위치에 따라 가장 가까운 헤딩 찾기
    let closestHeading = null;
    let closestDistance = Infinity;

    // 헤딩 위치 업데이트 및 가장 가까운 헤딩 찾기
    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      headingPositionsRef.current[heading.id] = rect.top + scrollTop;

      // 헤딩과 현재 스크롤 위치의 거리 계산
      const distance = Math.abs(rect.top);

      // 스크롤 방향에 따라 다른 로직 적용
      if (scrollDirection) {
        // 아래로 스크롤 시, 화면 상단 위에 있거나 가까운 헤딩 선택
        if (rect.top <= 100 && distance < closestDistance) {
          closestHeading = heading;
          closestDistance = distance;
        }
      } else {
        // 위로 스크롤 시, 화면 상단 근처에 있는 헤딩 선택
        if (rect.top <= 150 && distance < closestDistance) {
          closestHeading = heading;
          closestDistance = distance;
        }
      }
    }

    // 가장 가까운 헤딩이 있으면 활성화
    if (closestHeading) {
      setActiveId(closestHeading.id);
    }
  }, [headings, clickLock, themeChanging, targetHeadingId]);

  // 스로틀된 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (throttleTimerRef.current !== null) return;

    throttleTimerRef.current = window.setTimeout(() => {
      findActiveHeadingByScroll();
      throttleTimerRef.current = null;
    }, 100); // 100ms 스로틀
  }, [findActiveHeadingByScroll]);

  // IntersectionObserver를 사용하여 현재 보이는 제목 감지
  useEffect(() => {
    if (headings.length === 0) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        headingElementsRef.current[entry.target.id] = entry;
      });

      // 클릭 잠금이나 테마 변경 중이면 활성 ID 업데이트를 건너뜀
      if (clickLock || themeChanging) return;

      // 타겟 헤딩 ID가 있으면 해당 ID를 우선시
      if (targetHeadingId) {
        const targetEntry = headingElementsRef.current[targetHeadingId];
        if (targetEntry && targetEntry.isIntersecting) {
          setActiveId(targetHeadingId);
          return;
        }
      }

      // 현재 화면에 보이는 제목 중 가장 위에 있는 것을 활성화
      const visibleHeadings = Object.values(headingElementsRef.current).filter(
        (entry) => entry.isIntersecting
      );

      if (visibleHeadings.length === 0) return;

      // 여러 제목이 보이는 경우 가장 위에 있는 것 선택
      // 화면 상단에 더 가까운 헤더를 우선시
      const sortedVisibleHeadings = visibleHeadings.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
      );

      // 화면 상단에 가까운 헤더만 고려 (상단에서 특정 픽셀 이내)
      const topHeadings = sortedVisibleHeadings.filter(
        (entry) => entry.boundingClientRect.top < 100
      );

      if (topHeadings.length > 0) {
        setActiveId(topHeadings[0].target.id);
      } else {
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    // IntersectionObserver 설정 - 더 민감하게 조정
    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -70% 0px", // 상단 여백 축소, 하단 여백 확대
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5], // 더 세밀한 임계값 설정
    });

    // 모든 제목 요소 관찰
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 초기 활성 헤딩 설정
    findActiveHeadingByScroll();

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimerRef.current !== null) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, [headings, themeChanging, handleScroll, findActiveHeadingByScroll]);

  // 테마 변경 감지 및 처리
  useEffect(() => {
    // 테마가 변경되면 현재 활성화된 ID를 저장하고 테마 변경 상태를 true로 설정
    if (activeId) {
      lastActiveIdRef.current = activeId;
      setThemeChanging(true);

      // 테마 전환 애니메이션이 완료된 후 테마 변경 상태를 false로 설정하고 활성화된 ID 복원
      setTimeout(() => {
        setActiveId(lastActiveIdRef.current);
        setThemeChanging(false);
      }, 400); // CSS transition 시간보다 약간 더 길게 설정
    }
  }, [theme, activeId]);

  // 목차 항목 클릭 시 해당 섹션으로 스크롤
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 클릭 잠금 활성화
      setClickLock(true);

      // 타겟 헤딩 ID 설정
      setTargetHeadingId(id);

      // 활성 ID 설정
      setActiveId(id);

      // IntersectionObserver 일시 중지
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // 부드러운 스크롤 효과
      element.scrollIntoView({ behavior: "smooth" });

      // 스크롤 완료 후 IntersectionObserver 재활성화 및 클릭 잠금 해제
      // 스크롤 애니메이션 시간을 고려하여 타이머 설정
      setTimeout(() => {
        // IntersectionObserver 재활성화
        if (observerRef.current) {
          headings.forEach((heading) => {
            const headingElement = document.getElementById(heading.id);
            if (headingElement) {
              observerRef.current?.observe(headingElement);
            }
          });
        }

        // 클릭 잠금 해제
        setClickLock(false);

        // 일정 시간 후 타겟 헤딩 ID 초기화
        setTimeout(() => {
          setTargetHeadingId(null);
        }, 500); // 시간 단축
      }, 1000); // 시간 단축
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="relative">
      {/* 모바일 토글 버튼 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        aria-label={isVisible ? "목차 숨기기" : "목차 보기"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>

      {/* 목차 컨테이너 - 벨로그 스타일로 변경 */}
      <div
        className={`
          fixed lg:sticky lg:top-24 right-4 lg:right-auto
          w-64 max-h-[80vh] overflow-y-auto
          bg-transparent rounded-xl
          p-4 transition-all duration-300 z-40
          ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100"
          }
        `}
        style={{
          maxWidth: "90vw", // 모바일에서 화면 너비의 90%로 제한
        }}
      >
        <nav>
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(heading.id);
                  }}
                  className={`
                    block py-1.5 px-2 text-sm rounded-md 
                    transition-all duration-200 ease-in-out
                    border-l-2 
                    ${
                      activeId === heading.id
                        ? "bg-gray-100/50 dark:bg-gray-700/30 border-l-2 border-blue-500 dark:border-blue-400 font-medium"
                        : "text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    }
                  `}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
