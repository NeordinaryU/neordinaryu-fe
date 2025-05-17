import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingPage from '../pages/onboarding';
import LoginPage from '../pages/LoginPage';
// import HomePage from '../pages/Home'; // HomePage 직접 사용 안 함
import BottomTabNavigator from './BottomTabNavigator';
import FundingDetailPage from '../pages/FundingDetail';
import {RootStackParamList, SCREENS} from './types';
import {ToastProvider} from '../contexts/ToastContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={SCREENS.LOGIN}
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name={SCREENS.LOGIN} component={LoginPage} />
          <Stack.Screen name={SCREENS.ONBOARDING} component={OnboardingPage} />
          {/* SCREENS.MAIN 경로에 BottomTabNavigator를 연결합니다. */}
          <Stack.Screen name={SCREENS.MAIN} component={BottomTabNavigator} />
          <Stack.Screen name={SCREENS.FUNDING_DETAIL} component={FundingDetailPage} />
          {/* 추후 다른 화면들 추가*/}
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
};

export default AppNavigator;
