import { City } from "../weather.interface";
import { weatherStore } from "../store/weather.store"
import * as WeatherApi from "./weather.api"
import {Navigation} from "react-native-navigation"


let currentQuery = null

export async function queryCity(query : string) : Promise<Array<City>> {
   const response = await WeatherApi.fetchCityId(query)
   if(query == response.query) {
    return response.cities
   }
}

export async function addCity(componentId: string, city: City)  {
    weatherStore.addCity(city)
    Navigation.dismissModal(componentId);
}