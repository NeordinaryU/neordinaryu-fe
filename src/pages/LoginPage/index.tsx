import React, {useState, useEffect} from 'react';
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
import {loginUser, LoginRequest} from '../../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImgLogo from '../../assets/logo.png';

const LoginPage = () => {
  const navigation = useNavigation<RootStackNavigationProp<typeof SCREENS.LOGIN>>();
  const [id, setId] = useState('test');
  const [password, setPassword] = useState('testpass');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsCheckingToken(true);
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const isOnboardedStatus = await AsyncStorage.getItem('isOnboardedStatus');

        if (userToken) {
          console.log('저장된 토큰 발견:', userToken);
          console.log('저장된 온보딩 상태:', isOnboardedStatus);
          if (isOnboardedStatus === 'true') {
            console.log('온보딩 완료 상태 (true), 메인 화면으로 이동합니다.');
            navigation.replace(SCREENS.MAIN);
          } else {
            console.log('온보딩 필요 또는 상태 알 수 없음, 온보딩 화면으로 이동합니다.');
            navigation.replace(SCREENS.ONBOARDING);
          }
        } else {
          console.log('저장된 토큰 없음, 로그인 페이지 유지.');
        }
      } catch (e) {
        console.error('AsyncStorage에서 토큰/온보딩 상태 조회 실패:', e);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {
    console.log('로그인 시도:', {userId: id, password});
    if (id === '' || password === '') {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const requestData: LoginRequest = {userId: id, password};
      const response = await loginUser(requestData);

      if (response.statusCode === 200 && response.data) {
        console.log('로그인 성공:', response.data);

        const accessToken = response.data.accessToken;
        const isOnboarded = response.data.isOnboarded;

        if (
          typeof accessToken === 'string' &&
          accessToken.length > 0 &&
          typeof isOnboarded === 'boolean'
        ) {
          try {
            await AsyncStorage.setItem('userToken', accessToken);
            await AsyncStorage.setItem('isOnboardedStatus', isOnboarded.toString());
            console.log(
              '사용자 액세스 토큰 및 온보딩 상태가 AsyncStorage에 저장되었습니다.',
              isOnboarded.toString(),
            );

            if (isOnboarded) {
              console.log('온보딩 완료 (API 응답), 메인 화면으로 이동합니다.');
              navigation.replace(SCREENS.MAIN);
            } else {
              console.log('온보딩 필요 (API 응답), 온보딩 화면으로 이동합니다.');
              navigation.replace(SCREENS.ONBOARDING);
            }
          } catch (storageError) {
            console.error('AsyncStorage에 토큰/온보딩 상태 저장 실패:', storageError);
            setError('로그인 처리 중 저장 오류가 발생했습니다.');
          }
        } else {
          console.error(
            'API 응답 데이터에 accessToken 또는 isOnboarded 상태가 유효하지 않습니다:',
            response.data,
          );
          setError('수신된 사용자 데이터가 올바르지 않습니다. 다시 시도해주세요.');
        }
      } else {
        console.error('API로부터 로그인 실패:', response.message);
        setError(response.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (apiError: any) {
      console.error('로그인 API 호출 중 에러 발생:', apiError);
      const message =
        apiError.response?.data?.message || apiError.message || '로그인 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text>로그인 정보 확인 중...</Text>
      </SafeAreaView>
    );
  }

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

          <Image source={ImgLogo} style={styles.logoImage} resizeMode="contain" />

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
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {error && <View style={{height: vs(24)}} />}
          {!error && <View style={{height: vs(48)}} />}

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={isLoading}>
            <Text style={styles.loginButtonText}>{isLoading ? '로그인 중...' : '로그인'}</Text>
          </TouchableOpacity>
        </ScrollView>
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
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: scale(20),
    flexGrow: 1,
    paddingBottom: vs(40),
  },
  logoImage: {
    width: scale(335),
    height: vs(132),
    alignSelf: 'center',
  },
  label: {
    ...Typography.body1_m_16,
    color: Colors.grayLight900,
  },
  input: {
    height: vs(50),
    borderWidth: 1,
    borderColor: Colors.grayLight400,
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    ...Typography.body1_m_16,
    color: Colors.grayLight900,
    backgroundColor: Colors.grayLightWhite,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
  },
  errorText: {
    ...Typography.body4_m_12,
    color: Colors.mainRed,
  },
  loginButton: {
    backgroundColor: Colors.grayLight900,
    paddingHorizontal: scale(20),
    paddingVertical: vs(10),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    height: vs(50),
  },
  loginButtonDisabled: {
    backgroundColor: Colors.grayLight500,
  },
  loginButtonText: {
    ...Typography.subtitle4_m_18,
    color: Colors.grayLightWhite,
  },
  clearStorageButton: {
    marginTop: vs(20),
    paddingVertical: vs(10),
    paddingHorizontal: scale(15),
    backgroundColor: Colors.mainRed,
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearStorageButtonText: {
    ...Typography.body3_b_12,
    color: Colors.grayLightWhite,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginPage;
