import {QueryCityResponse } from "../service/weather.actions"
import { Alert } from 'react-native';

export const handleQueryResponse = (response: QueryCityResponse, setCities: any, showEmptyResults: any) => {
    if (response.data) {
        setCities(response.data)
        showEmptyResults(response.data.length == 0)
    }
    else if (!response.hasConnnection) {
        Alert.alert("no connection")
    } else if (response.error) {
        Alert.alert(`error ${response.error}`)
    }
}