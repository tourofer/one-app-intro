interface Price {
    symbol: String,
    rate: number
}

interface CoinsData {
    timestamp: number,
    coins: any
}

export async function getPrice(fetch : any) : Promise<Price>  {
   return fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(response => response.json())
    .then(data => data.bpi)
    .then(bpi => {
        return  {
                "usd" : extractPrice(bpi.USD),
                "gbp" : extractPrice(bpi.GBP), 
                "eur" : extractPrice(bpi.EUR)
                }
})
}

export async function getCoinList(fetch: any) : Promise<CoinsData>  {
    const coins = await fetch()
    return {
        timestamp : Date.now(),
        coins: coins
 }}

const extractPrice = (currency : any) => ({symbol: currency.symbol, rate: currency.rate})