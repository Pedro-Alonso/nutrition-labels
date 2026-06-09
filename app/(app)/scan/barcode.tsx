import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export default function BarcodeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 px-8" accessible>
      <Ionicons name="barcode-outline" size={56} color="#9CA3AF" style={{ marginBottom: 16, opacity: 0.7 }} />
      <Text className="text-xl font-semibold text-neutral-700 text-center mb-2" allowFontScaling>
        Leitor de código de barras
      </Text>
      <Text className="text-sm text-neutral-400 text-center" allowFontScaling>
        Esta tela será implementada em breve.
      </Text>
    </View>
  );
}
