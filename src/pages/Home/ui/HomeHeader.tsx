import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {scale, vs} from '../../../utils/scaling';

interface HomeHeaderProps {
  onAlertPress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({onAlertPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/img_home_header.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity style={styles.alertButton} onPress={onAlertPress}>
        <Image
          source={require('../../../assets/ic_header_alert_32.png')}
          style={styles.alertIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: vs(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: vs(60),
    width: scale(185),
  },
  alertButton: {
    position: 'absolute',
    right: scale(20),
    padding: vs(14),
  },
  alertIcon: {
    width: scale(32),
    height: vs(32),
  },
});

export default HomeHeader;
