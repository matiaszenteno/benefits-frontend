import './App.css'
import { BenefitsSearch } from './components/BenefitsSearch'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>BenefitFinder</h1>
      </header>

      <main className="main-content">
        <BenefitsSearch />
      </main>
    </div>
  )
}

export default App 