import StockChart from './components/StockChart'

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <header className="bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">📈 Stock Chart Dashboard</h1>
          <p className="text-blue-100 mt-2">Real-time market data visualization</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <StockChart />
      </main>
      
      <footer className="text-center py-6 text-gray-600">
        <p>Powered by Alpha Vantage & ApexCharts</p>
      </footer>
    </div>
  )
}

export default App