import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { IngredientAnalysis, IngredientsData, NutritionalTableData } from '@/types/api';
import type { ScanSource } from '@/types/domain';

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

export interface ScanCapture {
  barcode: string;
  tableUri: string | null;
  ingredientsUri: string | null;
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
  capture: ScanCapture | null;
  startCapture: (barcode: string) => void;
  setCaptureTable: (uri: string | null) => void;
  setCaptureIngredients: (uri: string | null) => void;
  reset: () => void;
}

const ScanFlowContext = createContext<ScanFlowStore | null>(null);

export function ScanFlowProvider({ children }: { children: ReactNode }) {
  const [flow, setFlow] = useState<ScanFlowState | null>(null);
  const [capture, setCapture] = useState<ScanCapture | null>(null);

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

  const startCapture = useCallback((barcode: string) => {
    setCapture({ barcode, tableUri: null, ingredientsUri: null });
  }, []);

  const setCaptureTable = useCallback((uri: string | null) => {
    setCapture((prev) => (prev ? { ...prev, tableUri: uri } : prev));
  }, []);

  const setCaptureIngredients = useCallback((uri: string | null) => {
    setCapture((prev) => (prev ? { ...prev, ingredientsUri: uri } : prev));
  }, []);

  const reset = useCallback(() => {
    setFlow(null);
    setCapture(null);
  }, []);

  const value = useMemo<ScanFlowStore>(
    () => ({
      flow,
      dirty: !!flow && (flow.tableDirty || flow.ingredientsDirty),
      startFlow,
      setNutritionalTable,
      setTableDirty,
      setIngredients,
      setIngredientsDirty,
      capture,
      startCapture,
      setCaptureTable,
      setCaptureIngredients,
      reset,
    }),
    [
      flow,
      startFlow,
      setNutritionalTable,
      setTableDirty,
      setIngredients,
      setIngredientsDirty,
      capture,
      startCapture,
      setCaptureTable,
      setCaptureIngredients,
      reset,
    ],
  );

  return <ScanFlowContext.Provider value={value}>{children}</ScanFlowContext.Provider>;
}

export function useScanFlow(): ScanFlowStore {
  const ctx = useContext(ScanFlowContext);
  if (!ctx) throw new Error('useScanFlow must be used within ScanFlowProvider');
  return ctx;
}
