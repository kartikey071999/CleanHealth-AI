import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, Activity } from 'lucide-react';

export const ThinkingIndicator: React.FC = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    "Scanning image data...",
    "Identifying biomarkers...",
    "Cross-referencing medical guidelines...",
    "Synthesizing insights...",
    "Finalizing report..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute -inset-4 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-teal-100">
          <Brain className="w-12 h-12 text-teal-600 animate-bounce" />
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-spin-slow" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-800">Gemini Pro is Thinking</h3>
        <div className="flex items-center justify-center space-x-2 text-slate-500">
          <Activity className="w-4 h-4 animate-pulse" />
          <p className="text-sm font-medium">{steps[step]}</p>
        </div>
      </div>

      <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-teal-500 animate-progress-indeterminate"></div>
      </div>
      
      <style>{`
        @keyframes progress-indeterminate {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 100%; margin-left: 100%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 2s infinite ease-in-out;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
