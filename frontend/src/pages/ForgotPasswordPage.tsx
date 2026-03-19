import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner@2.0.3';
import Logo from '../components/Logo';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }
    
    setIsLoading(true);
    // Giả lập thời gian gửi request
    setTimeout(() => {
      setIsSent(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FBF2E1] flex items-center justify-center py-16 px-4" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Logo className="w-12 h-12" />
          </Link>
          <h1 className="mb-2 text-3xl font-bold uppercase">Quên mật khẩu</h1>
          <p className="text-gray-600">Khôi phục truy cập GIỌT ẤM</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          {isSent ? (
            <div className="text-center py-4">
              <p className="text-[#2d7a2d] font-bold text-lg mb-2">✅ Đã gửi!</p>
              <p className="text-gray-600 mb-6">
                Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.
              </p>
              <Link to="/login">
                <Button className="w-full bg-[#930511] text-white hover:bg-[#7a0410]">
                  Quay lại đăng nhập
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-gray-600 text-sm">
                Nhập email bạn đã đăng ký tài khoản. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu mới.
              </p>
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

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#930511] text-white hover:bg-[#7a0410]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Gửi yêu cầu'
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nhớ mật khẩu?{' '}
              <Link to="/login" className="text-[#930511] font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
