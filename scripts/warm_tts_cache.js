const http = require('http');

const phrases = [
  // English
  { text: "Welcome to SRB STUDIOS StreamAlerts! The revolutionary zero-commission live UPI donation platform built for Indian creators.", lang: "en-IN" },
  { text: "Setting up your live overlay is effortless. Simply copy your browser source URL into your broadcast studio. The canvas stays completely transparent until someone donates.", lang: "en-IN" },
  { text: "When a viewer scans your QR code and pays using PhonePe, Google Pay, or Paytm, the Android app captures the notification locally on your phone and sends it in milliseconds.", lang: "en-IN" },
  { text: "The alert card pops up on stream featuring the donor's name, donation amount, and message, announced instantly in your chosen Indian regional language.", lang: "en-IN" },
  { text: "With the Creator Pro Own Voice Studio, you can record or upload your own real voice to personally shout out donors on stream!", lang: "en-IN" },
  { text: "Ready to go live with donation alerts? Create your free streamer account, download the Android app, add your browser overlay, and start receiving direct-to-bank UPI alerts on your very next live stream!", lang: "en-IN" },
  
  // Malayalam
  { text: "SRB STUDIOS StreamAlerts-ലേക്ക് സ്വാഗതം! ഇന്ത്യൻ ലൈവ് സ്ട്രീമർമാർക്കായി നിർമ്മിച്ച 0% കമ്മീഷൻ യു.പി.ഐ ഡൊണേഷൻ അലർട്ട് പ്ലാറ്റ്‌ഫോം.", lang: "ml" },
  { text: "ലൈവ് ഓവർലേ സജ്ജീകരിക്കുന്നത് വളരെ എളുപ്പമാണ്. നിങ്ങളുടെ ബ്രൗസർ ലിങ്ക് ബ്രോഡ്‌കാസ്റ്റ് സ്റ്റുഡിയോയിൽ പേസ്റ്റ് ചെയ്യുക. ആരെങ്കിലും സംഭാവന നൽകുന്നതുവരെ സ്ക്രീൻ പൂർണ്ണമായും സുതാര്യമായിരിക്കും.", lang: "ml" },
  { text: "ഒരു കാഴ്ചക്കാരൻ നിങ്ങളുടെ QR കോഡ് സ്കാൻ ചെയ്ത് PhonePe അല്ലെങ്കിൽ GPay വഴി പണം അയക്കുമ്പോൾ, ഫോൺ ഉടൻ തന്നെ അറിയിപ്പ് സ്വീകരിച്ച് തത്സമയം അലർട്ട് അയക്കുന്നു.", lang: "ml" },
  { text: "സംഭാവന നൽകിയ ആളുടെ പേര്, തുക, സന്ദേശം എന്നിവയോടെ അലർട്ട് സ്ക്രീനിൽ പ്രത്യക്ഷപ്പെടുകയും, നിങ്ങൾ തിരഞ്ഞെടുത്ത പ്രാദേശിക ഭാഷയിൽ ശബ്ദത്തിൽ പ്രഖ്യാപിക്കുകയും ചെയ്യുന്നു.", lang: "ml" },
  { text: "ക്രിയേറ്റർ പ്രോയിലൂടെ നിങ്ങളുടെ സ്വന്തം ശബ്ദം റെക്കോർഡ് ചെയ്യുകയോ അപ്‌ലോഡ് ചെയ്യുകയോ ചെയ്ത്, സ്ട്രീമിൽ നേരിട്ട് നന്ദി അറിയിക്കാം!", lang: "ml" },
  { text: "ഡൊണേഷൻ അലർട്ടുകളോടെ ലൈവ് പോകാൻ തയ്യാറാണോ? ഇപ്പോൾ തന്നെ സൗജന്യമായി സൈൻ അപ്പ് ചെയ്ത്, ആൻഡ്രോയിഡ് ആപ്പ് ഡൗൺലോഡ് ചെയ്ത് നിങ്ങളുടെ അടുത്ത സ്ട്രീമിൽ തന്നെ യു.പി.ഐ അലർട്ടുകൾ നേടൂ!", lang: "ml" },

  // Tamil
  { text: "SRB STUDIOS StreamAlerts-க்கு வரவேற்கிறோம்! இந்திய ஸ்ட்ரீமர்களுக்கான 0% கமிஷன் UPI லைவ் டொனேஷன் தளம்.", lang: "ta" },
  { text: "லைவ் ஓவர்லே அமைப்பது மிகவும் எளிது. உங்கள் பிரவுசர் லிங்கை உங்கள் பிராட்காஸ்டில் பேஸ்ட் செய்யுங்கள். ஸ்க்ரீன் முற்றிலும் தெளிவாக இருக்கும்.", lang: "ta" },

  // Hindi
  { text: "SRB STUDIOS StreamAlerts में आपका स्वागत है! भारतीय लाइव स्ट्रीमर्स के लिए 0% कमीशन UPI डोनेशन अलर्ट प्लेटफॉर्म।", lang: "hi" },
  { text: "लाइव ओवरले सेटअप बहुत आसान है। बस अपना ब्राउज़र सोर्स यूआरएल कॉपी करें और अपने ब्रॉडकास्ट में पेस्ट करें। स्क्रीन पूरी तरह ट्रांसपेरेंट रहती है।", lang: "hi" }
];

async function warmCache() {
  console.log('⚡ Pre-warming server TTS cache for instant playback...');
  for (const item of phrases) {
    await new Promise((resolve) => {
      const url = `http://localhost:3333/api/tts?text=${encodeURIComponent(item.text)}&lang=${encodeURIComponent(item.lang)}&speed=0.92`;
      http.get(url, res => {
        let size = 0;
        res.on('data', c => size += c.length);
        res.on('end', () => {
          console.log(` ✓ Cached [${item.lang}] (${size} bytes)`);
          resolve();
        });
      }).on('error', err => {
        console.error('Err caching:', err.message);
        resolve();
      });
    });
  }
  console.log('✅ All audio cache pre-warmed successfully!');
}

warmCache();
