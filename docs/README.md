# SmartReview AI — AI-Powered Google Review Standee & Smart Funnel

> Built to replicate and exceed **"India's 1st AI-Powered Google Review Standee"** as seen in the viral SmartyD product showcase.

Combines a **physical NFC/QR acrylic counter standee** with a **smart web app funnel** that eliminates review writing friction and safeguards your business reputation.

---

## 🌟 How the Complete System Works

```
                     ┌──────────────────────────────────┐
                     │   PHYSICAL ACRYLIC STANDEE      │
                     │  (Counter / Reception / Billing) │
                     │   [NFC Tap]  or  [Scan QR Code]  │
                     └────────────────┬─────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   Customer Rates Visit    │
                        │      (1 to 5 Stars)       │
                        └─────────────┬─────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               │                                             │
               ▼ (4 or 5 Stars)                              ▼ (1, 2, or 3 Stars)
┌──────────────────────────────┐              ┌──────────────────────────────┐
│     AI REVIEW STUDIO         │              │   PRIVATE RESOLUTION SHIELD  │
│ • Category-tailored chips    │              │ • Never posted on Google!    │
│ • Tone & Language selection  │              │ • Direct alert to Manager    │
│ • Gemini AI instant draft    │              │   via WhatsApp & Email       │
│ • 1-Tap "Copy & Open Google" │              │ • Manager's Goodwill Gift    │
│ • Direct Google Map review   │              │   voucher (e.g. 15% off)     │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 🚀 Key Features

### 1. 📱 Customer Review Funnel (Mobile-First)
- **Zero App Download**: Opens instantly in mobile Safari / Chrome on any iOS or Android device.
- **Micro-Animations & Haptic Feedback**: Dynamic glowing stars and confetti celebrations on 5-star ratings.
- **Smart Category Adaptation**: Tailored chips for:
  - ☕ Cafes & Bakeries
  - 🍽️ Restaurants & Dining
  - ✂️ Salons, Barbers & Spas
  - 🩺 Healthcare & Dental Clinics
  - 🏋️ Gyms & Fitness Centers
  - 🛍️ Retail & Boutiques
  - 🏨 Hotels & Hospitality
  - 🚗 Automotive & Garages
  - 💼 Professional Local Services
- **AI Tone Selector**: Switch between *Enthusiastic*, *Natural & Punchy*, *Short & Crisp (20-30 words)*, and *Professional*.
- **Language Support**: English, Urban Indian **Hinglish/Hindi** (as featured in the viral video), Spanish, French.
- **Dual AI Engine**:
  - Connects with **Google Gemini 2.0 / 2.5 Flash** for real-time generative reviews.
  - Built-in **Offline Smart Synthesizer** with 50+ rich permutations that works out of the box with zero setup or API keys!
- **Editable Draft**: Customers can tweak words, add personal names, and adjust text before submitting.
- **1-Tap Deep-Link Launch**: Copies text to clipboard and opens your direct Google Review dialog in under 1 second.

### 2. 🛡️ Private Resolution Shield (Negative Review Protection)
- Safeguards your Google Maps star rating by diverting dissatisfied customers (1–3 stars) away from public review sites.
- Captures the exact issue (Wait Time, Service, Quality, Cleanliness, Billing, Other).
- **Direct Manager WhatsApp Alert**: One click opens WhatsApp with a pre-formatted complaint summary so management can resolve issues immediately before the customer leaves!
- **Goodwill Voucher**: Automatically generates an apology discount code (e.g., `CARE15`) for customer retention.

### 3. 🪧 Standee Studio & Print Designer
- **Interactive 3D Acrylic Standee Preview**:
  - Realistic cast acrylic finish with edge bevels, glossy reflections, and stand base mockup.
  - 4 Premium Finishes: **Obsidian Gold** (Matte Black & Gold), **Crystal Clear** (Glass & Chrome), **Modern White** (Clean Minimalist), **Google Classic Navy**.
  - Standard Desk Sizes: **4"×6" (Desk)**, **5"×7" (Counter)**, **A6 Standard**.
- **Dynamic Scannable QR Code**: Automatically encodes your review funnel URL with center Google branding.
- **Print Artwork Export**:
  - 📥 **Download Standee (High-Res PNG)**: 300 DPI print-ready image.
  - 🖨️ **Print Ready Standee Layout**: Formatted print preview with crop marks for local acrylic cutting and UV flatbed printing.
  - 📲 **Download QR Code Only**: Standalone vector-sharp QR image.

### 4. ⚙️ Business Dashboard & Analytics
- Live metrics: **Total Scans / Taps**, **5-Star AI Reviews Sent**, **Negative Reviews Shielded**.
- Multi-branch URL support via query parameters (`?biz=My+Store&cat=cafe`).
- 100% self-contained: Includes local versions of `qrcode.min.js`, `confetti.min.js`, and `html2canvas.min.js`.

---

## 🛠️ Step-by-Step Setup Guide

### Step 1: Run Locally or Deploy
To view locally:
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

To deploy for free forever (HTTPS required for phone clipboard):
- **Vercel**: Run `npx vercel` or drag-and-drop the folder on [vercel.com](https://vercel.com).
- **Netlify**: Drag-and-drop the folder on [netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages**: Push to repository and enable GitHub Pages in settings.

### Step 2: Configure Business Settings
Open the **Business Config** tab in the app:
1. **Business Name**: Your store / company name.
2. **Business Category**: Select your industry (Cafe, Salon, Restaurant, etc.).
3. **Google Review Direct URL**:
   - Go to [business.google.com](https://business.google.com)
   - Click your business &rarr; **"Ask for reviews"** (or "Get more reviews")
   - Copy your short URL (e.g., `https://g.page/r/YOUR_ID/review`)
4. **Manager WhatsApp & Email**: Where negative reviews will be delivered.
5. **Gemini API Key (Optional)**: Get a free key from [aistudio.google.com](https://aistudio.google.com/app/apikey). If left blank, the built-in smart engine runs automatically!
6. Click **Save All Settings**.

### Step 3: Program the NFC Chip (30 Seconds)
1. Purchase **NTAG213** or **NTAG215** coin stickers (approx. $0.30 / ₹25 on Amazon or IndiaMART).
2. Download the free **NFC Tools** app on iOS or Android.
3. Open NFC Tools &rarr; tap **Write** &rarr; **Add a record** &rarr; **URL / URI**.
4. Paste your deployed live URL (from Step 1) and tap **Write**.
5. Tap your phone against the NFC coin sticker — programmed!

### Step 4: Manufacture the Acrylic Standee
1. Open the **Standee Studio** tab in this web app.
2. Choose your preferred finish (**Obsidian Gold**, **Crystal Clear**, **Modern White**, etc.).
3. Click **Download Standee (PNG)** or **Print Ready Standee Layout**.
4. Hand this artwork to any local acrylic cutting / UV signage shop:
   - Specification: **3mm or 5mm Cast Acrylic** with **UV direct printing**.
   - Base: Slotted acrylic L-stand or wooden block.
5. Peel and stick your programmed NFC tag on the back of the acrylic directly behind the **"TAP PHONE HERE"** zone.
6. Place on your counter desk and watch your 5-star Google reviews grow!
