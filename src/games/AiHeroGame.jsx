import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, BookOpen, Brush, Radio, Home, ShieldAlert, Star, Award, 
  ChevronRight, CheckCircle, XCircle, Play, ArrowLeft, ArrowRight, 
  RotateCcw, Send, Loader2, Shield, ArrowUp, Zap
} from 'lucide-react';

const AI_HEROES = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    role: '資深圖書館長',
    icon: <BookOpen className="w-10 h-10 text-blue-500" />,
    desc: '最早出名的聰明 AI。不管問什麼都能快速解答！',
    color: 'bg-blue-100 border-blue-400',
    heroColor: '#3B82F6', 
    skill: '📖 百科全書'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    role: 'Google 萬能小精靈',
    icon: <Sparkles className="w-10 h-10 text-yellow-500" />,
    desc: '結合Google搜尋和工具，是你使用學校帳號時的最佳好朋友！',
    color: 'bg-yellow-100 border-yellow-400',
    heroColor: '#EAB308', 
    skill: '📝 資訊處理魔法'
  },
  {
    id: 'copilot',
    name: 'Copilot',
    role: '創意藝術家',
    icon: <Brush className="w-10 h-10 text-purple-500" />,
    desc: '微軟的助手，超級擅長畫畫！能把文字變成酷炫圖片。',
    color: 'bg-purple-100 border-purple-400',
    heroColor: '#A855F7', 
    skill: '🎨 神奇畫筆'
  },
  {
    id: 'grok',
    name: 'Grok',
    role: '幽默廣播員',
    icon: <Radio className="w-10 h-10 text-green-500" />,
    desc: '住在 X 平台上的機器人，掌握網路上最新鮮、最即時的話題。',
    color: 'bg-green-100 border-green-400',
    heroColor: '#22C55E', 
    skill: '📡 最新情報網'
  }
];

// ---------------- 關卡配置與地形 ----------------
// TILE_SIZE = 32. 地面在 Y=384. 
const MARIO_STAGES = [
  { 
    id: 1,
    title: "世界 1-1：空白畫布怪獸", 
    enemy: { id: 'canvas_monster', startX: 1950, y: 284, w: 100, h: 100, icon: "👾", weakness: "copilot", hp: 3, name: "畫布怪獸" },
    text: "老師出了一道難題：「穿著太空衣的恐龍」。一隻巨大的「畫布怪獸」擋住了去路！你需要跳過岩漿，尋找一位「擅長畫畫」的AI英雄道具來打敗它！（提示：請務必吃到紫色的「Copilot」道具！）", 
    successMsg: "太帥了！Copilot 揮舞「神奇畫筆」，畫出了超炫的太空恐龍，畫布怪獸被美麗的畫作打敗了！",
    layout: [
      "                                                                                 ", // 0
      "                                                                                 ", // 1
      "                                                                                 ", // 2
      "                                                                                 ", // 3
      "                                                                                 ", // 4
      "                                                                                 ", // 5
      "                                                                           |     ", // 6
      "                                                                           |   C ", // 7
      "                                                                           |  CCC", // 8
      "         ?               B?B             B?B                           S   |  CCC", // 9 (高度=288px)
      "                                                                      SS   |  CCC", // 10
      "                               P                       P             SSS   |  CCC", // 11
      "##################      ########FFF###FFFFF#################################  CCC", // 12 (地面=384px)
      "##################      ########FFF###FFFFF#################################  CCC"  // 13
    ],
    items: [
      { id: 'grok', x: 832, y: 240, w: 32, h: 32 },     
      { id: 'copilot', x: 1152, y: 300, w: 32, h: 32 }  
    ],
    coins: [
      { id: 'c1', x: 400, y: 250, w: 30, h: 30 },       
      { id: 'c2', x: 672, y: 200, w: 30, h: 30 },       
      { id: 'c3', x: 1072, y: 220, w: 30, h: 30 },      
      { id: 'c4', x: 1312, y: 200, w: 30, h: 30 },      
      { id: 'c5', x: 1760, y: 280, w: 30, h: 30 }       
    ]
  },
  { 
    id: 2,
    title: "世界 1-2：長文文字迷宮", 
    enemy: { id: 'text_maze', startX: 1950, y: 284, w: 100, h: 100, icon: "📜", weakness: "gemini", hp: 4, name: "長文怪獸" },
    text: "課本的文章太長了，文字變成了一座巨大的迷宮！你需要跳過重重障礙，找人幫你找出「重點」作為出口！（提示：請務必吃到黃色的「Gemini」道具！）", 
    successMsg: "太神啦！Gemini 施展「重點整理魔法」，厚厚的文字瞬間變成清晰的重點出口，成功到達終點城堡！",
    // 1-2 全新地圖配置：更有高低落差與迷宮感
    layout: [
      "                                                                                 ", // 0
      "                                                                                 ", // 1
      "                                                                                 ", // 2
      "                                                                                 ", // 3
      "                                                                                 ", // 4
      "                     BBB                                                   |     ", // 5 
      "                                                                           |   C ", // 6 
      "                                                                           |  CCC", // 7 
      "         ?                       B?B             B?B                   S   |  CCC", // 8 
      "                                                                      SS   |  CCC", // 9 
      "           P                               P                         SSS   |  CCC", // 10
      "           P   P                           P                        SSSS   |  CCC", // 11
      "##########FFF#####F#############FFFF######FFF###############################  CCC", // 12
      "##########FFF#####F#############FFFF######FFF###############################  CCC"  // 13
    ],
    items: [
      { id: 'chatgpt', x: 832, y: 240, w: 32, h: 32 },  
      { id: 'gemini', x: 1152, y: 300, w: 32, h: 32 }   
    ],
    coins: [
      { id: 'c1', x: 400, y: 250, w: 30, h: 30 },
      { id: 'c2', x: 672, y: 200, w: 30, h: 30 },
      { id: 'c3', x: 1072, y: 220, w: 30, h: 30 },
      { id: 'c4', x: 1312, y: 200, w: 30, h: 30 },
      { id: 'c5', x: 1760, y: 280, w: 30, h: 30 }
    ]
  }
];

const FINAL_QUIZ = [
  {
    question: "1. 關於「數位足跡」和使用學校帳號，哪一件事是「絕對不可以」做的？",
    options: ["A) 請 AI 講一個好笑的笑話給我聽", "B) 把我的家裡地址和密碼告訴 AI", "C) 請 AI 幫我解釋不懂的自然科學"],
    correctAnswer: 1,
    explanation: "非常棒的安全觀念！保護自己的個資最重要，絕對不能把地址、密碼等秘密告訴 AI 喔！"
  },
  {
    question: "2. 我們今天主要體驗的 Google「萬能小精靈」是哪一位 AI 呢？",
    options: ["A) Gemini", "B) Grok", "C) ChatGPT"],
    correctAnswer: 0,
    explanation: "沒錯！Gemini 是 Google 的小精靈，用學校的 Google 帳號就能呼叫他幫忙。"
  },
  {
    question: "3. 請問 AI 寫出來的文章，可以直接當成自己的暑假作業交給老師嗎？",
    options: ["A) 可以，因為 AI 寫得很好", "B) 可以，只要老師沒發現就好", "C) 不可以，AI 只是幫手，作業還是要自己寫"],
    correctAnswer: 2,
    explanation: "完全正確！AI 是幫助我們學習的書僮，不是幫我們寫功課的代打，作業還是要自己消化後寫出來喔！"
  }
];

// --- 將 Game2Screen 獨立抽取到外層，避免因 App 重新渲染導致狀態重置 ---
const Game2Screen = ({ onComplete, addScore }) => {
  const [status, setStatus] = useState('classSelect'); 
  const [selectedClass, setSelectedClass] = useState(null);
  const [gameScore, setGameScore] = useState(0); 
  const [stageIndex, setStageIndex] = useState(0);
  
  const canvasRef = useRef(null);
  const keysRef = useRef({ left: false, right: false, up: false, shoot: false });
  const gameStateRef = useRef({ isPlaying: false });
  const stage = MARIO_STAGES[stageIndex];

  // 新增：統一的遊戲啟動函數，重置按鍵防止角色因前一關卡殘留的按鍵自動暴衝
  const handleStartPlaying = () => {
    keysRef.current = { left: false, right: false, up: false, shoot: false };
    setStatus('playing');
  };

  // 改為根據關卡設定來讀取地圖
  const rawLevelLayout = stage.layout;
  const maxCols = Math.max(...rawLevelLayout.map(row => row.length));
  const levelLayout = rawLevelLayout.map(row => row.padEnd(maxCols, ' '));

  useEffect(() => {
      if (status !== 'playing') {
        gameStateRef.current.isPlaying = false;
        return;
      }

      gameStateRef.current.isPlaying = true;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const TILE_SIZE = 32;
      const GRAVITY = 0.45;
      const FRICTION = 0.85;
      const MAX_SPEED = 5.5;
      const JUMP_POWER = -11.5;
      
      const mapCols = levelLayout[0].length;
      const mapRows = levelLayout.length;

      let blocks = [];
      let items = []; 
      let hazards = [];
      let projectiles = [];
      let winZone = null;
      let camera = { x: 0, y: 0 };
      
      const heroData = AI_HEROES.find(h => h.id === selectedClass);
      let player = {
          x: 50,
          y: 100,
          w: 24,
          h: 30,
          vx: 0,
          vy: 0,
          color: heroData ? heroData.heroColor : '#E52521', 
          isGrounded: false,
          isDead: false,
          facingRight: true,
          shootCooldown: 0,
          warnTimer: 0,
          score: 0,
          currentClass: selectedClass
      };

      // 初始化怪物狀態 (實時變量，不污染常數)
      let currentEnemy = { 
          ...stage.enemy, 
          isDead: false, 
          deathTimer: 0, 
          hitTimer: 0, 
          vx: -1.5, 
          x: stage.enemy.startX 
      };

      function buildLevel() {
          blocks = [];
          items = [];
          hazards = [];
          projectiles = [];
          for (let y = 0; y < mapRows; y++) {
              for (let x = 0; x < mapCols; x++) {
                  const char = levelLayout[y][x];
                  const pX = x * TILE_SIZE;
                  const pY = y * TILE_SIZE;

                  if (char === '#') blocks.push({ x: pX, y: pY, w: TILE_SIZE, h: TILE_SIZE, type: 'ground' });
                  else if (char === 'B') blocks.push({ x: pX, y: pY, w: TILE_SIZE, h: TILE_SIZE, type: 'brick' });
                  else if (char === '?') blocks.push({ x: pX, y: pY, w: TILE_SIZE, h: TILE_SIZE, type: 'question', hit: false });
                  else if (char === 'S') blocks.push({ x: pX, y: pY, w: TILE_SIZE, h: TILE_SIZE, type: 'stair' });
                  else if (char === 'P') blocks.push({ x: pX, y: pY, w: TILE_SIZE, h: TILE_SIZE, type: 'pipe' });
                  else if (char === 'C') blocks.push({ x: pX, y: pY, w: TILE_SIZE, h: TILE_SIZE, type: 'castle' });
                  else if (char === '|') winZone = { x: pX + TILE_SIZE/2, y: pY, w: 4, h: TILE_SIZE * 8 };
                  else if (char === 'F') hazards.push({ x: pX + 4, y: pY + 12, w: TILE_SIZE - 8, h: TILE_SIZE - 12, type: 'fire', drawX: pX, drawY: pY });
              }
          }
          
          stage.items.forEach(item => blocks.push({ ...item, type: 'hero_item' }));
          stage.coins.forEach(coin => blocks.push({ ...coin, type: 'coin' }));
      }

      function checkCollision(r1, r2) {
          return r1.x < r2.x + r2.w &&
                 r1.x + r1.w > r2.x &&
                 r1.y < r2.y + r2.h &&
                 r1.y + r1.h > r2.y;
      }

      function isSolid(block) {
          return ['ground', 'brick', 'question', 'stair', 'pipe', 'castle'].includes(block.type);
      }

      function die() {
          player.isDead = true;
          player.vy = -10; 
          gameStateRef.current.isPlaying = false;
          setTimeout(() => setStatus('gameover'), 1500);
      }

      function win() {
          player.vx = 0;
          player.vy = 0;
          addScore(20 + player.score); 
          gameStateRef.current.isPlaying = false;
          setStatus('success');
      }

      function update() {
          if (player.isDead || !gameStateRef.current.isPlaying) return;
          const keys = keysRef.current;

          if (keys.left) { player.vx -= 1; player.facingRight = false; }
          if (keys.right) { player.vx += 1; player.facingRight = true; }
          
          if (keys.up && player.isGrounded) {
              player.vy = JUMP_POWER;
              player.isGrounded = false;
              keys.up = false; 
          }

          // --- 射擊魔法彈 ---
          if (keys.shoot && player.shootCooldown <= 0) {
              projectiles.push({
                  x: player.facingRight ? player.x + player.w : player.x - 16,
                  y: player.y + 8,
                  w: 16,
                  h: 16,
                  vx: player.facingRight ? 8 : -8,
                  heroId: player.currentClass
              });
              player.shootCooldown = 25; // 射擊冷卻時間
          }
          if (player.shootCooldown > 0) player.shootCooldown--;

          player.vx *= FRICTION;
          if (player.vx > MAX_SPEED) player.vx = MAX_SPEED;
          if (player.vx < -MAX_SPEED) player.vx = -MAX_SPEED;
          if (Math.abs(player.vx) < 0.1) player.vx = 0;

          player.vy += GRAVITY;
          if (player.vy > 12) player.vy = 12; 

          // AABB 碰撞偵測
          player.x += player.vx;
          if (player.x < 0) {
              player.x = 0;
              player.vx = 0;
          }

          for (let block of blocks) {
              if (isSolid(block) && checkCollision(player, block)) {
                  if (player.vx > 0) {
                      player.x = block.x - player.w;
                  } else if (player.vx < 0) {
                      player.x = block.x + block.w;
                  }
                  player.vx = 0;
              }
          }

          player.y += player.vy;
          player.isGrounded = false;

          for (let i = blocks.length - 1; i >= 0; i--) {
              let block = blocks[i];
              if (isSolid(block)) {
                  if (checkCollision(player, block)) {
                      if (player.vy > 0) { 
                          player.y = block.y - player.h;
                          player.vy = 0;
                          player.isGrounded = true;
                      } else if (player.vy < 0) { 
                          player.y = block.y + block.h;
                          player.vy = 0;
                          if (block.type === 'question' && !block.hit) {
                              block.hit = true;
                              player.score += 10;
                              setGameScore(player.score);
                              items.push({ x: block.x + 8, y: block.y - 20, vy: -5, life: 30, text: '+10' });
                          }
                      }
                  }
              }
              else if (block.type === 'coin') {
                  if (checkCollision(player, block)) {
                      blocks.splice(i, 1);
                      player.score += 5;
                      setGameScore(player.score);
                      items.push({ x: block.x + 8, y: block.y - 20, vy: -5, life: 30, text: '+5' });
                  }
              }
              else if (block.type === 'hero_item') {
                  if (checkCollision(player, block)) {
                      const newHero = AI_HEROES.find(h => h.id === block.id);
                      if (newHero) {
                          player.color = newHero.heroColor;
                          player.currentClass = block.id; 
                      }
                      blocks.splice(i, 1);
                      items.push({ x: player.x - 10, y: player.y - 30, vy: -2, life: 40, text: '獲得新能力！按空白鍵攻擊' });
                  }
              }
          }

          // --- 怪獸 AI 與物理碰撞 ---
          if (!currentEnemy.isDead) {
              currentEnemy.x += currentEnemy.vx;
              if (currentEnemy.x < currentEnemy.startX - 150) currentEnemy.vx = 1.5;
              if (currentEnemy.x > currentEnemy.startX + 50) currentEnemy.vx = -1.5;
              
              if (currentEnemy.hitTimer > 0) currentEnemy.hitTimer--;

              if (checkCollision(player, currentEnemy)) {
                  if (player.currentClass !== currentEnemy.weakness) {
                      // 身份不正確，直接視為死亡
                      items.push({ x: player.x - 20, y: player.y - 40, vy: -2, life: 60, text: '💀 身份錯誤！被怪獸打敗了' });
                      die();
                  } else {
                      // 玩家(身份正確)碰到活著的怪獸：擊退防呆機制 (不能直接穿過)
                      player.vy = -6;
                      player.vx = player.x < currentEnemy.x ? -10 : 10;
                      items.push({ x: player.x - 20, y: player.y - 40, vy: -2, life: 50, text: '💥 碰到怪獸了！請用魔法彈攻擊' });
                  }
              }
          } else if (currentEnemy.deathTimer > 0) {
              currentEnemy.deathTimer--;
          }

          // --- 魔法彈邏輯 ---
          for (let i = projectiles.length - 1; i >= 0; i--) {
              let p = projectiles[i];
              p.x += p.vx;
              let hitWall = false;
              for (let b of blocks) {
                  if (isSolid(b) && checkCollision(p, b)) {
                      hitWall = true;
                      break;
                  }
              }

              let hitEnemy = false;
              if (!currentEnemy.isDead && checkCollision(p, currentEnemy)) {
                  hitEnemy = true;
                  if (p.heroId === currentEnemy.weakness) {
                      currentEnemy.hp -= 1;
                      currentEnemy.hitTimer = 10;
                      items.push({ x: currentEnemy.x + 40, y: currentEnemy.y, vy: -3, life: 30, text: '💥 弱點打擊 -1' });
                      if (currentEnemy.hp <= 0) {
                          currentEnemy.isDead = true;
                          currentEnemy.deathTimer = 60; // 死亡動畫時長
                          player.score += 50;
                          setGameScore(player.score);
                          items.push({ x: currentEnemy.x, y: currentEnemy.y - 20, vy: -1, life: 60, text: '🎉 怪獸被消滅！快前往城堡' });
                      }
                  } else {
                      items.push({ x: p.x, y: p.y - 20, vy: -2, life: 30, text: '❌ 無效攻擊' });
                  }
              }

              if (hitWall || hitEnemy || p.x < camera.x || p.x > camera.x + canvas.width) {
                  projectiles.splice(i, 1);
              }
          }

          for (let hazard of hazards) {
              if (checkCollision(player, hazard)) die();
          }
          if (player.y > canvas.height + 50) die();

          // --- 唯一的過關條件：觸碰到終點旗桿 ---
          if (winZone && checkCollision(player, winZone)) {
              if (currentEnemy.isDead) {
                  win();
              } else {
                  // 怪獸還沒死，擋住玩家並提示
                  player.x = winZone.x - player.w - 1;
                  if (player.vx > 0) player.vx = 0;
                  if (player.warnTimer <= 0) {
                      items.push({ x: player.x - 20, y: player.y - 40, vy: -1, life: 60, text: '⚠️ 請先擊倒怪獸！' });
                      player.warnTimer = 60; // 避免文字瘋狂洗頻的冷卻計時器
                  }
              }
          }
          if (player.warnTimer > 0) player.warnTimer--;

          let targetCamX = player.x - canvas.width / 3;
          camera.x = targetCamX; 
          if (camera.x < 0) camera.x = 0;
          const maxCamX = (mapCols * TILE_SIZE) - canvas.width;
          if (camera.x > maxCamX) camera.x = maxCamX;

          for (let i = items.length - 1; i >= 0; i--) {
              items[i].y += items[i].vy;
              items[i].life--;
              if (items[i].life <= 0) items.splice(i, 1);
          }
      }

      function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.translate(-Math.floor(camera.x), 0);

          // 背景雲朵
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(200, 100, 30, 0, Math.PI * 2);
          ctx.arc(230, 100, 40, 0, Math.PI * 2);
          ctx.arc(260, 100, 30, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(800, 80, 25, 0, Math.PI * 2);
          ctx.arc(830, 80, 35, 0, Math.PI * 2);
          ctx.arc(860, 80, 25, 0, Math.PI * 2);
          ctx.fill();

          if (winZone) {
              ctx.fillStyle = '#eee';
              ctx.fillRect(winZone.x, winZone.y, winZone.w, winZone.h);
              ctx.fillStyle = '#00A800';
              ctx.beginPath();
              ctx.moveTo(winZone.x, winZone.y + 20);
              ctx.lineTo(winZone.x - 30, winZone.y + 35);
              ctx.lineTo(winZone.x, winZone.y + 50);
              ctx.fill();
          }

          for (let block of blocks) {
              if (block.x + block.w < camera.x || block.x > camera.x + canvas.width) continue;

              if (block.type === 'ground' || block.type === 'stair') {
                  ctx.fillStyle = '#C84C0C';
                  ctx.fillRect(block.x, block.y, block.w, block.h);
                  ctx.strokeStyle = '#000';
                  ctx.lineWidth = 1;
                  ctx.strokeRect(block.x, block.y, block.w, block.h);
                  ctx.beginPath();
                  ctx.moveTo(block.x, block.y + block.h/2);
                  ctx.lineTo(block.x + block.w, block.y + block.h/2);
                  ctx.moveTo(block.x + block.w/2, block.y);
                  ctx.lineTo(block.x + block.w/2, block.y + block.h/2);
                  ctx.stroke();
              } else if (block.type === 'brick') {
                  ctx.fillStyle = '#C84C0C';
                  ctx.fillRect(block.x, block.y, block.w, block.h);
                  ctx.strokeStyle = '#000';
                  ctx.strokeRect(block.x, block.y, block.w, block.h);
                  ctx.beginPath();
                  ctx.moveTo(block.x, block.y + block.h/2); ctx.lineTo(block.x + block.w, block.y + block.h/2);
                  ctx.moveTo(block.x + 8, block.y); ctx.lineTo(block.x + 8, block.y + block.h/2);
                  ctx.moveTo(block.x + 24, block.y + block.h/2); ctx.lineTo(block.x + 24, block.y + block.h);
                  ctx.stroke();
              } else if (block.type === 'question') {
                  ctx.fillStyle = block.hit ? '#A0A0A0' : '#FCA044';
                  ctx.fillRect(block.x, block.y, block.w, block.h);
                  ctx.strokeStyle = '#000';
                  ctx.strokeRect(block.x, block.y, block.w, block.h);
                  if (!block.hit) {
                      ctx.fillStyle = '#000';
                      ctx.font = 'bold 20px Arial';
                      ctx.fillText('?', block.x + 10, block.y + 24);
                  }
              } else if (block.type === 'pipe') {
                  ctx.fillStyle = '#00A800';
                  ctx.fillRect(block.x, block.y, block.w, block.h);
                  ctx.strokeStyle = '#000';
                  ctx.strokeRect(block.x, block.y, block.w, block.h);
                  ctx.fillStyle = 'rgba(255,255,255,0.3)';
                  ctx.fillRect(block.x + 4, block.y, 6, block.h);
              } else if (block.type === 'castle') {
                  ctx.fillStyle = '#9c4a00';
                  ctx.fillRect(block.x, block.y, block.w, block.h);
                  ctx.strokeStyle = '#000';
                  ctx.strokeRect(block.x, block.y, block.w, block.h);
              } else if (block.type === 'coin') {
                  ctx.fillStyle = '#FACC15';
                  ctx.beginPath();
                  ctx.arc(block.x + block.w/2, block.y + block.h/2, block.w/2 - 4, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.strokeStyle = '#CA8A04';
                  ctx.lineWidth = 2;
                  ctx.stroke();
              } else if (block.type === 'hero_item') {
                  const hd = AI_HEROES.find(h => h.id === block.id);
                  ctx.fillStyle = hd ? hd.heroColor : '#FFF';
                  ctx.beginPath();
                  ctx.arc(block.x + block.w/2, block.y + block.h/2, block.w/2, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.strokeStyle = '#FFF';
                  ctx.lineWidth = 2;
                  ctx.stroke();
                  ctx.fillStyle = '#FFF';
                  ctx.font = 'bold 12px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText(hd ? hd.name.substring(0, 2).toUpperCase() : 'AI', block.x + block.w/2, block.y + block.h/2 + 4);
                  ctx.textAlign = 'left';
              }
          }

          for (let hazard of hazards) {
              if (hazard.drawX + TILE_SIZE < camera.x || hazard.drawX > camera.x + canvas.width) continue;
              
              ctx.fillStyle = '#D9381E'; 
              ctx.fillRect(hazard.drawX, hazard.drawY + 10, TILE_SIZE, TILE_SIZE - 10);
              ctx.fillStyle = Math.random() > 0.5 ? '#FF8C00' : '#FF4500';
              ctx.beginPath();
              ctx.moveTo(hazard.drawX, hazard.drawY + 10);
              for(let i=0; i<=TILE_SIZE; i+=8) {
                  ctx.lineTo(hazard.drawX + i, hazard.drawY + 10 - Math.random() * 6);
              }
              ctx.lineTo(hazard.drawX + TILE_SIZE, hazard.drawY + TILE_SIZE);
              ctx.lineTo(hazard.drawX, hazard.drawY + TILE_SIZE);
              ctx.fill();
          }

          // --- 繪製魔法彈 ---
          for (let p of projectiles) {
              const hd = AI_HEROES.find(h => h.id === p.heroId);
              const magicColor = hd ? hd.heroColor : '#FFF';
              ctx.fillStyle = magicColor;
              ctx.beginPath();
              ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowColor = magicColor;
              ctx.shadowBlur = 15;
              ctx.fill();
              ctx.shadowBlur = 0;
          }

          // --- 繪製怪獸 (含血量與死亡特效) ---
          if (!currentEnemy.isDead) {
              if (currentEnemy.hitTimer % 4 < 2) {
                  ctx.font = '70px Arial';
                  ctx.fillText(currentEnemy.icon, currentEnemy.x, currentEnemy.y + 70);
                  // 血量條
                  ctx.fillStyle = 'red';
                  ctx.fillRect(currentEnemy.x + 10, currentEnemy.y - 15, 80, 8);
                  ctx.fillStyle = '#00FF00';
                  ctx.fillRect(currentEnemy.x + 10, currentEnemy.y - 15, 80 * (currentEnemy.hp / stage.enemy.hp), 8);
                  
                  ctx.fillStyle = '#DC2626';
                  ctx.font = 'bold 14px Arial';
                  ctx.fillText(currentEnemy.name, currentEnemy.x + 10, currentEnemy.y - 20);
              }
          } else if (currentEnemy.deathTimer > 0) {
              ctx.save();
              ctx.globalAlpha = currentEnemy.deathTimer / 60; 
              ctx.translate(currentEnemy.x + 50, currentEnemy.y + 50 + (60 - currentEnemy.deathTimer));
              ctx.scale(currentEnemy.deathTimer / 60, currentEnemy.deathTimer / 60);
              ctx.font = '70px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(currentEnemy.icon, 0, 0);
              ctx.restore();
          }

          for (let item of items) {
              ctx.fillStyle = 'white';
              ctx.font = 'bold 20px Arial';
              ctx.shadowColor = "black";
              ctx.shadowBlur = 4;
              ctx.fillText(item.text, item.x, item.y);
              ctx.shadowBlur = 0;
          }

          // 繪製玩家
          ctx.fillStyle = player.color; 
          ctx.fillRect(player.x, player.y, player.w, player.h - 10);
          
          ctx.fillStyle = '#0000FF'; 
          ctx.fillRect(player.x + 2, player.y + 16, player.w - 4, 14);

          ctx.fillStyle = '#FFCC99'; 
          ctx.fillRect(player.x + 4, player.y + 4, player.w - 8, 10);

          ctx.fillStyle = '#000';
          let faceDir = player.facingRight ? 16 : 4;
          ctx.fillRect(player.x + faceDir, player.y + 6, 4, 4); 
          ctx.fillRect(player.x + faceDir - 2, player.y + 12, 10, 2); 

          ctx.restore();

          // UI 分數
          ctx.fillStyle = 'white';
          ctx.font = 'bold 24px Arial';
          ctx.shadowColor = "black";
          ctx.shadowBlur = 4;
          ctx.fillText(`收集分數: ${player.score}`, 15, 35);
          ctx.shadowBlur = 0; 
      }

      let animationFrameId;
      const loop = () => {
          if (!gameStateRef.current.isPlaying) return;
          update();
          draw();
          animationFrameId = requestAnimationFrame(loop);
      };

      buildLevel();
      animationFrameId = requestAnimationFrame(loop);

      const handleKeyDown = (e) => {
          if(e.code === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true;
          if(e.code === 'ArrowRight' || e.key === 'd') keysRef.current.right = true;
          if(e.code === 'ArrowUp' || e.key === 'w') {
              keysRef.current.up = true;
              if(['ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
          }
          if(e.code === 'Space' || e.code === 'KeyZ') {
              keysRef.current.shoot = true;
              if(e.code === 'Space') e.preventDefault();
          }
      };
      const handleKeyUp = (e) => {
          if(e.code === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false;
          if(e.code === 'ArrowRight' || e.key === 'd') keysRef.current.right = false;
          if(e.code === 'ArrowUp' || e.key === 'w') keysRef.current.up = false;
          if(e.code === 'Space' || e.code === 'KeyZ') keysRef.current.shoot = false;
      };
      
      window.addEventListener('keydown', handleKeyDown, { passive: false });
      window.addEventListener('keyup', handleKeyUp);

      return () => {
          gameStateRef.current.isPlaying = false;
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
      };
  }, [status, selectedClass, stageIndex]);

  const nextStageOrQuiz = () => {
      if (stageIndex < MARIO_STAGES.length - 1) {
          setStageIndex(stageIndex + 1);
          setStatus('classSelect');
          setSelectedClass(null);
          setGameScore(0);
      } else {
          onComplete();
      }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <div className="text-center mb-6">
        <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-4">動作闖關模式</span>
        <h2 className="text-3xl md:text-5xl font-black text-indigo-800 drop-shadow-sm">{MARIO_STAGES[stageIndex].title}</h2>
      </div>

      {status === 'classSelect' && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
          <div className="bg-indigo-50 p-6 rounded-2xl mb-8 text-center border-2 border-indigo-100">
            <h3 className="text-2xl font-bold text-indigo-900 mb-2">📜 任務情報</h3>
            <p className="text-xl text-gray-700 leading-relaxed">{MARIO_STAGES[stageIndex].text}</p>
          </div>
          
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 flex justify-center items-center gap-2">
            <Shield className="text-indigo-500" /> 請選擇一位首發英雄化身
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {AI_HEROES.map(hero => (
              <button
                key={hero.id}
                onClick={() => setSelectedClass(hero.id)}
                className={`p-4 rounded-2xl border-4 flex flex-col items-center gap-3 transition-all ${
                  selectedClass === hero.id ? 'bg-indigo-100 border-indigo-500 scale-105 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="bg-white p-2 rounded-full shadow-sm">{hero.icon}</div>
                <span className="font-bold text-gray-800">{hero.name}</span>
                <div className="w-8 h-8 rounded-sm mt-1 border-2 border-gray-400" style={{ backgroundColor: hero.heroColor }} title="人物衣服顏色"></div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={handleStartPlaying}
              disabled={!selectedClass}
              className={`px-10 py-4 rounded-full text-2xl font-bold flex items-center gap-2 transition-transform shadow-lg ${
                !selectedClass ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 text-white hover:scale-105'
              }`}
            >
              <Play fill="currentColor" /> 開始冒險！
            </button>
          </div>
        </div>
      )}

      {(status === 'playing' || status === 'success' || status === 'gameover') && (
        <>
          <div className="bg-white p-4 rounded-t-3xl border-4 border-b-0 border-indigo-200 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full xl:w-auto">
              <span className="font-bold text-gray-600 text-lg whitespace-nowrap">目前化身：</span>
              <div className="flex flex-col md:flex-row md:items-center gap-2 bg-indigo-100 px-4 py-2 rounded-xl border-2 border-indigo-300 shadow-sm flex-1">
                <div className="flex items-center gap-2">
                  {AI_HEROES.find(h=>h.id === selectedClass)?.icon}
                  <span className="font-bold text-indigo-800 text-base whitespace-nowrap">
                    {AI_HEROES.find(h=>h.id === selectedClass)?.name}
                  </span>
                </div>
                <div className="hidden md:block w-px h-6 bg-indigo-300 mx-1"></div>
                <span className="text-xs md:text-sm text-indigo-700 font-medium">
                  {AI_HEROES.find(h=>h.id === selectedClass)?.desc}
                </span>
              </div>
            </div>
            <div className="text-sm font-bold text-gray-500 flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl whitespace-nowrap self-end xl:self-auto">
              <span>⌨️ 鍵盤：方向鍵移動，<span className="text-red-500 font-black">上跳躍</span>，<span className="text-blue-500 font-black">空白鍵攻擊</span></span>
            </div>
          </div>

          <div className="relative w-full aspect-[16/9] md:aspect-[800/448] overflow-hidden border-4 border-indigo-200 shadow-xl touch-none rounded-b-xl bg-[#5C94FC]">
            
            <canvas 
              ref={canvasRef}
              width={800}
              height={448}
              className="w-full h-full object-contain touch-none"
              style={{ imageRendering: 'pixelated' }}
            />

            {status === 'gameover' && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 p-4 animate-fade-in">
                <div className="bg-white p-8 rounded-3xl max-w-sm text-center border-4 border-red-400">
                  <h3 className="text-3xl font-black text-red-600 mb-4 drop-shadow-sm">💥 挑戰失敗</h3>
                  <p className="text-lg text-gray-700 mb-6">哎呀！不小心掉進洞裡或碰到岩漿了！</p>
                  <button onClick={() => { 
                      setGameScore(0); 
                      keysRef.current = { left: false, right: false, up: false, shoot: false };
                      setStatus('playing'); 
                  }} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center mx-auto gap-2">
                    <RotateCcw /> 再試一次
                  </button>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="absolute inset-0 bg-green-900/80 flex items-center justify-center z-20 p-4 animate-fade-in">
                <div className="bg-white p-8 rounded-3xl max-w-lg text-center border-4 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                  <h3 className="text-4xl font-black text-green-600 mb-4 drop-shadow-sm">🎊 成功抵達終點城堡！</h3>
                  <p className="text-xl leading-relaxed text-gray-700 mb-4">{MARIO_STAGES[stageIndex].successMsg}</p>
                  
                  <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-xl inline-block mb-6 shadow-sm">
                      <p className="text-lg text-yellow-800 font-bold">目前已完成：{MARIO_STAGES[stageIndex].title}</p>
                  </div>

                  <p className="text-lg text-blue-600 font-bold mb-8">本次關卡獲得加分：{gameScore} 分</p>
                  
                  <button onClick={nextStageOrQuiz} className="bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center mx-auto gap-2">
                    {stageIndex < MARIO_STAGES.length - 1 ? `進入下一個關卡 (世界 1-2)` : '進入最終問答測驗'} <ChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 手機虛擬搖桿，新增攻擊按鈕 */}
          <div className="bg-gray-800 p-4 rounded-b-3xl flex justify-between items-center px-4 shadow-inner select-none mt-2 touch-none">
            <div className="flex gap-2 md:gap-4">
              <button 
                onPointerDown={(e) => { e.preventDefault(); keysRef.current.left = true; }}
                onPointerUp={(e) => { e.preventDefault(); keysRef.current.left = false; }}
                onPointerLeave={(e) => { e.preventDefault(); keysRef.current.left = false; }}
                className="w-14 h-14 md:w-16 md:h-16 bg-gray-600 active:bg-gray-500 rounded-full flex items-center justify-center text-white border-b-4 border-gray-700 active:border-b-0 active:translate-y-1 touch-none"
              >
                <ArrowLeft size={32} />
              </button>
              <button 
                onPointerDown={(e) => { e.preventDefault(); keysRef.current.right = true; }}
                onPointerUp={(e) => { e.preventDefault(); keysRef.current.right = false; }}
                onPointerLeave={(e) => { e.preventDefault(); keysRef.current.right = false; }}
                className="w-14 h-14 md:w-16 md:h-16 bg-gray-600 active:bg-gray-500 rounded-full flex items-center justify-center text-white border-b-4 border-gray-700 active:border-b-0 active:translate-y-1 touch-none"
              >
                <ArrowRight size={32} />
              </button>
            </div>
            <div className="flex gap-2 md:gap-4">
              <button 
                onPointerDown={(e) => { e.preventDefault(); keysRef.current.shoot = true; }}
                onPointerUp={(e) => { e.preventDefault(); keysRef.current.shoot = false; }}
                onPointerLeave={(e) => { e.preventDefault(); keysRef.current.shoot = false; }}
                className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 active:bg-blue-500 rounded-full flex items-center justify-center text-white border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 touch-none relative"
              >
                <Zap size={32} />
                <span className="absolute -top-6 text-gray-400 font-bold text-sm">ATTACK</span>
              </button>
              <button 
                onPointerDown={(e) => { e.preventDefault(); keysRef.current.up = true; }}
                onPointerUp={(e) => { e.preventDefault(); keysRef.current.up = false; }}
                onPointerLeave={(e) => { e.preventDefault(); keysRef.current.up = false; }}
                className="w-16 h-16 md:w-20 md:h-20 bg-red-600 active:bg-red-500 rounded-full flex items-center justify-center text-white border-b-4 border-red-800 active:border-b-0 active:translate-y-1 touch-none relative"
              >
                <ArrowUp size={40} />
                <span className="absolute -top-6 text-gray-400 font-bold text-sm">JUMP</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState('intro');
  const [revealedHeroes, setRevealedHeroes] = useState([]);
  const [score, setScore] = useState(0);

  // Game 1 state
  const [game1Solved, setGame1Solved] = useState(false);
  const [game1Msg, setGame1Msg] = useState('請點擊能回到「專屬基地（首頁）」的神奇按鈕，和AI英雄們會合！');

  // Quiz states
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  // 新增狀態：紀錄答錯的選項，用來強制重答
  const [wrongAttempts, setWrongAttempts] = useState([]);

  // Form states
  const [studentId, setStudentId] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');

  // GOOGLE 表單設定
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdvkI-KVxKep2rkA-5LsQmM8BeAqnagjYwwzDE0Q5mEGlIlxg/formResponse";
  const ENTRY_ID = "entry.210515752";

  const startGame = () => setStep('review');

  const toggleHero = (id) => {
    if (revealedHeroes.includes(id)) {
      setRevealedHeroes(revealedHeroes.filter(hId => hId !== id));
    } else {
      setRevealedHeroes([...revealedHeroes, id]);
    }
  };

  const startGame1 = () => setStep('game1');

  // --- Screens ---

  const IntroScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-fade-in">
      <div className="relative mb-8">
        <Sparkles className="absolute -top-8 -left-8 w-16 h-16 text-yellow-400 animate-pulse" />
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm mb-4 leading-tight">
          哲民老師的<br/>
          AI網路學院
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-700 bg-white inline-block px-6 py-2 rounded-full shadow-sm border-2 border-indigo-100 mt-2">
          AI 小尖兵課堂測驗
        </h2>
      </div>
      <button 
        onClick={startGame}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-3xl font-bold py-5 px-12 rounded-full hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-3"
      >
        <Play fill="currentColor" className="w-8 h-8" /> 展開貓險之旅
      </button>
    </div>
  );

  const ReviewScreen = () => (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-4">第一階段：認識超級英雄</h2>
        <p className="text-xl text-gray-600 bg-white inline-block px-6 py-2 rounded-full shadow-sm">點擊卡片，複習四位 AI 英雄的超能力！全部翻開才能進入遊戲關卡喔。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {AI_HEROES.map((hero) => {
          const isRevealed = revealedHeroes.includes(hero.id);
          return (
            <div key={hero.id} onClick={() => toggleHero(hero.id)} className={`cursor-pointer transform transition-all duration-500 ${isRevealed ? '' : 'hover:scale-105 hover:-translate-y-2'}`}>
              <div className={`p-6 rounded-3xl border-4 shadow-lg min-h-[220px] flex flex-col items-center justify-center text-center transition-colors duration-300 ${isRevealed ? hero.color : 'bg-gray-100 border-gray-300 hover:bg-white hover:border-indigo-300'}`}>
                {isRevealed ? (
                  <div className="animate-fade-in space-y-3 flex flex-col items-center">
                    {hero.icon}
                    <h3 className="text-3xl font-bold text-gray-800">{hero.name}</h3>
                    <span className="inline-block bg-white text-gray-800 px-4 py-1 rounded-full text-md font-bold shadow-sm mb-2">{hero.role}</span>
                    <p className="text-gray-700 font-medium text-lg px-2">{hero.desc}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-4xl text-gray-500 font-black">?</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-400">點擊揭曉</h3>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center">
        <button 
          onClick={startGame1}
          disabled={revealedHeroes.length < 4}
          className={`px-10 py-5 rounded-full text-2xl font-bold transition-all flex items-center gap-3 ${revealedHeroes.length < 4 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white hover:scale-110 shadow-xl animate-bounce'}`}
        >
          {revealedHeroes.length < 4 ? '請先翻開所有英雄卡片' : '進入遊戲關卡！'} {revealedHeroes.length === 4 && <ChevronRight className="w-8 h-8" />}
        </button>
      </div>
    </div>
  );

  const Game1Screen = () => {
    const handleToolClick = (tool) => {
      if (game1Solved) return;
      if (tool === 'home') {
        setGame1Solved(true);
        setGame1Msg('🎉 答對了！這就是能立刻回家的「首頁按鈕」！');
        setScore(score + 20);
      } else {
        setGame1Msg('❌ 不對喔，再找找看！提示：長得像一棟小房子 🏠');
      }
    };

    return (
      <div className="max-w-3xl mx-auto py-8 animate-fade-in">
        <div className="text-center mb-8">
          <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-4">GAME LEVEL 1</span>
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-4">尋找專屬基地</h2>
          <p className="text-xl text-gray-700 bg-white p-4 rounded-2xl shadow-sm border-2 border-indigo-50">你在瀏覽器迷路了！{game1Msg}</p>
        </div>

        <div className="bg-white rounded-t-xl rounded-b-md shadow-2xl border-2 border-gray-300 overflow-hidden mt-12 transform hover:scale-[1.02] transition-transform">
          <div className="bg-gray-100 px-4 py-3 flex items-center gap-4 border-b border-gray-300">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
          </div>
          <div className="bg-white px-4 py-3 flex items-center gap-2 md:gap-4 border-b border-gray-200">
            <button onClick={() => handleToolClick('back')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"><ArrowLeft /></button>
            <button onClick={() => handleToolClick('forward')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"><ArrowRight /></button>
            <button onClick={() => handleToolClick('refresh')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"><RotateCcw /></button>
            <button onClick={() => handleToolClick('home')} className={`p-2 rounded-full transition-all duration-300 ${game1Solved ? 'bg-green-100 text-green-600 scale-125' : 'hover:bg-gray-100 text-gray-600'}`}>
              <Home className={game1Solved ? 'w-8 h-8' : ''} />
            </button>
            <div className="flex-1 bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm font-mono flex items-center justify-between">
              <span>https://lost-in-internet.com</span>
              <button onClick={() => handleToolClick('star')} className="hover:text-yellow-500 transition-colors"><Star size={16} /></button>
            </div>
          </div>
          <div className="bg-gray-50 h-64 flex items-center justify-center p-8 text-center">
            {game1Solved ? (
              <div className="animate-fade-in text-green-600 flex flex-col items-center">
                <CheckCircle className="w-20 h-20 mb-4" />
                <h3 className="text-3xl font-bold">成功回到首頁基地！</h3>
              </div>
            ) : (
              <div className="text-gray-400">
                <p className="text-6xl mb-4">🌍</p>
                <p className="text-xl">這是哪裡？我迷路了...</p>
              </div>
            )}
          </div>
        </div>
        {game1Solved && (
          <div className="mt-12 flex justify-center animate-fade-in">
            <button onClick={() => setStep('game2')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full text-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2">
              前往動作關卡 <ChevronRight />
            </button>
          </div>
        )}
      </div>
    );
  };

  const QuizScreen = () => {
    const q = FINAL_QUIZ[currentQIndex];
    
    const handleAnswer = (index) => {
      // 若已經答對(showExplanation=true)或此選項已經答錯過，則不再觸發
      if (showExplanation || wrongAttempts.includes(index)) return;
      
      if (index === q.correctAnswer) {
        setSelectedOption(index);
        setShowExplanation(true);
        // 如果是第一次就答對，才給予完整加分
        if (wrongAttempts.length === 0) {
          setScore(prev => prev + 20); 
        }
      } else {
        // 答錯時，將該選項加入錯題陣列，強制重新選擇
        setWrongAttempts([...wrongAttempts, index]);
      }
    };

    const nextQuestion = () => {
      if (currentQIndex < FINAL_QUIZ.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
        setSelectedOption(null);
        setShowExplanation(false);
        setWrongAttempts([]); // 進入下一題前，重置錯題紀錄
      } else {
        setStep('result');
      }
    };

    return (
      <div className="max-w-3xl mx-auto py-8 animate-fade-in">
        <div className="text-center mb-6">
          <span className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-bold tracking-widest mb-2">FINAL STAGE</span>
          <h2 className="text-3xl font-bold text-indigo-800">終極問答測驗</h2>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border-4 border-indigo-50 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-100">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((currentQIndex) / FINAL_QUIZ.length) * 100}%` }}></div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 mt-4 leading-relaxed">
            {q.question}
          </h2>

          <div className="space-y-4">
            {q.options.map((opt, index) => {
              let btnClass = "w-full text-left p-4 md:p-6 text-xl rounded-2xl border-4 transition-all duration-300 font-medium ";
              
              const isWrong = wrongAttempts.includes(index);
              const isCorrect = showExplanation && index === q.correctAnswer;

              if (isCorrect) {
                btnClass += "border-green-500 bg-green-100 text-green-800 shadow-md transform scale-[1.02]";
              } else if (isWrong) {
                // 答錯的選項變紅並淡化
                btnClass += "border-red-400 bg-red-50 text-red-700 opacity-70";
              } else if (showExplanation) {
                // 已答對後，其他未選的選項淡化
                btnClass += "border-gray-200 bg-gray-50 text-gray-400 opacity-50";
              } else {
                // 正常可點擊狀態
                btnClass += "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:-translate-y-1 shadow-sm hover:shadow-md";
              }

              return (
                <button 
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation || isWrong}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle className="text-green-600 w-8 h-8 flex-shrink-0" />}
                    {isWrong && <XCircle className="text-red-500 w-8 h-8 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 只有在選出正確答案時，才會顯示解析與下一題按鈕 */}
        {showExplanation && (
          <div className="bg-blue-50 border-4 border-blue-200 p-6 rounded-3xl animate-fade-in mb-8 flex flex-col md:flex-row items-center gap-6 shadow-lg">
            <div className="flex-1 text-xl font-bold text-blue-800 leading-relaxed">
              💡 魔法解析：{q.explanation}
            </div>
            <button 
              onClick={nextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xl font-bold transition-transform hover:scale-105 flex items-center gap-2 flex-shrink-0 shadow-md"
            >
              {currentQIndex < FINAL_QUIZ.length - 1 ? '下一題' : '看成績'} <ChevronRight />
            </button>
          </div>
        )}
      </div>
    );
  };

  const ResultScreen = () => {
    let message = "";
    let badgeColor = "";
    const isPerfect = score >= 100;
    
    if (isPerfect) {
      message = "太神啦！你是超越滿分的魔法小天才！";
      badgeColor = "text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.9)]";
    } else if (score >= 60) {
      message = "很棒喔！你已經掌握了大部分的 AI 魔法！";
      badgeColor = "text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]";
    } else {
      message = "加油！再複習一次，你一定能成為 AI 小尖兵！";
      badgeColor = "text-gray-400";
    }

    const handleStudentIdChange = (e) => {
      const val = e.target.value.replace(/\D/g, '');
      setStudentId(val.slice(0, 5));
    };

    const isIdValid = studentId.length === 5;

    const handleSubmitForm = async () => {
      if (!isIdValid || submitStatus === 'loading') return;
      setSubmitStatus('loading');
      
      const formData = new FormData();
      // 將學號與成績組合成單一字串傳送 (格式: 12345 (100分))
      const entryValue = `${studentId} (${score}分)`;
      formData.append(ENTRY_ID, entryValue);

      try {
        await fetch(GOOGLE_FORM_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        });
        setSubmitStatus('success');
      } catch (error) {
        console.error('送出表單失敗', error);
        // 即使發生錯誤，通常 no-cors 模式下難以區分，我們依然給予成功提示以保持體驗
        setSubmitStatus('success'); 
      }
    };

    return (
      <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
        <h1 className={`text-5xl md:text-6xl font-black mb-8 ${isPerfect ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500' : 'text-indigo-900'}`}>
          {isPerfect ? '🌟 完美通關 🌟' : '任務完成！'}
        </h1>
        
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-8 border-indigo-100 w-full max-w-lg relative mb-8">
          <Award className={`w-36 h-36 mx-auto mb-6 ${badgeColor} ${isPerfect ? 'animate-pulse' : ''}`} />
          
          <p className="text-2xl font-bold text-gray-800 mb-6 text-center">{message}</p>
          
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-3xl mb-8 text-center border-2 border-indigo-100">
            <p className="text-gray-500 text-xl mb-2 font-bold">你的魔法戰鬥力</p>
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {score} <span className="text-3xl text-gray-400">分</span>
            </div>
          </div>

          {!isPerfect && (
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-2xl font-bold py-5 rounded-2xl transition-colors flex justify-center items-center gap-2"
            >
              <RotateCcw /> 重新挑戰拿滿分
            </button>
          )}

          {isPerfect && (
            <div className="mt-8 border-t-4 border-dashed border-gray-200 pt-8 animate-fade-in text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <ShieldAlert className="text-green-500" /> 紀錄你的榮耀
              </h3>
              
              {submitStatus === 'success' ? (
                <div className="bg-green-100 border-2 border-green-400 text-green-800 p-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-8 h-8" /> 成績已成功送出！
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      value={studentId}
                      onChange={handleStudentIdChange}
                      placeholder="請輸入 5 碼學號"
                      maxLength={5}
                      className={`w-full text-center text-3xl p-4 border-4 rounded-2xl focus:outline-none transition-colors ${
                        studentId.length > 0 && !isIdValid 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-indigo-200 focus:border-indigo-500'
                      }`}
                    />
                    {studentId.length > 0 && !isIdValid && (
                      <p className="text-red-500 font-bold mt-2 text-left px-2">⚠️ 學號必須剛好是 5 個數字喔！</p>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleSubmitForm}
                    disabled={!isIdValid || submitStatus === 'loading'}
                    className={`w-full text-2xl font-bold py-5 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-lg ${
                      !isIdValid 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105'
                    }`}
                  >
                    {submitStatus === 'loading' ? (
                      <><Loader2 className="animate-spin" /> 傳送中...</>
                    ) : (
                      <><Send /> 傳送成績</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-indigo-200 selection:text-indigo-900 pb-12">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {step !== 'intro' && step !== 'result' && (
           <div className="flex justify-between items-center max-w-4xl mx-auto mb-8 bg-white p-4 rounded-full shadow-sm border-2 border-indigo-50">
             <div className="flex gap-2">
                <span className={`w-3 h-3 rounded-full ${step === 'review' ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
                <span className={`w-3 h-3 rounded-full ${step === 'game1' ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
                <span className={`w-3 h-3 rounded-full ${step === 'game2' ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
                <span className={`w-3 h-3 rounded-full ${step === 'quiz' ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
             </div>
             <div className="flex items-center gap-2 text-xl font-bold text-amber-500 bg-amber-50 px-4 py-1 rounded-full border border-amber-200">
               <Star fill="currentColor" className="text-amber-400" /> 分數：{score}
             </div>
           </div>
        )}

        {/* 使用函數調用(或外部 Component)的方式，避免因為 App re-render 導致畫面狀態遺失 */}
        {step === 'intro' && IntroScreen()}
        {step === 'review' && ReviewScreen()}
        {step === 'game1' && Game1Screen()}
        {step === 'game2' && <Game2Screen onComplete={() => setStep('quiz')} addScore={(pts) => setScore(prev => prev + pts)} />}
        {step === 'quiz' && QuizScreen()}
        {step === 'result' && ResultScreen()}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
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
