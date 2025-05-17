import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

// 앱에서 사용할 모든 화면 이름을 union 타입으로 정의
export type AppScreens = 'Onboarding' | 'Main' | 'Profile' | 'Settings';

// 스크린 이름 상수
export const SCREENS = {
  ONBOARDING: 'Onboarding' as const,
  MAIN: 'Main' as const,
  PROFILE: 'Profile' as const,
  SETTINGS: 'Settings' as const,
};

// 네비게이션에 사용될 파라미터 타입 정의
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Profile: {userId: string};
  Settings: undefined;
};

// 화면 네비게이션 프롭 타입
export type AppNavigationProp<T extends AppScreens> = NativeStackNavigationProp<
  RootStackParamList,
  T
>;

// 화면 라우트 프롭 타입
export type AppRouteProp<T extends AppScreens> = RouteProp<RootStackParamList, T>;

// 화면 프롭 타입
export interface AppScreenProps<T extends AppScreens> {
  navigation: AppNavigationProp<T>;
  route: AppRouteProp<T>;
}
