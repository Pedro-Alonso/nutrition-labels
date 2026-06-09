import RNBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  scrollable?: boolean;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  snapPoints: snapPointsProp,
  scrollable = false,
}: BottomSheetProps) {
  const ref = useRef<RNBottomSheet>(null);
  const snapPoints = useMemo(() => snapPointsProp ?? ['72%'], [snapPointsProp]);

  const handleChange = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.45} />
    ),
    [],
  );

  // Imperative show/hide driven by `visible`
  if (visible) {
    ref.current?.snapToIndex(0);
  } else {
    ref.current?.close();
  }

  return (
    <RNBottomSheet
      ref={ref}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleChange}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: '#E5E7EB', width: 40 }}
      backgroundStyle={{ borderRadius: 20 }}
    >
      {scrollable ? (
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {children}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetView>
          <View className="pb-8">{children}</View>
        </BottomSheetView>
      )}
    </RNBottomSheet>
  );
}
