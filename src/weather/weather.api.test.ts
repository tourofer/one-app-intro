import * as Api from "./weather.api"
import * as Helper from "../test_helper"
import { DayForecast, DayForcastInterface, ForcastItemInterface, ForcastItem } from "./weather.interface"

describe('Weather Api', () => {

    const serverResponseSnapshot = require("./london.response.json")

    function mockResponse(item) {
        //@ts-ignore
        global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(item),
        })
      );
    }
    
    const stub_forcast_response = {
        forcast_item_count : 12,
        city: "Tel-aviv",
        formatted_date : "24.03.2014"
    }

    const stub_forcast_request = {
        city_id: "test-city-id",
        city: "Tel-aviv",
        date: new Date("2014-03-24")
    }

    it.only('will add city name & date to response object', async () => {
        mockResponse(serverResponseSnapshot)

        const response: DayForcastInterface = await Api.fetchWeather(
            stub_forcast_request.city_id, 
            stub_forcast_request.city, 
            stub_forcast_request.date)

        expect(response.city_name).toEqual(stub_forcast_response.city)
        expect(response.date).toEqual(stub_forcast_response.formatted_date)
    })

    it('should get 12 most updated forcasts for a given day', () => {

    })

    it('should parse dates to nice display hours', async () => {
       

        const response: DayForcastInterface = await Api.fetchWeather("test-id", "London", "24.4.2020")
        const hours = response.items.map((item) => item.created)
        expect(hours).toEqual([
            '00:00', '02:00',
            '04:00', '06:00',
            '08:00', '10:00',
            '12:00', '14:00',
            '16:00', '18:00',
            '20:00', '22:00'
        ])
    })
})
