import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FundingUploadPage = () => {
  return (
    <View style={styles.container}>
      <Text>Funding Upload Page</Text>
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

export default FundingUploadPage;
