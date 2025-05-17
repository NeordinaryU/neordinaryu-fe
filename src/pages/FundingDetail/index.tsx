import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {RootStackScreenProps} from '../../navigation/types';
import Colors from '../../styles/theme';
import Typography from '../../styles/typography';
import {scale, vs} from '../../utils/scaling';
import IcArrowLeftGray from '../../assets/ic_arrow_left_gray_32.svg';
import IcDeadlineGray from '../../assets/ic_deadline_gray_22.svg';
import IcCalendarGray from '../../assets/ic_calendar_22.svg';
import IcMoneyGray from '../../assets/ic_money_gray_22.svg';
import IcSpotGray from '../../assets/ic_spot_gray_22.svg';
import {useToast} from '../../contexts/ToastContext';
import {
  getFundingDetail,
  FundingDetailResponseData,
  donateToFunding,
  prolongFunding,
} from '../../api/fundingApi';
import {Region} from '../../api/types';
import {API_REGION_TO_USER_LABEL_MAP} from '../../../label';
import DonationSuccessModal from './ui/DonationSuccessModal';

// type FundingDetailRouteProp = RouteProp<RootStackParamList, 'FundingDetail'>;
type FundingDetailProps = RootStackScreenProps<'FundingDetail'>;

// 날짜 포맷 함수 (예: YYYY년 MM월 DD일)
const formatDateString = (isoDateString?: string): string => {
  if (!isoDateString) return '날짜 정보 없음';
  const date = new Date(isoDateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const FundingDetailPage: React.FC<FundingDetailProps> = ({route, navigation}) => {
  const {fundingId} = route.params;
  const {showToast} = useToast();

  const [fundingData, setFundingData] = useState<FundingDetailResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDonating, setIsDonating] = useState(false);
  const [isProlonging, setIsProlonging] = useState(false);
  const [isDonationSuccessModalVisible, setIsDonationSuccessModalVisible] = useState(false);

  const [hasParticipated, setHasParticipated] = useState(false);

  useEffect(() => {
    const fetchFundingDetails = async () => {
      if (!fundingId) {
        setError('펀딩 ID가 유효하지 않습니다.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching funding details for ID: ${fundingId}`);
        const response = await getFundingDetail(Number(fundingId));

        if (response.statusCode === 200 && response.data) {
          console.log('Funding details fetched successfully:', response.data);
          setFundingData(response.data);
        } else {
          const errorMessage = response.message || '펀딩 상세 정보를 불러오는데 실패했습니다.';
          setError(errorMessage);
          console.error(
            'Error fetching funding details:',
            errorMessage,
            'Status:',
            response.statusCode,
          );
        }
      } catch (e: any) {
        const errorMessage = e.message || '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        console.error('Exception fetching funding details:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundingDetails();
  }, [fundingId]);

  const progressPercent =
    fundingData?.goalMoney && fundingData.goalMoney > 0 && fundingData.fundedMoney !== undefined
      ? Math.min(100, Math.floor((fundingData.fundedMoney / fundingData.goalMoney) * 100))
      : 0;

  const handleJoinFunding = async () => {
    if (!fundingData || !fundingId || isDonating) return;

    if (hasParticipated && !fundingData.isOwner) {
      showToast('이미 참여한 펀딩입니다.', 'success');
      return;
    }

    setIsDonating(true);
    const donationAmount = 50000;

    try {
      console.log(`Funding ID ${fundingId}에 ${donationAmount}원 후원 시도`);
      const response = await donateToFunding(Number(fundingId), {userFundedMoney: donationAmount});

      if (response.statusCode === 200 && response.data) {
        showToast(response.message || '후원이 성공적으로 완료되었습니다.', 'success');
        setHasParticipated(true);

        setFundingData(prevData => {
          if (!prevData) return null;
          return {
            ...prevData,
            fundedMoney: response.data.updatedFundingTotal,
          };
        });
        console.log('후원 성공, 응답 데이터:', response.data);
        setIsDonationSuccessModalVisible(true);
      } else {
        showToast(response.message || '후원에 실패했습니다.', 'error');
        console.error('후원 API 실패 (API 성공, 내용 실패):', response.message);
      }
    } catch (e: any) {
      showToast(e.message || '후원 중 오류가 발생했습니다.', 'error');
      console.error('후원 API 예외 발생:', e.message);
    } finally {
      setIsDonating(false);
    }
  };

  const handleProlongFunding = async () => {
    if (!fundingData || !fundingId || isProlonging) return;

    setIsProlonging(true);
    try {
      const currentDeadline = new Date(fundingData.deadlineDate);
      currentDeadline.setDate(currentDeadline.getDate() + 30);
      const newDeadlineISO = currentDeadline.toISOString();

      console.log(`Funding ID ${fundingId} 연장 시도, 새 마감일: ${newDeadlineISO}`);
      const response = await prolongFunding(Number(fundingId), {
        deadlineDate: newDeadlineISO,
      });

      if (response.statusCode === 200 && response.data) {
        showToast(response.message || '펀딩 기간이 성공적으로 연장되었습니다.', 'success');
        setFundingData(prevData => {
          if (!prevData) return null;
          return {
            ...prevData,
            deadlineDate: response.data.deadlineDate,
          };
        });
        console.log('펀딩 연장 성공, 응답 데이터:', response.data);
      } else {
        showToast('펀딩 기간 연장에 실패했습니다.', 'error');
        console.error('펀딩 연장 API 실패:', response.message);
      }
    } catch (e: any) {
      showToast('펀딩 기간 연장 중 오류가 발생했습니다.', 'error');
      console.error('펀딩 연장 API 예외 발생:', e.message);
    } finally {
      setIsProlonging(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.mainRed} />
        <Text style={styles.loadingText}>펀딩 정보를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text style={styles.errorTitleText}>오류 발생</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>뒤로 가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!fundingData) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text style={styles.errorText}>펀딩 정보를 찾을 수 없습니다.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>뒤로 가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IcArrowLeftGray width={scale(32)} height={vs(32)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>펀딩 상세 {fundingData.isOwner ? '내 펀딩' : '펀딩'}</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Image
          source={{
            uri: fundingData.photoUrl || 'https://via.placeholder.com/375x200.png?text=No+Image',
          }}
          style={styles.fundingImage}
        />

        <Text style={styles.title}>{fundingData.title}</Text>
        <Text style={styles.description}>{fundingData.description}</Text>

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            모인 금액 {fundingData.isOwner ? '내 펀딩' : '펀딩'}
          </Text>
          <View style={styles.progressAmountContainer}>
            <Text style={styles.currentAmountText}>
              {(fundingData.fundedMoney || 0).toLocaleString()}원
            </Text>
            <Text style={styles.progressPercentText}>{progressPercent}% 달성</Text>
          </View>
        </View>

        <View style={styles.detailsSectionContainer}>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <IcDeadlineGray width={scale(22)} height={vs(22)} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>펀딩 마감 기한</Text>
            </View>
            <Text style={styles.detailValue}>{formatDateString(fundingData.deadlineDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <IcCalendarGray width={scale(22)} height={vs(22)} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>완공 예정일</Text>
            </View>
            <Text style={styles.detailValue}>{formatDateString(fundingData.completeDueDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <IcMoneyGray width={scale(22)} height={vs(22)} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>목표 금액</Text>
            </View>
            <Text style={styles.detailValue}>
              {(fundingData.goalMoney || 0).toLocaleString()}원
            </Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <IcSpotGray width={scale(22)} height={vs(22)} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>설치 지역</Text>
            </View>
            <Text style={styles.detailValue}>
              {API_REGION_TO_USER_LABEL_MAP[fundingData.region as Region] || fundingData.region}
            </Text>
          </View>
        </View>

        {fundingData.isOwner ? (
          <View style={styles.ownerActionsContainer}>
            <View style={styles.funderCountSection}>
              <Text style={styles.funderCountLabel}>후원한 사람 목록</Text>
              <Text style={styles.funderCountValue}>
                {fundingData.funderCount !== undefined ? `${fundingData.funderCount}명` : '0명'}
              </Text>
            </View>
            <Text style={styles.prolongHintText}>
              {fundingData.isProlongation
                ? '* 더 이상 연장할 수 없어요.'
                : '* 연장하기 선택 시 펀딩 기간을 30일 연장 시킬 수 있어요.'}
            </Text>
            {!fundingData.isProlongation && (
              <TouchableOpacity
                style={[styles.prolongButton, isProlonging && styles.disabledButton]}
                onPress={handleProlongFunding}
                disabled={isProlonging}>
                {isProlonging ? (
                  <ActivityIndicator size="small" color={Colors.grayLightWhite} />
                ) : (
                  <Text style={styles.prolongButtonText}>한 번 연장하기</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.joinButton, hasParticipated || isDonating ? styles.disabledButton : {}]}
            onPress={handleJoinFunding}
            disabled={hasParticipated || isDonating}>
            {isDonating ? (
              <ActivityIndicator size="small" color={Colors.grayLightWhite} />
            ) : (
              <Text style={styles.joinButtonText}>
                {hasParticipated ? '참여 완료' : '이 펀딩과 함께하기'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      <DonationSuccessModal
        visible={isDonationSuccessModalVisible}
        onDismiss={() => setIsDonationSuccessModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.grayLightWhite,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
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
    textAlign: 'center',
  },
  errorText: {
    ...Typography.body2_m_14,
    color: Colors.grayLight800,
    textAlign: 'center',
    marginBottom: vs(20),
  },
  goBackButton: {
    backgroundColor: Colors.mainRed,
    paddingVertical: vs(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
  },
  goBackButtonText: {
    ...Typography.subtitle5_b_16,
    color: Colors.grayLightWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(16),
    height: vs(56),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight300,
  },
  backButton: {
    position: 'absolute',
    left: scale(16),
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.subtitle5_b_16,
    color: Colors.grayLight900,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: vs(40),
  },
  fundingImage: {
    width: '100%',
    height: vs(200),
    backgroundColor: Colors.grayLight200,
  },
  title: {
    ...Typography.subtitle1_b_20,
    color: Colors.grayLight900,
    marginTop: vs(20),
    marginHorizontal: scale(16),
  },
  description: {
    ...Typography.body1_m_16,
    color: Colors.grayLight700,
    marginTop: vs(8),
    marginHorizontal: scale(16),
    lineHeight: vs(24),
  },
  progressSection: {
    marginTop: vs(24),
    marginHorizontal: scale(16),
  },
  progressLabel: {
    ...Typography.body2_m_14,
    color: Colors.grayLight700,
  },
  progressAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: vs(4),
  },
  currentAmountText: {
    ...Typography.title5_b_22,
    color: Colors.grayLight900,
  },
  progressPercentText: {
    ...Typography.subtitle1_b_20,
    color: Colors.mainRed,
  },
  detailsSectionContainer: {
    marginTop: vs(24),
    marginHorizontal: scale(16),
    paddingVertical: vs(20),
    paddingHorizontal: scale(16),
    backgroundColor: Colors.grayLightWhite,
    borderWidth: 1,
    borderColor: Colors.grayLight300,
    borderRadius: scale(8),
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: scale(8),
  },
  detailLabel: {
    ...Typography.body2_m_14,
    color: Colors.grayLight700,
  },
  detailValue: {
    ...Typography.body2_m_14,
    color: Colors.grayLight900,
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: Colors.mainRed,
    paddingVertical: vs(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(32),
    marginHorizontal: scale(16),
    height: vs(52),
    flexDirection: 'row',
  },
  ownerButton: {
    backgroundColor: Colors.grayLight500,
  },
  disabledButton: {
    backgroundColor: Colors.grayLight400,
  },
  joinButtonText: {
    ...Typography.subtitle4_m_18,
    color: Colors.grayLightWhite,
  },
  ownerActionsContainer: {
    marginTop: vs(32),
    marginHorizontal: scale(16),
    backgroundColor: Colors.grayLight100,
    paddingVertical: vs(16),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
  },
  funderCountSection: {
    alignItems: 'flex-start',
    marginBottom: vs(24),
  },
  funderCountLabel: {
    ...Typography.body2_m_14,
    color: Colors.grayLight700,
  },
  funderCountValue: {
    ...Typography.subtitle1_b_20,
    color: Colors.grayLight900,
    marginTop: vs(4),
  },
  prolongHintText: {
    ...Typography.body2_m_14,
    color: Colors.mainRed,
  },
  prolongButton: {
    backgroundColor: Colors.grayLight900,
    paddingHorizontal: scale(20),
    paddingVertical: vs(10),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(8),
    height: vs(48),
  },
  prolongButtonText: {
    ...Typography.subtitle4_m_18,
    color: Colors.grayLightWhite,
  },
});

export default FundingDetailPage;
