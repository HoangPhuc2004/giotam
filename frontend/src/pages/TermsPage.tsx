import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FBF2E1]" style={{ fontFamily: 'Times New Roman, serif' }}>
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-center mb-12 text-4xl font-bold uppercase text-[#930511]">Điều khoản & Điều kiện</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-bold text-center mb-8 uppercase text-[#930511]">
              Điều khoản và điều kiện sử dụng nền tảng điều phối hiến máu "Giọt Ấm"
            </h2>

            <div className="space-y-8 text-base leading-relaxed text-gray-800">
              <section>
                <p className="font-bold mb-2 text-lg">Lời mở đầu:</p>
                <p className="mb-2">Chào mừng Quý vị đến với "Giọt Ấm" – Nền tảng công nghệ hỗ trợ điều phối kêu gọi hiến máu khẩn cấp. Bằng việc tạo tài khoản, truy cập và sử dụng dịch vụ trên Nền tảng, Quý vị xác nhận đã đọc, hiểu rõ và chấp thuận hoàn toàn các điều khoản, điều kiện và chính sách được quy định dưới đây.</p>
                <p>Văn bản này cấu thành một thỏa thuận pháp lý có giá trị ràng buộc giữa Dự án Giọt Ấm và Người sử dụng (bao gồm Tình nguyện viên và Cơ sở Y tế/Tổ chức).</p>
              </section>

              <section>
                <h3 className="font-bold text-xl mb-4 uppercase text-[#930511]">Chương I. Quy định chung về bản chất dịch vụ</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li><span className="font-bold">Bản chất hoạt động:</span> Giọt Ấm hoạt động hoàn toàn trên tôn chỉ nhân đạo, phi lợi nhuận. Giọt Ấm định vị là một công cụ công nghệ trung gian hỗ trợ cung cấp thông tin và kết nối vị trí địa lý; Giọt Ấm <span className="font-bold">không</span> phải là cơ sở khám chữa bệnh, trung tâm lưu trữ máu hay đơn vị cung cấp dịch vụ y tế.</li>
                  <li><span className="font-bold">Nghiêm cấm thương mại hóa:</span> Mọi hành vi lợi dụng Nền tảng để thỏa thuận, mua bán máu, tạng hoặc trục lợi tài chính dưới mọi hình thức đều bị nghiêm cấm tuyệt đối. Giọt Ấm có quyền vô hiệu hóa tài khoản và cung cấp hồ sơ cho cơ quan chức năng đối với các cá nhân/tổ chức vi phạm.</li>
                </ol>
              </section>

              <section>
                <h3 className="font-bold text-xl mb-4 uppercase text-[#930511]">Chương II. Thỏa thuận giữa Giọt Ấm và Tình nguyện viên (Người hiến máu)</h3>
                <p className="font-bold mb-3 text-lg">Điều 1. Điều kiện tham gia và Nghĩa vụ cung cấp thông tin</p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                  <li>Tình nguyện viên phải là công dân từ đủ 18 tuổi trở lên, có đầy đủ năng lực hành vi dân sự.</li>
                  <li>Tình nguyện viên cam kết cung cấp thông tin cá nhân và dữ liệu sinh trắc học y tế (nhóm máu hệ ABO, Rh, lịch sử bệnh lý, và thời gian hiến máu gần nhất) một cách trung thực và chính xác tuyệt đối.</li>
                  <li>Mọi hành vi cố tình khai báo sai lệch nhằm vượt qua bộ lọc an toàn của hệ thống sẽ do Tình nguyện viên tự chịu trách nhiệm hoàn toàn trước pháp luật và về các rủi ro sức khỏe cá nhân.</li>
                </ul>

                <p className="font-bold mb-3 text-lg">Điều 2. Miễn trừ trách nhiệm đối với Tình nguyện viên</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>Giọt Ấm không bảo đảm Tình nguyện viên sẽ đủ điều kiện hiến máu khi đến cơ sở y tế. Quyết định tiếp nhận máu phụ thuộc hoàn toàn vào kết quả sàng lọc lâm sàng của y bác sĩ tại thời điểm thực tế.</li>
                  <li>Nền tảng được miễn trừ mọi trách nhiệm pháp lý liên quan đến bất kỳ sự cố y khoa, tai biến, lây nhiễm chéo hoặc tổn hại sức khỏe nào xảy ra đối với Tình nguyện viên trong và sau quá trình hiến máu.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-xl mb-4 uppercase text-[#930511]">Chương III. Thỏa thuận giữa Giọt Ấm và Cơ sở Y tế / Tổ chức sử dụng máu</h3>
                <p className="font-bold mb-3 text-lg">Điều 3. Xác thực định danh và Quyền sử dụng</p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                  <li>Cơ sở y tế/Tổ chức (Bệnh viện, Phòng khám, Câu lạc bộ) phải trải qua quy trình xác thực (KYC) bằng cách cung cấp giấy phép hoạt động hoặc giấy giới thiệu hợp lệ từ cơ quan có thẩm quyền để được cấp tài khoản Quản trị viên (Admin).</li>
                  <li>Tổ chức cam kết chỉ sử dụng tính năng "Phát lệnh khẩn cấp" cho các ca cấp cứu thực tế mang tính sống còn. Nghiêm cấm việc lạm dụng hệ thống báo động cho mục đích thử nghiệm, diễn tập (khi chưa thông báo trước) hoặc chạy chỉ tiêu phong trào, gây ảnh hưởng đến tính khả dụng của Nền tảng.</li>
                </ul>

                <p className="font-bold mb-3 text-lg">Điều 4. Trách nhiệm chuyên môn Y khoa và Miễn trừ trách nhiệm</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><span className="font-bold">Trách nhiệm sàng lọc:</span> Cơ sở y tế chịu trách nhiệm pháp lý cao nhất và duy nhất trong việc thực hiện đúng, đủ các quy trình xét nghiệm, sàng lọc lâm sàng và lưu trữ máu theo chuẩn quy định của Bộ Y tế trước khi tiến hành lấy máu và truyền máu. Không được phép bỏ qua các bước kiểm tra y tế dựa trên dữ liệu hiển thị từ ứng dụng Giọt Ấm.</li>
                  <li><span className="font-bold">Miễn trừ rủi ro cung ứng:</span> Thuật toán Nền tảng chỉ mang tính hỗ trợ xác suất tìm kiếm. Giọt Ấm không cam kết, không bảo đảm sẽ luôn điều phối thành công nguồn máu hoặc Tình nguyện viên sẽ có mặt kịp thời. Nền tảng không chịu trách nhiệm dân sự hay hình sự đối với các tổn thất sinh mạng, di chứng của bệnh nhân do sự thiếu hụt hoặc chậm trễ nguồn cung máu.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-xl mb-4 uppercase text-[#930511]">Chương IV. Chính sách bảo mật và Quyền riêng tư của Người dùng</h3>
                <p className="font-bold mb-3 text-lg">Điều 5. Thu thập và Xử lý Dữ liệu</p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                  <li><span className="font-bold">Dữ liệu Vị trí (Geo-location):</span> Hệ thống chỉ thu thập dữ liệu định vị toàn cầu (GPS) của Người dùng để phục vụ duy nhất cho thuật toán đo lường khoảng cách. Dữ liệu này được mã hóa và ẩn danh trên máy chủ; Cơ sở y tế không thể theo dõi vị trí trực tiếp của Tình nguyện viên.</li>
                  <li><span className="font-bold">Quy tắc chia sẻ thông tin:</span> Thông tin định danh (Họ tên, Số điện thoại) của Tình nguyện viên được bảo mật tuyệt đối và <span className="font-bold underline">chỉ được chia sẻ</span> cho Cơ sở y tế khi và chỉ khi Tình nguyện viên chủ động <span className="underline">nhấn</span> xác nhận tham gia ca hiến máu khẩn cấp đó.</li>
                </ul>

                <p className="font-bold mb-3 text-lg">Điều 6. Cam kết không thương mại hóa dữ liệu</p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                  <li>Giọt Ấm cam kết không bán, trao đổi, cho thuê hoặc chuyển giao bất kỳ dữ liệu cá nhân, dữ liệu y tế nào của Người dùng cho bên thứ ba vì mục đích quảng cáo, tiếp thị hay thương mại.</li>
                </ul>

                <p className="font-bold mb-3 text-lg">Điều 7. Quyền kiểm soát dữ liệu của Người dùng</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>Người dùng có toàn quyền truy cập, trích xuất và chỉnh sửa hồ sơ thông tin cá nhân.</li>
                  <li><span className="font-bold">Quyền được lãng quên:</span> Bất cứ lúc nào, Người dùng có quyền gửi yêu cầu xóa vĩnh viễn toàn bộ dữ liệu cá nhân và lịch sử hoạt động của mình khỏi hệ thống máy chủ đám mây của Giọt Ấm.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-xl mb-4 uppercase text-[#930511]">Chương V. Sự cố kỹ thuật và Bất khả kháng</h3>
                <p className="font-bold mb-3 text-lg">Điều 8. Gián đoạn dịch vụ</p>
                <ul className="list-disc pl-6 space-y-3 mb-8">
                  <li>Nền tảng có thể bị gián đoạn do bảo trì, lỗi máy chủ đám mây, lỗi API của bên thứ ba (như hệ thống bản đồ) hoặc các sự kiện bất khả kháng (thiên tai, sự cố viễn thông quốc gia). Giọt Ấm được miễn trừ mọi trách nhiệm bồi thường đối với các thiệt hại trực tiếp hoặc gián tiếp phát sinh từ việc Nền tảng không thể truy cập được trong những khoảng thời gian này.</li>
                </ul>
                
                <p className="italic text-center text-gray-500 pt-8 border-t border-gray-200">
                  (Văn bản này được cập nhật lần cuối vào ngày 28 tháng 03 năm 2026 và có hiệu lực kể từ thời điểm Người dùng nhấn nút đăng ký tài khoản trên ứng dụng / website).
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
