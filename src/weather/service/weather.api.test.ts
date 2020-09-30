import moment from 'moment-timezone';
import *  as uut from "./weather.api";

describe('Weather Api', () => {

    let mockServerResponse
    let originalFetch

    beforeAll(() => {
        originalFetch = global.fetch
    })

    beforeEach(() => {
        jest.clearAllMocks();
        moment.tz.setDefault("Asia/Jerusalem")
        //@ts-ignore
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockServerResponse),
            })
        );
    })

    afterAll(() => {
        global.fetch = originalFetch
    })

    describe('fetch cities list', () => {

        const fakeCity = {
            id: 1,
            name: "test_city"
        }

        const citiedResourcePath = "/cities"
        const fakeCitiesListResponse = {
            cities: [fakeCity]
        }

        it('will call correct url', async () => {
            mockServerResponse = fakeCitiesListResponse

            await uut.fetchCitiesList()
            const expectedUrl = uut.base_app_server_url + citiedResourcePath
            expect(global.fetch).toBeCalledWith(expectedUrl)
        })
    })


    describe('fetch city weather', () => {

        const test_request_params = {
            city_id: "test-city-id",
            city: "Tel-aviv",
            date: new Date("2013-04-27"),
            expected_request_path: "test-city-id/2013/04/27/"
        }

        async function uutFetchWeather(itemCount?: number) {
            return uut.fetchWeather(
                test_request_params.city_id,
                test_request_params.date)
        }

        it('will call the correct url given a date', async () => {
            const testConsts = {
                response: {
                    id: 1,
                    created: "2012-04-23T22:45:17.585130Z",
                },
                expected_called_url: uut.base_weather_api_url + "/" + test_request_params.expected_request_path
            }


            mockServerResponse = testConsts.response
            await uutFetchWeather()

            expect(global.fetch).toHaveBeenCalledTimes(1)
            expect(global.fetch).toBeCalledWith(testConsts.expected_called_url)
        })

        describe('query cities', () => {
            const fakeCity = {
                woeid: 34,
                title: "searched"
            }

            const testConsts = {
                request_query: "sea",
                response: [fakeCity],
                expected_city_info_url: "/search/?query=test-city",
            }

            it('will call the correct url', async () => {
                mockServerResponse = testConsts.response
                await uut.queryCityByName("test-city")

                const expectedUrl = uut.base_weather_api_url + testConsts.expected_city_info_url
                expect(global.fetch).toBeCalledTimes(1)
                expect(global.fetch).toBeCalledWith(expectedUrl)
            })

            it('will call add id and name properties to responese cities', async () => {
                mockServerResponse = testConsts.response

                const queriedCitiesRespnonse = await uut.queryCityByName("test-city")
                const respnse = queriedCitiesRespnonse.data[0]

                expect(respnse.id).toEqual(fakeCity.woeid)
                expect(respnse.name).toEqual(fakeCity.title)
            })

            it('will catch errors and return it in response', async () => {
                global.fetch = jest.fn(() => {throw TypeError('error')})

                const respnse = await uut.queryCityByName("test-city")

                expect(respnse.error).toBeDefined()
            })
        })

        describe('addCity', () => {
            //TODO
            const fakeCity = {
                id: "34",
                name: "added"
            }

            const testConsts = {
                response: fakeCity,
                expected_city_info_url: '/cities',
            }


            it('will call the correct url', async () => {
                mockServerResponse = testConsts.response
                const response = await uut.addCity(fakeCity)

                const expectedUrl = uut.base_app_server_url + testConsts.expected_city_info_url 
                const expectedBody = JSON.stringify(fakeCity)

                expect(global.fetch).toBeCalledTimes(1)
                expect(global.fetch.mock.calls[0][0]).toEqual(expectedUrl)
                expect(global.fetch.mock.calls[0][1]).toMatchObject({body: expectedBody})
                expect(response).toEqual(fakeCity)
            })

        })
    })
})

