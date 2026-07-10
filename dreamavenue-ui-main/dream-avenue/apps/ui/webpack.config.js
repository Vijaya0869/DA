const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
const Dotenv = require('dotenv-webpack');
const path = require("path");
module.exports = {
  output: {
       path: path.resolve(__dirname, "../../dist/ui"),
       
     },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      alias: {
          '@': path.resolve(__dirname, 'src/'),
        },
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    open: false
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.s?css$/,
        oneOf: [
          {
            test: /\.module\.s?css$/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: "[name]__[local]___[hash:base64:7]", // Displays the original class name along with the hash
                  },
                },
              },
              "sass-loader"
            ]
          },
          {
            use: ["style-loader", "css-loader", "postcss-loader"],
          }
        ]
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/',
            },
          },
        ],
      },
    ],
  },
  plugins: [ // This is important part
     
    new ModuleFederationPlugin({
      name: "container",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./components": "./src/components",
         
        "./arrayUtils":"./src/utils/arrayUtils",
        "./storage":"./src/utils/storageUtils",
        
        "./stringUtils":"./src/utils/stringUtils",
        './styles': './src/index.scss', 
       }
      ,
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        'react-redux': {
          singleton: true, // Ensure only one instance of react-redux
          requiredVersion: deps['react-redux'],
        },
        redux: {
          singleton: true,
          requiredVersion: deps.redux,
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};