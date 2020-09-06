import { Navigation } from 'react-native-navigation';


const coinListRoute = 'coin.List'
const coinInfoRoute = 'coin.Info'

export function registerScreens() {

  Navigation.registerComponent(
    coinListRoute,
    () => require('./coins/screens/coin_list_screen').default,
  );
  Navigation.registerComponent(
    'coin.Info',
    () => require('./coins/screens/coin_info_screen').default,
  );
}
