
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { 
  Mic, 
  Square, 
  Sparkles, 
  Loader2, 
  Bot, 
  Zap,
  Volume2,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MeetingAI = () => {
  const { autoGenerateNodesFromMeeting, setIsRecording, isRecording } = useStore();
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing'>('idle');

  const startRecording = () => {
    setStatus('recording');
    setIsRecording(true);
  };

  const stopRecording = () => {
    setStatus('processing');
    setIsRecording(false);

    // Simulação de processamento de IA (Transcrição -> Extração de Entidades -> JSON)
    setTimeout(async () => {
      const mockResult = {
        campaignName: "Lançamento NewsFlow V4.1",
        tasks: [
          { 
            label: "Produção de Vídeo Teaser", 
            assignee: "Video Edit", 
            deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            checklist: ["Roteiro", "Gravação", "Edição Final"]
          },
          { 
            label: "Copywriting para Landing Page", 
            assignee: "Copywriter", 
            deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            checklist: ["Headline", "Benefícios", "CTA"]
          },
          { 
            label: "Setup de Ads (IG/FB)", 
            assignee: "Traffic Manager", 
            deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
            checklist: ["Públicos", "Criativos", "Pixel"]
          }
        ]
      };

      await autoGenerateNodesFromMeeting(mockResult);
      setStatus('idle');
    }, 3000);
  };

  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 md:gap-4 w-[calc(100vw-2rem)] md:w-auto max-w-sm">
      
      {/* Waveform Animation Area */}
      <AnimatePresence>
        {status === 'recording' && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex items-end gap-1 px-8 py-4 bg-brand-neon-purple/20 backdrop-blur-3xl rounded-3xl border border-brand-neon-purple/30 shadow-[0_0_50px_rgba(168,85,247,0.3)] min-w-[200px] justify-center"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: [10, Math.random() * 40 + 10, 10],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.5 + Math.random() * 0.5,
                  ease: "easeInOut"
                }}
                className="w-1 bg-brand-neon-purple rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Action Button */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-neon-purple via-brand-neon-blue to-emerald-500 rounded-[2.5rem] blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
        
        <button
          onClick={status === 'recording' ? stopRecording : startRecording}
          disabled={status === 'processing'}
          className={`
            relative px-4 md:px-8 py-3 md:py-5 rounded-[1.5rem] md:rounded-[2.3rem] flex items-center gap-2 md:gap-4 transition-all duration-500 border w-full md:w-auto
            ${status === 'recording' ? 'bg-red-500 border-red-400 scale-95 shadow-[0_0_40px_rgba(239,68,68,0.5)]' : 'bg-brand-900 border-white/10 hover:border-white/30 text-white'}
            ${status === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${status === 'recording' ? 'bg-white/20' : 'bg-brand-neon-purple/20'} flex items-center justify-center flex-shrink-0`}>
            {status === 'processing' ? (
              <Loader2 className="w-5 md:w-6 h-5 md:h-6 text-brand-neon-purple animate-spin" />
            ) : status === 'recording' ? (
              <Square className="w-5 md:w-6 h-5 md:h-6 text-white fill-current" />
            ) : (
              <Mic className="w-5 md:w-6 h-5 md:h-6 text-brand-neon-purple" />
            )}
          </div>

          <div className="flex flex-col items-start pr-2 md:pr-4 flex-1 min-w-0">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] italic text-zinc-500 leading-none mb-0.5 md:mb-1 truncate">
              {status === 'recording' ? 'Gravando Áudio...' : status === 'processing' ? 'Processando IA...' : 'Automação Vocal'}
            </span>
            <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest leading-none truncate">
              {status === 'recording' ? 'Parar Alinhamento' : status === 'processing' ? 'Analizando Atas' : 'Iniciar Reunião'}
            </span>
          </div>

          {!status.includes('recording') && !status.includes('processing') && (
            <div className="absolute top-2 right-2 flex gap-1">
               <Sparkles className="w-3 h-3 text-brand-neon-purple animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* Floating Status Badge */}
      <AnimatePresence>
        {status === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/5 shadow-xl"
          >
            <Bot className="w-4 h-4 text-brand-neon-purple" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Analisando contexto editorial...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeetingAI;
