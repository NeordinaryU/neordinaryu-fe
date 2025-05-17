import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  InactiveButton,
  ActiveButton,
  SecondaryButton,
  CompleteButton,
} from './ui/OnboardingButtons';
import {scale, vs} from '../../utils/scaling';
import Colors from '../../styles/theme';
import Typography from '../../styles/typography';

const OnboardingPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = ['서울', '인천/경기', '경상도', '충청도', '강원도', '전라도', '제주도'];

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  return (
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
            <CompleteButton
              title="완료"
              style={styles.completeButton}
              onPress={() => console.log('선택 완료:', selectedRegion)}
            />
          ) : (
            <SecondaryButton title="완료" style={styles.completeButton} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: scale(20),
    paddingTop: vs(60),
    backgroundColor: Colors.grayLightWhite,
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
});

export default OnboardingPage;
