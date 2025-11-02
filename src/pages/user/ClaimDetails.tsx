import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Car, User, Phone, Mail, 
  FileText, Camera, Shield, Clock, CheckCircle, XCircle,
  AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { claimsService, supabase, storageService, type Claim } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ClaimDetails() {
  const { claimNumber } = useParams<{ claimNumber: string }>();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Helper function to get optimized photo URL for fast loading
  const getPhotoUrl = (photoUrl: string | null | undefined, useOptimization: boolean = true): string => {
    if (!photoUrl) return '';
    
    // If already a full URL, use it directly
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      if (useOptimization) {
        return storageService.getDisplayUrl(photoUrl);
      }
      return photoUrl;
    }
    
    // If it's a path, construct full Supabase public URL first
    const cleanPath = photoUrl.startsWith('/') ? photoUrl.slice(1) : photoUrl;
    const { data } = supabase.storage
      .from('claim-photos')
      .getPublicUrl(cleanPath);
    
    if (useOptimization) {
      return storageService.getDisplayUrl(data.publicUrl);
    }
    return data.publicUrl;
  };

  useEffect(() => {
    loadClaim();
  }, [claimNumber]);

  // Reset image loading state when photo changes - MUST be before early returns
  useEffect(() => {
    if (claim?.photo_urls && claim.photo_urls.length > 0) {
      const photos = claim.photo_urls.map(url => getPhotoUrl(url)).filter(url => url && url.length > 0);
      if (photos.length > 0 && currentPhotoIndex < photos.length) {
        setImageError(false);
        setImageLoading(true); // Show loading when switching photos
      }
    }
  }, [currentPhotoIndex, claim?.photo_urls]);

  const loadClaim = async () => {
    if (!claimNumber) return;
    
    try {
      const { data, error } = await claimsService.getClaimByNumber(claimNumber);
      if (error || !data) {
        console.error('Error fetching claim:', error);
        alert('Claim not found');
        navigate('/user/dashboard');
        return;
      }
      console.log('Claim loaded:', claimNumber);
      console.log('Photo URLs:', data.photo_urls);
      setClaim(data);
    } catch (error) {
      console.error('Error loading claim:', error);
      alert('Error loading claim details');
      navigate('/user/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border border-amber-200">
            <Clock className="h-4 w-4 mr-2" />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-red-100 to-rose-100 text-rose-700 border border-rose-200">
            <XCircle className="h-4 w-4 mr-2" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Claim Not Found</h2>
          <Button onClick={() => navigate('/user/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Normalize photo URLs to ensure they're full URLs
  const photos = claim && claim.photo_urls 
    ? claim.photo_urls.map(url => getPhotoUrl(url)).filter(url => url && url.length > 0)
    : [];
  const currentPhoto = photos.length > 0 && currentPhotoIndex < photos.length 
    ? photos[currentPhotoIndex] 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/user/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim Details</h1>
              <p className="text-gray-600">Claim Number: <span className="font-mono font-semibold">{claim.claim_number}</span></p>
            </div>
            {getStatusBadge(claim.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Claim Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Claim Information
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Incident Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Incident Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDateTime(claim.accident_datetime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Submission Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDateTime(claim.submission_datetime)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-600" />
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Make & Model</p>
                      <p className="text-sm font-medium text-gray-900">{claim.vehicle_make} {claim.vehicle_model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">License Plate</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">{claim.vehicle_plate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Policy Number</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">{claim.policy_number}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Name</p>
                      <p className="text-sm font-medium text-gray-900">{claim.user_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {claim.contact_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {claim.contact_phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Accident Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Accident Description
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{claim.accident_description}</p>
                  </div>
                </div>

                {/* Admin Notes (if available) */}
                {claim.admin_notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Admin Notes
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 whitespace-pre-wrap">{claim.admin_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo Gallery */}
            {photos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    Photo Evidence ({photos.length})
                  </h3>
                </div>
                
                <div className="p-4">
                  {currentPhoto ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {imageLoading && !imageError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                          </div>
                        )}
                        {imageError ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4">
                            <Camera className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-sm font-medium">Image could not be loaded</p>
                            <p className="text-xs opacity-75 mt-1">Photo {currentPhotoIndex + 1} / {photos.length}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4"
                              onClick={() => {
                                setImageError(false);
                                // Force reload by changing src temporarily
                                const img = document.querySelector(`img[alt="Photo ${currentPhotoIndex + 1}"]`) as HTMLImageElement;
                                if (img) {
                                  const originalSrc = img.src;
                                  img.src = '';
                                  setTimeout(() => {
                                    img.src = originalSrc;
                                  }, 100);
                                }
                              }}
                            >
                              Retry
                            </Button>
                          </div>
                        ) : (
                          <img 
                            src={currentPhoto ? storageService.getDisplayUrl(currentPhoto) : ''} 
                            alt={`Photo ${currentPhotoIndex + 1}`}
                            className="w-full h-full object-contain"
                            onLoad={() => {
                              setImageError(false);
                              setImageLoading(false);
                            }}
                            onError={(e) => {
                              console.error('Image failed to load:', currentPhoto);
                              setImageLoading(false);
                              setImageError(true);
                              // Try alternative URL format (without optimization)
                              const img = e.target as HTMLImageElement;
                              if (currentPhoto) {
                                const altUrl = getPhotoUrl(currentPhoto, false);
                                if (altUrl && altUrl !== img.src) {
                                  img.src = altUrl;
                                }
                              }
                            }}
                            loading="lazy"
                          />
                        )}
                        {/* Photo number badge */}
                        {!imageError && (
                          <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                            Photo {currentPhotoIndex + 1} / {photos.length}
                          </div>
                        )}
                      </div>
                      
                      {photos.length > 1 && (
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPhotoIndex(prev => 
                              prev > 0 ? prev - 1 : photos.length - 1
                            )}
                            disabled={photos.length <= 1}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>
                          
                          <span className="text-sm text-gray-600">
                            {currentPhotoIndex + 1} / {photos.length}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPhotoIndex(prev => 
                              prev < photos.length - 1 ? prev + 1 : 0
                            )}
                            disabled={photos.length <= 1}
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      )}
                      
                      {/* Photo Thumbnails */}
                      {photos.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {photos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPhotoIndex(index)}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                index === currentPhotoIndex 
                                  ? 'border-blue-500 ring-2 ring-blue-200' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img 
                                src={storageService.getThumbnailUrl(photo)} 
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Thumbnail failed to load:', photo);
                                  const img = e.target as HTMLImageElement;
                                  // Fallback to original URL without optimization
                                  const altUrl = getPhotoUrl(photo, false);
                                  if (altUrl !== img.src) {
                                    img.src = altUrl;
                                  }
                                }}
                                loading="lazy"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-8">No photos available</p>
                  )}
                </div>
              </div>
            )}

            {/* Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Timeline
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Claim Submitted</p>
                    <p className="text-xs text-gray-500">{formatDateTime(claim.submission_datetime)}</p>
                  </div>
                </div>
                
                {claim.status === 'approved' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Claim Approved</p>
                      <p className="text-xs text-gray-500">{formatDateTime(claim.updated_at)}</p>
                    </div>
                  </div>
                )}
                
                {claim.status === 'rejected' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Claim Rejected</p>
                      <p className="text-xs text-gray-500">{formatDateTime(claim.updated_at)}</p>
                    </div>
                  </div>
                )}
                
                {claim.status === 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Under Review</p>
                      <p className="text-xs text-gray-500">Processing your claim...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

