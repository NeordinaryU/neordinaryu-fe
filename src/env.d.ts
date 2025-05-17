declare module '@env' {
  export const API_BASE_URL: string;
  // Add other environment variables you might have here
}

declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// PNG 모듈 선언 추가
declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}
