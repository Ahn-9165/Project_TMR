export type WeatherType =
  | 'Rain'
  | 'Snow'
  | 'Cold'
  | 'Hot'
  | 'Clear'
  | 'Cloudy'
  | 'Any';

export interface WeatherSnapshot {
  location: {
    lat: number;
    lng: number;
    nx: number;
    ny: number;
  };
  type: WeatherType;
  temp: number;
  humidity: number;
  feelsLike: number;
  precipitationType: string;
  source: 'KMA';
}
