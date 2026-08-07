// 构建 sealpack 打包源目录（sealpack/）：
// 1. 从 package.json 读取插件版本 version；
// 2. 从 tools/build-config.js 读取输出文件名；
// 3. 将构建产物 dist/<文件名> 复制为 sealpack/scripts/main.js；
// 4. 同步 sealpack/info.toml 中的 version，保证与插件版本一致；
// 5. 在 stdout 输出版本号，供 CI 拼接产物文件名。
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const buildConfig = path.join(root, 'tools', 'build-config.js');
const sealpackDir = path.join(root, 'sealpack');
const mainJs = path.join(sealpackDir, 'scripts', 'main.js');
const infoToml = path.join(sealpackDir, 'info.toml');

function readVersion() {
  return JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
}

function readFilename() {
  const src = fs.readFileSync(buildConfig, 'utf8');
  const m = src.match(/var filename\s*=\s*['"]([^'"]+)['"]/);
  if (!m) {
    console.error(`未能从 tools/build-config.js 中找到 filename`);
    process.exit(1);
  }
  return m[1];
}

const version = readVersion();
const filename = readFilename();
const bundle = path.join(root, 'dist', filename);

if (!fs.existsSync(bundle)) {
  console.error(`构建产物不存在: ${bundle}，请先执行 npm run build`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(mainJs), { recursive: true });
fs.copyFileSync(bundle, mainJs);

const toml = fs.readFileSync(infoToml, 'utf8').replace(
  /^version\s*=\s*".*"$/m,
  `version = "${version}"`
);
fs.writeFileSync(infoToml, toml);

console.log(version);
