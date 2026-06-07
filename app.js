// ==============================
// 智驾研究台 - 应用逻辑 v3
// ==============================

// ===== 本地存储 =====
function loadData(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
  catch { return fallback; }
}
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

let favorites = loadData('zhijia_favorites', []);
let customVersions = loadData('zhijia_custom_versions', []);
let customTests = loadData('zhijia_custom_tests', []);
let customIssues = loadData('zhijia_custom_issues', []);

// 品牌选项
const BRAND_OPTIONS = [
  { key: "H", name: "华为ADS" },
  { key: "X", name: "小鹏XNGP" },
  { key: "T", name: "特斯拉FSD" },
  { key: "L", name: "理想AD Max" },
  { key: "Mi", name: "小米智驾" },
  { key: "HX", name: "地平线HSD" },
  { key: "BYD", name: "比亚迪天神之眼" },
  { key: "BD", name: "百度Apollo" },
  { key: "WR", name: "文远知行WeRide" }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  renderHomePage();
  renderCompareTable();
  renderMatrixTable();
  renderVersionCenter();
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

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

// ===== 导航切换 =====
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => { e.preventDefault(); switchPage(item.dataset.page); });
  });
  document.querySelectorAll('[data-page]').forEach(link => {
    if (!link.classList.contains('nav-item')) {
      link.addEventListener('click', (e) => { e.preventDefault(); switchPage(link.dataset.page); });
    }
  });
  document.querySelectorAll('.tag[data-brand]').forEach(tag => {
    tag.addEventListener('click', () => { switchPage('compare'); highlightBrandRow(tag.dataset.brand); });
  });
}

function switchPage(pageName) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
  if (nav) nav.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${pageName}`);
  if (page) page.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (pageName === 'dataviz') setTimeout(renderCharts, 100);
  if (pageName === 'favorites') renderFavorites();
  if (pageName === 'versions') renderVersionCenter();
  if (pageName === 'test') renderTestList();
  if (pageName === 'collect') renderCollectPage();
  document.getElementById('mobile-menu')?.classList.remove('open');
  document.querySelector('.menu-overlay')?.classList.remove('show');
}

function highlightBrandRow(brand) {
  setTimeout(() => {
    document.querySelectorAll('#compare-table tbody tr').forEach(r => r.style.background = '');
    document.querySelectorAll('#compare-table tbody tr').forEach(r => {
      if (r.querySelector('td')?.textContent.includes(brand)) {
        r.style.background = 'rgba(74,144,217,0.1)';
        r.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, 50);
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.querySelector('.menu-overlay');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => { menu.classList.toggle('open'); overlay?.classList.toggle('show'); });
  overlay?.addEventListener('click', () => { menu.classList.remove('open'); overlay.classList.remove('show'); });
  menu.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', (e) => { e.preventDefault(); switchPage(item.dataset.page); });
  });
}

// ===== 首页渲染 =====
function renderHomePage() {
  renderNews('all');
  renderScores();
  renderHomeVersions();
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
  if (idx >= 0) { favorites.splice(idx, 1); el?.classList.remove('active'); if (el) el.textContent = '☆'; }
  else { favorites.push(id); el?.classList.add('active'); if (el) el.textContent = '★'; }
  saveData('zhijia_favorites', favorites);
}

function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderNews(tab.dataset.filter);
    });
  });
}

function initSearch() {
  const input = document.getElementById('global-search');
  if (!input) return;
  let dt;
  input.addEventListener('input', () => {
    clearTimeout(dt);
    dt = setTimeout(() => {
      const q = input.value.toLowerCase().trim();
      if (!q) { renderNews(document.querySelector('.filter-tab.active')?.dataset.filter || 'all'); return; }
      document.querySelectorAll('.news-card').forEach(c => {
        c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    }, 200);
  });
}

// ===== 评分卡片 =====
function renderScores() {
  const grid = document.getElementById('score-grid');
  if (!grid) return;
  grid.innerHTML = SCORE_DATA.map(s => {
    const avg = ((s.city + s.highway + s.parking) / 3).toFixed(1);
    return `<div class="score-card" onclick="switchPage('compare')" style="cursor:pointer">
      <div class="score-header">
        <span class="score-brand-badge" style="background:${s.color}">${s.brand}</span>
        <div><div class="score-name">${s.name}</div><div class="score-version">${s.version}</div></div>
        <div class="score-avg"><span class="score-avg-value" style="color:${s.color}">${avg}</span><span class="score-avg-label">综合</span></div>
      </div>
      <div class="score-items">
        ${scoreItem('城市场景',s.city,s.color)}${scoreItem('高速场景',s.highway,s.color)}${scoreItem('泊车场景',s.parking,s.color)}
      </div></div>`;
  }).join('');
}
function scoreItem(l,v,c) {
  const p = ((v-5)/5)*100;
  return `<div class="score-item"><span class="score-item-label">${l}</span><div class="score-bar-bg"><div class="score-bar" style="width:${p}%;background:${c}"></div></div><span class="score-item-value" style="color:${c}">${v}</span></div>`;
}

// ===== 首页版本列表（简要） =====
function renderHomeVersions() {
  const list = document.getElementById('version-list');
  if (!list) return;
  const all = [...VERSION_DATA, ...customVersions].sort((a,b) => b.date.localeCompare(a.date));
  list.innerHTML = all.slice(0, 6).map(v => `
    <div class="version-card">
      <span class="version-badge" style="background:${BRAND_COLORS[v.brand] || '#555'}">${v.brand}</span>
      <div class="version-info"><div class="version-name">${v.name} · ${v.version}</div><div class="version-detail">${v.desc}</div></div>
      <span class="version-date">${v.date}</span>
    </div>
  `).join('');
}

// ===== 问题列表 =====
function renderIssues() {
  const list = document.getElementById('issue-list');
  if (!list) return;
  const all = [...ISSUE_DATA, ...customIssues];
  list.innerHTML = all.map(i => `
    <div class="issue-card">
      <span class="issue-badge" style="background:${BRAND_COLORS[i.brand] || '#555'}">${i.brand}</span>
      <span class="issue-level level-${(i.level||'').toLowerCase()}">${i.level}</span>
      <div class="issue-info"><span class="issue-name">${i.name}</span><span class="issue-desc">${i.desc}</span></div>
      <span class="issue-date">${i.date}</span>
    </div>
  `).join('');
}

// ============================================================
// ===== 版本中心 — 品牌分组 =====
// ============================================================
let versionFilter = 'all';

function renderVersionCenter() {
  const tabsEl = document.getElementById('version-brand-tabs');
  const groupsEl = document.getElementById('version-groups');
  const statsEl = document.getElementById('version-stats');
  if (!tabsEl || !groupsEl) return;

  const all = [...VERSION_DATA, ...customVersions].sort((a,b) => b.date.localeCompare(a.date));

  // 计算品牌统计
  const brandCounts = {};
  all.forEach(v => { brandCounts[v.brand] = (brandCounts[v.brand] || 0) + 1; });
  const uniqueBrands = [...new Set(all.map(v => v.brand))];

  // 品牌筛选行
  tabsEl.innerHTML = `<button class="vtab ${versionFilter==='all'?'active':''}" onclick="filterVersionBrand('all')">全部 <span class="vtab-badge">${all.length}</span></button>` +
    uniqueBrands.map(b => {
      const info = BRAND_OPTIONS.find(o => o.key === b) || { name: b };
      return `<button class="vtab ${versionFilter===b?'active':''}" onclick="filterVersionBrand('${b}')">
        <span class="vtab-dot" style="background:${BRAND_COLORS[b]||'#555'}"></span>${info.name} <span class="vtab-badge">${brandCounts[b]}</span>
      </button>`;
    }).join('');

  // 过滤
  const filtered = versionFilter === 'all' ? all : all.filter(v => v.brand === versionFilter);

  // 按品牌分组
  const groups = {};
  filtered.forEach(v => {
    if (!groups[v.brand]) groups[v.brand] = [];
    groups[v.brand].push(v);
  });

  // 渲染分组
  groupsEl.innerHTML = Object.entries(groups).map(([brand, versions]) => {
    const info = BRAND_OPTIONS.find(o => o.key === brand) || { name: brand };
    const color = BRAND_COLORS[brand] || '#555';
    return `
      <div class="version-group">
        <div class="version-group-header">
          <span class="vg-color-bar" style="background:${color}"></span>
          <span class="vg-brand-badge" style="background:${color}">${brand}</span>
          <span class="vg-name">${info.name}</span>
          <span class="vg-count">${versions.length} 个版本</span>
        </div>
        <div class="version-group-list">
          ${versions.map(v => renderVersionDetailCard(v, color)).join('')}
        </div>
      </div>`;
  }).join('');

  // 统计
  if (statsEl) {
    const months = {};
    all.forEach(v => { const m = v.date.slice(0,7); months[m] = (months[m]||0)+1; });
    statsEl.innerHTML = `
      <div class="vstats"><span class="vstats-num">${all.length}</span><span class="vstats-label">总版本数</span></div>
      <div class="vstats"><span class="vstats-num">${uniqueBrands.length}</span><span class="vstats-label">品牌数</span></div>
      <div class="vstats"><span class="vstats-num">${Object.keys(months).length}</span><span class="vstats-label">覆盖月份</span></div>
      <div class="vstats-months">${Object.entries(months).sort((a,b)=>b[0].localeCompare(a[0])).map(([m,c]) =>
        `<span class="vstats-month">${m} <b>${c}</b></span>`).join('')}</div>
    `;
  }
}

function renderVersionDetailCard(v, color) {
  const scopeClass = (v.scope||'').includes('全量') ? 'scope-full' :
                     (v.scope||'').includes('灰度') || (v.scope||'').includes('分批') ? 'scope-gray' :
                     (v.scope||'').includes('内测') ? 'scope-beta' : 'scope-plan';
  const riskClass = (v.riskLevel||'').includes('高') ? 'risk-high' :
                    (v.riskLevel||'').includes('中') ? 'risk-mid' : 'risk-low';
  const features = v.features || [];
  return `
    <div class="vdetail-card">
      <div class="vdetail-top">
        <span class="vdetail-version" style="color:${color}">${v.version}</span>
        <span class="vdetail-scope ${scopeClass}">${v.scope || '未知'}</span>
        <span class="vdetail-risk ${riskClass}">${v.riskLevel || '低'}风险</span>
        <span class="vdetail-date">${v.date}</span>
      </div>
      ${(v.chip || v.arch) ? `<div class="vdetail-meta">
        ${v.chip ? `<span>🔧 ${v.chip}</span>` : ''}
        ${v.arch ? `<span>🏗️ ${v.arch}</span>` : ''}
      </div>` : ''}
      ${features.length ? `<div class="vdetail-features">${features.map(f => `<span class="vdetail-tag">${f}</span>`).join('')}</div>` : ''}
      <div class="vdetail-desc">${v.desc}</div>
    </div>`;
}

function filterVersionBrand(brand) {
  versionFilter = brand;
  renderVersionCenter();
}

// ===== 对比表格 =====
function renderCompareTable() {
  const table = document.getElementById('compare-table');
  if (!table) return;
  const h = COMPARE_DATA.headers;
  const bc = {'华为ADS':'#e53935','小鹏XNGP':'#ff9800','特斯拉FSD':'#1565c0','理想AD Max':'#7b1fa2','小米智驾':'#ff6f00','地平线HSD':'#2e7d32','比亚迪天神之眼':'#00838f','百度Apollo':'#0277bd','文远知行WeRide':'#6a1b9a'};
  table.innerHTML = `<thead><tr>${h.map(th=>`<th>${th}</th>`).join('')}</tr></thead>
    <tbody>${COMPARE_DATA.rows.map(row=>{
      const c=bc[row[0]]||'#555';
      return `<tr>${row.map((cell,i)=>`<td>${i===0?`<span class="cell-brand" style="border-left:3px solid ${c};padding-left:8px"><strong>${cell}</strong></span>`:cell}</td>`).join('')}</tr>`;
    }).join('')}</tbody>`;
}

// ===== 功能矩阵 =====
function renderMatrixTable() {
  const table = document.getElementById('matrix-table');
  if (!table) return;
  const f = MATRIX_DATA.features, s = MATRIX_DATA.solutions;
  table.innerHTML = `<thead><tr><th>功能 \\ 方案</th>${s.map(x=>`<th>${x.name}</th>`).join('')}</tr></thead>
    <tbody>${f.map((fi,di)=>`<tr><td class="matrix-feature"><strong>${fi}</strong></td>${s.map(x=>`<td class="${x.checks[di]?'check-yes':'check-no'}">${x.checks[di]?'✅':'—'}</td>`).join('')}</tr>`).join('')}</tbody>
    <tfoot><tr><td><strong>支持数</strong></td>${s.map(x=>`<td class="matrix-count">${x.checks.filter(Boolean).length}/${x.checks.length}</td>`).join('')}</tr></tfoot>`;
}

// ===== OTA列表 =====
function renderOTAList() {
  const container = document.getElementById('ota-list');
  if (!container) return;
  container.innerHTML = OTA_DATA.map(o => {
    const cn = parseInt(o.coverage)||0;
    const sc = o.status.includes('全量')?'status-done':o.status.includes('灰度')||o.status.includes('分批')?'status-pushing':o.status.includes('新')?'status-new':'status-partial';
    return `<div class="ota-card">
      <div class="ota-header"><div class="ota-brand-info"><span class="version-badge" style="background:${BRAND_COLORS[o.brand]||'#555'}">${o.brand}</span><strong>${o.name}</strong></div>
      <span class="ota-status ${sc}">${o.status}</span></div>
      <div class="ota-version-row"><span><span class="ota-version-label">当前：</span><span class="ota-version-value">${o.currentVersion}</span></span><span><span class="ota-version-label">最新：</span><span class="ota-version-value">${o.latestVersion}</span></span></div>
      <div class="ota-progress"><div class="ota-progress-bar"><div class="ota-progress-fill" style="width:${cn}%;background:linear-gradient(90deg,${BRAND_COLORS[o.brand]||'var(--accent-blue)'},${BRAND_COLORS[o.brand]||'var(--accent-blue)'}88)"></div></div></div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted)"><span>覆盖率：${o.coverage}</span><span>预计：${o.expectedDate}</span></div></div>`;
  }).join('');
}

// ===== 实测列表 =====
function renderTestList() {
  const container = document.getElementById('test-list');
  if (!container) return;
  const allTests = [...TEST_DATA, ...customTests];
  container.innerHTML = allTests.map(t => `
    <div class="test-card">
      <div class="test-header"><div class="test-title">${t.title}</div><span class="version-badge" style="background:${BRAND_COLORS[t.brand]||'#555'};width:30px;height:30px;font-size:12px">${t.brand}</span></div>
      <div class="test-meta"><span>📅 ${t.date}</span><span>📍 ${t.location||''}</span><span>🚗 ${t.vehicle||''}</span>${t.weather?`<span>🌤️ ${t.weather}</span>`:''}${t.mileage?`<span>📏 ${t.mileage}km</span>`:''}</div>
      ${t.scenes?.length ? `<div class="test-scenes">${t.scenes.map(s=>`<span class="test-scene-tag">${s}</span>`).join('')}</div>` : ''}
      <div class="test-scores">
        ${testScore('城区',t.score?.city,'#4a90d9')}${testScore('高速',t.score?.highway,'#3d9970')}${testScore('泊车',t.score?.parking,'#ff9800')}
      </div>
      <div class="test-highlights">${t.highlights||t.desc||''}</div>
    </div>`).join('');
}
function testScore(l,v,c) {
  if (!v) return '';
  const p=((v-5)/5)*100;
  return `<div class="test-score-item"><div class="test-score-value" style="color:${c}">${v}</div><div class="test-score-label">${l}</div><div class="test-score-bar"><div class="test-score-fill" style="width:${p}%;background:${c}"></div></div></div>`;
}

// ===== 术语百科 =====
function renderGlossary() {
  const c = document.getElementById('glossary-list');
  if (!c) return;
  c.innerHTML = `<div class="glossary-search"><input type="text" id="glossary-search-input" placeholder="搜索术语..." oninput="filterGlossary(this.value)" /></div>
    <div class="glossary-grid" id="glossary-grid">${GLOSSARY_DATA.map(g=>`
      <div class="glossary-item" data-term="${g.term.toLowerCase()} ${g.full.toLowerCase()}">
        <div class="glossary-term">${g.term}</div><div class="glossary-full">${g.full}</div><div class="glossary-desc">${g.desc}</div>
      </div>`).join('')}</div>`;
}
function filterGlossary(q) {
  const s = q.toLowerCase().trim();
  document.querySelectorAll('.glossary-item').forEach(i => { i.style.display = !s || i.dataset.term.includes(s) ? '' : 'none'; });
}

// ===== 法规标准 =====
function renderRegulation() {
  const c = document.getElementById('regulation-list');
  if (!c) return;
  c.innerHTML = REGULATION_DATA.map(r => {
    const sc = r.status==='施行中'||r.status==='已实施'?'status-active':r.status==='征求意见'?'status-draft':'status-published';
    return `<div class="regulation-card"><div class="regulation-header"><div class="regulation-title">${r.title}</div><span class="regulation-status ${sc}">${r.status}</span></div>
      <div class="regulation-meta">${r.date} · ${r.org}</div><div class="regulation-desc">${r.desc}</div></div>`;
  }).join('');
}

// ============================================================
// ===== 数据采集 — 完整系统 =====
// ============================================================
let editingRecord = null; // { type, id }
let recordTab = 'ota';

function renderCollectPage() {
  const formArea = document.getElementById('collect-form-area');
  const recordsArea = document.getElementById('collect-records-area');
  const actionsArea = document.getElementById('collect-actions-area');
  if (!formArea) return;

  const brandOpts = BRAND_OPTIONS.map(o => `<option value="${o.key}">${o.name}</option>`).join('');
  const today = new Date().toISOString().slice(0,10);

  formArea.innerHTML = `
    <div class="collect-tabs">
      <button class="collect-tab ${recordTab==='ota'?'active':''}" onclick="switchRecordTab('ota')">📋 OTA录入</button>
      <button class="collect-tab ${recordTab==='test'?'active':''}" onclick="switchRecordTab('test')">🧪 实测录入</button>
      <button class="collect-tab ${recordTab==='issue'?'active':''}" onclick="switchRecordTab('issue')">⚠️ 问题录入</button>
    </div>

    <!-- OTA表单 -->
    <div id="ota-form" class="collect-form ${recordTab==='ota'?'active':''}">
      <input type="hidden" id="ota-edit-id" value="" />
      <div class="form-row"><label>品牌 *</label><select id="f-brand"><option value="">请选择</option>${brandOpts}</select></div>
      <div class="form-row"><label>版本号 *</label><input type="text" id="f-version" placeholder="如 ADS 5.0" /></div>
      <div class="form-row"><label>日期</label><input type="date" id="f-date" value="${today}" /></div>
      <div class="form-row"><label>芯片方案</label><input type="text" id="f-chip" placeholder="如 昇腾610" /></div>
      <div class="form-row"><label>架构</label><input type="text" id="f-arch" placeholder="如 GOD+PDP" /></div>
      <div class="form-row"><label>推送范围</label><select id="f-scope"><option value="全量">全量</option><option value="灰度">灰度</option><option value="内测">内测</option><option value="计划中">计划中</option></select></div>
      <div class="form-row"><label>风险等级</label><select id="f-risk"><option value="低">低</option><option value="中">中</option><option value="高">高</option></select></div>
      <div class="form-row"><label>核心功能（每行一个）</label><textarea id="f-features" rows="3" placeholder="城区L4级自动驾驶&#10;高速L3有条件自动驾驶"></textarea></div>
      <div class="form-row"><label>备注</label><textarea id="f-notes" rows="2" placeholder="补充说明"></textarea></div>
      <div class="form-actions"><button class="btn-primary" onclick="submitOTA()">提交</button><button class="btn-secondary" onclick="resetForm('ota')">重置</button></div>
    </div>

    <!-- 实测表单 -->
    <div id="test-form" class="collect-form ${recordTab==='test'?'active':''}">
      <input type="hidden" id="test-edit-id" value="" />
      <div class="form-row"><label>品牌 *</label><select id="t-brand"><option value="">请选择</option>${brandOpts}</select></div>
      <div class="form-row"><label>版本号 *</label><input type="text" id="t-version" placeholder="测试版本号" /></div>
      <div class="form-row"><label>日期</label><input type="date" id="t-date" value="${today}" /></div>
      <div class="form-row form-row-2"><div><label>地点</label><input type="text" id="t-location" placeholder="如 深圳南山" /></div><div><label>车型</label><input type="text" id="t-vehicle" placeholder="如 问界M9" /></div></div>
      <div class="form-row form-row-2"><div><label>天气</label><select id="t-weather"><option value="晴">晴</option><option value="阴">阴</option><option value="雨">雨</option><option value="雪">雪</option><option value="雾">雾</option></select></div><div><label>测试里程(km)</label><input type="number" id="t-mileage" placeholder="50" min="0" /></div></div>
      <div class="form-row form-row-3"><div><label>城区评分</label><input type="number" id="t-city" min="1" max="10" step="0.1" placeholder="8.5" /></div><div><label>高速评分</label><input type="number" id="t-highway" min="1" max="10" step="0.1" placeholder="9.0" /></div><div><label>泊车评分</label><input type="number" id="t-parking" min="1" max="10" step="0.1" placeholder="8.0" /></div></div>
      <div class="form-row"><label>测试场景（逗号分隔）</label><input type="text" id="t-scenes" placeholder="城区NOA,施工路段,无保护左转" /></div>
      <div class="form-row"><label>测试亮点</label><textarea id="t-highlights" rows="3" placeholder="核心发现"></textarea></div>
      <div class="form-row"><label>发现问题</label><textarea id="t-issues" rows="2" placeholder="发现的缺陷"></textarea></div>
      <div class="form-actions"><button class="btn-primary" onclick="submitTest()">提交</button><button class="btn-secondary" onclick="resetForm('test')">重置</button></div>
    </div>

    <!-- 问题表单 -->
    <div id="issue-form" class="collect-form ${recordTab==='issue'?'active':''}">
      <input type="hidden" id="issue-edit-id" value="" />
      <div class="form-row"><label>品牌 *</label><select id="i-brand"><option value="">请选择</option>${brandOpts}</select></div>
      <div class="form-row"><label>版本号 *</label><input type="text" id="i-version" placeholder="问题所在版本" /></div>
      <div class="form-row"><label>日期</label><input type="date" id="i-date" value="${today}" /></div>
      <div class="form-row form-row-2"><div><label>严重等级</label><select id="i-level"><option value="P0">P0 - 严重</option><option value="P1">P1 - 重要</option><option value="P2">P2 - 一般</option></select></div><div><label>问题分类</label><select id="i-category"><option value="感知">感知</option><option value="决策">决策</option><option value="规划">规划</option><option value="控制">控制</option><option value="其他">其他</option></select></div></div>
      <div class="form-row"><label>问题描述 *</label><textarea id="i-desc" rows="3" placeholder="详细描述问题现象"></textarea></div>
      <div class="form-row"><label>复现步骤</label><textarea id="i-steps" rows="2" placeholder="如何复现此问题"></textarea></div>
      <div class="form-row"><label>出现频率</label><select id="i-freq"><option value="偶发">偶发</option><option value="经常">经常</option><option value="必现">必现</option></select></div>
      <div class="form-actions"><button class="btn-primary" onclick="submitIssue()">提交</button><button class="btn-secondary" onclick="resetForm('issue')">重置</button></div>
    </div>
  `;

  // 已提交记录区
  if (recordsArea) {
    renderRecordsSection(recordsArea);
  }

  // 导出/导入区
  if (actionsArea) {
    renderActionsSection(actionsArea);
  }
}

function switchRecordTab(tab) {
  recordTab = tab;
  document.querySelectorAll('.collect-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.collect-form').forEach(f => f.classList.remove('active'));
  event?.target?.classList.add('active');
  const form = document.getElementById(tab + '-form');
  if (form) form.classList.add('active');
}

function renderRecordsSection(area) {
  const otaN = customVersions.length;
  const testN = customTests.length;
  const issueN = customIssues.length;
  const allRecords = [
    ...customVersions.map(r => ({...r, _type:'ota'})),
    ...customTests.map(r => ({...r, _type:'test'})),
    ...customIssues.map(r => ({...r, _type:'issue'}))
  ].sort((a,b) => (b.date||'').localeCompare(a.date||''));

  area.innerHTML = `
    <h3>已录入记录</h3>
    <div class="collect-stats-row">
      <span class="cstat cstat-ota">📋 OTA <b>${otaN}</b></span>
      <span class="cstat cstat-test">🧪 实测 <b>${testN}</b></span>
      <span class="cstat cstat-issue">⚠️ 问题 <b>${issueN}</b></span>
      <span class="cstat cstat-total">合计 <b>${allRecords.length}</b></span>
    </div>
    ${allRecords.length === 0 ? `<div class="empty-state" style="padding:30px"><span class="empty-icon">📝</span><p>暂无已录入记录</p><p class="empty-hint">填写上方表单后提交</p></div>` :
    `<div class="records-list">${allRecords.map((r, idx) => {
      const typeIcon = r._type === 'ota' ? '📋' : r._type === 'test' ? '🧪' : '⚠️';
      const typeName = r._type === 'ota' ? 'OTA' : r._type === 'test' ? '实测' : '问题';
      const brandInfo = BRAND_OPTIONS.find(o => o.key === r.brand);
      return `<div class="record-item">
        <span class="record-type">${typeIcon} ${typeName}</span>
        <span class="record-brand" style="background:${BRAND_COLORS[r.brand]||'#555'}">${r.brand}</span>
        <span class="record-info">${brandInfo?.name||r.brand} · ${r.version||''}</span>
        <span class="record-date">${r.date||''}</span>
        <span class="record-summary">${(r.desc||r.highlights||'').slice(0,40)}${(r.desc||r.highlights||'').length>40?'...':''}</span>
        <span class="record-actions">
          <button class="btn-icon" onclick="editRecord('${r._type}',${r.id})" title="编辑">✏️</button>
          <button class="btn-icon" onclick="deleteRecord('${r._type}',${r.id})" title="删除">🗑️</button>
        </span>
      </div>`;
    }).join('')}</div>`}
  `;
}

function renderActionsSection(area) {
  area.innerHTML = `
    <div class="collect-actions-row">
      <button class="btn-secondary" onclick="exportJSON()">📥 导出JSON</button>
      <button class="btn-secondary" onclick="exportCSV()">📊 导出CSV</button>
      <label class="btn-secondary" style="cursor:pointer">📤 导入数据<input type="file" accept=".json" onchange="importData(this.files[0])" style="display:none" /></label>
      <button class="btn-danger" onclick="clearAllData()">🗑️ 清空所有</button>
    </div>
  `;
}

// ===== 表单提交 =====
function validateForm(fields) {
  for (const f of fields) {
    const el = document.getElementById(f.id);
    if (!el) continue;
    const val = el.value.trim();
    if (f.required && !val) { showToast(`请填写${f.label}`, 'error'); el.focus(); return false; }
  }
  return true;
}

function submitOTA() {
  if (!validateForm([{id:'f-brand',label:'品牌',required:true},{id:'f-version',label:'版本号',required:true}])) return;
  const editId = document.getElementById('ota-edit-id')?.value;
  const featuresRaw = document.getElementById('f-features')?.value || '';
  const features = featuresRaw.split('\n').map(s=>s.trim()).filter(Boolean);
  const record = {
    id: editId ? parseInt(editId) : Date.now(),
    brand: document.getElementById('f-brand').value,
    name: BRAND_OPTIONS.find(o=>o.key===document.getElementById('f-brand').value)?.name || '',
    version: document.getElementById('f-version').value.trim(),
    date: document.getElementById('f-date').value || new Date().toISOString().slice(0,10),
    chip: document.getElementById('f-chip')?.value.trim() || '',
    arch: document.getElementById('f-arch')?.value.trim() || '',
    features,
    scope: document.getElementById('f-scope')?.value || '灰度',
    riskLevel: document.getElementById('f-risk')?.value || '低',
    desc: document.getElementById('f-notes')?.value.trim() || document.getElementById('f-version').value.trim()
  };
  if (editId) {
    const idx = customVersions.findIndex(r => r.id === parseInt(editId));
    if (idx >= 0) customVersions[idx] = record;
    showToast('✅ OTA记录已更新');
  } else {
    customVersions.push(record);
    showToast('✅ OTA记录已添加');
  }
  saveData('zhijia_custom_versions', customVersions);
  resetForm('ota');
  refreshAfterSubmit();
}

function submitTest() {
  if (!validateForm([{id:'t-brand',label:'品牌',required:true},{id:'t-version',label:'版本号',required:true}])) return;
  const editId = document.getElementById('test-edit-id')?.value;
  const scenesRaw = document.getElementById('t-scenes')?.value || '';
  const scenes = scenesRaw.split(/[,，]/).map(s=>s.trim()).filter(Boolean);
  const brandKey = document.getElementById('t-brand').value;
  const brandName = BRAND_OPTIONS.find(o=>o.key===brandKey)?.name || '';
  const title = `${brandName} ${document.getElementById('t-version').value.trim()} 实测`;
  const record = {
    id: editId ? parseInt(editId) : Date.now(),
    brand: brandKey,
    name: brandName,
    title,
    version: document.getElementById('t-version').value.trim(),
    date: document.getElementById('t-date').value || new Date().toISOString().slice(0,10),
    location: document.getElementById('t-location')?.value.trim() || '',
    vehicle: document.getElementById('t-vehicle')?.value.trim() || '',
    weather: document.getElementById('t-weather')?.value || '',
    mileage: document.getElementById('t-mileage')?.value || '',
    score: {
      city: parseFloat(document.getElementById('t-city')?.value) || 0,
      highway: parseFloat(document.getElementById('t-highway')?.value) || 0,
      parking: parseFloat(document.getElementById('t-parking')?.value) || 0
    },
    scenes,
    highlights: document.getElementById('t-highlights')?.value.trim() || '',
    desc: document.getElementById('t-issues')?.value.trim() || ''
  };
  if (editId) {
    const idx = customTests.findIndex(r => r.id === parseInt(editId));
    if (idx >= 0) customTests[idx] = record;
    showToast('✅ 实测记录已更新');
  } else {
    customTests.push(record);
    showToast('✅ 实测记录已添加');
  }
  saveData('zhijia_custom_tests', customTests);
  resetForm('test');
  refreshAfterSubmit();
}

function submitIssue() {
  if (!validateForm([{id:'i-brand',label:'品牌',required:true},{id:'i-version',label:'版本号',required:true},{id:'i-desc',label:'问题描述',required:true}])) return;
  const editId = document.getElementById('issue-edit-id')?.value;
  const brandKey = document.getElementById('i-brand').value;
  const brandName = BRAND_OPTIONS.find(o=>o.key===brandKey)?.name || '';
  const record = {
    id: editId ? parseInt(editId) : Date.now(),
    brand: brandKey,
    name: brandName,
    version: document.getElementById('i-version').value.trim(),
    date: document.getElementById('i-date').value || new Date().toISOString().slice(0,10),
    level: document.getElementById('i-level')?.value || 'P2',
    category: document.getElementById('i-category')?.value || '其他',
    desc: document.getElementById('i-desc')?.value.trim(),
    steps: document.getElementById('i-steps')?.value.trim() || '',
    frequency: document.getElementById('i-freq')?.value || '偶发'
  };
  if (editId) {
    const idx = customIssues.findIndex(r => r.id === parseInt(editId));
    if (idx >= 0) customIssues[idx] = record;
    showToast('✅ 问题记录已更新');
  } else {
    customIssues.push(record);
    showToast('✅ 问题记录已添加');
  }
  saveData('zhijia_custom_issues', customIssues);
  resetForm('issue');
  refreshAfterSubmit();
}

function resetForm(type) {
  editingRecord = null;
  if (type === 'ota') {
    ['f-brand','f-version','f-chip','f-arch','f-features','f-notes'].forEach(id => { const e=document.getElementById(id); if(e) e.value=''; });
    const d=document.getElementById('f-date'); if(d) d.value=new Date().toISOString().slice(0,10);
    const s=document.getElementById('f-scope'); if(s) s.value='灰度';
    const r=document.getElementById('f-risk'); if(r) r.value='低';
    const eid=document.getElementById('ota-edit-id'); if(eid) eid.value='';
  } else if (type === 'test') {
    ['t-brand','t-version','t-location','t-vehicle','t-mileage','t-city','t-highway','t-parking','t-scenes','t-highlights','t-issues'].forEach(id => { const e=document.getElementById(id); if(e) e.value=''; });
    const d=document.getElementById('t-date'); if(d) d.value=new Date().toISOString().slice(0,10);
    const w=document.getElementById('t-weather'); if(w) w.value='晴';
    const eid=document.getElementById('test-edit-id'); if(eid) eid.value='';
  } else if (type === 'issue') {
    ['i-brand','i-version','i-desc','i-steps'].forEach(id => { const e=document.getElementById(id); if(e) e.value=''; });
    const d=document.getElementById('i-date'); if(d) d.value=new Date().toISOString().slice(0,10);
    const l=document.getElementById('i-level'); if(l) l.value='P2';
    const c=document.getElementById('i-category'); if(c) c.value='其他';
    const f=document.getElementById('i-freq'); if(f) f.value='偶发';
    const eid=document.getElementById('issue-edit-id'); if(eid) eid.value='';
  }
}

function refreshAfterSubmit() {
  renderCollectPage();
}

// ===== 编辑记录 =====
function editRecord(type, id) {
  let arr, record;
  if (type === 'ota') { arr = customVersions; record = arr.find(r=>r.id===id); if(!record) return;
    switchRecordTab('ota');
    setTimeout(() => {
      const set = (k,v) => { const e=document.getElementById(k); if(e) e.value=v||''; };
      set('ota-edit-id', id); set('f-brand', record.brand); set('f-version', record.version);
      set('f-date', record.date); set('f-chip', record.chip); set('f-arch', record.arch);
      set('f-scope', record.scope); set('f-risk', record.riskLevel);
      set('f-features', (record.features||[]).join('\n')); set('f-notes', record.desc);
    }, 50);
  } else if (type === 'test') { arr = customTests; record = arr.find(r=>r.id===id); if(!record) return;
    switchRecordTab('test');
    setTimeout(() => {
      const set = (k,v) => { const e=document.getElementById(k); if(e) e.value=v||''; };
      set('test-edit-id', id); set('t-brand', record.brand); set('t-version', record.version);
      set('t-date', record.date); set('t-location', record.location); set('t-vehicle', record.vehicle);
      set('t-weather', record.weather); set('t-mileage', record.mileage);
      set('t-city', record.score?.city); set('t-highway', record.score?.highway); set('t-parking', record.score?.parking);
      set('t-scenes', (record.scenes||[]).join(',')); set('t-highlights', record.highlights); set('t-issues', record.desc);
    }, 50);
  } else { arr = customIssues; record = arr.find(r=>r.id===id); if(!record) return;
    switchRecordTab('issue');
    setTimeout(() => {
      const set = (k,v) => { const e=document.getElementById(k); if(e) e.value=v||''; };
      set('issue-edit-id', id); set('i-brand', record.brand); set('i-version', record.version);
      set('i-date', record.date); set('i-level', record.level); set('i-category', record.category);
      set('i-desc', record.desc); set('i-steps', record.steps); set('i-freq', record.frequency);
    }, 50);
  }
  showToast('已加载记录到表单，修改后点击提交', 'info');
}

// ===== 删除记录 =====
function deleteRecord(type, id) {
  if (!confirm('确定删除此条记录？')) return;
  if (type === 'ota') { customVersions = customVersions.filter(r=>r.id!==id); saveData('zhijia_custom_versions', customVersions); }
  else if (type === 'test') { customTests = customTests.filter(r=>r.id!==id); saveData('zhijia_custom_tests', customTests); }
  else { customIssues = customIssues.filter(r=>r.id!==id); saveData('zhijia_custom_issues', customIssues); }
  showToast('记录已删除');
  refreshAfterSubmit();
}

// ===== 导出 =====
function exportJSON() {
  const data = { customVersions, customTests, customIssues, exportDate: new Date().toISOString() };
  downloadFile('zhijia-data.json', JSON.stringify(data, null, 2), 'application/json');
  showToast('JSON已导出');
}

function exportCSV() {
  // OTA CSV
  if (customVersions.length) {
    const h = '品牌,名称,版本,日期,芯片,架构,推送范围,风险等级,核心功能,备注\n';
    const rows = customVersions.map(r => `${r.brand},${r.name},${r.version},${r.date},${r.chip||''},${r.arch||''},${r.scope||''},${r.riskLevel||''},"${(r.features||[]).join(';')}","${r.desc||''}"`).join('\n');
    downloadFile('zhijia-ota.csv', '﻿' + h + rows, 'text/csv;charset=utf-8');
  }
  // 问题 CSV
  if (customIssues.length) {
    const h = '品牌,名称,版本,日期,等级,分类,描述,复现步骤,频率\n';
    const rows = customIssues.map(r => `${r.brand},${r.name},${r.version||''},${r.date},${r.level||''},${r.category||''},"${r.desc||''}","${r.steps||''}",${r.frequency||''}`).join('\n');
    downloadFile('zhijia-issues.csv', '﻿' + h + rows, 'text/csv;charset=utf-8');
  }
  if (!customVersions.length && !customIssues.length) showToast('暂无数据可导出', 'error');
  else showToast('CSV已导出');
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

// ===== 导入 =====
function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      let count = 0;
      if (data.customVersions?.length) { customVersions.push(...data.customVersions); saveData('zhijia_custom_versions', customVersions); count += data.customVersions.length; }
      if (data.customTests?.length) { customTests.push(...data.customTests); saveData('zhijia_custom_tests', customTests); count += data.customTests.length; }
      if (data.customIssues?.length) { customIssues.push(...data.customIssues); saveData('zhijia_custom_issues', customIssues); count += data.customIssues.length; }
      showToast(`✅ 已导入 ${count} 条记录`);
      renderCollectPage();
    } catch { showToast('导入失败：文件格式不正确', 'error'); }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (!confirm('确定清空所有已录入的数据？此操作不可恢复！')) return;
  customVersions = []; customTests = []; customIssues = [];
  saveData('zhijia_custom_versions', customVersions);
  saveData('zhijia_custom_tests', customTests);
  saveData('zhijia_custom_issues', customIssues);
  showToast('所有自定义数据已清空');
  renderCollectPage();
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
    <div class="news-card"><div class="news-meta">
      <span class="news-date">${news.date}</span>
      <span class="news-brand" style="background:${BRAND_COLORS[news.brand]||'#555'}">${news.brand}</span>
      <span class="news-brand-name">${news.brandName}</span>
      <span class="news-type type-${news.type}">${news.typeLabel}</span>
      <span class="news-favorite active" onclick="toggleFavorite(${news.id}, this); renderFavorites();" title="取消收藏">★</span>
    </div><div class="news-title">${news.title}</div><div class="news-summary">${news.summary}</div></div>
  `).join('');
}

// ===== Toast =====
function showToast(message, type='success') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div'); t.className = `toast toast-${type}`; t.textContent = message;
  c.appendChild(t); setTimeout(()=>t.classList.add('show'), 10);
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(), 300); }, 3000);
}

// ===== 图表 =====
function renderCharts() { renderRadarChart(); renderBarChart(); renderScoreCompareChart(); }

function renderRadarChart() {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio||1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width - 40, h = 320;
  canvas.width = w*dpr; canvas.height = h*dpr;
  canvas.style.width = w+'px'; canvas.style.height = h+'px';
  ctx.scale(dpr, dpr); ctx.clearRect(0,0,w,h);
  const cx=w/2, cy=h/2, maxR=Math.min(cx,cy)-50;
  const labels=['城市场景','高速场景','泊车场景','综合体验'];
  const n=labels.length;
  for(let level=2;level<=10;level+=2){const r=(level/10)*maxR;ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<=n;i++){const a=(Math.PI*2*i)/n-Math.PI/2;const x=cx+r*Math.cos(a);const y=cy+r*Math.sin(a);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.closePath();ctx.stroke();if(level%2===0){ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='10px sans-serif';ctx.textAlign='left';ctx.fillText(level,cx+4,cy-r+3);}}
  for(let i=0;i<n;i++){const a=(Math.PI*2*i)/n-Math.PI/2;ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+maxR*Math.cos(a),cy+maxR*Math.sin(a));ctx.stroke();const lx=cx+(maxR+24)*Math.cos(a);const ly=cy+(maxR+24)*Math.sin(a);ctx.fillStyle='#9898a8';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(labels[i],lx,ly);}
  const top5=SCORE_DATA.slice(0,5);
  top5.forEach(s=>{const avg=+((s.city+s.highway+s.parking)/3).toFixed(1);const values=[s.city,s.highway,s.parking,avg];ctx.strokeStyle=s.color;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=n;i++){const a=(Math.PI*2*(i%n))/n-Math.PI/2;const r=(values[i%n]/10)*maxR;const x=cx+r*Math.cos(a);const y=cy+r*Math.sin(a);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.closePath();ctx.fillStyle=s.color+'18';ctx.fill();ctx.stroke();for(let i=0;i<n;i++){const a=(Math.PI*2*i)/n-Math.PI/2;const r=(values[i]/10)*maxR;ctx.fillStyle=s.color;ctx.beginPath();ctx.arc(cx+r*Math.cos(a),cy+r*Math.sin(a),3,0,Math.PI*2);ctx.fill();}});
  ctx.font='11px sans-serif';top5.forEach((s,idx)=>{const x=8,y=14+idx*16;ctx.fillStyle=s.color;ctx.fillRect(x,y-6,10,10);ctx.fillStyle='#9898a8';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(s.name,x+14,y);});
}

function renderBarChart() {
  const canvas=document.getElementById('bar-chart');if(!canvas)return;const ctx=canvas.getContext('2d');const dpr=window.devicePixelRatio||1;const rect=canvas.parentElement.getBoundingClientRect();const w=rect.width-40,h=320;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
  const data=[{name:'华为ADS',count:8,color:'#e53935'},{name:'小鹏XNGP',count:6,color:'#ff9800'},{name:'特斯拉FSD',count:5,color:'#1565c0'},{name:'理想AD Max',count:4,color:'#7b1fa2'},{name:'小米智驾',count:3,color:'#ff6f00'},{name:'地平线HSD',count:4,color:'#2e7d32'},{name:'比亚迪',count:2,color:'#00838f'}];
  const maxVal=Math.max(...data.map(d=>d.count));const barH=26,gap=14,labelW=90,chartW=w-labelW-60,startY=10;
  for(let i=0;i<=4;i++){const x=labelW+10+(chartW*i/4);ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,data.length*(barH+gap)+startY);ctx.stroke();ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(Math.round(maxVal*i/4)+'次',x,data.length*(barH+gap)+startY+14);}
  data.forEach((d,i)=>{const y=startY+i*(barH+gap);const barW=(d.count/maxVal)*chartW;ctx.fillStyle='#9898a8';ctx.font='12px sans-serif';ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillText(d.name,labelW,y+barH/2);const g=ctx.createLinearGradient(labelW+10,0,labelW+10+barW,0);g.addColorStop(0,d.color+'dd');g.addColorStop(1,d.color+'66');ctx.fillStyle=g;drawRR(ctx,labelW+10,y,Math.max(barW,2),barH,4);ctx.fill();ctx.fillStyle=d.color;ctx.textAlign='left';ctx.font='12px sans-serif';ctx.fillText(d.count+'次',labelW+14+barW,y+barH/2);});
}

function renderScoreCompareChart() {
  const canvas=document.getElementById('score-compare-chart');if(!canvas)return;const ctx=canvas.getContext('2d');const dpr=window.devicePixelRatio||1;const rect=canvas.parentElement.getBoundingClientRect();const w=rect.width-40,h=320;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
  const dims=['城市场景','高速场景','泊车场景'];const dimW=w/(dims.length+1);const barW=18;const maxVal=10;
  dims.forEach((dim,di)=>{const baseX=dimW*(di+0.5);ctx.fillStyle='#9898a8';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(dim,baseX+(SCORE_DATA.length*barW)/2,h-10);
  SCORE_DATA.forEach((s,si)=>{const x=baseX+si*(barW+2);const val=di===0?s.city:di===1?s.highway:s.parking;const barH2=(val/maxVal)*(h-60);const y=h-30-barH2;ctx.fillStyle=s.color+'cc';drawRR(ctx,x,y,barW,barH2,3);ctx.fill();ctx.fillStyle=s.color;ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText(val,x+barW/2,y-4);});});
  ctx.font='10px sans-serif';SCORE_DATA.forEach((s,idx)=>{const x=8,y=14+idx*14;ctx.fillStyle=s.color;ctx.fillRect(x,y-5,8,8);ctx.fillStyle='#9898a8';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(s.name,x+12,y);});
}

function drawRR(ctx,x,y,w,h,r) { r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath(); }
