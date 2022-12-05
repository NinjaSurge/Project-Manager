// General Imports
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Styling
import './Scss/App.scss';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Help from './pages/Help';

function App() {
  return (
    <Router>
      <Navbar />
      <div class="page">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/home"
            element={<Navigate to="/" />}
          />
          <Route
            path="/help"
            element={<Help />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
