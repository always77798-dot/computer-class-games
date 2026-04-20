import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function MouseSurvivalGame({ onBackToPortal }) {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">

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
