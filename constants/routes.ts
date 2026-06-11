export const ROUTES = {
  // Auth
  WELCOME: '/(auth)/welcome',
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',

  // App — as tabs vivem no grupo (tabs); o scan é screen full-screen fora das
  // tabs. O grupo (tabs) faz parte do href tipado (typedRoutes), então os paths
  // das telas em abas precisam incluí-lo.
  HOME: '/(app)/(tabs)/(home)',
  SCAN_BARCODE: '/(app)/scan/barcode',
  SCAN_TABLE_PHOTO: '/(app)/scan/table-photo',
  SCAN_INGREDIENTS_PHOTO: '/(app)/scan/ingredients-photo',
  SCAN_TABLE_REVIEW: '/(app)/scan/table-review',
  SCAN_INGREDIENTS_REVIEW: '/(app)/scan/ingredients-review',
  SCAN_RESULT: '/(app)/scan/result',
  HISTORY: '/(app)/(tabs)/history',
  HISTORY_DETAIL: (scanId: string) => `/(app)/(tabs)/history/${scanId}` as const,
  PROFILE: '/(app)/(tabs)/profile',
  PROFILE_EDIT: '/(app)/(tabs)/profile/edit',
} as const;
