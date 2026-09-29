import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home.tsx';
import {NotFound} from "./pages/NotFound.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
