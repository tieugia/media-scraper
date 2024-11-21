import { Sequelize } from 'sequelize';
import path from 'path';
import { env } from 'process';

require("dotenv").config({
  path: path.resolve(__dirname, "../../../config/.env"),
});
const sequelize = new Sequelize(env.DATABASE_NAME!, env.DATABASE_USER!, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT),
  dialect: 'mssql',
  dialectOptions: {
    server: env.DATABASE_HOST,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
})();

export { sequelize };
