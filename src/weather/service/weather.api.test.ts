import { DayForcastInterface, ForcastItemInterface } from "../weather.interface"
import moment from 'moment-timezone';
import *  as uut from "./weather.api";
import { WeatherStateNames } from "./weather.api"

describe('Weather Api', () => {

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
        moment.tz.setDefault("Asia/Jerusalem")
    })

    afterAll(() => {
        global.fetch = originalFetch
    })

    describe('fetch cities list', () => {

        const fakeCity = {
            id: 1,
            name: "test_city"
        }

        const expected_city_response = [fakeCity]

        const fakeCitiesListResponse = {
            cities: [fakeCity]
        }

        it('will return cities response', async () => {
            mockServerResponse = fakeCitiesListResponse

            const cities = await uut.fetchCitiesList()
            expect(cities).toEqual(expected_city_response)
        })
    })


    describe('fetch city weather', () => {

        const test_request_params = {
            city_id: "test-city-id",
            city: "Tel-aviv",
            date: new Date("2013-04-27"),
            expected_request_path: "test-city-id/2013/04/27/"
        }

        const Consts = {
            realForcastResponseSnapshot: require("../service/call_stubs/london.response.json"),
            unorderedServerResponseSnapshot: [
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

        const testParams = {

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
            fetchWeather: {
                url: {
                    response: {
                        id: 1,
                        created: "2012-04-23T22:45:17.585130Z",
                    },
                    expected_called_url: uut.base_weather_api_url + "/" + test_request_params.expected_request_path
                },
                enrich_data: {
                    response: Consts.realForcastResponseSnapshot,
                    expected: {
                        city: "Tel-aviv",
                        formatted_date: "27.04.2013"
                    }
                }
            },
            forcast_items_length: {
                few_items: {
                    response: Consts.unorderedServerResponseSnapshot,
                    expected: {
                        length: 3
                    }
                },
                many_items: {
                    response: Consts.realForcastResponseSnapshot,
                    expected: {
                        lenght: 12
                    }
                }

            },
            item_ordering: {
                response: mixResponseItems(Consts.realForcastResponseSnapshot),
                expected: {
                    expected_12_top_ids: Consts.realForcastResponseSnapshot
                        .slice(0, 12)
                        .map(item => item.id)
                }
            },
            forcast_items_date_ordering: {
                response: Consts.unorderedServerResponseSnapshot,
                expected: {
                    ids: [1, 2, 3]
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
            forcast_time_format: {
                response: Consts.realForcastResponseSnapshot,
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
            }
        }



        async function uutFetchWeather(itemCount?: number) {
            return uut.fetchWeather(
                test_request_params.city_id,
                test_request_params.city,
                test_request_params.date,
                itemCount)
        }

        it('will call the correct url given a date', async () => {
            const params = testParams.fetchWeather.url

            mockServerResponse = params.response

            await uutFetchWeather()

            expect(global.fetch).toHaveBeenCalledTimes(1)
            expect(global.fetch).toBeCalledWith(params.expected_called_url)
        })

        it('will enrich response data with city name & date fields', async () => {
            const params = testParams.fetchWeather.enrich_data

            mockServerResponse = params.response

            const response: DayForcastInterface = await uutFetchWeather()

            expect(response.city_name).toEqual(params.expected.city)
            expect(response.date).toEqual(params.expected.formatted_date)
        })

        it('should limit forcast items to at most 12 per day', async () => {
            const params = testParams.forcast_items_length.many_items

            mockServerResponse = params.response

            const response: DayForcastInterface = await uutFetchWeather()

            expect(response.items.length).toEqual(params.expected.lenght)
        })

        it('should return top items from real datasnap', async () => {
            const params = testParams.item_ordering
            mockServerResponse = params.response

            const response: DayForcastInterface = await uutFetchWeather()
            const responseTop12ItemsIds = response.items.map(item => item.id)

            expect(responseTop12ItemsIds).toEqual(params.expected.expected_12_top_ids)
        })

        it('should parse dates to local timezone in hh:mm format', async () => {
            const params = testParams.forcast_time_format

            mockServerResponse = params.response

            const response: DayForcastInterface = await uutFetchWeather()

            const hours = response.items.map((item) => item.created)
            expect(hours).toEqual(params.expected.hours)
        })


        it('should accept less then max forcast items if data is not large enough', async () => {
            const params = testParams.forcast_items_length.few_items

            mockServerResponse = params.response

            const response: DayForcastInterface = await uutFetchWeather()

            expect(response.items.length).toEqual(params.expected.length)
        })

        it('should get items ordered by created date field, in desc order', async () => {
            const params = testParams.forcast_items_date_ordering
            mockServerResponse = params.response

            const response: DayForcastInterface = await uutFetchWeather()

            const orderdIds = response.items.map(item => item.id)
            expect(orderdIds).toEqual(params.expected.ids)
        })

        it('will ignore items created afer the requested date', async () => {
            const params = testParams.responseWithFutureItems

            mockServerResponse = params.response
            const response: DayForcastInterface = await uutFetchWeather()

            const orderdIds = response.items.map(item => item.id)
            expect(orderdIds).toEqual(params.expected.ids)
        })

        it('will round temperatures to 2 digit decimal number is longer then 2 digits', async () => {
            mockServerResponse = testParams.temparatureLengthParams.response

            const response: DayForcastInterface = await uutFetchWeather()

            expect(response.items[0].min_temp).toEqual(testParams.temparatureLengthParams.expected.min_temp)
            expect(response.items[0].max_temp).toEqual(testParams.temparatureLengthParams.expected.max_temp)
        })

        // A simple helper function that will pivot the array on it's mid item [1,2,3] => [3,2,1]
        function mixResponseItems<T>(items: Array<T>): Array<T> {
            const mid = items.length / 2
            const topItem = items.slice(0, mid)
            const bottomItems = items.slice(mid + 1, items.length)

            return bottomItems.concat(topItem)
        }


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

                const response: DayForcastInterface = await uutFetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.snow)
            })

            it('will provide icon for "Sleet" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.sleet)

                const response: DayForcastInterface = await uutFetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.sleet)
            })

            it('will provide icon for "Hail" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.hail)

                const response: DayForcastInterface = await uutFetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.hail)
            })

            it('will provide icon for "Thunderstorm" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.thunderstorm)

                const response: DayForcastInterface = await uutFetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.thunderstorm)
            })

            it('will provide icon for "Heavy Rain" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.heavy_rain)

                const response: DayForcastInterface = await uutFetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.heavy_rain)
            })

            it('will provide icon for "Light Rain" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.light_rain)

                const response: DayForcastInterface = await uutFetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.light_rain)
            })

            it('will provide icon for "Showers" state name', async () => {

                mockServerResponse = createWeatherItemResponse(WeatherStateNames.showers)
                const response: DayForcastInterface = await uutFetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.showers)
            })

            it('will provide icon for "Heavy Cloud" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.heavy_cloud)
                const response: DayForcastInterface = await uutFetchWeather()

                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.heavy_cloud)
            })


            it('will provide icon for "Light Cloud" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.light_cloud)
                const response: DayForcastInterface = await uutFetchWeather()


                const asset = response.items[0].img_asset_path
                expect(asset).toEqual(expectedIconPaths.light_cloud)
            })

            it('will provide icon for "Clear" state name', async () => {
                mockServerResponse = createWeatherItemResponse(WeatherStateNames.clear)
                const response: DayForcastInterface = await uutFetchWeather()

                const asset = response.items[0].img_asset_path

                expect(asset).toEqual(expectedIconPaths.clear)
            })
        })

    })

    describe('fetch city by id', () => {

        const testConsts = {
            request_query: "test query",
            expected_city_info_url: "/search/?query=test-city",

        }

        const stubResponses = {
            server_responses: require("../service/call_stubs/city_query.response.json"),
            expected_response: require("../service/call_stubs/city_query.expected.json")
        }

        it('will call the correct url', async () => {
            await uut.fetchCityId("test-city")

            const expectedUrl = uut.base_weather_api_url + testConsts.expected_city_info_url
            expect(global.fetch).toBeCalledTimes(1)
            expect(global.fetch).toBeCalledWith(expectedUrl)
        })

        it('parses city items correctly', async () => {
            mockServerResponse = stubResponses.server_responses

            const response = await uut.fetchCityId(testConsts.expected_city_info_url)
            expect(response.cities).toEqual(stubResponses.expected_response)
        })

        it('will include given query in response object', async () => {
            mockServerResponse = stubResponses.server_responses

            const response = await uut.fetchCityId(testConsts.request_query)
            expect(response.query).toEqual(testConsts.request_query)
        })

    })




})

