import { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  password?: boolean;
}

export function Input({ label, error, hint, password = false, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderClass = error
    ? 'border-feedback-error border-2'
    : focused
      ? 'border-primary-500 border-2'
      : 'border-neutral-200 border';

  return (
    <View className="gap-[5px]">
      {label && (
        <Text className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary" allowFontScaling>
          {label}
        </Text>
      )}

      <View className="relative">
        <TextInput
          {...props}
          secureTextEntry={password && !showPassword}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          allowFontScaling
          placeholderTextColor="#9CA3AF"
          className={`h-[52px] ${borderClass} rounded bg-white dark:bg-dark-surface px-4 ${password ? 'pr-12' : ''} text-base text-neutral-800 dark:text-dark-text`}
        />
        {password && (
          <Pressable
            onPress={() => setShowPassword((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute right-3 top-0 bottom-0 justify-center"
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9CA3AF"
            />
          </Pressable>
        )}
      </View>

      {hint && !error && (
        <Text className="text-xs text-neutral-400" allowFontScaling>
          {hint}
        </Text>
      )}
      {error && (
        <Text
          className="text-xs text-feedback-error"
          accessibilityLiveRegion="assertive"
          allowFontScaling
        >
          {error}
        </Text>
      )}
    </View>
  );
}
