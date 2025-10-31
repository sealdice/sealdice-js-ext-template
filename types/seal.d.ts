declare namespace seal {
  /** 信息上下文 */
  export interface MsgContext {
    endPoint: EndPointInfo;
    /** 当前群信息 */
    group: GroupInfo;
    /** 当前群的玩家数据 */
    player: GroupPlayerInfo;
    /** 当前群内是否启用bot（注:强制@时这个值也是true，此项是给特殊指令用的） */
    isCurGroupBotOn: boolean;
    /** 是否私聊 */
    isPrivate: boolean;
    /** 权限等级 -30ban 40邀请者 50管理 60群主 70信任 100master */
    privilegeLevel: number;
    /** 代骰附加文本 */
    delegateText: string;
    /** 发送通知到配置的 Notice 列表 */
    notice(text: string): void;
  }

  /** 轻量键值映射（临时变量存储）*/
  export interface ValueMap {
    /** 获取 */
    get(k: string): [any, boolean];
    /** 添加 */
    set(k: string, v: any): void;
    /** 删除 */
    del(k: string): void;
    /** 数量 */
    len(): number;
    /** 迭代 */
    next(): [any, any, boolean];
    /** 遍历 参数不能传入 `()=>null`，但可以传入 `()=>{}` 或者 `function(){}` */
    iterate(fun: (k: any, v: any) => void): void;
    /** 加锁 */
    lock(): void;
    /** 解锁 */
    unlock(): void;
  }

  /** 群信息 */
  export interface GroupInfo {
    active: boolean;
    groupId: string;
    guildId: string;
    channelId: string;
    groupName: string;
    /** COC规则序号 */
    cocRuleIndex: number;
    /** 当前log名字，若未开启为空 */
    logCurName: string;
    /** 当前log是否开启 */
    logOn: boolean;
    /** 是否显示入群迎新信息 */
    showGroupWelcome: boolean;
    /** 入群迎新文本 */
    groupWelcomeMessage: string;
    /** 最后骰子回复时间(时间戳) */
    recentDiceSendTime: number;
    /** 最后指令时间(时间戳) */
    recentCommandTime: number;
    /** 入群时间(时间戳) */
    enteredTime: number;
    /** 邀请人ID */
    inviteUserId: string;
  }

  /** 群内玩家数据 */
  export interface GroupPlayerInfo {
    /** 用户昵称 */
    name: string;
    /** 用户ID */
    userId: string;
    /** 上次执行指令时间 */
    lastCommandTime: number;
    /** 名片模板 */
    autoSetNameTemplate: string;
  }

  /** 消息详情 */
  export interface Message {
    /** 当前平台，如QQ */
    platform: string;
    /** 消息内容 */
    message: string;
    /** 发送时间（时间戳） */
    time: number;
    /** 群消息/私聊消息 */
    messageType: 'group' | 'private';
    /** 群ID */
    groupId: string;
    /** 服务器ID */
    guildId: string;
    /** 频道ID（如 Discord/Kook） */
    channelId: string;
    /** 群名称 */
    groupName: string;
    /** 发送者信息 */
    sender: Sender;
    /** 原始ID，用于撤回等情况 */
    rawId: string | number;
    /** 消息段（实验性，仅部分平台支持） */
    segment: any[];
  }

  /** 创建一个 Message 对象 */
  export function newMessage(): Message;

  /** 创建一个 ctx 对象 */
  export function createTempCtx(
    endPoint: EndPointInfo,
    msg: Message
  ): MsgContext;

  /** 发送者信息 */
  export interface Sender {
    nickname: string;
    userId: string;
  }
  
  /** 通信端点，即骰子关联的帐号的信息 */
  export interface EndPointInfo {
    id: string;
    /** 昵称 */
    nickname: string;
    /** 状态 0 断开 1已连接 2连接中 3连接失败 */
    state: number;
    /** 用户id */
    userId: string;
    /** 群数量 */
    groupNum: number;
    /** 指令执行数量 */
    cmdExecutedNum: number;
    /** 最后命令执行时间 */
    cmdExecutedLastTime: number;
    /** 平台 */
    platform: string;
    /** 是否启用 */
    enable: boolean;
    /** 协议类型 onebot/official/kook/discord等 */
    protocolType: string;
    /** 是否公开 */
    isPublic: boolean;
    // adapter: PlatformAdapter;
  }

  export interface AtInfo {
    userId: string;
  }

  export interface Kwarg {
    /** 名称 */
    name: string;
    /** 是否存在value */
    valueExists: boolean;
    /** value的值 */
    value: string;
    /** 将value转换为bool，如'0' ''等会自动转为false */
    asBool: boolean;
  }

  /** 指令参数 */
  export interface CmdArgs {
    /** 当前命令，与指令的name相对，例如.ra时，command为ra */
    command: string;
    /** 指令参数，如“.ra 力量 测试”时，参数1为“力量”，参数2为“测试” */
    args: string[];
    /** 关键字参数 */
    kwargs: Kwarg[];
    /** 当前被at的有哪些 */
    at: AtInfo[];
    /** 参数的原始文本 */
    rawArgs: string;
    /** 我被at了 */
    amIBeMentioned: boolean;
    /** 同上，但要求是第一个被at的 */
    amIBeMentionedFirst: boolean;
    /** 一种格式化后的参数，也就是中间所有分隔符都用一个空格替代 */
    cleanArgs: string;
    /** 特殊的执行次数，对应 `3#` 文本 */
    specialExecuteTimes: number;
    /** 原始命令文本（含前缀） */
    rawText: string;

    /** 获取关键字参数，如“.ra 50 --key=20 --asm”时，有两个kwarg，一个叫key，一个叫asm */
    getKwarg(key: string): Kwarg;
    /** 获取第N个参数，从1开始，如“.ra 力量50 推门” 参数1为“力量50”，参数2是“推门” */
    getArgN(n: number): string;
    /** 分离前缀 如 `.stdel力量` => [del,力量] ，直接修改 argv 属性*/
    chopPrefixToArgsWith(...s: string[]): boolean;
    /** 吃掉前缀并去除复数空格 `set xxx  xxx` => `xxx xxx`，返回修改后的字符串和是否修改成功的布尔值 */
    eatPrefixWith(...s: string[]): [string, boolean];
    /** 将第 n 个参数及之后参数用空格拼接起来; 如指令 `send to qq x1 x2`,n=3返回 `x1 x2` */
    getRestArgsFrom(n: number): string;
    /** 检查第N项参数是否为某个字符串，n从1开始，若没有第n项参数也视为失败 */
    isArgEqual(n: number, ...s: string[]): boolean;
  }

  /** 指令条目（扩展注册的指令） */
  export interface CmdItemInfo {
    /** 指令名称 */
    name: string;
    /** 长帮助，带换行的较详细说明  */
    help: string;
    /** 允许代骰 */
    allowDelegate: boolean;
    /** 私聊不可用 */
    disabledInPrivate: boolean;
    /** 启用执行次数解析，支持 `3#` 前缀 */
    enableExecuteTimesParse?: boolean;
    /** 高级模式：不检查群开关或是否@自己 */
    raw?: boolean;
    /** 是否检查当前可用状况，如失败不进入solve */
    checkCurrentBotOn?: boolean;
    /** 是否检查@了别的骰子，如失败不进入solve */
    checkMentionOthers?: boolean;

    /** 执行器 */
    solve: (ctx: MsgContext, msg: Message, cmdArgs: CmdArgs) => CmdExecuteResult;
  }

  /** 扩展信息与事件 */
  export interface ExtInfo {
    /** 名字 */
    name: string;
    /** 版本 */
    version: string;
    /** 作者 */
    author: string;
    /** 指令映射 */
    cmdMap: { [key: string]: CmdItemInfo };
    /** 是否加载完成 */
    isLoaded: boolean;

    /** 扩展事件：指令过滤后剩余非指令消息 */
    onNotCommandReceived?: (ctx: MsgContext, msg: Message) => void;
    /** 扩展事件：收到指令 */
    onCommandReceived?: (ctx: MsgContext, msg: Message, cmdArgs: CmdArgs) => void;
    /** 扩展事件：收到消息 */
    onMessageReceived?: (ctx: MsgContext, msg: Message) => void;
    /** 扩展事件：发送消息 */
    onMessageSend?: (ctx: MsgContext, msg: Message, flag: string) => void;
    /** 扩展事件：消息撤回 */
    onMessageDeleted?: (ctx: MsgContext, msg: Message) => void;
    /** 扩展事件：消息编辑 */
    onMessageEdit?: (ctx: MsgContext, msg: Message) => void;
    /** 扩展事件：加入群 */
    onGroupJoined?: (ctx: MsgContext, msg: Message) => void;
    /** 扩展事件：群成员加入 */
    onGroupMemberJoined?: (ctx: MsgContext, msg: Message) => void;
    /** 扩展事件：加入服务器（Discord/Kook） */
    onGuildJoined?: (ctx: MsgContext, msg: Message) => void;
    /** 扩展事件：成为好友 */
    onBecomeFriend?: (ctx: MsgContext, msg: Message) => void;
    /** 扩展事件：戳一戳 */
    onPoke?: (ctx: MsgContext, event: any) => void;
    /** 扩展事件：群成员被踢出 */
    onGroupLeave?: (ctx: MsgContext, event: any) => void;
    /** 获取扩展介绍文本 */
    getDescText(): string;
    /** 监听 加载时 事件，如 deck 模块需要读取牌堆文件 */
    onLoad?: (...any: any) => void;
    /** 初始化数据，读写数据时会自动调用 */
    storageInit()
    /** 读数据 如果无需自定义错误处理就无需使用 */
    storageGetRaw(k: string)
    /** 写数据 如果无需自定义错误处理就无需使用 */
    storageSetRaw(k: string, v: string)
    /** 存放数据 */
    storageSet(key: string, value: string): void;
    /** 取值（未找到返回空字符串，抛错 on other errors） */
    storageGet(key: string): string;
  }

  /** 指令执行结果 */
  export interface CmdExecuteResult {
    /** 是否匹配为指令 */
    matched: boolean;
    /** 是否顺利完成执行 */
    solved: boolean;
    /** 是否返回帮助信息 */
    showHelp: boolean;
  }

  type BanRankType = number
  /*
    禁止等级
    BanRankBanned = -30
    警告等级
    BanRankWarn = -10
    常规等级
    BanRankNomal = 0
    信任等级
    BanRankTrust = 30
  */
 
  /** 黑名单条目 */
  export interface BanListInfoItem {
    /** 对象 ID */
    id: string;
    /** 对象名称 */
    name: string;
    /** 怒气值。*/
    score: number;
    /** 0 正常，-10 警告，-30 禁止，30 信任 */
    rank: number;
    /** 历史记录时间戳 */
    times: number[];
    /** 拉黑原因记录 */
    reasons: string[];
    /** 事发会话记录 */
    places: string[];
    /** 首次记录时间 */
    banTime: number;
  }

  /** 黑名单操作 */
  export const ban: {
    /**
     * 拉黑指定 ID
     * @param ctx 上下文
     * @param id 黑名单用户或群组 ID
     * @param place 事发会话 ID
     * @param reason 拉黑原因
     */
    addBan(ctx: MsgContext, id: string, place: string, reason: string): void;

    /**
     * 信任指定 ID
     * @param ctx 上下文
     * @param id 信任用户或群组 ID
     * @param place 事发会话 ID
     * @param reason 信任原因
     */
    addTrust(ctx: MsgContext, id: string, place: string, reason: string): void;

    /**
     * 将用户从名单中删除
     * @param ctx 上下文对象
     * @param id 要移除的用户 ID
     */
    remove(ctx: MsgContext, id: string): void;

    /** 获取黑名单全部用户 */
    getList(): BanListInfoItem[];

    /**
     * 获取指定 ID 的黑名单记录。返回值可能为空。
     * @param id 用户群组
     */
    getUser(id: string): BanListInfoItem;
  };

  /** 配置项 */
  export interface ConfigItem {
    key: string;
    type: string;
    defaultValue: any;
    value: any;
    option?: any;
    deprecated?: boolean;
    description: string;
  }

  export type TimeOutTaskType = 'cron' | 'daily';

  /** 定时任务上下文 */
  export interface JsScriptTaskCtx {
    /** 当前执行时间（Unix 时间戳） */
    now: number;
    /** 任务键名 */
    key: string;
  }

  /** 定时任务对象 */
  export interface JsScriptTask {
    /** 开启任务（添加到调度） */
    on(): boolean;
    /** 关闭任务（从调度移除） */
    off(): boolean;
    /** 重置任务表达式（cron 或 daily） */
    reset(expr: string): void;
  }

  /** 扩展工具集 */
  export const ext: {
    /**
     * 新建一个扩展
     */
    new(name: string, author: string, version: string): ExtInfo;
    /**
     * 创建指令结果对象
     * @param success 是否执行成功
     */
    newCmdExecuteResult(success: boolean): CmdExecuteResult;
    /**
     * 注册一个扩展
     * @param ext
     */
    register(ext: ExtInfo): unknown;
    /**
     * 按名字查找扩展对象
     * @param name
     */
    find(name: string): ExtInfo | null;
    /** 创建指令对象 */
    newCmdItemInfo(): CmdItemInfo;
    /**
     * 注册一个字符串类型的配置项
     * @param ext 扩展对象
     * @param key 配置项名称
     * @param defaultValue 配置项值
     * @param desc 描述
     */
    registerStringConfig(ext: ExtInfo, key: string, defaultValue: string, desc?: string): void;
    /**
     * 注册一个整型的配置项
     * @param ext 扩展对象
     * @param key 配置项名称
     * @param defaultValue 配置项值
     * @param desc 描述
     */
    registerIntConfig(ext: ExtInfo, key: string, defaultValue: number, desc?: string): void;
    /**
     * 注册一个布尔类型的配置项
     * @param ext 扩展对象
     * @param key 配置项名称
     * @param defaultValue 配置项值
     * @param desc 描述
     */
    registerBoolConfig(ext: ExtInfo, key: string, defaultValue: boolean, desc?: string): void;
    /**
     * 注册一个浮点数类型的配置项
     * @param ext 扩展对象
     * @param key 配置项名称
     * @param defaultValue 配置项值
     * @param desc 描述
     */
    registerFloatConfig(ext: ExtInfo, key: string, defaultValue: number, desc?: string): void;
    /**
     * 注册一个template类型的配置项
     * @param ext 扩展对象
     * @param key 配置项名称
     * @param defaultValue 配置项值
     * @param desc 描述
     */
    registerTemplateConfig(ext: ExtInfo, key: string, defaultValue: string[], desc?: string): void;
    /**
     * 注册一个option类型的配置项
     * @param ext 扩展对象
     * @param key 配置项名称
     * @param defaultValue 配置项默认值
     * @param option 可选项
     * @param desc 描述
     */
    registerOptionConfig(ext: ExtInfo, key: string, defaultValue: string, option: string[], desc?: string): void;
    /**
     * 创建一个新的配置项
     * @param ext 扩展对象
     * @param key 配置项名称
     * @param defaultValue 配置项值
     * @param desc 描述
     */
    newConfigItem(ext: ExtInfo, key: string, defaultValue: any, desc: string): ConfigItem;
    /**
     * 注册配置
     * @param ext 扩展对象
     * @param configs 配置项对象
     */
    registerConfig(ext: ExtInfo, ...configs: ConfigItem[]): void;
    /**
     * 获取指定名称的配置项对象
     * @param ext 扩展对象
     * @param key 配置项名称
     */
    getConfig(ext: ExtInfo, key: string): ConfigItem | null;
    /**
     * 获取指定名称的字符串类型配置项对象
     * @param ext 扩展对象
     * @param key 配置项名称
     */
    getStringConfig(ext: ExtInfo, key: string): string;
    /**
     * 获取指定名称的整型配置项对象
     * @param ext 扩展对象
     * @param key 配置项名称
     */
    getIntConfig(ext: ExtInfo, key: string): number;
    /**
     * 获取指定名称的布尔类型配置项对象
     * @param ext 扩展对象
     * @param key 配置项名称
     */
    getBoolConfig(ext: ExtInfo, key: string): boolean;
    /**
     * 获取指定名称的浮点数类型配置项对象
     * @param ext 扩展对象
     * @param key 配置项名称
     */
    getFloatConfig(ext: ExtInfo, key: string): number;
    /**
     * 获取指定名称的template类型配置项对象
     * @param ext 扩展对象
     * @param key 配置项名称
     */
    getTemplateConfig(ext: ExtInfo, key: string): string[];
    /**
     * 获取指定名称的option类型配置项对象
     * @param ext 扩展对象
     * @param key 配置项名称
     */
    getOptionConfig(ext: ExtInfo, key: string): string;
    /**
     * 卸载对应名称的配置项
     * @param ext 扩展对象
     * @param keys 配置项名称
     */
    unregisterConfig(ext: ExtInfo, ...keys: string[]): void;
    /**
     * 注册定时任务
     * @param ext 扩展对象
     * @param taskType cron格式/每日时钟格式
     * @param value 5位cron表达式/数字时钟 例如 * * * * *或者8:30
     * @param fn 定时任务内容
     * @param key 定时任务名称
     * @param desc 定时任务描述
     */
    registerTask(ext: ExtInfo, taskType: TimeOutTaskType, value: string, fn: (ctx: JsScriptTaskCtx) => void, key?: string, desc?: string): JsScriptTask;
  };

  /** COC 检定规则定义 */
  export interface CocRuleInfo {
    /** 序号 */
    index: number;
    /** .setcoc key */
    key: string;
    /** 已切换至规则 Name: Desc */
    name: string;
    /** 规则描述 */
    desc: string;
    
    /**
     * 检定函数
     * @param ctx 上下文对象
     * @param d100 使用骰子骰出的值
     * @param checkValue 检定线，对应属性，例如力量、敏捷等
     */
    check(ctx: MsgContext, d100: number, checkValue: number): CocRuleCheckRet;
  }

  /** COC 检定结果 */
  export interface CocRuleCheckRet {
    /** 成功级别，失败小于0，成功大于0。大失败-2 失败-1 成功1 困难成功2 极难成功3 大成功4 */
    successRank: number;
    /** 大成功数值 */
    criticalSuccessValue: number;
  }

  export const coc: {
    newRule(): CocRuleInfo;
    newRuleCheckResult(): CocRuleCheckRet;
    registerRule(rule: CocRuleInfo): boolean;
  };


  /** 代骰模式下，获取被代理人信息（第一个 @ 的用户） */
  export function getCtxProxyFirst(ctx: MsgContext, cmdArgs: CmdArgs): MsgContext;
  /** 回复发送者(发送者私聊即私聊回复，群内即群内回复) */
  export function replyToSender(ctx: MsgContext, msg: Message, text: string): void;
  /** 回复发送者(私聊回复，典型应用场景如暗骰) */
  export function replyPerson(ctx: MsgContext, msg: Message, text: string): void;
  /** 回复发送者(群内回复，私聊时无效) */
  export function replyGroup(ctx: MsgContext, msg: Message, text: string): void;
  /** 格式化文本 等价于 `text` 指令 */
  export function format(ctx: MsgContext, text: string): string;
  /** 获取回复文案（从自定义文案） */
  export function formatTmpl(ctx: MsgContext, key: string): string;
  /** 创建at列表里第 pos 个用户的代骰上下文（跳过骰子自身） */
  export function getCtxProxyAtPos(ctx: MsgContext, cmdArgs: CmdArgs, pos: number): MsgContext;

  /** 应用名片模板，返回值为格式化完成的名字。此时已经设置好名片(如有权限) */
  export function applyPlayerGroupCardByTemplate(ctx: MsgContext, tmpl: string): string;
  /** 设置群名片，返回最终设置文本 */
  export function setPlayerGroupCard(ctx: MsgContext, tmpl: string): string;

  /**
   * 禁言
   * @param ctx 上下文
   * @param groupID QQ群ID
   * @param userID 禁言对象ID
   * @param duration 禁言时间（秒）
   */
  export function memberBan(ctx: MsgContext, groupID: string, userID: string, duration: number): void;
  /**
   * 踢人
   * @param ctx 上下文
   * @param groupID QQ群ID
   * @param userID 踢出对象ID
   */
  export function memberKick(ctx: MsgContext, groupID: string, userID: string): void;
  /**
   * 执行海豹dicescript
   * @param ctx 上下文
   * @param s 指令文本
   */
  /** 获取版本信息 */
  export type VersionDetailsType = {
    /** 内部版本号，新版本的版本号永远比旧版本的大 */
    versionCode: number;
    /** 版本号+日期 如 1.4.6+20240810 */
    version: string;
    /** 版本号 如 1.4.6 */
    versionSimple: string;
    versionDetail: {
      major: number;
      minor: number;
      patch: number;
      prerelease: string;
      /** 创建日期 如 20240810 */
      buildMetaData: string;
    };
  };
  /** 获取版本信息 */
  export function getVersion(): VersionDetailsType;

  /** 获取骰娘的 EndPoints */
  export function getEndPoints(): EndPointInfo[];

  /** 通过 base64 返回图像临时地址 */
  export function base64ToImage(base64: string): string;

  /** 获取/修改 VM 变量 ，如 `$t`、`$g` */
  export const vars: {
    /** VM 中存在 key 且类型正确 返回 `[number,true]` ，否则返回 `[0,false]` */
    intGet(ctx: MsgContext, key: string): [number, boolean];
    /** 赋值 key 为 value 等价于指令 `text {key=value}` value 类型为数字 */
    intSet(ctx: MsgContext, key: string, value: number): void;
    /** VM 中存在 key 且类型正确 返回 `[string,true]` ，否则返回 `['',false]` */
    strGet(ctx: MsgContext, key: string): [string, boolean];
    /** 赋值 key 为 value 等价于指令 `text {key=value}` value 类型为字符串 */
    strSet(ctx: MsgContext, key: string, value: string): void;
    /** 设置计算型变量，值为表达式文本 */
    computedSet(ctx: MsgContext, key: string, expr: string): void;
    /** 获取计算型变量表达式 */
    computedGet(ctx: MsgContext, key: string): [string, boolean];
  };

  /** 规则模板 */
  export const gameSystem: {
    /** 添加一个规则模板，需要是JSON文本格式 */
    newTemplate(data: string): void;
    /** 添加一个规则模板，需要是YAML文本格式 */
    newTemplateByYaml(data: string): void;
  };

  /** deck */
  export interface deckResult {
    /** 是否存在 */
    "exists": boolean;
    /** 错误信息 */
    "err": string;
    /** 抽牌结果 */
    "result": string | null;
  }

  /** 牌堆相关 */
  export const deck: {
    /**
     * 抽牌函数
     * @param ctx
     * @param name 牌堆 key
     * @param isShuffle 是否放回
     */
    draw(ctx: MsgContext, key: string, isShuffle: boolean): deckResult;
    /** 重载牌堆 */
    reload(): void;
  };
}
