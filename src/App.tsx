import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import DesignSystem from './pages/DesignSystem';
import ClaimTypeSelection from './pages/ClaimTypeSelection';
import VehicleClaimFlow from './pages/VehicleClaimFlow';
import ClaimSuccess from './pages/ClaimSuccess';
import CameraTest from './pages/CameraTest';
import MobileCameraTest from './pages/MobileCameraTest';
import ClaimReview from './pages/admin/ClaimReview';
import ClaimDetails from './pages/user/ClaimDetails';
import Login from './pages/user/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/claims/:claimNumber" element={<ClaimDetails />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/claims/:claimId" element={<ClaimReview />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/claim/type-selection" element={<ClaimTypeSelection />} />
        <Route path="/claim/vehicle/new" element={<VehicleClaimFlow />} />
        <Route path="/claim/success" element={<ClaimSuccess />} />
        <Route path="/camera-test" element={<CameraTest />} />
        <Route path="/mobile-camera-test" element={<MobileCameraTest />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;