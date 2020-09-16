import "../weather.interface"
import { ForcastItemInterface, City } from "../weather.interface";
import moment from 'moment';

export const base_weather_api_url = "https://www.metaweather.com/api/location"
export const base_app_server_url = "http://localhost:3000"
export const city_list_url = base_app_server_url + "/cities"


export async function fetchCitiesList(): Promise<Array<City>> {
    const response = await fetch(city_list_url);
    const responseJson = await response.json()
    return responseJson
}

export async function addCity(city: City): Promise<any> {
    const response = await fetch(city_list_url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(city),
    });
    return response.json()
}
export async function fetchCityId(query: string): Promise<Array<City>> {
    const response = await fetch(`${base_weather_api_url}/search/?query=${query}`);
    const responseJson = await response.json()
    return responseJson.map((item: any) => ({ id: item.woeid, name: item.title }))

}

export async function fetchWeather(
    city_id: string,
    date: Date,
): Promise<Array<ForcastItemInterface>> {
    const requestDateFormat = moment(date).utc().format('yyyy/MM/DD')
    const response = await fetch(`${base_weather_api_url}/${city_id}/${requestDateFormat}/`);
    return await response.json()
}





