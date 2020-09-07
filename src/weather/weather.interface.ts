 interface ForcastItemInterface {
    weather_state_name: String;
    wind_direction_compass: String;
    created: String;
    min_temp: number;
    max_temp: number;
    humidity: number;
    predictability: number;
}

 interface DayForcastInterface {
    city_name: String,
    date: String,
    items: Array<ForcastItemInterface>
}

 class DayForecast implements DayForcastInterface {
    city_name: String;
    date: String;
    items: ForcastItemInterface[];

     constructor(
        city_name: String,
        date: String,
        items: ForcastItemInterface[],
    ) {
        this.city_name = city_name
        this.date = date;
        this.items = items;
    }
}

 class ForcastItem implements ForcastItemInterface {
    weather_state_name: String;
    wind_direction_compass: String;
    created: String;
    min_temp: number;
    max_temp: number;
    humidity: number;
    predictability: number;

    constructor(
        state_name: string,
        wind_direction: String,
        when: String,
        min_temp: number,
        max_temp: number,
        humidity: number,
        predictability: number
    ) {
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
