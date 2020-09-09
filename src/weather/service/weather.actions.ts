import { City } from "../weather.interface";
import { weatherStore } from "../store/weather.store"
import * as WeatherApi from "./weather.api"
import {Navigator} from "../weather.navigation"


export async function queryCity(query : string) : Promise<Array<City>> {
    //TODO is the convention to wrap all api calls?
   return await WeatherApi.fetchCityId(query)
}

export async function addCity(componentId: string, city: City)  {
    weatherStore.addCity(city)
    Navigator.navigateToCityWeather(componentId, city)
}