
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { chatWithGemini } from '../services/geminiService';
import { supabase } from '../services/supabase';
import { 
  Send, 
  Smartphone, 
  Sparkles, 
  MessageSquare, 
  X, 
  ChevronDown, 
  Phone, 
  Bot,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const { messages, addMessage, setMessages } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageId = crypto.randomUUID();
    const userMsg = {
      id: messageId,
      sender: 'user' as const,
      text: input,
      timestamp: new Date()
    };

    addMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await chatWithGemini(input);
      const aiMsg = {
        id: crypto.randomUUID(),
        sender: 'ai' as const,
        text: aiResponse || "Ocorreu um erro.",
        timestamp: new Date()
      };
      addMessage(aiMsg);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-4 md:left-8 z-[100] flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom left' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[calc(100vw-2rem)] md:w-96 h-[400px] md:h-[500px] bg-brand-950/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Smartphone className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white italic tracking-tighter uppercase italic">Ponte de Chat</h3>
                  <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                    WhatsApp ao Vivo
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {messages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1 opacity-40">
                       {msg.isWhatsApp && <Phone className="w-2 h-2 text-emerald-500" />}
                       <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400">
                          {msg.sender === 'user' ? 'EU' : msg.sender === 'ai' ? 'GENFLOW' : 'WA'}
                       </span>
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                      ? 'bg-brand-neon-blue text-white rounded-tr-none shadow-lg shadow-brand-neon-blue/10' 
                      : 'bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex gap-2 items-center">
                      <Loader2 className="w-3 h-3 text-brand-neon-purple animate-spin" />
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">IA Pensando...</span>
                   </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-5 bg-black/40 border-t border-white/5">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Mensagem..."
                  className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-neon-blue transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-brand-neon-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-neon-blue/20 disabled:opacity-20 transition-all active:scale-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all relative group ${
          isOpen ? 'bg-white/10 text-white' : 'bg-brand-neon-blue text-white shadow-brand-neon-blue/20'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-7 h-7" />
              {/* Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-brand-950 rounded-full flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatInterface;
