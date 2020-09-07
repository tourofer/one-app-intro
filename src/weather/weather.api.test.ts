import * as Api from "./weather.api"
import * as Helper from "../test_helper"
import * as Models from "./weather.interface"

describe('Weather Api', () => {


    function mockForcast(city: String, day: String): Models.DayForcastInterface {
        return new Models.DayForecast(city, day, generateDayItems(),)
    }

    it('should return formated data for specific day and location', async () => {
        const fakeFatch = ((city: String, date: String) => {
           return Helper.wrapWithJson(mockForcast(city, date))
        })

        const response: Models.DayForcastInterface = await Api.fetchWeather("Tel-aviv", "23.4.2020", fakeFatch)
        expect(response.date).toEqual("23.4.2020")
        expect(response.items.length).toEqual(11)

    })

})

function generateDayItems(): Array<Models.ForcastItemInterface> {
    const items: Array<Models.ForcastItemInterface> =
        [...Array(11).keys()]
            .map((number) => number * 2)
            .map((hour: number) => {
                if (hour < 10) {
                    "0" + hour
                } else {
                    hour
                }
            })
            .map((hour) => new Models.ForcastItem("Hot", "N", `${hour}`, 44, 50, 90, 100))
    return items
}