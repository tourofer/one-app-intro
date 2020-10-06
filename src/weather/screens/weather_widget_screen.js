import React, {useEffect} from 'react';
import { View, Text } from 'wix-react-native-ui-lib';
import { useConnect } from 'remx'
import { weatherStore } from '../store/weather.store'
import * as weatherActions from '../service/weather.actions'


export const startLoadingForcast = async () => {

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

  const forcastData = () => useConnect(() => {
    console.log('store forcast: ', weatherStore.getWidgetForcast())
    return weatherStore.getWidgetForcast()
  })

  console.log("rendering WeatherWidget ", forcastData)

  return (
    <View center bg-yellow40>
      <Text>Hello</Text>
      {/* <Text>Got data: + {useForcastConnect ?? JSON.stringify(useForcastConnect)}</Text> */}
    </View>
  )
}