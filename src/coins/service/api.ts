interface Price {
    symbol: String,
    rate: number
}

interface CoinsData {
    timestamp: number,
    coins: any
}

export async function getPrice(fetch : any) : Promise<Map<string, Price>>  {
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
    const responseJson = await response.json()
    
    const bitcoinPriceInfo = responseJson.bpi
    
    return  {
        //@ts-ignore
        "usd" : extractPrice(bitcoinPriceInfo.USD),
        "gbp" : extractPrice(bitcoinPriceInfo.GBP), 
        "eur" : extractPrice(bitcoinPriceInfo.EUR)
        }
}

export async function getCoinList(fetch: any) : Promise<CoinsData>  {
    const coins = await fetch()
    return {
        timestamp : Date.now(),
        coins: coins 
 }}

 function extractPrice(currency : any) : Price {
     return ({symbol: currency.symbol, rate: currency.rate})
 }
 //TODO how to add type to this call
// const extractPrice = (currency : any) => ({symbol: currency.symbol, rate: currency.rate})