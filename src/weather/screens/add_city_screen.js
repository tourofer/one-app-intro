import React, {useCallback} from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { View, Text, TextField, ListItem, Colors } from 'react-native-ui-lib'
import { AddCityHook } from './add_city_hook'
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import {Navigation} from 'react-native-navigation'
import { Assets } from 'wix-react-native-ui-lib';


export default AddCityScreen = (props) => {

    const {
        getOnCityItemPressed,
        onChangeText,
        showNoResults,
        cities } = AddCityHook(props)

    const handleNavigationButtonPress = useCallback(() => {
        Navigation.dismissModal(props.componentId);
    }, [props.componentId])

    useNavigationButtonPress(handleNavigationButtonPress, props.componentId, 'cancelBtn');

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
            text: 'Search cities - 1',
        },
        leftButtons: [{
            id: 'cancelBtn',
            icon: Assets.icons.x
        }]
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