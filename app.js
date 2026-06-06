// ==============================
// 智驾研究台 - 应用逻辑
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderNews('all');
  renderScores();
  renderVersions();
  renderIssues();
  renderCompareTable();
  renderMatrixTable();
  renderVersionTimeline();
  renderOTAList();
  renderTestList();
  renderGlossary();
  renderRegulation();
  initFilterTabs();
  initSearch();
});

// ===== 导航切换 =====
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      switchPage(page);
    });
  });

  // 页面内链接
  document.querySelectorAll('[data-page]').forEach(link => {
    if (!link.classList.contains('nav-item')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        switchPage(page);
      });
    }
  });

  // 快捷标签
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
      switchPage('compare');
    });
  });
}

function switchPage(pageName) {
  // 更新导航高亮
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
  if (activeNav) activeNav.classList.add('active');

  // 切换页面
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const activePage = document.getElementById(`page-${pageName}`);
  if (activePage) activePage.classList.add('active');

  // 特殊页面渲染
  if (pageName === 'dataviz') {
    setTimeout(renderCharts, 100);
  }
}

// ===== 新闻列表 =====
function renderNews(filter) {
  const list = document.getElementById('news-list');
  const filtered = filter === 'all' ? NEWS_DATA : NEWS_DATA.filter(n => n.type === filter);

  list.innerHTML = filtered.map(news => `
    <div class="news-card" data-type="${news.type}">
      <div class="news-meta">
        <span class="news-date">${news.date}</span>
        <span class="news-brand" style="background:${BRAND_COLORS[news.brand]}">${news.brand}</span>
        <span class="news-type type-${news.type}">${news.typeLabel}</span>
        <span class="news-favorite ${news.favorited ? 'active' : ''}" onclick="toggleFavorite(event, ${news.id})">
          ${news.favorited ? '★' : '☆'}
        </span>
      </div>
      <div class="news-title">${news.title}</div>
      <div class="news-summary">${news.summary}</div>
    </div>
  `).join('');
}

function toggleFavorite(e, id) {
  e.stopPropagation();
  const news = NEWS_DATA.find(n => n.id === id);
  if (news) {
    news.favorited = !news.favorited;
    const filter = document.querySelector('.filter-tab.active')?.dataset.filter || 'all';
    renderNews(filter);
  }
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
  const input = document.querySelector('.search-box input');
  if (!input) return;
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.news-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

// ===== 评分卡片 =====
function renderScores() {
  const grid = document.getElementById('score-grid');
  grid.innerHTML = SCORE_DATA.map(s => `
    <div class="score-card">
      <div class="score-header">
        <span class="score-brand-badge" style="background:${s.color}">${s.brand}</span>
        <div>
          <div class="score-name">${s.name}</div>
          <div class="score-version">${s.version}</div>
        </div>
      </div>
      <div class="score-items">
        <div class="score-item">
          <span class="score-item-label">城市场景</span>
          <div class="score-bar-bg"><div class="score-bar" style="width:${s.city * 10}%;background:${s.color}"></div></div>
          <span class="score-item-value" style="color:${s.color}">${s.city}</span>
        </div>
        <div class="score-item">
          <span class="score-item-label">高速场景</span>
          <div class="score-bar-bg"><div class="score-bar" style="width:${s.highway * 10}%;background:${s.color}"></div></div>
          <span class="score-item-value" style="color:${s.color}">${s.highway}</span>
        </div>
        <div class="score-item">
          <span class="score-item-label">泊车场景</span>
          <div class="score-bar-bg"><div class="score-bar" style="width:${s.parking * 10}%;background:${s.color}"></div></div>
          <span class="score-item-value" style="color:${s.color}">${s.parking}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== 版本列表 =====
function renderVersions() {
  const list = document.getElementById('version-list');
  list.innerHTML = VERSION_DATA.slice(0, 6).map(v => `
    <div class="version-card">
      <span class="version-badge" style="background:${BRAND_COLORS[v.brand]}">${v.brand}</span>
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
  list.innerHTML = ISSUE_DATA.map(i => `
    <div class="issue-card">
      <span class="issue-badge" style="background:${BRAND_COLORS[i.brand]}">${i.brand}</span>
      <span class="issue-level level-${i.level.toLowerCase()}">${i.level}</span>
      <div class="issue-info">
        <span class="issue-name">${i.name}</span>
      </div>
      <span class="issue-desc">${i.desc}</span>
      <span class="issue-date">${i.date}</span>
    </div>
  `).join('');
}

// ===== 对比表格 =====
function renderCompareTable() {
  const table = document.getElementById('compare-table');
  const h = COMPARE_DATA.headers;
  table.innerHTML = `
    <thead><tr>${h.map(th => `<th>${th}</th>`).join('')}</tr></thead>
    <tbody>${COMPARE_DATA.rows.map(row => `
      <tr>${row.map((cell, i) => `<td>${i === 0 ? `<strong>${cell}</strong>` : cell}</td>`).join('')}</tr>
    `).join('')}</tbody>
  `;
}

// ===== 功能矩阵 =====
function renderMatrixTable() {
  const table = document.getElementById('matrix-table');
  const features = MATRIX_DATA.features;
  const solutions = MATRIX_DATA.solutions;
  table.innerHTML = `
    <thead><tr><th>功能 \\ 方案</th>${solutions.map(s => `<th>${s.name}</th>`).join('')}</tr></thead>
    <tbody>${features.map((f, fi) => `
      <tr><td><strong>${f}</strong></td>${solutions.map(s =>
        `<td class="${s.checks[fi] ? 'check-yes' : 'check-no'}">${s.checks[fi] ? '✅' : '—'}</td>`
      ).join('')}</tr>
    `).join('')}</tbody>
  `;
}

// ===== 版本时间线 =====
function renderVersionTimeline() {
  const container = document.getElementById('version-timeline');
  container.innerHTML = VERSION_DATA.map(v => `
    <div class="timeline-item">
      <div class="timeline-date">${v.date}</div>
      <div class="timeline-content">
        <div class="timeline-title">
          <span class="version-badge" style="background:${BRAND_COLORS[v.brand]};display:inline-flex;width:24px;height:24px;font-size:10px;border-radius:4px;vertical-align:middle;margin-right:6px">${v.brand}</span>
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
  container.innerHTML = OTA_DATA.map(o => {
    const coverageNum = parseInt(o.coverage) || 0;
    const statusClass = o.status.includes('全量') ? 'status-done' :
                        o.status.includes('灰度') || o.status.includes('分批') ? 'status-pushing' :
                        o.status.includes('新') ? 'status-new' : 'status-partial';
    return `
      <div class="ota-card">
        <div class="ota-header">
          <div class="ota-brand-info">
            <span class="version-badge" style="background:${BRAND_COLORS[o.brand]}">${o.brand}</span>
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
            <div class="ota-progress-fill" style="width:${coverageNum}%"></div>
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
  container.innerHTML = TEST_DATA.map(t => `
    <div class="test-card">
      <div class="test-header">
        <div class="test-title">${t.title}</div>
        <span class="version-badge" style="background:${BRAND_COLORS[t.brand]};width:30px;height:30px;font-size:12px">${t.brand}</span>
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
        <div class="test-score-item">
          <div class="test-score-value" style="color:var(--accent-blue)">${t.score.city}</div>
          <div class="test-score-label">城区</div>
        </div>
        <div class="test-score-item">
          <div class="test-score-value" style="color:var(--accent-green)">${t.score.highway}</div>
          <div class="test-score-label">高速</div>
        </div>
        <div class="test-score-item">
          <div class="test-score-value" style="color:var(--accent-orange)">${t.score.parking}</div>
          <div class="test-score-label">泊车</div>
        </div>
      </div>
      <div class="test-highlights">${t.highlights}</div>
    </div>
  `).join('');
}

// ===== 术语百科 =====
function renderGlossary() {
  const container = document.getElementById('glossary-list');
  container.innerHTML = GLOSSARY_DATA.map(g => `
    <div class="glossary-item">
      <div class="glossary-term">${g.term}</div>
      <div class="glossary-full">${g.full}</div>
      <div class="glossary-desc">${g.desc}</div>
    </div>
  `).join('');
}

// ===== 法规标准 =====
function renderRegulation() {
  const container = document.getElementById('regulation-list');
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

// ===== 简易图表 =====
function renderCharts() {
  renderRadarChart();
  renderBarChart();
}

function renderRadarChart() {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = (rect.width - 40) * dpr;
  canvas.height = 280 * dpr;
  canvas.style.width = (rect.width - 40) + 'px';
  canvas.style.height = '280px';
  ctx.scale(dpr, dpr);

  const w = rect.width - 40;
  const h = 280;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(cx, cy) - 40;
  const labels = ['城市场景', '高速场景', '泊车场景'];
  const n = labels.length;

  // 画网格
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  for (let level = 2; level <= 10; level += 2) {
    const r = (level / 10) * maxR;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // 画标签
  ctx.fillStyle = '#9898a8';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x = cx + (maxR + 20) * Math.cos(angle);
    const y = cy + (maxR + 20) * Math.sin(angle);
    ctx.fillText(labels[i], x, y + 4);
  }

  // 画数据
  const topSolutions = SCORE_DATA.slice(0, 5);
  topSolutions.forEach((s, idx) => {
    const values = [s.city, s.highway, s.parking];
    ctx.strokeStyle = s.color;
    ctx.fillStyle = s.color + '20';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const v = values[i % n];
      const r = (v / 10) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.fill();
    ctx.stroke();
  });

  // 图例
  ctx.font = '11px sans-serif';
  topSolutions.forEach((s, idx) => {
    const x = 10;
    const y = 14 + idx * 16;
    ctx.fillStyle = s.color;
    ctx.fillRect(x, y - 8, 10, 10);
    ctx.fillStyle = '#9898a8';
    ctx.textAlign = 'left';
    ctx.fillText(s.name, x + 14, y);
  });
}

function renderBarChart() {
  const canvas = document.getElementById('bar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = (rect.width - 40) * dpr;
  canvas.height = 280 * dpr;
  canvas.style.width = (rect.width - 40) + 'px';
  canvas.style.height = '280px';
  ctx.scale(dpr, dpr);

  const w = rect.width - 40;
  const h = 280;
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
  const barHeight = 24;
  const gap = 12;
  const labelWidth = 90;
  const chartWidth = w - labelWidth - 40;
  const startY = 20;

  data.forEach((d, i) => {
    const y = startY + i * (barHeight + gap);
    const barW = (d.count / maxVal) * chartWidth;

    // 标签
    ctx.fillStyle = '#9898a8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(d.name, labelWidth, y + barHeight / 2 + 4);

    // 柱状
    const gradient = ctx.createLinearGradient(labelWidth + 10, 0, labelWidth + 10 + barW, 0);
    gradient.addColorStop(0, d.color + 'cc');
    gradient.addColorStop(1, d.color + '66');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(labelWidth + 10, y, barW, barHeight, 4);
    ctx.fill();

    // 数值
    ctx.fillStyle = d.color;
    ctx.textAlign = 'left';
    ctx.font = '13px sans-serif';
    ctx.fillText(d.count + '次', labelWidth + 14 + barW, y + barHeight / 2 + 4);
  });
}
