import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';
import {scale, vs} from '../../../utils/scaling';
import {Region} from '../index';

interface RegionOption {
  label: string;
  value: Region;
}

interface RegionDropdownProps {
  isVisible: boolean;
  options: RegionOption[];
  selectedValue: Region | null;
  onSelect: (value: Region) => void;
}

const RegionDropdown: React.FC<RegionDropdownProps> = ({
  isVisible,
  options,
  selectedValue,
  onSelect,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.regionDropdown}>
      {options.map(item => {
        const isSelected = selectedValue === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.regionOption, isSelected && styles.regionOptionSelected]}
            onPress={() => onSelect(item.value)}>
            <Text
              style={[
                styles.regionOptionText,
                isSelected ? styles.regionOptionTextSelected : styles.regionOptionTextUnselected,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  regionDropdown: {
    position: 'absolute',
    top: vs(40) + vs(4), // PickerPlaceholderButton 높이 + 간격에 상대적입니다.
    left: 0,
    right: 0,
    backgroundColor: Colors.grayLightWhite,
    borderColor: Colors.grayLight400,
    borderWidth: 1,
    borderRadius: scale(8),
    maxHeight: vs(180), // 또는 내용에 따라 동적으로 만듭니다.
    overflow: 'hidden', // 내용이 borderRadius를 존중하도록 보장합니다.
    elevation: 3, // 안드로이드 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    zIndex: 10, // 다른 요소 위에 있도록 보장합니다.
  },
  regionOption: {
    paddingVertical: vs(12),
    paddingHorizontal: scale(12),
    alignItems: 'center', // 텍스트를 가로로 중앙 정렬합니다.
  },
  regionOptionSelected: {
    backgroundColor: Colors.grayLight200,
  },
  regionOptionText: {
    ...Typography.body2_m_14,
    textAlign: 'center',
  },
  regionOptionTextSelected: {
    color: Colors.grayLight900,
  },
  regionOptionTextUnselected: {
    color: Colors.grayLight600,
  },
});

export default RegionDropdown;
