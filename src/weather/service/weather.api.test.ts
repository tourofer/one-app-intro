import * as Api from "./weather.api"
import { DayForcastInterface} from "../weather.interface"

describe('Weather Api', () => {

    const stub_forcast_request = {
        city_id: "test-city-id",
        city: "Tel-aviv",
        date: new Date("2013-04-27")
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
        expected_fetch_url : "https://www.metaweather.com/api/location/test-city-id/2013/04/27/",
        //taken from london.response.json
        expect_snapshot_filtered_items_id: [
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

    function mockResponse(item) {
        //@ts-ignore
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(item),
            })
        );
    }

    
    it('will call the correct url given a date', async () => {
        mockResponse(stubResponses.realDataSnapShot)

        await Api.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date)

        expect(global.fetch).toBeCalledWith(testConsts.expected_fetch_url)
    })

    it('will enrich response data with city name & date fields', async () => {
        mockResponse(stubResponses.realDataSnapShot)

        const response: DayForcastInterface = await Api.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date)

        expect(response.city_name).toEqual(stub_forcast_response.city)
        expect(response.date).toEqual(stub_forcast_response.formatted_date)
    })

    it('should limit forcast items to 12 per day', async () => {
        mockResponse(stubResponses.realDataSnapShot)

        const response: DayForcastInterface = await Api.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date,
            testConsts.forcast_item_count
        )

        expect(response.items.length).toEqual(testConsts.forcast_item_count)
    })

    it('should get items ordered by created date field, in desc order', async () => {
        mockResponse(stubResponses.unorderedServerResponseSnapshot)

        const response: DayForcastInterface = await Api.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date)

        const orderdIds = response.items.map(item => item.id)
        expect(orderdIds).toEqual(testConsts.expected_ordered_ids)
    })

    it('will ignore items created afer the requested date', async () => {
        mockResponse(stubResponses.responseWithFutureItems)
        const response: DayForcastInterface = await Api.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date)

        const orderdIds = response.items.map(item => item.id)
        expect(orderdIds).toEqual(testConsts.expected_ids_without_future_item)
    })

    it('should parse dates to nice display hours', async () => {
        mockResponse(stubResponses.realDataSnapShot)

        const response: DayForcastInterface = await Api.fetchWeather(
            stub_forcast_request.city_id,
            stub_forcast_request.city,
            stub_forcast_request.date)

        const hours = response.items.map((item) => item.created)
        const ids = response.items.map(item => item.id)

        expect(ids).toEqual(testConsts.expect_snapshot_filtered_items_id)
        expect(hours).toEqual([
            '22:52', '20:52',
            '18:52', '16:52',
            '14:52', '12:52',
            '10:52', '08:52',
            '06:52', '04:52',
            '02:52', '00:52'
        ])
    })
})
