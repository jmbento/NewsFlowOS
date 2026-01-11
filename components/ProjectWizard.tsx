import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  X,
  Zap,
  Video,
  Layout,
  Globe,
  Palette,
  Mic,
  Calendar,
  DollarSign,
  MapPin,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectWizard: React.FC = () => {
  const { createWizardProject, setActiveTab, team } = useStore();
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    description: '',
    scope: {
      video: false,
      impresso: false,
      digital: false,
      criativo: false,
      podcast: false,
    },
    totalValue: '',
    deadline: '',
    selectedTeam: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createWizardProject({
      ...formData,
      totalValue: parseFloat(formData.totalValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      status: 'Alinhamento'
    });
    
    setActiveTab('canvas');
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setFormData({...formData, totalValue: formatted});
  };

  const toggleScope = (key: keyof typeof formData.scope) => {
    setFormData(prev => ({
      ...prev,
      scope: { ...prev.scope, [key]: !prev.scope[key] }
    }));
  };

  const toggleTeam = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTeam: prev.selectedTeam.includes(id)
        ? prev.selectedTeam.filter(t => t !== id)
        : [...prev.selectedTeam, id]
    }));
  };

  const scopeOptions = [
    { key: 'video', label: 'Vídeo', icon: Video, color: 'text-purple-500' },
    { key: 'impresso', label: 'Impresso', icon: Layout, color: 'text-blue-500' },
    { key: 'digital', label: 'Digital', icon: Globe, color: 'text-emerald-500' },
    { key: 'criativo', label: 'Criativo', icon: Palette, color: 'text-amber-500' },
    { key: 'podcast', label: 'Podcast', icon: Mic, color: 'text-rose-500' },
  ];

  return (
    <div className="fixed inset-0 z-100 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-white border border-slate-300 rounded-md shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-900">
              Novo Job
            </h2>
          </div>
          <button 
            onClick={() => setActiveTab('canvas')} 
            className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
          {/* Básico */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Cliente</label>
              <input 
                required
                className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-yellow-500 outline-none transition-all"
                placeholder="ex: Diário do Vale"
                value={formData.client}
                onChange={e => setFormData({...formData, client: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Projeto</label>
              <input 
                required
                className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-yellow-500 outline-none transition-all"
                placeholder="ex: Campanha Institucional"
                value={formData.projectName}
                onChange={e => setFormData({...formData, projectName: e.target.value})}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Descrição</label>
            <textarea 
              rows={3}
              className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-yellow-500 outline-none transition-all resize-none"
              placeholder="Descreva o projeto..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Escopo */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Escopo de Produção</label>
            <div className="grid grid-cols-5 gap-3">
              {scopeOptions.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleScope(key as keyof typeof formData.scope)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.scope[key as keyof typeof formData.scope]
                      ? 'bg-yellow-500/10 border-yellow-500 shadow-md'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${formData.scope[key as keyof typeof formData.scope] ? 'text-yellow-500' : color}`} />
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${
                    formData.scope[key as keyof typeof formData.scope] ? 'text-yellow-500' : 'text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Valor e Prazo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Valor</label>
              <input 
                required
                className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-yellow-500 outline-none transition-all font-bold"
                placeholder="R$ 0,00"
                value={formData.totalValue}
                onChange={handleValueChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Prazo</label>
              <input 
                type="date"
                required
                className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-yellow-500 outline-none transition-all"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          {/* Equipe */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Equipe Alocada</label>
            <div className="grid grid-cols-4 gap-2">
              {team?.slice(0, 8).map(member => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleTeam(member.id)}
                  className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-left ${
                    formData.selectedTeam.includes(member.id)
                      ? 'bg-yellow-500/10 border-yellow-500'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                  <span className={`text-[10px] font-bold truncate ${
                    formData.selectedTeam.includes(member.id) ? 'text-yellow-500' : 'text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {member.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
          >
            Criar Job
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectWizard;
