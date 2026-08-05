document.addEventListener('DOMContentLoaded', function() {

    // 时钟
    function updateClock() {
        var now = new Date();
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('clock').textContent = h + ':' + m;
    }
    updateClock();
    setInterval(updateClock, 60000);

    // Tab 切换
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');
            var target = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-pane').forEach(function(p) {
                p.classList.remove('active');
            });
            document.getElementById('pane-' + target).classList.add('active');
        });
    });

    // 今日重点
    document.getElementById('daily-focus').textContent = DB.dailyFocus;

    // 统计数字
    document.getElementById('stat-xhs').textContent = DB.xiaohongshu.length;
    document.getElementById('stat-douyin').textContent = DB.douyin.length;
    document.getElementById('stat-tasks').textContent = DB.todos.filter(function(t) { return !t.done; }).length;

    // 渲染小红书
    var xhsList = document.getElementById('xhs-list');
    DB.xiaohongshu.forEach(function(item) {
        var tagHtml = item.tag ? '<span class="tag tag-' + item.tag + '">' + (item.tag === 'hot' ? '🔥 爆款' : item.tag === 'new' ? '🆕 最新' : '📈 趋势') + '</span>' : '';
        xhsList.innerHTML += '<div class="data-card"><div class="card-title">' + item.title + '</div><div class="card-meta"><span>❤ ' + item.likes + '</span><span>⭐ ' + item.collects + '</span><span>@' + item.author + '</span></div>' + tagHtml + '</div>';
    });

    // 渲染抖音
    var douyinList = document.getElementById('douyin-list');
    DB.douyin.forEach(function(item) {
        var tagHtml = item.tag ? '<span class="tag tag-' + item.tag + '">' + (item.tag === 'hot' ? '🔥 爆款' : item.tag === 'new' ? '🆕 最新' : '📈 趋势') + '</span>' : '';
        douyinList.innerHTML += '<div class="data-card"><div class="card-title">' + item.title + '</div><div class="card-meta"><span>▶ ' + item.plays + '</span><span>❤ ' + item.likes + '</span><span>@' + item.author + '</span></div>' + tagHtml + '</div>';
    });

    // 渲染待办
    var todoList = document.getElementById('todo-list');
    DB.todos.forEach(function(item) {
        var checkMark = item.done ? '✓' : '';
        todoList.innerHTML += '<div class="todo-item' + (item.done ? ' done' : '') + '"><div class="todo-check">' + checkMark + '</div><div class="todo-text">' + item.text + '</div></div>';
    });

    // 渲染理财
    var financeList = document.getElementById('finance-list');
    DB.finance.forEach(function(item) {
        financeList.innerHTML += '<div class="data-card"><div class="card-title">' + item.item + '</div><div class="card-meta"><span style="color:#4facfe;font-weight:600;font-size:16px;">' + item.amount + '</span></div><div class="card-meta"><span>' + item.note + '</span></div></div>';
    });

    // 渲染健康
    var healthList = document.getElementById('health-list');
    DB.health.forEach(function(item) {
        healthList.innerHTML += '<div class="data-card"><div class="card-title">' + item.item + '</div><div class="card-meta"><span>' + item.detail + '</span></div></div>';
    });

});