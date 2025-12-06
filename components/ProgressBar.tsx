interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export default function ProgressBar({ current, total, showLabel = true }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  const isComplete = percentage >= 100;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm text-slate-500 font-medium">Testing Progress</span>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-700">{current}</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs sm:text-sm text-slate-500">{total} days</span>
          </div>
        </div>
      )}
      
      <div className="w-full bg-slate-100 rounded-full h-2 sm:h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: isComplete 
              ? 'linear-gradient(90deg, #10B981, #059669)' 
              : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
          }}
        />
      </div>
      
      <div className="flex justify-between mt-1.5 sm:mt-2">
        <span className="text-[10px] sm:text-xs text-slate-400">Day 1</span>
        <span className="text-[10px] sm:text-xs text-slate-400">Day {total}</span>
      </div>
      
      {isComplete && (
        <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-emerald-50 border border-emerald-100 rounded-lg sm:rounded-xl flex items-center gap-2 text-emerald-600">
          <span className="text-base sm:text-lg">🎉</span>
          <span className="text-xs sm:text-sm font-medium">Testing complete! You can rate this app.</span>
        </div>
      )}
    </div>
  );
}
