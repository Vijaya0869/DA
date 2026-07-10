const HtmlWebPackPlugin = require("html-webpack-plugin");
const os = require("os");
const path = require("path");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
const getNetworkHost = () => {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address; // Returns the local network IP (e.g., 192.168.1.x)
      }
    }
  }
  return "localhost"; // Fallback to localhost if no external IP is found
};

module.exports =(env)=> {
  // const CONTAINER_HOST = env.CONTAINER_HOST ||`http://159.203.133.182/ui`;
  // const CONTAINER_HOST = env.CONTAINER_HOST ||`https://test.dreamavenue.ai/ui`;

  const CONTAINER_HOST = env.CONTAINER_HOST || `http://localhost:3000`;

  return{
   output: {
        path: path.resolve(__dirname, "../../dist/property"),
        
      },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  devServer: {
    port: 3006,
    historyApiFallback: true,
    open: false,
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
      name: "property",
      filename: "remoteEntry.js",
      remotes: {
        container: `container@${CONTAINER_HOST}/remoteEntry.js`,
      },
      exposes: {
        "./PropertyRoutes": "./src/PropertyRoutes.tsx",
      },
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
}
};