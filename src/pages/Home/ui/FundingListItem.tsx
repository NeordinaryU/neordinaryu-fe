import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {scale, vs} from '../../../utils/scaling';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';

interface FundingListItemProps {
  id: string;
  title: string;
  userRegionLabel: string;
  detailAddress: string;
  daysLeft: number;
  achievementRate: number;
  currentAmount: number;
  imageUrl: string;
  onPress?: () => void;
}

const FundingListItem: React.FC<FundingListItemProps> = ({
  title,
  userRegionLabel,
  detailAddress,
  daysLeft,
  achievementRate,
  currentAmount,
  imageUrl,
  onPress,
}) => {
  // 금액 포맷팅 (천 단위 콤마)
  const formattedAmount = currentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 사용자 지역 레이블과 상세 주소를 조합하여 표시
  let displayLocationInfo = '';
  if (userRegionLabel && detailAddress) {
    displayLocationInfo = `${userRegionLabel} | ${detailAddress}`;
  } else if (userRegionLabel) {
    displayLocationInfo = userRegionLabel;
  } else if (detailAddress) {
    displayLocationInfo = detailAddress;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{uri: imageUrl}} style={styles.image} resizeMode="cover" />

      <View style={styles.infoContainer}>
        {/* 상단 정보 그룹 */}
        <View style={styles.topContentContainer}>
          <Text style={styles.daysLeft}>D-{daysLeft}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {displayLocationInfo ? (
            <Text style={styles.locationInfoText} numberOfLines={1}>
              {displayLocationInfo}
            </Text>
          ) : null}
        </View>

        {/* 하단 금액 정보 그룹 */}
        <View style={styles.amountContainer}>
          <Text style={styles.achievementRate}>{achievementRate}% 달성</Text>
          <Text style={styles.currentAmount}>{formattedAmount}원</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(336),
    backgroundColor: 'white',
    borderRadius: 8,
    padding: scale(12),
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: vs(16),
  },
  image: {
    width: scale(126),
    height: vs(126),
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: scale(12),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topContentContainer: {
    // 상단 정보 그룹 스타일 (특별한 스타일 없어도 됨, 내부 요소 마진으로 간격 조절)
  },
  daysLeft: {
    ...Typography.body4_m_12,
    color: Colors.subGreen,
    backgroundColor: Colors.green100,
    paddingHorizontal: scale(6),
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: vs(6),
  },
  title: {
    ...Typography.subtitle5_b_16,
    color: Colors.grayLight900,
    marginBottom: vs(6),
  },
  locationInfoText: {
    ...Typography.body4_m_12,
    color: Colors.grayLight700,
  },
  amountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  achievementRate: {
    ...Typography.subtitle6_b_14,
    color: Colors.mainRed,
    marginBottom: vs(2),
  },
  currentAmount: {
    ...Typography.title5_b_22,
    color: Colors.grayLight900,
  },
});

export default FundingListItem;
