import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface OcrOverlayProps {
  capturing?: boolean;
  disabled?: boolean;
  onCapture: () => void;
  onGalleryPress: () => void;
  onCategoryHintPress: () => void;
}

export function OcrOverlay({
  capturing = false,
  disabled = false,
  onCapture,
  onGalleryPress,
  onCategoryHintPress,
}: OcrOverlayProps) {
  const isCaptureDisabled = capturing || disabled;

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      {/* Instrução superior */}
      <View className="absolute top-16 left-6 right-6">
        <View className="bg-black/60 rounded-xl px-4 py-3">
          <Text
            className="text-base text-white font-medium text-center"
            allowFontScaling
            accessibilityRole="header"
          >
            Enquadre a tabela nutricional ou a lista de ingredientes
          </Text>
        </View>
      </View>

      {/* Frame-guia central */}
      <View
        className="absolute self-center items-center"
        style={{ top: '20%', left: '10%', width: '80%', height: '55%' }}
        pointerEvents="none"
      >
        <View
          className="absolute inset-0"
          style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)', borderStyle: 'dashed', borderRadius: 8 }}
        />
        <Text className="text-xs text-white/60 mt-2" allowFontScaling>
          Rótulo
        </Text>
      </View>

      {/* Controles inferiores */}
      <View
        className="absolute bottom-12 left-8 right-8 flex-row items-center justify-between"
        pointerEvents="box-none"
      >
        <Pressable
          onPress={disabled ? undefined : onGalleryPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Escolher foto da galeria"
          accessibilityHint="Abre a galeria para selecionar uma foto do rótulo"
          className="w-11 h-11 rounded-full bg-white/20 items-center justify-center"
        >
          <Ionicons name="image-outline" size={22} color="#FFFFFF" />
        </Pressable>

        <Pressable
          onPress={isCaptureDisabled ? undefined : onCapture}
          disabled={isCaptureDisabled}
          accessibilityRole="button"
          accessibilityLabel="Tirar foto do rótulo nutricional"
          accessibilityState={{ disabled: isCaptureDisabled, busy: capturing }}
          className="w-[72px] h-[72px] rounded-full border-[3px] border-white items-center justify-center"
        >
          {capturing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View className="w-[60px] h-[60px] rounded-full bg-white" />
          )}
        </Pressable>

        <Pressable
          onPress={onCategoryHintPress}
          accessibilityRole="button"
          accessibilityLabel="Ajuda sobre tipos de rótulo"
          accessibilityHint="Explica os tipos de rótulo que o aplicativo reconhece"
          className="w-11 h-11 rounded-full bg-white/20 items-center justify-center"
        >
          <Ionicons name="help-circle-outline" size={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
