# 海豹 js 扩展模板

一个简单易用的海豹（SealDice）JS 扩展项目模板：使用 esbuild 编译代码，将多个源码文件打包成一个，并内置了 lint / 类型检查 / 冒烟测试 / CI 与 sealpack 发豹包流程。

## 如何使用

```bash
npm install
npm run build
```

编译成功后产物在 `dist` 目录。默认文件名是 `sealdice-js-ext.js`，插件逻辑写在 `src/index.ts`。

## 开发检查

一键跑完所有检查：

```bash
npm run check
```

等价于依次执行：

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit --strict
npm run build       # esbuild 打包
npm run smoke       # 冒烟测试：用 seal 桩在 Node 中加载 dist 产物
```

冒烟测试（`scripts/smoke.js`）在无海豹环境下模拟 `seal` 全局对象并加载打包产物，用于提前发现加载期的 `ReferenceError` / `TypeError`，以及校验扩展是否成功注册。

由于无法动态调试，建议将纯逻辑部分独立编写，随后在调试编译后用 Node 验证想法：

```bash
npm run build-dev
node ./dev/sealdice-js-ext.js
```

## 填写个人信息与替换占位内容

本仓库是通用模板，不是可以直接发布的插件。模板中保留了用于演示构建流程的占位值和示例代码；开始开发后，应按下表逐项替换。只运行 `npm run build` 并不会自动替换这些内容。

| 文件 | 模板内容 | 发布前需要做什么 |
| --- | --- | --- |
| `package.json` | `sealdice-js-ext-template`、模板描述、版本号、仓库地址、`All Rights Reserved（请自行根据开源协议调整）` | 修改项目名称、描述、仓库地址、关键词和版本号。`version` 是打包与发版使用的唯一版本来源；License 应与根目录 `LICENSE` 保持一致。 |
| `package-lock.json` | 与 `package.json` 对应的锁定元数据 | 修改 `package.json` 后使用 `npm install --package-lock-only` 更新，不要手工改依赖版本。 |
| `header.txt` | `模板项目`、`作者名`、示例描述和占位主页 | 修改 `@name`、`@author`、`@description`、`@homepageURL`、`@license` 等用户脚本元数据。该文件会原样添加到生成的 JS 文件头部，版本字段不会由脚本自动改写。 |
| `tools/build-config.js` | `sealdice-js-ext.js` | 按需修改 `filename`。它决定 `dist/` 下的单文件名称，也会决定豹包中的 `scripts/main.js` 来源。 |
| `sealpack/info.toml` | `your-name/your-plugin`、`你的插件名`、`你的名字`、模板描述 | 修改 `[package]` 下的 `id`、`name`、`authors`、`description`、`keywords` 等字段。`id` 必须是唯一的 `namespace/package` 格式；`version` 由 `scripts/prepare-sealpack.js` 根据 `package.json` 自动同步，不需要重复维护。 |
| `sealpack/info.toml` 的 `[permissions]`、`[contents]`、`[store]` | 示例权限、内容路径和商店分类 | 根据插件实际行为声明权限，并确认 `contents` 中的路径确实存在。不要为了通过校验而声明不需要的网络、文件或危险操作权限。 |
| `sealpack/assets/icon.png` | 空白占位图 | 发布到 SealRepo 前替换为自己的商店图标，并保持 `info.toml` 中的路径不变。当前文件只用于保证模板豹包结构完整，不能作为正式商店素材。 |
| `sealpack/README.md` | `你的插件名` 和模板安装说明 | 改成面向插件用户的说明，至少包含用途、安装方式、指令或功能列表、配置项和已知限制。不要把开发流程说明写进豹包用户 README。 |
| `src/index.ts`、`src/utils.ts` | `test` 扩展、`.seal` 示例指令和示例名字 | 用自己的插件逻辑替换或删除示例代码。它们只是用于验证模板构建、注册和 smoke 测试的最小示例。 |
| `LICENSE` | `All Rights Reserved（请自行根据开源协议调整）` 占位说明 | 发布前必须替换为实际采用的许可证文本，并同步修改 `package.json`、`sealpack/info.toml` 和 `header.txt` 中的声明。 |

以下内容由构建脚本生成，不应直接编辑或提交：

- `dist/sealdice-js-ext.js`：`npm run build` 生成的单文件插件；`dist/` 默认被 Git 忽略。
- `sealpack/scripts/main.js`：`npm run package:check` 或打包脚本从 `dist/` 同步的豹包脚本。
- `build/`、`dev/` 和 `*.tsbuildinfo`：本地构建或类型检查缓存。

### 发布前最小检查清单

1. 全文搜索并替换 `你的插件名`、`你的名字`、`your-name/your-plugin`、`作者名` 等占位值。
2. 确认 `package.json`、`header.txt`、`sealpack/info.toml` 和 `LICENSE` 的名称、版本、作者和许可证信息一致。
3. 将 `sealpack/assets/icon.png` 换成正式图标，并检查 `[store]` 中的 README、图标和截图路径。
4. 检查 `[permissions]` 和 `[contents]` 是否只声明插件实际需要的内容。
5. 执行 `npm run check && npm run package:check`，确认构建、类型、smoke 测试和豹包校验全部通过。

## 打包豹包（sealpack）

本地打包并校验：

```bash
npm run package:check   # build + 同步版本 + 校验包格式与体积
npm run pack:sealpack   # 打出 dist/sealdice-js-ext.sealpack
npm run pack:release    # 打出带版本号的本体豹包
```

产物说明：

- `dist/sealdice-js-ext.js`：单文件版，可在海豹 WebUI 直接加载
- `dist/sealdice-js-ext-<版本>.sealpack`：本体豹包，可在扩展商店安装

## 发豹包（发布到海豹商店）

项目已内置 GitHub Actions 发布流水线（`.github/workflows/release.yml`），推 tag 即自动发布。

### 前提

1. 仓库已推送到 GitHub，并配置 Secrets：`SEALPACK_TOKEN`（海豹商店仓库的发布令牌，在商店后台获取）。
2. 已按上面「填写个人信息与替换占位内容」改好 `sealpack/info.toml`，并确认 `package.json` 的 `version`。

### 发布流程

1. 更新版本号：修改 `package.json` 中的 `version`（如 `1.1.0`）。
2. 本地验证：`npm run check && npm run package:check`，确保 lint、类型、构建、冒烟与包格式全部通过。
3. 提交并推送代码。
4. 打 tag 并推送（tag 名必须是 `v` + 版本号，与 `VERSION` 完全一致）：

```bash
git tag v1.1.0
git push origin v1.1.0
```

5. 流水线会自动完成：构建校验 → 版本一致性检查 → 打包 → 发布本体包到 SealRepo（海豹商店）→ 创建 GitHub Release（正文为空，发布后可手动补充）。

### 手动发布（不依赖 CI）

先在本地执行 `npm run pack:release` 生成产物，再安装 sealpack CLI 并发布：

```bash
npm install -g sealpack
export SEALPACK_TOKEN=你的令牌
sealpack publish sealpack --create --server https://repo.sealdice.com/
```

## 相关资源

海豹官方脚本库与大量用户插件示例：

https://github.com/sealdice/javascript

也可以把自己的成果提交到这里，让用户直接在海豹的插件面板安装：

https://github.com/sealdice/javascript/tree/main/scripts
