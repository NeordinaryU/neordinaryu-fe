import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import HomeHeader from '../Home/ui/HomeHeader'; // HomeHeader 재사용
import Colors from '../../styles/theme';
import ParticipatedFundingListItem from './ui/ParticipatedFundingListItem'; // 다음에 생성할 컴포넌트
import EmptyListView from './ui/EmptyListView'; // EmptyListView 가져오기
import {vs, scale} from '../../utils/scaling';
import Typography from '../../styles/typography';
import {useNavigation} from '@react-navigation/native'; // 네비게이션용
import {MainBottomTabNavigationProp, SCREENS} from '../../navigation/types';
import {getParticipatedFundings, ParticipatedFundingItem} from '../../api/fundingApi'; // API 함수 및 타입 임포트
import {getCurrentUserCreatedFundings, UserCreatedFundingItem} from '../../api/userApi'; // API 함수 및 타입 임포트

export type MyPageFilterType = 'participated' | 'created';

// MyPage에서 사용할 통합된 펀딩 아이템 인터페이스
interface MyFundingListItemType {
  id: string;
  imageUrl: string;
  achievementRate: number;
  daysLeft: number;
  title: string;
  // location?: string; // 필요시 추가 (ParticipatedFundingListItem 프롭에 맞게)
}

// 더미 데이터 제거
// const DUMMY_MY_FUNDINGS: MyFundingItem[] = [ ... ];
// const DUMMY_CREATED_FUNDINGS: MyFundingItem[] = [ ... ];

const MyPage = () => {
  const [activeFilterTab, setActiveFilterTab] = useState<MyPageFilterType>('participated');
  const [fundingsData, setFundingsData] = useState<MyFundingListItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<MainBottomTabNavigationProp<typeof SCREENS.MY_PAGE>>();

  const calculateDaysLeft = (deadlineDate: string): number => {
    const deadline = new Date(deadlineDate);
    const today = new Date();
    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.max(0, deadline.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const mapToMyFundingListItem = useCallback(
    (item: ParticipatedFundingItem | UserCreatedFundingItem): MyFundingListItemType => {
      const achievementRate =
        item.goalMoney && item.goalMoney > 0
          ? Math.min(100, Math.floor((item.fundedMoney / item.goalMoney) * 100))
          : 0;

      // location은 ParticipatedFundingListItem에서 필수가 아니므로 여기서 설정 안함
      // 필요하다면 item.region과 API_REGION_TO_USER_LABEL_MAP을 사용해 추가

      return {
        id: item.fundingId.toString(),
        imageUrl: item.photoUrl,
        achievementRate: achievementRate,
        daysLeft: calculateDaysLeft(item.deadlineDate),
        title: item.title,
      };
    },
    [],
  );

  useEffect(() => {
    const fetchMyFundings = async () => {
      setIsLoading(true);
      setError(null);
      setFundingsData([]);

      try {
        let response;
        if (activeFilterTab === 'participated') {
          console.log('Fetching participated fundings...');
          response = await getParticipatedFundings();
        } else {
          console.log('Fetching created fundings...');
          response = await getCurrentUserCreatedFundings();
        }

        if (response.statusCode === 200 && response.data) {
          console.log(`Fetched ${response.data.length} items for ${activeFilterTab}`);
          const mappedData = response.data.map(mapToMyFundingListItem);
          setFundingsData(mappedData);
        } else {
          const errorMessage =
            response.message ||
            `${
              activeFilterTab === 'participated' ? '참여한' : '개설한'
            } 펀딩 목록을 불러오는데 실패했습니다.`;
          setError(errorMessage);
          console.error(
            `Error fetching ${activeFilterTab} fundings:`,
            errorMessage,
            'Status:',
            response.statusCode,
          );
        }
      } catch (e: any) {
        const errorMessage = e.message || '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        console.error(`Exception fetching ${activeFilterTab} fundings:`, errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyFundings();
  }, [activeFilterTab, mapToMyFundingListItem]);

  const handleListItemPress = (id: string, type: MyPageFilterType) => {
    console.log(`MyPage ${type} 펀딩 아이템 클릭됨:`, id);
    // FundingDetailPage로 네비게이션 (RootStack에 정의되어 있다고 가정)
    // navigation.navigate(SCREENS.FUNDING_DETAIL, { fundingId: id }); // RootStackParamList에 FUNDING_DETAIL이 있어야 함
    // 임시로 RootStack 네비게이션은 주석 처리
    try {
      (navigation.getParent() as any)?.navigate(SCREENS.FUNDING_DETAIL, {fundingId: id});
    } catch (navError) {
      console.error('Failed to navigate to FUNDING_DETAIL:', navError);
      // Fallback or alternative navigation if needed
      // Example: navigation.navigate(SCREENS.HOME); // Or some other safe screen
    }
  };

  const handleEmptyViewButtonPress = () => {
    if (activeFilterTab === 'participated') {
      navigation.navigate(SCREENS.HOME);
    } else {
      // FUNDING_UPLOAD 스크린으로 네비게이션
      // navigation.navigate(SCREENS.FUNDING_UPLOAD); // RootStackParamList에 FUNDING_UPLOAD가 있어야 함
      // 임시로 RootStack 네비게이션은 주석 처리
      try {
        (navigation.getParent() as any)?.navigate(SCREENS.FUNDING_UPLOAD);
      } catch (navError) {
        console.error('Failed to navigate to FUNDING_UPLOAD:', navError);
      }
    }
  };

  // fundingsToDisplay 대신 fundingsData 사용
  // const fundingsToDisplay =
  //   activeFilterTab === 'participated' ? DUMMY_MY_FUNDINGS : DUMMY_CREATED_FUNDINGS;

  const getFilterTextStyle = (tabType: MyPageFilterType) => {
    return activeFilterTab === tabType ? styles.activeFilterTabText : styles.filterTabText;
  };
  const getFilterTabStyle = (tabType: MyPageFilterType) => {
    return activeFilterTab === tabType ? styles.activeFilterTab : styles.filterTab;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.mainRed} />
        <Text style={styles.loadingText}>목록을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <HomeHeader />
        <View style={styles.filterTabContainer}>{/* 필터 탭 UI는 에러 시에도 유지 */}</View>
        <Text style={styles.errorTitleText}>오류 발생</Text>
        <Text style={styles.errorText}>{error}</Text>
        {/* 재시도 버튼 등 추가 가능 */}
      </SafeAreaView>
    );
  }

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
        {fundingsData.length > 0 ? (
          <View style={styles.listContainer}>
            {fundingsData.map(item => (
              <ParticipatedFundingListItem
                key={item.id}
                imageUrl={item.imageUrl}
                achievementRate={item.achievementRate}
                daysLeft={item.daysLeft}
                title={item.title}
                onPress={() => handleListItemPress(item.id, activeFilterTab)}
                // location prop은 MyFundingListItemType에 없으므로 전달하지 않음
                // 또는 mapToMyFundingListItem에서 location을 추가하고 여기서 전달
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
  centered: {
    // 로딩 및 에러 표시용
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: vs(10),
    ...Typography.body2_m_14,
    color: Colors.grayLight700,
  },
  errorTitleText: {
    marginTop: vs(20),
    ...Typography.subtitle1_b_20,
    color: Colors.mainRed,
    marginBottom: vs(8),
  },
  errorText: {
    ...Typography.body2_m_14,
    color: Colors.grayLight800,
    textAlign: 'center',
    paddingHorizontal: scale(20),
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
    flexGrow: 1, // 중요: 내용이 적을 때도 EmptyListView가 중앙에 오도록
  },
  listContainer: {
    paddingHorizontal: scale(16),
    marginTop: vs(20),
  },
});

export default MyPage;
