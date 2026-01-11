import React, { useState, useEffect } from 'react';
import { Moon, Power, PowerOff } from 'lucide-react';
import { useStore } from '../store';
import { supabase } from '../services/supabase';

type WorkStatus = 'AVAILABLE' | 'BUSY' | 'DO_NOT_DISTURB';

const StatusSelector: React.FC = () => {
  const [status, setStatus] = useState<WorkStatus>('AVAILABLE');
  const [loading, setLoading] = useState(false);

  // Carregar status do Supabase ao montar
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('profiles')
          .select('work_status')
          .eq('id', user?.id)
          .single();

        if (data?.work_status) {
          setStatus(data.work_status as WorkStatus);
        }
      } catch (error) {
        console.error('Erro ao carregar status:', error);
      }
    };

    loadStatus();
  }, []);

  // Salvar status no Supabase
  const saveStatus = async (newStatus: WorkStatus) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Fallback: salvar no localStorage se não autenticado
        localStorage.setItem('newsflow_work_status', newStatus);
        setStatus(newStatus);
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ work_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', user?.id);

      if (error) throw error;

      setStatus(newStatus);
      localStorage.setItem('newsflow_work_status', newStatus);
    } catch (error) {
      console.error('Erro ao salvar status:', error);
      // Fallback: salvar no localStorage
      localStorage.setItem('newsflow_work_status', newStatus);
      setStatus(newStatus);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    AVAILABLE: { label: 'Ligado', icon: Power, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
    BUSY: { label: 'Ocupado', icon: PowerOff, color: 'bg-amber-500', textColor: 'text-amber-700' },
    DO_NOT_DISTURB: { label: 'Não Perturbe', icon: Moon, color: 'bg-slate-500', textColor: 'text-slate-700' },
  };

  const currentConfig = statusConfig[status];

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status de Trabalho</label>
      <div className="flex gap-2">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = status === key;
          return (
            <button
              key={key}
              onClick={() => !loading && saveStatus(key as WorkStatus)}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all border-2 ${
                isActive
                  ? `${config.color} text-white border-current shadow-md`
                  : 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusSelector;
