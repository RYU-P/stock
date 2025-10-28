import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
const SYMBOL = 'VOO'; // Change this to fetch different stocks
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function fetchStockData(symbol) {
  try {
    console.log(`📊 Fetching ${symbol}...`);
    
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message']) {
      console.error(`❌ Error: ${data['Error Message']}`);
      process.exit(1);
    }
    
    if (data['Information']) {
      console.error(`⚠️  API Limit: ${data['Information']}`);
      process.exit(1);
    }
    
    if (!data['Time Series (Daily)']) {
      console.error(`❌ No data received for ${symbol}`);
      process.exit(1);
    }
    
    // Save to JSON file
    const filename = path.join(DATA_DIR, `${symbol}.json`);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    
    const recordCount = Object.keys(data['Time Series (Daily)']).length;
    console.log(`✅ Saved ${symbol} (${recordCount} records)`);
    console.log(`📁 File: ${filename}`);
    console.log('\n✨ Done! Shutting down...');
    
    process.exit(0);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the fetcher
console.log('🚀 Starting data fetch...\n');
fetchStockData(SYMBOL);