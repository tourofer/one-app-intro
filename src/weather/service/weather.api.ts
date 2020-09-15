import "../weather.interface"
import { DayForcastInterface, ForcastItemInterface, City, CityResponse } from "../weather.interface";
import moment from 'moment';
import * as weatherIconParser from "./weather.icon.parser"

export const base_weather_api_url = "https://www.metaweather.com/api/location"
export const base_app_server_url = "http://localhost:3000"
export const city_list_url = base_app_server_url + "/cities"

export const WeatherStateNames = {
    snow: "Snow",
    sleet: "Sleet",
    hail: "Hail",
    thunderstorm: "Thunderstorm",
    heavy_rain: "Heavy Rain",
    light_rain: "Light Rain",
    showers: "Showers",
    heavy_cloud: "Heavy Cloud",
    light_cloud: "Light Cloud",
    clear: "Clear"
}

export async function fetchCitiesList(): Promise<Array<City>> {
    const response = await fetch(city_list_url);
    const responseJson = await response.json()
    return responseJson
}

export async function addCity(city: City): Promise<any> {
    const response = await fetch(city_list_url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(city),
    });
    return response.json()
}
export async function fetchCityId(query: string): Promise<CityResponse> {
    const response = await fetch(`${base_weather_api_url}/search/?query=${query}`);
    const responseJson = await response.json()

    const cities: Array<City> = responseJson.map((item: any) => ({ id: item.woeid, name: item.title }))
    return {
        query: query,
        cities: cities,
    }
}

export async function fetchWeather(
    city_id: string,
    city: string,
    date: Date,
    itemsNum: number = 12,
): Promise<DayForcastInterface> {

    const requestDateFormat = moment(date).utc().format('yyyy/MM/DD')
    const response = await fetch(`${base_weather_api_url}/${city_id}/${requestDateFormat}/`);
    const responseJson: Array<ForcastItemInterface> = await response.json()
    const filteredItems = filterForcastCreatedAfterRequestedDate(responseJson, date)

    const parsedItems = sortByDate(filteredItems)
        .slice(0, itemsNum)
        .map((item: ForcastItemInterface) => {
            return {
                ...item,
                created: moment(item.created).format('HH:mm'),
                min_temp: parseTemp(item.min_temp),
                max_temp: parseTemp(item.max_temp),
                img_asset_path: weatherIconParser.parseIconAsset(item)
            }
        })

    return {
        city_name: city,
        date: moment(date).utc().format('DD.MM.yyyy'),
        items: parsedItems
    }
}

function parseTemp(temp: number) {
    if (temp) {
        return parseFloat(temp.toFixed(2))
    }
    return temp
}

function filterForcastCreatedAfterRequestedDate(items: Array<ForcastItemInterface>, requestDate: Date): Array<ForcastItemInterface> {
    const maxAllowedDateInUtc = moment(requestDate).utc()
    maxAllowedDateInUtc.set({ hour: 23, minute: 59, second: 59, millisecond: 999 })

    if (items && items.length) {
        return items.filter(item => {
            const createdDateInUtc = moment(item.created).utc()
            return createdDateInUtc <= maxAllowedDateInUtc
        })
    }

    return []
}

function sortByDate(items: Array<ForcastItemInterface>): Array<ForcastItemInterface> {
    return items.sort((a, b) => {
        const aDate = moment(a.created)
        const bDate = moment(b.created)
        return bDate.valueOf() - aDate.valueOf()
    })
}




