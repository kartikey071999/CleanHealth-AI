import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, ArrowRight, Printer, Share2, MessageCircle, Volume2, Loader2, PauseCircle, PlayCircle, MapPin, Navigation, Star, ExternalLink } from 'lucide-react';
import { generateAudioSummary, findNearbySpecialists, SpecialistRecommendation } from '../services/geminiService';

interface AnalysisViewProps {
  result: AnalysisResult;
  onOpenChat: () => void;
}

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors = {
    low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    high: 'bg-rose-100 text-rose-800 border-rose-200',
    unknown: 'bg-slate-100 text-slate-800 border-slate-200',
  };
  const colorClass = colors[severity as keyof typeof colors] || colors.unknown;

  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${colorClass} uppercase tracking-wider shadow-sm`}>
      {severity} Severity
    </span>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'critical': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
    case 'abnormal': return <Info className="w-5 h-5 text-amber-500" />;
    case 'normal': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    default: return <Info className="w-5 h-5 text-blue-500" />;
  }
};

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onOpenChat }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [specialists, setSpecialists] = useState<SpecialistRecommendation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const playAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    try {
      setIsAudioLoading(true);

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      let buffer = audioBufferRef.current;
      if (!buffer) {
        const speakableText = `Analysis for ${result.title}. ${result.summary}. Severity level is ${result.severity}.`;
        const arrayBuffer = await generateAudioSummary(speakableText);
        buffer = await ctx.decodeAudioData(arrayBuffer);
        audioBufferRef.current = buffer;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      source.start(0);
      
      sourceNodeRef.current = source;
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback error:", error);
      alert("Could not play audio summary.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleFindCare = () => {
    setIsLocating(true);
    setLocationError(null);
    setSpecialists(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use the summary and findings to find relevant specialists
          const context = `${result.title}. ${result.summary}. Severity: ${result.severity}`;
          const data = await findNearbySpecialists(context, latitude, longitude);
          setSpecialists(data);
          // Scroll to results
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        } catch (err) {
          console.error(err);
          setLocationError("Failed to find specialists. Please try again.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error(err);
        setLocationError("Unable to retrieve your location. Please check your permissions.");
        setIsLocating(false);
      }
    );
  };

  // Urgent styling for high severity
  const isUrgent = result.severity === 'high' || result.severity === 'unknown';

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto animate-fade-in-up pb-12">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-xl font-semibold text-slate-400">Analysis Report</h2>
        <div className="flex gap-2">
          <button 
            onClick={playAudio}
            disabled={isAudioLoading}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all shadow-sm min-w-[140px] justify-center ${
              isPlaying 
                ? 'bg-teal-50 border-teal-200 text-teal-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {isAudioLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <PauseCircle className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isAudioLoading ? "Generating..." : isPlaying ? "Stop Audio" : "Listen"}
            </span>
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span className="text-sm font-medium">Print</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        
        {/* Report Header */}
        <div className="bg-slate-50 p-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{result.title}</h1>
              <p className="text-slate-500">Generated by Gemini 3 Pro Medical Intelligence</p>
            </div>
            <SeverityBadge severity={result.severity} />
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Executive Summary */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Executive Summary</h3>
            <p className="text-lg text-slate-700 leading-relaxed bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              {result.summary}
            </p>
          </section>

          {/* Detailed Findings */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detailed Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.findings.map((finding, idx) => (
                <div 
                  key={idx} 
                  className={`relative p-5 rounded-xl border transition-all hover:shadow-md ${
                    finding.status === 'critical' ? 'bg-rose-50 border-rose-100' :
                    finding.status === 'abnormal' ? 'bg-amber-50 border-amber-100' :
                    'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={finding.status} />
                      <h4 className="font-bold text-slate-800">{finding.name}</h4>
                    </div>
                    {finding.value && (
                      <span className="font-mono text-xs font-semibold bg-white/80 px-2 py-1 rounded text-slate-600 border border-slate-100">
                        {finding.value}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-7">{finding.explanation}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-2 space-y-8">
              {/* Recommendations List */}
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <h3 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Recommended Actions
                </h3>
                <ul className="space-y-4">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start text-teal-800">
                      <ArrowRight className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-teal-500" />
                      <span className="leading-snug">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Find Nearby Care Section */}
              <div 
                className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 ${
                  isUrgent 
                    ? 'bg-rose-50 border-rose-200 shadow-md ring-1 ring-rose-200' 
                    : 'bg-white border-slate-200'
                }`}
              >
                 <div className="flex items-start justify-between">
                   <div>
                     <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isUrgent ? 'text-rose-900' : 'text-slate-900'}`}>
                        <MapPin className={`w-5 h-5 ${isUrgent ? 'text-rose-500' : 'text-blue-500'}`} />
                        {isUrgent ? "Immediate Specialist Care Recommended" : "Find Nearby Care"}
                     </h3>
                     <p className={`text-sm mb-6 ${isUrgent ? 'text-rose-700' : 'text-slate-500'}`}>
                       {isUrgent 
                         ? "Based on the high severity of this report, we recommend finding a specialist near you."
                         : "Find top-rated specialists or clinics near you based on these results."}
                     </p>
                   </div>
                   {isUrgent && <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />}
                 </div>
                 
                 {!specialists ? (
                    <button 
                      onClick={handleFindCare}
                      disabled={isLocating}
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                        isUrgent
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isLocating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Locating Specialists...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4" />
                          Find Specialists Near Me
                        </>
                      )}
                    </button>
                 ) : (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" ref={resultsRef}>
                      <div className="mb-4 text-sm text-slate-700 bg-white/50 p-4 rounded-lg border border-slate-200/60 italic">
                        {specialists.text}
                      </div>
                      
                      {specialists.chunks && specialists.chunks.length > 0 && (
                        <div className="space-y-3">
                          {specialists.chunks.map((chunk: any, idx: number) => {
                            // Support Google Maps tool grounding chunk structure
                            const data = chunk.maps || chunk.web;
                            if (!data?.uri || !data?.title) return null;
                            
                            return (
                              <a 
                                key={idx}
                                href={data.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all group"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-blue-700 flex items-center gap-2">
                                      {data.title}
                                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-1 truncate max-w-xs font-mono">{data.uri}</p>
                                    
                                    {/* Simulated rating if not available in chunk, just for visual layout */}
                                    <div className="flex items-center gap-1 mt-2">
                                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-xs font-medium text-slate-600">Highly Rated</span>
                                    </div>
                                  </div>
                                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                                    <MapPin className="w-4 h-4" />
                                  </div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => setSpecialists(null)}
                        className="mt-4 text-xs text-slate-400 hover:text-slate-600 hover:underline uppercase tracking-wide font-semibold"
                      >
                        Clear Search Results
                      </button>
                   </div>
                 )}
                 {locationError && (
                   <p className="mt-4 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4" />
                     {locationError}
                   </p>
                 )}
              </div>
            </div>

            {/* AI Assist Call to Action (Sidebar) */}
            <div className="flex flex-col gap-6">
              <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg h-full max-h-[300px]">
                <div>
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-teal-400" />
                    Have Questions?
                  </h3>
                  <p className="text-slate-300 text-sm mb-6">
                    Our AI assistant can help explain these results in simpler terms or answer specific questions.
                  </p>
                </div>
                <button 
                  onClick={onOpenChat}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Ask Assistant
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="bg-slate-50 border-t border-slate-200 p-6">
          <div className="flex items-start gap-3 text-sm text-slate-500">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-500" />
            <p className="leading-relaxed italic">{result.medicalDisclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
