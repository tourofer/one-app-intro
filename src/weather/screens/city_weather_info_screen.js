import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import * as WeatherApi from "../service/weather.api"

export default CityWeather = (props) => {
    const [response, setResponse] = useState(null)
    useEffect(() => {
        //TODO how do we handle erros?
        async function fetchData() {
            const response = await WeatherApi.fetchWeather(props.city.id, props.city.name, new Date())
            setResponse(response)
        }
        fetchData()
    }, [])

    //TODO how to do conditional renders?
    return <View>
        {response ?
            <View>
                <FlatList
                    data={response.items}
                    keyExtractor={forcastItemKeyExtractor}
                    renderItem={(item) => renderItem(item)} />
            </View>
            :
            <ActivityIndicator size="large" />
        }
    </View>
}

forcastItemKeyExtractor = (item) => `${item.id}-key`;

renderItem = ({ item }) => {
    return (
        <Text>{item.created}</Text>
    )
}


