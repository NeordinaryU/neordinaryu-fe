import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/types';
import HomeHeader from './ui/HomeHeader';
import RegionSelector from './ui/RegionSelector';
import FundingListHeader from './ui/FundingListHeader';
import FundingListItem from './ui/FundingListItem';
import {scale, vs} from '../../utils/scaling';
import Colors from '../../styles/theme';

type FilterOption = 'achievement' | 'latest';

// 더미 데이터
const DUMMY_FUNDING_DATA = [
  {
    id: '1',
    title: '전남 고흥 해창만 태양광 발전소',
    author: '써닝',
    location: '전라남도 고흥',
    daysLeft: 14,
    achievementRate: 70,
    currentAmount: 35000000,
    imageUrl: 'https://picsum.photos/126',
  },
  {
    id: '2',
    title: '경북 영천 화남면 태양광 발전소',
    author: '써닝',
    location: '경상북도 영천',
    daysLeft: 30,
    achievementRate: 45,
    currentAmount: 22500000,
    imageUrl: 'https://picsum.photos/126?random=1',
  },
  {
    id: '3',
    title: '충북 청주 태양광 발전소',
    author: '써닝',
    location: '충청북도 청주',
    daysLeft: 7,
    achievementRate: 90,
    currentAmount: 45000000,
    imageUrl: 'https://picsum.photos/126?random=2',
  },
];

const HomePage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('경상도');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('achievement');
  const [fundingData, setFundingData] = useState(DUMMY_FUNDING_DATA);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleAlertPress = () => {
    console.log('Alert pressed');
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter);
    console.log('필터 변경:', filter);

    // 필터에 따라 데이터 정렬
    const sortedData = [...DUMMY_FUNDING_DATA];
    if (filter === 'achievement') {
      sortedData.sort((a, b) => b.achievementRate - a.achievementRate);
    } else {
      sortedData.sort((a, b) => a.daysLeft - b.daysLeft);
    }
    setFundingData(sortedData);
  };

  const handleFundingItemPress = (id: string) => {
    console.log('펀딩 아이템 클릭:', id);
    navigation.navigate(SCREENS.FUNDING_DETAIL, {fundingId: id});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <HomeHeader onAlertPress={handleAlertPress} />
          <RegionSelector selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
          <View style={styles.bannerContainer} />
          <FundingListHeader selectedFilter={activeFilter} onFilterChange={handleFilterChange} />

          <View style={styles.fundingListContainer}>
            {fundingData.map(item => (
              <FundingListItem
                key={item.id}
                id={item.id}
                title={item.title}
                author={item.author}
                location={item.location}
                daysLeft={item.daysLeft}
                achievementRate={item.achievementRate}
                currentAmount={item.currentAmount}
                imageUrl={item.imageUrl}
                onPress={() => handleFundingItemPress(item.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.grayLightWhite,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  bannerContainer: {
    width: scale(375),
    height: vs(200),
    backgroundColor: Colors.grayLight200,
    alignSelf: 'center',
    marginTop: vs(16),
  },
  fundingListContainer: {
    alignItems: 'center',
    marginTop: vs(16),
    paddingBottom: vs(20),
  },
});

export default HomePage;
