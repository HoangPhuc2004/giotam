import { api } from '../api';
import { useState } from 'react';
import { Eye, EyeOff, X, AlertCircle, Loader2 } from 'lucide-react';
import logoImage from 'figma:asset/c819fc914ecaa07ab2a41a79fa5f1bba1493983f.png';

interface AuthProps {
  onLogin: (user?: any) => void;
}

// ─── Nội dung Điều khoản & Điều kiện ─────────────────────────────────────────
function TermsContent() {
  return (
    <div className="text-sm leading-relaxed text-gray-700 space-y-4">
      <h2 className="text-base font-bold text-center uppercase text-[#930511]">
        Điều khoản và điều kiện sử dụng nền tảng điều phối hiến máu "Giọt Ấm"
      </h2>

      <section>
        <p className="font-bold">Lời mở đầu:</p>
        <p>Chào mừng Quý vị đến với "Giọt Ấm" – Nền tảng công nghệ hỗ trợ điều phối kêu gọi hiến máu khẩn cấp. Bằng việc tạo tài khoản, truy cập và sử dụng dịch vụ trên Nền tảng, Quý vị xác nhận đã đọc, hiểu rõ và chấp thuận hoàn toàn các điều khoản, điều kiện và chính sách được quy định dưới đây.</p>
        <p className="mt-2">Văn bản này cấu thành một thỏa thuận pháp lý có giá trị ràng buộc giữa Dự án Giọt Ấm và Người sử dụng (bao gồm Tình nguyện viên và Cơ sở Y tế/Tổ chức).</p>
      </section>

      <section>
        <h3 className="font-bold text-[#930511] uppercase mb-1">Chương I. Quy định chung về bản chất dịch vụ</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li><span className="font-bold">Bản chất hoạt động:</span> Giọt Ấm hoạt động hoàn toàn trên tôn chỉ nhân đạo, phi lợi nhuận. Giọt Ấm định vị là một công cụ công nghệ trung gian hỗ trợ cung cấp thông tin và kết nối vị trí địa lý; Giọt Ấm <span className="font-bold">không</span> phải là cơ sở khám chữa bệnh, trung tâm lưu trữ máu hay đơn vị cung cấp dịch vụ y tế.</li>
          <li><span className="font-bold">Nghiêm cấm thương mại hóa:</span> Mọi hành vi lợi dụng Nền tảng để thỏa thuận, mua bán máu, tạng hoặc trục lợi tài chính dưới mọi hình thức đều bị nghiêm cấm tuyệt đối.</li>
        </ol>
      </section>

      <section>
        <h3 className="font-bold text-[#930511] uppercase mb-1">Chương II. Thỏa thuận với Tình nguyện viên</h3>
        <p className="font-bold mb-1">Điều 1. Điều kiện tham gia và Nghĩa vụ cung cấp thông tin</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Tình nguyện viên phải là công dân từ đủ 18 tuổi trở lên, có đầy đủ năng lực hành vi dân sự.</li>
          <li>Tình nguyện viên cam kết cung cấp thông tin cá nhân và dữ liệu sinh trắc học y tế một cách trung thực và chính xác tuyệt đối.</li>
          <li>Mọi hành vi cố tình khai báo sai lệch sẽ do Tình nguyện viên tự chịu trách nhiệm hoàn toàn trước pháp luật.</li>
        </ul>
        <p className="font-bold mt-3 mb-1">Điều 2. Miễn trừ trách nhiệm đối với Tình nguyện viên</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Giọt Ấm không bảo đảm Tình nguyện viên sẽ đủ điều kiện hiến máu khi đến cơ sở y tế.</li>
          <li>Nền tảng được miễn trừ mọi trách nhiệm pháp lý liên quan đến bất kỳ sự cố y khoa hoặc tổn hại sức khỏe nào xảy ra trong và sau quá trình hiến máu.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-[#930511] uppercase mb-1">Chương IV. Chính sách bảo mật và Quyền riêng tư</h3>
        <p className="font-bold mb-1">Điều 5. Thu thập và Xử lý Dữ liệu</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-bold">Dữ liệu Vị trí (Geo-location):</span> Hệ thống chỉ thu thập dữ liệu định vị để phục vụ duy nhất cho thuật toán đo lường khoảng cách. Dữ liệu được mã hóa và ẩn danh.</li>
          <li><span className="font-bold">Quy tắc chia sẻ thông tin:</span> Thông tin định danh của Tình nguyện viên chỉ được chia sẻ cho Cơ sở y tế khi và chỉ khi Tình nguyện viên chủ động xác nhận tham gia ca hiến máu.</li>
        </ul>
        <p className="font-bold mt-3 mb-1">Điều 6. Cam kết không thương mại hóa dữ liệu</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Giọt Ấm cam kết không bán, trao đổi, cho thuê hoặc chuyển giao bất kỳ dữ liệu cá nhân nào của Người dùng cho bên thứ ba vì mục đích quảng cáo hay thương mại.</li>
        </ul>
        <p className="font-bold mt-3 mb-1">Điều 7. Quyền kiểm soát dữ liệu của Người dùng</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Người dùng có toàn quyền truy cập, trích xuất và chỉnh sửa hồ sơ thông tin cá nhân.</li>
          <li><span className="font-bold">Quyền được lãng quên:</span> Bất cứ lúc nào, Người dùng có quyền gửi yêu cầu xóa vĩnh viễn toàn bộ dữ liệu cá nhân của mình khỏi hệ thống.</li>
        </ul>
      </section>

      <p className="italic text-center text-xs text-gray-500 mt-4">
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

  // ── Shared input style ────────────────────────────────────────────────────
  const inputClass =
    'w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#930511]/40 focus:border-[#930511] transition-colors text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700';

  return (
    <div
      className="min-h-screen bg-[#FBF2E1] flex flex-col items-center justify-start overflow-y-auto"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {/* ── LOGIN FORM ───────────────────────────────────────────────────── */}
      {isLogin ? (
        <div className="w-full max-w-md px-6 py-12 flex flex-col items-center">
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <img src={logoImage} alt="Logo Giọt Ấm" className="h-14 mx-auto mb-4" />
            <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-1">Đăng nhập</h1>
            <p className="text-gray-500 text-sm">Chào mừng trở lại với GIỌT ẤM</p>
          </div>

          {/* Card */}
          <div className="w-full bg-white rounded-2xl p-7 shadow-md">
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Error Banner */}
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={loginForm.email}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, email: e.target.value });
                    setLoginError(null);
                  }}
                  required
                  disabled={isLoginLoading}
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, password: e.target.value });
                      setLoginError(null);
                    }}
                    required
                    disabled={isLoginLoading}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full bg-[#930511] text-white font-semibold py-2.5 rounded-lg hover:bg-[#7a0410] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>

            {/* Link to Register */}
            <div className="mt-5 text-center text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(false); setLoginError(null); }}
                className="text-[#930511] font-semibold hover:underline"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── REGISTER FORM ─────────────────────────────────────────────── */
        <div className="w-full max-w-md px-6 py-10 flex flex-col items-center">
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <img src={logoImage} alt="Logo Giọt Ấm" className="h-14 mx-auto mb-4" />
            <h1 className="text-3xl font-bold uppercase tracking-wide text-[#930511] mb-1">Đăng ký</h1>
            <p className="text-gray-500 text-sm">Đăng ký tình nguyện viên hiến máu</p>
            <p className="text-xs text-gray-400 mt-1">*Bệnh viện vui lòng liên hệ để được cấp tài khoản</p>
          </div>

          {/* Card */}
          <div className="w-full bg-white rounded-2xl p-7 shadow-md">
            <form onSubmit={handleRegisterSubmit} className="space-y-5">

              {/* Họ và tên */}
              <div>
                <label className={labelClass}>Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className={labelClass}>Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="09xxxxxxxx"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>

              {/* Địa chỉ */}
              <div>
                <label className={labelClass}>Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Số nhà, Đường, Phường, Quận, TP.HCM"
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>

              {/* Mật khẩu */}
              <div>
                <label className={labelClass}>Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div>
                <label className={labelClass}>Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nhóm máu */}
              <div>
                <label className={labelClass}>Nhóm máu</label>
                <select
                  value={registerForm.bloodType}
                  onChange={(e) => setRegisterForm({ ...registerForm, bloodType: e.target.value })}
                  required
                  className={inputClass}
                >
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

              {/* Ngày hiến máu gần nhất */}
              <div>
                <label className={labelClass}>Ngày hiến máu gần nhất (nếu có)</label>
                <input
                  type="date"
                  value={registerForm.lastDonationDate}
                  onChange={(e) => setRegisterForm({ ...registerForm, lastDonationDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">Để trống nếu chưa từng hiến máu</p>
              </div>

              {/* Điều khoản – Checkbox */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={registerForm.agreeToTerms}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreeToTerms: e.target.checked })}
                  className="w-4 h-4 mt-0.5 accent-[#930511] flex-shrink-0 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600 cursor-pointer">
                  Tôi đồng ý với{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-[#930511] font-semibold hover:underline"
                  >
                    điều khoản và điều kiện sử dụng
                  </button>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isRegLoading}
                className="w-full bg-[#930511] text-white font-semibold py-2.5 rounded-lg hover:bg-[#7a0410] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isRegLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đăng ký'
                )}
              </button>
            </form>

            {/* Link to Login */}
            <div className="mt-5 text-center text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-[#930511] font-semibold hover:underline"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TERMS MODAL ───────────────────────────────────────────────────── */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-base font-bold text-gray-900">Điều khoản & Điều kiện sử dụng</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <TermsContent />
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => {
                  setRegisterForm((prev) => ({ ...prev, agreeToTerms: true }));
                  setShowTermsModal(false);
                }}
                className="w-full bg-[#930511] text-white font-semibold py-3 rounded-xl hover:bg-[#7a0410] transition-colors"
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