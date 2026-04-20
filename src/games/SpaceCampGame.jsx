import React, { useState, useEffect } from 'react';
import { 
  Rocket, Map, Fingerprint, Search, Zap, Award, ArrowLeft, 
  CheckCircle2, Globe, Monitor, Paintbrush, Flame, Trophy, Crosshair, AlertTriangle,
  Sparkles, ExternalLink, Star, Wifi, ShieldCheck, Palette, UserCircle2, Plus
} from 'lucide-react';

// --- 全域 CSS 動畫設定 (注入到 <head>) ---
const injectStyles = () => {
  if (document.getElementById('space-camp-styles')) return;
  const style = document.createElement('style');
  style.id = 'space-camp-styles';
  style.innerHTML = `
    @keyframes radar-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes particle-fall {
      0% { transform: translateY(-10vh) rotate(0deg) scale(1); opacity: 1; }
      100% { transform: translateY(110vh) rotate(720deg) scale(0.5); opacity: 0; }
    }
    @keyframes intense-shake {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(-2px, 2px) rotate(-1deg); }
      50% { transform: translate(2px, -2px) rotate(1deg); }
      75% { transform: translate(-2px, -2px) rotate(0deg); }
    }
    .radar-sweep {
      background: conic-gradient(from 0deg, transparent 70%, rgba(59, 130, 246, 0.5) 100%);
      animation: radar-spin 2s linear infinite;
    }
    .telescope-vignette {
      box-shadow: inset 0 0 100px rgba(0,0,0,0.9);
    }
  `;
  document.head.appendChild(style);
};

// --- 共用 UI 元件 ---
const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_0_0] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-500 text-white shadow-blue-700 hover:bg-blue-400",
    success: "bg-green-500 text-white shadow-green-700 hover:bg-green-400",
    warning: "bg-amber-400 text-amber-900 shadow-amber-600 hover:bg-amber-300",
    danger: "bg-red-500 text-white shadow-red-700 hover:bg-red-400",
    purple: "bg-purple-500 text-white shadow-purple-700 hover:bg-purple-400",
    dark: "bg-slate-800 text-white shadow-slate-900 hover:bg-slate-700",
    outline: "bg-white text-slate-700 border-2 border-slate-200 shadow-slate-300 hover:bg-slate-50"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={24} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', bgColor = 'bg-white' }) => (
  <div className={`${bgColor} rounded-3xl shadow-xl p-8 border-4 border-slate-100/50 relative overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- 驚豔的彩帶/粒子特效元件 ---
const ParticleEffect = ({ count = 50, colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'] }) => {
  const particles = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    size: `${8 + Math.random() * 12}px`,
    type: Math.random() > 0.5 ? 'circle' : 'square'
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.backgroundColor,
            borderRadius: p.type === 'circle' ? '50%' : '2px',
            animation: `particle-fall ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
            boxShadow: `0 0 10px ${p.backgroundColor}80`
          }}
        />
      ))}
    </div>
  );
};

// --- 關卡 1：導航定位系統 (IP與網址) ---
const LevelIP = ({ onComplete }) => {
  const [ip, setIp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [packets, setPackets] = useState([]);
  const [caughtCount, setCaughtCount] = useState(0);
  const targetPackets = 10; 

  const startHacking = () => {
    setLoading(true);
    setCaughtCount(0);
    const newPackets = Array.from({ length: targetPackets }).map((_, i) => ({
      id: i, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10,
    }));
    setPackets(newPackets);
  };

  useEffect(() => {
    if (packets.length === 0) return;
    const interval = setInterval(() => {
      setPackets(prev => prev.map(p => ({ ...p, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 })));
    }, 600); 
    return () => clearInterval(interval);
  }, [packets.length]);

  const catchPacket = (id) => {
    setPackets(prev => prev.filter(p => p.id !== id));
    setCaughtCount(prev => {
      const newCount = prev + 1;
      if (newCount === targetPackets) fetchIP();
      return newCount;
    });
  };

  const fetchIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIp(data.ip);
      setTimeout(() => onComplete(), 1500);
    } catch (error) {
      setIp("192.168.0.1 (模擬)");
      setTimeout(() => onComplete(), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-purple-800 flex items-center justify-center gap-3">
          <Globe size={40} className="text-purple-500" />
          第一關：導航定位系統
        </h2>
        <p className="text-xl text-slate-600">在宇宙中找網站要輸入「網址」，那太空船的數字編號是什麼？</p>
      </div>

      <Card bgColor="bg-purple-50" className="text-center border-purple-200">
        {!loading && !ip ? (
          <div className="space-y-6 relative z-10">
            <h3 className="text-3xl font-black text-purple-900 drop-shadow-sm">攔截星際訊號找出 IP 座標！</h3>
            <p className="text-lg text-purple-700 bg-white/60 p-4 rounded-xl inline-block font-bold">太空船看不懂英文網址，只懂 <strong>IP 位址</strong>。<br/>請在雷達上點擊 <Wifi className="inline text-blue-500"/> 攔截所有游移的訊號！</p>
            <Button onClick={startHacking} variant="purple" className="mx-auto text-2xl px-8 py-4 animate-bounce">
              <Crosshair className="mr-2" /> 啟動雷達掃描！
            </Button>
          </div>
        ) : loading && packets.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-purple-900">已攔截: {caughtCount} / {targetPackets}</h3>
            <div className="relative h-80 bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] border-8 border-purple-900">
              <div className="absolute inset-0 rounded-full radar-sweep opacity-40 scale-150 transform origin-center" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
              
              {packets.map(p => (
                <button
                  key={p.id} onClick={() => catchPacket(p.id)}
                  className="absolute p-5 bg-blue-500/20 rounded-full hover:bg-blue-400 cursor-crosshair group transition-all duration-1000 ease-in-out hover:scale-125 z-10"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <Wifi size={44} className="text-blue-400 group-hover:text-white animate-pulse" />
                  <div className="absolute inset-0 border-4 border-blue-400 rounded-full animate-ping opacity-50"></div>
                </button>
              ))}
            </div>
          </div>
        ) : loading && packets.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center space-y-6">
            <Fingerprint size={80} className="text-purple-500 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <h3 className="text-3xl font-black text-purple-900">身分證解碼中...</h3>
          </div>
        ) : (
          <div className="space-y-6 py-8 relative">
            <ParticleEffect count={30} colors={['#a855f7', '#3b82f6']} />
            <ShieldCheck size={100} className="mx-auto text-green-500 animate-in zoom-in drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]" />
            <h3 className="text-3xl font-black text-slate-800">解碼成功！你的專屬 IP 座標是：</h3>
            <div className="bg-white p-6 rounded-2xl inline-block border-4 border-green-300 shadow-2xl transform hover:scale-105 transition-transform">
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-wider font-mono">
                {ip}
              </p>
            </div>
            <p className="text-2xl text-green-600 font-black animate-bounce mt-4">🌟 獲得星星幣！</p>
          </div>
        )}
      </Card>
    </div>
  );
};

// --- 關卡 2：光學望遠鏡 (縮放與分頁) ---
const LevelZoom = ({ onComplete }) => {
  const [zoom, setZoom] = useState(0.2);
  const [found, setFound] = useState(false);
  const [tabOpened, setTabOpened] = useState(false);
  const [shake, setShake] = useState(false);

  const [grid] = useState(() => {
    const items = Array(63).fill('🪐');
    const safeRow = Math.floor(Math.random() * 4) + 2; 
    const safeCol = Math.floor(Math.random() * 6) + 1; 
    const alienIndex = safeRow * 8 + safeCol;
    items.splice(alienIndex, 0, '👾');
    return items;
  });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.4, 3.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.4, 0.2));
  const handleReset = () => setZoom(0.2);

  const handleClickItem = (item) => {
    if (found) return;
    if (item === '👾') {
      if(zoom < 1.0) {
         setShake(true); setTimeout(() => setShake(false), 500);
         return;
      }
      setFound(true);
    } else {
      setShake(true); setTimeout(() => setShake(false), 500);
    }
  };

  const handleOpenTab = () => {
    setTabOpened(true);
    setTimeout(() => onComplete(), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-amber-800 flex items-center justify-center gap-3">
          <Search size={40} className="text-amber-500" />
          第二關：光學望遠鏡與視窗
        </h2>
        <p className="text-xl text-slate-600">太空太暗了？放大畫面找出外星怪獸，並開啟新分頁逃跑！</p>
      </div>

      <Card bgColor="bg-amber-50" className={`text-center border-amber-200 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-15px); } 75% { transform: translateX(15px); } }`}</style>
        
        {!found ? (
          <p className="text-xl text-amber-900 mb-4 font-bold bg-white/50 py-2 rounded-xl">
            任務一：點擊「放大」按鈕，直到看清楚並點擊紫色外星人 👾！
            {zoom < 1.0 && zoom > 0.2 && <span className="text-red-500 ml-2 animate-pulse">再放大一點才點得到喔！</span>}
          </p>
        ) : !tabOpened ? (
          <div className="bg-green-100 p-4 rounded-xl border border-green-300 mb-4 animate-in zoom-in shadow-lg">
            <p className="text-3xl text-green-700 font-black mb-2 flex items-center justify-center gap-2">
              <CheckCircle2 size={36}/> 找到外星人了！
            </p>
            <p className="text-xl text-green-800 font-bold bg-white/50 py-2 rounded-lg">任務二：快點擊上方的 <Plus className="inline bg-white rounded shadow-sm p-1" size={28}/> 開啟「新分頁」逃離這裡！</p>
          </div>
        ) : (
          <div className="relative">
             <ParticleEffect count={20} colors={['#fbbf24', '#f59e0b']} />
             <p className="text-3xl text-green-600 mb-4 font-black animate-bounce drop-shadow-sm">
               成功開啟新分頁逃脫！🌟 獲得星星幣！
             </p>
          </div>
        )}

        <div className="bg-slate-300 p-3 rounded-t-xl flex items-center gap-2 mb-0 border-b-2 border-slate-400">
          <div className="bg-white px-6 py-2 rounded-t-lg font-bold text-slate-600 text-sm flex items-center gap-2 shadow-sm">
            <Monitor size={16}/> 觀察窗 1
          </div>
          {found && !tabOpened && (
             <button onClick={handleOpenTab} className="p-2 bg-blue-500 hover:bg-blue-400 text-white rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all hover:scale-110">
               <Plus size={24} />
             </button>
          )}
          {tabOpened && (
             <div className="bg-white px-6 py-2 rounded-t-lg font-black text-blue-600 text-sm flex items-center gap-2 shadow-md border-t-4 border-blue-500 animate-in slide-in-from-left">
               <Rocket size={18}/> 安全新分頁
             </div>
          )}
        </div>

        <div className="bg-slate-800 p-2 flex justify-center gap-4">
          <Button onClick={handleZoomOut} variant="dark" disabled={found}>縮小 (-)</Button>
          <Button onClick={handleReset} variant="dark" disabled={found}>恢復</Button>
          <Button onClick={handleZoomIn} variant="warning" disabled={found} className="px-10 shadow-amber-600 text-2xl">
            <Search size={24}/> 放大 (+)
          </Button>
        </div>

        <div className="relative h-80 bg-slate-900 rounded-b-3xl overflow-hidden flex items-center justify-center shadow-[inset_0_0_80px_rgba(0,0,0,1)] border-4 border-t-0 border-slate-800">
          <div className="absolute inset-0 telescope-vignette pointer-events-none z-10"></div>
          
          <div className="transition-transform duration-500 origin-center grid grid-cols-8 gap-3" style={{ transform: `scale(${zoom})` }}>
            {grid.map((item, idx) => (
              <div 
                key={idx} onClick={() => handleClickItem(item)}
                className={`w-12 h-12 flex items-center justify-center text-3xl bg-slate-800 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] border border-slate-700 hover:bg-slate-700 cursor-pointer transition-colors ${found && item === '👾' ? 'bg-red-500/80 animate-bounce scale-125 z-20 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : ''}`}
              >
                <span className="drop-shadow-md">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- 關卡 3：專屬駕駛艙 (Chrome個人設定檔) - 指定顏色任務版 ---
const LevelProfile = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [themeColor, setThemeColor] = useState('bg-white');
  const [themeName, setThemeName] = useState('經典白');
  const [pointerPos, setPointerPos] = useState(0);
  const [isPainting, setIsPainting] = useState(false);
  const [targetTheme, setTargetTheme] = useState(null);
  const [wrongTheme, setWrongTheme] = useState(false);
  const directionRef = React.useRef(1);

  const themes = [
    { name: '太空黑', bg: 'bg-slate-800', barColor: 'bg-slate-800', border: 'border-slate-600', text: 'text-white' },
    { name: '星雲紫', bg: 'bg-purple-100', barColor: 'bg-purple-500', border: 'border-purple-300', text: 'text-purple-900' },
    { name: '銀河藍', bg: 'bg-blue-100', barColor: 'bg-blue-500', border: 'border-blue-300', text: 'text-blue-900' },
    { name: '恆星黃', bg: 'bg-amber-100', barColor: 'bg-amber-400', border: 'border-amber-300', text: 'text-amber-900' },
    { name: '極光綠', bg: 'bg-emerald-100', barColor: 'bg-emerald-500', border: 'border-emerald-300', text: 'text-emerald-900' },
    { name: '火星紅', bg: 'bg-red-100', barColor: 'bg-red-500', border: 'border-red-300', text: 'text-red-900' },
    { name: '彗星銀', bg: 'bg-slate-200', barColor: 'bg-slate-400', border: 'border-slate-400', text: 'text-slate-800' },
    { name: '黑洞暗', bg: 'bg-zinc-900', barColor: 'bg-zinc-900', border: 'border-zinc-700', text: 'text-zinc-300' },
  ];

  useEffect(() => {
    let interval;
    if (isPainting) {
      interval = setInterval(() => {
        setPointerPos(prev => {
          let next = prev + directionRef.current * 2.5; 
          if (next >= 100) { next = 100; directionRef.current = -1; }
          if (next <= 0) { next = 0; directionRef.current = 1; }
          return next;
        });
      }, 20);
    }
    return () => clearInterval(interval);
  }, [isPainting]);

  const startPainting = () => {
    setStep(2);
    setIsPainting(true);
    const randomTarget = themes[Math.floor(Math.random() * themes.length)];
    setTargetTheme(randomTarget);
  };

  const handleStopPainting = () => {
    const selectedIndex = Math.min(7, Math.floor(pointerPos / 12.5));
    const selectedTheme = themes[selectedIndex];
    
    if (selectedTheme.name === targetTheme.name) {
       setIsPainting(false);
       setWrongTheme(false);
       setThemeColor(selectedTheme.bg);
       setThemeName(selectedTheme.name);
       setStep(3);
       setTimeout(() => onComplete(), 2500);
    } else {
       setWrongTheme(true);
       setTimeout(() => setWrongTheme(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-emerald-800 flex items-center justify-center gap-3">
          <Palette size={40} className="text-emerald-500" />
          第三關：改裝專屬駕駛艙
        </h2>
        <p className="text-xl text-slate-600">建立你的 Chrome 個人設定檔，換上喜歡的主題顏色！</p>
      </div>

      <Card bgColor="bg-slate-100" className={`border-emerald-200 ${wrongTheme ? 'animate-[intense-shake_0.5s_ease-in-out]' : ''}`}>
        <div className="mb-6 text-center h-24 flex items-center justify-center">
          {step === 1 && <p className="text-2xl font-bold text-emerald-700 animate-pulse bg-emerald-100 px-6 py-2 rounded-full shadow-sm">任務：在右上方找到「圓形頭像」，開啟設定檔面板！</p>}
          
          {step === 2 && (
            <div className="bg-amber-100 border-2 border-amber-400 px-6 py-3 rounded-[2rem] shadow-md flex flex-col items-center gap-3 w-full max-w-2xl">
               <div className="flex items-center gap-3 animate-pulse">
                  <Paintbrush className="text-amber-500" size={28}/>
                  <p className="text-xl font-black text-amber-700">烤漆光譜已啟動！請抓準時機，捕捉指定的目標顏色！</p>
               </div>
               {targetTheme && (
                  <div className="bg-white px-6 py-1.5 rounded-full border-2 border-amber-300 font-black text-lg flex items-center gap-2 shadow-sm">
                      🎯 目標任務：
                      <span className={`px-4 py-1 rounded-full ${targetTheme.barColor} text-white shadow-sm tracking-wide`}>
                        {targetTheme.name}
                      </span>
                  </div>
               )}
            </div>
          )}

          {step === 3 && (
            <div className="relative w-full">
              <ParticleEffect count={20} colors={['#10b981', '#34d399']} />
              <p className="text-3xl font-black text-green-600 animate-bounce drop-shadow-md">成功上色：{themeName}！這是你的專屬太空船！🌟</p>
            </div>
          )}
        </div>

        <div className={`border-8 rounded-2xl overflow-hidden transition-colors duration-700 shadow-2xl relative ${step === 3 ? themeColor : 'bg-white border-slate-300'}`}>
          {wrongTheme && (
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 bg-red-500 text-white font-black text-xl px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(239,68,68,0.5)] z-50 animate-bounce flex items-center gap-2">
              <AlertTriangle size={28}/>
              ❌ 顏色不對喔！目標是 {targetTheme?.name}
            </div>
          )}

          <div className="bg-slate-200/80 backdrop-blur p-3 flex justify-between items-center border-b border-slate-300">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400 shadow-inner"></div>
              <div className="w-4 h-4 rounded-full bg-amber-400 shadow-inner"></div>
              <div className="w-4 h-4 rounded-full bg-green-400 shadow-inner"></div>
            </div>
            <div className="flex-1 mx-6 bg-white rounded-full px-6 py-2 text-sm text-slate-400 flex items-center gap-2 shadow-inner border border-slate-200">
              <Search size={16}/> 搜尋 Google 或輸入網址
            </div>
            <button 
              onClick={() => step === 1 && startPainting()}
              className={`p-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'ring-4 ring-emerald-500 bg-emerald-100 animate-bounce scale-110 shadow-lg' : 'hover:bg-slate-300'}`}
            >
              <UserCircle2 size={32} className={step >= 2 ? 'text-emerald-600' : 'text-slate-500'}/>
            </button>
          </div>

          <div className="h-80 relative flex flex-col items-center justify-center">
            {step !== 2 && (
              <h1 className={`text-6xl font-black mb-8 flex items-center gap-4 transition-opacity duration-500 ${step === 3 && (themeColor === 'bg-slate-800' || themeColor === 'bg-zinc-900') ? 'text-white' : 'text-slate-800'} opacity-90 drop-shadow-sm`}>
                <Globe className="text-blue-500" size={56}/> Google
              </h1>
            )}
            
            {step === 2 && (
              <div className="w-11/12 max-w-2xl bg-white p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-4 border-slate-100">
                 <h3 className="text-2xl font-black text-slate-700 mb-6 text-center tracking-widest">🎨 外觀烤漆光譜</h3>
                 <div className="relative h-16 rounded-2xl overflow-hidden flex shadow-inner border-2 border-slate-200">
                    {themes.map(t => (
                       <div key={t.name} className={`flex-1 ${t.barColor} flex items-center justify-center`}>
                          <span className="text-white text-sm font-bold opacity-80 drop-shadow-md hidden md:block">{t.name}</span>
                       </div>
                    ))}
                    <div 
                       className="absolute top-0 bottom-0 w-3 bg-white border-2 border-slate-800 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 transition-none"
                       style={{ left: `calc(${pointerPos}% - 6px)` }}
                    >
                       <div className="absolute -top-4 -translate-x-1/2 left-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-slate-800"></div>
                       <div className="absolute -bottom-4 -translate-x-1/2 left-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-slate-800"></div>
                    </div>
                 </div>
              </div>
            )}

            {step <= 2 && (
              <div className="absolute bottom-6 right-6 z-20">
                 <button 
                   onClick={() => step === 2 && handleStopPainting()}
                   disabled={step !== 2}
                   className={`flex items-center gap-2 px-8 py-4 rounded-full font-black text-xl transition-all shadow-lg ${step === 2 ? 'bg-amber-500 text-white hover:bg-amber-400 ring-4 ring-amber-300 animate-pulse cursor-pointer scale-110 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                 >
                   <Paintbrush size={28}/> {step === 2 ? '確認上色！' : '自訂 Chrome'}
                 </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- 關卡 4：引擎極限測試 (連擊測速) ---
const LevelSpeed = ({ onComplete }) => {
  const [gameState, setGameState] = useState('ready');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  const startGame = () => { setGameState('playing'); setClicks(0); setTimeLeft(10); };
  const handleClick = () => { if (gameState === 'playing') setClicks(prev => prev + 1); };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('finished');
      setTimeout(() => onComplete(), 2500);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, onComplete]);

  const finalSpeed = gameState === 'finished' ? Math.floor(20 + clicks * 15 + Math.random() * 10) : 0;
  
  const intensity = Math.min(clicks / 50, 1); 
  const buttonColor = intensity > 0.8 ? 'from-red-500 to-orange-600' : 
                      intensity > 0.4 ? 'from-orange-400 to-amber-500' : 
                      'from-blue-400 to-indigo-600';
  const shadowColor = intensity > 0.8 ? '#991b1b' : intensity > 0.4 ? '#92400e' : '#312e81';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-blue-800 flex items-center justify-center gap-3">
          <Zap size={40} className="text-blue-500" />
          第四關：引擎極限測試
        </h2>
        <p className="text-xl text-slate-600">你的手速決定網速！瘋狂點擊測試太空船的 Mbps 動力！</p>
      </div>

      <Card bgColor="bg-blue-50" className={`text-center border-blue-200 overflow-visible ${intensity > 0.6 ? 'animate-[intense-shake_0.2s_ease-in-out_infinite]' : ''}`}>
        {gameState === 'ready' && (
          <div className="space-y-6 py-8 relative z-10">
            <Gauge size={100} className="mx-auto text-blue-500 drop-shadow-md" />
            <h3 className="text-3xl font-black text-blue-900">任務：瘋狂連擊發電！</h3>
            <p className="text-xl text-blue-800 bg-blue-100 p-4 rounded-xl inline-block font-bold">你有 10 秒鐘瘋狂點擊按鈕！<br/>點擊越快，引擎溫度越高，測出的 <strong>Mbps 下載速度</strong>就越快！</p>
            <Button onClick={startGame} variant="primary" className="mx-auto text-4xl px-16 py-6 animate-pulse hover:scale-110">開始爆發！</Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-8 py-4 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 transition-transform duration-200" style={{ transform: `scale(${1 + intensity * 2})` }}>
               <Flame size={200} className={intensity > 0.5 ? 'text-red-500' : 'text-orange-300'} />
            </div>

            <div className="flex justify-around items-center bg-white/60 backdrop-blur p-4 rounded-3xl shadow-sm relative z-10">
              <div className="text-center">
                <p className="text-slate-500 font-bold text-xl uppercase tracking-wider">剩餘秒數</p>
                <p className={`text-7xl font-black ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>{timeLeft}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500 font-bold text-xl uppercase tracking-wider">連擊動力</p>
                <p className="text-7xl font-black text-blue-600">{clicks}</p>
              </div>
            </div>
            
            <button 
              onClick={handleClick}
              className={`relative z-10 w-56 h-56 mx-auto bg-gradient-to-b ${buttonColor} rounded-full flex items-center justify-center transition-colors focus:outline-none select-none active:translate-y-[15px]`}
              style={{ boxShadow: `0 15px 0 0 ${shadowColor}, 0 20px 20px rgba(0,0,0,0.3)` }}
            >
              <span className="text-5xl font-black text-white drop-shadow-md flex flex-col items-center">
                <Rocket size={56} className="mb-2 transition-transform active:-translate-y-2"/> 衝刺!
              </span>
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="space-y-6 py-8 animate-in zoom-in duration-500 relative">
            <ParticleEffect count={30} colors={['#3b82f6', '#60a5fa', '#ffffff']} />
            <h3 className="text-4xl font-black text-slate-800 drop-shadow-sm">極限測試結果出爐！</h3>
            <div className="bg-white p-10 rounded-[3rem] inline-block border-8 border-blue-300 shadow-2xl transform hover:scale-105 transition-transform">
              <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {finalSpeed} <span className="text-3xl text-slate-400 font-bold">Mbps</span>
              </p>
            </div>
            <p className="text-3xl text-green-600 font-black animate-bounce mt-6 drop-shadow-sm">🚀 速度太狂了！獲得星星幣！</p>
          </div>
        )}
      </Card>
      
      <div className="text-center mt-4">
        <a href="https://fast.com/zh/tw/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-black text-lg hover:text-blue-800 hover:scale-105 transition-transform underline decoration-4 underline-offset-4 bg-white/80 backdrop-blur px-6 py-3 rounded-2xl shadow-md border-2 border-blue-100">
          想用真實的工具測網速嗎？點我前往 fast.com <ExternalLink size={24}/>
        </a>
      </div>
    </div>
  );
};

// --- 最終關：達人挑戰賽 (測驗) + 學號輸入功能 ---
const QuizScreen = ({ onFinish }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const [studentId, setStudentId] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');

  const questions = [
    { q: "太空船(電腦)在網路上有一個由數字組成的專屬身分證，叫做什麼？", options: ["URL 網址", "IP 位址", "設定檔"], ans: 1 },
    { q: "要開啟新的「觀察窗」來尋找資料，應該點擊瀏覽器上面的哪個符號來開啟【新分頁】？", options: ["畫筆符號 ✏️", "加號 ➕", "減號 ➖"], ans: 1 },
    { q: "如果要換一個自己喜歡的主題顏色，打造【專屬的個人設定檔】，要點擊哪裡？", options: ["右下角的「自訂 Chrome」", "鍵盤的 Ctrl 鍵", "關閉瀏覽器"], ans: 0 }
  ];

  const handleAnswer = (index) => {
    if (index === questions[currentQ].ans) setScore(s => s + 1);
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setShowResult(true);
      if (score + (index === questions[currentQ].ans ? 1 : 0) === 3) onFinish();
    }
  };

  const handleSubmitForm = async () => {
    if (studentId.length !== 5) return;
    setSubmitStatus('submitting');

    try {
      const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdvkI-KVxKep2rkA-5LsQmM8BeAqnagjYwwzDE0Q5mEGlIlxg/formResponse"; 
      const ENTRY_ID = "entry.529634358"; 

      const formData = new FormData();
      formData.append(ENTRY_ID, studentId);

      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      setSubmitStatus('success');
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  if (showResult) {
    const isPerfect = score === 3;
    return (
      <div className={`rounded-3xl shadow-2xl p-10 relative overflow-hidden text-center max-w-4xl mx-auto animate-in zoom-in duration-700 ${isPerfect ? 'bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white border-4 border-yellow-400' : 'bg-white border-4 border-slate-200'}`}>
        {isPerfect && (
          <>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen"></div>
            <ParticleEffect count={80} colors={['#fbbf24', '#f59e0b', '#ffffff', '#a855f7', '#3b82f6']} />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-yellow-500/20 to-transparent pointer-events-none"></div>
          </>
        )}
        
        <div className="relative z-10 space-y-8 py-8">
          {isPerfect ? (
            <>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-30 animate-pulse"></div>
                <Trophy size={140} className="mx-auto text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-bounce" />
              </div>
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 drop-shadow-lg tracking-widest uppercase">
                挑戰完美通關
              </h2>
              
              <div className="flex flex-col items-center gap-6 mt-6">
                 {submitStatus === 'success' ? (
                   <div className="bg-green-500/20 px-10 py-8 rounded-3xl border-2 border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.2)] animate-in zoom-in">
                     <CheckCircle2 size={64} className="mx-auto text-green-400 mb-4 animate-bounce" />
                     <p className="text-4xl font-black text-green-300">戰績已成功送出！</p>
                     <p className="text-2xl text-green-100 mt-4 font-bold">指揮官 {studentId}，期待下次相見！</p>
                   </div>
                 ) : (
                   <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl w-full max-w-2xl shadow-2xl border border-yellow-500/50">
                      <p className="text-2xl font-bold text-yellow-100 mb-6">請輸入學號，記錄你的輝煌戰績</p>
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <input 
                          type="text" 
                          maxLength={5}
                          placeholder="例如：30120"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))}
                          className="px-6 py-4 text-3xl font-black text-center text-slate-800 rounded-2xl border-4 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/50 transition-all w-56 shadow-inner placeholder:text-slate-300 placeholder:text-xl placeholder:font-normal"
                        />
                        <Button 
                          onClick={handleSubmitForm} 
                          disabled={studentId.length !== 5 || submitStatus === 'submitting'}
                          variant="warning"
                          className="px-10 py-4 text-2xl h-[76px]"
                        >
                          {submitStatus === 'submitting' ? '傳送中...' : '送出成績'}
                        </Button>
                      </div>
                      <div className="h-8 mt-2">
                         {studentId.length > 0 && studentId.length < 5 && (
                           <p className="text-red-400 font-bold animate-pulse">學號必須剛好是 5 個數字喔！</p>
                         )}
                         {submitStatus === 'error' && (
                           <p className="text-red-400 font-bold">傳送失敗，請檢查網路連線後再試一次！</p>
                         )}
                      </div>
                   </div>
                 )}
              </div>
            </>
          ) : (
            <>
              <Sparkles size={80} className="mx-auto text-blue-400 mb-6" />
              <h2 className="text-5xl font-black text-slate-800">挑戰結束！</h2>
              <p className="text-3xl text-slate-600 font-bold">你答對了 {score} / 3 題</p>
              <div className="bg-blue-50 p-8 rounded-3xl mt-8 border-2 border-blue-200">
                <p className="text-2xl font-bold text-blue-800 mb-6">必須答對 3 題才能輸入學號登記戰績喔！</p>
                <Button onClick={() => window.location.reload()} variant="primary" className="mx-auto px-8 py-4 text-2xl">重新挑戰特訓</Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto bg-white border-blue-200 shadow-2xl">
      <div className="flex justify-between items-center mb-10 text-blue-600 font-black text-2xl bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 shadow-inner">
        <span className="flex items-center gap-3"><Trophy size={32}/> 終極星際測驗</span>
        <span className="bg-white px-4 py-1 rounded-full shadow-sm">進度 {currentQ + 1} / 3</span>
      </div>
      <h3 className="text-4xl font-black text-slate-800 mb-12 leading-snug drop-shadow-sm">{questions[currentQ].q}</h3>
      <div className="space-y-5">
        {questions[currentQ].options.map((opt, idx) => (
          <button 
            key={idx} onClick={() => handleAnswer(idx)} 
            className="w-full text-left p-6 rounded-2xl border-4 border-slate-100 text-2xl font-bold text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-sm"
          >
            <span className="inline-block w-10 h-10 bg-slate-200 text-center leading-10 rounded-full mr-4 text-slate-500">{String.fromCharCode(65 + idx)}</span>
            {opt}
          </button>
        ))}
      </div>
    </Card>
  );
};

// --- 主應用程式 ---
export default function SpaceCampGame({ onBackToPortal }) {
  const [currentView, setCurrentView] = useState('map');
  const [stars, setStars] = useState(0);
  const [progress, setProgress] = useState({ level1: false, level2: false, level3: false, level4: false });

  useEffect(() => {
    injectStyles(); 
  }, []);

  const handleComplete = (level) => {
    if (!progress[level]) {
      setStars(prev => prev + 1);
      setProgress(prev => ({ ...prev, [level]: true }));
    }
  };

  const handleQuizPerfect = () => setStars(prev => prev + 3);
  const allCompleted = progress.level1 && progress.level2 && progress.level3 && progress.level4;

  const renderMap = () => (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-14 space-y-4">
        <div className="inline-block p-4 bg-blue-100 rounded-full mb-4 shadow-inner">
          <Rocket className="text-blue-600 animate-bounce" size={64} />
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-800 tracking-wide drop-shadow-md">
          星際探險：網路與瀏覽器運用特訓營
        </h1>
        <p className="text-2xl text-slate-600 font-black">跟哲民老師一起完成 4 項基地訓練，收集星星幣吧！</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card bgColor={progress.level1 ? "bg-purple-50" : "bg-white"} className={`cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${progress.level1 ? 'border-purple-300 shadow-purple-100' : 'hover:border-purple-300'}`}>
          <div onClick={() => setCurrentView('level1')} className="flex items-center gap-6">
            <div className={`p-6 rounded-[2rem] transition-colors ${progress.level1 ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-[0_10px_20px_rgba(168,85,247,0.4)]' : 'bg-purple-100 text-purple-600'}`}>
              <Globe size={56} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-800 mb-2">1. 導航定位系統</h3>
              <p className="text-slate-500 font-bold mb-4 text-lg">攔截訊號找出神祕 IP 座標！</p>
              <span className={`font-black px-4 py-2 rounded-full text-sm inline-flex items-center gap-2 ${progress.level1 ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-slate-100 text-slate-600 border-2 border-transparent'}`}>
                {progress.level1 ? <><CheckCircle2 size={16}/> 已完成</> : "▶ 開始訓練"}
              </span>
            </div>
          </div>
        </Card>

        <Card bgColor={progress.level2 ? "bg-amber-50" : "bg-white"} className={`cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${progress.level2 ? 'border-amber-300 shadow-amber-100' : 'hover:border-amber-300'}`}>
          <div onClick={() => setCurrentView('level2')} className="flex items-center gap-6">
            <div className={`p-6 rounded-[2rem] transition-colors ${progress.level2 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_10px_20px_rgba(245,158,11,0.4)]' : 'bg-amber-100 text-amber-600'}`}>
              <Monitor size={56} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-800 mb-2">2. 視窗控制魔法</h3>
              <p className="text-slate-500 font-bold mb-4 text-lg">練習畫面縮放與開啟新分頁！</p>
              <span className={`font-black px-4 py-2 rounded-full text-sm inline-flex items-center gap-2 ${progress.level2 ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-slate-100 text-slate-600 border-2 border-transparent'}`}>
                {progress.level2 ? <><CheckCircle2 size={16}/> 已完成</> : "▶ 開始訓練"}
              </span>
            </div>
          </div>
        </Card>

        <Card bgColor={progress.level3 ? "bg-emerald-50" : "bg-white"} className={`cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${progress.level3 ? 'border-emerald-300 shadow-emerald-100' : 'hover:border-emerald-300'}`}>
          <div onClick={() => setCurrentView('level3')} className="flex items-center gap-6">
            <div className={`p-6 rounded-[2rem] transition-colors ${progress.level3 ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_10px_20px_rgba(16,185,129,0.4)]' : 'bg-emerald-100 text-emerald-600'}`}>
              <Palette size={56} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-800 mb-2">3. 專屬駕駛艙</h3>
              <p className="text-slate-500 font-bold mb-4 text-lg">設定 Chrome 打造專屬顏色！</p>
              <span className={`font-black px-4 py-2 rounded-full text-sm inline-flex items-center gap-2 ${progress.level3 ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-slate-100 text-slate-600 border-2 border-transparent'}`}>
                {progress.level3 ? <><CheckCircle2 size={16}/> 已完成</> : "▶ 開始訓練"}
              </span>
            </div>
          </div>
        </Card>

        <Card bgColor={progress.level4 ? "bg-blue-50" : "bg-white"} className={`cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${progress.level4 ? 'border-blue-300 shadow-blue-100' : 'hover:border-blue-300'}`}>
          <div onClick={() => setCurrentView('level4')} className="flex items-center gap-6">
            <div className={`p-6 rounded-[2rem] transition-colors ${progress.level4 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_10px_20px_rgba(59,130,246,0.4)]' : 'bg-blue-100 text-blue-600'}`}>
              <Zap size={56} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-800 mb-2">4. 引擎極限測試</h3>
              <p className="text-slate-500 font-bold mb-4 text-lg">瘋狂連擊測試太空船動力！</p>
              <span className={`font-black px-4 py-2 rounded-full text-sm inline-flex items-center gap-2 ${progress.level4 ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-slate-100 text-slate-600 border-2 border-transparent'}`}>
                {progress.level4 ? <><CheckCircle2 size={16}/> 已完成</> : "▶ 開始訓練"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-14 text-center">
        {allCompleted ? (
          <div className="animate-in zoom-in slide-in-from-bottom-8 duration-700 relative inline-block">
             <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-40 animate-pulse rounded-full"></div>
             <Button onClick={() => setCurrentView('quiz')} variant="dark" className="relative px-14 py-8 text-3xl shadow-slate-900 animate-bounce border-4 border-yellow-400 hover:scale-110">
               <Trophy size={40} className="text-yellow-400 drop-shadow-md"/> 領取最終任務：星際指揮官測驗！
             </Button>
          </div>
        ) : (
          <div className="bg-slate-200/50 inline-block px-10 py-5 rounded-full text-slate-500 font-black text-xl border-4 border-dashed border-slate-300 shadow-inner">
            🔒 完成上方 4 項基地訓練，即可解鎖最終任務！
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] p-6 md:p-12 font-sans selection:bg-blue-200 flex flex-col relative z-10">
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center mb-10 z-20">
        <div>
          {currentView !== 'map' ? (
            <button onClick={() => setCurrentView('map')} className="flex items-center gap-3 text-slate-600 font-black text-xl hover:text-blue-600 transition-all bg-white px-8 py-4 rounded-full shadow-md border-2 border-slate-200 hover:border-blue-400 hover:-translate-x-2">
              <ArrowLeft size={28} /> 返回任務地圖
            </button>
          ) : (
            <button onClick={onBackToPortal} className="flex items-center gap-3 text-slate-600 font-black text-xl hover:text-purple-600 transition-all bg-white px-8 py-4 rounded-full shadow-md border-2 border-slate-200 hover:border-purple-400 hover:-translate-x-2">
              <ArrowLeft size={28} /> 離開訓練，返回大廳
            </button>
          )}
        </div>
        
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-4 border-yellow-400 px-8 py-3 rounded-full shadow-lg flex items-center gap-4 transform hover:scale-105 transition-transform cursor-default">
          <Star size={36} className="text-yellow-500 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse" />
          <span className="text-2xl font-black text-yellow-800 tracking-wide">星星幣 <span className="text-4xl ml-2 text-yellow-600 drop-shadow-sm">{stars}</span></span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col justify-center relative z-10">
        {currentView === 'map' && renderMap()}
        {currentView === 'level1' && <LevelIP onComplete={() => handleComplete('level1')} />}
        {currentView === 'level2' && <LevelZoom onComplete={() => handleComplete('level2')} />}
        {currentView === 'level3' && <LevelProfile onComplete={() => handleComplete('level3')} />}
        {currentView === 'level4' && <LevelSpeed onComplete={() => handleComplete('level4')} />}
        {currentView === 'quiz' && <QuizScreen onFinish={handleQuizPerfect} />}
      </div>
    </div>
  );
}
