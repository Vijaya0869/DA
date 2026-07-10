const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
const os = require("os");
const path = require("path");
module.exports =(env)=> {
  // const CONTAINER_HOST = env.CONTAINER_HOST || `http://159.203.133.182/ui`;
  // const AUTH_HOST = env.AUTH_HOST || `http://159.203.133.182/auth`;
  // const WEB_HOST = env.WEB_HOST || `http://159.203.133.182/website`;
  // const PROPERTY_HOST = env.PROPERTY_HOST || `http://159.203.133.182/property`;

  // const CONTAINER_HOST = env.CONTAINER_HOST || `https://test.dreamavenue.ai/ui`;
  // const AUTH_HOST = env.AUTH_HOST || `https://test.dreamavenue.ai/auth`;
  // const WEB_HOST = env.WEB_HOST || `https://test.dreamavenue.ai/website`;
  // const PROPERTY_HOST = env.PROPERTY_HOST || `https://test.dreamavenue.ai/property`;



  const CONTAINER_HOST = env.CONTAINER_HOST || `http://localhost:3000`;
  const AUTH_HOST = env.AUTH_HOST || `http://localhost:3008`;
  const WEB_HOST = env.WEB_HOST || `http://localhost:3004`;
  const PROPERTY_HOST = env.PROPERTY_HOST || `http://localhost:3006`;

  
  return{
   output: {
        path: path.resolve(__dirname, "../../dist/main"),
        
      },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devServer: {
    port: 3002,
    historyApiFallback: true,
    open:true,
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
    ],
  },
 
  plugins: [ // This is important part
    new ModuleFederationPlugin({
      name: "main",
      filename: "remoteEntry.js",
      remotes: {
        container: `container@${CONTAINER_HOST}/remoteEntry.js`,
        auth: `auth@${AUTH_HOST}/remoteEntry.js`,
        property: `property@${PROPERTY_HOST}/remoteEntry.js`,

        website: `website@${WEB_HOST}/remoteEntry.js`,
      },
      exposes: {},
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
          singleton: true,
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
}
};