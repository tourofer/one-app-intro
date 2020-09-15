import { City, CityResponse } from "../weather.interface";
import { weatherStore } from "../store/weather.store"
import * as WeatherApi from "./weather.api"
import { Navigation } from "react-native-navigation"


export async function fetchCitiesList() {
    try {
        const cities: Array<City> = await WeatherApi.fetchCitiesList()
        weatherStore.setCityList(cities)
    } catch (e) {
        console.log(e)
    }
}
export async function queryCity(query: string): Promise<CityResponse> {
    return WeatherApi.fetchCityId(query)
}

export async function addCity(componentId: string, city: City) {
    try {
        const serverCity: City = await WeatherApi.addCity(city)
        weatherStore.addCity(serverCity)
        Navigation.dismissModal(componentId);
    } catch (e) {
        console.log(e)
    }
}