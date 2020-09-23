import { City, DayForcastInterface } from "../weather.interface";
import { weatherStore } from "../store/weather.store"
import * as WeatherApi from "./weather.api"
import { Navigation } from "react-native-navigation"
import * as Parser from "./weather.parser"
import moment from "moment";


export async function queryCity(query: string): Promise<QueryCityResponse> {
    const response = await WeatherApi.queryCityByName(query)

    return {
        query: query,
        error: response.error,
        hasConnnection: response.hasConnection,
        data: response.data,
    }
}

export interface QueryCityResponse {
    query: string,
    hasConnnection: boolean,
    error?: any
    data?: City[]
}
export async function fetchCitiesList() {
    try {
        const cities: Array<City> = await WeatherApi.fetchCitiesList()
        weatherStore.setCityList(cities)
    } catch (e) {
        console.log(e)
    }
}


export async function addCity(componentId: string, city: City) {
    try {
        const serverCity: City = await WeatherApi.addCity(city)
        weatherStore.addCity(serverCity)
        Navigation.dismissModal(componentId);
    } catch (e) {
        alert("Please make sure fake server is started")
        console.log(e)
    }
}

export async function fetchWeather(
    city_id: string,
    city_name: string,
    date: Date,
    itemsNum: number = 12,
): Promise<DayForcastInterface> {
    const rawResponse = await WeatherApi.fetchWeather(city_id, date)
    const parsedItems = Parser.parseWeatherItems(rawResponse, date, itemsNum)

    return {
        city_name: city_name,
        date: moment(date).utc().format('DD.MM.yyyy'),
        items: parsedItems
    }
}


