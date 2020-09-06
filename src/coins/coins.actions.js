import { coinStore } from './coins.store';
import * as Api from './api'

const coins = ['Bitcoin', 'new-coins']

export async function fetchCoinList() {
    const res = await Api.getCoinList(() => coins)
    console.log("got results:" + res)
    coinStore.setCoins(res);
}

export async function fetchPrice(fetch) {
    console.log("fetch price called results:" + res)
    const res = await Api.getPrice(fetch)
    console.log("got results:" + res)
    return res
}

