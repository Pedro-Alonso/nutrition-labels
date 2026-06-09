import { Text, View } from 'react-native';

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeader({ children, className = '' }: SectionHeaderProps) {
  return (
    <View className={`px-4 pt-[22px] pb-2 ${className}`}>
      <Text
        accessibilityRole="header"
        className="text-lg font-semibold text-neutral-900 dark:text-dark-text"
        allowFontScaling
      >
        {children}
      </Text>
    </View>
  );
}
