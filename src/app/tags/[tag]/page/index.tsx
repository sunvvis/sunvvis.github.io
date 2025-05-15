import { getPostsByTag, getAllTags } from "@/lib/posts";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import PageLayout from "@/components/PageLayout";
import Pagination from "@/components/Pagination";

// 빌드 시점에 생성할 태그 페이지 경로 지정
export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default async function TagPage() {
  // 태그 페이지 구현
} 