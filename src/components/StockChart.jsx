import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

// Import JSON data directly
import stockData from '../../backend/data/NVDA.json';

const StockChart = () => {
  const SYMBOL = 'NDVA';
  
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

  useEffect(() => {
    // Transform the imported JSON data
    const timeSeries = stockData["Time Series (Daily)"];
    
    if (!timeSeries) {
      console.error('No time series data found');
      return;
    }

    // Convert to ApexCharts format
    const chartData = Object.entries(timeSeries).map(([date, values]) => ({
      x: new Date(date).getTime(),
      y: [
        parseFloat(values["1. open"]),
        parseFloat(values["2. high"]),
        parseFloat(values["3. low"]),
        parseFloat(values["4. close"])
      ]
    }));

    // Reverse to show oldest to newest
    chartData.reverse();

    // Optional: Filter by date range
    const startDate = new Date('2018-12-01').getTime();
    const endDate = new Date('2022-06-14').getTime();
    
    const filteredData = chartData.filter(item => 
      item.x >= startDate && item.x <= endDate
    );

    setSeries([{ data: filteredData }]);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          📁 Data loaded from JSON file
        </div>
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