import React from 'react'
import {View, Text, StyleSheet, Button} from 'react-native';
import {Navigation} from 'react-native-navigation';

export default CoinsList = (props) => {
    return (
        <View style={styles.container}>
          <Text style={styles.text}>Coin List Screen</Text>
          <Button onPress={()=>{
              navigateToCoinInfo(props.componentId)
          }} title="Press Me"/>
        </View>
      );
}

const navigateToCoinInfo = (componentId) => {
    Navigation.push(componentId, {
        component: {
          name: 'coin.Info',
          passProps: {
            somePropToPass: 'Some props that we are passing'
          },
        }
      });
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