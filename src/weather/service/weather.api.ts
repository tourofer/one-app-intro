import "../weather.interface"
import { DayForcastInterface, ForcastItemInterface, City } from "../weather.interface";
import moment from 'moment';

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
            return ({ ...item, created: moment(item.created).format('HH:mm') })
        })

    return {
        city_name: city,
        date: moment(date).utc().format('DD.MM.yyyy'),
        items: parsedItems
    }
}

export async function fetchCityId(cityName: string) : Promise<Array<City>> {
    const response = await fetch(`${base_url}/search/?query=${cityName}`);
    const responseJson =  await response.json()

    return responseJson.map((item : any) => ({id: item.woeid, name: item.title}))
}

function filterForcastCreatedAfterRequestedDate(items: Array<ForcastItemInterface>, requestDate: Date): Array<ForcastItemInterface> {
    const maxAllowedDateInUtc = moment(requestDate).utc()
    maxAllowedDateInUtc.set({ hour: 23, minute: 59, second: 59, millisecond: 999 })


    return items.filter(item => {
        const createdDateInUtc = moment(item.created).utc()
        return createdDateInUtc <= maxAllowedDateInUtc
    })
}


// function hhmm(date: Date) {
//     return moment(date).utc().format('HH:mm')
// }

function sortByDate(items: Array<ForcastItemInterface>): Array<ForcastItemInterface> {
    return items.sort((a, b) => {
        const aDate = moment(a.created)
        const bDate = moment(b.created)
        return bDate.valueOf() - aDate.valueOf()
    })
}




