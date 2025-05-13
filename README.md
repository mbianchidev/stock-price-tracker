# Stock Price Tracker

A TypeScript web application that allows users to check real-time stock prices and basic information. The app is simple, user-friendly, and provides accurate data.

## Features

- **Stock Symbol Search**: Enter a stock symbol to retrieve real-time data.
- **Stock Price Display**: Shows current price, change amount, and percent change.
- **Basic Company Information**: Displays company details alongside price data.
- **Real-time API Integration**: Connects to Alpha Vantage API for accurate market data.

## Technologies Used

- TypeScript
- HTML5
- CSS3
- Parcel Bundler
- Alpha Vantage API

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd stock-price-tracker
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:1234`

## API Integration

This application uses the Alpha Vantage API ([docs](https://www.alphavantage.co/documentation)) to fetch real-time stock data. The current implementation uses a demo API key for testing purposes. For production use, you should replace it with your own API key.

To get your own API key:
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free API key
3. Replace the `API_KEY` constant in `app.ts` with your key

## Design

The application follows a clean, professional design with:
- Inter font (sans-serif) for optimal readability
- Blue as the primary color (professional, trustworthy)
- Green/red accents for positive/negative price changes
- Responsive layout that works on both desktop and mobile devices

## Future Enhancements

- Company name and logo integration
- Historical price data and charts
- Watchlist functionality to track multiple stocks
- More detailed company information and news

## Deployment

This project is set up with GitHub Actions to automatically deploy to GitHub Pages when changes are pushed to the main branch. The deployed version will be available at `https://<your-username>.github.io/stock-price-tracker/`.

To manually deploy:

1. Build the project:
   ```
   npm run build
   ```

2. The built files will be in the `dist` directory, which you can deploy to any static hosting service.

## License

See the [LICENSE](LICENSE) file for details.