import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a City class with name, id, and weatherData properties
class City {
  name: string;
  id: string;
  weatherData: any;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
    this.weatherData = null;
  }
}

// Complete the HistoryService class
class HistoryService {
  cities: City[]; // Declare the 'cities' property
  filePath: string; // Declare the 'filePath' property

  constructor() {
    this.cities = [];
    // Set the file path for searchHistory.json
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }

  // Read method that reads from the searchHistory.json file
  async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return []; // Return empty array if file doesn't exist or read fails
    }
  }

  // Write method that writes the updated cities array to the searchHistory.json file
  async write(cities: City[]) {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data, 'utf8');
  }

  // Save the city and weather data
  async saveCity(city: string, weatherData: any) {
    const newCity = new City(city, Date.now().toString());
    this.cities.push({ ...newCity, weatherData });
    await this.write(this.cities); // Ensure cities array is written
    return newCity;
  }

  // Get cities from the searchHistory.json file
  async getCities() {
    return await this.read();
  }

  // Add a new city to the searchHistory.json file
  async addCity(cityName: string) {
    const cities = await this.read();
    const newCity = new City(cityName, Date.now().toString()); // Create new city with a unique id
    cities.push(newCity);
    await this.write(cities);
    return newCity; // Return the new city
  }

  // BONUS: Remove a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const updatedCities = cities.filter((city: City) => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
