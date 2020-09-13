import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, ActivityIndicator } from 'react-native'
import { debounce } from 'lodash'
import *  as WeatherApi from '../service/weather.api'
import * as AddCityActions from '../service/weather.actions'

export default AddCityScreen = (props) => {

    const [cityResponse, setCityResponse] = useState(null)
    const onChangeText = (async (text) => {
        try {
            console.log("fetching cities for: " + text)
            const cities =  await AddCityActions.queryCity(text)
            console.log("got fetch cities : " + cities)
            setCityResponse(cities)
        } catch(e) {
            console.log(e)
        }
    })


    renderListItem = ({item} ) => {
        const onCityItemPressed = () => AddCityActions.addCity(props.componentId, item)
        console.log("rendering: " + JSON.stringify(item))
        return (
            <Text onPress={onCityItemPressed}>{item.name}</Text>
        )
     }

    return <View>
        <Text>Add city screen</Text>
       
        <TextInput
            onChangeText={debounce(onChangeText, 300)}
        />

        {cityResponse ?
            <View>
                <FlatList
                    data={cityResponse}
                    keyExtractor={citiesKeyExtractor}
                    renderItem={renderListItem} />
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