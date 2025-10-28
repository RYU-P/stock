import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json());

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Get file path for a symbol
function getFilePath(symbol) {
  return path.join(DATA_DIR, `${symbol.toUpperCase()}.json`);
}

// Check if cached data exists and is recent
async function getCachedData(symbol) {
  try {
    const filePath = getFilePath(symbol);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const cached = JSON.parse(fileContent);
    
    // Check if data is less than 24 hours old
    const lastUpdate = new Date(cached.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate < 24) {
      console.log(`✅ Using cached data for ${symbol} (${hoursSinceUpdate.toFixed(1)}h old)`);
      return cached;
    }
    
    console.log(`⏰ Cached data for ${symbol} is stale (${hoursSinceUpdate.toFixed(1)}h old)`);
    return null;
  } catch (error) {
    console.log(`📁 No cache found for ${symbol}`);
    return null;
  }
}

// Save data to JSON file
async function saveToCache(symbol, data) {
  const filePath = getFilePath(symbol);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`💾 Saved ${data.data.length} records for ${symbol} to cache`);
}

// Fetch from Alpha Vantage
async function fetchFromAlphaVantage(symbol) {
  console.log(`📊 Fetching fresh data for ${symbol} from Alpha Vantage...`);
  
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  const timeSeries = data["Time Series (Daily)"];
  
  if (!timeSeries) {
    if (data["Error Message"]) {
      throw new Error(`API Error: ${data["Error Message"]}`);
    }
    if (data["Information"]) {
      throw new Error(`API Limit: ${data["Information"]}`);
    }
    throw new Error("Unknown error fetching data");
  }

  // Transform the data
  const stockData = Object.entries(timeSeries).map(([date, values]) => ({
    date,
    open: parseFloat(values["1. open"]),
    high: parseFloat(values["2. high"]),
    low: parseFloat(values["3. low"]),
    close: parseFloat(values["4. close"]),
    volume: parseInt(values["5. volume"])
  }));

  const cacheData = {
    symbol: symbol.toUpperCase(),
    data: stockData,
    lastUpdated: new Date().toISOString(),
    recordCount: stockData.length
  };

  await saveToCache(symbol, cacheData);
  
  return cacheData;
}

// API Routes

// Get stock data (from cache or fetch if needed)
app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { startDate, endDate, forceRefresh } = req.query;
    
    let stockData;
    
    if (forceRefresh === 'true') {
      stockData = await fetchFromAlphaVantage(symbol);
    } else {
      stockData = await getCachedData(symbol);
      
      if (!stockData) {
        stockData = await fetchFromAlphaVantage(symbol);
      }
    }
    
    // Filter by date range if provided
    let filteredData = stockData.data;
    if (startDate || endDate) {
      filteredData = stockData.data.filter(item => {
        const itemDate = new Date(item.date);
        const isAfterStart = !startDate || itemDate >= new Date(startDate);
        const isBeforeEnd = !endDate || itemDate <= new Date(endDate);
        return isAfterStart && isBeforeEnd;
      });
    }
    
    res.json({
      success: true,
      data: {
        symbol: stockData.symbol,
        data: filteredData,
        lastUpdated: stockData.lastUpdated,
        totalRecords: stockData.recordCount,
        filteredRecords: filteredData.length,
        fromCache: forceRefresh !== 'true'
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List all cached symbols
app.get('/api/stocks', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const stocks = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
        const data = JSON.parse(content);
        return {
          symbol: data.symbol,
          lastUpdated: data.lastUpdated,
          recordCount: data.recordCount
        };
      })
    );
    
    res.json({
      success: true,
      stocks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date(),
    cacheDir: DATA_DIR
  });
});

// Start server
await ensureDataDir();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Cache directory: ${DATA_DIR}`);
});