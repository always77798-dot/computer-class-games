import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { QRCodeSVG } from 'qrcode.react';
import Swal from 'sweetalert2';
import { Maximize, Minimize, QrCode } from 'lucide-react';

const CheckInForm = () => {
  const [formData, setFormData] = useState({
    unit: '',
    title: '',
    name: '',
    extra1: '',
    extra2: ''
  });
  const [mode, setMode] = useState('簽到');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const sigCanvas = useRef(null);
  const containerRef = useRef(null);

  // Example Settings
  const eventName = '預設活動名稱';
  const themeColor = '#0d6efd';
  const extra1Label = '備註一';
  const extra2Label = '備註二';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // In a real app, you might want to handle actual DOM fullscreen here or resize the canvas
    setTimeout(() => {
        if (sigCanvas.current) {
            // A small hack to force canvas resize awareness if needed,
            // react-signature-canvas usually handles resize but might need a nudge
            const data = sigCanvas.current.toData();
            sigCanvas.current.clear();
            sigCanvas.current.fromData(data);
        }
    }, 50);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.unit || !formData.title || !formData.name) {
      Swal.fire({ title: '資料不完整', text: '請填寫必填欄位 (*)', icon: 'warning', confirmButtonColor: themeColor });
      return;
    }

    if (sigCanvas.current.isEmpty()) {
      Swal.fire({ title: '尚未簽名', text: '請在框內簽名', icon: 'warning', confirmButtonColor: themeColor });
      return;
    }

    const signatureDataUrl = sigCanvas.current.toDataURL();
    const now = new Date();

    const newRecord = {
      id: Date.now().toString(),
      time: now.toLocaleTimeString('zh-TW', { hour12: false }),
      date: now.toLocaleDateString('zh-TW'),
      mode,
      unit: formData.unit,
      title: formData.title,
      name: formData.name,
      signature: signatureDataUrl,
      extra1: formData.extra1,
      extra2: formData.extra2
    };

    // Save to localStorage
    const existingRecords = JSON.parse(localStorage.getItem('checkInRecords') || '[]');
    localStorage.setItem('checkInRecords', JSON.stringify([newRecord, ...existingRecords]));

    Swal.fire({
        title: `${mode}成功！`,
        text: '將於完成後自動返回...',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
      setFormData({ unit: '', title: '', name: '', extra1: '', extra2: '' });
      sigCanvas.current.clear();
      window.scrollTo(0, 0);
      if (isFullscreen) setIsFullscreen(false);
    });
  };

  return (
    <div className="relative max-w-xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-xl">
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => setShowQrModal(true)}
        title="顯示簽到 QR Code"
      >
        <QrCode size={24} />
      </button>

      <h3 className="text-2xl font-bold text-center mb-4" style={{ color: themeColor }}>{eventName}</h3>

      <div className={`text-center p-2 mb-6 rounded-lg font-bold text-white ${mode === '簽到' ? 'bg-green-600' : 'bg-red-600'}`}>
        目前狀態：開放{mode}
        <button
            type="button"
            className="ml-4 text-xs underline opacity-80 hover:opacity-100"
            onClick={() => setMode(mode === '簽到' ? '簽退' : '簽到')}
        >
            切換
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-right text-sm font-bold" style={{ color: themeColor }}>* 為必填欄位</div>

        <div>
          <label className="block text-gray-700 font-bold mb-1">單位 / 學校 <span className="text-red-500">*</span></label>
          <input
            type="text" name="unit" value={formData.unit} onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ focusRing: themeColor }}
            placeholder="請輸入單位"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1">職稱 <span className="text-red-500">*</span></label>
            <input
              type="text" name="title" value={formData.title} onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              placeholder="輸入職稱"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">姓名 <span className="text-red-500">*</span></label>
            <input
              type="text" name="name" value={formData.name} onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              placeholder="輸入姓名"
            />
          </div>
        </div>

        {extra1Label && (
          <div>
            <label className="block text-gray-700 font-bold mb-1">{extra1Label}</label>
            <input
              type="text" name="extra1" value={formData.extra1} onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              placeholder={`請填寫${extra1Label}`}
            />
          </div>
        )}

        {extra2Label && (
          <div>
            <label className="block text-gray-700 font-bold mb-1">{extra2Label}</label>
            <input
              type="text" name="extra2" value={formData.extra2} onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              placeholder={`請填寫${extra2Label}`}
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-bold mb-1">請在此簽名 <span className="text-red-500">*</span></label>

          <div
            ref={containerRef}
            className={`relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4 m-0 flex flex-col' : 'h-48'}`}
          >
            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute top-2 right-2 z-10 bg-white/90 border border-gray-200 rounded-full px-3 py-1 text-xs font-bold text-gray-600 shadow-sm flex items-center gap-1 hover:bg-gray-100"
            >
              {isFullscreen ? <><Minimize size={14}/> 縮小還原</> : <><Maximize size={14}/> 放大簽名</>}
            </button>
            <div className={`flex-1 ${isFullscreen ? 'mt-10 mb-4 border border-gray-300 rounded-lg' : 'w-full h-full'}`}>
                <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{ className: 'w-full h-full rounded-lg' }}
                    backgroundColor="rgba(255,255,255,0)"
                />
            </div>

            {isFullscreen && (
               <div className="flex justify-end gap-2">
                 <button type="button" className="btn bg-gray-500 text-white px-6 py-2 rounded-lg font-bold shadow-md" onClick={clearSignature}>清除</button>
                 <button type="button" className="btn text-white px-6 py-2 rounded-lg font-bold shadow-md" style={{ backgroundColor: themeColor }} onClick={toggleFullscreen}>完成簽名</button>
               </div>
            )}
          </div>
          {!isFullscreen && (
            <div className="flex justify-end mt-2">
                <button type="button" className="text-sm text-gray-500 hover:text-gray-700 underline" onClick={clearSignature}>清除重簽</button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full text-white font-bold py-3 rounded-full shadow-md transition-transform active:scale-95 text-lg mt-6"
          style={{ backgroundColor: themeColor }}
        >
          確認送出
        </button>
      </form>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQrModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: themeColor }}>簽到連結</h3>
            <div className="bg-white p-4 border rounded-xl inline-block mb-6 shadow-sm">
               <QRCodeSVG value={window.location.href} size={200} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 tracking-wider mb-6">請掃描QR-Code<br/>完成簽到</h2>
            <button
              className="bg-gray-200 text-gray-800 px-8 py-2 rounded-full font-bold hover:bg-gray-300 transition-colors"
              onClick={() => setShowQrModal(false)}
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInForm;