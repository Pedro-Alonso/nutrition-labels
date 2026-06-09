export const ROUTES = {
  // Auth
  WELCOME: '/(auth)/welcome',
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',

  // App
  HOME: '/(app)/(home)',
  SCAN_BARCODE: '/(app)/scan/barcode',
  SCAN_OCR: '/(app)/scan/ocr',
  SCAN_RESULT: '/(app)/scan/result',
  HISTORY: '/(app)/history',
  HISTORY_DETAIL: (scanId: string) => `/(app)/history/${scanId}` as const,
  PROFILE: '/(app)/profile',
  PROFILE_EDIT: '/(app)/profile/edit',
} as const;
