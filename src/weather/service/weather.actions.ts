import { City, CityResponse } from "../weather.interface";
import { weatherStore } from "../store/weather.store"
import * as WeatherApi from "./weather.api"
import { Navigation } from "react-native-navigation"


// export async function fetchCitiesList() : Promise<Array<City>> {
//     try {
//         await WeatherApi.fetchCities()
//     }
// }
export async function queryCity(query: string): Promise<CityResponse>  {
    return WeatherApi.fetchCityId(query) 
}

export async function addCity(componentId: string, city: City) {
    weatherStore.addCity(city)
    Navigation.dismissModal(componentId);
}