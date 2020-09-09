import { Navigation } from 'react-native-navigation';
import { ScreenRoutes } from '../screens';
import { City } from './weather.interface';

export const Navigator = {
    show_add_city_modal: showAddCityModal,
    navigateToCityWeather: navigateToCityWeather
}

function showAddCityModal() {
    Navigation.showModal({
        stack: {
            children: [
                {
                    component: {
                        name: ScreenRoutes.weather.add_city_route,
                    },
                },
            ],
        },
    });
}

function navigateToCityWeather(componentId: string, city: City) {
    Navigation.push(componentId, {
        component: {
            name: ScreenRoutes.weather.city_info_route,
            passProps: {
                city: city,
            },
            options: {
                topBar: {
                    title: {
                        text: city.name,
                    },
                },
            },
        },
    });
}
