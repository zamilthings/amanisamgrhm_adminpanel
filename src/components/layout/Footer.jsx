
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/assets/logo.png";

export default function Footer() {
    const navigate = useNavigate();
    return (
        <footer className="bg-gray-100 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <img src={Logo} onClick={() => navigate('/')} alt="Qurhan Logo" className="h-8 cursor-pointer hover:scale-[1.1] transition-all ease-in-out" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <button onClick={() => navigate('/privacy-policy')} className="text-gray-600 hover:text-blue-500 cursor-pointer">Privacy Policy</button>
                        <button onClick={() => navigate('/terms-of-service')} className="text-gray-600 hover:text-blue-500 cursor-pointer">Terms of Service</button>
                        <button onClick={() => navigate('/contact')} className="text-gray-600 hover:text-blue-500 cursor-pointer">Contact Us</button>
                    </div>
                </div>
                <div className="mt-4 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} bliss.apps All rights reserved.
                </div>
            </div>
        </footer>
    );
}