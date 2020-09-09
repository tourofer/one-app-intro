import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import {Navigation} from 'react-native-navigation'
import {ScreenRoutes} from '../../screens'
import {useConnect} from 'remx'
import { weatherStore } from '../store/weather.store';

export default MainWeather = (props) => {
    countryKeyExtractor = (item) => `${item.id}-key`;

    renderItem = ({item}, componentId) => (
        <View>
            <Text onPress={() => handleItemClick(componentId, item)}>{item.name}</Text>
        </View>
    );

    const {cities} = useCountryListConnect()

    return (
        <View>
            <Button title="London" onPress={() => handleItemClick(props.componentId, countryData[0])} />
            <FlatList
                data={cities}
                keyExtractor={countryKeyExtractor}
                renderItem={(item) => renderItem(item, props.componentId)}
            />
        </View>

    );
}

const useCountryListConnect = (props) => useConnect(() => ({
    cities: weatherStore.getCities()
  })); 

handleItemClick = (componentId, item) => {
    Navigation.push(componentId, {
        component: {
            name: ScreenRoutes.weather.city_info_route,
            passProps: {
                city: item,
            },
            options: {
                topBar: {
                    title: {
                        text: item.name,
                    },
                },
            },
        },
    });
}