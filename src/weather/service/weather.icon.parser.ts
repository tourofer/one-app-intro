import { ForcastItemInterface } from "../weather.interface"
import { WeatherStateNames } from "./weather.api"

const Images = {
    weatherState: {
        snow_icon:require('../icons/snow.png'),
        sleet_icon:require('../icons/sleet.png'),
        hail_icon: require('../icons/hail.png'),
        thunderstorm_icon: require('../icons/thunderstorm.png'),
        rain_icon:require('../icons/rain.png'),
        light_cloud_icon: require('../icons/light_cloud.png'),
        heavy_cloud_icon: require('../icons/heavy_cloud.png'),
        clear_icon: require('../icons/clear.png'),
    }
}

export const parseIconAsset = (item: ForcastItemInterface) => {
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
