import React, { useState } from 'react';
import { Home } from 'lucide-react';
import CheckInForm from './CheckInForm';
import HostDashboard from './HostDashboard';

const CheckInSystem = ({ onBackToPortal }) => {
  const [view, setView] = useState('form'); // 'form' or 'dashboard'

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">簽到退系統</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('form')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${view === 'form' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            簽到表單
          </button>
          <button
            onClick={() => setView('dashboard')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            主辦單位管理
          </button>
          <button
            onClick={onBackToPortal}
            className="flex items-center gap-2 text-sm font-bold bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors ml-4"
          >
             返回大廳
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {view === 'form' ? <CheckInForm /> : <HostDashboard />}
      </main>
    </div>
  );
};

export default CheckInSystem;
