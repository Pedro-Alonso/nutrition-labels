import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Phase = 'camera' | 'preview';

interface OcrOverlayProps {
  // Fase atual: controles da câmera ou confirmação da foto capturada.
  phase?: Phase;
  // Texto-guia superior.
  title?: string;
  subtitle?: string;
  // Legenda do frame-guia central.
  guideLabel?: string;
  capturing?: boolean;
  disabled?: boolean;
  // Preview (quando phase === 'preview').
  previewUri?: string | null;
  previewLabel?: string;
  previewQuestion?: string;
  onRetake?: () => void;
  onConfirm?: () => void;
  // Controles da câmera.
  onCapture: () => void;
  onGalleryPress: () => void;
  // Botão "Manual": pula a foto e segue para o preenchimento manual.
  onManualPress?: () => void;
  // Botão de ajuda. Só aparece se onManualPress não for passado.
  onCategoryHintPress?: () => void;
}

export function OcrOverlay({
  phase = 'camera',
  title = 'Enquadre a tabela nutricional ou a lista de ingredientes',
  subtitle,
  guideLabel = 'Rótulo',
  capturing = false,
  disabled = false,
  previewUri,
  previewLabel,
  previewQuestion,
  onRetake,
  onConfirm,
  onCapture,
  onGalleryPress,
  onManualPress,
  onCategoryHintPress,
}: OcrOverlayProps) {
  const insets = useSafeAreaInsets();
  const isCaptureDisabled = capturing || disabled;

  // ── Fase de preview: foto capturada + pergunta de confirmação ──
  if (phase === 'preview') {
    return (
      <View className="absolute inset-0 bg-neutral-900" pointerEvents="auto" accessible accessibilityViewIsModal>
        <View className="flex-1 items-center justify-center px-5 gap-5">
          {previewUri && (
            <Image
              source={{ uri: previewUri }}
              style={{ width: '85%', height: '62%', borderRadius: 12 }}
              resizeMode="contain"
              accessibilityLabel={previewLabel ?? 'Foto capturada do rótulo'}
              accessibilityRole="image"
            />
          )}
          <View className="items-center" accessible>
            {previewLabel && (
              <Text className="text-base font-semibold text-white mb-1 text-center" allowFontScaling>
                {previewLabel}
              </Text>
            )}
            {previewQuestion && (
              <Text className="text-sm text-white/60 text-center" allowFontScaling>
                {previewQuestion}
              </Text>
            )}
          </View>
        </View>

        <View
          className="flex-row gap-3 px-4 pt-3 border-t border-white/10 bg-black/40"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Pressable
            onPress={onRetake}
            accessibilityRole="button"
            accessibilityLabel="Tirar foto novamente"
            className="flex-1 rounded-xl border border-white/40 items-center justify-center active:bg-white/10"
            style={{ minHeight: 56 }}
          >
            <Text className="text-white font-semibold text-lg" allowFontScaling>
              Tirar novamente
            </Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel="Confirmar foto"
            className="flex-1 rounded-xl bg-primary-500 items-center justify-center active:bg-primary-600"
            style={{ minHeight: 56 }}
          >
            <Text className="text-white font-bold text-lg" allowFontScaling>
              Confirmar
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Fase de câmera: instrução, frame-guia e controles ──
  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      {/* Instrução superior — abaixo do header transparente + safe area */}
      <View className="absolute left-6 right-6" style={{ top: insets.top + 56 }}>
        <View className="bg-black/60 rounded-xl px-4 py-3">
          <Text
            className="text-base text-white font-medium text-center"
            allowFontScaling
            accessibilityRole="header"
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-white/70 font-normal text-center mt-1" allowFontScaling>
              {subtitle}
            </Text>
          )}
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
          {guideLabel}
        </Text>
      </View>

      {/* Controles inferiores */}
      <View
        className="absolute bottom-0 left-8 right-8 flex-row items-center justify-between"
        style={{ paddingBottom: insets.bottom + 16 }}
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

        {onManualPress ? (
          <Pressable
            onPress={disabled ? undefined : onManualPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Preencher manualmente"
            accessibilityHint="Pula a foto e abre o preenchimento manual desta etapa"
            className="w-12 h-12 rounded-full bg-white/20 items-center justify-center gap-0.5"
          >
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
            <Text className="text-[9px] text-white/70" allowFontScaling>
              Manual
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onCategoryHintPress}
            accessibilityRole="button"
            accessibilityLabel="Ajuda sobre tipos de rótulo"
            accessibilityHint="Explica os tipos de rótulo que o aplicativo reconhece"
            className="w-11 h-11 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="help-circle-outline" size={22} color="#FFFFFF" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
