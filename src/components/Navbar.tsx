import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gxaLogo from '../assets/gxa-logo.png';
import { 
  Menu, X, Phone, ChevronDown, Shield, Car, Home, 
  Heart, Briefcase, FileText, Users, LogIn, UserPlus,
  Calculator, MessageCircle, Globe, ExternalLink, LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const products = [
    { icon: Car, label: 'Auto Insurance', href: '/products/auto', description: 'Comprehensive vehicle coverage' },
    { icon: Home, label: 'Home Insurance', href: '/products/home', description: 'Protect your property' },
    { icon: Heart, label: 'Life Insurance', href: '/products/life', description: 'Secure your family\'s future' },
    { icon: Shield, label: 'Health Insurance', href: '/products/health', description: 'Quality healthcare coverage' },
    { icon: Briefcase, label: 'Business Insurance', href: '/products/business', description: 'Commercial protection' },
  ];

  const services = [
    { icon: FileText, label: 'File a Claim', href: '/claim/type-selection', description: 'Quick and easy claims' },
    { icon: Calculator, label: 'Get a Quote', href: '/quote', description: 'Instant price estimates' },
    { icon: Users, label: 'Find an Agent', href: '/agents', description: 'Local expert assistance' },
    { icon: MessageCircle, label: 'Support Center', href: '/support', description: '24/7 customer service' },
  ];

  const navItems = [
    {
      label: 'Products',
      dropdown: products,
    },
    {
      label: 'Services',
      dropdown: services,
    },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isAuthPage = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');
  const isLandingPage = location.pathname === '/';

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      // Keep gradient on landing page regardless of scroll
      isLandingPage ? "bg-gradient-to-r from-blue-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-md" :
      // For other pages, use white background
      "bg-white/95 backdrop-blur-md shadow-lg"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={gxaLogo} 
                alt="GXA Assurances" 
                className="h-12 w-auto transition-transform group-hover:scale-105" 
              />
              <div className="hidden sm:block">
                <h1 className={cn(
                  "text-xl font-bold transition-colors",
                  isLandingPage ? "text-white" : "text-gray-900"
                )}>
                  GXA Assurances
                </h1>
                <p className={cn(
                  "text-xs transition-colors",
                  isLandingPage ? "text-blue-200" : "text-gray-600"
                )}>
                  Le Pro qui Assure
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Main Nav Items */}
            <div className="flex items-center gap-6">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className={cn(
                          "flex items-center gap-1 py-2 font-medium transition-colors",
                          isLandingPage ? "text-white/90 hover:text-white" : "text-gray-700 hover:text-blue-600"
                        )}
                      >
                        {item.label}
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          activeDropdown === item.label && "rotate-180"
                        )} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in">
                          <div className="py-2">
                            {item.dropdown.map((subItem, subIndex) => {
                              const Icon = subItem.icon;
                              return (
                                <Link
                                  key={subIndex}
                                  to={subItem.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                                    <Icon className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{subItem.label}</p>
                                    <p className="text-sm text-gray-600">{subItem.description}</p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href!}
                      className={cn(
                        "py-2 font-medium transition-colors",
                        isLandingPage ? "text-white/90 hover:text-white" : "text-gray-700 hover:text-blue-600"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              {/* Emergency Hotline */}
              <a
                href="tel:+25321359911"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                  isLandingPage ? "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30" : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                )}
              >
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">Emergency</span>
                <span className="font-bold">21 35 99 11</span>
              </a>

              {/* Auth Buttons */}
              {!isAuthPage ? (
                <>
                  <button
                    onClick={() => navigate('/user/dashboard')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                      isLandingPage ? "text-white/90 hover:text-white" : "text-gray-700 hover:text-blue-600"
                    )}
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/quote')}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Quote
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isLandingPage ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className={cn(
            "lg:hidden fixed inset-x-0 top-20 shadow-xl z-40 max-h-[50vh] overflow-y-auto",
            isLandingPage 
              ? "bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" 
              : "bg-white"
          )}>
            <div className="px-4 py-6 space-y-6">
            {/* Emergency Hotline Mobile */}
            <a
              href="tel:+25321359911"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium"
            >
              <Phone className="h-5 w-5" />
              <span>Emergency: 21 35 99 11</span>
            </a>

            {/* Mobile Nav Items */}
            {navItems.map((item, index) => (
              <div key={index} className={cn(
                "border-b pb-4",
                isLandingPage ? "border-white/20" : "border-gray-100"
              )}>
                {item.dropdown ? (
                  <div>
                    <h3 className={cn(
                      "font-semibold mb-3",
                      isLandingPage ? "text-white" : "text-gray-900"
                    )}>{item.label}</h3>
                    <div className="space-y-2">
                      {item.dropdown.map((subItem, subIndex) => {
                        const Icon = subItem.icon;
                        return (
                          <Link
                            key={subIndex}
                            to={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg transition-colors",
                              isLandingPage 
                                ? "hover:bg-white/10" 
                                : "hover:bg-gray-50"
                            )}
                          >
                            <Icon className={cn(
                              "h-5 w-5",
                              isLandingPage ? "text-blue-300" : "text-blue-600"
                            )} />
                            <div>
                              <p className={cn(
                                "font-medium",
                                isLandingPage ? "text-white" : "text-gray-900"
                              )}>{subItem.label}</p>
                              <p className={cn(
                                "text-xs",
                                isLandingPage ? "text-blue-200" : "text-gray-600"
                              )}>{subItem.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href!}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block py-3 font-medium",
                      isLandingPage 
                        ? "text-white hover:text-blue-300" 
                        : "text-gray-900 hover:text-blue-600"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile CTA Buttons */}
            {!isAuthPage ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigate('/user/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('/quote');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
                >
                  Get Quote
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            )}

            {/* Language Selector */}
            <div className={cn(
              "pt-4 border-t",
              isLandingPage ? "border-white/20" : "border-gray-100"
            )}>
              <div className={cn(
                "flex items-center justify-center gap-2",
                isLandingPage ? "text-white" : "text-gray-600"
              )}>
                <Globe className="h-4 w-4" />
                <select className={cn(
                  "bg-transparent outline-none text-sm",
                  isLandingPage && "text-white [&>option]:text-gray-900"
                )}>
                  <option>English</option>
                  <option>Français</option>
                  <option>العربية</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </nav>
  );
}
