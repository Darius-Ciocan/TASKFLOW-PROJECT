const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requiredVariables = ["PORT"];

requiredVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`La variable de entorno ${variable} no esta definida`);
  }
});

const config = {
  port: Number(process.env.PORT),
  corsOrigin: process.env.CORS_ORIGIN || "*",
};

if (Number.isNaN(config.port) || config.port <= 0) {
  throw new Error("El puerto debe ser un numero positivo");
}

module.exports = config;
