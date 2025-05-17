import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale, vs} from '../../../utils/scaling';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';

type FilterOption = 'achievement' | 'latest';

interface FundingListHeaderProps {
  selectedFilter: FilterOption;
  onFilterChange?: (filter: FilterOption) => void;
}

const FundingListHeader: React.FC<FundingListHeaderProps> = ({selectedFilter, onFilterChange}) => {
  const handleFilterPress = (filter: FilterOption) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>써닝과 함께 재생에너지를 만들어요!</Text>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>세상을 밝힐 지역들</Text>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            onPress={() => handleFilterPress('achievement')}
            style={styles.filterButton}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'achievement' && styles.activeFilterText,
              ]}>
              달성률 순
            </Text>
          </TouchableOpacity>

          <Text style={styles.divider}>|</Text>

          <TouchableOpacity onPress={() => handleFilterPress('latest')} style={styles.filterButton}>
            <Text
              style={[styles.filterText, selectedFilter === 'latest' && styles.activeFilterText]}>
              최신순
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginTop: vs(32),
  },
  subtitle: {
    ...Typography.body3_b_12,
    color: Colors.grayLight700,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(4),
  },
  title: {
    ...Typography.title5_b_22,
    color: Colors.grayLight900,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: vs(4),
  },
  filterText: {
    ...Typography.body2_m_14,
    color: Colors.grayLight600,
  },
  activeFilterText: {
    color: Colors.grayLight900,
  },
  divider: {
    ...Typography.body2_m_14,
    color: Colors.grayLight600,
    marginHorizontal: scale(8),
  },
});

export default FundingListHeader;
