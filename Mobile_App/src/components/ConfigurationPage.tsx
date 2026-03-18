import { ChevronLeft, Moon, Bell, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../api';

interface ConfigurationPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ConfigurationPage({ onBack, onLogout }: ConfigurationPageProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);

    // Initial notifications state
    const notifs = localStorage.getItem('notifications_enabled');
    if (notifs === 'false') setNotificationsEnabled(false);
  }, []);

  const handleToggleTheme = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
      <div className="pt-12 pb-4 px-4 flex items-center justify-center relative bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <button onClick={onBack} className="absolute left-4 p-2 text-foreground z-10 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-destructive tracking-wide uppercase">Cấu hình</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Appearance */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Hiển thị</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Moon className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-medium text-foreground text-base">Chế độ tối (Dark Mode)</span>
            </div>
            
            <button 
              onClick={handleToggleTheme}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${isDarkMode ? 'bg-black justify-end' : 'bg-red-500 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Thông báo</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-base">Nhận thông báo</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Thông báo về lịch hiến máu khẩn cấp</span>
              </div>
            </div>
            
            <button 
              onClick={handleToggleNotifications}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${notificationsEnabled ? 'bg-black justify-end' : 'bg-red-500 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </section>

        {/* Account Danger Zone */}
        <section className="pt-6">
          <h2 className="text-sm font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider mb-3">Vùng nguy hiểm</h2>
          <button 
            onClick={() => setShowDeleteAlert(true)}
            className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-red-500 flex items-center justify-between shadow-sm hover:bg-red-50 dark:hover:bg-slate-700 transition-colors group"
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200 border dark:border-slate-700">
            <h3 className="text-lg font-bold text-foreground mb-2">Tắt Thông báo?</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Nếu tắt thông báo, bạn sẽ không thể nhận thông báo hiến máu khẩn cấp. Bạn vẫn muốn tắt chứ?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowNotificationAlert(false)}
                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-700 text-foreground rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600"
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

      {/* Delete Account Alert Dialog */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 border-2 border-red-100 dark:border-red-900/50">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Trash2 className="w-6 h-6 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-xl font-black text-center text-foreground mb-2">Xóa Tài Khoản Vĩnh Viễn</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 text-center leading-relaxed">
              Toàn bộ dữ liệu, lịch sử hiến máu và điểm tích lũy của bạn sẽ bị xóa hoàn toàn. Bạn chắc chắn muốn tiếp tục?
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full py-3.5 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-md shadow-red-600/20 flex justify-center items-center"
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận Xóa'}
              </button>
              <button 
                onClick={() => setShowDeleteAlert(false)}
                disabled={isDeleting}
                className="w-full py-3 px-4 bg-gray-50 dark:bg-slate-700/50 dark:text-slate-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Hủy, tôi giữ lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
