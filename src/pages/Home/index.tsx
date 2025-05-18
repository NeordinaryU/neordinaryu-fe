import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Text,
  Platform,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/types';
import HomeHeader from './ui/HomeHeader';
import RegionSelector from './ui/RegionSelector';
import FundingListHeader from './ui/FundingListHeader';
import FundingListItem from './ui/FundingListItem';
import {scale, vs} from '../../utils/scaling';
import Colors from '../../styles/theme';
import {getFundingList, FundingListItem as ApiFundingListItem} from '../../api/fundingApi';
import {getCurrentUserRegionSetting, setCurrentUserRegion} from '../../api/userApi';
import {Region} from '../../api/types';
import Typography from '../../styles/typography';
import {API_REGION_TO_USER_LABEL_MAP} from '../../../label';
import imgBanner1 from '../../assets/img_banner.png';

type FilterOption = 'achievement' | 'latest';

const DEFAULT_API_REGION: Region = 'SEOUL';

const HomePage = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(DEFAULT_API_REGION);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('latest');
  const [fundingData, setFundingData] = useState<ApiFundingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestErrorParams, setRequestErrorParams] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserRegion = async () => {
      try {
        console.log('사용자 지역 설정 API 호출 시작');
        const response = await getCurrentUserRegionSetting();
        if (response.statusCode === 200 && response.data && response.data.region) {
          console.log('사용자 지역 설정 불러오기 성공:', response.data.region);
          setSelectedRegion(response.data.region);
        } else {
          console.warn(
            '사용자 지역 설정을 불러오지 못했습니다. 기본 지역으로 설정됩니다:',
            DEFAULT_API_REGION,
            '응답:',
            response,
          );
          setSelectedRegion(DEFAULT_API_REGION);
        }
      } catch (e: any) {
        console.error(
          '사용자 지역 설정 API 호출 중 오류 발생:',
          e.message,
          '기본 지역으로 설정됩니다:',
          DEFAULT_API_REGION,
        );
        setSelectedRegion(DEFAULT_API_REGION);
      }
    };

    loadUserRegion();
  }, []);

  useEffect(() => {
    const fetchFundings = async () => {
      setIsLoading(true);
      setError(null);
      setRequestErrorParams(null);
      let currentParams = {};

      try {
        const alignValue = activeFilter === 'achievement' ? 'rate' : 'latest';

        const params: {region: Region; align: string} = {
          region: selectedRegion,
          align: alignValue,
        };

        currentParams = params;
        console.log('펀딩 목록 조회 API 호출, 파라미터:', params);
        const response = await getFundingList(params);

        if (response.statusCode === 200 && response.data) {
          setFundingData(response.data);
          console.log('펀딩 목록 조회 성공:', response.data.length, '개');
        } else {
          const errorMessage = response.message || '펀딩 목록을 불러오는데 실패했습니다.';
          setError(errorMessage);
          setRequestErrorParams(JSON.stringify(params, null, 2));
          console.error(
            '펀딩 목록 API 오류:',
            errorMessage,
            '응답코드:',
            response.statusCode,
            '요청 파라미터:',
            params,
          );
        }
      } catch (e: any) {
        const errorMessage = e.message || '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        setRequestErrorParams(JSON.stringify(currentParams, null, 2));
        console.error('펀딩 목록 API 예외:', errorMessage, '요청 파라미터:', currentParams);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedRegion) {
      fetchFundings();
    }
  }, [selectedRegion, activeFilter]);

  const handleRegionChange = async (region: Region) => {
    setSelectedRegion(region);

    try {
      console.log(`사용자 지역 설정 업데이트 API 호출 시작, 선택된 지역: ${region}`);
      const response = await setCurrentUserRegion({region});

      if (response.statusCode === 200) {
        console.log('사용자 지역 설정 서버 업데이트 성공:', response.data);
      } else {
        console.error(
          '사용자 지역 설정 서버 업데이트 실패 (API 성공, 내용 실패):',
          response.message,
          '선택된 지역:',
          region,
        );
      }
    } catch (e: any) {
      console.error(
        '사용자 지역 설정 서버 업데이트 API 호출 중 예외 발생:',
        e.message,
        '선택된 지역:',
        region,
      );
    }
  };

  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter);
  };

  const handleFundingItemPress = (id: number) => {
    console.log('펀딩 아이템 클릭:', id);
    navigation.navigate(SCREENS.FUNDING_DETAIL, {fundingId: id.toString()});
  };

  const calculateDaysLeft = (deadlineDate: string): number => {
    const deadline = new Date(deadlineDate);
    const today = new Date();
    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.max(0, deadline.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading && fundingData.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.mainRed} />
        <Text style={styles.loadingText}>펀딩 목록을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error && fundingData.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text style={styles.errorTitleText}>오류 발생</Text>
        <Text style={styles.errorText}>{error}</Text>
        {requestErrorParams && (
          <View style={styles.errorParamsContainer}>
            <Text style={styles.errorParamsTitleText}>요청 파라미터:</Text>
            <Text style={styles.errorParamsText}>{requestErrorParams}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <HomeHeader />
          <View>
            <RegionSelector selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
          </View>
          <View style={styles.bannerContainer}>
            <Image source={imgBanner1} style={styles.bannerImage} />
          </View>
          <FundingListHeader selectedFilter={activeFilter} onFilterChange={handleFilterChange} />

          <View style={styles.fundingListContainer}>
            {isLoading && fundingData.length > 0 && (
              <ActivityIndicator
                size="small"
                color={Colors.mainRed}
                style={{marginBottom: vs(10)}}
              />
            )}
            {!isLoading && fundingData.length === 0 && !error ? (
              <Text style={styles.emptyListText}>해당 조건의 펀딩이 없습니다.</Text>
            ) : error && fundingData.length === 0 ? (
              <Text style={styles.emptyListText}>펀딩 목록을 불러오지 못했습니다.</Text>
            ) : (
              fundingData.map(item => (
                <FundingListItem
                  key={item.fundingId}
                  id={item.fundingId.toString()}
                  title={item.title}
                  userRegionLabel={
                    API_REGION_TO_USER_LABEL_MAP.SEOUL || item.user.region.toString()
                  }
                  detailAddress={item.detailAddress || ''}
                  daysLeft={calculateDaysLeft(item.deadlineDate)}
                  achievementRate={item.achievementRate}
                  currentAmount={item.fundedMoney}
                  imageUrl={item.photoUrl}
                  onPress={() => handleFundingItemPress(item.fundingId)}
                />
              ))
            )}
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
    height: vs(160),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fundingListContainer: {
    alignItems: 'center',
    marginTop: vs(16),
    paddingBottom: vs(20),
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: vs(10),
    ...Typography.body2_m_14,
    color: Colors.grayLight700,
  },
  errorTitleText: {
    ...Typography.subtitle1_b_20,
    color: Colors.mainRed,
    marginBottom: vs(8),
  },
  errorText: {
    ...Typography.body2_m_14,
    color: Colors.grayLight800,
    textAlign: 'center',
    marginBottom: vs(16),
  },
  errorParamsContainer: {
    marginTop: vs(10),
    padding: scale(10),
    backgroundColor: Colors.grayLight100,
    borderRadius: scale(4),
    width: '100%',
  },
  errorParamsTitleText: {
    ...Typography.body3_b_12,
    color: Colors.grayLight900,
    marginBottom: vs(4),
  },
  errorParamsText: {
    ...Typography.body4_m_12,
    color: Colors.grayLight700,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  emptyListText: {
    marginTop: vs(20),
    ...Typography.body2_m_14,
    color: Colors.grayLight600,
  },
});

export default HomePage;
