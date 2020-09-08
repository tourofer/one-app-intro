import { JsonWrapper } from "../test_helper"
import "./weather.interface"
import { DayForcastInterface, DayForecast, ForcastItem } from "./weather.interface"


const config = {

}

//date is 27/4/2012 formate, 
//TODO request generic date object instead
export async function fetchWeather(
    city_id: String,
    city: String,
    date: Date
): Promise<DayForcastInterface> {


    const requestDate = parseRequestDate(date)
    const response = await fetch(`https://www.metaweather.com/api/location/${city_id}/${requestDate}/`);  
    const data = await response.json()

    const parsedItems = data.map(item  => {
        const createdDate : Date = new Date(item.created)
        const createdTimeString = `${createdDate.getHours()}:${createdDate.getMinutes()}`
        return ({ ...item, created: createdTimeString })
    })
    return new DayForecast(city, parseResponseDate(date), parsedItems)
}

function parseRequestDate(date: Date) {
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }) 
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date ) 

    return `${year}/${month}/${day}`
}

function parseResponseDate(date: Date) {
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date ) 

    return `${day}.${month}.${year}`
}






