
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { WhatsAppNotificator } from '../services/whatsapp_notificator';
import { 
  Mic, 
  Square, 
  Pause, 
  Sparkles, 
  Loader2, 
  Bot, 
  Send,
  CheckCircle2,
  Users,
  Clock,
  ListTodo,
  FileText,
  Download,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type RecordingStatus = 'idle' | 'recording' | 'paused' | 'processing' | 'done';

interface ExtractedTask {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  done: boolean;
}

const MeetingRoom: React.FC = () => {
  const { autoGenerateNodesFromMeeting, setIsRecording } = useStore();
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [tasks, setTasks] = useState<ExtractedTask[]>([]);
  const [meetingTitle, setMeetingTitle] = useState('Reunião de Pauta');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        console.log('🎤 [MEETING_LOG]: Áudio capturado!', blob);
        // Aqui poderíamos enviar para uma API de Whisper/STT para transcrição
      };

      mediaRecorder.start();
      setStatus('recording');
      setIsRecording(true);
      setTranscription('Gravando áudio real do microfone...');
    } catch (err) {
      console.error('Erro ao acessar microfone:', err);
      alert('Acesso ao microfone negado ou não suportado.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setStatus('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setStatus('recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setStatus('processing');
    setIsRecording(false);

    // Simular processamento pós-gravação real (substituir por chamada real de IA)
    setTimeout(() => {
      setSummary(
        "Reunião de pauta semanal realizada com toda a equipe editorial. " +
        "Foram definidas as principais pautas da semana, incluindo cobertura de eventos e reportagens especiais. " +
        "João assumiu a responsabilidade pela editoria de economia e Maria ficou com a cobertura de eventos. " +
        "Prazo de entrega definido para quinta-feira às 18h."
      );

      setTasks([
        { id: '1', task: 'Reportagem sobre economia regional', owner: 'João', deadline: '2026-01-10', done: false },
        { id: '2', task: 'Cobertura do evento de sábado', owner: 'Maria', deadline: '2026-01-11', done: false },
        { id: '3', task: 'Atualizar calendário editorial', owner: 'Equipe', deadline: '2026-01-09', done: false },
      ]);

      setStatus('done');

      // Enviar via WhatsApp (simulação)
      WhatsAppNotificator.sendMeetingSummary({
        label: meetingTitle,
        agenda: transcription || 'Reunião gravada pelo NewsFlow',
        taskList: tasks.map(t => ({ task: t.task, owner: t.owner, deadline: t.deadline })),
        videoLink: '',
        status: 'done'
      }, 'OPERAÇÃO DIÁRIO DO VALE').catch(console.error);
    }, 3000);
  };

  const handleSendToCanvas = async () => {
    const meetingData = {
      campaignName: meetingTitle,
      tasks: tasks.map(t => ({
        label: t.task,
        assignee: t.owner,
        deadline: t.deadline,
        checklist: []
      }))
    };

    await autoGenerateNodesFromMeeting(meetingData);
    
    // Reset
    setStatus('idle');
    setTranscription('');
    setSummary('');
    setTasks([]);
    setMeetingTitle('Reunião de Pauta');
  };

  const toggleTaskDone = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="h-full bg-slate-100 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter uppercase">
              Sala de <span className="text-slate-800">Reuniões</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <Users className="w-3 h-3" />
              Transcrição e Processamento por IA
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
              status === 'recording' 
                ? 'bg-red-500/20 border-red-500/50 text-red-500' 
                : status === 'processing'
                  ? 'bg-brand-neon-purple/20 border-brand-neon-purple/50 text-brand-neon-purple'
                  : status === 'done'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500'
                    : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                status === 'recording' ? 'bg-red-500 animate-pulse' : 
                status === 'processing' ? 'bg-brand-neon-purple animate-pulse' :
                status === 'done' ? 'bg-emerald-500' : 'bg-zinc-500'
              }`} />
              <span className="text-xs font-black uppercase tracking-wider">
                {status === 'idle' && 'Aguardando'}
                {status === 'recording' && 'Gravando...'}
                {status === 'processing' && 'Processando...'}
                {status === 'done' && 'Concluído'}
              </span>
            </div>
          </div>
        </div>

        {/* Título da Reunião */}
        <div className="bg-brand-900/50 border border-white/10 rounded-2xl p-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">
            Título da Reunião
          </label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-brand-neon-purple outline-none transition-all"
            placeholder="Ex: Reunião de Pauta Semanal"
          />
        </div>

        {/* Área de Transcrição */}
        <div className="bg-white border border-slate-300 rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Transcrição</span>
            </div>
            {status === 'recording' && (
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-500">AO VIVO</span>
              </div>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder={status === 'idle' ? 'A transcrição aparecerá aqui quando você iniciar a gravação...' : ''}
            className="w-full h-60 bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm text-slate-800 leading-relaxed focus:border-slate-500 outline-none resize-none"
            readOnly={status === 'recording'}
          />
        </div>

        {/* Botão de Gravação */}
        <div className="flex justify-center">
          {status === 'idle' && (
            <button
              onClick={startRecording}
              className="flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Mic className="w-5 h-5" />
              REC
            </button>
          )}
          
          {status === 'recording' && (
            <div className="flex gap-2">
              <button
                onClick={pauseRecording}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-2xl font-bold uppercase tracking-wider hover:scale-105 transition-all"
              >
                <Pause className="w-4 h-4" />
                PAUSE
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold uppercase tracking-wider hover:scale-105 transition-all"
              >
                <Square className="w-4 h-4" />
                STOP
              </button>
            </div>
          )}

          {status === 'paused' && (
            <div className="flex gap-2">
              <button
                onClick={resumeRecording}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-bold uppercase tracking-wider hover:scale-105 transition-all"
              >
                <Mic className="w-4 h-4" />
                RESUME
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold uppercase tracking-wider hover:scale-105 transition-all"
              >
                <Square className="w-4 h-4" />
                STOP
              </button>
            </div>
          )}
          
          {status === 'processing' && (
            <div className="flex items-center gap-3 px-8 py-4 bg-brand-neon-purple/20 border-2 border-brand-neon-purple/50 text-brand-neon-purple rounded-2xl">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-black uppercase tracking-widest">Processando com IA...</span>
            </div>
          )}
        </div>

        {/* Resumo da IA */}
        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-100 border border-slate-300 rounded-2xl p-4 md:p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Resumo Gerado por IA
                </span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">{summary}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Sheets Integration */}
        <div className="mt-8">
          <iframe
            src="https://docs.google.com/spreadsheets/d/your-sheet-id/embed?widget=true&headers=false"
            className="w-full h-96 border border-slate-300 rounded-lg"
            title="Google Sheets - Reunião"
          />
        </div>

        {/* Lista de Tarefas Extraídas */}
        <AnimatePresence>
          {tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-300 rounded-2xl p-4 md:p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <ListTodo className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tarefas Extraídas ({tasks.length})
                </span>
              </div>
              
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`flex items-center gap-4 p-3 bg-slate-50 rounded-xl border ${
                      task.done ? 'border-emerald-500/30 opacity-70' : 'border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleTaskDone(task.id)}
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        task.done 
                          ? 'bg-emerald-500' 
                          : 'bg-slate-200'
                      } transition-colors`}
                    >
                      {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {task.task}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                        <span>{task.owner}</span>
                        <span>{task.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão Enviar ao Canvas e Download */}
        <AnimatePresence>
          {status === 'done' && tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center space-x-4"
            >
              <button
                onClick={handleSendToCanvas}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-wider hover:scale-105 transition-all"
              >
                <Send className="w-4 h-4" />
                Enviar ao Canvas
              </button>
              {audioBlob && (
                <a
                  ref={downloadLinkRef}
                  href={URL.createObjectURL(audioBlob)}
                  download={`meeting-${meetingTitle.replace(/\s+/g, '_')}.wav`}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium hover:bg-slate-300 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Baixar Áudio
                </a>
              )}
            </motion.div>
          )}        </AnimatePresence>
      </div>
    </div>
  );
};

export default MeetingRoom;
