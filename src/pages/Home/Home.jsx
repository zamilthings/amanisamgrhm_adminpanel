import Logo from "@/assets/logo.png";
import AppScreenshot from "@/assets/amani.jpeg";
import GooglePlay from "@/assets/google-play-badge.png";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Headphones, 
  Settings, 
  Bookmark, 
  Eye, 
  Users,
  Download,
  CheckCircle,
  ChevronRight,
  Star,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Quran with Malayalam Translation",
      description: "Read the Quran with authentic Malayalam translation and detailed tafsir, available side by side or separately.",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Quran Recitation",
      description: "Listen to beautiful recitations with crystal clear audio and seamless verse-by-verse navigation.",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Adjustable Fonts & Themes",
      description: "Customize Arabic and Malayalam fonts, sizes, and choose from multiple themes for comfortable reading.",
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: <Bookmark className="w-6 h-6" />,
      title: "Bookmark & Share Ayahs",
      description: "Save your favorite verses and easily share any Ayah along with its explanation.",
      color: "text-orange-600 bg-orange-50"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Hide/Show Options",
      description: "Toggle translation and tafsir visibility for a focused, distraction-free Quran reading experience.",
      color: "text-red-600 bg-red-50"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Trusted Tafsir Source",
      description: "Based on the renowned commentary of Amani Maulavi, summarized by Dr. Abdullakoya Kohinoor (MBBS, DCH).",
      color: "text-indigo-600 bg-indigo-50"
    }
  ];

  const stats = [
    { value: "100%", label: "Free to Use" },
    { value: "24/7", label: "Available" },
    { value: "114", label: "Surahs" },
    { value: "6,236", label: "Verses" }
  ];

  const testimonials = [
    {
      text: "This app has transformed my Quran reading experience. The Malayalam translation is very clear.",
      author: "Ahmed R.",
      role: "Student"
    },
    {
      text: "Perfect for daily Quran reading. The recitation quality is excellent and the interface is very user-friendly.",
      author: "Fatima M.",
      role: "Teacher"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Qurhan Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Amanisamgraham
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Features
              </a>
              <a href="#download" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Download
              </a>
              <a onClick={() => navigate('/contact')} className="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer">
                Contact
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=com.appletsolution.amanisamgraham"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download App
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium py-2">
                  Features
                </a>
                <a href="#download" className="text-gray-600 hover:text-blue-600 font-medium py-2">
                  Download
                </a>
                <a onClick={() => navigate('/contact')} className="text-gray-600 hover:text-blue-600 font-medium py-2 cursor-pointer">
                  Contact
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.appletsolution.amanisamgraham"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download App
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Hero Content */}
            <div className="lg:w-1/2">
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4" />
                  Trusted by Thousands of Users
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Your Complete <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Quran Companion</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Experience the Holy Quran like never before. Read, listen, and understand with authentic Malayalam translation 
                and trusted tafsir commentary. Available anytime, anywhere on your mobile device.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.appletsolution.amanisamgraham"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-lg font-semibold">Download Now</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a
                  href="#features"
                  className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  <span className="font-medium">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
                <img
                  src={AppScreenshot}
                  alt="Qurhan App Screenshot"
                  className="relative rounded-2xl shadow-2xl border-8 border-white transform hover:scale-[1.02] transition-transform duration-300"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-xl">
                  <img
                    src={GooglePlay}
                    alt="Available on Google Play"
                    className="h-12 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Your Quran Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to read, understand, and connect with the Holy Quran
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied users who have enhanced their Quran reading experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="download" className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Start Your Quran Journey Today
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Download Qurhan App now and experience the Quran like never before. Completely free, no ads.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <img
                    src={GooglePlay}
                    alt="Get it on Google Play"
                    className="h-16 w-auto"
                  />
                </div>
                
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white font-medium">Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white font-medium">No Ads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white font-medium">Regular Updates</span>
                  </div>
                </div>
              </div>

              <a
                href="https://play.google.com/store/apps/details?id=com.appletsolution.amanisamgraham"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 mt-8 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                <Download className="w-6 h-6" />
                Download on Google Play
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <img src={Logo} alt="Qurhan Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold">Qurhan</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Your trusted companion for Quran reading, translation, and tafsir in Malayalam.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#download" className="text-gray-400 hover:text-white transition-colors">Download</a></li>
                  <li><a onClick={() => navigate('/contact')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</a></li>
                  <li><a href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin Panel</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li className="text-gray-400">blissapps2025@gmail.com</li>
                  {/* <li className="text-gray-400">+91 123 456 7890</li> */}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} bliss.apps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;