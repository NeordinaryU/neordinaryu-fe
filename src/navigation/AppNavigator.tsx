import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingPage from '../pages/OnboardingPage';
import {RootStackParamList, SCREENS} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREENS.ONBOARDING}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={SCREENS.ONBOARDING} component={OnboardingPage} />
        {/* 추후 다른 화면들 추가*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
