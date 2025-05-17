import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Text, TouchableOpacity} from 'react-native';
import HomeHeader from '../Home/ui/HomeHeader'; // HomeHeader 재사용
import Colors from '../../styles/theme';
import ParticipatedFundingListItem from './ui/ParticipatedFundingListItem'; // 다음에 생성할 컴포넌트
import EmptyListView from './ui/EmptyListView'; // EmptyListView 가져오기
import {vs, scale} from '../../utils/scaling';
import Typography from '../../styles/typography';
import {useNavigation} from '@react-navigation/native'; // 네비게이션용
import {MainBottomTabNavigationProp, SCREENS} from '../../navigation/types';

export type MyPageFilterType = 'participated' | 'created';

// 펀딩 아이템 인터페이스 정의
interface MyFundingItem {
  id: string;
  imageUrl: string;
  achievementRate: number;
  daysLeft: number;
  title: string;
}

// 내 참여 펀딩 더미 데이터
const DUMMY_MY_FUNDINGS: MyFundingItem[] = [
  // {
  //   id: 'participated_fund1',
  //   imageUrl: 'https://picsum.photos/seed/mypage1/64',
  //   achievementRate: 85,
  //   daysLeft: 10,
  //   title: '[참여] 우리 동네 클린 에너지 프로젝트',
  // },
  // {
  //   id: 'participated_fund2',
  //   imageUrl: 'https://picsum.photos/seed/mypage2/64',
  //   achievementRate: 100,
  //   daysLeft: 0,
  //   title: '[참여] 옥상 태양광 패널 설치 지원',
  // },
];

// 내가 개설한 펀딩 더미 데이터
const DUMMY_CREATED_FUNDINGS: MyFundingItem[] = [
  // {
  //   id: 'created_fund1',
  //   imageUrl: 'https://picsum.photos/seed/created1/64',
  //   achievementRate: 60,
  //   daysLeft: 15,
  //   title: '[개설] 학교 앞 스쿨존 안전 개선 펀딩',
  // },
  // {
  //   id: 'created_fund2',
  //   imageUrl: 'https://picsum.photos/seed/created2/64',
  //   achievementRate: 90,
  //   daysLeft: 5,
  //   title: '[개설] 유기견 보호소 난방비 지원',
  // },
];

const MyPage = () => {
  const [activeFilterTab, setActiveFilterTab] = useState<MyPageFilterType>('participated');
  const navigation = useNavigation<MainBottomTabNavigationProp<typeof SCREENS.MY_PAGE>>();

  const handleListItemPress = (id: string, type: MyPageFilterType) => {
    console.log(`MyPage ${type} 펀딩 아이템 클릭됨:`, id);
    // FundingDetailPage가 RootStack에 있는 경우, 타입 캐스팅 또는 다른 네비게이션 타입 사용 필요
    // 예: (navigation.getParent() as any)?.navigate('FundingDetail', { fundingId: id });
    // 또는 RootStackNavigationProp을 사용하여 네비게이터 간 이동 처리
  };

  const handleEmptyViewButtonPress = () => {
    if (activeFilterTab === 'participated') {
      navigation.navigate(SCREENS.HOME);
    } else {
      navigation.navigate(SCREENS.FUNDING_UPLOAD);
    }
  };

  const fundingsToDisplay =
    activeFilterTab === 'participated' ? DUMMY_MY_FUNDINGS : DUMMY_CREATED_FUNDINGS;

  // 필터 탭의 텍스트 스타일 결정
  const getFilterTextStyle = (tabType: MyPageFilterType) => {
    return activeFilterTab === tabType ? styles.activeFilterTabText : styles.filterTabText;
  };
  // 필터 탭의 스타일 결정
  const getFilterTabStyle = (tabType: MyPageFilterType) => {
    return activeFilterTab === tabType ? styles.activeFilterTab : styles.filterTab;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />
      <View style={styles.filterTabContainer}>
        <TouchableOpacity
          style={getFilterTabStyle('participated')}
          onPress={() => setActiveFilterTab('participated')}
          activeOpacity={0.7}>
          <Text style={getFilterTextStyle('participated')}>참여한 펀딩</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getFilterTabStyle('created')}
          onPress={() => setActiveFilterTab('created')}
          activeOpacity={0.7}>
          <Text style={getFilterTextStyle('created')}>개설한 펀딩</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {fundingsToDisplay.length > 0 ? (
          <View style={styles.listContainer}>
            {fundingsToDisplay.map(item => (
              <ParticipatedFundingListItem
                key={item.id}
                imageUrl={item.imageUrl}
                achievementRate={item.achievementRate}
                daysLeft={item.daysLeft}
                title={item.title}
                onPress={() => handleListItemPress(item.id, activeFilterTab)}
              />
            ))}
          </View>
        ) : (
          <EmptyListView type={activeFilterTab} onButtonPress={handleEmptyViewButtonPress} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.grayLightWhite,
  },
  filterTabContainer: {
    flexDirection: 'row',
    paddingTop: vs(20),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight300,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: vs(10),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: vs(10),
    borderBottomWidth: 2,
    borderBottomColor: Colors.grayLight900,
  },
  filterTabText: {
    ...Typography.subtitle5_b_16,
    color: Colors.grayLight600,
  },
  activeFilterTabText: {
    ...Typography.subtitle5_b_16,
    color: Colors.grayLight900,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: vs(20),
    flexGrow: 1,
  },
  listContainer: {
    paddingHorizontal: scale(16),
    marginTop: vs(20),
  },
});

export default MyPage;
