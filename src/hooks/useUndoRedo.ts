import { useState, useCallback, useRef } from 'react';

interface UseUndoRedoProps<T> {
  initialState: T;
  maxHistorySize?: number;
}

export function useUndoRedo<T>({ 
  initialState, 
  maxHistorySize = 10 
}: UseUndoRedoProps<T>) {
  const [currentState, setCurrentState] = useState<T>(initialState);
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const pushState = useCallback((newState: T) => {
    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(prev => prev); // Keep index the same since we removed from start
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
    
    setCurrentState(newState);
  }, [currentIndex, maxHistorySize]);

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentState(history[newIndex]);
    }
  }, [canUndo, currentIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentState(history[newIndex]);
    }
  }, [canRedo, currentIndex, history]);

  const reset = useCallback((newInitialState?: T) => {
    const resetState = newInitialState || initialState;
    setCurrentState(resetState);
    setHistory([resetState]);
    setCurrentIndex(0);
  }, [initialState]);

  return {
    currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset
  };
}