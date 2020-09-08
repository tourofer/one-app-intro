import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/screens';
import { registerLoggerForDebug } from 'remx'

registerLoggerForDebug(console.log);
registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: 'weather.Main',
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