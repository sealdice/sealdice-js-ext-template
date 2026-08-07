/**
 * 加载冒烟测试：用 seal 桩（Proxy 兜底）在 Node 中直接加载打包产物，
 * 用于在无 SealDice 环境下提前发现加载期的 ReferenceError/TypeError。
 * 用法：npm run build && npm run smoke
 */
const noop = () => undefined;

const registered = [];

const sealStub = {
  ext: {
    find: () => undefined,
    new: (name, author, version) => ({
      name: name || '',
      author: author || '',
      version: version || '',
      cmdMap: {},
    }),
    register: (ext) => {
      registered.push(ext);
    },
    newCmdItemInfo: () => ({
      cmdMap: {},
      allowDelegate: true,
      solve: noop,
    }),
    newCmdExecuteResult: () => ({}),
    getCtxProxyFirst: (ctx) => ctx,
  },
  vars: {},
  format: (ctx, text) => String(text || ''),
  formatTmpl: (ctx, text) => String(text || ''),
  replyToSender: noop,
  replyPerson: noop,
  replyGroup: noop,
  base64ToImage: (s) => s,
  getCtxProxyFirst: (c) => c,
};

// 兜底：访问任何未定义属性时返回 noop 函数
globalThis.seal = new Proxy(sealStub, {
  get(t, p) {
    return p in t ? t[p] : noop;
  },
  set(t, p, v) {
    t[p] = v;
    return true;
  },
});

try {
  require('../dist/sealdice-js-ext.js');

  const checks = {
    '扩展已通过 seal.ext.register 注册': registered.length > 0,
    '扩展名非空': registered.length > 0 && !!registered[0].name,
    '注册了至少一个指令': registered.length > 0 && Object.keys(registered[0].cmdMap || {}).length > 0,
  };
  const failedChecks = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);

  if (failedChecks.length > 0) {
    console.error('SMOKE FAIL:', failedChecks.join(', '));
    process.exit(1);
  }

  const ext = registered[0];
  const cmdNames = Object.keys(ext.cmdMap).join(', ');
  console.log(`SMOKE OK: 插件加载无异常，已注册扩展 <${ext.name}>，指令: ${cmdNames}`);
} catch (e) {
  console.error('SMOKE FAIL:', e.message);
  console.error(e.stack);
  process.exit(1);
}
