const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const DB = process.env.DB.replace(
  '<USERNAME>:<PASSWORD>',
  `${username}:${password}`
);

// Connect to Database
mongoose
  .connect(DB)
  .then(() => console.log('MongoDB Connected 🔸 '))
  .catch(() => console.log('Database connection failed 🟥 '));

// Create server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
