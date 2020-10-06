import React, { useEffect } from 'react';
import { View } from 'wix-react-native-ui-lib';
import { useConnect } from 'remx'
import { weatherStore } from '../store/weather.store'
import * as weatherActions from '../service/weather.actions'
import { WeatherListItem } from './city_weather_info_screen'

export const startLoadingForcast = async (_) => {
  return weatherActions.fetchWidgetForcast({
    id: "44418",
    name: "London"
  })
}

export default WeatherWidget = (props) => {


  //TODO remove once startLoadingForcast will be called from  module.js
  useEffect(() => {
    startLoadingForcast()
  }, [])

  const useForcastDataConnect = () => useConnect(() => ({
    forcast: weatherStore.getWidgetForcast()
  }))

  const { forcast } = useForcastDataConnect()

  console.log("rendering WeatherWidget ", forcast)

  if (forcast != null ) {
    return  <WeatherListItem item={forcast.items[0]} />
  } else {
    return <View />
  }
}