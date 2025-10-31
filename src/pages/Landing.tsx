import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Shield, TrendingUp, Users, Zap, Star, ArrowRight, Sparkles } from 'lucide-react';

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
      icon: Zap,
      title: "Instant Claims Processing",
      description: "Submit and track claims in real-time with our advanced digital platform"
    },
    {
      icon: Shield,
      title: "Comprehensive Coverage",
      description: "Protection for all your assets with flexible, customizable insurance plans"
    },
    {
      icon: Users,
      title: "24/7 Customer Support",
      description: "Expert assistance available round the clock for all your insurance needs"
    },
    {
      icon: TrendingUp,
      title: "Competitive Rates",
      description: "Best-in-market premiums with transparent pricing and no hidden fees"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Policies" },
    { value: "98%", label: "Claim Approval" },
    { value: "24/7", label: "Support Available" },
    { value: "#1", label: "In Djibouti" }
  ];

  const testimonials = [
    {
      quote: "GXA's digital platform made filing my claim incredibly easy. The whole process took less than 24 hours!",
      author: "Amina Hassan",
      role: "Business Owner"
    },
    {
      quote: "Professional service and comprehensive coverage. GXA truly understands the needs of Djiboutian families.",
      author: "Mohamed Ali",
      role: "Family Customer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen pt-20">

        {/* Hero Section */}
        <main className="flex-grow">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-6">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-blue-200">Trusted by over 50,000 customers</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight">
                Protecting What
                <br />
                Matters Most
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience the future of insurance with GXA's innovative digital platform. 
                Fast claims, comprehensive coverage, and unmatched service excellence.
              </p>
            </div>

            {/* Access Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
              {/* User Access Card */}
              <div 
                onClick={handleUserAccess}
                className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 overflow-hidden animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-100 transition-colors">
                    Customer Portal
                  </h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Access your policies, submit claims, and manage your insurance portfolio with our intuitive digital platform.
                  </p>
                  <div className="flex items-center gap-2 text-blue-300 group-hover:text-blue-200 font-medium">
                    <span>Enter Dashboard</span>
                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Admin Access Card */}
              <div 
                onClick={handleAdminAccess}
                className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 overflow-hidden animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-400/30 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-100 transition-colors">
                    Admin Control
                  </h3>
                  <p className="text-purple-100 mb-6 leading-relaxed">
                    Manage claims, monitor performance, and access administrative tools for comprehensive insurance operations.
                  </p>
                  <div className="flex items-center gap-2 text-purple-300 group-hover:text-purple-200 font-medium">
                    <span>Admin Dashboard</span>
                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 animate-fade-in hover:bg-white/10"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <section id="features" className="mb-20">
              <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Why Choose GXA?
                </h2>
                <p className="text-blue-100 text-lg">Experience excellence in insurance services</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={index}
                      className="group p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:bg-white/10 animate-fade-in"
                      style={{ animationDelay: `${1 + index * 0.1}s` }}
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                      <p className="text-sm text-blue-100 leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="mb-20">
              <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '1.4s' }}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Trusted by Thousands
                </h2>
                <p className="text-blue-100 text-lg">See what our customers say about us</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${1.5 + index * 0.1}s` }}
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-blue-50 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-blue-300">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center py-16 animate-fade-in" style={{ animationDelay: '1.7s' }}>
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  Join thousands of satisfied customers who trust GXA for their insurance needs.
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                  Get Your Free Quote Today
                </button>
              </div>
            </section>
          </section>
        </main>

        {/* Footer */}
      </div>
      <Footer />
    </div>
  );
}