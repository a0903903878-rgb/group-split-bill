const { spawn } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

// 本地模式：仅启动 server，client 使用 vite dev server 直连
function main() {
  const args = ['run', 'dev:server'];
  const cmd = isWindows ? 'npm.cmd' : 'npm';
  const child = spawn(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env, PORT: '3000' },
  });
  child.on('exit', (code) => process.exit(code ?? 0));
}

main();
