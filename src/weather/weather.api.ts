import * as Helper from "../test_helper"

export async function fetchWeather(
    city: String,
    date: String,
    fakeFatch: (city: String, date: String) => Promise<Helper.JsonWrapper<DayForecast>>
): Promise<DayForecast> {

    return fakeFatch(city, date)
        .then(response => response.json())
}