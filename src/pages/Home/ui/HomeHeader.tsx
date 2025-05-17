import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {scale, vs} from '../../../utils/scaling';

interface HomeHeaderProps {
  onAlertPress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/img_home_header.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
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
});

export default HomeHeader;
