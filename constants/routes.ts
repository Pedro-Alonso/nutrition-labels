export const ROUTES = {
  // Auth
  WELCOME: '/(auth)/welcome',
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',

  // App — tabs aninhadas em (tabs); scan é screen full-screen fora das tabs.
  // O grupo (tabs) é transparente na URL, então os paths abaixo não o incluem.
  HOME: '/(app)/(home)',
  SCAN_BARCODE: '/(app)/scan/barcode',
  SCAN_OCR: '/(app)/scan/ocr',
  SCAN_RESULT: '/(app)/scan/result',
  HISTORY: '/(app)/history',
  HISTORY_DETAIL: (scanId: string) => `/(app)/history/${scanId}` as const,
  PROFILE: '/(app)/profile',
  PROFILE_EDIT: '/(app)/profile/edit',
} as const;
