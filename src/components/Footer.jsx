import React from "react";
import { Globe, Share2, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-12 pb-8 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Why MakeMyTour Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Why MakeMyTour?</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Established in 2000, MakeMyTour has since positioned itself as one
              of the leading companies, providing great offers, competitive
              airfares, exclusive discounts, and a seamless online booking
              experience.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">
              Booking Flights with MakeMyTour
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Book your flight tickets with India's leading flight booking
              company. Get best deals on flights, train tickets, buses, hotels
              and holiday packages.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">
              Domestic Flights with MakeMyTour
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              MakeMyTour is India's leading player for flight bookings. With the
              cheapest fare guarantee, experience great value at the lowest
              price.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-3 text-white text-xs uppercase tracking-wider">ABOUT THE SITE</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white text-xs uppercase tracking-wider">POPULAR HOTELS</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Hotels in Delhi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hotels in Mumbai</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hotels in Goa</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white text-xs uppercase tracking-wider">QUICK LINKS</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">COVID-19 Update</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Flight Schedule</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Train Schedule</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white text-xs uppercase tracking-wider">IMPORTANT LINKS</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">User Agreement</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Phone className="w-5 h-5" /></a>
            </div>
            <p className="text-xs text-gray-400">
              © 2024 MakeMyTour PVT. LTD. All rights reserved
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
