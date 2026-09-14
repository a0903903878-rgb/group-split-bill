const { execSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
const isWindows = process.platform === 'win32';

function main() {
  const cmd = isWindows ? 'npx.cmd' : 'npx';
  try {
    execSync(`${cmd} eslint "client/src/**/*.{ts,tsx}" "server/src/**/*.ts" "shared/**/*.ts"`, {
      cwd: root,
      stdio: 'inherit',
    });
    execSync(`${cmd} tsc -p tsconfig.json --noEmit`, {
      cwd: root,
      stdio: 'inherit',
    });
    console.log('[precommit] 检查通过');
  } catch (error) {
    console.error('[precommit] 检查失败');
    process.exit(1);
  }
}

main();
