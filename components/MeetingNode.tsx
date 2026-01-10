
import React, { useState } from 'react';
import { NodeProps } from 'reactflow';
import { 
  Mic, 
  Calendar, 
  Video, 
  Users, 
  Clock, 
  CheckCircle2, 
  Play, 
  Square,
  Sparkles,
  VideoIcon,
  Lock,
  Trash2
} from 'lucide-react';
import { N8NBaseNode } from './CustomNodes';
import { MeetingData, NodeData } from '../types';
import { useStore } from '../store';
import { GoogleIntegration } from '../services/google_integration';
import { WhatsAppNotificator } from '../services/whatsapp_notificator';

export const MeetingNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const { updateNodeData } = useStore();
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        updateNodeData(id, { isRecording: false, audioUrl: audioUrl });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      
      updateNodeData(id, { isRecording: true, recordingStartTime: Date.now() });
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      setTimerInterval(interval);
    } catch (err) {
      console.error("Falha ao iniciar gravação:", err);
      alert("Permissão de microfone necessária para o Núcleo Estratégico.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (timerInterval) clearInterval(timerInterval);
    setTimerInterval(null);
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      if (timerInterval) clearInterval(timerInterval);
    } else if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      setTimerInterval(interval);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGenerateTasks = () => {
    const mockTasks = [
      { id: 't1', label: "[PAUTA] Desenvolver Redação 3A", done: false },
      { id: 't2', label: "[SITE] Subir Thumbnail 3B", done: false }
    ];
    updateNodeData(id, { generatedTasks: mockTasks });
  };

  return (
    <N8NBaseNode id={id} title="Governance Meeting (REC)" icon={Users} type="governance" selected={selected} data={data}>
      <div className="space-y-4">
        {/* REC Interface */}
        <div className="p-3 bg-black rounded-xl border border-zinc-700 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${data.isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                {data.isRecording ? 'Gravando...' : 'Pronto'}
              </span>
            </div>
            <span className="text-[12px] font-mono font-bold text-white tracking-widest">{formatTime(timer)}</span>
          </div>

          <div className="flex gap-2">
            {!data.isRecording ? (
              <button 
                onClick={startRecording}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Mic className="w-4 h-4 text-red-500" />
                <span className="text-[9px] font-black uppercase text-white tracking-widest">REC</span>
              </button>
            ) : (
              <>
                <button 
                  onClick={pauseRecording}
                  className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${mediaRecorder?.state === 'paused' ? 'bg-amber-500' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                >
                  <Play className="w-4 h-4 text-white" />
                  <span className="text-[9px] font-black uppercase text-white tracking-widest">
                    {mediaRecorder?.state === 'paused' ? 'RESUME' : 'PAUSE'}
                  </span>
                </button>
                <button 
                  onClick={stopRecording}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Square className="w-4 h-4 text-white" />
                  <span className="text-[9px] font-black uppercase text-white tracking-widest">STOP</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* IA Section - Locked until MP3 */}
        <div className="space-y-2">
          {!data.audioUrl ? (
            <div className="p-4 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-50">
              <Lock className="w-4 h-4 text-zinc-600" />
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Aguardando Áudio .mp3</p>
            </div>
          ) : (
            <div className="space-y-2">
               <button 
                 onClick={handleGenerateTasks}
                 className="w-full py-4 bg-gradient-to-r from-brand-neon-purple to-indigo-600 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] transition-all"
               >
                 <Sparkles className="w-4 h-4 text-white" />
                 <span className="text-[10px] font-black uppercase text-white tracking-widest">Gerar Ata & Tarefas</span>
               </button>
            </div>
          )}
        </div>

        {/* Task Manager (Editable) */}
        {data.generatedTasks && (
          <div className="space-y-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
             <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Tarefas IA</span>
                <button onClick={() => updateNodeData(id, { generatedTasks: [] })} className="text-zinc-600 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
             </div>
             <div className="space-y-2">
                {data.generatedTasks.map((task: any, idx: number) => (
                  <div key={task.id} className="flex items-center gap-2 group">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 rounded bg-black border-zinc-700" 
                      checked={task.done} 
                      onChange={(e) => {
                        const newList = [...data.generatedTasks];
                        newList[idx].done = e.target.checked;
                        updateNodeData(id, { generatedTasks: newList });
                      }}
                    />
                    <input 
                      className="flex-1 bg-transparent border-none p-0 text-[10px] text-white font-bold outline-none"
                      value={task.label}
                      onChange={(e) => {
                        const newList = [...data.generatedTasks];
                        newList[idx].label = e.target.value;
                        updateNodeData(id, { generatedTasks: newList });
                      }}
                    />
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </N8NBaseNode>
  );
};
