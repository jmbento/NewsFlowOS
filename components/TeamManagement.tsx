import React, { useState } from 'react';
import { useStore } from '../store';
import { TeamMember, AvailabilityStatus } from '../types';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Search,
  Briefcase,
  AlertTriangle,
  Palmtree,
  HeartPulse,
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Availability Status Config
const AVAILABILITY_CONFIG: Record<AvailabilityStatus, { label: string; color: string; icon: any; badge: string }> = {
  ACTIVE: { label: 'Ativo', color: 'bg-emerald-500', icon: Briefcase, badge: '' },
  VACATION: { label: 'Férias', color: 'bg-amber-500', icon: Palmtree, badge: 'Férias' },
  SICK_LEAVE: { label: 'Licença Médica', color: 'bg-blue-500', icon: HeartPulse, badge: 'Licença' },
  OFFBOARDED: { label: 'Desligado', color: 'bg-slate-400', icon: UserX, badge: 'Inativo' },
};

// Team Member Card with Ghost Mode
const TeamCard = ({ member }: { member: TeamMember }) => {
  const isGhost = member.availability_status !== 'ACTIVE';
  const config = AVAILABILITY_CONFIG[member.availability_status] || AVAILABILITY_CONFIG.ACTIVE;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white dark:bg-slate-800 
        border border-slate-200 dark:border-slate-700 
        rounded-xl p-5 
        transition-all
        ${isGhost ? 'opacity-50' : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'}
      `}
    >
      {/* Ghost Badge */}
      {isGhost && (
        <div className={`${config.color} text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md inline-flex items-center gap-1 mb-3`}>
          <config.icon className="w-3 h-3" />
          {config.badge}
        </div>
      )}
      
      {/* Avatar + Info */}
      <div className="flex items-start gap-4">
        <div className={`relative ${isGhost ? 'grayscale' : ''}`}>
          <img 
            src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
            alt={member.name}
            className="w-14 h-14 rounded-xl object-cover"
          />
          {!isGhost && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{member.role}</p>
          <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-semibold rounded-md">
            {member.sector}
          </span>
        </div>
      </div>
      
      {/* Contact Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <a 
          href={`mailto:${member.email}`}
          className="flex-1 py-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
        <a 
          href={`https://wa.me/55${member.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <Phone className="w-3.5 h-3.5" /> WhatsApp
        </a>
      </div>
      
      {/* Away Info */}
      {isGhost && member.away_reason && (
        <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[10px] text-slate-600 dark:text-slate-400">
            {member.away_reason}
            {member.away_until && ` • Retorno: ${new Date(member.away_until).toLocaleDateString('pt-BR')}`}
          </span>
        </div>
      )}
    </motion.div>
  );
};

const TeamManagement: React.FC = () => {
  const { team, inviteTeamMember } = useStore();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('All');
  
  const filteredTeam = team?.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = filterSector === 'All' || m.sector === filterSector;
    return matchesSearch && matchesSector;
  });

  // Ordenar: Ativos primeiro, depois os inativos
  const sortedTeam = [...filteredTeam].sort((a, b) => {
    if (a.availability_status === 'ACTIVE' && b.availability_status !== 'ACTIVE') return -1;
    if (a.availability_status !== 'ACTIVE' && b.availability_status === 'ACTIVE') return 1;
    return 0;
  });

  const activeCount = team?.filter(m => m.availability_status === 'ACTIVE').length;
  const awayCount = team?.filter(m => m.availability_status !== 'ACTIVE').length;

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Equipe</h1>
          <p className="text-sm text-slate-500 mt-1">
            {activeCount} ativos • {awayCount} ausentes
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 outline-none transition-all"
            />
          </div>
          
          {/* Filter */}
          <select 
            value={filterSector}
            onChange={e => setFilterSector(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 outline-none"
          >
            <option value="All">Todos</option>
            <option value="Audiovisual">Audiovisual</option>
            <option value="Redação">Redação</option>
            <option value="Comercial">Comercial</option>
            <option value="Logística">Logística</option>
            <option value="Marketing">Marketing</option>
            <option value="TI">TI</option>
            <option value="Administrativo">Administrativo</option>
          </select>
          
          {/* Add Button */}
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden md:inline">Adicionar</span>
          </button>
        </div>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
          <AnimatePresence>
            {sortedTeam.map(member => (
              <TeamCard key={member.id} member={member} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
