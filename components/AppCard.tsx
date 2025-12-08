import Link from 'next/link';
import type { App } from '../lib/types';

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Link href={`/app/${app.appId}`}>
      <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-4 sm:p-6 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300 cursor-pointer">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            {app.iconUrl && app.iconUrl !== '/default-icon.png' ? (
              <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl sm:text-3xl">📱</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
              {app.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 truncate mt-0.5">{app.packageName}</p>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                <span className="text-amber-500 text-sm sm:text-base">★</span>
                <span className="text-xs sm:text-sm font-semibold text-amber-700">
                  {app.rating > 0 ? app.rating.toFixed(1) : '-'}
                </span>
              </div>
              <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg font-medium ${
                app.status === 'active' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-slate-50 text-slate-500 border border-slate-100'
              }`}>
                {app.status === 'active' ? '● Active' : 'Done'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-slate-400">Tap to view</span>
          <span className="text-indigo-500 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
