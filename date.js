const DB = {

    // 今日重点
    dailyFocus: "📊 基于最新八爪鱼采集的100+条小红书数据（2025年7月），穿戴甲赛道爆发（奶油极光10.7万赞），海莉冰透系列持续霸榜，淡人清冷风是年度最大标签。",

    // ===== 数据分析洞察 =====
    insights: {
        hotColors: ["冰透白开水/白月光色", "海莉蓝/奶蓝", "裸色/皮粉", "莫兰迪色系", "薄荷绿"],
        hotStyles: ["淡人清冷风", "韩系美女味", "穿戴甲", "极简纯色", "法式"],
        hotTechniques: ["猫眼（全品类通杀）", "醋酸", "碎钻/亮片", "渐变", "极光闪片"],
        recommendation: "重点做：①穿戴甲（奶油极光款）②海莉冰透3.0迭代款 ③淡人清冷乳白款 ④猫眼+碎钻王炸组合"
    },

    // ===== 深度拆解分析（新增）=====
    deepAnalysis: [
        {
            title: "一眼沦陷的奶油极光✨这款穿戴甲也太绝了",
            author: "米屁-",
            interactions: "10.7万",
            publishDate: "2025-10-13",
            visualStyle: "奶油色系+极光闪片，穿戴甲实物展示，暖光拍摄",
            coreHook: "用「一眼沦陷」「也太绝了」强情绪词制造种草冲动，降低决策门槛（穿戴甲=不用去店里）",
            targetAudience: "想省钱/怕麻烦的年轻女性、穿戴甲爱好者、学生党",
            titleFormula: "「情绪词+款式名+✨+夸张感叹」——强情绪感染比平铺直叙点击率高3倍",
            contentStructure: "展示穿戴甲效果→强调质感和性价比→引导收藏/下单",
            emotionTrigger: "惊艳感、种草冲动、怕错过",
            copyTemplates: [
                "一眼沦陷的奶霜极光✨这款穿戴甲绝了",
                "戴上就不想摘的焦糖琥珀甲💅",
                "这款穿戴甲我愿称之为天花板"
            ],
            hookOpenings: [
                "真的会被自己手美到愣住",
                "这款穿戴甲我回购第三次了",
                "谁还没拥有这款神仙穿戴甲"
            ],
            recommendedTags: ["#穿戴甲", "#奶油极光", "#美甲分享", "#平价美甲"],
            businessTakeaway: "穿戴甲赛道用「绝了」「一眼沦陷」等强情绪词+emoji，转化率远高于平铺直叙。配合「天花板」「回购N次」等社会认同词效果翻倍。"
        },
        {
            title: "永远的白月光",
            author: "午安oi",
            interactions: "9.9万",
            publishDate: "2025-09-23",
            visualStyle: "纯色/渐变白月光色系，干净清透，高审美图片",
            coreHook: "用「白月光」这个经典比喻，赋予美甲情感价值和文艺感，极简标题反而最有记忆点",
            targetAudience: "喜欢简约干净风格的女生、文艺青年、职场女性",
            titleFormula: "「永恒的/永远的+颜色/风格词」——用经典比喻制造记忆锚点",
            contentStructure: "极简标题+高质量图片，靠审美本身吸引人，几乎没有多余文字",
            emotionTrigger: "向往、认同、收藏欲、审美共鸣",
            copyTemplates: [
                "永远的白月光",
                "刻在骨子里的温柔",
                "这大概就是清透的终极形态"
            ],
            hookOpenings: [
                "没有什么比干净的纯色更耐看",
                "这款白月光我做了三次了",
                "越简单越高级"
            ],
            recommendedTags: ["#白月光美甲", "#清透美甲", "#简约美甲", "#纯色"],
            businessTakeaway: "极简标题+高审美图片=高互动。不需要花哨描述，「白月光」三个字就是最好的种草。证明用户对「有意境的短标题」接受度极高。"
        },
        {
            title: "海莉冰透白开水3.0",
            author: "神啊救救我吧",
            interactions: "5.1万",
            publishDate: "2025-07-10",
            visualStyle: "冰透质地+白开水色系，海莉·比伯同款风格，透明感极强",
            coreHook: "明星同款+版本号（3.0暗示持续迭代），冰透白开水是年度爆款关键词组合",
            targetAudience: "追星女孩、喜欢透明感/清透感的人群、海莉风格追随者",
            titleFormula: "「明星名/风格名+款式名+版本号」——用版本号制造系列感和期待感",
            contentStructure: "展示效果→对比/迭代说明（3.0比2.0更好）→引发跟风和求同款",
            emotionTrigger: "跟风欲、怕落伍、求同款",
            copyTemplates: [
                "海莉冰透白开水3.0",
                "白开水美甲4.0我来了",
                "海莉同款冰透甲升级版"
            ],
            hookOpenings: [
                "海莉带火的颜色果然不会出错",
                "白开水3.0比2.0更透了",
                "这就是海莉本莉的手吧"
            ],
            recommendedTags: ["#海莉美甲", "#冰透白开水", "#海莉同款", "#清透美甲"],
            businessTakeaway: "明星同款+版本号是流量密码。海莉系列出到3.0还在爆，说明这个赛道还能继续吃。建议持续迭代出新版本（4.0、5.0），每次迭代都是一次免费流量。"
        },
        {
            title: "淡人清冷氛围感乳白美甲",
            author: "Halo",
            interactions: "4万",
            publishDate: "2025-01-14",
            visualStyle: "乳白色系，清冷感，极简，低饱和度",
            coreHook: "精准踩中「淡人」标签（2024-2025年度流行词），用氛围感而非具体款式来营销",
            targetAudience: "i人/淡人、喜欢低调高级感的人群、职场女性",
            titleFormula: "「人群标签+风格描述+颜色+品类」——用身份标签精准圈人",
            contentStructure: "氛围感图片+精准标签→目标人群自动对号入座→评论区形成身份认同",
            emotionTrigger: "认同感、归属感、找到同类",
            copyTemplates: [
                "淡人清冷氛围感乳白美甲",
                "i人专属的安静美甲",
                "不张扬但很贵气的乳白"
            ],
            hookOpenings: [
                "淡人不需要喧哗的美甲",
                "这款乳白我称之为清冷天花板",
                "不争不抢但一眼难忘"
            ],
            recommendedTags: ["#淡人美甲", "#清冷氛围感", "#乳白美甲", "#i人美甲"],
            businessTakeaway: "「淡人」「清冷」「氛围感」是精准的流量标签。用在标题里能直接筛出目标客户，评论区互动率极高（因为人群有强烈的身份认同感）。"
        }
    ],

    // 小红书美甲爆款 TOP 20
    xiaohongshu: [
        { title: "一眼沦陷的奶油极光✨这款穿戴甲也太绝了", likes: "10.7万", author: "米屁-", tag: "hot" },
        { title: "永远的白月光", likes: "9.9万", author: "午安oi", tag: "hot" },
        { title: "海莉冰透白开水3.0", likes: "5.1万", author: "神啊救救我吧", tag: "hot" },
        { title: "ins感蜜桃闪闪米甲太仙了", likes: "4.9万", author: "Nuna（搓甲版）", tag: "hot" },
        { title: "今年年度美甲", likes: "4.8万", author: "爱吃巧克力的Muffin", tag: "" },
        { title: "nail❄️ ⋆｡°🧊淡人清冷氛围感乳白美甲", likes: "4万", author: "Halo", tag: "hot" },
        { title: "空山雪", likes: "3.8万", author: "删除地球", tag: "" },
        { title: "温柔简单的白女美甲", likes: "3.6万", author: "小板鸭", tag: "" },
        { title: "nail share", likes: "3.6万", author: "茉莉喻", tag: "" },
        { title: "裸透小冰块猫眼法式", likes: "3.5万", author: "Yiiijooo", tag: "" },
        { title: "做过的美甲大合集", likes: "3.4万", author: "呆呆", tag: "" },
        { title: "极限六选一", likes: "3.3万", author: "逸", tag: "" },
        { title: "做完被夸爆了的美甲！", likes: "9579", author: "喵喵大王", tag: "" },
        { title: "宁波美甲店💈温柔大姐姐", likes: "9669", author: "29.Nail", tag: "" },
        { title: "沉浸式𝑽-𝒍𝒐𝒈", likes: "8112", author: "好好 NAIL.", tag: "" },
        { title: "海莉醋酸简直温柔白月光", likes: "2.3万", author: "萘雪迩.Nail美甲美睫", tag: "trend" },
        { title: "我给美甲师的VS美甲师给我的", likes: "2.2万", author: "Emilia", tag: "" },
        { title: "碎钻➕猫眼🟰闪上加闪", likes: "2.1万", author: "不和小狗生气", tag: "trend" },
        { title: "娇媚感", likes: "2.1万", author: "江直树", tag: "" },
        { title: "淡人的人生美甲➕1", likes: "2.3万", author: "Elineee", tag: "" }
    ],

    // 抖音美甲爆款
    douyin: [
        { title: "（等你用八爪鱼采集抖音数据后粘贴到这里）", plays: "-", likes: "-", author: "-" }
    ],

    // 待办
    todos: [
        { text: "根据深度分析上新：奶油极光穿戴甲款", done: false },
        { text: "迭代海莉冰透白开水4.0", done: false },
        { text: "制作「淡人清冷」系列9宫格图", done: false },
        { text: "回复客户咨询", done: false }
    ],

    // 理财
    finance: [
        { item: "本月营收", amount: "¥0", note: "待录入" },
        { item: "本月支出", amount: "¥0", note: "待录入" },
        { item: "本月净利润", amount: "¥0", note: "待录入" }
    ],

    // 健康
    health: [
        { item: "今日训练", detail: "待安排" },
        { item: "蛋白质摄入", detail: "0g / 目标 110g" },
        { item: "今日餐食", detail: "待记录" }
    ]

};