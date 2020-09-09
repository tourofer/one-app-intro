import "../weather.interface"
import { DayForcastInterface, DayForecast, ForcastItemInterface } from "../weather.interface"
import moment from 'moment';

export async function fetchWeather(
    city_id: string,
    city: string,
    date: Date,
    itemsNum: number = 12
): Promise<DayForcastInterface> {
    
    const response = await fetch(`https://www.metaweather.com/api/location/${city_id}/${parseRequestDate(date)}/`);
    const responseJson: Array<ForcastItemInterface> = await response.json()

    const filteredItems = filterForcastCreatedAfterRequestedDate(responseJson, date)
    const parsedItems = sortByDate(filteredItems)
        .slice(0, itemsNum)
        .map(item => {
            return ({ ...item, created: hhmm(new Date(item.created)) })
        })

    return new DayForecast(city, parseResponseDate(date), parsedItems)
}

function filterForcastCreatedAfterRequestedDate(items: Array<ForcastItemInterface>, requestDate: Date): Array<ForcastItemInterface> {
     const maxAllowedDate = moment(requestDate).utc()
     maxAllowedDate.set({hour:23,minute:59,second:59,millisecond:999})
  

    return items.filter(item => {
        const createdDate = moment(item.created).utc()
        if (createdDate > maxAllowedDate) {
            console.log("found future item: " + JSON.stringify(item))
            console.log("createdTime: " + createdDate)
            console.log("maxAllowed: " + maxAllowedDate)

        }
        return createdDate <= maxAllowedDate
    })
}

function hhmm(date: Date) {
   return moment(date).utc().format('HH:mm')
}

function sortByDate(items: Array<ForcastItemInterface>): Array<ForcastItemInterface> {
    return items.sort((a, b) => {
        const aDate = moment(a.created)
        const bDate = moment(b.created)
        return bDate.valueOf() - aDate.valueOf()
    })
}

function parseRequestDate(date: Date) {
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date)

    return `${year}/${month}/${day}`
}

function parseResponseDate(date: Date) {
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date)

    return `${day}.${month}.${year}`
}






