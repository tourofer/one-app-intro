import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { View, Text, LoaderScreen, ListItem, Colors, Image, BorderRadiuses} from 'react-native-ui-lib'
import * as WeatherApi from "../service/weather.api"

export default CityWeather = (props) => {

    const [response, setResponse] = useState(null)
    useEffect(() => {
        async function fetchData() {
            const response = await WeatherApi.fetchWeather(props.city.id, props.city.name, new Date())
            setResponse(response)
        }
        fetchData()
    }, [props.city.id])

    if (response) {
        console.log("forcast data: " + JSON.stringify(response.items))
    }


    if (!response) {
        return <LoaderScreen />
    }

    return <View>
        <FlatList
            data={response.items}
            keyExtractor={forcastItemKeyExtractor}
            renderItem={renderItem} />
    </View>
}

forcastItemKeyExtractor = (item) => `${item.id}-key`;

renderItem = ({item}) => {
    return <WeatherListItem item={item}/>
}

const WeatherListItem = ({item}) => { 
    return  <ListItem
        activeBackgroundColor={Colors.purple70}
        activeOpacity={0.1}
        height={77.5}
        onPress={() => this.pushViewPostScreen(item)}
    >
        <ListItem.Part left>
            {/* <Image
                source={{ uri: item.img }}
                style={styles.image}
            /> */}
        </ListItem.Part>
        <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
            <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                <Text dark10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>{item.weather_state_name}</Text>
            </ListItem.Part>
           
        </ListItem.Part>
    </ListItem>
}

const styles = StyleSheet.create({
    image: {
      width: 54,
      height: 54,
      borderRadius: BorderRadiuses.br20,
      marginHorizontal: 14,
    },
    border: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.dark60,
    }
  });

