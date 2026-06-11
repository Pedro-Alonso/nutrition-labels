import { Pressable, Text, View } from 'react-native';

const OPTIONS = [
  { value: 'type1', label: 'Tipo 1' },
  { value: 'type2', label: 'Tipo 2' },
  { value: 'dmg', label: 'Gestacional' },
] as const;

type DiabetesType = (typeof OPTIONS)[number]['value'];

interface DiabetesTypePickerProps {
  value: DiabetesType | null;
  onChange: (value: DiabetesType) => void;
  error?: string;
}

export function DiabetesTypePicker({ value, onChange, error }: DiabetesTypePickerProps) {
  return (
    <View accessible accessibilityLabel="Tipo de diabetes">
      <Text className="text-sm font-medium text-neutral-600 mb-2" allowFontScaling>
        Tipo de diabetes
      </Text>
      <View className="flex-row flex-wrap gap-2">
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
      {error ? (
        <Text
          className="text-xs text-feedback-error mt-1.5"
          accessibilityLiveRegion="assertive"
          allowFontScaling
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
