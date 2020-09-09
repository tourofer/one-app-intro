import * as uut from "./weather.api"
import { DayForcastInterface } from "../weather.interface"
import moment from 'moment-timezone';

describe('Weather Api', () => {

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
        realDataSnapShot: require("./london.response.json"),
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



    let mockedWeatherForcastResponse
    let originalFetch

    beforeAll(() => {
        originalFetch = global.fetch
        //@ts-ignore
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockedWeatherForcastResponse),
            })
        );
    })

    beforeEach(() => {
        jest.clearAllMocks();
        moment.tz.setDefault()
    })

    afterAll(() => {
        global.fetch = originalFetch
    })

    it('will call the correct url given a date', async () => {
        mockedWeatherForcastResponse = (stubResponses.realDataSnapShot)

        await uut.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date)

        const expectedUrl = uut.base_url + "/" + stub_forcast_request.expected_request_path
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toBeCalledWith(expectedUrl)
    })

    it('will enrich response data with city name & date fields', async () => {
        mockedWeatherForcastResponse = (stubResponses.realDataSnapShot)

        const response: DayForcastInterface = await uut.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date)

        expect(response.city_name).toEqual(stub_forcast_response.city)
        expect(response.date).toEqual(stub_forcast_response.formatted_date)
    })

    it('should limit forcast items to at most 12 per day', async () => {
        mockedWeatherForcastResponse = (stubResponses.realDataSnapShot)

        const response: DayForcastInterface = await uut.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date,
            testConsts.forcast_item_count
        )

        expect(response.items.length).toEqual(testConsts.forcast_item_count)
    })

    it('should accept less then max forcast items if data is not large enough', async () => {
        mockedWeatherForcastResponse = (stubResponses.unorderedServerResponseSnapshot)

        const response: DayForcastInterface = await uut.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date,
            testConsts.forcast_item_count
        )

        expect(response.items.length).toEqual(3)
    })

    it('should get items ordered by created date field, in desc order', async () => {
        mockedWeatherForcastResponse = stubResponses.unorderedServerResponseSnapshot

        const response: DayForcastInterface = await uut.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date)

        const orderdIds = response.items.map(item => item.id)
        expect(orderdIds).toEqual(testConsts.expected_ordered_ids)
    })

    it('will ignore items created afer the requested date', async () => {
        mockedWeatherForcastResponse = stubResponses.responseWithFutureItems
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
        mockedWeatherForcastResponse = unorderedResponse

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
        mockedWeatherForcastResponse = stubResponses.realDataSnapShot

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
})


// A simple helper function that will pivot the array on it's mid item [1,2,3] => [3,2,1]
function mixResponseItems<T>(items: Array<T>): Array<T> {
    const mid = items.length / 2
    const topItem = items.slice(0, mid)
    const bottomItems = items.slice(mid + 1, items.length)

    return bottomItems.concat(topItem)
}
