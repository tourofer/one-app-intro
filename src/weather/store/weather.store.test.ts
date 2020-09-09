import * as Store from "../store/weather.store"
//TODO a more elegant way to import?
const uut = Store.weatherStore;


const test_stubs = {
    city_id: "test_city_id",
    test_date: new Date("2020-01-01"),
    test_day_forcast: {
        date: "01.01.2020",
        city_name: "test_city_name",
        items: [
            { id: "1" },
            { id: "2" }
        ]
    }
}


describe('weather store', () => {

    describe('city list', () => {
        it('should have an initial local city data', () => {
            expect(uut.getCities()).toEqual(Store.localCitiesData);
          });

          it('should add a city', () => {
            const newCity = {id: "new-city-id", name: "new-city-name"}
            uut.addCity(newCity)
            expect(uut.getCities()).toEqual([...Store.localCitiesData, newCity]);
          });
    })

    describe('forcast items ', () => {
        it('should return existing results for the same day', async () => {
            const dateNowStub = jest.fn(() => new Date(test_stubs.test_date).getMilliseconds());
            global.Date.now = dateNowStub;
            //@ts-ignore
            uut.setCityWeather(test_stubs.city_id, test_stubs.test_date, test_stubs.test_day_forcast)
    
            const futureDateInSameDay = new Date(test_stubs.test_date.setHours(23))
            const cached_forcast = uut.getCityWeather(test_stubs.city_id, futureDateInSameDay)
            expect(cached_forcast).toEqual(test_stubs.test_day_forcast)
        })
    })

    


}) 