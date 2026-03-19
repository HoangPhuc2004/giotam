import React, { useState } from 'react';
import { api } from '../api';
import { Eye, EyeOff, X, AlertCircle, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user?: any) => void;
}

// ─── Nội dung Điều khoản & Điều kiện ─────────────────────────────────────────
function TermsContent() {
  return (
    <div className="text-sm leading-relaxed space-y-4" style={{ color: '#222' }}>
      <h2 className="text-base font-bold text-center uppercase" style={{ color: '#8B0000' }}>
        Điều khoản và điều kiện sử dụng nền tảng điều phối hiến máu "Giọt Ấm"
      </h2>

      <section>
        <p className="font-bold">Lời mở đầu:</p>
        <p>Chào mừng Quý vị đến với "Giọt Ấm" – Nền tảng công nghệ hỗ trợ điều phối kêu gọi hiến máu khẩn cấp. Bằng việc tạo tài khoản, truy cập và sử dụng dịch vụ trên Nền tảng, Quý vị xác nhận đã đọc, hiểu rõ và chấp thuận hoàn toàn các điều khoản, điều kiện và chính sách được quy định dưới đây.</p>
        <p className="mt-2">Văn bản này cấu thành một thỏa thuận pháp lý có giá trị ràng buộc giữa Dự án Giọt Ấm và Người sử dụng (bao gồm Tình nguyện viên và Cơ sở Y tế/Tổ chức).</p>
      </section>

      <section>
        <h3 className="font-bold uppercase mb-1" style={{ color: '#8B0000' }}>Chương I. Quy định chung về bản chất dịch vụ</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li><span className="font-bold">Bản chất hoạt động:</span> Giọt Ấm hoạt động hoàn toàn trên tôn chỉ nhân đạo, phi lợi nhuận.</li>
          <li><span className="font-bold">Nghiêm cấm thương mại hóa:</span> Mọi hành vi lợi dụng Nền tảng để thỏa thuận, mua bán máu, tạng hoặc trục lợi tài chính dưới mọi hình thức đều bị nghiêm cấm tuyệt đối.</li>
        </ol>
      </section>

      <section>
        <h3 className="font-bold uppercase mb-1" style={{ color: '#8B0000' }}>Chương II. Thỏa thuận với Tình nguyện viên</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Tình nguyện viên phải là công dân từ đủ 18 tuổi trở lên, có đầy đủ năng lực hành vi dân sự.</li>
          <li>Tình nguyện viên cam kết cung cấp thông tin cá nhân và dữ liệu sinh trắc học y tế một cách trung thực và chính xác tuyệt đối.</li>
          <li>Giọt Ấm không bảo đảm Tình nguyện viên sẽ đủ điều kiện hiến máu khi đến cơ sở y tế.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold uppercase mb-1" style={{ color: '#8B0000' }}>Chương IV. Chính sách bảo mật và Quyền riêng tư</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-bold">Dữ liệu Vị trí:</span> Hệ thống chỉ thu thập dữ liệu định vị để phục vụ thuật toán đo lường khoảng cách.</li>
          <li>Giọt Ấm cam kết không bán, trao đổi, hoặc chuyển giao bất kỳ dữ liệu cá nhân nào cho bên thứ ba vì mục đích thương mại.</li>
          <li><span className="font-bold">Quyền được lãng quên:</span> Người dùng có quyền gửi yêu cầu xóa vĩnh viễn toàn bộ dữ liệu cá nhân của mình khỏi hệ thống.</li>
        </ul>
      </section>

      <p className="italic text-center text-xs mt-4" style={{ color: '#666' }}>
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

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotLoading(true);
    try {
      await api.post('/forgot-password', { email: forgotEmail });
    } catch (_) {
      // Luôn báo thành công để tránh lộ email
    } finally {
      setIsForgotLoading(false);
      setForgotSent(true);
    }
  };

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

  // ── Shared inline styles ──────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%',
    marginTop: '6px',
    padding: '10px 12px',
    backgroundColor: '#F0EDE8',
    border: '1px solid #D9D0C7',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1a1a1a',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a1a',
  };

  const btnPrimary: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#8B0000',
    color: '#fff',
    fontWeight: '600',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  return (
    /* ── Mobile-width outer shell ── */
    <div
      style={{
        backgroundColor: '#FBF2E1',
        fontFamily: 'Georgia, "Times New Roman", serif',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '430px',    /* phone width cap */
        margin: '0 auto',     /* center on desktop */
        position: 'relative',
      }}
    >
      {isLogin ? (
        /* ── LOGIN FORM ─────────────────────────────────────────────────── */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '28px', width: '100%' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#1a1a1a', margin: 0 }}>Đăng nhập</h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '6px' }}>Chào mừng trở lại với GIỌT ẤM</p>
          </div>

          {/* White card */}
          <div style={{
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '28px 24px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            border: '1px solid #E8E0D5',
          }}>
            <form onSubmit={handleLoginSubmit}>
              {loginError && (
                <div style={{ backgroundColor: '#fff0f0', border: '1px solid #f5c0c0', color: '#8B0000', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '20px' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={loginForm.email}
                  onChange={(e) => { setLoginForm({ ...loginForm, email: e.target.value }); setLoginError(null); }}
                  required
                  disabled={isLoginLoading}
                  style={inputStyle}
                />
              </div>

              {/* Mật khẩu */}
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Mật khẩu</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); setLoginError(null); }}
                    required
                    disabled={isLoginLoading}
                    style={{ ...inputStyle, paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0 }}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nút đăng nhập */}
              <button type="submit" disabled={isLoginLoading} style={btnPrimary}>
                {isLoginLoading ? (<><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Đang xử lý...</>) : 'Đăng nhập'}
              </button>

              {/* Link đăng ký */}
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#888', marginTop: '18px', marginBottom: 0 }}>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setLoginError(null); }}
                  style={{ background: 'none', border: 'none', color: '#8B0000', fontWeight: '600', cursor: 'pointer', fontSize: '14px', padding: 0 }}
                >
                  Đăng ký ngay
                </button>
              </p>

              {/* Link quên mật khẩu */}
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#aaa', marginTop: '10px', marginBottom: 0 }}>
                <button
                  type="button"
                  onClick={() => { setForgotEmail(''); setForgotSent(false); setShowForgotModal(true); }}
                  style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '13px', padding: 0, textDecoration: 'underline' }}
                >
                  Quên mật khẩu?
                </button>
              </p>
            </form>
          </div>
        </div>
      ) : (
        /* ── REGISTER FORM ──────────────────────────────────────────────── */
        <div style={{ padding: '40px 20px' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#8B0000', margin: 0 }}>Đăng ký</h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '6px' }}>Đăng ký tình nguyện viên hiến máu</p>
            <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>*Bệnh viện vui lòng liên hệ để được cấp tài khoản</p>
          </div>

          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Họ và tên</label>
              <input type="text" placeholder="Nguyễn Văn A" value={registerForm.fullName}
                onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Số điện thoại</label>
              <input type="tel" placeholder="09xxxxxxxx" value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="example@gmail.com" value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Địa chỉ</label>
              <input type="text" placeholder="Số nhà, Đường, Phường, Quận, TP.HCM" value={registerForm.address}
                onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <input type={showRegPassword ? 'text' : 'password'} placeholder="••••••••" value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required style={{ ...inputStyle, paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0 }}>
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Xác nhận mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <input type={showRegConfirmPassword ? 'text' : 'password'} placeholder="••••••••" value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} required style={{ ...inputStyle, paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0 }}>
                  {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Nhóm máu</label>
              <select value={registerForm.bloodType}
                onChange={(e) => setRegisterForm({ ...registerForm, bloodType: e.target.value })} required style={inputStyle}>
                <option value="" disabled>Chọn nhóm máu</option>
                {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                <option value="Khác">Khác / Chưa biết</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Ngày hiến máu gần nhất (nếu có)</label>
              <input type="date" value={registerForm.lastDonationDate}
                onChange={(e) => setRegisterForm({ ...registerForm, lastDonationDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]} style={inputStyle} />
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>Để trống nếu chưa từng hiến máu</p>
            </div>

            {/* Điều khoản */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input type="checkbox" id="agreeTerms" checked={registerForm.agreeToTerms}
                onChange={(e) => setRegisterForm({ ...registerForm, agreeToTerms: e.target.checked })}
                style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0, accentColor: '#8B0000', cursor: 'pointer' }} />
              <label htmlFor="agreeTerms" style={{ fontSize: '14px', color: '#555', cursor: 'pointer' }}>
                Tôi đồng ý với{' '}
                <button type="button" onClick={() => setShowTermsModal(true)}
                  style={{ background: 'none', border: 'none', color: '#8B0000', fontWeight: '600', cursor: 'pointer', fontSize: '14px', padding: 0 }}>
                  điều khoản và điều kiện sử dụng
                </button>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isRegLoading} style={btnPrimary}>
              {isRegLoading ? (<><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Đang xử lý...</>) : 'Đăng ký'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#888', marginBottom: '24px' }}>
              Đã có tài khoản?{' '}
              <button type="button" onClick={() => setIsLogin(true)}
                style={{ background: 'none', border: 'none', color: '#8B0000', fontWeight: '600', cursor: 'pointer', fontSize: '14px', padding: 0 }}>
                Đăng nhập
              </button>
            </p>
          </form>
        </div>
      )}

      {/* ── TERMS MODAL ─────────────────────────────────────────────────── */}
      {/* ── TERMS MODAL (centered) ─────────────────────────────────────── */}
      {showTermsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '390px', borderRadius: '16px', maxHeight: '78vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #eee', flexShrink: 0 }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Điều khoản &amp; Điều kiện sử dụng</h2>
              <button onClick={() => setShowTermsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}>
                <X size={18} color="#888" />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
              <TermsContent />
            </div>
            <div style={{ padding: '14px 18px', borderTop: '1px solid #eee', flexShrink: 0 }}>
              <button
                onClick={() => { setRegisterForm((prev: any) => ({ ...prev, agreeToTerms: true })); setShowTermsModal(false); }}
                style={{ ...btnPrimary, borderRadius: '10px', padding: '12px' }}
              >
                Tôi Đồng Ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FORGOT PASSWORD MODAL ─────────────────────────────────────── */}
      {showForgotModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '360px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>Quên mật khẩu</h2>
              <button onClick={() => setShowForgotModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}>
                <X size={18} color="#888" />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: '20px 18px' }}>
              {forgotSent ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '15px', color: '#2d7a2d', fontWeight: '600', marginBottom: '8px' }}>✅ Đã gửi!</p>
                  <p style={{ fontSize: '14px', color: '#555' }}>Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.</p>
                  <button
                    onClick={() => setShowForgotModal(false)}
                    style={{ ...btnPrimary, marginTop: '20px', borderRadius: '10px', padding: '12px' }}
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px', marginTop: 0 }}>
                    Nhập email tài khoản của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
                  </p>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>Email</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    style={{ width: '100%', marginTop: '6px', marginBottom: '20px', padding: '10px 12px', backgroundColor: '#F0EDE8', border: '1px solid #D9D0C7', borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button type="submit" disabled={isForgotLoading} style={{ ...btnPrimary, borderRadius: '10px', padding: '12px' }}>
                    {isForgotLoading ? (<><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Đang gửi...</>) : 'Gửi link đặt lại'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}