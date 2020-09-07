export interface ForcastItemInterface {
    state_name: String;
    wind_direction: String;
    when: String;
    min_temp: number;
    max_temp: number;
    humidity: number;
    predictability: number;
}

export interface DayForcastInterface {
    city_name: String,
    date: String,
    items: Array<ForcastItemInterface>
}

export class DayForecast implements DayForcastInterface {
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

export class ForcastItem implements ForcastItemInterface {
    state_name: String;
    wind_direction: String;
    when: String;
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
        this.state_name = state_name;
        this.wind_direction = wind_direction;
        this.when = when;
        this.min_temp = min_temp;
        this.max_temp = max_temp;
        this.humidity = humidity;
        this.predictability = predictability;
    }

}