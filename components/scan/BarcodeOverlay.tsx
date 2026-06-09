import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface BarcodeOverlayProps {
  /** Brevemente destaca o frame em verde ao detectar um código. */
  success?: boolean;
  onCancel: () => void;
}

const FRAME_TOP = '37.5%';
const FRAME_LEFT = '15%';
const FRAME_WIDTH = '70%';
const FRAME_HEIGHT = '25%';
const CORNER_SIZE = 24;
const CORNER_BORDER = 3;

export function BarcodeOverlay({ success = false, onCancel }: BarcodeOverlayProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.02, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true,
    );
  }, [scale]);

  const animatedFrameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cornerColor = success ? '#10B981' : '#FFFFFF';

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      {/* Vinheta escura ao redor do frame central */}
      <View className="absolute top-0 left-0 right-0 bg-black/50" style={{ height: FRAME_TOP }} />
      <View className="absolute bottom-0 left-0 right-0 bg-black/50" style={{ height: FRAME_TOP }} />
      <View
        className="absolute left-0 bg-black/50"
        style={{ top: FRAME_TOP, height: FRAME_HEIGHT, width: FRAME_LEFT }}
      />
      <View
        className="absolute right-0 bg-black/50"
        style={{ top: FRAME_TOP, height: FRAME_HEIGHT, width: FRAME_LEFT }}
      />

      {/* Frame de mira com 4 cantos */}
      <Animated.View
        style={[
          { position: 'absolute', top: FRAME_TOP, left: FRAME_LEFT, width: FRAME_WIDTH, height: FRAME_HEIGHT },
          animatedFrameStyle,
        ]}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CORNER_SIZE,
            height: CORNER_SIZE,
            borderTopWidth: CORNER_BORDER,
            borderLeftWidth: CORNER_BORDER,
            borderColor: cornerColor,
            borderTopLeftRadius: 4,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: CORNER_SIZE,
            height: CORNER_SIZE,
            borderTopWidth: CORNER_BORDER,
            borderRightWidth: CORNER_BORDER,
            borderColor: cornerColor,
            borderTopRightRadius: 4,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: CORNER_SIZE,
            height: CORNER_SIZE,
            borderBottomWidth: CORNER_BORDER,
            borderLeftWidth: CORNER_BORDER,
            borderColor: cornerColor,
            borderBottomLeftRadius: 4,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: CORNER_SIZE,
            height: CORNER_SIZE,
            borderBottomWidth: CORNER_BORDER,
            borderRightWidth: CORNER_BORDER,
            borderColor: cornerColor,
            borderBottomRightRadius: 4,
          }}
        />
      </Animated.View>

      {/* Instrução superior */}
      <View className="absolute top-16 left-8 right-8 items-center">
        <View className="bg-black/50 rounded-full px-4 py-2">
          <Text className="text-base text-white text-center" allowFontScaling accessibilityRole="header">
            Aponte para o código de barras
          </Text>
        </View>
      </View>

      {/* Área inferior: instrução + cancelar */}
      <View className="absolute bottom-6 left-8 right-8" pointerEvents="box-none">
        <Text className="text-sm text-white/70 text-center mb-4" allowFontScaling>
          Posicione o código dentro do quadro
        </Text>
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          accessibilityHint="Volta para a tela inicial"
          className="min-h-[44px] items-center justify-center rounded-xl border border-white/40 px-6 active:bg-white/10"
        >
          <Text className="text-base font-semibold text-white" allowFontScaling>
            Cancelar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
