import React, { useEffect } from 'react';
import { View } from 'wix-react-native-ui-lib';
import { useConnect } from 'remx'
import { weatherStore } from '../store/weather.store'
import * as weatherActions from '../service/weather.actions'
import { WeatherListItem } from './city_weather_info_screen'

export const startLoadingForcast = async (_) => {
  console.log('fetching weather dashboard data')
  return weatherActions.fetchWidgetForcast({
    id: "44418",
    name: "London"
  })
}

export default WeatherWidget = (props) => {

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