const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,

  // // below added to parse local geojson files https://stackoverflow.com/questions/65065631/cant-open-local-geojson-files-inside-vue-project
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.geojson$/,
          loader: "json-loader",
        },
      ],
    },
    plugins: [new NodePolyfillPlugin()],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    externals: {
      // Exclude Bootstrap from the standard build
      bootstrap: "bootstrap",
    },
  },
});
