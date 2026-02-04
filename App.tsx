
import React, { useState, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie
} from 'recharts';
import { ICONS, SYSTEM_ARCHITECTURE, MVP_ROADMAP } from './constants';
import { UserProfile, NutritionReport } from './types';
import { analyzeFoodImage } from "./services/GeminiService.ts";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dash' | 'scan' | 'design'>('dash');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    condition: 'diabetes',
    dailyGoalCalories: 2000,
    dailyGoalProtein: 75
  });
  
  const [report, setReport] = useState<NutritionReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeFoodImage(base64, userProfile);
        setReport(result);
        setActiveTab('dash');
      } catch (error) {
        console.error("Scanning failed", error);
        alert("Scanning failed. Please try again.");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const chartData = report?.items.map(item => ({
    name: item.name,
    calories: item.calories,
    protein: item.macros.protein
  })) || [];

  const macroData = report ? [
    { name: 'Protein', value: report.items.reduce((acc, i) => acc + i.macros.protein, 0) },
    { name: 'Carbs', value: report.items.reduce((acc, i) => acc + i.macros.carbs, 0) },
    { name: 'Fats', value: report.items.reduce((acc, i) => acc + i.macros.fats, 0) },
  ] : [];

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
          <h1 className="text-xl font-bold text-slate-800">NutriLens AI</h1>
        </div>
        <select 
          className="bg-slate-100 rounded-full px-4 py-1.5 text-sm font-medium border-none focus:ring-2 focus:ring-indigo-500"
          value={userProfile.condition}
          onChange={(e) => setUserProfile({...userProfile, condition: e.target.value as any})}
        >
          <option value="none">General Health</option>
          <option value="diabetes">Type 2 Diabetes</option>
          <option value="pcos">PCOS/PCOD</option>
          <option value="weight-loss">Weight Loss</option>
        </select>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        {activeTab === 'dash' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {!report ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ICONS.Scan />
                </div>
                <h2 className="text-2xl font-bold">No Meal Scanned Today</h2>
                <p className="text-slate-500">Scan your Indian meal to get instant nutritional insights.</p>
                <button 
                  onClick={() => setActiveTab('scan')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
                >
                  Start Scanning
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Calories</p>
                    <p className="text-2xl font-bold text-indigo-600">{report.totalCalories} <span className="text-sm font-normal text-slate-400">kcal</span></p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Protein</p>
                    <p className="text-2xl font-bold text-emerald-600">{macroData[0].value.toFixed(1)} <span className="text-sm font-normal text-slate-400">g</span></p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Carbs</p>
                    <p className="text-2xl font-bold text-orange-600">{macroData[1].value.toFixed(1)} <span className="text-sm font-normal text-slate-400">g</span></p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Fiber</p>
                    <p className="text-2xl font-bold text-teal-600">{report.items.reduce((acc, i) => acc + i.macros.fiber, 0).toFixed(1)} <span className="text-sm font-normal text-slate-400">g</span></p>
                  </div>
                </div>

                {/* Main Visuals */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Calorie Breakdown
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="calories" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Macro Ratio
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={macroData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#f97316" />
                            <Cell fill="#8b5cf6" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Protein</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Carbs</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-violet-500 rounded-full"></div> Fats</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Suitability & Items */}
                <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    🛡️ Clinical Suitability: {userProfile.condition.toUpperCase()}
                  </h3>
                  <p className="text-indigo-100 mb-4">{report.healthSuitability}</p>
                  <div className="space-y-2">
                    {report.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <p className="text-sm">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold px-2">Detailed Dish Analysis</h3>
                  {report.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-indigo-200 transition">
                      <div>
                        <h4 className="font-bold flex items-center gap-2">
                          {item.name}
                          {item.isHighOil && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">High Oil Sheen Detected</span>}
                        </h4>
                        <p className="text-sm text-slate-500">{item.weight}g • {item.calories} kcal</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase">Macros (P/C/F)</div>
                        <div className="font-mono text-sm">{item.macros.protein}/{item.macros.carbs}/{item.macros.fats}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setReport(null)}
                  className="w-full py-4 text-slate-400 hover:text-slate-600 font-medium transition"
                >
                  Reset Daily Log
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500 max-w-xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 shadow-inner flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                <ICONS.Scan />
              </div>
              <h2 className="text-2xl font-bold mb-2">Food Scene Analysis</h2>
              <p className="text-slate-500 mb-8">Upload a top-down photo of your plate or Indian Thali. For best results, use a 1 Rupee coin as reference.</p>
              
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />

              <button 
                disabled={isScanning}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                  isScanning 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    AI Multi-Angle Processing...
                  </>
                ) : (
                  <>Capture Meal Photo</>
                )}
              </button>
              
              <p className="mt-4 text-xs text-slate-400">NutriLens AI uses segmented multi-view estimation.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-sm mb-1">3D Segmentation</h4>
                <p className="text-xs text-slate-500">Detecting individual items on the plate (e.g. Roti from Dal).</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-sm mb-1">Volumetric Logic</h4>
                <p className="text-xs text-slate-500">Estimating height/volume based on shadow and perspective.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">System Architecture</h3>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-bold text-indigo-600 text-sm">Mobile Engine</h4>
                    <p className="text-sm text-slate-600">{SYSTEM_ARCHITECTURE.mobile}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-600 text-sm">Backend & Scaling</h4>
                    <p className="text-sm text-slate-600">{SYSTEM_ARCHITECTURE.backend}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-600 text-sm">AI Model Serving</h4>
                    <p className="text-sm text-slate-600">{SYSTEM_ARCHITECTURE.aiPipeline}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Strategic Roadmap</h3>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  {MVP_ROADMAP.map((step, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-indigo-100 pb-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white"></div>
                      <h4 className="font-bold text-sm">{step.phase}</h4>
                      <p className="text-xs text-slate-500">{step.focus}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <h3 className="font-bold text-emerald-800 mb-2">Medical Safety Positioning</h3>
              <p className="text-sm text-emerald-700 leading-relaxed">
                NutriLens AI is an educational nutrition assessment tool. It does not provide medical diagnosis. 
                Clinical validation will follow Phase 3 under HIPAA and GDPR compliance for secure health data handling. 
                Always consult your healthcare provider before significant diet changes.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-4 z-40">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('dash')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'dash' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <ICONS.Stats />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('scan')}
            className={`w-14 h-14 -mt-10 rounded-full flex items-center justify-center shadow-lg transition transform active:scale-95 ${
              activeTab === 'scan' 
              ? 'bg-indigo-600 text-white shadow-indigo-200' 
              : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <ICONS.Scan />
          </button>

          <button 
            onClick={() => setActiveTab('design')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'design' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <ICONS.Design />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Architecture</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
