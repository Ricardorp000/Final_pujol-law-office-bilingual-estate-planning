import React, { useState, useEffect } from 'react';
import { generateLegalExplanation } from './services/geminiService';
import { BilingualExplanation, LoadingState } from './types';
import { ExplanationCard } from './components/ExplanationCard';
import { InputSection } from './components/InputSection';
import { ContactSection } from './components/ContactSection';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { ChatWidget } from './components/ChatWidget';
import { AlertCircle, Languages } from 'lucide-react';

const DEFAULT_TERM = "Revocable Living Trust";
type ViewMode = 'english' | 'spanish' | 'both';

export default function App() {
  const [term, setTerm] = useState(DEFAULT_TERM);
  const [data, setData] = useState<BilingualExplanation | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('both');

  const fetchExplanation = async (searchTerm: string) => {
    setStatus(LoadingState.LOADING);
    setError(null);
    try {
      const result = await generateLegalExplanation(searchTerm);
      setData(result);
      setStatus(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(LoadingState.ERROR);
      setError("We couldn't generate an explanation at this moment. Please check your connection or try a different term.");
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchExplanation(DEFAULT_TERM);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SEO: Update title and meta description dynamically
  useEffect(() => {
    document.title = `Understanding ${term} | Pujol Law Office`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Learn what "${term}" means in simple English and Spanish. Estate planning concepts explained by Pujol Law Office, P.A.`);
  }, [term]);

  const handleSearch = (newTerm: string) => {
    setTerm(newTerm);
    fetchExplanation(newTerm);
  };

  return (
    <div className="min-h-screen bg-pujol-light/20 flex flex-col relative">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
          alt="Elegant office background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-pujol-light/90"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <DisclaimerBanner />
        
        {/* Header Background */}
        <div className="bg-white/80 border-b border-pujol-silver/30 sticky top-0 z-10 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <a 
                href="https://pujollaw.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 md:gap-4 hover:opacity-80 transition-opacity"
              >
                <img 
                  src="https://pujollaw.com/wp-content/uploads/2024/11/Pujol-Law-Logo.png" 
                  alt="Pujol Law Office Logo" 
                  className="h-10 md:h-12 w-auto object-contain"
                />
                <div className="flex flex-col justify-center border-l border-pujol-silver pl-3 md:pl-4">
                  <h1 className="text-lg md:text-xl font-bold font-serif text-pujol-navy leading-tight">Pujol Law Office, P.A.</h1>
                  <p className="text-xs text-pujol-teal font-medium tracking-wide">Bilingual Estate Planning Explained</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="text-center mb-10">
            <a 
              href="https://pujollaw.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block group"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-pujol-navy mb-4 group-hover:text-pujol-teal transition-colors drop-shadow-sm">
                Understanding <span className="text-pujol-blue group-hover:text-pujol-sky">{term}</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto group-hover:text-pujol-navy transition-colors font-medium">
                We translate complex legal jargon into simple English and Spanish, helping you make informed decisions for your future.
              </p>
            </a>
          </div>

          <InputSection 
            onSearch={handleSearch} 
            isLoading={status === LoadingState.LOADING} 
            initialTerm={term}
          />

          {/* View Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur border border-pujol-silver/50 p-1 rounded-full inline-flex items-center shadow-md">
              <button 
                onClick={() => setViewMode('english')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${viewMode === 'english' ? 'bg-pujol-blue/10 text-pujol-blue shadow-sm ring-1 ring-pujol-blue/20' : 'text-slate-500 hover:text-pujol-navy'}`}
              >
                English
              </button>
              <div className="w-px h-4 bg-pujol-silver/50 mx-1"></div>
              <button 
                onClick={() => setViewMode('both')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${viewMode === 'both' ? 'bg-pujol-navy text-white shadow-sm' : 'text-slate-500 hover:text-pujol-navy'}`}
              >
                <Languages size={14} />
                <span>Both</span>
              </button>
              <div className="w-px h-4 bg-pujol-silver/50 mx-1"></div>
              <button 
                onClick={() => setViewMode('spanish')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${viewMode === 'spanish' ? 'bg-pujol-teal/10 text-pujol-teal shadow-sm ring-1 ring-pujol-teal/20' : 'text-slate-500 hover:text-pujol-navy'}`}
              >
                Español
              </button>
            </div>
          </div>

          {status === LoadingState.ERROR && (
            <div className="max-w-md mx-auto p-4 bg-red-50/90 backdrop-blur border border-red-100 rounded-xl flex items-start gap-3 text-red-700 mb-8 shadow-sm">
              <AlertCircle className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {status === LoadingState.LOADING && !data && (
            <div className={`grid gap-8 animate-pulse ${viewMode === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
              {(viewMode === 'both' ? [1, 2] : [1]).map((i) => (
                <div key={i} className="h-96 bg-white/60 backdrop-blur rounded-2xl shadow-sm border border-white/50 p-6 space-y-4">
                  <div className="h-8 bg-pujol-silver/20 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-pujol-silver/20 rounded w-full"></div>
                    <div className="h-4 bg-pujol-silver/20 rounded w-full"></div>
                    <div className="h-4 bg-pujol-silver/20 rounded w-5/6"></div>
                  </div>
                  <div className="h-32 bg-pujol-light/50 rounded-xl mt-6"></div>
                </div>
              ))}
            </div>
          )}

          {data && (
            <div className={`transition-opacity duration-500 ${status === LoadingState.LOADING ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div className={`grid gap-8 ${viewMode === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
                {(viewMode === 'english' || viewMode === 'both') && (
                  <ExplanationCard content={data.english} language="English" />
                )}
                {(viewMode === 'spanish' || viewMode === 'both') && (
                  <ExplanationCard content={data.spanish} language="Spanish" />
                )}
              </div>
            </div>
          )}

          <ContactSection />
        </main>
        
        <footer className="border-t border-pujol-silver/30 bg-white/80 backdrop-blur py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm space-y-2">
            <p>Educational only. Not legal advice. For your situation, consult an attorney.</p>
            <p>© {new Date().getFullYear()} Pujol Law Office, P.A. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}