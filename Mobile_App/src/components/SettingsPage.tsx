import { ChevronLeft, Lock, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { api } from '../api';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu mới không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setIsLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Không tìm thấy thông tin người dùng');
      
      const user = JSON.parse(userStr);
      
      await api.post(`/users/${user.id}/change-password`, {
        old_password: oldPassword,
        new_password: newPassword
      });

      setSuccessMsg('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-background flex flex-col w-full h-full">
      {/* Header */}
      <div className="pt-12 pb-4 px-4 flex items-center justify-center relative bg-white border-b border-gray-100">
        <button onClick={onBack} className="absolute left-4 p-2 text-foreground z-10 transition-colors hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-destructive tracking-wide uppercase">Cài đặt</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Security / Password */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-destructive" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Bảo mật</h2>
          </div>

          <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-50/80">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-gray-400" />
              Đổi mật khẩu
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl font-medium">
                {successMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive transition-all"
                  placeholder="Nhập mật khẩu cũ"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive transition-all"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive transition-all"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-destructive text-white font-bold rounded-xl py-3.5 hover:bg-destructive/90 transition-colors shadow-md shadow-red-500/20 disabled:opacity-50 flex justify-center items-center"
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
