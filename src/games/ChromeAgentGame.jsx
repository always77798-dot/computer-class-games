import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Star, User, Shield, Ghost, Settings, Home, 
  History, AlertTriangle, CheckCircle, ChevronRight, X, UserX,
  Target, Crosshair, Zap, Unlock, Lock, Send, RefreshCw,
  MoreVertical, Chrome, LayoutGrid, Terminal, Clock,
  Cpu, Move
} from 'lucide-react';

// 補齊缺失的 Icon
const ChevronLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);

// 修改 1：接收 onBackToPortal 參數並更改元件名稱
export default function ChromeAgentGame({ onBackToPortal }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [score, setScore] = useState(0); 

  const totalMissions = 5; 
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalMissions + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const bgColor = incognitoMode ? 'bg-zinc-950' : 'bg-slate-900';
  const textColor = incognitoMode ? 'text-zinc-300' : 'text-slate-100';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-2 md:p-6 transition-colors duration-700 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden`}>
      
      {/* 修改 2：新增左上角「離開遊戲」按鈕 */}
      <button 
        onClick={onBackToPortal}
        className="absolute top-4 left-4 z-50 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 border border-slate-600 transition-transform hover:-translate-x-1"
      >
        <ChevronLeft className="w-5 h-5" /> 離開遊戲
      </button>

      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col h-full min-h-[90vh] mt-12 md:mt-0">
        <header className="flex flex-col md:flex-row items-center justify-between mb-4 bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-700/50 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="relative">
              <Shield className="w-10 h-10 text-emerald-500" />
              <Zap className="w-4 h-4 text-yellow-400 absolute bottom-0 right-0 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase flex items-center">
                CHROME <span className="text-emerald-400 mx-2">AGENT</span> ACADEMY
              </h1>
              <p className="text-xs text-emerald-500/70 font-mono tracking-widest">網路小特務探險指南</p>
            </div>
          </div>
          
          <div className="flex items-center bg-slate-950 p-2 rounded-xl border border-slate-700 shadow-inner">
            <span className="text-xs font-mono text-slate-400 mr-3">MISSION</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="relative flex items-center justify-center w-8 h-8">
                  {currentStep > step ? (
                    <CheckCircle className="w-6 h-6 text-emerald-500 animate-fade-in" />
                  ) : currentStep === step ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600"></div>
                  )}
                  {step < totalMissions && <div className={`absolute -right-3 w-2 h-[2px] ${currentStep > step ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>}
                </div>
              ))}
            </div>
          </div>
        </header>

        <main className={`flex-grow rounded-3xl shadow-2xl border transition-all duration-500 overflow-hidden relative flex flex-col ${incognitoMode ? 'bg-zinc-900 border-zinc-700 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'bg-slate-800 border-slate-600 shadow-[0_0_40px_rgba(16,185,129,0.1)]'}`}>
          {!incognitoMode && currentStep > 0 && currentStep < 6 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/20 animate-scan pointer-events-none"></div>
          )}

          {incognitoMode && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
              <Ghost className="w-[600px] h-[600px] text-zinc-800/40 animate-float" />
              <div className="absolute top-4 right-4 flex items-center space-x-2 text-zinc-500 font-mono text-sm">
                <Ghost className="w-4 h-4" />
                <span>INCOGNITO SECURE LINK</span>
              </div>
            </div>
          )}

          <div className="p-4 md:p-6 flex-grow relative z-10 flex flex-col">
            {currentStep === 0 && <WelcomeScreen onNext={nextStep} />}
            {currentStep === 1 && <Mission1 onNext={nextStep} setScore={setScore} score={score} />}
            {currentStep === 2 && <Mission2 onNext={nextStep} setScore={setScore} score={score} />}
            {currentStep === 3 && <Mission3_Puzzle onNext={nextStep} setScore={setScore} score={score} />}
            {currentStep === 4 && (
              <Mission4_Incognito 
                onNext={nextStep} 
                incognitoMode={incognitoMode} 
                setIncognitoMode={setIncognitoMode} 
                setScore={setScore}
                score={score}
              />
            )}
            {/* 修改 3：將 onBackToPortal 傳入 SuccessScreen */}
            {currentStep === 5 && <FinalBossQuiz onNext={nextStep} setScore={setScore} score={score} />}
            {currentStep === 6 && <SuccessScreen score={score} onBackToPortal={onBackToPortal} />}
          </div>

          {currentStep > 0 && currentStep < 6 && (
            <div className="bg-slate-950 p-3 flex justify-between items-center border-t border-slate-700/50 z-10 flex-shrink-0">
              <button 
                onClick={prevStep}
                className="flex items-center px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-bold"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> 回報總部 (上一關)
              </button>
              
              <div className="flex items-center bg-slate-900 px-4 py-1.5 rounded-full border border-emerald-900/50 shadow-inner">
                <Star className="w-4 h-4 text-yellow-400 mr-2 drop-shadow-md" />
                <span className="font-mono font-bold text-emerald-400 text-sm">特務點數: {score} pt</span>
              </div>
            </div>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .typing-effect { overflow: hidden; white-space: nowrap; border-right: 2px solid #34d399; animation: typing 1.5s steps(30, end), blink-caret 0.75s step-end infinite; }
        @keyframes typing { from { width: 0 } to { width: 100% } }
        @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: #34d399; } }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        .animate-dash { stroke-dasharray: 100; stroke-dashoffset: 100; animation: dash 1s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

/* ================= 高擬真 Chrome 瀏覽器元件 ================= */
function ChromeBrowser({ 
  title, url, icon, isIncognito, isBookmarked, 
  onBookmarkClick, bookmarks, sites, children, 
  onProfileClick, showProfileMenu, onLogoutClick 
}) {
  const bgTabBar = isIncognito ? 'bg-[#202124]' : 'bg-[#dee1e6]';
  const bgActiveTab = isIncognito ? 'bg-[#323639]' : 'bg-white';
  const textTab = isIncognito ? 'text-gray-300' : 'text-gray-700';
  const bgNav = isIncognito ? 'bg-[#323639]' : 'bg-white';
  const bgAddress = isIncognito ? 'bg-[#202124]' : 'bg-[#f1f3f4]';
  const textAddress = isIncognito ? 'text-white' : 'text-gray-900';

  return (
    <div className="rounded-xl overflow-hidden border border-slate-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col w-full h-full font-sans text-sm relative">
      <div className={`flex items-end px-3 pt-2 ${bgTabBar} space-x-2`}>
        <div className="flex space-x-1.5 pb-2.5 pl-1 mr-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
        </div>
        <div className={`flex items-center px-3 py-1.5 rounded-t-lg min-w-[200px] max-w-[240px] ${bgActiveTab} ${textTab} relative z-10 shadow-sm`}>
          <span className="mr-2 text-base">{icon}</span>
          <span className="truncate flex-grow text-xs font-medium">{title}</span>
          <X className="w-3 h-3 opacity-50 hover:opacity-100 cursor-pointer ml-2 shrink-0" />
        </div>
        <div className={`pb-2 px-2 cursor-pointer text-lg font-light ${isIncognito ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>+</div>
      </div>

      <div className={`flex items-center px-2 py-1.5 ${bgNav} ${isIncognito ? 'border-[#444]' : 'border-gray-200'} border-b space-x-3`}>
        <div className="flex space-x-1">
          <div className={`p-1.5 rounded-full ${isIncognito ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} cursor-pointer`}><ChevronLeft className="w-4 h-4" /></div>
          <div className={`p-1.5 rounded-full opacity-30 ${isIncognito ? 'text-gray-300' : 'text-gray-600'}`}><ChevronRight className="w-4 h-4" /></div>
          <div className={`p-1.5 rounded-full ${isIncognito ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} cursor-pointer`}><RefreshCw className="w-3.5 h-3.5" /></div>
        </div>
        
        <div className={`flex-grow flex items-center px-4 py-1.5 rounded-full ${bgAddress} border border-transparent transition-all relative ${!isIncognito ? 'hover:bg-[#e8eaed]' : ''}`}>
          {isIncognito ? <Ghost className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" /> : <Lock className="w-3.5 h-3.5 mr-2 text-gray-500 shrink-0" />}
          <span className={`flex-grow truncate text-sm tracking-wide ${textAddress}`}>{url}</span>
          
          {onBookmarkClick && (
            <button onClick={onBookmarkClick} className="ml-2 p-1 rounded-full hover:bg-black/5 focus:outline-none relative group">
              <Star className={`w-4 h-4 transition-all duration-300 ${isBookmarked ? 'fill-blue-500 text-blue-500 scale-110' : 'text-gray-400 group-hover:text-gray-600'}`} />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2 pl-1 relative">
          {isIncognito && (
            <div className="flex items-center space-x-1 text-blue-300 text-xs font-bold bg-[#202124] border border-[#5f6368] px-2 py-1 rounded-full pointer-events-none">
              <Ghost className="w-3.5 h-3.5" /> <span className="hidden sm:inline">無痕模式</span>
            </div>
          )}
          
          <div className="relative">
            <div 
              onClick={onProfileClick}
              className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:ring-2 hover:ring-emerald-300 transition-all shadow-sm"
            >
              特
            </div>
            {showProfileMenu && (
              <div className={`absolute top-10 right-0 w-64 ${isIncognito ? 'bg-[#292a2d] border-[#5f6368] text-gray-200' : 'bg-white border-gray-200 text-gray-800'} rounded-xl shadow-2xl border z-[60] p-2 animate-fade-in-up`}>
                <div className={`flex items-center p-3 border-b ${isIncognito ? 'border-[#5f6368]' : 'border-gray-100'}`}>
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mr-3 shadow-inner">特</div>
                  <div>
                    <p className="font-bold text-sm">網路小特務</p>
                    <p className={`text-xs ${isIncognito ? 'text-gray-400' : 'text-gray-500'}`}>agent@ttces.ntpc.edu.tw</p>
                  </div>
                </div>
                <div className="p-2 mt-1">
                  <button 
                    onClick={onLogoutClick} 
                    className={`w-full flex items-center p-3 ${isIncognito ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'} rounded-lg transition-colors group text-sm font-bold`}
                  >
                    <UserX className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" /> 
                    刪除設定檔 (清除資料)
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={`p-1.5 rounded-full cursor-pointer ${isIncognito ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>
      </div>

      {!isIncognito && (
        <div className="bg-white px-3 flex items-center space-x-2 border-b border-gray-200 text-[13px] text-gray-700 min-h-[34px] scrollbar-hide overflow-x-auto">
          {bookmarks?.length > 0 ? bookmarks.map((index) => (
            <div key={index} className="flex items-center hover:bg-gray-100 px-2 py-1.5 rounded-full cursor-pointer transition-colors max-w-[120px] shrink-0 border border-gray-100">
              <span className="mr-1.5 text-sm leading-none">{sites[index].icon}</span>
              <span className="truncate">{sites[index].title}</span>
            </div>
          )) : (
            <span className="text-gray-400 italic px-2">將網頁加入書籤後，這裡會出現捷徑</span>
          )}
        </div>
      )}

      <div className="flex-grow relative overflow-hidden bg-white">
        {children}
      </div>
    </div>
  );
}

/* ================= 各關卡元件區塊 ================= */
function WelcomeScreen({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-12 animate-fade-in">
      <div className="relative mb-8 group cursor-pointer" onClick={onNext}>
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
        <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center border-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)] relative z-10 overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <User className="w-16 h-16 text-emerald-400" />
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/30 to-transparent"></div>
        </div>
      </div>
      
      <div className="inline-block bg-slate-900 border border-slate-700 px-4 py-1 rounded-full mb-6">
        <span className="text-emerald-400 font-mono text-sm flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
          SYSTEM ONLINE / READY FOR TRAINING
        </span>
      </div>

      <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
        解鎖你的<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">特務潛能</span>
      </h2>
      
      <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed">
        網路世界充滿了未知的情報與危機。<br/>
        今天，你將接受<strong className="text-amber-400">哲民老師</strong>的四項嚴格訓練：<br/>
        <strong className="text-emerald-300">精準搜索</strong>、<strong className="text-emerald-300">基地建立</strong>、<strong className="text-emerald-300">網址解碼</strong>與<strong className="text-emerald-300">隱形撤退</strong>。
      </p>
      
      <button 
        onClick={onNext}
        className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-2xl rounded-full overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.8)] transition-all hover:-translate-y-1"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        <span className="relative z-10 flex items-center">
          <Unlock className="w-6 h-6 mr-3" /> 授權存取：開始訓練
        </span>
      </button>
    </div>
  );
}

function Mission1({ onNext, setScore, score }) {
  const [searchState, setSearchState] = useState('idle');
  const [showAI, setShowAI] = useState(false);

  const handleSearch = (type) => {
    setSearchState('typing');
    setTimeout(() => {
      setSearchState(type);
      if (type === 'correct') {
        setScore(prev => prev + 100);
        setTimeout(() => setShowAI(true), 1200);
      }
    }, 800);
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-black text-emerald-400 flex items-center mb-1 uppercase drop-shadow-md">
          <Target className="mr-2 w-6 h-6" /> Mission 01: 情報狙擊手
        </h2>
        <p className="text-slate-300 text-sm">特務不說廢話，請在左側選擇最精準的「關鍵字」發射，觀看右側 Google 的反應！</p>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-4 items-stretch h-[450px]">
        <div className="w-full lg:w-1/3 bg-slate-900 rounded-xl p-4 border border-slate-700 flex flex-col shadow-inner z-20">
          <p className="text-emerald-400 font-mono text-sm mb-3 font-bold border-b border-slate-700 pb-2">
            [系統] 請選擇搜尋指令：
          </p>
          
          <button 
            disabled={searchState !== 'idle' && searchState !== 'wrong'}
            onClick={() => handleSearch('wrong')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start group mb-4 bg-slate-800 ${searchState === 'wrong' ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-slate-700 hover:border-slate-500'}`}
          >
            <span className="text-2xl mr-3 opacity-80 group-hover:opacity-100">💬</span>
            <div>
              <p className="font-bold text-slate-200">聊天式提問</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">我想知道那隻很大隻的霸王龍到底長多高啊？</p>
            </div>
          </button>

          <button 
             disabled={searchState !== 'idle' && searchState !== 'wrong'}
            onClick={() => handleSearch('correct')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start group relative overflow-hidden bg-slate-800 ${searchState === 'correct' ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'border-slate-700 hover:border-emerald-500/50'}`}
          >
            {searchState === 'correct' && <div className="absolute inset-0 bg-emerald-400/10 animate-pulse"></div>}
            <span className="text-2xl mr-3 opacity-80 group-hover:opacity-100 relative z-10">🎯</span>
            <div className="relative z-10">
              <p className="font-bold text-emerald-400">精準關鍵字</p>
              <p className="text-sm text-slate-200 mt-1 tracking-wider">霸王龍 身高</p>
            </div>
          </button>

          {showAI && (
            <div className="mt-auto animate-fade-in">
              <button onClick={onNext} className="w-full py-3 bg-emerald-500 text-slate-900 font-bold rounded-lg hover:bg-emerald-400 hover:scale-105 transition-transform flex justify-center items-center shadow-lg">
                情報取得，前往下一關 <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/3 h-full relative z-10">
          <ChromeBrowser 
            title={searchState === 'idle' ? '新分頁' : '霸王龍 身高 - Google 搜尋'} 
            url={searchState === 'idle' ? '' : 'https://www.google.com/search?q=霸王龍+身高'}
            icon="🔍"
          >
            {searchState === 'idle' && (
              <div className="flex flex-col items-center justify-center h-full pt-10">
                <h1 className="text-6xl font-black mb-6 tracking-tighter">
                  <span className="text-blue-500">G</span>
                  <span className="text-red-500">o</span>
                  <span className="text-yellow-500">o</span>
                  <span className="text-blue-500">g</span>
                  <span className="text-green-500">l</span>
                  <span className="text-red-500">e</span>
                </h1>
                <div className="w-3/4 max-w-lg border border-gray-300 rounded-full px-5 py-3 shadow hover:shadow-md transition-shadow flex items-center bg-white">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-400 text-sm">請在左側點擊你想搜尋的文字...</span>
                </div>
              </div>
            )}

            {searchState === 'typing' && (
              <div className="p-6">
                <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                  <span className="text-2xl font-bold text-blue-500 mr-6 tracking-tighter">Google</span>
                  <div className="flex-grow max-w-xl border border-blue-400 rounded-full px-4 py-2 shadow-inner flex items-center bg-white">
                    <span className="typing-effect inline-block w-4 bg-gray-800 h-4"></span>
                  </div>
                </div>
                <div className="space-y-4 max-w-2xl px-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-100 rounded w-full mt-4"></div>
                </div>
              </div>
            )}

            {searchState === 'wrong' && (
              <div className="p-6 animate-fade-in">
                 <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                  <span className="text-2xl font-bold text-blue-500 mr-6 tracking-tighter">Google</span>
                  <div className="flex-grow max-w-xl border border-gray-300 rounded-full px-4 py-2 shadow flex items-center bg-white">
                    <span className="text-gray-800">我想知道那隻很大隻的霸王龍到底長多高啊？</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-6 pl-4">找不到和您查詢的「我想知道那隻很大隻的霸王龍到底長多高啊？」相符的資料。</p>
                <div className="pl-4">
                  <p className="font-bold text-gray-800">建議：</p>
                  <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1 text-sm">
                    <li>請檢查有無錯別字。</li>
                    <li><strong className="text-red-500">試著用較常見的字詞 (提取關鍵字)。</strong></li>
                    <li>試著縮減搜尋字詞數量。</li>
                  </ul>
                </div>
              </div>
            )}

            {showAI && (
              <div className="p-6 animate-fade-in-up overflow-y-auto h-full pb-20">
                <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                  <span className="text-2xl font-bold text-blue-500 mr-6 tracking-tighter">Google</span>
                  <div className="flex-grow max-w-xl border border-gray-300 rounded-full px-4 py-2 shadow flex items-center bg-white">
                    <span className="text-gray-800 font-medium">霸王龍 身高</span>
                    <X className="w-4 h-4 ml-auto text-gray-400" />
                  </div>
                </div>
                
                <div className="max-w-2xl px-2">
                  <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50/50 shadow-sm mb-6 p-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
                    <div className="px-3 py-2 flex items-center">
                      <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center mr-2">
                        <Zap className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-gray-800 font-bold text-[15px]">AI 總覽</span>
                    </div>
                    <div className="p-3 text-gray-800 leading-relaxed text-sm">
                      <p>霸王龍（暴龍）的身高大約是 <strong className="bg-yellow-200/60 px-1 py-0.5 rounded text-gray-900 border border-yellow-300">4 到 5 公尺</strong>（測量至臀部），這大約接近一棟兩層樓建築的高度。牠們的體長則可以長達 12 到 13 公尺，是地球上已知最大的肉食性恐龍之一。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ChromeBrowser>
        </div>
      </div>
    </div>
  );
}

function Mission2({ onNext, setScore, score }) {
  const [bookmarks, setBookmarks] = useState([]); 
  const [currentSite, setCurrentSite] = useState(0);

  const sites = [
    { title: "均一教育平台", url: "https://www.junyiacademy.org/", color: "bg-[#fdfbf7]", textColor: "text-orange-900", icon: "📚" },
    { title: "Poki 好玩遊戲", url: "https://poki.tw/", color: "bg-[#f5f8ff]", textColor: "text-blue-900", icon: "🎮" },
    { title: "土城國小首頁", url: "https://www.ttces.ntpc.edu.tw/", color: "bg-[#f0fdf4]", textColor: "text-green-900", icon: "🏫" }
  ];

  const handleBookmarkClick = () => {
    if (!bookmarks.includes(currentSite)) {
      setBookmarks([...bookmarks, currentSite]);
      
      if (bookmarks.length === sites.length - 1) {
        setScore(prev => prev + 100);
      } else {
        setTimeout(() => setCurrentSite((prev) => (prev + 1) % sites.length), 1200);
      }
    }
  };

  const isComplete = bookmarks.length === sites.length;
  const activeSite = sites[currentSite];
  const isCurrentBookmarked = bookmarks.includes(currentSite);

  return (
    <div className="animate-fade-in h-full flex flex-col relative z-20">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-emerald-400 flex items-center mb-1 uppercase drop-shadow-md">
            <Star className="mr-2 w-6 h-6" /> Mission 02: 百寶箱建置
          </h2>
          <p className="text-slate-300 text-sm">請將畫面上出現的 {sites.length} 個重要網站，透過點擊「⭐」加入你的專屬書籤列。</p>
        </div>
        <div className="hidden md:flex bg-slate-900 px-4 py-2 rounded-full border border-slate-700 shadow-inner">
           {sites.map((_, i) => (
             <Star key={i} className={`w-5 h-5 mx-1 transition-all duration-500 ${bookmarks.length > i ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-slate-700'}`} />
           ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col h-[450px]">
        <ChromeBrowser 
          title={activeSite.title} 
          url={activeSite.url}
          icon={activeSite.icon}
          isBookmarked={isCurrentBookmarked}
          onBookmarkClick={handleBookmarkClick}
          bookmarks={bookmarks}
          sites={sites}
        >
          <div className={`w-full h-full ${activeSite.color} ${activeSite.textColor} flex flex-col items-center justify-center p-8 transition-colors duration-700 relative`}>
             <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight z-10 text-center">{activeSite.title}</h1>
             {isCurrentBookmarked ? (
               <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-current flex items-center z-10 animate-fade-in text-lg font-bold">
                 <CheckCircle className="mr-2 text-green-500" /> 已存入書籤列！準備前往下一個區域...
               </div>
             ) : (
               <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-xl border-l-4 border-yellow-400 z-10 flex items-center max-w-md relative animate-fade-in-up">
                 <p className="text-gray-700 font-medium">這是重要的學習或娛樂基地，請點擊上方網址列最右邊的星星，把它收進百寶箱。</p>
               </div>
             )}
          </div>
        </ChromeBrowser>
      </div>

      {isComplete && (
        <div className="mt-4 flex justify-center animate-fade-in relative z-20">
          <button onClick={onNext} className="px-10 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 font-black text-lg rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 transition-transform flex items-center">
            <CheckCircle className="mr-2" /> 書籤收集完畢，前往下一關
          </button>
        </div>
      )}
    </div>
  );
}

function Mission3_Puzzle({ onNext, setScore, score }) {
  const [tiles, setTiles] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); 
  const [timerActive, setTimerActive] = useState(true);
  const [moves, setMoves] = useState(0); 
  const [earnedPoints, setEarnedPoints] = useState(0); 
  
  const [showHackerModal, setShowHackerModal] = useState(false);
  const [hackerError, setHackerError] = useState(false);

  const puzzleData = [
    { id: 0, text: '土城國小', desc: '網站名稱' },
    { id: 1, text: 'https', desc: '通訊協定' },
    { id: 2, text: '://', desc: '符號' },
    { id: 3, text: 'www', desc: '主機名稱' },
    { id: 4, text: '.ttcps', desc: '主網域名' },
    { id: 5, text: '.ntpc', desc: '行政區代碼' },
    { id: 6, text: '.edu', desc: '機構類別' },
    { id: 7, text: '.tw', desc: '國家代碼' },
    { id: 8, text: '🎉完成', desc: '' }
  ];

  const teacherNames = ["陳哲民", "沉哲民", "沈哲民", "沈哲明", "沉哲明", "陳哲明"];
  const correctNames = ["沈哲民", "沈哲明"];

  useEffect(() => { initPuzzle(); }, []);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0 && !isSolved) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && timerActive) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isSolved]);

  const initPuzzle = () => {
    let currentTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let emptyIdx = 8;
    for (let i = 0; i < 30; i++) {
      const neighbors = [];
      const row = Math.floor(emptyIdx / 3);
      const col = emptyIdx % 3;
      if (row > 0) neighbors.push(emptyIdx - 3); 
      if (row < 2) neighbors.push(emptyIdx + 3); 
      if (col > 0) neighbors.push(emptyIdx - 1); 
      if (col < 2) neighbors.push(emptyIdx + 1); 
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [currentTiles[emptyIdx], currentTiles[randomNeighbor]] = [currentTiles[randomNeighbor], currentTiles[emptyIdx]];
      emptyIdx = randomNeighbor;
    }
    setTiles(currentTiles);
    setIsSolved(false);
    setTimeLeft(90); 
    setTimerActive(true);
    setShowHackerModal(false);
    setMoves(0); 
  };

  const currentLevelScore = Math.max(50, 200 - moves * 3);

  const handleTileClick = (index) => {
    if (isSolved) return;
    const emptyIdx = tiles.indexOf(8);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIdx / 3);
    const emptyCol = emptyIdx % 3;

    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
                       (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
      setTiles(newTiles);
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      
      if (newTiles.every((val, i) => val === i)) {
        setIsSolved(true);
        setTimerActive(false);
        const finalPoints = Math.max(50, 200 - nextMoves * 3);
        setEarnedPoints(finalPoints);
        setScore(prev => prev + finalPoints); 
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const triggerHackerTool = () => {
    setShowHackerModal(true);
    setHackerError(false);
  };

  const handlePasswordAttempt = (name) => {
    if (correctNames.includes(name)) {
      setShowHackerModal(false);
      setTiles([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      setIsSolved(true);
      setEarnedPoints(50);
      setScore(prev => prev + 50); 
    } else {
      setHackerError(true);
      setTimeout(() => {
        setShowHackerModal(false);
        setTimeLeft(30); 
        setTimerActive(true);
      }, 800);
    }
  };

  return (
    <div className="animate-fade-in h-full flex flex-col max-w-5xl mx-auto w-full relative">
      <div className="mb-4 w-full text-left">
        <h2 className="text-2xl font-black text-emerald-400 flex items-center mb-1 uppercase drop-shadow-md">
          <LayoutGrid className="mr-2 w-6 h-6" /> Mission 03: 網址解碼拼圖
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <p className="text-slate-300 text-sm">
             點擊方塊滑動，按照順序 1~8 排出正確的網址結構！<br/>
             <span className="text-emerald-400 text-xs font-bold">💡 提示：移動越少步數，能獲得越高的特務點數！</span>
           </p>
           <div className="flex space-x-2 items-center w-full md:w-auto overflow-x-auto pb-1">
             <div className="shrink-0 flex items-center justify-center px-3 py-2 rounded-lg font-mono text-sm md:text-base font-bold border-2 bg-slate-800 text-yellow-400 border-yellow-500/50 shadow-inner">
               <Star className="w-4 h-4 mr-1 text-yellow-500" />
               本關分數: {isSolved ? earnedPoints : currentLevelScore}
             </div>
             <div className="shrink-0 flex items-center justify-center px-3 py-2 rounded-lg font-mono text-sm md:text-base font-bold border-2 bg-slate-800 text-blue-400 border-slate-600">
               <Move className="w-4 h-4 mr-1 text-blue-500" />
               步數: {moves}
             </div>
             {!isSolved && (
               <div className={`shrink-0 flex items-center justify-center px-3 py-2 rounded-lg font-mono text-sm md:text-base font-bold border-2 transition-colors ${timeLeft > 30 ? 'bg-slate-800 text-emerald-400 border-slate-600' : timeLeft > 0 ? 'bg-red-900/30 text-red-400 border-red-500 animate-pulse' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                 <Clock className="w-4 h-4 mr-1" />
                 {formatTime(timeLeft)}
               </div>
             )}
           </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-8 justify-center items-center w-full relative z-10">
        <div className={`p-4 rounded-2xl border-4 transition-all duration-500 shadow-2xl relative ${isSolved ? 'bg-emerald-900/30 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-600'}`}>
          <div className="grid grid-cols-3 gap-2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]">
            {tiles.map((tileId, index) => {
              if (tileId === 8) return <div key="empty" className="bg-slate-900/50 rounded-xl shadow-inner"></div>;
              const data = puzzleData.find(d => d.id === tileId);
              const isEven = tileId % 2 === 0;
              return (
                <div 
                  key={tileId} 
                  onClick={() => handleTileClick(index)}
                  className={`relative rounded-xl flex flex-col items-center justify-center cursor-pointer select-none transition-transform duration-150 shadow-md border-b-4 hover:brightness-110 active:scale-95 ${isEven ? 'bg-blue-600 border-blue-800 text-white' : 'bg-emerald-600 border-emerald-800 text-white'}`}
                >
                  <span className="absolute top-1.5 left-1.5 text-xs font-bold opacity-80 bg-black/20 w-5 h-5 flex items-center justify-center rounded-full">{tileId + 1}</span>
                  <span className="font-bold text-xl sm:text-2xl font-mono mt-1 tracking-wider">{data.text}</span>
                  <span className="text-[10px] sm:text-xs opacity-70 mt-1">{data.desc}</span>
                </div>
              );
            })}
          </div>
          {isSolved && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fade-in rounded-xl border border-emerald-500">
               <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 border-2 border-white shadow-[0_0_20px_rgba(16,185,129,0.8)]">
                 <CheckCircle className="w-10 h-10 text-slate-900" />
               </div>
               <h2 className="text-3xl font-black text-white tracking-widest drop-shadow-md mb-2">解碼成功</h2>
               <button onClick={onNext} className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 font-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 transition-transform flex items-center">
                 前往下一關 <ChevronRight className="w-5 h-5 ml-1" />
               </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center max-w-[250px] w-full gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-600 w-full text-center shadow-lg relative">
             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap shadow-md">目標完成圖</div>
             <p className="text-sm text-slate-400 mb-3 mt-2">依照數字 1~8 順序排列</p>
             <div className="grid grid-cols-3 gap-1 opacity-70 pointer-events-none select-none">
                {puzzleData.slice(0,8).map((d) => (
                  <div key={d.id} className="bg-slate-700 aspect-square rounded flex flex-col items-center justify-center border border-slate-600 relative overflow-hidden">
                     <span className="absolute top-0.5 left-0.5 text-[8px] text-slate-400 font-bold">{d.id + 1}</span>
                     <span className="text-[10px] font-mono text-slate-200 mt-2">{d.text}</span>
                  </div>
                ))}
                <div className="bg-slate-900 aspect-square rounded border border-slate-700 border-dashed"></div>
             </div>
          </div>
          {!isSolved && timeLeft <= 0 && (
            <div className="w-full bg-red-900/20 p-4 rounded-xl border border-red-500/50 text-center animate-fade-in-up">
              <button 
                onClick={triggerHackerTool} 
                className="w-full flex justify-center items-center bg-red-600 hover:bg-red-500 text-white border-2 border-red-300 py-3 rounded-lg text-lg font-black transition-all shadow-[0_0_20px_rgba(220,38,38,0.8)] hover:shadow-[0_0_30px_rgba(220,38,38,1)] animate-pulse scale-105"
              >
                <Terminal className="w-5 h-5 mr-2" /> 一鍵強制破解
              </button>
            </div>
          )}
        </div>
      </div>

      {showHackerModal && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in px-4">
          <div className={`bg-slate-900 border-2 max-w-lg w-full p-8 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all duration-300 ${hackerError ? 'border-red-500 animate-shake bg-red-950/20' : 'border-emerald-500'}`}>
            <h3 className="text-2xl font-black text-center text-white mb-2 tracking-widest">系統安全鎖定</h3>
            <p className="text-center text-slate-300 mb-8 bg-slate-950 p-4 rounded-lg border border-slate-700">
              請輸入<strong className="text-amber-400 mx-1">電腦老師的正確姓名</strong>作為安全授權碼。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {teacherNames.map((name, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePasswordAttempt(name)}
                  className="bg-slate-800 hover:bg-emerald-900/50 border-2 border-slate-600 hover:border-emerald-500 text-slate-300 py-3 rounded-lg font-bold"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Mission4_Incognito({ onNext, incognitoMode, setIncognitoMode, setScore, score }) {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    setIsLoggedOut(true);
    setShowProfileMenu(false);
    if (incognitoMode) setScore(prev => prev + 200);
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="mb-4">
        <h2 className={`text-2xl font-black flex items-center mb-1 uppercase transition-colors ${incognitoMode ? 'text-zinc-300' : 'text-emerald-400'} drop-shadow-md`}>
          <Ghost className="mr-2 w-6 h-6" /> Mission 04: 隱身與滅跡
        </h2>
        <p className="text-slate-300 text-sm">請啟動無痕模式，最後再點擊右上角大頭貼<span className="text-red-400 font-bold ml-1">刪除設定檔</span>。</p>
      </div>

      <div className="flex-grow h-[450px] relative z-10">
        <ChromeBrowser 
          title="新分頁" url="" isIncognito={incognitoMode}
          onProfileClick={() => { if(!isLoggedOut) setShowProfileMenu(!showProfileMenu); }}
          showProfileMenu={showProfileMenu}
          onLogoutClick={handleLogout}
        >
          <div className={`w-full h-full flex flex-col items-center justify-center p-8 transition-colors duration-700 relative ${incognitoMode ? 'bg-[#323639] text-white' : 'bg-white text-gray-800'}`}>
            {incognitoMode ? (
              <div className="animate-fade-in max-w-2xl text-left z-10">
                 <Ghost className="w-16 h-16 text-gray-400 mb-6" />
                 <h1 className="text-3xl font-medium mb-4 tracking-wide">您已進入無痕模式</h1>
              </div>
            ) : (
              <div className="text-center max-w-lg z-10">
                <Chrome className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                <button 
                  onClick={() => setIncognitoMode(true)}
                  className="px-8 py-4 bg-slate-800 hover:bg-black text-white font-bold rounded-full shadow-xl transition-all hover:scale-105 flex items-center justify-center mx-auto text-lg ring-4 ring-gray-200"
                >
                  <Ghost className="w-5 h-5 mr-2" /> 開啟無痕模式
                </button>
              </div>
            )}

            {isLoggedOut && (
              <div className="absolute inset-0 bg-emerald-900/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center animate-fade-in text-white text-center">
                <h2 className="text-4xl font-black mb-2 drop-shadow-md tracking-widest">身分已銷毀</h2>
                {incognitoMode && (
                  <button onClick={onNext} className="mt-6 px-10 py-4 bg-white text-emerald-800 font-black text-xl rounded-full shadow-2xl hover:scale-105 hover:bg-emerald-50 transition-transform flex items-center border border-emerald-200">
                    <Shield className="mr-2" /> 進入最終能力測驗
                  </button>
                )}
              </div>
            )}
          </div>
        </ChromeBrowser>
      </div>
    </div>
  );
}

function FinalBossQuiz({ onNext, setScore, score }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const questions = [
    { q: "想把這個網頁收進『百寶箱』，要按網址列旁邊的什麼圖案？", options: ["🏠 房子圖案", "⭐ 星星圖案", "🔄 重新整理圖案"], answer: 1 },
    { q: "特務想要上網查一個秘密（不想被電腦記住），他應該打開什麼模式？", options: ["😎 無痕模式", "✈️ 飛行模式", "🌙 黑暗模式"], answer: 0 },
    { q: "🚨 離開公共電腦前，針對你的 Google 帳號「最重要」的動作是什麼？", options: ["直接關閉電源", "按右上角的『X』", "點大頭貼，選擇『刪除設定檔』"], answer: 2 }
  ];

  const handleAnswer = (index) => {
    if (showFeedback) return;
    const correct = index === questions[currentQ].answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (correct) {
        setScore(prev => prev + 100);
        if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
        else onNext();
      }
    }, 1500);
  };

  return (
    <div className="animate-fade-in h-full flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
      <div className="bg-slate-800/80 backdrop-blur p-8 md:p-10 rounded-3xl border border-slate-600 w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <h3 className="text-xl md:text-2xl font-black mb-8 text-white leading-relaxed relative z-10 border-l-4 border-emerald-500 pl-4">{questions[currentQ].q}</h3>
        <div className="space-y-4 relative z-10">
          {questions[currentQ].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full p-5 rounded-xl border-2 font-bold text-lg text-left transition-all duration-300 bg-slate-900 border-slate-600 hover:border-emerald-400 hover:bg-slate-800 text-slate-200"
            >
              {opt}
            </button>
          ))}
        </div>
        {showFeedback && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-fade-in">
            <h2 className={`text-4xl font-black drop-shadow-lg ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCorrect ? '破解成功！' : '存取拒絕'}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

// 修改 4：接收 onBackToPortal 並增加回到大廳按鈕
function SuccessScreen({ score, onBackToPortal }) {
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  let rank = "見習特務";
  if (score >= 600) rank = "菁英網路特務";
  if (score >= 850) rank = "最高傳奇特務"; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId.length !== 5) return;
    setIsSubmitting(true);
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdvkI-KVxKep2rkA-5LsQmM8BeAqnagjYwwzDE0Q5mEGlIlxg/formResponse";
    const ENTRY_ID = "entry.529634358";
    const formData = new FormData();
    formData.append(ENTRY_ID, studentId);
    fetch(GOOGLE_FORM_URL, { method: 'POST', body: formData, mode: 'no-cors' })
      .then(() => { setIsSubmitting(false); setSubmitSuccess(true); })
      .catch(() => { setIsSubmitting(false); setSubmitSuccess(true); });
  };

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center py-4 relative z-20">
      <h2 className="text-4xl md:text-5xl font-black text-white mb-2 z-10 drop-shadow-md">訓練完成！</h2>
      <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-2xl border border-slate-600 mb-6 z-10 max-w-md w-full shadow-xl">
        <p className="text-slate-400 uppercase tracking-widest text-xs mb-1">獲得特務階級</p>
        <div className="text-2xl font-black text-yellow-400 mb-4 border-b border-slate-700 pb-3">{rank}</div>
        <div className="flex justify-between items-center px-2">
          <span className="text-slate-300 text-sm">最終結算點數：</span>
          <span className="text-xl font-mono text-emerald-400 font-bold">{score} pt</span>
        </div>
      </div>

      {!submitSuccess ? (
        <form onSubmit={handleSubmit} className="z-10 w-full max-w-md bg-slate-900 p-6 rounded-2xl border-2 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <input
            type="text" value={studentId} onChange={(e) => setStudentId(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="請輸入 5 碼學號"
            className="w-full bg-slate-800 border-2 border-slate-600 rounded-xl px-4 py-3 text-white text-xl font-mono tracking-widest text-center focus:border-blue-500 mb-4"
            maxLength={5}
          />
          <button type="submit" disabled={studentId.length !== 5 || isSubmitting} className="w-full py-4 rounded-xl font-black text-lg bg-blue-600 hover:bg-blue-500 text-white">
            {isSubmitting ? '資料上傳中...' : '送出學號資料'}
          </button>
        </form>
      ) : (
        <div className="z-10 w-full max-w-md bg-emerald-900/30 p-8 rounded-2xl border-2 border-emerald-500 flex flex-col items-center animate-fade-in-up">
          <h3 className="text-2xl font-bold text-emerald-400 mb-2">資料建檔成功！</h3>
          <p className="text-slate-300 mb-6 text-sm">特務資料已加密傳送至總部。</p>
          
          {/* 修改 5：新增「回到遊戲大廳」按鈕 */}
          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => window.location.reload()} className="w-full py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors font-bold">
              重新挑戰訓練
            </button>
            <button onClick={onBackToPortal} className="w-full py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-bold shadow-lg flex justify-center items-center gap-2">
              <Home className="w-5 h-5" /> 回到專屬基地大廳
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
