/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // 'class' 기반 다크모드 활성화
  theme: {
    extend: {
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "var(--foreground)",
            a: {
              color: "#3b82f6",
              "&:hover": {
                color: "#2563eb",
              },
            },
            h1: {
              color: "var(--foreground)",
            },
            h2: {
              color: "var(--foreground)",
            },
            h3: {
              color: "var(--foreground)",
            },
            h4: {
              color: "var(--foreground)",
            },
            h5: {
              color: "var(--foreground)",
            },
            h6: {
              color: "var(--foreground)",
            },
            strong: {
              color: "var(--foreground)",
            },
            code: {
              color: "var(--foreground)",
              backgroundColor: "#f3f4f6",
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
              fontWeight: "500",
            },
            pre: {
              backgroundColor: "#f3f4f6",
              color: "var(--foreground)",
              overflowX: "auto",
              fontWeight: "400",
            },
            blockquote: {
              color: "#4b5563",
              borderLeftColor: "#e5e7eb",
            },
          },
        },
        dark: {
          css: {
            color: "var(--foreground)",
            a: {
              color: "#60a5fa",
              "&:hover": {
                color: "#3b82f6",
              },
            },
            blockquote: {
              color: "#9ca3af",
              borderLeftColor: "#374151",
            },
            code: {
              color: "var(--foreground)",
              backgroundColor: "#1f2937",
            },
            pre: {
              backgroundColor: "#1f2937",
              color: "var(--foreground)",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // 블로그 포스트 스타일링을 위한 플러그인
  ],
};
