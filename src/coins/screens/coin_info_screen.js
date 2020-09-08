import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import * as coinActions from '../store/coins.actions';


export default CoinInfo = (props) => {

  const [price, setPrice] = useState(null);

  useEffect( () => {
    async function fetchData() {
      const price = await coinActions.fetchPrice(fetch);
      setPrice(price)
    }
    fetchData();  
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coin Info Screen</Text>
      <Text style={styles.text}>{JSON.stringify(price ?? "Loading")}</Text>
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

