import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, FlatList} from 'react-native';
import {scale, vs} from '../../../utils/scaling';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const regions = ['서울', '인천/경기', '경상도', '충청도', '강원도', '전라도', '제주도'];

const RegionSelector: React.FC<RegionSelectorProps> = ({selectedRegion, onRegionChange}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegionSelect = (region: string) => {
    onRegionChange(region);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
        <Text style={styles.regionText}>{selectedRegion}</Text>
        <View style={styles.arrowDown} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={regions}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[styles.regionItem, item === selectedRegion && styles.selectedRegionItem]}
                  onPress={() => handleRegionSelect(item)}>
                  <Text
                    style={[
                      styles.regionItemText,
                      item === selectedRegion && styles.selectedRegionItemText,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: vs(46),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regionText: {
    ...Typography.subtitle3_b_18,
    color: Colors.grayLight900,
    marginRight: scale(4),
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: scale(6),
    borderRightWidth: scale(6),
    borderTopWidth: scale(8),
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.grayLight900,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: Colors.grayLightWhite,
    borderRadius: 8,
    overflow: 'hidden',
  },
  regionItem: {
    paddingVertical: vs(16),
    paddingHorizontal: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight200,
  },
  selectedRegionItem: {
    backgroundColor: Colors.red100,
  },
  regionItemText: {
    ...Typography.subtitle4_m_18,
    color: Colors.grayLight900,
    textAlign: 'center',
  },
  selectedRegionItemText: {
    color: Colors.mainRed,
    ...Typography.subtitle3_b_18,
  },
});

export default RegionSelector;
