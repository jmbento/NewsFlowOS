
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  Terminal, 
  Truck, 
  FileLock, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  BookOpen,
  Camera,
  HardDrive,
  MessageSquareOff,
  ChevronRight,
  ChevronLeft,
  X,
  PlayCircle,
  Instagram,
  Youtube,
  Globe,
  Facebook,
  Twitter
} from 'lucide-react';
import { useStore } from '../store';

// Social links configuration
const SOCIAL_LINKS = [
  { icon: Instagram, url: 'https://www.instagram.com/diariodovale/', color: 'text-pink-600', label: '@diariodovale' },
  { icon: Youtube, url: 'https://www.youtube.com/@diariodovale', color: 'text-red-600', label: 'YouTube' },
  { icon: Facebook, url: 'https://www.facebook.com/diariodovale/', color: 'text-blue-700', label: 'Facebook' },
  { icon: Twitter, url: 'https://twitter.com/diariodovale', color: 'text-sky-500', label: 'Twitter' },
  { icon: Globe, url: 'https://diariodovale.com.br/', color: 'text-zinc-600', label: 'Portal' },
];

const chapters = [
  {
    id: 1,
    title: '01. Quem Somos & Hierarquia',
    icon: Users,
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 text-sm leading-relaxed">
          O NewsFlow OS é o ambiente para sua criatividade fluir. Nossa operação é regida pelo Núcleo de Governança, garantindo que cada peça de conteúdo atenda aos padrões de excelência e veracidade.
        </p>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-white/80 border border-zinc-200 rounded-lg shadow-sm">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Validação Estratégica (V-R-M)</span>
            <p className="text-zinc-900 text-xs font-semibold">Decisões finais: Luciano, Renata, Bill e Jader.</p>
          </div>
          <div className="p-4 bg-white/80 border border-zinc-200 rounded-lg shadow-sm">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Células Operacionais</span>
            <p className="text-zinc-900 text-xs font-semibold">Redação, Audiovisual, Logística e TI.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: '02. Uso de Equipamentos (Alba Engine)',
    icon: Camera,
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 text-sm leading-relaxed">
          Nossos ativos são ferramentas de alta precisão. O **Protocolo Alba** é o checklist obrigatório para garantir a integridade física e operacional de cada câmera, lenta e drone.
        </p>
        <div className="space-y-2">
           <div className="flex items-center gap-3 p-3 bg-white/80 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-neon-blue" /> Check-out Digital obrigatório na retirada.
           </div>
           <div className="flex items-center gap-3 p-3 bg-white/80 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-neon-blue" /> Limpeza e carga de baterias no check-in.
           </div>
           <div className="flex items-center gap-3 p-3 bg-white/80 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-neon-blue" /> Backup imediato no servidor Cloud.
           </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: '03. Postura, Sigilo & Backup',
    icon: HardDrive,
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 text-sm leading-relaxed">
          A informação é o nosso maior ativo. O sigilo sobre projetos não publicados (especialmente ESG e Institucionais) é absoluto. Arquivos perdidos por má nomenclatura são considerados falhas graves.
        </p>
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg font-mono">
           <span className="text-[10px] text-zinc-400 block mb-2">// Nomenclatura Padrão</span>
           <p className="text-zinc-600 text-xs">DATA_CLIENTE_PROJETO_V01.mp4</p>
        </div>
        <ul className="text-xs text-zinc-500 space-y-2 list-disc pl-4">
           <li>Uso de crachá obrigatório em campo.</li>
           <li>Proibido posts de "making-of" sem aprovação prévia.</li>
           <li>Sincronização obrigatória ao fim de cada jornada.</li>
        </ul>
      </div>
    )
  }
];

export const GovernancePortal: React.FC = () => {
  const { setUserConsent, setTheme } = useStore();
  const [step, setStep] = useState(0); 
  const [playingVideo, setPlayingVideo] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Set initial joyful theme for portal
  useEffect(() => {
    // We keep dark mode for the app, but for this portal we want it bright
    // setTheme('light'); 
  }, []);

  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden">
      {/* Dynamic Thematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/studio_01.jpg" 
          className="w-full h-full object-cover opacity-60 grayscale-[20%] blur-[1px]" 
          alt="Newsroom Background" 
        />
        <div className="absolute inset-0 bg-linear-to-tr from-white via-white/40 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl bg-white border border-slate-300 rounded-md overflow-hidden flex flex-col shadow-lg m-4">
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 flex">
           {Array.from({ length: 5 }).map((_, i) => (
             <div key={i} className={`flex-1 transition-all duration-500 ${i <= step ? 'bg-amber-500' : 'bg-slate-200'}`} />
           ))}
        </div>

        <div className="p-8 lg:p-12 flex-1 flex flex-col min-h-[600px] bg-white">
          {/* Header with Logo */}
          <div className="flex justify-between items-center mb-8">
            <div className="h-12">
               <img 
                 src="/logo_diario.png" 
                 className="h-full object-contain" 
                 alt="Diário do Vale" 
               />
            </div>
            {step === 0 && (
              <div className="flex gap-2">
                {SOCIAL_LINKS.map((social, i) => (
                  <a 
                    key={i} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors ${social.color}`}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div 
                key="w" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center text-center space-y-8 py-4"
              >
                <div className="w-20 h-20 bg-yellow-400/20 rounded-3xl flex items-center justify-center border border-yellow-400/40 shadow-inner">
                   <Zap className="w-10 h-10 text-yellow-500" />
                </div>
                <div className="max-w-md">
                   <h1 className="text-3xl font-black text-zinc-900 tracking-tight leading-none uppercase italic">
                    NewsFlow <span className="text-yellow-500">Nodes</span>
                   </h1>
                   <p className="text-zinc-600 text-base mt-4 leading-relaxed font-medium">
                    Bem-vindo ao Coração da Nossa Inteligência. O NewsFlow OS é o novo pulso do Diário do Vale.
                   </p>
                </div>

                <div className="w-full max-w-xl aspect-video bg-slate-100 border border-slate-300 rounded-md overflow-hidden relative group cursor-pointer shadow-sm">
                   {playingVideo ? (
                     <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" allowFullScreen />
                   ) : (
                     <div onClick={() => setPlayingVideo(true)} className="absolute inset-0 transition-all">
                        <img src="/building_exterior.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Diário do Vale Exterior" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 flex items-center justify-center transition-all">
                          <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-12 h-12 text-amber-500" />
                          </div>
                        </div>
                        <div className="absolute bottom-6 left-6 text-left">
                           <p className="text-slate-900 text-xs font-semibold uppercase tracking-widest bg-white/90 px-3 py-1 rounded-md">Mensagem da Diretoria</p>
                        </div>
                     </div>
                   )}
                </div>

                <div className="flex flex-col items-center gap-4 w-full">
                  <button onClick={next} className="px-12 py-4 bg-yellow-400 text-zinc-900 rounded-md text-md font-black hover:bg-yellow-500 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md flex items-center gap-3">
                    Próximo <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-xs text-slate-500 font-medium">Acesso restrito a colaboradores autorizados</p>
                </div>
              </motion.div>
            )}

            {step >= 1 && step <= 3 && (
              <motion.div 
                key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-1"
              >
                <div className="flex-1 space-y-8">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center shadow-inner">
                        {React.createElement(chapters[step-1].icon, { className: "w-8 h-8 text-yellow-500" })}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.3em]">Módulo {step}</span>
                        <h2 className="text-2xl font-black text-zinc-900 uppercase italic tracking-tight">{chapters[step-1].title}</h2>
                      </div>
                   </div>
                   <div className="p-1">
                    {chapters[step-1].content}
                   </div>
                </div>
                <div className="mt-auto pt-10 flex justify-between items-center border-t border-zinc-100">
                   <button onClick={back} className="px-6 py-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 flex items-center gap-2 transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Anterior
                   </button>
                   <button onClick={next} className="px-8 py-3 bg-yellow-400 border border-yellow-500 text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-yellow-500 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
                      Próximo <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="f" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-12 py-8"
              >
                <div className="w-24 h-24 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shadow-inner">
                   <ShieldCheck className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="space-y-4 max-w-md">
                   <h2 className="text-2xl font-black text-zinc-900 uppercase italic">Governança Aceita</h2>
                   <p className="text-zinc-500 text-sm leading-relaxed">
                     Sua assinatura digital confirma plena ciência sobre os protocolos de produção, sigilo e gestão de ativos do **Diário do Vale**.
                   </p>
                </div>
                
                <div className="w-full max-w-md space-y-6">
                   <label className="flex items-start gap-4 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer group text-left">
                      <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${accepted ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300 group-hover:border-zinc-400'}`}>
                         {accepted && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <input type="checkbox" hidden checked={accepted} onChange={e => setAccepted(e.target.checked)} />
                      <span className="text-[11px] font-bold text-zinc-500 uppercase leading-snug group-hover:text-zinc-900 transition-colors">
                        Declaro que li e compreendo todas as diretrizes operacionais do NewsFlow OS.
                      </span>
                   </label>
                   
                   <button 
                     disabled={!accepted}
                     onClick={() => setUserConsent('session-' + Date.now())}
                     className={`w-full py-5 rounded-2xl text-md font-black uppercase tracking-widest italic transition-all shadow-xl ${accepted ? 'bg-zinc-900 text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98]' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
                   >
                     Entrar no OS
                   </button>
                   
                   <button onClick={back} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">Revisar Protocolos</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="absolute bottom-6 z-10 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.4em]">
        © 2026 Diário do Vale • Desenvolvido por www.BXD.design
      </div>
    </div>
  );
};
