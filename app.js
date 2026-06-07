// ==============================
// 智驾研究台 - 应用逻辑 v2
// ==============================

// ===== 本地存储 =====
function loadData(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
  catch { return fallback; }
}
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// 收藏数据持久化
let favorites = loadData('zhijia_favorites', []);

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  renderHomePage();
  renderCompareTable();
  renderMatrixTable();
  renderVersionTimeline();
  renderOTAList();
  renderTestList();
  renderGlossary();
  renderRegulation();
  renderFavorites();
  renderCollectPage();
  window.addEventListener('resize', debounce(() => {
    if (document.getElementById('page-dataviz').classList.contains('active')) renderCharts();
  }, 300));
});

// ===== 防抖 =====
function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// ===== 导航切换 =====
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage(item.dataset.page);
    });
  });
  document.querySelectorAll('[data-page]').forEach(link => {
    if (!link.classList.contains('nav-item')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        switchPage(link.dataset.page);
      });
    }
  });
  // 快捷标签跳转对比页并高亮对应品牌
  document.querySelectorAll('.tag[data-brand]').forEach(tag => {
    tag.addEventListener('click', () => {
      switchPage('compare');
      highlightBrandRow(tag.dataset.brand);
    });
  });
}

function switchPage(pageName) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
  if (activeNav) activeNav.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const activePage = document.getElementById(`page-${pageName}`);
  if (activePage) activePage.classList.add('active');

  // 滚动到顶部
  document.querySelector('.content')?.scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageName === 'dataviz') setTimeout(renderCharts, 100);
  if (pageName === 'favorites') renderFavorites();

  // 关闭移动端菜单
  document.getElementById('mobile-menu')?.classList.remove('open');
  document.querySelector('.menu-overlay')?.classList.remove('show');
}

function highlightBrandRow(brand) {
  setTimeout(() => {
    const rows = document.querySelectorAll('#compare-table tbody tr');
    rows.forEach(r => r.style.background = '');
    rows.forEach(r => {
      if (r.querySelector('td')?.textContent.includes(brand)) {
        r.style.background = 'rgba(74, 144, 217, 0.1)';
        r.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, 50);
}

// ===== 移动端菜单 =====
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.querySelector('.menu-overlay');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    overlay?.classList.toggle('show');
  });
  overlay?.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
  });
  // 移动端菜单项点击
  mobileMenu.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage(item.dataset.page);
    });
  });
}

// ===== 首页渲染 =====
function renderHomePage() {
  renderNews('all');
  renderScores();
  renderVersions();
  renderIssues();
  initFilterTabs();
  initSearch();
}

// ===== 新闻列表 =====
function renderNews(filter) {
  const list = document.getElementById('news-list');
  if (!list) return;
  const filtered = filter === 'all' ? NEWS_DATA : NEWS_DATA.filter(n => n.type === filter);
  list.innerHTML = filtered.map(news => `
    <div class="news-card" data-type="${news.type}" data-id="${news.id}">
      <div class="news-meta">
        <span class="news-date">${news.date}</span>
        <span class="news-brand" style="background:${BRAND_COLORS[news.brand] || '#555'}">${news.brand}</span>
        <span class="news-brand-name">${news.brandName}</span>
        <span class="news-type type-${news.type}">${news.typeLabel}</span>
        <span class="news-favorite ${favorites.includes(news.id) ? 'active' : ''}" onclick="toggleFavorite(${news.id}, this)" title="收藏">
          ${favorites.includes(news.id) ? '★' : '☆'}
        </span>
      </div>
      <div class="news-title">${news.title}</div>
      <div class="news-summary">${news.summary}</div>
    </div>
  `).join('');
}

function toggleFavorite(id, el) {
  event?.stopPropagation();
  const idx = favorites.indexOf(id);
  if (idx >= 0) {
    favorites.splice(idx, 1);
    el?.classList.remove('active');
    if (el) el.textContent = '☆';
  } else {
    favorites.push(id);
    el?.classList.add('active');
    if (el) el.textContent = '★';
  }
  saveData('zhijia_favorites', favorites);
}

// ===== 筛选标签 =====
function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderNews(tab.dataset.filter);
    });
  });
}

// ===== 搜索 =====
function initSearch() {
  const input = document.getElementById('global-search');
  if (!input) return;
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.toLowerCase().trim();
      if (!query) { renderNews(document.querySelector('.filter-tab.active')?.dataset.filter || 'all'); return; }
      const cards = document.querySelectorAll('.news-card');
      let hasResult = false;
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const show = text.includes(query);
        card.style.display = show ? '' : 'none';
        if (show) hasResult = true;
      });
      // 无结果提示
      let noResult = document.getElementById('no-search-result');
      if (!hasResult) {
        if (!noResult) {
          noResult = document.createElement('div');
          noResult.id = 'no-search-result';
          noResult.className = 'empty-state';
          noResult.innerHTML = '<span class="empty-icon">🔍</span><p>没有找到匹配的结果</p><p class="empty-hint">试试其他关键词</p>';
          document.getElementById('news-list')?.appendChild(noResult);
        }
        noResult.style.display = '';
      } else if (noResult) {
        noResult.style.display = 'none';
      }
    }, 200);
  });
}

// ===== 评分卡片 =====
function renderScores() {
  const grid = document.getElementById('score-grid');
  if (!grid) return;
  grid.innerHTML = SCORE_DATA.map(s => {
    const avg = ((s.city + s.highway + s.parking) / 3).toFixed(1);
    return `
    <div class="score-card" onclick="switchPage('compare')" style="cursor:pointer" title="点击查看详细对比">
      <div class="score-header">
        <span class="score-brand-badge" style="background:${s.color}">${s.brand}</span>
        <div>
          <div class="score-name">${s.name}</div>
          <div class="score-version">${s.version}</div>
        </div>
        <div class="score-avg">
          <span class="score-avg-value" style="color:${s.color}">${avg}</span>
          <span class="score-avg-label">综合</span>
        </div>
      </div>
      <div class="score-items">
        ${renderScoreItem('城市场景', s.city, s.color)}
        ${renderScoreItem('高速场景', s.highway, s.color)}
        ${renderScoreItem('泊车场景', s.parking, s.color)}
      </div>
    </div>`;
  }).join('');
}

function renderScoreItem(label, value, color) {
  const pct = Math.max(0, Math.min(100, ((value - 5) / 5) * 100)); // 5-10映射到0-100%
  return `<div class="score-item">
    <span class="score-item-label">${label}</span>
    <div class="score-bar-bg"><div class="score-bar" style="width:${pct}%;background:${color}"></div></div>
    <span class="score-item-value" style="color:${color}">${value}</span>
  </div>`;
}

// ===== 版本列表 =====
function renderVersions() {
  const list = document.getElementById('version-list');
  if (!list) return;
  list.innerHTML = VERSION_DATA.slice(0, 6).map(v => `
    <div class="version-card">
      <span class="version-badge" style="background:${BRAND_COLORS[v.brand] || '#555'}">${v.brand}</span>
      <div class="version-info">
        <div class="version-name">${v.name} · ${v.version}</div>
        <div class="version-detail">${v.desc}</div>
      </div>
      <span class="version-date">${v.date}</span>
    </div>
  `).join('');
}

// ===== 问题列表 =====
function renderIssues() {
  const list = document.getElementById('issue-list');
  if (!list) return;
  list.innerHTML = ISSUE_DATA.map(i => `
    <div class="issue-card">
      <span class="issue-badge" style="background:${BRAND_COLORS[i.brand] || '#555'}">${i.brand}</span>
      <span class="issue-level level-${i.level.toLowerCase()}">${i.level}</span>
      <div class="issue-info">
        <span class="issue-name">${i.name}</span>
        <span class="issue-desc">${i.desc}</span>
      </div>
      <span class="issue-date">${i.date}</span>
    </div>
  `).join('');
}

// ===== 对比表格 =====
function renderCompareTable() {
  const table = document.getElementById('compare-table');
  if (!table) return;
  const h = COMPARE_DATA.headers;
  const brandColors = { '华为ADS':'#e53935','小鹏XNGP':'#ff9800','特斯拉FSD':'#1565c0','理想AD Max':'#7b1fa2','小米智驾':'#ff6f00','地平线HSD':'#2e7d32','比亚迪天神之眼':'#00838f','百度Apollo':'#0277bd','文远知行WeRide':'#6a1b9a' };
  table.innerHTML = `
    <thead><tr>${h.map(th => `<th>${th}</th>`).join('')}</tr></thead>
    <tbody>${COMPARE_DATA.rows.map(row => {
      const c = brandColors[row[0]] || '#555';
      return `<tr>${row.map((cell, i) => `<td>${i === 0 ? `<span class="cell-brand" style="border-left:3px solid ${c};padding-left:8px"><strong>${cell}</strong></span>` : cell}</td>`).join('')}</tr>`;
    }).join('')}</tbody>
  `;
}

// ===== 功能矩阵 =====
function renderMatrixTable() {
  const table = document.getElementById('matrix-table');
  if (!table) return;
  const features = MATRIX_DATA.features;
  const solutions = MATRIX_DATA.solutions;
  table.innerHTML = `
    <thead><tr><th>功能 \\ 方案</th>${solutions.map(s => `<th>${s.name}</th>`).join('')}</tr></thead>
    <tbody>${features.map((f, fi) => `
      <tr><td class="matrix-feature"><strong>${f}</strong></td>${solutions.map(s =>
        `<td class="${s.checks[fi] ? 'check-yes' : 'check-no'}">${s.checks[fi] ? '✅' : '—'}</td>`
      ).join('')}</tr>
    `).join('')}</tbody>
    <tfoot><tr><td><strong>支持数</strong></td>${solutions.map(s =>
      `<td class="matrix-count">${s.checks.filter(Boolean).length}/${s.checks.length}</td>`
    ).join('')}</tr></tfoot>
  `;
}

// ===== 版本时间线 =====
function renderVersionTimeline() {
  const container = document.getElementById('version-timeline');
  if (!container) return;
  container.innerHTML = VERSION_DATA.map(v => `
    <div class="timeline-item">
      <div class="timeline-dot" style="background:${BRAND_COLORS[v.brand] || 'var(--accent-blue)'}"></div>
      <div class="timeline-date">${v.date}</div>
      <div class="timeline-content">
        <div class="timeline-title">
          <span class="version-badge" style="background:${BRAND_COLORS[v.brand] || '#555'};display:inline-flex;width:24px;height:24px;font-size:10px;border-radius:4px;vertical-align:middle;margin-right:6px">${v.brand}</span>
          ${v.name} · ${v.version}
        </div>
        <div class="timeline-desc">${v.desc}</div>
      </div>
    </div>
  `).join('');
}

// ===== OTA列表 =====
function renderOTAList() {
  const container = document.getElementById('ota-list');
  if (!container) return;
  container.innerHTML = OTA_DATA.map(o => {
    const coverageNum = parseInt(o.coverage) || 0;
    const statusClass = o.status.includes('全量') ? 'status-done' :
                        o.status.includes('灰度') || o.status.includes('分批') ? 'status-pushing' :
                        o.status.includes('新') ? 'status-new' : 'status-partial';
    return `
      <div class="ota-card">
        <div class="ota-header">
          <div class="ota-brand-info">
            <span class="version-badge" style="background:${BRAND_COLORS[o.brand] || '#555'}">${o.brand}</span>
            <strong>${o.name}</strong>
          </div>
          <span class="ota-status ${statusClass}">${o.status}</span>
        </div>
        <div class="ota-version-row">
          <span><span class="ota-version-label">当前版本：</span><span class="ota-version-value">${o.currentVersion}</span></span>
          <span><span class="ota-version-label">最新版本：</span><span class="ota-version-value">${o.latestVersion}</span></span>
        </div>
        <div class="ota-progress">
          <div class="ota-progress-bar">
            <div class="ota-progress-fill" style="width:${coverageNum}%;background:linear-gradient(90deg,${BRAND_COLORS[o.brand] || 'var(--accent-blue)'},${BRAND_COLORS[o.brand] || 'var(--accent-blue)'}88)"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted)">
          <span>覆盖率：${o.coverage}</span>
          <span>预计：${o.expectedDate}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ===== 实测列表 =====
function renderTestList() {
  const container = document.getElementById('test-list');
  if (!container) return;
  container.innerHTML = TEST_DATA.map(t => `
    <div class="test-card">
      <div class="test-header">
        <div class="test-title">${t.title}</div>
        <span class="version-badge" style="background:${BRAND_COLORS[t.brand] || '#555'};width:30px;height:30px;font-size:12px">${t.brand}</span>
      </div>
      <div class="test-meta">
        <span>📅 ${t.date}</span>
        <span>📍 ${t.location}</span>
        <span>🚗 ${t.vehicle}</span>
      </div>
      <div class="test-scenes">
        ${t.scenes.map(s => `<span class="test-scene-tag">${s}</span>`).join('')}
      </div>
      <div class="test-scores">
        ${renderTestScore('城区', t.score.city, '#4a90d9')}
        ${renderTestScore('高速', t.score.highway, '#3d9970')}
        ${renderTestScore('泊车', t.score.parking, '#ff9800')}
      </div>
      <div class="test-highlights">${t.highlights}</div>
    </div>
  `).join('');
}

function renderTestScore(label, value, color) {
  const pct = ((value - 5) / 5) * 100;
  return `<div class="test-score-item">
    <div class="test-score-value" style="color:${color}">${value}</div>
    <div class="test-score-label">${label}</div>
    <div class="test-score-bar"><div class="test-score-fill" style="width:${pct}%;background:${color}"></div></div>
  </div>`;
}

// ===== 术语百科 =====
function renderGlossary() {
  const container = document.getElementById('glossary-list');
  if (!container) return;
  container.innerHTML = `<div class="glossary-search"><input type="text" id="glossary-search-input" placeholder="搜索术语..." oninput="filterGlossary(this.value)" /></div>` +
    `<div class="glossary-grid" id="glossary-grid">` +
    GLOSSARY_DATA.map(g => `
    <div class="glossary-item" data-term="${g.term.toLowerCase()} ${g.full.toLowerCase()}">
      <div class="glossary-term">${g.term}</div>
      <div class="glossary-full">${g.full}</div>
      <div class="glossary-desc">${g.desc}</div>
    </div>
  `).join('') + `</div>`;
}

function filterGlossary(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.glossary-item').forEach(item => {
    const match = !q || item.dataset.term.includes(q);
    item.style.display = match ? '' : 'none';
  });
}

// ===== 法规标准 =====
function renderRegulation() {
  const container = document.getElementById('regulation-list');
  if (!container) return;
  container.innerHTML = REGULATION_DATA.map(r => {
    const statusClass = r.status === '施行中' || r.status === '已实施' ? 'status-active' :
                        r.status === '征求意见' ? 'status-draft' : 'status-published';
    return `
      <div class="regulation-card">
        <div class="regulation-header">
          <div class="regulation-title">${r.title}</div>
          <span class="regulation-status ${statusClass}">${r.status}</span>
        </div>
        <div class="regulation-meta">${r.date} · ${r.org}</div>
        <div class="regulation-desc">${r.desc}</div>
      </div>
    `;
  }).join('');
}

// ===== 数据采集 =====
function renderCollectPage() {
  // 手动录入表单
  const formArea = document.getElementById('collect-form-area');
  if (!formArea) return;
  formArea.innerHTML = `
    <div class="collect-tabs">
      <button class="collect-tab active" onclick="showCollectForm('ota-form')">录入OTA</button>
      <button class="collect-tab" onclick="showCollectForm('test-form')">录入住测</button>
      <button class="collect-tab" onclick="showCollectForm('issue-form')">录入问题</button>
    </div>
    <div id="ota-form" class="collect-form active">
      <div class="form-row"><label>品牌</label><select id="f-brand"><option>华为ADS</option><option>小鹏XNGP</option><option>特斯拉FSD</option><option>理想AD Max</option><option>小米智驾</option><option>地平线HSD</option><option>比亚迪天神之眼</option></select></div>
      <div class="form-row"><label>版本号</label><input type="text" id="f-version" placeholder="如 ADS 5.0" /></div>
      <div class="form-row"><label>更新内容</label><textarea id="f-desc" placeholder="简要描述更新内容" rows="3"></textarea></div>
      <div class="form-row"><label>日期</label><input type="date" id="f-date" /></div>
      <button class="btn-primary" onclick="submitCollectForm('ota')">提交</button>
    </div>
    <div id="test-form" class="collect-form">
      <div class="form-row"><label>品牌</label><select id="t-brand"><option>华为ADS</option><option>小鹏XNGP</option><option>特斯拉FSD</option><option>理想AD Max</option><option>小米智驾</option><option>地平线HSD</option><option>比亚迪天神之眼</option></select></div>
      <div class="form-row"><label>测试标题</label><input type="text" id="t-title" placeholder="如 华为ADS 5.0城区实测" /></div>
      <div class="form-row"><label>地点</label><input type="text" id="t-location" placeholder="如 深圳南山" /></div>
      <div class="form-row"><label>车型</label><input type="text" id="t-vehicle" placeholder="如 问界M9" /></div>
      <div class="form-row"><label>测试亮点</label><textarea id="t-highlights" placeholder="测试发现的关键信息" rows="3"></textarea></div>
      <button class="btn-primary" onclick="submitCollectForm('test')">提交</button>
    </div>
    <div id="issue-form" class="collect-form">
      <div class="form-row"><label>品牌</label><select id="i-brand"><option>华为ADS</option><option>小鹏XNGP</option><option>特斯拉FSD</option><option>理想AD Max</option><option>小米智驾</option><option>地平线HSD</option><option>比亚迪天神之眼</option></select></div>
      <div class="form-row"><label>严重等级</label><select id="i-level"><option>P0</option><option>P1</option><option>P2</option></select></div>
      <div class="form-row"><label>问题描述</label><textarea id="i-desc" placeholder="描述发现的问题" rows="3"></textarea></div>
      <button class="btn-primary" onclick="submitCollectForm('issue')">提交</button>
    </div>
  `;
  // 设置默认日期
  const dateInput = document.getElementById('f-date');
  if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
}

function showCollectForm(formId) {
  document.querySelectorAll('.collect-form').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.collect-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(formId)?.classList.add('active');
  event?.target?.classList.add('active');
}

function submitCollectForm(type) {
  let msg = '';
  if (type === 'ota') {
    const brand = document.getElementById('f-brand')?.value;
    const version = document.getElementById('f-version')?.value;
    const desc = document.getElementById('f-desc')?.value;
    const date = document.getElementById('f-date')?.value;
    if (!version || !desc) { showToast('请填写完整信息', 'error'); return; }
    msg = `✅ OTA记录已添加：${brand} ${version}`;
    // 添加到数据
    VERSION_DATA.unshift({ brand: getBrandKey(brand), name: brand, version, date: date || new Date().toISOString().slice(0,10), desc });
  } else if (type === 'test') {
    const brand = document.getElementById('t-brand')?.value;
    const title = document.getElementById('t-title')?.value;
    if (!title) { showToast('请填写测试标题', 'error'); return; }
    msg = `✅ 实测记录已添加：${title}`;
  } else if (type === 'issue') {
    const brand = document.getElementById('i-brand')?.value;
    const level = document.getElementById('i-level')?.value;
    const desc = document.getElementById('i-desc')?.value;
    if (!desc) { showToast('请填写问题描述', 'error'); return; }
    msg = `✅ 问题已记录：${brand} ${level} ${desc.slice(0, 20)}...`;
    ISSUE_DATA.push({ brand: getBrandKey(brand), name: brand, level, date: new Date().toISOString().slice(0,10), desc });
  }
  showToast(msg);
}

function getBrandKey(name) {
  const map = {'华为ADS':'H','小鹏XNGP':'X','特斯拉FSD':'T','理想AD Max':'L','小米智驾':'Mi','地平线HSD':'HX','比亚迪天神之眼':'BYD'};
  return map[name] || 'H';
}

// ===== Toast 通知 =====
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ===== 我的收藏 =====
function renderFavorites() {
  const container = document.getElementById('favorites-list');
  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">⭐</span><p>暂无收藏内容</p><p class="empty-hint">浏览动态时点击 ☆ 按钮添加收藏</p></div>`;
    return;
  }

  const favNews = NEWS_DATA.filter(n => favorites.includes(n.id));
  if (favNews.length === 0) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">⭐</span><p>收藏的内容已被清理</p></div>`;
    return;
  }

  container.innerHTML = favNews.map(news => `
    <div class="news-card">
      <div class="news-meta">
        <span class="news-date">${news.date}</span>
        <span class="news-brand" style="background:${BRAND_COLORS[news.brand] || '#555'}">${news.brand}</span>
        <span class="news-brand-name">${news.brandName}</span>
        <span class="news-type type-${news.type}">${news.typeLabel}</span>
        <span class="news-favorite active" onclick="toggleFavorite(${news.id}, this); renderFavorites();" title="取消收藏">★</span>
      </div>
      <div class="news-title">${news.title}</div>
      <div class="news-summary">${news.summary}</div>
    </div>
  `).join('');
}

// ===== 图表渲染 =====
function renderCharts() {
  renderRadarChart();
  renderBarChart();
  renderScoreCompareChart();
}

function renderRadarChart() {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width - 40;
  const h = 320;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(cx, cy) - 50;
  const labels = ['城市场景', '高速场景', '泊车场景', '综合体验'];
  const n = labels.length;

  // 画网格
  for (let level = 2; level <= 10; level += 2) {
    const r = (level / 10) * maxR;
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    // 刻度标签
    if (level % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(level, cx + 4, cy - r + 3);
    }
  }

  // 画轴线和标签
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const ex = cx + maxR * Math.cos(angle);
    const ey = cy + maxR * Math.sin(angle);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    const lx = cx + (maxR + 24) * Math.cos(angle);
    const ly = cy + (maxR + 24) * Math.sin(angle);
    ctx.fillStyle = '#9898a8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[i], lx, ly);
  }

  // 画数据
  const top5 = SCORE_DATA.slice(0, 5);
  top5.forEach((s) => {
    const avg = +((s.city + s.highway + s.parking) / 3).toFixed(1);
    const values = [s.city, s.highway, s.parking, avg];
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * (i % n)) / n - Math.PI / 2;
      const v = values[i % n];
      const r = (v / 10) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = s.color + '18';
    ctx.fill();
    ctx.stroke();
    // 数据点
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const v = values[i];
      const r = (v / 10) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 图例
  ctx.font = '11px sans-serif';
  top5.forEach((s, idx) => {
    const x = 8;
    const y = 14 + idx * 16;
    ctx.fillStyle = s.color;
    ctx.fillRect(x, y - 6, 10, 10);
    ctx.fillStyle = '#9898a8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.name, x + 14, y);
  });
}

function renderBarChart() {
  const canvas = document.getElementById('bar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width - 40;
  const h = 320;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const data = [
    { name: '华为ADS', count: 8, color: '#e53935' },
    { name: '小鹏XNGP', count: 6, color: '#ff9800' },
    { name: '特斯拉FSD', count: 5, color: '#1565c0' },
    { name: '理想AD Max', count: 4, color: '#7b1fa2' },
    { name: '小米智驾', count: 3, color: '#ff6f00' },
    { name: '地平线HSD', count: 4, color: '#2e7d32' },
    { name: '比亚迪', count: 2, color: '#00838f' }
  ];

  const maxVal = Math.max(...data.map(d => d.count));
  const barH = 26;
  const gap = 14;
  const labelW = 90;
  const chartW = w - labelW - 60;
  const startY = 10;

  // 网格线
  for (let i = 0; i <= 4; i++) {
    const x = labelW + 10 + (chartW * i / 4);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, data.length * (barH + gap) + startY);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(maxVal * i / 4) + '次', x, data.length * (barH + gap) + startY + 14);
  }

  data.forEach((d, i) => {
    const y = startY + i * (barH + gap);
    const barW = (d.count / maxVal) * chartW;

    ctx.fillStyle = '#9898a8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.name, labelW, y + barH / 2);

    const gradient = ctx.createLinearGradient(labelW + 10, 0, labelW + 10 + barW, 0);
    gradient.addColorStop(0, d.color + 'dd');
    gradient.addColorStop(1, d.color + '66');
    ctx.fillStyle = gradient;
    drawRoundRect(ctx, labelW + 10, y, Math.max(barW, 2), barH, 4);
    ctx.fill();

    ctx.fillStyle = d.color;
    ctx.textAlign = 'left';
    ctx.font = '12px sans-serif';
    ctx.fillText(d.count + '次', labelW + 14 + barW, y + barH / 2);
  });
}

function renderScoreCompareChart() {
  const canvas = document.getElementById('score-compare-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width - 40;
  const h = 320;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const dims = ['城市场景', '高速场景', '泊车场景'];
  const keys = ['city', 'highway', 'parketing'];
  const dimW = w / (dims.length + 1);
  const barW = 18;
  const maxVal = 10;

  dims.forEach((dim, di) => {
    const baseX = dimW * (di + 0.5);
    // 标签
    ctx.fillStyle = '#9898a8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dim, baseX + (SCORE_DATA.length * barW) / 2, h - 10);

    SCORE_DATA.forEach((s, si) => {
      const x = baseX + si * (barW + 2);
      const val = di === 0 ? s.city : di === 1 ? s.highway : s.parking;
      const barH = (val / maxVal) * (h - 60);
      const y = h - 30 - barH;

      ctx.fillStyle = s.color + 'cc';
      drawRoundRect(ctx, x, y, barW, barH, 3);
      ctx.fill();

      ctx.fillStyle = s.color;
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val, x + barW / 2, y - 4);
    });
  });

  // 图例
  ctx.font = '10px sans-serif';
  SCORE_DATA.forEach((s, idx) => {
    const x = 8;
    const y = 14 + idx * 14;
    ctx.fillStyle = s.color;
    ctx.fillRect(x, y - 5, 8, 8);
    ctx.fillStyle = '#9898a8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.name, x + 12, y);
  });
}

// 兼容 roundRect
function drawRoundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
