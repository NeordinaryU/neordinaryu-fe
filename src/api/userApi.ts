import axiosInstance from './axiosInstance';
import {BaseApiResponse, Region} from './types';

// --- 로그인 --- //
export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponseData {
  userId: string;
  region: Region;
  accessToken: string;
  refreshToken: string;
  isOnboarded: boolean;
}

export const loginUser = async (
  credentials: LoginRequest,
): Promise<BaseApiResponse<LoginResponseData>> => {
  console.log('로그인 요청 (axiosInstance 사용):', credentials);
  const response = await axiosInstance.post<BaseApiResponse<LoginResponseData>>(
    '/users/login',
    credentials,
  );
  if (response.data.statusCode !== 200) {
    console.error('로그인 실패:', response.data.message);
    throw new Error(response.data.message || '로그인에 실패했습니다.');
  }
  console.log('로그인 성공 응답:', response.data);
  return response.data;
};

// --- 사용자 지역 설정 --- //
export interface SetUserRegionRequest {
  region: Region;
}

// 이 응답은 /users/region 엔드포인트에 따라 조정될 수 있음
export interface SetUserRegionResponseData {
  userId?: string; // 토큰 기반이므로 응답에 userId가 없을 수 있음. Optional로 변경
  region: Region;
}

// 새로운 함수: 토큰 기반으로 현재 사용자 지역 설정
export const setCurrentUserRegion = async (
  data: SetUserRegionRequest,
): Promise<BaseApiResponse<SetUserRegionResponseData>> => {
  console.log(`현재 사용자 지역 설정 요청 (axiosInstance 사용):`, data);
  const response = await axiosInstance.patch<BaseApiResponse<SetUserRegionResponseData>>(
    '/users/region',
    data,
  );
  if (response.data.statusCode !== 200) {
    console.error('현재 사용자 지역 설정 실패:', response.data.message);
    throw new Error(response.data.message || '현재 사용자 지역 설정에 실패했습니다.');
  }
  console.log('현재 사용자 지역 설정 성공 응답:', response.data);
  return response.data;
};

// --- 사용자가 생성한 펀딩 조회 --- //
export interface UserCreatedFundingItem {
  fundingId: number;
  title: string;
  photoUrl: string;
  region: Region;
  detailAddress: string;
  deadlineDate: string; // ISO 날짜 문자열
  completeDueDate: string; // ISO 날짜 문자열
  goalMoney: number;
  fundedMoney: number;
  isOpen: boolean;
}

export const getUserCreatedFundings = async (
  userId: string,
): Promise<BaseApiResponse<UserCreatedFundingItem[]>> => {
  console.log(`사용자 [${userId}] 생성 펀딩 목록 조회 요청 (axiosInstance 사용)`);
  const response = await axiosInstance.get<BaseApiResponse<UserCreatedFundingItem[]>>(
    `/users/${userId}/fundings`,
  );
  if (response.data.statusCode !== 200) {
    console.error('사용자 생성 펀딩 목록 조회 실패:', response.data.message);
    throw new Error(response.data.message || '사용자 생성 펀딩 목록 조회에 실패했습니다.');
  }
  console.log('사용자 생성 펀딩 목록 조회 성공 응답:', response.data);
  return response.data;
};

// --- 현재 사용자가 생성한 펀딩 조회 --- //
// UserCreatedFundingItem은 기존 getUserCreatedFundings의 것을 재사용
export const getCurrentUserCreatedFundings = async (): Promise<
  BaseApiResponse<UserCreatedFundingItem[]>
> => {
  console.log('현재 사용자 생성 펀딩 목록 조회 요청 (axiosInstance 사용)');
  const response = await axiosInstance.get<BaseApiResponse<UserCreatedFundingItem[]>>(
    '/users/fundings', // 엔드포인트 수정: userId 없이 현재 사용자 조회
  );
  if (response.data.statusCode !== 200) {
    console.error('현재 사용자 생성 펀딩 목록 조회 실패:', response.data.message);
    throw new Error(response.data.message || '현재 사용자 생성 펀딩 목록 조회에 실패했습니다.');
  }
  console.log('현재 사용자 생성 펀딩 목록 조회 성공 응답:', response.data);
  return response.data;
};

// --- 현재 사용자 지역 설정 조회 --- //
export interface GetUserRegionResponseData {
  region: Region;
}

export const getCurrentUserRegionSetting = async (): Promise<
  BaseApiResponse<GetUserRegionResponseData>
> => {
  console.log('현재 사용자 지역 설정 조회 요청 (axiosInstance 사용)');
  const response = await axiosInstance.get<BaseApiResponse<GetUserRegionResponseData>>(
    '/users/region',
  );
  if (response.data.statusCode !== 200) {
    console.error('현재 사용자 지역 설정 조회 실패:', response.data.message);
    throw new Error(response.data.message || '현재 사용자 지역 설정 조회에 실패했습니다.');
  }
  console.log('현재 사용자 지역 설정 조회 성공 응답:', response.data);
  return response.data;
};
