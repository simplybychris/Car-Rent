const Dotenv = require("dotenv-webpack");

module.exports = {
  devServer: {
    port: 8081,
  },
  configureWebpack: {
    plugins: [new Dotenv()],
  },
};
