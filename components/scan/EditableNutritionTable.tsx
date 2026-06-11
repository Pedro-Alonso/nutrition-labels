import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { NutritionalTableData } from '@/types/api';
import { InlineEditText } from './InlineEditText';

type Source = 'db' | 'ocr' | 'manual';

interface EditableNutritionTableProps {
  value: NutritionalTableData;
  source: Source;
  onChange: (next: NutritionalTableData) => void;
  onDirtyChange?: (dirty: boolean) => void;
}

interface Row {
  id: number;
  nutrient: string;
  values: string[];
}

const HEADERS: Record<Source, { title: string; subtitle: string }> = {
  db: { title: 'Dados do produto', subtitle: 'Revise e edite se necessário.' },
  ocr: {
    title: 'Tabela extraída do rótulo',
    subtitle: 'Confira se os valores foram lidos certo.',
  },
  manual: { title: 'Preencha a tabela', subtitle: 'Adicione os nutrientes do rótulo.' },
};

/** Ajusta o vetor de valores ao número de colunas (preenche ou corta). */
function fitValues(values: string[], colCount: number): string[] {
  const next = [...values];
  while (next.length < colCount) next.push('');
  return next.slice(0, colCount);
}

function serialize(portion: string, columns: string[], rows: Row[]): string {
  return JSON.stringify({
    portion: portion.trim(),
    columns,
    rows: rows.map((r) => ({ nutrient: r.nutrient, values: r.values })),
  });
}

export function EditableNutritionTable({
  value,
  source,
  onChange,
  onDirtyChange,
}: EditableNutritionTableProps) {
  const colCount = value.columns.length;
  const [portion, setPortion] = useState(value.portion_description ?? '');
  const [columns, setColumns] = useState<string[]>(value.columns);
  const [rows, setRows] = useState<Row[]>(() =>
    value.rows.map((r, i) => ({ id: i, nutrient: r.nutrient, values: fitValues(r.values, colCount) })),
  );
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const nextId = useRef(value.rows.length);
  const initial = useRef(
    serialize(
      value.portion_description ?? '',
      value.columns,
      value.rows.map((r, i) => ({ id: i, nutrient: r.nutrient, values: fitValues(r.values, colCount) })),
    ),
  );

  const { title, subtitle } = HEADERS[source];

  const emit = (nextPortion: string, nextColumns: string[], nextRows: Row[]) => {
    onChange({
      portion_description: nextPortion.trim() === '' ? null : nextPortion,
      columns: nextColumns,
      rows: nextRows.map((r) => ({ nutrient: r.nutrient, values: r.values })),
    });
    onDirtyChange?.(serialize(nextPortion, nextColumns, nextRows) !== initial.current);
  };

  const changePortion = (text: string) => {
    setPortion(text);
    emit(text, columns, rows);
  };

  const changeColumn = (index: number, text: string) => {
    const next = columns.map((c, i) => (i === index ? text : c));
    setColumns(next);
    emit(portion, next, rows);
  };

  const changeNutrient = (id: number, text: string) => {
    const next = rows.map((r) => (r.id === id ? { ...r, nutrient: text } : r));
    setRows(next);
    emit(portion, columns, next);
  };

  const changeValue = (id: number, colIndex: number, text: string) => {
    const next = rows.map((r) =>
      r.id === id ? { ...r, values: r.values.map((v, i) => (i === colIndex ? text : v)) } : r,
    );
    setRows(next);
    emit(portion, columns, next);
  };

  const addRow = () => {
    const id = nextId.current++;
    const next = [...rows, { id, nutrient: '', values: Array(columns.length).fill('') }];
    setRows(next);
    emit(portion, columns, next);
    setEditingKey(`nutrient:${id}`);
  };

  const removeRow = (id: number) => {
    const next = rows.filter((r) => r.id !== id);
    setRows(next);
    emit(portion, columns, next);
  };

  return (
    <View>
      {/* Cabeçalho por origem */}
      <View className="mb-3">
        <Text
          className="text-lg font-semibold text-neutral-900 dark:text-dark-text"
          accessibilityRole="header"
          allowFontScaling
        >
          {title}
        </Text>
        <Text className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-1" allowFontScaling>
          {subtitle}
        </Text>
      </View>

      <View className="border border-neutral-200 dark:border-dark-surface rounded-lg overflow-hidden bg-white dark:bg-dark-card">
        {/* Porção */}
        <View className="px-4 py-3 border-b border-neutral-100 dark:border-dark-surface">
          <Text className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1" allowFontScaling>
            Porção
          </Text>
          <InlineEditText
            value={portion}
            onChangeText={changePortion}
            editing={editingKey === 'portion'}
            onRequestEdit={() => setEditingKey('portion')}
            onEndEdit={() => setEditingKey(null)}
            accessibilityLabel="Descrição da porção"
            placeholder="Ex.: 30 g (2 colheres)"
          />
        </View>

        {/* Cabeçalho de colunas */}
        <View className="flex-row bg-neutral-50 dark:bg-dark-surface border-b border-neutral-200 dark:border-dark-surface px-2 py-2">
          <View className="flex-[2] px-2 justify-center">
            <Text className="text-xs font-bold uppercase text-neutral-600 dark:text-dark-text-secondary" allowFontScaling>
              Nutriente
            </Text>
          </View>
          {columns.map((col, i) => (
            <View key={`col-${i}`} className="flex-1 px-2">
              <InlineEditText
                value={col}
                onChangeText={(t) => changeColumn(i, t)}
                editing={editingKey === `header:${i}`}
                onRequestEdit={() => setEditingKey(`header:${i}`)}
                onEndEdit={() => setEditingKey(null)}
                accessibilityLabel={`Cabeçalho da coluna ${i + 1}`}
                placeholder="Coluna"
                textClassName="text-xs font-bold uppercase text-neutral-600 dark:text-dark-text-secondary"
              />
            </View>
          ))}
          <View className="w-11" />
        </View>

        {/* Linhas */}
        {rows.map((row, idx) => (
          <View
            key={row.id}
            className={`flex-row items-stretch border-b border-neutral-100 dark:border-dark-surface px-2 ${
              idx % 2 === 0 ? 'bg-white dark:bg-dark-card' : 'bg-neutral-50 dark:bg-dark-surface'
            }`}
          >
            <View className="flex-[2] px-2">
              <InlineEditText
                value={row.nutrient}
                onChangeText={(t) => changeNutrient(row.id, t)}
                editing={editingKey === `nutrient:${row.id}`}
                onRequestEdit={() => setEditingKey(`nutrient:${row.id}`)}
                onEndEdit={() => setEditingKey(null)}
                accessibilityLabel={`Nome do nutriente da linha ${idx + 1}`}
                placeholder="Nutriente"
                textClassName="text-base font-medium text-neutral-800 dark:text-dark-text"
              />
            </View>
            {row.values.map((val, i) => (
              <View key={`val-${i}`} className="flex-1 px-2">
                <InlineEditText
                  value={val}
                  onChangeText={(t) => changeValue(row.id, i, t)}
                  editing={editingKey === `value:${row.id}:${i}`}
                  onRequestEdit={() => setEditingKey(`value:${row.id}:${i}`)}
                  onEndEdit={() => setEditingKey(null)}
                  accessibilityLabel={`Valor de ${row.nutrient || `linha ${idx + 1}`}, coluna ${columns[i] || i + 1}`}
                  placeholder="—"
                  textClassName="text-base text-neutral-800 dark:text-dark-text"
                />
              </View>
            ))}
            <Pressable
              onPress={() => removeRow(row.id)}
              accessibilityRole="button"
              accessibilityLabel={`Remover ${row.nutrient || `linha ${idx + 1}`}`}
              className="w-11 items-center justify-center"
              style={{ minHeight: 44 }}
            >
              <Ionicons name="close-circle-outline" size={22} color="#9CA3AF" />
            </Pressable>
          </View>
        ))}

        {/* Adicionar linha */}
        <Pressable
          onPress={addRow}
          accessibilityRole="button"
          accessibilityLabel="Adicionar linha à tabela"
          accessibilityHint="Insere uma nova linha de nutriente"
          className="flex-row items-center justify-center gap-2 py-3 active:bg-primary-50"
          style={{ minHeight: 44 }}
        >
          <Ionicons name="add-circle-outline" size={20} color="#059669" />
          <Text className="text-base font-semibold text-primary-600" allowFontScaling>
            Adicionar linha
          </Text>
        </Pressable>
      </View>

      <Text className="text-xs text-neutral-400 text-center mt-2" allowFontScaling>
        Toque em uma célula para editar.
      </Text>
    </View>
  );
}
