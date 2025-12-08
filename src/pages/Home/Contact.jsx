import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/libs/createClient';
import { 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  User,
  MessageSquare,
  Loader2,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    contact: '', // Changed from 'email' to match your table
    message: '' 
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      content: "blissapps2025@gmail.com",
      action: "mailto:blissapps2025@gmail.com",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      content: "",
      action: "",
      color: "bg-green-50 text-green-600"
    },
  
  ];

 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.contact.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate contact (could be email or phone)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact);
    const isPhone = /^[\+]?[1-9][\d]{0,15}$/.test(formData.contact.replace(/[\s\-\(\)\.]/g, ''));
    
    if (!isEmail && !isPhone) {
      toast.error("Please enter a valid email address or phone number");
      return;
    }

    setLoading(true);

    try {
      // Insert into Supabase feedbacks table
      const { data, error } = await supabase
        .from('feedbacks')
        .insert([
          {
            name: formData.name.trim(),
            contact: formData.contact.trim(),
            message: formData.message.trim(),
            status: 'pending' // Default status
          }
        ])
        .select();

      if (error) throw error;

      setSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({ name: '', contact: '', message: '' });
      
      // Reset submission status after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
      
    } catch (error) {
      console.error('Error saving feedback:', error);
      
      // User-friendly error messages
      if (error.code === '23505') {
        toast.error("Duplicate submission detected. Please wait a moment.");
      } else if (error.message.includes('network')) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Contact Us</h1>
            </div>
            
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch With Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your feedback is important! Contact us with questions, suggestions, or issues.
            All messages are saved and managed through our admin panel.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${info.color}`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{info.title}</h4>
                      {info.action ? (
                        <a 
                          href={info.action}
                          className="text-blue-600 hover:text-blue-700 hover:underline block"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-700">{info.content}</p>
                      )}
                      {info.description && (
                        <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

         
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below. Your message will be saved in our database and we'll respond as soon as possible.
                </p>
              </div>

              {/* Success Message */}
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in slide-in-from-top">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">✓ Message Saved Successfully!</p>
                      <p className="text-green-700 text-sm">
                        Your feedback has been saved. Our team will review it and get back to you soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Your Name *
                    </div>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Muhammed Aman"
                    required
                    disabled={loading}
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                {/* Contact Field (Email or Phone) */}
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email or Phone Number *
                    </div>
                  </label>
                  <input
                    type="text"
                    id="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="email@example.com or +91 1234567890"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your email address or phone number so we can reach you back
                  </p>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Your Message *
                    </div>
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-y"
                    placeholder="Tell us about your question, suggestion, or feedback..."
                    required
                    disabled={loading}
                    minLength={10}
                    maxLength={2000}
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      Please provide enough details so we can help you better
                    </p>
                    <p className="text-xs text-gray-400">
                      {formData.message.length}/2000 characters
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving to Database...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message 
                      </>
                    )}
                  </button>
                  
                  {/* <p className="text-center text-xs text-gray-500 mt-3">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Your message will be saved in our feedbacks table for tracking and response
                  </p> */}
                </div>
              </form>

           
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
                &copy; {new Date().getFullYear()} Amanisamgraham. All rights reserved.
              </p>
              <p className="text-sm text-gray-500">
                Contact form connected to Supabase feedbacks table
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
                href="/terms-of-service" 
                onClick={(e) => { e.preventDefault(); navigate('/terms-of-service'); }}
                className="text-gray-600 hover:text-blue-600 hover:underline"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}