import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  entry: [path.resolve(__dirname) + '/app/scripts/index.js', path.resolve(__dirname) + '/app/styles/main.css'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app', 'dist'),
    clean: true
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 20000
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()]
  }
}
