import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@env';

// 새로운 Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  async config => {
    // AsyncStorage에서 토큰 가져오기
    const token = await AsyncStorage.getItem('userToken');

    // 토큰이 있다면 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Axios 인터셉터: 토큰 첨부됨');
    } else {
      console.log('Axios 인터셉터: 토큰 없음');
    }
    return config;
  },
  error => {
    // 요청 에러 처리
    console.error('Axios 인터셉터 요청 에러:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터 추가 (선택 사항: 특정 응답 코드에 대한 전역 처리 등)
axiosInstance.interceptors.response.use(
  response => {
    // 성공적인 응답은 그대로 반환
    return response;
  },
  error => {
    // 응답 에러 처리
    // 예: 401 Unauthorized 에러 발생 시 로그인 페이지로 리다이렉트 등
    if (error.response && error.response.status === 401) {
      console.error(
        'Axios 인터셉터: 401 Unauthorized 에러. 토큰 만료 또는 잘못된 토큰일 수 있습니다.',
      );
      // 여기서 로그아웃 처리 또는 로그인 페이지로 강제 이동 로직을 추가할 수 있습니다.
      // 예: navigation.navigate(SCREENS.LOGIN); (navigation 객체 접근 방법 필요)
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
