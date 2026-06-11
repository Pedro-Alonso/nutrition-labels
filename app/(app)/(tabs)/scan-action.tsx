import { Redirect } from 'expo-router';
import { ROUTES } from '@/constants/routes';

// Rota-fantasma que dá suporte ao botão central "Escanear" da tab bar. O toque é
// interceptado em (tabs)/_layout.tsx (tabPress) e redireciona para o wizard de
// scan full-screen, fora das tabs. Este componente só é alcançado por deep-link
// direto — nesse caso, encaminha para o início do fluxo de scan.
export default function ScanActionPlaceholder() {
  return <Redirect href={ROUTES.SCAN_BARCODE} />;
}
