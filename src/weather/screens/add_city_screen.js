import React, { useState } from 'react'
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { debounce } from 'lodash'
import * as AddCityActions from '../service/weather.actions'
import { View, Text, TextField, ListItem, Colors } from 'react-native-ui-lib'

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
        return <ListItem
            bg-red70
            testID={`weatherItem-${item.id}`}
            activeBackgroundColor={Colors.purple70}
            activeOpacity={0.1}
            height={77.5}>

            <ListItem.Part containerStyle={[{ flex: 1 }]}>
                <Text flex text70
                    testID={`addCityItem-${item.id}`}
                    onPress={onCityItemPressed}>{item.name}</Text>
            </ListItem.Part>
        </ListItem>


    }

    return <View flex>

        <TextField
            testID="citySearchBox"
            text70
            containerStyle={{ marginBottom: 12 }}
            floatingPlaceholder
            autoFocus={true}
            placeholder="Enter city name"
            onChangeText={debounce(onChangeText, 300)}
            floatOnFocus />


        {cityResponse ?
            <View>
                <FlatList
                    data={cityResponse}
                    keyExtractor={citiesKeyExtractor}
                    renderItem={renderListItem} />
            </View>
            :
            <View />
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