
import * as driver from "./weather.driver"
import {e2eConsts, itemInPosition} from '../src/weather/service/weather.api.e2e'
describe('Weather critical flows', () => {

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it.only('should display city weather', async () => {
    driver.when.pressOnCity(e2eConsts.first_city_id)

    const firstItem = itemInPosition(1)
    await expect(element(by.id(`${firstItem.id}-key`))).toBeVisible();
  });

  it('should add a city', async () => {
    await element(by.id('test-button')).tap();
    await expect(element(by.text('Coin Info Screen'))).toBeVisible();
  });


});
