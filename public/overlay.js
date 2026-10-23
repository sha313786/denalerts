// Stream Overlay Alert Engine
(function() {
  const alertCard = document.getElementById('alert-card');
  const appBadge = document.getElementById('app-badge');
  const appIcon = document.getElementById('app-icon');
  const appNameEl = document.getElementById('app-name');
  const amountVal = document.getElementById('amount-val');
  const supporterName = document.getElementById('supporter-name');
  const cardFooter = document.getElementById('card-footer');
  const donorMessage = document.getElementById('donor-message');
  const progressBar = document.getElementById('progress-bar');
  const statusEl = document.getElementById('stream-status');
  const cardWatermarkEl = document.getElementById('card-watermark');
  const audioEl = document.getElementById('alert-sound');
  const customAudioEl = document.getElementById('custom-alert-sound') || new Audio();
  const ttsAudioEl = document.getElementById('tts-sound') || new Audio();
  const ownVoiceAudioEl = document.getElementById('own-voice-sound') || new Audio();

  const customMediaWrapper = document.getElementById('custom-media-wrapper');
  const customMediaImg = document.getElementById('custom-media-img');
  const customMediaVideo = document.getElementById('custom-media-video');

  let subscription = { plan: 'pro_trial', features: { watermark: true } };

  function updateWatermark() {
    const isWatermarkActive = subscription && subscription.features ? subscription.features.watermark !== false : true;
    if (cardWatermarkEl) {
      cardWatermarkEl.style.display = isWatermarkActive ? 'flex' : 'none';
    }
  }

  // Initial call so watermark is visible immediately for Trial & Free versions
  updateWatermark();

  const alertQueue = [];
  let isDisplaying = false;
  let ws = null;
  let reconnectTimeout = null;

  // Web Audio Context (Fallback)
  let audioCtx = null;
  function initAudio() {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtx = new AudioContext();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (_) {}
  }

  // Play Alert Sound (Custom Pro sound if set, HTML5 audio default, Web Audio fallback)
  function playSound() {
    try {
      const customSound = alertSettings.customAlertSoundUrl;
      if (customSound && customAudioEl) {
        customAudioEl.src = customSound;
        customAudioEl.currentTime = 0;
        customAudioEl.volume = Math.min(1, Math.max(0, alertSettings.soundVolume !== undefined ? alertSettings.soundVolume : 0.9));
        const playPromise = customAudioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => playDefaultAudio());
        }
        return;
      }
      playDefaultAudio();
    } catch (_) {
      playDefaultAudio();
    }
  }

  function playDefaultAudio() {
    try {
      if (audioEl) {
        audioEl.currentTime = 0;
        audioEl.volume = Math.min(1, Math.max(0, alertSettings.soundVolume !== undefined ? alertSettings.soundVolume : 0.9));
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => playWebAudioChime());
        }
      } else {
        playWebAudioChime();
      }
    } catch (_) {
      playWebAudioChime();
    }
  }

  function playWebAudioChime() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const notes = [1046.50, 1318.51, 1567.98, 2093.00];

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.85);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch (e) {
      console.warn('Web Audio chime failed:', e);
    }
  }

  // Live Alert Settings (Synced from Dashboard via WebSocket)
  let alertSettings = {
    voiceSpeed: 0.70, // 0.70x default speed
    voiceEnabled: true,
    voiceLanguage: 'en-IN',
    soundVolume: 0.9
  };

  let availableVoices = [];
  function loadVoices() {
    if ('speechSynthesis' in window) {
      availableVoices = window.speechSynthesis.getVoices() || [];
    }
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function getSpokenAppName(appName) {
    const name = (appName || '').toLowerCase();
    if (name.includes('phonepe')) return 'PhonePe';
    if (name.includes('google') || name.includes('gpay')) return 'Google Pay';
    if (name.includes('paytm')) return 'Paytm';
    if (name.includes('bhim')) return 'BHIM';
    if (name.includes('cred')) return 'CRED';
    if (name.includes('amazon')) return 'Amazon Pay';
    return appName || 'UPI';
  }

  // Helper to cleanly sanitize donor message, stripping prefixes like "Note:", "note:", "Message:", "सन्देश:", etc.
  function cleanDonorNote(note) {
    if (!note || typeof note !== 'string') return '';
    let clean = note.trim();

    // Strip common bank/app prefixes repeatedly
    const prefixRegex = /^(?:for\s+)?(?:note|message|msg|remarks?)[\s:\-–—]+|^सन्देश[:\s]+|^संदेश[:\s]+|^செய்தி[:\s]+|^సందేశం[:\s]+|^ಸಂದೇಶ[:\s]+|^സന്ദേശം[:\s]+/i;
    while (prefixRegex.test(clean)) {
      clean = clean.replace(prefixRegex, '').trim();
    }

    // Strip standalone leading "note " or "message " or "msg " (without colon)
    clean = clean.replace(/^(?:note|msg|message)\s+/i, '').trim();

    // Strip any leading punctuation left over (like "- ", ": ", etc.)
    clean = clean.replace(/^[\s:\-–—,.]+/, '').trim();

    // Strip system/fallback placeholders so TTS and overlay don't speak useless text
    const lower = clean.toLowerCase();
    const placeholders = [
      'no message provided',
      'payment received',
      'live upi superchat',
      'tested live from streamer app!',
      'tested live from streamer companion app!',
      'tested live from streamer app',
      'upi',
      'payment'
    ];
    if (placeholders.includes(lower)) {
      return '';
    }

    return clean;
  }

  const REGIONAL_TEMPLATES = {
    'en-IN': {
      lang: 'en-IN',
      template: (amt, sender, app) => `Thank you, ${sender}! Received ${amt} rupees on ${app}.`,
      noteTemplate: (note) => `${note}`
    },
    'hi': {
      lang: 'hi',
      template: (amt, sender, app) => `धन्यवाद ${sender}! ${app} पर ${amt} रुपये प्राप्त हुए।`,
      noteTemplate: (note) => `${note}`
    },
    'ta': {
      lang: 'ta',
      template: (amt, sender, app) => `நன்றி ${sender}! ${app} மூலம் ${amt} ரூபாய் பெறப்பட்டது.`,
      noteTemplate: (note) => `${note}`
    },
    'te': {
      lang: 'te',
      template: (amt, sender, app) => `ధన్యవాదాలు ${sender}! ${app} ద్వారా ${amt} రూపాయలు వచ్చాయి.`,
      noteTemplate: (note) => `${note}`
    },
    'kn': {
      lang: 'kn',
      template: (amt, sender, app) => `ಧನ್ಯವಾದಗಳು ${sender}! ${app} ನಲ್ಲಿ ${amt} ರೂಪಾಯಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.`,
      noteTemplate: (note) => `${note}`
    },
    'ml': {
      lang: 'ml',
      template: (amt, sender, app) => `നന്ദി ${sender}! ${app} വഴി ${amt} രൂപ ലഭിച്ചു.`,
      noteTemplate: (note) => `${note}`
    },
    'bn': {
      lang: 'bn',
      template: (amt, sender, app) => `ধন্যবাদ ${sender}! ${app} এ ${amt} টাকা গ্রহণ করা হয়েছে।`,
      noteTemplate: (note) => `${note}`
    },
    'mr': {
      lang: 'mr',
      template: (amt, sender, app) => `धन्यवाद ${sender}! ${app} वर ${amt} रुपये मिळाले.`,
      noteTemplate: (note) => `${note}`
    },
    'gu': {
      lang: 'gu',
      template: (amt, sender, app) => `આભાર ${sender}! ${app} પર ${amt} રૂપિયા મળ્યા.`,
      noteTemplate: (note) => `${note}`
    },
    'pa': {
      lang: 'pa',
      template: (amt, sender, app) => `ਧੰਨਵਾਦ ${sender}! ${app} 'ਤੇ ${amt} ਰੁਪਏ ਪ੍ਰਾਪਤ ਹੋਏ।`,
      noteTemplate: (note) => `${note}`
    },
    'hinglish': {
      lang: 'hi',
      template: (amt, sender, app) => `Shukriya ${sender}! ${app} par ${amt} rupaye receive hue.`,
      noteTemplate: (note) => `${note}`
    }
  };

  const PERSONA_CONFIG = {
    standard: { pitch: 1.0, speedMul: 1.0, preservesPitch: true },
    esports_caster: { pitch: 1.05, speedMul: 1.20, preservesPitch: true },
    deep_bass: { pitch: 0.82, speedMul: 0.92, preservesPitch: false },
    anime: { pitch: 1.30, speedMul: 1.08, preservesPitch: false },
    cyber_robot: { pitch: 0.88, speedMul: 0.95, preservesPitch: false },
    custom: { pitch: 1.0, speedMul: 1.0, preservesPitch: false }
  };

  // Smoothly duck chime audio so speech announcement is crystal clear
  function duckChimeForVoice() {
    try {
      const vol = Math.min(1, Math.max(0, alertSettings.soundVolume !== undefined ? alertSettings.soundVolume : 0.9));
      if (customAudioEl && !customAudioEl.paused) {
        customAudioEl.volume = vol * 0.35;
      }
      if (audioEl && !audioEl.paused) {
        audioEl.volume = vol * 0.35;
      }
    } catch (_) {}
  }

  // Guaranteed Text-To-Speech for Stream Broadcasts (Uses HTML5 Audio MP3 stream first)
  function speakAnnouncement(amount, sender, appName, note) {
    if (!alertSettings.voiceEnabled) return;
    const cleanSender = (sender || 'Supporter').trim();
    const spokenApp = getSpokenAppName(appName);
    const langKey = alertSettings.voiceLanguage || 'en-IN';
    const config = REGIONAL_TEMPLATES[langKey] || REGIONAL_TEMPLATES['en-IN'];

    // Clean donor note to guarantee it NEVER speaks the literal word "note"
    const cleanNote = cleanDonorNote(note);
    let text = config.template(amount, cleanSender, spokenApp);
    if (cleanNote) {
      text += ` ${cleanNote}.`;
    }

    const personaKey = alertSettings.voicePersona || 'standard';
    const persona = PERSONA_CONFIG[personaKey] || PERSONA_CONFIG.standard;
    const userPitch = alertSettings.voicePitch !== undefined ? parseFloat(alertSettings.voicePitch) : 1.00;
    const finalPitch = personaKey === 'custom' ? userPitch : persona.pitch;
    const baseSpeed = parseFloat(alertSettings.voiceSpeed || 0.70) || 0.70;
    const finalSpeed = (baseSpeed * persona.speedMul).toFixed(2);

    duckChimeForVoice();

    try {
      ttsAudioEl.pause();
      ttsAudioEl.currentTime = 0;
      ttsAudioEl.src = `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(config.lang)}&speed=${finalSpeed}`;
      
      const targetVolume = Math.min(1, Math.max(0, alertSettings.soundVolume !== undefined ? alertSettings.soundVolume : 0.9));
      ttsAudioEl.volume = targetVolume;

      // Apply Custom Voice Pitch & Tone Modulation (Pro) or User Chosen Speed
      if (!persona.preservesPitch || personaKey === 'custom') {
        ttsAudioEl.preservesPitch = false;
        if ('mozPreservesPitch' in ttsAudioEl) ttsAudioEl.mozPreservesPitch = false;
        if ('webkitPreservesPitch' in ttsAudioEl) ttsAudioEl.webkitPreservesPitch = false;
        ttsAudioEl.playbackRate = Math.max(0.5, Math.min(2.0, finalPitch));
      } else {
        ttsAudioEl.preservesPitch = true;
        ttsAudioEl.playbackRate = Math.max(0.5, Math.min(2.0, parseFloat(finalSpeed) || 0.75));
      }

      const playPromise = ttsAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Stream Overlay] HTML5 Audio TTS failed, attempting speechSynthesis fallback:', err);
          fallbackSpeechSynthesis(text, config.lang, finalPitch, finalSpeed);
        });
      }
    } catch (err) {
      console.warn('[Stream Overlay] Audio play error, falling back:', err);
      fallbackSpeechSynthesis(text, config.lang, finalPitch, finalSpeed);
    }
  }

  function fallbackSpeechSynthesis(text, lang, pitch, rate) {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.5, Math.min(2.0, parseFloat(rate) || alertSettings.voiceSpeed || 0.75));
      utterance.pitch = Math.max(0.5, Math.min(2.0, parseFloat(pitch) || 1.0));
      utterance.lang = lang || 'en-IN';

      if (!availableVoices || availableVoices.length === 0) loadVoices();
      if (availableVoices && availableVoices.length > 0) {
        const langPrefix = (lang || 'en').toLowerCase().split('-')[0];
        const preferredVoice = availableVoices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix)) ||
                               availableVoices.find(v => v.lang && v.lang.toLowerCase().includes('en-in')) ||
                               availableVoices.find(v => v.lang && (v.lang.includes('en-GB') || v.lang.includes('en-US')));
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      let timer = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(timer);
        } else {
          window.speechSynthesis.resume();
        }
      }, 5000);

      utterance.onend = () => clearInterval(timer);
      utterance.onerror = () => clearInterval(timer);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis fallback failed:', e);
    }
  }

  function triggerVoiceAnnouncement(payment) {
    if (!alertSettings.voiceEnabled) return;
    const isOwnVoice = alertSettings.voicePersona === 'own_voice' && alertSettings.ownVoiceUrl;
    const targetVolume = Math.min(1, Math.max(0, alertSettings.soundVolume !== undefined ? alertSettings.soundVolume : 0.9));

    if (isOwnVoice) {
      const mode = alertSettings.ownVoiceMode || 'intro';
      try {
        ownVoiceAudioEl.pause();
        ownVoiceAudioEl.currentTime = 0;
        ownVoiceAudioEl.volume = targetVolume;
        ownVoiceAudioEl.src = alertSettings.ownVoiceUrl;

        if (mode === 'alert_sound' || mode === 'full') {
          const p = ownVoiceAudioEl.play();
          if (p !== undefined) {
            p.catch((err) => {
              console.warn('[Stream Overlay] Own voice playback failed, falling back to TTS:', err);
              speakAnnouncement(payment.amount, payment.senderName || 'Anonymous', payment.appName, payment.note);
            });
          }
          return;
        }

        // Mode 'intro': Streamer's own recorded voice line plays first, followed by dynamic TTS!
        let hasSpokenTts = false;
        function proceedToTts() {
          if (hasSpokenTts) return;
          hasSpokenTts = true;
          speakAnnouncement(payment.amount, payment.senderName || 'Anonymous', payment.appName, payment.note);
        }

        ownVoiceAudioEl.onended = proceedToTts;
        ownVoiceAudioEl.onerror = proceedToTts;

        const fallbackTimer = setTimeout(proceedToTts, 5000);
        const playPromise = ownVoiceAudioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            clearTimeout(fallbackTimer);
            console.warn('[Stream Overlay] Own voice audio error, invoking TTS directly:', err);
            proceedToTts();
          });
        }
      } catch (err) {
        console.warn('[Stream Overlay] Own voice playback exception:', err);
        speakAnnouncement(payment.amount, payment.senderName || 'Anonymous', payment.appName, payment.note);
      }
    } else {
      speakAnnouncement(payment.amount, payment.senderName || 'Anonymous', payment.appName, payment.note);
    }
  }

  function getThemeForApp(appName) {
    const name = (appName || '').toLowerCase();
    if (name.includes('phonepe')) {
      return { class: 'theme-phonepe', icon: '🟣', label: 'PhonePe' };
    } else if (name.includes('google') || name.includes('gpay')) {
      return { class: 'theme-gpay', icon: '🔵', label: 'Google Pay' };
    } else if (name.includes('paytm')) {
      return { class: 'theme-paytm', icon: '🔷', label: 'Paytm' };
    } else if (name.includes('bhim')) {
      return { class: 'theme-bhim', icon: '🟠', label: 'BHIM UPI' };
    } else if (name.includes('cred')) {
      return { class: 'theme-phonepe', icon: '💎', label: 'CRED' };
    }
    return { class: 'theme-default', icon: '⚡', label: appName || 'UPI Alert' };
  }

  // Main Display Function
  function processQueue() {
    if (isDisplaying || alertQueue.length === 0) return;

    isDisplaying = true;
    const payment = alertQueue.shift();

    try {
      // 1. Populate Theme & Data
      const theme = getThemeForApp(payment.appName);
      alertCard.className = 'alert-card ' + theme.class;

      appIcon.textContent = theme.icon;
      appNameEl.textContent = theme.label;

      const cleanNum = parseFloat(String(payment.amount || '0').replace(/[^0-9.]/g, '')) || 0;
      amountVal.textContent = cleanNum.toLocaleString('en-IN');
      supporterName.textContent = payment.senderName || 'Anonymous Supporter';

      const cleanNote = cleanDonorNote(payment.note);
      if (cleanNote && cleanNote.length > 0) {
        donorMessage.textContent = `"${cleanNote}"`;
        cardFooter.classList.remove('empty');
      } else {
        donorMessage.textContent = '';
        cardFooter.classList.add('empty');
      }

      // 1b. Custom Pro Media (GIF / Video Meme)
      if (customMediaWrapper) {
        const mediaUrl = alertSettings.customMediaUrl;
        const mediaType = alertSettings.customMediaType || 'image';
        if (mediaUrl) {
          if (mediaType === 'video' && customMediaVideo) {
            customMediaVideo.src = mediaUrl;
            customMediaVideo.style.display = 'block';
            if (customMediaImg) customMediaImg.style.display = 'none';
            customMediaVideo.currentTime = 0;
            customMediaVideo.play().catch(() => {});
          } else if (customMediaImg) {
            customMediaImg.src = mediaUrl;
            customMediaImg.style.display = 'block';
            if (customMediaVideo) {
              customMediaVideo.pause();
              customMediaVideo.style.display = 'none';
            }
          }
          customMediaWrapper.style.display = 'flex';
        } else {
          customMediaWrapper.style.display = 'none';
          if (customMediaVideo) customMediaVideo.pause();
        }
      }

      // 2. Play Audio Chime
      playSound();

      // 3. Spoken Announcement (Own Voice or Regional TTS)
      // Delay 1100ms allows the alert chime intro to ring clearly first before speech starts
      if (payment.shouldSpeak !== false) {
        setTimeout(() => {
          triggerVoiceAnnouncement({ ...payment, note: cleanNote });
        }, 1100);
      }

      // 4. Trigger Animations
      alertCard.classList.remove('hidden', 'exit');
      alertCard.classList.add('enter');

      progressBar.classList.remove('animate');
      void progressBar.offsetWidth;
      progressBar.classList.add('animate');

    } catch (err) {
      console.error('Error rendering alert card:', err);
    }

    // 5. Auto dismiss after alert finishes (longer if a message is being spoken)
    const isOwnVoiceActive = alertSettings.voicePersona === 'own_voice' && alertSettings.ownVoiceUrl;
    const hasLongMessage = payment.note && String(payment.note).trim().length > 25;
    const DISPLAY_DURATION_MS = isOwnVoiceActive ? 9000 : (hasLongMessage ? 8000 : 6500);

    setTimeout(() => {
      alertCard.classList.remove('enter');
      alertCard.classList.add('exit');

      setTimeout(() => {
        alertCard.classList.add('hidden');
        alertCard.classList.remove('exit');
        if (customMediaWrapper) customMediaWrapper.style.display = 'none';
        if (customMediaVideo) customMediaVideo.pause();
        isDisplaying = false;
        setTimeout(processQueue, 400);
      }, 500);
    }, DISPLAY_DURATION_MS);
  }

  function enqueueAlert(payment) {
    alertQueue.push(payment);
    processQueue();
  }

  // Robust WebSocket Connection with Stream Session
  function connectWebSocket() {
    const urlParams = new URLSearchParams(window.location.search);
    const streamId = (urlParams.get('code') || urlParams.get('stream') || urlParams.get('streamer') || 'default').toLowerCase().trim();

    let wsBase = 'ws://127.0.0.1:3333';
    try {
      const loc = window.location;
      if (loc && loc.host && loc.protocol.startsWith('http')) {
        const wsProto = loc.protocol === 'https:' ? 'wss:' : 'ws:';
        wsBase = `${wsProto}//${loc.host}`;
      }
    } catch (_) {}

    const wsUrl = `${wsBase}?code=${encodeURIComponent(streamId)}`;
    if (statusEl) {
      statusEl.style.opacity = '1';
      statusEl.textContent = 'Connecting to alert server...';
      statusEl.style.color = '#fbbf24';
    }

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (statusEl) {
          statusEl.textContent = '● Stream Overlay Live';
          statusEl.style.color = '#34d399';
          statusEl.style.opacity = '1';
          // Fade out after 3 seconds to keep streaming canvas 100% clean
          setTimeout(() => {
            if (statusEl) {
              statusEl.style.opacity = '0';
            }
          }, 3000);
        }
        console.log(`[Stream Overlay] Connected to alert stream: ${streamId}`);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'NEW_PAYMENT' && msg.data) {
            console.log('[Stream Overlay] Triggering Alert:', msg.data);
            enqueueAlert(msg.data);
          } else if (msg.type === 'SETTINGS_UPDATED' && msg.data) {
            alertSettings = { ...alertSettings, ...msg.data };
            console.log('[Stream Overlay] Settings updated:', alertSettings);
          } else if (msg.type === 'SUBSCRIPTION_UPDATED' && msg.data) {
            subscription = msg.data;
            updateWatermark();
            console.log('[Stream Overlay] Subscription updated:', subscription);
          } else if (msg.type === 'INIT' && msg.data) {
            if (msg.data.settings) {
              alertSettings = { ...alertSettings, ...msg.data.settings };
            }
            if (msg.data.subscription) {
              subscription = msg.data.subscription;
              updateWatermark();
            }
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        if (statusEl) {
          statusEl.style.opacity = '1';
          statusEl.textContent = '○ Reconnecting to server...';
          statusEl.style.color = '#f87171';
        }
        clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(connectWebSocket, 2500);
      };

      ws.onerror = (err) => {
        console.error('[Stream Overlay] WebSocket error:', err);
        ws.close();
      };
    } catch (e) {
      console.error('[Stream Overlay] Failed to create WebSocket:', e);
      clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(connectWebSocket, 3000);
    }
  }

  window.addEventListener('click', initAudio);
  window.addEventListener('keydown', initAudio);

  connectWebSocket();
})();
