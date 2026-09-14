const { execSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

function main() {
  const cmd = isWindows ? 'npx.cmd' : 'npx';
  try {
    execSync(`${cmd} eslint "client/src/**/*.{ts,tsx}" "server/src/**/*.ts" "shared/**/*.ts"`, {
      cwd: root,
      stdio: 'inherit',
    });
  } catch (error) {
    process.exit(1);
  }
}

main();
