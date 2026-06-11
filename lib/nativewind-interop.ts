import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';

// NativeWind v4 só mapeia `className` → `style` em componentes RN nativos.
// Componentes de terceiros (ex.: LinearGradient da Expo) ignoram `className`
// silenciosamente até serem registrados aqui.
cssInterop(LinearGradient, { className: 'style' });
