import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
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

const OnboardingPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const navigation = useNavigation<RootStackNavigationProp<typeof SCREENS.ONBOARDING>>();

  const regions = ['서울', '인천/경기', '경상도', '충청도', '강원도', '전라도', '제주도'];

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  const handleComplete = () => {
    if (selectedRegion) {
      // 선택된 지역을 저장하는 로직이 필요하다면 여기에 추가
      console.log('선택 완료:', selectedRegion);
      // 홈 화면으로 이동
      navigation.navigate(SCREENS.MAIN);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.welcomeText}>써닝에 오신 것을 환영해요!</Text>
          <Text style={styles.titleText}>투자하고 싶은 태양광 지역을{'\n'}선택해주세요.</Text>

          <View style={styles.regionsContainer}>
            {regions.map(region =>
              region === selectedRegion ? (
                <ActiveButton
                  key={region}
                  title={region}
                  onPress={() => handleRegionSelect(region)}
                />
              ) : (
                <InactiveButton
                  key={region}
                  title={region}
                  onPress={() => handleRegionSelect(region)}
                />
              ),
            )}
          </View>

          <View style={styles.bottomButtonContainer}>
            {selectedRegion ? (
              <CompleteButton title="완료" style={styles.completeButton} onPress={handleComplete} />
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
