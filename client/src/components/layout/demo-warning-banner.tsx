import { useState } from 'react';
import { DEMO_WARNING } from '@/lib/constants';

export function DemoWarningBanner() {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  return (
    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 py-2 px-4 flex items-center justify-between">
      <p className="text-center text-sm flex-1">{DEMO_WARNING}</p>
      <button 
        className="ml-2 p-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
        onClick={() => setDismissed(true)}
      >
        <i className="ri-close-line"></i>
      </button>
    </div>
  );
}
