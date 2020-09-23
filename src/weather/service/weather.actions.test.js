import * as weatherParser from "./weather.parser"
import * as weatherApi from "./weather.api"
import * as uut from './weather.actions'
import {Navigation} from 'react-native-navigation'
import {weatherStore} from '../store/weather.store'

jest.mock('./weather.api')
jest.mock('./weather.parser')
jest.mock('../store/weather.store')
jest.mock('react-native-navigation')

describe('weatherActions', () => {

    describe('query city', () => {

        const testParms = {
            query: "first_c",
            response: {
                hasConnection: true,
                data: [
                    {
                        id: "first_city_id",
                        name: "first city"
                    }
                ]
            },
            expected_cities: [{ "id": "first_city_id", "name": "first city" }],
            expected_query: "first_c"
        }

        it('queries cities by name', async () => {
            weatherApi.queryCityByName.mockResolvedValue(testParms.response)

            const response = await uut.queryCity(testParms.query)

            expect(response.query).toEqual(testParms.expected_query)
            expect(response.data).toEqual(testParms.expected_cities)
            expect(response.hasConnnection).toEqual(true)
        })
    })


    describe('fetch cities list', () => {
        //TODO

        const testParams = {
            mockCities: [{ "id": "first_city_id", "name": "first city" }],
        }

        it('will set returned cities to the store', async () => {
            weatherApi.fetchCitiesList.mockResolvedValue(testParams.mockCities)

            await uut.fetchCitiesList()

            expect(weatherStore.setCityList).toBeCalledWith(testParams.mockCities)
        })

    })

    describe('addCity', () => {
        const testParams = {
            component_id:"id",
            client_city: { "id": "first_city_id", "name": "first city" },
        }

        it('will add server returned city to the store and dismiss modal', async () => {
            const server_city = ({...testParams.client_city, id: "server_change_id"})
            weatherApi.addCity.mockResolvedValue(server_city)

            await uut.addCity(testParams.component_id, testParams.client_city)

            expect(weatherStore.addCity).toBeCalledWith(server_city)
            expect(Navigation.dismissModal).toHaveBeenCalledWith(testParams.component_id);
        })
    })


    describe('fetch city weather', () => {
        const stubResponses = {
            real_london_response: require("./call_stubs/weather_forcast_london.response.json"),
        }

        const requestParams = {
            id: "city_id",
            city_name: "Tel-aviv",
            date: new Date("2013-04-27"),
        }
        const testParams = {
            parser: {
                parsed_response : [
                    {
                        id: "parsed-1",
                        name: "parsed item"
                }]
            },
            enrich: {
                response: {
                    data: stubResponses.real_london_response,
                },
                expected: {
                    city: "Tel-aviv",
                    formatted_date: "27.04.2013"
                }
            },
           
        }


        const fetchWeather = async (id, city_name, date) =>
            uut.fetchWeather(
                id ?? requestParams.id,
                city_name ?? requestParams.city_name,
                date ?? requestParams.date)



        it('will enrich response data with city name & date fields', async () => {
            const params = testParams.enrich
            weatherApi.fetchWeather.mockResolvedValue(params.response)

            const response = await fetchWeather()

            expect(response.city_name).toEqual(params.expected.city)
            expect(response.date).toEqual(params.expected.formatted_date)
        })

        it('will pass city items to parser, and append parsed items in response', async () => {
            const params = testParams.parser
            weatherParser.parseWeatherItems.mockReturnValue()
            weatherApi.fetchWeather.mockResolvedValue(params.response)

            const response = await fetchWeather()

            expect(response.data).toEqual(params.response)
        })
    })
})

