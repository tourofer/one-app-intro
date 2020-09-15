import React, { useState } from 'react'
import { TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { debounce } from 'lodash'
import * as AddCityActions from '../service/weather.actions'
import { View, Text } from 'react-native-ui-lib'

export default AddCityScreen = (props) => {

    let lastQuery  

    const [cityResponse, setCityResponse] = useState(null)
    const onChangeText = (async (text) => {
        if (text === "") {
            return 
        }
        lastQuery = text
        try {
            const cityResponse = await AddCityActions.queryCity(text)
            if (cityResponse.query === lastQuery) {
                setCityResponse(cityResponse.cities)
            }
        } catch (e) {
            console.log(e)
        }
    })


    renderListItem = ({ item }) => {
        const onCityItemPressed = () => AddCityActions.addCity(props.componentId, item)
        return (
            <Text onPress={onCityItemPressed}>{item.name}</Text>
        )
    }

    return <View>
        <TextInput style={styles.searchBar}
            placeholder="Enter city name"
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

const styles = StyleSheet.create({
    searchBar: {
        fontSize: 24,
        margin: 10,
        width: '90%',
        height: 50,
        backgroundColor: 'white',
    },
});