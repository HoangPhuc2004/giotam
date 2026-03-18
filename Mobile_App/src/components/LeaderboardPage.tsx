import { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Medal } from 'lucide-react';
import { api } from '../api';

interface LeaderboardPageProps {
  onBack: () => void;
}

export function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

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
    <div className="min-h-full bg-[#0B1A45] flex flex-col relative w-full h-full overflow-y-auto">
      {/* Header */}
      <div className="pt-12 pb-4 px-4 flex items-center justify-center relative">
        <button onClick={onBack} className="absolute left-4 top-12 p-2 text-white z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#F8B64C] tracking-wider uppercase">Leaderboard</h1>
          <p className="text-[#00DDA3] text-xs font-semibold mt-1 uppercase tracking-widest">Last 3 Winners</p>
        </div>
      </div>

      {/* Podium */}
      <div className="px-4 mt-6 flex items-end justify-center gap-2 h-44">
        {top3[1] && (
           <div className="flex-1 bg-[#1A2E63] rounded-t-xl p-3 flex flex-col items-center justify-end h-[140px] border-b-4 border-b-[#00DDA3]">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2 shadow-lg ring-2 ring-white/20">
              <span className="font-bold text-gray-600">2</span>
            </div>
            <div className="text-white font-medium text-[10px] truncate max-w-full">{top3[1].name.split(' ')[0]}</div>
            <div className="bg-[#00DDA3] text-[#0B1A45] text-[10px] font-bold px-4 py-1 rounded-full mt-2 w-full text-center">{top3[1].reward_points}</div>
           </div>
        )}
        
        {top3[0] && (
           <div className="flex-1 bg-[#20377A] rounded-t-xl p-3 flex flex-col items-center justify-end h-[170px] shadow-2xl z-10 border-b-4 border-b-[#00DDA3]">
            <div className="w-14 h-14 bg-[#F8B64C] rounded-full flex items-center justify-center mb-3 shadow-lg ring-4 ring-[#F8B64C]/30 relative">
              <span className="font-black text-white text-xl">1</span>
            </div>
            <div className="text-white font-bold text-xs truncate max-w-full">{top3[0].name.split(' ')[0]}</div>
            <div className="bg-[#00DDA3] text-[#0B1A45] text-xs font-bold px-4 py-1.5 rounded-full mt-2 w-full text-center">{top3[0].reward_points}</div>
           </div>
        )}

        {top3[2] && (
           <div className="flex-1 bg-[#1A2E63] rounded-t-xl p-3 flex flex-col items-center justify-end h-[120px] border-b-4 border-b-[#00DDA3]">
            <div className="w-12 h-12 bg-[#CD7F32] rounded-full flex items-center justify-center mb-2 shadow-lg ring-2 ring-white/20">
              <span className="font-bold text-white">3</span>
            </div>
            <div className="text-white font-medium text-[10px] truncate max-w-full">{top3[2].name.split(' ')[0]}</div>
            <div className="bg-[#00DDA3] text-[#0B1A45] text-[10px] font-bold px-4 py-1 rounded-full mt-2 w-full text-center">{top3[2].reward_points}</div>
           </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4 mt-8 flex justify-between gap-2 border-b border-white/10 pb-4">
        <button className="flex-1 text-white/50 text-sm font-medium py-2">Weekly</button>
        <button className="flex-1 bg-[#00DDA3] text-[#0B1A45] text-sm font-bold py-2 rounded-full shadow-lg shadow-[#00DDA3]/20">All Time</button>
        <button className="flex-1 text-white/50 text-sm font-medium py-2">Monthly</button>
      </div>

      {/* List */}
      <div className="flex-1 bg-white mt-4 rounded-t-[32px] p-6 pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="space-y-3">
          {rest.map((donor, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#00DDA3] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-6 text-center font-bold text-gray-400">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shadow-inner" style={{ backgroundColor: isFirst ? '#F8B64C' : isSecond ? '#9CA3AF' : isThird ? '#CD7F32' : '#00DDA3' }}>
                    {donor.name.substring(0, 2)}
                  </div>
                  <div className="font-bold text-gray-800 text-sm truncate max-w-[120px]">{donor.name}</div>
                </div>
                <div className="flex items-center gap-3">
                  {isFirst && <Trophy className="w-5 h-5 text-[#F8B64C]" />}
                  {isSecond && <Medal className="w-5 h-5 text-gray-400" />}
                  {isThird && <Medal className="w-5 h-5 text-[#CD7F32]" />}
                  {(!isFirst && !isSecond && !isThird) && <Medal className="w-4 h-4 text-[#F8B64C]/50" />}
                  
                  <div className="bg-[#00DDA3] text-white text-xs font-bold px-3 py-1.5 rounded-full min-w-[50px] text-center shadow-sm">
                    {donor.reward_points}
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
