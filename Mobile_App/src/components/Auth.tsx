import React, { useState } from 'react';
import { api } from '../api';
import { Eye, EyeOff, X, AlertCircle, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user?: any) => void;
}

// ─── Nội dung Điều khoản & Điều kiện ─────────────────────────────────────────
function TermsContent() {
  return (
    <div style={{ fontSize: '13px', lineHeight: '1.65', color: '#222' }}>
      <h2 style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', color: '#8B0000', marginBottom: '12px' }}>
        Điều khoản và điều kiện sử dụng nền tảng điều phối hiến máu "Giọt Ấm"
      </h2>

      {/* Lời mở đầu */}
      <p style={{ marginBottom: '6px' }}><strong>Lời mở đầu:</strong> Chào mừng Quý vị đến với "Giọt Ấm" – Nền tảng công nghệ hỗ trợ điều phối kêu gọi hiến máu khẩn cấp. Bằng việc tạo tài khoản, truy cập và sử dụng dịch vụ trên Nền tảng, Quý vị xác nhận đã đọc, hiểu rõ và chấp thuận hoàn toàn các điều khoản, điều kiện và chính sách được quy định dưới đây.</p>
      <p style={{ marginBottom: '14px' }}>Văn bản này cấu thành một thỏa thuận pháp lý có giá trị ràng buộc giữa Dự án Giọt Ấm và Người sử dụng (bao gồm Tình nguyện viên và Cơ sở Y tế/Tổ chức).</p>

      {/* Chương I */}
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#8B0000', marginBottom: '6px' }}>Chương I. Quy định chung về bản chất dịch vụ</p>
      <ul style={{ paddingLeft: '18px', marginBottom: '14px' }}>
        <li style={{ marginBottom: '5px' }}><strong>Bản chất hoạt động:</strong> Giọt Ấm hoạt động hoàn toàn trên tôn chỉ nhân đạo, phi lợi nhuận. Giọt Ấm định vị là một công cụ công nghệ trung gian hỗ trợ cung cấp thông tin và kết nối vị trí địa lý; Giọt Ấm <strong>không</strong> phải là cơ sở khám chữa bệnh, trung tâm lưu trữ máu hay đơn vị cung cấp dịch vụ y tế.</li>
        <li><strong>Nghiêm cấm thương mại hóa:</strong> Mọi hành vi lợi dụng Nền tảng để thỏa thuận, mua bán máu, tạng hoặc trục lợi tài chính dưới mọi hình thức đều bị nghiêm cấm tuyệt đối. Giọt Ấm có quyền vô hiệu hóa tài khoản và cung cấp hồ sơ cho cơ quan chức năng đối với các cá nhân/tổ chức vi phạm.</li>
      </ul>

      {/* Chương II */}
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#8B0000', marginBottom: '6px' }}>Chương II. Thỏa thuận giữa Giọt Ấm và Tình nguyện viên (Người hiến máu)</p>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Điều 1. Điều kiện tham gia và Nghĩa vụ cung cấp thông tin</p>
      <ul style={{ paddingLeft: '18px', marginBottom: '8px' }}>
        <li style={{ marginBottom: '4px' }}>Tình nguyện viên phải là công dân từ đủ 18 tuổi trở lên, có đầy đủ năng lực hành vi dân sự.</li>
        <li style={{ marginBottom: '4px' }}>Tình nguyện viên cam kết cung cấp thông tin cá nhân và dữ liệu sinh trắc học y tế (nhóm máu hệ ABO, Rh, lịch sử bệnh lý, và thời gian hiến máu gần nhất) một cách trung thực và chính xác tuyệt đối.</li>
        <li>Mọi hành vi cố tình khai báo sai lệch nhằm vượt qua bộ lọc an toàn của hệ thống sẽ do Tình nguyện viên tự chịu trách nhiệm hoàn toàn trước pháp luật và về các rủi ro sức khỏe cá nhân.</li>
      </ul>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Điều 2. Miễn trừ trách nhiệm đối với Tình nguyện viên</p>
      <ul style={{ paddingLeft: '18px', marginBottom: '14px' }}>
        <li style={{ marginBottom: '4px' }}>Giọt Ấm không bảo đảm Tình nguyện viên sẽ đủ điều kiện hiến máu khi đến cơ sở y tế. Quyết định tiếp nhận máu phụ thuộc hoàn toàn vào kết quả sàng lọc lâm sàng của y bác sĩ tại thời điểm thực tế.</li>
        <li>Nền tảng được miễn trừ mọi trách nhiệm pháp lý liên quan đến bất kỳ sự cố y khoa, tai biến, lây nhiễm chéo hoặc tổn hại sức khỏe nào xảy ra đối với Tình nguyện viên trong và sau quá trình hiến máu.</li>
      </ul>

      {/* Chương III */}
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#8B0000', marginBottom: '6px' }}>Chương III. Thỏa thuận giữa Giọt Ấm và Cơ sở Y tế / Tổ chức sử dụng máu</p>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Điều 3. Xác thực định danh và Quyền sử dụng</p>
      <ul style={{ paddingLeft: '18px', marginBottom: '8px' }}>
        <li style={{ marginBottom: '4px' }}>Cơ sở y tế/Tổ chức (Bệnh viện, Phòng khám, Câu lạc bộ) phải trải qua quy trình xác thực (KYC) bằng cách cung cấp giấy phép hoạt động hoặc giấy giới thiệu hợp lệ từ cơ quan có thẩm quyền để được cấp tài khoản Quản trị viên (Admin).</li>
        <li>Tổ chức cam kết chỉ sử dụng tính năng "Phát lệnh khẩn cấp" cho các ca cấp cứu thực tế mang tính sống còn. Nghiêm cấm việc lạm dụng hệ thống báo động cho mục đích thử nghiệm, diễn tập (khi chưa thông báo trước) hoặc chạy chỉ tiêu phong trào, gây ảnh hưởng đến tính khả dụng của Nền tảng.</li>
      </ul>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Điều 4. Trách nhiệm chuyên môn Y khoa và Miễn trừ trách nhiệm</p>
      <ul style={{ paddingLeft: '18px', marginBottom: '14px' }}>
        <li style={{ marginBottom: '4px' }}><strong>Trách nhiệm sàng lọc:</strong> Cơ sở y tế chịu trách nhiệm pháp lý cao nhất và duy nhất trong việc thực hiện đúng, đủ các quy trình xét nghiệm, sàng lọc lâm sàng và lưu trữ máu theo chuẩn quy định của Bộ Y tế trước khi tiến hành lấy máu và truyền máu. Không được phép bỏ qua các bước kiểm tra y tế dựa trên dữ liệu hiển thị từ ứng dụng Giọt Ấm.</li>
        <li><strong>Miễn trừ rủi ro cung ứng:</strong> Thuật toán Nền tảng chỉ mang tính hỗ trợ xác suất tìm kiếm. Giọt Ấm không cam kết, không bảo đảm sẽ luôn điều phối thành công nguồn máu hoặc Tình nguyện viên sẽ có mặt kịp thời. Nền tảng không chịu trách nhiệm dân sự hay hình sự đối với các tổn thất sinh mạng, di chứng của bệnh nhân do sự thiếu hụt hoặc chậm trễ nguồn cung máu.</li>
      </ul>

      {/* Chương IV */}
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#8B0000', marginBottom: '6px' }}>Chương IV. Chính sách bảo mật và Quyền riêng tư của Người dùng</p>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Điều 5. Thu thập và Xử lý Dữ liệu</p>
      <ul style={{ paddingLeft: '18px', marginBottom: '8px' }}>
        <li style={{ marginBottom: '4px' }}><strong>Dữ liệu Vị trí (Geo-location):</strong> Hệ thống chỉ thu thập dữ liệu định vị toàn cầu (GPS) của Người dùng để phục vụ duy nhất cho thuật toán đo lường khoảng cách. Dữ liệu này được mã hóa và ẩn danh trên máy chủ; Cơ sở y tế không thể theo dõi vị trí trực tiếp của Tình nguyện viên.</li>
        <li><strong>Quy tắc chia sẻ thông tin:</strong> Thông tin định danh (Họ tên, Số điện thoại) của Tình nguyện viên được bảo mật tuyệt đối và chỉ được chia sẻ cho Cơ sở y tế khi và chỉ khi Tình nguyện viên chủ động nhấn xác nhận tham gia ca hiến máu khẩn cấp đó.</li>
      </ul>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Điều 6. Cam kết không thương mại hóa dữ liệu</p>
      <p style={{ marginBottom: '8px' }}>Giọt Ấm cam kết không bán, trao đổi, cho thuê hoặc chuyển giao bất kỳ dữ liệu cá nhân, dữ liệu y tế nào của Người dùng cho bên thứ ba vì mục đích quảng cáo, tiếp thị hay thương mại.</p>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Điều 7. Quyền kiểm soát dữ liệu của Người dùng</p>
      <ul style={{ paddingLeft: '18px', marginBottom: '14px' }}>
        <li style={{ marginBottom: '4px' }}>Người dùng có toàn quyền truy cập, trích xuất và chỉnh sửa hồ sơ thông tin cá nhân.</li>
        <li><strong>Quyền được lãng quên:</strong> Bất cứ lúc nào, Người dùng có quyền gửi yêu cầu xóa vĩnh viễn toàn bộ dữ liệu cá nhân và lịch sử hoạt động của mình khỏi hệ thống máy chủ đám mây của Giọt Ấm.</li>
      </ul>

      {/* Chương V */}
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#8B0000', marginBottom: '6px' }}>Chương V. Sự cố kỹ thuật và Bất khả kháng</p>
      <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Điều 8. Gián đoạn dịch vụ</p>
      <p style={{ marginBottom: '14px' }}>Nền tảng có thể bị gián đoạn do bảo trì, lỗi máy chủ đám mây, lỗi API của bên thứ ba (như hệ thống bản đồ) hoặc các sự kiện bất khả kháng (thiên tai, sự cố viễn thông quốc gia). Giọt Ấm được miễn trừ mọi trách nhiệm bồi thường đối với các thiệt hại trực tiếp hoặc gián tiếp phát sinh từ việc Nền tảng không thể truy cập được trong những khoảng thời gian này.</p>

      <p style={{ fontStyle: 'italic', textAlign: 'center', fontSize: '11px', color: '#666', marginTop: '8px' }}>
        (Văn bản được cập nhật lần cuối vào ngày 28 tháng 03 năm 2026 và có hiệu lực kể từ thời điểm Người dùng nhấn nút <strong>Tôi Đồng Ý</strong> trên ứng dụng.)
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
                  style={{ background: 'none', border: 'none', color: '#8B0000', cursor: 'pointer', fontSize: '13px', padding: 0, textDecoration: 'underline' }}
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