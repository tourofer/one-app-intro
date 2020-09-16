describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should should display city weather', async () => {
    await expect(element(by.text('Coin List Screen'))).toBeVisible();
  });

  it('should add a city', async () => {
    await element(by.id('test-button')).tap();
    await expect(element(by.text('Coin Info Screen'))).toBeVisible();
  });


});
