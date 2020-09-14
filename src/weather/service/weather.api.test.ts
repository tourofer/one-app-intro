import { DayForcastInterface, ForcastItemInterface } from "../weather.interface"
import moment from 'moment-timezone';
import *  as uut from "./weather.api";
import {WeatherStateNames} from "./weather.api"


const stub_forcast_request = {
    city_id: "test-city-id",
    city: "Tel-aviv",
    date: new Date("2013-04-27"),
    expected_request_path: "test-city-id/2013/04/27/"
}

const stub_forcast_response = {
    city: "Tel-aviv",
    formatted_date: "27.04.2013"
}


const testConsts = {
    deafult_weather_name: "sun",
    forcast_item_count: 12,
    expected_ordered_ids: [1, 2, 3],
    expected_ids_without_future_item: [1],
    expected_parsed_temperatures: {
        min_temp: 1,
        max_temp: 2.52
    },
    expected_snapshot_filtered_items_id: [
        //12 top item ids in 'london.response.json'
        366945,
        373220,
        371006,
        363812,
        359953,
        364366,
        367069,
        362256,
        361124,
        358563,
        351889,
        357462
    ]
}

const stubResponses = {
    realDataSnapShot: require("../service/call_stubs/london.response.json"),
    unorderedServerResponseSnapshot: [
        {
            id: 3,
            created: "2012-04-23T22:43:17.585130Z",
            weather_state_name: testConsts.deafult_weather_name
        },
        {
            id: 2,
            created: "2012-04-23T22:44:17.585130Z"
            , weather_state_name: testConsts.deafult_weather_name
        },
        {
            id: 1,
            created: "2012-04-23T22:45:17.585130Z",
            weather_state_name: testConsts.deafult_weather_name
        }
    ],
    responseWithFutureItems: [
        {
            id: 9999,
            created: "9999-05-01T22:45:17.585130Z",
            weather_state_name: testConsts.deafult_weather_name
        },
        {
            id: 1,
            created: "2012-04-23T22:45:17.585130Z",
            weather_state_name: testConsts.deafult_weather_name
        }
    ],
    responseWithLongAndShortTemperatures: [
        {
            id: 9999,
            created: "2012-05-01T22:45:17.585130Z",
            min_temp: 1.0,
            max_temp: 2.5193423, 
            weather_state_name: testConsts.deafult_weather_name
        },
    ]
}



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


    describe('fetch city weather', () => {

        it('will call the correct url given a date', async () => {
            mockServerResponse = (stubResponses.realDataSnapShot)

            await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const expectedUrl = uut.base_url + "/" + stub_forcast_request.expected_request_path
            expect(global.fetch).toHaveBeenCalledTimes(1)
            expect(global.fetch).toBeCalledWith(expectedUrl)
        })

        it('will enrich response data with city name & date fields', async () => {
            mockServerResponse = (stubResponses.realDataSnapShot)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            expect(response.city_name).toEqual(stub_forcast_response.city)
            expect(response.date).toEqual(stub_forcast_response.formatted_date)
        })

        it('should limit forcast items to at most 12 per day', async () => {
            mockServerResponse = (stubResponses.realDataSnapShot)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date,
                testConsts.forcast_item_count
            )

            expect(response.items.length).toEqual(testConsts.forcast_item_count)
        })

        it('should accept less then max forcast items if data is not large enough', async () => {
            mockServerResponse = (stubResponses.unorderedServerResponseSnapshot)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date,
                testConsts.forcast_item_count
            )

            expect(response.items.length).toEqual(3)
        })

        it('should get items ordered by created date field, in desc order', async () => {
            mockServerResponse = stubResponses.unorderedServerResponseSnapshot

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const orderdIds = response.items.map(item => item.id)
            expect(orderdIds).toEqual(testConsts.expected_ordered_ids)
        })

        it('will ignore items created afer the requested date', async () => {
            mockServerResponse = stubResponses.responseWithFutureItems
            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const orderdIds = response.items.map(item => item.id)
            expect(orderdIds).toEqual(testConsts.expected_ids_without_future_item)
        })

        it('should return top items from real datasnap', async () => {
            const maxItems = 12

            const unorderedResponse = mixResponseItems(stubResponses.realDataSnapShot)
            mockServerResponse = unorderedResponse

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date,
                maxItems)

            const responseTop12ItemsIds = response.items.map(item => item.id)
            const expectedTop12ItemIds = stubResponses.realDataSnapShot
                .slice(0, maxItems)
                .map(item => item.id)

            expect(responseTop12ItemsIds).toEqual(expectedTop12ItemIds)
        })

        it('should parse dates to local timezone in hh:mm format', async () => {
            mockServerResponse = stubResponses.realDataSnapShot

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const hours = response.items.map((item) => item.created)
            expect(hours).toEqual([
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
            ])
        })

        it('will round temperatures to 2 digit decimal number is longer then 2 digits', async () => {
            mockServerResponse = stubResponses.responseWithLongAndShortTemperatures

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            expect(response.items[0].min_temp).toEqual(testConsts.expected_parsed_temperatures.min_temp)
            expect(response.items[0].max_temp).toEqual(testConsts.expected_parsed_temperatures.max_temp)
        })

        // A simple helper function that will pivot the array on it's mid item [1,2,3] => [3,2,1]
        function mixResponseItems<T>(items: Array<T>): Array<T> {
            const mid = items.length / 2
            const topItem = items.slice(0, mid)
            const bottomItems = items.slice(mid + 1, items.length)

            return bottomItems.concat(topItem)
        }
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

            const expectedUrl = uut.base_url + testConsts.expected_city_info_url
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



    describe('weather icon parser', () => {
       
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

        function buildStubAssetsPath(asset : string){
            return {testUri: `../../../src/weather/icons/${asset}`}
        }  

        it('will provide icon for "Snow" state name', async () => {
            mockServerResponse = createWeatherItemResponse(WeatherStateNames.snow)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            expect(asset).toEqual(expectedIconPaths.snow)
        })

        it('will provide icon for "Sleet" state name', async () => {
            mockServerResponse = createWeatherItemResponse(WeatherStateNames.sleet)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            expect(asset).toEqual(expectedIconPaths.sleet)
        })

        it('will provide icon for "Hail" state name', async () => {
            mockServerResponse = createWeatherItemResponse(WeatherStateNames.hail)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            expect(asset).toEqual(expectedIconPaths.hail)
        })

        it('will provide icon for "Thunderstorm" state name', async () => {
            mockServerResponse = createWeatherItemResponse(WeatherStateNames.thunderstorm)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            expect(asset).toEqual(expectedIconPaths.thunderstorm)
        })

        it('will provide icon for "Heavy Rain" state name', async () => {
            mockServerResponse = createWeatherItemResponse(WeatherStateNames.heavy_rain)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            expect(asset).toEqual(expectedIconPaths.heavy_rain)
        })

        it('will provide icon for "Light Rain" state name', async () => {
            mockServerResponse = createWeatherItemResponse(WeatherStateNames.light_rain)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            expect(asset).toEqual(expectedIconPaths.light_rain)
        })

        it('will provide icon for "Showers" state name', async () => {

            mockServerResponse = createWeatherItemResponse(WeatherStateNames.showers)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            expect(asset).toEqual(expectedIconPaths.showers)
        })

        it('will provide icon for "Heavy Cloud" state name', async () => {
            mockServerResponse = createWeatherItemResponse(WeatherStateNames.heavy_cloud)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            expect(asset).toEqual(expectedIconPaths.heavy_cloud)
        })


        it('will provide icon for "Light Cloud" state name', async () => {
            mockServerResponse = createWeatherItemResponse(WeatherStateNames.light_cloud)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            expect(asset).toEqual(expectedIconPaths.light_cloud)
        })

        it('will provide icon for "Clear" state name', async () => {
            mockServerResponse = createWeatherItemResponse(WeatherStateNames.clear)

            const response: DayForcastInterface = await uut.fetchWeather(
                stub_forcast_request.city_id,
                stub_forcast_request.city,
                stub_forcast_request.date)

            const asset = response.items[0].img_asset_path
            
            expect(asset).toEqual(expectedIconPaths.clear)
        })
    })

})

