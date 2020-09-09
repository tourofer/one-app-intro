import React from 'react';
import { View, Text, FlatList } from 'react-native';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import { useConnect } from 'remx'
import { weatherStore } from '../store/weather.store';
import {Navigator} from '../weather.navigation'
export default MainWeather = (props) => {
    useNavigationButtonPress((e) => {
        if (e.buttonId === 'addCity') {
            Navigator.show_add_city_modal()
        }
    });

    const { cities } = useCountryListConnect()

    countryKeyExtractor = (item) => `${item.id}-key`;

    renderItem = ({ item }, componentId) => (
        <View>
            <Text onPress={() =>  Navigator.navigateToCityWeather(componentId, item)}>{item.name}</Text>
        </View>
    );

    return (
        <View>
            <Text>Choose city:</Text>
            <FlatList
                data={cities}
                keyExtractor={countryKeyExtractor}
                renderItem={(item) => renderItem(item, props.componentId)}
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

const useCountryListConnect = (props) => useConnect(() => ({
    cities: weatherStore.getCities()
}));

