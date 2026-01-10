
import React, { useState } from 'react';
import { ProposalData } from '../types';
import { 
  CheckCircle2, 
  Rocket, 
  DollarSign, 
  MapPin, 
  Calendar, 
  ShieldCheck,
  Briefcase,
  Star,
  Users,
  Layout,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProposalPublicViewProps {
  proposal: ProposalData;
  onApprove: () => void;
}

const ProposalPublicView: React.FC<ProposalPublicViewProps> = ({ proposal, onApprove }) => {
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = () => {
    setIsApproved(true);
    onApprove();
    // Aqui dispararia o WhatsApp via NotificationEngine no mundo real
    console.log("🔔 [CLIENT_APPROVAL]: Proposal approved by client!");
  };

  return (
    <div className="min-h-screen bg-brand-950 text-zinc-100 font-sans p-4 md:p-12 flex items-center justify-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-neon-purple/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-neon-blue/20 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full glass-panel rounded-[3rem] overflow-hidden shadow-2xl relative z-10"
      >
        {/* Top Branding Bar */}
        <div className="h-24 bg-gradient-to-r from-brand-neon-purple/20 to-brand-neon-blue/20 flex items-center px-12 justify-between border-b border-white/10">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                 <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                 <h1 className="text-xl font-black italic tracking-tighter">NEWSFLOW <span className="text-brand-neon-purple">PROPOSAL</span></h1>
                 <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">Diário do Vale Neural Network</p>
              </div>
           </div>
           <div className="hidden md:flex items-center gap-3">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">Status: Proposta Ativa</span>
           </div>
        </div>

        <div className="p-8 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-12">
           {/* Left Content */}
           <div className="md:col-span-2 space-y-10">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-tight uppercase">
                    {proposal.projectName}
                 </h2>
                 <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">
                    Esta proposta detalha a orquestração neural de conteúdo para a <strong>{proposal.clientName}</strong>, 
                    utilizando o ecossistema NewsFlow Nodes para garantir máxima conversão e alcance regional.
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { icon: Star, label: "Conteúdo Premium", desc: "IA Multi-agente p/ Criação" },
                   { icon: Users, label: "Alcance Estratégico", desc: "Regionalismo no Sul Fluminense" },
                   { icon: Layout, label: "Multi-Plataforma", desc: "Impresso, Digital e Social" },
                   { icon: Zap, label: "Velocidade Real-time", desc: "Workflow Automatizado" }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-2xl bg-brand-neon-purple/20 flex items-center justify-center border border-brand-neon-purple/30">
                         <item.icon className="w-5 h-5 text-brand-neon-purple" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white uppercase mb-1">{item.label}</p>
                         <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Right Meta Data */}
           <div className="space-y-6">
              <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 shadow-2xl space-y-6">
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Investimento Total</p>
                    <div className="flex items-center gap-2">
                       <DollarSign className="w-6 h-6 text-emerald-500" />
                       <h3 className="text-4xl font-black text-emerald-500 italic tracking-tighter">R$ {proposal.totalValue.toLocaleString()}</h3>
                    </div>
                 </div>

                 <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4 text-zinc-400">
                       <MapPin className="w-4 h-4 text-brand-neon-blue" />
                       <div>
                          <p className="text-[8px] font-black uppercase text-zinc-500">Abrangência</p>
                          <p className="text-[10px] font-bold text-zinc-200">{proposal.targetCities.join(', ')}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-400">
                       <Calendar className="w-4 h-4 text-brand-neon-purple" />
                       <div>
                          <p className="text-[8px] font-black uppercase text-zinc-500">Validade</p>
                          <p className="text-[10px] font-bold text-zinc-200">{new Date(proposal.expirationDate).toLocaleDateString()}</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6">
                    {!isApproved ? (
                      <button 
                        onClick={handleApprove}
                        className="w-full py-5 bg-gradient-to-r from-brand-neon-purple to-brand-neon-blue text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                      >
                         <CheckCircle2 className="w-4 h-4" />
                         Aprovar Projeto 🚀
                      </button>
                    ) : (
                      <div className="w-full py-5 bg-emerald-500/20 border-2 border-emerald-500/30 text-emerald-500 rounded-[1.5rem] flex items-center justify-center gap-3">
                         <div className="animate-pulse flex items-center gap-3">
                           <CheckCircle2 className="w-5 h-5" />
                           <span className="text-xs font-black uppercase tracking-widest italic">Aprovado! Aguarde...</span>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
              
              <div className="p-4 flex items-center justify-center gap-4 opacity-30">
                 <ShieldCheck className="w-4 h-4 text-zinc-500" />
                 <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Contrato Seguro & Verificado</span>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProposalPublicView;
