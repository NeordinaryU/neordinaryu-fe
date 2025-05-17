/**
 * 공통 API 응답 구조입니다.
 * @template T 응답의 데이터 페이로드 타입입니다.
 */
export interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// 지역 리터럴 타입 정의 (업데이트됨)
export type Region =
  | 'SEOUL' // 서울
  | 'INCHEON_GYEONGGI' // 인천/경기
  | 'GYEONGSANG' // 경상도
  | 'CHUNGCHEONG' // 충청도
  | 'GANGWON' // 강원도
  | 'JEOLLA' // 전라도
  | 'JEJU'; // 제주도
