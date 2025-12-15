import React from 'react';
import { ExplanationContent } from '../types';
import { BookOpen, CheckCircle, Lightbulb } from 'lucide-react';

interface ExplanationCardProps {
  content: ExplanationContent;
  language: 'English' | 'Spanish';
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ content, language }) => {
  const isEnglish = language === 'English';
  
  // English uses brand-blue (Process Blue), Spanish uses brand-teal (Pantone 7700 C)
  const accentColorClass = isEnglish ? 'text-pujol-blue' : 'text-pujol-teal';
  const bgColorClass = isEnglish ? 'bg-pujol-blue/5' : 'bg-pujol-teal/5';
  const borderColorClass = isEnglish ? 'border-pujol-blue/20' : 'border-pujol-teal/20';
  const bulletColorClass = isEnglish ? 'bg-pujol-blue' : 'bg-pujol-teal';

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-pujol-silver/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-pujol-silver/60">
      <div className={`px-6 py-4 border-b ${bgColorClass} ${borderColorClass}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold uppercase tracking-wider ${accentColorClass}`}>
            {language}
          </span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-pujol-navy leading-tight">
          {content.title}
        </h3>
      </div>

      <div className="p-6 flex-grow space-y-6">
        {/* Definition Section */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <BookOpen size={18} />
            <span className="text-sm font-semibold uppercase">What is it?</span>
          </div>
          <p className="text-slate-700 text-lg leading-relaxed">
            {content.definition}
          </p>
        </div>

        {/* Analogy Section */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2 mb-2 text-amber-600">
            <Lightbulb size={18} />
            <span className="text-sm font-bold uppercase">Think of it like...</span>
          </div>
          <p className="text-slate-800 italic font-medium">
            "{content.analogy}"
          </p>
        </div>

        {/* Key Benefits Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <CheckCircle size={18} />
            <span className="text-sm font-semibold uppercase">Key Benefits</span>
          </div>
          <ul className="space-y-3">
            {content.keyBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`mt-1.5 min-w-[6px] min-h-[6px] rounded-full ${bulletColorClass}`} />
                <span className="text-slate-600">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};