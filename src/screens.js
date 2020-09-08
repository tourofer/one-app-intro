import { Navigation } from 'react-native-navigation';


export const ScreenRoutes = {
  coins: {
    coin_list_route: 'coin.List',
    coin_info_route: 'coin.Info'
  },
  weather: {
    main_route: 'weather.Main',
    city_info_route: 'weather.cityInfo'
  }
}

export function registerScreens() {
  Navigation.registerComponent(
    ScreenRoutes.coins.coin_list_route,
    () => require('./coins/screens/coin_list_screen').default,
  );
  Navigation.registerComponent(
    ScreenRoutes.coins.coin_info_route,
    () => require('./coins/screens/coin_info_screen').default,
  );
  Navigation.registerComponent(
    ScreenRoutes.weather.main_route,
    () => require("./weather/screens/main_weather_display_screen").default
  );
  Navigation.registerComponent(
    ScreenRoutes.weather.city_info_route,
    () => require("./weather/screens/city_weather_info_screen").default
  )
}
