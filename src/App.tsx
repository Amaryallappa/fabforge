import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import QuotePage from './pages/QuotePage';
import MaterialsPage from './pages/MaterialsPage';
import CapabilitiesPage from './pages/CapabilitiesPage';
import AuthPage from './pages/AuthPage';
import TrackOrder from './pages/TrackOrder';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/capabilities" element={<CapabilitiesPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/track/:orderId" element={<TrackOrder />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
