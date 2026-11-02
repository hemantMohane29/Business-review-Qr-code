/* =========================================================
   SMARTREVIEW — ADMIN PANEL LOGIC
   admin.js | v5.0 | Production-ready, secure, localStorage-based
   ========================================================= */
'use strict';

const A = (() => {

  /* ── STORAGE KEYS ─────────────────────────────────────── */
  const KEYS = {
    businesses: 'sr_businesses_v4',
    active:     'sr_active_v4',
    pin:        'sr_pin_v4',
    prefs:      'sr_prefs_v4',
    stat:       (bizId, k) => `sr_stat_${bizId}_${k}`,
  };

  const DEFAULT_PIN   = 'admin1234';
  const REVIEW_PAGE   = 'customer-review.html';

  /* ── STATE ────────────────────────────────────────────── */
  let businesses  = [];
  let activeId    = null;
  let editingId   = null;   // null = adding new
  let qrInstance  = null;
  let sidebarOpen = false;

  /* ── BOOTSTRAP ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    bindLockScreen();
  });

  function bootApp() {
    load();
    bindNav();
    bindBizForm();
    bindSettings();
    refreshAll();
    nav('overview');
  }

  /* ── LOCK / UNLOCK ────────────────────────────────────── */
  function bindLockScreen() {
    const input  = document.getElementById('pin-input');
    const btn    = document.getElementById('btn-unlock');
    const toggle = document.getElementById('toggle-pin');

    toggle?.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    btn?.addEventListener('click', tryUnlock);
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
  }

  function tryUnlock() {
    const input = document.getElementById('pin-input');
    const err   = document.getElementById('pin-error');
    const val   = input.value.trim();
    const stored = localStorage.getItem(KEYS.pin) || DEFAULT_PIN;

    if (val === stored) {
      document.getElementById('lock-screen').classList.add('hidden');
      document.getElementById('admin-app').classList.remove('hidden');
      bootApp();
    } else {
      err.classList.remove('hidden');
      input.value = '';
      input.focus();
      setTimeout(() => err.classList.add('hidden'), 3000);
    }
  }

  function lock() {
    if (!window.confirm('Lock the admin panel?')) return;
    document.getElementById('lock-screen').classList.remove('hidden');
    document.getElementById('admin-app').classList.add('hidden');
    document.getElementById('pin-input').value = '';
  }

  /* ── DATA LOAD / SAVE ─────────────────────────────────── */
  function load() {
    try {
      businesses = JSON.parse(localStorage.getItem(KEYS.businesses) || '[]');
    } catch(e) { businesses = []; }
    activeId = localStorage.getItem(KEYS.active) || (businesses[0]?.id ?? null);
    if (businesses.length && !businesses.find(b => b.id === activeId)) {
      activeId = businesses[0].id;
    }
  }

  function save() {
    localStorage.setItem(KEYS.businesses, JSON.stringify(businesses));
    if (activeId) localStorage.setItem(KEYS.active, activeId);
  }

  function getActive() {
    return businesses.find(b => b.id === activeId) || businesses[0] || null;
  }

  function getPrefs() {
    try { return JSON.parse(localStorage.getItem(KEYS.prefs) || '{}'); } catch(e) { return {}; }
  }

  /* ── NAVIGATION ───────────────────────────────────────── */
  function nav(view) {
    // update sidebar active state
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === view);
    });
    // update views
    document.querySelectorAll('.view').forEach(el => {
      el.classList.toggle('active', el.id === `view-${view}`);
    });
    // update topbar title
    const titles = { overview:'Overview', businesses:'Businesses', qrcode:'QR Code', settings:'Settings', guide:'Setup Guide' };
    document.getElementById('topbar-title').textContent = titles[view] || 'Dashboard';

    // per-view refresh
    if (view === 'overview')    renderOverview();
    if (view === 'businesses')  renderBizList();
    if (view === 'qrcode')      renderQR();
    if (view === 'settings')    renderSettings();

    // close sidebar on mobile
    if (window.innerWidth <= 700) closeSidebar();
  }

  function bindNav() {
    // Remove the old inline onclick from sidebar-biz-switcher to avoid double-binding
  }

  function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebarOpen = !sidebarOpen;
    sb.classList.toggle('open', sidebarOpen);
    overlay?.classList.toggle('active', sidebarOpen);
  }

  function closeSidebar() {
    sidebarOpen = false;
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('active');
  }

  /* ── OVERVIEW ─────────────────────────────────────────── */
  function renderOverview() {
    const biz = getActive();
    document.getElementById('ov-biz-name').textContent = biz?.name || 'your business';
    updateStats();
    updateReviewUrlDisplay();
  }

  function updateStats() {
    const biz = getActive();
    const getStat = (k) => biz ? parseInt(localStorage.getItem(KEYS.stat(biz.id, k)) || '0', 10) : 0;
    document.getElementById('stat-scans').textContent    = getStat('scans');
    document.getElementById('stat-reviews').textContent  = getStat('reviews');
    document.getElementById('stat-shielded').textContent = getStat('shielded');
  }

  function updateReviewUrlDisplay() {
    const biz = getActive();
    const url = biz ? getReviewUrl(biz.id) : '';
    const el = document.getElementById('review-url-display');
    if (el) el.value = url;
  }

  function getReviewUrl(bizId) {
    // MOBILE-FIRST: Embed business data in URL for cross-device compatibility
    // Mobile devices don't have access to desktop's localStorage
    const base = location.origin + location.pathname.replace(/[^/]*$/, REVIEW_PAGE);
    const biz = businesses.find(b => b.id === bizId);
    
    if (!biz) return base;
    
    // Encode minimal business data in URL for mobile devices
    const data = {
      id: biz.id,
      n: biz.name,           // name
      t: biz.type,           // type
      g: biz.googleUrl,      // google URL
      p: biz.phone || '',    // phone
      e: biz.email || ''     // email
    };
    
    // Base64 encode to keep URL cleaner and avoid special character issues
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    let url = `${base}?d=${encoded}`;
    
    return url;
  }

  /* ── BUSINESS LIST ────────────────────────────────────── */
  function renderBizList() {
    const list = document.getElementById('biz-list');
    if (!list) return;

    document.getElementById('nav-biz-count').textContent = businesses.length;
    document.getElementById('sidebar-biz-name').textContent = getActive()?.name || 'No business';

    if (businesses.length === 0) {
      list.innerHTML = '<p class="muted text-sm" style="padding:8px">No businesses yet. Add one using the form →</p>';
      return;
    }

    list.innerHTML = '';
    businesses.forEach(biz => {
      const item = document.createElement('div');
      item.className = `biz-list-item${biz.id === activeId ? ' current' : ''}`;
      item.innerHTML = `
        <div class="biz-list-avatar">${getAvatar(biz.type)}</div>
        <div class="biz-list-info">
          <div class="biz-list-name">${esc(biz.name)}</div>
          <div class="biz-list-type">${getCatLabel(biz.type)}</div>
        </div>
        ${biz.id === activeId ? '<span class="biz-list-badge active">Active</span>' : '<span class="biz-list-badge">Switch</span>'}
      `;
      item.addEventListener('click', () => {
        activeId = biz.id;
        save();
        loadBizToForm(biz);
        renderBizList();
        updateStats();
        updateReviewUrlDisplay();
        toast(`Switched to ${biz.name}`, 'info');
      });
      list.appendChild(item);
    });
  }

  /* ── BUSINESS FORM ────────────────────────────────────── */
  function showAddForm() {
    editingId = null;
    document.getElementById('form-card-title').textContent = 'Add New Business';
    document.getElementById('btn-delete-biz').style.display = 'none';
    document.getElementById('biz-form').reset();
    document.getElementById('form-error').classList.add('hidden');
    nav('businesses');
    setTimeout(() => document.getElementById('f-name')?.focus(), 100);
  }

  function loadBizToForm(biz) {
    editingId = biz.id;
    document.getElementById('form-card-title').textContent = 'Edit Business';
    document.getElementById('btn-delete-biz').style.display = '';
    document.getElementById('f-name').value      = biz.name    || '';
    document.getElementById('f-type').value      = biz.type    || 'general';
    document.getElementById('f-google-url').value = biz.googleUrl || '';
    document.getElementById('f-phone').value     = biz.phone   || '';
    document.getElementById('f-email').value     = biz.email   || '';
    document.getElementById('f-apikey').value    = biz.apiKey  || '';
    document.getElementById('form-error').classList.add('hidden');
  }

  function bindBizForm() {
    document.getElementById('biz-form')?.addEventListener('submit', e => {
      e.preventDefault();
      saveBusiness();
    });
  }

  function saveBusiness() {
    const name      = document.getElementById('f-name')?.value.trim();
    const type      = document.getElementById('f-type')?.value;
    const googleUrl = document.getElementById('f-google-url')?.value.trim();
    const phone     = document.getElementById('f-phone')?.value.trim();
    const email     = document.getElementById('f-email')?.value.trim();
    const apiKey    = document.getElementById('f-apikey')?.value.trim();

    // Validate
    const errEl = document.getElementById('form-error');
    const errMsg= document.getElementById('form-error-msg');
    if (!name) {
      errMsg.textContent = 'Business name is required.';
      errEl.classList.remove('hidden');
      document.getElementById('f-name')?.focus();
      return;
    }
    if (!googleUrl || !googleUrl.startsWith('http')) {
      errMsg.textContent = 'Please enter a valid Google Review URL (must start with https://).';
      errEl.classList.remove('hidden');
      document.getElementById('f-google-url')?.focus();
      return;
    }
    // Validate WhatsApp number format if provided
    if (phone && phone.length > 0) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        errMsg.textContent = 'WhatsApp number must be 10-15 digits. Include country code (e.g., +919876543210).';
        errEl.classList.remove('hidden');
        document.getElementById('f-phone')?.focus();
        return;
      }
      // Check if it starts with + or digit
      if (!phone.match(/^[\+\d]/)) {
        errMsg.textContent = 'WhatsApp number must start with + or a digit (e.g., +919876543210).';
        errEl.classList.remove('hidden');
        document.getElementById('f-phone')?.focus();
        return;
      }
    }
    errEl.classList.add('hidden');

    const btn = document.getElementById('btn-save-biz');
    btn.classList.add('loading');

    setTimeout(() => {
      const data = { name, type, googleUrl, phone, email, apiKey };

      if (editingId) {
        const idx = businesses.findIndex(b => b.id === editingId);
        if (idx !== -1) businesses[idx] = { ...businesses[idx], ...data };
      } else {
        const newBiz = { id: 'biz_' + Date.now(), ...data };
        businesses.push(newBiz);
        activeId = newBiz.id;
        editingId = newBiz.id;
        // Update form to edit mode
        document.getElementById('form-card-title').textContent = 'Edit Business';
        document.getElementById('btn-delete-biz').style.display = '';
      }

      save();
      renderBizList();
      updateStats();
      updateReviewUrlDisplay();
      renderQR();

      btn.classList.remove('loading');
      toast(`Business "${name}" saved successfully!`, 'success');
    }, 400);
  }

  function deleteBusiness() {
    const biz = businesses.find(b => b.id === editingId);
    if (!biz) return;
    
    const confirmMsg = businesses.length === 1 
      ? `Delete "${biz.name}"? This is your only business. You can add a new one later.`
      : `Delete "${biz.name}"? This cannot be undone.`;
    
    if (!window.confirm(confirmMsg)) return;

    // Delete all stats for this business
    ['scans', 'reviews', 'shielded'].forEach(key => {
      localStorage.removeItem(KEYS.stat(editingId, key));
    });

    businesses = businesses.filter(b => b.id !== editingId);
    
    // Set new active business or null
    if (activeId === editingId) {
      activeId = businesses[0]?.id || null;
    }
    
    editingId = null;
    save();

    document.getElementById('form-card-title').textContent = 'Add New Business';
    document.getElementById('btn-delete-biz').style.display = 'none';
    document.getElementById('biz-form').reset();
    renderBizList();
    renderQR();
    updateStats();
    updateReviewUrlDisplay();
    toast('Business deleted successfully.', 'success');
    
    // If no businesses left, show empty state
    if (businesses.length === 0) {
      nav('businesses');
    }
  }

  /* ── QR CODE ──────────────────────────────────────────── */
  function renderQR() {
    const biz = getActive();
    const container = document.getElementById('qr-container');
    if (!container) return;

    // Clear previous QR
    container.innerHTML = '';
    qrInstance = null;

    if (!biz) {
      container.innerHTML = '<p style="color:#999;font-size:.82rem;padding:20px;text-align:center">Add a business to generate QR code</p>';
      document.getElementById('qr-biz-label').textContent = 'No business';
      document.getElementById('qr-url-label').textContent = '';
      return;
    }

    const url = getReviewUrl(biz.id);
    
    // Validate URL before generating QR
    if (!url || url.length < 10) {
      container.innerHTML = '<p style="color:#f44336;font-size:.82rem;padding:20px;text-align:center">⚠️ Invalid URL. Please check business configuration.</p>';
      return;
    }

    document.getElementById('qr-biz-label').textContent = biz.name;
    document.getElementById('qr-url-label').textContent  = url;

    try {
      if (typeof QRCode !== 'undefined') {
        qrInstance = new QRCode(container, {
          text: url, 
          width: 220, 
          height: 220,
          colorDark: '#000', 
          colorLight: '#fff',
          correctLevel: QRCode.CorrectLevel.H  // High error correction for better scanning
        });
        
        console.log('QR Code generated successfully:', { 
          businessId: biz.id, 
          businessName: biz.name,
          urlLength: url.length 
        });
      } else {
        container.innerHTML = '<p style="color:#f44336;font-size:.82rem;padding:20px;text-align:center">⚠️ QR library not loaded. Please refresh the page.</p>';
      }
    } catch (error) {
      console.error('QR generation error:', error);
      container.innerHTML = '<p style="color:#f44336;font-size:.82rem;padding:20px;text-align:center">⚠️ Failed to generate QR code. Please try again.</p>';
    }
  }

  function downloadQR() {
    const biz = getActive();
    if (!biz) { 
      toast('No active business to download QR for.', 'error'); 
      return; 
    }

    try {
      // Try canvas first (higher quality), fall back to img
      const canvas = document.querySelector('#qr-container canvas');
      const img    = document.querySelector('#qr-container img');

      let dataUrl;
      if (canvas) {
        dataUrl = canvas.toDataURL('image/png');
      } else if (img && img.src) {
        dataUrl = img.src;
      } else {
        toast('QR code not ready yet. Please wait and try again.', 'error');
        return;
      }

      // Validate data URL
      if (!dataUrl || !dataUrl.startsWith('data:image')) {
        toast('Invalid QR code data. Please regenerate.', 'error');
        return;
      }

      const name = biz.name.replace(/[^a-zA-Z0-9]/g, '_') || 'QR';
      const timestamp = new Date().toISOString().split('T')[0];
      const a = Object.assign(document.createElement('a'), {
        href: dataUrl,
        download: `${name}_QR_${timestamp}.png`
      });
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast('QR code downloaded successfully!', 'success');
      console.log('QR downloaded:', { business: biz.name, filename: a.download });
    } catch (error) {
      console.error('QR download error:', error);
      toast('Failed to download QR code. Please try again.', 'error');
    }
  }

  function copyReviewLink() {
    const biz = getActive();
    if (!biz) { 
      toast('No active business.', 'error'); 
      return; 
    }
    
    try {
      const url = getReviewUrl(biz.id);
      
      if (!url || url.length < 10) {
        toast('Invalid review URL. Please check business configuration.', 'error');
        return;
      }
      
      copyText(url);
      toast('Review link copied to clipboard!', 'success');
      console.log('Review link copied:', { businessId: biz.id, url });
    } catch (error) {
      console.error('Copy link error:', error);
      toast('Failed to copy link. Please try again.', 'error');
    }
  }

  function testReviewLink() {
    const biz = getActive();
    if (!biz) { 
      toast('No active business.', 'error'); 
      return; 
    }
    
    try {
      const url = getReviewUrl(biz.id);
      
      if (!url || url.length < 10) {
        toast('Invalid review URL. Please check business configuration.', 'error');
        return;
      }
      
      window.open(url, '_blank', 'noopener,noreferrer');
      console.log('Testing review link:', { businessId: biz.id, url });
    } catch (error) {
      console.error('Test link error:', error);
      toast('Failed to open test link. Please try again.', 'error');
    }
  }

  /* ── SETTINGS ─────────────────────────────────────────── */
  function renderSettings() {
    const prefs = getPrefs();
    const vCode = document.getElementById('s-voucher-code');
    const vText = document.getElementById('s-voucher-text');
    if (vCode) vCode.value = prefs.voucherCode || 'CARE15';
    if (vText) vText.value = prefs.voucherText || '15% off your next visit';
  }

  function bindSettings() {
    // Settings loaded on nav
  }

  function changePIN() {
    const curr       = document.getElementById('s-current-pin')?.value.trim();
    const newPin     = document.getElementById('s-new-pin')?.value.trim();
    const confirmPin = document.getElementById('s-confirm-pin')?.value.trim();
    const stored     = localStorage.getItem(KEYS.pin) || DEFAULT_PIN;
    const statusEl   = document.getElementById('pin-change-status');

    const show = (msg, type) => {
      statusEl.className = `alert alert-${type}`;
      statusEl.textContent = msg;
      statusEl.classList.remove('hidden');
      setTimeout(() => statusEl.classList.add('hidden'), 3500);
    };

    if (curr !== stored)         { show('Current PIN is incorrect.', 'danger'); return; }
    if (newPin.length < 4)       { show('New PIN must be at least 4 characters.', 'danger'); return; }
    if (newPin !== confirmPin)   { show('PINs do not match.', 'danger'); return; }

    localStorage.setItem(KEYS.pin, newPin);
    document.getElementById('s-current-pin').value = '';
    document.getElementById('s-new-pin').value     = '';
    document.getElementById('s-confirm-pin').value = '';
    show('PIN updated successfully!', 'success');
  }

  function savePrefs() {
    const prefs = {
      voucherCode: document.getElementById('s-voucher-code')?.value.trim() || 'CARE15',
      voucherText: document.getElementById('s-voucher-text')?.value.trim() || '15% off your next visit',
    };
    localStorage.setItem(KEYS.prefs, JSON.stringify(prefs));
    toast('Preferences saved!', 'success');
  }

  function resetStats() {
    if (!window.confirm('Reset all analytics stats? This cannot be undone.')) return;
    businesses.forEach(biz => {
      ['scans','reviews','shielded'].forEach(k => {
        localStorage.removeItem(KEYS.stat(biz.id, k));
      });
    });
    updateStats();
    toast('Stats reset.', 'info');
  }

  function clearAllData() {
    if (!window.confirm('This will delete ALL businesses, settings, and data. Are you absolutely sure?')) return;
    if (!window.confirm('Last warning: all data will be permanently deleted.')) return;
    [KEYS.businesses, KEYS.active, KEYS.pin, KEYS.prefs].forEach(k => localStorage.removeItem(k));
    businesses.forEach(biz => {
      ['scans','reviews','shielded'].forEach(k => localStorage.removeItem(KEYS.stat(biz.id, k)));
    });
    toast('All data cleared. Refreshing…', 'info');
    setTimeout(() => location.reload(), 1500);
  }

  /* ── REFRESH ALL ──────────────────────────────────────── */
  function refreshAll() {
    document.getElementById('nav-biz-count').textContent  = businesses.length;
    document.getElementById('sidebar-biz-name').textContent = getActive()?.name || 'No business';
  }

  /* ── TOAST NOTIFICATIONS ──────────────────────────────── */
  function toast(msg, type = 'info') {
    const wrap = document.getElementById('toast-wrap');
    if (!wrap) return;
    const icons = { success:'✅', error:'❌', info:'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = `${icons[type] || ''} ${msg}`;
    wrap.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(12px)';
      setTimeout(() => t.remove(), 250);
    }, 3200);
  }

  /* ── HELPERS ──────────────────────────────────────────── */
  async function copyText(text) {
    try {
      // Try modern clipboard API first (works on HTTPS and localhost)
      if (navigator.clipboard && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch(e) { /* fallback below */ }

    // Fallback for HTTP
    try {
      const ta = Object.assign(document.createElement('textarea'),
        { value: text, style: 'position:fixed;left:-9999px;opacity:0' });
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch(e) { /* silent */ }
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function getAvatar(type) {
    return { restaurant:'🍽️', cafe:'☕', salon:'✂️', clinic:'🩺', gym:'🏋️', retail:'🛍️', hotel:'🏨', auto:'🚗' }[type] || '⭐';
  }

  function getCatLabel(type) {
    return { restaurant:'Restaurant & Dining', cafe:'Café & Bakery', salon:'Salon & Spa', clinic:'Healthcare Clinic', gym:'Gym & Fitness', retail:'Retail Store', hotel:'Hotel & Resort', auto:'Auto Service', general:'Local Business' }[type] || 'Local Business';
  }

  /* ── PUBLIC ───────────────────────────────────────────── */
  return {
    nav, lock, toggleSidebar,
    showAddForm, saveBusiness, deleteBusiness,
    renderQR, downloadQR, copyReviewLink, testReviewLink,
    changePIN, savePrefs, resetStats, clearAllData,
  };

})();
