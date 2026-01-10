
import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Lead, LeadStatus } from '../types';
import { 
  Briefcase, 
  Send, 
  Handshake, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  User, 
  MapPin, 
  Calendar,
  FileText,
  Rocket,
  ArrowRight,
  Globe,
  X,
  Mic,
  Zap as ZapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FastQuoteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { addLead, team } = useStore();
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    projectDescription: '',
    totalValue: '',
    targetCities: [] as string[],
    campaignType: 'INSTITUCIONAL_ANNIVERSARY' as any,
    hunterId: '',
    closerId: ''
  });
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      status: 'PROSPECT',
      data: {
        ...formData,
        totalValue: parseFloat(formData.totalValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      referral_by: formData.hunterId,
      handled_by: formData.closerId
    });
    
    // Reset form
    setFormData({
      clientName: '',
      projectName: '',
      projectDescription: '',
      totalValue: '',
      targetCities: [],
      campaignType: 'INSTITUCIONAL_ANNIVERSARY',
      hunterId: '',
      closerId: ''
    });
    
    onClose();
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

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // TODO: Implementar reconhecimento de voz com IA
    if (!isRecording) {
      // Simulação de transcrição
      setTimeout(() => {
        setFormData({
          ...formData,
          projectDescription: formData.projectDescription + '\n[Transcrição de áudio simulada: O cliente solicitou uma campanha institucional para divulgar os 50 anos da empresa...]'
        });
        setIsRecording(false);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white border border-slate-300 rounded-md shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
           <div className="flex items-center gap-3">
              <ZapIcon className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-slate-900">Nova Oportunidade</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-500 hover:text-slate-900">
              <X className="w-5 h-5" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-5 bg-white">
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-label text-slate-600">Cliente</label>
                 <input 
                   required
                   className="w-full bg-white border border-slate-300 rounded-md px-4 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all placeholder:text-slate-400"
                   placeholder="ex: Diário do Vale"
                   value={formData.clientName}
                   onChange={e => setFormData({...formData, clientName: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-label text-slate-600">Projeto</label>
                 <input 
                   required
                   className="w-full bg-white border border-slate-300 rounded-md px-4 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all placeholder:text-slate-400"
                   placeholder="ex: Campanha ESG"
                   value={formData.projectName}
                   onChange={e => setFormData({...formData, projectName: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-label text-slate-600">Descrição do Projeto</label>
                <button 
                  type="button"
                  onClick={handleVoiceRecord}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  {isRecording ? 'Gravando...' : 'Gravar Áudio'}
                </button>
              </div>
              <textarea 
                rows={4}
                className="w-full bg-white border border-slate-300 rounded-md px-4 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all resize-none placeholder:text-slate-400"
                placeholder="Descreva o projeto ou use o botão de áudio para transcrever automaticamente..."
                value={formData.projectDescription}
                onChange={e => setFormData({...formData, projectDescription: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-label text-slate-600">Valor do Contrato</label>
                 <input 
                   required
                   className="w-full bg-white border border-slate-300 rounded-md px-4 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all font-semibold placeholder:text-slate-400"
                   placeholder="R$ 0,00"
                   value={formData.totalValue}
                   onChange={handleValueChange}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-label text-slate-600">Tipo</label>
                 <select 
                   className="w-full bg-white border border-slate-300 rounded-md px-4 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all"
                   value={formData.campaignType}
                   onChange={e => setFormData({...formData, campaignType: e.target.value as any})}
                 >
                    <option value="INSTITUCIONAL_ANNIVERSARY">Institucional</option>
                    <option value="ESG_PRACTICES">Práticas ESG</option>
                    <option value="CITY_ANNIVERSARY">Aniversário de Cidade</option>
                 </select>
              </div>
           </div>

           <button type="submit" className="w-full py-3 bg-black text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-sm">
              Criar Oportunidade
           </button>
        </form>
      </motion.div>
    </div>
  );
};

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; icon: any }> = {
  PROSPECT: { label: 'Prospecção', color: 'border-zinc-700 text-zinc-500', icon: Briefcase },
  PITCH: { label: 'Pitch', color: 'border-brand-neon-purple/40 text-brand-neon-purple', icon: Rocket },
  PROPOSAL: { label: 'Proposta', color: 'border-brand-neon-blue/40 text-brand-neon-blue', icon: Send },
  NEGOTIATION: { label: 'Negociação', color: 'border-amber-500/40 text-amber-500', icon: Handshake },
  WON: { label: 'Fechado', color: 'border-emerald-500/40 text-emerald-500', icon: CheckCircle2 },
  LOST: { label: 'Perdido', color: 'border-red-500/40 text-red-500', icon: XCircle },
};

const LeadCard = ({ lead, ...props }: { lead: Lead } & any) => {
  const { updateLeadStatus } = useStore();
  const config = STATUS_CONFIG[lead.status];

  return (
    <motion.div layout className="bg-white border border-slate-300 p-4 rounded-md space-y-3 hover:border-purple-500 transition-all cursor-pointer group shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">{lead.data.projectName}</h4>
        <config.icon className={`w-4 h-4 ${config.color.split(' ')[1]}`} />
      </div>

      <div className="flex items-center gap-2 text-slate-600">
        <User className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{lead.data.clientName}</span>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 pt-2 uppercase tracking-wide">
         <span>R$ {(lead.data.totalValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
         <span className="text-slate-500 font-medium">{lead.data.targetCities?.length || 0} Praças</span>
      </div>

      <div className="flex gap-1.5 pt-2">
         {lead.status !== 'WON' && lead.status !== 'LOST' && (
           <>
              <button 
                onClick={() => updateLeadStatus(lead.id, 'WON')}
                className="flex-1 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-md text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-colors border border-emerald-500/20"
              >
                Ativar
              </button>
              <button 
                onClick={() => {
                  const stages: LeadStatus[] = ['PROSPECT', 'PITCH', 'PROPOSAL', 'NEGOTIATION', 'WON'];
                  const cur = stages.indexOf(lead.status);
                  if (cur < stages.length - 1) updateLeadStatus(lead.id, stages[cur + 1]);
                }}
                className="p-2 bg-slate-100 border border-slate-300 rounded-md text-slate-600 hover:text-purple-600 transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {lead.status === 'PROPOSAL' && (
                <>
                  <button 
                    onClick={() => useStore.getState().triggerProposalViewedAlert(lead.id)}
                    className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-600 hover:bg-blue-500 hover:text-white"
                    title="Visualizar proposta"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={async () => {
                      // Automação de proposta via IA
                      const { chatWithGemini } = await import('../services/geminiService');
                      const prompt = `Gere uma proposta comercial em HTML para o cliente ${lead.data.clientName} com o projeto ${lead.data.projectName}. Valor: R$ ${lead.data.totalValue}. Cidades: ${lead.data.targetCities?.join(', ')}. Formato: HTML responsivo e profissional.`;
                      const html = await chatWithGemini(prompt);
                      // Criar blob e download
                      const blob = new Blob([html], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `proposta-${lead.data.clientName}-${Date.now()}.html`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-1.5 bg-purple-500/10 border border-purple-500/20 rounded-md text-purple-600 hover:bg-purple-500 hover:text-white"
                    title="Gerar proposta via IA"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
           </>
         )}
      </div>
    </motion.div>
  );
};

const SalesCRM = () => {
  const { leads } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const metrics = useMemo(() => {
    const totalPipeline = leads.filter(l => l.status !== 'WON' && l.status !== 'LOST').reduce((sum, l) => sum + (l.data.totalValue || 0), 0);
    return { totalPipeline };
  }, [leads]);

  const columns: LeadStatus[] = ['PROSPECT', 'PITCH', 'PROPOSAL', 'NEGOTIATION', 'WON'];

  return (
    <div className="w-full h-full bg-slate-50 p-8 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight uppercase">Fluxo <span className="text-purple-600">Comercial</span></h2>
          <p className="text-slate-600 text-sm mt-1 uppercase font-medium tracking-wide">Pipeline de oportunidades e fechamentos.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:block px-5 py-3 bg-white border border-slate-300 rounded-md shadow-sm">
              <span className="text-xs text-slate-500 uppercase font-semibold tracking-wide block mb-1">Pipeline Ativo</span>
              <p className="text-lg font-semibold text-slate-900">R$ {metrics.totalPipeline.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
           </div>
           <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-purple-600 text-white rounded-md text-sm font-semibold uppercase tracking-wide hover:bg-purple-700 transition-colors shadow-md flex items-center gap-2">
              <Plus className="w-5 h-5" /> Nova Oportunidade
           </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-0">
        {columns.map(status => (
          <div key={status} className="flex-1 min-w-[300px] flex flex-col gap-4">
             <div className="flex items-center justify-between px-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{STATUS_CONFIG[status].label}</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">{leads.filter(l => l.status === status).length}</span>
             </div>
             <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                   {leads.filter(l => l.status === status).map(l => <LeadCard key={l.id} lead={l} />)}
                </AnimatePresence>
             </div>
          </div>
        ))}
      </div>

      <FastQuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SalesCRM;

