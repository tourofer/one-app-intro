import {QueryCityResponse } from "../service/weather.actions"

export const handleQueryResponse =(response: QueryCityResponse, setCities: any, showEmptyResults: any) => {
    console.log("hello")
    if (response.data) {
        setCities(response.data)
        showEmptyResults(response.data.length == 0)
    }

    if (!response.hasConnnection) {
        alert("no connection")
    } else if (response.error) {
        alert(`error ${response.error}`)
    }
}