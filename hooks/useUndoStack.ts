import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar histórico de estados (Undo/Redo)
 * Limite de 10 estados conforme solicitado
 */
export function useUndoStack<T>(initialState: T, maxStackSize: number = 10) {
  const [currentState, setCurrentState] = useState<T>(initialState);
  const [undoStack, setUndoStack] = useState<T[]>([]);
  const [redoStack, setRedoStack] = useState<T[]>([]);

  const pushState = useCallback(
    (newState: T) => {
      setUndoStack((prev) => {
        const newStack = [...prev, currentState];
        // Limitar o tamanho da pilha
        if (newStack.length > maxStackSize) {
          return newStack.slice(-maxStackSize);
        }
        return newStack;
      });
      setCurrentState(newState);
      // Limpar redo stack quando um novo estado é adicionado
      setRedoStack([]);
    },
    [currentState, maxStackSize]
  );

  const undo = useCallback(() => {
    if (undoStack.length === 0) return false;

    const previousState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [currentState, ...prev]);
    setUndoStack((prev) => prev.slice(0, -1));
    setCurrentState(previousState);
    return true;
  }, [undoStack, currentState]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return false;

    const nextState = redoStack[0];
    setUndoStack((prev) => [...prev, currentState]);
    setRedoStack((prev) => prev.slice(1));
    setCurrentState(nextState);
    return true;
  }, [redoStack, currentState]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const reset = useCallback((newState: T) => {
    setCurrentState(newState);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  return {
    state: currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}
