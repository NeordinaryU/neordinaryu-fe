import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import Colors from '../../../styles/theme';
import Typography from '../../../styles/typography';
import {scale, vs} from '../../../utils/scaling';
import IcModal1 from '../../../assets/ic_modal_1.svg';
import IcId22 from '../../../assets/ic_id_22.svg';
import IcBack22 from '../../../assets/ic_back_22.svg';
import IcOwner22 from '../../../assets/ic_owner_22.svg';
import IcDismiss32 from '../../../assets/ic_dismiss_32.svg';

interface DonationSuccessModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const DonationSuccessModal: React.FC<DonationSuccessModalProps> = ({visible, onDismiss}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onDismiss}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContainer} onPress={() => {}}>
          <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
            <IcDismiss32 width={scale(32)} height={vs(32)} />
          </TouchableOpacity>

          <IcModal1 width={scale(65)} height={vs(65)} style={styles.modalIcon} />
          <Text style={styles.modalText감사}>함께해주셔서 감사해요!</Text>
          <Text style={styles.modalText안내}>펀딩 금액 송금을 완료해야{'\n'}참여가 완료돼요.</Text>

          <View style={styles.accountInfoBox}>
            <View style={styles.accountInfoRow}>
              <IcId22 width={scale(22)} height={vs(22)} style={styles.accountInfoIcon} />
              <Text style={styles.accountInfoText}>아이디 leewxx</Text>
            </View>
            <View style={styles.accountInfoRow}>
              <IcBack22 width={scale(22)} height={vs(22)} style={styles.accountInfoIcon} />
              <Text style={styles.accountInfoText}>예금주 이우창</Text>
            </View>
            <View style={styles.accountInfoRow}>
              <IcOwner22 width={scale(22)} height={vs(22)} style={styles.accountInfoIcon} />
              <Text style={styles.accountInfoText}>계좌번호 KB 국민은행-35390201194648</Text>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: Colors.grayLightWhite,
    maxWidth: scale(320),
    borderRadius: scale(10),
    paddingTop: vs(44),
    paddingBottom: scale(16),
    paddingHorizontal: scale(16),
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: vs(10),
    right: scale(10),
    padding: scale(5),
    zIndex: 1,
  },
  closeButtonText: {
    // Style for the text X
    fontSize: scale(20),
    color: Colors.grayLight900,
    fontWeight: 'bold',
  },
  modalIcon: {
    marginBottom: vs(16),
  },
  modalText감사: {
    ...Typography.body2_m_14,
    color: Colors.grayLight600,
    textAlign: 'center',
    marginBottom: vs(8),
  },
  modalText안내: {
    ...Typography.subtitle1_b_20,
    color: Colors.grayLight900,
    textAlign: 'center',
    marginBottom: vs(15),
  },
  accountInfoBox: {
    width: '100%',
    backgroundColor: Colors.grayLightWhite,
    borderWidth: 1,
    borderColor: Colors.grayLight300,
    borderRadius: scale(10),
    paddingVertical: vs(16),
    paddingHorizontal: scale(10),
  },
  accountInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  accountInfoIcon: {
    marginRight: scale(8),
  },
  accountInfoText: {
    ...Typography.body2_m_14,
    color: Colors.grayLight900,
    flexShrink: 1,
  },
});

export default DonationSuccessModal;
