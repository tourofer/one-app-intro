import React, { useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { useConnect } from 'remx'
import { weatherStore } from '../store/weather.store';
import { Navigator } from '../weather.navigation'
import { View, Text, ListItem, Colors } from 'react-native-ui-lib'
import * as WeatherActions from '../service/weather.actions'

export default MainWeather = (props) => {

    const useCountryListConnect = () => useConnect(() => ({
        cities: weatherStore.getCities()
    }));

    useEffect(() => {
        WeatherActions.fetchCitiesList()
    }, [])

    const handleNavigationButtonPress = useCallback(() => {
        Navigator.show_add_city_modal()
    }, [])

    useNavigationButtonPress(handleNavigationButtonPress, props.componentId, 'addCity');

    const { cities } = useCountryListConnect()

    countryKeyExtractor = (item) => `${item.id}-key`;

    renderItem = ({ item }) => {
        const onCityItemPressed = () => Navigator.navigateToCityWeather(props.componentId, item)

        return (
            <ListItem
                testID={`cityItem-${item.id}`}
                activeBackgroundColor={Colors.purple70}
                activeOpacity={0.1}
                height={77.5}
                onPress={onCityItemPressed} >
                <ListItem.Part>
                    <Text dark10 text60 style={{ marginLeft: 10 }}>{item.name}</Text>
                </ListItem.Part>
            </ListItem>
        );
    }

    return (
        <View>
            <Text dark10 text80 style={{ marginLeft: 8, marginTop: 8 }}>Choose city:</Text>
            <FlatList
                testID="cities-list"
                data={cities}
                keyExtractor={countryKeyExtractor}
                renderItem={renderItem}
            />
        </View>
    );
}
MainWeather.options = {
    topBar: {
        rightButtons: [
            {
                id: 'addCity',
                testID: 'add-city-btn',
                text: '+',
            },
        ],
    },
};