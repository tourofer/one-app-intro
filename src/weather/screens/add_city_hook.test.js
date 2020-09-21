import { renderHook, act } from '@testing-library/react-hooks'
import { AddCityHook } from './add_city_hook'
import { rawQueryCitiesStub, parsedCitiesResponse } from '../service/weather.api.e2e'
let mockQueryCities



let mockServerResponse
let originalFetch
let mockStore
let Navigation

jest.mock('../store/weather.store');
mockStore = require('../store/weather.store').weatherStore;

jest.mock('react-native-navigation');
Navigation = require('react-native-navigation').Navigation;

beforeAll(() => {
    originalFetch = global.fetch
    //@ts-ignore
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockServerResponse),
        })
    );

})

beforeEach(() => {

})

afterAll(() => {
    global.fetch = originalFetch
})

test('should return city data', async () => {
    mockServerResponse = rawQueryCitiesStub
    const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

    await act(async () => {
        await result.current.onChangeText("f")
    })

    expect(result.current.cities).toEqual(parsedCitiesResponse)
    expect(result.current.showNoResults).toEqual(false)

})


test('should show no results when getting empty resopnse', async () => {
    mockServerResponse = []
    const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

    await act(async () => {
        await result.current.onChangeText("f,xfsjdhf")
    })

    expect(result.current.showNoResults).toEqual(true)
    expect(result.current.cities).toEqual([])

})

test('clicking on city item will add it to the store', async () => {
    const fakeCity = {
        id: '324',
        name: 'new_city'
    }

    mockServerResponse = fakeCity

    const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

    await act(async () => {
        await result.current.getOnCityItemPressed({ id: '1' })()
    })

    expect(mockStore.addCity).toHaveBeenCalledWith(fakeCity);
    expect(Navigation.dismissModal).toHaveBeenCalledWith("test-id");
})