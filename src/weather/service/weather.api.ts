import "../weather.interface"
import { DayForcastInterface, DayForecast, ForcastItemInterface } from "../weather.interface"


export async function fetchWeather(
    city_id: string,
    city: string,
    date: Date,
    itemsNum: number = 12
): Promise<DayForcastInterface> {
    const requestDate = parseRequestDate(date)
    const response = await fetch(`https://www.metaweather.com/api/location/${city_id}/${requestDate}/`);
    const responseJson: Array<ForcastItemInterface> = await response.json()

    const filteredItems = filterForcastCreatedAfterDate(responseJson, date)
    const parsedItems = sortByDate(filteredItems)
        .slice(0, itemsNum)
        .map(item => {
            return ({ ...item, created: hhmm(new Date(item.created)) })
        })

    return new DayForecast(city, parseResponseDate(date), parsedItems)
}

function filterForcastCreatedAfterDate(items: Array<ForcastItemInterface>, maxAllowedDate: Date): Array<ForcastItemInterface> {
    return items.filter(item => {
        const createdDate = new Date(item.created)
        return createdDate.getDay() >= maxAllowedDate.getDay()
    })
}

function hhmm(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}`
}

function sortByDate(items: Array<ForcastItemInterface>): Array<ForcastItemInterface> {
    return items.sort((a, b) => {
        const aDate = new Date(a.created)
        const bDate = new Date(b.created)
        if (aDate > bDate) {
            return -1
        } else if (aDate == bDate) {
            return 0
        } else {
            return 1
        }
    })
}

function parseRequestDate(date: Date) {
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date)

    return `${year}/${month}/${day}`
}

function parseResponseDate(date: Date) {
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date)

    return `${day}.${month}.${year}`
}






