const fetch= require('node-fetch')

const results = fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
.then(response => response.json())
.then(data => data.bpi)
.then(data => {
   return  {
     "usd" : extractPrice(data.USD),
     "gbp" : extractPrice(data.GBP), 
     "eur" : extractPrice(data.EUR)
}
})
.then(res => console.log(res))


const extractPrice = (currency) => currency.symbol + currency.rate