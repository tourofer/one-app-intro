import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import * as Api from '../service/weather.api'

export default CityWeather = (props) => {
    const [response, setResponse] = useState(null)
    useEffect(() => {
        async function fetchData() {
            console.log(`requesting: id: ${JSON.stringify(props.city)}`)
            const response = await Api.fetchWeather(props.city.id, props.city.name, new Date())
            setResponse(response)
        }
        fetchData()
    }, [])

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
        <Text>{JSON.stringify(item)}</Text>
    )
}
