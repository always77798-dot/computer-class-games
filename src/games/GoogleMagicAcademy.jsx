import React, { useState, useEffect, useRef } from 'react';
import { Play, Users, Folder, UploadCloud, Share2, Plus, CheckCircle, AlertCircle, Sparkles, Send, UserPlus, Image as ImageIcon, FileText, Bug, Clock, Trophy, Shield, Zap, Wifi, Heart, Snowflake, Server, Ghost, Skull, Video, Music, MonitorPlay, Bomb, Timer, Cpu } from 'lucide-react';

// 🌟 新增 onBackToPortal 屬性，讓遊戲可以回到首頁
export default function GoogleMagicAcademy({ onBackToPortal }) {
  const [gameState, setGameState] = useState('intro');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizFails, setQuizFails] = useState(0); 
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [l4Fails, setL4Fails] = useState(0);
  const l4EnhancedRef = useRef(false);

  const [l2MenuOpen, setL2MenuOpen] = useState(false);
  
  const [l3Items, setL3Items] = useState([
    { id: 1, type: 'image', name: '貓咪.jpg', inFolder: false },
    { id: 2, type: 'doc', name: '國語作業.docx', inFolder: false },
    { id: 3, type: 'image', name: '狗狗.jpg', inFolder: false },
    { id: 4, type: 'video', name: '運動會.mp4', inFolder: false },
    { id: 5, type: 'image', name: '企鵝.png', inFolder: false },
    { id: 6, type: 'audio', name: '土小校歌.mp3', inFolder: false },
    { id: 7, type: 'video', name: '同樂節.mp4', inFolder: false },
    { id: 8, type: 'image', name: '獅子.jpg', inFolder: false },
    { id: 9, type: 'doc', name: '自然報告.docx', inFolder: false },
    { id: 10, type: 'image', name: '大象.png', inFolder: false }
  ]);
  const [l3Feedback, setL3Feedback] = useState(null);

  const l4Ref = useRef({
    stage: 1, plants: [], bugs: [], bullets: [], energy: 100, timeLeft: 60, status: 'start', score: 0, tick: 0, lives: 3, bossSpawned: false, items: { nuke: 1, freeze: 1 }, freezeTimer: 0, showHitFlash: 0, showNukeFlash: 0, bossEmpFlash: 0
  });
  const l4LoopRef = useRef(null);
  const [l4Tick, setL4Tick] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState('basic');

  const plantTypes = {
    basic: { id: 'basic', name: '基礎防火牆', cost: 20, icon: Shield, color: 'text-indigo-400', hp: 15, maxHp: 15, cooldown: 15, bulletType: 'normal', desc: '審查連線，阻擋未經授權的存取。' },
    ice: { id: 'ice', name: '隔離沙箱', cost: 30, icon: Snowflake, color: 'text-cyan-400', hp: 20, maxHp: 20, cooldown: 20, bulletType: 'ice', desc: '將可疑檔案關在安全環境，大幅減緩其破壞速度。' },
    rapid: { id: 'rapid', name: '防毒掃描器', cost: 40, icon: Zap, color: 'text-yellow-400', hp: 15, maxHp: 15, cooldown: 7, bulletType: 'normal', desc: '兩倍射擊速度，快速清除大量潛檢威脅。' },
    energy: { id: 'energy', name: '伺服器擴充', cost: 50, icon: Server, color: 'text-green-400', hp: 10, maxHp: 10, cooldown: 999, bulletType: 'none', desc: '提升運算力，加速「防護能量」的恢復速度。' }
  };

  const bugTypes = {
    basic: { type: 'basic', hp: 8, speed: 0.8, score: 10, icon: Bug, color: 'text-red-500', size: 'w-10 h-10' },
    fast: { type: 'fast', hp: 4, speed: 1.6, score: 15, icon: Ghost, color: 'text-purple-500', size: 'w-8 h-8' },
    tank: { type: 'tank', hp: 32, speed: 0.4, score: 30, icon: Skull, color: 'text-gray-800', size: 'w-12 h-12' },
    boss: { type: 'boss', hp: 250, speed: 0.4, score: 500, icon: Cpu, color: 'text-red-900', size: 'w-40 h-40' } 
  };

  const levels = {
    intro: { title: "歡迎各位魔法小學徒蒞臨~", subtitle: "超級百寶箱與分享任意門", desc: "今天我們要進行多項實作任務、刺激的防禦戰與最終的魔法測驗。準備好證明你的實力了嗎？", btnText: "開始闖關！", nextState: "level1" },
    level1: { title: "第一關：尋找魔法通訊錄", task: "請點擊【藍色小人】（聯絡人），把好朋友的 Email 存起來！" },
    level2: { title: "第二關：把寶物放進雲端", task: "請點擊【➕ 新增】選擇【檔案上傳】，把動物照片收進百寶箱！" },
    level3: { title: "第三關：整理百寶箱", task: "雲端硬碟亂七八糟的。請點擊所有的動物【圖片】檔案，把它們放進資料夾！(快想想老師教過的圖片檔案類型...)" },
    level4_1: { title: "第四關 (4-1)：雲端防禦戰", task: "警告！駭客釋放了變異病毒企圖破壞雲端！請善用「防護能量」部署資安防線，死守百寶箱 60 秒！(你有 3 次容錯機會)" },
    level4_2: { title: "第四關 (4-2)：終極防禦戰", task: "更狡猾的勒索軟體大軍與「DDoS 阻斷服務大魔王」即將入侵！撐過 90 秒！大魔王橫跨4排且具備高抗性，危急時請果斷使用「資安應急工具」！" },
    level5: { title: "第五關：開啟分享任意門", task: "請點擊資料夾旁邊的【共用】按鈕，把密碼門打開分享給同學建立羈絆！就可以進入最終考驗了！" }
  };

  const questions = [
    { q: "能在網路存放照片和檔案的『超級百寶箱』叫什麼名字？", options: ["Google 聯絡人", "Google 雲端硬碟", "Google 地圖"], ans: 1, explanation: "答錯囉！雲端硬碟（三角形圖示）才是百寶箱喔！" },
    { q: "為了不讓雲端硬碟的檔案亂七八糟，我們要建立什麼來幫忙分類？", options: ["資源回收筒", "任意門", "資料夾"], ans: 2, explanation: "答錯囉！能收納和分類資料的應該是什麼工具呢?" },
    { q: "想存放在雲端硬碟的檔案分享給好朋友看，要使用什麼魔法功能？", options: ["共用", "刪除", "下載"], ans: 0, explanation: "答錯囉！這是一個有「小人頭、加號」圖案的功能，應該選哪個才對呢?" }
  ];

  const nextLevel = (next) => {
    setGameState(next);
    setL2MenuOpen(false);
    setQuizFeedback(null);
    if (next === 'level4_1' || next === 'level4_2') {
      l4Ref.current.status = 'start';
      if (l4LoopRef.current) clearInterval(l4LoopRef.current);
    }
  };

  const handleL3ItemClick = (item) => {
    if (item.type !== 'image') {
      setL3Feedback({ type: 'error', msg: `哎呀！這是 ${item.name} 啦！扣 5 分。` });
      setScore(prev => Math.max(0, prev - 5));
      setTimeout(() => setL3Feedback(null), 1500);
      return;
    }
    const newItems = l3Items.map(i => i.id === item.id ? { ...i, inFolder: true } : i);
    setL3Items(newItems);
    setScore(prev => prev + 10);
    if (newItems.filter(i => i.type === 'image' && !i.inFolder).length === 0) {
      setL3Feedback({ type: 'success', msg: '太棒了！圖片都收好囉！額外獎勵 50 分！' });
      setScore(prev => prev + 50); 
      setTimeout(() => nextLevel('level4_1'), 1500);
    }
  };

  const handleRetryL4 = (stageNum) => {
    const newFails = l4Fails + 1;
    setL4Fails(newFails);
    setScore(s => Math.max(0, s - 30));
    l4EnhancedRef.current = newFails >= 3;
    startL4Game(stageNum);
  };

  const handleStartL4 = (stageNum) => {
    l4EnhancedRef.current = l4Fails >= 3;
    startL4Game(stageNum);
  };

  const startL4Game = (stageNum) => {
    l4Ref.current = {
      stage: stageNum, plants: [], bugs: [], bullets: [], energy: stageNum === 1 ? 100 : 150, 
      timeLeft: stageNum === 1 ? 60 : 90, status: 'playing', score: 0, tick: 0, lives: 3, 
      bossSpawned: false, items: { nuke: 1, freeze: 1 }, freezeTimer: 0, showHitFlash: 0, showNukeFlash: 0, bossEmpFlash: 0
    };
    setSelectedPlant('basic');
    if (l4LoopRef.current) clearInterval(l4LoopRef.current);
    l4LoopRef.current = setInterval(gameLoopL4, 100); 
    setL4Tick(t => t + 1);
  };

  const useL4Item = (itemType) => {
    const state = l4Ref.current;
    if (state.items[itemType] <= 0 || state.status !== 'playing') return;
    state.items[itemType] -= 1;
    
    if (itemType === 'nuke') {
      state.bugs.forEach(b => b.hp -= (b.isBoss ? 100 : 50)); 
      state.showNukeFlash = 5; 
    } else if (itemType === 'freeze') {
      state.freezeTimer = 50; 
    }
    setL4Tick(t => t + 1);
  };

  const gameLoopL4 = () => {
    const state = l4Ref.current;
    if (state.status !== 'playing') return;

    state.tick++;
    const tick = state.tick;

    if (state.showHitFlash > 0) state.showHitFlash--;
    if (state.showNukeFlash > 0) state.showNukeFlash--;
    if (state.freezeTimer > 0) state.freezeTimer--;
    if (state.bossEmpFlash > 0) state.bossEmpFlash--;

    if (tick % 10 === 0) {
      state.timeLeft -= 1;
      let energyGen = state.stage === 1 ? 6 : 8; 
      state.plants.forEach(p => { if (p.type === 'energy') energyGen += p.energyGen; });
      state.energy += energyGen;

      if (state.timeLeft <= 0) {
        state.status = 'won';
        clearInterval(l4LoopRef.current);
        setScore(prev => prev + state.score + (state.stage === 1 ? 200 : 500));
      }
    }

    let spawnRate = 30;
    if (state.stage === 1) {
      if (state.timeLeft < 45) spawnRate = 22;
      if (state.timeLeft < 30) spawnRate = 16;
      if (state.timeLeft < 15) spawnRate = 12;
    } else { 
      spawnRate = 25;
      if (state.timeLeft < 70) spawnRate = 18;
      if (state.timeLeft < 50) spawnRate = 12;
      if (state.timeLeft < 30) spawnRate = 8; 
    }

    if (tick % spawnRate === 0 && state.status === 'playing') {
      let bType = 'basic';
      const rand = Math.random();
      
      if (state.stage === 1) {
        if (state.timeLeft < 45) { if (rand < 0.2) bType = 'fast'; else if (rand > 0.85) bType = 'tank'; }
        if (state.timeLeft < 20) { if (rand < 0.3) bType = 'fast'; else if (rand > 0.75) bType = 'tank'; }
      } else {
        if (state.timeLeft < 80) { if (rand < 0.25) bType = 'fast'; else if (rand > 0.8) bType = 'tank'; }
        if (state.timeLeft < 45) { if (rand < 0.35) bType = 'fast'; else if (rand > 0.65) bType = 'tank'; }
      }
      
      const config = bugTypes[bType];
      state.bugs.push({
        id: Math.random(), row: Math.floor(Math.random() * 4), x: 105, isBoss: false,
        hp: config.hp, maxHp: config.hp, baseSpeed: config.speed, speed: config.speed, type: bType, slowed: 0, reached: false
      });
    }

    if (state.stage === 2 && state.timeLeft === 45 && !state.bossSpawned && state.status === 'playing') {
      state.bossSpawned = true;
      const config = bugTypes['boss'];
      state.bugs.push({
        id: 'BOSS_DDOS', row: 1.5, x: 105, isBoss: true, 
        hp: config.hp, maxHp: config.hp, baseSpeed: config.speed, speed: config.speed, type: 'boss', slowed: 0, reached: false
      });
    }

    state.plants.forEach(p => {
      if (p.type === 'energy') return;
      const pType = plantTypes[p.type];
      const pCenter = p.col * (100 / 7) + (100 / 14);
      
      const bugInRow = state.bugs.some(b => (b.isBoss || b.row === p.row) && b.x > pCenter);
      if (bugInRow && tick % p.cooldown === 0) {
        state.bullets.push({ id: Math.random(), row: p.row, x: pCenter + 5, bType: pType.bulletType });
      }
    });

    state.bullets.forEach(b => {
      b.x += 5;
      if (b.x > 110) b.hit = true;
      let hitBug = state.bugs.find(bug => !b.hit && (bug.isBoss || bug.row === b.row) && Math.abs(bug.x - b.x) < (bug.isBoss ? 12 : 5));
      if (hitBug) {
        hitBug.hp -= (hitBug.isBoss ? 0.5 : 1); 
        if (b.bType === 'ice') hitBug.slowed = (hitBug.isBoss ? 15 : 30); 
        b.hit = true;
      }
    });

    state.bugs.forEach(bug => {
      if (bug.slowed > 0) {
        bug.slowed -= 1;
        bug.speed = bug.baseSpeed * (bug.isBoss ? 0.7 : 0.4);
      } else {
        bug.speed = bug.baseSpeed;
      }

      let eatingPlants = [];
      for (let p of state.plants) {
        const pCenter = p.col * (100 / 7) + (100 / 14);
        if ((bug.isBoss || bug.row === p.row) && Math.abs(bug.x - pCenter) < (bug.isBoss ? 10 : 5)) {
          eatingPlants.push(p);
        }
      }

      if (eatingPlants.length > 0) {
        if (tick % 5 === 0) {
          eatingPlants.forEach(p => p.hp -= (bug.isBoss ? 2 : 1));
        }
      } else if (state.freezeTimer <= 0) {
        bug.x -= bug.speed;
      }

      if (bug.isBoss && tick % 80 === 0 && bug.x < 100) {
         state.bossEmpFlash = 6;
         state.plants.forEach(p => p.hp -= 2); 
      }

      if (bug.x <= 0 && !bug.reached) {
        bug.reached = true;
        state.lives -= (bug.isBoss ? 3 : 1); 
        state.showHitFlash = 5; 
        if (state.lives <= 0) {
          state.status = 'lost';
          clearInterval(l4LoopRef.current);
        }
      }
    });

    state.bugs.filter(b => b.hp <= 0).forEach(b => state.score += bugTypes[b.type].score);
    state.plants = state.plants.filter(p => p.hp > 0);
    state.bullets = state.bullets.filter(b => !b.hit);
    state.bugs = state.bugs.filter(b => b.hp > 0 && !b.reached);

    setL4Tick(t => t + 1);
  };

  const handleL4CellClick = (row, col) => {
    const state = l4Ref.current;
    if (state.status !== 'playing') return;
    if (state.plants.some(p => p.row === row && p.col === col)) return; 

    const pt = plantTypes[selectedPlant];
    const isEnhanced = l4EnhancedRef.current;
    
    const actualCost = isEnhanced ? Math.floor(pt.cost / 2) : pt.cost;

    if (state.energy >= actualCost) {
      state.energy -= actualCost;
      state.plants.push({ 
        id: Math.random(), 
        row, 
        col, 
        type: pt.id, 
        hp: isEnhanced ? pt.hp * 2 : pt.hp, 
        maxHp: isEnhanced ? pt.maxHp * 2 : pt.maxHp,
        cooldown: isEnhanced ? Math.max(1, Math.floor(pt.cooldown / 2)) : pt.cooldown,
        energyGen: isEnhanced ? 8 : 4
      });
      setL4Tick(t => t + 1);
    }
  };

  useEffect(() => {
    return () => { if (l4LoopRef.current) clearInterval(l4LoopRef.current); };
  }, []);

  const handleQuizAnswer = (selectedIndex) => {
    const currentQ = questions[quizIndex];
    if (selectedIndex === currentQ.ans) {
      setQuizFeedback({ type: 'success', msg: '答對了！你真棒！' });
      const earnedScore = Math.max(10, 50 - (quizFails * 20));
      setScore(prev => prev + earnedScore);

      setTimeout(() => {
        setQuizFeedback(null);
        setQuizFails(0);
        if (quizIndex < questions.length - 1) {
          setQuizIndex(quizIndex + 1);
        } else {
          setGameState('success');
        }
      }, 1500);
    } else {
      setQuizFeedback({ type: 'error', msg: currentQ.explanation });
      setQuizFails(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  const submitForm = async () => {
    if (studentId.length !== 5) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("entry.828211800", `${studentId} (${score}分)`);
    try {
      await fetch("https://docs.google.com/forms/d/e/1FAIpQLSdvkI-KVxKep2rkA-5LsQmM8BeAqnagjYwwzDE0Q5mEGlIlxg/formResponse", { method: "POST", mode: "no-cors", body: formData });
      setSubmitted(true);
    } catch (e) { alert("傳送魔法失敗，請檢查網路！"); }
    setIsSubmitting(false);
  };

  const renderL4Game = (stageNum) => {
    const state = l4Ref.current;
    const stageTitle = stageNum === 1 ? levels.level4_1.title : levels.level4_2.title;
    const stageTask = stageNum === 1 ? levels.level4_1.task : levels.level4_2.task;
    const isEnhanced = l4EnhancedRef.current;

    return (
      <div className="space-y-4 animate-fade-in w-full mx-auto relative">
        <h2 className={`text-2xl font-bold flex items-center justify-center gap-2 ${stageNum === 2 ? 'text-purple-700' : 'text-red-600'}`}>
          <Shield className="w-8 h-8 animate-pulse text-indigo-600" /> {stageTitle}
        </h2>

        {state.status === 'start' ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-inner max-w-2xl mx-auto text-center">
            <p className="text-lg text-red-800 font-bold mb-6 leading-relaxed">{stageTask}</p>
            
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-red-100">
              <h4 className="text-md font-bold text-gray-700 mb-4 border-b pb-2 flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500"/> 駭客威脅情報 (認識網路危險)
              </h4>
              <div className={`grid gap-3 ${stageNum === 1 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                 <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg text-center">
                    <Bug className="w-8 h-8 text-red-500 mb-2" />
                    <span className="font-bold text-sm text-gray-800">木馬程式</span>
                    <span className="text-[11px] text-gray-500 mt-1 leading-tight">偽裝成小遊戲或影片<br/>偷偷潛入系統</span>
                 </div>
                 <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg text-center">
                    <Ghost className="w-8 h-8 text-purple-500 mb-2" />
                    <span className="font-bold text-sm text-gray-800">釣魚網站</span>
                    <span className="text-[11px] text-gray-500 mt-1 leading-tight">做假網頁騙取帳號密碼<br/>移動極快防不勝防</span>
                 </div>
                 <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg text-center">
                    <Skull className="w-8 h-8 text-gray-800 mb-2" />
                    <span className="font-bold text-sm text-gray-800">勒索軟體</span>
                    <span className="text-[11px] text-gray-500 mt-1 leading-tight">將檔案加密鎖死要錢<br/>裝甲極厚需集中火力</span>
                 </div>
                 {stageNum === 2 && (
                   <div className="flex flex-col items-center p-3 bg-red-100 rounded-lg border border-red-300 shadow-inner text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                      <Cpu className="w-10 h-10 text-red-900 mb-1 drop-shadow-md animate-bounce" />
                      <span className="font-bold text-sm text-red-900">DDoS 阻斷魔王</span>
                      <span className="text-[10px] text-red-700 mt-1 leading-tight font-bold">【極度危險】<br/>血量極厚、無視緩速<br/>橫跨 4 排同時推進<br/>定期釋放全場破壞波</span>
                   </div>
                 )}
              </div>
            </div>

            <button
              onClick={() => handleStartL4(stageNum)}
              className={`text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto ${stageNum === 1 ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gradient-to-r from-purple-600 to-red-600'}`}
            >
              <Play className="w-6 h-6" /> {stageNum === 1 ? '啟動資安防線！' : '迎戰終極防線！'}
            </button>
          </div>
        ) : (
          <div className={`flex flex-col border-4 rounded-2xl overflow-hidden shadow-2xl relative ${state.showHitFlash > 0 ? 'border-red-500' : 'border-gray-800'}`}>
            
            {isEnhanced && (
              <div className="absolute top-0 left-0 w-full bg-yellow-400 text-yellow-900 text-sm font-black py-1 z-50 animate-pulse flex items-center justify-center gap-2 shadow-md tracking-wider">
                <Sparkles className="w-4 h-4" /> 🌟 系統救援啟動：防禦塔能力加倍、耗能減半！ 🌟 <Sparkles className="w-4 h-4" />
              </div>
            )}

            {state.showHitFlash > 0 && (
               <div className="absolute inset-0 bg-red-600/50 z-40 pointer-events-none flex items-center justify-center animate-pulse">
                   <AlertCircle className="w-40 h-40 text-red-100 opacity-80 animate-ping" />
               </div>
            )}
            {state.showNukeFlash > 0 && (
               <div className="absolute inset-0 bg-white/90 z-40 pointer-events-none flex items-center justify-center">
                   <Sparkles className="w-40 h-40 text-yellow-400 animate-spin-slow" />
               </div>
            )}
            {state.freezeTimer > 0 && (
               <div className="absolute inset-0 bg-cyan-300/20 z-30 pointer-events-none border-8 border-cyan-400/50 flex items-center justify-center backdrop-blur-[1px]">
                   <Timer className="w-24 h-24 text-cyan-200 opacity-50" />
               </div>
            )}
            {state.bossEmpFlash > 0 && (
               <div className="absolute inset-0 bg-purple-600/30 z-40 pointer-events-none flex items-center justify-center">
                   <Wifi className="w-64 h-64 text-purple-900 opacity-50 animate-ping" />
               </div>
            )}
            
            {state.bossSpawned && state.timeLeft > 26 && state.status === 'playing' && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                 <h1 className="text-5xl md:text-6xl font-black text-red-600 animate-pulse drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] tracking-widest text-center leading-tight">
                   ⚠️ 警告 ⚠️<br/>DDoS 阻斷魔王降臨！
                 </h1>
              </div>
            )}

            {stageNum === 2 && (
               <div className="absolute right-2 top-24 flex flex-col gap-4 z-30 pointer-events-auto">
                  <div className="group relative">
                    <button onClick={() => useL4Item('nuke')} disabled={state.items.nuke <= 0 || state.status !== 'playing'}
                       className={`p-3 rounded-full flex flex-col items-center justify-center shadow-2xl transition transform ${state.items.nuke > 0 ? 'bg-red-500 hover:bg-red-400 text-white hover:scale-110' : 'bg-gray-600 text-gray-400 opacity-60'}`}>
                       <Bomb className="w-8 h-8" />
                       <span className="text-[10px] font-black mt-1">全面掃毒</span>
                    </button>
                    <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 hidden group-hover:block w-36 bg-gray-900 text-white text-xs p-2 rounded shadow-lg pointer-events-none leading-relaxed">強制掃描並摧毀畫面上一般病毒，對魔王造成巨量傷害 (限1次)</div>
                  </div>
                  <div className="group relative">
                    <button onClick={() => useL4Item('freeze')} disabled={state.items.freeze <= 0 || state.status !== 'playing'}
                       className={`p-3 rounded-full flex flex-col items-center justify-center shadow-2xl transition transform ${state.items.freeze > 0 ? 'bg-cyan-500 hover:bg-cyan-400 text-white hover:scale-110' : 'bg-gray-600 text-gray-400 opacity-60'}`}>
                       <Timer className="w-8 h-8" />
                       <span className="text-[10px] font-black mt-1">緊急斷網</span>
                    </button>
                    <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 hidden group-hover:block w-32 bg-gray-900 text-white text-xs p-2 rounded shadow-lg pointer-events-none leading-relaxed">切斷外部連線，讓所有病毒暫停移動 5 秒 (限1次)</div>
                  </div>
               </div>
            )}

            <div className={`flex justify-between items-center text-white p-3 md:p-4 border-b-4 ${state.showHitFlash > 0 ? 'bg-red-800 border-red-600' : 'bg-gray-900 border-gray-700'} transition-colors ${isEnhanced ? 'pt-8' : ''}`}>
              <div className="flex gap-4 md:gap-8 items-center">
                <div className={`font-bold text-xl md:text-2xl flex items-center gap-2 ${state.timeLeft <= 15 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                  <Clock className="w-6 h-6 md:w-8 md:h-8" /> {state.timeLeft} 秒
                </div>
                <div className="flex items-center gap-1 text-red-500 drop-shadow-md">
                  {[...Array(3)].map((_, i) => (
                     <Heart key={i} className={`w-6 h-6 md:w-8 md:h-8 ${i < state.lives ? 'fill-current animate-pulse' : 'opacity-20'}`} />
                  ))}
                </div>
              </div>
              <div className="font-bold text-2xl md:text-3xl text-blue-300 flex items-center gap-2 bg-blue-900/60 px-4 md:px-6 py-1 md:py-2 rounded-full border border-blue-500 shadow-inner" title="防護能量 (隨時間恢復)">
                <Wifi className="w-6 h-6 md:w-8 md:h-8 animate-pulse text-yellow-300" /> {state.energy}
              </div>
            </div>

            <div className={`relative w-full h-[380px] md:h-[450px] ${stageNum === 1 ? 'bg-green-100 border-green-800' : 'bg-indigo-100 border-indigo-900'} border-b-4 overflow-hidden select-none`}>
              <div className="absolute inset-0 flex flex-col z-0 opacity-40">
                <div className="flex-1 border-b border-gray-400 bg-gray-300/30"></div>
                <div className="flex-1 border-b border-gray-400"></div>
                <div className="flex-1 border-b border-gray-400 bg-gray-300/30"></div>
                <div className="flex-1"></div>
              </div>

              <div className="absolute top-0 bottom-0 left-0 w-10 bg-blue-500/20 border-r-4 border-blue-400/50 z-0 flex flex-col justify-center items-center gap-10">
                 <Folder className="w-8 h-8 text-blue-600 opacity-50" />
                 <Folder className="w-8 h-8 text-blue-600 opacity-50" />
                 <Folder className="w-8 h-8 text-blue-600 opacity-50" />
              </div>

              <div className="absolute inset-0 grid grid-cols-7 grid-rows-4 z-10 pl-4">
                {[...Array(28)].map((_, i) => (
                  <div key={i} onClick={() => handleL4CellClick(Math.floor(i / 7), i % 7)} className="border border-green-400/20 hover:bg-white/40 cursor-pointer flex items-center justify-center transition-colors group">
                     <div className="opacity-0 group-hover:opacity-100 text-indigo-700/50 flex flex-col items-center transition-opacity">
                        {React.createElement(plantTypes[selectedPlant].icon, { className: "w-8 h-8 md:w-10 md:h-10" })}
                        <span className="text-xs font-bold bg-white/70 px-2 rounded-full mt-1">
                          消耗 {isEnhanced ? Math.floor(plantTypes[selectedPlant].cost / 2) : plantTypes[selectedPlant].cost}
                        </span>
                     </div>
                  </div>
                ))}
              </div>

              <div className="absolute inset-0 z-20 pointer-events-none pl-4">
                
                {state.plants.map(p => {
                  const pType = plantTypes[p.type];
                  return (
                    <div key={p.id} className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.col * (100/7) + (100/14)}%`, top: `${p.row * 25 + 12.5}%` }}>
                      <div className="relative">
                         <pType.icon className={`w-10 h-10 md:w-14 md:h-14 ${p.hp < p.maxHp/2 ? 'text-red-500 animate-pulse' : pType.color} ${isEnhanced ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]' : 'drop-shadow-lg'}`} fill="currentColor" fillOpacity={isEnhanced ? 0.4 : 0.2} />
                         {isEnhanced && <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />}
                      </div>
                      <div className="absolute -bottom-3 w-8 h-2 bg-gray-400 rounded-full overflow-hidden border border-gray-600 shadow-sm"><div className={`h-full ${isEnhanced ? 'bg-yellow-400' : 'bg-green-400'} transition-all`} style={{width: `${(p.hp/p.maxHp)*100}%`}}></div></div>
                    </div>
                  );
                })}

                {state.bugs.map(bug => {
                  if (bug.isBoss) {
                     return (
                       <div key={bug.id} className={`absolute flex flex-col items-center justify-center transition-all duration-100 ease-linear z-30 ${bug.slowed > 0 ? 'opacity-90' : ''}`} style={{ left: `${bug.x}%`, top: '50%', transform: 'translate(-50%, -50%)', height: '100%' }}>
                          <div className="relative flex flex-col items-center justify-center">
                             <div className="absolute inset-0 bg-red-900/40 animate-pulse rounded-full blur-2xl w-48 h-48 -left-4 top-10"></div>
                             <Cpu className={`w-32 h-32 md:w-40 md:h-40 text-red-900 drop-shadow-[0_0_20px_red] ${bug.slowed > 0 ? 'animate-none' : 'animate-bounce'}`} />
                             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Wifi className="w-16 h-16 text-red-100 animate-ping opacity-70" />
                             </div>
                             <div className="mt-4 w-32 h-4 bg-gray-900 rounded-full border-2 border-red-700 shadow-xl overflow-hidden relative">
                                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all" style={{width: `${(bug.hp/bug.maxHp)*100}%`}}></div>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">{Math.ceil(bug.hp)} / {bug.maxHp}</span>
                             </div>
                             <span className="bg-black/80 text-red-400 text-xs font-bold px-3 py-1 rounded-full mt-2 border border-red-900 drop-shadow-md">DDoS 阻斷大魔王</span>
                             {bug.slowed > 0 && <span className="text-cyan-300 font-bold text-xs mt-1 animate-pulse bg-black/50 px-2 rounded">系統緩速中</span>}
                          </div>
                       </div>
                     );
                  }

                  const bType = bugTypes[bug.type];
                  return (
                    <div key={bug.id} className={`absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-linear ${bug.slowed > 0 ? 'opacity-90' : ''}`} style={{ left: `${bug.x}%`, top: `${bug.row * 25 + 12.5}%` }}>
                      <div className="relative">
                        <bType.icon className={`${bType.size} ${bug.slowed > 0 ? 'text-cyan-500 drop-shadow-[0_0_8px_cyan]' : bType.color} drop-shadow-lg`} fill="currentColor" />
                        {bug.slowed > 0 && <Snowflake className="absolute -top-2 -right-2 w-5 h-5 text-cyan-200 animate-spin" />}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-1.5 bg-gray-400 rounded-full overflow-hidden border border-gray-600 shadow-sm"><div className="h-full bg-red-500 transition-all" style={{width: `${(bug.hp/bug.maxHp)*100}%`}}></div></div>
                      </div>
                    </div>
                  );
                })}

                {state.bullets.map(b => (
                  <div key={b.id} className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${b.x}%`, top: `${b.row * 25 + 12.5}%` }}>
                    {b.bType === 'ice' ? <Snowflake className="w-6 h-6 text-cyan-300 drop-shadow-md animate-spin-slow" /> : <Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 drop-shadow-md" fill="currentColor" />}
                  </div>
                ))}

              </div>

              {state.status === 'lost' && (
                <div className="absolute inset-0 bg-red-900/90 z-50 flex flex-col items-center justify-center text-white animate-fade-in pointer-events-auto backdrop-blur-sm">
                  <AlertCircle className="w-16 h-16 text-red-400 mb-4 animate-bounce" />
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">防禦失敗！</h3>
                  <p className="text-xl mb-6">百寶箱被病毒入侵，資料受到損害！</p>
                  <button onClick={() => handleRetryL4(stageNum)} className="bg-white text-red-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-50 transition transform hover:scale-105">
                    修復漏洞並重新挑戰 (扣除 30 分)
                  </button>
                </div>
              )}
              {state.status === 'won' && (
                <div className="absolute inset-0 bg-green-900/90 z-50 flex flex-col items-center justify-center text-white animate-fade-in pointer-events-auto backdrop-blur-sm">
                  <Trophy className="w-20 h-20 text-yellow-400 mb-4 animate-bounce drop-shadow-lg" />
                  <h3 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">防線守住啦！</h3>
                  <p className="text-xl font-bold">成功攔截駭客攻擊，雲端資料安全無虞！</p>
                  <button onClick={() => {
                      setL4Fails(0); 
                      l4EnhancedRef.current = false;
                      nextLevel(stageNum === 1 ? 'level4_2' : 'level5');
                    }} className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:from-yellow-300 hover:to-yellow-400 transition transform hover:scale-105">
                    {stageNum === 1 ? '前往 4-2 終極挑戰' : '前往最終關卡'}
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2 md:gap-6 bg-gray-800 p-3 md:p-4 border-t-4 border-gray-700">
              {Object.values(plantTypes).map(pt => {
                 const actualCost = isEnhanced ? Math.floor(pt.cost / 2) : pt.cost;
                 return (
                  <button key={pt.id} onClick={() => setSelectedPlant(pt.id)} disabled={state.energy < actualCost || state.status !== 'playing'} 
                     className={`relative flex flex-col items-center p-2 md:p-3 w-20 md:w-28 rounded-xl transition-all group ${selectedPlant === pt.id ? 'bg-indigo-600 ring-4 ring-yellow-400 transform scale-110 shadow-lg z-10' : 'bg-gray-700 hover:bg-gray-600'} ${(state.energy < actualCost || state.status !== 'playing') ? 'opacity-50 grayscale cursor-not-allowed' : ''} ${isEnhanced ? 'shadow-[0_0_15px_rgba(250,204,21,0.5)] border border-yellow-500/50' : ''}`}>
                    <div className="absolute bottom-full mb-3 hidden group-hover:block w-48 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none border border-gray-600">
                       <p className={`font-bold text-sm mb-1 flex items-center gap-1 ${pt.color}`}><Shield className="w-4 h-4"/> {pt.name}</p>
                       <p className="text-gray-300 mb-1">系統耐久度: {isEnhanced ? pt.hp * 2 : pt.hp}</p>
                       <p className="text-yellow-200 leading-relaxed">{pt.desc}</p>
                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                    {React.createElement(pt.icon, { className: `w-8 h-8 md:w-10 md:h-10 mb-1 drop-shadow-md ${isEnhanced ? 'text-yellow-300' : pt.color}` })}
                    <span className="text-white text-xs md:text-sm font-bold tracking-wide">{pt.name}</span>
                    <span className="text-yellow-400 text-xs md:text-sm font-bold flex items-center gap-1 mt-1"><Wifi className="w-3 h-3 md:w-4 md:h-4"/> {actualCost}</span>
                  </button>
                 );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4 font-sans selection:bg-indigo-200 overflow-x-hidden">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-indigo-200">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center relative overflow-hidden">
          <Sparkles className="absolute top-4 left-4 text-yellow-300 w-8 h-8 animate-pulse" />
          
          {/* 🌟 新增：返回大廳按鈕 */}
          {onBackToPortal && (
            <button 
              onClick={onBackToPortal}
              className="absolute top-4 left-14 z-10 bg-indigo-700 hover:bg-indigo-800 border-2 border-indigo-400 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center transition"
            >
              ⬅️ 返回大廳
            </button>
          )}

          <div className="flex-1 text-center">
             <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-md">🪄 哲民老師的雲端魔法學院 🪄</h1>
             <p className="text-indigo-200 mt-2 font-medium">闖關測驗</p>
          </div>
          {gameState !== 'intro' && gameState !== 'success' && (
             <div className="absolute top-4 right-4 bg-indigo-800 rounded-full px-4 py-2 flex items-center gap-2 border-2 border-yellow-400">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-yellow-400">{score} 分</span>
             </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 min-h-[450px] flex flex-col justify-center">

          {gameState === 'intro' && (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">{levels.intro.title}</h2>
              <div className="bg-indigo-100 p-6 rounded-xl inline-block max-w-lg shadow-inner border border-indigo-200">
                <p className="text-indigo-800 font-medium leading-relaxed">{levels.intro.desc}</p>
              </div>
              <button onClick={() => nextLevel('level1')} className="mt-6 flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 text-white px-8 py-4 rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-lg active:scale-95">
                <Play className="w-6 h-6 fill-current" /> {levels.intro.btnText}
              </button>
            </div>
          )}

          {gameState === 'level1' && (
            <div className="space-y-8 animate-fade-in text-center">
              <h2 className="text-2xl font-bold text-indigo-700">{levels.level1.title}</h2>
              <p className="text-lg bg-yellow-100 text-yellow-800 p-4 rounded-lg inline-block font-bold shadow-sm">{levels.level1.task}</p>
              <div className="flex justify-center gap-8 mt-8">
                <button className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 hover:bg-gray-50 transition transform hover:-translate-y-1" onClick={() => alert('不對喔！這是雲端硬碟！')}>
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100"><svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="currentColor"><path d="M12 2L2 19h20L12 2zm0 4.1L18.4 17H5.6L12 6.1z"/></svg></div>
                  <span className="font-bold text-gray-600">雲端硬碟</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-blue-200 hover:bg-blue-50 transition transform hover:-translate-y-1 relative" onClick={() => { setScore(s=>s+20); nextLevel('level2'); }}>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-md">點我！</div>
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-500"><Users className="w-10 h-10 text-white" /></div>
                  <span className="font-bold text-blue-700">聯絡人</span>
                </button>
              </div>
            </div>
          )}

          {gameState === 'level2' && (
            <div className="space-y-8 animate-fade-in text-center">
              <h2 className="text-2xl font-bold text-indigo-700">{levels.level2.title}</h2>
              <p className="text-lg bg-yellow-100 text-yellow-800 p-4 rounded-lg inline-block font-bold shadow-sm mt-4">{levels.level2.task}</p>
              <div className="border-2 border-indigo-100 rounded-xl overflow-hidden bg-gray-50 relative select-none shadow-md mx-auto max-w-lg">
                <div className="bg-white border-b-2 border-indigo-100 p-4 flex items-center gap-4">
                  <div className="relative">
                    <button onClick={() => setL2MenuOpen(!l2MenuOpen)} className="flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-sm bg-white border-2 border-indigo-500 text-indigo-700 hover:bg-indigo-50 animate-pulse">
                      <Plus className="w-6 h-6" /> 新增
                    </button>
                    {l2MenuOpen && (
                      <div className="absolute top-14 left-0 bg-white border border-gray-200 shadow-xl rounded-xl w-48 py-2 z-10 animate-fade-in">
                        <button className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 font-bold text-blue-600 transition" onClick={() => { setScore(s=>s+20); nextLevel('level3'); }}>
                          <UploadCloud className="w-5 h-5" /> 檔案上傳
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-8 h-48 flex items-center justify-center border-dashed border-4 border-gray-200 m-4 rounded-xl bg-white">
                  <div className="text-center text-gray-400 flex flex-col items-center"><ImageIcon className="w-16 h-16 mb-2 text-gray-200" /><p className="font-medium text-lg">百寶箱目前空空的</p></div>
                </div>
              </div>
            </div>
          )}

          {gameState === 'level3' && (
            <div className="space-y-6 animate-fade-in text-center">
               <h2 className="text-2xl font-bold text-indigo-700">{levels.level3.title}</h2>
               <p className="text-lg bg-yellow-100 text-yellow-800 p-4 rounded-lg inline-block font-bold shadow-sm">{levels.level3.task}</p>
               <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-md mt-4 relative max-w-2xl mx-auto">
                  {l3Feedback && (<div className={`absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full font-bold shadow-md z-10 ${l3Feedback.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} animate-fade-in`}>{l3Feedback.msg}</div>)}
                  <div className="flex flex-wrap justify-center gap-4 mb-8 min-h-[100px]">
                     {l3Items.map((item) => !item.inFolder && (
                        <button key={item.id} onClick={() => handleL3ItemClick(item)} className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition transform hover:-translate-y-2 hover:shadow-lg ${item.type === 'image' ? 'border-blue-200 hover:bg-blue-50' : 'border-gray-200 hover:bg-gray-50'} w-24 h-24 justify-center`}>
                          {item.type === 'image' && <ImageIcon className="w-8 h-8 text-blue-500 mb-2" />}
                          {item.type === 'doc' && <FileText className="w-8 h-8 text-blue-700 mb-2" />}
                          {item.type === 'video' && <Video className="w-8 h-8 text-red-500 mb-2" />}
                          {item.type === 'audio' && <Music className="w-8 h-8 text-yellow-500 mb-2" />}
                          {item.type === 'presentation' && <MonitorPlay className="w-8 h-8 text-orange-500 mb-2" />}
                          <span className="font-medium text-xs text-center break-all leading-tight mt-1">{item.name}</span>
                        </button>
                     ))}
                  </div>
                  <div className="border-t-4 border-dashed border-gray-200 pt-8 flex justify-center">
                     <div className="flex flex-col items-center group relative w-48 h-32 justify-center rounded-2xl border-4 border-indigo-300 bg-indigo-50">
                        <Folder className="w-16 h-16 text-indigo-500 mb-2 group-hover:scale-110 transition" />
                        <span className="font-bold text-indigo-800 text-xl">我的動物園</span>
                        <div className="absolute -top-3 -right-3 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md">{l3Items.filter(i => i.inFolder).length}/5</div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {gameState === 'level4_1' && renderL4Game(1)}
          {gameState === 'level4_2' && renderL4Game(2)}

          {gameState === 'level5' && (
            <div className="space-y-8 animate-fade-in text-center">
              <h2 className="text-2xl font-bold text-indigo-700">{levels.level5.title}</h2>
              <p className="text-lg bg-yellow-100 text-yellow-800 p-4 rounded-lg inline-block font-bold shadow-sm">{levels.level5.task}</p>
              <div className="mt-8 flex justify-center">
                <div className="bg-white border-4 border-indigo-100 rounded-2xl p-8 shadow-xl w-80 flex flex-col items-center group relative hover:border-indigo-300 transition-colors">
                  <div className="relative">
                     <Folder className="w-24 h-24 text-indigo-500 mb-4 group-hover:scale-105 transition-transform" />
                     <ImageIcon className="w-8 h-8 text-blue-400 absolute bottom-6 right-2 transform rotate-12" />
                  </div>
                  <span className="font-bold text-gray-800 text-2xl">我的動物園</span>
                  <div className="mt-8 border-t-2 border-gray-100 w-full pt-6 flex justify-center gap-6">
                    <button onClick={() => { setScore(s=>s+20); nextLevel('quiz'); }} className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 transition flex items-center gap-2 animate-bounce shadow-lg transform hover:scale-110">
                      <UserPlus className="w-7 h-7" /><span className="font-extrabold pr-3 text-lg">共用任意門</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gameState === 'quiz' && (
            <div className="animate-fade-in w-full max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2"><FileText className="w-6 h-6" /> 魔法結業測驗</h2>
                <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-bold shadow-sm border border-indigo-200">第 {quizIndex + 1} / {questions.length} 題</span>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-indigo-100 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed border-l-4 border-indigo-500 pl-4">{questions[quizIndex].q}</h3>
                <div className="space-y-4">
                  {questions[quizIndex].options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleQuizAnswer(idx)} disabled={quizFeedback?.type === 'success'} className="w-full text-left p-5 rounded-2xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition font-bold text-lg text-gray-700 flex items-center gap-4 disabled:opacity-50 transform hover:-translate-y-1 hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-extrabold text-indigo-600 text-xl shadow-inner">{String.fromCharCode(65 + idx)}</div>{opt}
                    </button>
                  ))}
                </div>
              </div>
              {quizFeedback && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-md ${quizFeedback.type === 'error' ? 'bg-red-50 border-2 border-red-200 text-red-700' : 'bg-green-50 border-2 border-green-200 text-green-700'}`}>
                  {quizFeedback.type === 'error' ? <AlertCircle className="w-6 h-6 flex-shrink-0" /> : <CheckCircle className="w-6 h-6 flex-shrink-0" />}
                  <span className="font-bold text-lg">{quizFeedback.msg}</span>
                </div>
              )}
            </div>
          )}

          {gameState === 'success' && (
            <div className="text-center space-y-8 animate-fade-in py-8">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-green-200 to-green-100 mb-2 border-4 border-green-400 relative shadow-lg">
                <Sparkles className="absolute -top-4 -right-4 text-yellow-400 w-12 h-12 animate-spin-slow drop-shadow-md" />
                <Trophy className="w-14 h-14 text-yellow-500" />
              </div>
              <div>
                 <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">完美通關！</h2>
                 <p className="text-2xl text-gray-700 font-bold">恭喜你獲得「雲端魔法師」稱號！🪄</p>
                 <div className="mt-4 inline-block bg-yellow-100 border-2 border-yellow-400 rounded-full px-6 py-2 text-xl font-black text-yellow-700 shadow-sm">最終得分：{score} 分</div>
              </div>
              {!submitted ? (
                <div className="bg-indigo-50 p-8 rounded-3xl max-w-md mx-auto border-2 border-indigo-200 shadow-md mt-8">
                  <h3 className="text-xl font-bold text-indigo-800 mb-6 flex items-center justify-center gap-2"><Send className="w-6 h-6" /> 最後一步：登錄成績</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-left text-sm font-bold text-gray-600 mb-2 pl-2">請輸入 5 碼學號：</label>
                      <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="例如：11205" maxLength={5} className="w-full text-center text-4xl tracking-widest font-black py-4 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 outline-none shadow-inner" />
                    </div>
                    <button onClick={submitForm} disabled={studentId.length !== 5 || isSubmitting} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 text-white px-6 py-4 rounded-2xl text-xl font-bold transition shadow-lg disabled:opacity-50">
                      {isSubmitting ? <span className="animate-pulse">傳送魔法中...</span> : <>登錄我的 {score} 分！</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-8 rounded-3xl max-w-md mx-auto border-2 border-green-300 mt-8 shadow-inner relative overflow-hidden">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 傳送成功！</h3>
                  <p className="text-green-700 font-medium text-lg leading-relaxed">你的成績 <strong>{score}分</strong> 已經成功登錄囉！可以安心關閉網頁了。</p>
                  
                  {/* 🌟 新增：過關後的返回大廳按鈕 */}
                  {onBackToPortal && (
                    <button onClick={onBackToPortal} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md">
                      返回遊戲大廳
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
      `}} />
    </div>
  );
}
