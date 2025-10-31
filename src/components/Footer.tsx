import { Link } from 'react-router-dom';
import gxaLogo from '../assets/gxa-logo.png';
import { 
  Phone, Mail, MapPin, Clock, Shield, Award, 
  Facebook, Twitter, Linkedin, Instagram,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About GXA', href: '/about' },
    { label: 'Our Services', href: '/services' },
    { label: 'Claims Process', href: '/claims-info' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Career Opportunities', href: '/careers' },
  ];

  const insuranceProducts = [
    { label: 'Auto Insurance', href: '/products/auto' },
    { label: 'Home Insurance', href: '/products/home' },
    { label: 'Life Insurance', href: '/products/life' },
    { label: 'Health Insurance', href: '/products/health' },
    { label: 'Business Insurance', href: '/products/business' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Regulatory Information', href: '/regulatory' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={gxaLogo} alt="GXA Assurances" className="h-12 w-auto" />
                <div>
                  <h3 className="text-xl font-bold">GXA Assurances</h3>
                  <p className="text-xs text-gray-400">Djibouti's Premier Insurance</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Protecting Djibouti since establishment, GXA Assurances is the nation's largest and most trusted insurance provider, 
                offering comprehensive coverage and unmatched service excellence.
              </p>
              {/* Trust Badges */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>Licensed & Regulated</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Award className="h-4 w-4 text-blue-400" />
                  <span>#1 in Djibouti</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-sm text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1 group"
                    >
                      <ChevronRight className="h-3 w-3 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Our Products</h4>
              <ul className="space-y-2">
                {insuranceProducts.map((product, index) => (
                  <li key={index}>
                    <Link 
                      to={product.href}
                      className="text-sm text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1 group"
                    >
                      <ChevronRight className="h-3 w-3 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      {product.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-300">GXA Headquarters</p>
                    <p className="text-xs text-gray-400">Boulevard de Gaulle, Djibouti City</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-300">+253 21 35 XX XX</p>
                    <p className="text-xs text-gray-400">24/7 Claims Hotline</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <a 
                    href="mailto:contact@gxaonline.com" 
                    className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    contact@gxaonline.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-300">Mon - Thu: 8:00 - 17:00</p>
                    <p className="text-xs text-gray-400">Fri - Sat: 8:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright & Legal */}
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
                <p>© {currentYear} GXA Assurances. All rights reserved.</p>
                <div className="hidden md:block w-px h-4 bg-gray-600" />
                <div className="flex items-center gap-4">
                  {legalLinks.map((link, index) => (
                    <Link 
                      key={index}
                      to={link.href}
                      className="hover:text-gray-200 transition-colors text-xs"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 mr-2">Follow Us:</span>
                <a 
                  href="https://facebook.com/gxaassurances" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-all duration-300 group"
                >
                  <Facebook className="h-4 w-4 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://twitter.com/gxaassurances" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-500 transition-all duration-300 group"
                >
                  <Twitter className="h-4 w-4 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://linkedin.com/company/gxaassurances" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-700 transition-all duration-300 group"
                >
                  <Linkedin className="h-4 w-4 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://instagram.com/gxaassurances" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all duration-300 group"
                >
                  <Instagram className="h-4 w-4 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center animate-pulse">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">24/7 Emergency Claims Assistance</p>
                    <p className="text-xs text-gray-300">
                      For accidents and emergencies, call our dedicated hotline at <span className="font-bold text-orange-400">+253 21 35 99 11</span>
                    </p>
                  </div>
                  <a 
                    href="tel:+25321359911"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
