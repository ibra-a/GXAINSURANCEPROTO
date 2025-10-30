import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/gxa-logo.png';

// SVG Icons as components
const UserCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Phone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Smartphone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Zap = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Globe = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

export default function Landing() {
  const navigate = useNavigate();

  const handleUserAccess = () => {
    navigate('/user/dashboard');
  };

  const handleAdminAccess = () => {
    navigate('/admin/dashboard');
  };

  const features = [
    {
      icon: FileText,
      title: "Digital Claims",
      description: "Submit and track claims instantly"
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description: "Manage policies on the go"
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description: "Bank-level security standards"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5B8FF9] via-[#4169E1] to-[#3B5DE7] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-4 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              <Globe className="w-3 h-3" />
              www.gxaonline.com
            </span>
            <div className="flex items-center gap-4">
              <button className="text-white hover:bg-white/20 px-4 py-2 rounded-md transition-colors hidden md:flex items-center gap-2">
                <Phone className="w-4 h-4" />
                21 35 36 36
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-7xl space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-block">
                <img 
                  src={logoImage} 
                  alt="GXA Assurances" 
                  className="w-full max-w-2xl md:max-w-3xl h-auto mx-auto drop-shadow-2xl"
                />
              </div>
              
              <div className="space-y-3">
                <h1 className="text-white text-2xl md:text-4xl tracking-wide">
                  Welcome to Your Digital Insurance Platform
                </h1>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
                  Secure, fast, and reliable insurance management for Djibouti
                </p>
              </div>
            </div>

            {/* Access Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* User Access Card */}
              <div className="group bg-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 overflow-hidden relative rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B8FF9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 md:p-10 flex flex-col space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="bg-gradient-to-br from-[#5B8FF9] to-[#4169E1] p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <UserCircle className="w-12 h-12 text-white" />
                    </div>
                    <span className="bg-[#5B8FF9]/10 text-[#4169E1] border border-[#5B8FF9]/20 px-3 py-1 rounded-md text-sm">
                      For Clients
                    </span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <h2 className="text-[#3B5DE7] text-2xl font-semibold">User Access</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Access your insurance policies, submit claims, view coverage details, and manage your personal information securely.
                    </p>
                    
                    <div className="my-4 h-px bg-gray-200"></div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-700">
                        <Shield className="w-4 h-4 mr-3 text-[#5B8FF9] flex-shrink-0" />
                        View all your policies
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <Zap className="w-4 h-4 mr-3 text-[#5B8FF9] flex-shrink-0" />
                        Submit claims instantly
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <Clock className="w-4 h-4 mr-3 text-[#5B8FF9] flex-shrink-0" />
                        Track claim status 24/7
                      </li>
                    </ul>
                  </div>
                  
                  <button 
                    onClick={handleUserAccess}
                    className="w-full bg-gradient-to-r from-[#5B8FF9] to-[#4169E1] hover:from-[#4169E1] hover:to-[#3B5DE7] text-white shadow-lg group-hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-md flex items-center justify-center gap-2 font-medium"
                  >
                    Login as User
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Admin Access Card */}
              <div className="group bg-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 overflow-hidden relative rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B5DE7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 md:p-10 flex flex-col space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="bg-gradient-to-br from-[#3B5DE7] to-[#2E4AB8] p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <span className="bg-[#3B5DE7]/10 text-[#3B5DE7] border border-[#3B5DE7]/20 px-3 py-1 rounded-md text-sm">
                      For Staff
                    </span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <h2 className="text-[#3B5DE7] text-2xl font-semibold">Admin Access</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Manage client policies, process claims, access comprehensive analytics, and utilize administrative tools.
                    </p>
                    
                    <div className="my-4 h-px bg-gray-200"></div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-700">
                        <Shield className="w-4 h-4 mr-3 text-[#3B5DE7] flex-shrink-0" />
                        Manage all client policies
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <Zap className="w-4 h-4 mr-3 text-[#3B5DE7] flex-shrink-0" />
                        Process claims efficiently
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <Clock className="w-4 h-4 mr-3 text-[#3B5DE7] flex-shrink-0" />
                        Real-time analytics dashboard
                      </li>
                    </ul>
                  </div>
                  
                  <button 
                    onClick={handleAdminAccess}
                    className="w-full bg-gradient-to-r from-[#3B5DE7] to-[#2E4AB8] hover:from-[#2E4AB8] hover:to-[#1E3A8A] text-white shadow-lg group-hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-md flex items-center justify-center gap-2 font-medium"
                  >
                    Login as Admin
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white border-0 p-8 md:p-10 shadow-2xl rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div 
                        key={index}
                        className="text-center space-y-3 group cursor-default"
                      >
                        <div className="bg-gradient-to-br from-[#5B8FF9]/10 to-[#4169E1]/10 p-4 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-7 h-7 text-[#4169E1]" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-900 font-medium">{feature.title}</p>
                          <p className="text-xs text-gray-600 hidden md:block">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white border-0 p-6 md:p-8 shadow-xl rounded-xl">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col md:flex-row items-center gap-4 group cursor-default">
                    <div className="bg-gradient-to-br from-[#5B8FF9] to-[#4169E1] p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-[#3B5DE7] font-medium">21 35 36 36</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4 group cursor-default">
                    <div className="bg-gradient-to-br from-[#5B8FF9] to-[#4169E1] p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-[#3B5DE7] font-medium">accueil@gxaonline.com</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4 group cursor-default">
                    <div className="bg-gradient-to-br from-[#5B8FF9] to-[#4169E1] p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                      <p className="text-[#3B5DE7] font-medium">Djibouti, BP200</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 text-center">
          <div className="space-y-2">
            <p className="text-white text-xl md:text-2xl tracking-wider">LE PRO QUI ASSURE</p>
            <p className="text-white/70 text-sm">© 2025 GXA Assurances. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
