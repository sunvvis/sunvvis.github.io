import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "기술 블로그",
  description: "Next.js로 만든 커스텀 기술 블로그",
  keywords: ["기술 블로그", "프로그래밍", "개발", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        {/* 
          다크모드 초기화 스크립트 제거 - 하이드레이션 불일치 문제 해결을 위해
          ThemeToggle 컴포넌트에서 클라이언트 측에서만 테마를 초기화하도록 함
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#101218] text-gray-900 dark:text-gray-100`}
      >
        <Providers>
          <Navbar />
          <main className="animate-fade-in min-h-screen">{children}</main>
          <footer className="bg-gray-50 dark:bg-[#1f2128] border-t border-gray-200 dark:border-[#292c32] py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pb-12">
                <div>
                  <h3 className="font-bold text-lg mb-4">기술 블로그</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Next.js로 만든 커스텀 기술 블로그입니다. 프로그래밍, 개발,
                    기술 관련 글을 공유합니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">링크</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/posts"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        포스트
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/tags"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        태그
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">연락처</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    문의사항이 있으시면 이메일로 연락해주세요.
                  </p>
                  <a
                    href="mailto:contact@example.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    contact@example.com
                  </a>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-[#292c32] mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
                <p>
                  © {new Date().getFullYear()} 기술 블로그. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
