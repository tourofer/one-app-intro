import React, {useEffect, useState} from 'react';
import { View, Text, FlatList } from 'react-native';
import { PropTypes } from 'prop-types'
import * as Api from '../service/weather.api'
export default CityWeather = (props) => {
    const [response, setResponse] = useState(null)
    useEffect(()=>{
        async function fetchData() {
            console.log(`requesting: id: ${JSON.stringify(props.city)}`)
            const response = await Api.fetchWeather(props.city.id, props.city.name, new Date("2020-09-08"))
            setResponse(response)
        }
        fetchData()
    }, [])

    return <View>
      <Text>{JSON.stringify(response)}</Text>
    </View>
}

CityWeather.propTypes = {
    componentId: PropTypes.string,
    city: PropTypes.object,
}