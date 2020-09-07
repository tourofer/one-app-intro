import * as Api from "./weather.api"
import * as Helper from "../test_helper"
import { DayForecast, DayForcastInterface, ForcastItemInterface, ForcastItem } from "./weather.interface"

describe('Weather Api', () => {
    //we want to displday dates as dd.MM.yyyy in our UI
    const telAviv_date = "2013.04.27"

    const telAvivResultMock = {
        minTemp: 40,
        maxTemp: 50,
        humidity: 90,
        stateName: "It`s Hot!"
    }

    const londonResultMock = {
        minTemp: 10,
        maxTemp: 15,
        humidity: 20,
        stateName: "It's English"
    }

    const telAvivServerResponse: Array<ForcastItemInterface> = [...Array(12).keys()]
        .map((i) => createServerItem(telAvivResultMock.stateName, "2013-04.27", numberAsHour(i), telAvivResultMock.minTemp, telAvivResultMock.maxTemp, telAvivResultMock.humidity)
        )

    const londonServerResponse: Array<ForcastItemInterface> = [...Array(12).keys()]
        .map((i) => createServerItem(londonResultMock.stateName, "2013-04.27", numberAsHour(i), londonResultMock.minTemp, londonResultMock.maxTemp, londonResultMock.humidity)
        )

    //server expects day format to be: dd-MM-yyyy
    function createServerItem(state_name: String, day: String, hour: String, minTemp: number, maxTemp: number, humidity: number): ForcastItemInterface {
        return {
            "weather_state_name": state_name,
            "wind_direction_compass": "N",
            "created": `${day}T${hour}:00.000000Z`,
            "min_temp": minTemp,
            "max_temp": maxTemp,
            "humidity": humidity,
            "predictability": 90
        }
    }

    it('should return  data for a hot day in Tel-Aviv', async () => {
      const fakeFatch = ((city: String, date: String) => {
            return Helper.wrapWithJson(telAvivServerResponse)
        })

        const response: DayForcastInterface = await Api.fetchWeather("Tel-aviv", "23-4-2020", fakeFatch)
        expect(response.city_name).toEqual("Tel-aviv")
        expect(response.items.length).toEqual(12)

        for (let index = 0; index < 12; index++) {
            const item: ForcastItem = response.items[index];
            expect(item.min_temp).toEqual(telAvivResultMock.minTemp)
            expect(item.max_temp).toEqual(telAvivResultMock.maxTemp)
            expect(item.weather_state_name).toEqual(telAvivResultMock.stateName)
        }
    })

    it('should format date display to hh.dd.yyyy format', async () => {
        const fakeFatch = ((city: String, date: String) => {
            return Helper.wrapWithJson(telAvivServerResponse)
        })

        const response: DayForcastInterface = await Api.fetchWeather("Tel-aviv", "23-4-2020", fakeFatch)
        expect(response.date).toEqual("23.4.2020")
    })

    it('should return an English day in London', async () => {
        const fakeFatch = ((city: String, date: String) => {
            return Helper.wrapWithJson(londonServerResponse)
        })

        const response: DayForcastInterface = await Api.fetchWeather("London", "24.4.2020", fakeFatch)
        for (let index = 0; index < 12; index++) {
            const item: ForcastItem = response.items[index];
            expect(item.min_temp).toEqual(londonResultMock.minTemp)
            expect(item.max_temp).toEqual(londonResultMock.maxTemp)
            expect(item.humidity).toEqual(londonResultMock.humidity)
        }
    })

    it('should parse dates to nice display hours', async () => {
        const fakeFatch = ((city: String, date: String) => {
            return Helper.wrapWithJson(londonServerResponse)
        })

        const response: DayForcastInterface = await Api.fetchWeather("London", "24.4.2020", fakeFatch)
        const hours = response.items.map((item) => item.created)
        console.log(hours)
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


function numberAsHour(num: number): String {
    if (num < 9) {
        return `0${num}:00`
    } else {
        return `${num}:00`
    }
}
