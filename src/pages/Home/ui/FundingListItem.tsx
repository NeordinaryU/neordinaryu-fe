import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {scale, vs} from '../../../utils/scaling';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';

interface FundingListItemProps {
  id: string;
  title: string;
  author: string;
  location: string;
  daysLeft: number;
  achievementRate: number;
  currentAmount: number;
  imageUrl: string;
  onPress?: () => void;
}

const FundingListItem: React.FC<FundingListItemProps> = ({
  title,
  author,
  location,
  daysLeft,
  achievementRate,
  currentAmount,
  imageUrl,
  onPress,
}) => {
  // 금액 포맷팅 (천 단위 콤마)
  const formattedAmount = currentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{uri: imageUrl}} style={styles.image} resizeMode="cover" />

      <View style={styles.infoContainer}>
        <Text style={styles.daysLeft}>D-{daysLeft}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.authorLocation}>
          {author} | {location}
        </Text>

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
    height: vs(150),
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
  },
  daysLeft: {
    ...Typography.body4_m_12,
    color: Colors.subGreen,
    backgroundColor: Colors.green100,
    paddingHorizontal: scale(6),
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  title: {
    ...Typography.subtitle5_b_16,
    color: Colors.grayLight900,
    marginTop: vs(4),
  },
  authorLocation: {
    ...Typography.body4_m_12,
    color: Colors.grayLight700,
    marginTop: vs(4),
  },
  amountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: vs(8),
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
