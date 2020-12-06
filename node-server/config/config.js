require('dotenv').config();

module.exports = {
  development: {
    port: process.env.MYSQL_PORT || '3306',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      underscored: true,
      paranoid: true,
    },
    logging: false,
  },

  test: {
    port: process.env.MYSQL_PORT || '3306',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_TEST,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: { underscored: true },
    logging: false,
  },
  production: {
    port: process.env.MYSQL_PORT || '3306',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_PRODUCTION,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      underscored: true,
      paranoid: true,
    },
  },
};
