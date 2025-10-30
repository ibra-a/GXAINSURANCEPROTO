import { useNavigate } from 'react-router-dom';
import { 
  Car, Home, Heart, Plane, Package, Briefcase, 
  Users, ChevronRight, Clock, FileText, ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';
import gxaLogo from '../assets/gxa-dashboard-logo.png';

interface ClaimType {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  available: boolean;
  estimatedTime?: string;
  documentsNeeded?: string[];
}

export default function ClaimTypeSelection() {
  const navigate = useNavigate();

  const claimTypes: ClaimType[] = [
    {
      id: 'vehicle',
      title: 'Auto/Vehicle Claims',
      description: 'Cars, motorcycles, trucks - accidents, theft, damage',
      icon: Car,
      color: 'from-blue-500 to-indigo-600',
      available: true,
      estimatedTime: '48 hours',
      documentsNeeded: ['Photos of damage', 'Police report', 'Driver license']
    },
    {
      id: 'property',
      title: 'Property Insurance',
      description: 'Home, business, contents damage or loss',
      icon: Home,
      color: 'from-purple-500 to-pink-600',
      available: false,
      estimatedTime: '72 hours'
    },
    {
      id: 'health',
      title: 'Health Insurance',
      description: 'Medical claims, hospital bills, treatments',
      icon: Heart,
      color: 'from-red-500 to-rose-600',
      available: false,
      estimatedTime: '5 days'
    },
    {
      id: 'travel',
      title: 'Travel Insurance',
      description: 'Trip cancellation, medical abroad, lost luggage',
      icon: Plane,
      color: 'from-cyan-500 to-blue-600',
      available: false,
      estimatedTime: '72 hours'
    },
    {
      id: 'cargo',
      title: 'Cargo/Marine',
      description: 'Shipping damage, import/export claims',
      icon: Package,
      color: 'from-green-500 to-emerald-600',
      available: false,
      estimatedTime: '5 days'
    },
    {
      id: 'business',
      title: 'Business Insurance',
      description: 'Liability, equipment damage, business interruption',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-600',
      available: false,
      estimatedTime: '7 days'
    }
  ];

  const handleClaimTypeSelect = (claimType: ClaimType) => {
    if (claimType.available) {
      if (claimType.id === 'vehicle') {
        navigate('/claim/vehicle/new');
      }
      // Add other claim type routes as they become available
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/user/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <img src={gxaLogo} alt="GXA Assurances" className="h-10" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">New Claim</h1>
                <p className="text-xs text-gray-500">Select claim type</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What type of claim do you need to file?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the category that best matches your claim. Our digital system will guide you through the process.
          </p>
        </div>

        {/* Claim Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {claimTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleClaimTypeSelect(type)}
                disabled={!type.available}
                className={`
                  relative group overflow-hidden rounded-2xl transition-all duration-300
                  ${type.available 
                    ? 'hover:scale-105 hover:shadow-2xl cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                  }
                `}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} 
                  ${type.available ? 'opacity-90 group-hover:opacity-100' : 'opacity-50'}`}
                ></div>
                
                {/* Glass Effect */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                
                {/* Content */}
                <div className="relative p-6 h-full flex flex-col">
                  {/* Coming Soon Badge */}
                  {!type.available && (
                    <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="inline-flex p-4 bg-white/20 backdrop-blur-md rounded-2xl group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{type.description}</p>
                  </div>
                  
                  {/* Bottom Info */}
                  {type.available && (
                    <div className="pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between text-white/80 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {type.estimatedTime}
                        </span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              </button>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Tip: Have Your Documents Ready</h3>
              <p className="text-gray-600 text-sm mb-3">
                For faster processing, prepare these documents before starting your claim:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Photos of the incident/damage</li>
                <li>• Your policy number</li>
                <li>• Police report (if applicable)</li>
                <li>• Any receipts or estimates</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
