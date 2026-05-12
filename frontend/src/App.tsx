import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
