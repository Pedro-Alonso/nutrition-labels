import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface CropRect {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

interface CropOverlayProps {
  uri: string;
  imageWidth: number;
  imageHeight: number;
  onCrop: (rect: CropRect) => void | Promise<void>;
  onSkip: () => void;
}

// Tamanho mínimo (em px de tela) do retângulo de corte.
const MIN_RECT_SIZE = 80;

export function CropOverlay({ uri, imageWidth, imageHeight, onCrop, onSkip }: CropOverlayProps) {
  const insets = useSafeAreaInsets();
  const { width: containerWidth, height: containerHeight } = useWindowDimensions();
  const [processing, setProcessing] = useState(false);

  // Dimensões renderizadas da imagem em modo "contain" dentro da tela.
  const imageRatio = imageWidth / imageHeight;
  const containerRatio = containerWidth / containerHeight;
  let renderWidth: number;
  let renderHeight: number;
  if (imageRatio > containerRatio) {
    renderWidth = containerWidth;
    renderHeight = containerWidth / imageRatio;
  } else {
    renderHeight = containerHeight;
    renderWidth = containerHeight * imageRatio;
  }
  const offsetX = (containerWidth - renderWidth) / 2;
  const offsetY = (containerHeight - renderHeight) / 2;
  const minX = offsetX;
  const minY = offsetY;
  const maxX = offsetX + renderWidth;
  const maxY = offsetY + renderHeight;

  // Retângulo inicial: reaproveita o frame-guia do OcrOverlay
  // (top 20% / left 10% / 80% x 55%), relativo à área renderizada da imagem.
  const x = useSharedValue(offsetX + renderWidth * 0.1);
  const y = useSharedValue(offsetY + renderHeight * 0.2);
  const width = useSharedValue(renderWidth * 0.8);
  const height = useSharedValue(renderHeight * 0.55);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startWidth = useSharedValue(0);
  const startHeight = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((e) => {
      const nextX = Math.max(minX, Math.min(startX.value + e.translationX, maxX - width.value));
      const nextY = Math.max(minY, Math.min(startY.value + e.translationY, maxY - height.value));
      x.value = nextX;
      y.value = nextY;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      startX.value = x.value;
      startY.value = y.value;
      startWidth.value = width.value;
      startHeight.value = height.value;
    })
    .onUpdate((e) => {
      const centerX = startX.value + startWidth.value / 2;
      const centerY = startY.value + startHeight.value / 2;
      const nextWidth = Math.max(MIN_RECT_SIZE, Math.min(startWidth.value * e.scale, maxX - minX));
      const nextHeight = Math.max(MIN_RECT_SIZE, Math.min(startHeight.value * e.scale, maxY - minY));
      width.value = nextWidth;
      height.value = nextHeight;
      x.value = Math.max(minX, Math.min(centerX - nextWidth / 2, maxX - nextWidth));
      y.value = Math.max(minY, Math.min(centerY - nextHeight / 2, maxY - nextHeight));
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const rectStyle = useAnimatedStyle(() => ({
    left: x.value,
    top: y.value,
    width: width.value,
    height: height.value,
  }));

  const handleCrop = async () => {
    if (processing) return;
    setProcessing(true);
    const scale = imageWidth / renderWidth;
    const originX = Math.round((x.value - offsetX) * scale);
    const originY = Math.round((y.value - offsetY) * scale);
    const cropWidth = Math.round(width.value * scale);
    const cropHeight = Math.round(height.value * scale);
    await onCrop({
      originX: Math.max(0, Math.min(originX, imageWidth - 1)),
      originY: Math.max(0, Math.min(originY, imageHeight - 1)),
      width: Math.max(1, Math.min(cropWidth, imageWidth - originX)),
      height: Math.max(1, Math.min(cropHeight, imageHeight - originY)),
    });
  };

  return (
    <View className="absolute inset-0 bg-neutral-900" accessible accessibilityViewIsModal>
      <Image
        source={{ uri }}
        style={{ position: 'absolute', left: offsetX, top: offsetY, width: renderWidth, height: renderHeight }}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="Foto capturada do rótulo"
      />

      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[
            { position: 'absolute', borderWidth: 2, borderColor: '#10B981', borderRadius: 8 },
            rectStyle,
          ]}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Área de corte da foto"
          accessibilityHint="Arraste para mover e use dois dedos para redimensionar o quadro"
        />
      </GestureDetector>

      <View className="absolute left-5 right-5" style={{ top: insets.top + 16 }}>
        <View className="bg-black/60 rounded-xl px-4 py-3">
          <Text className="text-base text-white font-medium text-center" allowFontScaling accessibilityRole="header">
            Ajuste a área da foto
          </Text>
          <Text className="text-sm text-white/70 text-center mt-1" allowFontScaling>
            Arraste para mover e use dois dedos para redimensionar o quadro
          </Text>
        </View>
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-4 pt-3 border-t border-white/10 bg-black/40"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={processing ? undefined : onSkip}
          disabled={processing}
          accessibilityRole="button"
          accessibilityLabel="Pular recorte"
          className="flex-1 rounded-xl border border-white/40 items-center justify-center active:bg-white/10"
          style={{ minHeight: 56 }}
        >
          <Text className="text-white font-semibold text-lg" allowFontScaling>
            Pular
          </Text>
        </Pressable>
        <Pressable
          onPress={handleCrop}
          disabled={processing}
          accessibilityRole="button"
          accessibilityLabel="Recortar foto"
          accessibilityState={{ disabled: processing, busy: processing }}
          className="flex-1 rounded-xl bg-primary-500 items-center justify-center active:bg-primary-600"
          style={{ minHeight: 56 }}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-lg" allowFontScaling>
              Recortar
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
