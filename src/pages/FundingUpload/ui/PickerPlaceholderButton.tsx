import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';
import {scale, vs} from '../../../utils/scaling';
import SectionHeader from './SectionHeader'; // 각 피커 위에 제목이 필요한 경우
import {ReactNode} from 'react'; // ReactNode 임포트

interface PickerPlaceholderButtonProps extends TouchableOpacityProps {
  title?: string; // 선택적 제목, 피커 자체에 SectionHeader가 없는 경우
  buttonText: string;
  rightIcon?: ReactNode; // rightIcon prop 추가
  wrapperStyle?: StyleProp<ViewStyle>; // wrapperStyle prop 추가
}

const PickerPlaceholderButton: React.FC<PickerPlaceholderButtonProps> = ({
  title,
  onPress,
  buttonText,
  rightIcon, // rightIcon 구조 분해 할당
  style,
  wrapperStyle, // wrapperStyle 구조 분해 할당
  ...rest
}) => {
  return (
    <View style={[styles.componentWrapper, wrapperStyle]}>
      {title && <SectionHeader title={title} />}
      <TouchableOpacity style={[styles.pickerPlaceholder, style]} onPress={onPress} {...rest}>
        <Text style={styles.pickerText}>{buttonText}</Text>
        {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>} {/* rightIcon 렌더링 */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginBottom: vs(24),
  },
  pickerPlaceholder: {
    height: vs(40),
    borderWidth: 1,
    borderColor: Colors.grayLight400,
    borderRadius: scale(8),
    flexDirection: 'row', // 아이콘 위치 지정을 위해 추가
    justifyContent: 'space-between', // 아이콘 위치 지정을 위해 추가
    alignItems: 'center', // 아이콘 위치 지정을 위해 추가
    paddingHorizontal: scale(12),
    backgroundColor: Colors.grayLightWhite,
  },
  pickerText: {
    ...Typography.body2_m_14,
    color: Colors.grayLight600,
    flex: 1, // 텍스트가 사용 가능한 공간을 차지하도록 허용
  },
  iconWrapper: {
    // 아이콘 래퍼 스타일
    marginLeft: scale(8),
  },
});

export default PickerPlaceholderButton;
