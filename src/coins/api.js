export async function getPrice(fetch)  {
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

const extractPrice = (currency) => currency.symbol + currency.rate