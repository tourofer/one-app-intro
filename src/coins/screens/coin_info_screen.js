import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

export default CoinInfo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coin Info Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3EDFF',
  },
  text: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
  }
});