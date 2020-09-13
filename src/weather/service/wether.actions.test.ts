let uut


const  test_args= {
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

describe('weatherActions', () => {
    let mockCitiesResponse


    function setupFetchCityResponse(mock: any, mock_second?: any) {
        //TODO SUPPORT MULTIPLE ITEMS
        if (mock_second) {
            jest.mock('./weather.api', () => ({
                fetchCityId: jest.fn()
                    .mockResolvedValue(mock)
                    .mockResolvedValue(mock_second),
            }));
        } else {
            jest.mock('./weather.api', () => ({
                fetchCityId: jest.fn().mockResolvedValue(mock),
            }));
        }


        uut = require("./weather.actions")
    }

    it('fetch city list from api', async () => {
        setupFetchCityResponse(test_responses.first_city_response)

        const response = await uut.queryCity(test_args.first_city_qeury)

        expect(response).toEqual(test_responses.first_city_response.cities)
    })

    it('will ignore response if query does not match', async () => {
        setupFetchCityResponse(test_responses.second_city_response, test_responses.first_city_response)

        await uut.queryCity(test_args.first_city_qeury)
        const response = await uut.queryCity(test_args.second_city_qeury)

        //TODO HOW TO TEST AND IMPLEMENT THIS BEHAVIOUR


    })

})