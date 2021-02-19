const Dotenv = require("dotenv-webpack");

module.exports = {
  devServer: {
    port: 8082,
  },
  configureWebpack: {
    plugins: [new Dotenv()],
  },
};
