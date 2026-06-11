import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { IngredientsData } from '@/types/api';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineEditText } from './InlineEditText';

type Source = 'db' | 'ocr' | 'manual';

interface EditableIngredientListProps {
  value: IngredientsData;
  source: Source;
  onChange: (next: IngredientsData) => void;
  onDirtyChange?: (dirty: boolean) => void;
}

interface Item {
  id: number;
  value: string;
}

const HEADERS: Record<Source, { title: string; subtitle: string }> = {
  db: { title: 'Lista de ingredientes', subtitle: 'Revise e edite se necessário.' },
  ocr: {
    title: 'Ingredientes extraídos do rótulo',
    subtitle: 'Confira se a leitura está correta.',
  },
  manual: {
    title: 'Preencha os ingredientes',
    subtitle: 'Adicione cada ingrediente na ordem do rótulo.',
  },
};

function serialize(items: Item[]): string {
  return JSON.stringify(items.map((i) => i.value));
}

export function EditableIngredientList({
  value,
  source,
  onChange,
  onDirtyChange,
}: EditableIngredientListProps) {
  const [items, setItems] = useState<Item[]>(() =>
    value.items.map((v, i) => ({ id: i, value: v })),
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const nextId = useRef(value.items.length);
  const initial = useRef(serialize(value.items.map((v, i) => ({ id: i, value: v }))));

  const { title, subtitle } = HEADERS[source];

  const emit = (next: Item[]) => {
    onChange({ items: next.map((i) => i.value) });
    onDirtyChange?.(serialize(next) !== initial.current);
  };

  const changeItem = (id: number, text: string) => {
    const next = items.map((i) => (i.id === id ? { ...i, value: text } : i));
    setItems(next);
    emit(next);
  };

  const removeItem = (id: number) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    emit(next);
  };

  const addItem = () => {
    const id = nextId.current++;
    const next = [...items, { id, value: '' }];
    setItems(next);
    emit(next);
    setEditingId(id);
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
        {items.length === 0 ? (
          <EmptyState
            icon="list-outline"
            title="Nenhum ingrediente"
            subtitle="Adicione os ingredientes que aparecem no rótulo."
            actionLabel="Adicionar ingrediente"
            onAction={addItem}
          />
        ) : (
          <>
            {items.map((item, idx) => (
              <View
                key={item.id}
                className={`flex-row items-center gap-2 px-3 border-b border-neutral-100 dark:border-dark-surface ${
                  idx % 2 === 0 ? 'bg-white dark:bg-dark-card' : 'bg-neutral-50 dark:bg-dark-surface'
                }`}
              >
                <Text className="text-sm font-medium text-neutral-400 w-6" allowFontScaling>
                  {idx + 1}.
                </Text>
                <View className="flex-1">
                  <InlineEditText
                    value={item.value}
                    onChangeText={(t) => changeItem(item.id, t)}
                    editing={editingId === item.id}
                    onRequestEdit={() => setEditingId(item.id)}
                    onEndEdit={() => setEditingId(null)}
                    accessibilityLabel={`Ingrediente ${idx + 1}`}
                    placeholder="Nome do ingrediente"
                  />
                </View>
                <Pressable
                  onPress={() => removeItem(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remover ${item.value || `ingrediente ${idx + 1}`}`}
                  className="w-11 items-center justify-center"
                  style={{ minHeight: 44 }}
                >
                  <Ionicons name="close-circle-outline" size={22} color="#9CA3AF" />
                </Pressable>
              </View>
            ))}

            {/* Adicionar ingrediente */}
            <Pressable
              onPress={addItem}
              accessibilityRole="button"
              accessibilityLabel="Adicionar ingrediente"
              accessibilityHint="Insere um novo ingrediente na lista"
              className="flex-row items-center justify-center gap-2 py-3 active:bg-primary-50"
              style={{ minHeight: 44 }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#059669" />
              <Text className="text-base font-semibold text-primary-600" allowFontScaling>
                Adicionar ingrediente
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
