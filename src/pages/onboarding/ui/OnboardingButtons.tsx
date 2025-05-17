import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {scale, vs} from '../../../utils/scaling';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// 회색 버튼 (보더 있음): 배경 gray-200, 테두리 gray-500, 텍스트 gray-700
export const InactiveButton: React.FC<ButtonProps> = ({title, onPress, style, textStyle}) => {
  return (
    <TouchableOpacity style={[styles.borderedButton, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.defaultButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

// 빨간색 버튼 (선택됨): 배경 red-100, 테두리 main-red, 텍스트 main-red
export const ActiveButton: React.FC<ButtonProps> = ({title, onPress, style, textStyle}) => {
  return (
    <TouchableOpacity style={[styles.selectedButton, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.selectedButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

// 회색 버튼 (보더 없음): 배경 gray-200, 텍스트 gray-700
export const SecondaryButton: React.FC<ButtonProps> = ({title, onPress, style, textStyle}) => {
  return (
    <TouchableOpacity style={[styles.defaultButton, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.defaultButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

// 검은색 버튼: 배경 gray-900, 텍스트 흰색
export const CompleteButton: React.FC<ButtonProps> = ({title, onPress, style, textStyle}) => {
  return (
    <TouchableOpacity style={[styles.darkButton, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.darkButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultButton: {
    backgroundColor: Colors.grayLight200,
    paddingVertical: vs(10),
    paddingHorizontal: scale(20),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderedButton: {
    backgroundColor: Colors.grayLight200,
    borderColor: Colors.grayLight500,
    borderWidth: 1,
    paddingVertical: vs(8),
    paddingHorizontal: scale(20),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultButtonText: {
    color: Colors.grayLight700,
    ...Typography.subtitle4_m_18,
  },
  selectedButton: {
    backgroundColor: Colors.red100,
    borderColor: Colors.mainRed,
    borderWidth: 1,
    paddingVertical: vs(8),
    paddingHorizontal: scale(20),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButtonText: {
    color: Colors.mainRed,
    ...Typography.subtitle4_m_18,
  },
  darkButton: {
    backgroundColor: Colors.grayLight900,
    paddingVertical: vs(8),
    paddingHorizontal: scale(12),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkButtonText: {
    color: Colors.grayLightWhite,
    ...Typography.subtitle4_m_18,
  },
});
