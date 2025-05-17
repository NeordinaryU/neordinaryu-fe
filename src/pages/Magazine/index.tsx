import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import HomeHeader from '../Home/ui/HomeHeader';
import Colors from '../../styles/theme';
import Typography from '../../styles/typography';
import {scale, vs} from '../../utils/scaling';

interface MagazineCardProps {
  id: string;
  // imageUrl: string; // For future use
  title: string;
  subtitle: string;
}

// Dummy Data for Magazine Cards
const DUMMY_MAGAZINE_DATA: MagazineCardProps[] = [
  {
    id: 'mag1',
    title: '태양광 에너지, 미래를 밝히다',
    subtitle: '지속 가능한 에너지 솔루션의 모든 것',
  },
  {
    id: 'mag2',
    title: '우리 동네 에너지 자립 프로젝트',
    subtitle: '주민과 함께 만드는 클린 에너지 마을',
  },
  {
    id: 'mag3',
    title: '풍력 발전의 현재와 미래 전망',
    subtitle: '바람이 만드는 깨끗한 에너지 이야기',
  },
  // Add more items for scrolling effect
  {
    id: 'mag4',
    title: 'ESS, 에너지 저장 시스템의 혁신',
    subtitle: '효율적인 에너지 관리를 위한 필수 기술',
  },
  {
    id: 'mag5',
    title: '스마트 그리드: 차세대 전력망',
    subtitle: '똑똑한 에너지 소비 시대를 열다',
  },
];

const MagazinePage = () => {
  const renderMagazineCard = ({item}: {item: MagazineCardProps}) => (
    <View style={styles.cardContainer}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <HomeHeader />
            <View style={styles.headerTextContentContainer}>
              <View style={{height: vs(32)}} />
              <Text style={styles.subText}>써닝과 함께 밝혀지고 있는 세상</Text>
              <Text style={styles.mainTitle}>에코 매거진</Text>
            </View>
          </View>
        )}
        data={DUMMY_MAGAZINE_DATA}
        renderItem={renderMagazineCard}
        keyExtractor={item => item.id}
        style={styles.listStyle}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.grayLightWhite,
  },
  headerTextContentContainer: {
    marginBottom: vs(16),
  },
  subText: {
    ...Typography.body4_m_12,
    color: Colors.grayLight700,
    marginBottom: vs(4),
  },
  mainTitle: {
    ...Typography.title5_b_22,
    color: Colors.grayLight900,
  },
  listStyle: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: vs(20),
  },
  cardContainer: {
    backgroundColor: Colors.grayLightWhite,
    borderRadius: scale(12),
    marginBottom: vs(16),
    shadowColor: Colors.grayLight600,
    shadowOffset: {width: 0, height: vs(2)},
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: vs(178),
    backgroundColor: Colors.grayLight300,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
  },
  cardTextContainer: {
    padding: scale(16),
  },
  cardTitle: {
    ...Typography.subtitle3_b_18,
    color: Colors.grayLight900,
    marginBottom: vs(4),
  },
  cardSubtitle: {
    ...Typography.body4_m_12,
    color: Colors.grayLight700,
  },
});

export default MagazinePage;
