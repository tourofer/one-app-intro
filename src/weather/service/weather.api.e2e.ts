import { City, CityResponse, DayForcastInterface } from "../weather.interface";
import moment from 'moment';


const fetchCitiesResponse = [
    {
        id: "1",
        name: "e2e-1"
    },
    {
        id: "2",
        name: "e2e-2"
    }
]

const fetchCityByIdResponse = [
    {
        id: "3",
        name: "fetched city"
    }
]


export async function fetchCitiesList(): Promise<Array<City>> {
    alert("e2e called")
    return fetchCitiesResponse
}

export async function addCity(city: City): Promise<City> {
    alert("e2e called")
    return Promise.resolve(city)
}

export async function fetchCityId(query: string): Promise<CityResponse> {
    alert("e2e called")
    return {
        query: query,
        cities: fetchCityByIdResponse
    }
}

export async function fetchWeather(
    city_id: string,
    city: string,
    date: Date,
    itemsNum: number = 12,
): Promise<DayForcastInterface> {
    return {
        city_name: city,
        date: moment(date).utc().format('DD.MM.yyyy'),
        items: require("./call_stubs/sydney_response.json")
    }
}
