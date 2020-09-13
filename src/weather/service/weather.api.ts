import "../weather.interface"
import { DayForcastInterface, ForcastItemInterface, City, CityResponse } from "../weather.interface";
import moment from 'moment';
import * as weatherIconParser from ".//weather.icon.parser"
export const base_url = "https://www.metaweather.com/api/location"

export async function fetchWeather(
    city_id: string,
    city: string,
    date: Date,
    itemsNum: number = 12,
): Promise<DayForcastInterface> {

    const requestDateFormat = moment(date).utc().format('yyyy/MM/DD')
    const response = await fetch(`${base_url}/${city_id}/${requestDateFormat}/`);
    const responseJson: Array<ForcastItemInterface> = await response.json()
    const filteredItems = filterForcastCreatedAfterRequestedDate(responseJson, date)

    const parsedItems = sortByDate(filteredItems)
        .slice(0, itemsNum)
        .map(item => {
            return {
                id: item.id,
                created: moment(item.created).format('HH:mm'),
                weather_state_name: item.weather_state_name,
                wind_direction_compass: item.wind_direction_compass,
                min_temp: parseTemp(item.min_temp),
                max_temp: parseTemp(item.max_temp),
                humidity: item.humidity,
                predictability: item.predictability,
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
    return null
}

export async function fetchCityId(query: string): Promise<CityResponse> {
    const response = await fetch(`${base_url}/search/?query=${query}`);
    const responseJson = await response.json()

    const cities: Array<City> = responseJson.map((item: any) => ({ id: item.woeid, name: item.title }))
    return {
        query: query,
        cities: cities,
    }
}

function filterForcastCreatedAfterRequestedDate(items: Array<ForcastItemInterface>, requestDate: Date): Array<ForcastItemInterface> {
    const maxAllowedDateInUtc = moment(requestDate).utc()
    maxAllowedDateInUtc.set({ hour: 23, minute: 59, second: 59, millisecond: 999 })

    if(!items) {
        return []
    }
    return items.filter(item => {
        const createdDateInUtc = moment(item.created).utc()
        return createdDateInUtc <= maxAllowedDateInUtc
    })
}

function sortByDate(items: Array<ForcastItemInterface>): Array<ForcastItemInterface> {
    return items.sort((a, b) => {
        const aDate = moment(a.created)
        const bDate = moment(b.created)
        return bDate.valueOf() - aDate.valueOf()
    })
}




