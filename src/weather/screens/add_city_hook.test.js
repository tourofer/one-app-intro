import { renderHook, act } from '@testing-library/react-hooks';
import { AddCityHook } from './add_city_hook';
import * as weatherActions from '../service/weather.actions';
import * as addCityPresenter from './add_city_screen_presenter';

// let mockStore
// let Navigation
// jest.mock('../store/weather.store');
// jest.mock('react-native-navigation');
jest.mock('./add_city_screen_presenter')
jest.mock("../service/weather.actions")



describe('add_city_hook', () => {

    const parsedCitiesResponse = require('../service/weather.api.e2e').parsedCitiesResponse
    const generateQueryResponse = {
        query: "query",
        hasConnection: true,
        data: parsedCitiesResponse
    }



    test('should return city data', async () => {
        weatherActions.queryCity.mockResolvedValue(generateQueryResponse)

        const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

        await act(async () => {
            await result.current.onChangeText("f")
        })

        const data = generateQueryResponse.data;
        expect(weatherActions.queryCity).toHaveBeenCalledWith("f")
        expect(addCityPresenter.handleQueryResponse).toHaveBeenCalledWith(generateQueryResponse, expect.anything(), expect.anything())
        //TODO  would be nice go get objectContaining working
        // expect.objectContaining(generateQueryResponse))

    })

    test('will not call api on empty query', () => {
        const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

        act(() => {
            result.current.onChangeText("")
        })
       
        expect(result.current.cities).toEqual([])
        expect(result.current.showNoResults).toEqual(false)
    })

    test('will not return resopnses for previous query', async () => {
        const fakePromises = {
            first: new Promise(resolve =>  setTimeout(resolve({ data: ['a'] }), 300)),
            second: new Promise(resolve => setTimeout(resolve({ data: ['b'] }),  100)),
        }

        const queries = {
            first: 'a',
            second: 'b'
        }

        weatherActions.queryCity
            .mockImplementation((query => query === queries.first ? fakePromises.first : fakePromises.second))

        const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

        act(() => {
            result.current.onChangeText(queries.first)
            result.current.onChangeText(queries.second)
        })

        await fakePromises.second
        await fakePromises.first


        expect(addCityPresenter.handleQueryResponse).toHaveBeenCalledWith({ data: ['b'] }, expect.anything(), expect.anything())
    })

    test('clicking on city item will add it to the store', async () => {
        const { result } = renderHook(() => AddCityHook({ componentId: "test-id" }))

        await act(async () => {
            await result.current.getOnCityItemPressed({ id: '1' })()
        })

        expect(weatherActions.addCity).toHaveBeenCalledWith("test-id", { id: '1' });
    })
})


