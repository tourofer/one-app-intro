import * as uut from "./weather.icon.parser"
import {ForcastItemInterface} from "../weather.interface"




describe('weather icon parser', () => {
    //TODO move this logic to the api test with the parser used as an implementation detail
    const createFakeWeatherNameItem=(weather_name: string) : ForcastItemInterface => {
        //@ts-ignore
        return {weather_state_name: weather_name}
    }

    const testInputs = {
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
    
    const expectedIconPaths={
        snow: "../icons/snow.png",
        sleet: "../icons/sleet.png",
        hail: "../icons/hail.png",
        thunderstorm:"../icons/thunderstorm.png",
        heavy_rain: "../icons/rain.png",
        light_rain: "../icons/rain.png",
        showers: "../icons/rain.png",
        heavy_cloud: "../icons/heavy_cloud.png",
        light_cloud: "../icons/light_cloud.png",
        clear: "../icons/clear.png",
    }

     it('can parse "Snow" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.snow))
        expect(asset).toEqual(expectedIconPaths.snow)
     })

     it('can parse "Sleet" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.sleet))
        expect(asset).toEqual(expectedIconPaths.sleet)
     })

     it('can parse "Hail" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.hail))
        expect(asset).toEqual(expectedIconPaths.hail)
     })

     it('can parse "Thunderstorm" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.thunderstorm))
        expect(asset).toEqual(expectedIconPaths.thunderstorm)
     })

     it('can parse "Heavy Rain" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.heavy_rain))
        expect(asset).toEqual(expectedIconPaths.heavy_rain)
     })

     it('can parse "Light Rain" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.light_rain))
        expect(asset).toEqual(expectedIconPaths.heavy_rain)
     })

     it('can parse "Showers" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.showers))
        expect(asset).toEqual(expectedIconPaths.showers)
     })

     it('can parse "Heavy Cloud" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.heavy_cloud))
        expect(asset).toEqual(expectedIconPaths.heavy_cloud)
     })


     it('can parse "Light Cloud" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.light_cloud))
        expect(asset).toEqual(expectedIconPaths.light_cloud)
     })

     it('can parse "Clear" state name', () => {
        const asset = uut.parseIconAsset(createFakeWeatherNameItem(testInputs.clear))
        expect(asset).toEqual(expectedIconPaths.clear)
     })
})