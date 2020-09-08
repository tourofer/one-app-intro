import { coinStore } from './coins.store';
import * as Api from '../service/api'

const coins = ['Bitcoin', 'new-coins']

export async function fetchCoinList() {
    const res = await Api.getCoinList(() => coins)
    coinStore.setCoins(res);
}

export async function fetchPrice(fetch : any) {
    const res = await Api.getPrice(fetch)
    return res
}