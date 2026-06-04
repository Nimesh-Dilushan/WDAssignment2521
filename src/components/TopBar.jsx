import React from 'react';

/**
 * TopBar subheader showing current page details and PWA sync indicators.
 */
export default function TopBar({ activePage, enableOfflineCaching }) {
  return (
    <div className="border-b border-zinc-200/30 dark:border-zinc-800/30 bg-zinc-50/40 dark:bg-zinc-950/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-10 flex items-center justify-between text-xs transition-colors duration-300">
        <span className="font-semibold text-zinc-900 dark:text-zinc-50 capitalize tracking-tight">{activePage}</span>
        <div className="flex items-center gap-1.5 bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 px-2.5 py-0.5 rounded-md text-[10px] text-zinc-500 dark:text-zinc-400">
          <div className={`w-1.5 h-1.5 rounded-full ${!enableOfflineCaching ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span>{enableOfflineCaching ? 'PWA Synced' : 'Offline Mode'}</span>
        </div>
      </div>
    </div>
  );
}
