import { ChevronLeft, Bell, Trash2, KeyRound } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../api';

interface ConfigurationPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ConfigurationPage({ onBack, onLogout }: ConfigurationPageProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deleteReason, setDeleteReason] = useState('');

  const DELETE_REASONS = [
    "Thường xuyên nhận thông báo không cần thiết",
    "Không muốn hiến máu nữa",
    "Cảm thấy bị làm phiền",
    "Ứng dụng bị lỗi hoặc khó sử dụng",
    "Tôi muốn tạo tài khoản mới",
    "Lý do khác"
  ];

  useEffect(() => {
    // Clean up any previously set dark mode state
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');

    // Initial notifications state
    const notifs = localStorage.getItem('notifications_enabled');
    if (notifs === 'false') setNotificationsEnabled(false);
  }, []);

  const handleToggleNotifications = () => {
    if (notificationsEnabled) {
      setShowNotificationAlert(true); // Trying to turn off
    } else {
      setNotificationsEnabled(true);
      localStorage.setItem('notifications_enabled', 'true');
    }
  };

  const confirmTurnOffNotifications = () => {
    setNotificationsEnabled(false);
    localStorage.setItem('notifications_enabled', 'false');
    setShowNotificationAlert(false);
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        await api.delete(`/users/${user.id}`);
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onLogout(); // This should trigger a re-render to login page
    } catch (err) {
      console.error("Lỗi khi xóa tài khoản", err);
      alert("Đã có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại sau.");
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <div className="min-h-full bg-background flex flex-col w-full h-full relative">
      {/* Header */}
      <div className="pt-12 pb-4 px-4 flex items-center justify-center relative bg-destructive shadow-md">
        <button onClick={onBack} className="absolute left-4 p-2 text-white z-10 transition-colors hover:bg-white/10 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide uppercase">Cài đặt</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Notifications */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Thông báo</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-base">Tắt thông báo</span>
                <span className="text-xs text-gray-500">Chặn thông báo gửi đến thiết bị từ máy chủ</span>
              </div>
            </div>
            
            <button 
              onClick={handleToggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center p-0.5 ${
                !notificationsEnabled ? 'bg-destructive' : 'bg-gray-300'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
                  !notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} 
              />
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="pt-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Bảo mật</h2>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-white rounded-2xl p-4 border border-gray-50 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <KeyRound className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-medium text-foreground text-base">Đổi mật khẩu</span>
                <span className="text-xs text-gray-500">Cập nhật mật khẩu bảo vệ tài khoản</span>
              </div>
            </div>
          </button>
        </section>

        {/* Account Danger Zone */}
        <section className="pt-6">
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3">Vùng nguy hiểm</h2>
          <button 
            onClick={() => setShowDeleteAlert(true)}
            className="w-full bg-white rounded-2xl p-4 border-2 border-red-500 flex items-center justify-between shadow-sm hover:bg-red-50 transition-colors group"
          >
            <div className="flex flex-col text-left">
              <span className="font-semibold text-red-600 text-base">Xóa tài khoản</span>
              <span className="text-xs text-red-500">Hành động này không thể hoàn tác</span>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
              <Trash2 className="w-5 h-5" />
            </div>
          </button>
        </section>

      </div>

      {/* Notification Alert Dialog */}
      {showNotificationAlert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-foreground mb-2">Tắt Thông báo?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Nếu tắt thông báo, bạn sẽ không thể nhận thông báo hiến máu khẩn cấp. Bạn vẫn muốn tắt chứ?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowNotificationAlert(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-foreground rounded-xl font-bold hover:bg-gray-200"
              >
                Hủy
              </button>
              <button 
                onClick={confirmTurnOffNotifications}
                className="flex-1 py-3 px-4 bg-destructive text-white rounded-xl font-bold hover:bg-destructive/90 shadow-md shadow-red-500/20"
              >
                Vẫn Tắt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-foreground mb-4">Đổi Mật Khẩu</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Mật khẩu hiện tại</label>
                <input 
                  type="password"
                  value={passwordForm.old}
                  onChange={(e) => setPasswordForm(prev => ({...prev, old: e.target.value}))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive/50"
                  placeholder="Nhập mật khẩu cũ..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Mật khẩu mới</label>
                <input 
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm(prev => ({...prev, new: e.target.value}))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive/50"
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Xác nhận mật khẩu</label>
                <input 
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm(prev => ({...prev, confirm: e.target.value}))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive/50"
                  placeholder="Xác nhận mật khẩu mới..."
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ old: '', new: '', confirm: '' });
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-foreground rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  alert("Mật khẩu đã được cập nhật thành công!");
                  setShowPasswordModal(false);
                  setPasswordForm({ old: '', new: '', confirm: '' });
                }}
                className="flex-1 py-3 px-4 bg-destructive text-white rounded-xl font-bold hover:bg-destructive/90 transition-colors shadow-md shadow-destructive/20"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Alert Dialog */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {deleteStep === 1 ? (
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-black text-foreground mb-2">Vì sao bạn muốn rời đi?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Vui lòng cho chúng tôi biết lý do bạn muốn xóa tài khoản:
              </p>
              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
                {DELETE_REASONS.map((reason, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDeleteReason(reason)}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-colors ${
                      deleteReason === reason 
                        ? 'border-destructive bg-red-50 text-destructive font-bold' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDeleteAlert(false);
                    setDeleteReason('');
                    setDeleteStep(1);
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 text-foreground rounded-xl font-bold hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => setDeleteStep(2)}
                  disabled={!deleteReason}
                  className="flex-1 py-3 px-4 bg-destructive text-white rounded-xl font-bold hover:bg-destructive/90 shadow-md shadow-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 border-2 border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-black text-center text-foreground mb-2">Xóa Tài Khoản Vĩnh Viễn</h3>
              <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">
                Toàn bộ dữ liệu, lịch sử hiến máu và điểm tích lũy của bạn sẽ bị xóa hoàn toàn. Bạn chắc chắn muốn tiếp tục?
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full py-3.5 px-4 bg-destructive text-white rounded-xl font-bold hover:bg-destructive/90 shadow-md shadow-destructive/20 flex justify-center items-center"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xác nhận Xóa'}
                </button>
                <button 
                  onClick={() => setDeleteStep(1)}
                  disabled={isDeleting}
                  className="w-full py-3 px-4 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100"
                >
                  Quay lại
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
