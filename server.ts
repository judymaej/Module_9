import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// Import the routes
import routes from './src/routes';  // Adjust this based on your folder structure

const app = express();
const PORT = process.env.PORT || 3001;

// Get current directory for serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files of the entire client dist folder
app.use(express.static(path.join(__dirname, 'client', 'dist'))); // Adjust this path if needed

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));


