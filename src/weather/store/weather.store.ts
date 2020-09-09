import * as remx from 'remx';
import {City, DayForecast} from '../weather.interface'
const initialState = {
//      cities :  [
//         {
//             id: "44418",
//             name: "London"
//         },
//         {
//             id: "2487956",
//             name: "San Francisco"
//         }
    }

const weatherCache = new Map()

const state = remx.state(initialState);

const getters = remx.getters({
    // getCities() {
    //     return state.cities;
    // },
    getCityWeather(cityId: string, date: Date) {
        const key =   buildKey(cityId, date)
        return weatherCache.get(key)
    }
});

const setters = remx.setters({
    // addCity(city : City) {
    //     state.cities = [...state.cities, city];
    // },
    setCityWeather(cityId: string, date: Date, dayForcast: DayForecast) {
        const key =   buildKey(cityId, date)
        weatherCache.set(key, dayForcast)
    }
}); 

const buildKey = (cityId: string, date: Date) => cityId + ":" + sanitizeRequestDate(date).getTime()

const sanitizeRequestDate = (date: Date) => {
    const copy = new Date(date)
    copy.setHours(0)
    copy.setMinutes(0)
    copy.setSeconds(0)
    copy.setMilliseconds(0)

    return copy
}

export const weatherStore = {
    ...getters,
    ...setters
};