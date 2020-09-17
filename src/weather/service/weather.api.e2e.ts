import { City, CityResponse, DayForcastInterface, ForcastItemInterface } from "../weather.interface";

export const e2eConsts = {
    first_city_id: "1",
    fetched_city_1 :  {
        id: "3",
        name: "fetched city 1"
    },
    fetched_city_2:  {
        id: "4",
        name: "fetched city 2"
    },
    raw_weather_response : require("./call_stubs/weather_forcast_london.response.json")
}


const fetchCitiesResponse = [
    {
        id: e2eConsts.first_city_id,
        name: "e2e-1"
    },
    {
        id: "2",
        name: "e2e-2"
    }
]

const fetchCityByIdResponse = [e2eConsts.fetched_city_1, e2eConsts.fetched_city_2]

//TODO How to ensure compatability with weather.api.js (interface, abstract class)

export async function fetchCitiesList(): Promise<Array<City>> {
    return fetchCitiesResponse
}

export async function addCity(city: City): Promise<City> {
    return Promise.resolve(city)
}

export async function fetchCityId(query: string): Promise<Array<City>> {
    return fetchCityByIdResponse
}

export async function fetchWeather(city_id: string,date: Date): Promise<Array<ForcastItemInterface>> {
    return e2eConsts.raw_weather_response
}


