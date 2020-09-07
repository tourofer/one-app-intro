import * as Helper from "../test_helper"
import "./weather.interface"
import { DayForcastInterface, DayForecast } from "./weather.interface"

export async function fetchWeather(
    city: String,
    date: String,
    fakeFatch: (city: String, date: String) => Promise<Helper.JsonWrapper>
): Promise<DayForcastInterface> {
    return fakeFatch(city, date)
        .then(response => response.json())
        .then((response) => {
            const formated_date = date.replace(/-/gi, ".")
            return new DayForecast(city, formated_date , response)
        })
}
