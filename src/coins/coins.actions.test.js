
describe('Coin Actions', () => {

    let coinActions, mockStore
    const mockCoins = [
        'bitcoin',
        'test-coin'
    ]

    beforeEach(() => {
        jest.mock('./coins.store');
        mockStore = require('./coins.store').coinStore;

        mockFetchCoinList = jest.fn().mockResolvedValue(mockCoins);
        jest.mock('./api', () => ({
            getCoinList: mockFetchCoinList,
        }));

        coinActions = require('./coins.actions');
    });

    it('should fetch coin list from server', async () => {
        await coinActions.fetchCoinList(() => mockCoins)
        expect(mockStore.setCoins).toHaveBeenCalledWith(mockCoins);

    })
})
