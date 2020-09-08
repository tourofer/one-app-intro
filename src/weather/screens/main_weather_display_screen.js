import React from 'react';
import { View, Text, FlatList } from 'react-native';
import {Navigation} from 'react-native-navigation';

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

export default  MainWeather = (props) => {
    return (
        <View>
            <Text>Check</Text>
            <FlatList
                        data={countryData}
                        keyExtractor={countryKeyExtractor}
                        renderItem={(item) => renderItem(item, props.componentId)}
                    />
        </View>
        
    );
}

countryKeyExtractor = (item) => `${item.id}-key`;

renderItem = ({item, componentId}) => (
    <View>
        
        <Text  onPress={() => handleItemClick(componentId, item)}>{item.name}</Text>
    </View>
);

const handleItemClick = (componentId, item) => {
    Navigation.push(componentId, {
        component: {
          name: 'weather.cityInfo',
          passProps: {
            item,
          },
        //   options: {
        //     topBar: {
        //       title: {
        //         text: item.name,
        //       },
        //     },
        //   },
        },
      });
}