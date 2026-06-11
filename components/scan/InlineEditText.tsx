import { Pressable, Text, TextInput, View } from 'react-native';

interface InlineEditTextProps {
  value: string;
  onChangeText: (text: string) => void;
  editing: boolean;
  onRequestEdit: () => void;
  onEndEdit: () => void;
  accessibilityLabel: string;
  placeholder?: string;
  textClassName?: string;
  containerClassName?: string;
  keyboardType?: 'default' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}

/**
 * Campo de texto toque-para-editar reutilizado pelos editores de tabela e de
 * ingredientes. Mostra o valor como rótulo; ao tocar, vira um TextInput com
 * foco automático que confirma a edição ao perder o foco ou ao enviar.
 */
export function InlineEditText({
  value,
  onChangeText,
  editing,
  onRequestEdit,
  onEndEdit,
  accessibilityLabel,
  placeholder = 'Toque para editar',
  textClassName = 'text-base text-neutral-800 dark:text-dark-text',
  containerClassName = '',
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: InlineEditTextProps) {
  if (editing) {
    return (
      <View className={`justify-center ${containerClassName}`} style={{ minHeight: 44 }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onEndEdit}
          onSubmitEditing={onEndEdit}
          autoFocus
          allowFontScaling
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          accessibilityLabel={accessibilityLabel}
          className={`border-b-2 border-primary-500 py-1 ${textClassName}`}
        />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onRequestEdit}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Toque para editar"
      className={`justify-center ${containerClassName}`}
      style={{ minHeight: 44 }}
    >
      <Text
        className={value.trim() === '' ? 'text-base text-neutral-400' : textClassName}
        allowFontScaling
      >
        {value.trim() === '' ? placeholder : value}
      </Text>
    </Pressable>
  );
}
