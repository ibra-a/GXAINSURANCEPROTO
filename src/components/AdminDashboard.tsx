import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gxaLogo from '../assets/gxa-dashboard-logo.png';
import { Bell, User, FileText, Clock, Users, BarChart, LogOut, Filter } from 'lucide-react';
import { Button } from './ui/button';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    { label: 'Total Claims', value: '256', icon: FileText, color: 'bg-purple-500' },
    { label: 'Pending Review', value: '45', icon: Clock, color: 'bg-yellow-500' },
    { label: 'Active Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { label: 'Monthly Revenue', value: '12.5M DJF', icon: BarChart, color: 'bg-green-500' },
  ];

  const claims = [
    { id: 'CLM-2024-001', user: 'Ahmed Hassan', date: '2024-10-28', type: 'Collision', status: 'pending', amount: '45,000 DJF', priority: 'high' },
    { id: 'CLM-2024-002', user: 'Fatima Ali', date: '2024-10-25', type: 'Theft', status: 'pending', amount: '120,000 DJF', priority: 'urgent' },
    { id: 'CLM-2024-003', user: 'Omar Youssef', date: '2024-10-20', type: 'Fire Damage', status: 'approved', amount: '85,000 DJF', priority: 'medium' },
    { id: 'CLM-2024-004', user: 'Amina Ibrahim', date: '2024-10-18', type: 'Vandalism', status: 'rejected', amount: '30,000 DJF', priority: 'low' },
    { id: 'CLM-2024-005', user: 'Hassan Mohamed', date: '2024-10-15', type: 'Collision', status: 'approved', amount: '95,000 DJF', priority: 'medium' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 font-semibold';
      case 'high': return 'text-orange-600 font-semibold';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const filteredClaims = filterStatus === 'all' 
    ? claims 
    : claims.filter(claim => claim.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img src={gxaLogo} alt="GXA Assurances" className="h-10" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Control Panel
          </h2>
          <p className="text-gray-600">
            Manage and process insurance claims efficiently
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Claims Management</h3>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Claims</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claim ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {claim.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {claim.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {claim.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {claim.type}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getPriorityColor(claim.priority)}`}>
                      {claim.priority.charAt(0).toUpperCase() + claim.priority.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {claim.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
