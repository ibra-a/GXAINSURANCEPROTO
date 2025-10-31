import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RotateCcw, Check, Video } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    
    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setIsLoading(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please use a device with a camera.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is already in use. Please close other apps using the camera.');
      } else {
        setError(`Camera error: ${err.message || 'Unable to access camera'}`);
      }
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [startCamera]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Create File from blob
      const file = new File([blob], `gxa_claim_${photoType}_${Date.now()}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      // Create preview
      const previewUrl = URL.createObjectURL(blob);
      setImagePreview(previewUrl);

      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Capture metadata
      const metadata = {
        timestamp: new Date().toISOString(),
        photoType,
        fileSize: file.size,
        mimeType: file.type,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        devicePixelRatio: window.devicePixelRatio,
        connectionType: (navigator as any).connection?.effectiveType || 'unknown',
        facingMode,
        location: null as any,
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
          metadata.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
        } catch (locError) {
          console.log('Location not available');
        }
      }

      // Store file and metadata temporarily for retake/use actions
      (window as any).__capturedFile = file;
      (window as any).__capturedMetadata = metadata;
    }, 'image/jpeg', 0.95);
  }, [photoType, facingMode]);

  const handleRetake = () => {
    setImagePreview(null);
    if ((window as any).__capturedFile) {
      delete (window as any).__capturedFile;
    }
    if ((window as any).__capturedMetadata) {
      delete (window as any).__capturedMetadata;
    }
    // Restart camera
    startCamera();
  };

  const handleUsePhoto = () => {
    const file = (window as any).__capturedFile;
    const metadata = (window as any).__capturedMetadata;
    
    if (file && metadata) {
      onCapture(file, metadata);
      // Cleanup
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      delete (window as any).__capturedFile;
      delete (window as any).__capturedMetadata;
    }
  };

  const toggleCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    // startCamera will be called automatically via useEffect
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm p-4 flex items-center justify-between z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-white font-semibold text-lg capitalize">{photoType}</h2>
        {!imagePreview && (
          <button
            onClick={toggleCamera}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            title="Switch camera"
          >
            <Video className="h-6 w-6" />
          </button>
        )}
        {imagePreview && <div className="w-10" />}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {error ? (
          <div className="text-center p-8">
            <div className="bg-red-500/20 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Camera className="h-10 w-10 text-red-400" />
            </div>
            <p className="text-white text-lg mb-2">Camera Error</p>
            <p className="text-red-300 mb-6 max-w-md">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !imagePreview ? (
          <>
            {/* Live Camera View */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
                  <p className="text-white/80">Starting camera...</p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: isLoading ? 'none' : 'block' }}
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="border-4 border-white/50 rounded-lg w-[90%] max-w-md aspect-[4/3] flex flex-col items-center justify-center">
                {instructions && (
                  <p className="text-white text-center px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm mt-4">
                    {instructions}
                  </p>
                )}
              </div>
            </div>

            {/* Capture Button */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                onClick={capturePhoto}
                disabled={isLoading}
                className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center shadow-2xl hover:scale-105 transition-transform disabled:opacity-50"
              >
                <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400"></div>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Preview */}
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-md aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden mb-6">
                <img
                  src={imagePreview}
                  alt="Captured photo"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 w-full max-w-md">
                <button
                  onClick={handleRetake}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                  Retake
                </button>
                <button
                  onClick={handleUsePhoto}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
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
      {!imagePreview && !error && (
        <div className="bg-black/90 backdrop-blur-sm p-4 z-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-2 text-yellow-400 text-sm justify-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <p>Tap the white circle to capture photo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
