import { Redirect } from 'expo-router';
import { ROUTES } from '@/constants/routes';

export default function ScanActionPlaceholder() {
  return <Redirect href={ROUTES.SCAN_BARCODE} />;
}
