import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Shield, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find your lost items quickly with our intelligent search system'
    },
    {
      icon: Plus,
      title: 'Easy Reporting',
      description: 'Report lost or found items in just a few clicks'
    },
    {
      icon: Shield,
      title: 'Secure Claims',
      description: 'Verified claim process to ensure items reach their rightful owners'
    },
    {
      icon: Bell,
      title: 'Instant Notifications',
      description: 'Get notified when potential matches are found'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Lost Something on Campus?
          </h1>
          <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Our Campus Lost & Found system helps students and staff reunite with their lost items quickly and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/dashboard" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Go to Dashboard
                </Link>
                <Link to="/search" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                  Search Items
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started
                </Link>
                <Link to="/search" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                  Search Lost Items
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and efficient - our platform makes lost and found management easy for everyone on campus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Lost Items?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students and staff who have successfully reunited with their belongings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={user ? "/dashboard/report-lost" : "/register"} 
              className="btn-primary text-lg px-8 py-3"
            >
              Report Lost Item
            </Link>
            <Link 
              to={user ? "/dashboard/report-found" : "/register"} 
              className="btn-secondary text-lg px-8 py-3"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;