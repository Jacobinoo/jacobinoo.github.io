import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop.tsx';
import { Home } from './pages/Home.tsx';
import { NotFound } from "./pages/NotFound.tsx";
import { QuartzDriveCaseStudy } from "./pages/QuartzDriveCaseStudy.tsx";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quartz-drive-case-study" element={<QuartzDriveCaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
