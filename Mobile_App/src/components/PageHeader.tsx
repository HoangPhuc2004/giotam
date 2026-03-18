import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <div className="bg-destructive px-4 pt-12 pb-4 flex items-center justify-center relative shadow-md flex-shrink-0">
      <button
        onClick={onBack}
        className="absolute left-4 p-2 text-white z-10 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
      >
        <ChevronLeft className="w-7 h-7" strokeWidth={3} />
      </button>
      <h1 className="text-xl font-bold text-white tracking-wide uppercase">
        {title}
      </h1>
    </div>
  );
}
