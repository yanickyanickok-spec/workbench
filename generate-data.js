const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
// orz.ai 热榜 API（免费、无需鉴权、支持多平台）
const ORZ_API = 'https://api.orz.ai/api/hot?platform=';
// 深蓝财经快讯 API
const SINA_FINANCE_API = 'https://hq.sinajs.cn/gn/';

const PLATFORMS = [
  { key: 'weibo', name: '微博', category: '热搜' },
  { key: 'baidu', name: '百度', category: '热搜' },
  { key: 'zhihu', name: '知乎', category: '热榜' },
  { key: 'douyin', name: '抖音', category: '热榜' },
  { key: 'xueqiu', name: '雪球', category: '财经' },
  { key: 'caijing', name: '东方财富', category: '财经' },
];

// ========== 内置兜底库（API失败时使用） ==========
const FALLBACK_NEWS = [
  { title: '🔴 今日要闻 · 宏观经济数据发布', url: 'https://finance.sina.com.cn' },
  { title: '📈 A股三大指数开盘走势分析', url: 'https://finance.sina.com.cn' },
  { title: '🌍 国际原油价格盘中异动', url: 'https://finance.sina.com.cn' },
  { title: '💼 证监会发布最新监管政策', url: 'https://finance.sina.com.cn' },
  { title: '🏛️ 央行公开市场操作公告', url: 'https://finance.sina.com.cn' },
  { title: '📊 北向资金净流入创近期新高', url: 'https://finance.sina.com.cn' },
  { title: '🔋 新能源产业链最新动态', url: 'https://finance.sina.com.cn' },
  { title: '🏠 房地产政策迎来新调整', url: 'https://finance.sina.com.cn' },
  { title: '💰 人民币汇率波动引关注', url: 'https://finance.sina.com.cn' },
  { title: '📱 科技巨头发布季度财报', url: 'https://finance.sina.com.cn' },
];

const FALLBACK_NAIL_DY = [
  { title: '冰透果冻猫眼美甲教程', platform: 'douyin' },
  { title: '落日腮红美甲 黄皮天菜', platform: 'douyin' },
  { title: '贝母碎片极简裸甲 高级感', platform: 'douyin' },
  { title: '人鱼尾美甲 夏日爆款', platform: 'douyin' },
  { title: '手绘小雏菊美甲 清新田园', platform: 'douyin' },
  { title: 'Baby奶蓝法式 2026最美', platform: 'douyin' },
  { title: '波点蓝法式 时尚前沿', platform: 'douyin' },
  { title: '碎冰蓝闪粉 清凉一夏', platform: 'douyin' },
];

// ========== 抓取函数 ==========
async function fetchHotList(platformKey) {
  try {
    const url = ORZ_API + platformKey;
    const res = await fetch(url, { timeout: 8000 });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // orz.ai 返回格式: { data: [{ title, url, hot, ... }] }
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.slice(0, 15).map(item => ({
        title: item.title || item.name || '',
        url: item.url || '',
        hot: item.hot || item.heat || 0,
      })).filter(x => x.title);
    }
    return null;
  } catch (e) {
    console.log(`  ⚠️ ${platformKey} 抓取失败: ${e.message}`);
    return null;
  }
}

// ========== 主流程 ==========
async function main() {
  const today = new Date().toISOString().split('T')[0];
  console.log(`📅 生成日期: ${today}`);
  console.log(`🔍 开始抓取真实热榜数据...\n`);

  // 1. 抓取各平台热榜
  const allResults = {};
  for (const p of PLATFORMS) {
    console.log(`  → 抓取 ${p.name}...`);
    const data = await fetchHotList(p.key);
    if (data && data.length) {
      console.log(`    ✅ 获取到 ${data.length} 条`);
      allResults[p.key] = data;
    } else {
      console.log(`    ❌ 失败，使用兜底数据`);
    }
    // 防止请求过快被限流
    await sleep(500);
  }

  // 2. 组装新闻（优先微博+百度+知乎）
  let newsList = [];
  const wb = allResults['weibo'] || [];
  const bd = allResults['baidu'] || [];
  const zh = allResults['zhihu'] || [];
  // 合并去重
  const seen = new Set();
  const mergeAndDedup = (arr) => {
    arr.forEach(item => {
      const key = item.title.slice(0, 10);
      if (!seen.has(key)) { seen.add(key); newsList.push(item); }
    });
  };
  mergeAndDedup(wb);
  mergeAndDedup(bd);
  mergeAndDedup(zh);

  // 不足则用兜底
  if (newsList.length < 8) {
    newsList = newsList.concat(FALLBACK_NEWS.slice(0, 10 - newsList.length));
  }
  newsList = newsList.slice(0, 12);

  // 3. 组装抖音美甲（优先抖音热榜，过滤美甲相关内容）
  let douyinHot = allResults['douyin'] || [];
  let nailFromHot = douyinHot.filter(x =>
    /美甲|指甲|美睫|美容|穿搭|时尚/.test(x.title)
  );
  if (nailFromHot.length < 5) {
    nailFromHot = nailFromHot.concat(FALLBACK_NAIL_DY.slice(0, 8 - nailFromHot.length));
  }
  // 标记来源
  nailFromHot = nailFromHot.slice(0, 8).map(x => ({
    title: x.title,
    url: x.url || 'https://www.douyin.com',
    platform: 'douyin',
  }));

  // 4. 组装财经快讯（雪球+东方财富）
  let financeNews = [];
  const xq = allResults['xueqiu'] || [];
  const df = allResults['caijing'] || [];
  financeNews = financeNews.concat(xq.slice(0, 8), df.slice(0, 5));
  if (financeNews.length < 5) {
    financeNews = FALLBACK_NEWS.filter(x => /A股|财经|股市|央行|人民币|新能源|房地产/.test(x.title)).slice(0, 6);
  }
  financeNews = financeNews.slice(0, 10);

  // 5. 理财知识轮换
  const financeTips = [
    { topic: '资产配置的不可能三角', summary: '收益性、安全性、流动性三者难以兼得。普通人应先用存款和货币基金保流动性，再用债券和指数基金追求稳健收益，最后才考虑股票等高风险资产。' },
    { topic: '4321理财法则', summary: '40%稳健理财（定存/国债/货基）+ 30%增值投资（基金/股票）+ 20%应急备用金 + 10%保险保障。先保底再进攻。' },
    { topic: '72法则', summary: '72 ÷ 年化收益率 = 本金翻倍所需年数。年化8%→9年翻倍；年化12%→6年翻倍。时间是复利最好的朋友。' },
    { topic: '指数基金定投', summary: '定期定额买入沪深300/中证500等宽基指数，平摊成本，微笑曲线效应让市场波动变成你的朋友。' },
    { topic: '紧急备用金', summary: '预留3-6个月生活费，存放在随时可取的地方（货币基金/活期）。这是一切投资的地基。' },
    { topic: '复利的力量', summary: '每月存2000元，年化8%，30年后≈300万。延迟5年起步，结果少近百万。越早开始越好。' },
    { topic: '风险管理优先', summary: '先配齐百万医疗险+重疾险+意外险，年保费控制在收入5%以内。保险不是投资，是防止一夜回到解放前。' },
  ];
  const dayIdx = new Date().getDate() % financeTips.length;
  const todayTip = financeTips[dayIdx];

  // 6. 增肌营养餐轮换
  const mealPlans = [
    { name: '高蛋白均衡餐', cal: 680, protein: 42, foods: ['糙米饭 80g', '鸡胸肉 150g', '西兰花 150g', '牛油果 半个'], tip: '训练日首选，蛋白充足' },
    { name: '增肌能量餐', cal: 750, protein: 48, foods: ['杂粮饭 100g', '三文鱼 120g', '芦笋 100g', '红薯 100g'], tip: '富含Omega-3，促恢复' },
    { name: '快手增肌餐', cal: 580, protein: 38, foods: ['全麦面包 2片', '煎牛肉 120g', '蔬菜沙拉', '牛奶 250ml'], tip: '制作简单，适合忙碌日' },
    { name: '低脂高蛋白', cal: 520, protein: 45, foods: ['荞麦面 80g', '虾仁 150g', '蒜蓉菠菜', '蛋白 2个'], tip: '减脂增肌两不误' },
    { name: '碳水补充餐', cal: 650, protein: 35, foods: ['紫薯饭 100g', '卤鸡腿 1个', '凉拌黄瓜', '酸奶 200g'], tip: '训练后快速补能' },
    { name: '均衡营养餐', cal: 600, protein: 40, foods: ['燕麦粥 50g', '煎三文鱼 100g', '烤芦笋', '坚果一小把'], tip: '全天候营养覆盖' },
    { name: '爆发力餐', cal: 700, protein: 50, foods: ['意大利面 100g', '牛肉酱 80g', '番茄', '蛋白 3个'], tip: '大训练量日首选' },
  ];
  const mealIdx = new Date().getDate() % mealPlans.length;
  const todayMeal = mealPlans[mealIdx];

  // 7. 组装最终数据
  const output = {
    lastUpdated: today,
    news: newsList,
    finance_news: financeNews,
    nail: nailFromHot,
    finance_tip: todayTip,
    meal: todayMeal,
    sources: {
      news_platforms: Object.keys(allResults),
      api: 'orz.ai hot list + fallback library',
      generated_at: new Date().toISOString(),
    },
  };

  // 8. 写入 data.json
  fs.writeFileSync(
    path.join(__dirname, 'data.json'),
    JSON.stringify(output, null, 2),
    'utf-8'
  );

  console.log(`\n✅ 数据已生成: ${today}`);
  console.log(`   新闻: ${newsList.length} 条`);
  console.log(`   财经: ${financeNews.length} 条`);
  console.log(`   抖音美甲: ${nailFromHot.length} 条`);
  console.log(`   理财: ${todayTip.topic}`);
  console.log(`   餐单: ${todayMeal.name} (${todayMeal.cal}kcal/${todayMeal.protein}g蛋白)`);
  console.log(`\n📁 已写入 data.json`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

main().catch(err => {
  console.error('❌ 生成失败:', err);
  // 失败时写入兜底数据
  const fallback = {
    lastUpdated: new Date().toISOString().split('T')[0],
    news: FALLBACK_NEWS,
    finance_news: FALLBACK_NEWS,
    nail: FALLBACK_NAIL_DY,
    finance_tip: { topic: '资产配置的不可能三角', summary: '收益性、安全性、流动性三者难以兼得。' },
    meal: { name: '均衡营养餐', cal: 600, protein: 40, foods: ['燕麦粥', '煎鸡胸', '蔬菜沙拉'], tip: '全天候营养覆盖' },
    sources: { api: 'fallback only', error: err.message },
  };
  fs.writeFileSync(
    path.join(__dirname, 'data.json'),
    JSON.stringify(fallback, null, 2),
    'utf-8'
  );
  console.log('⚠️ 已写入兜底数据');
});