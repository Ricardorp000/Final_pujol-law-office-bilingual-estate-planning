import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  initialTerm: string;
}

const SUGGESTED_TOPICS = [
  "Revocable Living Trust",
  "Will",
  "Probate",
  "Power of Attorney",
  "Lady Bird Deed",
  "Homestead"
];

export const InputSection: React.FC<InputSectionProps> = ({ onSearch, isLoading, initialTerm }) => {
  const [inputValue, setInputValue] = useState(initialTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  const handleTopicClick = (topic: string) => {
    setInputValue(topic);
    onSearch(topic);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative group mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-pujol-blue transition-colors" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a legal term (e.g., Trust, Deed, Beneficiary)"
          className="w-full pl-12 pr-32 py-4 bg-white border border-pujol-silver/50 rounded-full shadow-sm text-lg text-pujol-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pujol-blue/20 focus:border-pujol-blue transition-all"
          disabled={isLoading}
        />
        <div className="absolute inset-y-1.5 right-1.5">
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="h-full px-6 rounded-full bg-pujol-navy text-white font-medium flex items-center gap-2 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Explain</span>
                <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Popular Topics</span>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-pujol-silver/50 rounded-full text-sm font-medium text-slate-600 hover:border-pujol-blue hover:text-pujol-blue hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};