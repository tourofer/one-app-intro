import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, ActivityIndicator } from 'react-native'
import { debounce } from 'lodash'
import *  as WeatherApi from '../service/weather.api'
import * as AddCityActions from '../service/weather.actions'

export default AddCityScreen = (props) => {

    const [cityResponse, setCityResponse] = useState(null)
    const onChangeText = (async (text) => {
        //TODO how to cancel previous request?
        const cities = await  WeatherApi.fetchCityId(text)
        setCityResponse(cities)
    })

    const debounceTextChangeEvent = debounce(onChangeText, 300)

   
    renderItem = ({ item }) => {
        console.log("rendering: " + JSON.stringify(item))
        return (
            <Text onPress={() =>  AddCityActions.addCity(props.componentId, item)}>{item.name}</Text>
        )
     }

    return <View>
        <Text>Add city screen</Text>
       
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={debounceTextChangeEvent}
        />

        {cityResponse ?
            <View>
                <FlatList
                    data={cityResponse}
                    keyExtractor={citiesKeyExtractor}
                    renderItem={(item) => renderItem(item)} />
            </View>
            :
            <ActivityIndicator size="large" />
        }   

    </View>
}

citiesKeyExtractor = (city) => `${city.id}-key`;


AddCityScreen.options = {
    topBar: {
      title: {
        text: 'Search cities',
      },
    },
  };