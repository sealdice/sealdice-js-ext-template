// 发布打包：产出两类发布物
//   1. dist/<文件名>                本体 JS（由 npm run build 生成）
//   2. dist/<文件名>-<版本>.sealpack 本体豹包
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sealpackDir = path.join(root, 'sealpack');

function readVersion() {
  return JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
}

function readFilename() {
  const src = fs.readFileSync(path.join(root, 'tools', 'build-config.js'), 'utf8');
  const m = src.match(/var filename\s*=\s*['"]([^'"]+)['"]/);
  if (!m) {
    console.error('未能从 tools/build-config.js 中找到 filename');
    process.exit(1);
  }
  return m[1];
}

function run(cmd, cwd = root) {
  execSync(cmd, { stdio: 'inherit', cwd });
}

function main() {
  const version = readVersion();
  const filename = readFilename();
  const bundle = path.join(root, 'dist', filename);

  if (!fs.existsSync(bundle)) {
    console.error(`构建产物不存在: ${bundle}，请先执行 npm run build`);
    process.exit(1);
  }

  // 1. 准备 sealpack 源目录（同步版本、复制 main.js）
  console.log('[build-release] 准备豹包源...');
  run(`node "${path.join(__dirname, 'prepare-sealpack.js')}"`);

  // 2. 校验并打包
  console.log('[build-release] 校验并打包...');
  run('npx --no-install sealpack validate sealpack');
  run(`npx --no-install sealpack pack sealpack --out "dist/${filename.replace(/\.js$/, '')}-${version}.sealpack"`);

  console.log(`[build-release] 完成：
  - dist/${filename}
  - dist/${filename.replace(/\.js$/, '')}-${version}.sealpack`);
}

main();
