import { Text, View } from 'react-native';

// Placeholder de scaffold. Será substituído pela lógica de entrada
// (redirect auth vs app) em feat/02–04. Serve para verificar que o bundler
// roda e que o NativeWind está ativo.
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-neutral-50 p-6">
      <Text className="text-3xl font-bold text-primary-700">NutriLabel</Text>
      <Text className="text-base text-neutral-600">
        Estrutura do projeto pronta.
      </Text>
      <Text className="text-sm text-neutral-400">
        Implemente as subpartes em fe/plans/ (01 → 09).
      </Text>
    </View>
  );
}
