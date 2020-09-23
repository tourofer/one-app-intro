import * as uut from './weather.parser'

describe('weather item parser', () => {

    const stubResponses = {
        real_london_response: require("./call_stubs/weather_forcast_london.response.json"),
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


    // A simple helper function that will pivot the array on it's mid item [1,2,3] => [3,2,1]
    const mixResponseItems = (items) => {
        const mid = items.length / 2
        const topItem = items.slice(0, mid)
        const bottomItems = items.slice(mid + 1, items.length)

        return bottomItems.concat(topItem)
    }

    const testConsts = {
        query_date: new Date("2013-04-27"),
        items_num: 12
    }

    const testParams = {
        forcast_items_length: {
            few_items: {
                items: stubResponses.unordered_items_response,
                expected: {
                    length: 3
                }
            },
            many_items: {
                items: stubResponses.real_london_response,
                expected: {
                    lenght: 12
                }
            }
        },
        item_ordering: {
            items: mixResponseItems(stubResponses.real_london_response),
            expected: {
                expected_12_top_ids: stubResponses.real_london_response
                    .slice(0, 12)
                    .map(item => item.id)
            }
        },
        forcast_time_format: {
            items: stubResponses.real_london_response,
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
            items: [
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
            items: [
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


    const getParsedItems = (items) => uut.parseWeatherItems(items, testConsts.query_date.date, testConsts.items_num)

    describe('response items length', () => {
        it('will return an empty array if items are missing', () => {
            const parsedItems = getParsedItems(null)

            expect(parsedItems.length).toEqual(0)
        })

        it('should limit forcast items to at most 12 per day', async () => {
            const params = testParams.forcast_items_length.many_items

            const parsedItems = getParsedItems(params.items)

            expect(parsedItems.length).toEqual(params.expected.lenght)
        })

        it('should accept less then max forcast items if data is not large enough', async () => {
            const params = testParams.forcast_items_length.few_items

            const parsedItems = getParsedItems(params.items)

            expect(parsedItems.length).toEqual(params.expected.length)
        })
    })

    it('should return top items from real datasnap', async () => {
        const params = testParams.item_ordering

        const parsedItems = getParsedItems(params.items)

        const responseTop12ItemsIds = parsedItems.map(item => item.id)

        expect(responseTop12ItemsIds).toEqual(params.expected.expected_12_top_ids)
    })


    it('should parse dates to local timezone in hh:mm format', async () => {
        const params = testParams.forcast_time_format

        const parsedItems = getParsedItems(params.items)

        const hours = parsedItems.map((item) => item.created)
        expect(hours).toEqual(params.expected.hours)
    })


    it('will round temperatures to 2 digit decimal number is longer then 2 digits', async () => {
        const params = testParams.temparatureLengthParams

        const parsedItems = getParsedItems(params.items)

        expect(parsedItems[0].min_temp).toEqual(params.expected.min_temp)
        expect(parsedItems[0].max_temp).toEqual(params.expected.max_temp)
    })


    it('will ignore items created afer the requested date', async () => {
        const params = testParams.responseWithFutureItems

        const parsedItems = getParsedItems(params.items)

        const orderdIds = parsedItems.map(item => item.id)
        expect(orderdIds).toEqual(params.expected.ids)
    })

    describe('weather state icon parsing', () => {

        const createWeatherItemParams = (weatherName) => {
            return {
                query_date: testConsts.query_date,
                items: [{
                    created: "2012-04-23T22:43:17.585130Z",
                    weather_state_name: weatherName
                }]
            }
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

        function buildStubAssetsPath(asset) {
            return { testUri: `../../../src/weather/icons/${asset}` }
        }

        it('will provide icon for "Snow" state name', async () => { 
            const params = createWeatherItemParams(uut.WeatherStateNames.snow)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.snow)
        })

        it('will provide icon for "Sleet" state name', async () => {
            const params = createWeatherItemParams(uut.WeatherStateNames.sleet)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.sleet)
        })

        it('will provide icon for "Hail" state name', async () => {
            const params = createWeatherItemParams(uut.WeatherStateNames.hail)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.hail)
        })

        it('will provide icon for "Thunderstorm" state name', async () => {
            const params = createWeatherItemParams(uut.WeatherStateNames.thunderstorm)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.thunderstorm)
        })

        it('will provide icon for "Heavy Rain" state name', async () => {
            const params = createWeatherItemParams(uut.WeatherStateNames.heavy_rain)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.heavy_rain)
        })

        it('will provide icon for "Light Rain" state name', async () => {
            const params = createWeatherItemParams(uut.WeatherStateNames.light_rain)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.light_rain)
        })

        it('will provide icon for "Showers" state name', async () => {
            const params = createWeatherItemParams(uut.WeatherStateNames.showers)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.showers)
        })

        it('will provide icon for "Heavy Cloud" state name', async () => {
            const params = createWeatherItemParams(uut.WeatherStateNames.heavy_cloud)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.heavy_cloud)
        })

        it('will provide icon for "Light Cloud" state name', async () => {
            const params = createWeatherItemParams(uut.WeatherStateNames.light_cloud)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.light_cloud)
        })

        it('will provide icon for "Clear" state name', async () => {
            const params = createWeatherItemParams(uut.WeatherStateNames.clear)

            const parsedItems = getParsedItems(params.items)
            const asset = parsedItems[0].img_asset_path

            expect(asset).toEqual(expectedIconPaths.clear)
        })


    })



})