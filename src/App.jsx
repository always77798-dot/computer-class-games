import React, { useState } from 'react';
import { 
  Sparkles, ShieldAlert, Play, Home, Gamepad2, LayoutGrid, Code
} from 'lucide-react';

// 🌟 引入分離出去的小遊戲模組
import AiHeroGame from './games/AiHeroGame';

// ==========================================
// 1. 遊戲資料設定區 (可在此新增遊戲資訊)
// ==========================================
const GAMES_LIST = [
  {
    id: 'ai-heroes',
    title: 'AI 小尖兵課堂測驗',
    description: '認識 ChatGPT、Gemini、Copilot 等 AI 英雄，並透過闖關與問答完成測驗！',
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    tags: ['動作闖關', '知識問答']
  },
  {
    id: 'coming-soon-1',
    title: '鍵盤英打保衛戰',
    description: '（開發中）外星人來襲！輸入正確的英文字母發射導彈保衛地球。',
    icon: <Code className="w-8 h-8 text-blue-500" />,
    color: 'bg-gradient-to-br from-gray-400 to-gray-500',
    tags: ['打字練習', '即將推出'],
    disabled: true
  },
  {
    id: 'coming-soon-2',
    title: '網路安全大挑戰',
    description: '（開發中）分辨釣魚網站與詐騙訊息，成為網路安全大師。',
    icon: <ShieldAlert className="w-8 h-8 text-green-500" />,
    color: 'bg-gradient-to-br from-gray-400 to-gray-500',
    tags: ['情境模擬', '即將推出'],
    disabled: true
  }
];

// ==========================================
// 2. 入口網站首頁 (Game Portal Dashboard)
// ==========================================
const PortalHome = ({ onSelectGame }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      {/* 首頁歡迎區塊 */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-4 border-indigo-100 flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-4">W E L C O M E</span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4 leading-tight">
            準備好展開你的<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">數位學習冒險</span>了嗎？
          </h1>
          <p className="text-xl text-gray-600 font-medium">請從下方選擇你想挑戰的遊戲關卡，透過遊玩來複習電腦課所學的知識吧！</p>
        </div>
        <div className="w-48 h-48 md:w-64 md:h-64 bg-indigo-50 rounded-full flex items-center justify-center border-8 border-white shadow-inner flex-shrink-0">
          <Gamepad2 className="w-24 h-24 md:w-32 md:h-32 text-indigo-400" />
        </div>
      </div>

      {/* 遊戲列表清單 */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <LayoutGrid className="text-indigo-600 w-8 h-8" />
        <h2 className="text-3xl font-bold text-gray-800">遊戲關卡列表</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAMES_LIST.map((game) => (
          <div 
            key={game.id} 
            className={`relative rounded-3xl overflow-hidden shadow-lg transition-all duration-300 border-4 border-transparent flex flex-col h-full
              ${game.disabled ? 'opacity-80 grayscale-[30%] cursor-not-allowed' : 'hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-300 cursor-pointer bg-white'}
            `}
            onClick={() => !game.disabled && onSelectGame(game.id)}
          >
            <div className={`h-32 ${game.color} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30 transform transition-transform group-hover:scale-110">
                {game.icon}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col bg-white">
              <div className="flex gap-2 mb-3">
                {game.tags.map(tag => (
                  <span key={tag} className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">{tag}</span>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-600 flex-1">{game.description}</p>
              
              {!game.disabled ? (
                <button className="mt-6 w-full bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-indigo-600 hover:text-white transition-colors">
                  <Play size={20} /> 開始遊玩
                </button>
              ) : (
                <button disabled className="mt-6 w-full bg-gray-100 text-gray-400 font-bold py-3 rounded-xl flex justify-center items-center gap-2">
                  敬請期待
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. 主應用程式 (App) - 負責網頁路由切換
// ==========================================
export default function App() {
  const [activeView, setActiveView] = useState('home');

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-indigo-200 selection:text-indigo-900 pb-12 relative z-0">
      
      {/* 網站全域背景動畫效果 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* 頂部導覽列 Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setActiveView('home')}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg shadow-sm">
                <Code size={24} />
              </div>
              <span className="font-black text-xl text-gray-800 tracking-wide">
                哲民老師的<span className="text-indigo-600">電腦課入口網</span>
              </span>
            </div>
            
            {activeView !== 'home' && (
              <button 
                onClick={() => setActiveView('home')}
                className="flex items-center gap-2 text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors"
              >
                <Home size={16} /> 回大廳
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 主要內容區塊 */}
      <main className="container mx-auto mt-6">
        {activeView === 'home' && (
          <PortalHome onSelectGame={(gameId) => setActiveView(gameId)} />
        )}
        
        {/* 🌟 在此配置路由：載入獨立的小遊戲組件 */}
        {activeView === 'ai-heroes' && (
          <AiHeroGame onBackToPortal={() => setActiveView('home')} />
        )}

      </main>

      {/* 全域 CSS 動畫設定 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}} />
    </div>
  );
}
