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
// Tamanho visual das alças e margem extra de toque (alça + 2*slop >= 44pt).
const HANDLE_SIZE = 24;
const HANDLE_HIT_SLOP = 10;

function clamp(value: number, lo: number, hi: number): number {
  'worklet';
  return Math.min(Math.max(value, lo), hi);
}

interface EdgeFlags {
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
}

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

  // Valores de início do gesto de mover (pan do corpo).
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Arestas do retângulo capturadas no início de um gesto de redimensionar.
  const startLeft = useSharedValue(0);
  const startTop = useSharedValue(0);
  const startRight = useSharedValue(0);
  const startBottom = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((e) => {
      x.value = clamp(startX.value + e.translationX, minX, maxX - width.value);
      y.value = clamp(startY.value + e.translationY, minY, maxY - height.value);
    });

  // Cada alça controla um subconjunto de arestas, mantendo as arestas opostas
  // fixas (capturadas em onStart) — permite redimensionar livremente.
  const makeEdgeGesture = (edges: EdgeFlags) =>
    Gesture.Pan()
      .hitSlop(HANDLE_HIT_SLOP)
      .onStart(() => {
        startLeft.value = x.value;
        startTop.value = y.value;
        startRight.value = x.value + width.value;
        startBottom.value = y.value + height.value;
      })
      .onUpdate((e) => {
        if (edges.left) {
          const newLeft = clamp(startLeft.value + e.translationX, minX, startRight.value - MIN_RECT_SIZE);
          x.value = newLeft;
          width.value = startRight.value - newLeft;
        }
        if (edges.right) {
          const newRight = clamp(startRight.value + e.translationX, startLeft.value + MIN_RECT_SIZE, maxX);
          width.value = newRight - startLeft.value;
        }
        if (edges.top) {
          const newTop = clamp(startTop.value + e.translationY, minY, startBottom.value - MIN_RECT_SIZE);
          y.value = newTop;
          height.value = startBottom.value - newTop;
        }
        if (edges.bottom) {
          const newBottom = clamp(startBottom.value + e.translationY, startTop.value + MIN_RECT_SIZE, maxY);
          height.value = newBottom - startTop.value;
        }
      });

  const rectStyle = useAnimatedStyle(() => ({
    left: x.value,
    top: y.value,
    width: width.value,
    height: height.value,
  }));

  const topLeftStyle = useAnimatedStyle(() => ({
    left: x.value - HANDLE_SIZE / 2,
    top: y.value - HANDLE_SIZE / 2,
  }));
  const topStyle = useAnimatedStyle(() => ({
    left: x.value + width.value / 2 - HANDLE_SIZE / 2,
    top: y.value - HANDLE_SIZE / 2,
  }));
  const topRightStyle = useAnimatedStyle(() => ({
    left: x.value + width.value - HANDLE_SIZE / 2,
    top: y.value - HANDLE_SIZE / 2,
  }));
  const rightStyle = useAnimatedStyle(() => ({
    left: x.value + width.value - HANDLE_SIZE / 2,
    top: y.value + height.value / 2 - HANDLE_SIZE / 2,
  }));
  const bottomRightStyle = useAnimatedStyle(() => ({
    left: x.value + width.value - HANDLE_SIZE / 2,
    top: y.value + height.value - HANDLE_SIZE / 2,
  }));
  const bottomStyle = useAnimatedStyle(() => ({
    left: x.value + width.value / 2 - HANDLE_SIZE / 2,
    top: y.value + height.value - HANDLE_SIZE / 2,
  }));
  const bottomLeftStyle = useAnimatedStyle(() => ({
    left: x.value - HANDLE_SIZE / 2,
    top: y.value + height.value - HANDLE_SIZE / 2,
  }));
  const leftStyle = useAnimatedStyle(() => ({
    left: x.value - HANDLE_SIZE / 2,
    top: y.value + height.value / 2 - HANDLE_SIZE / 2,
  }));

  const handles = [
    { style: topLeftStyle, gesture: makeEdgeGesture({ left: true, top: true }), label: 'Canto superior esquerdo' },
    { style: topStyle, gesture: makeEdgeGesture({ top: true }), label: 'Borda superior' },
    { style: topRightStyle, gesture: makeEdgeGesture({ right: true, top: true }), label: 'Canto superior direito' },
    { style: rightStyle, gesture: makeEdgeGesture({ right: true }), label: 'Borda direita' },
    { style: bottomRightStyle, gesture: makeEdgeGesture({ right: true, bottom: true }), label: 'Canto inferior direito' },
    { style: bottomStyle, gesture: makeEdgeGesture({ bottom: true }), label: 'Borda inferior' },
    { style: bottomLeftStyle, gesture: makeEdgeGesture({ left: true, bottom: true }), label: 'Canto inferior esquerdo' },
    { style: leftStyle, gesture: makeEdgeGesture({ left: true }), label: 'Borda esquerda' },
  ];

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

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            { position: 'absolute', borderWidth: 2, borderColor: '#10B981', borderRadius: 8 },
            rectStyle,
          ]}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Área de corte da foto"
          accessibilityHint="Arraste para mover a área de corte"
        />
      </GestureDetector>

      {handles.map((handle) => (
        <GestureDetector key={handle.label} gesture={handle.gesture}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: HANDLE_SIZE,
                height: HANDLE_SIZE,
                borderRadius: HANDLE_SIZE / 2,
                backgroundColor: '#FFFFFF',
                borderWidth: 2,
                borderColor: '#10B981',
              },
              handle.style,
            ]}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={handle.label}
            accessibilityHint="Arraste para redimensionar a área de corte"
          />
        </GestureDetector>
      ))}

      <View className="absolute left-5 right-5" style={{ top: insets.top + 16 }}>
        <View className="bg-black/60 rounded-xl px-4 py-3">
          <Text className="text-base text-white font-medium text-center" allowFontScaling accessibilityRole="header">
            Ajuste a área da foto
          </Text>
          <Text className="text-sm text-white/70 text-center mt-1" allowFontScaling>
            Arraste os cantos e bordas para ajustar a área; arraste o centro para mover.
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
