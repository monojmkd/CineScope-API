const axios = require("axios");
require("dotenv").config();

if (!process.env.API_KEY) {
  console.error("Movie API KEY is missing in .env file");
}

const axiosInstance = axios.create({
  baseURL: process.env.MICROSERVICE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.API_KEY,
  },
});

module.exports = axiosInstance;
