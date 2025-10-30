import StockChart from './components/StockChart'

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <StockChart startDate="09/27/2025" endDate="10/27/2025"/>
      </main>
    </div>
  )
}

export default App