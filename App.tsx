
import React, { useState, useRef } from 'react';
import { Upload, FileText, Activity, AlertCircle, ArrowLeft, File as FileIcon, Image as ImageIcon, X, ChevronRight, Stethoscope, FileSearch, MessageCircle, Zap, Shield, Globe, Heart, Brain } from 'lucide-react';
import { AnalysisType, AnalysisResult, ProcessingState } from './types';
import { analyzeDocument, FileData } from './services/geminiService';
import { ThinkingIndicator } from './components/ThinkingIndicator';
import { AnalysisView } from './components/AnalysisView';
import { ChatWidget } from './components/ChatWidget';
import { APP_NAME, SAMPLE_PROMPTS, SAMPLE_REPORT_TEXT } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalysisType | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [filePreview, setFilePreview] = useState<{ url: string; type: string; name: string } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setProcessingState('uploading');
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      const mimeType = file.type || 'application/octet-stream';

      setFilePreview({
        url: base64String,
        type: mimeType,
        name: file.name
      });

      // Allow a small delay for the UI to update to 'Uploading' before starting analysis
      setTimeout(() => {
        if (activeTab) {
          startAnalysis({ data: base64Data, mimeType });
        }
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async (fileData: FileData) => {
    if (!activeTab) return;
    setProcessingState('analyzing');
    try {
      const result = await analyzeDocument(fileData, activeTab);
      setAnalysisResult(result);
      setProcessingState('complete');
    } catch (error) {
      console.error(error);
      setProcessingState('error');
    }
  };

  const loadSampleData = () => {
    if (!activeTab) return;
    
    setProcessingState('uploading');
    // Simulate file upload
    const sampleName = "Sample_Lab_Report_John_Doe.txt";
    const sampleMime = "text/plain";
    const sampleData = btoa(SAMPLE_REPORT_TEXT); // Base64 encode sample text

    setFilePreview({
      url: "#", 
      type: sampleMime, 
      name: sampleName
    });

    setTimeout(() => {
      startAnalysis({ data: sampleData, mimeType: sampleMime });
    }, 800);
  };

  const resetApp = () => {
    setProcessingState('idle');
    setAnalysisResult(null);
    setFilePreview(null);
    setActiveTab(null);
    setIsChatOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    if (processingState !== 'idle' || activeTab) {
      resetApp();
      // Allow state to reset before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Components ---

  // Step 1: Mode Selection Cards (The "Tools" section)
  const ModeSelection = () => (
    <div id="tools" className="scroll-mt-24 max-w-5xl mx-auto w-full mb-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Health Tool</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Select the type of analysis you need. Our AI is optimized for both clinical documents and visual assessments.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => setActiveTab(AnalysisType.LAB_REPORT)}
          className="group relative flex flex-col items-start p-8 bg-white rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300 text-left h-full"
        >
          <div className="bg-teal-50 p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <FileSearch className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Analyze Documents</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-grow">
            Upload blood test results, radiology reports, clinical notes, or insurance claims. 
            We extract key biomarkers, flag abnormalities, and explain them in plain English.
          </p>
          <div className="mt-auto w-full pt-6 border-t border-slate-100 flex items-center justify-between text-teal-600 font-bold group-hover:translate-x-1 transition-transform">
            <span>Start Analysis</span> 
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab(AnalysisType.SYMPTOM_CHECK)}
          className="group relative flex flex-col items-start p-8 bg-white rounded-3xl border border-slate-200 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 text-left h-full"
        >
          <div className="bg-blue-50 p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Visual Symptom Check</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-grow">
            Take a photo of a skin condition, injury, or visible symptom. 
            Our vision model identifies characteristics, assesses severity, and suggests potential causes.
          </p>
          <div className="mt-auto w-full pt-6 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
            <span>Check Symptom</span> 
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );

  // Features / Info Section
  const FeaturesSection = () => (
    <div id="features" className="py-20 bg-white border-t border-slate-100 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-teal-600 font-semibold tracking-wider uppercase text-sm">Why ClearHealth?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Medical Intelligence, Simplified.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Powered by Gemini 3 Pro</h3>
            <p className="text-slate-500 leading-relaxed">
              Leveraging the latest multimodal reasoning capabilities to understand context, medical terminology, and visual data with unprecedented accuracy.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Insights</h3>
            <p className="text-slate-500 leading-relaxed">
              Stop waiting for appointments just to understand a result. Get immediate clarity on what your data means and what to do next.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Local & Accessible</h3>
            <p className="text-slate-500 leading-relaxed">
              Find specialists near you based on your specific results. We connect global medical knowledge with local care options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: File Upload Zone
  const UploadZone = () => {
    if (!activeTab) return null;
    const isLab = activeTab === AnalysisType.LAB_REPORT;
    
    return (
      <div className="max-w-xl mx-auto w-full animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isLab ? "Upload Medical Document" : "Upload Symptom Photo"}
          </h2>
          <p className="text-slate-500">
            {SAMPLE_PROMPTS[activeTab]}
          </p>
        </div>

        <div 
          className="border-3 border-dashed border-slate-200 rounded-[2rem] p-10 bg-white hover:border-teal-400 hover:bg-slate-50 transition-all cursor-pointer group shadow-sm hover:shadow-md relative overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="p-5 bg-teal-50 text-teal-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Click to Upload</h3>
            <p className="text-sm text-slate-400 mb-6">or drag and drop file here</p>
            
            <button className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-semibold shadow-lg shadow-slate-200 group-hover:shadow-xl transition-all active:scale-95">
              Browse Files
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept={isLab ? ".pdf,.doc,.docx,.txt,image/*" : "image/*"} 
              onChange={handleFileSelect}
            />
          </div>
        </div>

        {/* Demo Option */}
        {isLab && (
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#F8FAFC] text-slate-400 uppercase font-medium tracking-wider text-xs">Or try this</span>
              </div>
            </div>
            <button 
              onClick={loadSampleData}
              className="mt-6 text-sm text-teal-600 font-medium hover:text-teal-700 hover:underline underline-offset-4"
            >
              Use a Sample Medical Report (Demo)
            </button>
          </div>
        )}

        <button 
          onClick={() => setActiveTab(null)}
          className="mt-12 mx-auto flex items-center text-slate-400 hover:text-slate-600 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to selection
        </button>
      </div>
    );
  };

  const PreviewCard = () => {
    if (!filePreview) return null;
    const isImage = filePreview.type.startsWith('image/');
    
    return (
      <div className="relative mt-8 group animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 flex items-center space-x-4 max-w-sm mx-auto">
          {isImage ? (
            <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
               <img src={filePreview.url} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
               <FileIcon className="w-8 h-8 text-red-500" />
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
             <p className="text-sm font-bold text-slate-800 truncate">{filePreview.name}</p>
             <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{filePreview.type.split('/')[1] || 'FILE'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={resetApp}>
            <div className="bg-teal-600 text-white p-2 rounded-xl shadow-lg shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight block leading-none">{APP_NAME}</span>
              <span className="text-xs text-slate-500 font-medium tracking-wide">MEDICAL INTELLIGENCE</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('root')} className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('tools')} className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Tools</button>
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Features</button>
          </nav>

          {analysisResult ? (
            <button 
              onClick={resetApp}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> New Analysis
            </button>
          ) : (
            <button 
              onClick={() => scrollToSection('tools')}
              className="hidden md:flex px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-md active:scale-95"
            >
              Get Started
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow">
        
        {/* State: Landing / Selection */}
        {processingState === 'idle' && !activeTab && (
          <div className="flex flex-col animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative pt-20 pb-20 px-6 text-center overflow-hidden">
               {/* Background Decor */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl -z-10"></div>

               <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-8 animate-in slide-in-from-top-4 fade-in duration-1000">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                  Gemini 3 Pro + Google Maps Grounding
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                  Demystify your<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                    medical data.
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                  Transform complex lab reports, clinical notes, and visual symptoms into clear, actionable health insights in seconds.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => scrollToSection('tools')}
                    className="px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-lg shadow-xl shadow-teal-600/20 hover:bg-teal-700 hover:scale-105 transition-all w-full sm:w-auto"
                  >
                    Start Analysis Now
                  </button>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all w-full sm:w-auto"
                  >
                    Learn More
                  </button>
                </div>
               </div>
            </div>

            {/* Tools Section */}
            <ModeSelection />

            {/* Features Info Section */}
            <FeaturesSection />

          </div>
        )}

        {/* State: Upload (Specific Mode) */}
        {processingState === 'idle' && activeTab && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
            <UploadZone />
          </div>
        )}

        {/* State: Uploading / Analyzing */}
        {(processingState === 'uploading' || processingState === 'analyzing') && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
             <ThinkingIndicator />
             <PreviewCard />
          </div>
        )}

        {/* State: Error */}
        {processingState === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
            <div className="bg-red-50 p-6 rounded-full mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis Failed</h2>
            <p className="text-slate-500 mb-8 max-w-md">
              We couldn't process this file. Please ensure it's a clear image or standard document format and try again.
            </p>
            <button 
              onClick={resetApp}
              className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* State: Complete (Results) */}
        {processingState === 'complete' && analysisResult && (
          <div className="relative pb-24 pt-8">
            <AnalysisView 
              result={analysisResult} 
              onOpenChat={() => setIsChatOpen(true)}
            />
            {isChatOpen && (
              <ChatWidget 
                analysisContext={analysisResult} 
                onClose={() => setIsChatOpen(false)}
              />
            )}
            
            {/* Chat Trigger (Floating if closed) */}
            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all hover:scale-105 z-50 flex items-center gap-3 group border border-slate-700"
              >
                <div className="relative">
                  <MessageCircle className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-slate-900"></span>
                </div>
                <span className="font-semibold pr-2">Ask Assistant</span>
              </button>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-slate-800 tracking-tight">{APP_NAME}</span>
           </div>
           <p className="text-slate-400 text-sm">
             © 2024 ClearHealth AI. For informational purposes only. Not medical advice.
           </p>
           <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors"><Shield className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors"><Heart className="w-5 h-5" /></a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
