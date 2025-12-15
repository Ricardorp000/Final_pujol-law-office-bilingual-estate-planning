import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-100 text-amber-900 px-4 py-3 text-sm font-medium text-center relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <AlertTriangle size={16} className="text-amber-600" />
        <span>Educational only. Not legal advice. For your situation, consult an attorney.</span>
      </div>
    </div>
  );
};