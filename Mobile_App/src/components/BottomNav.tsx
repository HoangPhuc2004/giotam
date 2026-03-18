import { Home, HandHeart, Heart, Newspaper, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Trang chủ' },
    { id: 'donate-support', icon: HandHeart, label: 'Quyên góp' },
    { id: 'donate', icon: Heart, label: 'Hiến máu', isCenter: true },
    { id: 'news', icon: Newspaper, label: 'Tin tức' },
    { id: 'profile', icon: User, label: 'Cá nhân' },
  ];

  return (
    <div className="fixed bottom-0 w-[393px]">
      <div className="bg-destructive shadow-[0_-4px_25px_rgba(0,0,0,0.15)]">
        <div className="flex items-end justify-around px-4 pt-3 pb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            // Center button (Hiến máu) - make it stand out
            if (item.isCenter) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="flex flex-col items-center -mt-4"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-all ${
                    isActive 
                      ? 'bg-white text-destructive shadow-xl scale-110' 
                      : 'bg-white/90 text-destructive shadow-lg'
                  }`}>
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <span className={`text-[10px] font-bold transition-colors ${
                    isActive ? 'text-white' : 'text-white/80'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            }
            
            // Regular buttons
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center justify-center flex-1"
              >
                <Icon className={`w-6 h-6 mb-1 transition-colors ${
                  isActive ? 'text-white' : 'text-white/60'
                }`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-white/60'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}