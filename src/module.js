
const moduleName = 'one-app-weather-example'

const screenRoutes = {
    main_route: {
        name: moduleName + '.weather.Main',
        generator: () => require("./weather/screens/main_weather_display_screen").default
    },
    city_info_route: {
        name: moduleName + '.weather.cityInfo',
        generator: () => require("./weather/screens/city_weather_info_screen").default
    },
    add_city_route: {
        name: moduleName + '.weather.cityAdd',
        generator: () => require("./weather/screens/add_city_screen").default
    },
    weather_dashboard_widget_route: {
        name: moduleName + '.weather.dashboard_widget',
        generator: () => require("./weather/screens/weather_widget_screen").default
    }
}

export default class WeatherModule {

    prefix() {
        return moduleName;
    }

    components() {
        return [
            {
                id: screenRoutes.main_route.name,
                generator: screenRoutes.main_route.generator,
                description: 'Weather City list'
            }, 
            {
                id: screenRoutes.city_info_route.name,
                generator: screenRoutes.city_info_route.generator,
                description: 'City Weather Screen'
            }, 
            {
                id: screenRoutes.add_city_route.name,
                generator: screenRoutes.add_city_route.generator,
                description: 'Add city weather'
            },
            {
                id: screenRoutes.weather_dashboard_widget_route.name,
                generator: screenRoutes.weather_dashboard_widget_route.generator,
                description: 'Weather Dashboard Widget'
            },
            
        ]
    }

    managerApps() {
        const {Assets} = require('wix-react-native-ui-lib');

        return [
            {
                id: 'oferManagerAppId',
                label: 'Weather app',
                icon: Assets.icons.general.challenges,
                dashboardIcon: Assets.icons.apps.challenges,
                dashboardLargeIcon: Assets.icons.apps.challenges,
                description: 'Weather app',
                screenId: screenRoutes.main_route.name
            },
        ];
    }

    quickActions() {
        const {Assets} = require('wix-react-native-ui-lib');
      
        return [{
          id: 'add-weather-quick_action',
          label: 'Click Here to Reach Weather Screen',
          icon: Assets.icons.general.arrowRight,
          screenId: screenRoutes.weather_dashboard_widget_route.name,
          testID: 'add-post-quick_action',
        },];
      }
}