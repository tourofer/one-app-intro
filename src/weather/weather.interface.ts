 interface ForcastItemInterface {
    id: string;
    weather_state_name: string;
    wind_direction_compass: string;
    created: string;
    min_temp: number;
    max_temp: number;
    humidity: number;
    predictability: number;
}

 interface DayForcastInterface {
    city_name: string,
    date: string,
    items: Array<ForcastItemInterface>
}

 class DayForecast implements DayForcastInterface {
    city_name: string;
    date: string;
    items: ForcastItemInterface[];

     constructor(
        city_name: string,
        date: string,
        items: ForcastItemInterface[],
    ) {
        this.city_name = city_name
        this.date = date;
        this.items = items;
    }
}

 class ForcastItem implements ForcastItemInterface {
     id: string;
    weather_state_name: string;
    wind_direction_compass: string;
    created: string;
    min_temp: number;
    max_temp: number;
    humidity: number;
    predictability: number;

    constructor(
        id: string,
        state_name: string,
        wind_direction: string,
        when: string,
        min_temp: number,
        max_temp: number,
        humidity: number,
        predictability: number
    ) {
        this.id = id;
        this.weather_state_name = state_name;
        this.wind_direction_compass = wind_direction;
        this.created = when;
        this.min_temp = min_temp;
        this.max_temp = max_temp;
        this.humidity = humidity;
        this.predictability = predictability;
    }

}

export { ForcastItem, DayForecast,  DayForcastInterface,ForcastItemInterface };
