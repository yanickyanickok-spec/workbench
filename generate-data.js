#!/usr/bin/env node
/**
 * 爆单的林舒琪 - 每日数据生成器
 *
 * 这个脚本负责生成 data.json（供 index.html 读取显示）
 *
 * 运行方式：
 *   1. 本地手动：node generate-data.js
 *   2. GitHub Actions 自动：每天早8点（北京时间）自动运行
 *
 * 原理：
 *   - 优先用真实 RSS/API 抓取（需网络）
 *   - 失败时回退到内置轮换内容库（保证永远有数据）
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ========== 工具函数 ==========
function getDayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getDaySeed() {
  const d = new Date();
  return Math.floor(d.getTime() / (24*3600*1000));
}

function seededRng(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

function httpGet(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
  });
}

// ========== 真实抓取函数（失败自动跳过） ==========

async function fetchNews() {
  // 尝试抓取百度新闻热搜
  try {
    const html = await httpGet('https://top.baidu.com/board?tab=realtime', 10000);
    // 简单提取标题
    const titles = [];
    const re = /<div[^>]*class="c-single-text-ellipsis"[^>]*>([^<]+)<\/div>/g;
    let m;
    while ((m = re.exec(html)) !== null && titles.length < 8) {
      titles.push(m[1].trim());
    }
    if (titles.length >= 3) {
      return {
        title: '🔴 今日要闻 · ' + getDayKey(),
        content: titles.map((t, i) => `【${i+1}】${t}`).join('\n'),
        source: '百度热搜实时榜',
        updated: getDayKey() + ' 真实抓取'
      };
    }
  } catch(e) { console.log('  新闻抓取失败，使用回退:', e.message); }
  return null;
}

async function fetchNailTrends() {
  // 小红书/抖音 没有公开 RSS，用搜索建议 API 替代
  try {
    // 用百度搜索建议获取美甲相关热词
    const html = await httpGet('https://www.baidu.com/s?wd=2026年美甲流行趋势', 10000);
    const keywords = [];
    const re = /<a[^>]*href="[^"]*"[^>]*>(美甲[^<]{5,30})<\/a>/g;
    let m;
    while ((m = re.exec(html)) !== null && keywords.length < 5) {
      keywords.push(m[1].trim());
    }
    if (keywords.length >= 2) {
      return {
        xhs: {
          title: '💅 小红书美甲今日趋势 · ' + getDayKey(),
          content: keywords.map((k, i) => `🔥 ${k}`).join('\n'),
          source: '百度搜索趋势',
          updated: getDayKey() + ' 真实抓取'
        },
        dy: {
          title: '✨ 抖音美甲今日爆款 · ' + getDayKey(),
          content: keywords.map((k, i) => `🔥 ${k} #美甲教程`).join('\n'),
          source: '百度搜索趋势',
          updated: getDayKey() + ' 真实抓取'
        }
      };
    }
  } catch(e) { console.log('  美甲趋势抓取失败，使用回退:', e.message); }
  return null;
}

async function fetchFinance() {
  // 尝试抓取新浪财经指数数据
  try {
    const data = await httpGet('https://hq.sinajs.cn/list=sh000001,sz399001,sh000300', 8000);
    const lines = data.split('\n').filter(l => l.includes('='));
    const quotes = {};
    lines.forEach(line => {
      const m = line.match(/"(.+?)"/);
      if (m) {
        const parts = m[1].split(',');
        if (parts.length > 3) quotes[parts[0]] = parts;
      }
    });
    if (Object.keys(quotes).length >= 2) {
      const items = Object.values(quotes).slice(0,3);
      const lines2 = items.map((q, i) => {
        const name = ['上证指数','深证成指','沪深300'][i] || q[0];
        const price = q[3] || '—';
        const chg = q[4] ? (parseFloat(q[4])>=0?'+':'') + q[4] : '—';
        return `【${name}】${price} (${chg})`;
      });
      return {
        title: '📈 今日行情速览 · ' + getDayKey(),
        content: lines2.join('\n'),
        source: '新浪财经实时数据',
        updated: getDayKey() + ' 真实抓取'
      };
    }
  } catch(e) { console.log('  财经抓取失败，使用回退:', e.message); }
  return null;
}

// ========== 回退内容库 ==========

const NEWS_FALLBACK = [
  { title:'🔴 今日要闻', items:[
    '【科技】AI大模型持续迭代，国产算力产业链受关注',
    '【财经】A股结构性行情延续，关注中报业绩主线',
    '【政策】国务院促消费政策包加码，汽车家电以旧换新',
    '【国际】全球央行降息周期推进，黄金创阶段新高',
    '【民生】全国高温预警持续，用电负荷连创新高',
    '【一句话】科技+消费双主线，留意政策落地节奏'
  ]},
  { title:'🔴 今日要闻', items:[
    '【科技】华为/苹果新品季临近，供应链板块活跃',
    '【财经】北向资金连续净流入，蓝筹白马获青睐',
    '【政策】房地产政策持续优化，核心城市成交量回暖',
    '【国际】美联储议息会议临近，全球市场观望',
    '【新能源】固态电池量产进度提速，概念股走强',
    '【一句话】资金偏好确定性，高股息+业绩为王'
  ]},
  { title:'🔴 今日要闻', items:[
    '【科技】国产GPU厂商新品发布，算力自主可控提速',
    '【财经】人民币汇率企稳，外资回流A股迹象明显',
    '【消费】暑期旅游数据亮眼，航空酒店业绩修复',
    '【医药】创新药出海加速，License-out金额创新高',
    '【监管】证监会强化退市监管，壳价值继续缩水',
    '【一句话】拥抱真成长，远离纯概念'
  ]},
  { title:'🔴 今日要闻', items:[
    '【科技】机器人产业链订单爆发，减速器/丝杠紧缺',
    '【财经】半年报披露高峰，绩优股获资金追捧',
    '【政策】设备更新改造再贷款扩容，制造业受益',
    '【国际】中东局势扰动油价，化工链成本承压',
    '【农业】极端天气扰动粮价，种业板块异动',
    '【一句话】业绩是锚，跟着中报找真金'
  ]},
  { title:'🔴 今日要闻', items:[
    '【科技】量子计算里程碑突破，中美竞赛白热化',
    '【财经】险资入市比例放宽，蓝筹迎长钱',
    '【地产】保障房建设加速，建材板块受益',
    '【国际】日元贬值提振出口，日经创新高',
    '【消费】奶茶咖啡价格战持续，下沉市场增长',
    '【一句话】长钱入市+业绩驱动=慢牛底色'
  ]},
  { title:'🔴 今日要闻', items:[
    '【科技】低空经济商业化提速，eVTOL试点扩大',
    '【财经】央行降准预期升温，流动性宽松',
    '【新能源】光伏供给侧改革启动，价格触底反弹',
    '【国际】欧盟关税政策落地，出口链承压',
    '【教育】AI+教育产品爆发，学习机赛道火热',
    '【一句话】新质生产力是全年主线'
  ]},
  { title:'🔴 今日要闻', items:[
    '【科技】6G标准研发启动，通信板块异动',
    '【财经】A股日均成交重回万亿，情绪回暖',
    '【政策】数据要素入表加速，数据资产化提速',
    '【国际】美元走弱，大宗商品普涨',
    '【消费】黄金饰品销量暴涨，金店坪效创新高',
    '【一句话】科技打头阵，黄金保底仓'
  ]}
];

const NAIL_FALLBACK = [
  { xhs:['冰透果冻猫眼 — 通勤百搭搜索TOP1','落日腮红晕染 — 黄皮天菜收藏暴涨','贝母碎片极简裸 — 静奢风本命','人鱼尾闪粉 — 暑期派对款','Baby蓝法式 — 清冷显白短甲友好'],
    dy:['薄荷曼波碎冰蓝 — 凉感美学百万赞','黑底香槟金猫眼 — 甜酷风评论炸裂','波点蓝法式 — 2026最夯元素','碎钻满天星透明底 — 清透仙女款','雾霾灰跳色 — 温柔轻奢通勤约会'] },
  { xhs:['焦糖拿铁渐变 — 秋冬氛围感拉满','蝴蝶结立体款 — 少女心爆棚','青花瓷中国风 — 国潮崛起','极光粉紫渐变 — 梦幻仙气','短甲磨砂裸粉 — 职场低调高级'],
    dy:['手绘小雏菊 — 清新田园素人爆款','晕染水墨风 — 东方美学','闪钻法式跳色 — 轻奢通勤','果冻透橘 — 显白元气','3D立体蝴蝶 — 视觉冲击百万播'] },
  { xhs:['天鹅绒哑光红 — 复古港风','星空银河款 — 夜晚最吸睛','抹茶绿渐变 — 小清新代表','珍珠贝壳款 — 优雅名媛','极简线条几何 — 设计师感'],
    dy:['猫眼冰蓝 — 夏日清凉感TOP','跳色爱心款 — 甜妹必备','镭射炫彩 — 派对焦点','透粉樱花 — 春季爆款延续','暗黑哥特 — 酷女孩专属'] },
  { xhs:['腮红晕染蜜桃 — 伪素颜神器','金沙闪粉 — 阳光下发光','法式V字款 — 指尖拉长显瘦','大理石纹 — 高级感满满','草莓牛奶粉 — 软萌少女'],
    dy:['渐变极光 — 0.5秒换色','立体玫瑰 — 手残也能美','金属银箔 — 未来科技感','透白蕾丝 — 婚礼必备','彩虹碎钻 — 闪到睁不开眼'] },
  { xhs:['咖啡拉花款 — 文艺范儿','紫罗兰深紫 — 神秘冷艳','银杏黄 — 秋季限定','冰透裸粉 — 素颜神器','陶瓷白雕花 — 艺术品级'],
    dy:['气泡水晶 — 透明感满分','鸳鸯奶茶色 — 秋冬暖调','霓虹荧光 — 音乐节必备','极简一字法式 — 高级白领','碎花田园 — 约会小心机'] },
  { xhs:['祖母绿深绿 — 复古华丽','焦糖布丁渐变 — 甜美治愈','雪花冰晶 — 冬季限定款','玫瑰金闪 — 贵气名媛','雾面裸棕 — 低调质感'],
    dy:['银河碎钻 — 宇宙系少女','水果糖渐变 — 甜到心里','丝绒哑光酒红 — 气场全开','冰透湖水绿 — 夏日救星','蕾丝花朵 — 浪漫满分'] },
  { xhs:['抹茶红豆 — 日系甜美','星空深蓝 — 神秘深邃','焦糖摩卡 — 秋冬暖心','粉钻闪粉 — 公主风','极简透白 — 干净利落'],
    dy:['彩虹法式 — 一周七天不重样','水晶气泡 — 透明感绝美','奶茶渐变 — 温柔到骨子里','金属未来银 — 酷飒风','碎花藤蔓 — 森系仙女'] }
];

const FINANCE_FALLBACK = [
  '【复利的力量】每月定投1000元年化8%，30年≈150万。时间是复利最好的朋友，开始要早、坚持要久。',
  '【4321法则】40%稳健理财+30%增值投资+20%应急备用+10%保险保障。普通人的家庭资产配置框架。',
  '【72法则】72÷年化收益率=本金翻倍所需年数。年化8%→9年翻倍；年化12%→6年翻倍。',
  '【紧急备用金】预留3-6个月生活费放货币基金（余额宝等），随时可取、略有收益。',
  '【资产配置】不把鸡蛋放一个篮子。股债比随年龄调整：100-年龄=股票占比。',
  '【指数基金定投】沪深300/中证500/A500，长期定投跑赢多数主动基金，费率低、透明。',
  '【保险优先级】百万医疗>重疾险>意外险>寿险。先保大人再保小孩，先保收入主力。',
  '【基金费用】管理费+托管费+申购赎回费，长期看是隐形杀手。优先选费率低的指数基金。',
  '【分散风险】单只个股仓位不超总资产10%，单一行业不超30%。',
  '【定投纪律】下跌时坚持买、不要择时、不要频繁操作。微笑曲线是定投最好的朋友。',
  '【债券基金】波动小于股票，年化3-5%，适合中短期资金（1-3年）。',
  '【REITs】不动产投资信托，强制分红，和股债相关性低，可纳入组合分散。',
  '【美元资产】适当配置美元货基/美债，对冲人民币汇率波动。',
  '【公积金理财】公积金贷款利率远低于商贷，优先用满额度。',
  '【记账习惯】记账3个月，你会发现钱都去哪了。控制消费从看见开始。',
  '【消费陷阱】分期付款实际年化往往15%+。能全款就全款，分期是负债不是理财。',
  '【税收优化】个人养老金每年抵税12000元额度，退休才能取，长期收益可观。',
  '【风险测评】投资前先测风险承受能力。不要买超出自己风险等级的产品。',
  '【警惕骗局】承诺年化超8%的固收都要打问号。庞氏骗局的特征：高息+拉人头。',
  '【长期主义】巴菲特年化20%被称为股神。普通人7-10%年化坚持30年就是奇迹。',
  '【再平衡】每半年审视一次组合，偏离目标比例超5%就调回。高卖低买自动执行。'
];

const MEAL_FALLBACK = [
  { meals:['早餐：燕麦60g+蛋白粉1勺+香蕉1根 ≈35g蛋白','午餐：鸡胸肉200g+糙米150g+西兰花 ≈55g蛋白','加餐：希腊酸奶200g+坚果20g ≈20g蛋白','晚餐：三文鱼150g+红薯+蔬菜 ≈40g蛋白','💧 全天饮水≥2.5L'], protein:150 },
  { meals:['早餐：全蛋2个+全麦面包+牛奶250ml ≈25g蛋白','午餐：牛肉150g+意面+番茄酱 ≈45g蛋白','加餐：蛋白棒1根 ≈20g蛋白','晚餐：虾200g+杂粮饭+芦笋 ≈42g蛋白','💧 训练前后各500ml水'], protein:132 },
  { meals:['早餐：鸡蛋3个(2全1白)+燕麦 ≈30g蛋白','午餐：三文鱼180g+藜麦+羽衣甘蓝 ≈42g蛋白','加餐：干酪100g+杏仁10粒 ≈18g蛋白','晚餐：鸡腿肉200g+土豆+豆角 ≈45g蛋白','💧 碳水集中在训练前后'], protein:135 },
  { meals:['早餐：蛋白粉1勺+蓝莓+花生酱吐司 ≈28g蛋白','午餐：猪里脊150g+米饭+青菜 ≈40g蛋白','加餐：水煮蛋2个 ≈12g蛋白','晚餐：鳕鱼200g+红薯+西兰花 ≈46g蛋白','💧 睡前酪蛋白30g缓释'], protein:126 },
  { meals:['早餐：豆腐200g+杂粮粥+坚果 ≈22g蛋白','午餐：鸡胸肉220g+糙米+彩椒 ≈60g蛋白','加餐：牛奶300ml+香蕉 ≈15g蛋白','晚餐：牛肉180g+土豆泥+菠菜 ≈48g蛋白','💧 每公斤体重1.6-2g蛋白'], protein:145 },
  { meals:['早餐：鸡蛋2全+牛奶+燕麦 ≈25g蛋白','午餐：龙利鱼200g+米饭+芦笋 ≈44g蛋白','加餐：酸奶+坚果 ≈15g蛋白','晚餐：瘦羊肉150g+全麦饼+番茄 ≈35g蛋白','💧 训练日多500ml水'], protein:119 },
  { meals:['早餐：蛋白粉+草莓+全麦贝果 ≈30g蛋白','午餐：金枪鱼罐头(水浸)150g+意面 ≈42g蛋白','加餐：煮蛋2个+胡萝卜 ≈12g蛋白','晚餐：鸡胸肉200g+红薯+混合蔬菜 ≈55g蛋白','💧 总蛋白目标按体重×1.8g'], protein:139 }
];

// ========== 主生成逻辑 ==========
async function main() {
  const dayKey = getDayKey();
  const seed = getDaySeed();
  const rng = seededRng(seed);

  console.log('🐰 爆单的林舒琪 · 数据生成器');
  console.log('📅 日期:', dayKey);
  console.log('🌱 种子:', seed);
  console.log('---');

  // 1. 尝试真实抓取
  console.log('🔍 尝试抓取真实数据...');
  const [newsReal, nailReal, financeReal] = await Promise.all([
    fetchNews(),
    fetchNailTrends(),
    fetchFinance()
  ]);

  // 2. 组装数据
  const data = {
    _generatedAt: new Date().toISOString(),
    _dayKey: dayKey,
    _isReal: !!(newsReal || nailReal || financeReal),
    news: newsReal || {
      title: '🔴 今日要闻 · ' + dayKey,
      content: pick(NEWS_FALLBACK, rng).items.join('\n'),
      source: '内置轮换库',
      updated: dayKey + ' 本地生成'
    },
    xhs: (nailReal && nailReal.xhs) || {
      title: '💅 小红书美甲今日趋势 · ' + dayKey,
      content: pick(NAIL_FALLBACK, rng).xhs.map((t,i) => `🔥 ${t}`).join('\n'),
      source: '内置轮换库',
      updated: dayKey + ' 本地生成'
    },
    dy: (nailReal && nailReal.dy) || {
      title: '✨ 抖音美甲今日爆款 · ' + dayKey,
      content: pick(NAIL_FALLBACK, rng).dy.map((t,i) => `🔥 ${t}`).join('\n'),
      source: '内置轮换库',
      updated: dayKey + ' 本地生成'
    },
    finance: financeReal || {
      title: '🎓 理财知识 · 第' + (seed % 30 + 1) + '课',
      content: FINANCE_FALLBACK[seed % FINANCE_FALLBACK.length],
      source: '内置知识库',
      updated: dayKey + ' 本地生成'
    },
    meal: {
      title: '🍗 增肌营养餐 · ' + dayKey,
      content: (() => {
        const m = MEAL_FALLBACK[seed % MEAL_FALLBACK.length];
        return m.meals.join('\n') + `\n📊 今日蛋白目标：${m.protein}g`;
      })(),
      source: '营养学指南',
      updated: dayKey + ' 本地生成'
    }
  };

  // 3. 写入 data.json
  const outPath = path.join(__dirname, 'data.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');

  console.log('---');
  console.log('✅ data.json 已生成');
  console.log('   新闻来源:', data.news.source);
  console.log('   美甲来源:', data.xhs.source);
  console.log('   理财来源:', data.finance.source);
  console.log('   营养来源:', data.meal.source);
  console.log('   真实抓取:', data._isReal ? '✅ 部分成功' : '⚠️ 全部回退到本地库');
  console.log('');
  console.log('📋 数据预览:');
  console.log('   新闻:', data.news.title);
  console.log('   美甲:', data.xhs.title);
  console.log('   理财:', data.finance.title);
  console.log('   餐单:', data.meal.title);
}

main().catch(err => {
  console.error('❌ 生成失败:', err.message);
  process.exit(1);
});
