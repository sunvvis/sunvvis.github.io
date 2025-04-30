import { formatDate } from "@/lib/utils";

type PostMetaProps = {
  date: string;
  readingTime?: string;
  author?: string;
  className?: string;
};

export default function PostMeta({
  date,
  readingTime,
  author,
  className = "",
}: PostMetaProps) {
  return (
    <div
      className={`flex items-center text-sm text-gray-500 dark:text-gray-400 gap-3 ${className}`}
    >
      <time dateTime={date} className="flex items-center">
        {formatDate(date)}
      </time>

      {readingTime && (
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          {readingTime}
        </span>
      )}
    </div>
  );
}
