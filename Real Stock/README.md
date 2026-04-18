# Stock Market Dashboard

A full-stack MERN application for tracking and analyzing Indian stock market data with real-time updates and interactive charts.

## Features

- **Real-time Stock Data**: Live NSE stock prices using Finnhub API
- **Interactive Dashboard**: Modern fintech UI with stock cards and heatmaps
- **Personal Watchlist**: Save and track favorite stocks
- **Stock Comparison**: Side-by-side analysis of two stocks
- **Interactive Charts**: Price history with multiple timeframes (1D, 1W, 1M, 6M, 1Y)
- **User Authentication**: Secure login/register system
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on all devices
- **AI Stock Analysis**: Generated insights based on price movements

## Technology Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Chart.js for interactive charts
- Axios for API calls
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Finnhub API integration
- Rate limiting and CORS

## Project Structure

```
stock-market-dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── ...
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # External services
│   ├── middleware/        # Custom middleware
│   └── package.json
└── package.json           # Root package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Compass installed locally
- Finnhub API key (free tier available)

### 1. Clone and Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
npm run install:client

# Install server dependencies
npm run install:server
```

### 2. Database Setup
1. Install MongoDB Compass from https://www.mongodb.com/products/compass
2. Start MongoDB locally (usually runs on localhost:27017)
3. The database will be created automatically when you run the server

### 3. Environment Configuration
Create a `.env` file in the `server` directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/stockdash

# JWT Secret (change this in production)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Finnhub API Key (get from https://finnhub.io)
FINNHUB_API_KEY=your_finnhub_api_key_here

# Server Configuration
NODE_ENV=development
PORT=5000
```

### 4. Get Finnhub API Key
1. Visit https://finnhub.io/register
2. Create a free account
3. Copy your API key from the dashboard
4. Add it to your `.env` file

### 5. Start the Application
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
# npm run client   # Frontend only (https://api.voarion.in)
# npm run server   # Backend only (https://api.voarion.in)
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: https://api.voarion.in

## API Endpoints

### Stocks
- `GET /api/stocks/search?q=RELIANCE` - Search stocks
- `GET /api/stocks/:symbol` - Get stock quote
- `GET /api/stocks/:symbol/history?period=1M` - Get historical data

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Watchlist (Protected Routes)
- `GET /api/watchlist/me` - Get user's watchlist
- `POST /api/watchlist` - Add stock to watchlist
- `DELETE /api/watchlist/:symbol` - Remove from watchlist

## Sample NSE Stocks

The application includes these popular NSE stocks:
- RELIANCE.NS (Reliance Industries)
- TCS.NS (Tata Consultancy Services)
- INFY.NS (Infosys)
- HDFCBANK.NS (HDFC Bank)
- ICICIBANK.NS (ICICI Bank)
- ITC.NS (ITC Limited)
- SBIN.NS (State Bank of India)
- LT.NS (Larsen & Toubro)
- WIPRO.NS (Wipro)
- BAJFINANCE.NS (Bajaj Finance)

## Features Walkthrough

### 1. Dashboard
- View popular stocks with real-time prices
- See top gainers and losers
- Interactive Nifty50 heatmap with color-coded performance
- Search functionality for any NSE stock

### 2. Stock Details
- Comprehensive stock information
- Interactive price charts with multiple timeframes
- AI-generated stock analysis
- Add/remove stocks from watchlist

### 3. Watchlist
- Personal portfolio tracking
- Real-time price updates
- Quick access to detailed stock views
- Portfolio statistics (gainers/losers count)

### 4. Compare Stocks
- Side-by-side stock comparison
- Performance metrics and charts
- Popular comparison suggestions

### 5. User Authentication
- Secure registration and login
- JWT-based authentication
- Protected routes and personalized features

## Development Notes

### Fallback Data
The application includes sample data that activates when the Finnhub API is unavailable, ensuring the demo works even without an API key.

### Responsive Design
The UI is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

### Error Handling
Comprehensive error handling for:
- API failures
- Network issues
- Authentication errors
- Invalid stock symbols

## Production Deployment

### Environment Variables
Update these for production:
- Change `JWT_SECRET` to a secure random string
- Set `NODE_ENV=production`
- Update `MONGODB_URI` for production database
- Ensure `FINNHUB_API_KEY` is set

### Build Process
```bash
# Build client for production
cd client && npm run build

# Start production server
cd server && npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the API documentation
2. Verify environment variables
3. Ensure MongoDB is running
4. Check browser console for errors

## Future Enhancements

- Real-time WebSocket updates
- Technical indicators
- Portfolio performance tracking
- News integration
- Mobile app version
- Advanced charting tools