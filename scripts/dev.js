const { spawn } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

function run(name, args, opts = {}) {
  const cmd = isWindows ? 'npx.cmd' : 'npx';
  const child = spawn(cmd, [name, ...args], {
    cwd: root,
    stdio: 'inherit',
    shell: isWindows,
    ...opts,
  });
  return child;
}

function main() {
  const server = run('nest', ['start', '--watch'], { env: { ...process.env, PORT: '3000' } });
  const client = run('vite', [], { env: { ...process.env, PORT: '8080' } });

  const shutdown = () => {
    server.kill('SIGTERM');
    client.kill('SIGTERM');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();
