require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      underscored: true,
      paranoid: true,
    },
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_TEST ,
    host: process.env.DB_HOST ,
    dialect: 'mysql',
    define: { underscored: true },
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_PRODUCTION ,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      underscored: true,
      paranoid: true,
    },
  },
};
