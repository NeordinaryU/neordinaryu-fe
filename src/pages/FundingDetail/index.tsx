import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
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

// type FundingDetailRouteProp = RouteProp<RootStackParamList, 'FundingDetail'>;
type FundingDetailProps = RootStackScreenProps<'FundingDetail'>;

// 플레이스홀더 데이터 - fundingId를 기반으로 실제 데이터 가져오기로 대체하세요.
const placeholderFundingData = {
  id: '1',
  imageUri: 'https://via.placeholder.com/375x200.png?text=Funding+Image',
  title: '태양광 발전으로 미래를 밝히다',
  description:
    '이 프로젝트는 지속 가능한 에너지 솔루션을 제공하여 지역 사회에 긍정적인 영향을 미치는 것을 목표로 합니다. 함께 깨끗한 에너지 미래를 만들어가요.',
  currentAmount: 75000000,
  targetAmount: 100000000,
  deadline: '2024년 12월 31일',
  completionDate: '2025년 6월 30일',
  region: '서울',
};

const FundingDetailPage: React.FC<FundingDetailProps> = ({route, navigation}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {fundingId: _fundingId} = route.params;
  // TODO: _fundingId를 사용하여 실제 펀딩 데이터
  const fundingData = placeholderFundingData;
  const {showToast} = useToast();

  // Placeholder state to simulate if user has already participated
  const [hasParticipated, setHasParticipated] = useState(false);

  const progressPercent = Math.floor((fundingData.currentAmount / fundingData.targetAmount) * 100);

  const handleJoinFunding = () => {
    if (hasParticipated) {
      showToast('이미 참여한 펀딩입니다.', 'error');
    } else {
      showToast('펀딩 참여가 완료되었어요.', 'success');
      // In a real app, you would also update the participation status here, e.g.:
      // setHasParticipated(true);
      // await participateInFundingApi(fundingData.id);
    }
    // For demo, toggle participation state
    setHasParticipated(!hasParticipated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IcArrowLeftGray width={scale(32)} height={vs(32)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>펀딩 상세</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Image source={{uri: fundingData.imageUri}} style={styles.fundingImage} />

        <Text style={styles.title}>{fundingData.title}</Text>
        <Text style={styles.description}>{fundingData.description}</Text>

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>모인 금액</Text>
          <View style={styles.progressAmountContainer}>
            <Text style={styles.currentAmountText}>
              {fundingData.currentAmount.toLocaleString()}원
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
            <Text style={styles.detailValue}>{fundingData.deadline}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <IcCalendarGray width={scale(22)} height={vs(22)} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>완공 예정일</Text>
            </View>
            <Text style={styles.detailValue}>{fundingData.completionDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <IcMoneyGray width={scale(22)} height={vs(22)} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>목표 금액</Text>
            </View>
            <Text style={styles.detailValue}>{fundingData.targetAmount.toLocaleString()}원</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelContainer}>
              <IcSpotGray width={scale(22)} height={vs(22)} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>설치 지역</Text>
            </View>
            <Text style={styles.detailValue}>{fundingData.region}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.joinButton} onPress={handleJoinFunding}>
          <Text style={styles.joinButtonText}>이 펀딩과 함께하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.grayLightWhite,
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
    ...Typography.subtitle6_b_14,
    color: Colors.grayLight700,
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
    marginTop: vs(60),
    marginHorizontal: scale(20),
  },
  joinButtonText: {
    ...Typography.subtitle4_m_18,
    color: Colors.grayLightWhite,
  },
});

export default FundingDetailPage;
