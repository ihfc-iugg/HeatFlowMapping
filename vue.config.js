const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = defineConfig({
  transpileDependencies: true,

  // // below added to parse local geojson files https://stackoverflow.com/questions/65065631/cant-open-local-geojson-files-inside-vue-project
  configureWebpack: {
    externals: {
      // property name is how the module is imported inside the vue app (e.g. import { newPlot } from "plotly.js-dist";)
      // value plotly will be used to retrieve a global plotly variable, as the default external library type is var
      // https://webpack.js.org/configuration/externals/
      "plotly.js-dist": "plotly",
      "bootstrap/dist/js/bootstrap.js": "bootstrap",
    },
    module: {
      rules: [
        {
          test: /\.geojson$/,
          loader: "json-loader",
        },
      ],
    },
    plugins: [
      new NodePolyfillPlugin(),
      new BundleAnalyzerPlugin({ generateStatsFile: true }),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    resolve: {
      modules: ["node_modules"],
      extensions: [".js"],
    },
  },
});
