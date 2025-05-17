import axiosInstance from './axiosInstance';
import {BaseApiResponse, Region} from './types';

// --- 내가 참여한 펀딩 조회 --- //
export interface ParticipatedFundingItem {
  fundingId: number;
  title: string;
  photoUrl: string;
  region: Region;
  detailAddress: string;
  goalMoney: number;
  fundedMoney: number;
  deadlineDate: string;
  completeDueDate: string;
  userFundedMoney: number;
}

export const getParticipatedFundings = async (): Promise<
  BaseApiResponse<ParticipatedFundingItem[]>
> => {
  console.log('내가 참여한 펀딩 목록 조회 요청 (axiosInstance 사용)');
  const response = await axiosInstance.get<BaseApiResponse<ParticipatedFundingItem[]>>(
    '/funding/participated',
  );
  if (response.data.statusCode !== 200) {
    console.error('내가 참여한 펀딩 목록 조회 실패:', response.data.message);
    throw new Error(response.data.message || '내가 참여한 펀딩 목록 조회에 실패했습니다.');
  }
  console.log('내가 참여한 펀딩 목록 조회 성공 응답:', response.data);
  return response.data;
};

// --- 펀딩 연장하기 --- //
export interface ProlongFundingRequest {
  deadlineDate: string; // ISO 날짜 문자열
}

export interface ProlongFundingResponseData {
  fundingId: number;
  deadlineDate: string; // ISO 날짜 문자열
}

export const prolongFunding = async (
  fundingId: number,
  data: ProlongFundingRequest,
): Promise<BaseApiResponse<ProlongFundingResponseData>> => {
  console.log(`펀딩 [${fundingId}] 연장 요청:`, data);
  const response = await axiosInstance.patch<BaseApiResponse<ProlongFundingResponseData>>(
    `/funding/${fundingId}/prolongation`,
    data,
  );
  if (response.data.statusCode !== 200) {
    console.error('펀딩 연장 실패:', response.data.message);
    throw new Error(response.data.message || '펀딩 연장에 실패했습니다.');
  }
  console.log('펀딩 연장 성공 응답:', response.data);
  return response.data;
};

// --- 펀딩 후원하기 --- //
export interface DonateFundingRequest {
  userFundedMoney: number;
}

export interface DonateFundingResponseData {
  fundingId: number;
  userId: number;
  newUserFundedMoney: number;
  updatedFundingTotal: number;
}

export const donateToFunding = async (
  fundingId: number,
  data: DonateFundingRequest,
): Promise<BaseApiResponse<DonateFundingResponseData>> => {
  console.log(`펀딩 [${fundingId}] 후원 요청 (axiosInstance 사용):`, data);
  const response = await axiosInstance.patch<BaseApiResponse<DonateFundingResponseData>>(
    `/funding/${fundingId}/donate`,
    data,
  );
  if (response.data.statusCode !== 200) {
    console.error('펀딩 후원 실패:', response.data.message);
    throw new Error(response.data.message || '펀딩 후원에 실패했습니다.');
  }
  console.log('펀딩 후원 성공 응답:', response.data);
  return response.data;
};

// --- 펀딩 상세 정보 조회 --- //
export interface FundingDetailResponseData {
  fundingId: number;
  title: string;
  description: string;
  photoUrl: string;
  region: Region;
  detailAddress: string;
  goalMoney: number;
  fundedMoney: number;
  rate: number;
  funderCount: number;
  deadlineDate: string;
  completeDueDate: string;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
}

export const getFundingDetail = async (
  fundingId: number,
): Promise<BaseApiResponse<FundingDetailResponseData>> => {
  console.log(`펀딩 [${fundingId}] 상세 정보 조회 요청 (axiosInstance 사용)`);
  const response = await axiosInstance.get<BaseApiResponse<FundingDetailResponseData>>(
    `/funding/${fundingId}`,
  );
  if (response.data.statusCode !== 200) {
    console.error('펀딩 상세 정보 조회 실패:', response.data.message);
    throw new Error(response.data.message || '펀딩 상세 정보 조회에 실패했습니다.');
  }
  console.log('펀딩 상세 정보 조회 성공 응답:', response.data);
  return response.data;
};

// --- 펀딩 글 작성 --- //
export interface CreateFundingRequest {
  title: string;
  description: string;
  goalMoney: number;
  deadlineDate: string; // ISO 날짜 문자열
  completeDueDate: string; // ISO 날짜 문자열
  region: Region;
  detailAddress: string;
  photoUrl: string;
  privacyAgreement: boolean;
}

export interface CreateFundingResponseData {
  fundingId: number;
  title: string;
}

export const createFunding = async (
  data: CreateFundingRequest,
): Promise<BaseApiResponse<CreateFundingResponseData>> => {
  console.log('펀딩 글 작성 요청 (axiosInstance 사용): ', data);
  const response = await axiosInstance.post<BaseApiResponse<CreateFundingResponseData>>(
    '/funding',
    data,
  );
  if (response.data.statusCode !== 201) {
    console.error('펀딩 글 작성 실패:', response.data.message);
    throw new Error(response.data.message || '펀딩 글 작성에 실패했습니다.');
  }
  console.log('펀딩 글 작성 성공 응답:', response.data);
  return response.data;
};

// --- 펀딩 목록 조회 --- //
interface UserInFundingItem {
  userId: string;
  region: Region;
}

export interface FundingListItem {
  fundingId: number;
  title: string;
  description: string;
  photoUrl: string;
  region: Region;
  detailAddress: string;
  goalMoney: number;
  fundedMoney: number;
  achievementRate: number;
  deadlineDate: string;
  completeDueDate: string;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserInFundingItem;
}

export interface GetFundingListParams {
  region?: Region;
  align?: string; // 예: 'latest', 'rate' 등 (API 명세에 따라 'rate' 사용)
}

export const getFundingList = async (
  params?: GetFundingListParams,
): Promise<BaseApiResponse<FundingListItem[]>> => {
  console.log('펀딩 목록 조회 요청 (axiosInstance 사용):', params);
  const response = await axiosInstance.get<BaseApiResponse<FundingListItem[]>>('/funding', {
    params,
  });
  if (response.data.statusCode !== 200) {
    console.error('펀딩 목록 조회 실패:', response.data.message);
    throw new Error(response.data.message || '펀딩 목록 조회에 실패했습니다.');
  }
  console.log('펀딩 목록 조회 성공 응답:', response.data);
  return response.data;
};
