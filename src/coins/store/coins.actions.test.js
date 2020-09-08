
describe('Coin Actions', () => {

    let coinActions, mockStore
    const mockCoins = [
        'bitcoin',
        'test-coin'
    ]

    beforeEach(() => {
        jest.mock('../store/coins.store');
        mockStore = require('../store/coins.store').coinStore;

        mockFetchCoinList = jest.fn().mockResolvedValue(mockCoins);
        jest.mock('../service/api', () => ({
            getCoinList: mockFetchCoinList,
        }));

        coinActions = require('../store/coins.actions');
    });

    it('should fetch coin list from server', async () => {
        await coinActions.fetchCoinList(() => mockCoins)
        expect(mockStore.setCoins).toHaveBeenCalledWith(mockCoins);

    })
})
