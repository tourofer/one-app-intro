import { DayForcastInterface, ForcastItemInterface } from "../weather.interface";
import * as uut from './weather.actions'
import { WeatherStateNames } from "./weather.api"




// const test_args = {
//     first_city_qeury: "first cit",
//     second_city_qeury: "second cit",
// }



describe('weatherActions', () => {

    let mockServerResponse
    let originalFetch


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
        jest.clearAllMocks();
    })

    afterAll(() => {
        global.fetch = originalFetch
    })

    function setupFetchCityResponse(mock: any) {
        mockServerResponse = mock
    }
    describe('query city', () => {

        const testParms = {
            query: "first_c",
            response: [
                {
                    woeid: "first_city_id",
                    title: "first city"
                }],
            expected: {
                query: "first_c",
                cities: [{ "id": "first_city_id", "name": "first city" }]
            }
        }

        it('fetch city list from api', async () => {
            setupFetchCityResponse(testParms.response)

            const response = await uut.queryCity(testParms.query)

            expect(response).toEqual(testParms.expected)

        })
    })



    describe('fetch city weather', () => {
        const stubResponses = {
            real_london_response: require("../service/call_stubs/london.response.json"),
            unordered_items_response: [
                {
                    id: 3,
                    created: "2012-04-23T22:43:17.585130Z",
                },
                {
                    id: 2,
                    created: "2012-04-23T22:44:17.585130Z"
                },
                {
                    id: 1,
                    created: "2012-04-23T22:45:17.585130Z",
                }
            ],
        }

        const requestParams = {
            id: "city_id",
            city_name: "Tel-aviv",
            date: new Date("2013-04-27"),
        }
        const testParams = {

            enrich: {
                response: stubResponses.real_london_response,
                expected: {
                    city: "Tel-aviv",
                    formatted_date: "27.04.2013"
                }
            },
            forcast_items_length: {
                few_items: {
                    response: stubResponses.unordered_items_response,
                    expected: {
                        length: 3
                    }
                },
                many_items: {
                    response: stubResponses.real_london_response,
                    expected: {
                        lenght: 12
                    }
                }
            },
            item_ordering: {
                unordered_response: mixResponseItems(stubResponses.real_london_response),
                expected: {
                    expected_12_top_ids: stubResponses.real_london_response
                        .slice(0, 12)
                        .map(item => item.id)
                }
            },
            forcast_time_format: {
                response: stubResponses.real_london_response,
                expected: {
                    hours: [
                        "01:52",
                        "23:52",
                        "21:52",
                        "19:52",
                        "17:52",
                        "15:52",
                        "13:52",
                        "11:52",
                        "09:52",
                        "07:52",
                        "05:52",
                        "03:52",
                    ]
                }
            },
            temparatureLengthParams: {
                response: [
                    {
                        id: 9999,
                        created: "2012-05-01T22:45:17.585130Z",
                        min_temp: 1.0,
                        max_temp: 2.5193423,
                    },
                ],
                expected: {
                    min_temp: 1,
                    max_temp: 2.52
                },
            },
            responseWithFutureItems: {
                response: [
                    {
                        id: 9999,
                        created: "9999-05-01T22:45:17.585130Z",
                    },
                    {
                        id: 1,
                        created: "2012-04-23T22:45:17.585130Z",
                    }
                ],
                expected: {
                    ids: [1]
                }
            },
        }

        // A simple helper function that will pivot the array on it's mid item [1,2,3] => [3,2,1]
        function mixResponseItems<T>(items: Array<T>): Array<T> {
            const mid = items.length / 2
            const topItem = items.slice(0, mid)
            const bottomItems = items.slice(mid + 1, items.length)

            return bottomItems.concat(topItem)
        }


        const fetchWeather = async (id?: string, city_name?: string, date?: Date) =>
            uut.fetchWeather(
                id ?? requestParams.id,
                city_name ?? requestParams.city_name,
                date ?? requestParams.date)



        it('will enrich response data with city name & date fields', async () => {
            const params = testParams.enrich
            mockServerResponse = params.response

            const response: DayForcastInterface = await fetchWeather()

            expect(response.city_name).toEqual(params.expected.city)
            expect(response.date).toEqual(params.expected.formatted_date)
        })


        it('should limit forcast items to at most 12 per day', async () => {
            const params = testParams.forcast_items_length.many_items

            mockServerResponse = params.response

            const response: DayForcastInterface = await fetchWeather()

            expect(response.items.length).toEqual(params.expected.lenght)
        })

        it('should accept less then max forcast items if data is not large enough', async () => {
            const params = testParams.forcast_items_length.few_items

            mockServerResponse = params.response

            const response: DayForcastInterface = await fetchWeather()

            expect(response.items.length).toEqual(params.expected.length)
        })


        it('should return top items from real datasnap', async () => {
            const params = testParams.item_ordering
            mockServerResponse = params.unordered_response

            const response: DayForcastInterface = await fetchWeather()
            const responseTop12ItemsIds = response.items.map(item => item.id)

            expect(responseTop12ItemsIds).toEqual(params.expected.expected_12_top_ids)
        })


        it('should parse dates to local timezone in hh:mm format', async () => {
            const params = testParams.forcast_time_format

            mockServerResponse = params.response

            const response: DayForcastInterface = await fetchWeather()

            const hours = response.items.map((item) => item.created)
            expect(hours).toEqual(params.expected.hours)
        })

        it('will round temperatures to 2 digit decimal number is longer then 2 digits', async () => {
            const params = testParams.temparatureLengthParams

            mockServerResponse = params.response

            const response: DayForcastInterface = await fetchWeather()

            expect(response.items[0].min_temp).toEqual(params.expected.min_temp)
            expect(response.items[0].max_temp).toEqual(params.expected.max_temp)
        })

        it('will ignore items created afer the requested date', async () => {
            const params = testParams.responseWithFutureItems

            mockServerResponse = params.response
            const response: DayForcastInterface = await fetchWeather()

            const orderdIds = response.items.map(item => item.id)
            expect(orderdIds).toEqual(params.expected.ids)
        })

        describe('weather state icon parsing', () => {

            const createWeatherItemResponse = (weatherName: string): Array<ForcastItemInterface> => {
                //@ts-ignore   
                return [{
                    created: "2012-04-23T22:43:17.585130Z",
                    weather_state_name: weatherName
                }]
            }

            const expectedIconPaths = {
                snow: buildStubAssetsPath("snow.png"),
                sleet: buildStubAssetsPath("sleet.png"),
                hail: buildStubAssetsPath("hail.png"),
                thunderstorm: buildStubAssetsPath("thunderstorm.png"),
                heavy_rain: buildStubAssetsPath("rain.png"),
                light_rain: buildStubAssetsPath("rain.png"),
                showers: buildStubAssetsPath("rain.png"),
                heavy_cloud: buildStubAssetsPath("heavy_cloud.png"),
                light_cloud: buildStubAssetsPath("light_cloud.png"),
                clear: buildStubAssetsPath("clear.png"),
            }

            function buildStubAssetsPath(asset: string) {
                return { testUri: `../../../src/weather/icons/${asset}` }
            }

            it('will provide icon for "Snow" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.snow)

                const response: DayForcastInterface = await fetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.snow)
            })

            it('will provide icon for "Sleet" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.sleet)

                const response: DayForcastInterface = await fetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.sleet)
            })

            it('will provide icon for "Hail" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.hail)

                const response: DayForcastInterface = await fetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.hail)
            })

            it('will provide icon for "Thunderstorm" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.thunderstorm)

                const response: DayForcastInterface = await fetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.thunderstorm)
            })

            it('will provide icon for "Heavy Rain" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.heavy_rain)

                const response: DayForcastInterface = await fetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.heavy_rain)
            })

            it('will provide icon for "Light Rain" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.light_rain)

                const response: DayForcastInterface = await fetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.light_rain)
            })

            it('will provide icon for "Showers" state name', async () => {

                mockServerResponse = createWeatherItemResponse(WeatherStateNames.showers)
                const response: DayForcastInterface = await fetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.showers)
            })

            it('will provide icon for "Heavy Cloud" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.heavy_cloud)
                const response: DayForcastInterface = await fetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.heavy_cloud)
            })


            it('will provide icon for "Light Cloud" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.light_cloud)
                const response: DayForcastInterface = await fetchWeather()


                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.light_cloud)
            })

            it('will provide icon for "Clear" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.clear)
                const response: DayForcastInterface = await fetchWeather()

                const asset = response.items[0].img_asset_path

                expect(asset).toEqual(expectedIconPaths.clear)
            })
        })

    })
})

