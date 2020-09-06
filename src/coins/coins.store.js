import * as remx from 'remx';

const initialState = {
  coins: ['Bitcoin', 'other-false-coin']
};

const state = remx.state(initialState);

const getters = remx.getters({
  getCoins() {
    return state.coins;
  }
});

const setters = remx.setters({
    setCoins(coins) {
        this.state = coins
    },
    addCoin(coin) {
        state.coins = [...state.coins, coin];
    }
});

export const coinStore = {
  ...getters,
  ...setters
};