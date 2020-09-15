import { exp } from "react-native-reanimated";

let uut


const test_args = {
    first_city_qeury: "first cit",
    second_city_qeury: "second cit",
}

const test_responses = {
    first_city_response: {
        query: test_args.first_city_qeury,
        cities: [
            {
                id: "first_response_id",
                name: "first response"
            }]
    },
    second_city_response: {
        query: test_args.second_city_qeury,
        cities: [
            {
                id: "second_responde_id",
                name: "second_ response"
            }]
    }
}

jest.mock('./weather.api');

describe('weatherActions', () => {

    let uut
    let weatherApi

    beforeEach(() => {
        uut = require("./weather.actions")
        weatherApi = require("./weather.api")
    })

    function setupFetchCityResponse(mock: any, mock_second?: any) {
        if (mock_second) {
            weatherApi.fetchCityId = jest.fn()
                .mockResolvedValue(mock)
                .mockResolvedValue(mock_second)
        } else {
            weatherApi.fetchCityId = jest.fn()
                .mockResolvedValue(mock)
        }
    }

    it('fetch city list from api', async () => {
        setupFetchCityResponse(test_responses.first_city_response)

        const response = await uut.queryCity(test_args.first_city_qeury)

        expect(response.cities).toEqual(test_responses.first_city_response.cities)
        expect(response.query).toEqual(test_args.first_city_qeury)

    })

})