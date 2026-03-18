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

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard;

  return (
    <div className="min-h-full bg-background flex flex-col w-full h-full overflow-y-auto">
      {/* Header */}
      <div className="pt-12 pb-4 px-4 flex justify-center relative">
        <button onClick={onBack} className="absolute left-4 top-12 p-2 text-foreground z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center flex flex-col items-center">
          <h1 className="text-2xl font-bold text-destructive tracking-widest uppercase mb-1">Leaderboard</h1>
          <p className="text-foreground text-sm font-semibold uppercase tracking-widest">Last 3 Winners</p>
        </div>
      </div>

      {/* Podium & Tabs */}
      <div className="px-4 mt-6 flex flex-col items-center">
        {/* Podium */}
        <div className="flex items-end justify-center gap-6 mb-8">
          {top3[1] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#E2E8F0] shadow-inner rounded-full flex items-center justify-center mb-3">
                <span className="font-bold text-xl text-gray-700">2</span>
              </div>
              <div className="text-gray-400 font-semibold text-xs truncate max-w-[80px] text-center">{top3[1].name.split(' ')[0]}</div>
              <div className="text-foreground font-bold text-xs mt-1">{top3[1].reward_points}</div>
            </div>
          )}
          {top3[0] && (
            <div className="flex flex-col items-center -mt-8">
              <div className="w-20 h-20 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-full flex items-center justify-center mb-3 border border-gray-50">
                <span className="font-extrabold text-3xl text-gray-800">1</span>
              </div>
              <div className="text-white font-bold text-xs truncate max-w-[100px] text-center px-3 py-1 bg-destructive rounded-full">{top3[0].name.split(' ')[0]}</div>
              <div className="text-foreground font-bold text-sm mt-2">{top3[0].reward_points}</div>
            </div>
          )}
          {top3[2] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 border border-gray-100">
                <span className="font-bold text-xl text-gray-400">3</span>
              </div>
              <div className="text-gray-400 font-semibold text-xs truncate max-w-[80px] text-center">{top3[2].name.split(' ')[0]}</div>
              <div className="text-foreground font-bold text-xs mt-1">{top3[2].reward_points}</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="w-full flex bg-gray-100 rounded-full p-1 mt-2">
          <button 
            onClick={() => setActiveTab('all-time')}
            className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${activeTab === 'all-time' ? 'bg-destructive text-destructive-foreground shadow-sm' : 'text-gray-500'}`}
          >
            Toàn thời gian
          </button>
          <button 
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${activeTab === 'monthly' ? 'bg-destructive text-destructive-foreground shadow-sm' : 'text-gray-500'}`}
          >
            Tháng này
          </button>
        </div>
      </div>

      {/* List container */}
      <div className="flex-1 bg-white mt-8 px-4 pb-24 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-destructive flex items-center gap-2 mb-6 mt-6">
          <Trophy className="w-7 h-7 text-yellow-500 fill-yellow-500" />
          Bảng vinh danh
        </h2>

        <div className="space-y-4">
          {rest.map((donor, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;
            
            const badgeColor = isFirst ? 'bg-[#F4A24C]' : isSecond ? 'bg-[#9CA3AF]' : isThird ? 'bg-[#CD7F32]' : 'bg-[#00DDA3]';

            return (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-[28px] h-[52px] border-2 border-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-700 bg-gray-50/50">
                    {index + 1}
                  </div>
                  
                  <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${badgeColor}`}>
                    {donor.name.substring(0, 2).toUpperCase()}
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <div className="font-extrabold text-foreground text-[15px] truncate max-w-[150px]">{donor.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{donor.donations_count} lần hiến máu</div>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end justify-center">
                  <div className="flex items-baseline gap-1 mb-1 relative">
                    {isFirst && <Trophy className="w-4 h-4 text-[#F4A24C]" />}
                    {isSecond && <Medal className="w-4 h-4 text-gray-400" />}
                    {isThird && <Medal className="w-4 h-4 text-[#CD7F32]" />}
                    {!isFirst && !isSecond && !isThird && <Medal className="w-4 h-4 text-gray-300" />}
                    <span className="font-bold text-destructive text-lg leading-none ml-2">{donor.reward_points} <span className="text-destructive text-[10px] font-medium leading-none">pts</span></span>
                  </div>
                  <div className="bg-destructive/10 text-destructive text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap mt-1">
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
