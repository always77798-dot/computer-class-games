import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function MouseSurvivalGame({ onBackToPortal }) {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* ⬅️ 返回大廳按鈕 (固定在左上角最上層) */}
      <button
        onClick={onBackToPortal}
        className="absolute top-4 left-4 z-[999] flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-full backdrop-blur transition-all border border-slate-600 shadow-lg"
      >
        <ArrowLeft size={20} />
        離開遊戲
      </button>

      {/* 🎮 遊戲本體 (透過 iframe 完美隔離嵌入) */}
      <iframe
        src="/mouse-survival.html"
        className="w-full h-full border-none"
        title="鼠鼠的文件生存戰"
        sandbox="allow-scripts allow-same-origin allow-popups"
      ></iframe>
    </div>
  );
}
