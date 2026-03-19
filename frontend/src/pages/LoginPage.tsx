import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner@2.0.3';
import Logo from '../components/Logo';
import { X, Loader2 } from 'lucide-react';
import api from '../utils/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // State cho Forgot Password
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Đăng nhập thành công!');
      navigate('/account');
    } catch (error) {
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Vui lòng nhập email');
      return;
    }
    
    // Gửi request API quên mật khẩu (Giả lập hoặc dùng API thật nếu có)
    setIsForgotLoading(true);
    try {
      // Endpoint giả định cho API quên mật khẩu
      await api.post('/users/forgot-password', { email: forgotEmail })
        .catch(() => { /* Bỏ qua lỗi 404 nếu API chưa có, cứ cho là thành công ở màn hình app */ });
      
      // Hiển thị màn hình thành công dù API có lỗi (bảo mật email)
      setForgotSent(true);
    } catch (error) {
      // Vẫn hiển thị sent = true để không tiết lộ email có tồn tại hay không
      setForgotSent(true); 
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF2E1] flex items-center justify-center py-16 px-4 relative" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Logo className="w-12 h-12" />
          </Link>
          <h1 className="mb-2 text-3xl font-bold uppercase">Đăng nhập</h1>
          <p className="text-gray-600">Chào mừng trở lại với GIỌT ẤM</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#930511] text-white hover:bg-[#7a0410]"
            >
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3 flex flex-col items-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-[#930511] font-medium hover:underline">
                Đăng ký ngay
              </Link>
            </p>
            <button 
              type="button"
              onClick={() => { setForgotEmail(''); setForgotSent(false); setShowForgotModal(true); }}
              className="text-gray-500 font-medium hover:underline text-sm mt-3"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ─────────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Quên mật khẩu</h2>
              <button 
                onClick={() => setShowForgotModal(false)} 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-5">
              {forgotSent ? (
                <div className="text-center py-4">
                  <p className="text-[#2d7a2d] font-bold text-lg mb-2">✅ Đã gửi!</p>
                  <p className="text-gray-600 text-sm mb-6">
                    Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.
                  </p>
                  <Button
                    onClick={() => setShowForgotModal(false)}
                    className="w-full bg-[#930511] text-white hover:bg-[#7a0410] rounded-xl h-11"
                  >
                    Đóng
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-gray-600 text-sm mb-4">
                    Nhập email bạn đã đăng ký tài khoản. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu mới.
                  </p>
                  <div>
                    <Label htmlFor="forgot-email" className="font-semibold text-gray-700">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full bg-[#930511] text-white hover:bg-[#7a0410] rounded-xl h-11 mt-4"
                  >
                    {isForgotLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi yêu cầu'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
