import { renderHook, act } from '@testing-library/react-hooks'
import { AddCityHook } from './add_city_hook'

let weatherActions
let mockStore
let Navigation
let addCityPresenter

jest.mock('../store/weather.store');
jest.mock('react-native-navigation');
jest.mock('./add_city_screen_presenter')
//jest.mock("../service/weather.actions")

jest.mock("../service/weather.actions", () => {

    const generateQueryResponse = {
        query: "query",
        hasConnection: true,
        data: require('../service/weather.api.e2e').parsedCitiesResponse
    }
    let mockQueryCityResponse = jest.fn((query) => Promise.resolve(generateQueryResponse))

    return ({
        __esModule: true,
        queryCity: mockQueryCityResponse
    })
})  


describe('add_city_hook', () => {

    const parsedCitiesResponse = require('../service/weather.api.e2e').parsedCitiesResponse
    const generateQueryResponse = {
        query: "query",
        hasConnection: true,
        data: parsedCitiesResponse
    }

    beforeEach(() => {
        mockStore = require('../store/weather.store').weatherStore;
        Navigation = require('react-native-navigation').Navigation;
        addCityPresenter = require('./add_city_screen_presenter')
        weatherActions = require("../service/weather.actions")
    })


    test.only('should return city data', async () => {
         weatherActions.queryCity = jest.fn().mockResolvedValue(generateQueryResponse)

        const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

        await act(async () => {
            await result.current.onChangeText("f")
        })

        expect(weatherActions.queryCity).toHaveBeenCalled()
        expect(addCityPresenter.handleQueryResponse).toHaveBeenCalled()
    })
})


    // test('should show no results when getting empty resopnse', async () => {
    //     mockServerResponse = []
    //     const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

    //     await act(async () => {
    //         await result.current.onChangeText("f,xfsjdhf")
    //     })

    //     expect(result.current.showNoResults).toEqual(true)
    //     expect(result.current.cities).toEqual([])

    // })

    // test('clicking on city item will add it to the store', async () => {
    //     const fakeCity = {
    //         id: '324',
    //         name: 'new_city'
    //     }

    //     mockServerResponse = fakeCity

    //     const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

    //     await act(async () => {
    //         await result.current.getOnCityItemPressed({ id: '1' })()
    //     })

    //     expect(mockStore.addCity).toHaveBeenCalledWith(fakeCity);
    //     expect(Navigation.dismissModal).toHaveBeenCalledWith("test-id");
    // })

    // // test('', () => {


    // //     await act(async () => {
    // //         result.current.onChangeText('a')
    // //         result.current.onChangeText('b')
    // //         promise1.resolve()
    // //         promise2.resolve()
    // //     })
    // // })

