import React, { useState } from 'react';
import { IdvsReport, EvaluationCategory, MetricScore } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { 
  CheckCircle, AlertTriangle, XCircle, Copy, ChevronDown, ChevronUp, 
  Cpu, Search, MessageSquareText, Terminal
} from 'lucide-react';

interface Props {
  report: IdvsReport;
}

const MetricRow: React.FC<{ metric: MetricScore }> = ({ metric }) => {
  const percentage = (metric.score / metric.maxScore) * 100;
  let color = 'bg-red-500';
  if (percentage >= 80) color = 'bg-emerald-500';
  else if (percentage >= 50) color = 'bg-yellow-500';

  return (
    <div className="mb-4 border-b border-slate-700 pb-4 last:border-0">
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-sm text-slate-400">{metric.id}</span>
        <span className="font-bold text-slate-200">{metric.score} <span className="text-slate-500 text-xs">/ {metric.maxScore}</span></span>
      </div>
      <div className="flex justify-between items-baseline mb-2">
        <h4 className="text-md font-medium text-white">{metric.name}</h4>
      </div>
      
      <div className="w-full bg-slate-800 h-2 rounded-full mb-3">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
            <span className="block text-xs uppercase text-slate-500 font-bold mb-1">Observation</span>
            <p className="text-slate-300 leading-relaxed">{metric.observation}</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
            <span className="block text-xs uppercase text-emerald-500/80 font-bold mb-1">Recommendation</span>
            <p className="text-slate-300 leading-relaxed">{metric.recommendation}</p>
        </div>
      </div>
    </div>
  );
};

const CategoryCard: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    data: any; 
    color: string 
}> = ({ title, icon, data, color }) => {
  const [expanded, setExpanded] = useState(false);
  const percentage = Math.round((data.score / data.maxScore) * 100);

  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all duration-300 ${expanded ? 'ring-1 ring-slate-600' : ''}`}>
      <div 
        className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${color} text-white`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md">{data.summary.substring(0, 80)}...</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="text-right">
                <div className="text-2xl font-bold font-mono">{data.score}<span className="text-slate-500 text-lg">/{data.maxScore}</span></div>
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${percentage >= 80 ? 'bg-emerald-900 text-emerald-300' : percentage >= 60 ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                    {percentage}% Compliance
                </div>
            </div>
            {expanded ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
        </div>
      </div>

      {expanded && (
        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <div className="mb-6">
                <p className="text-slate-300 italic border-l-2 border-slate-600 pl-4 py-1">
                    "{data.summary}"
                </p>
            </div>
          {data.metrics.map((m: MetricScore) => (
            <MetricRow key={m.id} metric={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ResultsDashboard: React.FC<Props> = ({ report }) => {
  
  const radarData = [
    { subject: 'GEO', A: (report.breakdown.GEO.score / 40) * 100, fullMark: 100 },
    { subject: 'AIO', A: (report.breakdown.AIO.score / 30) * 100, fullMark: 100 },
    { subject: 'SEO', A: (report.breakdown.SEO.score / 30) * 100, fullMark: 100 },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 z-0"></div>
          <div className="z-10 text-center">
            <h2 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">IDVS Score</h2>
            <div className="text-7xl font-black text-white font-mono tracking-tighter mb-2">
              {report.overallScore}
            </div>
            <div className={`text-2xl font-bold ${getGradeColor(report.grade)}`}>
              Grade {report.grade}
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-center h-64 lg:h-auto">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Critical Issues */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto max-h-64 lg:max-h-auto custom-scrollbar">
            <h3 className="flex items-center gap-2 text-red-400 font-bold mb-4">
                <AlertTriangle size={20} />
                Critical Issues
            </h3>
            <ul className="space-y-3">
                {report.criticalIssues.length > 0 ? (
                    report.criticalIssues.map((issue, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex gap-2 items-start">
                            <XCircle size={14} className="mt-1 text-red-500 shrink-0" />
                            <span>{issue}</span>
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-emerald-400 flex gap-2 items-center">
                        <CheckCircle size={16} />
                        No critical blocking issues found.
                    </li>
                )}
            </ul>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Detailed Analysis</h2>
        
        <CategoryCard 
            title="Generative Engine Optimization" 
            icon={<Cpu size={24} />} 
            data={report.breakdown.GEO}
            color="bg-purple-600"
        />
        <CategoryCard 
            title="Answer Engine Optimization" 
            icon={<MessageSquareText size={24} />} 
            data={report.breakdown.AIO}
            color="bg-blue-600"
        />
        <CategoryCard 
            title="Search Engine Optimization" 
            icon={<Search size={24} />} 
            data={report.breakdown.SEO}
            color="bg-emerald-600"
        />
      </div>

      {/* JSON-LD Suggestion */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden mt-8">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
                <Terminal size={18} />
                Suggested Structured Data (JSON-LD)
            </h3>
            <button 
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(report.jsonLdSuggestion, null, 2))}
            >
                <Copy size={14} /> Copy
            </button>
        </div>
        <div className="p-6 overflow-x-auto">
            <pre className="text-xs text-emerald-400 font-mono">
                {JSON.stringify(report.jsonLdSuggestion, null, 2)}
            </pre>
        </div>
      </div>

    </div>
  );
};
