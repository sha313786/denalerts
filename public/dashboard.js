// Stream Alerts Cockpit Dashboard Controller
(function() {
  const connStatus = document.getElementById('conn-status');
  const streamerCodeVal = document.getElementById('streamer-code-val');
  const guideCode = document.getElementById('guide-code');
  const btnCopyCode = document.getElementById('btn-copy-code');
  const bannerOverlayUrl = document.getElementById('banner-overlay-url');
  const btnBannerCopyOverlay = document.getElementById('btn-banner-copy-overlay');
  const btnPreviewOverlay = document.getElementById('btn-preview-overlay');

  const statTotal = document.getElementById('stat-total');
  const statCount = document.getElementById('stat-count');
  const statTop = document.getElementById('stat-top');
  const statTopAmt = document.getElementById('stat-top-amt');
  const statAvg = document.getElementById('stat-avg');

  const testForm = document.getElementById('test-form');
  const inputAmount = document.getElementById('input-amount');
  const inputApp = document.getElementById('input-app');
  const inputSender = document.getElementById('input-sender');
  const inputNote = document.getElementById('input-note');
  const btnFireTest = document.getElementById('btn-fire-test');
  const chips = document.querySelectorAll('.chip');

  const inputMinAlert = document.getElementById('input-min-alert');
  const inputMinTts = document.getElementById('input-min-tts');
  const checkCensor = document.getElementById('check-censor');
  const rangeSpeed = document.getElementById('range-speed');
  const speedVal = document.getElementById('speed-val');
  const selectVoiceLang = document.getElementById('select-voice-lang');
  const voicePreviewPhrase = document.getElementById('voice-preview-phrase');
  const selectVoicePersona = document.getElementById('select-voice-persona');
  const voiceProBadge = document.getElementById('voice-pro-badge');
  const rangePitch = document.getElementById('range-pitch');
  const pitchVal = document.getElementById('pitch-val');
  const customPitchWrap = document.getElementById('custom-pitch-wrap');
  const speedPresets = document.querySelectorAll('.btn-speed-preset');
  const btnTestVoice = document.getElementById('btn-test-voice');
  const btnSaveSettings = document.getElementById('btn-save-settings');

  // Discord Announcement Webhook elements
  const inputDiscordWebhook = document.getElementById('input-discord-webhook');
  const checkDiscordEnabled = document.getElementById('check-discord-enabled');
  const btnTestDiscord = document.getElementById('btn-test-discord');
  const btnSaveDiscord = document.getElementById('btn-save-discord');
  const discordStatusMsg = document.getElementById('discord-status-msg');

  // Own Voice Studio elements
  const ownVoiceStudio = document.getElementById('own-voice-studio');
  const ovStatusCard = document.getElementById('ov-status-card');
  const ovActiveName = document.getElementById('ov-active-name');
  const btnPlayOwnVoice = document.getElementById('btn-play-own-voice');
  const btnDeleteOwnVoice = document.getElementById('btn-delete-own-voice');
  const ovTabRec = document.getElementById('ov-tab-rec');
  const ovTabUpload = document.getElementById('ov-tab-upload');
  const ovPaneRec = document.getElementById('ov-pane-rec');
  const ovPaneUpload = document.getElementById('ov-pane-upload');
  const btnRecordVoice = document.getElementById('btn-record-voice');
  const btnStopVoice = document.getElementById('btn-stop-voice');
  const ovRecTimer = document.getElementById('ov-rec-timer');
  const ovRecWave = document.getElementById('ov-rec-wave');
  const ovRecordedReview = document.getElementById('ov-recorded-review');
  const ovPreviewPlayer = document.getElementById('ov-preview-player');
  const btnSaveRecordedVoice = document.getElementById('btn-save-recorded-voice');
  const btnDiscardVoice = document.getElementById('btn-discard-voice');
  const ovFileInput = document.getElementById('ov-file-input');
  const ovUploadProgress = document.getElementById('ov-upload-progress');
  const ovDropzone = document.getElementById('ov-dropzone');

  let mediaRecorder = null;
  let audioChunks = [];
  let recordTimerInterval = null;
  let recordSeconds = 0;
  let recordedBlob = null;
  let currentOwnVoiceAudio = new Audio();
  let currentSettings = {};

  const historyTbody = document.getElementById('history-tbody');
  const btnClearHistory = document.getElementById('btn-clear-history');

  const dashToast = document.getElementById('dashboard-toast');
  const toastSender = document.getElementById('toast-sender');
  const toastNote = document.getElementById('toast-note');
  const toastAmount = document.getElementById('toast-amount');
  const dashSound = document.getElementById('dash-sound');

  const userProfileBadge = document.getElementById('user-profile-badge');
  const userProviderIcon = document.getElementById('user-provider-icon');
  const userDisplayName = document.getElementById('user-display-name');

  const btnSubscription = document.getElementById('btn-subscription');
  const planName = document.getElementById('plan-name');
  const modalSubscription = document.getElementById('modal-subscription');
  const btnCloseSubscriptionModal = document.getElementById('btn-close-subscription-modal');
  const btnSelectFree = document.getElementById('btn-select-free');
  const btnSelectPro = document.getElementById('btn-select-pro');
  const planBoxFree = document.getElementById('plan-box-free');
  const planBoxPro = document.getElementById('plan-box-pro');

  // Goal Bar Elements
  const inputGoalUrl = document.getElementById('input-goal-url');
  const btnCopyGoalUrl = document.getElementById('btn-copy-goal-url');
  const btnPreviewGoal = document.getElementById('btn-preview-goal');
  const checkGoalEnabled = document.getElementById('check-goal-enabled');
  const inputGoalTitle = document.getElementById('input-goal-title');
  const inputGoalTarget = document.getElementById('input-goal-target');
  const inputGoalCurrent = document.getElementById('input-goal-current');
  const btnSaveGoal = document.getElementById('btn-save-goal');
  const btnBumpGoal = document.getElementById('btn-bump-goal');
  const btnResetGoal = document.getElementById('btn-reset-goal');
  const goalStatusMsg = document.getElementById('goal-status-msg');
  const goalLockedBanner = document.getElementById('goal-locked-banner');
  const goalProBadge = document.getElementById('goal-pro-badge');
  const selectGoalTheme = document.getElementById('select-goal-theme');

  let ws = null;
  let historyData = [];
  let currentSubscription = { plan: 'pro', tierName: 'Creator Pro' };

  // 1. Session Authentication Check (Strict Security)
  const authToken = localStorage.getItem('denalerts_auth_token');
  if (!authToken) {
    window.location.replace('/login');
    return;
  }

  let cachedUser = null;
  try {
    cachedUser = JSON.parse(localStorage.getItem('denalerts_user'));
  } catch (_) {}

  let streamId = (cachedUser && cachedUser.streamerKey) ? cachedUser.streamerKey : 'default';
  let pairingCode = (cachedUser && cachedUser.pairingPin) ? cachedUser.pairingPin : '...';

  // Verified User UI Setup
  function updatePairingUI(pin, account) {
    if (streamerCodeVal) streamerCodeVal.value = pin;
    if (guideCode) guideCode.textContent = pin;
    const pinText = document.getElementById('pairing-pin-text');
    if (pinText) pinText.textContent = pin;
    const userText = document.getElementById('pairing-user-text');
    if (userText) userText.textContent = account ? `(Account: ${account})` : '';
    const guideAlias = document.getElementById('guide-alias');
    if (guideAlias) guideAlias.textContent = account ? `(or "${account}")` : '';
    const guideServer = document.getElementById('guide-server-url');
    if (guideServer) guideServer.textContent = window.location.origin;
  }

  const ADMIN_EMAIL = 'srbstudiosofficial@gmail.com';
  const btnAdminPortal = document.getElementById('btn-admin-portal');

  function updateAdminVisibility(u) {
    if (!btnAdminPortal) return;
    if (u && u.email && u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      btnAdminPortal.style.display = 'inline-flex';
    } else {
      btnAdminPortal.style.display = 'none';
    }
  }

  if (cachedUser) {
    if (userProfileBadge && userDisplayName) {
      userProfileBadge.style.display = 'inline-flex';
      userDisplayName.textContent = cachedUser.channelName || cachedUser.email;
    }
    updateAdminVisibility(cachedUser);
    updatePairingUI(pairingCode, streamId);
  }

  // Verify token with server on load
  fetch('/api/auth/me', {
    headers: { 'Authorization': 'Bearer ' + authToken }
  })
  .then(r => r.json())
  .then(data => {
    if (!data.success || !data.user) {
      localStorage.removeItem('denalerts_auth_token');
      localStorage.removeItem('denalerts_user');
      window.location.replace('/login');
      return;
    }
    const user = data.user;
    localStorage.setItem('denalerts_user', JSON.stringify(user));
    streamId = user.streamerKey;
    pairingCode = user.pairingPin;
    if (userProfileBadge && userDisplayName) {
      userProfileBadge.style.display = 'inline-flex';
      userDisplayName.textContent = user.channelName || user.email;
    }
    updateAdminVisibility(user);
    updatePairingUI(pairingCode, streamId);
    updateOverlayUrls(streamId);
  })
  .catch(() => {
    // In case of temporary offline/network glitch, cached session remains
  });

  // Sign Out Handler
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + authToken }
      }).finally(() => {
        localStorage.removeItem('denalerts_auth_token');
        localStorage.removeItem('denalerts_user');
        localStorage.removeItem('stream_session_code');
        localStorage.removeItem('streamer_code');
        window.location.href = '/login';
      });
    });
  }

  // 2. URLs
  const host = window.location.host;
  const proto = window.location.protocol;

  function updateOverlayUrls(sid) {
    const overlayFullUrl = `${proto}//${host}/overlay?code=${encodeURIComponent(sid)}`;
    if (bannerOverlayUrl) bannerOverlayUrl.value = overlayFullUrl;
    if (btnPreviewOverlay) btnPreviewOverlay.href = overlayFullUrl;

    const theme = (selectGoalTheme && selectGoalTheme.value) ? selectGoalTheme.value : 'default';
    const goalFullUrl = `${proto}//${host}/goal?code=${encodeURIComponent(sid)}${theme !== 'default' ? '&theme=' + encodeURIComponent(theme) : ''}`;
    if (inputGoalUrl) inputGoalUrl.value = goalFullUrl;
    if (btnPreviewGoal) btnPreviewGoal.href = goalFullUrl + '&preview=1';
  }
  updateOverlayUrls(streamId);

  if (selectGoalTheme) {
    selectGoalTheme.addEventListener('change', () => {
      updateOverlayUrls(streamId);
      saveSettings();
    });
  }

  // Copy Buttons
  function copyText(val, btn, originalHtml) {
    const doneHtml = '<span>Copied</span>';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(val).then(() => {
        btn.innerHTML = doneHtml;
        setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
      });
    } else {
      const temp = document.createElement('input');
      temp.value = val;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      btn.innerHTML = doneHtml;
      setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
    }
  }

  const copyPinHtml = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:3px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Copy PIN</span>';
  const copyUrlHtml = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:3px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Copy URL</span>';

  if (btnCopyCode) {
    btnCopyCode.addEventListener('click', () => {
      const codeToCopy = (streamerCodeVal && streamerCodeVal.value) ? streamerCodeVal.value : pairingCode;
      copyText(codeToCopy, btnCopyCode, copyPinHtml);
    });
  }
  if (btnBannerCopyOverlay) {
    btnBannerCopyOverlay.addEventListener('click', () => copyText(bannerOverlayUrl ? bannerOverlayUrl.value : `${proto}//${host}/overlay?code=${encodeURIComponent(streamId)}`, btnBannerCopyOverlay, copyUrlHtml));
  }
  if (btnCopyGoalUrl) {
    btnCopyGoalUrl.addEventListener('click', () => copyText(inputGoalUrl ? inputGoalUrl.value : `${proto}//${host}/goal?code=${encodeURIComponent(streamId)}`, btnCopyGoalUrl, copyUrlHtml));
  }

  // 3. Quick Amount Chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      inputAmount.value = chip.dataset.amt;
    });
  });

  // 4. Voice Controls & Speed Presets
  if (rangeSpeed) {
    rangeSpeed.addEventListener('input', () => {
      if (speedVal) speedVal.textContent = parseFloat(rangeSpeed.value).toFixed(2) + 'x';
    });
  }

  speedPresets.forEach(preset => {
    preset.addEventListener('click', () => {
      const spd = preset.getAttribute('data-speed');
      if (rangeSpeed) {
        rangeSpeed.value = spd;
        if (speedVal) speedVal.textContent = parseFloat(spd).toFixed(2) + 'x';
      }
    });
  });

  const REGIONAL_TEMPLATES = {
    'en-IN': {
      lang: 'en-IN',
      sample: 'Thank you, Rohit Sharma! Received 100 rupees on PhonePe. Clutch this 1v3 bro!',
      preview: 'Template: "Thank you, [Sender]! Received [Amount] rupees on [App]."'
    },
    'hi': {
      lang: 'hi',
      sample: 'धन्यवाद रोहित शर्मा! PhonePe पर 100 रुपये प्राप्त हुए। क्लच करो भाई!',
      preview: 'Template: "धन्यवाद [Sender]! [App] पर [Amount] रुपये प्राप्त हुए।"'
    },
    'ta': {
      lang: 'ta',
      sample: 'நன்றி ரோஹித் சர்மா! PhonePe மூலம் 100 ரூபாய் பெறப்பட்டது. அருமை ப்ரோ!',
      preview: 'Template: "நன்றி [Sender]! [App] மூலம் [Amount] ரூபாய் பெறப்பட்டது."'
    },
    'te': {
      lang: 'te',
      sample: 'ధన్యవాదాలు రోహిత్ శర్మ! PhonePe ద్వారా 100 రూపాయలు వచ్చాయి. సూపర్ బ్రో!',
      preview: 'Template: "ధన్యవాదాలు [Sender]! [App] ద్వారా [Amount] రూపాయలు వచ్చాయి."'
    },
    'kn': {
      lang: 'kn',
      sample: 'ಧನ್ಯವಾದಗಳು ರೋಹಿತ್ ಶರ್ಮಾ! PhonePe ನಲ್ಲಿ 100 ರೂಪಾಯಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಸೂಪರ್ ಬ್ರೋ!',
      preview: 'Template: "ಧನ್ಯವಾದಗಳು [Sender]! [App] ನಲ್ಲಿ [Amount] ರೂಪಾಯಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ."'
    },
    'ml': {
      lang: 'ml',
      sample: 'നന്ദി രോഹിത് ശർമ്മ! PhonePe വഴി 100 രൂപ ലഭിച്ചു. പൊളിച്ചു ബ്രോ!',
      preview: 'Template: "നന്ദി [Sender]! [App] വഴി [Amount] രൂപ ലഭിച്ചു."'
    },
    'bn': {
      lang: 'bn',
      sample: 'ধন্যবাদ রোহিত শর্মা! PhonePe এ 100 টাকা গ্রহণ করা হয়েছে। ফাটিয়ে দাও ব্রੋ!',
      preview: 'Template: "ধন্যবাদ [Sender]! [App] এ [Amount] টাকা গ্রহণ করা হয়েছে."'
    },
    'mr': {
      lang: 'mr',
      sample: 'धन्यवाद रोहित शर्मा! PhonePe वर 100 रुपये मिळाले. भारी खेळ भावा!',
      preview: 'Template: "धन्यवाद [Sender]! [App] वर [Amount] रुपये मिळाले."'
    },
    'gu': {
      lang: 'gu',
      sample: 'આભાર રોહિત શર્મા! PhonePe પર 100 રૂપિયા મળ્યા. જબરદસ્ત બ્રો!',
      preview: 'Template: "આભાર [Sender]! [App] પર [Amount] રૂપિયા મળ્યા."'
    },
    'pa': {
      lang: 'pa',
      sample: 'ਧੰਨਵਾਦ ਰੋਹਿਤ ਸ਼ਰਮਾ! PhonePe \'ਤੇ 100 ਰੁਪਏ ਪ੍ਰਾਪਤ ਹੋਏ। ਛਾ ਗਏ ਬ੍ਰੋ!',
      preview: 'Template: "ਧੰਨਵਾਦ [Sender]! [App] \'ਤੇ [Amount] ਰੁਪਏ ਪ੍ਰਾਪਤ ਹੋਏ."'
    },
    'hinglish': {
      lang: 'hi',
      sample: 'Shukriya Rohit Sharma! PhonePe par 100 rupaye receive hue. Clutch this 1v3 bro!',
      preview: 'Template: "Shukriya [Sender]! [App] par [Amount] rupaye receive hue."'
    }
  };

  const PERSONA_CONFIG = {
    standard: { pitch: 1.0, speedMul: 1.0, preservesPitch: true, desc: 'Standard Natural Voice' },
    own_voice: { pitch: 1.0, speedMul: 1.0, preservesPitch: true, desc: "Streamer's Own Voice" },
    esports_caster: { pitch: 1.05, speedMul: 1.20, preservesPitch: true, desc: 'Esports Hype Caster' },
    deep_bass: { pitch: 0.82, speedMul: 0.92, preservesPitch: false, desc: 'Deep Bass Radio Host' },
    anime: { pitch: 1.30, speedMul: 1.08, preservesPitch: false, desc: 'Kawaii Anime Companion' },
    cyber_robot: { pitch: 0.88, speedMul: 0.95, preservesPitch: false, desc: 'Cybernetic Synth Android' },
    custom: { pitch: 1.0, speedMul: 1.0, preservesPitch: false, desc: 'Custom Tuned' }
  };

  function updateVoiceStudioVisibility() {
    const val = selectVoicePersona ? selectVoicePersona.value : 'standard';
    if (ownVoiceStudio) {
      ownVoiceStudio.style.display = (val === 'own_voice') ? 'block' : 'none';
    }
    if (customPitchWrap) {
      customPitchWrap.style.display = (val === 'custom') ? 'flex' : 'none';
    }
  }

  if (selectVoiceLang) {
    selectVoiceLang.addEventListener('change', () => {
      const selected = selectVoiceLang.value;
      if (REGIONAL_TEMPLATES[selected] && voicePreviewPhrase) {
        voicePreviewPhrase.textContent = REGIONAL_TEMPLATES[selected].preview;
      }
      saveSettings();
    });
  }

  if (selectVoicePersona) {
    selectVoicePersona.addEventListener('change', () => {
      const isPro = currentSubscription && (currentSubscription.plan === 'pro' || currentSubscription.plan === 'pro_trial');
      if (selectVoicePersona.value !== 'standard' && !isPro) {
        alert("Custom Voice and Streamer's Own Voice are exclusive to Creator Pro. Activate your free trial or upgrade.");
        selectVoicePersona.value = 'standard';
        if (modalSubscription) modalSubscription.style.display = 'flex';
        updateVoiceStudioVisibility();
        return;
      }
      updateVoiceStudioVisibility();
      saveSettings();
    });
  }

  // Handle Own Voice Playback Mode Radio Changes
  document.querySelectorAll('input[name="ov-mode"]').forEach(radio => {
    radio.addEventListener('change', () => {
      saveSettings();
    });
  });

  // Own Voice Studio Tabs
  if (ovTabRec && ovTabUpload) {
    ovTabRec.addEventListener('click', () => {
      ovTabRec.classList.add('active');
      ovTabUpload.classList.remove('active');
      if (ovPaneRec) ovPaneRec.style.display = 'block';
      if (ovPaneUpload) ovPaneUpload.style.display = 'none';
    });
    ovTabUpload.addEventListener('click', () => {
      ovTabUpload.classList.add('active');
      ovTabRec.classList.remove('active');
      if (ovPaneRec) ovPaneRec.style.display = 'none';
      if (ovPaneUpload) ovPaneUpload.style.display = 'block';
    });
  }

  // Live Mic Recording
  let mediaStream = null;
  if (btnRecordVoice) {
    btnRecordVoice.addEventListener('click', async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('Microphone recording is not supported in this browser. Please upload an audio file instead.');
          return;
        }
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          recordedBlob = new Blob(audioChunks, { type: 'audio/webm' });
          if (ovPreviewPlayer) {
            ovPreviewPlayer.src = URL.createObjectURL(recordedBlob);
          }
          if (ovRecordedReview) ovRecordedReview.style.display = 'block';
          if (ovRecTimer) ovRecTimer.style.display = 'none';
          if (ovRecWave) ovRecWave.style.display = 'none';
          if (btnRecordVoice) btnRecordVoice.style.display = 'none';
          if (btnStopVoice) btnStopVoice.style.display = 'none';
        };

        mediaRecorder.start(100);
        btnRecordVoice.style.display = 'none';
        btnStopVoice.style.display = 'inline-flex';
        if (ovRecTimer) ovRecTimer.style.display = 'block';
        if (ovRecWave) ovRecWave.style.display = 'flex';
        if (ovRecordedReview) ovRecordedReview.style.display = 'none';

        recordSeconds = 0;
        if (ovRecTimer) ovRecTimer.textContent = '00:00';
        clearInterval(recordTimerInterval);
        recordTimerInterval = setInterval(() => {
          recordSeconds++;
          const mins = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
          const secs = String(recordSeconds % 60).padStart(2, '0');
          if (ovRecTimer) ovRecTimer.textContent = `${mins}:${secs}`;
          if (recordSeconds >= 30) {
            stopRecording();
          }
        }, 1000);
      } catch (err) {
        console.error('Microphone access denied:', err);
        alert('Microphone access denied. Please grant microphone permissions or upload an audio file.');
      }
    });
  }

  function stopRecording() {
    clearInterval(recordTimerInterval);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      mediaStream = null;
    }
  }

  if (btnStopVoice) {
    btnStopVoice.addEventListener('click', stopRecording);
  }

  if (btnDiscardVoice) {
    btnDiscardVoice.addEventListener('click', () => {
      recordedBlob = null;
      if (ovPreviewPlayer) ovPreviewPlayer.src = '';
      if (ovRecordedReview) ovRecordedReview.style.display = 'none';
      if (btnRecordVoice) btnRecordVoice.style.display = 'inline-flex';
      if (btnStopVoice) btnStopVoice.style.display = 'none';
      if (ovRecTimer) ovRecTimer.style.display = 'none';
      if (ovRecWave) ovRecWave.style.display = 'none';
    });
  }

  // Save Recorded Voice
  if (btnSaveRecordedVoice) {
    btnSaveRecordedVoice.addEventListener('click', () => {
      if (!recordedBlob) return;
      btnSaveRecordedVoice.disabled = true;
      btnSaveRecordedVoice.innerHTML = '<span>Saving Voice...</span>';

      const reader = new FileReader();
      reader.onloadend = () => {
        uploadVoicePayload(reader.result, 'My_Live_Voice_Recording.webm');
      };
      reader.readAsDataURL(recordedBlob);
    });
  }

  // File Upload
  if (ovFileInput) {
    ovFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (file.size > 25 * 1024 * 1024) {
        alert('File size exceeds 25 MB limit.');
        return;
      }
      if (ovUploadProgress) ovUploadProgress.style.display = 'block';

      const reader = new FileReader();
      reader.onloadend = () => {
        uploadVoicePayload(reader.result, file.name);
      };
      reader.readAsDataURL(file);
    });
  }

  function uploadVoicePayload(audioData, fileName) {
    const activeModeEl = document.querySelector('input[name="ov-mode"]:checked');
    const mode = activeModeEl ? activeModeEl.value : 'intro';

    fetch(`/api/upload-voice?code=${encodeURIComponent(streamId)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({
        audioData,
        fileName,
        ownVoiceMode: mode
      })
    })
    .then(r => r.json())
    .then(data => {
      if (btnSaveRecordedVoice) {
        btnSaveRecordedVoice.disabled = false;
        btnSaveRecordedVoice.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:3px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> <span>Save &amp; Activate on Stream</span>';
      }
      if (ovUploadProgress) ovUploadProgress.style.display = 'none';

      if (data.success && data.settings) {
        currentSettings = { ...currentSettings, ...data.settings };
        if (selectVoicePersona) selectVoicePersona.value = 'own_voice';
        updateVoiceStudioVisibility();
        renderActiveOwnVoice(currentSettings);
        alert('Your Own Voice has been saved and activated for live stream alerts.');
      } else {
        alert('Upload failed: ' + (data.error || 'Server error'));
      }
    })
    .catch(err => {
      if (btnSaveRecordedVoice) btnSaveRecordedVoice.disabled = false;
      if (ovUploadProgress) ovUploadProgress.style.display = 'none';
      alert('Error uploading voice file: ' + err.message);
    });
  }

  function renderActiveOwnVoice(settings) {
    if (settings && settings.ownVoiceUrl) {
      if (ovStatusCard) ovStatusCard.style.display = 'flex';
      if (ovActiveName) ovActiveName.textContent = settings.ownVoiceOriginalName || 'My Voice Clip';
      if (settings.ownVoiceMode) {
        const rad = document.querySelector(`input[name="ov-mode"][value="${settings.ownVoiceMode}"]`);
        if (rad) rad.checked = true;
      }
    } else {
      if (ovStatusCard) ovStatusCard.style.display = 'none';
    }
  }

  if (btnPlayOwnVoice) {
    btnPlayOwnVoice.addEventListener('click', () => {
      if (currentSettings && currentSettings.ownVoiceUrl) {
        currentOwnVoiceAudio.src = currentSettings.ownVoiceUrl;
        currentOwnVoiceAudio.play().catch(e => console.warn(e));
      }
    });
  }

  if (btnDeleteOwnVoice) {
    btnDeleteOwnVoice.addEventListener('click', () => {
      if (!confirm('Reset your custom voice to standard?')) return;
      fetch(`/api/reset-voice?code=${encodeURIComponent(streamId)}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        }
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          currentSettings = { ...currentSettings, ...data.settings };
          if (selectVoicePersona) selectVoicePersona.value = 'standard';
          updateVoiceStudioVisibility();
          renderActiveOwnVoice(currentSettings);
        }
      });
    });
  }

  if (rangePitch) {
    rangePitch.addEventListener('input', () => {
      if (pitchVal) pitchVal.textContent = parseFloat(rangePitch.value).toFixed(2) + 'x';
    });
    rangePitch.addEventListener('change', () => {
      const isPro = currentSubscription && (currentSubscription.plan === 'pro' || currentSubscription.plan === 'pro_trial');
      if (!isPro && parseFloat(rangePitch.value) !== 1.0) {
        alert('Custom Pitch & Tone Modulator is exclusive to Creator Pro. Upgrade to unlock.');
        rangePitch.value = '1.00';
        if (pitchVal) pitchVal.textContent = '1.00x';
        if (modalSubscription) modalSubscription.style.display = 'flex';
        return;
      }
      saveSettings();
    });
  }

  const saveBtnDefaultHtml = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:3px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> <span>Save Settings</span>';

  function saveSettings() {
    const activeModeEl = document.querySelector('input[name="ov-mode"]:checked');
    const payload = {
      voiceSpeed: parseFloat(rangeSpeed ? rangeSpeed.value : 0.70) || 0.70,
      voiceLanguage: selectVoiceLang ? selectVoiceLang.value : 'en-IN',
      voicePersona: selectVoicePersona ? selectVoicePersona.value : 'standard',
      voicePitch: parseFloat(rangePitch ? rangePitch.value : 1.00) || 1.00,
      ownVoiceMode: activeModeEl ? activeModeEl.value : 'intro',
      minAlertAmount: parseFloat(inputMinAlert ? inputMinAlert.value : 10) || 10,
      minTtsAmount: parseFloat(inputMinTts ? inputMinTts.value : 20) || 20,
      censorProfanity: checkCensor ? checkCensor.checked : true,
      discordWebhookUrl: inputDiscordWebhook ? inputDiscordWebhook.value.trim() : '',
      discordWebhookEnabled: checkDiscordEnabled ? checkDiscordEnabled.checked : false,
      goalTitle: inputGoalTitle ? inputGoalTitle.value.trim() : 'Live Stream Goal',
      goalTarget: parseFloat(inputGoalTarget ? inputGoalTarget.value : 1000) || 1000,
      goalCurrent: parseFloat(inputGoalCurrent ? inputGoalCurrent.value : 0) || 0,
      goalTheme: selectGoalTheme ? selectGoalTheme.value : 'default',
      goalEnabled: checkGoalEnabled ? checkGoalEnabled.checked : true
    };

    if (btnSaveSettings) {
      btnSaveSettings.disabled = true;
      btnSaveSettings.innerHTML = '<span>Saving...</span>';
    }

    fetch(`/api/settings?code=${encodeURIComponent(streamId)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify(payload)
    }).then(r => r.json()).then(data => {
      if (data && data.settings) {
        currentSettings = { ...currentSettings, ...data.settings };
      }
      if (btnSaveSettings) {
        btnSaveSettings.innerHTML = '<span>Saved</span>';
        setTimeout(() => {
          btnSaveSettings.disabled = false;
          btnSaveSettings.innerHTML = saveBtnDefaultHtml;
        }, 1500);
      }
    }).catch(() => {
      if (btnSaveSettings) {
        btnSaveSettings.disabled = false;
        btnSaveSettings.innerHTML = saveBtnDefaultHtml;
      }
    });
  }

  if (btnSaveSettings) btnSaveSettings.addEventListener('click', saveSettings);
  if (inputMinAlert) inputMinAlert.addEventListener('change', saveSettings);
  if (inputMinTts) inputMinTts.addEventListener('change', saveSettings);
  if (checkCensor) checkCensor.addEventListener('change', saveSettings);

  // Goal Status Message Helper
  function showGoalStatus(text, isError = false) {
    if (!goalStatusMsg) return;
    goalStatusMsg.textContent = text;
    goalStatusMsg.style.display = 'block';
    goalStatusMsg.style.background = isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)';
    goalStatusMsg.style.border = isError ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)';
    goalStatusMsg.style.color = isError ? '#f87171' : '#34d399';
    setTimeout(() => {
      goalStatusMsg.style.display = 'none';
    }, 4000);
  }

  if (btnSaveGoal) {
    btnSaveGoal.addEventListener('click', () => {
      saveSettings();
      showGoalStatus('Stream Goal settings saved!');
    });
  }

  if (checkGoalEnabled) {
    checkGoalEnabled.addEventListener('change', () => {
      saveSettings();
      showGoalStatus(checkGoalEnabled.checked ? 'Goal bar enabled' : 'Goal bar disabled');
    });
  }

  if (btnResetGoal) {
    btnResetGoal.addEventListener('click', () => {
      if (!confirm('Are you sure you want to reset current goal raised to ₹0?')) return;
      fetch(`/api/goal/reset?code=${encodeURIComponent(streamId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        }
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          if (inputGoalCurrent) inputGoalCurrent.value = 0;
          showGoalStatus('Goal progress reset to ₹0');
        }
      });
    });
  }

  if (btnBumpGoal) {
    btnBumpGoal.addEventListener('click', () => {
      fetch(`/api/goal/bump?code=${encodeURIComponent(streamId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ amount: 100 })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          if (inputGoalCurrent) inputGoalCurrent.value = data.goalCurrent;
          showGoalStatus('⚡ Test +₹100 added to Goal!');
        }
      });
    });
  }

  // Discord Webhook Handlers
  function showDiscordStatus(text, isError = false) {
    if (!discordStatusMsg) return;
    discordStatusMsg.textContent = text;
    discordStatusMsg.style.display = 'block';
    discordStatusMsg.style.background = isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)';
    discordStatusMsg.style.border = isError ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)';
    discordStatusMsg.style.color = isError ? '#f87171' : '#34d399';
    setTimeout(() => {
      discordStatusMsg.style.display = 'none';
    }, 5000);
  }

  if (btnSaveDiscord) {
    btnSaveDiscord.addEventListener('click', () => {
      saveSettings();
      showDiscordStatus('Discord Webhook configuration saved!');
    });
  }

  if (checkDiscordEnabled) {
    checkDiscordEnabled.addEventListener('change', () => {
      saveSettings();
      showDiscordStatus(checkDiscordEnabled.checked ? 'Discord announcements enabled' : 'Discord announcements disabled');
    });
  }

  if (btnTestDiscord) {
    btnTestDiscord.addEventListener('click', () => {
      const url = (inputDiscordWebhook ? inputDiscordWebhook.value : '').trim();
      if (!url) {
        showDiscordStatus('Please enter your Discord Webhook URL first.', true);
        return;
      }
      btnTestDiscord.disabled = true;
      btnTestDiscord.innerHTML = '<span>Sending...</span>';

      fetch('/api/test-discord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ webhookUrl: url })
      })
      .then(r => r.json())
      .then(data => {
        btnTestDiscord.disabled = false;
        btnTestDiscord.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="#5865F2" style="vertical-align:middle; margin-right:3px;"><polygon points="5 3 19 12 5 21 5 3"/></svg> <span>Send Test Announcement</span>';
        if (data.success) {
          showDiscordStatus('✅ ' + data.message);
        } else {
          showDiscordStatus('❌ ' + (data.error || 'Failed to send webhook'), true);
        }
      })
      .catch(err => {
        btnTestDiscord.disabled = false;
        btnTestDiscord.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="#5865F2" style="vertical-align:middle; margin-right:3px;"><polygon points="5 3 19 12 5 21 5 3"/></svg> <span>Send Test Announcement</span>';
        showDiscordStatus('❌ Connection error: ' + err.message, true);
      });
    });
  }

  const previewVoiceDefaultHtml = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:3px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> <span>Preview Voice</span>';
  const fireTestDefaultHtml = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; margin-right:4px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> <span>Trigger Test Alert</span>';

  // Voice Test Preview in Selected Regional Language, Custom Voice Persona, or Streamer's Own Voice
  if (btnTestVoice) {
    btnTestVoice.addEventListener('click', () => {
      btnTestVoice.disabled = true;
      btnTestVoice.innerHTML = '<span>Playing...</span>';

      const personaKey = selectVoicePersona ? selectVoicePersona.value : 'standard';

      // Streamer's Own Voice Preview
      if (personaKey === 'own_voice') {
        if (!currentSettings || !currentSettings.ownVoiceUrl) {
          alert("You haven't recorded or uploaded your voice yet. Use the Record or Upload options in the Own Voice Studio above.");
          btnTestVoice.disabled = false;
          btnTestVoice.innerHTML = previewVoiceDefaultHtml;
          return;
        }

        const mode = currentSettings.ownVoiceMode || 'intro';
        const ownAudio = new Audio(currentSettings.ownVoiceUrl);

        if (mode === 'alert_sound' || mode === 'full') {
          ownAudio.play().finally(() => {
            setTimeout(() => {
              btnTestVoice.disabled = false;
              btnTestVoice.innerHTML = previewVoiceDefaultHtml;
            }, 3000);
          });
          return;
        }

        // Mode 'intro': plays streamer's own voice, followed by regional announcement TTS
        ownAudio.onended = () => {
          playSampleRegionalTts();
        };
        ownAudio.onerror = () => {
          playSampleRegionalTts();
        };
        ownAudio.play().catch(() => {
          playSampleRegionalTts();
        });
        return;
      }

      playSampleRegionalTts();

      function playSampleRegionalTts() {
        const langKey = selectVoiceLang ? selectVoiceLang.value : 'en-IN';
        const config = REGIONAL_TEMPLATES[langKey] || REGIONAL_TEMPLATES['en-IN'];
        const sampleText = config.sample;

        const persona = PERSONA_CONFIG[personaKey] || PERSONA_CONFIG.standard;
        const userPitch = rangePitch ? parseFloat(rangePitch.value) : 1.00;
        const finalPitch = personaKey === 'custom' ? userPitch : persona.pitch;
        const baseSpeed = parseFloat(rangeSpeed ? rangeSpeed.value : 0.70) || 0.70;
        const finalSpeed = (baseSpeed * persona.speedMul).toFixed(2);

        const audio = new Audio(`/api/tts?text=${encodeURIComponent(sampleText)}&lang=${encodeURIComponent(config.lang)}&speed=${finalSpeed}`);
        
        if (!persona.preservesPitch || personaKey === 'custom') {
          audio.preservesPitch = false;
          if ('mozPreservesPitch' in audio) audio.mozPreservesPitch = false;
          if ('webkitPreservesPitch' in audio) audio.webkitPreservesPitch = false;
          audio.playbackRate = finalPitch;
        }

        audio.play().finally(() => {
          setTimeout(() => {
            btnTestVoice.disabled = false;
            btnTestVoice.innerHTML = previewVoiceDefaultHtml;
          }, 3500);
        });
      }
    });
  }

  // 5. Test Alert Submission
  if (testForm) {
    testForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = inputAmount.value;
      const appName = inputApp.value;
      const senderName = inputSender.value.trim() || 'Anonymous';
      const note = inputNote.value.trim();

      btnFireTest.disabled = true;
      btnFireTest.innerHTML = '<span>Dispatching...</span>';

      fetch(`/api/test?code=${encodeURIComponent(streamId)}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ amount, appName, senderName, note })
      }).then(() => {
        btnFireTest.innerHTML = '<span>Alert Sent to Stream!</span>';
        setTimeout(() => {
          btnFireTest.disabled = false;
          btnFireTest.innerHTML = fireTestDefaultHtml;
        }, 1500);
      }).catch(err => {
        alert('Error: ' + err.message);
        btnFireTest.disabled = false;
        btnFireTest.innerHTML = fireTestDefaultHtml;
      });
    });
  }

  // 6. Subscription Management
  function renderSubscription(sub) {
    if (!sub) return;
    currentSubscription = sub;
    const isPaidPro = sub.plan === 'pro';
    const isTrial = sub.plan === 'pro_trial';
    const isPro = isPaidPro || isTrial;

    if (voiceProBadge) {
      if (isPaidPro) {
        voiceProBadge.textContent = 'PRO UNLOCKED';
        voiceProBadge.style.background = 'linear-gradient(135deg, #00f0ff, #6366f1)';
        voiceProBadge.style.color = '#000';
      } else if (isTrial) {
        voiceProBadge.textContent = 'PRO TRIAL';
        voiceProBadge.style.background = 'linear-gradient(135deg, #00f0ff, #6366f1)';
        voiceProBadge.style.color = '#000';
      } else {
        voiceProBadge.textContent = 'PRO EXCLUSIVE';
        voiceProBadge.style.background = 'rgba(239, 68, 68, 0.2)';
        voiceProBadge.style.color = '#f87171';
        if (selectVoicePersona && selectVoicePersona.value !== 'standard') {
          selectVoicePersona.value = 'standard';
        }
      }
    }

    if (goalProBadge) {
      if (isPaidPro) {
        goalProBadge.textContent = 'PRO';
        goalProBadge.style.background = 'linear-gradient(135deg, #00f0ff, #6366f1)';
        goalProBadge.style.color = '#000';
      } else if (isTrial) {
        goalProBadge.textContent = 'TRIAL';
        goalProBadge.style.background = 'linear-gradient(135deg, #00f0ff, #6366f1)';
        goalProBadge.style.color = '#000';
      } else {
        goalProBadge.textContent = 'LOCKED';
        goalProBadge.style.background = 'rgba(239, 68, 68, 0.2)';
        goalProBadge.style.color = '#f87171';
      }
    }

    if (goalLockedBanner) {
      goalLockedBanner.style.display = isPro ? 'none' : 'block';
    }

    const mediaLockedBanner = document.getElementById('media-locked-banner');
    if (mediaLockedBanner) {
      mediaLockedBanner.style.display = isPro ? 'none' : 'block';
    }

    if (planName) {
      if (isPaidPro) {
        planName.textContent = 'Creator Pro (No Watermark)';
      } else if (isTrial) {
        planName.textContent = 'Creator Pro (Trial • Watermark)';
      } else {
        planName.textContent = 'Creator Free (SRB STUDIOS Watermark)';
      }
    }

    if (btnSelectFree && btnSelectPro) {
      if (isPaidPro) {
        btnSelectPro.textContent = 'Active: Creator Pro (Unbranded)';
        btnSelectPro.className = 'btn btn-primary btn-block';
        btnSelectFree.textContent = 'Switch to Free Plan (With Watermark)';
        btnSelectFree.className = 'btn btn-secondary btn-block';
        if (planBoxPro) planBoxPro.classList.add('active-pro');
        if (planBoxFree) planBoxFree.classList.remove('active-pro');
      } else {
        btnSelectFree.textContent = isTrial ? 'Switch to Free Plan' : 'Active (Creator Free)';
        btnSelectFree.className = isTrial ? 'btn btn-secondary btn-block' : 'btn btn-primary btn-block';
        btnSelectPro.textContent = 'Upgrade to Pro (Custom Voices & No Watermark)';
        btnSelectPro.className = isTrial ? 'btn btn-primary btn-block' : 'btn btn-secondary btn-block';
        if (planBoxPro) planBoxPro.classList.remove('active-pro');
        if (planBoxFree) planBoxFree.classList.add('active-pro');
      }
    }
  }

  function setPlan(plan) {
    fetch(`/api/subscription/upgrade?code=${encodeURIComponent(streamId)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({ plan })
    })
    .then(r => r.json())
    .then(res => {
      if (res.subscription) renderSubscription(res.subscription);
    });
  }

  if (btnSubscription && modalSubscription) {
    btnSubscription.addEventListener('click', () => {
      modalSubscription.style.display = 'flex';
    });
  }
  if (btnCloseSubscriptionModal && modalSubscription) {
    btnCloseSubscriptionModal.addEventListener('click', () => {
      modalSubscription.style.display = 'none';
    });
  }
  if (modalSubscription) {
    modalSubscription.addEventListener('click', (e) => {
      if (e.target === modalSubscription) modalSubscription.style.display = 'none';
    });
  }

  if (btnSelectFree) btnSelectFree.addEventListener('click', () => setPlan('free'));

  // Live UPI Checkout Modal Elements & Logic
  const modalUpiCheckout = document.getElementById('modal-upi-checkout');
  const btnCloseCheckoutModal = document.getElementById('btn-close-checkout-modal');
  const checkoutQrImg = document.getElementById('checkout-qr-img');
  const checkoutUpiLink = document.getElementById('checkout-upi-link');
  const checkoutUpiVal = document.getElementById('checkout-upi-val');
  const btnCopyCheckoutUpi = document.getElementById('btn-copy-checkout-upi');
  const inputPaymentUtr = document.getElementById('input-payment-utr');
  const btnVerifyPayment = document.getElementById('btn-verify-payment');
  const checkoutStatusMsg = document.getElementById('checkout-status-msg');

  let activeCheckoutInfo = null;

  function openUpiCheckout() {
    if (modalSubscription) modalSubscription.style.display = 'none';
    if (modalUpiCheckout) {
      modalUpiCheckout.style.display = 'flex';
      if (inputPaymentUtr) inputPaymentUtr.value = '';
      if (checkoutStatusMsg) checkoutStatusMsg.style.display = 'none';
    }

    fetch(`/api/subscription/checkout-info?code=${encodeURIComponent(streamId)}`, {
      headers: { 'Authorization': 'Bearer ' + authToken }
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        activeCheckoutInfo = data;
        if (checkoutUpiVal) checkoutUpiVal.textContent = data.upiId;
        if (checkoutUpiLink) checkoutUpiLink.href = data.upiUri;
        if (checkoutQrImg) {
          checkoutQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.upiUri)}`;
        }
      }
    })
    .catch(err => {
      console.error('[Checkout Error]', err);
    });
  }

  function showCheckoutStatus(text, isError = false) {
    if (!checkoutStatusMsg) return;
    checkoutStatusMsg.textContent = text;
    checkoutStatusMsg.style.display = 'block';
    checkoutStatusMsg.style.background = isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)';
    checkoutStatusMsg.style.border = isError ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)';
    checkoutStatusMsg.style.color = isError ? '#f87171' : '#34d399';
  }

  if (btnCopyCheckoutUpi) {
    btnCopyCheckoutUpi.addEventListener('click', () => {
      const upiToCopy = activeCheckoutInfo ? activeCheckoutInfo.upiId : (checkoutUpiVal ? checkoutUpiVal.textContent : '');
      if (upiToCopy) copyText(upiToCopy, btnCopyCheckoutUpi, '<span>Copy UPI ID</span>');
    });
  }

  if (btnCloseCheckoutModal && modalUpiCheckout) {
    btnCloseCheckoutModal.addEventListener('click', () => {
      modalUpiCheckout.style.display = 'none';
    });
  }

  if (modalUpiCheckout) {
    modalUpiCheckout.addEventListener('click', (e) => {
      if (e.target === modalUpiCheckout) modalUpiCheckout.style.display = 'none';
    });
  }

  if (btnVerifyPayment) {
    btnVerifyPayment.addEventListener('click', () => {
      const utr = (inputPaymentUtr ? inputPaymentUtr.value : '').trim();
      if (!utr || utr.length < 6) {
        showCheckoutStatus('Please enter your 12-digit UPI Reference / UTR Number from your payment app.', true);
        return;
      }

      btnVerifyPayment.disabled = true;
      btnVerifyPayment.innerHTML = '<span>Verifying...</span>';

      fetch(`/api/subscription/submit-payment?code=${encodeURIComponent(streamId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({
          utr,
          orderId: activeCheckoutInfo ? activeCheckoutInfo.orderId : null
        })
      })
      .then(r => r.json())
      .then(res => {
        btnVerifyPayment.disabled = false;
        btnVerifyPayment.innerHTML = '<span>Verify &amp; Activate</span>';

        if (res.success) {
          showCheckoutStatus('🎉 ' + res.message);
          if (res.subscription) renderSubscription(res.subscription);
          if (window.confetti) {
            window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          }
          setTimeout(() => {
            if (modalUpiCheckout) modalUpiCheckout.style.display = 'none';
          }, 2500);
        } else {
          showCheckoutStatus('❌ ' + (res.error || 'Verification failed'), true);
        }
      })
      .catch(err => {
        btnVerifyPayment.disabled = false;
        btnVerifyPayment.innerHTML = '<span>Verify &amp; Activate</span>';
        showCheckoutStatus('❌ Network error: ' + err.message, true);
      });
    });
  }

  if (btnSelectPro) {
    btnSelectPro.addEventListener('click', () => {
      openUpiCheckout();
    });
  }

  // 7. Clear History
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      if (!confirm('Clear all live donation history for this session?')) return;
      fetch(`/api/clear?code=${encodeURIComponent(streamId)}`, { 
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + authToken }
      }).then(() => {
        historyData = [];
        renderHistory([]);
        updateStats({ totalAmount: 0, count: 0, topDonor: { name: 'None', amount: 0 }, average: 0 });
      });
    });
  }

  // 7. Stats & Tables
  function updateStats(stats) {
    if (!stats) return;
    if (statTotal) statTotal.textContent = (stats.totalAmount || 0).toLocaleString('en-IN');
    if (statCount) statCount.textContent = stats.count || 0;
    if (statTop) statTop.textContent = (stats.topDonor && stats.topDonor.name !== 'None') ? stats.topDonor.name : 'None';
    if (statTopAmt) statTopAmt.textContent = (stats.topDonor && stats.topDonor.amount) ? stats.topDonor.amount.toLocaleString('en-IN') : '0';
    if (statAvg) statAvg.textContent = stats.average ? Math.round(stats.average).toLocaleString('en-IN') : '0';
  }

  function getAppTagClass(app) {
    const a = (app || '').toLowerCase();
    if (a.includes('phonepe')) return 'tag-phonepe';
    if (a.includes('google') || a.includes('gpay')) return 'tag-gpay';
    if (a.includes('paytm')) return 'tag-paytm';
    if (a.includes('bhim')) return 'tag-bhim';
    if (a.includes('fam')) return 'tag-fampay';
    if (a.includes('cred')) return 'tag-cred';
    return 'tag-default';
  }

  function renderHistory(list) {
    if (!historyTbody) return;
    if (!list || list.length === 0) {
      historyTbody.innerHTML = `<tr class="empty-row"><td colspan="6">No donations yet. Fire a test alert or send a payment to see it live!</td></tr>`;
      return;
    }
    historyTbody.innerHTML = list.map(item => {
      const time = new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const amt = parseFloat(item.amount) || 0;
      const tagClass = getAppTagClass(item.appName);
      return `
        <tr>
          <td style="color:var(--text-muted); font-size:11px;">${time}</td>
          <td><span class="table-app-tag ${tagClass}">${escapeHtml(item.appName || 'UPI')}</span></td>
          <td style="font-weight:700; color:#fff;">${escapeHtml(item.senderName || 'Anonymous')}</td>
          <td class="table-amount">₹${amt.toLocaleString('en-IN')}</td>
          <td style="max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#cbd5e1;">${escapeHtml(item.note || '—')}</td>
          <td><button class="btn btn-secondary btn-xs" onclick="replayAlert('${item.id}')" title="Replay on Stream"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:3px;"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg><span>Replay</span></button></td>
        </tr>
      `;
    }).join('');
  }

  window.replayAlert = function(id) {
    fetch(`/api/replay?code=${encodeURIComponent(streamId)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({ id })
    });
  };

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 8. Show Toast Preview on Dashboard
  function showDashboardToast(payment) {
    if (!dashToast) return;
    toastSender.textContent = payment.senderName || 'Anonymous';
    toastNote.textContent = payment.note || 'via ' + (payment.appName || 'UPI');
    toastAmount.textContent = payment.amount;

    dashToast.classList.add('show');
    try {
      if (dashSound) {
        dashSound.currentTime = 0;
        dashSound.play().catch(() => {});
      }
    } catch (_) {}

    setTimeout(() => {
      dashToast.classList.remove('show');
    }, 4500);
  }

  // 9. WebSocket Connection
  function connectWs() {
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProto}//${host}/?token=${encodeURIComponent(authToken)}&code=${encodeURIComponent(streamId)}`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (connStatus) {
        connStatus.className = 'status-badge connected';
        connStatus.innerHTML = `<span class="status-dot"></span><span class="status-text">Connected</span>`;
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'INIT') {
          if (msg.data.pairingCode) {
            pairingCode = String(msg.data.pairingCode);
            updatePairingUI(pairingCode, msg.data.streamId);
          }
          updateStats(msg.data.stats);
          historyData = msg.data.recent || [];
          renderHistory(historyData);

          if (msg.data.subscription) {
            renderSubscription(msg.data.subscription);
          }

          if (msg.data.settings) {
            currentSettings = { ...currentSettings, ...msg.data.settings };
            if (rangeSpeed) rangeSpeed.value = msg.data.settings.voiceSpeed || 0.70;
            if (speedVal) speedVal.textContent = parseFloat(rangeSpeed ? rangeSpeed.value : 0.70).toFixed(2) + 'x';
            if (inputMinAlert) inputMinAlert.value = msg.data.settings.minAlertAmount || 10;
            if (inputMinTts) inputMinTts.value = msg.data.settings.minTtsAmount || 20;
            if (checkCensor) checkCensor.checked = msg.data.settings.censorProfanity !== false;
            if (msg.data.settings.voiceLanguage && selectVoiceLang) {
              selectVoiceLang.value = msg.data.settings.voiceLanguage;
              if (REGIONAL_TEMPLATES[msg.data.settings.voiceLanguage] && voicePreviewPhrase) {
                voicePreviewPhrase.textContent = REGIONAL_TEMPLATES[msg.data.settings.voiceLanguage].preview;
              }
            }
            if (msg.data.settings.voicePersona && selectVoicePersona) {
              selectVoicePersona.value = msg.data.settings.voicePersona;
            }
            if (msg.data.settings.voicePitch !== undefined && rangePitch) {
              rangePitch.value = parseFloat(msg.data.settings.voicePitch).toFixed(2);
              if (pitchVal) pitchVal.textContent = parseFloat(msg.data.settings.voicePitch).toFixed(2) + 'x';
            }
            if (inputDiscordWebhook && msg.data.settings.discordWebhookUrl !== undefined) {
              inputDiscordWebhook.value = msg.data.settings.discordWebhookUrl || '';
            }
            if (checkDiscordEnabled && msg.data.settings.discordWebhookEnabled !== undefined) {
              checkDiscordEnabled.checked = Boolean(msg.data.settings.discordWebhookEnabled);
            }
            if (inputGoalTitle && msg.data.settings.goalTitle !== undefined) inputGoalTitle.value = msg.data.settings.goalTitle;
            if (inputGoalTarget && msg.data.settings.goalTarget !== undefined) inputGoalTarget.value = msg.data.settings.goalTarget;
            if (inputGoalCurrent && msg.data.settings.goalCurrent !== undefined) inputGoalCurrent.value = msg.data.settings.goalCurrent;
            if (checkGoalEnabled && msg.data.settings.goalEnabled !== undefined) checkGoalEnabled.checked = msg.data.settings.goalEnabled !== false;
            if (selectGoalTheme && msg.data.settings.goalTheme !== undefined) {
              selectGoalTheme.value = msg.data.settings.goalTheme;
              updateOverlayUrls(streamId);
            }
            updateVoiceStudioVisibility();
            renderActiveOwnVoice(currentSettings);
            renderActiveMedia(currentSettings);
          }
        } else if (msg.type === 'SETTINGS_UPDATED') {
          if (msg.data) {
            currentSettings = { ...currentSettings, ...msg.data };
            if (msg.data.voiceLanguage && selectVoiceLang) {
              selectVoiceLang.value = msg.data.voiceLanguage;
              if (REGIONAL_TEMPLATES[msg.data.voiceLanguage] && voicePreviewPhrase) {
                voicePreviewPhrase.textContent = REGIONAL_TEMPLATES[msg.data.voiceLanguage].preview;
              }
            }
            if (msg.data.voicePersona && selectVoicePersona) {
              selectVoicePersona.value = msg.data.voicePersona;
            }
            if (msg.data.voicePitch !== undefined && rangePitch) {
              rangePitch.value = parseFloat(msg.data.voicePitch).toFixed(2);
              if (pitchVal) pitchVal.textContent = parseFloat(msg.data.voicePitch).toFixed(2) + 'x';
            }
            if (inputDiscordWebhook && msg.data.discordWebhookUrl !== undefined) {
              inputDiscordWebhook.value = msg.data.discordWebhookUrl || '';
            }
            if (checkDiscordEnabled && msg.data.discordWebhookEnabled !== undefined) {
              checkDiscordEnabled.checked = Boolean(msg.data.discordWebhookEnabled);
            }
            if (inputGoalTitle && msg.data.goalTitle !== undefined) inputGoalTitle.value = msg.data.goalTitle;
            if (inputGoalTarget && msg.data.goalTarget !== undefined) inputGoalTarget.value = msg.data.goalTarget;
            if (inputGoalCurrent && msg.data.goalCurrent !== undefined) inputGoalCurrent.value = msg.data.goalCurrent;
            if (checkGoalEnabled && msg.data.goalEnabled !== undefined) checkGoalEnabled.checked = msg.data.goalEnabled !== false;
            if (selectGoalTheme && msg.data.goalTheme !== undefined) {
              selectGoalTheme.value = msg.data.goalTheme;
              updateOverlayUrls(streamId);
            }
            updateVoiceStudioVisibility();
            renderActiveOwnVoice(currentSettings);
            renderActiveMedia(currentSettings);
          }
        } else if (msg.type === 'GOAL_UPDATED') {
          if (msg.data) {
            if (inputGoalTitle && msg.data.goalTitle !== undefined) inputGoalTitle.value = msg.data.goalTitle;
            if (inputGoalTarget && msg.data.goalTarget !== undefined) inputGoalTarget.value = msg.data.goalTarget;
            if (inputGoalCurrent && msg.data.goalCurrent !== undefined) inputGoalCurrent.value = msg.data.goalCurrent;
            if (checkGoalEnabled && msg.data.goalEnabled !== undefined) checkGoalEnabled.checked = msg.data.goalEnabled !== false;
            const newTheme = msg.data.goalTheme || msg.data.theme;
            if (selectGoalTheme && newTheme !== undefined) {
              selectGoalTheme.value = newTheme;
              updateOverlayUrls(streamId);
            }
          }
        } else if (msg.type === 'SUBSCRIPTION_UPDATED') {
          renderSubscription(msg.data);
        } else if (msg.type === 'NEW_PAYMENT') {
          showDashboardToast(msg.data);
          if (msg.data.isTest) {
            historyData.unshift(msg.data);
            renderHistory(historyData);
          }
        } else if (msg.type === 'TABLE_UPDATED') {
          historyData.unshift(msg.data);
          renderHistory(historyData);
        } else if (msg.type === 'STATS_UPDATED') {
          updateStats(msg.data);
        } else if (msg.type === 'HISTORY_CLEARED') {
          historyData = [];
          renderHistory([]);
        }
      } catch (_) {}
    };

    ws.onclose = () => {
      if (connStatus) {
        connStatus.className = 'status-badge connecting';
        connStatus.innerHTML = `<span class="status-dot"></span><span class="status-text">Reconnecting...</span>`;
      }
      setTimeout(connectWs, 3000);
    };
  }

  // Studio Tab Switching (De-congested Column Left)
  const studioTabs = document.querySelectorAll('.studio-tab');
  const studioPanes = document.querySelectorAll('.studio-pane');
  if (studioTabs.length > 0) {
    studioTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.pane;
        studioTabs.forEach(t => t.classList.remove('active'));
        studioPanes.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  }

  // 7. Custom Alert Media Studio (Sound, GIF & Video Memes)
  const activeSoundLabel = document.getElementById('active-sound-label');
  const activeVisualLabel = document.getElementById('active-visual-label');
  const soundPresetBtns = document.querySelectorAll('.btn-sound-preset');
  const visualPresetBtns = document.querySelectorAll('.btn-visual-preset');
  const inputCustomSoundFile = document.getElementById('input-custom-sound-file');
  const btnPlaySoundPreview = document.getElementById('btn-play-sound-preview');
  const btnResetSound = document.getElementById('btn-reset-sound');
  const inputCustomVisualFile = document.getElementById('input-custom-visual-file');
  const btnResetVisual = document.getElementById('btn-reset-visual');
  const inputCustomVisualUrl = document.getElementById('input-custom-visual-url');
  const btnApplyVisualUrl = document.getElementById('btn-apply-visual-url');
  const visualPreviewImg = document.getElementById('visual-preview-img');
  const visualPreviewVideo = document.getElementById('visual-preview-video');
  const visualPreviewEmpty = document.getElementById('visual-preview-empty');
  const btnTestMediaAlert = document.getElementById('btn-test-media-alert');

  function renderActiveMedia(settings) {
    if (!settings) return;
    if (activeSoundLabel) {
      activeSoundLabel.textContent = settings.customAlertSoundName || 'Default Chime';
    }
    if (activeVisualLabel) {
      activeVisualLabel.textContent = settings.customMediaName || 'Default Pulse';
    }
    if (settings.customMediaUrl) {
      if (visualPreviewEmpty) visualPreviewEmpty.style.display = 'none';
      if (settings.customMediaType === 'video') {
        if (visualPreviewVideo) {
          visualPreviewVideo.src = settings.customMediaUrl;
          visualPreviewVideo.style.display = 'block';
        }
        if (visualPreviewImg) visualPreviewImg.style.display = 'none';
      } else {
        if (visualPreviewImg) {
          visualPreviewImg.src = settings.customMediaUrl;
          visualPreviewImg.style.display = 'block';
        }
        if (visualPreviewVideo) visualPreviewVideo.style.display = 'none';
      }
    } else {
      if (visualPreviewEmpty) visualPreviewEmpty.style.display = 'block';
      if (visualPreviewImg) visualPreviewImg.style.display = 'none';
      if (visualPreviewVideo) visualPreviewVideo.style.display = 'none';
    }
  }

  // Sound Presets
  soundPresetBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url;
      const name = btn.dataset.name;
      try {
        new Audio(url).play().catch(() => {});
        const res = await fetch(`/api/upload-media?code=${encodeURIComponent(streamId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaCategory: 'sound',
            mediaUrl: url,
            mediaName: name
          })
        });
        const data = await res.json();
        if (data.success) {
          currentSettings = { ...currentSettings, ...data.settings };
          renderActiveMedia(currentSettings);
        } else {
          alert(data.error || 'Failed to set sound preset');
        }
      } catch (e) {
        console.error(e);
      }
    });
  });

  // Sound File Upload
  if (inputCustomSoundFile) {
    inputCustomSoundFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) {
        alert('Audio file size exceeds 15 MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch(`/api/upload-media?code=${encodeURIComponent(streamId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mediaCategory: 'sound',
              fileData: reader.result,
              fileName: file.name
            })
          });
          const data = await res.json();
          if (data.success) {
            currentSettings = { ...currentSettings, ...data.settings };
            renderActiveMedia(currentSettings);
            new Audio(currentSettings.customAlertSoundUrl).play().catch(() => {});
          } else {
            alert(data.error || 'Failed to upload sound file');
          }
        } catch (err) {
          alert('Upload failed: ' + err.message);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Preview Sound Button
  if (btnPlaySoundPreview) {
    btnPlaySoundPreview.addEventListener('click', () => {
      const soundUrl = (currentSettings && currentSettings.customAlertSoundUrl) ? currentSettings.customAlertSoundUrl : '/sounds/default.wav';
      new Audio(soundUrl).play().catch(e => console.warn(e));
    });
  }

  // Reset Sound Button
  if (btnResetSound) {
    btnResetSound.addEventListener('click', async () => {
      try {
        const res = await fetch(`/api/reset-media?code=${encodeURIComponent(streamId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: 'sound' })
        });
        const data = await res.json();
        if (data.success) {
          currentSettings = { ...currentSettings, ...data.settings };
          renderActiveMedia(currentSettings);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  // Visual Meme Presets
  visualPresetBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url;
      const type = btn.dataset.type;
      const name = btn.dataset.name;
      try {
        if (!url || type === 'none') {
          const res = await fetch(`/api/reset-media?code=${encodeURIComponent(streamId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target: 'visual' })
          });
          const data = await res.json();
          if (data.success) {
            currentSettings = { ...currentSettings, ...data.settings };
            renderActiveMedia(currentSettings);
          }
          return;
        }

        const res = await fetch(`/api/upload-media?code=${encodeURIComponent(streamId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaCategory: 'visual',
            mediaUrl: url,
            mediaName: name
          })
        });
        const data = await res.json();
        if (data.success) {
          currentSettings = { ...currentSettings, ...data.settings };
          renderActiveMedia(currentSettings);
        } else {
          alert(data.error || 'Failed to set visual preset');
        }
      } catch (e) {
        console.error(e);
      }
    });
  });

  // Visual Meme File Upload
  if (inputCustomVisualFile) {
    inputCustomVisualFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 25 * 1024 * 1024) {
        alert('File size exceeds 25 MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch(`/api/upload-media?code=${encodeURIComponent(streamId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mediaCategory: 'visual',
              fileData: reader.result,
              fileName: file.name
            })
          });
          const data = await res.json();
          if (data.success) {
            currentSettings = { ...currentSettings, ...data.settings };
            renderActiveMedia(currentSettings);
          } else {
            alert(data.error || 'Failed to upload meme file');
          }
        } catch (err) {
          alert('Upload failed: ' + err.message);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Apply Visual URL
  if (btnApplyVisualUrl && inputCustomVisualUrl) {
    btnApplyVisualUrl.addEventListener('click', async () => {
      const url = inputCustomVisualUrl.value.trim();
      if (!url) return;
      try {
        const res = await fetch(`/api/upload-media?code=${encodeURIComponent(streamId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaCategory: 'visual',
            mediaUrl: url,
            mediaName: 'External URL'
          })
        });
        const data = await res.json();
        if (data.success) {
          currentSettings = { ...currentSettings, ...data.settings };
          renderActiveMedia(currentSettings);
          inputCustomVisualUrl.value = '';
        } else {
          alert(data.error || 'Failed to set URL');
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  }

  // Reset Visual Button
  if (btnResetVisual) {
    btnResetVisual.addEventListener('click', async () => {
      try {
        const res = await fetch(`/api/reset-media?code=${encodeURIComponent(streamId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: 'visual' })
        });
        const data = await res.json();
        if (data.success) {
          currentSettings = { ...currentSettings, ...data.settings };
          renderActiveMedia(currentSettings);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  // Test Fire Button on OBS Overlay
  if (btnTestMediaAlert) {
    btnTestMediaAlert.addEventListener('click', async () => {
      btnTestMediaAlert.disabled = true;
      btnTestMediaAlert.innerHTML = `<span>⏳ Firing Test...</span>`;
      try {
        await fetch(`/api/payment?code=${encodeURIComponent(streamId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 500,
            senderName: 'Media Pro Supporter',
            appName: 'GooglePay',
            note: 'Testing custom alert sound and visual meme! 🔥'
          })
        });
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => {
          btnTestMediaAlert.disabled = false;
          btnTestMediaAlert.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; margin-right:4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span>🚀 Test Fire on Stream Overlay</span>`;
        }, 1500);
      }
    });
  }

  connectWs();
})();
