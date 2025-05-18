import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import HomeHeader from '../Home/ui/HomeHeader';
import Colors from '../../styles/theme';
import Typography from '../../styles/typography';
import {scale, vs} from '../../utils/scaling';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList, SCREENS} from '../../navigation/types';
import {useToast} from '../../contexts/ToastContext';
import {createFunding} from '../../api/fundingApi'; // API 함수 및 Region 타입 임포트
import {Region as ApiRegion} from '../../api/types';

// Import new UI components
import SectionHeader from './ui/SectionHeader';
import FundingTextInput from './ui/FundingTextInput';
import PickerPlaceholderButton from './ui/PickerPlaceholderButton';
import FundingTextArea from './ui/FundingTextArea';
import RegionDropdown from './ui/RegionDropdown';

// Import SVG icons as React Components
import IcCalendar from '../../assets/ic_calendar_22.svg';
import IcArrowDownGary from '../../assets/ic_arrow_down_gary_22.svg';
import IcCheckGray from '../../assets/ic_check_gray_22.svg';
import IcCheckRed from '../../assets/ic_check_red_22.svg';

// Region Enum and Labels (이름 변경: Region -> PageLocalRegion)
export enum PageLocalRegion {
  SEOUL = 'SEOUL',
  INCHEON_GYEONGGI = 'INCHEON_GYEONGGI',
  GYEONGSANG = 'GYEONGSANG',
  CHUNGCHEONG = 'CHUNGCHEONG',
  GANGWON = 'GANGWON',
  JEOLLA = 'JEOLLA',
  JEJU = 'JEJU',
}

export const REGION_LABELS: Record<PageLocalRegion, string> = {
  [PageLocalRegion.SEOUL]: '서울',
  [PageLocalRegion.INCHEON_GYEONGGI]: '인천/경기',
  [PageLocalRegion.GYEONGSANG]: '경상도',
  [PageLocalRegion.CHUNGCHEONG]: '충청도',
  [PageLocalRegion.GANGWON]: '강원도',
  [PageLocalRegion.JEOLLA]: '전라도',
  [PageLocalRegion.JEJU]: '제주도',
};

const regionOptions = Object.values(PageLocalRegion).map(value => ({
  label: REGION_LABELS[value],
  value: value,
}));

// Helper function to format date
const formatDate = (date: Date | null) => {
  if (!date) return '날짜를 선택해주세요';
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const FundingUploadPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {showToast} = useToast();

  // 초기 상태 값들을 명시적으로 정의 (선택 사항, 하지만 초기화 함수에 유용)
  const initialFundingTitle = '';
  const initialDetailedAddress = '';
  const initialTargetAmount = '';
  const initialMessage = '';
  const initialDeadline = null;
  const initialCompletionDate = null;
  const initialSelectedRegion = null;
  const initialPrivacyAgreed = false;

  const [fundingTitle, setFundingTitle] = useState(initialFundingTitle);
  const [detailedAddress, setDetailedAddress] = useState(initialDetailedAddress);
  const [targetAmount, setTargetAmount] = useState(initialTargetAmount);
  const [message, setMessage] = useState(initialMessage);
  const [deadline, setDeadline] = useState<Date | null>(initialDeadline);
  const [completionDate, setCompletionDate] = useState<Date | null>(initialCompletionDate);
  const [selectedRegion, setSelectedRegion] = useState<PageLocalRegion | null>(
    initialSelectedRegion,
  );
  const [privacyAgreed, setPrivacyAgreed] = useState(initialPrivacyAgreed);
  const [isUploading, setIsUploading] = useState(false);

  const resetFormFields = useCallback(() => {
    setFundingTitle(initialFundingTitle);
    setDetailedAddress(initialDetailedAddress);
    setTargetAmount(initialTargetAmount);
    setMessage(initialMessage);
    setDeadline(initialDeadline);
    setCompletionDate(initialCompletionDate);
    setSelectedRegion(initialSelectedRegion);
    setPrivacyAgreed(initialPrivacyAgreed);
  }, [
    initialFundingTitle,
    initialDetailedAddress,
    initialTargetAmount,
    initialMessage,
    initialDeadline,
    initialCompletionDate,
    initialSelectedRegion,
    initialPrivacyAgreed,
  ]);

  const validateForm = useCallback(() => {
    if (!fundingTitle.trim()) {
      Alert.alert('입력 오류', '펀딩 제목을 입력해주세요.');
      return false;
    }
    if (fundingTitle.trim().length > 10) {
      Alert.alert('입력 오류', '펀딩 제목은 10자 이내로 입력해주세요.');
      return false;
    }
    if (!selectedRegion) {
      Alert.alert('입력 오류', '설치 지역을 선택해주세요.');
      return false;
    }
    if (!detailedAddress.trim()) {
      Alert.alert('입력 오류', '상세 주소를 입력해주세요.');
      return false;
    }
    if (detailedAddress.trim().length > 30) {
      Alert.alert('입력 오류', '상세 주소는 30자 이내로 입력해주세요.');
      return false;
    }
    if (!deadline) {
      Alert.alert('입력 오류', '펀딩 마감 기한을 선택해주세요.');
      return false;
    }
    if (!completionDate) {
      Alert.alert('입력 오류', '완공 예정일을 선택해주세요.');
      return false;
    }
    if (!targetAmount.trim() || Number(targetAmount) <= 0) {
      Alert.alert('입력 오류', '목표 금액을 올바르게 입력해주세요.');
      return false;
    }
    if (Number(targetAmount) > 9999999999) {
      // 예시: 100억 초과 방지
      Alert.alert('입력 오류', '목표 금액이 너무 큽니다.');
      return false;
    }
    if (!message.trim()) {
      Alert.alert('입력 오류', '하고 싶은 말을 입력해주세요.');
      return false;
    }
    if (message.trim().length > 500) {
      Alert.alert('입력 오류', '하고 싶은 말은 500자 이내로 입력해주세요.');
      return false;
    }
    if (!privacyAgreed) {
      Alert.alert('동의 필요', '개인정보 수집에 동의해주세요.');
      return false;
    }
    if (completionDate && deadline && completionDate <= deadline) {
      Alert.alert('날짜 오류', '완공 예정일은 펀딩 마감 기한 이후여야 합니다.');
      return false;
    }
    return true;
  }, [
    fundingTitle,
    selectedRegion,
    detailedAddress,
    deadline,
    completionDate,
    targetAmount,
    message,
    privacyAgreed,
  ]);

  const isFormValid =
    fundingTitle.trim() &&
    fundingTitle.trim().length <= 10 &&
    detailedAddress.trim() &&
    detailedAddress.trim().length <= 30 &&
    targetAmount.trim() &&
    Number(targetAmount) > 0 &&
    Number(targetAmount) <= 9999999999 &&
    message.trim() &&
    message.trim().length <= 500 &&
    deadline &&
    completionDate &&
    completionDate > deadline &&
    selectedRegion &&
    privacyAgreed;

  // Region Picker Handlers
  const toggleRegionDropdown = () => {
    if (isDatePickerVisible) setDatePickerVisibility(false);
    setRegionDropdownVisibility(!isRegionDropdownVisible);
  };

  const handleRegionPicked = (region: PageLocalRegion) => {
    setSelectedRegion(region);
    setRegionDropdownVisibility(false);
  };

  // Date Picker Handlers
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'deadline' | 'completionDate' | null>(null);

  const showDatePicker = (mode: 'deadline' | 'completionDate') => {
    setDatePickerMode(mode);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setDatePickerMode(null);
  };

  const handleConfirmDate = (date: Date) => {
    if (datePickerMode === 'deadline') {
      setDeadline(date);
    } else if (datePickerMode === 'completionDate') {
      setCompletionDate(date);
    }
    hideDatePicker();
  };

  const handleUpload = async () => {
    if (!validateForm() || isUploading) {
      return;
    }
    if (!selectedRegion || !deadline || !completionDate) {
      // 확실하게 null 체크
      Alert.alert('오류', '필수 정보가 누락되었습니다. 날짜와 지역을 확인해주세요.');
      setIsUploading(false); // 업로드 중단 시 상태 복원
      return;
    }

    setIsUploading(true);

    const fundingData = {
      title: fundingTitle.trim(),
      description: message.trim(),
      goalMoney: Number(targetAmount),
      deadlineDate: deadline.toISOString(),
      completeDueDate: completionDate.toISOString(),
      region: selectedRegion as ApiRegion,
      detailAddress: detailedAddress.trim(),
      photoUrl: 'https://i.pinimg.com/736x/16/00/18/160018ba1bdc0c187df283f6b080814c.jpg',
      privacyAgreement: privacyAgreed,
    };

    try {
      const response = await createFunding(fundingData);
      if (response.statusCode === 201 && response.data) {
        showToast('펀딩이 성공적으로 업로드되었습니다!', 'success');
        resetFormFields(); // 필드 초기화
        navigation.reset({
          index: 0,
          routes: [{name: SCREENS.MAIN}],
        });
      } else {
        showToast(response.message || '펀딩 업로드에 실패했습니다.', 'error');
      }
    } catch (e: any) {
      console.error('Upload error:', e);
      const errorMessage =
        e.response?.data?.message || e.message || '펀딩 업로드 중 오류가 발생했습니다.';
      showToast(errorMessage, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const [isRegionDropdownVisible, setRegionDropdownVisibility] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View style={styles.flexContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => {
          if (isRegionDropdownVisible) setRegionDropdownVisibility(false);
          if (isDatePickerVisible) setDatePickerVisibility(false);
        }}
        keyboardShouldPersistTaps="handled">
        <HomeHeader />

        <FundingTextInput
          title="펀딩 제목"
          value={fundingTitle}
          onChangeText={setFundingTitle}
          placeholder="어떤 태양광 설치를 준비하고 있나요?"
          maxLength={10}
          onFocus={() => {
            if (isRegionDropdownVisible) setRegionDropdownVisibility(false);
          }}
        />

        <View style={styles.thumbnailSectionContainer}>
          <SectionHeader title="썸네일" />
          <Image
            source={{
              uri: 'https://i.pinimg.com/736x/16/00/18/160018ba1bdc0c187df283f6b080814c.jpg',
            }}
            style={styles.thumbnailImageFixed}
          />
        </View>

        <SectionHeader title="설치 지역" />
        <View style={[styles.regionPickerContainer, {width: scale(193)}]}>
          <PickerPlaceholderButton
            onPress={toggleRegionDropdown}
            buttonText={selectedRegion ? REGION_LABELS[selectedRegion] : '지역 선택'}
            rightIcon={
              <View style={isRegionDropdownVisible ? styles.arrowUp : styles.arrowDown}>
                <IcArrowDownGary width={scale(22)} height={vs(22)} />
              </View>
            }
            wrapperStyle={styles.regionPickerButtonWrapper}
          />
          <RegionDropdown
            isVisible={isRegionDropdownVisible}
            options={regionOptions}
            selectedValue={selectedRegion}
            onSelect={handleRegionPicked}
          />
        </View>
        <FundingTextInput
          title=""
          value={detailedAddress}
          onChangeText={setDetailedAddress}
          placeholder="상세 주소를 입력해주세요."
          maxLength={30}
          style={styles.groupedInput}
          onFocus={() => {
            if (isRegionDropdownVisible) setRegionDropdownVisibility(false);
          }}
        />

        <PickerPlaceholderButton
          title="펀딩 마감 기한"
          onPress={() => {
            if (isRegionDropdownVisible) setRegionDropdownVisibility(false);
            showDatePicker('deadline');
          }}
          buttonText={formatDate(deadline)}
          rightIcon={<IcCalendar width={scale(22)} height={vs(22)} />}
          style={{width: scale(193)}}
        />

        <PickerPlaceholderButton
          title="완공 예정일"
          onPress={() => {
            if (isRegionDropdownVisible) setRegionDropdownVisibility(false);
            showDatePicker('completionDate');
          }}
          buttonText={formatDate(completionDate)}
          rightIcon={<IcCalendar width={scale(22)} height={vs(22)} />}
          style={{width: scale(193)}}
        />

        <FundingTextInput
          title="목표 금액"
          value={targetAmount}
          onChangeText={setTargetAmount}
          placeholder="금액 입력 (최대 100억)"
          keyboardType="numeric"
          suffixUnit="원"
          style={{width: scale(193)}}
          onFocus={() => {
            if (isRegionDropdownVisible) setRegionDropdownVisibility(false);
          }}
        />

        <FundingTextArea
          title="하고싶은말"
          value={message}
          onChangeText={setMessage}
          placeholder="예산, 작업계획 등 펀딩 신청자에게 하고싶은 말을 적어주세요. (최대 500자)"
          style={{height: vs(288)}}
          maxLength={500}
          onFocus={() => {
            if (isRegionDropdownVisible) setRegionDropdownVisibility(false);
          }}
        />

        <TouchableOpacity
          style={styles.privacyContainer}
          onPress={() => setPrivacyAgreed(!privacyAgreed)}
          activeOpacity={0.7}>
          {privacyAgreed ? (
            <IcCheckRed width={scale(22)} height={vs(22)} />
          ) : (
            <IcCheckGray width={scale(22)} height={vs(22)} />
          )}
          <Text style={styles.privacyText}>(필수) 개인정보 수집에 동의함</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.uploadButtonBase,
            isFormValid ? styles.uploadButtonActive : styles.uploadButtonInactive,
          ]}
          onPress={handleUpload}
          disabled={!isFormValid || isUploading}>
          {isUploading ? (
            <ActivityIndicator color={Colors.grayLightWhite} />
          ) : (
            <Text
              style={[
                styles.uploadButtonTextBase,
                isFormValid ? styles.uploadButtonTextActive : styles.uploadButtonTextInactive,
              ]}>
              업로드
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: Colors.grayLightWhite,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: vs(40),
  },
  thumbnailSectionContainer: {
    marginBottom: vs(24),
  },
  thumbnailImageFixed: {
    width: '100%',
    height: vs(200),
    borderRadius: scale(8),
    backgroundColor: Colors.grayLight200,
    marginTop: vs(12),
  },
  regionPickerButtonWrapper: {
    marginBottom: 0,
  },
  groupedInput: {},
  regionPickerContainer: {
    position: 'relative',
    marginBottom: vs(8),
    zIndex: 1,
  },
  arrowDown: {},
  arrowUp: {
    transform: [{rotate: '180deg'}],
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(24),
  },
  privacyText: {
    ...Typography.body2_m_14,
    color: Colors.grayLight700,
    marginLeft: scale(8),
  },
  uploadButtonBase: {
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vs(32),
    marginBottom: vs(20),
    paddingVertical: vs(10),
    paddingHorizontal: scale(20),
    height: 'auto',
  },
  uploadButtonInactive: {
    backgroundColor: Colors.grayLight300,
  },
  uploadButtonActive: {
    backgroundColor: Colors.grayLight900,
  },
  uploadButtonTextBase: {
    ...Typography.subtitle5_b_16,
  },
  uploadButtonTextInactive: {
    color: Colors.grayLight700,
  },
  uploadButtonTextActive: {
    color: Colors.grayLightWhite,
  },
});

export default FundingUploadPage;
