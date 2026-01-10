import React from 'react';
import { LayoutDashboard, Search, FolderOpen, UserPlus, Zap, Trash2, ShieldCheck } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  description: string;
  icon: any;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-slate-200 rounded-md flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
};

export default PlaceholderView;
