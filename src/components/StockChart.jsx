import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const API_BASE_URL = 'http://localhost:5000/api';

const StockChart = () => {
  const SYMBOL = 'IBM';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  
  const [series, setSeries] = useState([{
    name: 'Stock Price',
    data: []
  }]);

  const [options] = useState({
    chart: {
      type: 'candlestick',
      height: 450,
      toolbar: { show: true }
    },
    title: {
      text: `${SYMBOL} Stock Price`,
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: 'bold'
      }
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: { enabled: true }
    }
  });

  // Transform data to ApexCharts format
  const transformData = (stockData) => {
    return stockData.map(item => ({
      x: new Date(item.date).getTime(),
      y: [item.open, item.high, item.low, item.close]
    }));
  };

  // Fetch data from backend
  const fetchData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const startDate = '2022-03-02';
      const endDate = '2022-03-08';
      
      const params = new URLSearchParams({
        startDate,
        endDate,
        forceRefresh: forceRefresh.toString()
      });
      
      const response = await fetch(`${API_BASE_URL}/stocks/${SYMBOL}?${params}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      const transformedData = transformData(result.data.data);
      setSeries([{ data: transformedData }]);
      setLastUpdated(result.data.lastUpdated);
      setFromCache(result.data.fromCache);
      
      setLoading(false);
      setRefreshing(false);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading chart data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50"
        >
          {refreshing ? 'Fetching...' : 'Try Fetching Fresh Data'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {fromCache && '💾 '}
          Last updated: {new Date(lastUpdated).toLocaleString()}
          {fromCache && ' (from cache)'}
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 transition-colors"
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh from API'}
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Chart
          options={options}
          series={series}
          type="candlestick"
          height={450}
        />
      </div>
    </div>
  );
};

export default StockChart;