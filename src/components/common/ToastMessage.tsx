import React, {useEffect, useRef, useState} from 'react';
import {Text, StyleSheet, Platform, Animated, Easing} from 'react-native';
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
const TOAST_HEIGHT = vs(48);
const ANIMATION_DURATION = 300;

const ToastMessage: React.FC<ToastMessageProps> = ({message, type, isVisible}) => {
  const [renderToast, setRenderToast] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-TOAST_HEIGHT)).current;

  useEffect(() => {
    if (isVisible) {
      setRenderToast(true);
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -TOAST_HEIGHT,
          duration: ANIMATION_DURATION,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderToast(false); // Remove from render tree after animation
      });
    }
  }, [isVisible, opacityAnim, translateYAnim]);

  if (!renderToast && !isVisible) {
    // Ensure it's not rendered initially if not visible, and removed after fade out
    return null;
  }

  const IconComponent = type === 'success' ? IcCheckGreen : IcError;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        styles.shadow,
        {
          opacity: opacityAnim,
          transform: [{translateY: translateYAnim}],
        },
      ]}>
      <IconComponent width={scale(22)} height={vs(22)} />
      <Text style={styles.toastMessageText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: TOAST_OFFSET_TOP,
    left: scale(16),
    right: scale(16),
    height: TOAST_HEIGHT,
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
