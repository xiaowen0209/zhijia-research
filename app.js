// ==========================================
// 智驾研究台 v2
// ==========================================

let currentPage = 'home';
let favs = JSON.parse(localStorage.getItem('z_favs')||'[]');
let customV = JSON.parse(localStorage.getItem('z_cv')||'[]');
let customT = JSON.parse(localStorage.getItem('z_ct')||'[]');
let customI = JSON.parse(localStorage.getItem('z_ci')||'[]');
let recordTab = 'ota';
let vfilter = 'all', gcat = 'all';
let charts = {};

const BRAND_OPTIONS = [
  {key:"H",name:"华为ADS"},{key:"X",name:"小鹏XNGP"},{key:"T",name:"特斯拉FSD"},
  {key:"L",name:"理想AD Max"},{key:"Mi",name:"小米智驾"},{key:"HX",name:"地平线HSD"},
  {key:"BYD",name:"比亚迪天神之眼"},{key:"BD",name:"百度Apollo"},{key:"WR",name:"文远知行WeRide"}
];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tn-item').forEach(el => el.addEventListener('click', e => { e.preventDefault(); switchPage(el.dataset.page); }));
  document.querySelectorAll('.m-menu a').forEach(el => el.addEventListener('click', e => { e.preventDefault(); switchPage(el.dataset.page); toggleMobileMenu(); }));
  switchPage('home');
});

function toggleMobileMenu() {
  document.getElementById('m-menu').classList.toggle('open');
  document.getElementById('m-overlay').classList.toggle('show');
}

function switchPage(p) {
  currentPage = p;
  document.querySelectorAll('.tn-item').forEach(el => el.classList.toggle('active', el.dataset.page === p));
  const mc = document.getElementById('main-content');
  Object.values(charts).forEach(c => { try { c.destroy() } catch {} }); charts = {};

  const pages = {
    home: renderHome, compare: renderCompare, matrix: renderMatrix,
    scenario: renderScenario, versions: renderVersions, ota: renderOTA,
    dataviz: renderDataViz, glossary: renderGlossary,
    collect: renderCollect, favorites: renderFavorites
  };
  mc.innerHTML = '<div class="page active" id="page-'+p+'"></div>';
  if (pages[p]) pages[p]();
  window.scrollTo(0,0);
}

// ===== HOME =====
function renderHome() {
  const el = document.getElementById('page-home');
  if (!el) return;
  const totalV = VERSION_DATA.length + customV.length;
  const totalT = TEST_DATA.length + customT.length;
  const brands = new Set([...VERSION_DATA.map(v=>v.brand), ...SCORE_DATA.map(s=>s.brand)]);
  const top3 = [...SCORE_DATA].sort((a,b) => ((b.city+b.highway+b.parking)/3) - ((a.city+a.highway+a.parking)/3)).slice(0,3);

  el.innerHTML = `
    <div class="hero"><h1>智能驾驶方案评测对比</h1><p>7大主流方案 · 8项场景实测 · 15个版本追踪 · 96条专业术语</p></div>
    <div class="stats-row">
      <div class="stat-box" onclick="switchPage('compare')"><div class="stat-num">7</div><div class="stat-label">监测方案</div></div>
      <div class="stat-box" onclick="switchPage('scenario')"><div class="stat-num">8</div><div class="stat-label">测试场景</div></div>
      <div class="stat-box" onclick="switchPage('versions')"><div class="stat-num">${totalV}</div><div class="stat-label">版本记录</div></div>
      <div class="stat-box" onclick="switchPage('glossary')"><div class="stat-num">95</div><div class="stat-label">专业术语</div></div>
    </div>
    <div class="section"><div class="section-title">排行速览</div>
      <div class="rank-list">${top3.map((s,i) => {
        const avg = ((s.city+s.highway+s.parking)/3).toFixed(1);
        const posColors = ['#f85149','#d2991d','#58a6ff'];
        return `<div class="rank-item" onclick="switchPage('compare')" style="cursor:pointer">
          <div class="rank-pos" style="background:${posColors[i]}">${i+1}</div>
          <div class="rank-info"><div class="rank-name">${s.name}</div><div style="font-size:12px;color:var(--tx3)">${s.version}</div></div>
          <div class="rank-avg" style="color:${s.color}">${avg}</div>
        </div>`;
      }).join('')}</div>
    </div>
    <div class="section"><div class="section-title">最新动态</div>
      <div class="news-feed">${NEWS_DATA.slice(0,6).map(n => `
        <div class="news-item">
          <div class="news-meta"><span>${n.date}</span><span>${n.brandName}</span><span class="news-tag nt-${n.type}">${n.typeLabel}</span></div>
          <div style="font-weight:600;font-size:14px">${n.title}</div>
        </div>`).join('')}</div>
    </div>`;
}

// ===== COMPARE =====
function renderCompare() {
  const el = document.getElementById('page-compare');
  if (!el) return;
  // Build PK selector + comparison
  const brands = SCORE_DATA;
  const selected = (new URLSearchParams(location.search).get('pk')||'').split(',').filter(Boolean);
  const pkBrands = selected.length >= 2 ? brands.filter(b => selected.includes(b.brand)) : brands.slice(0,5);

  el.innerHTML = `
    <h1 style="font-size:24px;font-weight:800;margin-bottom:6px">方案对比</h1>
    <p style="color:var(--tx2);margin-bottom:20px">选择品牌进行多维度对比</p>
    <div class="compare-toolbar" id="pk-toolbar">
      ${brands.map(b => `<button class="pk-chip${selected.includes(b.brand)?' selected':''}" onclick="togglePK('${b.brand}')">${b.name}</button>`).join('')}
      <button class="pk-action" onclick="applyPK()">开始对比</button>
    </div>
    <div class="compare-grid" id="compare-content">
      <div class="chart-box"><h3>综合雷达图</h3><canvas id="chart-radar"></canvas></div>
      <div class="chart-box"><h3>场景评分对比</h3><canvas id="chart-bar"></canvas></div>
    </div>
    <div style="margin-top:20px">
      <table class="scenario-table" style="width:100%"><thead><tr><th>方案</th><th>版本</th><th>芯片</th><th>城区</th><th>高速</th><th>泊车</th><th>综合</th></tr></thead>
        <tbody>${pkBrands.map(b => `<tr><td style="font-weight:600;text-align:left">${b.name}</td><td>${b.version}</td><td>${(VERSION_DATA.find(v=>v.brand===b.brand)||{}).chip||'—'}</td><td style="color:${b.city>=9?'var(--green)':b.city>=8?'var(--orange)':'var(--red)'}">${b.city}</td><td style="color:${b.highway>=9?'var(--green)':b.highway>=8?'var(--orange)':'var(--red)'}">${b.highway}</td><td style="color:${b.parking>=8.5?'var(--green)':b.parking>=7.5?'var(--orange)':'var(--red)'}">${b.parking}</td><td style="font-weight:700">${((b.city+b.highway+b.parking)/3).toFixed(1)}</td></tr>`).join('')}</tbody>
      </table>
    </div>`;

  // Chart.js
  setTimeout(() => {
    if(typeof Chart==='undefined') return;
    const clr = ['#f85149','#d2991d','#58a6ff','#a371f7','#3fb950','#39d353','#8b949e'];
    charts.radar = new Chart(document.getElementById('chart-radar'), {
      type:'radar',data:{labels:['城市场景','高速场景','泊车场景','综合体验'],datasets:pkBrands.map((b,i)=>({label:b.name,data:[b.city,b.highway,b.parking,+((b.city+b.highway+b.parking)/3).toFixed(1)],borderColor:clr[i],backgroundColor:clr[i]+'18',borderWidth:2}))},
      options:{responsive:true,scales:{r:{min:7,max:10,ticks:{stepSize:1,color:'#8b949e',backdropColor:'transparent'},grid:{color:'#30363d'},pointLabels:{color:'#e6edf3',font:{size:11}}}},plugins:{legend:{labels:{color:'#8b949e',font:{size:11}}}}}
    });
    charts.bar = new Chart(document.getElementById('chart-bar'), {
      type:'bar',data:{labels:pkBrands.map(b=>b.name),datasets:[{label:'城市场景',data:pkBrands.map(b=>b.city),backgroundColor:'#58a6ff99'},{label:'高速场景',data:pkBrands.map(b=>b.highway),backgroundColor:'#3fb95099'},{label:'泊车场景',data:pkBrands.map(b=>b.parking),backgroundColor:'#d2991d99'}]},
      options:{responsive:true,scales:{y:{min:7,max:10,grid:{color:'#30363d'},ticks:{color:'#8b949e'}},x:{ticks:{color:'#8b949e'}}},plugins:{legend:{labels:{color:'#8b949e'}}}}
    });
  }, 100);
}

let pkSelected = [];
function togglePK(brand) {
  const i = pkSelected.indexOf(brand);
  if(i>=0) pkSelected.splice(i,1); else pkSelected.push(brand);
  document.querySelectorAll('.pk-chip').forEach(el => el.classList.toggle('selected', pkSelected.includes(el.textContent.trim().slice(0,2)) || pkSelected.some(b => SCORE_DATA.find(s=>s.brand===b)?.name === el.textContent.trim())));
}
function applyPK() {
  if(pkSelected.length<2){showToast('请至少选择2个方案','err');return}
  history.replaceState(null,'','?pk='+pkSelected.join(','));
  switchPage('compare');
}

// ===== SCENARIO =====
function renderScenario() {
  const el = document.getElementById('page-scenario');
  if (!el) return;
  const scenes = SCENARIO_DATA;
  const results = SCENARIO_RESULTS;
  const brands = SCORE_DATA;

  el.innerHTML = `
    <h1 style="font-size:24px;font-weight:800;margin-bottom:6px">场景实测</h1>
    <p style="color:var(--tx2);margin-bottom:20px">参考懂车帝《懂车智炼场》测试方法论 · 8项场景化测试</p>
    <div style="overflow-x:auto;margin-bottom:32px">
      <table class="scenario-table">
        <thead><tr><th>测试场景</th>${brands.map(b=>`<th><div class="bc-badge" style="background:${b.color};width:24px;height:24px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;color:#fff;border-radius:4px;margin:0 auto">${b.brand}</div></th>`).join('')}</tr></thead>
        <tbody>
          ${scenes.map(sc => {
            const ctag = sc.cat==='高速'?'scat-highway':'scat-urban';
            return `<tr><td><span class="scat-tag ${ctag}">${sc.cat}</span> ${sc.name}</td>
              ${brands.map(b => {
                const r = results.find(r=>r.brand===b.brand);
                const v = r?.scores[sc.name] || 0;
                const cls = v>=9?'s-hot':v>=8?'s-warm':'s-cold';
                return `<td class="${cls}">${v||'—'}</td>`;
              }).join('')}</tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="section"><div class="section-title">场景说明</div>
      <div class="glossary-grid">${scenes.map(s=>`<div class="glossary-item"><div class="gterm"><span class="scat-tag ${s.cat==='高速'?'scat-highway':'scat-urban'}">${s.cat}</span> ${s.name}</div><div class="gdesc">${s.desc}</div></div>`).join('')}</div>
    </div>`;
}

// ===== VERSIONS =====
function renderVersions() {
  const el = document.getElementById('page-versions');
  if (!el) return;
  const all = [...VERSION_DATA, ...customV].sort((a,b)=>b.date.localeCompare(a.date));
  const brands = [...new Set(all.map(v=>v.brand))];
  const filtered = vfilter==='all'?all:all.filter(v=>v.brand===vfilter);

  el.innerHTML = `
    <h1 style="font-size:24px;font-weight:800;margin-bottom:6px">版本中心</h1>
    <p style="color:var(--tx2);margin-bottom:20px">各品牌OTA版本更新记录 · 按品牌筛选</p>
    <div class="vfilter">
      <button class="vchip${vfilter==='all'?' active':''}" onclick="setVFilter('all')">全部 (${all.length})</button>
      ${brands.map(b=>`<button class="vchip${vfilter===b?' active':''}" onclick="setVFilter('${b}')">${BRAND_OPTIONS.find(o=>o.key===b)?.name||b}</button>`).join('')}
    </div>
    <div>${filtered.map(v=>`
      <div class="vdetail">
        <div class="vd-top">
          <span class="bc-badge" style="background:${BRAND_COLORS[v.brand]};width:24px;height:24px;font-size:10px">${v.brand}</span>
          <span class="vd-ver" style="color:${BRAND_COLORS[v.brand]}">${v.version}</span>
          <span class="vd-scope vs-${(v.scope||'').includes('全量')?'full':(v.scope||'').includes('灰度')||(v.scope||'').includes('分批')?'gray':'plan'}">${v.scope}</span>
          <span class="vd-risk vr-${(v.riskLevel||'').includes('高')?'high':(v.riskLevel||'').includes('中')?'mid':'low'}">${v.riskLevel}风险</span>
          <span style="margin-left:auto;font-size:12px;color:var(--tx3)">${v.date}</span>
        </div>
        ${v.chip?`<div class="vd-meta">芯片: ${v.chip} · 架构: ${v.arch||''}</div>`:''}
        ${(v.features||[]).length?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">${v.features.map(f=>`<span style="padding:2px 8px;border-radius:4px;font-size:11px;background:rgba(255,255,255,.04);color:var(--tx2);border:1px solid var(--border)">${f}</span>`).join('')}</div>`:''}
        <div style="font-size:13px;color:var(--tx2)">${v.desc}</div>
      </div>`).join('')}</div>`;
}
function setVFilter(f) { vfilter = f; renderVersions(); }

// ===== GLOSSARY =====
function renderGlossary() {
  const el = document.getElementById('page-glossary');
  if (!el) return;
  const cats = [...new Set(GLOSSARY_DATA.map(g=>g.cat).filter(Boolean))].sort();
  const filtered = gcat==='all'?GLOSSARY_DATA:GLOSSARY_DATA.filter(g=>g.cat===gcat);
  const counts = {}; GLOSSARY_DATA.forEach(g=>{counts[g.cat]=(counts[g.cat]||0)+1});

  el.innerHTML = `
    <h1 style="font-size:24px;font-weight:800;margin-bottom:6px">术语百科</h1>
    <p style="color:var(--tx2);margin-bottom:20px">${GLOSSARY_DATA.length}条智能驾驶专业术语 · 18类分类筛选</p>
    <div class="glossary-search"><input type="text" placeholder="搜索术语..." oninput="filterGlossary(this.value)"/></div>
    <div class="glossary-cats">
      <button class="gcat${gcat==='all'?' active':''}" onclick="setGCat('all')">全部</button>
      ${cats.map(c=>`<button class="gcat${gcat===c?' active':''}" onclick="setGCat('${c}')">${c} <span style="font-size:10px;opacity:.6">${counts[c]}</span></button>`).join('')}
    </div>
    <div class="glossary-grid" id="glossary-grid">${filtered.map(g=>`
      <div class="glossary-item" data-term="${g.term.toLowerCase()} ${g.full.toLowerCase()}">
        <div class="gterm"><span class="gcat-tag">${g.cat||''}</span>${g.term}</div>
        <div class="gfull">${g.full}</div>
        <div class="gdesc">${g.desc}</div>
      </div>`).join('')}</div>`;
}
function setGCat(c) { gcat = c; renderGlossary(); }
function filterGlossary(q) {
  const s = q.toLowerCase().trim();
  document.querySelectorAll('.glossary-item').forEach(el => { el.style.display = !s||el.dataset.term.includes(s) ? '' : 'none'; });
}

// ===== MATRIX =====
function renderMatrix() {
  const el = document.getElementById('page-matrix');
  if (!el) return;
  const f = MATRIX_DATA.features, s = MATRIX_DATA.solutions;
  el.innerHTML = `<h1 style="font-size:24px;font-weight:800;margin-bottom:6px">功能矩阵</h1><p style="color:var(--tx2);margin-bottom:20px">各方案功能支持情况一览</p>
    <div style="overflow-x:auto"><table class="scenario-table" style="min-width:700px"><thead><tr><th>功能</th>${s.map(x=>`<th>${x.name}</th>`).join('')}</tr></thead>
    <tbody>${f.map((fi,di)=>`<tr><td style="text-align:left;font-weight:600">${fi}</td>${s.map(x=>`<td class="${x.checks[di]?'s-hot':''}">${x.checks[di]?'✓':'—'}</td>`).join('')}</tr>`).join('')}</tbody>
    <tfoot><tr><td style="text-align:left;font-weight:700">支持数</td>${s.map(x=>`<td style="font-weight:700;color:var(--blue)">${x.checks.filter(Boolean).length}/${x.checks.length}</td>`).join('')}</tr></tfoot></table></div>`;
}

// ===== OTA =====
function renderOTA() {
  const el = document.getElementById('page-ota');
  if (!el) return;
  el.innerHTML = `<h1 style="font-size:24px;font-weight:800;margin-bottom:6px">OTA追踪</h1><p style="color:var(--tx2);margin-bottom:20px">实时追踪各品牌OTA推送进度</p>
    <div style="display:flex;flex-direction:column;gap:12px">${OTA_DATA.map(o=>{
      const cn = parseInt(o.coverage)||0;
      const sc = o.status.includes('全量')?'s-hot':o.status.includes('灰度')||o.status.includes('分批')?'status-pushing':'status-plan';
      return `<div class="vdetail"><div class="vd-top">
        <span class="bc-badge" style="background:${BRAND_COLORS[o.brand]};width:24px;height:24px;font-size:10px">${o.brand}</span>
        <strong>${o.name}</strong><span style="font-size:12px;color:var(--tx2)">${o.currentVersion} → ${o.latestVersion}</span>
        <span class="vd-scope vs-${sc==='s-hot'?'full':'plan'}">${o.status}</span><span style="margin-left:auto;font-size:12px;color:var(--tx3)">${o.expectedDate}</span></div>
        <div style="height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin-top:8px"><div style="height:100%;border-radius:3px;width:${cn}%;background:linear-gradient(90deg,${BRAND_COLORS[o.brand]},${BRAND_COLORS[o.brand]}88)"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--tx3);margin-top:4px"><span>覆盖率: ${o.coverage}</span></div></div>`}).join('')}</div>`;
}

// ===== DATA VIZ =====
function renderDataViz() {
  const el = document.getElementById('page-dataviz');
  if (!el) return;
  el.innerHTML = `<h1 style="font-size:24px;font-weight:800;margin-bottom:6px">数据可视化</h1><p style="color:var(--tx2);margin-bottom:20px">智能驾驶行业数据图表分析</p>
    <div class="compare-grid"><div class="chart-box"><h3>方案综合评分雷达图</h3><canvas id="dv-radar"></canvas></div><div class="chart-box"><h3>场景评分对比</h3><canvas id="dv-bar"></canvas></div><div class="chart-box" style="grid-column:1/-1"><h3>OTA更新频率</h3><canvas id="dv-hbar"></canvas></div></div>`;
  setTimeout(()=>{
    if(typeof Chart==='undefined') return;
    const clr = ['#f85149','#d2991d','#58a6ff','#a371f7','#3fb950','#39d353','#8b949e'];
    const brands = SCORE_DATA;
    const rEl=document.getElementById('dv-radar'), bEl=document.getElementById('dv-bar'), hEl=document.getElementById('dv-hbar');
    if(!rEl||!bEl||!hEl) return;
    charts.r1=new Chart(rEl,{type:'radar',data:{labels:['城市场景','高速场景','泊车场景','综合体验'],datasets:brands.map((b,i)=>({label:b.name,data:[b.city,b.highway,b.parking,+((b.city+b.highway+b.parking)/3).toFixed(1)],borderColor:clr[i],backgroundColor:clr[i]+'18',borderWidth:2}))},options:{responsive:true,scales:{r:{min:7,max:10,ticks:{stepSize:1,color:'#8b949e',backdropColor:'transparent'},grid:{color:'#30363d'},pointLabels:{color:'#e6edf3',font:{size:11}}}},plugins:{legend:{labels:{color:'#8b949e',font:{size:11}}}}}});
    charts.b1=new Chart(bEl,{type:'bar',data:{labels:brands.map(b=>b.name),datasets:[{label:'城市场景',data:brands.map(b=>b.city),backgroundColor:'#58a6ff99'},{label:'高速场景',data:brands.map(b=>b.highway),backgroundColor:'#3fb95099'},{label:'泊车场景',data:brands.map(b=>b.parking),backgroundColor:'#d2991d99'}]},options:{responsive:true,scales:{y:{min:6,max:10,grid:{color:'#30363d'},ticks:{color:'#8b949e'}},x:{ticks:{color:'#8b949e'}}},plugins:{legend:{labels:{color:'#8b949e'}}}}});
    charts.h1=new Chart(hEl,{type:'bar',data:{labels:brands.map(b=>b.name),datasets:[{label:'OTA更新次数',data:[8,6,5,4,3,4,2],backgroundColor:clr.map(c=>c+'99'),borderColor:clr,borderWidth:1,borderRadius:4}]},options:{responsive:true,indexAxis:'y',scales:{x:{grid:{color:'#30363d'},ticks:{color:'#8b949e'}},y:{ticks:{color:'#8b949e'}}},plugins:{legend:{display:false}}}});
  },100);
}

// ===== FAVORITES =====
function renderFavorites() {
  const el = document.getElementById('page-favorites');
  if (!el) return;
  const favNews = NEWS_DATA.filter(n => favs.includes(n.id));
  el.innerHTML = `<h1 style="font-size:24px;font-weight:800;margin-bottom:6px">我的收藏</h1><p style="color:var(--tx2);margin-bottom:20px">收藏的动态内容</p>` +
    (favNews.length === 0 ? `<div style="text-align:center;padding:60px;color:var(--tx3)">暂无收藏</div>` :
    `<div class="news-feed">${favNews.map(n => `<div class="news-item" style="display:flex;justify-content:space-between;align-items:center"><div><div class="news-meta"><span>${n.date}</span><span class="news-tag nt-${n.type}">${n.typeLabel}</span></div><div style="font-weight:600">${n.title}</div></div><button class="btn btn-sm btn-s" onclick="favs=favs.filter(id=>id!==${n.id});localStorage.setItem('z_favs',JSON.stringify(favs));renderFavorites()">取消</button></div>`).join('')}</div>`);
}
function renderCollect() {
  const el = document.getElementById('page-collect');
  if (!el) return;
  const brandOpts = BRAND_OPTIONS.map(o=>`<option value="${o.key}">${o.name}</option>`).join('');
  const today = new Date().toISOString().slice(0,10);
  const tabs = {ota:'OTA录入',test:'实测录入',issue:'问题录入'};

  el.innerHTML = `
    <h1 style="font-size:24px;font-weight:800;margin-bottom:6px">数据采集</h1>
    <p style="color:var(--tx2);margin-bottom:20px">手动录入 + 文本导入</p>
    <div style="display:flex;gap:8px;margin-bottom:16px">
      ${Object.entries(tabs).map(([k,v])=>`<button class="btn${recordTab===k?' btn-p':' btn-s'}" onclick="recordTab='${k}';renderCollect()">${v}</button>`).join('')}
      <button class="btn${recordTab==='import'?' btn-p':' btn-s'}" onclick="recordTab='import';renderCollect()">文本导入</button>
      <button class="btn${recordTab==='scrape'?' btn-p':' btn-s'}" onclick="recordTab='scrape';renderCollect()">爬虫抓取</button>
    </div>` +
    (recordTab==='scrape' ? `
    <div class="collect-form">
      <p style="color:var(--tx2);font-size:13px;margin-bottom:12px">启动本地爬虫服务器后，输入关键词自动搜索并抓取智能驾驶相关文章。爬虫通过 Bing 搜索 + 智驾关键词过滤，返回结构化数据。</p>
      <p style="color:var(--tx2);font-size:12px;margin-bottom:8px;background:rgba(88,166,255,0.08);padding:8px 12px;border-radius:6px">启动方法：终端运行 <code style="background:var(--bg);padding:2px 6px;border-radius:3px">node scraper.js</code></p>
      <div class="form-row"><label>关键词</label><input type="text" id="scrape-kw" placeholder="如: 华为ADS OTA"/></div>
      <div class="form-row"><label>数量</label><input type="number" id="scrape-n" value="10" min="1" max="30"/></div>
      <button class="btn btn-p" onclick="runScrape()">开始抓取</button>
      <div id="scrape-status" style="margin-top:8px;font-size:13px;color:var(--tx2)"></div>
      <div id="scrape-results" style="margin-top:12px"></div>
    </div>` : recordTab==='import' ? `
    <div class="collect-form">
      <p style="color:var(--tx2);font-size:13px;margin-bottom:12px">在 36氪、懂车帝、汽车之家、知乎 等网站复制智能驾驶相关文章内容，粘贴到下方即可自动提取品牌、版本、日期等信息</p>
      <div class="form-row"><textarea id="import-text" rows="12" placeholder="粘贴网页文章内容..."></textarea></div>
      <button class="btn btn-p" onclick="parseImport()">解析并导入</button>
      <div id="import-results" style="margin-top:16px"></div>
    </div>` : `
    <div class="collect-form">
      ${recordTab==='ota'?`
        <div class="form-row"><label>品牌 *</label><select id="f-brand">${brandOpts}</select></div>
        <div class="form-row"><label>版本号 *</label><input type="text" id="f-version" placeholder="如 ADS 5.0"/></div>
        <div class="form-row"><label>日期</label><input type="date" id="f-date" value="${today}"/></div>
        <div class="form-row"><label>芯片方案</label><input type="text" id="f-chip" placeholder="如 昇腾610"/></div>
        <div class="form-row"><label>架构</label><input type="text" id="f-arch" placeholder="如 GOD+PDP"/></div>
        <div class="form-row"><label>推送范围</label><select id="f-scope"><option>全量</option><option>灰度</option><option>内测</option><option>计划中</option></select></div>
        <div class="form-row"><label>核心功能（每行一个）</label><textarea id="f-features" rows="3"></textarea></div>
        <div class="form-row"><label>备注</label><textarea id="f-notes" rows="2"></textarea></div>
      `:recordTab==='test'?`
        <div class="form-row"><label>品牌 *</label><select id="t-brand">${brandOpts}</select></div>
        <div class="form-row"><label>测试标题 *</label><input type="text" id="t-title" placeholder="如 华为ADS 5.0 城区实测"/></div>
        <div class="form-row"><label>日期</label><input type="date" id="t-date" value="${today}"/></div>
        <div class="form-row form-row-2"><div><label>地点</label><input type="text" id="t-location"/></div><div><label>车型</label><input type="text" id="t-vehicle"/></div></div>
        <div class="form-row form-row-2"><div><label>城区评分</label><input type="number" id="t-city" min="1" max="10" step="0.1"/></div><div><label>高速评分</label><input type="number" id="t-highway" min="1" max="10" step="0.1"/></div><div><label>泊车评分</label><input type="number" id="t-parking" min="1" max="10" step="0.1"/></div></div>
        <div class="form-row"><label>测试场景（逗号分隔）</label><input type="text" id="t-scenes" placeholder="城区NOA,施工路段,无保护左转"/></div>
        <div class="form-row"><label>测试亮点</label><textarea id="t-highlights" rows="3"></textarea></div>
      `:`
        <div class="form-row"><label>品牌 *</label><select id="i-brand">${brandOpts}</select></div>
        <div class="form-row"><label>问题描述 *</label><textarea id="i-desc" rows="3" placeholder="详细描述问题现象"></textarea></div>
        <div class="form-row form-row-2"><div><label>严重等级</label><select id="i-level"><option>P0</option><option>P1</option><option>P2</option></select></div><div><label>问题分类</label><select id="i-cat"><option>感知</option><option>决策</option><option>规划</option><option>控制</option><option>其他</option></select></div></div>
        <div class="form-row"><label>日期</label><input type="date" id="i-date" value="${today}"/></div>
      `}
      <button class="btn btn-p" onclick="submitForm()" style="margin-top:8px">提交</button>
    </div>`);
}

function submitForm() {
  if(recordTab==='ota'){
    const v = document.getElementById('f-version')?.value.trim();
    if(!v){showToast('请填写版本号','err');return}
    customV.push({id:Date.now(),brand:document.getElementById('f-brand').value,name:BRAND_OPTIONS.find(o=>o.key===document.getElementById('f-brand').value)?.name||'',version:v,date:document.getElementById('f-date').value,chip:document.getElementById('f-chip')?.value||'',arch:document.getElementById('f-arch')?.value||'',scope:document.getElementById('f-scope').value,riskLevel:'低',features:(document.getElementById('f-features')?.value||'').split('\n').filter(Boolean),desc:document.getElementById('f-notes')?.value||v});
  } else if(recordTab==='test'){
    const ti = document.getElementById('t-title')?.value.trim();
    if(!ti){showToast('请填写标题','err');return}
    customT.push({id:Date.now(),brand:document.getElementById('t-brand').value,title:ti,date:document.getElementById('t-date').value,location:document.getElementById('t-location')?.value||'',vehicle:document.getElementById('t-vehicle')?.value||'',score:{city:parseFloat(document.getElementById('t-city')?.value)||0,highway:parseFloat(document.getElementById('t-highway')?.value)||0,parking:parseFloat(document.getElementById('t-parking')?.value)||0},scenes:(document.getElementById('t-scenes')?.value||'').split(/[,，]/).filter(Boolean),highlights:document.getElementById('t-highlights')?.value||''});
  } else {
    const d = document.getElementById('i-desc')?.value.trim();
    if(!d){showToast('请填写问题描述','err');return}
    customI.push({id:Date.now(),brand:document.getElementById('i-brand').value,level:document.getElementById('i-level').value,category:document.getElementById('i-cat')?.value||'其他',desc:d,date:document.getElementById('i-date').value});
  }
  saveAll(); showToast('已保存'); renderCollect();
}

function parseImport() {
  const text = document.getElementById('import-text')?.value.trim();
  if(!text){showToast('请粘贴内容','err');return}
  const results = [], lines = text.split('\n').filter(Boolean);
  let brand=null; for(const[k,r] of Object.entries({H:/华为|ADS|问界|鸿蒙/,X:/小鹏|XNGP/,T:/特斯拉|FSD|Model/,L:/理想|AD Max|L7|L6/,Mi:/小米|SU7|Pilot/,HX:/地平线|HSD|征程/,BYD:/比亚迪|BYD|天神之眼/})){if(r.test(text)){brand=k;break}}
  let type='news'; if(/OTA|版本|推送|升级/.test(text)) type='ota'; if(/实测|测评|试驾|体验/.test(text)) type='test'; if(/问题|故障|投诉/.test(text)) type='issue';
  const dm = text.match(/(\d{4}[-/年]\d{1,2}[-/月]\d{1,2})/);
  const date = dm ? dm[1].replace(/[年/]/g,'-').replace(/月/,'-').replace(/日/,'') : new Date().toISOString().slice(0,10);
  const vm = text.match(/([A-Z][A-Za-z]*\s*\d+\.?\d*)/);
  const title = lines[0]?.slice(0,60)||'';
  results.push({id:Date.now(),source:'网页',type,brand:brand||'',version:vm?vm[1].trim():'',date,title,content:text.slice(0,200),parsed:{brand}});
  document.getElementById('import-results').innerHTML = results.map((r,i)=>`<div class="glossary-item" style="display:flex;justify-content:space-between;align-items:center"><div><strong>${r.title}</strong><div style="font-size:12px;color:var(--tx2)">${r.brand||'?'} · ${r.type}  · ${r.date}</div></div><button class="btn btn-sm btn-p" onclick="doImport(${i})">导入</button></div>`).join('');
  window._importData = results;
}

function doImport(i) {
  const r = window._importData?.[i]; if(!r) return;
  if(r.type==='ota')customV.push({id:Date.now(),brand:r.brand,name:BRAND_OPTIONS.find(o=>o.key===r.brand)?.name||r.brand,version:r.version,date:r.date,chip:'',arch:'',scope:'灰度',riskLevel:'低',features:[r.content.slice(0,100)],desc:r.content});
  else if(r.type==='test')customT.push({id:Date.now(),brand:r.brand,title:r.title,date:r.date,location:'',vehicle:'',score:{city:0,highway:0,parking:0},scenes:[],highlights:r.content});
  else customI.push({id:Date.now(),brand:r.brand,level:'P2',category:'其他',desc:r.content,date:r.date});
  saveAll(); showToast('已导入'); document.getElementById('import-results').innerHTML='';
}

function saveAll() {
  localStorage.setItem('z_cv',JSON.stringify(customV));
  localStorage.setItem('z_ct',JSON.stringify(customT));
  localStorage.setItem('z_ci',JSON.stringify(customI));
}
async function runScrape() {
  const kw = document.getElementById('scrape-kw')?.value.trim();
  if (!kw) { showToast('请输入关键词', 'err'); return; }
  const n = parseInt(document.getElementById('scrape-n')?.value) || 10;
  const statusEl = document.getElementById('scrape-status'), resultsEl = document.getElementById('scrape-results');
  statusEl.innerHTML = '抓取中...'; resultsEl.innerHTML = '';

  try {
    const resp = await fetch('http://localhost:3456/api/scrape', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: kw, limit: n })
    });
    const data = await resp.json();
    if (!data.success) { statusEl.innerHTML = '失败: ' + (data.error || '未知'); return; }
    statusEl.innerHTML = `找到 ${data.results.length} 条结果`;
    resultsEl.innerHTML = data.results.map(r => `
      <div class="vdetail" style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="flex:1">
          <div style="font-weight:600;font-size:14px;margin-bottom:4px">${r.title}</div>
          <div style="font-size:12px;color:var(--tx3)">[${r.source}] ${r.type} · ${r.date} · ${r.url.slice(0,50)}</div>
          <div style="font-size:12px;color:var(--tx2);margin-top:4px">${r.content.slice(0,150)}</div>
        </div>
        <button class="btn btn-sm btn-p" onclick="importScrape(${JSON.stringify(r).replace(/"/g,'&quot;')})" style="flex-shrink:0;margin-left:12px">导入</button>
      </div>`).join('');
  } catch (e) {
    statusEl.innerHTML = '连接失败: 请先启动爬虫服务器 (node scraper.js)';
  }
}

function importScrape(r) {
  if (r.type === 'ota') customV.push({ id: Date.now(), brand: r.parsed?.brand || '', name: BRAND_OPTIONS.find(o => o.key === (r.parsed?.brand || ''))?.name || '', version: '', date: r.date || new Date().toISOString().slice(0, 10), chip: '', arch: '', scope: '灰度', riskLevel: '低', features: [], desc: r.title + '\n' + r.content });
  else if (r.type === 'test') customT.push({ id: Date.now(), brand: r.parsed?.brand || '', title: r.title, date: r.date || new Date().toISOString().slice(0, 10), location: '', vehicle: '', score: { city: 0, highway: 0, parking: 0 }, scenes: [], highlights: r.content });
  else customI.push({ id: Date.now(), brand: r.parsed?.brand || '', level: 'P2', category: '其他', desc: r.title + '\n' + r.content, date: r.date || new Date().toISOString().slice(0, 10) });
  saveAll(); showToast('已导入');
}

function showToast(msg,type='ok') {
  let c = document.getElementById('toast'); if(!c){c=document.createElement('div');c.id='toast';document.body.appendChild(c);}
  const t = document.createElement('div');t.className='toast toast-'+type;t.textContent=msg;c.appendChild(t);
  setTimeout(()=>{t.style.transform='translateX(120%)';setTimeout(()=>t.remove(),300)},3000);
}
