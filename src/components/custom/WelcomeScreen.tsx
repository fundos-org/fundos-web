import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      title: "Professional Investment Platform",
      description: "Access sophisticated investment tools and opportunities designed for serious investors",
      icon: "💼"
    },
    {
      title: "Bank-Level Security", 
      description: "Your data is protected with encryption and never shared with third parties",
      icon: "🔒"
    },
    {
      title: "Quick Setup",
      description: "Get started in just 3 minutes with our streamlined onboarding process",
      icon: "⚡"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <div className="gradient-bg-fundos px-4 py-8 sm:px-6 sm:py-12">
        <div className="fundos-container max-w-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <img src="/fundos_welcome.png" alt="FundOS" className="h-10 w-auto" />
              <h1 className="text-3xl font-bold text-white ml-3">
                Fund<span className="text-orange-300">OS</span>
              </h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Welcome!
            </h2>
            <p className="text-blue-100 text-xl leading-relaxed">
              Start your investment journey with confidence
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex-1 px-4 py-8 sm:px-6">
        <div className="fundos-container max-w-lg">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`fundos-card p-6 transition-all duration-300 ${
                  index === currentFeature ? 'ring-2 ring-blue-500 ring-opacity-20' : ''
                }`}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-slate-800">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Button
              onClick={onGetStarted}
              className="w-full h-14 fundos-btn-primary text-lg font-semibold"
            >
              Let's Get Started
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4 text-sm text-green-700">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>SEBI Registered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 text-center">
        <p className="text-xs text-slate-500">
          © 2024 FundOS. All rights reserved. | Terms & Conditions | Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
