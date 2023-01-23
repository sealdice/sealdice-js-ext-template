import { sample } from "lodash-es";
import { nameList } from "./utils";

function main() {
  // 注册扩展
  let ext = seal.ext.find('test');
  if (!ext) {
    ext = seal.ext.new('test', '木落', '1.0.0');
    seal.ext.register(ext);
  }

  // 编写指令
  const cmdSeal = seal.ext.newCmdItemInfo();
  cmdSeal.name = 'seal';
  cmdSeal.help = '召唤一只海豹，可用.seal <名字> 命名';

  cmdSeal.solve = (ctx, msg, cmdArgs) => {
    let val = cmdArgs.getArgN(1);
    switch (val) {
      case 'help': {
        const ret = seal.ext.newCmdExecuteResult(true);
        ret.showHelp = true;
        return ret;
      }
      default: {
        // 命令为 .seal XXXX，取第一个参数为名字
        if (!val) val = sample(nameList); // 无参数，随机名字
        seal.replyToSender(ctx, msg, `你抓到一只海豹！取名为${val}\n它的逃跑意愿为${Math.ceil(Math.random() * 100)}`);
        return seal.ext.newCmdExecuteResult(true);
      }
    }
  }

  // 注册命令
  ext.cmdMap['seal'] = cmdSeal;
}

main();
