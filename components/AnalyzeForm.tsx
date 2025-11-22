import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface Props {
  onAnalyze: (text: string, title?: string) => void;
  isAnalyzing: boolean;
}

export const AnalyzeForm: React.FC<Props> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAnalyze(text, title);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
            setText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Content Title (Optional)</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., The Ultimate Guide to Vector Databases"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Content Body *</label>
                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your article content here for IDVS evaluation..."
                        className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm leading-relaxed resize-y"
                        required
                    />
                    <div className="absolute bottom-3 right-3">
                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                            {text.length} chars
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg border-dashed">
                 <div className="text-sm text-slate-400">
                    Or upload a .txt / .md file
                 </div>
                 <input 
                    type="file" 
                    accept=".txt,.md"
                    onChange={handleFileChange}
                    className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-900/50 file:text-indigo-300 hover:file:bg-indigo-900 cursor-pointer"
                 />
            </div>
        </div>

        <div className="flex justify-end">
            <button
                type="submit"
                disabled={isAnalyzing || !text.trim()}
                className={`
                    flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20
                    ${isAnalyzing || !text.trim() 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transform hover:-translate-y-0.5'}
                `}
            >
                {isAnalyzing ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Analyzing Structure...
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Run IDVS Audit
                    </>
                )}
            </button>
        </div>
    </form>
  );
};
