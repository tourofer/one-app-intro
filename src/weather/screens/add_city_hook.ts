import React, { useCallback, useState } from 'react'
import * as AddCityActions from '../service/weather.actions'
import * as AddCityPresenter from "./add_city_screen_presenter"


export const AddCityHook = (props) => {
    let query
    const [cities, setCities] = useState(null)
    //const [query, setQuery] = useState("")
    const [showNoResults, setShowNoResults] = useState(false)

    const onChangeText = (async (text) => {        
        if (text === "") {
            setCities([])
            return
        }
        query = (text)
        try {
            const cityResponse = await AddCityActions.queryCity(text)

            if (cityResponse.query === query) {
                AddCityPresenter.handleQueryResponse(cityResponse, setCities, setShowNoResults)
            }
        } catch (e) {
            console.log(e)
        }
    })

    const getOnCityItemPressed = useCallback((item) => () => AddCityActions.addCity(props.componentId, item), [props.componentId])

    return {
        getOnCityItemPressed,
        onChangeText,
        showNoResults,
        cities,
    }
}