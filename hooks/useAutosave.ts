import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { supabase } from '../services/supabase';
import { AppNode, AppEdge } from '../types';

interface Workspace {
  id: string;
  name: string;
  layout_json: {
    nodes: AppNode[];
    edges: AppEdge[];
  };
  user_id?: string;
  is_default?: boolean;
  updated_at?: string;
}

const DEBOUNCE_DELAY = 2000; // 2 segundos

export function useAutosave(workspaceId: string | null) {
  // Proteção contra erros no useStore
  let nodes: any[] = [];
  let edges: any[] = [];
  
  try {
    // Usar seletores do Zustand para evitar re-renders desnecessários
    nodes = useStore((state) => state?.nodes || []);
    edges = useStore((state) => state?.edges || []);
  } catch (error) {
    console.error('❌ [AUTOSAVE] Erro ao acessar store:', error);
    // Retornar estado idle se houver erro
  }
  
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  // Função para salvar no Supabase
  const saveWorkspace = async (workspaceId: string) => {
    try {
      // Verificação de segurança
      if (!nodes || !Array.isArray(nodes) || !edges || !Array.isArray(edges)) {
        console.warn('⚠️ [AUTOSAVE] Nodes ou edges não estão disponíveis ainda');
        return;
      }

      setSyncStatus('saving');
      
      const layoutJson = {
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type,
          position: n.position,
          data: n.data,
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          animated: e.animated,
          style: e.style,
        })),
      };

      // Criar hash simples para verificar se houve mudanças
      const currentHash = JSON.stringify(layoutJson);
      if (currentHash === lastSavedRef.current) {
        setSyncStatus('saved');
        return; // Sem mudanças, não precisa salvar
      }

      const { error } = await supabase
        .from('workspaces')
        .update({
          layout_json: layoutJson,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workspaceId);

      if (error) throw error;

      lastSavedRef.current = currentHash;
      setSyncStatus('saved');
      
      // Resetar para 'idle' após 1 segundo
      setTimeout(() => setSyncStatus('idle'), 1000);
    } catch (error) {
      console.error('Erro ao salvar workspace:', error);
      setSyncStatus('idle');
    }
  };

  // Debounce: salvar 2 segundos após a última mudança
  useEffect(() => {
    if (!workspaceId) return;

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Criar novo timeout
    timeoutRef.current = setTimeout(() => {
      saveWorkspace(workspaceId);
    }, DEBOUNCE_DELAY);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nodes, edges, workspaceId]);

  return syncStatus;
}
