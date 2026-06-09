import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-neutral-50 p-5">
        <Text className="text-xl font-bold text-neutral-900">
          Esta tela não existe.
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-base font-semibold text-primary-600">
            Voltar para o início
          </Text>
        </Link>
      </View>
    </>
  );
}
