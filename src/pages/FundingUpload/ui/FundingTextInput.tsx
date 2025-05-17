import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';
import {scale, vs} from '../../../utils/scaling';
import SectionHeader from './SectionHeader';

interface FundingTextInputProps extends TextInputProps {
  title: string;
  suffixUnit?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
}

const FundingTextInput: React.FC<FundingTextInputProps> = ({
  title,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  style,
  suffixUnit,
  wrapperStyle,
  ...rest
}) => {
  return (
    <View style={[styles.componentWrapper, wrapperStyle]}>
      {title ? <SectionHeader title={title} /> : null}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style, suffixUnit ? styles.inputWithSuffix : {}]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.grayLight500}
          keyboardType={keyboardType}
          {...rest}
        />
        {suffixUnit && <Text style={styles.suffixText}>{suffixUnit}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginBottom: vs(24),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.grayLight400,
    borderWidth: 1,
    borderRadius: scale(8),
    backgroundColor: Colors.grayLightWhite,
    height: vs(40),
  },
  input: {
    ...Typography.body2_m_14,
    flex: 1,
    height: '100%',
    paddingHorizontal: scale(12),
    color: Colors.grayLight900,
  },
  inputWithSuffix: {
    // 필요한 경우, 접미사가 있을 때 겹침을 방지하기 위해 패딩 조정
    // paddingRight: scale(24), // 예시: 접미사 너비에 따라 다름
  },
  suffixText: {
    ...Typography.body2_m_14,
    color: Colors.grayLight900,
    paddingHorizontal: scale(12),
  },
});

export default FundingTextInput;
