import { City, CityResponse } from "../weather.interface";
import { weatherStore } from "../store/weather.store"
import * as WeatherApi from "./weather.api"
import {Navigation} from "react-native-navigation"


let currentQuery = null
//export async function fetchCityList() : Promise<Array<City>> {
    //TODO is the convention to wrap all api calls?
   // return await WeatherApi.fetchWeather(query)
//}

export async function queryCity(query : string) : Promise<Array<City>> {
   const response = await WeatherApi.fetchCityId(query)
   if(query == response.query) {
    return response.cities
   }
}

export async function addCity(componentId: string, city: City)  {
    console.log("add city called: " + JSON.stringify(city))
    weatherStore.addCity(city)
    Navigation.dismissModal(componentId);
}