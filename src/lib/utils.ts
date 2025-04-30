/**
 * 날짜 문자열을 'YYYY.MM.DD' 형식으로 포맷팅하는 함수
 *
 * @param {string} dateString - 변환할 날짜 문자열 (ISO 형식 등)
 * @returns {string} 'YYYY.MM.DD' 형식의 날짜 문자열
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * 콘텐츠의 예상 읽기 시간을 계산하는 함수
 *
 * @param {string} content - 읽기 시간을 계산할 콘텐츠 문자열
 * @returns {string} '분 소요' 형식의 읽기 시간 문자열
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200; // 분당 읽는 단어 수
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes}분 소요`;
}

/**
 * 문자열을 사람이 읽기 쉬운 형태로 변환하는 함수
 * URL 슬러그나 하이픈으로 구분된 문자열을 공백으로 구분된 형태로 변환
 *
 * @param {string} str - 변환할 문자열
 * @returns {string} 사람이 읽기 쉬운 형태로 변환된 문자열
 */
export function humanizeString(str: string): string {
  // 이미 공백이 포함된 문자열은 그대로 반환
  if (str.includes(" ")) {
    return str;
  }

  // URL 인코딩된 문자열이나 하이픈으로 구분된 문자열 처리
  if (str.includes("-")) {
    // 하이픈을 공백으로 변환하되, 대소문자는 유지
    return str.split("-").join(" ");
  }

  // 한글이나 다른 언어의 경우 그대로 반환
  return str;
}
