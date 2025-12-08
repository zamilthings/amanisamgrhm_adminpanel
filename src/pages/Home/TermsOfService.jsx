import { Scale, BookOpen, Wifi, MessageSquare, RefreshCw, Mail, FileText, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: "By accessing and using the Qurhan app, you acknowledge and agree to be bound by these Terms of Service.",
      points: [
        "You must be at least 13 years old to use the app",
        "Use of the app constitutes acceptance of all terms",
        "If you disagree with any terms, discontinue use immediately",
        "Terms apply to all features and future updates"
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Use of Content",
      content: "All Quranic content within the app is provided for spiritual and educational purposes only.",
      points: [
        "Content is for personal, non-commercial use only",
        "Redistribution or modification of content is prohibited",
        "Respect copyrights and intellectual property rights",
        "Proper attribution must be maintained when referencing"
      ]
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Access & Availability",
      content: "We strive to provide reliable service but cannot guarantee uninterrupted access at all times.",
      points: [
        "Service may be interrupted for maintenance or updates",
        "Internet connection required for certain features",
        "We reserve the right to modify or discontinue features",
        "Availability may vary by region or device"
      ]
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "User Feedback",
      content: "Your feedback helps us improve the app and serves as a channel for user communication.",
      points: [
        "Feedback is collected via in-app forms",
        "Submitted feedback may be stored securely",
        "We may use feedback for app improvements",
        "Feedback does not create a support obligation"
      ]
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Modifications to Terms",
      content: "We reserve the right to update these terms to reflect changes in our service or legal requirements.",
      points: [
        "Updated terms will be posted in this section",
        "Continued use implies acceptance of new terms",
        "Users are responsible for reviewing changes",
        "Material changes will be notified in-app when possible"
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Limitations of Liability",
      content: "The app is provided as-is without warranties, and our liability is limited as described below.",
      points: [
        "We are not liable for indirect or consequential damages",
        "Service is provided without warranties of any kind",
        "Users assume all risks associated with app use",
        "We are not responsible for third-party content"
      ]
    }
  ];

  const importantPoints = [
    "App is for educational and spiritual purposes only",
    "No commercial use or redistribution allowed",
    "Content accuracy is prioritized but not guaranteed",
    "User data is handled per our Privacy Policy",
    "Violation of terms may result in service termination"
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
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Terms of Service</h1>
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
            <Scale className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms of Service Agreement
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            These terms govern your use of the Qurhan app. By accessing or using our services, 
            you agree to be bound by these terms and our Privacy Policy.
          </p>
          <div className="text-sm text-gray-500">
            Effective Date: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Notice</h3>
              <p className="text-gray-700">
                Please read these terms carefully. By using the Qurhan app, you acknowledge that you have read, 
                understood, and agree to be bound by all terms and conditions stated herein. If you do not agree 
                with any part of these terms, please discontinue use of the app immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Key Points */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Key Terms at a Glance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {importantPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms Sections */}
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
                                           index === 3 ? 'bg-yellow-50 text-yellow-600' :
                                           index === 4 ? 'bg-orange-50 text-orange-600' :
                                           'bg-red-50 text-red-600'}`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{section.title}</h2>
                    <p className="text-gray-600 mb-4">{section.content}</p>
                    <ul className="space-y-2">
                      {section.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Contact & Agreement Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-300 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Agreement & Contact</h3>
                <p className="text-gray-600 mb-4">
                  These terms constitute the entire agreement between you and Qurhan regarding the app. 
                  For any questions or to report violations, please contact us.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="p-3 bg-white rounded-lg border border-gray-300">
                    <Mail className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Contact Email</p>
                    <a 
                      href="mailto:blissapps2025@gmail.com" 
                      className="text-blue-600 hover:text-blue-700 hover:underline break-all"
                    >
                      blissapps2025@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-semibold text-gray-800">
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Save as PDF
                </button>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Governing Law & Jurisdiction</h3>
                <div className="space-y-2 text-gray-700">
                  <p>These Terms shall be governed by and construed in accordance with applicable laws.</p>
                  <p>Any disputes arising from these Terms or use of the app shall be subject to the exclusive jurisdiction of the competent courts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Acceptance Notice */}
          <div className="text-center py-6 border-t border-gray-200">
            <div className="inline-flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-left">
                <p className="font-medium text-gray-800">By using the Qurhan app, you accept these Terms of Service</p>
                <p className="text-sm text-gray-600">and acknowledge that you have read our Privacy Policy</p>
              </div>
            </div>
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
                This is a legal agreement between you and Qurhan.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="/privacy-policy" 
                onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }}
                className="text-gray-600 hover:text-blue-600 hover:underline"
              >
                Privacy Policy
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