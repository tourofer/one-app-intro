import MockTools from 'wix-one-app-engine/lib/MockTools';

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


    //TODO is this the correct way to set this up?
    init() {
        _mockProduction()
    }

    prefix() {
        return moduleName;
    }


    _mockProduction() {
        MockTools.setLoginData({
            loginCredentials: {
                email: 'julie@example.com',
                password: '123456'
            },
            selectedBusinessId: '0cb5d2c1-eb52-433a-b7eb-c65da24b66f2'
        });
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
}