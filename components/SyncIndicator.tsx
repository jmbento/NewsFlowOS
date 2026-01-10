import React from 'react';
import { Cloud, RefreshCw, CheckCircle2 } from 'lucide-react';

type SyncStatus = 'idle' | 'saving' | 'saved';

interface SyncIndicatorProps {
  status: SyncStatus;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({ status }) => {
  const config = {
    idle: { icon: Cloud, text: 'Sincronizado', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    saving: { icon: RefreshCw, text: 'Salvando...', color: 'text-blue-600', bg: 'bg-blue-50', animate: true },
    saved: { icon: CheckCircle2, text: 'Salvo', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <div className={`px-3 py-1.5 rounded-md ${current.bg} ${current.color} flex items-center gap-2 text-xs font-semibold`}>
      <Icon className={`w-3.5 h-3.5 ${current.animate ? 'animate-spin' : ''}`} />
      <span>{current.text}</span>
    </div>
  );
};
