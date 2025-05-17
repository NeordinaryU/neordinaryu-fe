import axios from 'axios';
import {API_BASE_URL} from '@env';
import {BaseApiResponse} from './types'; // BaseApiResponse 가져오기

export interface MagazineItem {
  id: string;
  title: string;
  subtitle: string; // API의 'body'가 여기에 매핑됨
  photoUrl?: string;
  link?: string;
}

// 이 특정 인터페이스는 'data' 배열 내 개별 매거진 아이템의 구조를 정의합니다.
interface ApiMagazineDataItem {
  id: number; // API는 id를 숫자로 보냄
  title: string;
  body: string;
  photoUrl: string;
  link: string;
  createdAt: string; // 또는 Date 타입
}

// BaseApiResponse<ApiMagazineDataItem[]>를 사용하므로 MagazineApiResponse는 더 이상 필요하지 않습니다.

export const fetchMagazines = async (): Promise<MagazineItem[]> => {
  console.log(`매거진 API 요청: ${API_BASE_URL}/magazines/list`);
  try {
    // 제네릭 BaseApiResponse를 사용하며, 'data'의 타입으로 ApiMagazineDataItem[]를 지정합니다.
    const response = await axios.get<BaseApiResponse<ApiMagazineDataItem[]>>(
      `${API_BASE_URL}/magazines/list`,
    );

    console.log('매거진 API 원본 응답:', JSON.stringify(response.data, null, 2));

    // 응답 본문의 statusCode 또는 데이터 존재 여부에 따라 성공 여부를 확인하도록 조정합니다.
    // API가 성공 시 본문에 의미있는 statusCode(예: 200)를 반환한다고 가정합니다.
    if (response.data && response.data.statusCode === 200 && response.data.data) {
      const transformedData = response.data.data.map(
        (item): MagazineItem => ({
          id: item.id.toString(),
          title: item.title,
          subtitle: item.body,
          photoUrl: item.photoUrl,
          link: item.link,
        }),
      );
      return transformedData;
    } else {
      // statusCode가 200이 아니거나 데이터가 누락된 경우 에러로 간주합니다.
      const errorMessage =
        response.data.message ||
        '매거진 조회 실패: API 요청은 성공했으나 데이터가 실패를 나타냅니다.';
      console.error('매거진 조회 실패:', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('fetchMagazines 호출 중 에러 발생:', error);
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || '알 수 없는 Axios 에러가 발생했습니다.';
      throw new Error(`API 에러: ${message}`);
    }
    throw new Error(
      error instanceof Error ? error.message : '매거진 조회 중 알 수 없는 에러가 발생했습니다.',
    );
  }
};
