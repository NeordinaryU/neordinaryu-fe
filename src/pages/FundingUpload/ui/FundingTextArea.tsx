import React from 'react';
import {TextInput, StyleSheet, TextInputProps, View} from 'react-native';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';
import {scale, vs} from '../../../utils/scaling';
import SectionHeader from './SectionHeader';

interface FundingTextAreaProps extends TextInputProps {
  title: string;
}

const FundingTextArea: React.FC<FundingTextAreaProps> = ({
  title,
  value,
  onChangeText,
  placeholder,
  numberOfLines = 4,
  style,
  ...rest
}) => {
  return (
    <View style={styles.componentWrapper}>
      <SectionHeader title={title} />
      <TextInput
        style={[styles.textArea, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.grayLight500}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top" // 안드로이드용
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginBottom: vs(24),
  },
  textArea: {
    ...Typography.body2_m_14,
    height: vs(120),
    borderColor: Colors.grayLight400,
    borderWidth: 1,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingTop: vs(10),
    paddingBottom: vs(10),
    backgroundColor: Colors.grayLightWhite,
    color: Colors.grayLight900,
  },
});

export default FundingTextArea;
