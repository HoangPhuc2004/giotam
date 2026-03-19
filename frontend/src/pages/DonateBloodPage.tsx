import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/api';
import { Calendar, MapPin, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface HealthQuestion {
  id: string;
  answer: boolean | null;
  vaccineType?: string;
}

export default function DonateBloodPage() {
  const navigate = useNavigate();
  // Check auth & declaration cache
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Bạn cần đăng nhập để đăng ký hiến máu');
      navigate('/login');
    } else {
      try {
        const user = JSON.parse(userStr);
        const stored = localStorage.getItem(`health_declaration_${user.id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          const daysDiff = (new Date().getTime() - new Date(parsed.date).getTime()) / (1000 * 3600 * 24);
          if (daysDiff <= 90 && user.donations_count === parsed.donationsCount) {
             setDeclarationCompleted(true);
          } else {
             localStorage.removeItem(`health_declaration_${user.id}`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [navigate]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  // Health declaration completion state
  const [declarationCompleted, setDeclarationCompleted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Locations from backend
  const [locations, setLocations] = useState<any[]>([]);

  // Health questions state
  const [healthQuestions, setHealthQuestions] = useState<Record<string, HealthQuestion>>({
    q1: { id: 'q1', answer: null },
    q2: { id: 'q2', answer: null },
    q3_1: { id: 'q3_1', answer: null },
    q3_2: { id: 'q3_2', answer: null },
    q3_3: { id: 'q3_3', answer: null },
    q3_4: { id: 'q3_4', answer: null },
    q3_5: { id: 'q3_5', answer: null },
    q3_6: { id: 'q3_6', answer: null },
    q3_7: { id: 'q3_7', answer: null },
    q3_8: { id: 'q3_8', answer: null, vaccineType: '' },
    q3_9: { id: 'q3_9', answer: null },
    q4_1: { id: 'q4_1', answer: null },
    q4_2: { id: 'q4_2', answer: null },
    q5_1: { id: 'q5_1', answer: null },
    q5_2: { id: 'q5_2', answer: null },
    q6: { id: 'q6', answer: null },
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/blood-requests');
        const formattedLocations = response.data.blood_requests.map((r: any) => ({
          id: r.id,
          name: r.hospital_name || r.hospital_address || 'Bệnh viện',
          address: `Cần nhóm máu: ${r.blood_type} - Lượng: ${r.amount_ml}ml - Độ khẩn cấp: ${r.urgency}`,
          available: r.status === 'open'
        }));
        setLocations(formattedLocations);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
    if (declarationCompleted) fetchRequests();
  }, [declarationCompleted]);

  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
  ];

  const handleAnswerChange = (questionId: string, answer: boolean) => {
    setHealthQuestions({
      ...healthQuestions,
      [questionId]: { ...healthQuestions[questionId], answer },
    });
  };

  const allQuestionsAnswered = () => {
    return Object.values(healthQuestions).every((q) => {
      if (q.id === 'q3_8' && q.answer === true) {
        return q.vaccineType && q.vaccineType.trim() !== '';
      }
      return q.answer !== null;
    });
  };

  const handleConfirmDeclaration = () => {
    if (allQuestionsAnswered() && agreedToTerms) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          localStorage.setItem(`health_declaration_${user.id}`, JSON.stringify({
            date: new Date().toISOString(),
            donationsCount: user.donations_count || 0
          }));
        } catch (e) {
          console.error(e);
        }
      }
      setDeclarationCompleted(true);
      window.scrollTo(0, 0);
    }
  };

  const handleRegistrationSubmit = async () => {
    try {
      const selectedLoc = locations.find(l => l.name === selectedLocation);
      if (!selectedLoc) return;

      const userStr = localStorage.getItem('user');
      if (!userStr) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }
      const user = JSON.parse(userStr);
      
      const response = await api.post(`/blood-requests/${selectedLoc.id}/register`, {
        donor_id: user.id,
        time_slot: selectedTime
      });

      toast.success(response.data.message || 'Đăng ký hiến máu thành công!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Lỗi khi đăng ký hiến máu');
    }
  };

  const QuestionRow = ({ questionId, text }: { questionId: string; text: string }) => (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-4 rounded-lg transition-colors">
      <p className="text-gray-700 flex-1">{text}</p>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => handleAnswerChange(questionId, true)}
          className={`px-6 py-2 rounded-md font-medium transition-all ${
            healthQuestions[questionId].answer === true
              ? 'bg-[#930511] text-white border-transparent'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#930511]/30'
          }`}
        >
          Có
        </button>
        <button
          onClick={() => handleAnswerChange(questionId, false)}
          className={`px-6 py-2 rounded-md font-medium transition-all ${
            healthQuestions[questionId].answer === false
              ? 'bg-[#930511] text-white border-transparent'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#930511]/30'
          }`}
        >
          Không
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF2E1] flex flex-col" style={{ fontFamily: 'Times New Roman, serif' }}>
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!declarationCompleted ? (
            <>
              <h1 className="text-center mb-8 text-4xl font-bold uppercase text-[#930511]">Kê khai sức khỏe</h1>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Vui lòng trung thực kê khai các thông tin dưới đây để đảm bảo an toàn cho bản thân và người nhận máu.</p>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Questions */}
                <div className="p-8 space-y-8">
                  <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-lg text-[#930511]">1. Quý vị đã từng hiến máu chưa?</h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-100">
                      <QuestionRow questionId="q1" text="" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-lg text-[#930511]">2. Quý vị đã từng mắc các bệnh như tâm thần, thần kinh, hô hấp, tiêu hóa, gan, tim mạch?</h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-100">
                      <QuestionRow questionId="q2" text="" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-lg text-[#930511]">3. Trong vòng 6 tháng gần đây, Quý vị có:</h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-100 divide-y divide-gray-100">
                      <QuestionRow questionId="q3_1" text="Sút cân >= 4kg không rõ nguyên nhân? nổi hạch kéo dài?" />
                      <QuestionRow questionId="q3_2" text="Phẫu thuật?" />
                      <QuestionRow questionId="q3_3" text="Xăm mình, xỏ lỗ tai, lỗ mũi, châm cứu?" />
                      <QuestionRow questionId="q3_4" text="Được truyền máu, chế phẩm máu?" />
                      <QuestionRow questionId="q3_5" text="Sử dụng ma túy, tiêm chích?" />
                      <QuestionRow questionId="q3_6" text="Quan hệ tình dục với người nhiễm hoặc có nguy cơ lây nhiễm HIV, viêm gan?" />
                      <QuestionRow questionId="q3_7" text="Quan hệ tình dục với nhiều người và/hoặc không có biện pháp an toàn?" />
                      <div className="px-4 py-4 hover:bg-gray-50/50 transition-colors">
                         <div className="flex items-center justify-between gap-4 mb-2">
                            <p className="text-gray-700 flex-1">Tiêm vắc xin phòng bệnh?</p>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleAnswerChange('q3_8', true)} className={`px-6 py-2 rounded-md font-medium transition-all ${healthQuestions.q3_8.answer === true ? 'bg-[#930511] text-white border-transparent' : 'bg-white text-gray-700 border border-gray-300'}`}>Có</button>
                                <button onClick={() => handleAnswerChange('q3_8', false)} className={`px-6 py-2 rounded-md font-medium transition-all ${healthQuestions.q3_8.answer === false ? 'bg-[#930511] text-white border-transparent' : 'bg-white text-gray-700 border border-gray-300'}`}>Không</button>
                            </div>
                         </div>
                         {healthQuestions.q3_8.answer === true && (
                            <div className="pl-4 pt-2 border-l-4 border-[#930511]/20 ml-2">
                                <input type="text" placeholder="Nhập tên loại vắc xin..." value={healthQuestions.q3_8.vaccineType} onChange={(e) => setHealthQuestions({...healthQuestions, q3_8: {...healthQuestions.q3_8, vaccineType: e.target.value}})} className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#930511] outline-none" />
                            </div>
                         )}
                      </div>
                      <QuestionRow questionId="q3_9" text="Có đến/ở vùng có dịch lưu hành (sốt xuất huyết, sốt rét, Covid-19...)?" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-lg text-[#930511]">4. Trong vòng 02 tuần gần đây, Quý vị có:</h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-100 divide-y divide-gray-100">
                      <QuestionRow questionId="q4_1" text="Tiếp xúc với người bệnh/nghi ngờ nhiễm Covid-19?" />
                      <QuestionRow questionId="q4_2" text="Xuất hiện các dấu hiệu: sốt, ho, khó thở, tiêu chảy?" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-lg text-[#930511]">5. Trong vòng 01 tuần gần đây, Quý vị có:</h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-100 divide-y divide-gray-100">
                      <QuestionRow questionId="q5_1" text="Dùng thuốc kháng sinh, Aspirin, Corticoid,...?" />
                      <QuestionRow questionId="q5_2" text="Đi khám sức khỏe, làm xét nghiệm, chữa răng?" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-lg text-[#930511]">6. Đối tượng khuyết tật nặng?</h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-100">
                      <QuestionRow questionId="q6" text="" />
                    </div>
                  </div>

                  {/* Commitment */}
                  <div className="mt-8 bg-red-50 p-6 rounded-xl border border-red-100">
                    <h3 className="font-bold text-lg text-[#930511] mb-4">Cam kết</h3>
                    <div className="text-gray-700 space-y-2 mb-6 text-sm">
                      <p>Tôi đã đọc, hiểu rõ, trả lời trung thực và cam kết chịu trách nhiệm về các thông tin cá nhân và các câu hỏi dành cho người hiến máu.</p>
                      <p>Tôi đồng ý việc đơn vị máu của tôi được xét nghiệm sàng lọc giang mai, viêm gan B, viêm gan C và HIV theo quy định hiện hành.</p>
                      <p className="font-bold">Hôm nay, tôi hoàn toàn khỏe mạnh và tình nguyện sẵn sàng hiến máu.</p>
                    </div>
                    
                    <label className="flex items-center space-x-3 cursor-pointer bg-white p-4 rounded-md border border-red-200">
                      <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="w-5 h-5 text-[#930511] rounded focus:ring-[#930511]" />
                      <span className="font-bold text-gray-800">Tôi cam kết những thông tin trên là đúng sự thật</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button onClick={handleConfirmDeclaration} disabled={!allQuestionsAnswered() || !agreedToTerms} className={`w-full py-4 text-white font-bold rounded-lg text-lg transition-all ${allQuestionsAnswered() && agreedToTerms ? 'bg-[#930511] hover:bg-black hover:text-white' : 'bg-gray-300 cursor-not-allowed'}`}>
                      GỬI YÊU CẦU KÊ KHAI SỨC KHOẺ
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b">
                  <h1 className="text-3xl font-bold uppercase text-[#930511]">Chọn lịch hiến máu</h1>
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">Đã kê khai y tế</span>
                  </div>
                </div>

                {/* Loaction List */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Hệ thống nhận hiến máu (Từ yêu cầu gửi lên)</h3>
                  {locations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {locations.map((loc) => (
                        <button key={loc.id} onClick={() => loc.available && setSelectedLocation(loc.name)} disabled={!loc.available} className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${selectedLocation === loc.name ? 'border-[#930511] bg-red-50' : loc.available ? 'border-gray-200 hover:border-red-300 bg-white' : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'}`}>
                          <div className="font-bold text-lg text-gray-800 mb-1 pr-6">{loc.name}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {loc.address}
                          </div>
                          {selectedLocation === loc.name && (
                            <div className="absolute top-2 right-2 flex bg-[#930511] text-white rounded-full p-1"><CheckCircle2 className="w-4 h-4" /></div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 border border-gray-200 border-dashed rounded-lg">
                      Hiện tại không có bệnh viện nào gửi yêu cầu nhận máu.
                    </div>
                  )}
                </div>

                {/* Date & Time Lists */}
                {selectedLocation && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-bold text-gray-800 mb-4 text-lg">1. Chọn ngày</h3>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                           <span className="font-bold">Tháng 1, 2026</span>
                           <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                           {[22, 23, 24, 25, 26, 27, 28].map((d) => (
                             <button key={d} onClick={() => setSelectedDate(new Date(2026, 0, d))} className={`aspect-square rounded-lg flex items-center justify-center font-bold ${selectedDate?.getDate() === d ? 'bg-[#930511] text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-red-50 hover:text-[#930511]'}`}>
                               {d}
                             </button>
                           ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-4 text-lg">2. Chọn khung giờ hẹn</h3>
                      <div className="grid grid-cols-2 gap-3">
                         {timeSlots.map(slot => (
                           <button key={slot} onClick={() => setSelectedTime(slot)} className={`p-3 rounded-lg border-2 font-medium transition-all ${selectedTime === slot ? 'border-[#930511] bg-red-50 text-[#930511]' : 'border-gray-200 hover:border-red-300 text-gray-600 bg-white'}`}>
                             <div className="flex justify-center items-center gap-2">
                                <Clock className="w-4 h-4" /> <span>{slot}</span>
                             </div>
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedLocation && selectedDate && selectedTime && (
                   <div className="pt-6 border-t border-gray-200">
                      <button onClick={handleRegistrationSubmit} className="w-full bg-[#930511] text-white py-4 rounded-xl font-bold text-xl hover:bg-black transition-colors shadow-lg shadow-red-500/30">
                        XÁC NHẬN ĐẶT LỊCH HIẾN MÁU
                      </button>
                      <p className="text-center text-gray-500 text-sm mt-3">Một thông báo SMS / Email sẽ được gửi cho bạn nếu bệnh viện duyệt yêu cầu.</p>
                   </div>
                )}
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
