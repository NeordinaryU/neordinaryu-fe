import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import HomeHeader from '../Home/ui/HomeHeader';
import Colors from '../../styles/theme';
import Typography from '../../styles/typography';
import {scale, vs} from '../../utils/scaling';
import {fetchMagazines, MagazineItem} from '../../api/magazineApi';

type MagazineCardProps = MagazineItem;

const MagazinePage = () => {
  const [magazineData, setMagazineData] = useState<MagazineCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMagazines = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMagazines();
        setMagazineData(data);
      } catch (e) {
        console.error('Error in MagazinePage fetching data:', e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      }
      setLoading(false);
    };

    loadMagazines();
  }, []);

  const renderMagazineCard = ({item}: {item: MagazineCardProps}) => (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8}>
      <Image source={{uri: item.photoUrl}} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={3}>
          {item.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text>Loading magazines...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (magazineData.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text>No magazines found.</Text>
      </SafeAreaView>
    );
  }

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
        data={magazineData}
        renderItem={renderMagazineCard}
        keyExtractor={item => item.id.toString()}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: vs(178),
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
