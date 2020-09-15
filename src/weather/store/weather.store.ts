import * as remx from 'remx';
import { City, DayForcastInterface } from '../weather.interface'
const weatherCache = new Map()

export const localCitiesData: Array<City> = [
    {
        id: "44418",
        name: "London"
    },
    {
        id: "2487956",
        name: "San Francisco"
    }
]


interface State {
    cities: Array<City>
}
const initialState: State = {
    cities: localCitiesData
}

const existingCityIds = new Set(localCitiesData.map(item => item.id))
const state = remx.state(initialState);

const getters = remx.getters({
    getCities() {
        return state.cities;
    },
    getCityWeather(cityId: string, date: Date) {
        const key = buildKey(cityId, date)
        return weatherCache.get(key)
    }
});

const setters = remx.setters({
    setCityList(cities: City[]) {
        state.cities = cities
    },
    addCity(city: City) {
        if (!existingCityIds.has(city.id)) {
            existingCityIds.add(city.id)
            state.cities = [...state.cities, city];
        }
    },
    setCityWeather(cityId: string, date: Date, dayForcast: DayForcastInterface) {
        const key = buildKey(cityId, date)
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