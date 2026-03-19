import React, { useState } from 'react';
import { api } from '../api';
import { Eye, EyeOff, X, AlertCircle, Loader2 } from 'lucide-react';
import logoImage from 'figma:asset/c819fc914ecaa07ab2a41a79fa5f1bba1493983f.png';

interface AuthProps {
  onLogin: (user?: any) => void;
}

// ─── Nội dung Điều khoản & Điều kiện ─────────────────────────────────────────
function TermsContent() {
  return (
    <div className="text-sm leading-relaxed text-foreground space-y-4">
      <h2 className="text-base font-bold text-center uppercase text-destructive">
        Điều khoản và điều kiện sử dụng nền tảng điều phối hiến máu "Giọt Ấm"
      </h2>

      <section>
        <p className="font-bold">Lời mở đầu:</p>
        <p>Chào mừng Quý vị đến với "Giọt Ấm" – Nền tảng công nghệ hỗ trợ điều phối kêu gọi hiến máu khẩn cấp. Bằng việc tạo tài khoản, truy cập và sử dụng dịch vụ trên Nền tảng, Quý vị xác nhận đã đọc, hiểu rõ và chấp thuận hoàn toàn các điều khoản, điều kiện và chính sách được quy định dưới đây.</p>
        <p className="mt-2">Văn bản này cấu thành một thỏa thuận pháp lý có giá trị ràng buộc giữa Dự án Giọt Ấm và Người sử dụng (bao gồm Tình nguyện viên và Cơ sở Y tế/Tổ chức).</p>
      </section>

      <section>
        <h3 className="font-bold text-destructive uppercase mb-1">Chương I. Quy định chung về bản chất dịch vụ</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li><span className="font-bold">Bản chất hoạt động:</span> Giọt Ấm hoạt động hoàn toàn trên tôn chỉ nhân đạo, phi lợi nhuận. Giọt Ấm định vị là một công cụ công nghệ trung gian hỗ trợ cung cấp thông tin và kết nối vị trí địa lý; Giọt Ấm <span className="font-bold">không</span> phải là cơ sở khám chữa bệnh, trung tâm lưu trữ máu hay đơn vị cung cấp dịch vụ y tế.</li>
          <li><span className="font-bold">Nghiêm cấm thương mại hóa:</span> Mọi hành vi lợi dụng Nền tảng để thỏa thuận, mua bán máu, tạng hoặc trục lợi tài chính dưới mọi hình thức đều bị nghiêm cấm tuyệt đối.</li>
        </ol>
      </section>

      <section>
        <h3 className="font-bold text-destructive uppercase mb-1">Chương II. Thỏa thuận với Tình nguyện viên</h3>
        <p className="font-bold mb-1">Điều 1. Điều kiện tham gia và Nghĩa vụ cung cấp thông tin</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Tình nguyện viên phải là công dân từ đủ 18 tuổi trở lên, có đầy đủ năng lực hành vi dân sự.</li>
          <li>Tình nguyện viên cam kết cung cấp thông tin cá nhân và dữ liệu sinh trắc học y tế một cách trung thực và chính xác tuyệt đối.</li>
          <li>Mọi hành vi cố tình khai báo sai lệch sẽ do Tình nguyện viên tự chịu trách nhiệm hoàn toàn trước pháp luật.</li>
        </ul>
        <p className="font-bold mt-3 mb-1">Điều 2. Miễn trừ trách nhiệm</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Giọt Ấm không bảo đảm Tình nguyện viên sẽ đủ điều kiện hiến máu khi đến cơ sở y tế.</li>
          <li>Nền tảng được miễn trừ mọi trách nhiệm pháp lý liên quan đến bất kỳ sự cố y khoa hoặc tổn hại sức khỏe nào xảy ra trong và sau quá trình hiến máu.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-destructive uppercase mb-1">Chương IV. Chính sách bảo mật và Quyền riêng tư</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-bold">Dữ liệu Vị trí:</span> Hệ thống chỉ thu thập dữ liệu định vị để phục vụ thuật toán đo lường khoảng cách. Dữ liệu được mã hóa và ẩn danh.</li>
          <li>Thông tin định danh của Tình nguyện viên chỉ được chia sẻ khi Tình nguyện viên chủ động xác nhận tham gia ca hiến máu.</li>
          <li>Giọt Ấm cam kết không bán, trao đổi, hoặc chuyển giao bất kỳ dữ liệu cá nhân nào cho bên thứ ba vì mục đích thương mại.</li>
          <li><span className="font-bold">Quyền được lãng quên:</span> Người dùng có quyền gửi yêu cầu xóa vĩnh viễn toàn bộ dữ liệu cá nhân của mình khỏi hệ thống.</li>
        </ul>
      </section>

      <p className="italic text-center text-xs text-muted-foreground mt-4">
        (Văn bản được cập nhật lần cuối vào ngày 28 tháng 03 năm 2026 và có hiệu lực kể từ thời điểm Người dùng nhấn nút <span className="font-bold">Tôi Đồng Ý</span> trên ứng dụng.)
      </p>
    </div>
  );
}

// ─── Component chính ──────────────────────────────────────────────────────────
export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register state
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    bloodType: 'Khác',
    lastDonationDate: '',
    agreeToTerms: false,
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [isRegLoading, setIsRegLoading] = useState(false);

  // ── Login Submit ─────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoginLoading(true);
    try {
      const response = await api.post('/login', {
        email: loginForm.email,
        password: loginForm.password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Sai email hoặc mật khẩu!';
      setLoginError(msg);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // ── Register Submit ───────────────────────────────────────────────────────
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    if (!registerForm.agreeToTerms) {
      alert('Bạn phải đồng ý với điều khoản và điều kiện!');
      return;
    }
    setIsRegLoading(true);
    try {
      await api.post('/register_donor', {
        fullName: registerForm.fullName,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
        address: registerForm.address,
        bloodType: registerForm.bloodType,
        lastDonationDate: registerForm.lastDonationDate || null,
      });
      alert('Đăng ký thành công! Mời bạn đăng nhập.');
      setIsLogin(true);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Lỗi đăng ký!');
    } finally {
      setIsRegLoading(false);
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputClass =
    'w-full mt-1 px-3 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/40 focus:border-destructive transition-colors text-sm';
  const labelClass = 'block text-sm font-medium text-foreground';
  const submitBtn =
    'bg-destructive text-destructive-foreground font-semibold px-10 py-2.5 rounded-full hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60';

  return (
    <div
      style={{ backgroundColor: '#FBF2E1', fontFamily: 'Georgia, "Times New Roman", serif' }}
      className="min-h-screen flex flex-col"
    >
      {/* ── LOGIN FORM ───────────────────────────────────────────────────── */}
      {isLogin ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
          {/* Title */}
          <div className="text-center mb-10 w-full max-w-sm">
            <h1 className="text-4xl font-bold uppercase tracking-wide mb-2" style={{ color: '#1a1a1a' }}>Đăng nhập</h1>
            <p className="text-muted-foreground text-sm">Chào mừng trở lại với GIỌT ẤM</p>
          </div>

          {/* Form – no card */}
          <form onSubmit={handleLoginSubmit} className="w-full max-w-sm space-y-8">
            {loginError && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={loginForm.email}
                onChange={(e) => { setLoginForm({ ...loginForm, email: e.target.value }); setLoginError(null); }}
                required
                disabled={isLoginLoading}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mật khẩu</label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); setLoginError(null); }}
                  required
                  disabled={isLoginLoading}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button type="submit" disabled={isLoginLoading} className={submitBtn}>
                {isLoginLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Đang xử lý...</>) : 'Đăng nhập'}
              </button>
              <p className="text-sm text-muted-foreground">
                Chưa có tài khoản?{' '}
                <button type="button" onClick={() => { setIsLogin(false); setLoginError(null); }} className="text-destructive font-semibold hover:underline">
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </form>
        </div>
      ) : (
        /* ── REGISTER FORM ─────────────────────────────────────────────── */
        <div className="w-full max-w-sm mx-auto px-8 py-10">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold uppercase tracking-wide text-destructive mb-1">Đăng ký</h1>
            <p className="text-sm text-muted-foreground">Đăng ký tình nguyện viên hiến máu</p>
            <p className="text-xs text-muted-foreground mt-1">*Bệnh viện vui lòng liên hệ để được cấp tài khoản</p>
          </div>

          {/* Form – no card */}
          <form onSubmit={handleRegisterSubmit} className="space-y-7">
            <div>
              <label className={labelClass}>Họ và tên</label>
              <input type="text" placeholder="Nguyễn Văn A" value={registerForm.fullName}
                onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Số điện thoại</label>
              <input type="tel" placeholder="09xxxxxxxx" value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input type="email" placeholder="example@gmail.com" value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Địa chỉ</label>
              <input type="text" placeholder="Số nhà, Đường, Phường, Quận, TP.HCM" value={registerForm.address}
                onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Mật khẩu</label>
              <div className="relative">
                <input type={showRegPassword ? 'text' : 'password'} placeholder="••••••••" value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required className={`${inputClass} pr-10`} />
                <button type="button" onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Xác nhận mật khẩu</label>
              <div className="relative">
                <input type={showRegConfirmPassword ? 'text' : 'password'} placeholder="••••••••" value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} required className={`${inputClass} pr-10`} />
                <button type="button" onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Nhóm máu</label>
              <select value={registerForm.bloodType}
                onChange={(e) => setRegisterForm({ ...registerForm, bloodType: e.target.value })} required className={inputClass}>
                <option value="" disabled>Chọn nhóm máu</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="Khác">Khác / Chưa biết</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Ngày hiến máu gần nhất (nếu có)</label>
              <input type="date" value={registerForm.lastDonationDate}
                onChange={(e) => setRegisterForm({ ...registerForm, lastDonationDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]} className={inputClass} />
              <p className="text-xs text-muted-foreground mt-1">Để trống nếu chưa từng hiến máu</p>
            </div>

            {/* Điều khoản */}
            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreeTerms" checked={registerForm.agreeToTerms}
                onChange={(e) => setRegisterForm({ ...registerForm, agreeToTerms: e.target.checked })}
                className="w-4 h-4 mt-0.5 flex-shrink-0 cursor-pointer accent-destructive" />
              <label htmlFor="agreeTerms" className="text-sm text-muted-foreground cursor-pointer">
                Tôi đồng ý với{' '}
                <button type="button" onClick={() => setShowTermsModal(true)} className="text-destructive font-semibold hover:underline">
                  điều khoản và điều kiện sử dụng
                </button>
              </label>
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center gap-4 pb-6">
              <button type="submit" disabled={isRegLoading} className={submitBtn}>
                {isRegLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Đang xử lý...</>) : 'Đăng ký'}
              </button>
              <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <button type="button" onClick={() => setIsLogin(true)} className="text-destructive font-semibold hover:underline">
                  Đăng nhập
                </button>
              </p>
            </div>
          </form>
        </div>
      )}

      {/* ── TERMS MODAL ───────────────────────────────────────────────────── */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-card w-full max-w-md rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <h2 className="text-base font-bold text-card-foreground">Điều khoản &amp; Điều kiện sử dụng</h2>
              <button onClick={() => setShowTermsModal(false)} className="p-1.5 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <TermsContent />
            </div>
            <div className="px-5 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => { setRegisterForm((prev) => ({ ...prev, agreeToTerms: true })); setShowTermsModal(false); }}
                className="w-full bg-destructive text-destructive-foreground font-semibold py-3 rounded-xl hover:bg-destructive/90 transition-colors"
              >
                Tôi Đồng Ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}