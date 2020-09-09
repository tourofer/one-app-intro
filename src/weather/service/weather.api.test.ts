import { DayForcastInterface } from "../weather.interface"
import moment from 'moment-timezone';
import *  as uut from "./weather.api";

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

        const stubResponses = {
            realDataSnapShot: require("../service/call_stubs/london.response.json"),
            unorderedServerResponseSnapshot: [
                {
                    "id": 3,
                    "created": "2012-04-23T22:43:17.585130Z"
                },
                {
                    "id": 2,
                    "created": "2012-04-23T22:44:17.585130Z"
                },
                {
                    "id": 1,
                    "created": "2012-04-23T22:45:17.585130Z"
                }
            ],
            responseWithFutureItems: [
                {
                    "id": 9999,
                    "created": "9999-05-01T22:45:17.585130Z"
                },
                {
                    id: 1,
                    "created": "2012-04-23T22:45:17.585130Z"
                }
            ]
        }

        const testConsts = {
            forcast_item_count: 12,
            expected_ordered_ids: [1, 2, 3],
            expected_ids_without_future_item: [1],
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

        it('parses item correctly', async () => {
            mockServerResponse = stubResponses.server_responses

            const response = await uut.fetchCityId("test-city")
            expect(response).toEqual(stubResponses.expected_response)
        })
    })

})

