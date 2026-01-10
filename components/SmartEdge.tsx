import React, { useState } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import { useStore } from '../store';
import { Edit2, X } from 'lucide-react';

export type EdgeType = 'default' | 'dependency' | 'blocking' | 'critical';

interface SmartEdgeData {
  label?: string;
  type?: EdgeType;
}

const EDGE_TYPE_CONFIG: Record<EdgeType, { color: string; strokeWidth: number; animated: boolean }> = {
  default: { color: '#707070', strokeWidth: 2, animated: false },
  dependency: { color: '#3B82F6', strokeWidth: 2, animated: false },
  blocking: { color: '#F43F5E', strokeWidth: 3, animated: false },
  critical: { color: '#FFD700', strokeWidth: 3, animated: true },
};

export const SmartEdge: React.FC<EdgeProps<SmartEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const { updateEdgeData } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const edgeType: EdgeType = data?.type || 'default';
  const label = data?.label || 'Gera Demanda';
  const config = EDGE_TYPE_CONFIG[edgeType];

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const handleTypeChange = (newType: EdgeType) => {
    updateEdgeData(id, { type: newType, label });
    setShowMenu(false);
  };

  const handleLabelEdit = (newLabel: string) => {
    updateEdgeData(id, { type: edgeType, label: newLabel });
    setIsEditing(false);
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: config.color,
          strokeWidth: config.strokeWidth,
        }}
        onDoubleClick={handleDoubleClick}
      />
      
      {/* Label com Rótulo */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 11,
            pointerEvents: 'all',
            cursor: 'pointer',
          }}
          className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-md px-2 py-1 text-[#E0E0E0] shadow-lg hover:border-[#FFD700] transition-colors group"
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              type="text"
              defaultValue={label}
              onBlur={(e) => handleLabelEdit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLabelEdit(e.currentTarget.value);
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
              className="bg-[#121212] border border-[#FFD700] rounded px-2 py-1 text-[#E0E0E0] text-xs w-32"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-xs">{label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-[#2A2A2A] rounded"
              >
                <Edit2 className="w-3 h-3 text-[#FFD700]" />
              </button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>

      {/* Menu de Tipo */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div
            className="fixed z-50 bg-[#1E1E1E] border border-[#2A2A2A] rounded-md shadow-xl py-2 min-w-[180px]"
            style={{ left: menuPosition.x, top: menuPosition.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2 text-xs font-semibold text-[#A0A0A0] uppercase border-b border-[#2A2A2A]">
              Tipo de Conexão
            </div>
            {(['default', 'dependency', 'blocking', 'critical'] as EdgeType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`w-full px-4 py-2 text-left text-sm text-[#E0E0E0] hover:bg-[#2A2A2A] flex items-center gap-2 ${
                  edgeType === type ? 'bg-[#2A2A2A] border-l-2 border-[#FFD700]' : ''
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: EDGE_TYPE_CONFIG[type].color }}
                />
                <span className="capitalize">{type === 'default' ? 'Padrão' : type === 'dependency' ? 'Dependência' : type === 'blocking' ? 'Bloqueio' : 'Crítica'}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
};
