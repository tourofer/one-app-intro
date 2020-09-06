describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display coin list', async () => {
    await expect(element(by.text('Coin List Screen'))).toBeVisible();
  });

  it('should show coin info screen after tap', async () => {
    await element(by.id('test-button')).tap();
    await expect(element(by.text('Coin Info Screen'))).toBeVisible();
  });


});
