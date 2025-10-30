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

interface ClaimData {
  // Incident details
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  policeReport: boolean;
  policeReportNumber?: string;
  
  // Vehicle info
  vehicleMake: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleYear: string;
  
  // Description
  description: string;
  damageArea: string[];
  
  // Photos
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
}

const PHOTO_REQUIREMENTS = [
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
  const [claimData, setClaimData] = useState<ClaimData>({
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    policeReport: false,
    policeReportNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehiclePlate: '',
    vehicleYear: '',
    description: '',
    damageArea: [],
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
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Check if we're in a secure context (HTTPS required for camera)
    const isSecureContext = window.isSecureContext || location.protocol === 'https:';
    
    // Try to use MediaDevices API for better camera control
    if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && isSecureContext) {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', // Use rear camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        
        // Create video element to show camera feed
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        
        // Create camera UI overlay with GXA branding
        const cameraOverlay = document.createElement('div');
        cameraOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: black;
          z-index: 9999;
          display: flex;
          flex-direction: column;
        `;
        
        // Add header with photo type
        const header = document.createElement('div');
        header.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
          padding: 20px;
          z-index: 10;
        `;
        
        const photoLabel = PHOTO_REQUIREMENTS.find(p => p.id === photoId)?.label || 'Photo';
        header.innerHTML = `
          <div style="color: white; text-align: center;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Capture ${photoLabel}</h3>
            <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.8;">Position vehicle in frame</p>
          </div>
        `;
        
        // Add video to overlay
        video.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
        `;
        cameraOverlay.appendChild(video);
        
        // Add guide overlay
        const guideOverlay = document.createElement('div');
        guideOverlay.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 500px;
          height: 70%;
          max-height: 400px;
          border: 2px dashed rgba(255,255,255,0.5);
          border-radius: 12px;
          pointer-events: none;
        `;
        
        // Create capture button with better styling
        const captureButton = document.createElement('button');
        captureButton.innerHTML = `
          <div style="width: 80px; height: 80px; border: 4px solid white; border-radius: 50%; 
                      display: flex; align-items: center; justify-content: center; 
                      background: linear-gradient(135deg, #5B8FF9, #4169E1); 
                      box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
            <div style="width: 60px; height: 60px; background: white; border-radius: 50%;"></div>
          </div>
        `;
        captureButton.style.cssText = `
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.1s;
        `;
        captureButton.onmousedown = () => captureButton.style.transform = 'translateX(-50%) scale(0.9)';
        captureButton.onmouseup = () => captureButton.style.transform = 'translateX(-50%) scale(1)';
        
        // Create cancel button
        const cancelButton = document.createElement('button');
        cancelButton.innerHTML = '✕';
        cancelButton.style.cssText = `
          position: absolute;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          color: white;
          font-size: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        cameraOverlay.appendChild(header);
        cameraOverlay.appendChild(guideOverlay);
        cameraOverlay.appendChild(captureButton);
        cameraOverlay.appendChild(cancelButton);
        document.body.appendChild(cameraOverlay);
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          video.onloadedmetadata = resolve;
        });
        
        // Handle capture
        captureButton.onclick = () => {
          // Add flash effect
          const flash = document.createElement('div');
          flash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.1s;
          `;
          cameraOverlay.appendChild(flash);
          
          // Trigger flash animation
          setTimeout(() => flash.style.opacity = '1', 0);
          setTimeout(() => flash.style.opacity = '0', 100);
          setTimeout(() => cameraOverlay.removeChild(flash), 200);
          
          // Add camera shutter sound effect (optional)
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGS1/LIeSUFLJLS8Ntt');
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore if audio fails
          } catch (e) {}
          
          // Create canvas to capture photo
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          
          // Get image data URL for preview
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          
          // Hide video and show preview
          video.style.display = 'none';
          guideOverlay.style.display = 'none';
          captureButton.style.display = 'none';
          
          // Create preview image
          const previewImg = document.createElement('img');
          previewImg.src = imageDataUrl;
          previewImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: black;
          `;
          cameraOverlay.appendChild(previewImg);
          
          // Update header
          header.innerHTML = `
            <div style="color: white; text-align: center;">
              <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Review ${photoLabel}</h3>
              <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.8;">Use this photo?</p>
            </div>
          `;
          
          // Create action buttons container
          const actionButtons = document.createElement('div');
          actionButtons.style.cssText = `
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            align-items: center;
          `;
          
          // Retake button
          const retakeButton = document.createElement('button');
          retakeButton.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; padding: 12px 24px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2a10 10 0 0 0-6.88 17.12c.04.01.08.02.12.03l1.41-1.41A8 8 0 1 1 12 20a7.89 7.89 0 0 1-4.15-1.18l-1.42 1.42A9.9 9.9 0 0 0 12 22a10 10 0 0 0 0-20zm0 6a4 4 0 0 0-4 4H6a6 6 0 0 1 6-6v2z"/>
              </svg>
              <span>Retake</span>
            </div>
          `;
          retakeButton.style.cssText = `
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 30px;
            color: white;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          `;
          
          // Use photo button (WhatsApp-style checkmark)
          const usePhotoButton = document.createElement('button');
          usePhotoButton.innerHTML = `
            <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            </div>
          `;
          usePhotoButton.style.cssText = `
            background: linear-gradient(135deg, #25D366, #128C7E);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
          `;
          
          // Add hover effects
          retakeButton.onmouseenter = () => retakeButton.style.background = 'rgba(255,255,255,0.3)';
          retakeButton.onmouseleave = () => retakeButton.style.background = 'rgba(255,255,255,0.2)';
          usePhotoButton.onmouseenter = () => usePhotoButton.style.transform = 'scale(1.1)';
          usePhotoButton.onmouseleave = () => usePhotoButton.style.transform = 'scale(1)';
          
          actionButtons.appendChild(retakeButton);
          actionButtons.appendChild(usePhotoButton);
          cameraOverlay.appendChild(actionButtons);
          
          // Handle retake
          retakeButton.onclick = () => {
            // Remove preview elements
            cameraOverlay.removeChild(previewImg);
            cameraOverlay.removeChild(actionButtons);
            
            // Show camera elements again
            video.style.display = '';
            guideOverlay.style.display = '';
            captureButton.style.display = '';
            
            // Reset header
            header.innerHTML = `
              <div style="color: white; text-align: center;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Capture ${photoLabel}</h3>
                <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.8;">Position vehicle in frame</p>
              </div>
            `;
          };
          
          // Handle use photo
          usePhotoButton.onclick = () => {
            // Convert to blob for file creation
            canvas.toBlob((blob) => {
              if (blob) {
                const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
                processCapturedPhoto(file, photoId);
              }
              
              // Clean up
              stream.getTracks().forEach(track => track.stop());
              document.body.removeChild(cameraOverlay);
            }, 'image/jpeg', 0.9);
          };
        };
        
        // Handle cancel
        cancelButton.onclick = () => {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(cameraOverlay);
        };
        
        return;
      } catch (error) {
        console.log('Camera access denied or not available:', error);
        // Fall back to file input
      }
    }
    
    // Fallback to file input with camera capture
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    // Set capture attribute differently for better mobile support
    if (isMobile) {
      // For mobile, use specific capture values
      input.setAttribute('capture', 'camera');
      // Some browsers need this exact string
      input.setAttribute('accept', 'image/*;capture=camera');
    } else {
      input.capture = 'environment';
    }
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        processCapturedPhoto(file, photoId);
      }
    };
    
    input.click();
  };
  
  // Process captured photo from either camera or file input
  const processCapturedPhoto = async (file: File, photoId: string) => {
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
    const metadata = {
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
      }
    }));
    
    // Convert to base64 for preview with compression
    const reader = new FileReader();
    reader.onloadend = () => {
      // Compress image for display
      compressImage(reader.result as string, (compressedImage) => {
        setClaimData(prev => ({
          ...prev,
          photos: {
            ...prev.photos,
            [photoId]: compressedImage
          }
        }));
      });
    };
    reader.readAsDataURL(file);
    
    // Log capture event for audit
    console.log('Photo captured for audit:', { photoId, metadata });
    
    // Show success feedback
    const photoLabel = PHOTO_REQUIREMENTS.find(p => p.id === photoId)?.label;
    if (photoLabel) {
      // You could integrate a toast notification here
      console.log(`✓ ${photoLabel} photo captured successfully`);
    }
  };
  
  // Helper function to get location if available
  const getLocationIfAvailable = async (): Promise<{ lat: number; lng: number } | null> => {
    try {
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        return {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }
    } catch (error) {
      console.log('Location not available:', error);
    }
    return null;
  };
  
  // Helper function to compress image for display
  const compressImage = (dataUrl: string, callback: (compressed: string) => void) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set max dimensions
      const maxWidth = 1200;
      const maxHeight = 1200;
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
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

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return claimData.incidentDate && claimData.incidentTime && claimData.incidentLocation;
      case 2:
        return claimData.vehicleMake && claimData.vehicleModel && claimData.vehiclePlate;
      case 3:
        return claimData.photos.front && claimData.photos.rear && 
               claimData.photos.left && claimData.photos.right;
      case 4:
        return true; // Documents are optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Generate claim number with timestamp for uniqueness
      const claimNumber = `CLM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Date.now().toString().slice(-6)}`;
      
      // Upload photos to Supabase Storage with audit metadata
      const photoFilesToUpload: { [key: string]: File } = {};
      const photoMetadata: { [key: string]: any } = {};
      
      Object.entries(claimData.photoFiles).forEach(([key, file]) => {
        if (file) {
          photoFilesToUpload[key] = file;
          // Store metadata for each photo
          photoMetadata[key] = {
            capturedAt: new Date().toISOString(),
            photoType: key,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type
          };
        }
      });

      let photoUrls: string[] = [];
      
      if (Object.keys(photoFilesToUpload).length > 0) {
        const { urls, errors } = await storageService.uploadMultiplePhotos(photoFilesToUpload, claimNumber);
        
        if (errors.length > 0) {
          console.error('Some photos failed to upload:', errors);
          // Show which specific photos failed
          const failedPhotos = errors.map(e => e.photoType).join(', ');
          alert(`Warning: Some photos failed to upload (${failedPhotos}). The claim will be submitted with available photos.`);
        }
        
        photoUrls = urls;
      }

      // Create claim record with audit trail
      const claimRecord = {
        claim_number: claimNumber,
        user_name: 'Ahmed Mohamed Hassan', // In real app, from auth
        policy_number: 'GXA-DJ-2024-1547',
        contact_email: 'ahmed.hassan@example.dj',
        contact_phone: '+253 77 12 34 56',
        accident_datetime: new Date(`${claimData.incidentDate}T${claimData.incidentTime}`).toISOString(),
        submission_datetime: new Date().toISOString(),
        vehicle_plate: claimData.vehiclePlate,
        vehicle_make: claimData.vehicleMake,
        vehicle_model: claimData.vehicleModel,
        accident_description: `${claimData.description}\n\nDamaged areas: ${claimData.damageArea.join(', ')}\nPolice report: ${claimData.policeReport ? `Yes (${claimData.policeReportNumber || 'Number pending'})` : 'No'}`,
        photo_urls: photoUrls,
        status: 'pending' as const
      };

      // Submit to Supabase
      const { data, error } = await supabase
        .from('claims')
        .insert([claimRecord])
        .select();

      if (error) throw error;

      // Log successful submission for audit
      console.log('Claim submitted successfully:', {
        claimNumber,
        photoCount: photoUrls.length,
        submissionTime: new Date().toISOString(),
        claimId: data?.[0]?.id
      });

      // Navigate to success page
      navigate('/claim/success', { state: { claimNumber, claimId: data?.[0]?.id } });
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Error submitting claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Vehicle Claim</h1>
                <p className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>
            <img src={gxaLogo} alt="GXA" className="h-8" />
          </div>
        </div>
      </header>

      {/* Professional Progress Indicator */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Secure Claim Submission</h3>
                <p className="text-sm text-gray-600">All data is encrypted and protected</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-700 font-medium">Auto-saved</span>
            </div>
          </div>

          {/* Enhanced Step Indicator */}
          <div className="relative">
            {/* Background Connection Line */}
            <div className="absolute top-10 left-0 right-0 h-1 bg-gray-300" style={{ 
              left: '10%',
              right: '10%'
            }} />
            
            {/* Progress Line */}
            <div 
              className="absolute top-10 left-0 h-1 bg-gradient-to-r from-green-500 to-green-400 transition-all duration-700"
              style={{ 
                left: '10%',
                width: `${Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 80)}%`
              }} 
            />
            
            <div className="relative flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isUpcoming = currentStep < step.id;
                
                return (
                  <div key={step.id} className="relative flex-1 flex flex-col items-center">
                    {/* Step Circle */}
                    <div className="relative group cursor-pointer">
                      <div className={`
                        relative z-10 w-20 h-20 rounded-full flex items-center justify-center
                        transition-all duration-500 transform
                        ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30' : ''}
                        ${isActive ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-600/40 scale-110' : ''}
                        ${isUpcoming ? 'bg-white border-2 border-gray-300 hover:border-gray-400' : ''}
                      `}>
                        {isCompleted ? (
                          <Check className="h-10 w-10 text-white animate-[scale-in_0.3s_ease-out]" />
                        ) : (
                          <Icon className={`h-10 w-10 transition-colors ${
                            isActive ? 'text-white' : 'text-gray-400'
                          }`} />
                        )}
                        
                        {/* Active Pulse Effect */}
                        {isActive && (
                          <>
                            <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />
                            <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping animation-delay-150 opacity-20" />
                          </>
                        )}
                      </div>
                      
                      {/* Step Number Badge */}
                      <div className={`
                        absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                        transition-all duration-300 transform
                        ${isCompleted ? 'bg-green-600 text-white scale-0' : ''}
                        ${isActive ? 'bg-blue-600 text-white shadow-md' : ''}
                        ${isUpcoming ? 'bg-gray-100 text-gray-600 border border-gray-300' : ''}
                      `}>
                        {step.id}
                      </div>
                    </div>
                    
                    {/* Step Label */}
                    <div className="mt-4 text-center">
                      <p className={`text-sm font-semibold transition-colors ${
                        isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </p>
                      {isActive && (
                        <p className="text-xs text-gray-500 mt-1">In Progress</p>
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Step 1: Incident Details */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">When and where did the incident happen?</h2>
                <p className="text-gray-600">Please provide accurate details about the incident for proper claim processing.</p>
              </div>
              
              {/* Date and Time Selection */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Date & Time of Incident</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Card */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Date of Incident
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={claimData.incidentDate}
                        onChange={(e) => setClaimData(prev => ({ ...prev, incidentDate: e.target.value }))}
                        className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {claimData.incidentDate && (
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(claimData.incidentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                  
                  {/* Time Card */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Time of Incident
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={claimData.incidentTime}
                        onChange={(e) => setClaimData(prev => ({ ...prev, incidentTime: e.target.value }))}
                        className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                      />
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {claimData.incidentTime && (
                      <p className="mt-2 text-xs text-gray-500">
                        {(() => {
                          const [hours, minutes] = claimData.incidentTime.split(':');
                          const hour = parseInt(hours);
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          const displayHour = hour > 12 ? hour - 12 : hour || 12;
                          return `${displayHour}:${minutes} ${ampm}`;
                        })()}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Quick Selection */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      setClaimData(prev => ({
                        ...prev,
                        incidentDate: today.toISOString().split('T')[0],
                        incidentTime: today.toTimeString().slice(0, 5)
                      }));
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Just Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      setClaimData(prev => ({
                        ...prev,
                        incidentDate: today.toISOString().split('T')[0]
                      }));
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      setClaimData(prev => ({
                        ...prev,
                        incidentDate: yesterday.toISOString().split('T')[0]
                      }));
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Yesterday
                  </button>
                </div>
              </div>
              
              {/* Location Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Location Details</h3>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Where did the incident occur?
                  </label>
                  <textarea
                    value={claimData.incidentLocation}
                    onChange={(e) => setClaimData(prev => ({ ...prev, incidentLocation: e.target.value }))}
                    placeholder="e.g., Avenue 13 near Bawadi Mall, Djibouti City"
                    rows={2}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Please be as specific as possible, including nearby landmarks
                  </p>
                </div>
              </div>
              
              {/* Police Report Section */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Shield className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Official Documentation</h3>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      id="policeReport"
                      checked={claimData.policeReport}
                      onChange={(e) => setClaimData(prev => ({ ...prev, policeReport: e.target.checked }))}
                      className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-3 text-gray-900 font-medium group-hover:text-amber-700 transition-colors">
                      A police report was filed
                    </span>
                  </label>
                  
                  {claimData.policeReport && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Police Report Number
                      </label>
                      <input
                        type="text"
                        value={claimData.policeReportNumber}
                        onChange={(e) => setClaimData(prev => ({ ...prev, policeReportNumber: e.target.value }))}
                        placeholder="Enter report number (e.g., DJ-2024-001234)"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono"
                      />
                    </div>
                  )}
                </div>
                
                {!claimData.policeReport && (
                  <p className="mt-3 text-xs text-amber-700 bg-amber-100 rounded-lg p-3">
                    💡 Having a police report can expedite your claim processing
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Tell us about your vehicle</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    value={claimData.vehicleMake}
                    onChange={(e) => setClaimData(prev => ({ ...prev, vehicleMake: e.target.value }))}
                    placeholder="e.g., Toyota"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={claimData.vehicleModel}
                    onChange={(e) => setClaimData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                    placeholder="e.g., Land Cruiser"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                  <input
                    type="text"
                    value={claimData.vehiclePlate}
                    onChange={(e) => setClaimData(prev => ({ ...prev, vehiclePlate: e.target.value.toUpperCase() }))}
                    placeholder="e.g., DJI-1234"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={claimData.vehicleYear}
                    onChange={(e) => setClaimData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                    placeholder="e.g., 2020"
                    min="1990"
                    max={new Date().getFullYear()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Damage Description</label>
                <textarea
                  value={claimData.description}
                  onChange={(e) => setClaimData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what happened and the damage to your vehicle..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Damaged Areas (select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Front', 'Rear', 'Left Side', 'Right Side', 'Roof', 'Windshield', 'Interior', 'Engine'].map(area => (
                    <label key={area} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={claimData.damageArea.includes(area)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setClaimData(prev => ({ ...prev, damageArea: [...prev.damageArea, area] }));
                          } else {
                            setClaimData(prev => ({ ...prev, damageArea: prev.damageArea.filter(a => a !== area) }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Photo Evidence */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo Evidence Required</h2>
                <p className="text-gray-600">Take photos directly from your device camera. No uploads allowed for fraud prevention.</p>
              </div>
              
              {/* Security Notice */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Fraud Prevention Measures</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Photos must be taken live - no gallery uploads</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Timestamp and location metadata captured</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>AI-powered authenticity verification</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Required Photos Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {PHOTO_REQUIREMENTS.filter(p => p.required).map((photo) => {
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
                          px-6 py-4 flex items-center justify-between
                          ${hasPhoto 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                            : 'bg-gradient-to-r from-gray-600 to-gray-700'
                          }
                        `}>
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{photo.icon}</div>
                            <div>
                              <h4 className="font-semibold text-white">{photo.label}</h4>
                              <p className="text-xs text-white/80">Required Photo</p>
                            </div>
                          </div>
                          {hasPhoto && (
                            <CheckCircle className="h-6 w-6 text-white" />
                          )}
                        </div>
                        
                        {/* Photo Area */}
                        <div className="p-6">
                          {hasPhoto ? (
                            <div className="relative group">
                              <img 
                                src={claimData.photos[photoKey] || ''} 
                                alt={photo.label}
                                className="w-full h-64 object-cover rounded-xl shadow-md"
                              />
                              {/* Timestamp Overlay */}
                              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  <span>{new Date().toLocaleString()}</span>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handlePhotoCapture(photo.id)}
                                  className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
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
                                  className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors"
                                  title="Remove photo"
                                >
                                  <X className="h-5 w-5 text-red-600" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePhotoCapture(photo.id)}
                              className="w-full h-64 border-3 border-dashed border-gray-300 rounded-xl 
                                hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300
                                flex flex-col items-center justify-center gap-4 group"
                            >
                              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-full 
                                shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                <Camera className="h-10 w-10 text-white" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-700 mb-1">Take Photo</p>
                                <p className="text-sm text-gray-500">Tap to open camera</p>
                              </div>
                            </button>
                          )}
                        </div>
                        
                        {/* Instructions */}
                        <div className="px-6 pb-6">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-xs text-gray-600">
                              <span className="font-semibold">Tip:</span> {
                                photo.id === 'front' ? 'Stand 10 feet away, center the vehicle' :
                                photo.id === 'rear' ? 'Include license plate if visible' :
                                photo.id === 'left' ? 'Capture from driver side' :
                                'Capture from passenger side'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Additional Damage Photos */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Camera className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Additional Damage Photos (Optional)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PHOTO_REQUIREMENTS.filter(p => !p.required).map((photo) => {
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
                              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50"
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
                    <span>Include entire vehicle in angle shots</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Focus on damaged areas clearly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Avoid shadows and reflections</span>
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
                <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 10MB</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Select Files
                </label>
              </div>
              
              {claimData.documents.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Uploaded Documents ({claimData.documents.length})</h3>
                  {claimData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-700">{doc.name}</span>
                      </div>
                      <button
                        onClick={() => setClaimData(prev => ({
                          ...prev,
                          documents: prev.documents.filter((_, i) => i !== index)
                        }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                      <span className="ml-2 text-gray-900">{claimData.incidentDate} at {claimData.incidentTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 text-gray-900">{claimData.incidentLocation}</span>
                    </div>
                    {claimData.policeReport && (
                      <div>
                        <span className="text-gray-600">Police Report:</span>
                        <span className="ml-2 text-gray-900">{claimData.policeReportNumber || 'Yes'}</span>
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
                      <span className="ml-2 text-gray-900">{claimData.vehicleYear} {claimData.vehicleMake} {claimData.vehicleModel}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">License Plate:</span>
                      <span className="ml-2 text-gray-900">{claimData.vehiclePlate}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-600 text-sm">Description:</span>
                    <p className="mt-1 text-sm text-gray-900">{claimData.description}</p>
                  </div>
                </div>
                
                {/* Photos Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    Photo Evidence
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
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
                      Documents
                    </h3>
                    <p className="text-sm text-gray-700">{claimData.documents.length} document(s) uploaded</p>
                  </div>
                )}
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> By submitting this claim, you confirm that all information provided is accurate 
                  and true. False or misleading information may result in claim denial.
                </p>
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
                onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
                disabled={!canProceedToNext()}
                className={`
                  group relative overflow-hidden transition-all duration-300 gap-2
                  ${!canProceedToNext() ? 'opacity-50' : 'hover:shadow-lg hover:scale-105'}
                  bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                `}
              >
                <span className="font-medium">Next Step</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                {canProceedToNext() && (
                  <ChevronRight className="h-4 w-4 opacity-50 animate-pulse" />
                )}
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
          
          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
            <Shield className="h-3 w-3" />
            <span>Your data is encrypted and secure</span>
          </div>
        </div>
      </main>
    </div>
  );
}
