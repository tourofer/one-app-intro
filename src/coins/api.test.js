import * as Api from './api'
import * as  Helper from '../test_helper'

describe('getPrice', () => {

    const dataSnapshot = {
        "bpi": {
            "USD": {
                "code": "USD",
                "symbol": "$",
                "rate": "10,257.4012",
                "description": "United States Dollar",
                "rate_float": 10257.4012
            },
            "GBP": {
                "code": "GBP",
                "symbol": "£",
                "rate": "7,724.5309",
                "description": "British Pound Sterling",
                "rate_float": 7724.5309
            },
            "EUR": {
                "code": "EUR",
                "symbol": "€",
                "rate": "8,664.8063",
                "description": "Euro",
                "rate_float": 8664.8063
            }
        }
    }

    const mockResult = Helper.wrapWithJson(dataSnapshot)
    
    
    it('will fetch prices from coindesk', async () => {
        const fakeFetch = (url) => {
            expect(url).toEqual('https://api.coindesk.com/v1/bpi/currentprice.json')
            return mockResult
        }

        await Api.getPrice(fakeFetch)
    })

    it('will parse prices for each currency', async () => {
        const fakeFetch = (url) => {
            expect(url).toEqual('https://api.coindesk.com/v1/bpi/currentprice.json')
            return mockResult
        }

        const response = await Api.getPrice(fakeFetch)
        expect(response.usd).toEqual({"rate": "10,257.4012", "symbol": "$"})
        expect(response.gbp).toEqual({"rate": "7,724.5309", "symbol":"£"})
        expect(response.eur).toEqual({"rate": "8,664.8063", "symbol": "€"})

    })
})

describe('get coin list', () => {

    const mockCoinList = ['Bitcoin', 'mock-coin']

    it('will fetch coins from server', async () => {
        const fakeFetch = () => {
            return mockCoinList
        }

        const realDateNow = Date.now.bind(global.Date);
        const dateNowStub = jest.fn(() => 1530518207007);
        global.Date.now = dateNowStub;

        const result = await Api.getCoinList(fakeFetch)
        expect(result.timestamp).toEqual(1530518207007)
        expect(result.coins).toEqual(['Bitcoin', 'mock-coin'])
    })
})




