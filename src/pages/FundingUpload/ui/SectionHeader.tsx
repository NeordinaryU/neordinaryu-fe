import React from 'react';
import {Text, StyleSheet, TextProps} from 'react-native';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';
import {vs} from '../../../utils/scaling';

interface SectionHeaderProps extends TextProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({title, style, ...rest}) => {
  return (
    <Text style={[styles.sectionTitle, style]} {...rest}>
      {title}
      <Text style={styles.asterisk}> *</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    ...Typography.subtitle6_b_14,
    color: Colors.grayLight700,
    marginBottom: vs(8),
  },
  asterisk: {
    color: Colors.mainRed,
    ...Typography.subtitle6_b_14, // 별표(*)에도 폰트 스타일이 적용되도록 보장
  },
});

export default SectionHeader;
