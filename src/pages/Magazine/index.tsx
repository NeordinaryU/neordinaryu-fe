import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MagazinePage = () => {
  return (
    <View style={styles.container}>
      <Text>Magazine Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MagazinePage;
