import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { ScanHistoryCard } from './ScanHistoryCard';
import type { ScanSummary } from '@/types/api';

interface SwipeableHistoryCardProps {
  scan: ScanSummary;
  onDelete: (scanId: string) => void;
}

export function SwipeableHistoryCard({ scan, onDelete }: SwipeableHistoryCardProps) {
  const swipeableRef = useRef<Swipeable>(null);

  function renderRightActions(
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) {
    const translateX = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ transform: [{ translateX }] }}>
        <RectButton
          style={{
            width: 80,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#EF4444',
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            minHeight: 44,
          }}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete(scan.id);
          }}
          accessibilityLabel="Excluir análise"
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text
            className="text-xs text-white mt-1 font-medium"
            allowFontScaling
          >
            Excluir
          </Text>
        </RectButton>
      </Animated.View>
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <ScanHistoryCard scan={scan} />
    </Swipeable>
  );
}
