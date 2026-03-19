import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  useEffect(() => {
    console.log('🔍 Dialog state:', isDonateOpen);
  }, [isDonateOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4 gap-8">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Logo className="w-10 h-10" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 flex-1">
              {(user?.role === 'admin' || user?.role === 'hospital') ? (
                <>
                  <Link to="/dashboard" className="text-black hover:text-[#930511] font-medium transition-colors">
                    Dashboard theo dõi
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/about" className="text-black hover:text-[#930511] transition-colors">
                    Giới thiệu
                  </Link>
                  <Link to="/donation-info" className="text-black hover:text-[#930511] transition-colors">
                    Tiêu chuẩn hiến máu
                  </Link>
                  <Link to="/news" className="text-black hover:text-[#930511] transition-colors">
                    Tin tức hoạt động
                  </Link>
                  <Link to="/terms" className="text-black hover:text-[#930511] transition-colors">
                    Điều khoản & điều kiện
                  </Link>
                  <Link to="/contact" className="text-black hover:text-[#930511] transition-colors">
                    Liên hệ
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    className="border-[#930511] text-[#930511] hover:bg-[#930511] hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDonateOpen(true);
                    }}
                    type="button"
                  >
                    Quyên góp
                  </Button>
                </>
              )}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/account" className="hidden md:block">
                    <Button variant="outline" className="border-[#930511] text-[#930511] hover:bg-[#930511] hover:text-white">
                      Tài khoản
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    className="hidden md:flex bg-black text-white hover:bg-gray-800"
                  >
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hidden md:block">
                    <Button className="bg-[#930511] text-white hover:bg-[#7a0410]">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register" className="hidden md:block">
                    <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                      Đăng ký
                    </Button>
                  </Link>
                </>
              )}
              
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-4">
                {(user?.role === 'admin' || user?.role === 'hospital') ? (
                  <>
                    <Link to="/dashboard" className="text-black hover:text-[#930511] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard theo dõi
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/about" className="text-black hover:text-[#930511] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Giới thiệu
                    </Link>
                    <Link to="/donation-info" className="text-black hover:text-[#930511] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Tiêu chuẩn hiến máu
                    </Link>
                    <Link to="/news" className="text-black hover:text-[#930511] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Tin tức hoạt động
                    </Link>
                    <Link to="/terms" className="text-black hover:text-[#930511] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Điều khoản & điều kiện
                    </Link>
                    <Link to="/contact" className="text-black hover:text-[#930511] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Liên hệ
                    </Link>

                    <Button 
                      variant="outline" 
                      className="w-full !bg-[#930511] !text-white !border-[#930511] hover:!bg-[#7a0410] hover:!text-white hover:!border-[#7a0410]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDonateOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      type="button"
                    >
                      Quyên góp
                    </Button>
                  </>
                )}

                {user ? (
                  <>
                    <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-[#930511] text-[#930511] hover:bg-[#930511] hover:text-white">
                        Tài khoản
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-black text-white hover:bg-gray-800"
                    >
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#930511] text-white hover:bg-[#7a0410]">
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                        Đăng ký
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* POPUP QUYÊN GÓP */}
      <Dialog open={isDonateOpen} onOpenChange={setIsDonateOpen}>
        <DialogContent className="sm:max-w-md !z-[99999]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-[#930511]">
              Ủng hộ dự án GIỌT ẤM
            </DialogTitle>
            <DialogDescription className="text-center">
              Quét mã QR dưới đây để quyên góp.
              <br />
              Chúng tôi xin chân thành cảm ơn sự hỗ trợ của bạn!
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-white">
            <img 
              src="/qr-code.jpg"
              alt="Mã QR Quyên góp" 
              className="w-full max-w-[300px] h-auto rounded-md border-2 border-gray-300"
              onLoad={() => console.log('✅ Ảnh QR đã load thành công!')}
              onError={() => {
                console.error('❌ Không tìm thấy /qr-code.jpg trong thư mục public');
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}