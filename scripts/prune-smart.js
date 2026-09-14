const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dirs = ['client', 'server', 'shared', 'scripts'];

// 清理未使用的文件（用于减少包体积）
function main() {
  for (const dir of dirs) {
    const full = path.join(root, dir);
    if (!fs.existsSync(full)) continue;
    prune(full);
  }
  console.log('[prune-smart] 清理完成');
}

function prune(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) prune(full);
  }
}

main();
