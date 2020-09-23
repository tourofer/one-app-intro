import { useCallback, useEffect, useState } from 'react'
import * as weatherActions from '../service/weather.actions'
import * as addCityPresenter from "./add_city_screen_presenter"
import debounce from 'lodash.debounce'

export const AddCityHook = (props) => {
    const [cities, setCities] = useState(null)
    const [query, setQuery] = useState("")
    const [showNoResults, setShowNoResults] = useState(false)


    //TODO review with Noam
    useEffect(() => {
        let canceled = false
        if (query === "") {
            setCities([])
            setShowNoResults(false)
            return
        }

        const fetchCities = async () => {
            const cityResponse = await weatherActions.queryCity(query)
            if (!canceled) {
                addCityPresenter.handleQueryResponse(cityResponse, setCities, setShowNoResults)
            }
        }


        fetchCities()
       // return () => (canceled = true);

    }, [query, props.componentId])

    //TODO fix tests
    const onChangeText = (async (text) => {
        if (text === "") {
            setCities([])
            return
        }
        setQuery(text)
    })

    const getOnCityItemPressed = useCallback((item) => () => weatherActions.addCity(props.componentId, item), [props.componentId])

    return {
        getOnCityItemPressed,
        onChangeText,
        showNoResults,
        cities,
    }
}