
import * as driver from "./weather.driver"
import {e2eConsts} from '../src/weather/service/weather.api.e2e'
describe('Weather critical flows', () => {

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display city weather and go back to city list', async () => {
    await driver.when.pressOnCity(e2eConsts.first_city_id)

    const firstItem = e2eConsts.raw_weather_response[1]
    await expect(driver.get.weatherItem(firstItem.id)).toBeVisible();

    await element(by.type('_UIBackButtonContainerView')).tap();

    await expect(element(by.text("cities-list"))).toBeVisible();
  });

  it('should add a city', async () => {
    await driver.when.pressOnAddCity()
    await driver.when.typeCityQuery("fetc")
    //TODO we need to tap twice to loose the foucs
    await driver.when.tapOnFetchedCityWithId("3")
    await driver.when.tapOnFetchedCityWithId("3")

     const expectedFetchedCity =  e2eConsts.fetched_city_1
     await expect(element(by.text("Choose city:"))).toBeVisible();

    await expect(element(by.text(expectedFetchedCity.name))).toBeVisible();

  });


});
