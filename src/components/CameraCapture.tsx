import { useState, useRef, useCallback } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface CameraCaptureProps {
  onCapture: (file: File, metadata: any) => void;
  onClose: () => void;
  photoType: string;
  instructions?: string;
}

export default function CameraCapture({ 
  onCapture, 
  onClose, 
  photoType,
  instructions 
}: CameraCaptureProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capturePhoto = useCallback(async (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Capture metadata
    const captureMetadata = {
      timestamp: new Date().toISOString(),
      photoType,
      fileSize: file.size,
      mimeType: file.type,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      devicePixelRatio: window.devicePixelRatio,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown',
      location: null as GeolocationPosition | null,
    };

    // Try to get location
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: true
          });
        });
        captureMetadata.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        } as any;
      } catch (error) {
        console.log('Location access denied or unavailable');
      }
    }

    setCapturedFile(file);
    setMetadata(captureMetadata);
  }, [photoType]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      capturePhoto(file);
    }
  };

  const handleRetake = () => {
    setImagePreview(null);
    setCapturedFile(null);
    setMetadata(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleUsePhoto = () => {
    if (capturedFile && metadata) {
      onCapture(capturedFile, metadata);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-white font-semibold text-lg">{photoType}</h2>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!imagePreview ? (
          <>
            {/* Camera Interface */}
            <div className="w-full max-w-md">
              {instructions && (
                <p className="text-white/80 text-center mb-6">{instructions}</p>
              )}
              
              <label
                htmlFor="camera-input"
                className="block cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center hover:border-gray-500 transition-colors">
                  <Camera className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-400 text-center px-4">
                    Tap to open camera
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Make sure to capture the entire {photoType.toLowerCase()}
                  </p>
                </div>
              </label>
              
              <input
                ref={fileInputRef}
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </>
        ) : (
          <>
            {/* Preview */}
            <div className="w-full max-w-md">
              <div className="aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Captured photo"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleRetake}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                  Retake
                </button>
                <button
                  onClick={handleUsePhoto}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  <Check className="h-5 w-5" />
                  Use Photo
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Instructions Footer */}
      <div className="bg-black/80 backdrop-blur-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <p>Photos are required for claim verification</p>
          </div>
        </div>
      </div>
    </div>
  );
}
