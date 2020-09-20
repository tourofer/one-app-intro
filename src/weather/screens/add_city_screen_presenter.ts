import {QueryCityResponse } from "../service/weather.actions"

export const handleQueryResponse =(response: QueryCityResponse, setCity: any, showEmptyResults: any) => {
    if (response.data) {
        setCity(response.data)
        showEmptyResults(response.data.length == 0)
    }

    if (!response.hasConnnection) {
        alert("no connection")
    } else if (response.error) {
        alert(`error ${response.error}`)
    }
}