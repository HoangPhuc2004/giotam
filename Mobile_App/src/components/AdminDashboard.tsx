import { useState, useEffect } from 'react';
import { Users, Hospital, TrendingUp, LogOut, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface PendingRecord {
  record_id: number;
  user_name: string;
  phone: string;
  blood_type: string;
  donation_date: string;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState({ users: 0, hospitals: 0, accepted: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [pendingRecords, setPendingRecords] = useState<PendingRecord[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [amountMl, setAmountMl] = useState('350');
  const [toastMessage, setToastMessage] = useState('');

  const [isLoadingPending, setIsLoadingPending] = useState(false);

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


  return (
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
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <button onClick={onLogout} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-white/80 mt-2 text-sm">Quản lý hệ thống Giọt Ấm</p>
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
