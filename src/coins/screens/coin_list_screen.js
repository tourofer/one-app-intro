import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';

import { connect } from 'remx';
import { coinStore } from '../coins.store';
import * as coinListActions from '../coins_list.actions';

const CoinsList = (props) => {

  useEffect(() => {
    coinListActions.fetchCoins()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coin List Screen</Text>
      <Button onPress={() => {
        navigateToCoinInfo(props.componentId)
      }} title="Press Me" />
      <Text>{props.coins}</Text>
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


CoinsList.propTypes = {
  componentId: PropTypes.string,
  coins: PropTypes.array,
};

function mapStateToProps() {
  return {
    coins: [coinStore.getCoins()],
  };
}

export default connect(mapStateToProps)(CoinsList);
