import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Colors from '../../styles/theme';
import Typography from '../../styles/typography';
import {scale, vs} from '../../utils/scaling';
import IcError from '../../assets/ic_error_22.svg';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigationProp, SCREENS} from '../../navigation/types';
// import ImgOnboarding1 from '../../assets/images/img_onboarding_1.png'; // 이미지 경로 플레이스홀더

const LoginPage = () => {
  const navigation = useNavigation<RootStackNavigationProp<typeof SCREENS.LOGIN>>();
  const [id, setId] = useState('임시 id');
  const [password, setPassword] = useState('임시 비밀번호');
  const [error, setError] = useState(false); // 예시: true로 설정하면 에러 메시지 표시

  const simulateApiCall = async () => {
    console.log('로그인 API 호출 시뮬레이션 중...');
    // 네트워크 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('API 호출 시뮬레이션 완료.');
    // 실제 상황에서는 사용자 데이터나 토큰을 반환할 수 있음
    return {success: true, userId: 'tempUser123'};
  };

  const handleLogin = async () => {
    console.log('로그인 시도:', {id, password});
    if (id === '' || password === '') {
      setError(true);
    } else {
      setError(false);
      const loginResult = await simulateApiCall();
      if (loginResult.success) {
        console.log('로그인 성공, 온보딩으로 이동 중...');
        navigation.navigate(SCREENS.ONBOARDING);
      } else {
        console.log('API로부터 로그인 실패');
        setError(true); // 또는 API 에러를 특정하여 처리
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={{height: vs(48)}} />

          <View style={styles.bannerPlaceholder} />

          <View style={{height: vs(48)}} />

          <Text style={styles.label}>아이디</Text>
          <View style={{height: vs(8)}} />
          <TextInput
            style={styles.input}
            placeholder="아이디 입력"
            value={id}
            onChangeText={setId}
            placeholderTextColor={Colors.grayLight500}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={{height: vs(16)}} />

          <Text style={styles.label}>비밀번호</Text>
          <View style={{height: vs(8)}} />
          <TextInput
            style={styles.input}
            placeholder="비밀번호 입력"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={Colors.grayLight500}
          />

          {error && (
            <View style={styles.errorContainer}>
              <IcError width={scale(22)} height={vs(22)} />
              <View style={{width: scale(4)}} />
              <Text style={styles.errorText}>아이디 또는 비밀번호를 확인해주세요</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomActionContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <View style={{height: vs(33)}} />
          <Image
            // source={ImgOnboarding1} // Awaiting path and dimensions
            style={styles.bottomImagePlaceholder} // Placeholder style
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.grayLightWhite,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1, // ScrollView가 bottomActionContainer 앞에 공간을 차지하도록 허용
  },
  scrollContentContainer: {
    paddingHorizontal: scale(20),
    flexGrow: 1, // 내용이 짧더라도 스크롤 및 간격 유지 보장
  },
  bannerPlaceholder: {
    width: scale(335),
    height: vs(132),
    backgroundColor: Colors.grayLight300, // 배너 플레이스홀더 색상
    alignSelf: 'center',
  },
  label: {
    ...Typography.body1_m_16, // 또는 다른 적절한 타이포그래피 선택
    color: Colors.grayLight900, // 레이블에 어두운 텍스트 색상
  },
  input: {
    height: vs(50), // 표준 입력 높이
    borderWidth: 1,
    borderColor: Colors.grayLight400, // 중립적인 테두리 색상
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    ...Typography.body1_m_16, // 일관된 타이포그래피
    color: Colors.grayLight900,
    backgroundColor: Colors.grayLightWhite,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10), // 에러 메시지 위 간격
  },
  errorText: {
    ...Typography.body4_m_12, // caption1_m_12에서 body4_m_12로 변경됨
    color: Colors.mainRed, // 에러 색상
  },
  bottomActionContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: Platform.OS === 'ios' ? vs(30) : vs(20), // 필요한 경우 하단 안전 영역 조정
    paddingTop: vs(20), // 내용이 스크롤되어 가까워질 때 로그인 버튼 위 간격
    backgroundColor: Colors.grayLightWhite, // 페이지 배경과 일치하도록 보장
  },
  loginButton: {
    backgroundColor: Colors.grayLight900,
    paddingHorizontal: scale(20),
    paddingVertical: vs(10),
    borderRadius: scale(30), // 둥근 버튼
    alignItems: 'center',
    justifyContent: 'center',
    height: vs(50), // 표준 버튼 높이
  },
  loginButtonText: {
    ...Typography.subtitle4_m_18, // 버튼 텍스트 스타일
    color: Colors.grayLightWhite,
  },
  bottomImagePlaceholder: {
    // width: scale(width), // 크기 정보 필요
    // height: vs(height), // 크기 정보 필요
    alignSelf: 'center',
    backgroundColor: Colors.grayLight200, // 이미지 플레이스홀더 색상
    width: '100%', // 크기 정보가 있을 때까지 임시값
    height: vs(50), // 크기 정보가 있을 때까지 임시값
  },
});

export default LoginPage;
