import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapPin, Search, User, Navigation, Car, Train, Plane, Footprints, 
  Map as MapIcon, CheckCircle, AlertCircle, Play, Send, Trophy, Ghost,
  Sparkles, Pointer, MousePointer2, Flag, ArrowRight, ArrowLeft, Building, 
  LocateFixed, ArrowUp, Store, Ban, TreePine, Bus, Camera, MessageSquare, 
  Smartphone, Gamepad2, ArrowDown, AlertTriangle, RotateCcw, Timer, Flame
} from 'lucide-react';

// 🌟 修改 1：更改元件名稱，並接收 onBackToPortal 屬性
export default function MapRescueGame({ onBackToPortal }) {
  const [gameState, setGameState] = useState('intro');
  const prevGameState = useRef('intro');
  
  // --- Arcade Score System ---
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [showComboAnim, setShowComboAnim] = useState(false);

  const addScore = useCallback((basePoints) => {
    setScore(s => s + (basePoints * combo));
    setCombo(c => Math.min(10, c + 1));
    setShowComboAnim(true);
    setTimeout(() => setShowComboAnim(false), 500);
  }, [combo]);

  // 新增：一般錯誤扣除 500 分，並中斷連擊
  const applyMinorPenalty = useCallback(() => {
    setScore(s => Math.max(0, s - 500));
    setCombo(1);
  }, []);

    // 新增：中等錯誤扣除 2000 分，並中斷連擊
  const applyMiddlePenalty = useCallback(() => {
    setScore(s => Math.max(0, s - 2000));
    setCombo(1);
  }, []);

  const applyFailPenalty = useCallback(() => {
    setScore(s => Math.floor(s * 0.9)); // 扣除10%總分
    setCombo(1);
  }, []);
  
  // --- Quiz & Form State ---
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizFails, setQuizFails] = useState(0);
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Level 1 States ---
  const [l1Searched, setL1Searched] = useState(false);
  
  // --- Level 2 States ---
  const [l2PegmanSelected, setL2PegmanSelected] = useState(false);
  const [isDraggingPegman, setIsDraggingPegman] = useState(false);
  const [l2State, setL2State] = useState('map'); 
  const [l2ViewPos, setL2ViewPos] = useState(0); 
  const [l2ViewDir, setL2ViewDir] = useState(0); 
  const [l2TargetLocked, setL2TargetLocked] = useState(false);

  // --- Level 3 States ---
  const [l3Start, setL3Start] = useState('');
  const [l3End, setL3End] = useState('');

  // --- GAME 1 States ---
  const [g1Fails, setG1Fails] = useState(0);
  const [g1Cards, setG1Cards] = useState([]);
  const [g1Flipped, setG1Flipped] = useState([]);
  const [g1Matched, setG1Matched] = useState([]);
  const [g1Timer, setG1Timer] = useState(60);
  const [g1Mistakes, setG1Mistakes] = useState(0);
  const [g1Status, setG1Status] = useState('playing'); 
  const g1Icons = [MapPin, User, Navigation, Car, Train, Footprints];

  // --- GAME 2 States ---
  const [g2Fails, setG2Fails] = useState(0);
  const [g2State, setG2State] = useState('start'); 
  const [g2CarLane, setG2CarLane] = useState(1); 
  const [g2Items, setG2Items] = useState([]); 
  const [g2Score, setG2Score] = useState(0);
  const [g2Hp, setG2Hp] = useState(3);
  const [g2Timer, setG2Timer] = useState(0);
  const g2ConsecutiveCones = useRef(0);
  const g2ConsecutivePins = useRef(0);

  // --- GAME 3 States ---
  const [g3Fails, setG3Fails] = useState(0);
  const [g3State, setG3State] = useState('playing');
  const [g3Pos, setG3Pos] = useState({x: 1, y: 1});
  const [g3Maze, setG3Maze] = useState([]);
  const [g3Timer, setG3Timer] = useState(60);
  const [g3GhostPos, setG3GhostPos] = useState(null);
  const ghostLastPosRef = useRef(null);
  const touchStartRef = useRef({x: 0, y: 0});

  // ---------------- Text & Configs ----------------
  const levels = {
    intro: { title: "Google地圖探險", subtitle: "迷航救援大作戰", desc: "小探險家在土城國小附近迷路了！請運用你的地圖超能力完成任務！本次導入【街機連擊計分】，失誤會扣總分10%，請展現最強實力吧！", btnText: "開始探險！" },
    level1: { title: "任務一：定位與搜尋", task: "點擊上方「搜尋按鈕」找尋土城國小，然後精準點擊地圖上的「紅色標記」！" },
    level2: { title: "任務二：街景降落", task: "將「衣夾人」拖曳到馬路。轉動視角前進，瞄準並拍攝「校門口」！" },
    level3: { title: "任務三：路線規劃", task: "閱讀上方情境線索，並設定正確的「起點」、「終點」與「交通方式」！" },
    gameIntro: { title: "第二部分：趣味大挑戰", task: "即將進入三道充滿挑戰的街機關卡！(若單一關卡失敗3次將觸發保底難度) 連擊越高分數越多，出發！" },
    game1: { title: "關卡一：地圖記憶翻牌", task: "60秒內找出所有成對圖案！錯誤越少越好！" },
    game2: { title: "關卡二：街景車出任務", task: "收集 15 個「地標」，小心躲避「路障」！(支援鍵盤左右鍵)" },
    game3: { title: "最終關：終極導航迷宮", task: "60秒內引導探險家穿越隨機迷宮！請注意中央有「徘徊的鬼魂」，被抓到就直接失敗！(支援鍵盤左右鍵)" }
  };

  const questions = [
    { q: "地圖上紅色的「水滴狀」圖標代表什麼意思？", options: ["這裡在下雨", "我們搜尋的目的地", "這裡有草莓"], ans: 1, explanation: "答錯囉！紅色的水滴狀地標是表示我們搜尋的「目的地」位置喔！" },
    { q: "如果想要看真實街道的照片，要把哪一個小幫手拉到地圖上？", options: ["藍色小箭頭", "綠色小樹", "衣夾人 (黃色小人)"], ans: 2, explanation: "答錯囉！要看街景，必須派出身穿黃色衣服的「衣夾人」喔！" },
    { q: "小探險家想看從學校「走」回家要多久，應該點選哪一個圖示？", options: ["汽車", "走路的小人", "飛機"], ans: 1, explanation: "答錯囉！要找走路的時間，當然要選「走路的小人」圖示呀！" }
  ];

  const nextLevel = (next) => {
    setGameState(next);
    setQuizFeedback(null);
  };

  // ---------------- Auto Init Games ----------------
  const initG1 = useCallback((fails) => {
    const isEasy = fails >= 3;
    const iconsToUse = isEasy ? g1Icons.slice(0, 4) : g1Icons; 
    const deck = [...iconsToUse, ...iconsToUse].sort(() => Math.random() - 0.5).map((Icon, idx) => ({ 
      id: idx, Icon, isFlipped: false, isMatched: false 
    }));
    setG1Cards(deck);
    setG1Flipped([]);
    setG1Matched([]);
    setG1Timer(isEasy ? 90 : 60);
    setG1Mistakes(0);
    setG1Status('playing');
  }, []);

  const resetG2 = useCallback((fails) => {
    setG2State('start');
    setG2CarLane(1);
    setG2Items([]);
    setG2Score(0);
    setG2Hp(fails >= 3 ? 5 : 3); 
    setG2Timer(0);
    g2ConsecutiveCones.current = 0;
    g2ConsecutivePins.current = 0;
  }, []);

  const generateMaze = useCallback((width, height) => {
    let maze = Array(height).fill().map(() => Array(width).fill(1));
    const carve = (x, y) => {
      maze[y][x] = 0;
      const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]].sort(() => Math.random() - 0.5);
      for (let [dx, dy] of dirs) {
        const nx = x + dx * 2, ny = y + dy * 2;
        if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === 1) {
          maze[y + dy][x + dx] = 0;
          carve(nx, ny);
        }
      }
    };
    carve(1, 1);
    maze[1][1] = 2; 
    maze[height - 2][width - 2] = 3; 
    for(let i=0; i< (width===21? 30 : 10); i++) {
       const rx = Math.floor(Math.random() * (width - 2)) + 1;
       const ry = Math.floor(Math.random() * (height - 2)) + 1;
       if (maze[ry][rx] === 1) maze[ry][rx] = 0;
    }
    return maze;
  }, []);

  const initG3 = useCallback((fails) => {
    const isEasy = fails >= 3;
    const size = isEasy ? 11 : 21; 
    setG3Maze(generateMaze(size, size));
    setG3Pos({x: 1, y: 1});
    setG3Timer(isEasy ? 90 : 60);
    
    // 【修改】判斷是否為簡易模式：若是，則不生成鬼魂
    if (isEasy) {
      setG3GhostPos(null);
    } else {
      const center = Math.floor(size / 2);
      setG3GhostPos({ x: center, y: center });
    }
    
    ghostLastPosRef.current = null;
    setG3State('playing');
  }, [generateMaze]);

  useEffect(() => {
    if (prevGameState.current !== gameState) {
      if (gameState === 'game1') initG1(g1Fails);
      if (gameState === 'game2') resetG2(g2Fails);
      if (gameState === 'game3') initG3(g3Fails);
      prevGameState.current = gameState;
    }
  }, [gameState, g1Fails, g2Fails, g3Fails, initG1, resetG2, initG3]);

  // ---------------- Level 1 Actions ----------------
  const handleL1ClickPin = (isCorrect) => {
    if (!l1Searched) return;
    if (isCorrect) {
      addScore(1000);
      nextLevel('level2');
    } else {
      applyFailPenalty();
      alert("哎呀！這不是我們的目的地，找找紅色的水滴標記！(扣除 500 分)");
    }
  };

  // ---------------- Level 2 Actions ----------------
  const handleL2DragStart = (e) => { e.dataTransfer.setData('application/json', 'pegman'); setIsDraggingPegman(true); };
  const handleL2DragEnd = () => setIsDraggingPegman(false);
  const handleL2DragOver = (e) => e.preventDefault();
  const handleL2Drop = (e) => {
    e.preventDefault();
    setIsDraggingPegman(false);
    if (e.dataTransfer.getData('application/json') === 'pegman') setL2State('streetview');
  };
  const handleL2ClickDrop = () => { if (l2PegmanSelected) setL2State('streetview'); };

  const streetMap = [
    [ { icon: Navigation, title: '筆直的街道', desc: '前方有大馬路，可以往前。', forward: 1, color: 'text-blue-500' }, { icon: Store, title: '便利商店', desc: '右邊有便利商店。', forward: null, color: 'text-orange-500' }, { icon: Ban, title: '施工牆', desc: '後方正在施工。', forward: null, color: 'text-red-500' }, { icon: TreePine, title: '小公園', desc: '左邊有公園。', forward: null, color: 'text-green-500' } ],
    [ { icon: Building, title: '學校外牆', desc: '前方看到紅磚牆了！', forward: 2, color: 'text-red-400' }, { icon: Bus, title: '公車站', desc: '右邊有站牌。', forward: null, color: 'text-yellow-600' }, { icon: Navigation, title: '街道', desc: '後方是便利商店。', forward: 0, color: 'text-blue-500' }, { icon: Building, title: '住宅區', desc: '左邊是公寓。', forward: null, color: 'text-gray-500' } ],
    [ { icon: Building, title: '土城國小大門口', desc: '找到了！', forward: null, target: true, color: 'text-red-600' }, { icon: TreePine, title: '大樹', desc: '右邊有榕樹。', forward: null, color: 'text-green-600' }, { icon: Navigation, title: '街道', desc: '後方是走過來的路。', forward: 1, color: 'text-blue-500' }, { icon: Car, title: '停車格', desc: '左邊有汽車。', forward: null, color: 'text-gray-600' } ]
  ];

  const handleTurnLeft = () => { setL2ViewDir((prev) => (prev + 3) % 4); setL2TargetLocked(false); };
  const handleTurnRight = () => { setL2ViewDir((prev) => (prev + 1) % 4); setL2TargetLocked(false); };

  const handleMoveForward = () => {
    const currentView = streetMap[l2ViewPos][l2ViewDir];
    if (currentView.forward !== null) { setL2ViewPos(currentView.forward); setL2TargetLocked(false); addScore(200); }
  };

  // ---------------- Level 3 Actions ----------------
  const handleL3LocationSelect = (loc) => {
    if (!l3Start) {
      if (loc === '土城國小') { setL3Start(loc); addScore(500); }
      else { applyFailPenalty(); alert('起點設定錯誤，請看對話提示！(扣除 500 分)'); }
    } else if (!l3End) {
      if (loc === '土城圖書館') { setL3End(loc); addScore(500); }
      else { applyFailPenalty(); alert('終點設定錯誤，請看對話提示！(扣除 500 分)'); }
    }
  };
  const handleL3Transport = (mode) => {
    if (mode === 'walk') {
      addScore(1500);
      nextLevel('gameIntro');
    } else {
      applyFailPenalty();
      alert("距離很近又想運動，選這個交通工具不對喔！(扣除 500 分)");
    }
  };

  // ---------------- Game 1: Memory Match ----------------
  useEffect(() => {
    if (gameState === 'game1' && g1Status === 'playing') {
      if (g1Timer <= 0) { setG1Status('timeout'); applyMiddlePenalty(); return; }
      const timerId = setInterval(() => setG1Timer(t => t - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [gameState, g1Timer, g1Status, applyFailPenalty]);

  const handleG1Click = (index) => {
    if (g1Status !== 'playing' || g1Flipped.length >= 2 || g1Cards[index].isFlipped || g1Cards[index].isMatched) return;

    const newCards = [...g1Cards];
    newCards[index].isFlipped = true;
    setG1Cards(newCards);
    const newFlipped = [...g1Flipped, index];
    setG1Flipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].Icon === newCards[second].Icon) {
         addScore(800);
         setTimeout(() => {
           const matchedCards = [...newCards];
           matchedCards[first].isMatched = true;
           matchedCards[second].isMatched = true;
           setG1Cards(matchedCards);
           setG1Flipped([]);
           setG1Matched(prev => [...prev, newCards[first].Icon]);
           if (g1Matched.length + 1 === g1Cards.length / 2) {
              setTimeout(() => { addScore(g1Timer * 200); nextLevel('game2'); }, 1000);
           }
         }, 500);
      } else {
         applyMinorPenalty();
         setG1Mistakes(m => m + 1);
         setTimeout(() => {
           const resetCards = [...newCards];
           resetCards[first].isFlipped = false;
           resetCards[second].isFlipped = false;
           setG1Cards(resetCards);
           setG1Flipped([]);
         }, 800);
      }
    }
  };

  const handleG1Retry = () => {
    const newFails = g1Fails + 1;
    setG1Fails(newFails);
    applyFailPenalty();
    initG1(newFails);
  };

  // ---------------- Game 2: Street Runner ----------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'game2' && g2State === 'playing') {
        if (e.key === 'ArrowLeft') setG2CarLane(l => Math.max(0, l - 1));
        if (e.key === 'ArrowRight') setG2CarLane(l => Math.min(2, l + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, g2State]);

  useEffect(() => {
    if (gameState !== 'game2' || g2State !== 'playing') return;
    
    const tInterval = setInterval(() => setG2Timer(t => t + 1), 1000);
    const isEasy = g2Fails >= 3;
    const baseSpeed = isEasy ? 2 : 3;
    const currentSpeed = baseSpeed + (g2Score * (isEasy ? 0.2 : 0.35)); 
    const frameRate = 50;

    const engine = setInterval(() => {
      setG2Items(prevItems => {
         let newItems = prevItems.map(item => ({...item, y: item.y + currentSpeed})).filter(item => item.y < 110);
         let hitObstacle = false;
         let gotItem = false;

         newItems = newItems.filter(item => {
           if (item.y > 75 && item.y < 95 && item.lane === g2CarLane) {
             if (item.type === 'cone') hitObstacle = true;
             if (item.type === 'pin') gotItem = true;
             return false; 
           }
           return true;
         });

         if (hitObstacle) { setG2Hp(h => h - 1); applyMinorPenalty(); }
         if (gotItem) { setG2Score(s => s + 1); addScore(600); }

         const spawnRate = isEasy ? 0.03 + (currentSpeed * 0.005) : 0.05 + (currentSpeed * 0.01);
         if (Math.random() < spawnRate) { 
           let type;
           // 強制生成邏輯
           if (g2ConsecutiveCones.current >= 5) {
             type = 'pin';
           } else if (g2ConsecutivePins.current >= 2) {
             type = 'cone';
           } else {
             // 隨機生成邏輯
             type = Math.random() < (isEasy ? 0.2 : 0.35) ? 'pin' : 'cone';
           }

           // 更新連續計數器
           if (type === 'pin') {
             g2ConsecutivePins.current += 1;
             g2ConsecutiveCones.current = 0;
           } else {
             g2ConsecutiveCones.current += 1;
             g2ConsecutivePins.current = 0;
           }

           const lane = Math.floor(Math.random() * 3);
           
           if (!newItems.some(i => i.y < 15 && i.lane === lane)) {
             // 防止3路障並排必死機制
             if (type === 'cone') {
                const nearbyCones = newItems.filter(i => i.type === 'cone' && i.y < 35);
                const occupiedLanes = new Set(nearbyCones.map(c => c.lane));
                if (occupiedLanes.size >= 2 && !occupiedLanes.has(lane)) {
                   type = 'pin'; 
                }
             }
             newItems.push({ id: Math.random(), type, lane, y: -10 });
           }
         }
         return newItems;
      });
    }, frameRate);

    return () => { clearInterval(engine); clearInterval(tInterval); };
  }, [gameState, g2State, g2CarLane, g2Score, g2Fails, addScore]);

  useEffect(() => {
    if (g2Hp <= 0 && g2State === 'playing') { setG2State('gameover'); applyMiddlePenalty(); }
    const target = g2Fails >= 3 ? 10 : 15; 
    if (g2Score >= target && g2State === 'playing') {
      setG2State('won');
      addScore(4000);
      setTimeout(() => nextLevel('game3'), 2000);
    }
  }, [g2Hp, g2Score, g2State, g2Fails, applyFailPenalty, addScore]);

  const handleG2Retry = () => {
    const newFails = g2Fails + 1;
    setG2Fails(newFails);
    applyFailPenalty();
    resetG2(newFails);
  };

  // ---------------- Game 3: Map Maze ----------------
  useEffect(() => {
    if (gameState === 'game3' && g3State === 'playing') {
      if (g3Timer <= 0) { setG3State('timeout'); applyMiddlePenalty(); return; }
      const tid = setInterval(() => setG3Timer(t => t - 1), 1000);
      return () => clearInterval(tid);
    }
  }, [gameState, g3State, g3Timer, applyFailPenalty]);

  // --- 鬼魂移動引擎 ---
  useEffect(() => {
    if (gameState !== 'game3' || g3State !== 'playing' || !g3GhostPos || g3Maze.length === 0) return;

    const ghostInterval = setInterval(() => {
      setG3GhostPos(prev => {
        if (!prev) return prev;
        // 1. 找出鬼魂四周可走的道路 (不是牆壁 === 1)
        const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
        let validMoves = dirs.map(([dx, dy]) => ({ x: prev.x + dx, y: prev.y + dy }))
          .filter(p => p.x >= 0 && p.y >= 0 && p.y < g3Maze.length && p.x < g3Maze[0].length && g3Maze[p.y][p.x] !== 1);
        
        // 2. 防打轉機制：如果有超過一條路可以走，就過濾掉「上一步」的座標 (不走回頭路)
        if (validMoves.length > 1 && ghostLastPosRef.current) {
           validMoves = validMoves.filter(p => p.x !== ghostLastPosRef.current.x || p.y !== ghostLastPosRef.current.y);
        }

        if (validMoves.length > 0) {
          const nextPos = validMoves[Math.floor(Math.random() * validMoves.length)];
          // 3. 鬼魂主動撞到玩家
          if (nextPos.x === g3Pos.x && nextPos.y === g3Pos.y) {
            setG3State('caught');
            applyMiddlePenalty();
          }
          // 4. 紀錄本次的起始點，作為下一次的「上一步」
          ghostLastPosRef.current = prev; 
          return nextPos;
        }
        return prev;
      });
    }, 200); // 【修改】將 800 改為 400 毫秒，速度提升兩倍！

    return () => clearInterval(ghostInterval);
  }, [gameState, g3State, g3Maze, g3Pos, applyFailPenalty]);

  const handleMazeMove = useCallback((dx, dy) => {
    if(g3Maze.length === 0 || g3State !== 'playing') return;
    const nx = g3Pos.x + dx;
    const ny = g3Pos.y + dy;
    if (nx >= 0 && ny >= 0 && ny < g3Maze.length && nx < g3Maze[0].length) {
      if (g3Maze[ny][nx] !== 1) { 
        // 碰撞鬼魂判定
        if (g3GhostPos && nx === g3GhostPos.x && ny === g3GhostPos.y) {
          setG3State('caught');
          applyMiddlePenalty();
          return;
        }
        setG3Pos({x: nx, y: ny});
        addScore(100); 
        if (g3Maze[ny][nx] === 3) { 
          setG3State('won');
          addScore(5000 + (g3Timer * 200));
          setTimeout(() => nextLevel('quiz'), 1500);
        }
      } else {
        setCombo(1); 
      }
    }
  }, [g3Pos, g3Maze, g3State, g3Timer, addScore, g3GhostPos, applyFailPenalty]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'game3' && g3State === 'playing') {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
        if (e.key === 'ArrowUp') handleMazeMove(0, -1);
        if (e.key === 'ArrowDown') handleMazeMove(0, 1);
        if (e.key === 'ArrowLeft') handleMazeMove(-1, 0);
        if (e.key === 'ArrowRight') handleMazeMove(1, 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, g3State, handleMazeMove]);

  const handleTouchStart = (e) => { touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const handleTouchEnd = (e) => {
    if (gameState !== 'game3' || g3State !== 'playing') return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) handleMazeMove(dx > 0 ? 1 : -1, 0);
      else handleMazeMove(0, dy > 0 ? 1 : -1);
    }
  };

  const handleG3Retry = () => {
    const newFails = g3Fails + 1;
    setG3Fails(newFails);
    applyFailPenalty();
    initG3(newFails);
  };

  // ---------------- Quiz & Form Actions ----------------
  const handleQuizAnswer = (selectedIndex) => {
    const currentQ = questions[quizIndex];
    if (selectedIndex === currentQ.ans) {
      setQuizFeedback({ type: 'success', msg: '答對了！你真棒！' });
      addScore(Math.max(1000, 3000 - (quizFails * 1000))); 
      
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
      applyMiddlePenalty();
    }
  };

  const submitForm = async () => {
    if (studentId.length !== 5) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("entry.1459286520", `${studentId} (${score}分)`);
    try {
      await fetch("https://docs.google.com/forms/d/e/1FAIpQLSdvkI-KVxKep2rkA-5LsQmM8BeAqnagjYwwzDE0Q5mEGlIlxg/formResponse", { 
        method: "POST", 
        mode: "no-cors", 
        body: formData 
      });
      setSubmitted(true);
    } catch (e) { 
      alert("傳送成績失敗，請檢查網路！"); 
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-2 md:p-4 font-sans selection:bg-blue-200 overflow-x-hidden">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-200 flex flex-col h-[90vh] md:h-auto md:min-h-[750px]">
        
        {/* --- Header & Arcade Score Board --- */}
        <div className="bg-blue-600 p-4 md:p-5 text-white flex justify-between items-center relative overflow-hidden shrink-0">
          <MapIcon className="absolute -top-4 -left-4 text-blue-400 opacity-30 w-24 h-24 transform -rotate-12" />
          <div className="flex-1 relative z-10 hidden md:block">
             <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide drop-shadow-md">🗺️ 地圖探險：迷航救援行動</h1>
          </div>
          <div className="flex-1 relative z-10 md:hidden">
             <h1 className="text-xl font-extrabold tracking-wide drop-shadow-md">🗺️ 迷航救援</h1>
          </div>
          
          {gameState !== 'intro' && gameState !== 'success' && (
             <div className="flex items-center gap-2 md:gap-4 z-10">
                {combo > 1 && (
                  <div className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-400 drop-shadow flex items-center gap-1 ${showComboAnim ? 'animate-bounce scale-110' : ''}`}>
                    <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-400 fill-orange-400" />
                    <span className="hidden md:inline">x{combo} COMBO!</span>
                    <span className="md:hidden">x{combo}</span>
                  </div>
                )}
                <div className={`bg-blue-900/80 rounded-full px-3 py-1 md:px-4 md:py-2 border-2 ${showComboAnim ? 'border-yellow-300 bg-blue-800' : 'border-blue-400'} shadow-inner flex items-center gap-2 transition-colors`}>
                   <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                   <span className="font-black text-yellow-400 text-base md:text-xl tracking-wider font-mono">{score.toLocaleString()}</span>
                </div>
             </div>
          )}
        </div>

        {/* --- Content Area --- */}
        <div className="p-3 md:p-8 flex-1 flex flex-col justify-center bg-gradient-to-b from-white to-sky-50 overflow-y-auto">

          {gameState === 'intro' && (
            <div className="text-center space-y-6 md:space-y-8 animate-fade-in my-auto">
              <div className="inline-block p-6 bg-blue-100 rounded-full shadow-inner mb-4 relative">
                <Navigation className="w-20 h-20 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{levels.intro.subtitle}</h2>
              <div className="bg-white p-6 rounded-2xl max-w-xl mx-auto shadow-md border border-gray-100">
                <p className="text-gray-600 font-bold text-base md:text-lg leading-relaxed">{levels.intro.desc}</p>
              </div>
              <button onClick={() => nextLevel('level1')} className="mt-4 flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-full text-xl md:text-2xl font-bold transition-all transform hover:scale-105 shadow-xl active:scale-95">
                <Play className="w-8 h-8 fill-current" /> {levels.intro.btnText}
              </button>
            </div>
          )}

          {/* Level 1 */}
          {gameState === 'level1' && (
            <div className="space-y-4 md:space-y-6 animate-fade-in w-full max-w-3xl mx-auto text-center my-auto">
              <h2 className="text-xl md:text-2xl font-bold text-blue-700 flex justify-center items-center gap-2"><Search /> {levels.level1.title}</h2>
              <p className="text-sm md:text-lg bg-yellow-100 text-yellow-800 p-3 md:p-4 rounded-xl font-bold shadow-sm inline-block mx-4">{levels.level1.task}</p>
              
              <div className="bg-gray-100 rounded-2xl border-4 border-gray-300 overflow-hidden relative h-[350px] md:h-[400px] shadow-inner mt-4 mx-2 md:mx-0">
                <div className="absolute top-4 left-4 right-4 bg-white rounded-full shadow-lg p-2 flex items-center gap-2 z-20">
                  <input type="text" value="土城國小" readOnly className="flex-1 px-4 font-bold text-gray-700 outline-none bg-transparent" />
                  <button onClick={() => {setL1Searched(true); addScore(300);}} className={`p-2 md:p-3 rounded-full flex items-center justify-center transition-colors ${!l1Searched ? 'bg-blue-500 hover:bg-blue-600 text-white animate-bounce' : 'bg-gray-300 text-gray-500'}`}>
                    <Search className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0iI2Y4ZmFmYyIvPjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDB2NDAiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')] opacity-60"></div>
                
                {l1Searched ? (
                  <div className="absolute inset-0 z-10 animate-fade-in">
                    <button onClick={() => handleL1ClickPin(false)} className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-full hover:scale-110 transition group">
                      <MapPin className="w-10 h-10 md:w-12 md:h-12 text-gray-400 fill-gray-200 drop-shadow-md" />
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap mt-1">便利商店</span>
                    </button>
                    <button onClick={() => handleL1ClickPin(false)} className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-full hover:scale-110 transition group">
                      <MapPin className="w-10 h-10 md:w-12 md:h-12 text-green-500 fill-green-200 drop-shadow-md" />
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap mt-1">公園</span>
                    </button>
                    <button onClick={() => handleL1ClickPin(true)} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full hover:scale-110 transition group animate-bounce">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-red-400 opacity-40 rounded-full blur-md animate-pulse"></div>
                        <MapPin className="relative w-14 h-14 md:w-16 md:h-16 text-red-600 fill-red-500 drop-shadow-xl" />
                      </div>
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow-md whitespace-nowrap mt-2">土城國小</span>
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-400 font-bold text-lg md:text-xl bg-white/50 backdrop-blur-sm px-4 text-center">請先點擊上方搜尋按鈕 🔍</div>
                )}
              </div>
            </div>
          )}

          {/* Level 2 */}
          {gameState === 'level2' && (
            <div className="space-y-4 md:space-y-6 animate-fade-in w-full max-w-4xl mx-auto text-center my-auto">
              <h2 className="text-xl md:text-2xl font-bold text-blue-700 flex justify-center items-center gap-2"><Camera /> {levels.level2.title}</h2>
              <p className="text-sm md:text-base bg-yellow-100 text-yellow-800 p-3 md:p-4 rounded-xl font-bold shadow-sm inline-block mx-4">{levels.level2.task}</p>
              
              <div className="bg-slate-800 rounded-2xl border-4 border-slate-700 overflow-hidden relative h-[400px] md:h-[450px] shadow-2xl mt-4 flex flex-col mx-2 md:mx-0">
                {l2State === 'map' && (
                  <>
                    <div className="flex-1 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0iI2YwZmRmNCIvPjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDB2NDAiIHN0cm9rZT0iI2RjZmNlNyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')] opacity-90">
                       <div className="absolute top-[10%] left-1/4 right-1/4 bottom-[60%] bg-orange-100 border-2 border-orange-300 rounded flex items-center justify-center shadow-sm">
                          <span className="font-bold text-orange-800 opacity-60">土城國小校區</span>
                       </div>
                       <div 
                         onDragOver={handleL2DragOver} onDrop={handleL2Drop} onClick={handleL2ClickDrop}
                         className={`absolute top-[45%] left-4 right-4 md:left-10 md:right-10 h-16 flex items-center justify-center cursor-pointer transition-all ${isDraggingPegman || l2PegmanSelected ? 'bg-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.8)] border-y-4 border-blue-500 animate-pulse' : 'bg-gray-300/50 border-y-2 border-gray-400'}`}
                       >
                         {(isDraggingPegman || l2PegmanSelected) && <span className="text-white font-black text-sm md:text-xl drop-shadow-md flex items-center gap-2"><Pointer className="w-5 h-5 md:w-6 md:h-6"/> 將衣夾人降落於此處！</span>}
                       </div>
                    </div>
                    <div className="h-20 md:h-24 bg-white border-t-2 border-gray-200 flex items-center justify-between px-4 md:px-8 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
                       <div className="text-gray-600 font-bold flex items-center gap-2 text-sm md:text-lg">
                         {(isDraggingPegman || l2PegmanSelected) ? <span className="text-blue-600 animate-pulse flex items-center gap-2"><MousePointer2 className="w-5 h-5 md:w-6 md:h-6"/> 放至藍色發光街道</span> : "第一步：按住或點選黃色小人"}
                       </div>
                       <div 
                         draggable onDragStart={handleL2DragStart} onDragEnd={handleL2DragEnd} onClick={() => setL2PegmanSelected(true)}
                         className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transition-transform cursor-grab active:cursor-grabbing ${isDraggingPegman ? 'opacity-50 scale-110' : 'bg-yellow-400 hover:bg-yellow-300 hover:-translate-y-2 border-4 border-white ring-4 ring-yellow-200 animate-bounce'}`}
                       >
                          <User className="w-8 h-8 md:w-10 md:h-10 text-yellow-800 pointer-events-none" fill="currentColor" />
                       </div>
                    </div>
                  </>
                )}

                {l2State === 'streetview' && (
                  <div className="absolute inset-0 flex flex-col z-30 animate-fade-in overflow-hidden bg-gradient-to-b from-sky-300 via-gray-300 to-gray-500">
                     <div className="bg-black/60 text-white p-2 md:p-3 flex justify-between items-center z-40 backdrop-blur-md">
                       <div className="font-bold flex items-center gap-2 text-sm md:text-base"><MapPin className="w-4 h-4 text-red-400"/> 街景模擬器</div>
                       <div className="text-xs md:text-sm bg-blue-500/90 px-3 py-1 rounded-full animate-pulse border border-blue-300 shadow">任務：前進尋找「土城國小大門口」</div>
                     </div>
                     
                     <div className="flex-1 relative flex items-center justify-center perspective-1000">
                        <div className="absolute bottom-0 w-full h-1/2 bg-gray-700/50 border-t-2 border-gray-400 flex justify-center items-end pb-4 pointer-events-none">
                            <div className="w-full h-full border-x-[50px] border-transparent border-b-[200px] border-b-gray-600/80 transform scale-150"></div>
                        </div>

                        {(() => {
                           const v = streetMap[l2ViewPos][l2ViewDir];
                           const Icon = v.icon;
                           return (
                             <div className={`relative z-20 bg-white/95 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center w-64 md:w-80 transform transition-all duration-300 ${v.target ? 'border-4 border-red-500 scale-105' : 'border border-gray-200'}`}>
                               <Icon className={`w-16 h-16 md:w-20 md:h-20 mb-3 drop-shadow-md ${v.color}`} />
                               <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-2">{v.title}</h3>
                               <p className="text-gray-600 font-bold text-sm md:text-base leading-relaxed">{v.desc}</p>
                               {v.target && !l2TargetLocked && (
                                 <button onClick={() => { setL2TargetLocked(true); addScore(500); }} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 animate-bounce shadow-lg">
                                    <LocateFixed className="w-5 h-5"/> 瞄準校門口！
                                 </button>
                               )}
                               {v.target && l2TargetLocked && (
                                 <button onClick={() => { addScore(2500); nextLevel('level3'); }} className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                                    <Camera className="w-5 h-5"/> 拍下照片 (完成)
                                 </button>
                               )}
                             </div>
                           );
                        })()}

                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-30">
                           <div className="h-1/3 flex justify-center items-start pt-4">
                             {streetMap[l2ViewPos][l2ViewDir].forward !== null && !l2TargetLocked && (
                               <button onClick={handleMoveForward} className="pointer-events-auto bg-white/30 hover:bg-white/60 backdrop-blur-md p-3 rounded-full text-white hover:text-blue-900 transition-all shadow-lg animate-bounce border border-white/50">
                                 <ArrowUp className="w-8 h-8 md:w-12 md:h-12" />
                                 <span className="block text-xs font-black drop-shadow">前進</span>
                               </button>
                             )}
                           </div>
                           <div className="h-1/3 flex justify-between items-center px-4 md:px-8">
                             {!l2TargetLocked && (
                               <>
                                 <button onClick={handleTurnLeft} className="pointer-events-auto bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 md:p-4 rounded-full text-white transition-all shadow-lg border border-white/20 hover:scale-110"><ArrowLeft className="w-6 h-6 md:w-10 md:h-10" /></button>
                                 <button onClick={handleTurnRight} className="pointer-events-auto bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 md:p-4 rounded-full text-white transition-all shadow-lg border border-white/20 hover:scale-110"><ArrowRight className="w-6 h-6 md:w-10 md:h-10" /></button>
                               </>
                             )}
                           </div>
                           <div className="h-1/3"></div>
                        </div>

                        {l2TargetLocked && (
                           <div className="absolute inset-0 border-[10px] md:border-[20px] border-black/40 pointer-events-none z-50 flex items-center justify-center">
                              <div className="w-48 h-48 md:w-64 md:h-64 border-2 border-red-500/80 rounded flex items-center justify-center relative">
                                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                                <div className="absolute w-8 h-8 border-t-4 border-l-4 border-red-500 top-0 left-0 -mt-1 -ml-1"></div>
                                <div className="absolute w-8 h-8 border-t-4 border-r-4 border-red-500 top-0 right-0 -mt-1 -mr-1"></div>
                                <div className="absolute w-8 h-8 border-b-4 border-l-4 border-red-500 bottom-0 left-0 -mb-1 -ml-1"></div>
                                <div className="absolute w-8 h-8 border-b-4 border-r-4 border-red-500 bottom-0 right-0 -mb-1 -mr-1"></div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Level 3: Route Planning */}
          {gameState === 'level3' && (
            <div className="space-y-4 md:space-y-6 animate-fade-in w-full max-w-4xl mx-auto text-center my-auto">
              <h2 className="text-xl md:text-2xl font-bold text-blue-700 flex justify-center items-center gap-2"><Navigation /> {levels.level3.title}</h2>
              <p className="text-sm md:text-base bg-yellow-100 text-yellow-800 p-3 md:p-4 rounded-xl font-bold shadow-sm inline-block mx-4">{levels.level3.task}</p>
              
              <div className="bg-white rounded-3xl border-4 border-blue-100 shadow-xl overflow-hidden mt-4 flex flex-col h-auto mx-2 md:mx-0">
                 <div className="bg-blue-50 border-b border-blue-200 p-4 flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shrink-0 shadow border-2 border-white">
                      <User className="w-8 h-8 text-yellow-800" fill="currentColor"/>
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm flex-1 text-left border border-gray-200">
                      <p className="text-gray-800 font-bold leading-relaxed text-sm md:text-base">
                        「放學了！我現在在<span className="text-blue-600">『土城國小』</span>，想去<span className="text-red-500">『土城圖書館』</span>借書。大約 500 公尺，今天天氣晴朗，幫我規劃最健康的交通路線吧！」
                      </p>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row flex-1">
                   <div className="bg-blue-600 text-white p-6 md:w-5/12 flex flex-col justify-center gap-6 relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10"><MapIcon className="w-48 h-48" /></div>
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                           <LocateFixed className="w-6 h-6 text-blue-200" />
                           <div className="flex-1 text-left">
                             <label className="block text-blue-200 text-sm font-bold mb-1">第一步：設定起點</label>
                             <div className={`bg-white text-gray-800 px-4 py-3 rounded-xl font-bold flex items-center h-12 shadow-inner border-2 ${!l3Start ? 'border-yellow-400 animate-pulse' : 'border-transparent'}`}>
                               {l3Start || <span className="text-gray-400">請從右側選擇起點...</span>}
                             </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <MapPin className="w-6 h-6 text-red-400 fill-white drop-shadow" />
                           <div className="flex-1 text-left">
                             <label className="block text-blue-200 text-sm font-bold mb-1">第二步：設定終點</label>
                             <div className={`bg-white text-gray-800 px-4 py-3 rounded-xl font-bold flex items-center h-12 shadow-inner border-2 ${(l3Start && !l3End) ? 'border-yellow-400 animate-pulse' : 'border-transparent'}`}>
                               {l3End || <span className="text-gray-400">請從右側選擇終點...</span>}
                             </div>
                           </div>
                        </div>
                        <button onClick={() => { setL3Start(''); setL3End(''); }} className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-full font-bold transition-colors w-fit mx-auto shadow">重新設定</button>
                      </div>
                   </div>

                   <div className="p-6 md:w-7/12 flex flex-col justify-center bg-gray-50">
                      {(!l3Start || !l3End) ? (
                        <div className="animate-fade-in flex flex-col h-full justify-center">
                          <h3 className="font-bold text-gray-600 mb-4 flex items-center justify-center gap-2 text-lg"><Flag className="w-6 h-6 text-blue-500"/> {!l3Start ? '你要設定哪裡為出發點？' : '你要設定哪裡為目的地？'}</h3>
                          <div className="grid grid-cols-2 gap-4">
                             {['土城國小', '公園', '土城圖書館', '遊樂園'].map(loc => (
                               <button key={loc} onClick={() => handleL3LocationSelect(loc)} className="p-4 bg-white rounded-xl shadow border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-bold text-base md:text-lg transition-all transform hover:-translate-y-1">{loc}</button>
                             ))}
                          </div>
                        </div>
                      ) : (
                        <div className="animate-fade-in flex flex-col h-full justify-center">
                          <h3 className="font-bold text-indigo-600 mb-4 flex items-center justify-center gap-2 text-base md:text-lg bg-indigo-100 p-2 rounded-lg"><CheckCircle className="w-6 h-6 shrink-0"/> 第三步：選擇交通方式！</h3>
                          <div className="grid grid-cols-2 gap-4">
                             <button onClick={() => handleL3Transport('car')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white transition-all shadow-sm">
                               <Car className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                               <span className="font-bold text-gray-600 text-sm md:text-base">汽車 (5分鐘)</span>
                             </button>
                             <button onClick={() => handleL3Transport('walk')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-green-400 bg-green-50 hover:bg-green-100 hover:border-green-500 transition-all animate-pulse shadow-md transform hover:scale-105">
                               <Footprints className="w-8 h-8 md:w-10 md:h-10 text-green-600" fill="currentColor" />
                               <span className="font-bold text-green-700 text-sm md:text-base">走路 (15分鐘)</span>
                             </button>
                             <button onClick={() => handleL3Transport('transit')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white transition-all shadow-sm">
                               <Train className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                               <span className="font-bold text-gray-600 text-sm md:text-base">捷運 (10分鐘)</span>
                             </button>
                             <button onClick={() => handleL3Transport('flight')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white transition-all shadow-sm">
                               <Plane className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                               <span className="font-bold text-gray-600 text-sm md:text-base">飛機 (無法計算)</span>
                             </button>
                          </div>
                        </div>
                      )}
                   </div>
                 </div>
              </div>
            </div>
          )}

          {/* --- PART 2: GAMES TRANSITION --- */}
          {gameState === 'gameIntro' && (
             <div className="text-center space-y-8 animate-fade-in my-auto max-w-2xl mx-auto">
                <div className="inline-block p-6 bg-purple-100 rounded-full shadow-inner mb-4 relative">
                  <Gamepad2 className="w-24 h-24 text-purple-600 animate-pulse" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-purple-700">{levels.gameIntro.title}</h2>
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border-4 border-purple-200 text-left">
                  <p className="text-gray-700 font-bold text-lg md:text-xl leading-relaxed text-center">{levels.gameIntro.task}</p>
                </div>
                <button onClick={() => nextLevel('game1')} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-10 py-5 rounded-full text-2xl font-bold transition-all transform hover:scale-110 shadow-xl flex items-center justify-center gap-3 mx-auto">
                   <Play className="w-8 h-8 fill-current" /> 進入街機模式
                </button>
             </div>
          )}

          {/* --- GAME 1: MEMORY MATCH --- */}
          {gameState === 'game1' && (
            <div className="space-y-4 md:space-y-6 animate-fade-in w-full max-w-3xl mx-auto text-center my-auto">
              <h2 className="text-xl md:text-2xl font-bold text-purple-700 flex justify-center items-center gap-2"><Gamepad2 /> {levels.game1.title}</h2>
              <p className="text-sm md:text-base bg-purple-100 text-purple-800 p-3 rounded-xl font-bold shadow-sm inline-block mx-4">{levels.game1.task}</p>
              
              <div className="bg-white rounded-3xl border-4 border-purple-200 shadow-xl p-4 md:p-8 mt-4 mx-2 md:mx-0 relative">
                <div className="flex justify-between items-center mb-6 px-4">
                   <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold shadow-inner">
                     <AlertCircle className="w-5 h-5"/> 錯誤次數: {g1Mistakes}
                   </div>
                   <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-inner ${g1Timer <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-white'}`}>
                     <Timer className="w-5 h-5"/> 剩餘時間: {g1Timer}s
                   </div>
                </div>

                {g1Status === 'timeout' ? (
                  <div className="py-12 flex flex-col items-center animate-fade-in">
                    <Timer className="w-20 h-20 text-red-500 mb-4 animate-bounce" />
                    <h3 className="text-3xl font-bold text-red-600 mb-4">時間到！</h3>
                    <p className="text-gray-600 font-bold mb-6">太可惜了，速度要再加快喔！</p>
                    <button onClick={handleG1Retry} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition">
                      <RotateCcw className="w-5 h-5"/> 重新挑戰 (扣除 10% 總分)
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 justify-center">
                    {g1Cards.map((card, idx) => {
                      const isRevealed = card.isFlipped || card.isMatched;
                      return (
                        <button key={idx} onClick={() => handleG1Click(idx)} disabled={isRevealed || g1Flipped.length >= 2} className={`aspect-square rounded-2xl flex items-center justify-center shadow-md transition-all transform duration-300 ${isRevealed ? 'bg-purple-50 border-2 border-purple-300 rotate-y-180' : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-b-4 border-purple-800 hover:-translate-y-1 hover:shadow-xl'}`}>
                           {isRevealed ? <card.Icon className={`w-12 h-12 md:w-16 md:h-16 ${card.isMatched ? 'text-green-500 animate-pulse' : 'text-purple-600'}`} /> : <MapIcon className="w-8 h-8 text-white opacity-50" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- GAME 2: STREET RUNNER --- */}
          {gameState === 'game2' && (
            <div className="space-y-4 md:space-y-6 animate-fade-in w-full max-w-3xl mx-auto text-center my-auto">
              <h2 className="text-xl md:text-2xl font-bold text-purple-700 flex justify-center items-center gap-2"><Car /> {levels.game2.title}</h2>
              <p className="text-sm md:text-base bg-purple-100 text-purple-800 p-3 rounded-xl font-bold shadow-sm inline-block mx-4">{levels.game2.task}</p>
              
              <div className="bg-slate-800 rounded-3xl border-4 border-slate-700 shadow-2xl h-[400px] md:h-[450px] mt-4 mx-2 md:mx-0 relative overflow-hidden flex flex-col">
                <div className="bg-black/50 text-white p-3 flex justify-between items-center z-40 backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1 text-red-400">
                       {[...Array(g2Fails >= 3 ? 5 : 3)].map((_,i) => <span key={i} className={`text-xl ${i < g2Hp ? 'opacity-100 animate-pulse' : 'opacity-20'}`}>❤️</span>)}
                    </div>
                    <div className="text-sm font-bold text-gray-300 flex items-center gap-1"><Timer className="w-4 h-4"/> {g2Timer}s</div>
                  </div>
                  <div className="font-bold bg-purple-600/80 px-4 py-1 rounded-full text-sm md:text-base border border-purple-400 flex items-center gap-2">
                     <MapPin className="w-4 h-4"/> 收集：{g2Score} / {g2Fails >= 3 ? 10 : 15}
                  </div>
                </div>

                <div className="flex-1 relative perspective-1000 bg-gray-700">
                  <div className="absolute inset-0 flex justify-center">
                    <div className="w-full max-w-sm bg-gray-600 h-full relative border-x-4 border-gray-400 overflow-hidden">
                       <div className="absolute top-0 bottom-0 left-1/3 w-1 border-r-4 border-dashed border-white/50" style={{backgroundPosition: `0 ${g2Timer * 20}px`}}></div>
                       <div className="absolute top-0 bottom-0 right-1/3 w-1 border-r-4 border-dashed border-white/50" style={{backgroundPosition: `0 ${g2Timer * 20}px`}}></div>
                       
                       {g2Items.map(item => (
                         <div key={item.id} className="absolute w-1/3 flex items-center justify-center transition-all duration-75 ease-linear" style={{ left: `${item.lane * 33.33}%`, top: `${item.y}%` }}>
                           {item.type === 'cone' ? <AlertTriangle className="w-10 h-10 text-orange-500 fill-orange-400 drop-shadow-md" /> : <MapPin className="w-10 h-10 text-red-500 fill-white drop-shadow-md animate-bounce" />}
                         </div>
                       ))}
                       <div className="absolute bottom-6 w-1/3 flex items-center justify-center transition-all duration-150 z-20" style={{ left: `${g2CarLane * 33.33}%` }}>
                          <div className={`p-2 rounded-xl bg-white shadow-lg border-b-4 border-gray-300 ${g2Hp <= 0 ? 'animate-ping' : ''}`}>
                             <Car className="w-12 h-12 text-blue-600" />
                          </div>
                       </div>
                    </div>
                  </div>

                  {g2State === 'start' && (
                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                        <button onClick={() => setG2State('playing')} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 px-8 py-4 rounded-full font-black text-2xl shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:scale-110 transition">啟動引擎！</button>
                     </div>
                  )}
                  {g2State === 'gameover' && (
                     <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center z-50 text-white animate-fade-in p-6 text-center">
                        <AlertTriangle className="w-20 h-20 text-orange-400 mb-4" />
                        <h3 className="text-3xl font-bold mb-6">車子拋錨啦！</h3>
                        <button onClick={handleG2Retry} className="bg-white text-red-800 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition shadow-lg">
                          <RotateCcw className="w-5 h-5"/> 重新挑戰 (扣除 10% 總分)
                        </button>
                     </div>
                  )}
                  {g2State === 'won' && (
                     <div className="absolute inset-0 bg-green-900/80 flex flex-col items-center justify-center z-50 text-white animate-fade-in">
                        <CheckCircle className="w-20 h-20 text-green-400 mb-4" />
                        <h3 className="text-3xl font-bold mb-2">任務成功！</h3>
                        <p className="text-lg font-bold mb-6 text-green-200">收集完成，前往最終關...</p>
                     </div>
                  )}
                </div>

                <div className="h-20 bg-gray-900 flex justify-between items-center px-4 md:px-12 shrink-0 border-t-2 border-gray-700">
                   <button onClick={() => setG2CarLane(Math.max(0, g2CarLane - 1))} disabled={g2State !== 'playing'} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-xl shadow-md border-b-4 border-gray-800 active:border-b-0 active:translate-y-1 transition disabled:opacity-50 w-24 flex justify-center"><ArrowLeft className="w-8 h-8" /></button>
                   <span className="text-gray-400 font-bold hidden md:inline flex items-center gap-2">支援鍵盤 <kbd className="bg-gray-800 px-2 rounded">◀</kbd> <kbd className="bg-gray-800 px-2 rounded">▶</kbd> 切換</span>
                   <button onClick={() => setG2CarLane(Math.min(2, g2CarLane + 1))} disabled={g2State !== 'playing'} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-xl shadow-md border-b-4 border-gray-800 active:border-b-0 active:translate-y-1 transition disabled:opacity-50 w-24 flex justify-center"><ArrowRight className="w-8 h-8" /></button>
                </div>
              </div>
            </div>
          )}

          {/* --- GAME 3: MAP MAZE (21x21 / 11x11) --- */}
          {gameState === 'game3' && (
            <div className="space-y-4 md:space-y-6 animate-fade-in w-full max-w-3xl mx-auto text-center my-auto">
              <h2 className="text-xl md:text-2xl font-bold text-purple-700 flex justify-center items-center gap-2"><Navigation /> {levels.game3.title}</h2>
              <p className="text-sm md:text-base bg-purple-100 text-purple-800 p-3 rounded-xl font-bold shadow-sm inline-block mx-4">{levels.game3.task}</p>
              
              <div className="bg-green-50 rounded-3xl border-4 border-green-200 shadow-xl p-4 md:p-6 mt-4 mx-2 md:mx-0 flex flex-col items-center relative overflow-hidden">
                
                <div className="flex justify-between items-center mb-4 px-4 w-full z-10">
                   <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-inner mx-auto ${g3Timer <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-white'}`}>
                     <Timer className="w-5 h-5"/> 剩餘時間: {g3Timer}s
                   </div>
                </div>

                {g3State === 'timeout' && (
                  <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                     <Timer className="w-20 h-20 text-red-500 mb-4 animate-bounce" />
                     <h3 className="text-3xl font-bold text-red-600 mb-4">時間到！</h3>
                     <p className="text-gray-600 font-bold mb-6">小探險家還沒走出迷宮！</p>
                     <button onClick={handleG3Retry} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition">
                       <RotateCcw className="w-5 h-5"/> 重新挑戰 (扣除 10% 總分)
                     </button>
                  </div>
                )}

                {g3State === 'caught' && (
                  <div className="absolute inset-0 bg-purple-900/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in text-white">
                     <Ghost className="w-20 h-20 text-purple-300 mb-4 animate-bounce" />
                     <h3 className="text-3xl font-bold text-purple-200 mb-4">被鬼魂抓到了！</h3>
                     <p className="text-purple-100 font-bold mb-6">探險家在迷宮中嚇傻了...</p>
                     <button onClick={handleG3Retry} className="bg-white hover:bg-gray-200 text-purple-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition">
                       <RotateCcw className="w-5 h-5"/> 重新挑戰 (扣除 10% 總分)
                     </button>
                  </div>
                )}
                
                <div 
                  className={`bg-gray-300 p-2 rounded-xl shadow-inner inline-block touch-none ${g3State !== 'playing' ? 'opacity-30' : ''}`}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                   {g3Maze.map((row, y) => (
                     <div key={y} className="flex">
                       {row.map((cell, x) => {
                         const isSmall = g3Maze.length === 11;
                         const cellCls = isSmall ? "w-6 h-6 md:w-10 md:h-10" : "w-4 h-4 md:w-6 md:h-6";
                         return (
                           <div key={`${x}-${y}`} className={`${cellCls} flex items-center justify-center ${cell === 1 ? 'bg-slate-700 rounded-[1px]' : cell === 2 ? 'bg-blue-200' : cell === 3 ? 'bg-green-300' : 'bg-gray-100'}`}>
                             {cell === 3 && <Flag className={`${isSmall ? 'w-5 h-5' : 'w-3 h-3 md:w-4 md:h-4'} text-red-600 animate-pulse`} />}
                             {g3Pos.x === x && g3Pos.y === y && (
                                <div className={`bg-yellow-400 rounded-full ${isSmall ? 'w-5 h-5 md:w-8 md:h-8' : 'w-3 h-3 md:w-5 md:h-5'} flex items-center justify-center shadow-md z-10`}>
                                  <User className={`${isSmall ? 'w-4 h-4' : 'w-2 h-2 md:w-3 md:h-3'} text-yellow-800`} fill="currentColor"/>
                                </div>
                             )}
                             {g3GhostPos?.x === x && g3GhostPos?.y === y && (
                                <div className={`bg-purple-500/80 rounded-t-full rounded-b-md ${isSmall ? 'w-5 h-5 md:w-8 md:h-8' : 'w-3 h-3 md:w-5 md:h-5'} flex items-center justify-center shadow-lg z-10 animate-bounce`}>
                                  <Ghost className={`${isSmall ? 'w-4 h-4' : 'w-2 h-2 md:w-3 md:h-3'} text-white`} fill="currentColor"/>
                                </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   ))}
                </div>
                <p className="mt-4 text-sm font-bold text-gray-500 md:hidden">提示：請在迷宮上方滑動手指移動</p>

                <div className="mt-4 hidden md:flex flex-col items-center gap-2">
                   <button onClick={() => handleMazeMove(0, -1)} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl shadow border-b-4 border-blue-700 active:translate-y-1 active:border-b-0 transition"><ArrowUp className="w-6 h-6" /></button>
                   <div className="flex gap-2">
                     <button onClick={() => handleMazeMove(-1, 0)} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl shadow border-b-4 border-blue-700 active:translate-y-1 active:border-b-0 transition"><ArrowLeft className="w-6 h-6" /></button>
                     <button onClick={() => handleMazeMove(0, 1)} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl shadow border-b-4 border-blue-700 active:translate-y-1 active:border-b-0 transition"><ArrowDown className="w-6 h-6" /></button>
                     <button onClick={() => handleMazeMove(1, 0)} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl shadow border-b-4 border-blue-700 active:translate-y-1 active:border-b-0 transition"><ArrowRight className="w-6 h-6" /></button>
                   </div>
                </div>

              </div>
            </div>
          )}

          {/* --- Final Quiz --- */}
          {gameState === 'quiz' && (
            <div className="animate-fade-in w-full max-w-2xl mx-auto my-auto">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-blue-700 flex items-center gap-2"><Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" /> 最終魔法測驗</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 md:px-4 md:py-2 rounded-full font-bold shadow-sm border border-blue-200 text-sm md:text-base">第 {quizIndex + 1} / {questions.length} 題</span>
              </div>
              
              <div className="bg-white p-5 md:p-8 rounded-3xl shadow-lg border-b-4 border-blue-500 mb-4 md:mb-6 relative">
                <div className="absolute top-0 left-6 md:left-8 w-10 md:w-12 h-2 bg-yellow-400 rounded-b-lg"></div>
                <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-6 md:mb-8 leading-relaxed mt-2">{questions[quizIndex].q}</h3>
                
                <div className="space-y-3 md:space-y-4">
                  {questions[quizIndex].options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleQuizAnswer(idx)} 
                      disabled={quizFeedback?.type === 'success'} 
                      className="w-full text-left p-3 md:p-5 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition font-bold text-base md:text-lg text-gray-700 flex items-center gap-3 md:gap-4 disabled:opacity-50 transform hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center font-extrabold text-blue-600 text-lg md:text-xl shadow-inner shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="leading-tight">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {quizFeedback && (
                <div className={`p-3 md:p-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-md ${quizFeedback.type === 'error' ? 'bg-red-50 border-2 border-red-200 text-red-700' : 'bg-green-50 border-2 border-green-200 text-green-700'}`}>
                  {quizFeedback.type === 'error' ? <AlertCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0" /> : <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0" />}
                  <span className="font-bold text-sm md:text-lg">{quizFeedback.msg}</span>
                </div>
              )}
            </div>
          )}

          {/* --- Success & Submit Form --- */}
          {gameState === 'success' && (
            <div className="text-center space-y-4 md:space-y-6 animate-fade-in py-2 md:py-4 my-auto">
              <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-yellow-200 to-yellow-100 mb-2 border-4 border-yellow-400 relative shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                <Sparkles className="absolute -top-3 -right-3 md:-top-4 md:-right-4 text-orange-400 w-10 h-10 md:w-12 md:h-12 animate-spin-slow drop-shadow-md" />
                <Trophy className="w-12 h-12 md:w-14 md:h-14 text-yellow-600" />
              </div>
              
              <div>
                 <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">完美通關！</h2>
                 <p className="text-lg md:text-xl text-gray-700 font-bold">小探險家順利抵達目的地，感謝你的完美救援！🎉</p>
                 <div className="mt-4 inline-block bg-yellow-100 border-2 border-yellow-400 rounded-full px-6 py-2 md:px-8 md:py-3 text-xl md:text-2xl font-black text-yellow-700 shadow-md">
                   最終得分：{score.toLocaleString()} 分
                 </div>
              </div>
              
              {!submitted ? (
                <div className="bg-sky-50 p-5 md:p-8 rounded-3xl max-w-sm mx-auto border-2 border-sky-200 shadow-lg mt-6 md:mt-8 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm font-bold shadow-md whitespace-nowrap">最後一步</div>
                  <h3 className="text-lg md:text-xl font-bold text-sky-900 mb-4 flex items-center justify-center gap-2"><Send className="w-5 h-5 md:w-6 md:h-6" /> 登錄魔法成績</h3>
                  
                  <div className="space-y-4 md:space-y-5">
                    <div>
                      <label className="block text-left text-xs md:text-sm font-bold text-sky-800 mb-2 pl-2">請輸入 5 碼學號：</label>
                      <input 
                        type="text" 
                        value={studentId} 
                        onChange={(e) => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 5))} 
                        placeholder="例如：11205" 
                        maxLength={5} 
                        className="w-full text-center text-3xl md:text-4xl tracking-widest font-black py-2 md:py-3 rounded-2xl border-4 border-white focus:border-blue-400 focus:ring-4 ring-blue-100 outline-none shadow-inner bg-white/80" 
                      />
                      {studentId.length > 0 && studentId.length < 5 && (
                        <p className="text-red-500 text-xs md:text-sm font-bold mt-2 animate-pulse">長度不夠！必須剛好 5 個數字喔！</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={submitForm} 
                      disabled={studentId.length !== 5 || isSubmitting} 
                      className="w-full flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl text-lg md:text-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:grayscale transform hover:-translate-y-1 active:translate-y-0"
                    >
                      {isSubmitting ? <span className="animate-pulse">傳送中...</span> : <>確認送出成績</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-6 md:p-8 rounded-3xl max-w-sm mx-auto border-4 border-green-300 mt-6 md:mt-8 shadow-inner relative overflow-hidden animate-fade-in flex flex-col items-center">
                  <div className="absolute inset-0 bg-green-200/20 animate-pulse"></div>
                  <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500 mx-auto mb-3 md:mb-4 relative z-10" />
                  <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-2 relative z-10">🎉 傳送成功！</h3>
                  <p className="text-green-700 font-bold text-base md:text-lg leading-relaxed relative z-10 mb-4">你的成績 <strong>{score.toLocaleString()} 分</strong> 已經成功記錄。</p>
                  
                  {/* 🌟 修改 2：加入回到大廳的按鈕 */}
                  <button onClick={onBackToPortal} className="relative z-10 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
                    <MapIcon className="w-5 h-5" /> 返回遊戲大廳
                  </button>
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
        .animate-spin-slow { animation: spin-slow 5s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
}
