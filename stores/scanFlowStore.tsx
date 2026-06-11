import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { IngredientAnalysis, IngredientsData, NutritionalTableData } from '@/types/api';
import type { ScanSource } from '@/types/domain';

// Estado compartilhado do wizard de scan (telas de revisão). Mantém a tabela e
// os ingredientes editados entre as telas sem serializar dados pesados nos
// params de navegação.

export interface ScanFlowData {
  barcode: string;
  source: ScanSource;
  // create → POST (produto novo, vindo do OCR); update → PUT (produto existente).
  mode: 'create' | 'update';
  productName: string | null;
  nutritionalTable: NutritionalTableData;
  ingredients: IngredientsData;
  // Análise já disponível (caminho do banco). null no caminho OCR até persistir.
  analysis: IngredientAnalysis | null;
}

interface ScanFlowState extends ScanFlowData {
  tableDirty: boolean;
  ingredientsDirty: boolean;
}

export interface ScanFlowStore {
  flow: ScanFlowState | null;
  // dirty acumulado: tabela OU ingredientes editados.
  dirty: boolean;
  startFlow: (data: ScanFlowData) => void;
  setNutritionalTable: (table: NutritionalTableData) => void;
  setTableDirty: (dirty: boolean) => void;
  setIngredients: (ingredients: IngredientsData) => void;
  setIngredientsDirty: (dirty: boolean) => void;
  reset: () => void;
}

const ScanFlowContext = createContext<ScanFlowStore | null>(null);

export function ScanFlowProvider({ children }: { children: ReactNode }) {
  const [flow, setFlow] = useState<ScanFlowState | null>(null);

  const startFlow = useCallback((data: ScanFlowData) => {
    setFlow({ ...data, tableDirty: false, ingredientsDirty: false });
  }, []);

  const setNutritionalTable = useCallback((table: NutritionalTableData) => {
    setFlow((prev) => (prev ? { ...prev, nutritionalTable: table } : prev));
  }, []);

  const setTableDirty = useCallback((dirty: boolean) => {
    setFlow((prev) => (prev ? { ...prev, tableDirty: dirty } : prev));
  }, []);

  const setIngredients = useCallback((ingredients: IngredientsData) => {
    setFlow((prev) => (prev ? { ...prev, ingredients } : prev));
  }, []);

  const setIngredientsDirty = useCallback((dirty: boolean) => {
    setFlow((prev) => (prev ? { ...prev, ingredientsDirty: dirty } : prev));
  }, []);

  const reset = useCallback(() => setFlow(null), []);

  const value = useMemo<ScanFlowStore>(
    () => ({
      flow,
      dirty: !!flow && (flow.tableDirty || flow.ingredientsDirty),
      startFlow,
      setNutritionalTable,
      setTableDirty,
      setIngredients,
      setIngredientsDirty,
      reset,
    }),
    [flow, startFlow, setNutritionalTable, setTableDirty, setIngredients, setIngredientsDirty, reset],
  );

  return <ScanFlowContext.Provider value={value}>{children}</ScanFlowContext.Provider>;
}

export function useScanFlow(): ScanFlowStore {
  const ctx = useContext(ScanFlowContext);
  if (!ctx) throw new Error('useScanFlow must be used within ScanFlowProvider');
  return ctx;
}
