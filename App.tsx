import React, { useState } from 'react';
import { AnalyzeForm } from './components/AnalyzeForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { analyzeContent } from './services/geminiService';
import { IdvsReport } from './types';
import { ShieldCheck, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [report, setReport] = useState<IdvsReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string, title?: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeContent(text, title);
      setReport(result);
    } catch (err) {
      setError("Analysis failed. Please ensure your API key is valid and try again. " + (err as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20">
      {/* Navigation / Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">IDVS Auditor</h1>
                <span className="text-xs text-slate-400 font-mono block -mt-1">Integrated Digital Visibility Standard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-slate-400 font-mono">System Operational</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Introduction / Hero */}
        {!report && !isAnalyzing && (
            <div className="text-center mb-16 animate-in slide-in-from-bottom-5 fade-in duration-700">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Is your content ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">AI Search</span>?
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                    Evaluate your articles against the 2025 IDVS framework. We audit for Generative Engine Optimization (GEO), Answer Engine Optimization (AIO), and traditional SEO.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                        <div className="text-purple-400 font-bold mb-2">GEO (40%)</div>
                        <div className="text-sm text-slate-500">Optimizes for LLM retrieval, information gain, and RAG readability.</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                        <div className="text-blue-400 font-bold mb-2">AIO (30%)</div>
                        <div className="text-sm text-slate-500">Optimizes for direct answer snippets and voice search structure.</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                        <div className="text-emerald-400 font-bold mb-2">SEO (30%)</div>
                        <div className="text-sm text-slate-500">Foundational discovery, E-E-A-T, and technical health.</div>
                    </div>
                </div>
            </div>
        )}

        {/* Input Section */}
        {!report && (
            <AnalyzeForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        )}

        {/* Error Message */}
        {error && (
            <div className="max-w-4xl mx-auto mt-6 bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3">
                <Activity size={20} />
                {error}
            </div>
        )}

        {/* Results Section */}
        {report && (
            <div className="mt-8">
                <button 
                    onClick={() => setReport(null)}
                    className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    ← Evaluate Another Article
                </button>
                <ResultsDashboard report={report} />
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
