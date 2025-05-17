import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

// 앱에서 사용할 모든 화면 이름을 union 타입으로 정의
export type AppScreens =
  | 'Onboarding'
  | 'Login'
  | 'Main'
  | 'Magazine'
  | 'Home'
  | 'FundingUpload'
  | 'MyPage'
  | 'FundingDetail';

// 스크린 이름 상수
export const SCREENS = {
  ONBOARDING: 'Onboarding' as const,
  LOGIN: 'Login' as const,
  MAIN: 'Main' as const,
  MAGAZINE: 'Magazine' as const,
  HOME: 'Home' as const,
  FUNDING_UPLOAD: 'FundingUpload' as const,
  MY_PAGE: 'MyPage' as const,
  FUNDING_DETAIL: 'FundingDetail' as const,
};

// 네이티브 스택 네비게이션에 사용될 파라미터 타입 정의
export type RootStackParamList = {
  [SCREENS.ONBOARDING]: undefined;
  [SCREENS.LOGIN]: undefined;
  [SCREENS.MAIN]: undefined;
  [SCREENS.FUNDING_DETAIL]: {fundingId: string};
};

// 하단 탭 네비게이션에 사용될 파라미터 타입 정의
export type MainBottomTabParamList = {
  [SCREENS.MAGAZINE]: undefined;
  [SCREENS.HOME]: undefined;
  [SCREENS.FUNDING_UPLOAD]: undefined;
  [SCREENS.MY_PAGE]: undefined;
};

// 화면 네비게이션 프롭 타입 (RootStack용)
export type RootStackNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<
  RootStackParamList,
  T
>;

// 화면 라우트 프롭 타입 (RootStack용)
export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

// 화면 프롭 타입 (RootStack용)
export interface RootStackScreenProps<T extends keyof RootStackParamList> {
  navigation: RootStackNavigationProp<T>;
  route: RootStackRouteProp<T>;
}

// 하단 탭 화면 네비게이션 프롭 타입
export type MainBottomTabNavigationProp<T extends keyof MainBottomTabParamList> =
  BottomTabNavigationProp<MainBottomTabParamList, T>;

// 하단 탭 화면 라우트 프롭 타입
export type MainBottomTabRouteProp<T extends keyof MainBottomTabParamList> = RouteProp<
  MainBottomTabParamList,
  T
>;

// 하단 탭 화면 프롭 타입
export interface MainBottomTabScreenProps<T extends keyof MainBottomTabParamList> {
  navigation: MainBottomTabNavigationProp<T>;
  route: MainBottomTabRouteProp<T>;
}
