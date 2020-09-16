import { ForcastItemInterface } from "../weather.interface"
import moment from 'moment';

export const WeatherStateNames = {
    snow: "Snow",
    sleet: "Sleet",
    hail: "Hail",
    thunderstorm: "Thunderstorm",
    heavy_rain: "Heavy Rain",
    light_rain: "Light Rain",
    showers: "Showers",
    heavy_cloud: "Heavy Cloud",
    light_cloud: "Light Cloud",
    clear: "Clear"
}

const Images = {
    weatherState: {
        snow_icon: require('../icons/snow.png'),
        sleet_icon: require('../icons/sleet.png'),
        hail_icon: require('../icons/hail.png'),
        thunderstorm_icon: require('../icons/thunderstorm.png'),
        rain_icon: require('../icons/rain.png'),
        light_cloud_icon: require('../icons/light_cloud.png'),
        heavy_cloud_icon: require('../icons/heavy_cloud.png'),
        clear_icon: require('../icons/clear.png'),
    }
}


export const parseWeatherItems = (items: Array<ForcastItemInterface>,  date: Date, itemsNum: number):  Array<ForcastItemInterface> => {
    try {
        const filteredItems = filterForcastCreatedAfterRequestedDate(items, date)
        const parsedItems = sortByDate(filteredItems)
            .slice(0, itemsNum)
            .map((item: ForcastItemInterface) => {
                return {
                    ...item,
                    created: moment(item.created).format('HH:mm'),
                    min_temp: parseTemp(item.min_temp),
                    max_temp: parseTemp(item.max_temp),
                    img_asset_path: parseIconAsset(item)
                }
            })
        return parsedItems
    } catch(e) {
        console.log(`error parsing weather items: ${e}`)
    }
}


const parseIconAsset = (item: ForcastItemInterface) => {
    switch (item.weather_state_name) {
        case WeatherStateNames.snow: return Images.weatherState.snow_icon
        case WeatherStateNames.sleet: return Images.weatherState.sleet_icon
        case WeatherStateNames.hail: return Images.weatherState.hail_icon
        case WeatherStateNames.thunderstorm: return Images.weatherState.thunderstorm_icon
        case WeatherStateNames.light_rain: return Images.weatherState.rain_icon
        case WeatherStateNames.heavy_rain: return Images.weatherState.rain_icon
        case WeatherStateNames.showers: return Images.weatherState.rain_icon
        case WeatherStateNames.light_cloud: return Images.weatherState.light_cloud_icon
        case WeatherStateNames.heavy_cloud: return Images.weatherState.heavy_cloud_icon
        case WeatherStateNames.clear: return Images.weatherState.clear_icon
        default: return null
    }
}

const parseTemp = (temp: number) => {
    if (temp) {
        return parseFloat(temp.toFixed(2))
    }
    return temp
}

const filterForcastCreatedAfterRequestedDate = (items: Array<ForcastItemInterface>, requestDate: Date): Array<ForcastItemInterface> => {
    const maxAllowedDateInUtc = moment(requestDate).utc()
    maxAllowedDateInUtc.set({ hour: 23, minute: 59, second: 59, millisecond: 999 })

    if (items && items.length) {
        return items.filter(item => {
            const createdDateInUtc = moment(item.created).utc()
            return createdDateInUtc <= maxAllowedDateInUtc
        })
    }

    return []
}

const sortByDate = (items: Array<ForcastItemInterface>): Array<ForcastItemInterface> => {
    return items.sort((a, b) => {
        const aDate = moment(a.created)
        const bDate = moment(b.created)
        return bDate.valueOf() - aDate.valueOf()
    })
}
