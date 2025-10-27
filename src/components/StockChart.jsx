import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

// Transform Alpha Vantage data to ApexCharts format
function transformData(data) {
    const timeSeries = data["Time Series (Daily)"];
    if (!timeSeries) {
        console.error("Error: 'Time Series (Daily)' not found in data.", data);
        if (data["Error Message"]) {
            throw new Error(`API Error: ${data["Error Message"]}`);
        }
        if (data["Information"]) {
             throw new Error(`API Limit: ${data["Information"]}`);
        }
        throw new Error("Unknown error fetching data.");
    }

    const apexChartData = Object.entries(timeSeries).map(([date, values]) => {
        return {
            x: new Date(date).getTime(),
            y: [
                parseFloat(values["1. open"]),
                parseFloat(values["2. high"]),
                parseFloat(values["3. low"]),
                parseFloat(values["4. close"])
            ]
        };
    });

    return apexChartData.reverse();
}

const StockChart = () => {
    // ⚠️ REPLACE WITH YOUR API KEY
    const API_KEY = 'YOUR_API_KEY';
    const SYMBOL = 'IBM';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [series, setSeries] = useState([{
        name: 'Stock Price',
        data: []
    }]);

    const [options] = useState({
        chart: {
            type: 'candlestick',
            height: 450,
            toolbar: {
                show: true
            }
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
            tooltip: {
                enabled: true
            }
        },
        noData: {
            text: 'Loading...'
        }
    });

    useEffect(() => {
        const fetchStockData = async () => {
            const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${SYMBOL}&outputsize=full&apikey=${API_KEY}`;
            
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                const allSeriesData = transformData(data);

                // Filter data for specific date range
                const startDate = new Date('2022-03-02').getTime();
                const endDate = new Date('2022-03-08').getTime();

                const filteredData = allSeriesData.filter(item => {
                    return item.x >= startDate && item.x <= endDate;
                });
                
                setSeries([{ data: filteredData }]);
                setLoading(false);

            } catch (err) {
                console.error("Failed to fetch or transform data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStockData();
    }, [SYMBOL, API_KEY]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg text-gray-600">Loading your chart, please wait...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Error: </strong>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <Chart
                options={options}
                series={series}
                type="candlestick"
                height={450}
            />
        </div>
    );
};

export default StockChart;