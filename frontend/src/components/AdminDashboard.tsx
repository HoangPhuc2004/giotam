import { useState, useEffect } from 'react';
import { Users, Hospital, TrendingUp, CheckCircle, Search, Droplet, Phone, MapPin, Send } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/api';

interface AdminDashboardProps {
  userRole?: string;
}

interface PendingRecord {
  record_id: number;
  user_name: string;
  phone: string;
  blood_type: string;
  donation_date: string;
}

export default function AdminDashboard({ userRole = 'admin' }: AdminDashboardProps) {
  const [stats, setStats] = useState({ users: 0, hospitals: 0, accepted: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [pendingRecords, setPendingRecords] = useState<PendingRecord[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [amountMl, setAmountMl] = useState('350');
  const [toastMessage, setToastMessage] = useState('');

  const [isLoadingPending, setIsLoadingPending] = useState(false);

  // Search TNV States
  const [filters, setFilters] = useState({ bloodType: 'O+', radius: '10' });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedDonors, setSelectedDonors] = useState<number[]>([]);

  const fetchPendingDonations = async () => {
    setIsLoadingPending(true);
    try {
      const pendingRes = await api.get('/admin/pending_donations');
      setPendingRecords(pendingRes.data.pending_donations || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách pending:', error);
    } finally {
      setIsLoadingPending(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userRes = await api.get('/users');
        const hospitalRes = await api.get('/hospitals');
        const totalUsers = userRes.data.count || 0;
        const totalHospitals = hospitalRes.data.count || 0;
        setStats({ users: totalUsers, hospitals: totalHospitals, accepted: 0 }); // accepted can be dynamic later

        setChartData([
          { name: 'T1', donors: Math.max(1, totalUsers - 5) },
          { name: 'T2', donors: Math.max(2, totalUsers - 3) },
          { name: 'T3', donors: Math.max(3, totalUsers - 1) },
          { name: 'T4', donors: totalUsers },
        ]);
      } catch (error) {
        console.error('Error fetching admin stats', error);
        setStats({ users: 15, hospitals: 3, accepted: 0 });
        setChartData([
          { name: 'T1', donors: 8 },
          { name: 'T2', donors: 12 },
          { name: 'T3', donors: 10 },
          { name: 'T4', donors: 15 },
        ]);
      }
    };

    fetchStats();
    fetchPendingDonations();
  }, []);

  const handleOpenConfirm = (recordId: number) => {
    setSelectedRecordId(recordId);
    setAmountMl('350');
    setShowConfirmModal(true);
  };

  const handleConfirmDonation = async () => {
    if (!selectedRecordId) return;
    try {
      await api.post(`/admin/confirm_donation/${selectedRecordId}`, {
        amount_ml: parseInt(amountMl, 10),
      });
      setShowConfirmModal(false);
      setToastMessage('Ghi nhận thành công');
      setTimeout(() => setToastMessage(''), 3000);

      fetchPendingDonations();
    } catch (error) {
      console.error('Lỗi khi xác nhận hiến máu:', error);
      alert('Có lỗi xảy ra khi xác nhận!');
    }
  };

  // Logic Tìm Kiếm TNV
  const handleSearchDonors = async () => {
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setSelectedDonors([]);

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const hospitalId = user?.id || 1;

      const searchPayload = {
        hospital_id: hospitalId,
        blood_type: filters.bloodType,
        radius_km: parseInt(filters.radius, 10),
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/create_alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchPayload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Lỗi ${response.status}`);

      setSearchResults(result.top_50_users || []);
      if (!result.top_50_users || result.top_50_users.length === 0) {
        setToastMessage("Không tìm thấy người phù hợp.");
        setTimeout(() => setToastMessage(''), 3000);
      } else {
        setToastMessage(`Tìm thấy ${result.top_50_users.length} TNV.`);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (error: any) {
      setSearchError(`Lỗi tìm kiếm: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectDonor = (donorId: number) => {
    setSelectedDonors(prev => {
      if (prev.includes(donorId)) return prev.filter(id => id !== donorId);
      return [...prev, donorId];
    });
  };

  const handleSelectAll = () => {
    if (selectedDonors.length === searchResults.length) {
      setSelectedDonors([]);
    } else {
      setSelectedDonors(searchResults.map((result: any) => result.user.id));
    }
  };

  const handleBulkContact = async () => {
    if (selectedDonors.length === 0) {
      setToastMessage("Vui lòng chọn ít nhất một người");
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    setIsSearching(true);
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const hospitalName = user?.name || "Bệnh viện";
    const hospitalAddress = user?.address || "địa chỉ hiển thị trên trang chủ";
    const bloodTypeNeeded = filters.bloodType;

    const messageBody = `[GIOT AM] KHẨN CẤP! Bệnh viện ${hospitalName} đang cần gấp nhóm máu ${bloodTypeNeeded}. Xin vui lòng hiến máu tại: ${hospitalAddress}. Trân trọng cảm ơn!`;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notify_donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_ids: selectedDonors,
          message: messageBody
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Lỗi không xác định');

      setToastMessage(result.message || 'Đã gửi yêu cầu.');
      setTimeout(() => setToastMessage(''), 3000);
      setSelectedDonors([]);
    } catch (error: any) {
      setSearchError(`Gửi thông báo thất bại: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 pb-12 relative w-full overflow-hidden">
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="bg-[#930511] px-6 pt-8 pb-6 shadow-md w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {userRole === 'hospital' ? 'Hospital Dashboard' : 'Admin Dashboard'}
          </h1>
        </div>
        <p className="text-white/80 mt-2 text-sm md:text-base">
          {userRole === 'hospital' ? 'Quản lý yêu cầu hiến máu' : 'Quản lý hệ thống Giọt Ấm'}
        </p>
      </div>

      <div className="px-6 mt-8 space-y-8 max-w-7xl mx-auto">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-[#930511]" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.users}</div>
            <div className="text-sm text-gray-500 mt-2 font-medium">Tình nguyện viên</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Hospital className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.hospitals}</div>
            <div className="text-sm text-gray-500 mt-2 font-medium">Bệnh viện</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{pendingRecords.length}</div>
            <div className="text-sm mt-2 font-bold text-green-600">Ca chờ hiến</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-[#930511]" />
            <h2 className="text-xl font-bold text-gray-900">Tăng trưởng người hiến</h2>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="donors" fill="#930511" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Bệnh viện Tìm kiếm TNV đã được gỡ bỏ khỏi Web Dashboard theo yêu cầu */}

        {/* Pending Donations Table */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Người đã xác nhận tham gia</h2>
            <button
              onClick={fetchPendingDonations}
              disabled={isLoadingPending}
              className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 px-4 py-2 rounded-xl font-bold transition-colors"
            >
              {isLoadingPending ? 'Đang tải...' : '🔄 Làm mới'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-600 whitespace-nowrap">
              <thead className="text-sm text-gray-900 uppercase bg-gray-50/50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold rounded-tl-xl text-left">Tên</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Nhóm máu</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Số điện thoại</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right rounded-tr-xl">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400 italic">Không có người chờ hiến máu</td>
                  </tr>
                ) : (
                  pendingRecords.map((record) => (
                     <tr key={record.record_id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{record.user_name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-[#930511]/10 text-[#930511] text-xs font-bold px-3 py-1.5 rounded-full">{record.blood_type || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">{record.phone}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenConfirm(record.record_id)}
                          className="text-sm bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-bold transition-colors shadow-sm"
                        >
                           Xác nhận hoàn tất
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Xác nhận hiến máu</h3>
            <p className="text-base text-gray-500 mb-8">Vui lòng nhập dung tích máu thực tế (ml)</p>

            <div className="mb-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Chọn mức thể tích</label>
                <div className="flex gap-3">
                  <button onClick={() => setAmountMl('250')} className={`flex-1 py-3 rounded-xl text-base font-bold transition-all border-2 ${amountMl === '250' ? 'border-[#930511] bg-[#930511]/10 text-[#930511]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>250 ml</button>
                  <button onClick={() => setAmountMl('350')} className={`flex-1 py-3 rounded-xl text-base font-bold transition-all border-2 ${amountMl === '350' ? 'border-[#930511] bg-[#930511]/10 text-[#930511]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>350 ml</button>
                  <button onClick={() => setAmountMl('450')} className={`flex-1 py-3 rounded-xl text-base font-bold transition-all border-2 ${amountMl === '450' ? 'border-[#930511] bg-[#930511]/10 text-[#930511]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>450 ml</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Hoặc nhập dung tích khác (ml)</label>
                <input
                  type="number"
                  value={amountMl}
                  onChange={(e) => setAmountMl(e.target.value)}
                  className="w-full h-14 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 text-base font-medium focus:outline-none focus:border-[#930511] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDonation}
                className="flex-1 py-3.5 bg-[#930511] text-white font-bold rounded-xl hover:bg-[#7a0410] transition-colors shadow-lg shadow-[#930511]/30"
              >
                Lưu xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
