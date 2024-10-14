import fs from 'fs/promises';
import path from 'path';

// Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}
}

// Complete the HistoryService class
class HistoryService {
  private filePath: string;
  deleteCity: any;
  getHistory: any;
  cities: any;

  constructor() {
    this.cities = [];
    // Set the file path for searchHistory.json
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }

  // Read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return []; // Return empty array if file doesn't exist or read fails
    }
  }

  // Write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data, 'utf8');
  }

  // Add the saveCity method
  async saveCity(city: string, weatherData: any) {
    const newCity = { city, weatherData, id: Date.now().toString() };
    this.cities.push(newCity);

    // If using a file, write to searchHistory.json
    // await fs.writeFile('path_to/searchHistory.json', JSON.stringify(this.cities, null, 2));

    return newCity;
  }



  // GetCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // AddCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(cityName, Date.now().toString()); // Create new city with unique id
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // BONUS: RemoveCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();

