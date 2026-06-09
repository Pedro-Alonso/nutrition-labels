import { Pressable, Text, View } from 'react-native';

const OPTIONS = [
  { value: 'leigo', label: 'Linguagem simples' },
  { value: 'tecnico', label: 'Linguagem técnica' },
] as const;

type LanguageLevel = (typeof OPTIONS)[number]['value'];

interface LanguageLevelPickerProps {
  value: LanguageLevel | null;
  onChange: (value: LanguageLevel) => void;
}

export function LanguageLevelPicker({ value, onChange }: LanguageLevelPickerProps) {
  return (
    <View accessible accessibilityLabel="Nível de linguagem">
      <Text className="text-sm font-medium text-neutral-600 mb-2" allowFontScaling>
        Nível de linguagem
      </Text>
      <View className="flex-row gap-2">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              accessibilityRole="button"
              accessibilityLabel={opt.label}
              accessibilityState={{ selected }}
              className={`flex-1 min-h-[44px] items-center justify-center rounded-lg border px-3 py-2 ${
                selected
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <Text
                className={`text-sm font-medium text-center ${
                  selected ? 'text-white' : 'text-neutral-700'
                }`}
                allowFontScaling
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
