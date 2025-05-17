import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, Alert} from 'react-native';
import {
  InactiveButton,
  ActiveButton,
  SecondaryButton,
  CompleteButton,
} from './ui/OnboardingButtons';
import {scale, vs} from '../../utils/scaling';
import Colors from '../../styles/theme';
import Typography from '../../styles/typography';
import {useNavigation} from '@react-navigation/native';
import {SCREENS, RootStackNavigationProp} from '../../navigation/types';
import {Region} from '../../api/types';
import {setCurrentUserRegion, SetUserRegionRequest} from '../../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REGION_DATA: {key: Region; label: string}[] = [
  {key: 'SEOUL', label: '서울'},
  {key: 'INCHEON_GYEONGGI', label: '인천/경기'},
  {key: 'GYEONGSANG', label: '경상도'},
  {key: 'CHUNGCHEONG', label: '충청도'},
  {key: 'GANGWON', label: '강원도'},
  {key: 'JEOLLA', label: '전라도'},
  {key: 'JEJU', label: '제주도'},
];

const OnboardingPage = () => {
  const [selectedRegionKey, setSelectedRegionKey] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp<typeof SCREENS.ONBOARDING>>();

  const handleRegionSelect = (regionKey: Region) => {
    setSelectedRegionKey(regionKey);
  };

  const handleComplete = async () => {
    if (!selectedRegionKey) {
      Alert.alert('알림', '지역을 선택해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken) {
        const requestData: SetUserRegionRequest = {region: selectedRegionKey};
        await setCurrentUserRegion(requestData);
        console.log('사용자 지역 설정 성공:', selectedRegionKey);

        await AsyncStorage.setItem('isOnboardedStatus', 'true');
        console.log('온보딩 완료 상태 저장: true');

        navigation.replace(SCREENS.MAIN);
      } else {
        Alert.alert('오류', '사용자 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
        navigation.navigate(SCREENS.LOGIN);
      }
    } catch (error: any) {
      console.error('지역 설정 API 호출 또는 AsyncStorage 작업 실패:', error);
      Alert.alert('오류', error.message || '지역 설정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.welcomeText}>써닝에 오신 것을 환영해요!</Text>
          <Text style={styles.titleText}>투자하고 싶은 태양광 지역을{'\n'}선택해주세요.</Text>

          <View style={styles.regionsContainer}>
            {REGION_DATA.map(regionItem =>
              regionItem.key === selectedRegionKey ? (
                <ActiveButton
                  key={regionItem.key}
                  title={regionItem.label}
                  onPress={() => handleRegionSelect(regionItem.key)}
                />
              ) : (
                <InactiveButton
                  key={regionItem.key}
                  title={regionItem.label}
                  onPress={() => handleRegionSelect(regionItem.key)}
                />
              ),
            )}
          </View>

          <View style={styles.bottomButtonContainer}>
            {selectedRegionKey ? (
              <CompleteButton
                title={isLoading ? '설정 중...' : '완료'}
                style={styles.completeButton}
                onPress={handleComplete}
              />
            ) : (
              <SecondaryButton title="완료" style={styles.completeButton} />
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/img_onboarding_1.png')}
          style={styles.onboardingImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.grayLightWhite,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingTop: vs(60),
  },
  container: {
    flex: 1,
  },
  welcomeText: {
    ...Typography.body1_m_16,
    color: Colors.grayLight700,
    marginBottom: vs(8),
  },
  titleText: {
    ...Typography.title4_b_24,
    color: Colors.grayLight900,
    marginBottom: vs(40),
    lineHeight: 36,
  },
  regionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: vs(60),
  },
  regionButton: {
    width: '30%',
    marginBottom: vs(16),
  },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: vs(30),
  },
  completeButton: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  onboardingImage: {
    width: scale(375),
    height: vs(120),
  },
});

export default OnboardingPage;
