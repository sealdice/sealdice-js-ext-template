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
    /** 权限等级 40邀请者 50管理 60群主 100master */
    privilegeLevel: number;
  }
  export interface EndPointInfo {
    id: string;
    nickname: string;
    state: number;
    userId: string;
    platform: string;
    enable: boolean;
  }
  /** 获取所有 EndPointInfo */
  export function getEndPoints(): EndPointInfo[];
  /** 群信息 */
  export interface GroupInfo {
    active: boolean;
    groupId: string;
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
    /** 上次发送指令时间(即sn) */
    autoSetNameTemplate: string;
  }

  /** 消息详情 */
  export interface Message {
    /** 当前平台，如QQ */
    platform: string;
    /** 消息内容 */
    message: string;
    /** 发送时间 */
    time: number;
    /** 群消息/私聊消息 */
    messageType: 'group' | 'private';
    /** 群ID */
    groupId: string;
    /** 服务器ID */
    guildId: string;
    /** 发送者信息 */
    sender: Sender;
    /** 原始ID，用于撤回等情况 */
    rawId: string | number;
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

  export interface CmdArgs {
    /** 当前命令，与指令的name相对，例如.ra时，command为ra */
    command: string;
    /** 指令参数，如“.ra 力量 测试”时，参数1为“力量”，参数2为“测试” */
    args: string[];
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
    // 暂不提供，未来可能有变化
    // specialExecuteTimes: number;

    /** 获取关键字参数，如“.ra 50 --key=20 --asm”时，有两个kwarg，一个叫key，一个叫asm */
    getKwargs(key: string): Kwarg;
    /** 获取第N个参数，从1开始，如“.ra 力量50 推门” 参数1为“力量50”，参数2是“推门” */
    getArgN(n: number): string;
  }

  interface CmdItemInfo {
    solve: (
      ctx: MsgContext,
      msg: Message,
      cmdArgs: CmdArgs
    ) => CmdExecuteResult;

    /** 指令名称 */
    name: string;
    /** 长帮助，带换行的较详细说明  */
    help: string;
    /** 允许代骰 */
    allowDelegate: boolean;
    /** 私聊不可用 */
    disabledInPrivate: boolean;

    /** 高级模式。默认模式下行为是：需要在当前群/私聊开启，或@自己时生效(需要为第一个@目标)。一般不建议使用 */
    // raw: boolean;
    /** 是否检查当前可用状况，包括群内可用和是私聊两种方式，如失败不进入solve */
    // checkCurrentBotOn: boolean;
    /** 是否检查@了别的骰子，如失败不进入solve */
    // checkMentionOthers: boolean;
  }

  interface ExtInfo {
    /** 名字 */
    name: string;
    /** 版本 */
    version: string;
    /** 名字 */
    author: string;
    /** 指令映射 */
    cmdMap: { [key: string]: CmdItemInfo };
    /** 存放数据 */
    storageSet(key: string, value: string): void;
    /** 取数据 */
    storageGet(key: string): string;
  }

  interface CmdExecuteResult {
    /** 是否顺利完成执行 */
    solved: boolean;
    /** 是否返回帮助信息 */
    showHelp: boolean;
  }

  export const ext: {
    /**
     *
     */
    new: (name: string, author: string, version: string) => ExtInfo;

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
    find(name: string): ExtInfo;

    newCmdItemInfo(): CmdItemInfo;
  };

  interface CocRuleInfo {
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

  interface CocRuleCheckRet {
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

  /** 代骰模式下，获取被代理人信息 */
  export function getCtxProxyFirst(ctx: MsgContext, msg: Message): MsgContext;
  /** 回复发送者(发送者私聊即私聊回复，群内即群内回复) */
  export function replyToSender(
    ctx: MsgContext,
    msg: Message,
    text: string
  ): void;
  /** 回复发送者(私聊回复，典型应用场景如暗骰) */
  export function replyPerson(
    ctx: MsgContext,
    msg: Message,
    text: string
  ): void;
  /** 回复发送者(群内回复，私聊时无效，典型应用场景暗骰) */
  export function replyGroup(ctx: MsgContext, msg: Message, text: string): void;
  /** 格式化文本 */
  export function format(ctx: MsgContext, text: string): string;

  /** 表示一个黑名单项目 */
  interface BanListInfoItem {
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
     * 从黑名单删除相关 ID
     * @param ctx 上下文
     * @param id 要移除的用户 ID
     */
    remove(ctx: MsgContext, id: string): void;

    /** 获取所有黑名单列表 */
    getList(): BanListInfoItem[];

    /**
     * 获取指定 ID 的黑名单记录。返回值可能为空。
     * @param id 用户群组
     */
    getUser(id: string): BanListInfoItem | null;
  };
}
