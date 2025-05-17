import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';
import {scale, vs} from '../../../utils/scaling';

interface ParticipatedFundingListItemProps {
  imageUrl: string;
  achievementRate: number;
  daysLeft: number;
  title: string;
  onPress: () => void;
}

const ParticipatedFundingListItem: React.FC<ParticipatedFundingListItemProps> = ({
  imageUrl,
  achievementRate,
  daysLeft,
  title,
  onPress,
}) => {
  const dDayText = daysLeft > 0 ? `D-${daysLeft}` : daysLeft === 0 ? 'D-DAY' : `종료`;
  // daysLeft < 0 이면 펀딩이 종료되었음을 의미. "종료" 표시.

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{uri: imageUrl}} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.achievementRateText}>{achievementRate}% 달성</Text>
        <View style={styles.dDayAndTitleContainer}>
          <View style={styles.dDayBadge}>
            <Text style={styles.dDayText}>{dDayText}</Text>
          </View>
          <Text style={styles.titleText} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.grayLightWhite, // 그림자 적용 전 아이템 배경 흰색으로 가정
    borderRadius: scale(10),
    padding: scale(12),
    marginBottom: vs(12),
    // 아이템 그림자
    shadowColor: '#000000', // 가시성을 위해 그림자 색 검정으로 사용
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05, // 부드러운 그림자
    shadowRadius: scale(4),
    elevation: 3, // 안드로이드용 elevation
  },
  image: {
    width: scale(64),
    height: vs(64),
    borderRadius: scale(8), // 이미지 자체에 약간의 radius 적용
    backgroundColor: Colors.grayLight200, // 이미지 로딩 중 플레이스홀더 색상
  },
  infoContainer: {
    flex: 1,
    marginLeft: scale(12),
    justifyContent: 'center', // infoContainer 내부 컨텐츠 수직 중앙 정렬
  },
  achievementRateText: {
    ...Typography.subtitle6_b_14,
    color: Colors.mainRed,
    marginBottom: vs(4), // 달성률과 아래 줄 사이 간격
  },
  dDayAndTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dDayBadge: {
    backgroundColor: Colors.green100, // 테마의 green100 사용
    paddingHorizontal: scale(6),
    paddingVertical: vs(2),
    borderRadius: scale(4),
    marginRight: scale(8), // 제목과 8px 간격
  },
  dDayText: {
    ...Typography.body4_m_12,
    color: Colors.subGreen, // 테마의 subGreen 사용
  },
  titleText: {
    ...Typography.subtitle5_b_16,
    color: Colors.grayLight900,
    flex: 1, // 제목이 남은 공간을 차지하고 줄바꿈되도록 허용
  },
});

export default ParticipatedFundingListItem;
