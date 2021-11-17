const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/main.ts',
  target: 'node',
  output: {
    filename: 'main.js',
    library: {
      name: "RootsDB",
      type: "umd"
    },
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        },
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false
  },
};