import { ActivityIndicator, Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ghost-danger';

interface ButtonProps {
  variant?: Variant;
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-500 active:bg-primary-600 rounded-xl px-6 min-h-[56px]',
    text: 'text-white font-bold text-lg',
  },
  secondary: {
    container:
      'bg-neutral-100 border border-neutral-200 active:bg-neutral-200 rounded-xl px-6 min-h-[56px]',
    text: 'text-neutral-800 font-semibold text-lg',
  },
  ghost: {
    container: 'bg-transparent active:bg-primary-50 rounded-xl px-6 min-h-[44px]',
    text: 'text-primary-600 font-semibold text-lg',
  },
  danger: {
    container: 'bg-feedback-error active:bg-red-700 rounded-xl px-6 min-h-[56px]',
    text: 'text-white font-bold text-lg',
  },
  'ghost-danger': {
    container: 'bg-transparent active:bg-red-50 rounded-xl px-6 min-h-[56px]',
    text: 'text-feedback-error font-semibold text-lg',
  },
};

export function Button({
  variant = 'primary',
  children,
  onPress,
  disabled = false,
  loading = false,
  full = false,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { container, text } = variantClasses[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`${container} ${full ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''} flex-row items-center justify-center`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? '#1F2937' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text className={text} allowFontScaling>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
