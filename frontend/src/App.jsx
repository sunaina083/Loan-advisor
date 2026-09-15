import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FormPage from './pages/FormPage';
import ResultsPage from './pages/ResultsPage';
import AnalystPage from './pages/AnalystPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/analyst" element={<AnalystPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;