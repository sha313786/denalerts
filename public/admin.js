// SRB STUDIOS Master Admin Controller
(function() {
  const gateOverlay = document.getElementById('gate-overlay');
  const adminKeyInput = document.getElementById('admin-key-input');
  const btnUnlock = document.getElementById('btn-unlock');
  const gateError = document.getElementById('gate-error');
  const btnLock = document.getElementById('btn-lock');
  const btnRefresh = document.getElementById('btn-refresh');

  const statTotalCreators = document.getElementById('stat-total-creators');
  const statProCreators = document.getElementById('stat-pro-creators');
  const statTrialCreators = document.getElementById('stat-trial-creators');
  const statTotalRevenue = document.getElementById('stat-total-revenue');

  const searchBox = document.getElementById('search-box');
  const filterTabs = document.querySelectorAll('.tab-btn');
  const creatorsTbody = document.getElementById('creators-tbody');
  const toast = document.getElementById('toast');

  let currentKey = sessionStorage.getItem('srb_admin_key') || '';
  let allCreators = [];
  let activeFilter = 'all';

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  const ADMIN_EMAIL = 'srbstudiosofficial@gmail.com';

  function checkAuth() {
    if (currentKey) {
      gateOverlay.style.display = 'none';
      loadCreators();
      return;
    }

    // Auto-authenticate if logged into browser as srbstudiosofficial@gmail.com
    const authToken = localStorage.getItem('denalerts_auth_token');
    if (authToken) {
      fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + authToken } })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.user && data.user.email && data.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            gateOverlay.style.display = 'none';
            loadCreators();
            return;
          }
          gateOverlay.style.display = 'flex';
          adminKeyInput.focus();
        })
        .catch(() => {
          gateOverlay.style.display = 'flex';
          adminKeyInput.focus();
        });
      return;
    }

    gateOverlay.style.display = 'flex';
    adminKeyInput.focus();
  }

  if (btnUnlock) {
    btnUnlock.addEventListener('click', () => {
      const val = (adminKeyInput.value || '').trim();
      if (!val) return;
      currentKey = val;
      sessionStorage.setItem('srb_admin_key', currentKey);
      loadCreators(true);
    });
  }

  if (adminKeyInput) {
    adminKeyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnUnlock.click();
    });
  }

  if (btnLock) {
    btnLock.addEventListener('click', () => {
      sessionStorage.removeItem('srb_admin_key');
      currentKey = '';
      gateOverlay.style.display = 'flex';
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      btnRefresh.disabled = true;
      btnRefresh.innerHTML = '<span>⏳ Refreshing...</span>';
      loadCreators().finally(() => {
        btnRefresh.disabled = false;
        btnRefresh.innerHTML = '<span>🔄 Refresh Live List</span>';
      });
    });
  }

  function getAdminHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const authToken = localStorage.getItem('denalerts_auth_token');
    if (authToken) {
      headers['Authorization'] = 'Bearer ' + authToken;
    }
    if (currentKey) {
      headers['x-admin-key'] = currentKey;
    }
    return headers;
  }

  // Load all creators from the server
  async function loadCreators(fromLogin = false) {
    try {
      const headers = getAdminHeaders();
      const queryParam = currentKey ? `?key=${encodeURIComponent(currentKey)}` : '';
      const res = await fetch(`/api/admin/creators${queryParam}`, { headers });
      if (res.status === 401) {
        if (fromLogin && gateError) {
          gateError.style.display = 'block';
          gateError.textContent = 'Invalid Admin Key. Access denied.';
        }
        sessionStorage.removeItem('srb_admin_key');
        currentKey = '';
        gateOverlay.style.display = 'flex';
        return;
      }

      const data = await res.json();
      if (data.success) {
        gateOverlay.style.display = 'none';
        if (gateError) gateError.style.display = 'none';

        allCreators = data.creators || [];

        // Update Stat Cards
        if (statTotalCreators) statTotalCreators.textContent = data.summary.totalCreators || 0;
        if (statProCreators) statProCreators.textContent = data.summary.paidProCount || 0;
        if (statTrialCreators) statTrialCreators.textContent = data.summary.proTrialCount || 0;
        if (statTotalRevenue) statTotalRevenue.textContent = `₹${(data.summary.totalDonationsAmount || 0).toLocaleString('en-IN')}`;

        renderTable();
      }
    } catch (err) {
      console.error('Failed to load creators:', err);
      showToast('Error connecting to admin API');
    }
  }

  // Search & Filters
  if (searchBox) {
    searchBox.addEventListener('input', () => {
      renderTable();
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      renderTable();
    });
  });

  function renderTable() {
    if (!creatorsTbody) return;

    const query = (searchBox ? searchBox.value : '').toLowerCase().trim();

    let list = allCreators.filter(c => {
      const matchSearch = c.streamId.toLowerCase().includes(query) ||
        (c.channelName && c.channelName.toLowerCase().includes(query)) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.pairingPin && String(c.pairingPin).includes(query));
      if (!matchSearch) return false;

      if (activeFilter === 'all') return true;
      if (activeFilter === 'pro') return c.plan === 'pro';
      if (activeFilter === 'pro_trial') return c.plan === 'pro_trial';
      if (activeFilter === 'free') return c.plan === 'free';
      return true;
    });

    if (list.length === 0) {
      creatorsTbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
            No streamers match your search or filter.
          </td>
        </tr>
      `;
      return;
    }

    creatorsTbody.innerHTML = list.map(c => {
      const planClass = c.plan === 'pro' ? 'pro' : (c.plan === 'pro_trial' ? 'trial' : 'free');
      const planLabel = c.plan === 'pro' ? '👑 Creator Pro (Paid)' : (c.plan === 'pro_trial' ? '⏳ Pro Trial' : 'Creator Free');

      let expiryText = '—';
      if (c.plan === 'pro') {
        expiryText = c.daysRemaining > 0 ? `Active (${c.daysRemaining} days left)` : 'Permanent Pro';
      } else if (c.plan === 'pro_trial') {
        expiryText = c.daysRemaining > 0 ? `<span style="color:#fbbf24;">${c.daysRemaining} days left</span>` : '<span style="color:#f43f5e;">Expired</span>';
      } else {
        expiryText = '<span style="color:#94a3b8;">Unlimited Free</span>';
      }

      const wmHtml = c.watermark ? 
        `<span class="watermark-pill active">⚡ SRB STUDIOS Active</span>` : 
        `<span class="watermark-pill none">❌ Unbranded (Clean)</span>`;

      const voiceInfo = `
        <div style="font-size: 11.5px;">
          <div>🗣️ ${c.voiceLanguage}</div>
          <div style="color: var(--text-muted);">${c.hasOwnVoice ? '🎙️ Own Voice Active' : c.voicePersona}</div>
        </div>
      `;

      const donationStats = `
        <div style="font-weight: 700; color: #fff;">
          ₹${(c.stats.totalAmount || 0).toLocaleString('en-IN')}
          <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">(${c.stats.count || 0} alerts)</span>
        </div>
      `;

      const emailLine = c.email ? `<div style="font-size:11px; color:#94a3b8; margin-top:2px;">📧 ${escapeHtml(c.email)}</div>` : '';
      const pinLine = c.pairingPin ? `<div style="font-size:11px; font-family:'JetBrains Mono',monospace; color:#38bdf8; margin-top:2px;">🔑 PIN: <strong>${escapeHtml(c.pairingPin)}</strong></div>` : '';

      return `
        <tr>
          <td>
            <div style="margin-bottom:3px;">
              <strong style="color:#fff; font-size:14px;">${escapeHtml(c.channelName || c.streamId)}</strong>
            </div>
            <div class="creator-code">
              <span>ID: ${escapeHtml(c.streamId)}</span>
              <a href="/dashboard?code=${encodeURIComponent(c.streamId)}" target="_blank" style="color:var(--text-muted); font-size:12px;" title="Open Streamer Dashboard">↗</a>
            </div>
            ${emailLine}
            ${pinLine}
          </td>
          <td>
            <span class="plan-badge ${planClass}">${planLabel}</span>
            ${c.lastPayment && c.lastPayment.utr ? `
              <div style="margin-top:4px; font-size:11px; font-family:'JetBrains Mono',monospace; color:#34d399; background:rgba(16,185,129,0.12); padding:2px 6px; border-radius:4px; border:1px solid rgba(16,185,129,0.25); display:inline-block;" title="Submitted UPI Reference Number">
                🧾 UTR: <strong>${escapeHtml(c.lastPayment.utr)}</strong>
              </div>
            ` : ''}
          </td>
          <td>${expiryText}</td>
          <td>${wmHtml}</td>
          <td>${voiceInfo}</td>
          <td>${donationStats}</td>
          <td>
            <div class="action-group">
              <button class="btn btn-pro btn-xs" onclick="setCreatorPlan('${escapeHtml(c.streamId)}', 'pro', 30)" title="Grant Paid Pro (30 Days)">
                👑 Pro (30d)
              </button>
              <button class="btn btn-pro btn-xs" onclick="setCreatorPlan('${escapeHtml(c.streamId)}', 'pro', 365)" title="Grant Paid Pro (1 Year)">
                👑 1 Year
              </button>
              <button class="btn btn-trial btn-xs" onclick="setCreatorPlan('${escapeHtml(c.streamId)}', 'pro_trial', 14)" title="Grant 14-Day Pro Trial">
                ⏳ Trial 14d
              </button>
              <button class="btn btn-free btn-xs" onclick="setCreatorPlan('${escapeHtml(c.streamId)}', 'free', 0)" title="Downgrade to Free Tier">
                🔒 Free
              </button>
              <button class="btn btn-danger btn-xs" onclick="deleteCreator('${escapeHtml(c.streamId)}')" title="Delete Account File">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.setCreatorPlan = async function(streamId, plan, days) {
    try {
      const res = await fetch(`/api/admin/set-plan`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ streamId, plan, days })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Streamer '${streamId}' updated to ${data.subscription.tierName}!`);
        loadCreators();
      } else {
        alert('Action failed: ' + (data.error || 'Server error'));
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  window.deleteCreator = async function(streamId) {
    if (!confirm(`Delete streamer '${streamId}' permanently from the server?`)) return;
    try {
      const res = await fetch(`/api/admin/delete-creator`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ streamId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🗑️ Streamer '${streamId}' removed.`);
        loadCreators();
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  checkAuth();
})();
