import React, { useState } from 'react';
import { 
  Sparkles, ShieldAlert, Play, Home, Gamepad2, LayoutGrid, Code, Maximize, Minimize
} from 'lucide-react';

// 🌟 引入分離出去的小遊戲模組
import MouseSurvivalGame from './games/MouseSurvivalGame';
import GoogleMagicAcademy from './games/GoogleMagicAcademy';
import AiHeroGame from './games/AiHeroGame';
import ChromeAgentGame from './games/ChromeAgentGame';
import SpaceCampGame from './games/SpaceCampGame';

// ==========================================
// 1. 遊戲資料設定區 (可在此新增遊戲資訊)
// ==========================================
const GAMES_LIST = [
  {
    id: 'mouse-survival',
    title: '鼠鼠的文件生存戰',
    description: '在 Google 文件模擬器中閃避怪獸，體驗刺激的割草生存戰與知識大考驗！',
    icon: <span className="text-4xl leading-none">🐹</span>,
    color: 'bg-amber-100 border-amber-400 text-amber-800',
    tags: ['114-3下', '尚未開放', '生存割草', '雲端文件'],
    disabled: true
  },
  { 
    id: 'google-magic-academy',
    title: '雲端魔法學院',
    description: '多項實作任務、刺激的雲端防禦戰與最終的魔法測驗！',
    icon: <span className="text-4xl leading-none">🪄</span>,
    color: 'bg-indigo-100 border-indigo-400 text-indigo-800',
    tags: ['114-3下', '塔防遊戲', '雲端應用', '資訊安全'],
    disabled: false 
  },
  {
    id: 'ai-heroes',
    title: 'AI 小尖兵課堂測驗',
    description: '認識 ChatGPT、Gemini、Copilot 等 AI 英雄，並透過闖關與問答完成測驗！',
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    color: 'bg-gradient-to-br from-indigo-400 to-purple-800 text-white border-transparent',
    tags: ['114-3下', '動作闖關', 'AI模型知識'],
    disabled: false
  },
  { // 修正了原本這裡多一個 { 的語法錯誤
    id: 'chrome-agent',
    title: '網路小特務探險指南',
    description: '潛入網路世界！跟著特務一起學習精準搜尋、建立百寶箱與無痕隱身術。',
    icon: <span className="text-4xl leading-none">🕵️‍♂️</span>,
    color: 'bg-emerald-100 border-emerald-400 text-emerald-800',
    tags: ['114-3下', '滑塊拼圖', '隱私安全', '瀏覽器'],
    disabled: false
  },
  { 
  id: 'space-camp', 
  title: '星際探險特訓營', 
  description: '跟著特務一起完成 4 項基地訓練：攔截IP、視窗縮放、自訂Chrome與引擎測速！', 
  icon: <span className="text-4xl leading-none">🚀</span>, 
  color: 'bg-blue-100 border-blue-400 text-blue-800', 
  tags: ['114-3下', '互動闖關', '瀏覽器','網路知識'], 
  disabled: false 
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
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-4 leading-tight">
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

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // 請求全螢幕
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`全螢幕請求失敗: ${err.message}`);
      });
    } else {
      // 退出全螢幕
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  // 監聽鍵盤 Esc 退出全螢幕的事件，確保按鈕狀態同步
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg shadow-sm flex items-center justify-center">
                <img src="/LogoT.png" alt="網站Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-black text-xl text-gray-800 tracking-wide">
                哲民老師的<span className="text-indigo-600">電腦課複習遊戲</span>
              </span>
            </div>

              <button 
                onClick={toggleFullscreen}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-full text-white font-bold text-sm transition-all active:scale-95 shadow-md"
              >
                {isFullscreen ? <Minimize className="w-4 h-4 text-emerald-400" /> : <Maximize className="w-4 h-4 text-blue-400" />}
                <span className="hidden sm:inline">{isFullscreen ? '退出全螢幕' : '全螢幕模式'}</span>
              </button>
            
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

        {activeView === 'mouse-survival' && (
          <MouseSurvivalGame onBackToPortal={() => setActiveView('home')} />
        )}

        {activeView === 'google-magic-academy' && (
          <GoogleMagicAcademy onBackToPortal={() => setActiveView('home')} />
        )}
        
        {activeView === 'ai-heroes' && (
          <AiHeroGame onBackToPortal={() => setActiveView('home')} />
        )}

        {/* 🌟 新增的網路小特務路由顯示邏輯 */}
        {activeView === 'chrome-agent' && (
          <ChromeAgentGame onBackToPortal={() => setActiveView('home')} />
        )}

        {activeView === 'space-camp' && (
          <SpaceCampGame onBackToPortal={() => setActiveView('home')} />
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
