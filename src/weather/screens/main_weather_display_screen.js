import React from 'react';
import { FlatList } from 'react-native';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { useConnect } from 'remx'
import { weatherStore } from '../store/weather.store';
import { Navigator } from '../weather.navigation'
import { View, Text, ListItem, Colors } from 'react-native-ui-lib'

export default MainWeather = (props) => {
    useNavigationButtonPress((e) => {
        if (e.buttonId === 'addCity') {
            Navigator.show_add_city_modal()
        }
    }, props.componentId);

    const { cities } = useCountryListConnect()

    countryKeyExtractor = (item) => `${item.id}-key`;

    renderItem = ({ item }, componentId) => (
            <ListItem
                activeBackgroundColor={Colors.purple70}
                activeOpacity={0.1}
                height={77.5}
                onPress={() => Navigator.navigateToCityWeather(componentId, item)} >
                <ListItem.Part>
                    <Text dark10 text60 style={{marginLeft: 10}}>{item.name}</Text>
                </ListItem.Part>
            </ListItem>
        );

    return (
        <View>
            <Text dark10 text80 style={{marginLeft:8,  marginTop: 8}}>Choose city:</Text>
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

