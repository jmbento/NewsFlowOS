
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Briefcase, 
  FileText, 
  MapPin,
  Zap,
  Award,
  Play,
  ExternalLink
} from 'lucide-react';
import { TrainingPrompts } from '../services/training_prompts';

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const OnboardingGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const markComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const steps: Step[] = [
    {
      id: 0,
      title: "Bem-vindo ao NewsFlow OS",
      icon: <Zap className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-zinc-400 leading-relaxed">
            O NewsFlow OS é a plataforma de gestão de produção multimídia do Diário do Vale. 
            Este guia irá orientá-lo nas principais funcionalidades.
          </p>
          <div className="bg-black/40 rounded-3xl aspect-video flex items-center justify-center border border-white/5">
            <Play className="w-16 h-16 text-zinc-700" />
          </div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-center">Vídeo de Introdução (2 min)</p>
        </div>
      )
    },
    {
      id: 1,
      title: "Módulo Comercial",
      icon: <Briefcase className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-zinc-400 leading-relaxed">
            Gerencie propostas comerciais na <strong className="text-white">Central de Vendas</strong>.
          </p>
          <div className="space-y-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
              <h4 className="text-sm font-bold text-indigo-400 uppercase mb-2">Pacote Institucional</h4>
              <p className="text-3xl font-black text-white">R$ 25.000</p>
              <p className="text-xs text-zinc-500 mt-2">Ideal para aniversários e marcos institucionais.</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
              <h4 className="text-sm font-bold text-emerald-400 uppercase mb-2">Pacote ESG</h4>
              <p className="text-3xl font-black text-white">R$ 40.000</p>
              <p className="text-xs text-zinc-500 mt-2">4 reportagens em vídeo + 4 capas de jornal.</p>
            </div>
          </div>
          <div className="bg-black/30 p-4 rounded-xl border border-white/5">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Dica de Argumentação</p>
            <p className="text-xs text-zinc-300">{TrainingPrompts.ARGUMENTO_ALCANCE.prompt.slice(0, 200)}...</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Módulo Editorial",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-zinc-400 leading-relaxed">
            Transforme reuniões em fluxos de produção no <strong className="text-white">Canvas de Fluxo</strong>.
          </p>
          <ol className="space-y-4">
            <li className="flex items-start gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
              <span className="bg-brand-neon-purple text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <div>
                <p className="text-sm font-bold text-white">Crie um Nó de Reunião</p>
                <p className="text-xs text-zinc-500">Clique em "REUNIÃO (GOV)" no painel do Canvas.</p>
              </div>
            </li>
            <li className="flex items-start gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
              <span className="bg-brand-neon-purple text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <div>
                <p className="text-sm font-bold text-white">Grave a Reunião ou Agende a Videoconferência</p>
                <p className="text-xs text-zinc-500">Use os botões de áudio ou videoconferência.</p>
              </div>
            </li>
            <li className="flex items-start gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
              <span className="bg-brand-neon-purple text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <div>
                <p className="text-sm font-bold text-white">Processe a Ata com IA</p>
                <p className="text-xs text-zinc-500">A IA gera tarefas e conecta automaticamente no Canvas.</p>
              </div>
            </li>
          </ol>
        </div>
      )
    },
    {
      id: 3,
      title: "Módulo de Campo",
      icon: <MapPin className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-zinc-400 leading-relaxed">
            Jornalistas em campo usam o <strong className="text-white">Central de Campo</strong> para reportar status.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {['Volta Redonda', 'Barra Mansa', 'Resende', 'Itatiaia', 'Porto Real', 'Pinheiral'].map(city => (
              <div key={city} className="bg-brand-neon-blue/10 border border-brand-neon-blue/20 p-3 rounded-xl text-center">
                <p className="text-[10px] font-black text-brand-neon-blue uppercase">{city}</p>
              </div>
            ))}
          </div>
          <div className="bg-black/30 p-4 rounded-xl border border-white/5">
            <p className="text-xs text-zinc-400">
              Acesse a Central de Campo no celular para atualizar o status das captações em tempo real. 
              O Canvas central é atualizado automaticamente.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Conclusão",
      icon: <Award className="w-5 h-5" />,
      content: (
        <div className="space-y-6 text-center">
          <Award className="w-20 h-20 text-amber-500 mx-auto" />
          <h3 className="text-2xl font-black text-white">Integração Completa! 🎉</h3>
          <p className="text-zinc-400">
            Você está pronto para operar o NewsFlow OS. Explore as funcionalidades e consulte a documentação.
          </p>
          <a 
            href="/assets/docs/best_practices.md" 
            target="_blank"
            className="inline-flex items-center gap-2 bg-brand-neon-purple text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
          >
            <ExternalLink className="w-4 h-4" />
            Ver Melhores Práticas
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 lg:p-12">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                completedSteps.includes(index) 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : index === currentStep 
                    ? 'border-brand-neon-purple text-brand-neon-purple' 
                    : 'border-zinc-700 text-zinc-700'
              }`}>
                {completedSteps.includes(index) ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${completedSteps.includes(index) ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-slate-900/50 border border-white/5 rounded-[40px] p-10 min-h-[400px]">
          <h2 className="text-2xl font-black text-white tracking-tighter mb-8">{steps[currentStep].title}</h2>
          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-bold">Anterior</span>
          </button>

          <button
            onClick={markComplete}
            className="flex items-center gap-2 bg-brand-neon-purple text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
          >
            <span>{currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
