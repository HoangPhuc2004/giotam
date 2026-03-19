import { ClipboardList, Calendar, Phone, Clock, ChevronRight, Trophy } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { TimeSlotModal } from './TimeSlotModal';

interface HomeProps {
  onNavigate: (page: string) => void;
}

interface BloodRequest {
  id: number;
  hospital_name: string;
  hospital_address: string;
  blood_type: string;
  amount_ml: number;
  urgency: string;
  note?: string;
  registration_count: number;
}

export function Home({ onNavigate }: HomeProps) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  // Lấy user từ localStorage để biết donor_id
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const donorId = user?.id;

  const fetchBloodRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const res = await api.get('/blood-requests');
      if (res.data?.blood_requests) {
        setBloodRequests(res.data.blood_requests);
      }
    } catch (err) {
      console.error('Failed to fetch blood requests', err);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        if (res.data?.leaderboard) setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      }
    };
    fetchLeaderboard();
    fetchBloodRequests();
  }, [fetchBloodRequests]);

  const mainActions = [
    { id: 'health-declaration', title: 'Kê khai\nsức khỏe', icon: ClipboardList },
    { id: 'register-donation', title: 'Đăng ký\nhiến máu', icon: Calendar },
    { id: 'donation-history', title: 'Lịch sử\nhiến máu', icon: Clock },
    { id: 'hotline', title: 'Hotline\nhỗ trợ', icon: Phone },
  ];

  const urgencyBadgeColor = (urgency: string) => {
    if (urgency === 'Khẩn cấp') return { bg: '#fee2e2', color: '#991b1b' };
    if (urgency === 'Cần gấp') return { bg: '#ffedd5', color: '#c2410c' };
    return { bg: '#dcfce7', color: '#15803d' };
  };

  return (
    <div className="min-h-full bg-background pb-24">
      {/* Main Actions - 4 buttons in a row */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-4 gap-3">
          {mainActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-2">
                  <Icon className="w-7 h-7 text-muted-foreground" strokeWidth={2} />
                </div>
                <span className="text-xs text-foreground text-center leading-tight whitespace-pre-line">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blood Request Section */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-destructive">Yêu cầu hiến máu</h2>
          <button className="text-destructive text-sm font-medium flex items-center gap-1">
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable cards */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
          {requestsLoading ? (
            /* Skeleton loading */
            [1, 2].map((i) => (
              <div key={i} className="min-w-[340px] bg-card rounded-3xl p-6 shadow-lg animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="w-16 h-10 bg-gray-200 rounded mb-2" />
                    <div className="w-20 h-5 bg-gray-200 rounded-full" />
                  </div>
                  <div className="w-16 h-10 bg-gray-200 rounded" />
                </div>
                <div className="w-40 h-4 bg-gray-200 rounded mb-2" />
                <div className="w-28 h-3 bg-gray-200 rounded mb-4" />
                <div className="w-full h-11 bg-gray-200 rounded-xl" />
              </div>
            ))
          ) : bloodRequests.length === 0 ? (
            <div className="min-w-[340px] bg-card rounded-3xl p-6 shadow-lg flex flex-col items-center justify-center text-center gap-2 py-10">
              <span style={{ fontSize: 36 }}>🩸</span>
              <div className="font-semibold text-foreground">Chưa có yêu cầu hiến máu</div>
              <div className="text-sm text-muted-foreground">Hiện tại chưa có bệnh viện nào gửi yêu cầu.</div>
            </div>
          ) : (
            bloodRequests.map((req) => {
              const badge = urgencyBadgeColor(req.urgency);
              return (
                <div
                  key={req.id}
                  className="min-w-[340px] bg-card rounded-3xl p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-4xl font-bold text-destructive mb-1">
                        {req.blood_type}
                      </div>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 99,
                      }}>
                        {req.urgency}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Số lượng</div>
                      <div className="text-lg font-bold text-foreground">{req.amount_ml}ml</div>
                      {req.registration_count > 0 && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          {req.registration_count} người đăng ký
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium text-foreground">{req.hospital_name}</div>
                      <div className="text-xs text-muted-foreground">{req.hospital_address}</div>
                    </div>
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="w-full bg-destructive text-destructive-foreground py-3 rounded-xl font-bold hover:bg-destructive/90 transition-colors mt-4"
                    >
                      Đăng ký hiến máu
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-destructive flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            Bảng vinh danh
          </h2>
          <button
            onClick={() => onNavigate('leaderboard')}
            className="text-destructive text-sm font-medium flex items-center gap-1"
          >
            Xem thêm
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-card rounded-3xl p-5 shadow-lg space-y-5">
          {leaderboard.length > 0 ? leaderboard.map((donor, index) => {
            let rankColor = "bg-muted text-muted-foreground";
            let rankBg = "bg-destructive/5 rounded-2xl";
            if (index === 0) {
              rankColor = "bg-yellow-100 text-yellow-600 border border-yellow-300 shadow-sm";
              rankBg = "bg-gradient-to-r from-yellow-500/15 to-transparent border-l-4 border-yellow-500 rounded-xl";
            } else if (index === 1) {
              rankColor = "bg-gray-100 text-gray-600 border border-gray-300 shadow-sm";
              rankBg = "bg-gradient-to-r from-gray-400/15 to-transparent border-l-4 border-gray-400 rounded-xl";
            } else if (index === 2) {
              rankColor = "bg-orange-100 text-[#CD7F32] border border-orange-300 shadow-sm";
              rankBg = "bg-gradient-to-r from-orange-500/15 to-transparent border-l-4 border-[#CD7F32] rounded-xl";
            }

            return (
              <div key={donor.id || index} className={`flex items-center justify-between p-4 ${rankBg}`}>
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-2">
                  <div className={`w-10 h-10 flex-shrink-0 aspect-square rounded-full flex items-center justify-center font-black text-base ${rankColor}`}>
                    {index + 1}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="font-bold text-foreground text-[15px] truncate">{donor.name}</div>
                    <div className="text-xs text-muted-foreground font-medium">{donor.donations_count} lần hiến máu</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-destructive">{donor.reward_points} <span className="text-[10px] text-destructive/80 font-normal">pts</span></div>
                  <div className="inline-block mt-0.5 px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-bold rounded-full">
                    Nhóm máu {donor.blood_type || '?'}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-4 text-muted-foreground text-sm">Chưa có dữ liệu vinh danh</div>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-4 mt-6">
        <h2 className="text-xl font-bold text-destructive mb-4">Lợi ích hiến máu</h2>

        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">
                Tăng cường sức khỏe tim mạch
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hiến máu giúp giảm nguy cơ mắc bệnh tim mạch và đột quỵ. Nghiên cứu cho thấy những người hiến máu thường xuyên có sức khỏe tim mạch tốt hơn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TimeSlot Modal */}
      {selectedRequest && donorId && (
        <TimeSlotModal
          request={selectedRequest}
          donorId={donorId}
          onClose={() => setSelectedRequest(null)}
          onSuccess={() => {
            setSelectedRequest(null);
            fetchBloodRequests(); // Refresh để cập nhật registration_count
          }}
        />
      )}
    </div>
  );
}

