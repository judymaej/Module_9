import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public temperature: number,
    public description: string,
    public windSpeed: number,
    public humidity: number
  ) {}
}

// Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private city: string = '';

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
  }

  // Fetch the location data for a given city
  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0];
  }

  // Destructure the location data to get coordinates
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // Build the weather query with coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Fetch and destructure the location data
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.city);
    return this.destructureLocationData(locationData);
  }

  // Fetch weather data for given coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Parse the current weather response into a Weather object
  private parseCurrentWeather(response: any): Weather {
    const { name, main, weather, wind } = response;
    return new Weather(
      name,
      main.temp,
      weather[0].description,
      wind.speed,
      main.humidity
    );
  }

  // Build an array for the weather forecast (dummy method for future implementation)
  private buildForecastArray(currentWeather: Weather): Weather[] {
    return [currentWeather]; // Returning only current weather for now
  }

  // Get weather data for a specific city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather);
  }
}

export default new WeatherService();
