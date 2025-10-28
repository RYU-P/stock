for personal later use. 

just a simple daily time series stock viewer, because trading view requires money lol

USAGE

'cd backend'
'npm install'
add alphavantage API in backend/.env
modify symbol to fetch in backend/server.js
'npm run fetch'

'cd ..'
'npm install'
open /src/components/StockChart.jsx
modify the following lines to the desired Stock Symbol
'import stockData from '../../backend/data/{desired_symbol}.json';'
'const SYMBOL = '{desired_symbol}';'
back to the terminal
'npm run dev'





