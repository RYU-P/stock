📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v18 or higher)
npm (comes with Node.js)
A code editor (VS Code recommended)

You'll also need:

An Alpha Vantage API key (get one free at alphavantage.co)

🚀 Quick Start
1. Clone the Repository
bashgit clone <your-repo-url>
cd stock-chart-app
2. Install Frontend Dependencies
bashnpm install
3. Set Up Backend
bashcd backend
npm install
4. Configure Environment Variables
Create a .env file in the backend folder:
envALPHA_VANTAGE_API_KEY=your_api_key_here
PORT=5000
⚠️ Important: Replace your_api_key_here with your actual Alpha Vantage API key.
5. Run the Application
Open two terminal windows:
Terminal 1 - Backend:
bashcd backend
npm run dev
Terminal 2 - Frontend:
bash# From project root
npm run dev
6. Open Your Browser
Navigate to http://localhost:5173 (or the URL shown in your terminal)
📁 Project Structure
stock-chart-app/
├── backend/
│   ├── data/                 # JSON cache files (auto-generated)
│   │   └── IBM.json         # Example cached stock data
│   ├── .env                 # Environment variables
│   ├── server.js            # Express server
│   └── package.json         # Backend dependencies
├── src/
│   ├── App.jsx              # Main app component
│   ├── StockChart.jsx       # Chart component
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind imports
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Frontend dependencies
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── README.md                # You are here!
🎯 How It Works
Data Flow

First Request: Frontend requests stock data from backend
Cache Check: Backend checks if backend/data/{SYMBOL}.json exists
Fetch or Serve:

If cache exists and is fresh (<24h): Serve from cache ⚡
If cache is stale or missing: Fetch from Alpha Vantage API and save to cache


Display: Frontend receives data and renders the chart

Caching Strategy

Cache Duration: 24 hours
Storage Location: backend/data/ folder
Format: JSON files named by stock symbol (e.g., IBM.json)
Benefits:

Reduces API calls (stay within free tier limits)
Instant load times
Works offline after first fetch



🎨 Customization
Change Stock Symbol
Edit src/StockChart.jsx:
javascriptconst SYMBOL = 'AAPL';  // Change to any valid symbol
Adjust Date Range
Edit src/StockChart.jsx:
javascriptconst startDate = '2023-01-01';
const endDate = '2023-12-31';
Remove Date Filter
To show all available data, in src/StockChart.jsx replace:
javascriptconst params = new URLSearchParams({
  startDate,
  endDate,
  forceRefresh: forceRefresh.toString()
});
With:
javascriptconst params = new URLSearchParams({
  forceRefresh: forceRefresh.toString()
});
Modify Colors/Styling
The app uses Tailwind CSS. Edit classes in App.jsx and StockChart.jsx:
jsx// Change gradient colors
<div className="bg-gradient-to-br from-purple-50 to-pink-100">

// Change header colors
<header className="bg-gradient-to-r from-purple-600 to-pink-600">
📊 API Endpoints
Backend API
Base URL: http://localhost:5000/api
Get Stock Data
GET /stocks/:symbol?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&forceRefresh=false
Parameters:

symbol (required): Stock ticker symbol (e.g., IBM, AAPL)
startDate (optional): Filter start date
endDate (optional): Filter end date
forceRefresh (optional): Force fresh API fetch (true/false)

Response:
json{
  "success": true,
  "data": {
    "symbol": "IBM",
    "data": [...],
    "lastUpdated": "2024-10-27T12:00:00.000Z",
    "totalRecords": 5000,
    "filteredRecords": 5,
    "fromCache": true
  }
}
List Cached Symbols
GET /stocks
Returns all symbols currently cached.
Health Check
GET /health
Check if server is running.
🔧 Troubleshooting
Frontend won't start

Ensure you ran npm install in the project root
Check if port 5173 is already in use

Backend won't start

Ensure you ran npm install in the backend folder
Verify .env file exists with valid API key
Check if port 5000 is already in use

"API Limit Reached" Error

Alpha Vantage free tier allows 25 API calls per day
Wait 24 hours or upgrade your plan
Check cached data in backend/data/ folder

Chart not displaying

Open browser console (F12) to check for errors
Verify backend is running on http://localhost:5000
Check that API key is correct in backend/.env

CORS Errors

Ensure backend is running
Verify cors is installed: cd backend && npm install cors

🚢 Deployment
Frontend (Vercel/Netlify)

Update API base URL in src/StockChart.jsx:

javascriptconst API_BASE_URL = 'https://your-backend-url.com/api';

Deploy to Vercel:

bashnpm run build
vercel
Backend (Railway/Render/Heroku)

Add start script to backend/package.json:

json"scripts": {
  "start": "node server.js"
}

Set environment variables in your hosting platform
Deploy your backend
Update frontend API URL to point to deployed backend

📝 License
MIT License - feel free to use this project for personal or commercial purposes.
🤝 Contributing
Contributions, issues, and feature requests are welcome!
📧 Support
If you have any questions or need help, please open an issue on GitHub.
🙏 Acknowledgments

Alpha Vantage - Financial data API
ApexCharts - Modern charting library
Tailwind CSS - Utility-first CSS framework
Vite - Next generation frontend tooling