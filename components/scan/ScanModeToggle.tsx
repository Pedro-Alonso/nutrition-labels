import { Pressable, Text, View } from 'react-native';

export type ScanMode = 'camera' | 'manual';

interface ScanModeToggleProps {
  mode: ScanMode;
  onChange: (mode: ScanMode) => void;
}

const OPTIONS: { key: ScanMode; label: string }[] = [
  { key: 'camera', label: 'Câmera' },
  { key: 'manual', label: 'Manual' },
];

/** Alternância Câmera ↔ Manual no topo do scanner de código de barras. */
export function ScanModeToggle({ mode, onChange }: ScanModeToggleProps) {
  return (
    <View
      className="flex-row self-center rounded-full bg-black/65 p-1 border border-white/10"
      accessibilityRole="tablist"
    >
      {OPTIONS.map((opt) => {
        const selected = mode === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`Modo ${opt.label}`}
            accessibilityHint={
              opt.key === 'camera'
                ? 'Escanear o código de barras com a câmera'
                : 'Digitar o código de barras pelo teclado'
            }
            className={`min-h-[44px] items-center justify-center rounded-full px-5 ${
              selected ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-sm ${selected ? 'font-semibold text-neutral-900' : 'font-normal text-white/70'}`}
              allowFontScaling
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
