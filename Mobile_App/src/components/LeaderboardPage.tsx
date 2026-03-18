import { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Medal } from 'lucide-react';
import { api } from '../api';

interface LeaderboardPageProps {
  onBack: () => void;
}

export function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all-time'); // 'all-time' or 'monthly'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        if (res.data && res.data.leaderboard) {
          setLeaderboard(res.data.leaderboard);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };
    fetchLeaderboard();
  }, []);

  const getLastName = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    // Handle specific cases like "Test Cloud" -> "Cloud"
    return parts[parts.length - 1] || name;
  };

  // Process data based on active tab
  const displayData = leaderboard.map(donor => {
    if (activeTab === 'monthly') {
      // Create a deterministic "monthly" score based on user id or name length for demo purposes
      // In production, this should come from a real monthly query.
      const factor = (donor.id || donor.name.length) % 3 + 1; // 1, 2, or 3
      const monthlyPoints = donor.reward_points > 0 ? Math.floor(donor.reward_points / factor) : 0;
      const monthlyDonations = donor.donations_count > 0 ? Math.max(0, donor.donations_count - factor + 1) : 0;
      return {
        ...donor,
        reward_points: monthlyPoints,
        donations_count: monthlyDonations
      };
    }
    return donor;
  }).sort((a, b) => b.reward_points - a.reward_points); // Re-sort after adjusting points

  const top3 = displayData.slice(0, 3);
  const rest = displayData;

  return (
    <div className="min-h-full bg-background flex flex-col w-full h-full overflow-y-auto">
      {/* Header */}
      <div className="pt-8 pb-2 px-4 flex items-center justify-center relative">
        <button onClick={onBack} className="absolute left-4 p-2 text-foreground z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[22px] font-black text-destructive tracking-wide">Bảng Vinh Danh</h1>
      </div>

      {/* Podium & Tabs */}
      <div className="px-4 mt-8 flex flex-col items-center">
        {/* Podium */}
        <div className="flex items-end justify-center gap-[6px] mb-8 w-full max-w-sm px-2">
          <div className="flex-1 flex flex-col items-center text-center">
            {top3[1] && (
              <>
                <div className="w-[72px] h-[72px] flex-shrink-0 aspect-square bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center mb-3">
                  <span className="font-extrabold text-2xl text-foreground">2</span>
                </div>
                <div className="mb-px w-full flex justify-center">
                  <span className="bg-destructive text-white font-bold text-[11px] px-2 py-0.5 rounded-full truncate max-w-[80px]">{getLastName(top3[1].name)}</span>
                </div>
                <div className="text-foreground font-black text-[13px]">{top3[1].reward_points}</div>
              </>
            )}
          </div>
          
          <div className="flex-[1.2] flex flex-col items-center -mt-8 text-center pb-4">
            {top3[0] && (
              <>
                <div className="w-[96px] h-[96px] flex-shrink-0 aspect-square bg-white border border-gray-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-full flex items-center justify-center mb-3">
                  <span className="font-black text-4xl text-foreground">1</span>
                </div>
                <div className="mb-1 w-full flex justify-center">
                  <span className="bg-destructive text-white font-bold text-[12px] px-3 py-[3px] rounded-full truncate max-w-[90px]">{getLastName(top3[0].name)}</span>
                </div>
                <div className="text-foreground font-black text-[15px]">{top3[0].reward_points}</div>
              </>
            )}
          </div>
          
          <div className="flex-1 flex flex-col items-center text-center">
            {top3[2] && (
              <>
                <div className="w-[72px] h-[72px] flex-shrink-0 aspect-square bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center mb-3">
                  <span className="font-extrabold text-2xl text-gray-400">3</span>
                </div>
                <div className="mb-px w-full flex justify-center">
                  <span className="text-gray-500 font-bold text-[11px] px-2 py-0.5 truncate max-w-[80px]">{getLastName(top3[2].name)}</span>
                </div>
                <div className="text-foreground font-black text-[13px]">{top3[2].reward_points}</div>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full flex bg-white/50 border border-gray-100/80 rounded-[20px] p-1.5 mt-2 max-w-[340px]">
          <button 
            onClick={() => setActiveTab('all-time')}
            className={`flex-1 py-3 text-sm font-bold rounded-[16px] transition-all duration-300 ${activeTab === 'all-time' ? 'bg-destructive text-white shadow-md' : 'text-foreground'}`}
          >
            Toàn thời gian
          </button>
          <button 
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 py-3 text-sm font-bold rounded-[16px] transition-all duration-300 ${activeTab === 'monthly' ? 'bg-destructive text-white shadow-md' : 'text-foreground'}`}
          >
            Tháng này
          </button>
        </div>
      </div>

      {/* List container */}
      <div className="flex-1 bg-white mt-8 px-4 pb-24 border-t border-gray-100 pt-6">
        <div className="space-y-4">
          {rest.map((donor, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50/80">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-8 h-8 flex-shrink-0 border-2 border-gray-100 rounded-full flex items-center justify-center font-bold text-foreground bg-gray-50/30">
                    {index + 1}
                  </div>
                  
                  <div className="flex flex-col justify-center min-w-0 pr-4">
                    <div className="font-extrabold text-foreground text-[15px] truncate">{donor.name}</div>
                    <div className="text-gray-500 text-[13px] mt-0.5">{donor.donations_count} lần hiến máu</div>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end justify-center flex-shrink-0">
                  <div className="flex items-center gap-[6px] mb-1.5">
                    {isFirst && <Trophy className="w-4 h-4 text-[#F4A24C]" />}
                    {isSecond && <Medal className="w-4 h-4 text-gray-400" />}
                    {isThird && <Medal className="w-4 h-4 text-[#CD7F32]" />}
                    {!isFirst && !isSecond && !isThird && <Medal className="w-4 h-4 text-gray-300" />}
                    <span className="font-bold text-destructive text-lg leading-none">{donor.reward_points} <span className="text-destructive text-[11px] font-semibold leading-none">pts</span></span>
                  </div>
                  <div className="bg-red-50 text-destructive text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap mt-1 border border-red-100/50">
                    Nhóm máu {donor.blood_type || '?'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
