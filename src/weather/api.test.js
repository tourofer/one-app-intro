import * as Api from './api'


const dataSnapshot = { "bpi":{
    "USD":{
    "code":"USD",
    "symbol":"$",
    "rate":"10,257.4012",
    "description":"United States Dollar",
    "rate_float":10257.4012
    },
    "GBP":{
    "code":"GBP",
    "symbol":"£",
    "rate":"7,724.5309",
    "description":"British Pound Sterling",
    "rate_float":7724.5309
    },
    "EUR":{
    "code":"EUR",
    "symbol":"€",
    "rate":"8,664.8063",
    "description":"Euro",
    "rate_float":8664.8063
    }
    }}
    

describe('getPrice', () => {

    it('will fetch prices from coindesk', async () => {
        const fakeFetch = (url) => {
            expect(url).toEqual('https://api.coindesk.com/v1/bpi/currentprice.json')
            return Promise.resolve(dataSnapshot)
        }
        
       await Api.getPrice(fakeFetch)
    })

    it('will parse prices for each currency', async () => {
        const fakeFetch = (url) => {
            expect(url).toEqual('https://api.coindesk.com/v1/bpi/currentprice.json')
            return Promise.resolve(dataSnapshot)
        }
        
       const response = await Api.getPrice(fakeFetch)
       expect(response.usd).toEqual("$10,257.4012")
       expect(response.gbp).toEqual("£7,724.5309")
       expect(response.eur).toEqual("€8,664.8063")

    })
})