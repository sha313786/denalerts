# 🔴 Live UPI Stream Alerts & Dedicated Streamer App

A dedicated real-time bridge connecting incoming UPI payment notifications (Google Pay, PhonePe, Paytm, BHIM) to an animated OBS overlay and interactive broadcast dashboard.

---

## 🚀 Quick Access

| Component | URL / Path | Description |
| :--- | :--- | :--- |
| **Control Dashboard** | [http://localhost:3333/dashboard](http://localhost:3333/dashboard) | Live metrics, test triggers, audit log |
| **OBS Overlay** | [http://localhost:3333/overlay](http://localhost:3333/overlay) | Transparent browser source for OBS (`1920x1080`) |
| **Download Android App** | [http://192.168.1.11:3333/StreamAlerts.apk](http://192.168.1.11:3333/StreamAlerts.apk) | Direct APK download to your phone |
| **Local APK File** | [`StreamAlerts.apk`](file:///C:/Users/SRB%20TrollersYT/.gemini/antigravity/scratch/live-upi-alerts/StreamAlerts.apk) | Local APK file on PC |

---

## 🔒 100% Business & Stream Separation

Your CSC business app (**Digital Den / UPISoundbox**) remains untouched. This new **StreamAlerts** app:
* Has a **🔴 Live Stream Mode Toggle Switch**:
  * **When ON (Streaming):** Forwards incoming donations to OBS.
  * **When OFF (Default):** Completely ignores notifications. Your personal and business finances remain completely private.
* Lets you select which apps to listen to (e.g., only Personal GPay, unchecking business apps).
* Lets you test the connection to your PC with one tap.

---

## 🎥 OBS Studio Setup

1. In OBS Studio, add a new **Browser** Source named **`UPI Alerts`**.
2. Set **URL**: `http://localhost:3333/overlay`
3. Set **Width**: `1920`, **Height**: `1080`.
4. Click **OK**.
5. Test it using the **"🚀 Fire Test Alert to OBS"** button on the [Dashboard](http://localhost:3333/dashboard) or directly from your phone app!
