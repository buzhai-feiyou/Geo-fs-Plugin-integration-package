// ==UserScript==
// @name         ArcGIS卫星地图（可控图层版）
// @namespace    https://www.geo-fs.com/geofs.php?v=3.9
// @version      3.5
// @description  原版稳定ArcGIS | 按D键控制台 | 可开关地图图层
// @author       不宅的飞友
// @match        https://*/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0
// ==/UserScript==

(function() {
    'use strict';

    const COPYRIGHT = "© 哔哩哔哩 @不宅的飞友 | 开源免费，禁止倒卖 | GitHub: github.com/Shuai-Bi-7365";
    const AUTHOR_URL = "https://space.bilibili.com/3546664033847377";

    const MAP_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    let arcgisLayer = null;
    let layerEnabled = true;
    let viewer = null;

    window.__GeoFS_Copyright = COPYRIGHT;

    // ==================== 提示 ====================
    let toastQueue = [];
    let isShowingToast = false;

    function showTip(text, isOk, duration = 3000) {
        toastQueue.push({ text, isOk, duration });
        if (!isShowingToast) processToastQueue();
    }

    function processToastQueue() {
        if (toastQueue.length === 0) {
            isShowingToast = false;
            return;
        }
        isShowingToast = true;
        const { text, isOk, duration } = toastQueue.shift();

        const tip = document.createElement('div');
        tip.className = 'geo-tip';
        tip.style.cssText = `
            position: fixed;top:20px;left:50%;transform:translateX(-50%);
            background:${isOk ? 'rgba(0,160,0,0.85)' : 'rgba(190,0,0,0.85)'};
            color:#fff;padding:10px 22px;border-radius:8px;z-index:99999;
            font-size:14px;transition:all 0.7s ease;backdrop-filter:blur(4px);
            pointer-events:none;font-weight:500;box-shadow:0 2px 8px rgba(0,0,0,0.2);
            max-width:90vw;text-align:center;
        `;
        tip.textContent = text;
        document.body.appendChild(tip);

        setTimeout(() => {
            if (!tip.isConnected) {
                processToastQueue();
                return;
            }
            tip.style.transform = 'translateX(-50%) translateY(-70px)';
            tip.style.opacity = '0';
            setTimeout(() => {
                tip.remove();
                processToastQueue();
            }, 700);
        }, duration);
    }

    // ==================== 署名 ====================
    function showAuthor() {
        if (window._authorShown) return;
        window._authorShown = true;

        const author = document.createElement('div');
        author.style.cssText = `
            position: fixed;top:65px;left:50%;transform:translateX(-50%);
            background:rgba(0,0,0,0.8);color:#fff;padding:6px 14px;
            border-radius:6px;z-index:99999;font-size:12px;
            transition:opacity 2s ease;border:1px solid #4caf50;white-space:nowrap;
        `;
        author.innerHTML = `由哔哩哔哩 <a href="${AUTHOR_URL}" target="_blank" style="color:#4caf50;text-decoration:none;">@不宅的飞友</a> 制作 | 开源免费 禁止倒卖 | <a href="${AUTHOR_URL}" target="_blank" style="color:#ff9800;text-decoration:none;">🎁 三连打赏UP主</a>`;
        document.body.appendChild(author);

        setTimeout(() => {
            if (!author.isConnected) return;
            author.style.opacity = 0;
            setTimeout(() => author.remove(), 2000);
        }, 5000);
    }

    console.log('%c🗺️ ArcGIS卫星地图 v3.5 | 可开关图层', 'color: #4caf50; font-size: 12px;');
    console.log('%c📌 开源免费，禁止倒卖 | 按 D 键打开控制台', 'color: #ff9800; font-size: 11px;');

    // ==================== 地图图层控制 ====================
    async function addArcGISLayer() {
        if (!viewer) return false;
        try {
            const tileProvider = new Cesium.UrlTemplateImageryProvider({
                url: MAP_URL,
                maximumLevel: 19
            });
            await tileProvider.readyPromise;
            arcgisLayer = viewer.imageryLayers.addImageryProvider(tileProvider);
            return true;
        } catch(e) {
            console.error('ArcGIS加载失败:', e);
            return false;
        }
    }

    function removeArcGISLayer() {
        if (arcgisLayer && viewer) {
            viewer.imageryLayers.remove(arcgisLayer);
            arcgisLayer = null;
        }
    }

    async function toggleLayer(enabled) {
        layerEnabled = enabled;
        if (enabled) {
            if (!arcgisLayer) {
                const success = await addArcGISLayer();
                if (success) {
                    showTip('✅ 已显示 ArcGIS 卫星图', true, 2000);
                } else {
                    showTip('❌ ArcGIS 加载失败', false, 2000);
                    layerEnabled = false;
                }
            } else {
                showTip('✅ 已显示 ArcGIS 卫星图', true, 2000);
            }
        } else {
            removeArcGISLayer();
            showTip('🗺️ 已隐藏 ArcGIS 卫星图，恢复默认地图', true, 2000);
        }
    }

    // ==================== 加载地图 ====================
    async function loadMap() {
        if (!window.geofs?.api?.viewer || !window.Cesium) {
            setTimeout(loadMap, 800);
            return;
        }

        viewer = window.geofs.api.viewer;

        // 不清除默认图层，直接添加 ArcGIS 图层
        showTip('🔄 正在加载 ArcGIS 卫星地图...', true, 2000);

        const success = await addArcGISLayer();
        if (success) {
            showTip("✅ ArcGIS地图加载成功 | 按 D 键可开关图层", true, 5000);
            showAuthor();
        } else {
            showTip("❌ ArcGIS地图加载失败，使用默认地图", false, 4000);
            layerEnabled = false;
        }
    }

    // ==================== 清理缓存 ====================
    async function clearCache() {
        if (!confirm('⚠️ 清理缓存，确定继续吗？')) return;
        let count = 0;
        for (const key in localStorage) {
            if (key.includes('tile') || key.includes('imagery') || key.includes('cesium')) {
                localStorage.removeItem(key);
                count++;
            }
        }
        try {
            await indexedDB.deleteDatabase('CesiumTileCache');
            count++;
        } catch(e) {}
        showTip(`🗑️ 已清理 ${count} 项缓存，建议刷新`, true, 4000);
    }

    function showTileCount() {
        try {
            const sfc = window.geofs?.api?.viewer?.scene?.globe?._surface;
            const loaded = sfc?._tilesToRender?.length || 0;
            const loading = (sfc?._tileLoadQueueHigh?.length || 0) + (sfc?._tileLoadQueueMedium?.length || 0);
            showTip(`📊 ${loaded} 渲染中 / ${loading} 加载中`, true);
        } catch (e) {
            showTip('统计失败', false);
        }
    }

    function showHelp() {
        const help = document.createElement('div');
        help.style.cssText = `
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            background:rgba(20,20,30,0.98);padding:24px;border-radius:16px;z-index:100001;
            min-width:320px;border:1px solid #444;font-family:sans-serif;color:#fff;
            box-shadow:0 8px 24px rgba(0,0,0,0.5);
        `;
        help.innerHTML = `
            <div style="font-size:18px;font-weight:bold;margin-bottom:15px;text-align:center;">❓ 使用帮助</div>
            <div style="margin-bottom:12px;font-size:13px;line-height:1.6;">
                <p><strong>🗺️ 当前地图</strong><br>ArcGIS 卫星图（可开关）</p>
                <p><strong>🔧 常见问题</strong><br>• 加载失败/空白 → 关闭图层再开启<br>• 画面模糊 → 等待几秒加载高清瓦片<br>• 游戏卡顿 → 清理缓存释放内存</p>
                <p><strong>💡 提示</strong><br>• 按 D 键打开/关闭控制台<br>• 可在控制台中开关地图图层</p>
            </div>
            <div style="margin-bottom:12px;font-size:13px;line-height:1.6;border-top:1px solid #444;padding-top:12px;">
                <p><strong>🛠️ 关于篡改猴的使用</strong><br>
                📖 <a href="https://www.tampermonkey.net/" target="_blank" style="color:#4caf50;text-decoration:none;">篡改猴官方网站</a><br>
                🎬 <a href="https://www.bilibili.com/video/BV1xmLvzwEJi/" target="_blank" style="color:#4caf50;text-decoration:none;">视频教程（点击观看）</a>
                </p>
            </div>
            <div style="margin-top:12px;padding-top:12px;border-top:1px solid #444;text-align:center;">
                <div style="font-size:12px;color:#4caf50;margin-bottom:4px;">📌 哔哩哔哩 <a href="${AUTHOR_URL}" target="_blank" style="color:#4caf50;text-decoration:none;">@不宅的飞友</a> 制作</div>
                <div style="font-size:10px;color:#888;margin-bottom:8px;">开源免费 · 禁止倒卖 · 欢迎分享</div>
                <div><a href="${AUTHOR_URL}" target="_blank" style="background:#ff9800;color:#fff;padding:5px 12px;border-radius:20px;text-decoration:none;font-size:12px;">🎁 三连打赏UP主</a></div>
            </div>
        `;
        document.body.appendChild(help);

        const close = (e) => {
            if (e.key === 'Escape' || (e.type === 'click' && !help.contains(e.target))) {
                help.remove();
                document.removeEventListener('click', close);
                document.removeEventListener('keydown', close);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', close);
            document.addEventListener('keydown', close);
        }, 100);
    }

    // ==================== 控制面板 ====================
    let panel = null;
    let isDragging = false, startX, startY, panelX, panelY;

    function showPanel() {
        if (panel) { panel.remove(); panel = null; return; }

        panel = document.createElement('div');
        panel.style.cssText = `
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            background:rgba(20,20,30,0.85);backdrop-filter:blur(12px);
            padding:20px;border-radius:16px;z-index:100000;
            min-width:280px;box-shadow:0 8px 24px rgba(0,0,0,0.5);
            border:1px solid rgba(255,255,255,0.2);
            font-family:sans-serif;color:#fff;cursor:move;user-select:none;
        `;
        panel.innerHTML = `
            <div style="cursor:pointer;position:absolute;top:12px;right:12px;font-size:20px;line-height:1;width:24px;height:24px;text-align:center;border-radius:50%;background:rgba(255,255,255,0.1);" id="close-panel-btn">✕</div>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="font-weight:bold;font-size:18px;">🗺️ 地图控制台</div>
                <div style="font-size:12px;color:#888;">ArcGIS 卫星图</div>
                <div style="font-size:10px;color:#4caf50;margin-top:4px;">
                    <a href="${AUTHOR_URL}" target="_blank" style="color:#4caf50;text-decoration:none;">@不宅的飞友</a> 开源免费
                </div>
            </div>
            <div style="margin-bottom:12px;">
                <label style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
                    <span>🗺️ 显示 ArcGIS 图层</span>
                    <input type="checkbox" id="layer-toggle" ${layerEnabled ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer;">
                </label>
            </div>
            <button id="clear-cache-btn" style="width:100%;padding:10px;margin-bottom:8px;background:#f57c00;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:14px;">🗑️ 清理缓存</button>
            <button id="tile-count-btn" style="width:100%;padding:10px;margin-bottom:8px;background:#7b1fa2;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:14px;">📊 瓦片数量</button>
            <button id="help-btn" style="width:100%;padding:10px;margin-bottom:8px;background:#555;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:14px;">❓ 帮助</button>
            <button id="donate-btn" style="width:100%;padding:10px;margin-bottom:0;background:#ff9800;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:14px;">🎁 三连打赏UP主</button>
            <div style="font-size:10px;color:#666;text-align:center;margin-top:12px;">按 D 或 ESC 关闭 | 可拖拽 | 禁止倒卖</div>
        `;
        document.body.appendChild(panel);

        panel.addEventListener('mousedown', e => {
            if (e.target.closest('button, a, #close-panel-btn, input')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const r = panel.getBoundingClientRect();
            panelX = r.left;
            panelY = r.top;
            panel.style.transition = 'none';
            e.preventDefault();
        });

        window.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let l = panelX + dx;
            let t = panelY + dy;
            l = Math.max(0, Math.min(l, window.innerWidth - panel.offsetWidth));
            t = Math.max(0, Math.min(t, window.innerHeight - panel.offsetHeight));
            panel.style.left = l + 'px';
            panel.style.top = t + 'px';
            panel.style.transform = 'none';
        });

        window.addEventListener('mouseup', () => isDragging = false);

        document.getElementById('layer-toggle').onchange = (e) => {
            toggleLayer(e.target.checked);
        };
        document.getElementById('clear-cache-btn').onclick = () => { clearCache(); panel?.remove(); panel = null; };
        document.getElementById('tile-count-btn').onclick = () => { showTileCount(); panel?.remove(); panel = null; };
        document.getElementById('help-btn').onclick = () => { showHelp(); panel?.remove(); panel = null; };
        document.getElementById('donate-btn').onclick = () => { window.open(AUTHOR_URL, '_blank'); panel?.remove(); panel = null; };
        document.getElementById('close-panel-btn').onclick = () => { panel.remove(); panel = null; };

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') { panel?.remove(); panel = null; }
        });
    }

    // ==================== 快捷键 ====================
    document.addEventListener('keydown', e => {
        if ((e.key === 'd' || e.key === 'D') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
            e.preventDefault();
            showPanel();
        }
    });

    // ==================== 启动 ====================
    loadMap();
})();
