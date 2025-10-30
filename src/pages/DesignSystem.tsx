import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/Badge';
import { Card, CardHeader, CardContent } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NotificationToast } from '../components/NotificationToast';
import { 
  ArrowLeft, Palette, Type, Box, Zap, Globe,
  ChevronRight, Star, Heart, Shield, Bell,
  CheckCircle, X, AlertCircle, Info
} from 'lucide-react';

export default function DesignSystem() {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const colors = [
    { name: 'Primary Blue', class: 'bg-blue-500', hex: '#5B8FF9' },
    { name: 'Primary Indigo', class: 'bg-indigo-600', hex: '#4169E1' },
    { name: 'Secondary Purple', class: 'bg-purple-500', hex: '#A855F7' },
    { name: 'Secondary Pink', class: 'bg-pink-600', hex: '#EC4899' },
    { name: 'Accent Cyan', class: 'bg-cyan-500', hex: '#06B6D4' },
    { name: 'Accent Emerald', class: 'bg-emerald-500', hex: '#10B981' },
  ];

  const gradients = [
    { name: 'Primary', class: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
    { name: 'Secondary', class: 'bg-gradient-to-r from-purple-500 to-pink-600' },
    { name: 'Accent', class: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
    { name: 'Success', class: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
    { name: 'Warning', class: 'bg-gradient-to-r from-yellow-500 to-amber-600' },
    { name: 'Error', class: 'bg-gradient-to-r from-red-500 to-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GXA Design System
              </h1>
              <Badge variant="info">v1.0</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">gxaonline.com</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-12 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
          </div>
          
          <div className="relative text-center max-w-3xl mx-auto">
            <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Palette className="h-12 w-12" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              GXA Online Design System
            </h2>
            <p className="text-xl text-blue-100">
              A comprehensive design system for building modern, consistent, and beautiful insurance claim interfaces
            </p>
          </div>
        </div>

        {/* Colors Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Palette className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold">Colors</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {colors.map((color) => (
              <Card key={color.name} hover={true}>
                <div className={`h-24 ${color.class}`}></div>
                <CardContent className="p-4 text-center">
                  <p className="font-medium text-gray-900">{color.name}</p>
                  <p className="text-sm text-gray-500">{color.hex}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Gradients Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold">Gradients</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradients.map((gradient) => (
              <Card key={gradient.name} hover={true}>
                <div className={`h-32 ${gradient.class}`}></div>
                <CardContent className="p-4">
                  <p className="font-medium text-gray-900">{gradient.name} Gradient</p>
                  <code className="text-xs text-gray-500 mt-1">{gradient.class}</code>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Type className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold">Typography</h3>
          </div>
          
          <Card>
            <CardContent className="p-8 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Heading 1 - Bold 36px</h1>
                <p className="text-sm text-gray-500">Main page titles</p>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">Heading 2 - Semibold 30px</h2>
                <p className="text-sm text-gray-500">Section headers</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Heading 3 - Semibold 24px</h3>
                <p className="text-sm text-gray-500">Subsection headers</p>
              </div>
              <div>
                <p className="text-lg text-gray-700 mb-2">Body Large - Regular 18px</p>
                <p className="text-sm text-gray-500">Important body text</p>
              </div>
              <div>
                <p className="text-base text-gray-600 mb-2">Body Regular - Regular 16px</p>
                <p className="text-sm text-gray-500">Standard body text</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Body Small - Regular 14px</p>
                <p className="text-xs text-gray-400">Supporting text and captions</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Gradient Text</h4>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  The future of insurance claims
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Components Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Box className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold">Components</h3>
          </div>
          
          <div className="space-y-8">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <h4 className="font-semibold">Buttons</h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button className="btn-gxa-primary">Primary Button</Button>
                  <Button className="btn-gxa-secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Danger Button</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Star className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <h4 className="font-semibold">Badges</h4>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Cards */}
            <Card>
              <CardHeader>
                <h4 className="font-semibold">Cards</h4>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card hover={true}>
                    <CardContent className="p-6">
                      <Shield className="h-8 w-8 text-blue-600 mb-3" />
                      <h5 className="font-semibold mb-2">Basic Card</h5>
                      <p className="text-sm text-gray-600">A simple card with hover effect</p>
                    </CardContent>
                  </Card>
                  <Card gradient={true} hover={true}>
                    <CardContent className="p-6">
                      <Heart className="h-8 w-8 text-pink-600 mb-3" />
                      <h5 className="font-semibold mb-2">Gradient Card</h5>
                      <p className="text-sm text-gray-600">Card with gradient background</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Loading States */}
            <Card>
              <CardHeader>
                <h4 className="font-semibold">Loading States</h4>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <LoadingSpinner size="sm" />
                  <LoadingSpinner size="md" />
                  <LoadingSpinner size="lg" />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <h4 className="font-semibold">Notifications</h4>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowNotification('success')}
                    variant="outline"
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Show Success
                  </Button>
                  <Button 
                    onClick={() => setShowNotification('error')}
                    variant="outline" 
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Show Error
                  </Button>
                  <Button 
                    onClick={() => setShowNotification('warning')}
                    variant="outline"
                    className="gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Show Warning
                  </Button>
                  <Button 
                    onClick={() => setShowNotification('info')}
                    variant="outline"
                    className="gap-2"
                  >
                    <Info className="h-4 w-4" />
                    Show Info
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Elements */}
            <Card>
              <CardHeader>
                <h4 className="font-semibold">Interactive Elements</h4>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-3">Hover Effects</p>
                  <div className="flex gap-4">
                    <div className="p-4 bg-gray-100 rounded-lg hover-lift cursor-pointer">
                      Hover Lift
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                      Hover Scale
                    </div>
                    <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-xl transition-all cursor-pointer">
                      Hover Shadow
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-3">Glass Effect</p>
                  <div className="relative p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <div className="glass-effect p-6 rounded-lg">
                      <Bell className="h-8 w-8 text-gray-700 mb-2" />
                      <p className="text-gray-700">Glass morphism effect</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Animation Examples */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Zap className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-2xl font-semibold">Animations</h3>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-block p-4 bg-blue-100 rounded-xl gxa-float-animation mb-4">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="font-medium">Float Animation</p>
                </div>
                <div className="text-center">
                  <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl gxa-pulse-animation mb-4">
                    <Heart className="h-8 w-8" />
                  </div>
                  <p className="font-medium">Pulse Animation</p>
                </div>
                <div className="text-center">
                  <div className="relative overflow-hidden p-4 bg-gray-100 rounded-xl mb-4">
                    <Shield className="h-8 w-8 text-gray-600 relative z-10" />
                    <div className="absolute inset-0 gxa-shimmer"></div>
                  </div>
                  <p className="font-medium">Shimmer Effect</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Notifications */}
      {showNotification === 'success' && (
        <NotificationToast
          type="success"
          title="Claim Submitted Successfully"
          message="Your claim has been received and is being processed."
          onClose={() => setShowNotification(null)}
        />
      )}
      {showNotification === 'error' && (
        <NotificationToast
          type="error"
          title="Submission Failed"
          message="Please check your information and try again."
          onClose={() => setShowNotification(null)}
        />
      )}
      {showNotification === 'warning' && (
        <NotificationToast
          type="warning"
          title="Missing Information"
          message="Please upload all required documents."
          onClose={() => setShowNotification(null)}
        />
      )}
      {showNotification === 'info' && (
        <NotificationToast
          type="info"
          title="Processing Time"
          message="Claims typically process within 48 hours."
          onClose={() => setShowNotification(null)}
        />
      )}
    </div>
  );
}
