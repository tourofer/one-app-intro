import * as uut from './add_city_screen_presenter'
import {Alert} from 'react-native'

describe('add city presenter', () => {

    it('should set cities data when response has items', async () => {

        let returnedCities = []
        let returnedShowNoItems = true

        const mockCityQueryResponse = { data: [{ name: 'city', id: '2' }] }
        const fakeSetCities = (cities) => {
            returnedCities = cities
        }
        const fakeShowNoItems = (showNoItems) => {
            returnedShowNoItems = showNoItems
        }

        uut.handleQueryResponse(mockCityQueryResponse, fakeSetCities, fakeShowNoItems)
        expect(returnedCities).toEqual(mockCityQueryResponse.data)
        expect(returnedShowNoItems).toEqual(false)
    })

    it('should show not items when response is empty', async () => {

        let returnedCities = []
        let returnedShowNoItems = true

        const mockCityQueryResponse = { data: [] }
        const fakeSetCities = (cities) => {
            returnedCities = cities
        }
        const fakeShowNoItems = (showNoItems) => {
            returnedShowNoItems = showNoItems
        }

        uut.handleQueryResponse(mockCityQueryResponse, fakeSetCities, fakeShowNoItems)
        expect(returnedCities).toEqual(mockCityQueryResponse.data)
        expect(returnedShowNoItems).toEqual(true)
    })

    it('should show an alert when there is no internet connection', async () => {
        const mockCityQueryResponse = { hasConnnection: false }
        Alert.alert = jest.fn()
       
        uut.handleQueryResponse(mockCityQueryResponse, ()=>{}, ()=>{})
        expect(Alert.alert).toBeCalledWith("no connection")
    })

    it('should show an alert when there was an error while fetching query results', async () => {
        const mockCityQueryResponse = { 
            hasConnnection: true,
            error: new TypeError("server error") }
        Alert.alert = jest.fn()
       
        uut.handleQueryResponse(mockCityQueryResponse, ()=>{}, ()=>{})
        expect(Alert.alert).toBeCalledWith("error TypeError: server error")
    })
})
