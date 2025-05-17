import React, {useState, useRef} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Text, Image} from 'react-native';
import HomeHeader from '../Home/ui/HomeHeader';
import Colors from '../../styles/theme';
import Typography from '../../styles/typography';
import {scale, vs} from '../../utils/scaling';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {launchImageLibrary, ImagePickerResponse, Asset} from 'react-native-image-picker';

// Import new UI components
import SectionHeader from './ui/SectionHeader';
import FundingTextInput from './ui/FundingTextInput';
import ImageAttachmentInput from './ui/ImageAttachmentInput';
import PickerPlaceholderButton from './ui/PickerPlaceholderButton';
import FundingTextArea from './ui/FundingTextArea';
import RegionDropdown from './ui/RegionDropdown';

// Import SVG icons as React Components
import IcAddImg from '../../assets/ic_add.svg';
import IcCalendar from '../../assets/ic_calendar_22.svg';
import IcArrowDownGary from '../../assets/ic_arrow_down_gary_22.svg';
import IcCheckGray from '../../assets/ic_check_gray_22.svg';
import IcCheckRed from '../../assets/ic_check_red_22.svg';

// Region Enum and Labels
export enum Region {
  SEOUL = 'SEOUL',
  INCHEON_GYEONGGI = 'INCHEON_GYEONGGI',
  GYEONGSANG = 'GYEONGSANG',
  CHUNGCHEONG = 'CHUNGCHEONG',
  GANGWON = 'GANGWON',
  JEOLLA = 'JEOLLA',
  JEJU = 'JEJU',
}

export const REGION_LABELS: Record<Region, string> = {
  [Region.SEOUL]: '서울',
  [Region.INCHEON_GYEONGGI]: '인천/경기',
  [Region.GYEONGSANG]: '경상도',
  [Region.CHUNGCHEONG]: '충청도',
  [Region.GANGWON]: '강원도',
  [Region.JEOLLA]: '전라도',
  [Region.JEJU]: '제주도',
};

const regionOptions = Object.values(Region).map(value => ({
  label: REGION_LABELS[value],
  value: value,
}));

// Helper function to format date
const formatDate = (date: Date | null) => {
  if (!date) return '날짜를 선택해주세요';
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const FundingUploadPage = () => {
  const [fundingTitle, setFundingTitle] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [message, setMessage] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  // Date Picker States
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'deadline' | 'completionDate' | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [completionDate, setCompletionDate] = useState<Date | null>(null);

  // Region Picker States
  const [isRegionDropdownVisible, setRegionDropdownVisibility] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const isFormValid =
    fundingTitle &&
    detailedAddress &&
    targetAmount &&
    message &&
    deadline &&
    completionDate &&
    thumbnailUri &&
    selectedRegion &&
    privacyAgreed;

  const handleChooseThumbnail = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });

    if (result.didCancel) {
      console.log('사용자가 이미지 선택을 취소했습니다.');
    } else if (result.errorCode) {
      console.log('ImagePicker 오류: ', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const selectedImage: Asset = result.assets[0];
      if (selectedImage.uri) {
        setThumbnailUri(selectedImage.uri);
      }
    }
  };

  // Region Picker Handlers
  const toggleRegionDropdown = () => {
    if (isDatePickerVisible) setDatePickerVisibility(false);
    setRegionDropdownVisibility(!isRegionDropdownVisible);
  };

  const handleRegionPicked = (region: Region) => {
    setSelectedRegion(region);
    setRegionDropdownVisibility(false);
  };

  // Date Picker Handlers
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

  const handleUpload = () => {
    console.log('펀딩 상세 정보 업로드:', {
      fundingTitle,
      detailedAddress,
      targetAmount,
      message,
      deadline: deadline ? deadline.toISOString() : null,
      completionDate: completionDate ? completionDate.toISOString() : null,
      thumbnailUri,
      selectedRegion,
      privacyAgreed,
    });
  };

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
          onFocus={() => {
            if (isRegionDropdownVisible) setRegionDropdownVisibility(false);
          }}
        />

        <ImageAttachmentInput title="썸네일 등록하기" onPress={handleChooseThumbnail}>
          {thumbnailUri ? (
            <Image source={{uri: thumbnailUri}} style={styles.thumbnailImage} />
          ) : (
            <View style={styles.thumbnailContent}>
              <IcAddImg width={scale(48)} height={vs(48)} />
              <Text style={styles.thumbnailText}>아이콘을 눌러 사진을 첨부해주세요</Text>
            </View>
          )}
        </ImageAttachmentInput>

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
          placeholder="금액 입력"
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
          placeholder="예산, 작업계획 등 펀딩 신청자에게 하고싶은 말을 적어주세요. (최대 300자)"
          style={{height: vs(288)}}
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
          disabled={!isFormValid}>
          <Text
            style={[
              styles.uploadButtonTextBase,
              isFormValid ? styles.uploadButtonTextActive : styles.uploadButtonTextInactive,
            ]}>
            업로드
          </Text>
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
  regionPickerButtonWrapper: {
    marginBottom: 0,
  },
  groupedInput: {},
  thumbnailContent: {
    alignItems: 'center',
  },
  thumbnailText: {
    ...Typography.body3_b_12,
    color: Colors.grayLight600,
    marginTop: vs(8),
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(8),
    resizeMode: 'cover',
  },
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
