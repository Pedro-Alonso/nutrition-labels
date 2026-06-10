import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

interface NutritionTextProps {
  text: string;
}

export function NutritionText({ text }: NutritionTextProps) {
  const [expanded, setExpanded] = useState(false);
  const label = expanded ? 'Ocultar texto extraído do rótulo' : 'Ver texto extraído do rótulo';

  return (
    <View className="mx-4 mt-2">
      <Pressable
        onPress={() => setExpanded((e) => !e)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={label}
        className="flex-row items-center gap-2 min-h-[44px] py-2 self-start"
      >
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color="#059669" />
        <Text className="text-sm font-semibold text-primary-600" allowFontScaling>
          {label}
        </Text>
      </Pressable>
      {expanded && (
        <Card className="mb-0">
          <Text className="text-sm text-neutral-500 leading-5" allowFontScaling>
            {text}
          </Text>
        </Card>
      )}
    </View>
  );
}
