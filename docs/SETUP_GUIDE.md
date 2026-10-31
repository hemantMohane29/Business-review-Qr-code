# Complete Integration Guide
## QR Code → Star Rating → AI Review → Google Business Page

```
Customer scans QR / taps NFC
        ↓
Your hosted web app (index.html)
        ↓
Customer taps stars (1–5)
        ↓
4–5 ★: Selects keywords → Gemini AI generates SEO review → Copy & redirects to Google
1–3 ★: Private form → Email sent to management
```

---

## STEP 1 — Get Your Google Review Link (5 min)

1. Go to → https://business.google.com
2. Sign in with the Google account that owns your business
3. Click your business listing
4. In the left sidebar click **"Ask for reviews"** (or "Get more reviews")
5. A popup shows your review link — looks like:
   ```
   https://g.page/r/CbXXXXXXXXXXXXXX/review
   ```
6. Copy it — this is your `GOOGLE_REVIEW_URL`

> ⚠️ If you don't see "Ask for reviews", your Business Profile may not be verified yet.
> Go to https://business.google.com and click "Verify now" first.

---

## STEP 2 — Get a Free Gemini API Key (3 min)

1. Go to → https://aistudio.google.com/app/apikey
2. Sign in with any Google account
3. Click **"Create API key"**
4. Select **"Create API key in new project"**
5. Copy the key — starts with `AIza...`
6. This is your `GEMINI_API_KEY`

> Free tier: 15 requests/minute, 1500/day — more than enough for a standee.

---

## STEP 3 — Configure the App (2 min)

Open `app.js` and update `DEFAULT_CONFIG` at the top:

```js
const DEFAULT_CONFIG = {
  businessName:    "Vyanjan Hotel, Restaurant & Bar",
  googleReviewUrl: "https://g.page/r/Cfsfk--zROquEBE/review",
  feedbackEmail:   "manager@hotelvyanjan.com",
  managerPhone:    "+919424099476",
  geminiApiKey:    "YOUR_GEMINI_API_KEY_HERE",
  businessType:    "restaurant",
};
```

`businessType` examples: `"restaurant"`, `"hair salon"`, `"dental clinic"`, `"gym"`, `"hotel"`, `"retail store"`

---

## STEP 4 — Deploy to Vercel (Free, 3 min)

Vercel hosts static sites for free forever with HTTPS (required for clipboard to work on phones).

### Option A — Vercel via Browser (no coding needed)

1. Go to → https://vercel.com → Sign up free with GitHub/Google
2. Click **"Add New Project"**
3. Click **"Upload"** (bottom of page)
4. Drag your 4 files into the upload box:
   - `index.html`
   - `styles.css`
   - `app.js`
   - (README optional)
5. Click **Deploy**
6. Your live URL appears: `https://your-app-name.vercel.app`

### Option B — Vercel CLI

```bash
npm install -g vercel
cd "Business Review QR"
vercel
# Follow prompts → get your URL
```

### Option C — Netlify Drop (even simpler)

1. Go to → https://app.netlify.com/drop
2. Drag your project folder onto the page
3. Done — instant HTTPS URL

> **Why HTTPS matters:** The clipboard API (`navigator.clipboard`) only works on HTTPS.
> Without it, the copy button silently falls back to legacy method which may not work on all phones.

---

## STEP 5 — Generate Your QR Code (5 min)

### Free Online (recommended for testing)
1. Go to → https://www.qr-code-generator.com  OR  https://www.qrcode-monkey.com
2. Paste your Vercel URL (e.g. `https://your-app.vercel.app`)
3. Customise: add your logo, brand colors
4. **Download as SVG** (vector — scales to any print size without blurring)

### For Print (high quality)
- Minimum size on standee: **3 × 3 cm**
- Recommended: **5 × 5 cm** for easy phone scanning
- Add quiet zone (white border) of at least 4 modules around the code
- Test: scan with both iOS Camera app and Android Google Lens before printing

### Dynamic QR Code (trackable scans)
Use Bitly or QR Code Generator Pro for scan analytics:
1. Create a short link at https://bitly.com pointing to your Vercel URL
2. Use the Bitly URL in your QR code
3. See scan counts in the Bitly dashboard

---

## STEP 6 — Program NFC Chip (10 min)

### What to buy
- **NTAG213** stickers — cheapest, holds 137 bytes (URL fits fine)
- **NTAG215** — larger memory, works great too  
- Search Amazon: "NFC stickers NTAG213" — pack of 10 ~$8–12

### How to write the URL
**iOS:**
1. Download **NFC Tools** (free) from App Store
2. Open app → Tap **Write** → **Add a record** → **URL/URI**
3. Type your full URL: `https://your-app.vercel.app`
4. Tap **Write** → hold phone flat on the sticker for 1–2 seconds
5. ✅ "Tag written successfully"

**Android:**
1. Download **NFC Tools** from Play Store (same app)
2. Same steps above

### Test it
- Hold your phone (NFC area = center/top-back) over the sticker
- iOS: tap the banner notification → opens Safari
- Android: tap the notification → opens Chrome

---

## STEP 7 — Multi-Location Setup (optional)

If you have multiple branches, use URL parameters so one app handles all locations:

In `app.js`, add each branch to `LOCATIONS`:

```js
const LOCATIONS = {
  downtown: {
    businessName:    "Joe's Coffee — Downtown",
    googleReviewUrl: "https://g.page/r/DOWNTOWN_ID/review",
    feedbackEmail:   "downtown@joescoffee.com",
    businessType:    "coffee shop",
  },
  airport: {
    businessName:    "Joe's Coffee — Airport",
    googleReviewUrl: "https://g.page/r/AIRPORT_ID/review",
    feedbackEmail:   "airport@joescoffee.com",
    businessType:    "coffee shop",
  },
};
```

Then each location's QR code points to a different URL:
- Downtown standee QR → `https://your-app.vercel.app/?loc=downtown`
- Airport standee QR  → `https://your-app.vercel.app/?loc=airport`

Same hosted app, different configs per scan.

---

## STEP 8 — Assemble the Standee

### Print specs
| Element        | Spec |
|---------------|------|
| Material      | 5mm clear acrylic OR 3mm rigid PVC |
| Size          | A5 (148×210mm) or 10×15cm landscape |
| Resolution    | 300 DPI minimum for sharp print |
| QR code size  | 5×5cm minimum |
| NFC zone      | Mark with "Tap Here" text or icon |

### Design must include
1. Your business logo (top center)
2. Headline: **"Tap or Scan to Leave a Review"**
3. QR code (center or bottom)
4. Google logo + "Google Reviews" text
5. "Tap Here →" indicator pointing to where NFC sticker is

### Assembly
1. Print design on acrylic/PVC (local print shop or Vistaprint)
2. Peel NFC sticker and place it on the **back** of the standee behind the "Tap Here" zone
3. Test NFC tap distance — works through 3–5mm acrylic fine

---

## Full Flow — What Happens When a Customer Scans

```
1. Customer scans QR code or taps NFC chip on standee
        ↓
2. Phone opens: https://your-app.vercel.app
        ↓
3. Screen 1: Star rating appears
   - Customer taps 1–5 stars
   - Taps "Continue"
        ↓
4a. If 4 or 5 stars:
   - Screen 2: Keyword chips appear
   - Customer selects what they liked (Fast Service, Friendly Staff, etc.)
   - Taps "Generate AI Review"
   - Gemini API writes a personalised SEO review in ~1 second
   - Review appears — customer can regenerate if they want
   - Customer taps "Copy & Post on Google"
   - Review is copied to clipboard
   - Browser redirects to: https://g.page/r/YOUR_ID/review
   - Google review popup opens with the text box ready to paste
        ↓
4b. If 1, 2, or 3 stars:
   - Screen 3: Private feedback form
   - Customer types what went wrong (optional name/contact)
   - Taps "Send to Management"
   - Email opens addressed to management@yourbusiness.com
   - Customer sends → management gets notified privately
        ↓
5. Thank you screen shown
   - Positive: confetti animation, stars shown
   - Negative: reassurance message
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Copy" doesn't work on phone | Must be on HTTPS (use Vercel/Netlify, not file://) |
| QR code doesn't scan | Make it larger (5×5cm min), add white border |
| NFC doesn't trigger | Check NFC is on in phone settings; hold flat for 2 sec |
| Gemini returns empty | Check API key in `app.js`; check quota at aistudio.google.com |
| Google review URL wrong | Re-copy from business.google.com → Ask for reviews |
| Email doesn't open | Replace `mailto:` with Formspree: https://formspree.io (free 50/mo) |

---

## Formspree Setup (replaces mailto, works without email client)

1. Go to → https://formspree.io → create free account
2. Click **New Form** → name it "Customer Feedback"  
3. Copy your form endpoint: `https://formspree.io/f/XXXXXXXX`
4. In `app.js`, replace the mailto block in the feedback submit handler:

```js
// Replace the mailto block with:
const res = await fetch("https://formspree.io/f/XXXXXXXX", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, contact, message, rating: currentRating })
});
if (res.ok) showThanks(false);
```

Now feedback arrives as an email to your inbox directly from the web — no email client needed on the customer's phone. 
