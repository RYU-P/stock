import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

// Import JSON data directly
import stockData from '../../backend/data/NVDA.json';

const StockChart = ({startDate, endDate}) => {
  const SYMBOL = 'NDVA';
  
  const [series, setSeries] = useState([{
    name: 'Stock Price',
    data: []
  }]);

  const [options] = useState({
    chart: {
      type: 'candlestick',
      height: 450,
      id: 'stock-price',
      group: 'stock-charts',
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

  const [volumeSeries, setVolumeSeries] = useState([{
    name: 'Volume',
    data: []
  }]);

  const [volumeOptions] = useState({
    chart: {
      type: 'bar',
      height: 250,
      group: 'stock-charts',
      toolbar: { show: false }
    },
    title: {
      text: `${SYMBOL} Trading Volume`,
      align: 'left',
      style: {
        fontSize: '16px',
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
    const timeSeries = stockData["Time Series (Daily)"];
    
    if (!timeSeries) {
      console.error('No time series data found');
      return;
    }

    const chartData = Object.entries(timeSeries).map(([date, values]) => ({
      x: new Date(date).getTime(),
      y: [
        parseFloat(values["1. open"]),
        parseFloat(values["2. high"]),
        parseFloat(values["3. low"]),
        parseFloat(values["4. close"])
      ]
    }));

    const volumeData = Object.entries(timeSeries).map(([date, values]) => ({
      x: new Date(date).getTime(),
      y: parseFloat(values["5. volume"])
    }));

    chartData.reverse();
    volumeData.reverse();

    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();
    
    const filteredData = chartData.filter(item => 
      item.x >= startDateTime && item.x <= endDateTime
    );

    const filteredVolumeData = volumeData.filter(item => 
      item.x >= startDateTime && item.x <= endDateTime
    );

    setSeries([{ data: filteredData }]);
    setVolumeSeries([{ data: filteredVolumeData }]);
  }, [startDate, endDate]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Chart
          options={options}
          series={series}
          type="candlestick"
          height={450}
        />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Chart
          options={volumeOptions}
          series={volumeSeries}
          type="bar"
          height={250}
        />
      </div>
    </div>
  );
};

export default StockChart;