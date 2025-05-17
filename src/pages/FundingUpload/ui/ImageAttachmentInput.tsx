import React from 'react';
import {TouchableOpacity, StyleSheet, View, TouchableOpacityProps} from 'react-native';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';
import {scale, vs} from '../../../utils/scaling';
import SectionHeader from './SectionHeader';
import {ReactNode} from 'react';

interface ImageAttachmentInputProps extends TouchableOpacityProps {
  title: string;
  children?: ReactNode;
}

const ImageAttachmentInput: React.FC<ImageAttachmentInputProps> = ({
  title,
  onPress,
  children,
  style,
  ...rest
}) => {
  return (
    <View style={styles.componentWrapper}>
      <SectionHeader title={title} />
      <TouchableOpacity style={[styles.imagePickerPlaceholder, style]} onPress={onPress} {...rest}>
        {children}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginBottom: vs(24),
  },
  imagePickerPlaceholder: {
    height: vs(150),
    borderWidth: 1,
    borderColor: Colors.grayLight400,
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grayLight100,
  },
  imagePickerText: {
    ...Typography.body2_m_14,
    color: Colors.grayLight600,
    textAlign: 'center',
  },
});

export default ImageAttachmentInput;
