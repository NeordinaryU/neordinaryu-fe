import {Region} from './src/api/types';

export const API_REGION_TO_USER_LABEL_MAP: {[key in Region]: string} = {
  SEOUL: '서울',
  INCHEON_GYEONGGI: '인천/경기',
  GYEONGSANG: '경상도',
  CHUNGCHEONG: '충청도',
  GANGWON: '강원도',
  JEOLLA: '전라도',
  JEJU: '제주도',
};
