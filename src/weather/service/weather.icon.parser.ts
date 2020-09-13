import {ForcastItemInterface} from "../weather.interface"

const assetsFolder = "../icons"
export const parseIconAsset = (item : ForcastItemInterface) : string => {
    switch(item.weather_state_name) {
        case "Showers":
        case "Light Rain":
        case "Heavy Rain": return buildPath("rain")
        default: return buildPath(item.weather_state_name)
    }
}

function buildPath(name: string) {
    return`${assetsFolder}/${name.toLowerCase()}.png`.replace(/ /g, "_")
}