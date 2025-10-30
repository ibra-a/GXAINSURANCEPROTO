import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gxaLogo from '../assets/gxa-dashboard-logo.png';
import { 
  Bell, FileText, Clock, CheckCircle, 
  LogOut, Plus, TrendingUp, Shield, Car,
  ChevronRight, Activity, Calendar,
  Camera, FileCheck, Globe,
  MapPin, Phone, Mail, Zap, X
} from 'lucide-react';
import { Button } from './ui/button';
import { claimsService, type Claim } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';

export function UserDashboard() {
  const navigate = useNavigate();
  const [showNewClaim, setShowNewClaim] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Current user - in real app, this would come from auth
  const currentUser = "Ahmed Mohamed Hassan";

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load user claims
      const { data: claimsData, error: claimsError } = await claimsService.getUserClaims(currentUser);
      if (!claimsError && claimsData) {
        setClaims(claimsData);
      }

      // Load stats
      const { data: statsData, error: statsError } = await claimsService.getClaimStats(currentUser);
      if (!statsError && statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    { 
      label: 'Total Claims', 
      value: stats.total.toString(), 
      icon: FileText, 
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'bg-blue-50',
      trend: 'All time claims',
      trendUp: true,
      description: 'Total claims submitted'
    },
    { 
      label: 'Pending Review', 
      value: stats.pending.toString(), 
      icon: Clock, 
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      trend: 'Awaiting processing',
      trendUp: null,
      description: 'Claims under review'
    },
    { 
      label: 'Approved', 
      value: stats.approved.toString(), 
      icon: CheckCircle, 
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-green-50',
      trend: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% approval rate`,
      trendUp: true,
      description: 'Successfully processed'
    },
    { 
      label: 'Rejected', 
      value: stats.rejected.toString(), 
      icon: X, 
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      trend: 'Claims rejected',
      trendUp: false,
      description: 'Not approved'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border-amber-200';
      case 'approved': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getClaimIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('collision') || desc.includes('accident')) return Car;
    if (desc.includes('theft') || desc.includes('volé')) return Shield;
    if (desc.includes('fire') || desc.includes('feu')) return Activity;
    return FileText;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with GXA Online Branding */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img src={gxaLogo} alt="GXA Assurances" className="h-10 drop-shadow-sm" />
              <div className="hidden md:flex items-center gap-2">
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Claims Portal
                </h1>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  Digital
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">gxaonline.com</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative hover:bg-blue-50"
              >
                <Bell className="h-5 w-5" />
                {stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {stats.pending}
                  </span>
                )}
              </Button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-md">
                  {currentUser.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="gap-2 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Digital Claims Focus */}
        <div className="mb-8 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-48 translate-y-48"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-5 w-5" />
              <span className="text-blue-100 text-sm">GXA Digital Claims Platform</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {currentUser}
            </h2>
            <p className="text-blue-100 text-lg mb-6">
              Submit, track, and manage your claims digitally - anytime, anywhere
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Zap, text: 'Instant claim submission' },
                { icon: Camera, text: 'Photo evidence upload' },
                { icon: Clock, text: '24/7 claim tracking' },
                { icon: Shield, text: 'Secure digital process' }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                    <Icon className="h-4 w-4 text-blue-200" />
                    <span className="text-sm text-white">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105"
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                {/* Gradient Background Card */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
                
                {/* Content */}
                <div className="relative p-6">
                  {/* Top Section */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                      {/* Icon Background Glow */}
                      <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150"></div>
                      <div className="relative bg-white/20 backdrop-blur-md p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    
                    {/* Trend Indicator */}
                    {stat.trendUp !== null && (
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <TrendingUp className={`h-3.5 w-3.5 text-white ${!stat.trendUp && 'rotate-180'}`} />
                        <span className="text-xs text-white font-medium">
                          {stat.trendUp ? '+' : '-'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Stats Content */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-4xl font-bold text-white mb-1 tracking-tight">{stat.value}</p>
                      <p className="text-white/90 font-medium text-base">{stat.label}</p>
                    </div>
                    
                    {/* Bottom Info */}
                    <div className="pt-3 border-t border-white/20">
                      <p className="text-white/80 text-sm">{stat.trend}</p>
                      {hoveredStat === index && (
                        <p className="text-white/60 text-xs mt-1 animate-fade-in">
                          {stat.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowNewClaim(true)}
              className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl text-white hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-base">New Claim</h4>
                  <p className="text-xs text-white/80 mt-1">File a new accident claim</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {}}
              className="group relative bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl text-white hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCheck className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-base">Track Claim</h4>
                  <p className="text-xs text-white/80 mt-1">Check claim status</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {}}
              className="group relative bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-2xl text-white hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-base">Message</h4>
                  <p className="text-xs text-white/80 mt-1">Contact support</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {}}
              className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl text-white hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-base">Call Us</h4>
                  <p className="text-xs text-white/80 mt-1">24/7 assistance</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Claims from Supabase */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Your Claims History</h3>
                <p className="text-sm text-gray-500 mt-1">All your claims from gxaonline.com database</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                View All Claims
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {claims.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No claims found</p>
                <p className="text-sm text-gray-500 mt-1">Submit your first claim to get started</p>
              </div>
            ) : (
              claims.map((claim) => {
                const Icon = getClaimIcon(claim.accident_description);
                const progress = claim.status === 'approved' ? 100 : claim.status === 'rejected' ? 100 : 50;
                
                return (
                  <div key={claim.id} className="p-6 hover:bg-gray-50 transition-all cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg group-hover:scale-105 transition-transform">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-gray-900">{claim.claim_number}</h4>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(claim.status)}`}>
                                {claim.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                • Updated {formatDate(claim.updated_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5" />
                              {claim.vehicle_make} {claim.vehicle_model} - {claim.vehicle_plate}
                            </p>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                              {claim.accident_description}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(claim.accident_datetime)}
                              </span>
                              {claim.photo_urls?.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Camera className="h-3.5 w-3.5" />
                                  {claim.photo_urls.length} photos
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                {claim.contact_phone}
                              </span>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Processing Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${
                                claim.status === 'approved' ? 'from-green-500 to-emerald-600' : 
                                claim.status === 'pending' ? 'from-yellow-500 to-amber-600' : 
                                'from-red-500 to-rose-600'
                              } transition-all duration-500 ease-out`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Digital Platform Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">GXA Digital Claims Platform</h4>
              <p className="text-sm text-gray-600 mb-3">
                Experience the future of insurance claims processing. Submit claims instantly, track progress in real-time, 
                and receive faster payouts - all through gxaonline.com
              </p>
              <div className="flex items-center gap-4 text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  21 35 36 36
                </a>
                <span className="text-gray-400">•</span>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  claims@gxaonline.com
                </a>
                <span className="text-gray-400">•</span>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Djibouti, BP200
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Digital Claim Submission Modal */}
      {showNewClaim && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 transform transition-all duration-300 scale-100 shadow-2xl">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-xl opacity-50"></div>
                <div className="relative inline-flex p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <Camera className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Digital Claim Submission</h3>
              <p className="text-gray-600">
                Submit your insurance claim in minutes through gxaonline.com
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  How it works
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Take Photos</p>
                      <p className="text-xs text-gray-600">Capture damage from multiple angles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Fill Details</p>
                      <p className="text-xs text-gray-600">Provide accident information digitally</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Submit & Track</p>
                      <p className="text-xs text-gray-600">Get instant claim ID and real-time updates</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Average processing time: 48 hours</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline"
                onClick={() => setShowNewClaim(false)} 
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  // In real app, navigate to claim submission form
                  setShowNewClaim(false);
                }} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Start Claim
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}