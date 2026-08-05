const DB = {

    // 今日重点
    dailyFocus: "📊 已分析八爪鱼采集的100+条小红书数据，蓝色系+猫眼+醋酸是当前最热组合，海莉冰透白开水单篇5.1万赞。",

    // ===== 数据分析洞察（新增）=====
    insights: {
        hotColors: ["蓝色系（baby蓝/海莉蓝/薄荷绿）", "裸色/奶茶/皮粉", "白色系（乳白/月光）", "紫色系（人鱼姬紫）"],
        hotStyles: ["清冷淡人风", "韩系美女味", "甜酷撞色", "穿戴甲"],
        hotTechniques: ["猫眼（出现30+次）", "醋酸", "碎钻/亮片", "法式"],
        recommendation: "重点做：海莉醋酸+猫眼 / 裸色冰透+碎钻 / baby蓝法式"
    },

    // 小红书美甲爆款 TOP 10
    xiaohongshu: [
        { title: "永远的白月光", likes: "9.9万", author: "午安oi", tag: "hot" },
        { title: "一眼沦陷的奶油极光✨穿戴甲", likes: "10.7万", author: "米屁-", tag: "hot" },
        { title: "海莉冰透白开水3.0", likes: "5.1万", author: "神啊救救我吧", tag: "hot" },
        { title: "ins感蜜桃闪闪米甲太仙了", likes: "4.9万", author: "Nuna（搓甲版）", tag: "hot" },
        { title: "今年年度美甲", likes: "4.8万", author: "爱吃巧克力的Muffin", tag: "" },
        { title: "空山雪", likes: "3.8万", author: "删除地球", tag: "" },
        { title: "温柔简单的白女美甲", likes: "3.6万", author: "小板鸭", tag: "" },
        { title: "做过的美甲大合集", likes: "3.4万", author: "呆呆", tag: "" },
        { title: "极限六选一", likes: "3.3万", author: "逸", tag: "" },
        { title: "碎钻➕猫眼 闪上加闪", likes: "2.1万", author: "不和小狗生气", tag: "trend" },
        { title: "白富美美甲🐚醋酸贝壳猫", likes: "1.9万", author: "her", tag: "" },
        { title: "最近很火的江坂丽奈色美甲！", likes: "1.2万", author: "橙", tag: "trend" },
        { title: "闪闪的淡人美甲", likes: "1.3万", author: "umi", tag: "" },
        { title: "Nail♡♩🤍敲清透的月光醋酸美甲", likes: "1.6万", author: "Ajiao（努力打工版）", tag: "" },
        { title: "海蓝爆闪猫眼法式美甲", likes: "8439", author: "杨小懒", tag: "trend" },
        { title: "冰透嬛嬛中椭圆", likes: "1.4万", author: "逗逗穿戴甲", tag: "" },
        { title: "夏日醋酸 baby蓝❄️", likes: "4191", author: "小e大i", tag: "" },
        { title: "黄黑皮巨适配皮粉！！！", likes: "1.6万", author: "南忘Nail", tag: "" },
        { title: "夏日的冰川薄荷美甲", likes: "1719", author: "星甲师", tag: "" },
        { title: "清透白开水猫眼", likes: "8414", author: "Yiiijooo", tag: "" }
    ],

    // 抖音美甲爆款
    douyin: [
        { title: "（等你用八爪鱼采集抖音数据后粘贴到这里）", plays: "-", likes: "-", author: "-" }
    ],

    // 待办
    todos: [
        { text: "用八爪鱼采集抖音美甲数据", done: false },
        { text: "根据分析结果上新：海莉醋酸猫眼款", done: false },
        { text: "拍摄新款美甲发小红书", done: false },
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