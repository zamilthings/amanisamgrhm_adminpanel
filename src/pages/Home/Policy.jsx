import { Shield, Lock, Eye, Mail, Users, Database, RefreshCw, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Information We Collect",
      content: "We collect minimal data to provide and improve your Quran reading experience.",
      points: [
        "Basic device information for app performance and analytics",
        "App usage data to improve user experience and features",
        "Bookmark and preference data stored locally on your device",
        "User-submitted feedback via the feedback form",
        "Crash reports to fix technical issues"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: "Your data helps us serve you better and enhance your Quran study journey.",
      points: [
        "To provide Quran audio, translation, and reading services",
        "To improve app functionality and user experience",
        "To gather feedback and suggestions for future updates",
        "To load translations and content from secure servers",
        "To monitor app performance and fix technical issues"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Children's Privacy",
      content: "Our app is designed for all ages, with special consideration for children's safety.",
      points: [
        "Suitable for users of all ages including children",
        "We do not knowingly collect personal data from children under 13",
        "Parental guidance is recommended for young users",
        "If we discover data from children, we delete it immediately"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      content: "We prioritize the security of your information with modern protection measures.",
      points: [
        "Secure HTTPS protocols for all data transmission",
        "Quran content fetched from encrypted servers",
        "Local data (bookmarks) never leaves your device",
        "Regular security audits and updates",
        "No sensitive personal information collected"
      ]
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Your Rights & Choices",
      content: "You have control over your data and how it's used.",
      points: [
        "Access and review your stored preferences",
        "Clear local data through app settings",
        "Opt out of analytics collection",
        "Submit feedback at any time",
        "Request data deletion via email"
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Changes to This Policy",
      content: "We may update this policy to reflect changes in our practices or legal requirements.",
      points: [
        "Updates will be posted on this page",
        "Significant changes will be notified in-app",
        "Continued use implies acceptance of changes",
        "Review this page periodically for updates"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Privacy Policy</h1>
            </div>
            
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Commitment to Your Privacy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            At Qurhan, we believe in transparency and protecting your data. This policy explains 
            how we collect, use, and safeguard your information while you enjoy our Quran app.
          </p>
          <div className="text-sm text-gray-500">
            Last Updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${index === 0 ? 'bg-blue-50 text-blue-600' :
                                           index === 1 ? 'bg-green-50 text-green-600' :
                                           index === 2 ? 'bg-purple-50 text-purple-600' :
                                           index === 3 ? 'bg-red-50 text-red-600' :
                                           index === 4 ? 'bg-yellow-50 text-yellow-600' :
                                           'bg-indigo-50 text-indigo-600'}`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{section.title}</h2>
                    <p className="text-gray-600 mb-4">{section.content}</p>
                    <ul className="space-y-2">
                      {section.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Questions or Concerns?</h3>
                <p className="text-gray-600">
                  We're here to help. Contact us with any privacy-related questions.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Email Us</p>
                  <a 
                    href="mailto:blissapps2025@gmail.com" 
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    blissapps2025@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Notes</h3>
                <div className="space-y-2 text-gray-700">
                  <p>• This policy applies only to the Qurhan mobile application</p>
                  <p>• We never sell or rent your personal information to third parties</p>
                  <p>• All Quran content is provided for educational and spiritual purposes</p>
                  <p>• By using our app, you consent to this privacy policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Want a copy of this policy for your records?
            </p>
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print or Save PDF
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600">
                &copy; {new Date().getFullYear()} bliss.apps. All rights reserved.
              </p>
              <p className="text-sm text-gray-500">
                This document is reviewed and updated regularly.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="/terms-of-service" 
                onClick={(e) => { e.preventDefault(); navigate('/terms-of-service'); }}
                className="text-gray-600 hover:text-blue-600 hover:underline"
              >
                Terms of Service
              </a>
              <a 
                href="/contact" 
                onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
                className="text-gray-600 hover:text-blue-600 hover:underline"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}