import { coinStore } from './coins.store';
import * as Api from './api'

const coins = ['Bitcoin', 'new-coins']

export async function fetchCoinList() {
    const res = await Api.getCoinList(() => coins)
    console.log("got results:" + res)
    coinStore.setCoins(res);
}

export async function fetchPrice(fetch) {
    const res = await Api.fetchPrice(fetch)
    console.log("got results:" + res)
    // coinStore.setCoins(coins);
}