import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import Colors from '../../styles/theme';
import Typography from '../../styles/typography';
import {scale, vs} from '../../utils/scaling';

// Import SVG icons
import IcCheckGreen from '../../assets/ic_check_green_22.svg';
import IcError from '../../assets/ic_error_22.svg';

export type ToastType = 'success' | 'error';

interface ToastMessageProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  // onHide?: () => void; // For later if we add manual hide or more complex logic
}

const TOAST_OFFSET_TOP = Platform.OS === 'ios' ? vs(60) : vs(20); // Adjust as needed for status bar/notch

const ToastMessage: React.FC<ToastMessageProps> = ({message, type, isVisible}) => {
  if (!isVisible) {
    return null;
  }

  const IconComponent = type === 'success' ? IcCheckGreen : IcError;

  return (
    <View style={[styles.toastContainer, styles.shadow]}>
      <IconComponent width={scale(22)} height={vs(22)} />
      <Text style={styles.toastMessageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: TOAST_OFFSET_TOP,
    left: scale(16),
    right: scale(16),
    height: vs(48),
    backgroundColor: Colors.grayLight900,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    borderRadius: scale(8), // A slight radius for aesthetics
    zIndex: 9999, // Ensure it's on top
  },
  toastMessageText: {
    ...Typography.body2_m_14, // Using a common typography, adjust if needed
    color: Colors.grayLightWhite, // Assuming white text on dark background
    marginLeft: scale(8),
    flexShrink: 1, // Allow text to wrap if it's too long
  },
  shadow: {
    // Optional: Adding a slight shadow for better visibility, common for toasts
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});

export default ToastMessage;
