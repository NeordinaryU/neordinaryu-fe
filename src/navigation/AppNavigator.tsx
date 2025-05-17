import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingPage from '../pages/onboarding';
// import HomePage from '../pages/Home'; // HomePage 직접 사용 안 함
import BottomTabNavigator from './BottomTabNavigator';
import {RootStackParamList, SCREENS} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREENS.ONBOARDING} // 온보딩을 첫 화면으로
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={SCREENS.ONBOARDING} component={OnboardingPage} />
        {/* SCREENS.MAIN 경로에 BottomTabNavigator를 연결합니다. */}
        <Stack.Screen name={SCREENS.MAIN} component={BottomTabNavigator} />
        {/* 추후 다른 화면들 추가*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
