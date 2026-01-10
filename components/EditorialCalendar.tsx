import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  LayoutList,
  BarChart3,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'month' | 'timeline';

const EditorialCalendar = () => {
  const { nodes, setActiveTab } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [searchTerm, setSearchTerm] = useState('');

  const events = useMemo(() => {
    return nodes.filter(n => (n.data.scheduledDate || n.data.deadline)).map(n => ({
      id: n.id,
      title: n.data.label,
      date: new Date(n.data.scheduledDate || n.data.deadline || ''),
      type: n.type,
      status: n.data.status,
      assignee: n.data.assignee || 'Sem responsável'
    }));
  }, [nodes]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  const calendarDays = useMemo(() => {
    const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const startOffset = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days = [];

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  }, [currentDate]);

  const getEventsForDay = (day: number) => {
    return events.filter(e => 
      e.date.getDate() === day && 
      e.date.getMonth() === currentDate.getMonth() && 
      e.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      campaign: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      os: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      site: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      print: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      video: 'bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    };
    return colors[type] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">
              Calendário <span className="text-yellow-500">Editorial</span>
            </h1>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Gestão de Pautas e Publicações
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text"
                placeholder="Buscar pauta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 border border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  viewMode === 'month' 
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4 inline mr-1" /> Mês
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  viewMode === 'timeline' 
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-1" /> Timeline
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 rounded-xl p-1 border border-zinc-200 dark:border-zinc-800">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-4 min-w-[160px] text-center">
                <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wide">{monthName}</span>
              </div>
              <button onClick={handleNextMonth} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Views */}
        <AnimatePresence mode="wait">
          {viewMode === 'month' ? (
            <motion.div
              key="month"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                  <div key={d} className="py-4 text-center text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const isToday = day === new Date().getDate() && 
                                  currentDate.getMonth() === new Date().getMonth() &&
                                  currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div 
                      key={idx} 
                      className={`min-h-[120px] border-r border-b border-zinc-100 dark:border-zinc-800 p-2 ${
                        day ? 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50' : 'bg-zinc-50 dark:bg-zinc-900/30'
                      } transition-colors`}
                    >
                      {day && (
                        <>
                          <div className={`text-xs font-bold mb-2 ${
                            isToday 
                              ? 'w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center' 
                              : 'text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map(event => (
                              <div 
                                key={event.id}
                                onClick={() => setActiveTab('canvas')}
                                className={`text-[9px] font-bold px-2 py-1 rounded border cursor-pointer hover:scale-105 transition-transform ${getEventColor(event.type)}`}
                              >
                                <div className="truncate">{event.title}</div>
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 px-2">
                                +{dayEvents.length - 3} mais
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Timeline Header */}
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wide">
                  Timeline de Produção
                </h3>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-widest">
                  Visualização em barras horizontais
                </p>
              </div>

              {/* Timeline Grid */}
              <div className="p-6 space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-bold">Nenhuma pauta agendada</p>
                  </div>
                ) : (
                  filteredEvents.map(event => {
                    const daysUntil = Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isOverdue = daysUntil < 0;
                    const isUrgent = daysUntil >= 0 && daysUntil <= 3;

                    return (
                      <div 
                        key={event.id}
                        onClick={() => setActiveTab('canvas')}
                        className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${getEventColor(event.type)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-black uppercase tracking-tight">{event.title}</h4>
                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-wider mt-0.5">
                              {event.assignee}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs font-black uppercase tracking-wide ${
                              isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : ''
                            }`}>
                              {event.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </div>
                            <div className="text-[9px] font-bold opacity-70 uppercase tracking-wider">
                              {isOverdue ? 'ATRASADO' : isUrgent ? 'URGENTE' : `${daysUntil}d`}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              event.status === 'done' ? 'bg-emerald-500' :
                              event.status === 'doing' ? 'bg-yellow-500' :
                              'bg-zinc-400'
                            }`}
                            style={{ 
                              width: event.status === 'done' ? '100%' : 
                                     event.status === 'doing' ? '50%' : '10%' 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditorialCalendar;
