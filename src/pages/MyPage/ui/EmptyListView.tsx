import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';
import {scale, vs} from '../../../utils/scaling';
import IcEmpty from '../../../assets/ic_empty_64.svg'; // 비어있는 상태 아이콘 가져오기
import {MyPageFilterType} from '../index'; // 필터 타입 가져오기

interface EmptyListViewProps {
  type: MyPageFilterType;
  onButtonPress: () => void;
}

const EmptyListView: React.FC<EmptyListViewProps> = ({type, onButtonPress}) => {
  const message =
    type === 'participated' ? '아직 참여한 펀딩이 없어요!' : '아직 개설한 펀딩이 없어요!';
  const buttonText = type === 'participated' ? '참여하기' : '개설하기';

  return (
    <View style={styles.container}>
      <IcEmpty width={scale(64)} height={vs(64)} />
      <Text style={styles.messageText}>{message}</Text>
      <TouchableOpacity style={styles.actionButton} onPress={onButtonPress} activeOpacity={0.8}>
        <Text style={styles.actionButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  messageText: {
    ...Typography.body1_m_16, // 적절한 타이포그래피 스타일로 가정
    color: Colors.grayLight700, // 비어있는 메시지에 약간 더 밝은 회색 사용 가능
    textAlign: 'center',
    marginTop: vs(8),
  },
  actionButton: {
    backgroundColor: Colors.grayLight900,
    paddingHorizontal: vs(40), // 수평 패딩 scale -> vs로 변경되어 있어 확인 필요, 기존 scale(20)이 적절할 수 있음
    paddingVertical: vs(10),
    borderRadius: scale(30),
    marginTop: vs(16),
  },
  actionButtonText: {
    ...Typography.subtitle4_m_18, // 다른 주요 버튼과 일관성 유지
    color: Colors.grayLightWhite,
  },
});

export default EmptyListView;
