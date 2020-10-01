import { Assets } from 'wix-react-native-ui-lib';

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
                description: 'Weather Widget'
            }
        ]
    }

    managerApps() {
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
}