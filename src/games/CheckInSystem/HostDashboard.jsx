import React, { useState, useEffect } from 'react';
import { RefreshCw, Search } from 'lucide-react';

const HostDashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSig, setSelectedSig] = useState(null);

  const loadData = () => {
    setLoading(true);
    // Simulate network delay for realism
    setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem('checkInRecords') || '[]');
        setRecords(stored);
        setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadData();
    // Optional: auto-refresh could be implemented here
  }, []);

  const total = records.length;
  // In a real system, 'expected' might come from a settings file. For this demo, we mock it.
  const expected = Math.max(total + 5, 20);
  const present = total;
  const absent = expected - present;
  const rate = expected > 0 ? ((present / expected) * 100).toFixed(2) : '0.00';

  return (
    <div className="max-w-6xl mx-auto bg-gray-900 text-white rounded-3xl shadow-xl overflow-hidden p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-400">活動簽到管理</h2>
          <p className="text-gray-400 text-sm">此資料僅存於您的瀏覽器 (localStorage)</p>
        </div>
        <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
        >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? '更新中...' : '立即重新整理'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center shadow-lg">
          <div className="text-xs text-gray-400 mb-1 tracking-wider">應到總數 (模擬)</div>
          <div className="text-3xl font-bold text-cyan-400">{expected}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center shadow-lg">
          <div className="text-xs text-gray-400 mb-1 tracking-wider">目前實到</div>
          <div className="text-3xl font-bold text-green-400">{present}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center shadow-lg">
          <div className="text-xs text-gray-400 mb-1 tracking-wider">尚未出席</div>
          <div className="text-3xl font-bold text-red-400">{absent}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center shadow-lg">
          <div className="text-xs text-gray-400 mb-1 tracking-wider">出席率</div>
          <div className="text-3xl font-bold text-yellow-400">{rate}%</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gray-700/50 p-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">📋 即時簽到一覽表</h3>
            <span className="text-xs bg-gray-600 px-2 py-1 rounded">最新的在最上面</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-400 text-sm border-b border-gray-700">
                <th className="p-3 font-medium">時間</th>
                <th className="p-3 font-medium">狀態</th>
                <th className="p-3 font-medium">單位</th>
                <th className="p-3 font-medium">職稱</th>
                <th className="p-3 font-medium">姓名</th>
                <th className="p-3 font-medium text-center">簽名</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 italic">
                    目前沒有任何簽到紀錄
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors text-sm">
                    <td className="p-3 text-cyan-400 font-mono">{rec.time}</td>
                    <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${rec.mode === '簽到' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {rec.mode}
                        </span>
                    </td>
                    <td className="p-3">{rec.unit}</td>
                    <td className="p-3 text-gray-400">{rec.title}</td>
                    <td className="p-3 font-bold text-white text-base">{rec.name}</td>
                    <td className="p-3 text-center">
                      {rec.signature ? (
                        <button
                            onClick={() => setSelectedSig({url: rec.signature, name: rec.name})}
                            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-blue-300 transition-colors inline-flex items-center justify-center"
                            title="查看簽名"
                        >
                           <Search size={16} />
                        </button>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Modal */}
      {selectedSig && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSig(null)}>
          <div className="bg-white rounded-xl overflow-hidden max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="bg-gray-100 p-4 border-b flex justify-between items-center text-gray-800">
                <h4 className="font-bold">簽名檔預覽 - {selectedSig.name}</h4>
                <button onClick={() => setSelectedSig(null)} className="text-gray-500 hover:text-black font-bold text-xl leading-none">&times;</button>
            </div>
            <div className="p-4 bg-gray-50 flex justify-center items-center min-h-[200px]">
                <img src={selectedSig.url} alt={`${selectedSig.name}的簽名`} className="max-w-full h-auto border rounded bg-white" />
            </div>
            <div className="p-4 bg-gray-100 border-t text-right">
                <button onClick={() => setSelectedSig(null)} className="bg-gray-600 text-white px-4 py-2 rounded font-bold text-sm">關閉</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostDashboard;