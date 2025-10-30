import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import DesignSystem from './pages/DesignSystem';
import ClaimTypeSelection from './pages/ClaimTypeSelection';
import VehicleClaimFlow from './pages/VehicleClaimFlow';
import ClaimSuccess from './pages/ClaimSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/claim/type-selection" element={<ClaimTypeSelection />} />
        <Route path="/claim/vehicle/new" element={<VehicleClaimFlow />} />
        <Route path="/claim/success" element={<ClaimSuccess />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;