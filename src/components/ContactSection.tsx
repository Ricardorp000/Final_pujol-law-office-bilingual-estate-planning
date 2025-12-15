import React from 'react';
import { Phone, Mail, Calendar, MapPin } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section className="bg-pujol-navy text-white rounded-3xl p-8 md:p-12 my-12 text-center shadow-xl shadow-pujol-navy/20">
      <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">Have specific questions about your estate?</h3>
      <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
        While we simplify the concepts, every situation is unique. Connect with our legal team to secure your legacy.
      </p>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          <div className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <Phone size={20} />
            </div>
            <a href="tel:+13054470059" className="font-medium hover:underline">(305) 447-0059</a>
          </div>
          
          <div className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <Mail size={20} />
            </div>
            <a href="mailto:info@pujollaw.com" className="font-medium hover:underline">info@pujollaw.com</a>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group max-w-lg mx-auto">
          <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors shrink-0">
            <MapPin size={20} />
          </div>
          <span className="font-medium">782 NW 42nd Ave Suite 628, Miami, FL 33126, United States</span>
        </div>

        <a 
          href="https://calendly.com/pujollaw/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pujol-blue hover:bg-pujol-sky text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg shadow-black/20 transform hover:-translate-y-0.5 mt-4"
        >
          <Calendar size={18} />
          <span>Book a Consultation</span>
        </a>
      </div>
    </section>
  );
};