// Liga os logs de API (EXPO_PUBLIC_DEBUG_LOGS=1) e inicia o Expo.
// Wrapper cross-platform: no Windows o `yarn` roda scripts via cmd.exe, onde
// `EXPO_PUBLIC_DEBUG_LOGS=1 expo start` falha. Evita depender de cross-env só
// para um script de dev. Os logs só aparecem em dev (ver lib/logger.ts).
const { spawn } = require('child_process');

process.env.EXPO_PUBLIC_DEBUG_LOGS = '1';

const child = spawn('npx', ['expo', 'start', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));
