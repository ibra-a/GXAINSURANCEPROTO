import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Camera, Upload, FileText, 
  Check, AlertCircle, MapPin, Calendar, Clock, 
  Car, X, RotateCcw, CheckCircle, Shield,
  CalendarDays, Activity, ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import gxaLogo from '../assets/gxa-dashboard-logo.png';
import { supabase, storageService } from '../lib/supabase';
import CameraCapture from '../components/CameraCapture';

interface ClaimData {
  // Incident details
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  policeReport: boolean;
  policeReportNumber?: string;
  
  // Vehicle details
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehiclePlate: string;
  
  // Driver details
  driverName: string;
  driverLicense?: string;
  driverPhone: string;
  driverEmail?: string;
  vehicleRegistration?: string;
  
  // Photos - data URLs for preview
  photos: {
    front: string | null;
    rear: string | null;
    left: string | null;
    right: string | null;
    damage1?: string | null;
    damage2?: string | null;
  };
  
  // Photo files for upload
  photoFiles: {
    front: File | null;
    rear: File | null;
    left: File | null;
    right: File | null;
    damage1?: File | null;
    damage2?: File | null;
  };
  
  // Documents
  documents: File[];
  
  // Description
  accidentDescription: string;
}

// Photo requirements with visual guides
export const PHOTO_REQUIREMENTS = [
  { id: 'front', label: 'Front View', icon: '🚗', required: true },
  { id: 'rear', label: 'Rear View', icon: '🚙', required: true },
  { id: 'left', label: 'Left Side', icon: '⬅️', required: true },
  { id: 'right', label: 'Right Side', icon: '➡️', required: true },
  { id: 'damage1', label: 'Damage Close-up 1', icon: '📸', required: false },
  { id: 'damage2', label: 'Damage Close-up 2', icon: '📸', required: false },
];

export default function VehicleClaimFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState<string>('');
  const [claimData, setClaimData] = useState<ClaimData>({
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    policeReport: false,
    policeReportNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    driverName: '',
    driverLicense: '',
    driverPhone: '',
    driverEmail: '',
    vehicleRegistration: '',
    accidentDescription: '',
    photos: {
      front: null,
      rear: null,
      left: null,
      right: null,
      damage1: null,
      damage2: null,
    },
    photoFiles: {
      front: null,
      rear: null,
      left: null,
      right: null,
      damage1: null,
      damage2: null,
    },
    documents: [],
  });

  const totalSteps = 5;

  const steps = [
    { id: 1, title: 'Incident Details', icon: AlertCircle },
    { id: 2, title: 'Vehicle Information', icon: Car },
    { id: 3, title: 'Photo Evidence', icon: Camera },
    { id: 4, title: 'Documents', icon: FileText },
    { id: 5, title: 'Review & Submit', icon: CheckCircle },
  ];

  const handlePhotoCapture = async (photoId: string) => {
    const photo = photoTypes.find(p => p.id === photoId);
    if (photo) {
      setCurrentPhotoType(photo.label);
      setShowCamera(true);
    }
  };

  const handleCameraCapture = (file: File, metadata: any) => {
    const photoId = photoTypes.find(p => p.label === currentPhotoType)?.id;
    if (photoId) {
      processCapturedPhoto(file, photoId, metadata);
      setShowCamera(false);
      setCurrentPhotoType('');
    }
  };
  
  // Process captured photo from either camera or file input
  const processCapturedPhoto = async (file: File, photoId: string, captureMetadata?: any) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Photo size must be less than 10MB');
      return;
    }
    
    // Validate file is actually an image
    if (!file.type.startsWith('image/')) {
      alert('Please capture a photo using your camera');
      return;
    }
    
    // Create comprehensive metadata for audit trail
    const metadata = captureMetadata || {
      captureTime: new Date().toISOString(),
      deviceInfo: navigator.userAgent,
      platform: navigator.platform,
      photoType: photoId,
      originalName: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
      // Attempt to get location if permission granted
      location: await getLocationIfAvailable(),
      // Device details for fraud detection
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio
      },
      // Check if file appears to be from camera
      isLikelyCamera: file.name.match(/^(IMG_|DSC|DCIM|Camera|Photo|camera_)/i) !== null
    };
    
    // Store the file for upload
    setClaimData(prev => ({
      ...prev,
      photoFiles: {
        ...prev.photoFiles,
        [photoId]: file
      },
      // Store metadata temporarily
      ...{ photoMetadata: {
        ...(prev as any).photoMetadata,
        [photoId]: metadata
      }}
    } as any));
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // Compress for display
      compressImage(dataUrl, (compressedUrl) => {
        setClaimData(prev => ({
          ...prev,
          photos: {
            ...prev.photos,
            [photoId]: compressedUrl
          }
        }));
      });
    };
    reader.readAsDataURL(file);
    
    // Show confirmation
    const photoLabel = PHOTO_REQUIREMENTS.find(p => p.id === photoId)?.label;
    if (photoLabel) {
      // You could integrate a toast notification here
      console.log(`✓ ${photoLabel} photo captured successfully`);
    }
  };
  
  // Helper function to get location if available
  const getLocationIfAvailable = async () => {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000
          });
        });
        return {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
      } catch (error) {
        console.log('Location not available:', error);
      }
    }
    return null;
  };
  
  // Helper function to compress image for display
  const compressImage = (dataUrl: string, callback: (compressed: string) => void) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      
      // Limit dimensions for preview
      const maxSize = 800;
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setClaimData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateStep = (step: number): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (step) {
      case 1: // Incident Details
        if (!claimData.incidentDate) errors.push('Incident date is required');
        if (!claimData.incidentTime) errors.push('Incident time is required');
        if (!claimData.incidentLocation.trim()) errors.push('Incident location is required');
        if (claimData.policeReport && !claimData.policeReportNumber?.trim()) {
          errors.push('Police report number is required when report is filed');
        }
        // Validate date is not in future
        if (claimData.incidentDate && new Date(claimData.incidentDate) > new Date()) {
          errors.push('Incident date cannot be in the future');
        }
        break;

      case 2: // Vehicle & Driver
        if (!claimData.vehicleMake.trim()) errors.push('Vehicle make is required');
        if (!claimData.vehicleModel.trim()) errors.push('Vehicle model is required');
        if (!claimData.vehicleYear.trim()) errors.push('Vehicle year is required');
        if (!claimData.vehiclePlate.trim()) errors.push('License plate is required');
        if (!claimData.driverName.trim()) errors.push('Driver name is required');
        if (!claimData.driverPhone.trim()) errors.push('Driver phone is required');
        // Validate phone format
        if (claimData.driverPhone && !claimData.driverPhone.match(/^[\d\s\-\+\(\)]+$/)) {
          errors.push('Invalid phone number format');
        }
        break;

      case 3: // Photo Evidence
        if (!claimData.photos.front) errors.push('Front photo is required');
        if (!claimData.photos.rear) errors.push('Rear photo is required');
        if (!claimData.photos.left) errors.push('Left side photo is required');
        if (!claimData.photos.right) errors.push('Right side photo is required');
        break;

      case 4: // Documents
        if (!claimData.accidentDescription.trim()) errors.push('Accident description is required');
        if (claimData.accidentDescription && claimData.accidentDescription.trim().length < 50) {
          errors.push('Please provide more details (at least 50 characters)');
        }
        break;
    }

    return { valid: errors.length === 0, errors };
  };

  const canProceedToNext = () => {
    const validation = validateStep(currentStep);
    return validation.valid;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Generate claim number with timestamp for uniqueness
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      const claimNumber = `GXAVC${timestamp}${randomNum}`;
      
      // Upload photos to Supabase Storage
      const photoUrls: Record<string, string> = {};
      const photoMetadata = (claimData as any).photoMetadata || {};
      
      for (const [key, file] of Object.entries(claimData.photoFiles)) {
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${claimNumber}_${key}.${fileExt}`;
          const filePath = `claims/${claimNumber}/${fileName}`;
          
          // Upload with metadata
          const { url, error } = await storageService.uploadClaimPhoto(
            file as File, 
            filePath, 
            photoMetadata[key] || {}
          );
          
          if (!error && url) {
            photoUrls[key] = url;
          }
        }
      }
      
      // Create claim record
      const { error } = await supabase.from('claims').insert({
        claim_number: claimNumber,
        status: 'pending',
        claim_type: 'vehicle',
        user_name: claimData.driverName,
        user_email: claimData.driverEmail || 'user@example.com',
        claim_amount: 0, // To be assessed
        submission_date: new Date().toISOString(),
        details: {
          incidentDate: claimData.incidentDate,
          incidentTime: claimData.incidentTime,
          incidentLocation: claimData.incidentLocation,
          policeReport: claimData.policeReport,
          policeReportNumber: claimData.policeReportNumber,
          vehicle: {
            make: claimData.vehicleMake,
            model: claimData.vehicleModel,
            year: claimData.vehicleYear,
            plate: claimData.vehiclePlate,
          },
          driver: {
            name: claimData.driverName,
            phone: claimData.driverPhone,
            email: claimData.driverEmail,
            license: claimData.driverLicense,
          },
          description: claimData.accidentDescription,
          photos: photoUrls,
          photoMetadata: photoMetadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Navigate to success page
      navigate(`/claim/success?claimNumber=${claimNumber}`);
      
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Error submitting claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Photo types for the form
  const photoTypes = PHOTO_REQUIREMENTS;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => {
            setShowCamera(false);
            setCurrentPhotoType('');
          }}
          photoType={currentPhotoType}
          instructions={`Position your vehicle's ${currentPhotoType.toLowerCase()} in the frame`}
        />
      )}
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Vehicle Claim</h1>
                <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>
            <img src={gxaLogo} alt="GXA" className="h-8" />
          </div>
        </div>
      </header>

      {/* Professional Progress Indicator - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-lg">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Secure Claim Submission</h3>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">All data is encrypted and protected</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-700 font-medium">Auto-saved</span>
            </div>
          </div>

          {/* Enhanced Step Indicator - Mobile Optimized */}
          <div className="relative">
            {/* Background Connection Line - Properly positioned for mobile */}
            <div className="absolute top-5 sm:top-10 left-[30px] right-[30px] h-0.5 sm:h-1 bg-gray-300" />
            
            {/* Progress Line */}
            <div 
              className="absolute top-5 sm:top-10 left-[30px] h-0.5 sm:h-1 bg-gradient-to-r from-green-500 to-green-400 transition-all duration-700"
              style={{ 
                width: `calc(${Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100)}% * (100% - 60px) / 100%)`
              }}
            />
            
            <div className="relative flex items-center justify-between">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isUpcoming = currentStep < step.id;
                
                return (
                  <div key={step.id} className="relative flex-1 flex flex-col items-center">
                    {/* Step Circle - Much smaller for mobile */}
                    <div className="relative group cursor-pointer">
                      <div className={`
                        relative z-10 w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
                        transition-all duration-500 transform
                        ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm sm:shadow-lg' : ''}
                        ${isActive ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md sm:shadow-xl scale-110' : ''}
                        ${isUpcoming ? 'bg-white border-2 border-gray-300' : ''}
                      `}>
                        {isCompleted ? (
                          <Check className="h-5 w-5 sm:h-8 sm:w-8 text-white animate-[scale-in_0.3s_ease-out]" />
                        ) : (
                          <Icon className={`h-5 w-5 sm:h-8 sm:w-8 transition-colors ${
                            isActive ? 'text-white' : 'text-gray-400'
                          }`} />
                        )}
                        
                        {/* Active Pulse Effect - Hidden on mobile to reduce visual clutter */}
                        {isActive && (
                          <div className="hidden sm:block absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />
                        )}
                      </div>
                      
                      {/* Step Number Badge - Smaller on mobile */}
                      <div className={`
                        absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold
                        transition-all duration-300 transform
                        ${isCompleted ? 'bg-green-600 text-white' : ''}
                        ${isActive ? 'bg-blue-600 text-white shadow-md' : ''}
                        ${isUpcoming ? 'bg-gray-100 text-gray-600 border border-gray-300' : ''}
                      `}>
                        {isCompleted ? '✓' : step.id}
                      </div>
                    </div>
                    
                    {/* Step Label - Mobile optimized */}
                    <div className="mt-1.5 sm:mt-3 text-center">
                      <p className={`text-[10px] sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                        isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {/* Show abbreviated text on mobile for active step only */}
                        <span className={`sm:hidden ${isActive ? 'block' : 'hidden'}`}>
                          {step.id === 1 && 'Details'}
                          {step.id === 2 && 'Vehicle'}
                          {step.id === 3 && 'Photos'}
                          {step.id === 4 && 'Docs'}
                          {step.id === 5 && 'Review'}
                        </span>
                        <span className="hidden sm:inline">{step.title}</span>
                      </p>
                      {isActive && (
                        <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">In Progress</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Please fix the following errors:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Step 1: Incident Details */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">When and where did the incident happen?</h2>
                <p className="text-gray-600">Please provide accurate details about the incident for proper claim processing.</p>
              </div>
              
              {/* Date & Time Section - Mobile Optimized */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CalendarDays className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                    Date & Time of Incident
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Date Selection - Mobile Optimized */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Incident <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Mobile-friendly date input */}
                      <input
                        type="date"
                        value={claimData.incidentDate}
                        onChange={(e) => setClaimData(prev => ({ ...prev, incidentDate: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                        max={new Date().toISOString().split('T')[0]}
                      />
                      
                      {/* Quick Date Selections - Horizontally scrollable on mobile */}
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        <button
                          type="button"
                          onClick={() => setClaimData(prev => ({ ...prev, incidentDate: new Date().toISOString().split('T')[0] }))}
                          className="flex-shrink-0 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            setClaimData(prev => ({ ...prev, incidentDate: yesterday.toISOString().split('T')[0] }));
                          }}
                          className="flex-shrink-0 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          Yesterday
                        </button>
                      </div>
                      
                      {/* Show selected date in readable format */}
                      {claimData.incidentDate && (
                        <p className="mt-2 text-sm text-gray-600">
                          {new Date(claimData.incidentDate + 'T00:00:00').toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                    
                    {/* Time Selection - Mobile Optimized */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time of Incident <span className="text-red-500">*</span>
                      </label>
                      
                      <input
                        type="time"
                        value={claimData.incidentTime}
                        onChange={(e) => setClaimData(prev => ({ ...prev, incidentTime: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                      
                      {/* Show selected time in readable format */}
                      {claimData.incidentTime && (
                        <p className="mt-2 text-sm text-gray-600">
                          {new Date(`2000-01-01T${claimData.incidentTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location Section - Mobile Optimized */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600" />
                  Location Details
                </h3>
                
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <label htmlFor="incidentLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Where did the incident occur? <span className="text-red-500">*</span>
                  </label>
                  
                  <textarea
                    id="incidentLocation"
                    value={claimData.incidentLocation}
                    onChange={(e) => setClaimData(prev => ({ ...prev, incidentLocation: e.target.value }))}
                    placeholder="e.g., Intersection of Main St & Oak Ave"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base resize-none"
                  />
                  
                  {/* Location Helper */}
                  <div className="mt-3 flex items-start gap-2 text-xs text-gray-600">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Be as specific as possible about the location</span>
                  </div>
                </div>
              </div>
              
              {/* Police Report Section - Mobile Optimized */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-6 mt-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600" />
                  Police Report
                </h3>
                
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={claimData.policeReport}
                      onChange={(e) => setClaimData(prev => ({ ...prev, policeReport: e.target.checked }))}
                      className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                    />
                    <span className="text-gray-700 text-sm font-medium">A police report was filed</span>
                  </label>
                  
                  {claimData.policeReport && (
                    <div className="mt-4 animate-fade-in">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Police Report Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={claimData.policeReportNumber}
                        onChange={(e) => setClaimData(prev => ({ ...prev, policeReportNumber: e.target.value }))}
                        placeholder="Enter report number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Vehicle & Driver Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Vehicle & Driver Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Vehicle Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Toyota"
                      value={claimData.vehicleMake}
                      onChange={(e) => setClaimData(prev => ({ ...prev, vehicleMake: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Camry"
                      value={claimData.vehicleModel}
                      onChange={(e) => setClaimData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2022"
                      value={claimData.vehicleYear}
                      onChange={(e) => setClaimData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Plate <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter plate number"
                      value={claimData.vehiclePlate}
                      onChange={(e) => setClaimData(prev => ({ ...prev, vehiclePlate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Driver Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter driver's name"
                      value={claimData.driverName}
                      onChange={(e) => setClaimData(prev => ({ ...prev, driverName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={claimData.driverPhone}
                      onChange={(e) => setClaimData(prev => ({ ...prev, driverPhone: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email (optional)"
                      value={claimData.driverEmail}
                      onChange={(e) => setClaimData(prev => ({ ...prev, driverEmail: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver's License Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter license number"
                      value={claimData.driverLicense}
                      onChange={(e) => setClaimData(prev => ({ ...prev, driverLicense: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Photo Evidence */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Capture Vehicle Photos</h2>
                <p className="text-gray-600">Please take clear photos of your vehicle from all required angles. These help assess the damage accurately.</p>
              </div>
              
              {/* Required Photos Grid */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Required Photos (4)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PHOTO_REQUIREMENTS.filter(photo => photo.required).map((photo) => {
                    const hasPhoto = claimData.photos[photo.id as keyof typeof claimData.photos];
                    const photoKey = photo.id as keyof typeof claimData.photos;
                    
                    return (
                      <div key={photo.id} className="relative">
                        <div className={`
                          relative rounded-2xl overflow-hidden transition-all duration-300
                          ${hasPhoto 
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' 
                            : 'bg-gradient-to-br from-gray-50 to-gray-100 shadow-md hover:shadow-lg'
                          }
                        `}>
                          {/* Header */}
                          <div className={`
                            px-4 py-3 flex items-center justify-between
                            ${hasPhoto 
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                              : 'bg-gradient-to-r from-gray-600 to-gray-700'
                            }
                          `}>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{photo.icon}</span>
                              <span className="font-semibold text-white text-sm">{photo.label}</span>
                            </div>
                            {hasPhoto && (
                              <div className="flex items-center gap-1 text-white/90">
                                <Check className="h-4 w-4" />
                                <span className="text-xs">Captured</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Photo Area */}
                          <div className="p-4">
                            {hasPhoto ? (
                              <div className="relative group">
                                <img
                                  src={claimData.photos[photoKey] || ''}
                                  alt={photo.label}
                                  className="w-full h-48 object-cover rounded-xl"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handlePhotoCapture(photo.id)}
                                      className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                                      title="Retake photo"
                                    >
                                      <RotateCcw className="h-5 w-5 text-gray-700" />
                                    </button>
                                    <button
                                      onClick={() => setClaimData(prev => ({
                                        ...prev,
                                        photos: { ...prev.photos, [photo.id]: null },
                                        photoFiles: { ...prev.photoFiles, [photo.id]: null }
                                      }))}
                                      className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                                      title="Remove photo"
                                    >
                                      <X className="h-5 w-5 text-red-600" />
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Photo Requirements Met Indicators */}
                                <div className="mt-3 space-y-1">
                                  <div className="flex items-center gap-2 text-xs text-green-700">
                                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                                    <span>High quality photo</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-green-700">
                                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                                    <span>Vehicle clearly visible</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {/* Visual Guide */}
                                <div className="relative h-40 bg-white rounded-xl border-2 border-dashed border-gray-300 overflow-hidden">
                                  {photo.id === 'front' && (
                                    <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full p-8 text-gray-300">
                                      <rect x="40" y="30" width="120" height="40" rx="20" fill="currentColor" />
                                      <circle cx="60" cy="70" r="10" fill="currentColor" />
                                      <circle cx="140" cy="70" r="10" fill="currentColor" />
                                      <rect x="70" y="25" width="60" height="25" rx="10" fill="currentColor" />
                                    </svg>
                                  )}
                                  {photo.id === 'rear' && (
                                    <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full p-8 text-gray-300 scale-x-[-1]">
                                      <rect x="40" y="30" width="120" height="40" rx="20" fill="currentColor" />
                                      <circle cx="60" cy="70" r="10" fill="currentColor" />
                                      <circle cx="140" cy="70" r="10" fill="currentColor" />
                                      <rect x="70" y="25" width="60" height="25" rx="10" fill="currentColor" />
                                    </svg>
                                  )}
                                  {photo.id === 'left' && (
                                    <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full p-8 text-gray-300 -rotate-90 scale-y-[-1]">
                                      <rect x="40" y="30" width="120" height="40" rx="20" fill="currentColor" />
                                      <circle cx="60" cy="70" r="10" fill="currentColor" />
                                      <circle cx="140" cy="70" r="10" fill="currentColor" />
                                    </svg>
                                  )}
                                  {photo.id === 'right' && (
                                    <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full p-8 text-gray-300 rotate-90">
                                      <rect x="40" y="30" width="120" height="40" rx="20" fill="currentColor" />
                                      <circle cx="60" cy="70" r="10" fill="currentColor" />
                                      <circle cx="140" cy="70" r="10" fill="currentColor" />
                                    </svg>
                                  )}
                                </div>
                                
                                {/* Capture Button */}
                                <button
                                  onClick={() => handlePhotoCapture(photo.id)}
                                  className={`
                                    w-full py-4 rounded-xl font-semibold text-white
                                    bg-gradient-to-r from-blue-600 to-indigo-600 
                                    hover:from-blue-700 hover:to-indigo-700
                                    transform transition-all duration-200 
                                    hover:scale-[1.02] active:scale-[0.98]
                                    shadow-lg hover:shadow-xl
                                  `}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    <Camera className="h-5 w-5" />
                                    <span>Take {photo.label} Photo</span>
                                  </div>
                                </button>
                                
                                {/* Requirements Checklist */}
                                <div className="space-y-1.5 text-xs text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                                    <span>Ensure entire {photo.id} side is visible</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                                    <span>Take photo in good lighting</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                                    <span>Include license plate if visible</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Optional Damage Photos */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  Additional Damage Photos (Optional)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  If there's specific damage, take close-up photos for better assessment
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PHOTO_REQUIREMENTS.filter(photo => !photo.required).map((photo) => {
                    const hasPhoto = claimData.photos[photo.id as keyof typeof claimData.photos];
                    
                    return (
                      <div key={photo.id} className="bg-white rounded-xl p-4 shadow-sm">
                        {hasPhoto ? (
                          <div className="relative">
                            <img 
                              src={claimData.photos[photo.id as keyof typeof claimData.photos] || ''} 
                              alt={photo.label}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => setClaimData(prev => ({
                                ...prev,
                                photos: { ...prev.photos, [photo.id]: null },
                                photoFiles: { ...prev.photoFiles, [photo.id]: null }
                              }))}
                              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md"
                            >
                              <X className="h-3 w-3 text-red-600" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePhotoCapture(photo.id)}
                            className="w-full h-32 border-2 border-dashed border-gray-200 rounded-lg
                              hover:border-purple-300 hover:bg-purple-50/50 transition-all
                              flex items-center justify-center gap-3"
                          >
                            <div className="text-2xl">{photo.icon}</div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-700">{photo.label}</p>
                              <p className="text-xs text-gray-500">Optional</p>
                            </div>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Photo Guidelines */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photo Guidelines for Best Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Take photos in good lighting conditions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Ensure the entire vehicle side is visible</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Include license plate when visible</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Capture all visible damage clearly</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {PHOTO_REQUIREMENTS.filter(p => p.required).filter(p => claimData.photos[p.id as keyof typeof claimData.photos]).length}/4
                  </span>
                  <span>required photos captured</span>
                </div>
                <div className="mt-2">
                  <div className="h-2 w-48 bg-gray-200 rounded-full mx-auto overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                      style={{ width: `${(PHOTO_REQUIREMENTS.filter(p => p.required).filter(p => claimData.photos[p.id as keyof typeof claimData.photos]).length / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload supporting documents</h2>
                <p className="text-gray-600">Upload any relevant documents such as police reports, repair estimates, etc.</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="document-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Choose Files
                </label>
              </div>
              
              {claimData.documents.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800">Uploaded Documents ({claimData.documents.length})</h3>
                  <div className="space-y-2">
                    {claimData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <span className="text-sm text-gray-700">{doc.name}</span>
                        </div>
                        <button
                          onClick={() => setClaimData(prev => ({
                            ...prev,
                            documents: prev.documents.filter((_, i) => i !== index)
                          }))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Accident Description</span>
                  <span className="text-red-500 ml-1">*</span>
                  <textarea
                    placeholder="Please describe what happened in detail..."
                    value={claimData.accidentDescription}
                    onChange={(e) => setClaimData(prev => ({ ...prev, accidentDescription: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 50 characters</p>
                </label>
              </div>
            </div>
          )}
          
          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Review your claim</h2>
              
              <div className="space-y-4">
                {/* Incident Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    Incident Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="ml-2 font-medium">{claimData.incidentDate} at {claimData.incidentTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 font-medium">{claimData.incidentLocation}</span>
                    </div>
                    {claimData.policeReport && (
                      <div>
                        <span className="text-gray-600">Police Report:</span>
                        <span className="ml-2 font-medium">{claimData.policeReportNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Vehicle Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Car className="h-5 w-5 text-blue-600" />
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="ml-2 font-medium">
                        {claimData.vehicleYear} {claimData.vehicleMake} {claimData.vehicleModel}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Plate:</span>
                      <span className="ml-2 font-medium">{claimData.vehiclePlate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Driver:</span>
                      <span className="ml-2 font-medium">{claimData.driverName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{claimData.driverPhone}</span>
                    </div>
                  </div>
                </div>
                
                {/* Photos Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    Photo Evidence
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(claimData.photos).map(([key, value]) => {
                      if (value) {
                        return (
                          <div key={key} className="relative">
                            <img src={value} alt={key} className="w-full h-20 object-cover rounded-lg" />
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                              {key}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                
                {/* Documents Summary */}
                {claimData.documents.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Documents ({claimData.documents.length})
                    </h3>
                    <div className="space-y-1 text-sm">
                      {claimData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{doc.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Description Summary */}
                {claimData.accidentDescription && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Accident Description</h3>
                    <p className="text-sm text-gray-700">{claimData.accidentDescription}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 font-medium">Ready to submit</p>
                    <p className="text-xs text-blue-700 mt-1">
                      By submitting this claim, you confirm that all information provided is accurate and complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Professional Navigation */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`
                group relative overflow-hidden transition-all duration-300 gap-2
                ${currentStep === 1 ? 'opacity-50' : 'hover:shadow-md hover:scale-105'}
              `}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Previous</span>
            </Button>
            
            {/* Progress Indicator */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Step <span className="font-bold text-gray-900">{currentStep}</span> of {totalSteps}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      h-1.5 rounded-full transition-all duration-300
                      ${i < currentStep ? 'w-8 bg-gradient-to-r from-blue-500 to-indigo-600' : 'w-1.5 bg-gray-300'}
                    `}
                  />
                ))}
              </div>
            </div>
            
            {/* Next/Submit Button */}
            {currentStep < totalSteps ? (
              <Button
                onClick={() => {
                  const validation = validateStep(currentStep);
                  if (validation.valid) {
                    setValidationErrors([]);
                    setCurrentStep(prev => Math.min(totalSteps, prev + 1));
                  } else {
                    setValidationErrors(validation.errors);
                  }
                }}
                className={`
                  group relative overflow-hidden transition-all duration-300 gap-2
                  bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                  hover:shadow-lg hover:scale-105
                `}
              >
                <span className="font-medium">Next Step</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                <ChevronRight className="h-4 w-4 opacity-50 animate-pulse" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceedToNext() || submitting}
                className={`
                  group relative overflow-hidden transition-all duration-300 gap-2
                  ${!canProceedToNext() || submitting ? 'opacity-50' : 'hover:shadow-lg hover:scale-105'}
                  bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                  min-w-[160px]
                `}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span className="font-medium">Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Submit Claim</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
