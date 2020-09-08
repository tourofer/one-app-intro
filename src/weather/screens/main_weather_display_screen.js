import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import {Navigation} from 'react-native-navigation'

const countryData = [
    {
        id: 44418,
        name: "London"
    },
    {
        id: 2487956,
        name: "San Francisco"
    }
]

export default MainWeather = (props) => {

    countryKeyExtractor = (item) => `${item.id}-key`;

    renderItem = ({ item, componentId }) => (
        <View>
            <Text onPress={() => handleItemClick(componentId, item)}>{item.name}</Text>
        </View>
    );
    return (
        <View>
            <Button title="London" onPress={() => handleItemClick(props.componentId, countryData[0])} />
            <FlatList
                data={countryData}
                keyExtractor={countryKeyExtractor}
                renderItem={(item) => renderItem(item, props.componentId)}
            />
        </View>

    );
}



handleItemClick = (componentId, item) => {
    Navigation.push(componentId, {
        component: {
            name: 'weather.cityInfo',
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