import {coinStore} from './coins.store';
import * as Api from './api'

const coins = ['Bitcoin', 'new-coins']
  
export async function fetchCoins() {
   const res = await Api.getPrice(fetch)
   console.log("got results:" + res)
    coinStore.setCoins(coins);
}