import { useState } from 'react';

export default function CameraTest() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const testCamera = (method: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    if (method === 'capture') {
      input.capture = 'environment';
    } else if (method === 'capture-attr') {
      input.setAttribute('capture', 'environment');
    } else if (method === 'capture-camera') {
      input.setAttribute('capture', 'camera');
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Camera Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold mb-2">Method 1: Direct Input</h2>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPhoto(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="block w-full p-2 border rounded"
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Method 2: Button Tests</h2>
          <div className="space-y-2">
            <button
              onClick={() => testCamera('capture')}
              className="w-full p-3 bg-blue-500 text-white rounded"
            >
              Test with capture property
            </button>
            
            <button
              onClick={() => testCamera('capture-attr')}
              className="w-full p-3 bg-green-500 text-white rounded"
            >
              Test with setAttribute('capture', 'environment')
            </button>
            
            <button
              onClick={() => testCamera('capture-camera')}
              className="w-full p-3 bg-purple-500 text-white rounded"
            >
              Test with setAttribute('capture', 'camera')
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Device Info:</h2>
          <div className="text-sm bg-gray-100 p-2 rounded">
            <p>User Agent: {navigator.userAgent}</p>
            <p>Platform: {navigator.platform}</p>
            <p>Secure Context: {window.isSecureContext ? 'Yes' : 'No'}</p>
            <p>Protocol: {location.protocol}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

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
