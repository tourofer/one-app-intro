import { Navigation } from 'react-native-navigation';
import { screenRoutes } from '../module';
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
                        name: screenRoutes.add_city_route.name,
                    },
                },
            ],
        },
    });
}

function navigateToCityWeather(componentId: string, city: City) {
    Navigation.push(componentId, {
        component: {
            name: screenRoutes.city_info_route.name,
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
