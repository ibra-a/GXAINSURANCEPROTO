import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Car, User, Phone, Mail, MapPin, 
  FileText, Camera, Shield, Clock, CheckCircle, XCircle,
  AlertCircle, Download, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { claimsService, type Claim } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export default function ClaimReview() {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadClaim();
  }, [claimId]);

  const loadClaim = async () => {
    if (!claimId) return;
    
    try {
      const { data, error } = await claimsService.getClaimByNumber(claimId);
      if (error || !data) {
        console.error('Error fetching claim:', error);
        return;
      }
      setClaim(data);
      setAdminNotes(data.admin_notes || '');
    } catch (error) {
      console.error('Error loading claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    if (!claim) return;
    
    setUpdating(true);
    try {
      await claimsService.updateClaimStatus(claim.claim_number, newStatus, adminNotes);
      await loadClaim();
      // Show success message
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Claim not found</h2>
          <Button onClick={() => navigate('/admin/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': 
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: Clock
        };
      case 'approved': 
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: CheckCircle
        };
      case 'rejected': 
        return {
          bg: 'bg-gradient-to-r from-red-50 to-pink-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: XCircle
        };
      default: 
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: AlertCircle
        };
    }
  };

  const statusStyles = getStatusStyles(claim.status);
  const StatusIcon = statusStyles.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Claim Review</h1>
                <p className="text-blue-100">{claim.claim_number}</p>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border",
              statusStyles.bg,
              statusStyles.border
            )}>
              <StatusIcon className={cn("h-5 w-5", statusStyles.text)} />
              <span className={cn("font-medium capitalize", statusStyles.text)}>
                {claim.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{claim.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Policy Number</p>
                  <p className="font-medium text-gray-900">{claim.policy_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {claim.contact_email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {claim.contact_phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Vehicle Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Make</p>
                  <p className="font-medium text-gray-900">{claim.vehicle_make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium text-gray-900">{claim.vehicle_model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="font-medium text-gray-900">{claim.vehicle_plate}</p>
                </div>
              </div>
            </div>

            {/* Accident Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Accident Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(claim.accident_datetime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{claim.accident_description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Evidence */}
            {claim.photo_urls && claim.photo_urls.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Photo Evidence ({claim.photo_urls.length} photos)
                </h2>
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={claim.photo_urls[currentPhotoIndex]} 
                      alt={`Evidence ${currentPhotoIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {claim.photo_urls.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentPhotoIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentPhotoIndex === 0}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white disabled:opacity-50 transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPhotoIndex(prev => Math.min(claim.photo_urls.length - 1, prev + 1))}
                        disabled={currentPhotoIndex === claim.photo_urls.length - 1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white disabled:opacity-50 transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  {claim.photo_urls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        index === currentPhotoIndex 
                          ? "bg-blue-600 w-8" 
                          : "bg-gray-300 hover:bg-gray-400"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admin Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Admin Actions
              </h2>
              
              {/* Admin Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this claim..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              {claim.status === 'pending' && (
                <div className="space-y-3">
                  <Button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={updating}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg transition-all"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Claim
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Claim
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full mt-3"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Claim Data
              </Button>
            </div>

            {/* Claim Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Claim Submitted</p>
                    <p className="text-sm text-gray-500">
                      {new Date(claim.submission_datetime).toLocaleString()}
                    </p>
                  </div>
                </div>
                {claim.updated_at !== claim.created_at && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-500">
                        {new Date(claim.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
