import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect } from 'react';

export default function ClaimSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get claim number from state (preferred) or URL params (fallback)
  const claimNumber = location.state?.claimNumber || searchParams.get('claimNumber');

  useEffect(() => {
    // Redirect if no claim data
    if (!claimNumber) {
      console.warn('No claim number found, redirecting to dashboard');
      navigate('/user/dashboard');
    }
  }, [claimNumber, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-6">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim Submitted!</h1>
          <p className="text-gray-600">Your claim has been successfully submitted and is being processed.</p>
        </div>

        {/* Claim Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Claim Number:</span>
              <span className="font-semibold text-gray-900">{claimNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending Review
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Time:</span>
              <span className="text-gray-900">24-48 hours</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Our team will review your claim within 24-48 hours</li>
            <li>• You'll receive SMS and email updates on your claim status</li>
            <li>• Additional documents may be requested if needed</li>
            <li>• Payment will be processed upon approval</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/user/dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            className="w-full"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          A confirmation has been sent to your registered email and phone number.
        </p>
      </div>
    </div>
  );
}
