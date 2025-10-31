import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gxaLogo from '../assets/gxa-dashboard-logo.png';
import { 
  Bell, User, FileText, Clock, Users, BarChart, LogOut, Filter,
  TrendingUp, AlertCircle, CheckCircle, XCircle, Activity,
  Calendar, Search, Menu, Shield, Zap, Download
} from 'lucide-react';
import { Button } from './ui/button';
import { claimsService, type Claim } from '../lib/supabase';
import { cn } from '../lib/utils';
import Footer from './Footer';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
    avgProcessingTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data, error } = await claimsService.getAllClaims();
      
      if (error) {
        console.error('Error fetching claims:', error);
        setLoading(false);
        return;
      }
      
      const allClaims = data || [];
      setClaims(allClaims);
      
      // Calculate stats
      const total = allClaims.length;
      const pending = allClaims.filter(c => c.status === 'pending').length;
      const approved = allClaims.filter(c => c.status === 'approved').length;
      const rejected = allClaims.filter(c => c.status === 'rejected').length;
      const totalAmount = allClaims.reduce((sum) => sum + 50000, 0); // Mock amount for now
      
      setStats({
        total,
        pending,
        approved,
        rejected,
        totalAmount,
        avgProcessingTime: 2.5 // Mock for now
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (claimNumber: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await claimsService.updateClaimStatus(claimNumber, newStatus);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const exportReport = () => {
    // Create CSV content
    const headers = ['Claim Number', 'Customer', 'Type', 'Date', 'Amount', 'Status'];
    const rows = filteredClaims.map(claim => [
      claim.claim_number,
      claim.user_name || 'N/A',
      claim.claim_type || 'General',
      new Date(claim.created_at).toLocaleDateString(),
      claim.claim_amount ? `${claim.claim_amount} DJF` : 'N/A',
      claim.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `claims_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const statsConfig = [
    { 
      label: 'Total Claims', 
      value: stats.total.toString(), 
      icon: FileText, 
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      change: '+12%',
      trend: 'up'
    },
    { 
      label: 'Pending Review', 
      value: stats.pending.toString(), 
      icon: Clock, 
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      change: '-5%',
      trend: 'down'
    },
    { 
      label: 'Approved Claims', 
      value: stats.approved.toString(), 
      icon: CheckCircle, 
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      change: '+8%',
      trend: 'up'
    },
    { 
      label: 'Total Value', 
      value: `${(stats.totalAmount / 1000).toFixed(1)}K DJF`, 
      icon: BarChart, 
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      change: '+15%',
      trend: 'up'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': 
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: 'text-amber-600'
        };
      case 'approved': 
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: 'text-emerald-600'
        };
      case 'rejected': 
        return {
          bg: 'bg-gradient-to-r from-red-50 to-pink-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: 'text-red-600'
        };
      default: 
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: 'text-gray-600'
        };
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    const matchesSearch = claim.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claim_type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sidebarItems = [
    { icon: Activity, label: 'Dashboard', active: true, route: '/admin/dashboard' },
    { icon: FileText, label: 'Claims', count: stats.total, route: '/admin/claims' },
    { icon: Users, label: 'Customers', route: '/admin/customers' },
    { icon: Shield, label: 'Policies', route: '/admin/policies' },
    { icon: BarChart, label: 'Analytics', route: '/admin/analytics' },
    { icon: Zap, label: 'Automations', route: '/admin/automations' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Navbar with Blue Gradient */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors lg:hidden"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>
              <img src={gxaLogo} alt="GXA Assurances" className="h-10 brightness-0 invert" />
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-white">Admin Control Center</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 gap-2">
                <Search className="h-4 w-4 text-white/70" />
                <input
                  type="text"
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-white placeholder-white/50 outline-none w-48"
                />
              </div>
              
              {/* Notification Badge */}
              <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Bell className="h-5 w-5 text-white" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* User Menu */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5">
                <User className="h-5 w-5 text-white" />
                <span className="text-white font-medium hidden sm:block">Admin</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2 text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl transform transition-transform duration-300 z-40 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 space-y-2">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.route)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
                    item.active 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      item.active ? "bg-white/20" : "bg-gray-200"
                    )}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6">
          {/* Stats Grid with Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {statsConfig.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500",
                    stat.gradient
                  )} />
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                        stat.bgGradient
                      )}>
                        <div className={cn("p-2 rounded-lg bg-gradient-to-br", stat.gradient)}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {stat.value}
                        </p>
                        <div className={cn(
                          "flex items-center gap-1 text-sm font-medium mt-1",
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}>
                          <TrendingUp className={cn(
                            "h-4 w-4",
                            stat.trend === 'down' && "rotate-180"
                          )} />
                          {stat.change}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Claims Table Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Claims Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Process and review insurance claims</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-transparent outline-none text-sm font-medium text-gray-700"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <Button 
                    onClick={exportReport}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Claim ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClaims.map((claim, index) => {
                    const StatusIcon = getStatusIcon(claim.status);
                    const statusStyles = getStatusStyles(claim.status);
                    return (
                      <tr 
                        key={claim.claim_number} 
                        className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 group"
                        style={{ animationDelay: `${(index + 5) * 50}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse" />
                            <span className="font-semibold text-gray-900">{claim.claim_number}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {claim.user_name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{claim.user_name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{claim.user_email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full">
                            {claim.claim_type || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(claim.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">
                            {claim.claim_amount ? `${claim.claim_amount.toLocaleString()} DJF` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full w-fit border",
                            statusStyles.bg,
                            statusStyles.border
                          )}>
                            <StatusIcon className={cn("h-4 w-4", statusStyles.icon)} />
                            <span className={cn("text-sm font-medium capitalize", statusStyles.text)}>
                              {claim.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/admin/claims/${claim.claim_number}`)}
                              className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all"
                            >
                              Review
                            </Button>
                            {claim.status === 'pending' && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleStatusUpdate(claim.claim_number, 'approved')}
                                  className="p-2 hover:bg-green-100 rounded-lg transition-colors group/btn"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4 text-gray-600 group-hover/btn:text-green-600" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(claim.claim_number, 'rejected')}
                                  className="p-2 hover:bg-red-100 rounded-lg transition-colors group/btn"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4 text-gray-600 group-hover/btn:text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredClaims.length} of {claims.length} claims
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}