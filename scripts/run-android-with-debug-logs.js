// Inicia o `expo run:android` com os logs de API (EXPO_PUBLIC_DEBUG_LOGS=1).
// Wrapper cross-platform para evitar problemas com `yarn` no cmd.exe do Windows.
const { spawn } = require("child_process");

process.env.EXPO_PUBLIC_DEBUG_LOGS = "1";

const child = spawn("npx", ["expo", "run:android", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
