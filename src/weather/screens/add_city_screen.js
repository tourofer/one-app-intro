import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { View, Text, TextField, ListItem, Colors } from 'react-native-ui-lib'
import {AddCityHook} from './add_city_hook'



export default AddCityScreen = (props) => {

    const {
        getOnCityItemPressed,
        onChangeText,
        showNoResults,
        cities } = AddCityHook(props)

    //  react hook testing library
    citiesKeyExtractor = (city) => `${city.id}-key`;

    renderListItem = ({ item }) => {
        return <ListItem
            bg-red70

            testID={`weatherItem-${item.id}`}
            activeBackgroundColor={Colors.purple70}
            activeOpacity={0.1}
            height={77.5}>

            <ListItem.Part containerStyle={[{ flex: 1 }]}>
                <Text flex text70 center
                    testID={`addCityItem-${item.id}`}
                    onPress={getOnCityItemPressed(item)}>{item.name}</Text>
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
            onChangeText={onChangeText}
            floatOnFocus />

        {
            showNoResults ?
                <Text flex center>No results</Text> :

                cities ?
                    <View>
                        <FlatList
                            data={cities}
                            keyExtractor={citiesKeyExtractor}
                            renderItem={renderListItem} />
                    </View>
                    : <View />
        }
    </View>
}



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