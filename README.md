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

## 填写个人信息

开发插件前（或开始时），需要修改以下几处：

| 文件 | 说明 |
| --- | --- |
| `tools/build-config.js` | 开头 `var filename = 'sealdice-js-ext.js';`，改成你中意的文件名，注意不要与现有插件重名 |
| `package.json` | `version` 字段是版本号唯一来源，打包与发版都会从这里读取 |
| `header.txt` | 插件描述信息（名称、作者、版本、描述、更新地址等） |
| `sealpack/info.toml` | 豹包元数据：`id`（namespace/package 格式）、`name`、`authors`、`description` 等；`version` 会在打包时自动同步 |

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
2. 已按上面「填写个人信息」改好 `sealpack/info.toml`，并确认 `package.json` 的 `version`。

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
