import React from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';

interface UserNodeData {
  id: string;
  name: string;
  cargo: string;
  setor: string;
  avatar_url?: string;
  email?: string;
}

interface UserNodeProps {
  data: UserNodeData;
  selected?: boolean;
}

// Cores por setor
const SECTOR_COLORS: Record<string, string> = {
  'TI': '#EF4444', // Vermelho
  'Comercial': '#3B82F6', // Azul
  'Redação': '#10B981', // Verde
  'Audiovisual': '#8B5CF6', // Roxo
  'Design': '#F59E0B', // Amarelo
  'Logística': '#F43F5E', // Rosa
  'Marketing': '#EC4899', // Pink
  'Administrativo': '#64748B', // Slate
};

export const UserNode: React.FC<UserNodeProps> = ({ data, selected }) => {
  const borderColor = SECTOR_COLORS[data.setor] || '#64748B';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: borderColor, width: '12px', height: '12px' }}
      />
      
      <div
        className={`
          bg-white border-4 rounded-full shadow-lg transition-all
          ${selected ? 'ring-4 ring-purple-200' : ''}
        `}
        style={{
          borderColor: borderColor,
          width: '120px',
          height: '120px',
          padding: '4px',
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
          {data.avatar_url ? (
            <img
              src={data.avatar_url}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
              <span className="text-2xl font-bold text-slate-600">
                {data.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nome e Cargo */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 text-center min-w-[140px]">
        <div className="bg-white border border-slate-300 rounded-lg shadow-md p-2" style={{ borderRadius: '12px' }}>
          <h3 className="text-sm font-bold text-slate-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
            {data.name}
          </h3>
          <p className="text-xs text-slate-600 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
            {data.cargo}
          </p>
          <div className="mt-1">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
              style={{
                backgroundColor: borderColor,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {data.setor}
            </span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: borderColor, width: '12px', height: '12px' }}
      />
    </motion.div>
  );
};
