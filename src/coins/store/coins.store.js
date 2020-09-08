import * as remx from 'remx';

const initialState = {
    coins: []
};

const state = remx.state(initialState);

const getters = remx.getters({
    getCoins() {
        return state.coins;
    }
});

const setters = remx.setters({
    setCoins(coins) {
        state.coins = coins
    },
    addCoin(coin) {
        state.coins = [...state.coins, coin];
    }
});

export const coinStore = {
    ...getters,
    ...setters
};