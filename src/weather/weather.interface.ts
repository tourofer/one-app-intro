export interface ForcastItemInterface {
    id: string;
    weather_state_name: string;
    wind_direction_compass: string;
    created: string;
    min_temp: number;
    max_temp: number;
    humidity: number;
    predictability: number;
}

export interface DayForcastInterface {
    city_name: string,
    date: string,
    items: Array<ForcastItemInterface>
}

 export interface City {
    id: string;
    name: string;
}
