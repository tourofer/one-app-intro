
import * as driver from "./weather.driver"
import {e2eConsts} from '../src/weather/service/weather.api.e2e'
describe('Weather critical flows', () => {

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it.only('should display city weather', async () => {
    await expect(element(by.text("Weather"))).toBeVisible();
    await driver.when.pressOnCity(e2eConsts.first_city_id)

    const firstItem = e2eConsts.raw_weather_response[1]
    await expect(driver.get.weatherItem(firstItem.id)).toBeVisible();
  });

  // it('should add a city', async () => {
  //   await element(by.id('test-button')).tap();
  //   await expect(element(by.text('Coin Info Screen'))).toBeVisible();
  // });


});
