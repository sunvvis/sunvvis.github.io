import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "@/lib/posts";

export async function GET(request: NextRequest) {
  try {
    // URL에서 검색어 추출
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    // 검색 실행
    const results = searchPosts(query);

    // 결과 반환
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
