import { useState } from 'react';

export default function MobileCameraTest() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<string>('');

  // Detect device type
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  useState(() => {
    setDeviceInfo(`
      Platform: ${navigator.platform}
      User Agent: ${navigator.userAgent}
      iOS: ${isIOS}
      Android: ${isAndroid}
    `);
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mobile Camera Test</h1>
      
      <div className="space-y-4">
        {/* Method 1: Standard capture */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Method 1: capture="user"</h2>
          <input
            type="file"
            accept="image/*"
            capture="user"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPhoto(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
            className="block w-full p-2 border rounded"
          />
        </div>

        {/* Method 2: capture="environment" */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Method 2: capture="environment"</h2>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPhoto(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
            className="block w-full p-2 border rounded"
          />
        </div>

        {/* Method 3: iOS specific */}
        {isIOS && (
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-2">Method 3: iOS specific</h2>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPhoto(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className="block w-full p-2 border rounded"
            />
          </div>
        )}

        {/* Method 4: Without accept */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Method 4: Only capture, no accept</h2>
          <input
            type="file"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPhoto(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
            className="block w-full p-2 border rounded"
          />
        </div>

        {/* Method 5: MediaDevices API */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Method 5: MediaDevices API</h2>
          <button
            onClick={async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                  video: { facingMode: 'environment' } 
                });
                alert('Camera access granted! (Would show camera UI here)');
                stream.getTracks().forEach(track => track.stop());
              } catch (error) {
                alert('Camera access denied or not available: ' + error);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Test Camera Access
          </button>
        </div>

        {/* Device Info */}
        <div className="border p-4 rounded bg-gray-100">
          <h2 className="font-semibold mb-2">Device Info</h2>
          <pre className="text-xs whitespace-pre-wrap">{deviceInfo}</pre>
        </div>

        {/* Photo Preview */}
        {photo && (
          <div>
            <h2 className="font-semibold mb-2">Captured Photo:</h2>
            <img src={photo} alt="Captured" className="w-full rounded" />
          </div>
        )}
      </div>
    </div>
  );
}
