import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/screens';
import { registerLoggerForDebug } from 'remx'
import {ScreenRoutes} from './src/screens'
registerLoggerForDebug(console.log);
registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: ScreenRoutes.weather.main_route,
                            options: {
                                topBar: {
                                    title: {
                                        text: 'Weather',
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        },
    });
});