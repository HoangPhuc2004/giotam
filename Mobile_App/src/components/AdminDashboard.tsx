import { useState, useEffect } from 'react';
import { Users, Hospital, TrendingUp, LogOut, CheckCircle, Search, Droplet, Phone, MapPin, Send } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';

interface AdminDashboardProps {
  onLogout: () => void;
  userRole?: string;
}

interface PendingRecord {
  record_id: number;
  user_name: string;
  phone: string;
  blood_type: string;
  donation_date: string;
}

export function AdminDashboard({ onLogout, userRole = 'admin' }: AdminDashboardProps) {
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
    // In a real app we'd fetch this from the backend
    // For now, we will mock the chart data and try to fetch summary counts
    const fetchStats = async () => {
      try {
        const userRes = await api.get('/users');
        const hospitalRes = await api.get('/hospitals');
        const totalUsers = userRes.data.count || 0;
        const totalHospitals = hospitalRes.data.count || 0;
        setStats({ users: totalUsers, hospitals: totalHospitals });

        // Mock chart data based on retrieved values for demonstration
        setChartData([
          { name: 'T1', donors: Math.max(1, totalUsers - 5) },
          { name: 'T2', donors: Math.max(2, totalUsers - 3) },
          { name: 'T3', donors: Math.max(3, totalUsers - 1) },
          { name: 'T4', donors: totalUsers },
        ]);
      } catch (error) {
        console.error('Error fetching admin stats', error);
        // Fallback mock data
        setStats({ users: 15, hospitals: 3 });
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

      // Refresh list
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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/create_alert`, {
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
      setSelectedDonors(searchResults.map(result => result.user.id));
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notify_donors`, {
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
  };  return (
    <div className="min-h-full bg-background pb-24 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-destructive px-6 pt-12 pb-6 rounded-b-[40px] shadow-lg sticky top-0 z-10 w-[393px]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {userRole === 'hospital' ? 'Hospital Dashboard' : 'Admin Dashboard'}
          </h1>
          <button onClick={onLogout} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-white/80 mt-2 text-sm">
          {userRole === 'hospital' ? 'Quản lý yêu cầu hiến máu' : 'Quản lý hệ thống Giọt Ấm'}
        </p>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center border border-muted">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-destructive" />
            </div>
            <div className="text-xl font-bold text-foreground">{stats.users}</div>
            <div className="text-[10px] text-muted-foreground mt-1 text-center">Tình nguyện viên</div>
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center border border-muted">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Hospital className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-foreground">{stats.hospitals}</div>
            <div className="text-[10px] text-muted-foreground mt-1 text-center">Bệnh viện</div>
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center border border-primary/20">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-xl font-bold text-foreground">{stats.accepted}</div>
            <div className="text-[10px] text-muted-foreground mt-1 text-center font-bold text-green-600">Ca chờ hiến</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-muted">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-bold text-foreground">Tăng trưởng người hiến</h2>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                  dataKey="donors"
                  fill="#930511"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>   {/* <--- THÊM DÒNG NÀY VÀO ĐÂY */}
          </div>
        </div>

        {/* Section Bệnh viện Tìm kiếm TNV */}
        {userRole === 'hospital' && (
          <div className="bg-[#FBF2E1] rounded-3xl p-6 shadow-lg border border-[#e5d5b7] mt-6">
            <h2 className="text-lg font-bold text-foreground mb-1">Tìm người hiến máu</h2>
            <p className="text-xs text-muted-foreground mb-4">Gửi thông báo khẩn cấp tới những tình nguyện viên phù hợp xung quanh theo bán kính.</p>
            
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <select 
                  className="w-full h-10 bg-white border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-destructive"
                  value={filters.bloodType}
                  onChange={(e) => setFilters(prev => ({...prev, bloodType: e.target.value}))}
                >
                  <option value="O+">Nhóm O+</option>
                  <option value="O-">Nhóm O-</option>
                  <option value="A+">Nhóm A+</option>
                  <option value="A-">Nhóm A-</option>
                  <option value="B+">Nhóm B+</option>
                  <option value="B-">Nhóm B-</option>
                  <option value="AB+">Nhóm AB+</option>
                  <option value="AB-">Nhóm AB-</option>
                </select>
              </div>
              <div className="w-[100px]">
                <select 
                  className="w-full h-10 bg-white border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-destructive"
                  value={filters.radius}
                  onChange={(e) => setFilters(prev => ({...prev, radius: e.target.value}))}
                >
                  {[3, 5, 10, 15, 20].map(r => <option key={r} value={r}>{r} km</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleSearchDonors} disabled={isSearching}
              className="w-full bg-destructive text-white h-10 rounded-lg text-sm font-bold flex items-center justify-center disabled:opacity-70"
            >
              <Search className="w-4 h-4 mr-2" /> {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
            </button>

            {searchError && <p className="text-xs text-red-600 mt-2 text-center">{searchError}</p>}

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 border-t border-[#e5d5b7] pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-destructive" checked={selectedDonors.length === searchResults.length} onChange={handleSelectAll} />
                    <span>Chọn tất cả ({selectedDonors.length}/{searchResults.length})</span>
                  </label>
                  <button onClick={handleBulkContact} disabled={isSearching || selectedDonors.length === 0} className="bg-destructive text-white text-sm px-4 py-2 rounded-lg font-bold disabled:opacity-50 flex items-center">
                    <Send className="w-4 h-4 mr-1.5" /> Gửi
                  </button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {searchResults.map(result => (
                    <label key={result.user.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedDonors.includes(result.user.id) ? 'bg-[#fbe4e6] border-destructive' : 'bg-white border-transparent hover:bg-white/60'}`}>
                      <input type="checkbox" className="w-4 h-4 rounded accent-destructive shrink-0" checked={selectedDonors.includes(result.user.id)} onChange={() => handleSelectDonor(result.user.id)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-sm text-foreground truncate">{result.user.name}</h4>
                          <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center shrink-0">
                            <Droplet className="w-2.5 h-2.5 mr-0.5" /> {result.user.blood_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {result.user.phone}</span>
                          <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {result.distance_km.toFixed(1)} km</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pending Donations Table */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-muted mt-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Người đã xác nhận tham gia</h2>
            <button
              onClick={fetchPendingDonations}
              disabled={isLoadingPending}
              className="text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              {isLoadingPending ? 'Đang tải...' : '🔄 Làm mới'}
            </button>
          </div>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm text-left text-muted-foreground whitespace-nowrap">
              <thead className="text-xs text-foreground uppercase bg-muted/50 rounded-t-lg">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-tl-lg rounded-bl-lg font-semibold">Tên</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-center">Nhóm máu</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-center">SĐT</th>
                  <th scope="col" className="px-4 py-3 rounded-tr-lg rounded-br-lg font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-foreground/60 italic">Không có người chờ hiến máu</td>
                  </tr>
                ) : (
                  pendingRecords.map((record) => (
                    <tr key={record.record_id} className="border-b border-muted/30 last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{record.user_name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-destructive/10 text-destructive text-xs font-bold px-2.5 py-1 rounded-full">{record.blood_type || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-3 text-center">{record.phone}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenConfirm(record.record_id)}
                          className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          Xác nhận
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-foreground mb-2">Xác nhận hiến máu</h3>
            <p className="text-sm text-muted-foreground mb-6">Vui lòng nhập dung tích máu thực tế (ml)</p>

            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Chọn mức thể tích</label>
                <div className="flex gap-2">
                  <button onClick={() => setAmountMl('250')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${amountMl === '250' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border text-foreground hover:bg-muted'}`}>250 ml</button>
                  <button onClick={() => setAmountMl('350')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${amountMl === '350' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border text-foreground hover:bg-muted'}`}>350 ml</button>
                  <button onClick={() => setAmountMl('450')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${amountMl === '450' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border text-foreground hover:bg-muted'}`}>450 ml</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hoặc nhập dung tích khác (ml)</label>
                <input
                  type="number"
                  value={amountMl}
                  onChange={(e) => setAmountMl(e.target.value)}
                  className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDonation}
                className="flex-1 py-3 bg-destructive text-white font-bold rounded-xl hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/30"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
