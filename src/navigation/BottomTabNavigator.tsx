/* eslint-disable */

import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {createBottomTabNavigator, BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';
import HomePage from '../pages/Home';
import MagazinePage from '../pages/Magazine';
import FundingUploadPage from '../pages/FundingUpload';
import MyPage from '../pages/MyPage';
import Colors from '../styles/theme';
import Typography from '../styles/typography';
import {SCREENS, MainBottomTabParamList} from './types';

// Import SVG assets - 일반 상태
import MagazineIcon from '../assets/ic_magazine upload_32.svg';
import HomeIcon from '../assets/ic_home_32.svg';
import FundingUploadIcon from '../assets/ic_funding upload_32.svg';
import MyPageIcon from '../assets/ic_my_32.svg';

// Import SVG assets - Pressed 상태
import MagazinePressedIcon from '../assets/ic_magazine upload_pressed_32.svg';
import HomePressedIcon from '../assets/ic_home_pressed_32.svg';
import FundingUploadPressedIcon from '../assets/ic_funding upload_pressed_32.svg';
import MyPagePressedIcon from '../assets/ic_my_pressed_32.svg';

interface TabBarIconParams {
  focused: boolean;
  // color: string; // Not using these as colors are handled by SVG swapping and text style
  // size: number;  // Icon size is fixed
}

const Tab = createBottomTabNavigator<MainBottomTabParamList>();

const CustomTabBarButton = (allProps: BottomTabBarButtonProps) => {
  // The default BottomTabBarButton is a Pressable on iOS and a NativeViewGestureHandler on Android.
  // We want to customize the ripple effect on Android.
  // For other props, we pass them through, but explicitly separate `ref` to avoid type conflicts.
  const {ref, ...restProps} = allProps; // Destructure ref, spread the rest

  return (
    <Pressable
      {...restProps} // Pass the rest of the props (children, style, onPress, etc.)
      android_ripple={{color: 'transparent'}} // Android ripple 효과 제거
      style={() => [
        restProps.style, // Apply original styles from restProps
        // Optional: add feedback for pressed state on iOS if desired
        // Platform.OS === 'ios' && pressed && { opacity: 0.7 }
      ]}
    />
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={SCREENS.HOME}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.mainRed,
        tabBarInactiveTintColor: Colors.grayLight700,
        tabBarButton: CustomTabBarButton, // 모든 탭 버튼에 커스텀 버튼 적용
      }}>
      <Tab.Screen
        name={SCREENS.MAGAZINE}
        component={MagazinePage}
        options={{
          tabBarLabel: ({focused}: TabBarIconParams) => (
            <Text
              style={[styles.tabBarLabel, {color: focused ? Colors.mainRed : Colors.grayLight700}]}>
              매거진
            </Text>
          ),
          tabBarIcon: ({focused}: TabBarIconParams) => (
            <View style={styles.iconContainer}>
              {focused ? (
                <MagazinePressedIcon width={24} height={24} />
              ) : (
                <MagazineIcon width={24} height={24} />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.HOME}
        component={HomePage}
        options={{
          tabBarLabel: ({focused}: TabBarIconParams) => (
            <Text
              style={[styles.tabBarLabel, {color: focused ? Colors.mainRed : Colors.grayLight700}]}>
              홈
            </Text>
          ),
          tabBarIcon: ({focused}: TabBarIconParams) => (
            <View style={styles.iconContainer}>
              {focused ? (
                <HomePressedIcon width={24} height={24} />
              ) : (
                <HomeIcon width={24} height={24} />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.FUNDING_UPLOAD}
        component={FundingUploadPage}
        options={{
          tabBarLabel: ({focused}: TabBarIconParams) => (
            <Text
              style={[styles.tabBarLabel, {color: focused ? Colors.mainRed : Colors.grayLight700}]}>
              펀딩 올리기
            </Text>
          ),
          tabBarIcon: ({focused}: TabBarIconParams) => (
            <View style={styles.iconContainer}>
              {focused ? (
                <FundingUploadPressedIcon width={24} height={24} />
              ) : (
                <FundingUploadIcon width={24} height={24} />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.MY_PAGE}
        component={MyPage}
        options={{
          tabBarLabel: ({focused}: TabBarIconParams) => (
            <Text
              style={[styles.tabBarLabel, {color: focused ? Colors.mainRed : Colors.grayLight700}]}>
              마이페이지
            </Text>
          ),
          tabBarIcon: ({focused}: TabBarIconParams) => (
            <View style={styles.iconContainer}>
              {focused ? (
                <MyPagePressedIcon width={24} height={24} />
              ) : (
                <MyPageIcon width={24} height={24} />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    // backgroundColor: 'white', // Add background color if needed
    // borderTopWidth: 1, // Optional: add a top border
    // borderTopColor: Colors.grayLight300, // Optional: border color
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // If icon is not centered with label, might need to adjust this
    // flex: 1, // Can sometimes help but might push label too far
  },
  tabBarLabel: {
    ...Typography.body2_m_14,
    // marginBottom: 5, // Adjust as needed for alignment with icon
    // textAlign: 'center', // Ensure text is centered under icon
  },
  // Removed tabButtonPressed as it's not used with this CustomTabBarButton version
});

export default BottomTabNavigator;
