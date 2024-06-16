import { useState } from 'react';
import NavbarComponent from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import Stats from './components/Stats/Stats';
import BarChart from './components/BarChart/BarChart';
import './App.css';

function App() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  return (
    <div className="App">
      <NavbarComponent setActiveComponent={setActiveComponent} />
      {activeComponent === 'dashboard' ? <Dashboard /> :
        activeComponent === 'stats' ? <Stats /> :
          <BarChart />}
    </div>
  );
}

export default App;
