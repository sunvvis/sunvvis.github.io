import Link from "next/link";

type PageLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  isPostPage?: boolean; // 새로운 prop 추가
};

export default function PageLayout({
  title,
  description,
  children,
  fullWidth = false,
  isPostPage = false, // 기본값은 false
}: PageLayoutProps) {
  return (
    <div
      className={`min-h-screen ${
        fullWidth ? "max-w-[1440px]" : "max-w-7xl"
      } mx-auto px-4 ${
        isPostPage ? "py-1 md:py-2" : "py-6 md:py-8"
      } animate-slide-up`}
    >
      <header
        className={`${isPostPage ? "mb-2 md:mb-3" : "mb-8 md:mb-10"} ${
          isPostPage ? "" : "pt-8 md:pt-8"
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text text-center">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto text-center -mt-1">
            {description}
          </p>
        )}
      </header>

      <main className="mb-12">{children}</main>
    </div>
  );
}
